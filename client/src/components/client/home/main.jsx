import { use, useEffect } from "react";
import Banner from "../../../shared/Banner";
import Header from "../../../shared/header";
import AboutUs from "../../../shared/HomePage/Aboutus";
import NewArrivals from "../../../shared/NewArrivals";

import { useGetProduct } from "../../../hooks/Product/Product";
import CategorySection from "../../../shared/HomePage/CategorySection";
import { useGetAllCategories } from "../../../hooks/useCategories";

export default function Home() {
const { loading, error, categories, fetechCategories } = useGetAllCategories();

  useEffect(() => {
    fetechCategories();
  }, []);


  return (
    <>

  
   <Banner bannerType="homepage"/>
  
   <NewArrivals query ={{isNewArrival:isNewArrival}} />
   <CategorySection categories={categories}/>
   <AboutUs/>

    </>
  );
}