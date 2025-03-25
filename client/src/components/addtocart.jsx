// components/AddToCartButton.js
import { useState } from 'react';
import { useCartContext } from '../context/CartContext';

const AddToCartButton = ({ productId }) => {
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCartContext();

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(productId);
    setAdding(false);
  };

  return (
    <button 
      onClick={handleAddToCart} 
      disabled={adding}
      className="add-to-cart-btn"
    >
      {adding ? 'Adding...' : 'Add to Cart'}
    </button>
  );
};

export default AddToCartButton;