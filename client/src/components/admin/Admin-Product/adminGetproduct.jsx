import React, { useEffect, useState } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { useAdmindelteProduct, useUpdateAdminPorduct, useAdminGetProduct } from '../../../hooks/Product/Product';
import { useGetAllCategories } from '../../../hooks/useCategories';

export default function AdminProductManagement() {
    const { AdmingetProduct, loading, Product, error } = useAdminGetProduct();
    const { categories, loading: categoriesLoading, error: categoriesError, fetechCategories } = useGetAllCategories();

    const { updateProduct, loading: updateLoading, error: updateError, success: updateSuccess } = useUpdateAdminPorduct();
    const { deleteProduct, loading: deleteLoading, error: deleteError, success: deleteSuccess } = useAdmindelteProduct();

    const [editingProductId, setEditingProductId] = useState(null);
    const [formData, setFormData] = useState({});

    // State for managing dropdown options
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [childCategoryOptions, setChildCategoryOptions] = useState([]);

    useEffect(() => {
        AdmingetProduct();
        fetechCategories();
    }, []);

    useEffect(() => {
        if (updateSuccess || deleteSuccess) {
            AdmingetProduct();
            setEditingProductId(null);
        }
    }, [updateSuccess, deleteSuccess]);

    const handleEditClick = (product) => {
        setEditingProductId(product._id);
        setFormData({
            id: product._id,
            name: product.name,
            description: product.description,
            basePrice: product.basePrice,
            discount: product.discount,
            sellingPrice: product.sellingPrice,
            category: product.category?._id || '',
            subcategories: product.subcategories?.[0]?._id || '', // Assuming one subcategory per product
            childCategory: product.childCategory?.[0]?._id || '', // Assuming one child category
            images: product.images,
            stock: product.stock,
            isNewArrival: product.isNewArrival,
            color: product.color,
            gender: product.gender,
            size: product.size,
            slug: product.slug,
        });

        // Pre-populate dropdowns
        if (product.category?._id && categories?.data) {
            const selectedMainCategory = categories.data.find(cat => cat._id === product.category._id);
            if (selectedMainCategory) {
                setSubCategoryOptions(selectedMainCategory.subcategories || []);
            }
        }
        if (product.subcategories?.[0]?._id) {
            const selectedSubCategory = subCategoryOptions.find(sub => sub._id === product.subcategories[0]._id);
            if (selectedSubCategory) {
                setChildCategoryOptions(selectedSubCategory.childCategory || []);
            }
        }
    };

    const handleDeleteClick = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            const fromData = { id: productId };
            await deleteProduct(fromData);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const newFormData = {
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        };

        if (name === 'category') {
            const selectedCategory = categories.data.find(cat => cat._id === value);
            setSubCategoryOptions(selectedCategory ? selectedCategory.subcategories : []);
            newFormData.subcategories = ''; // Reset subcategory
            newFormData.childCategory = ''; // Reset child category
            setChildCategoryOptions([]);
        }

        if (name === 'subcategories') {
            const selectedSubcategory = subCategoryOptions.find(sub => sub._id === value);
            setChildCategoryOptions(selectedSubcategory ? selectedSubcategory.childCategory : []);
            newFormData.childCategory = ''; // Reset child category
        }
        
        setFormData(newFormData);
    };

    const handleImageChange = (e, imageIndex) => {
        const { name, value } = e.target;
        const newImages = [...formData.images];
        newImages[imageIndex] = { ...newImages[imageIndex], [name]: value };
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Construct payload to match schema
        const payload = {
            ...formData,
            subcategories: [formData.subcategories], // Ensure it's an array
            childCategory: [formData.childCategory], // Ensure it's an array
        };
        await updateProduct(payload);
    };

    if (loading || categoriesLoading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error || categoriesError) {
        return <div className="text-center py-4 text-red-500">Error: {error || categoriesError}</div>;
    }

    const products = Product?.data || [];
    const mainCategories = categories?.data || [];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Product Management</h1>

            {/* Notifications for API status */}
            {updateLoading && <div className="text-blue-500 mb-2">Updating product...</div>}
            {updateError && <div className="text-red-500 mb-2">Error updating product: {updateError}</div>}
            {updateSuccess && <div className="text-green-500 mb-2">Product updated successfully!</div>}
            {deleteLoading && <div className="text-blue-500 mb-2">Deleting product...</div>}
            {deleteError && <div className="text-red-500 mb-2">Error deleting product: {deleteError}</div>}
            {deleteSuccess && <div className="text-green-500 mb-2">Product deleted successfully!</div>}

            {products.length === 0 ? (
                <div className="text-center py-4">No products found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="border rounded-lg shadow-md p-4 bg-white flex flex-col justify-between">
                            {editingProductId === product._id ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <h3 className="text-xl font-semibold mb-3">Edit Product: {product.name}</h3>
                                    
                                    {/* Name */}
                                    <div>
                                        <label htmlFor={`name-${product._id}`} className="block text-sm font-medium text-gray-700">Name</label>
                                        <input type="text" id={`name-${product._id}`} name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label htmlFor={`description-${product._id}`} className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea id={`description-${product._id}`} name="description" value={formData.description || ''} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                                    </div>

                                    {/* Category Dropdowns */}
                                    <div>
                                        <label htmlFor={`category-${product._id}`} className="block text-sm font-medium text-gray-700">Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                            <option value="">Select a Category</option>
                                            {mainCategories.map(cat => (
                                                <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {subCategoryOptions.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                                            <select name="subcategories" value={formData.subcategories} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                <option value="">Select a Subcategory</option>
                                                {subCategoryOptions.map(sub => (
                                                    <option key={sub._id} value={sub._id}>{sub.subCategoryName}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {childCategoryOptions.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Child Category</label>
                                            <select name="childCategory" value={formData.childCategory} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                 <option value="">Select a Child Category</option>
                                                 {childCategoryOptions.map(child => (
                                                     <option key={child._id} value={child._id}>{child.childCategoryName}</option>
                                                 ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Pricing */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor={`basePrice-${product._id}`} className="block text-sm font-medium text-gray-700">Base Price</label>
                                            <input type="number" id={`basePrice-${product._id}`} name="basePrice" value={formData.basePrice || 0} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                        </div>
                                        <div>
                                            <label htmlFor={`discount-${product._id}`} className="block text-sm font-medium text-gray-700">Discount (%)</label>
                                            <input type="number" id={`discount-${product._id}`} name="discount" value={formData.discount || 0} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                        </div>
                                    </div>
                                    
                                    {/* Stock and Gender */}
                                     <div className="grid grid-cols-2 gap-4">
                                        <div>
                                             <label htmlFor={`stock-${product._id}`} className="block text-sm font-medium text-gray-700">Stock</label>
                                             <input type="number" id={`stock-${product._id}`} name="stock" value={formData.stock || 0} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                        </div>
                                        <div>
                                             <label htmlFor={`gender-${product._id}`} className="block text-sm font-medium text-gray-700">Gender</label>
                                             <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                 <option value="">Select Gender</option>
                                                 <option value="men">Men</option>
                                                 <option value="women">Women</option>
                                                 <option value="unisex">Unisex</option>
                                             </select>
                                        </div>
                                    </div>

                                    {/* Images */}
                                    {formData.images?.map((img, index) => (
                                        <div key={index}>
                                            <label htmlFor={`imageUrl-${product._id}-${index}`} className="block text-sm font-medium text-gray-700">Image URL {index + 1}</label>
                                            <input type="text" id={`imageUrl-${product._id}-${index}`} name="imagesUrls" value={img.imagesUrls || ''} onChange={(e) => handleImageChange(e, index)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                            {img.imagesUrls && <img src={img.imagesUrls} alt={`Product ${index}`} className="mt-2 w-24 h-24 object-cover rounded-md" />}
                                        </div>
                                    ))}

                                    <div className="flex justify-end space-x-2">
                                        <button type="button" onClick={() => setEditingProductId(null)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={updateLoading}>{updateLoading ? 'Updating...' : 'Save Changes'}</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    {product.images?.[0]?.imagesUrls && (
                                        <img src={product.images[0].imagesUrls} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
                                    )}
                                    <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                                    <div className="flex justify-between items-center mt-auto">
                                        <p className="text-lg font-bold text-gray-900">
                                            ₹{product.sellingPrice?.toLocaleString('en-IN')}
                                            {product.discount > 0 && (
                                                <span className="text-sm text-gray-500 line-through ml-2">₹{product.basePrice?.toLocaleString('en-IN')}</span>
                                            )}
                                        </p>
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleEditClick(product)} className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors" title="Edit Product"><MdEdit size={20} /></button>
                                            <button onClick={() => handleDeleteClick(product._id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors" title="Delete Product" disabled={deleteLoading}><MdDelete size={20} /></button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}