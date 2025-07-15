import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SerachBar from "./search";
import Menu from "./Menu";
import { useAuth } from "../../../context/authConext";
import { getLogoheader } from "../../hooks/client/homePageHooks/use-headerLogo";
import { useGetSingleUser, useGuestUserCreate } from "../../hooks/auth/use-Auth";

// Icons
import { RiAccountCircleLine } from "react-icons/ri";
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { AiOutlineHome } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";

export default function Header() {
  const { getLogo, loading, error, success } = getLogoheader();
  const { login: authLogin } = useAuth();
  const { guestUserCreate } = useGuestUserCreate();
  const { getSingleUser, laoding: userLoading, user } = useGetSingleUser();

  const [showBottomNav, setShowBottomNav] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    getSingleUser();
  }, []);

  useEffect(() => {
    getSingleUser();
  }, [token]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setShowBottomNav(false); // scrolling down
      } else {
        setShowBottomNav(true); // scrolling up
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <div className="flex justify-evenly items-center h-full">
            <Link to="/" className="w-32 flex-shrink-0">
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

              <Link
                to="/wishlist"
                className="flex items-center space-x-2 text-lg hover:text-gray-200"
              >
                <CiHeart className="text-2xl" />
                <span>Wishlist</span>
              </Link>

              <Link
                to="/cart"
                className="flex items-center space-x-2 text-lg hover:text-gray-200"
              >
                <CiShoppingCart className="text-2xl" />
                <span>Cart</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center border-b">
          <Menu />
        </div>
      </header>

      {/* Mobile Header */}
      <div className="md:hidden">
        {/* Top Bar */}
        <div className="w-full bg-[#e11b23] p-2 flex justify-between items-center">
          <Link to="/" className="w-24 flex-shrink-0">
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

        {/* Bottom Nav */}
        <nav
          className={`fixed bottom-0 left-0 right-0 bg-white shadow-[0_-1px_4px_rgba(0,0,0,0.1)] flex justify-around items-center h-16 text-gray-700 transition-transform duration-300 ${
            showBottomNav ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {mobileNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="flex flex-col items-center justify-center text-xs flex-1"
            >
              <span className="text-2xl mb-1">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="h-16" />
      </div>
    </>
  );
}
