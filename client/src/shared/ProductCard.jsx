import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";

export default function ProductCard({ item }) {
  const {
    name,
    category,
    discount,
    basePrice,
    sellingPrice,
    images,
    rating = 4.5,
    reviewCount = 87,
    isOutOfStock = false,
  } = item;

  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Added to cart:", name);
    // Add your "add to cart" logic here
  };

  const handleViewProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Viewing product:", name);
    // Add your navigation logic here, e.g., router.push(`/product/${item.id}`)
  };

  return (
    <div className="group relative w-full aspect-[3/4] cursor-pointer overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
        style={{
          backgroundImage: `url(${images?.[0]?.imagesUrls})`,
        }}
      />
      
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      {/* Top Section - Discount Badge */}
      <div className="absolute top-3 left-3 z-20">
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Wishlist Button - Right Bottom */}
      <div className="absolute bottom-3 right-3 z-20">
        <button
          onClick={handleWishlistClick}
          className="rounded-full bg-white/90 backdrop-blur-sm p-2 text-gray-600 shadow-lg transition-all duration-200 hover:bg-white hover:text-red-500"
          aria-label="Add to wishlist"
        >
          <Heart
            size={18}
            className={cn({ "fill-red-500 text-red-500": isWishlisted })}
          />
        </button>
      </div>

      {/* Hover Overlay with Action Buttons */}
      <div className="absolute inset-0 z-10 flex transform flex-col items-center justify-center space-y-3 bg-black/40 backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100">
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "flex w-4/5 items-center justify-center gap-2 rounded-lg py-3 px-4 text-sm font-bold text-white transition-all",
            isOutOfStock 
              ? "bg-gray-500 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 shadow-lg"
          )}
        >
          <ShoppingCart size={16} />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
        <button 
          onClick={handleViewProduct}
          className="flex w-4/5 items-center justify-center gap-2 rounded-lg bg-white/90 backdrop-blur-sm py-3 px-4 text-sm font-bold text-gray-800 transition-all hover:bg-white shadow-lg"
        >
          <Eye size={16} />
          View Product
        </button>
      </div>

      {/* Bottom Content - Product Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
        {/* Category */}
        <p className="mb-1 text-xs text-white/80 capitalize truncate">
          {category?.categoryName}
        </p>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2">
          {name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-white/90">{rating}</span>
          <span className="text-xs text-white/60">({reviewCount})</span>
        </div>
        
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-white">
            ₹{sellingPrice}
          </span>
          {discount > 0 && (
            <span className="text-sm text-white/60 line-through">
              ₹{basePrice}
            </span>
          )}
        </div>
      </div>

      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
            OUT OF STOCK
          </div>
        </div>
      )}
    </div>
  );
}