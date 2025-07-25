import { useState, useEffect } from 'react';
import { useCreateProduct, useSearchThemeNames } from "../../../hooks/Product/Product";
import { useUplaodImage } from '../../../hooks/client/homePageHooks/use-banner';
import { useGetAllCategories } from '../../../hooks/useCategories';

export default function CreateAdminProduct() {
  const { uploadImage, loading: uploadLoading, error: uploadError } = useUplaodImage();
  const { createProduct, loading, error, success } = useCreateProduct();
  const [imagesUrls, setImageUrls] = useState(null);
  const [publicIds, setPublicId] = useState(null);
  const { categories, loading: categoriesLoading, error: categoriesError, fetechCategories } = useGetAllCategories();
  const { searchThemeNames, themeNames } =useSearchThemeNames()

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
    childCategories: [], // <-- Added state for child categories
    stock: 0,
    isNewArrival: false,
    images: [],
    
    slug: '',
    theme:""
  , isFeatured:false,

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
      // Reset subcategories and child categories when category changes
      ...(name === 'category' && { subcategories: [], childCategories: [] })
    }));if (name === 'theme') {
      searchThemeNames(value);
      
    }
    // For debugging purposes
  
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
    const { value, checked } = e.target; // value is the subcategory._id

    // Find the full subcategory object to access its children
    const subcategory = activeSubcategories.find(sub => sub._id === value);
    const childIdsOfThisSub = subcategory?.childCategory?.map(child => child._id) || [];

    setProductData(prev => {
      const newSubcategories = checked
        ? [...prev.subcategories, value]
        : prev.subcategories.filter(id => id !== value);

      // If a subcategory is unchecked, remove its children from the state
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


  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    formData.append("image", files[0]); /// [files[0]]); // Assuming you want to upload multiple images

    try {
        const v = await uploadImage(formData);
        if (v.url) {
            setPublicId(v.publicId);
            setImageUrls(v.url);
        } else {
            throw new Error('Image upload failed to return a URL.');
        }
    } catch (uploadError) {
        console.error("Upload error:", uploadError);
        // Optionally, display this error to the user
        return;
    }


    setImageFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the product object to send
    const productToCreate = {
      name: productData.name,
      isFeatured:productData.isFeatured,
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
      publicId: publicIds,
      imagesUrls: imagesUrls,
      size: productData.size,
      subcategories: productData.subcategories,
      childCategory: productData.childCategories // <-- Added for submission
      ,
      theme: productData.theme
    };

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

  {/* ✅ Theme List */}
  {themeNames?.themes&& themeNames?.themes?.length > 0 && (
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
            
            {/* --- CHILD CATEGORY LOGIC START --- */}
            {productData.category && activeSubcategories.length > 0 && (
              <div className="mb-4 p-3 border rounded">
                <label className="block text-gray-700 mb-2 font-semibold">Subcategories</label>
                <div className="space-y-3">
                  {activeSubcategories.map(subcategory => (
                    <div key={subcategory._id}>
                      {/* Subcategory Checkbox */}
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

                      {/* Child Category Checkboxes (shown if parent subcategory is checked) */}
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
            {/* --- CHILD CATEGORY LOGIC END --- */}

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

        {/* Image Upload */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Product Images</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Upload Images*</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded"
              accept="image/*"
              required
            />
            {uploadLoading && <p className="text-sm text-gray-500">Uploading image...</p>}
            {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
          </div>

          {previewImages.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">Preview</h3>
              <div className="flex flex-wrap gap-4">
                {previewImages.map((src, index) => (
                  <div key={index} className="w-24 h-24 border rounded overflow-hidden">
                    <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || categoriesLoading || uploadLoading}
            className={`px-4 py-2 rounded text-white ${loading || categoriesLoading || uploadLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}