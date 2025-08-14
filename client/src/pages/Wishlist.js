// src/pages/Wishlist.js
import React, { useContext } from 'react';
import { FavoritesContext } from '../Context/FavoritesContext';
import ProductCard from '../component/ProductCard';
import { CartContext } from '../Context/CartContext';

const Wishlist = () => {
  const { favorites, removeFromFavorites } = useContext(FavoritesContext);
    const { addToCart } = useContext(CartContext);
  

  return (
    <div className='row text-center'>
      <h2 className='m-2'>❤️ علاقه‌مندی‌ها</h2>
      {favorites.length === 0 ? (
        <div>
          <p className='m-2' style={{
              fontFamily: "'Vazirmatn', sans-serif",
              fontSize: '1.4rem',
              color: '#2c2c2c',
              lineHeight: '2rem'
          }}>لیست علاقه‌مندی‌هات هنوز خالیه</p>
          <p className='m-2'style={{
              fontFamily: "'Vazirmatn', sans-serif",
              fontSize: '1.4rem',
              color: '#2c2c2c',
              lineHeight: '2rem'
          }}>!همین حالا محصولاتی که چشمتو گرفت رو به این لیست اضافه کن تا هر وقت خواستی راحت پیداشون کنی</p>
        </div>
      ) : (
        favorites.map((item) => (
          <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 text-center shadow-sm d-flex flex-column justify-content-between"
              style={{
                backgroundColor: 'rgba(255, 253, 208, .7)',
                boxShadow: '0 4px 6px rgba(200, 180, 150, 1)'
              }}
            >
                {item.discountPercent >0 && (
                    <span className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 rounded-end discount-ribbon">
                        {item.discountPercent}٪ تخفیف
                    </span>
                )}
              <img
                src={item.image}
                alt={item.name}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">{item.name}</h5>
                <p className="text-muted">
                    {item.discountPercent > 0 ? (
                        <>
                        <span className="text-decoration-line-through me-2">
                            {Number(item.price.replace(/,/g, '')).toLocaleString()} تومان
                        </span><br />
                        <span className="text-success fw-bold">
                            {(Number(item.price.replace(/,/g, '')) * (1 - item.discountPercent / 100)).toLocaleString()} تومان
                        </span>
                        </>
                    ) : (
                        <>{Number(item.price.replace(/,/g, '')).toLocaleString()} تومان</>
                    )}
                    </p>
                {item.selectedSize && (
                <p className="text-info">سایز: {item.selectedSize}</p>
                )}



                <div className="d-flex justify-content-center align-items-center gap-2">
                    <button className="btn btn-outline-danger" onClick={() => removeFromFavorites(item.id, item.selectedSize)}>
                    -
                    </button>
                    <button className="btn btn-outline-success" onClick={() => addToCart(item)}>
                        افزودن به سبد
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;


