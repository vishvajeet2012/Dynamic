import { useEffect, useState } from "react";
import { useGetAllCategories, useCreateCateogry } from '../../../../hooks/useCategories.js';

export default function AdminCategory() {
    const { loading, error, categories, fetechCategories } = useGetAllCategories();
    const { createCategory } = useCreateCateogry();
    
    const [formData, setFormData] = useState({
        categoryName: '',
        categoryImage: '',
        categoryDescription: '',
        isActive: true
    });
    
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetechCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCategory(formData);
            // Reset form after successful creation
            setFormData({
                categoryName: '',
                categoryImage: '',
                categoryDescription: '',
                isActive: true
            });
            // Refresh categories list
            fetechCategories();
        } catch (err) {
            console.error("Failed to create category:", err);
        }
    };

    const handleUpdate = (category) => {
        setSelectedCategory(category);
        setFormData({
            categoryName: category.categoryName,
            categoryImage: category.categoryImage,
            categoryDescription: category.categoryDescription,
            isActive: category.isActive
        });
    };

    return (
        <div className="w-full p-6">
            <h1 className="text-2xl font-bold mb-6">Category Management</h1>
            
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left side - Category list */}
                <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Categories</h2>
                    
                    {loading ? (
                        <p>Loading categories...</p>
                    ) : error ? (
                        <p className="text-red-500">Error: {error.message}</p>
                    ) : (
                        <div className="space-y-3">
                            {categories?.length === 0 ? (
                                <p>No categories found</p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {categories?.map((category) => (
                                        <li key={category._id} className="py-3 flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium">{category.categoryName}</h3>
                                                <p className="text-sm text-gray-500">{category.categoryDescription}</p>
                                                <span className={`text-xs px-2 py-1 rounded ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {category.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={() => handleUpdate(category)}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => {/* Add delete functionality here */}}
                                                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* Right side - Create/Update form */}
                <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">
                        {selectedCategory ? 'Update Category' : 'Create New Category'}
                    </h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryName">
                                Category Name
                            </label>
                            <input
                                type="text"
                                id="categoryName"
                                name="categoryName"
                                value={formData.categoryName}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryImage">
                                Image URL
                            </label>
                            <input
                                type="text"
                                id="categoryImage"
                                name="categoryImage"
                                value={formData.categoryImage}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryDescription">
                                Description
                            </label>
                            <textarea
                                id="categoryDescription"
                                name="categoryDescription"
                                value={formData.categoryDescription}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="3"
                                required
                            />
                        </div>
                        
                        <div className="mb-4 flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            <label htmlFor="isActive" className="text-gray-700 text-sm font-bold">
                                Active
                            </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                {selectedCategory ? 'Update Category' : 'Create Category'}
                            </button>
                            
                            {selectedCategory && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setFormData({
                                            categoryName: '',
                                            categoryImage: '',
                                            categoryDescription: '',
                                            isActive: true
                                        });
                                    }}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}