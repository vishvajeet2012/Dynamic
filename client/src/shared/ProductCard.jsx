import React, { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have this utility for conditional classes
import { FaHeart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import WishlistButton from "../components/client/wishlist/wishlistButton";
import { useAddtoWishlist } from "../hooks/Product/Product";
import { useWishlist } from "../../context/wishListhContext";
import { LazyLoadImage } from 'react-lazy-load-image-component';

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
    slug,
    childCategory
  } = item;

  const [isWishlisted, setIsWishlisted] = useState(false);

  const token = localStorage.getItem('token');
  const handleWishlistClick = async(e) => {
   /// e.stopPropagation();
   /// setIsWishlisted((prev) => !prev);
   /// console.log("Toggled wishlist for:", name);
        if(!token){
            alert("Plese login first ")

        }else{
          
          setIsWishlisted((prev) => !prev);
          toggleWishlist(_id)

  }

  };

  const handleCardClick = () => {
    console.log("Navigating to product:", name);
  };


  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group flex w-full md:max-w-[310px] cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl"
      )}
    >
      <div 
        className={cn(
          "relative overflow-hidden",
          "w-full aspect-[8/11]",
          "md:aspect-[3/4]"
        )}
      > <Link to={`/${slug}`} className="absolute inset-0">
        <LazyLoadImage
          className={cn(
            "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
            "md:object-contain"
          )}
          src={images?.[0]?.imagesUrls}
  lazyloading          alt={name}
        /></Link>
    
        {/* {discount > 0 && !isOutOfStock && (
          <span className="absolute top-2 left-2 rounded-full bg-red-600 px-2 py-0.5 text-center text-[8px] md:text-xs font-medium text-white">
            {discount}% OFF
          </span>
        )} */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-md bg-gray-800/80 px-3 py-1 text-sm font-bold vf text-white">
              OUT OF STOCK
            </span>
          </div>
        )}
     <WishlistButton productId={_id} wishlistDelete={wishlistDelete}  isWishlisted={isWishlisted} handleWishlistClick={handleWishlistClick}/>
      </div>

  
      <div className="flex flex-grow flex-col pr-4 pl-2 pb-3 pt-2 md:p-4">
       
        <div className=" hidden md:flex items-start justify-between">
        
          <p className="truncate text-xs text-gray-500 capitalize">
            {childCategory?.[0]?.childCategoryName||category?.categoryName || "THE V Store"}
          </p>
        
        </div>
          <h1  className=" text-xs   md:text-base    h-7 mb-1  md:h-0 font-bold text-slate-900  ">
        <Link to={`/${slug}`}>
          {name}
        </Link></h1>

  <div className="flex md:hidden items-start my-1 justify-between">
        
          <p className="truncate text-xs text-gray-500 capitalize">
            {childCategory?.[0]?.childCategoryName||category?.categoryName || "THE V Store"}
          </p>
        
        </div>
        <div className=" lg:mt-10 flex items-baseline gap-2 "> 
          <span className= " text-[12px] lg:text-lg font-bold text-slate-900">
            ₹{sellingPrice}
          </span>
          {discount > 0 && (
            <span className="text-[10px] md:text-sm text-slate-500 line-through">
              ₹{basePrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}