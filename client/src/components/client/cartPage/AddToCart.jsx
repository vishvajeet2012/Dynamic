import { useState } from "react";
import { useCart } from "../../../../context/cartContext";

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

  const handleAddToCart = (e) => {
    const { color, productId, quantity, size } = e;
    if (!size) {
      setOpenModal(true);
    } else {
      addToCart(productId, quantity, size, color);
    }
  };

  return (
    <>
      <button
        onClick={() => handleAddToCart({ productId, quantity, size, color })}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition-colors"
        disabled={productDetail?.stock <= 0}
      >
        {productDetail?.stock > 0 ? "Add to Cart" : "Out of Stock"}
      </button>

      {/* Modal */}
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
