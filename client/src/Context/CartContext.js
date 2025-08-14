import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [cartAnimate, setCartAnimate] = useState(false);
  const triggerCartAnimation = () => {
  setCartAnimate(true);
  setTimeout(() => setCartAnimate(false), 500); 
};

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, selectedSize = null) => {
  setCartItems((prevItems) => {
    const existingItemIndex = prevItems.findIndex(
      (item) =>
        item.id === product.id &&
        item.selectedSize === selectedSize
    );

    if (existingItemIndex !== -1) {
      const updatedItems = [...prevItems];
      updatedItems[existingItemIndex].quantity += 1;
      return updatedItems;
    } else {
      return [
        ...prevItems,
        { ...product, quantity: 1, selectedSize },
      ];
    }
    });
    };



  const increaseQuantity = (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, increaseQuantity, decreaseQuantity , cartAnimate ,triggerCartAnimation}}
    >
      {children}
    </CartContext.Provider>
  );
};
