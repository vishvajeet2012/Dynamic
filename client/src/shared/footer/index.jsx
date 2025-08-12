import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { getLogoheader } from '../../hooks/client/homePageHooks/use-headerLogo';
// Assuming you have a similar hook to fetch the logo for the footer
// If not, you can reuse the one from the header or pass the logo URL as a prop.

export default function Footer() {
  // You can reuse the same logo fetching logic as in your header
  const { getLogo, loading, error, success: logoData } = getLogoheader();

  useEffect(() => {
    // Fetch the logo when the component mounts
    getLogo();
  }, []);

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Left Section: Logo and About */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              {loading ? (
                <div className="h-12 w-32 bg-gray-700 rounded animate-pulse"></div>
              ) : error ? (
                <p className="text-red-400">Error loading logo</p>
              ) : (
                <img 
                  className="h-12 w-auto object-contain" 
                  src={logoData?.logo?.url} 
                  alt="Company Logo" 
                  onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/128x48/1f2937/ffffff?text=Logo'; }}
                />
              )}
            </Link>
            <p className="text-sm text-gray-400">
              Your one-stop destination for the latest trends in fashion. We provide high-quality clothing for men, women, and kids.
            </p>
          </div>

          {/* Middle Section 1: Shop Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/category/men" className="text-gray-400 hover:text-white transition-colors">Men</Link></li>
              <li><Link to="/category/women" className="text-gray-400 hover:text-white transition-colors">Women</Link></li>
              <li><Link to="/category/kids" className="text-gray-400 hover:text-white transition-colors">Kids</Link></li>
              <li><Link to="/category/sneakers" className="text-gray-400 hover:text-white transition-colors">Sneakers</Link></li>
              <li><Link to="/category/shocks" className="text-gray-400 hover:text-white transition-colors">Shocks</Link></li>
            </ul>
          </div>

          {/* Middle Section 2: Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Help</h3>
            <ul className="space-y-3">
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-400 hover:text-white transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/track-order" className="text-gray-400 hover:text-white transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Right Section: Newsletter and Social */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white uppercase tracking-wider">Stay Connected</h3>
            <p className="text-sm text-gray-400">Subscribe to our newsletter for the latest updates and offers.</p>
            <form>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button 
                  type="submit"
                  className="bg-[#e11b23] text-white font-bold px-4 py-2 rounded-r-md hover:bg-red-700 transition-colors"
                >
                  Join
                </button>
              </div>
            </form>
            <div className="flex space-x-4 items-center">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaFacebookF size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaTwitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaYoutube size={20} /></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} The V Store. All Rights Reserved.</p>
          <p className="mt-2">Designed with passion.</p>
        </div>
      </div>
    </footer>
  );
}
