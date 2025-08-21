import { useEffect, useState } from 'react';
import { useGetAllCategories } from '../../hooks/useCategories';
import { Link } from 'react-router-dom';

export default function Menu() {
  const { loading, error, categories, fetechCategories } = useGetAllCategories();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    fetechCategories();
  }, []);

  // Handle mouse enter on menu item
  const handleMouseEnter = (categoryId) => {
    setActiveMenu(categoryId);
    setIsHovering(true);
  };

  // Handle mouse leave from menu item
  const handleMouseLeave = () => {
    setIsHovering(false);
    // Add a small delay before closing to allow moving to mega menu
    setTimeout(() => {
      if (!isHovering) {
        setActiveMenu(null);
      }
    }, 150);
  };

  // Handle mouse enter on mega menu
  const handleMegaMenuEnter = () => {
    setIsHovering(true);
  };

  // Handle mouse leave from mega menu
  const handleMegaMenuLeave = () => {
    setIsHovering(false);
    setActiveMenu(null);
  };
 
  if (error) return (
    <div className="p-6 text-center text-red-600 bg-red-50 border border-red-100 rounded-lg">
      Error loading menu: {error}
    </div>
  );

  return (
    <div className="w-full bg-white border-b border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center py-4">
        
          <nav className="flex items-center space-x-8 relative">
            <ul className="flex space-x-6">
              <li>
                <Link
                  to="/" 
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors
                             text-sm font-medium uppercase tracking-wide relative group"
                >
                  Home
                  <span className="absolute -bottom-3 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>

              {/* Categories from your data */}
              {categories?.map((category) => (
                <li 
                  key={category._id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(category._id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={`/category/${category._id}`}
                    className="flex items-center text-gray-700 hover:text-blue-600 transition-colors
                               text-sm font-medium uppercase tracking-wide relative group"
                  >
                    {category.categoryName}
                    <span className="absolute -bottom-3 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <svg 
                        className="w-4 h-4 ml-1 transform transition-transform group-hover:rotate-180" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-4">
            <a 
              href="#" 
              className="flex items-center px-6 py-2 bg-gradient-to-r from-red-600 to-orange-500 
                         text-white rounded-full shadow-lg hover:shadow-xl transition-all
                         text-sm font-semibold uppercase tracking-wide hover:scale-105"
            >
              <span>Hot Deals</span>
              <svg 
                className="w-4 h-4 ml-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {activeMenu && (
        <div 
          className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 z-50"
          onMouseEnter={handleMegaMenuEnter}
          onMouseLeave={handleMegaMenuLeave}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {categories?.filter(category => category._id === activeMenu).map((category) => (
              <div key={category._id}>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  {category.categoryName}
                </h3>

                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-8">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory._id} className="space-y-3">
                        
                        <Link 
                          to={`/category/${subcategory._id}`}
                          className="block font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {subcategory.subCategoryName}
                        </Link>

                        {/* Child Categories List */}
                        {subcategory.childCategory && subcategory.childCategory.length > 0 && (
                          <ul className="space-y-2">
                            {subcategory.childCategory.map((child) => (
                              <li key={child._id}>
                                <Link
                                  to={`/category/${child._id}`}
                                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors block"
                                >
                                  {child.childCategoryName}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}