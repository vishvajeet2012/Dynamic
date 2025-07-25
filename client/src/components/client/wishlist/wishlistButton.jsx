import { FaHeart, FaTrashAlt } from "react-icons/fa";
import { useAddtoWishlist } from "../../../hooks/Product/Product";
import { cn } from "@/lib/utils";

export default function WishlistButton({ isWishlisted, handleWishlistClick, prodcutId, wishlistDelete }) {
  const { getAllProductsWithWishlist, loading, productsWithWishlist, error, success } = useAddtoWishlist();

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {wishlistDelete ? (
        <button
          onClick={() => handleWishlistClick(prodcutId)}
          className="absolute top-2 right-2 rounded-full bg-white/80 p-2 text-gray-500 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-red-500"
          aria-label="Remove from wishlist"
        >
          <FaTrashAlt size={18} className="transition-all text-gray-400 hover:text-red-500" />
        </button>
      ) : (
        <button
          onClick={() => handleWishlistClick(prodcutId)}
          className="absolute top-2 right-2 rounded-full bg-white/80 p-2 text-gray-500 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-red-500"
          aria-label="Add to wishlist"
        >
          <FaHeart
            size={18}
            className={cn(
              "transition-all",
              isWishlisted ? "text-red-500 scale-110" : "text-gray-400"
            )}
          />
        </button>
      )}
    </>
  );
}
