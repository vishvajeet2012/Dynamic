import React from 'react';
import { Link } from 'react-router-dom';
import FullScreenLoader from './loading';

export default function CategoryBanner({ categoriesBanner, loading ,altText = 'Category Banner'}) {
   
   if(loading)  return (
            <FullScreenLoader/>        
)
   
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
