import React, { useEffect, useState } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md'; // For edit and delete icons
import { useAdmindelteProduct,useUpdateAdminPorduct, useAdminGetProduct } from '../../../hooks/Product/Product';

// Placeholder for your update and delete hooks/functions
// You would replace these with your actual API calls


export default function AdminProductManagement() {
    const {AdmingetProduct,loading ,Product, error,success}=   useAdminGetProduct()


    const { updateProduct, loading: updateLoading, error: updateError, success: updateSuccess } = useUpdateAdminPorduct();
    const { deleteProduct, loading: deleteLoading, error: deleteError, success: deleteSuccess } = useAdmindelteProduct();

    const [editingProductId, setEditingProductId] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        AdmingetProduct();
    }, []);

    useEffect(() => {
        if (updateSuccess || deleteSuccess) {
            // Re-fetch products after a successful update or delete
            AdmingetProduct();
            setEditingProductId(null); // Exit editing mode
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
            category: product.category,
            subcategories: product.subcategories || [],
            images: product.images,
            stock: product.stock,
            isNewArrival: product.isNewArrival,
            color: product.color,
            gender: product.gender,
            size: product.size,
            slug: product.slug,
        });
    };

    const handleDeleteClick = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
                const fromData = { id: productId };
            await deleteProduct(fromData);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e, imageIndex) => {
        const { name, value } = e.target;
        const newImages = [...formData.images.imagesUrls];
        newImages[imageIndex] = { ...newImages[imageIndex], [name]: value }; // Assuming imagesUrls is an array of objects
        setFormData(prev => ({
            ...prev,
            images: {
                ...prev.images,
                imagesUrls: newImages
            }
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateProduct(formData);
    };

    if (loading) {
        return <div className="text-center py-4">Loading products...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">Error: {error}</div>;
    }

    const products = Product?.data || [];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Product Management</h1>

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
                                    <div>
                                        <label htmlFor={`name-${product._id}`} className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            id={`name-${product._id}`}
                                            name="name"
                                            value={formData.name || ''}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`description-${product._id}`} className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            id={`description-${product._id}`}
                                            name="description"
                                            value={formData.description || ''}
                                            onChange={handleChange}
                                            rows="3"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        ></textarea>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor={`basePrice-${product._id}`} className="block text-sm font-medium text-gray-700">Base Price</label>
                                            <input
                                                type="number"
                                                id={`basePrice-${product._id}`}
                                                name="basePrice"
                                                value={formData.basePrice || 0}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor={`discount-${product._id}`} className="block text-sm font-medium text-gray-700">Discount (%)</label>
                                            <input
                                                type="number"
                                                id={`discount-${product._id}`}
                                                name="discount"
                                                value={formData.discount || 0}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor={`sellingPrice-${product._id}`} className="block text-sm font-medium text-gray-700">Selling Price</label>
                                        <input
                                            type="number"
                                            id={`sellingPrice-${product._id}`}
                                            name="sellingPrice"
                                            value={formData.sellingPrice || 0}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`category-${product._id}`} className="block text-sm font-medium text-gray-700">Category</label>
                                        <input
                                            type="text"
                                            id={`category-${product._id}`}
                                            name="category"
                                            value={formData.category || ''}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`stock-${product._id}`} className="block text-sm font-medium text-gray-700">Stock</label>
                                        <input
                                            type="number"
                                            id={`stock-${product._id}`}
                                            name="stock"
                                            value={formData.stock || 0}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`isNewArrival-${product._id}`}
                                            name="isNewArrival"
                                            checked={formData.isNewArrival || false}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`isNewArrival-${product._id}`} className="ml-2 block text-sm text-gray-900">New Arrival</label>
                                    </div>
                                    <div>
                                        <label htmlFor={`color-${product._id}`} className="block text-sm font-medium text-gray-700">Color</label>
                                        <input
                                            type="text"
                                            id={`color-${product._id}`}
                                            name="color"
                                            value={formData.color || ''}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`gender-${product._id}`} className="block text-sm font-medium text-gray-700">Gender</label>
                                        <input
                                            type="text"
                                            id={`gender-${product._id}`}
                                            name="gender"
                                            value={formData.gender || ''}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`size-${product._id}`} className="block text-sm font-medium text-gray-700">Size</label>
                                        <input
                                            type="text"
                                            id={`size-${product._id}`}
                                            name="size"
                                            value={formData.size || ''}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    {/* Subcategories and Images would need more complex handling, e.g., multiselect for subcategories and file input/preview for images */}
                                    {/* For images, you might want to display existing images and allow new uploads/deletions. */}
                                    {/* This example only shows basic text input for image URLs */}
                                    {formData.images?.imagesUrls && formData.images.imagesUrls.map((img, index) => (
                                        <div key={index}>
                                            <label htmlFor={`imageUrl-${product._id}-${index}`} className="block text-sm font-medium text-gray-700">Image URL {index + 1}</label>
                                            <input
                                                type="text"
                                                id={`imageUrl-${product._id}-${index}`}
                                                name="imageUrl"
                                                value={img.imageUrl || ''}
                                                onChange={(e) => handleImageChange(e, index)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            />
                                            {img.imageUrl && <img src={img.imageUrl} alt={`Product ${index}`} className="mt-2 w-24 h-24 object-cover rounded-md" />}
                                        </div>
                                    ))}

                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditingProductId(null)}
                                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                            disabled={updateLoading}
                                        >
                                            {updateLoading ? 'Updating...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    {product.images?.imagesUrls?.[0]?.imageUrl && (
                                        <img
                                            src={product.images.imagesUrls[0].imageUrl}
                                            alt={product.name}
                                            className="w-full h-48 object-cover rounded-md mb-4"
                                        />
                                    )}
                                    <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                                    <div className="flex justify-between items-center mt-auto">
                                        <p className="text-lg font-bold text-gray-900">
                                            ₹{product.sellingPrice?.toLocaleString('en-IN')}
                                            {product.discount > 0 && (
                                                <span className="text-sm text-gray-500 line-through ml-2">
                                                    ₹{product.basePrice?.toLocaleString('en-IN')}
                                                </span>
                                            )}
                                        </p>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditClick(product)}
                                                className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                                                title="Edit Product"
                                            >
                                                <MdEdit size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(product._id)}
                                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                title="Delete Product"
                                                disabled={deleteLoading}
                                            >
                                                <MdDelete size={20} />
                                            </button>
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