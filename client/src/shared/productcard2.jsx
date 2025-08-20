import React, { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have this utility for conditional classes
import { FaHeart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import WishlistButton from "../components/client/wishlist/wishlistButton";
import { useAddtoWishlist } from "../hooks/Product/Product";
import { useWishlist } from "../../context/wishListhContext";
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function AdaptiveProductCard({ item, wishlistDelete }) {
  const { addtoWishlist, loading, wishlist, error, success } = useAddtoWishlist()
  const { toggleWishlist, isInWishlist } = useWishlist();

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
    slug,
    childCategory
  } = item;

  const [isWishlisted, setIsWishlisted] = useState(false);

  const token = localStorage.getItem('token');
  const handleWishlistClick = async (e) => {
    if (!token) {
      alert("Please login first");
    } else {
      setIsWishlisted((prev) => !prev);
      toggleWishlist(_id);
    }
  };

  const handleCardClick = () => {
    console.log("Navigating to product:", name);
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group flex w-full md:max-w-[310px] cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-200"
      )}
      style={{
        height: window.innerWidth < 768 ? '320px' : 'auto', 
        minHeight: window.innerWidth < 768 ? '320px' : 'auto'
      }}
    >
      <div 
        className={cn(
          "relative overflow-hidden flex-shrink-0",
          "w-full"
        )}
        style={{
          aspectRatio: window.innerWidth < 768 ? '4/5' : '3/4', // Adjusted aspect ratio
          height: window.innerWidth < 768 ? '200px' : 'auto' // Fixed height for mobile
        }}
      > 
        <Link to={`/${slug}`} className="absolute inset-0">
               <LazyLoadImage
                 className={cn(
                   "h-full w-full object-cover transition-transform  ",
                   "md:object-contain"
                 )}
                 src={images?.[0]?.imagesUrls}
         lazyloading          alt={name}
               /></Link>
    
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-md bg-gray-800/80 px-3 py-1 text-sm font-bold text-white">
              OUT OF STOCK
            </span>
          </div>
        )}
        <WishlistButton 
          productId={_id} 
          wishlistDelete={wishlistDelete}  
          isWishlisted={isWishlisted} 
          handleWishlistClick={handleWishlistClick}
        />
      </div>

      <div 
        className={cn(
          "flex flex-grow border-[1px] flex-col space-y-1.5 justify-between",
          "min-h-0" // Allows flex-grow to work properly
        )}
        style={{
          padding: window.innerWidth < 768 ? '8px' : '12px' // Smaller padding on mobile
        }}
      >
        
        <div className="flex-grow space-y-1">
          {/* Category Badge */}
          <div className="flex items-start justify-between">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize truncate max-w-[120px]">
              {childCategory?.[0]?.childCategoryName || category?.categoryName || "THE V Store"}
            </span>
            {discount > 0 && !isOutOfStock && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200 flex-shrink-0">
                {discount}% OFF
              </span>
            )}
          </div>

          <div 
            className="flex items-start"
            style={{ height: window.innerWidth < 768 ? '36px' : '38px' }}
          >
            <h1 className="text-sm md:text-base font-semibold text-slate-900 line-clamp-2 leading-tight group-hover:text-slate-700 transition-colors">
              <Link to={`/${slug}`} className="">
                {name}
              </Link>
            </h1>
          </div>
        </div>

        <div className="flex-shrink-0">
        
          <div className="md:hidden space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-slate-900">
                ₹{sellingPrice?.toLocaleString('en-IN')}
              </span>
              {discount > 0 && (
                <span className="text-sm text-slate-500 line-through">
                  ₹{basePrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discount > 0 && (
              <div className="text-xs font-medium text-green-600">
                {/* You Save ₹{(basePrice - sellingPrice)?.toLocaleString('en-IN')} */}
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900">
                ₹{sellingPrice?.toLocaleString('en-IN')}
              </span>
              {discount > 0 && (
                <span className="text-sm text-slate-500 line-through">
                  ₹{basePrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>
         
          </div>
        </div>
      </div>
    </div>
  );
}