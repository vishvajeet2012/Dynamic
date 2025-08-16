"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
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
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-500 text-center">
          Error loading categories.
        </div>
      );
    }

    if (selectedSubcategory) {
      // Child Categories List
      return (
        <div className="space-y-2">
          {selectedSubcategory.childCategory?.length > 0 ? (
            selectedSubcategory.childCategory.map((childCategory) => (
              <DrawerClose key={childCategory._id} asChild>
                <Link
                  to={`/category/${childCategory.childCategoryName}`}
                  className="block p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {childCategory.childCategoryImage && (
                      <img
                        src={childCategory.childCategoryImage}
                        alt={childCategory.childCategoryName}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {childCategory.childCategoryName}
                      </h3>
                      {childCategory.childCategoryDescription && (
                        <p className="text-sm text-gray-500">
                          {childCategory.childCategoryDescription}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </DrawerClose>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No child categories available.
            </div>
          )}
        </div>
      );
    }

    if (selectedCategory) {
      return (
        <div className="space-y-2">
          {selectedCategory.subcategories?.length > 0 ? (
            <>
             
              {selectedCategory.subcategories.map((subcategory) => (
                <div
                  key={subcategory._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <DrawerClose asChild>
                    <Link
                      to={`/category/${subcategory?._id}`}
                      className="flex items-center space-x-3 flex-1"
                    >
                      {subcategory.subCategoryImage && (
                        <img
                          src={subcategory.subCategoryImage}
                          alt={subcategory.subCategoryName}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {subcategory.subCategoryName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {subcategory.childCategory?.length || 0} items
                        </p>
                      </div>
                    </Link>
                  </DrawerClose>
                  {subcategory.childCategory?.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSubcategoryClick(subcategory)}
                      className="ml-2 flex-shrink-0"
                    >
                      View
                    </Button>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="text-center text-gray-500">
              No subcategories available.
            </div>
          )}
        </div>
      );
    }

    // Main Categories List
    return (
      <div className="space-y-2">
        {categories?.length > 0 ? (
          categories.map((category) => (
            <div
              key={category._id}
              onClick={() => handleCategoryClick(category)}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {category.categoryImage && (
                  <img
                    src={category.categoryImage}
                    alt={category.categoryName}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">
                    {category.categoryName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category.subcategories?.length || 0} subcategories
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No categories available.
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
    return "Categories";
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
        <small className="flex flex-col items-center flex-1 justify-center">
          <BiCategoryAlt className="text-xl" />
          <span className="font-medium">Category</span>
        </small>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <div className="mx-auto w-full max-w-sm h-full flex flex-col">
          <DrawerHeader className="pb-4 relative">
            <DrawerTitle className="text-lg font-semibold text-center">
              {getTitle()}
            </DrawerTitle>
            {(selectedCategory || selectedSubcategory) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={getBackButtonAction()}
                className="absolute left-4 top-4 p-2"
              >
                ← Back
              </Button>
            )}
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {renderContent()}
          </div>
          <DrawerFooter className="pt-4 border-t">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full bg-primaryReds text-white font-medium">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}