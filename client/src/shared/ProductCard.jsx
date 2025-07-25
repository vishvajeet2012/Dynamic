import React, { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have this utility for conditional classes
import { FaHeart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import WishlistButton from "../components/client/wishlist/wishlistButton";
import { useAddtoWishlist } from "../hooks/Product/Product";
import { useWishlist } from "../../context/wishListhContext";

export default function AdaptiveProductCard({ item ,wishlistDelete}) {
   const  { addtoWishlist, loading, wishlist, error, success } = useAddtoWishlist()
     const { toggleWishlist, isInWishlist, } = useWishlist();

  
  // Destructure props with default values
  const {
    _id,
    name,
    category,
    discount,
    basePrice,
    sellingPrice,
    images,
    rating = 4.5,
    reviewCount = 87,
    isOutOfStock = false,
    slug
  } = item;

  const [isWishlisted, setIsWishlisted] = useState(false);

  // --- Event Handlers ---

  const handleWishlistClick = async(e) => {
   /// e.stopPropagation();
   /// setIsWishlisted((prev) => !prev);
   /// console.log("Toggled wishlist for:", name);
        
    toggleWishlist(_id)
    setIsWishlisted((prev) => !prev);
    console.log("Wishlist status:", e);
    // Optionally, you can show a toast or notification here

  };

  const handleCardClick = () => {
    console.log("Navigating to product:", name);
    // Add your navigation logic here, e.g., router.push(`/product/${id}`)
  };

  // --- Main Render ---

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group flex w-full md:max-w-[310px] cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl"
      )}
    >
      {/* ====== 1. IMAGE SECTION ====== */}
      <div 
        className={cn(
          "relative overflow-hidden",
          // Mobile: A square aspect ratio with object-cover for a clean look.
          "w-full aspect-[8/11]",
          // Desktop: Uses your preferred aspect ratio and object-contain.
          "md:aspect-[3/4]"
        )}
      > <Link to={`/${slug}`} className="absolute inset-0">
        <img
          className={cn(
            "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
            // Switch to contain on desktop to show the full product.
            "md:object-contain"
          )}
          src={images?.[0]?.imagesUrls}
          alt={name}
        /></Link>
        {/* Badges */}
        {discount > 0 && !isOutOfStock && (
          <span className="absolute top-2 left-2 rounded-full bg-red-600 px-2 py-0.5 text-center text-xs font-medium text-white">
            {discount}% OFF
          </span>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-md bg-gray-800/80 px-3 py-1 text-sm font-bold text-white">
              OUT OF STOCK
            </span>
          </div>
        )}
        {/* Wishlist button    isWishlisted, handleWishlistClick*/}
     <WishlistButton productId={_id} wishlistDelete={wishlistDelete}  isWishlisted={isWishlisted} handleWishlistClick={handleWishlistClick}/>
      </div>

      {/* ====== 2. CONTENT SECTION ====== */}
      <div className="flex flex-grow flex-col p-4">
        {/* Category & Rating */}
        <div className="flex items-start justify-between">
          <p className="truncate text-xs text-gray-500 capitalize">
            {category?.categoryName}
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            <FaStar size={14} className="text-yellow-400" />
            <span className="text-sm font-semibold">{rating}</span>
            <span className="text-xs text-gray-400">({reviewCount})</span>
          </div>
        </div>

        {/* Product Name */}
        <Link to={`/${slug}`} className="mt-1 text-base font-bold text-slate-900 line-clamp-2 min-h-[2.5rem]">
          {name}
        </Link>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-xl font-bold text-slate-900">
            ₹{sellingPrice}
          </span>
          {discount > 0 && (
            <span className="text-sm text-slate-500 line-through">
              ₹{basePrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}