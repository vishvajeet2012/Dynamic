import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SerachBar from "./search";
import Menu from "./Menu";
import { useAuth } from "../../../context/authConext";
import { getLogoheader } from "../../hooks/client/homePageHooks/use-headerLogo";
import { useGetSingleUser } from "../../hooks/auth/use-Auth";

// Icons
import { RiAccountCircleLine } from "react-icons/ri";
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { AiOutlineHome } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";

export default function Header() {
  const { getLogo, success } = getLogoheader();
  const { getSingleUser, laoding: userLoading, user } = useGetSingleUser();

  const token = localStorage.getItem('token');

  useEffect(() => {
    getSingleUser();
  }, [token]);

  const mobileNavLinks = [
    { href: "/", icon: <AiOutlineHome />, label: "Home" },
    { href: "/categories", icon: <BiCategoryAlt />, label: "Category" },
    {
      href: user?.firstName ? "/profile" : "/login",
      icon: <CgProfile />,
      label: user?.firstName ? "Profile" : "Login",
    },
    { href: "/cart", icon: <CiShoppingCart />, label: "Cart" },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block">
        <div className="w-full bg-[#e11b23] text-white font-bold h-16">
          <div className="flex justify-between items-center h-full px-8">
            <Link to="/" className="w-32">
              {success?.logo?.url && (
                <img
                  className="h-16 w-32 object-contain"
                  src={success.logo.url}
                  alt="Logo"
                />
              )}
            </Link>

            <div className="w-full max-w-lg">
              <SerachBar />
            </div>

            <div className="flex items-center space-x-6">
              <Link
                to={user?.firstName ? "/profile" : "/login"}
                className="flex items-center space-x-2 text-lg hover:text-gray-200"
              >
                <RiAccountCircleLine className="text-2xl" />
                {userLoading ? <span>...</span> : <span>{user?.firstName || "Login"}</span>}
              </Link>

              <Link to="/wishlist" className="flex items-center space-x-2 text-lg hover:text-gray-200">
                <CiHeart className="text-2xl" />
                <span>Wishlist</span>
              </Link>

              <Link to="/cart" className="flex items-center space-x-2 text-lg hover:text-gray-200">
                <CiShoppingCart className="text-2xl" />
                <span>Cart</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Category Menu */}
        <div className="border-b">
          <Menu />
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden ">
        {/* Top Bar */}
        <div className="w-full bg-[#e11b23] p-2 flex justify-between items-center">
          <Link to="/" className="w-24">
            {success?.logo?.url && (
              <img
                className="h-12 w-24 object-contain"
                src={success.logo.url}
                alt="Logo"
              />
            )}
          </Link>

          <div className="flex items-center w-full px-2 space-x-3">
            <div className="flex-grow">
              <SerachBar />
            </div>
            <Link to="/wishlist">
              <CiHeart className="text-white text-2xl" />
            </Link>
          </div>
        </div>

        {/* Bottom Nav - Static & Clean */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-14 text-gray-700">
          {mobileNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="flex flex-col items-center text-xs flex-1"
            >
              <span className="text-xl">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
