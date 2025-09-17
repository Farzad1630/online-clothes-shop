import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBars } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { CartContext } from '../Context/CartContext';
import { FavoritesContext } from '../Context/FavoritesContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);

  const { cartItems, cartAnimate } = useContext(CartContext);
  const { favorites, favoriteAnimate } = useContext(FavoritesContext);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const favoritesCount = favorites.length;

  return (
    <>
      <div style={{ height: '30px' }}></div>

      <nav
        className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom"
        style={{
          backgroundColor: '#FAF3E0',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1100
        }}
      >
        <div className="d-flex gap-3 position-relative">
          <motion.div
            animate={favoriteAnimate ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Link to="/wishlist" className="text-danger position-relative">
              <FontAwesomeIcon icon={faHeartRegular} size="lg" />
              {favoritesCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {favoritesCount}
                </span>
              )}
            </Link>
          </motion.div>

          <motion.div
            animate={cartAnimate ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Link to="/card" className="text-dark position-relative">
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </Link>
          </motion.div>
        </div>

        <div>
          <Link to="/" className="colorClass fw-bold fs-4 text-decoration-none">
            ASA
          </Link>
        </div>

        <div className="d-flex gap-3">
          <button className="btn p-0 border-0 bg-transparent" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </div>
      </nav>

      {/* سایدبار */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              className="position-fixed top-0 start-0 w-100 h-100"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
                zIndex: 1040
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
            />

            <motion.div
              className="position-fixed top-0 end-0 h-100 p-4"
              style={{ width: '250px', backgroundColor: '#FAF3E0', zIndex: 1050 }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ height: '20px' }}></div>
              <button onClick={toggleSidebar} className="btn btn-sm btn-danger m-3 ms-auto d-block">-</button>
              <ul className="list-unstyled text-end pe-3">
                <li onClick={closeSidebar}><Link to="/" className="d-block py-2 text-dark text-decoration-none"><b>محصولات</b></Link></li>
                <li onClick={closeSidebar}><span className="fw-bold d-block pt-3">دسته‌بندی‌ها</span></li>
                <ul className="list-unstyled pe-3">
                  <li onClick={closeSidebar}><Link to="/?category=کفش" className="btn btn-link p-0 text-secondary text-decoration-none">کفش</Link></li>
                  <li onClick={closeSidebar}><Link to="/?category=لباس" className="btn btn-link p-0 text-secondary text-decoration-none">لباس</Link></li>
                  <li onClick={closeSidebar}><Link to="/?category=کیف" className="btn btn-link p-0 text-secondary text-decoration-none">کیف</Link></li>
                </ul>
                <li onClick={closeSidebar}><Link to="/wishlist" className="d-block py-2 text-dark text-decoration-none"><b>علاقه‌مندی‌ها</b></Link></li>
                <li onClick={closeSidebar}><Link to="/card" className="d-block py-2 text-dark text-decoration-none"><b>سبد خرید</b></Link></li>
                <li onClick={closeSidebar}><Link to="/login" className="d-block py-2 text-dark text-decoration-none"><b>ورود</b></Link></li>
                <li onClick={closeSidebar}><Link to="/register" className="d-block py-2 text-dark text-decoration-none"><b>ثبت نام</b></Link></li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
