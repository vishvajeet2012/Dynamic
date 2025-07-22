// src/components/SearchBar/SearchBar.js
import { useState, useEffect, useRef } from "react";
import { Search, X, ImageOff, LoaderCircle } from "lucide-react";
import { useSearchPage } from "../../hooks/use-searchpage";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  const { searchPage, searchResult, loading, error } = useSearchPage();

  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      searchPage(debouncedQuery);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
      {/* Search Input */}
      <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="w-full outline-none text-sm text-black placeholder-gray-400 bg-transparent"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white border rounded-md shadow-lg max-h-[70vh] overflow-y-auto z-50">
          <div className="sticky top-0 bg-white px-4 py-3 border-b flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {loading ? (
                <span className="flex items-center gap-1 text-gray-500">
                  <LoaderCircle size={16} className="animate-spin" /> Searching...
                </span>
              ) : (
                `${searchResult?.count || 0} results found`
              )}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div>
            {loading ? (
              <SearchSkeleton />
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : searchResult?.product?.length > 0 ? (
              searchResult.product.map((product) => (
                <div
                  key={product._id}
                  className="flex gap-4 items-start hover:bg-gray-50 transition px-4 py-3 border-b"
                >
                  <div className="w-16 h-16 rounded-md bg-gray-200 overflow-hidden flex-shrink-0">
                    {product.images?.[0]?.imagesUrls ? (
                      <img
                        src={product.images[0].imagesUrls}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageOff size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-800">{product.name}</h4>
                    <div className="text-sm text-black font-bold mt-1">
                      ₹{product.sellingPrice}
                      {product.discount > 0 && (
                        <span className="ml-2 text-xs line-through text-gray-500">
                          ₹{product.basePrice}
                        </span>
                      )}
                      {product.discount > 0 && (
                        <span className="ml-2 text-xs text-green-600">{product.discount}% off</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {product.category?.categoryName} • {product.color}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 text-sm">
                No products found for "{debouncedQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const SearchSkeleton = () => (
  <div className="p-4 space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 animate-pulse">
        <div className="w-16 h-16 bg-gray-300 rounded-md"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);