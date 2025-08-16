import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Slider from "react-slick"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

export default function CategorySection({categories, categoriesLoading}){
  const [subCategoryData, setSubCategoryData] = useState()

  useEffect(() => {
    setSubCategoryData(categories?.flatMap(e => e.subcategories))
  }, [categories])

  const mobileSettings = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 3.5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: false,
    arrows: false,
    centerMode: false,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
        }
      }
    ]
  }

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="hidden md:block text-center mb-4 px-6">
        <div className="h-10 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
        <div className="mt-4">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="aspect-square bg-gray-300 rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile Loading */}
      <div className="block md:hidden px-4">
        <div className="h-8 bg-gray-300 rounded w-32 mx-auto mb-4"></div>
        <div className="flex space-x-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-24 h-24 bg-gray-300 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <section className="w-full 2xl:max-w-[79rem] 2xl:mx-auto h-full py-6 md:px-6">
        {categoriesLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <div className="hidden md:block text-center mb-4">
              <h1 className="text-4xl capitalize font-semibold text-black tracking-tight">
                Categories
              </h1>
             
              <div className="mt-4">               
                <div className="grid grid-cols-4 gap-4">
                  {subCategoryData?.slice(0, 8).map((value, index) => (
                    <Link 
                      to={`/category/${value?._id}`} 
                      key={value?._id} 
                      className="aspect-square"
                    > 
                      <LazyLoadImage
                        src={value?.subCategoryImage}
                        alt={value?.subCategoryName}
                        className="w-full h-full object-cover rounded-md object-center cursor-pointer transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>  
                  ))}
                </div>
              </div>
            </div> 

            <div className="block md:hidden">
              <div className="text-center mb-4 px-4">
                <h1 className="text-2xl capitalize font-semibold text-black tracking-tight">
                  Categories
                </h1>
              </div>

              <div className="px-4">
                <Slider {...mobileSettings} className="category-slider-mobile">
                  {subCategoryData?.map((value, index) => (
                    <div key={value?._id} className="px-1">
                      <Link 
                        to={`/category/${value?._id}`}
                        className="block group"
                      >
                        <div className="relative">
                          <div className="w-full aspect-square rounded-lg overflow-hidden shadow-md active:scale-95 transition-transform duration-200">
                            <LazyLoadImage
                              src={value?.subCategoryImage}
                              alt={value?.subCategoryName}
                              className="w-full h-full object-cover object-center"
                            />
                          </div>
                          <div className="mt-2">
                            <p className="text-xs font-medium text-center text-gray-800 truncate leading-tight">
                              {value?.subCategoryName}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </>
        )}
      </section>

      <style jsx>{`
        /* Mobile Slider Styles Only */
        .category-slider-mobile .slick-track {
          display: flex;
          align-items: center;
        }
        
        .category-slider-mobile .slick-slide {
          height: auto;
        }
        
        .category-slider-mobile .slick-slide > div {
          height: 100%;
        }

        /* Remove default slick arrows */
        .slick-prev:before,
        .slick-next:before {
          display: none;
        }

        /* Custom responsive adjustments for mobile */
        @media (max-width: 640px) {
          .category-slider-mobile .slick-slide {
            margin: 0 4px;
          }
        }
      `}</style>
    </>
  )
}