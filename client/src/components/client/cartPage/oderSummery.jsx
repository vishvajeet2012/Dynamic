import { ShoppingCart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSumary({ totalPrice, disabled, handlePlaceOrder }) {
  const navigate = useNavigate();
  const location = useLocation(); // Pathname check karne ke liye

  const handleClickOrder = () => {
    if (location.pathname === "/cart") {
      navigate("/checkout");
    }else{
      navigate("/thanks")
    }
  };

  return (
    <div className="lg:col-span-5 md:min-w-md">
      <div className="bg-white p-6 lg:p-8 border shadow-md sticky top-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
          <ShoppingCart className="w-6 h-6 mr-3 text-indigo-600" />
          Order Summary
        </h2>

        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>$0</span> {/* Hardcoded zero shipping cost */}
          </div>
          <div className="flex justify-between font-bold text-xl text-gray-800 pt-2 border-t mt-4">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>

        {location.pathname === "/cart" ? (
          <button
            type="button"
            onClick={handleClickOrder}
            className="w-full bg-primaryReds text-white font-bold py-3 px-4 rounded-lg mt-8 hover:bg-primaryReds focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 flex items-center justify-center"
          >
            Place Order
          </button>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={handlePlaceOrder}
            className={`w-full bg-primaryReds text-white font-bold py-3 px-4 rounded-lg mt-8 hover:bg-primaryReds focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 flex items-center justify-center ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Place Order
          </button>
        )}
      </div>
    </div>
  );
}
