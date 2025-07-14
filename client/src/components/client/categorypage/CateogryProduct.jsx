import { useEffect } from "react";
import Banner from "../../../shared/Banner";
import { useGetAllCategories } from "../../../hooks/useCategories";
import CategorySection from "../../../shared/HomePage/CategorySection";
import ProductCard from "../../../shared/ProductCard"
export default function CateogryProduct({Product}) {
const { loading, error, categories, fetechCategories } = useGetAllCategories();

  useEffect(() => {
    fetechCategories();
  }, []);
console.log(Product)
    
    return (
<>          
<section  className="w-full ">
                <div className="">
<Banner bannerType="homepage"/>
                </div>
                <div>
                      <CategorySection categories={categories}/>
                </div>

         <section className="w-full mt-10 ">
      <div className="flex justify-between items-center gap-4 px-2  overflow-hidden">
       
        <div className="w-1/4 bg-orange-400 p-4">
          <p>
            lcdscasjdcnjaskdcnsadkjcnasdckljn
          </p>
        </div>

        <div className=" w-full bg-red-600  text-white p-4">
          {/* Add your content here */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
       {Product&& Product?.data?.data?.map((product, idx) => (
                <div
                  key={idx}
                  className="min-w-[50%] sm:min-w-[50%] lg:min-w-[20%] px-1 lg:px-2"
                >
                  <ProductCard item={product} />
                </div>
              ))}
              </div>
        </div>
      </div>
    </section> 
    </section>
    </>
    )
}