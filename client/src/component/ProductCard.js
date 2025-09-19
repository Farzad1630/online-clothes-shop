import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faCartPlus as faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../Context/CartContext';
import { FavoritesContext } from '../Context/FavoritesContext';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { motion, useReducedMotion } from 'framer-motion';

const customStyles = {
  control: (base, state) => ({
    ...base,
    textAlign: 'center',
    backgroundColor: '#FAF3E0',
    borderColor: state.isFocused ? '#001f3f' : '#ccc',
    boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0, 31, 63, 0.25)' : null,
    '&:hover': {
      borderColor: '#001f3f',
    },
  }),
  singleValue: (base) => ({
    ...base,
    textAlign: 'center',
    color: '#001f3f',
  }),
  option: (base, state) => ({
    ...base,
    textAlign: 'center',
    backgroundColor: state.isFocused ? '#f0e3c4' : '#FAF3E0',
    color: '#001f3f',
    '&:active': {
      backgroundColor: '#f5e3b3',
    },
  }),
  menu: (base) => ({
    ...base,
    textAlign: 'center',
    backgroundColor: '#FAF3E0',
    border: '1px solid #001f3f',
    zIndex: 9999,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'max-content',
    minWidth: '100%',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const ProductCard = ({ product }) => {
  const { addToCart, triggerCartAnimation } = useContext(CartContext);
  const { addToFavorites, favorites } = useContext(FavoritesContext);
  const numericPrice = Number(product.price.replace(/,/g, ''));

  const firstAvailableSize = product.sizes?.find(s => s.stock > 0)?.size || '';
  const [selectedSize, setSelectedSize] = useState(firstAvailableSize);

  const prefersReduced = useReducedMotion();

  const hoverProps =
    !prefersReduced
      ? { whileHover: { scale: 1.03, boxShadow: '0 6px 12px rgba(0,0,0,0.15)' }, transition: { type: 'spring', stiffness: 300 } }
      : {};

  return (
    <motion.div
      {...hoverProps}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="card h-100 text-center shadow-sm d-flex flex-column justify-content-between"
      style={{
        backgroundColor: '#FAF3E0',
        boxShadow: '0 4px 6px rgba(200, 180, 150, 1)',
      }}
    >
      {product.discountPercent > 0 && (
        <span className="position-absolute top-0 start-0 text-white px-2 py-1 rounded-end discount-ribbon">
          {product.discountPercent}٪ تخفیف
        </span>
      )}

      <img
        src={product.image}
        alt={product.name}
        className="card-img-top"
        style={{ height: '200px', objectFit: 'cover' }}
      />

      <div className="card-body d-flex flex-column justify-content-between">
        <h5 className="card-title">{product.name}</h5>

        {product.discountPercent > 0 ? (
          <div>
            <span className="text-muted text-decoration-line-through me-2">
              {numericPrice.toLocaleString()} تومان
            </span><br />
            <span className="text-success fw-bold">
              {(numericPrice * (1 - product.discountPercent / 100)).toLocaleString()} تومان
            </span>
          </div>
        ) : (
          <p className="text-muted">{numericPrice.toLocaleString()} تومان</p>
        )}

        {product.sizes && (
          <div className="my-2">
            <label className="form-label" >سایز:</label>
            <Select
              options={product.sizes.map(size => ({
                value: size.size,
                label: `${size.size}${size.stock === 0 ? ' (ناموجود)' : ''}`,
                isDisabled: size.stock === 0,
              }))}
              value={{ value: selectedSize, label: selectedSize }}
              onChange={(selectedOption) => setSelectedSize(selectedOption.value)}
              menuPortalTarget={typeof window !== "undefined" ? document.body : null}
              menuPosition="fixed"
              styles={customStyles}
            />
          </div>
        )}

        <div className="d-flex justify-content-center gap-2 mt-3">
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              const exists = favorites.some(
                (item) => item.id === product.id && item.selectedSize === selectedSize
              );
              if (exists) {
                toast.warning("این محصول با این سایز قبلاً در علاقه‌مندی‌ها هست");
                return;
              }

              addToFavorites({ ...product, selectedSize });
              toast.info("محصول به لیست علاقه‌مندی اضافه شد");
            }}
          >
            <FontAwesomeIcon icon={faHeartRegular} />
          </button>

          <button className="btn btn-dark" onClick={() => {
            if (!selectedSize) {
              toast.error("لطفاً یک سایز انتخاب کنید");
              return;
            }

            const selectedSizeObj = product.sizes.find(s => s.size === selectedSize);
            if (!selectedSizeObj || selectedSizeObj.stock === 0) {
              toast.error("موجودی این سایز تمام شده است");
              return;
            }

            addToCart(product, selectedSize);
            triggerCartAnimation();
            toast.success("محصول به سبد خرید اضافه شد");
          }}>
            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
            افزودن به سبد
          </button>
        </div>
      </div>

    </motion.div>
  );
};

export default ProductCard;
