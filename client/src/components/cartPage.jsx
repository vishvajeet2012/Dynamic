// components/CartPage.js
import { useEffect } from 'react';
import { useCartContext } from '../context/CartContext';
import CartItem from './CartItem';
import LoadingSpinner from './LoadingSpinner';

const CartPage = () => {
  const { cartItems, total, loading, error, changeQuantity, fetchCartItems } = useCartContext();

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <CartItem 
                key={item.id} 
                item={item} 
                onChangeQuantity={changeQuantity} 
              />
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ${total.toFixed(2)}</h3>
            <button className="checkout-button">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;