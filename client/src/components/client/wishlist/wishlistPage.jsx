import { useEffect } from "react";
import { useGetAllProductsWithWishlist } from "../../../hooks/Product/Product";
import AdaptiveProductCard from "../../../shared/ProductCard";
import { useWishlist } from "../../../../context/wishListhContext";

export default function Wishlistpage() {
     const { toggleWishlist,wishlistItems, isInWishlist,productsWithWishlistStatus } = useWishlist();

  
  return (
    <div className="wishlist-page w-full p-4">
      <h1 className="text-3xl font-bold mb-4 border-b">Wishlist</h1>

      {productsWithWishlistStatus?.wishlist?.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p>Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="wishlist-items flex  ">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
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
