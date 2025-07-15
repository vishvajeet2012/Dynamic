import { useState, useEffect } from 'react';
import { useGetBannnerData } from '../hooks/client/homePageHooks/use-banner';

export default function Banner({ bannerType ,categoriesBanner }) {    
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
    }, []);

    if (loading) return (
        <div className="w-full p-8 text-center bg-gray-100 text-gray-800">
            Loading banner...
        </div>
    );
    
    if (error) return (
        <div className="w-full p-8 text-center bg-gray-100 text-gray-800">
            Error loading banner
        </div>
    )

    
    if (!success || !bannerData.length) return null;

    return (
        <div className="w-full max-w-[1920px] mx-auto relative overflow-hidden">
            {bannerData.map((banner, index) => (
                <div key={index} className="w-full relative">
                    <a href={banner.link || '#'} aria-label={banner.altText || 'Banner image'}>
                        <picture>
                            {/* Responsive image sources */}
                            <source media="(min-width: 1200px)" srcSet={banner.url} />
                            <source media="(min-width: 768px)" srcSet={banner.url || banner.url} />
                            <img 
                                src={banner.url || banner.url} 
                                alt={banner.altText || ''}
                                className="w-full h-auto block object-cover transition-transform duration-300 ease-in-out hover:scale-[1.02] md:max-h-[400px] lg:max-h-[500px]"
                                loading="lazy"
                            />
                        </picture>
                    </a>
                </div>
            ))}
        </div>
    );
}