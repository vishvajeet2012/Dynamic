"use client";

import React, { useEffect, useLayoutEffect, useState, useMemo } from "react";
import { ChevronRight, ArrowLeft, X, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { BiCategoryAlt } from "react-icons/bi";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useGetAllCategories } from "../../hooks/useCategories";

export function MobileCategory() {
  const { loading, error, categories, fetechCategories } = useGetAllCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useLayoutEffect(() => {
    fetechCategories();
  }, []);

  // Function to remove duplicates based on ID
  const removeDuplicatesById = (array, idKey = '_id') => {
    const seen = new Set();
    return array.filter(item => {
      if (seen.has(item[idKey])) {
        return false;
      }
      seen.add(item[idKey]);
      return true;
    });
  };

  // Clean and process categories data
  const cleanedCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    // Remove duplicate categories
    const uniqueCategories = removeDuplicatesById(categories);

    // Process each category and clean subcategories and child categories
    return uniqueCategories.map(category => ({
      ...category,
      subcategories: category.subcategories 
        ? removeDuplicatesById(category.subcategories).map(subcategory => ({
            ...subcategory,
            childCategory: subcategory.childCategory 
              ? removeDuplicatesById(subcategory.childCategory, 'childCategoryName')
              : []
          }))
        : []
    }));
  }, [categories]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const handleBackToSubcategories = () => {
    setSelectedSubcategory(null);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#e11b23] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BiCategoryAlt className="text-[#e11b23] text-lg" />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">Loading categories...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-center">
            <p className="text-red-600 font-semibold">Oops! Something went wrong</p>
            <p className="text-gray-500 text-sm mt-1">Unable to load categories</p>
          </div>
          <Button 
            onClick={() => fetechCategories()}
            className="bg-[#e11b23] hover:bg-[#c41520] text-white px-6 py-2 rounded-full"
          >
            Try Again
          </Button>
        </div>
      );
    }

    if (selectedSubcategory) {
      return (
        <div className="space-y-3">
          {selectedSubcategory.childCategory?.length > 0 ? (
            selectedSubcategory.childCategory.map((childCategory, index) => (
              <DrawerClose key={childCategory._id || childCategory.childCategoryName} asChild>
                <Link
                  to={`/category/${childCategory.childCategoryName}`}
                  className="group block p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#e11b23]/20 transition-all duration-200 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {childCategory.childCategoryImage ? (
                        <img
                          src={childCategory.childCategoryImage}
                          alt={childCategory.childCategoryName}
                          className="w-14 h-14 rounded-xl object-cover border-2 border-gray-100 group-hover:border-[#e11b23]/30 transition-colors"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-[#e11b23]/10 to-[#e11b23]/20 rounded-xl flex items-center justify-center">
                          <Package className="w-6 h-6 text-[#e11b23]" />
                        </div>
                      )}
                   
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#e11b23] transition-colors truncate">
                        {childCategory.childCategoryName}
                      </h3>
                      {childCategory.childCategoryDescription && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {childCategory.childCategoryDescription}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#e11b23] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </DrawerClose>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-gray-600 font-medium">No items found</p>
                <p className="text-gray-400 text-sm">This category is empty</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedCategory) {
      return (
        <div className="space-y-3">
          {selectedCategory.subcategories?.length > 0 ? (
            selectedCategory.subcategories.map((subcategory, index) => (
              <div
                key={subcategory._id}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#e11b23]/20 transition-all duration-200 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center p-4">
                  <DrawerClose asChild>
                    <Link
                      to={`/category/${subcategory?._id}`}
                      className="flex items-center space-x-4 flex-1 min-w-0"
                    >
                      <div className="relative">
                        {subcategory.subCategoryImage ? (
                          <img
                            src={subcategory.subCategoryImage}
                            alt={subcategory.subCategoryName}
                            className="w-14 h-14 rounded-xl object-cover border-2 border-gray-100 group-hover:border-[#e11b23]/30 transition-colors"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-[#e11b23]/10 to-[#e11b23]/20 rounded-xl flex items-center justify-center">
                            <BiCategoryAlt className="w-6 h-6 text-[#e11b23]" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                          <div className="w-3 h-3 bg-[#e11b23] rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#e11b23] transition-colors truncate">
                          {subcategory.subCategoryName}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#e11b23]/10 text-gray-500">
                            {subcategory.childCategory?.length || 0} items
                          </span>
                        </div>
                      </div>
                    </Link>
                  </DrawerClose>
                  {subcategory.childCategory?.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSubcategoryClick(subcategory)}
                      className="ml-3 h-9 px-4 bg-[#e11b23]/5 hover:bg-[#e11b23]/10 text-black border border-[#e11b23]/20 hover:border-[#e11b23]/30 rounded-lg font-medium transition-all"
                    >
                      View All
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <BiCategoryAlt className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-gray-600 font-medium">No subcategories found</p>
                <p className="text-gray-400 text-sm">This category is empty</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {cleanedCategories?.length > 0 ? (
          cleanedCategories.map((category, index) => (
            <div
              key={category._id}
              onClick={() => handleCategoryClick(category)}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#e11b23]/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInUp 0.5s ease-out forwards'
              }}
            >
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="relative">
                    {category.categoryImage ? (
                      <img
                        src={category.categoryImage}
                        alt={category.categoryName}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100 group-hover:border-[#e11b23]/30 transition-colors"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-[#e11b23]/10 to-[#e11b23]/20 rounded-xl flex items-center justify-center">
                        <BiCategoryAlt className="w-8 h-8 text-[#e11b23]" />
                      </div>
                    )}
                    <div className="absolute -top-2 -right-2 bg-[#e11b23] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#e11b23] transition-colors text-lg truncate">
                      {category.categoryName}
                    </h3>
                    {/* <div className="flex items-center space-x-2 mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-[#e11b23]/10 to-[#e11b23]/5 text-[#e11b23] border border-[#e11b23]/20">
                        {category.subcategories?.length || 0} subcategories
                      </span>
                    </div> */}
                  </div>
                </div>
                <div className="bg-[#e11b23]/10 rounded-full p-2 group-hover:bg-[#e11b23] transition-all duration-300">
                  <ChevronRight className="w-5 h-5 text-[#e11b23] group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <BiCategoryAlt className="w-10 h-10 text-gray-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#e11b23] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-gray-700 font-semibold text-lg">No Categories Available</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                We're working on adding categories. Please check back soon!
              </p>
            </div>
            <Button 
              onClick={() => fetechCategories()}
              className="bg-[#e11b23] hover:bg-[#c41520] text-white px-6 py-2 rounded-full font-medium"
            >
              Refresh Categories
            </Button>
          </div>
        )}
      </div>
    );
  };

  const getTitle = () => {
    if (selectedSubcategory) {
      return selectedSubcategory.subCategoryName;
    }
    if (selectedCategory) {
      return selectedCategory.categoryName;
    }
    return "Browse Categories";
  };

  const getBackButtonAction = () => {
    if (selectedSubcategory) {
      return handleBackToSubcategories;
    }
    if (selectedCategory) {
      return handleBackToCategories;
    }
    return null;
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="flex flex-col items-center flex-1 justify-center  p-3 rounded-lg hover:bg-[#e11b23]/5 transition-colors group">
          <div className="">
            <BiCategoryAlt className="text-2xl text-gray-600 group-hover:text-[#e11b23] transition-colors" />
          </div>
          <span className="font-semibold text-sm text-gray-700 group-hover:text-[#e11b23] transition-colors">
            Categories
          </span>
        </button>
      </DrawerTrigger>
      
      <DrawerContent className="h-[85vh] bg-gray-50">
        <div className="mx-auto w-full max-w-md h-full flex flex-col">
          <DrawerHeader className="relative bg-white border-b border-gray-100 rounded-t-3xl">
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full"></div>
            
            <div className="flex items-center justify-between pt-6 pb-4">
              {(selectedCategory || selectedSubcategory) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={getBackButtonAction()}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Button>
              )}
              
              <DrawerTitle className="text-xl font-bold text-gray-900 mx-auto">
                {getTitle()}
              </DrawerTitle>
              
              <div className="w-9"></div> 
            </div>
            
            {(selectedCategory || selectedSubcategory) && (
              <div className="flex items-center space-x-2 pb-2">
                <span className="text-sm text-gray-500">Categories</span>
                {selectedCategory && (
                  <>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-[#e11b23] font-medium">
                      {selectedCategory.categoryName}
                    </span>
                  </>
                )}
                {selectedSubcategory && (
                  <>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-[#e11b23] font-medium">
                      {selectedSubcategory.subCategoryName}
                    </span>
                  </>
                )}
              </div>
            )}
          </DrawerHeader>
          
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {renderContent()}
          </div>
          
          <DrawerFooter className="bg-white border-t border-gray-100 p-4">
            <DrawerClose asChild>
              <Button className="w-full bg-[#e11b23] hover:bg-[#c41520] text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all">
                Close Categories
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Drawer>
  );
}