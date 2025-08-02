import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CardCarousel } from "../../components/ui/card-carousel"
import { CardSwipe } from "@/components/ui/card-swipe"

export default function CategorySection({categories,categoriesLoading}){
const [subCategoryData,setSubCategoryData]= useState()

useEffect(()=>{
setSubCategoryData(categories?.flatMap(e=>e.subcategories))
},[categories])

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    {/* Desktop Loading */}
    <div className="md:block hidden text-center mb-4">
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
    <div className="md:hidden block">
      <div className="flex space-x-4 overflow-hidden">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex-shrink-0 w-64 h-40 bg-gray-300 rounded-md"></div>
        ))}
      </div>
    </div>
  </div>
)

    return(
        <>
         <section className="w-full py-6 px-6">
           {categoriesLoading ? (
             <LoadingSkeleton />
           ) : (
             <>
               <div className=" md:block hidden text-center mb-4">
                <h1 className="text-4xl capitalize font-semibold text-black tracking-tight">
                  Categories
                </h1>
               
                <div className="mt-4">               
                  <div className="  grid grid-cols-4 gap-4    ">
                    {subCategoryData?.slice(0,8).map((value ,index)=>(
                      <Link to={`/category/${value?._id}`} key={value?._id} className="   aspect-square " > 
                        <img
                          src={value?.subCategoryImage}
                          alt={value?.subCategoryName}
                          className="w-full h-full object-cover rounded-md object-center cursor-pointer transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>  
                    ))}
                  </div>
                </div>
              </div> 
              
              <div className="md:hidden block">
                <CardCarousel
                  images={subCategoryData}
                  autoplayDelay={2000}
                  showPagination={true}
                  showNavigation={true}
                />
              </div>
             </>
           )}
         </section>
        </>
    )
}