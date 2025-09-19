import React, { useContext, useState } from 'react';
import { CartContext } from '../Context/CartContext';
import { toast } from 'react-toastify';

const Card = () => {
  const { cartItems, increaseQuantity, decreaseQuantity } = useContext(CartContext);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // محاسبه مجموع قیمت
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = Number(item.price.replace(/,/g, ''));
    const finalPrice = item.discountPercent > 0
      ? price * (1 - item.discountPercent / 100)
      : price;
    return sum + finalPrice * item.quantity;
  }, 0);

  // قیمت بعد از تخفیف
  const finalTotal = totalPrice * (1 - discountPercent / 100);

  // بررسی کد تخفیف
  const applyDiscount = () => {
    if (discountCode === 'Farzad') {
      setDiscountPercent(10);
      toast.success('کد تخفیف ۱۰٪ اعمال شد');
    } else if (discountCode === 'FFFF') {
      setDiscountPercent(20);
      toast.success('کد تخفیف ۲۰٪ اعمال شد');
    } else {
      setDiscountPercent(0);
      toast.error('کد تخفیف معتبر نیست');
    }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-4 text-center" style={{fontFamily:"Amiri"}}>🛒 سبد خرید</h3>

      {cartItems.length === 0 ? (
        <p className="text-center" style={{
          fontFamily: "Amiri",
          fontSize: '1rem',
          color: '#2c2c2c',
          lineHeight: '2rem'
              }}>سبد خریدت الان خالیه، ولی همین حالا می‌تونی بهترین‌ها رو برای خودت انتخاب کنی<br></br>
            ما اینجاییم تا با کلی پیشنهاد جذاب، لبخند رو بهت هدیه بدیم</p>
      ) : (
        <>
          <div className="row text-center">
            {cartItems.map((item) => (
              <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <div 
                  className="card h-100 text-center shadow-sm d-flex flex-column justify-content-between"
                  style={{
                    backgroundColor: 'rgba(255, 253, 208, .7)',
                    boxShadow: '0 4px 6px rgba(200, 180, 150, 1)'
                  }}
                >
                  {item.discountPercent > 0 && (
                    <span     
                      className="position-absolute top-0 start-0 text-white px-2 py-1 rounded-end discount-ribbon"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {item.discountPercent}٪ تخفیف
                    </span>
                  )}

                  <img
                    src={item.image}
                    alt={item.name}
                    className="card-img-top"
                    style={{
                      height: '200px',
                      objectFit: 'cover',
                      borderBottom: '1px solid rgba(0,0,0,0.1)',
                    }}
                  />

                  <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="card-title">{item.name}</h5>
                    {item.selectedSize && (
                      <p className="text-info">سایز: {item.selectedSize}</p>
                    )}

                    <p className="text-muted mb-2">
                      {item.discountPercent > 0 ? (
                        <>
                          <span className="text-decoration-line-through me-2">
                            {Number(item.price.replace(/,/g, '')).toLocaleString()} تومان
                          </span>
                          <br />
                          <span className="text-success fw-bold">
                            {(Number(item.price.replace(/,/g, '')) *
                              (1 - item.discountPercent / 100)
                            ).toLocaleString()} تومان
                          </span>
                        </>
                      ) : (
                        <>{Number(item.price.replace(/,/g, '')).toLocaleString()} تومان</>
                      )}
                    </p>

                    {/* کنترل تعداد */}
                    <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        -
                      </button>
                      <span className="fs-5 fw-bold px-2">{item.quantity}</span>
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* بخش کد تخفیف و مجموع قیمت */}
          <div
            className="card p-3 shadow-sm mt-4 text-center"
            style={{ backgroundColor: '#FAF3E0', borderRadius: '12px' }}
          >
            <div className="d-flex flex-column flex-md-row gap-2 mb-3">
              <input
                type="text"
                className="form-control text-center"
                placeholder="کد تخفیف را وارد کنید"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button className="btn btn-dark w-100 w-md-auto" onClick={applyDiscount}>
                اعمال کد
              </button>
            </div>

            <h5>
              مجموع: <span className="fw-bold">{totalPrice.toLocaleString()} تومان</span>
            </h5>
            {discountPercent > 0 && (
              <h6 className="text-success">
                بعد از تخفیف: <b>{finalTotal.toLocaleString()} تومان</b>
              </h6>
            )}

            <button className="btn btn-success w-100 mt-3">ادامه پرداخت</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Card;
