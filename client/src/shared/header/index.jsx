import react from "react";
import logo from "../../../public/images/s.jpg";
import SerachBar from "./search";
import { RiAccountCircleLine } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";

import { CiShoppingCart } from "react-icons/ci";
import Menu from "./Menu";

export default function Header() {
  return (
    <>
      <div className=" w-full bg-[#e11b23] text-white font-bold h-16">
      <div>
        <div className="flex py-5 justify-evenly items-center ">
          <div className="w-12  flex flex-row item-center">
            {/* <img className="h-16 w-12 aspect-square object-cover" src={logo} alt="Logo" /> */}
            <h1 className="text-2xl font-bold">Logo</h1>
          </div>
          <div className="bg-black flex item-center">
            <SerachBar />
          </div>
          <div className="flex flex-row text-xl items-center">
            <RiAccountCircleLine className="text-2xl" />
            <p className="text-lg">login</p>
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
