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

    useEffect(() => {
        AdmingetProduct();
        fetechCategories();
    }, []);

    useEffect(() => {
        if (updateSuccess || deleteSuccess) {
            AdmingetProduct();
            setEditingProductId(null); // Exit editing mode on success
        }
    }, [updateSuccess, deleteSuccess]);

    // When the "Edit" button is clicked, populate the form state
    const handleEditClick = (product) => {
        setEditingProductId(product._id);
        setFormData({
            id: product._id,
            name: product.name,
            description: product.description,
            basePrice: product.basePrice,
            discount: product.discount,
            sellingPrice: product.sellingPrice,
            stock: product.stock,   
            color: product.color,
            gender: product.gender,
            size: product.size || [],
            isNewArrival: product.isNewArrival,
            slug: product.slug,
            images: product.images, // Assuming images are handled separately
            // Correctly map category objects to arrays of IDs
            category: product.category?._id || '',
            subcategories: product.subcategories?.map(sub => sub._id) || [],
            childCategory: product.childCategory?.map(child => child._id) || [],
        });
    };

    const handleDeleteClick = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteProduct({ id: productId });
        }
    };
    
    // Generic handler for simple inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        const newFormData = {
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        };

        // Reset sub and child categories if main category changes
        if (name === 'category') {
            newFormData.subcategories = [];
            newFormData.childCategory = [];
        }

        setFormData(newFormData);
    };

    const handleSizeChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const newSizes = checked
                ? [...prev.size, value]
                : prev.size.filter(s => s !== value);
            return { ...prev, size: newSizes };
        });
    };
    
    const handleSubcategoryChange = (e) => {
        const { value: subId, checked } = e.target;
        const selectedMainCategory = categories?.find(cat => cat._id === formData.category);
        const subcategory = selectedMainCategory?.subcategories?.find(sub => sub._id === subId);
        const childIdsOfThisSub = subcategory?.childCategory?.map(child => child._id) || [];
    
        setFormData(prev => {
            const newSubcategories = checked
                ? [...prev.subcategories, subId]
                : prev.subcategories.filter(id => id !== subId);
    
            // If unchecking a subcategory, remove its children
            const newChildCategories = checked
                ? prev.childCategory
                : prev.childCategory.filter(childId => !childIdsOfThisSub.includes(childId));
    
            return {
                ...prev,
                subcategories: newSubcategories,
                childCategory: newChildCategories,
            };
        });
    };
    
    const handleChildCategoryChange = (e) => {
        const { value: childId, checked } = e.target;
        setFormData(prev => {
            const newChildCategories = checked
                ? [...prev.childCategory, childId]
                : prev.childCategory.filter(id => id !== childId);
            return { ...prev, childCategory: newChildCategories };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // The formData is already in the correct shape to be sent
        await updateProduct(formData);
    };

    if (loading || categoriesLoading) return <div className="text-center py-4">Loading...</div>;
    if (error || categoriesError) return <div className="text-center py-4 text-red-500">Error: {error || categoriesError}</div>;

    const products = Product?.data || [];
    const mainCategories = categories || [];

    // Find the currently selected main category object to access its subcategories
    const selectedMainCategoryForEdit = mainCategories.find(cat => cat._id === formData.category);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Product Management</h1>

            {/* Notifications */}
            {updateLoading && <div className="text-blue-500 mb-2">Updating product...</div>}
            {updateError && <div className="text-red-500 mb-2">Update Error: {updateError}</div>}
            {updateSuccess && <div className="text-green-500 mb-2">Product updated successfully!</div>}
            {deleteLoading && <div className="text-blue-500 mb-2">Deleting product...</div>}
            {deleteError && <div className="text-red-500 mb-2">Delete Error: {deleteError}</div>}
            {deleteSuccess && <div className="text-green-500 mb-2">Product deleted successfully!</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="border rounded-lg shadow-md p-4 bg-white flex flex-col justify-between">
                        {editingProductId === product._id ? (
                            // EDITING FORM
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="text-xl font-semibold">Edit: {product.name}</h3>
                                
                                {/* Name, Description, Slug, etc. */}
                                <div>
                                    <label className="block text-sm font-medium">Name</label>
                                    <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Description</label>
                                    <textarea name="description" value={formData.description || ''} onChange={handleChange} rows="3" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium">Base Price</label>
                                        <input type="number" name="basePrice" value={formData.basePrice || 0} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Discount (%)</label>
                                        <input type="number" name="discount" value={formData.discount || 0} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
                                    </div>
                                </div>
                                
                                {/* Category Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium">Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
                                        <option value="">Select Category</option>
                                        {mainCategories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subcategories and Child Categories Checkboxes */}
                                {selectedMainCategoryForEdit && (
                                    <div className="p-3 border rounded space-y-3">
                                        <label className="font-semibold">Subcategories</label>
                                        {selectedMainCategoryForEdit.subcategories.map(sub => (
                                            <div key={sub._id}>
                                                <div className="flex items-center">
                                                    <input type="checkbox" id={`sub-${sub._id}`} value={sub._id} checked={formData.subcategories?.includes(sub._id)} onChange={handleSubcategoryChange} className="mr-2 h-4 w-4" />
                                                    <label htmlFor={`sub-${sub._id}`} className="font-medium">{sub.subCategoryName}</label>
                                                </div>
                                                {/* Child categories */}
                                                {formData.subcategories?.includes(sub._id) && sub.childCategory?.length > 0 && (
                                                    <div className="ml-8 mt-2 space-y-2 border-l-2 pl-4">
                                                        {sub.childCategory.map(child => (
                                                            <div key={child._id} className="flex items-center">
                                                                <input type="checkbox" id={`child-${child._id}`} value={child._id} checked={formData.childCategory?.includes(child._id)} onChange={handleChildCategoryChange} className="mr-2" />
                                                                <label htmlFor={`child-${child._id}`} className="text-sm">{child.childCategoryName}</label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Size Checkboxes */}
                                <div>
                                    <label className="block text-sm font-medium">Sizes</label>
                                    <div className="grid grid-cols-4 gap-2 mt-1">
                                        {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'OS'].map(s => (
                                            <div key={s} className="flex items-center">
                                                <input type="checkbox" id={`size-${s}`} value={s} checked={formData.size?.includes(s)} onChange={handleSizeChange} className="mr-2"/>
                                                <label htmlFor={`size-${s}`}>{s}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end space-x-2 pt-4">
                                    <button type="button" onClick={() => setEditingProductId(null)} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" disabled={updateLoading}>
                                        {updateLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // DISPLAY CARD
                            <>
                                {product.images?.[0]?.imagesUrls && (
                                    <img src={product.images[0].imagesUrls} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
                                )}
                                <h2 className="text-xl font-semibold">{product.name}</h2>
                                <p className="text-gray-600 text-sm my-2 line-clamp-2">{product.description}</p>
                                <div className="mt-auto">
                                    <p className="font-bold text-lg">₹{product.sellingPrice?.toLocaleString()}</p>
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => handleEditClick(product)} className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600" title="Edit"><MdEdit size={20} /></button>
                                        <button onClick={() => handleDeleteClick(product._id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600" title="Delete" disabled={deleteLoading}><MdDelete size={20} /></button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}