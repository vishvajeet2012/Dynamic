import { useEffect, useLayoutEffect, useState } from "react";
import Banner from "../../../shared/Banner";
import Header from "../../../shared/header";
import AboutUs from "../../../shared/HomePage/Aboutus";
import NewArrivals from "../../../shared/NewArrivals";
import { useGetAllCategories } from "../../../hooks/useCategories";
import CategorySection from "../../../shared/HomePage/CategorySection";
import PromotionalBanner from "../../../shared/PromotionalBanner";

export default function Home() {
  const { loading, error, categories, fetechCategories } = useGetAllCategories();
  const [mainLoading ,setMainLoading ]=useState(true)

  useLayoutEffect(() => {
    fetechCategories();
  }, []);

  return (
    <>
    
      <Banner bannerType="homepage" />
      <NewArrivals setMainLoading={setMainLoading} titile={"New Arrival"} query={{ isNewArrival: true }} />
      <CategorySection  categoriesLoading={mainLoading} categories={categories} />
        <PromotionalBanner bannerType="promotional" />
         <NewArrivals setMainLoading={setMainLoading} titile={"Featured"} query={{ isFeatured: true }} />
      <AboutUs />
    </>
  );
}