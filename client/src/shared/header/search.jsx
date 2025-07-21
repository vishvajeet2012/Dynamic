// src/components/SearchBar/SearchBar.js

import { useState, useEffect, useRef } from "react";
import { useSearchPage } from "../../hooks/use-searchpage";
import { Search, X, ImageOff, LoaderCircle } from "lucide-react";

// Custom hook for debouncing a value
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to cancel the timeout if value changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// --- Sub-components for cleaner structure ---

const SearchResultItem = ({ product }) => (
  <div className="p-3 hover:bg-gray-100/80 flex flex-col md:flex-row md:items-center transition-colors duration-150">
    {/* Image Container */}
    <div className="flex-shrink-0 w-full h-40 md:w-16 md:h-16 bg-gray-200 rounded-md overflow-hidden">
      {product.images?.[0]?.imagesUrls ? (
        <img
          src={product.images[0].imagesUrls}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
          <ImageOff size={24} />
        </div>
      )}
    </div>

    {/* Details Container */}
    <div className="mt-3 md:mt-0 md:ml-4 flex-1">
      <h4 className="text-base font-semibold text-gray-800">{product.name}</h4>
      <div className="flex items-baseline mt-1">
        <span className="text-base font-bold text-black">
          ₹{product.sellingPrice}
        </span>
        {product.discount > 0 && (
          <>
            <span className="ml-2 text-sm line-through text-gray-500">
              ₹{product.basePrice}
            </span>
            <span className="ml-2 text-sm font-medium text-emerald-600">
              {product.discount}% off
            </span>
          </>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {product.category?.categoryName} • {product.color}
      </div>
    </div>
  </div>
);

const SearchSkeleton = () => (
  <div className="p-4 space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center animate-pulse">
        <div className="w-16 h-16 bg-gray-300 rounded-md"></div>
        <div className="ml-4 flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

// --- Main SearchBar Component ---

export default function SearchBar() {
  const { searchPage, searchResult, loading, error } = useSearchPage();
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const searchBarRef = useRef(null);

  // Effect for handling debounced search
  useEffect(() => {
    if (debouncedSearchTerm.length >= 1) {
      searchPage(debouncedSearchTerm);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [debouncedSearchTerm, searchPage]);
  
  // Effect for closing results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchBarRef]);

  return (
    <div className=" w-64 lg:w-[40rem]" ref={searchBarRef}>
      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder="Search products..."
          className="w-full rounded-md py-2 pl-10 pr-4 outline-none border-2 border-transparent bg-white text-black focus:border-blue-500 shadow-sm"
        />
      </div>
      
      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white shadow-lg rounded-lg max-h-[70vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b sticky top-0 bg-white/95 backdrop-blur-sm">
            <h3 className="font-semibold text-gray-800">
              {loading ? (
                <span className="flex items-center text-gray-600">
                   <LoaderCircle size={16} className="mr-2 animate-spin" /> Searching...
                </span>
              ) : (
                `${searchResult?.count || 0} results found`
              )}
            </h3>
            <button 
              onClick={() => setShowResults(false)}
              className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close search results"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Body */}
          <div className="overflow-hidden">
            {loading && !searchResult ? (
              <SearchSkeleton />
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : searchResult?.product?.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {searchResult.product.map((product) => (
                  <SearchResultItem key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No products found for "{debouncedSearchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}