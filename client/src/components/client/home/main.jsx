import { use, useEffect } from "react";
import Banner from "../../../shared/Banner";
import Header from "../../../shared/header";
import AboutUs from "../../../shared/HomePage/Aboutus";
import NewArrivals from "../../../shared/NewArrivals";
import UploadImageComponent from "./imageUpload";
import { useGetProduct } from "../../../hooks/Product/Product";

export default function Home() {


  return (
    <>

  
   <Banner bannerType="homepage"/>
   <NewArrivals />
   <AboutUs/>

    </>
  );
}