import { useState, useEffect, useLayoutEffect } from 'react';
import { useGetBannnerData } from '../hooks/client/homePageHooks/use-banner';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';

export default function Banner({ bannerType }) {    
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
            }, 5000); // Change slide every 5 seconds

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


    if (loading) return (
        <div className="w-full max-w-[1920px] mx-auto" aria-label="Loading banner">
            <div className="block md:hidden px-4">
                <div className="w-full animate-pulse bg-gray-200 aspect-[4/3] rounded-lg"></div>
            </div>
            <div className="hidden md:block">
                <div className="w-full animate-pulse bg-gray-200 h-[400px] lg:h-[500px] rounded-lg"></div>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="w-full p-8 text-center bg-gray-100 text-gray-800 rounded-lg">
            Error loading banner
        </div>
    );
    
    if (!success || !bannerData.images || !bannerData.images.length) return null;

    return (
        <div className="w-full mb-4 max-w-[1920px] mx-auto relative overflow-hidden">
         
            <div className="block md:hidden  ">
                <div className="relative bg-white  shadow-lg overflow-hidden">
                  
                    <div className="relative h-full overflow-hidden">
                        <div 
                            className="flex transition-transform duration-500 ease-in-out h-full"
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

                      
                        {bannerData.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                                    aria-label="Previous slide"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                                    aria-label="Next slide"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>

                  
                   
                </div>
            </div>

            <div className="hidden md:block">
                <div className="relative  overflow-hidden shadow-lg">
                    <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
                        <div 
                            className="flex transition-transform duration-700 ease-in-out h-full"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {bannerData.images.map((image, index) => (
                                <div key={image._id || index} className="w-full flex-shrink-0 h-full">
                                    <a 
                                        href={bannerData.redirectUrl || '#'} 
                                        aria-label={`Desktop banner ${index + 1}`}
                                        className="block h-full group"
                                    >
                                        <picture className="h-full block">
                                            <source media="(min-width: 1200px)" srcSet={image.url} />
                                            <source media="(min-width: 768px)" srcSet={image.url} />
                                            <LazyLoadImage 
                                                src={image.url} 
                                                alt={`Banner ${index + 1}`}
                                                className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-[1.02]"
                                                loading={index === 0 ? "eager" : "lazy"}
                                            />
                                        </picture>
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 ease-in-out"></div>
                                    </a>
                                </div>
                            ))}
                        </div>

                        {bannerData.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                                    aria-label="Previous slide"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                                    aria-label="Next slide"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* Desktop Dots Indicator */}
                        {bannerData.images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
                                {bannerData.images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                            currentSlide === index 
                                                ? 'bg-white shadow-lg scale-125' 
                                                : 'bg-white/50 hover:bg-white/80'
                                        }`}
                                        aria-label={`Go to slide ${index + 1}`}
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