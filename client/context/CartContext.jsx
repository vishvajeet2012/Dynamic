// context/CartContext.js
import { createContext, useContext } from 'react';
import useCart from '../src/hooks/usecart';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const cart = useCart();

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  return useContext(CartContext);
};