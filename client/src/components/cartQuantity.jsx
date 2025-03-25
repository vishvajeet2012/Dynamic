// components/CartItem.js
import { useState } from 'react';

const CartItem = ({ item, onChangeQuantity }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
      onChangeQuantity(item.productId, newQuantity);
    }
  };

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} />
      <div className="item-details">
        <h3>{item.name}</h3>
        <p>${item.price.toFixed(2)}</p>
      </div>
      <div className="quantity-controls">
        <button onClick={() => handleQuantityChange(quantity - 1)}>-</button>
        <span>{quantity}</span>
        <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>
      </div>
      <div className="item-total">
        ${(item.price * quantity).toFixed(2)}
      </div>
      <button className="remove-item">Remove</button>
    </div>
  );
};

export default CartItem;