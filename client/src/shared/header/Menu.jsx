import { useEffect } from 'react';
import { useGetAllCategories } from '../../hooks/useCategories';
import { Link } from 'react-router-dom';

export default function Menu() {
  const { loading, error, categories, fetechCategories } = useGetAllCategories();

  useEffect(() => {
    fetechCategories();
  }, []);
 
  
  if (error) return (
    <div className="p-6 text-center text-red-600 bg-red-50 border border-red-100 rounded-lg">
      Error loading menu: {error}
    </div>
  );

  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center py-4">
        
          <nav className="flex items-center space-x-8">
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
              {categories?.filter((category) => category.isActive===true)?.map((category) => (
                <li key={category._id}>
                  <a 
                    href="#" 
                    className="flex items-center text-gray-700 hover:text-blue-600 transition-colors
                               text-sm font-medium uppercase tracking-wide relative group"
                  >
                    {category.categoryName}
                    <span className="absolute -bottom-3 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Deals Section */}
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
    </div>
  );
}