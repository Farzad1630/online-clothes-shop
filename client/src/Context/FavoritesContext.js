import { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const storedFavs = localStorage.getItem('favorites');
    return storedFavs ? JSON.parse(storedFavs) : [];
  });
  const [favoriteAnimate, setFavoriteAnimate] = useState(false);
  const triggerFavoriteAnimation = () => {
  setFavoriteAnimate(true);
  setTimeout(() => setFavoriteAnimate(false), 500); 
};

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (product) => {
    setFavorites((prev) => {
      const alreadyExists = prev.some((item) =>
        item.id === product.id && item.selectedSize === product.selectedSize);

      if (alreadyExists) return prev;
      return [...prev, product];
    });
  };

  const removeFromFavorites = (productId, selectedSize) => {
    setFavorites((prev) => 
      prev.filter((item) => !(item.id === productId && item.selectedSize === selectedSize))
    );
  };




  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, triggerFavoriteAnimation,favoriteAnimate  }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
