import { useState, useEffect } from 'react';
import { useCreateProduct, useSearchThemeNames } from "../../../hooks/Product/Product";
import { useUplaodImage } from '../../../hooks/client/homePageHooks/use-banner';
import { useGetAllCategories } from '../../../hooks/useCategories';

export default function CreateAdminProduct() {
  const { uploadImage, loading: uploadLoading, error: uploadError } = useUplaodImage();
  const { createProduct, loading, error, success } = useCreateProduct();
  
  // Changed to arrays to store multiple images
  const [imagesUrls, setImageUrls] = useState([]);
  const [publicIds, setPublicIds] = useState([]);
  
  const { categories, loading: categoriesLoading, error: categoriesError, fetechCategories } = useGetAllCategories();
  const { searchThemeNames, themeNames } = useSearchThemeNames();

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    basePrice: '',
    sellingPrice: '',
    discount: 0,
    color: '',
    size: [],
    gender: 'unisex',
    category: '',
    subcategories: [],
    childCategories: [],
    stock: 0,
    isNewArrival: false,
    images: [],
    slug: '',
    theme: "",
    isFeatured: false,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    fetechCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'category' && { subcategories: [], childCategories: [] })
    }));
    
    if (name === 'theme') {
      searchThemeNames(value);
    }
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setProductData(prev => {
      if (checked) {
        return { ...prev, size: [...prev.size, value] };
      } else {
        return { ...prev, size: prev.size.filter(size => size !== value) };
      }
    });
  };

  const selectedCategory = categories?.find(cat => cat._id === productData.category);
  const activeSubcategories = selectedCategory?.subcategories?.filter(sub => sub.isActive) || [];

  const handleSubcategoryChange = (e) => {
    const { value, checked } = e.target;
    const subcategory = activeSubcategories.find(sub => sub._id === value);
    const childIdsOfThisSub = subcategory?.childCategory?.map(child => child._id) || [];

    setProductData(prev => {
      const newSubcategories = checked
        ? [...prev.subcategories, value]
        : prev.subcategories.filter(id => id !== value);

      const newChildCategories = checked
        ? prev.childCategories
        : prev.childCategories.filter(childId => !childIdsOfThisSub.includes(childId));

      return {
        ...prev,
        subcategories: newSubcategories,
        childCategories: newChildCategories,
      };
    });
  };

  const handleChildCategoryChange = (e) => {
    const { value, checked } = e.target;
    setProductData(prev => {
      const newChildCategories = checked
        ? [...prev.childCategories, value]
        : prev.childCategories.filter(id => id !== value);
      return { ...prev, childCategories: newChildCategories };
    });
  };

  // Modified image upload function to handle multiple images
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Upload each file individually and accumulate the results
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("image", file);

      try {
        const uploadResult = await uploadImage(formData);
        if (uploadResult.url) {
          // Create image object with the required schema format
          const imageObject = {
            publicIds: uploadResult.publicId,
            imagesUrls: uploadResult.url
          };
          
          // Add new image object to existing arrays
          setImageUrls(prev => [...prev, imageObject]);
          setPublicIds(prev => [...prev, uploadResult.publicId]); // Keep this for easy access if needed
          
          // Add to preview images
          const preview = URL.createObjectURL(file);
          setPreviewImages(prev => [...prev, preview]);
          setImageFiles(prev => [...prev, file]);
        } else {
          throw new Error('Image upload failed to return a URL.');
        }
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        // You might want to show this error to the user
        alert(`Failed to upload image ${i + 1}: ${uploadError.message}`);
        continue; // Continue with next image even if one fails
      }
    }

    // Clear the file input after processing
    e.target.value = '';
  };

  // Function to remove a specific image
  const removeImage = (indexToRemove) => {
    setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    setPublicIds(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviewImages(prev => {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prev[indexToRemove]);
      return prev.filter((_, index) => index !== indexToRemove);
    });
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if at least one image is uploaded
    if (imagesUrls.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    const productToCreate = {
      name: productData.name,
      isFeatured: productData.isFeatured,
      slug: productData.slug,
      description: productData.description,
      basePrice: parseFloat(productData.basePrice),
      sellingPrice: parseFloat(productData.sellingPrice),
      discount: parseInt(productData.discount),
      color: productData.color,
      gender: productData.gender,
      category: productData.category,
      stock: parseInt(productData.stock),
      isNewArrival: productData.isNewArrival,
      images: imagesUrls, // Now contains array of objects with publicIds and imagesUrls
      size: productData.size,
      subcategories: productData.subcategories,
      childCategory: productData.childCategories,
      theme: productData.theme
    };

    console.log('Product payload:', productToCreate); // For debugging
    await createProduct(productToCreate);
  };

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'OS'];
  const genderOptions = ['men', 'women', 'unisex'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">Product created successfully!</div>}
      {categoriesError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">Failed to load categories: {categoriesError}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Product Name*</label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description*</label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                rows="4"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Base Price*</label>
                <input
                  type="number"
                  name="basePrice"
                  value={productData.basePrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Selling Price</label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={productData.sellingPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={productData.discount}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Color*</label>
              <input
                type="text"
                name="color"
                value={productData.color}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Slug*</label>
              <input
                type="text"
                name="slug"
                value={productData.slug}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Theme*</label>
              <input
                type="text"
                name="theme"
                value={productData.theme}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
              <p className="mt-2 animate-pulse text-sm text-red-500">
                Clothing Theme like (Harry Potter, Spiderman, Marvel, Hulk)
              </p>

              {themeNames?.themes && themeNames?.themes?.length > 0 && (
                <ul className="mt-3 list-disc list-inside text-sm text-gray-700">
                  {themeNames?.themes.map((theme, index) => (
                    <li key={index}>{theme}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Category & Attributes */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Category & Attributes</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Gender*</label>
              <select
                name="gender"
                value={productData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                {genderOptions.map(gender => (
                  <option key={gender} value={gender}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Category*</label>
              <select
                name="category"
                value={productData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
                disabled={categoriesLoading}
              >
                <option value="">Select a category</option>
                {categories?.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {categoriesLoading && <p className="text-sm text-gray-500">Loading categories...</p>}
            </div>
            
            {/* Subcategory and Child Category Logic */}
            {productData.category && activeSubcategories.length > 0 && (
              <div className="mb-4 p-3 border rounded">
                <label className="block text-gray-700 mb-2 font-semibold">Subcategories</label>
                <div className="space-y-3">
                  {activeSubcategories.map(subcategory => (
                    <div key={subcategory._id}>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`sub-${subcategory._id}`}
                          value={subcategory._id}
                          checked={productData.subcategories.includes(subcategory._id)}
                          onChange={handleSubcategoryChange}
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor={`sub-${subcategory._id}`} className="font-medium text-gray-800">
                          {subcategory.subCategoryName}
                        </label>
                      </div>

                      {productData.subcategories.includes(subcategory._id) && subcategory.childCategory?.length > 0 && (
                        <div className="ml-8 mt-2 space-y-2 border-l-2 pl-4">
                          {subcategory.childCategory.map(child => (
                            <div key={child._id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`child-${child._id}`}
                                value={child._id}
                                checked={productData.childCategories.includes(child._id)}
                                onChange={handleChildCategoryChange}
                                className="mr-2"
                              />
                              <label htmlFor={`child-${child._id}`} className="text-sm">
                                {child.childCategoryName}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Sizes</label>
              <div className="grid grid-cols-3 gap-2">
                {sizeOptions.map(size => (
                  <div key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`size-${size}`}
                      value={size}
                      checked={productData.size.includes(size)}
                      onChange={handleSizeChange}
                      className="mr-2"
                    />
                    <label htmlFor={`size-${size}`}>{size}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Stock*</label>
              <input
                type="number"
                name="stock"
                value={productData.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="isNewArrival"
                id="isNewArrival"
                checked={productData.isNewArrival}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="isNewArrival" className="text-gray-700">Mark as New Arrival</label>
            </div>
            
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                checked={productData.isFeatured}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="isFeatured" className="text-gray-700">Mark as Feature Product</label>
            </div>
          </div>
        </div>

        {/* Image Upload - Enhanced for Multiple Images */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Product Images</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Add More Images (Current: {imagesUrls.length} images)
            </label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded"
              accept="image/*"
            />
            {uploadLoading && <p className="text-sm text-blue-500">Uploading images...</p>}
            {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
            <p className="text-sm text-gray-500 mt-1">
              You can select multiple images at once or add them one by one
            </p>
          </div>

          {previewImages.length > 0 && (
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Uploaded Images ({imagesUrls.length})</h3>
              <div className="grid grid-cols-4 gap-4">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative w-24 h-24 border rounded overflow-hidden group">
                    <img 
                      src={src} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                      {index + 1}
                    </div>
                    <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                      <div className="text-xs truncate">ID: {imagesUrls[index]?.publicIds}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Debug info - remove in production */}
              <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
                <strong>Debug - Images Array Structure:</strong>
                <pre className="mt-1 text-xs overflow-x-auto">
                  {JSON.stringify(imagesUrls, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || categoriesLoading || uploadLoading}
            className={`px-4 py-2 rounded text-white ${
              loading || categoriesLoading || uploadLoading 
                ? 'bg-gray-400' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}