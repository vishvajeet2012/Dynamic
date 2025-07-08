import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react"; // Added Eye icon

export default function ProductCard({ item }) {
  const {
    name,
    category,
    discount,
    basePrice,
    sellingPrice,
    images,
    // Suggested item properties:
    // rating = 4.5,
    // reviewCount = 87,
    // isOutOfStock = false,
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
    <div className="group relative w-full max-w-[220px] cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      
      {/* --- HOVER OVERLAY --- */}
      <div className="absolute inset-0 z-10 flex transform flex-col items-center justify-center space-y-3 bg-white/70 backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100">
        <button 
          onClick={handleAddToCart}
          className="flex w-3/4 items-center justify-center gap-2 rounded-md bg-blue-600 py-2 px-4 text-sm font-bold text-white transition-all hover:bg-blue-700"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
        <button 
          onClick={handleViewProduct}
          className="flex w-3/4 items-center justify-center gap-2 rounded-md bg-gray-800 py-2 px-4 text-sm font-bold text-white transition-all hover:bg-gray-900"
        >
          <Eye size={16} />
          View Product
        </button>
      </div>

      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-50 p-2">
        <img
          src={images?.[0]?.imagesUrls}
          alt={name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 z-10 rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold text-white">
            {discount}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 z-10 rounded-full bg-white p-1.5 text-gray-500 shadow-sm transition-colors duration-200 hover:text-red-500"
          aria-label="Add to wishlist"
        >
          <Heart
            size={20}
            className={cn({ "fill-red-500 text-red-500": isWishlisted })}
          />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-3">
        {/* Category */}
        <p className="mb-1 text-xs text-gray-500 capitalize truncate">
          {category?.categoryName}
        </p>

        {/* Product Name */}
        <h3 className="min-h-[40px] text-sm font-semibold text-gray-800 line-clamp-2">
          {name}
        </h3>
        
        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{sellingPrice}
          </span>
          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₹{basePrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}