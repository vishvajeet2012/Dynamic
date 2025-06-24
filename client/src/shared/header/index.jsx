import react from "react";
import SerachBar from "./search";
import { RiAccountCircleLine } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";

import { CiShoppingCart } from "react-icons/ci";
import Menu from "./Menu";
import { Link } from "react-router-dom";
import { getLogoheader } from "../../hooks/client/homePageHooks/use-headerLogo";

export default function Header() {
const {getLogo,loading ,error,success} =   getLogoheader()
   

  return (
    <>
      <div className=" w-full bg-[#e11b23] text-white font-bold h-16">
      <div>
        <div className="flex justify-evenly items-center ">
          <div className="w-28  flex flex-row item-center">
           <img className="h-16 w-28 aspect-square object-cover" src={success?.logo?.url} alt="Logo" /> 
          
          </div>
          <div className="bg-black flex item-center">
            <SerachBar />
          </div>
          <div className="flex flex-row text-xl items-center">
            <RiAccountCircleLine className="text-2xl" />
            <Link to="/login" className="text-lg">login</Link>
          </div>
          <div className="flex text-xl flex-row items-center">
            <CiHeart />

            <p className="text-lg">Wishlist</p>
          </div>

          <div className="text-xl flex items-center flex-row">
            <CiShoppingCart />
            <p className="text-lg ">Cart</p>
          </div>
       
        </div>
        
        </div>
      </div>
      <div className="flex flex-row items-center">
                <Menu/>
      </div>
    </>
  );
}
