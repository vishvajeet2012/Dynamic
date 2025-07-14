import { useEffect } from "react";
import Banner from "../../../shared/Banner";
import { useGetAllCategories } from "../../../hooks/useCategories";
import CategorySection from "../../../shared/HomePage/CategorySection";

export default function CateogryProduct() {
const { loading, error, categories, fetechCategories } = useGetAllCategories();

  useEffect(() => {
    fetechCategories();
  }, []);

    
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
          <p>Right section (auto width)</p>
        </div>
      </div>
    </section> 
    </section>
    </>
    )
}