import { useState, useEffect } from 'react';
import { useGetBannnerData } from '../hooks/client/homePageHooks/use-banner';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function Banner({ bannerType }) {    
    const [bannerData, setBannerData] = useState([]);
    const { getAllBannerData, loading, error, success } = useGetBannnerData(bannerType);

    useEffect(() => {
        const fetchBannerData = async () => {
            const data = await getAllBannerData();
            if (data) {
                setBannerData(data);
            }
        };
        fetchBannerData();
    }, [bannerType]);

    if (loading) return (
        <div className="w-full max-w-[1920px] mx-auto" aria-label="Loading banner">
            {/*
              - `animate-pulse`: This is the Tailwind class that creates the gentle pulsing effect.
              - `bg-gray-200`: A standard light gray color for skeletons.
              - `aspect-video`: On mobile, this gives the skeleton a 16:9 aspect ratio, a common banner shape.
              - `md:h-[400px] lg:h-[500px]`: On desktop, we set the height to match the `max-h` of your
                final banner image. This is key to preventing layout shift.
            */}
            <div className="w-full animate-pulse bg-gray-200 aspect-video md:h-[400px] lg:h-[500px]"></div>
        </div>
    );
    
    if (error) return (
        <div className="w-full p-8 text-center bg-gray-100 text-gray-800">
            Error loading banner
        </div>
    )
    
    if (!success || !bannerData.length) return null;

    return (
        // Simple container for the banners
        <div className="w-full max-w-[1920px] mx-auto relative overflow-hidden">
            {bannerData.map((banner, index) => (
                // 1. Control visibility with responsive and `first:` classes
                // - `hidden`: By default (mobile-first), hide all banners.
                // - `first:block`: BUT, for the very first banner, override `hidden` and make it visible.
                // - `md:block`: On medium screens and up, make ALL banners visible again.
                <div key={index} className="w-full relative hidden first:block md:block">
                    <a href={banner.link || '#'} aria-label={banner.altText || 'Banner image'}>
                        <picture>
                            <source media="(min-width: 1200px)" srcSet={banner.url} />
                            <source media="(min-width: 768px)" srcSet={banner.url} />
                            <LazyLoadImage 
                                src={banner.url} 
                                alt={banner.altText || ''}
                                // 2. Using your original, preferred classes for the image
                                className="w-full h-auto block object-cover transition-transform duration-300 ease-in-out hover:scale-[1.02] md:max-h-[400px] lg:max-h-[500px]"
                                // Load the first image eagerly, the rest (for desktop) lazily
                                loading={index === 0 ? "eager" : "lazy"}
                            />
                        </picture>
                    </a>
                </div>
            ))}
        </div>
    );
}