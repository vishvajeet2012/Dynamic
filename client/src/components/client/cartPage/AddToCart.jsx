import { useState } from "react";
import { useCart } from "../../../../context/cartContext";
import { motion } from "framer-motion"; 

export default function AddToCart({ productDetail, productId, quantity, size, color }) {
  const {
    loading,
    cartItems,
    error,
    addToCart,
    getCartItems,
    updateCartItem,
    removeCartItem,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  const [openModal, setOpenModal] = useState(false);
  const token = localStorage.getItem('token');
  const handleAddToCart = (e) => {
    const { color, productId, quantity, size } = e;
    if (!size) {
      setOpenModal(true);
    } else {
      if(!token){
        alert("login first")
      }
      else{
      addToCart(productId, quantity, size, color);
      }
    }
  };

  return (
    <>
    
      <motion.button
        onClick={() => handleAddToCart({ productId, quantity, size, color })}
        className="flex-1 bg-[#e11b23] hover:bg-[#c81a1f] text-white py-3 px-8 rounded-lg font-semibold shadow-md
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e11b23]
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
        disabled={productDetail?.stock <= 0}
        whileTap={{ scale: 0.95 }} 
        whileHover={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }} // Grows slightly and adds a more pronounced shadow on hover
      >
        {productDetail?.stock > 0 ? "Add to Cart" : "Out of Stock"}
      </motion.button>

      {/* Modal for size required */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex transition duration-200 items-center justify-center backdrop-blur-lg bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-center text-red-600">Size Required</h2>
            <p className="text-gray-700 mb-4 text-center">
              Please select a size before adding the product to cart.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setOpenModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
