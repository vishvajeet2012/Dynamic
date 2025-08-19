import { useState, useEffect, useLayoutEffect } from 'react';
import { useGetBannnerData } from '../hooks/client/homePageHooks/use-banner';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';

export default function PromotionalBanner({ bannerType }) {    
    const [bannerData, setBannerData] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const { getAllBannerData, loading, error, success } = useGetBannnerData(bannerType);

    useLayoutEffect(() => {
        const fetchBannerData = async () => {
            const data = await getAllBannerData();
            if (data && data.length > 0) {
                const firstBanner = data[0];
                if (firstBanner.images && firstBanner.images.length > 0) {
                    const sortedImages = [...firstBanner.images].sort((a, b) => a.order - b.order);
                    setBannerData({
                        ...firstBanner,
                        images: sortedImages
                    });
                }
            }
        };
        fetchBannerData();
    }, []);

    // Auto-slide functionality
    useEffect(() => {
        if (bannerData.images && bannerData.images.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => 
                    prev === bannerData.images.length - 1 ? 0 : prev + 1
                );
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [bannerData.images]);

    const nextSlide = () => {
        if (bannerData.images) {
            setCurrentSlide((prev) => 
                prev === bannerData.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevSlide = () => {
        if (bannerData.images) {
            setCurrentSlide((prev) => 
                prev === 0 ? bannerData.images.length - 1 : prev - 1
            );
        }
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 mb-6">
                <div className="w-full bg-gray-200 animate-pulse">
                    <div className="block md:hidden h-48"></div>
                    <div className="hidden md:block h-80 lg:h-96"></div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="container mx-auto px-4 mb-6">
                <div className="w-full p-6 text-center bg-gray-50 text-gray-600">
                    Unable to load banner
                </div>
            </div>
        );
    }
    
    if (!success || !bannerData.images || !bannerData.images.length) return null;

    return (
        <div className=" lg:max-w-[89rem] 2xl:max-w-[78rem] mx-auto md:px-4 mb-6">
           <div className="text-xl text-center mt-2 md:mb-4 mb-1">
 <h1 className="pl-2 md:pl-0 text-xl md:text-4xl font-semibold text-black tracking-tight">
     Launching Soon
    </h1>

           </div>
            <div className="relative overflow-hidden">
                
                {/* Mobile Version */}
                <div className="block md:hidden">
                    <div className="relative h-48 overflow-hidden">
                        <div 
                            className="flex transition-transform duration-300 ease-out h-full"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {bannerData.images.map((image, index) => (
                                <div key={image._id || index} className="w-full flex-shrink-0 h-full">
                                    <Link  
                                        to={`https://dynamicvstore.vercel.app/${bannerData.order}`} 
                                        className="block h-full"
                                    >
                                        <LazyLoadImage 
                                            src={image.mobileUrl} 
                                            alt={`Mobile banner ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            loading={index === 0 ? "eager" : "lazy"}
                                        />
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Simple Mobile Navigation */}
                        {bannerData.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
                                >
                                    ›
                                </button>
                            </>
                        )}

                        {/* Simple Mobile Dots */}
                        {bannerData.images.length > 1 && (
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                                {bannerData.images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-2 h-2 rounded-full transition-colors ${
                                            currentSlide === index ? 'bg-white' : 'bg-white/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop Version */}
                <div className="hidden md:block">
                    <div className="relative h-80 lg:h-96 overflow-hidden">
                        <div 
                            className="flex transition-transform duration-500 ease-out h-full"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {bannerData.images.map((image, index) => (
                                <div key={image._id || index} className="w-full flex-shrink-0 h-full">
                                    <a 
                                        href={bannerData.redirectUrl || '#'} 
                                        className="block h-full"
                                    >
                                        <LazyLoadImage 
                                            src={image.url} 
                                            alt={`Banner ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            loading={index === 0 ? "eager" : "lazy"}
                                        />
                                    </a>
                                </div>
                            ))}
                        </div>

                        {/* Simple Desktop Navigation */}
                        {bannerData.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-colors shadow-sm"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-colors shadow-sm"
                                >
                                    ›
                                </button>
                            </>
                        )}

                        {/* Simple Desktop Dots */}
                        {bannerData.images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {bannerData.images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-3 h-3 rounded-full transition-colors ${
                                            currentSlide === index ? 'bg-white' : 'bg-white/60'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}