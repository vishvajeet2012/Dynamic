import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SerachBar from "./search";
import Menu from "./Menu";
import { useGetSingleUser } from "../../hooks/auth/use-Auth";
import { getLogoheader } from "../../hooks/client/homePageHooks/use-headerLogo";
import { RiAccountCircleLine } from "react-icons/ri";
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { AiOutlineHome } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { useWishlist } from "../../../context/wishListhContext";
import { useCart } from "../../../context/cartContext";
// Removed unused FaGrinTongueWink import

export default function Header() {
  const { getLogo, success } = getLogoheader();
  const { getSingleUser, loading: userLoading, user } = useGetSingleUser();
  const { productsWithWishlistStatus } = useWishlist();
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Only one effect for user fetch when token changes
  useEffect(() => {
    if (token) {
      getSingleUser();
    }
  }, [token,]);

  // Optimized token change detection - reduced frequency to prevent performance issues
  useEffect(() => {
    let timeoutId;

    const handleStorageChange = (e) => {
      if (e.key === "token") {
        const newToken = e.newValue;
        if (newToken !== token) {
          setToken(newToken);
        }
      }
    };

    const debouncedTokenCheck = () => {
      const currentToken = localStorage.getItem("token");
      if (currentToken !== token) {
        setToken(currentToken);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const scheduleTokenCheck = () => {
      timeoutId = setTimeout(() => {
        debouncedTokenCheck();
        scheduleTokenCheck();
      }, 5000);
    };

    scheduleTokenCheck();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [token]);

  const {
    cartItems,
    getCartItems,
  } = useCart();

  useEffect(() => {
    getCartItems();
  }, []);

  const totalItems = cartItems?.cart?.length || 0;
  const wishlistCount = productsWithWishlistStatus?.totalItems || 0;
  const isLoggedIn = Boolean(user?.firstName);
  const logoUrl = success?.logo?.url;

  const mobileNavLinks = [
    { href: "/", icon: <AiOutlineHome />, label: "Home" },
    { href: "/categories", icon: <BiCategoryAlt />, label: "Category" },
    {
      href: isLoggedIn ? "/profile" : "/login",
      icon: <CgProfile />,
      label: isLoggedIn ? "Profile" : "Login",
    },
    { href: "/cart", icon: <CiShoppingCart />, label: "Cart" },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden bg-[#e11b23] md:block">
        <div className="w-full bg-[#e11b23] 2xl:max-w-[83rem] 2xl:mx-auto text-white font-bold h-16">
          <div className="flex justify-between items-center h-full px-8">
            <Link to="/" className="w-36 h-16 flex items-center">
              <div className="h-16 w-32 flex items-center justify-center">
                {logoUrl ? (
                  <img
                    className="h-16 w-32 object-cover aspect-[4/5]"
                    src={logoUrl}
                    alt="Logo"
                    loading="eager"
                  />
                ) : (
                  <div className="h-16 w-32 bg-gray-200 animate-pulse"></div>
                )}
              </div>
            </Link>

            <div className="w-full max-w-lg">
              <SerachBar />
            </div>

            <div className="flex items-center space-x-6">
              <Link
                to={isLoggedIn ? "/profile" : "/login"}
                className="flex items-center space-x-2 text-lg hover:text-gray-200"
              >
                <RiAccountCircleLine className="text-2xl" />
                <span className="min-w-[4rem] text-center">
                  {isLoggedIn ? "Account" : "Login"}
                </span>
              </Link>

              <Link to="/wishlist" className="relative flex items-center space-x-2 text-lg hover:text-gray-200">
                <div className="relative">
                  <CiHeart className="text-2xl" />
                  <span 
                    className={`absolute -top-2 left-2 bg-white text-black text-xs font-bold px-1.5 py-0.5 rounded-full transition-opacity duration-200 ${
                      wishlistCount > 0 ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ minWidth: '1.25rem', textAlign: 'center' }}
                  >
                    {wishlistCount || '0'}
                  </span>
                </div>
                <span>Wishlist</span>
              </Link>

              <Link to="/cart" className="relative flex items-center space-x-2 text-lg hover:text-gray-200">
                <div className="relative">
                  <CiShoppingCart className="text-2xl" />
                  <span 
                    className={`absolute -top-2 left-2 bg-white text-black text-xs font-bold px-1.5 py-0.5 rounded-full transition-opacity duration-200 ${
                      totalItems > 0 ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ minWidth: '1.25rem', textAlign: 'center' }}
                  >
                    {totalItems || '0'}
                  </span>
                </div>
                <span>Cart</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-b">
          <Menu />
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden">
        <div className="w-full bg-[#e11b23] p-2 flex justify-between items-center h-16">
          <Link to="/" className="w-24 h-12 flex items-center">
            <div className="h-12 w-24 flex items-center justify-center">
              {logoUrl ? (
                <img 
                  className="h-12 w-24 object-contain" 
                  src={logoUrl} 
                  alt="Logo"
                  loading="eager"
                />
              ) : (
                <div className="h-12 w-24 bg-gray-200 animate-pulse"></div>
              )}
            </div>
          </Link>

          <div className="flex items-center w-full px-2 space-x-3">
            <div className="flex-grow">
              <SerachBar />
            </div>
            <Link to="/wishlist" className="relative">
              <CiHeart className="text-white text-2xl" />
              <span 
                className={`absolute -top-1 -right-2 bg-white text-black text-xs font-bold px-1.5 py-0.5 rounded-full transition-opacity duration-200 ${
                  wishlistCount > 0 ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ minWidth: '1.25rem', textAlign: 'center' }}
              >
                {wishlistCount || '0'}
              </span>
            </Link>
          </div>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-14 text-gray-700 z-40">
          {mobileNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="flex flex-col items-center text-xs flex-1 relative py-2"
            >
              <div className="relative">
                <span className="text-xl">{link.icon}</span>
                {link.label === "Cart" && (
                  <span 
                    className={`absolute -top-2 -right-2 text-white bg-[#e11b23] text-xs font-bold px-1.5 py-0.5 rounded-full transition-opacity duration-200 ${
                      totalItems > 0 ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ minWidth: '1.25rem', textAlign: 'center' }}
                  >
                    {totalItems || '0'}
                  </span>
                )}
              </div>
              <span className="mt-1">{link.label}</span>
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}