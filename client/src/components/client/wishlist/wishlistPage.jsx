import { useEffect } from "react";
import { useGetAllProductsWithWishlist } from "../../../hooks/Product/Product";
import AdaptiveProductCard from "../../../shared/ProductCard";
import { useWishlist } from "../../../../context/wishListhContext";
import { useNavigate } from "react-router-dom";

export default function Wishlistpage() {

const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">You must be logged in to view your Wishlist.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

     const { toggleWishlist,wishlistItems, isInWishlist,productsWithWishlistStatus } = useWishlist();

  
  return (
    <div className="wishlist-page w-full p-4">
      <h1 className=" text-2xl md:text-3xl font-bold mb-4 border-b">Wishlist</h1>

      {productsWithWishlistStatus?.wishlist?.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p>Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="wishlist-items w-full  ">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ">
          {productsWithWishlistStatus?.wishlist &&
          productsWithWishlistStatus?.wishlist?.map((product, idx) => ( 
              <div
                key={product._id || idx}
                className="min-w-[70%] sm:min-w-[70%] lg:min-w-[19%] px-1 lg:px-1"
              >
                <AdaptiveProductCard wishlistDelete={true} item={product} />
              </div>
            ))}
        </div>
        </div>
      )}
    </div>
  );
}
