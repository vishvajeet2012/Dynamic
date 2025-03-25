// hooks/useCart.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all cart items
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart/items');
      setCartItems(response.data.items);
      calculateTotal(response.data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      await axios.post('/api/cart/add', { productId, quantity });
      await fetchCartItems(); // Refresh cart after adding
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Change quantity
  const changeQuantity = async (productId, newQuantity) => {
    try {
      setLoading(true);
      await axios.put('/api/cart/quantity', { productId, quantity: newQuantity });
      await fetchCartItems(); // Refresh cart after changing quantity
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total (could also use the API if needed)
  const calculateTotal = (items) => {
    const calculatedTotal = items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    setTotal(calculatedTotal);
    
    // Alternatively, if you want to use the API:
    // const response = await axios.get('/api/cart/total');
    // setTotal(response.data.total);
  };

  // Initialize cart on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  return {
    cartItems,
    total,
    loading,
    error,
    addToCart,
    changeQuantity,
    fetchCartItems,
  };
};

export default useCart;