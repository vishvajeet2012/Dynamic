import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function CategorySection({categories}){
const [subCategoryData,setSubCategoryData]= useState()

useEffect(()=>{
setSubCategoryData(categories?.flatMap(e=>e.subcategories))
},[categories])


    return(
        <>

         <section className="w-full py-6 px-6">
      <div className="text-center mb-4">
        <h1 className="text-4xl capitalize font-semibold text-black tracking-tight">
          Categories
        </h1>
       
<div className="mt-4">               <div className="  grid grid-cols-4 gap-4    ">
                           {subCategoryData?.slice(0,8).map((value ,index)=>(

                         
                             <Link to={`/category/${value?._id}`} key={value?._id} className="   aspect-square " > 
                           <img
          src={value?.subCategoryImage}
          alt={value?.subCategoryName}
          className="w-full h-full object-cover rounded-md object-center cursor-pointer transition-transform duration-500 group-hover:scale-105"
        />


                            </Link>  ))}
</div>
 
                </div>


      </div>
</section>



        </>
    )
}