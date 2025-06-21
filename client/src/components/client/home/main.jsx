import Header from "../../../shared/header";
import AboutUs from "../../../shared/HomePage/Aboutus";
import UploadImageComponent from "./imageUpload";

export default function Home() {
  return (
    <>

   <Header/>
   <UploadImageComponent/>
   <AboutUs/>

    </>
  );
}