import { useEffect } from "react";
import Banner from "../../../shared/Banner";
import Header from "../../../shared/header";
import AboutUs from "../../../shared/HomePage/Aboutus";
import NewArrivals from "../../../shared/NewArrivals";
import { useGetAllCategories } from "../../../hooks/useCategories";
import CategorySection from "../../../shared/HomePage/CategorySection";

export default function Home() {
  const { loading, error, categories, fetechCategories } = useGetAllCategories();

  useEffect(() => {
    fetechCategories();
  }, []);

  return (
    <>
    
      <Banner bannerType="homepage" />
      <NewArrivals query={{ isNewArrival: true }} />
      <CategorySection categories={categories} />
         <NewArrivals query={{ isFeatured: true }} />
      <AboutUs />
    </>
  );
}