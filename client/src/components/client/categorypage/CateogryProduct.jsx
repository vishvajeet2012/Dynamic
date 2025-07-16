import { useEffect } from "react";
import Banner from "../../../shared/Banner";
import { useGetAllCategories, useGetChildCategoryById } from "../../../hooks/useCategories";
import CategorySection from "../../../shared/HomePage/CategorySection";
import ProductCard from "../../../shared/ProductCard";
import RoundedCards from "../../../shared/roundedCard";
import CategoryBanner from "../../../shared/CategoryBanner";
import { useSubcategoryFilters } from "../../../hooks/Product/Product";

export default function CategoryProduct({ Product ,loading ,id }) {
  const { loading:GetAllCategories, error, categories, fetechCategories } = useGetAllCategories();
  const {childCategory, getChildCategoryById, success ,loading:idLoading}=useGetChildCategoryById()
const  {getFiltersForSubcategory, filters:newFilter,loading:filterLoading,error:filterError,success:filterSuccess}  =useSubcategoryFilters()
  useEffect(() => {
    fetechCategories();
    
  }, []);
  useEffect(()=>{
getChildCategoryById(id)
getFiltersForSubcategory(id)
  },[id])

  // Mock filter options (replace with your actual filters)
  const filters = {
    priceRanges: [
      { id: 1, label: "Under $50", value: "0-50" },
      { id: 2, label: "$50 - $100", value: "50-100" },
      { id: 3, label: "$100 - $200", value: "100-200" },
      { id: 4, label: "Over $200", value: "200-1000" },
    ],
    brands: [
      { id: 1, label: "Brand A", value: "brand-a" },
      { id: 2, label: "Brand B", value: "brand-b" },
      { id: 3, label: "Brand C", value: "brand-c" },
    ],
    ratings: [
      { id: 1, label: "4 Stars & Up", value: "4" },
      { id: 2, label: "3 Stars & Up", value: "3" },
      { id: 3, label: "2 Stars & Up", value: "2" },
      { id: 4, label: "1 Star & Up", value: "1" },
    ],
  };

  // Mock pagination (replace with your actual paginatio lsgic)
  const currentPage = 1;
  const totalPages = 5;
console.log(childCategory?.data?.bannerImage)
  return (
    <>
      <section className="w-full">
        <div className="">
          <CategoryBanner loading={idLoading} categoriesBanner={childCategory?.data?.bannerImage}/>
        </div>
       
        <div>
        <RoundedCards  loading={idLoading} categories={childCategory?.data?.childCategory}/>
</div>
        <section className="w-full mt-10 px-4 lg:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block w-full lg:w-1/4 xl:w-1/5 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4">Filters</h3>
              
              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="space-y-2">
                  {filters.priceRanges.map((range) => (
                    <div key={range.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`price-${range.id}`}
                        name="price-range"
                        value={range.value}
                        className="mr-2"
                      />
                      <label htmlFor={`price-${range.id}`}>{range.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Brand</h4>
                <div className="space-y-2">
                  {filters.brands.map((brand) => (
                    <div key={brand.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`brand-${brand.id}`}
                        name="brand"
                        value={brand.value}
                        className="mr-2"
                      />
                      <label htmlFor={`brand-${brand.id}`}>{brand.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Rater */}
              <div className="mb-6 ">
                <h4 className="font-medium mb-2">Customer Rating</h4>
                <div className="space-y-2">
                  {filters.ratings.map((rating) => (
                    <div key={rating.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`rating-${rating.id}`}
                        name="rating"
                        value={rating.value}
                        className="mr-2"
                      />
                      <label htmlFor={`rating-${rating.id}`}>{rating.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-colors">
                Apply Filters
              </button>
            </div>

            {/* Products Grid */}
            <div className="w-full lg:w-3/4 xl:w-4/5">
              {/* Mobile filter button - shown only on mobile */}
              <div className="lg:hidden mb-4">
                <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Filters
                </button>
              </div>

              {/* Sort Options */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600">
                  Showing {Product?.data?.data?.length || 0} products
                </p>
                <div className="flex items-center">
                  <label htmlFor="sort" className="mr-2 text-sm text-gray-600">Sort by:</label>
                  <select
                    id="sort"
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Product?.data?.data?.map((product, idx) => (
                  <div key={idx} className="w-full">
                    <ProductCard item={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <nav className="flex items-center gap-1">
                    <button
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
                    >
                      &laquo;
                    </button>
                    <button
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
                    >
                      &lsaquo;
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`px-3 py-1 rounded-md border ${currentPage === page ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300'}`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
                    >
                      &rsaquo;
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
                    >
                      &raquo;
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </section>
      </section>
    </>
  );
}