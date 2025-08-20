import { useEffect, useState } from "react";
import Banner from "../../../shared/Banner";
import { useGetAllCategories, useGetChildCategoryById } from "../../../hooks/useCategories";
import CategorySection from "../../../shared/HomePage/CategorySection";
import ProductCard from "../../../shared/ProductCard";
import RoundedCards from "../../../shared/roundedCard";
import CategoryBanner from "../../../shared/CategoryBanner";
import { useSubcategoryFilters } from "../../../hooks/Product/Product";
import FullScreenLoader from "../../../shared/loading";
import AdaptiveProductCard2 from "../../../shared/productcard2";

export default function CategoryProduct({ setData, Products, Productloading, id }) {
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [Product, setProduct] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const { GetAllCategories, error, categories, fetechCategories } = useGetAllCategories();
  const { childCategory, getChildCategoryById, success, loading: idLoading } = useGetChildCategoryById();
  const { getFiltersForSubcategory, filters, loading: filterLoading, error: filterError, success: filterSuccess } = useSubcategoryFilters();
const [pageSelect ,setPageSelect] = useState()
  useEffect(() => {
    fetechCategories();
  }, []);

  useEffect(() => {
    getChildCategoryById(id);
    getFiltersForSubcategory(id);
  }, [id]);

  const handlePriceChange = (priceRange) => {
    setSelectedPrice((prevSelected) =>
      prevSelected.includes(priceRange)
        ? prevSelected.filter((price) => price !== priceRange)
        : [...prevSelected, priceRange]
    );
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brandId)
        ? prevSelected.filter((id) => id !== brandId)
        : [...prevSelected, brandId]
    );
  };

  const handleThemeChange = (themeName) => {
    setSelectedThemes((prevSelected) =>
      prevSelected.includes(themeName)
        ? prevSelected.filter((theme) => theme !== themeName)
        : [...prevSelected, themeName]
    );
  };

  const applyFilters = () => {
    setData({ 
      childCategoryIds: selectedBrands,
      priceRanges: selectedPrice,
      themes: selectedThemes,
     
    });
    setShowMobileFilters(false);
  };

  const clearAllFilters = () => {
    setSelectedPrice([]);
    setSelectedBrands([]);
    setSelectedThemes([]);
    setData({ 
      childCategoryIds: [],
      priceRanges: [],
      themes: []
    });
  };

  useEffect(() => {
    setProduct(Products);
  }, [Products]);

  const hanldePages =(e) =>{

      setPageSelect(e)

  }

  useEffect(() => {
    setData({ 
      childCategoryIds: selectedBrands,
      priceRanges: selectedPrice,
      themes: selectedThemes,
     
      page:pageSelect
    });
  }, [selectedBrands, selectedPrice, selectedThemes,pageSelect]);

  const currentPage = Product?.data?.page||1
  const totalPages = Product?.data?.pages||5;

  const FilterComponent = ({ isMobile = false }) => (
    <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 ${isMobile ? 'h-full overflow-y-auto' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Filters</h3>
        {isMobile && (
          <button 
            onClick={() => setShowMobileFilters(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {(selectedPrice.length > 0 || selectedBrands.length > 0 || selectedThemes.length > 0) && (
        <button
          onClick={clearAllFilters}
          className="w-full mb-4 text-sm text-red-600 hover:text-red-800 underline"
        >
          Clear All Filters
        </button>
      )}
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-2 flex items-center">
          Price Range
          {selectedPrice.length > 0 && (
            <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              {selectedPrice.length}
            </span>
          )}
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {filters?.priceFilters?.map((range) => (
            <div key={range} className="flex items-center">
              <input
                type="checkbox"
                id={`price-${range}-${isMobile ? 'mobile' : 'desktop'}`}
                name="price-range"
                value={range}
                className="mr-2 h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                checked={selectedPrice.includes(range)}
                onChange={() => handlePriceChange(range)}
              />
              <label htmlFor={`price-${range}-${isMobile ? 'mobile' : 'desktop'}`} className="text-sm">
                {range}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-medium mb-2 flex items-center">
            Categorys
          {selectedBrands.length > 0 && (
            <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              {selectedBrands.length}
            </span>
          )}
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {filters?.childCategories?.map((brand) => (
            <div key={brand.id} className="flex items-center">
              <input
                type="checkbox"
                id={`brand-${brand._id}-${isMobile ? 'mobile' : 'desktop'}`}
                name="brand"
                value={brand.id}
                className="mr-2 h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                checked={selectedBrands.includes(brand._id)}
                onChange={() => handleBrandChange(brand._id)}
              />
              <label htmlFor={`brand-${brand._id}-${isMobile ? 'mobile' : 'desktop'}`} className="text-sm">
                {brand.childCategoryName}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-2 flex items-center">
          Theme
          {selectedThemes.length > 0 && (
            <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              {selectedThemes.length}
            </span>
          )}
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {filters?.themeSet?.map((theme) => (
            <div key={theme} className="flex items-center">
              <input
                type="checkbox"
                id={`theme-${theme}-${isMobile ? 'mobile' : 'desktop'}`}
                name="theme"
                value={theme}
                className="mr-2 h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                checked={selectedThemes.includes(theme)}
                onChange={() => handleThemeChange(theme)}
              />
              <label htmlFor={`theme-${theme}-${isMobile ? 'mobile' : 'desktop'}`} className="text-sm">
                {theme}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={applyFilters}
        className="w-full bg-[#e11b23] text-white py-2 rounded-md hover:bg-red-700 transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );

  return (
    <>
      <section className="w-full">
        <div className="">
          <CategoryBanner loading={idLoading} categoriesBanner={childCategory?.data?.bannerImage} />
        </div>
       
        <div>
          <RoundedCards loading={idLoading} categories={childCategory?.data?.childCategory} />
        </div>
        
        <section className="w-full lg:mt-10 px-4 lg:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="hidden lg:block w-full lg:w-1/4 xl:w-1/5">
              <FilterComponent />
            </div>

            <div className="w-full lg:w-3/4 xl:w-4/5">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-4">
                <button 
                  onClick={() => setShowMobileFilters(true)}
                  className="w-full bg-[#e11b23] text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Filters
                  {(selectedPrice.length + selectedBrands.length + selectedThemes.length > 0) && (
                    <span className="ml-2 bg-white text-red-600 text-xs px-2 py-1 rounded-full">
                      {selectedPrice.length + selectedBrands.length + selectedThemes.length}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Showing {Product?.data?.count || 0} of {Product?.data?.total || 0} products
                  </p>
                  {(selectedPrice.length > 0 || selectedBrands.length > 0 || selectedThemes.length > 0) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedPrice.length + selectedBrands.length + selectedThemes.length} filters applied
                    </p>
                  )}
                </div>
                {/* <div className="flex items-center w-full sm:w-auto">
                  <label htmlFor="sort" className="mr-2 text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
                  <select
                    id="sort"
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm w-full sm:w-auto"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div> */}
              </div>

              {Productloading ? (
                <div className="flex justify-center items-center h-[95rem]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e11b23]"></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
                    {Product?.data?.data?.map((product) => (
                      <div key={product._id} className="w-full">
                        <AdaptiveProductCard2 item={product} />
                      </div>
                    ))}
                  </div>

             
                  {totalPages > 1 && (
                    <div className="flex justify-center my-10">
                      <nav className="flex items-center gap-1">
                      
                        <button
                        onClick={()=>hanldePages(currentPage-1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
                        >
                          &lsaquo;
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button 
                          
                            key={page}
                            className={`px-3 py-1 rounded-md border transition-colors ${
                              currentPage === page 
                                ? 'bg-[#e11b23] text-white border-[#e11b23]' 
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                           onClick={()=>hanldePages(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
                        >
                          &rsaquo;
                        </button>
                    
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)}></div>
            <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl">
              <FilterComponent isMobile={true} />
            </div>
          </div>
        )}
      </section>
    </>
  );
}