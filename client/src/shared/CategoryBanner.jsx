import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryBanner({ categoriesBanner, loading ,altText = 'Category Banner'}) {
   
   if(loading)  return (
        <div className="w-full max-w-[1920px] mx-auto relative overflow-hidden">
            <div className="w-full h-[200px] md:h-[300px] lg:h-[400px] bg-gray-200 animate-pulse rounded-md" />
        </div>)
   
    if (!categoriesBanner) return null;

    return (
        <div className="w-full max-w-[1920px] mx-auto relative overflow-hidden">
            <Link aria-label={altText}>
                <img
                    src={categoriesBanner}
                    alt={"banner"}
                    className="w-full h-auto block object-cover transition-transform duration-300 ease-in-out hover:scale-[1.02] md:max-h-[400px] lg:max-h-[500px]"
                    loading="lazy"
                />
            </Link>
        </div>
    );
}
