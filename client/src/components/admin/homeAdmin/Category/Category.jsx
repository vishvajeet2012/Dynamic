import { useEffect, useState } from "react";
import { 
    useGetAllCategories, 
    useCreateCateogry, 
    
     
    useCreateSubCateogry,
    useDeleteCategory,
    useUpdateCategory
} from '../../../../hooks/useCategories';
// import { 
    
//     useUpdateSubcategory,
//     useDeleteSubcategory
// } from '../../../../hooks/useSubcategories';

export default function AdminCategory() {
    // Category states
    const { loading, error, categories, fetechCategories } = useGetAllCategories();
    const { createCategory } = useCreateCateogry();
    const { updateCategory } = useUpdateCategory ();
    const { deleteCategory } = useDeleteCategory();
    

    
    const { createSubCategory } = useCreateSubCateogry();
    // const { updateSubcategory } = useUpdateSubcategory();
    // const { deleteSubcategory } = useDeleteSubcategory();
    
    const [categoryForm, setCategoryForm] = useState({
        categoryName: '',
        categoryImage: '',
        categoryDescription: '',
        isActive: true
    });
    
    const [subcategoryForm, setSubcategoryForm] = useState({
        subCategoryName: '',
        subCategoryImage: '',
        subCategoryDescription: '',
        isActive: false
    });
    
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [activeTab, setActiveTab] = useState('categories');

    useEffect(() => {
        fetechCategories();
    }, []);

    // Category handlers
    const handleCategoryInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCategoryForm({
            ...categoryForm,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedCategory) {
                await updateCategory(selectedCategory._id, categoryForm);
            } else {
                await createCategory(categoryForm);
            }
            resetCategoryForm();
            fetechCategories();
        } catch (err) {
            console.error("Category operation failed:", err);
        }
    };

    const handleCategoryEdit = (category) => {
        setSelectedCategory(category);
        setCategoryForm({
            categoryName: category.categoryName,
            categoryImage: category.categoryImage,
            categoryDescription: category.categoryDescription,
            isActive: category.isActive
        });
        setActiveTab('categoryForm');
    };

    const handleCategoryDelete = async (categoryId) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            await deleteCategory(categoryId);
            fetechCategories();
        }
    };

    const resetCategoryForm = () => {
        setSelectedCategory(null);
        setCategoryForm({
            categoryName: '',
            categoryImage: '',
            categoryDescription: '',
            isActive: true
        });
    };

    // Subcategory handlers
    const handleSubcategoryInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSubcategoryForm({
            ...subcategoryForm,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubcategorySubmit = async (e) => {
        e.preventDefault();
        try {
            if (!selectedCategory) {
                alert("Please select a category first");
                return;
            }

            const subcategoryData = {
                ...subcategoryForm,
                category: selectedCategory._id
            };

            if (selectedSubcategory) {
                // await updateSubcategory(selectedSubcategory._id, subcategoryData);
            } else {
                await createSubCategory(subcategoryData);
                // Add the new subcategory to the selected category
                await updateCategory(selectedCategory._id, {
                    $push: { subcategories: subcategoryData._id }
                });
            }

            resetSubcategoryForm();
            fetechCategories();
        } catch (err) {
            console.error("Subcategory operation failed:", err);
        }
    };

    const handleSubcategoryEdit = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setSubcategoryForm({
            subCategoryName: subcategory.subCategoryName,
            subCategoryImage: subcategory.subCategoryImage,
            subCategoryDescription: subcategory.subCategoryDescription,
            isActive: subcategory.isActive
        });
        setActiveTab('subcategoryForm');
    };

    const handleSubcategoryDelete = async (subcategoryId) => {
        if (window.confirm("Are you sure you want to delete this subcategory?")) {
            // await deleteSubcategory(subcategoryId);
            // Remove from category's subcategories array
            if (selectedCategory) {
                await updateCategory(selectedCategory._id, {
                    $pull: { subcategories: subcategoryId }
                });
            }
            fetechCategories();
        }
    };

    const resetSubcategoryForm = () => {
        setSelectedSubcategory(null);
        setSubcategoryForm({
            subCategoryName: '',
            subCategoryImage: '',
            subCategoryDescription: '',
            isActive: false
        });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Category Management</h1>
            
            <div className="flex mb-4 border-b">
                <button
                    className={`px-4 py-2 ${activeTab === 'categories' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
                    onClick={() => setActiveTab('categories')}
                >
                    Categories
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'categoryForm' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
                    onClick={() => setActiveTab('categoryForm')}
                >
                    {selectedCategory ? 'Edit Category' : 'Add Category'}
                </button>
                {selectedCategory && (
                    <button
                        className={`px-4 py-2 ${activeTab === 'subcategoryForm' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
                        onClick={() => setActiveTab('subcategoryForm')}
                    >
                        {selectedSubcategory ? 'Edit Subcategory' : 'Add Subcategory'}
                    </button>
                )}
            </div>

            {activeTab === 'categories' && (
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold mb-4">All Categories</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">Error: {error.message}</p>
                    ) : (
                        <div className="space-y-4">
                            {categories?.map(category => (
                                <div key={category._id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg">{category.categoryName}</h3>
                                            <p className="text-gray-600">{category.categoryDescription}</p>
                                            <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                                                category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {category.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleCategoryEdit(category)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleCategoryDelete(category._id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {category?.subcategories && category.subcategories.length > 0 && (
                                        <div className="mt-3 pl-4 border-l-2 border-gray-200">
                                            <h4 className="font-medium text-gray-700">Subcategories:</h4>
                                            <ul className="mt-1 space-y-2">
                                                {category.subcategories.map(sub => (
                                                    <li key={sub._id} className="flex justify-between items-center">
                                                        <span>{sub.subCategoryName}</span>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedCategory(category);
                                                                    handleSubcategoryEdit(sub);
                                                                }}
                                                                className="text-xs px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleSubcategoryDelete(sub._id)}
                                                                className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'categoryForm' && (
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold mb-4">
                        {selectedCategory ? 'Edit Category' : 'Create New Category'}
                    </h2>
                    <form onSubmit={handleCategorySubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Category Name</label>
                            <input
                                type="text"
                                name="categoryName"
                                value={categoryForm.categoryName}
                                onChange={handleCategoryInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Image URL</label>
                            <input
                                type="text"
                                name="categoryImage"
                                value={categoryForm.categoryImage}
                                onChange={handleCategoryInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Description</label>
                            <textarea
                                name="categoryDescription"
                                value={categoryForm.categoryDescription}
                                onChange={handleCategoryInputChange}
                                className="w-full p-2 border rounded"
                                rows="3"
                                required
                            />
                        </div>
                        <div className="mb-4 flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={categoryForm.isActive}
                                onChange={handleCategoryInputChange}
                                className="mr-2"
                            />
                            <label>Active</label>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                {selectedCategory ? 'Update' : 'Create'}
                            </button>
                            {selectedCategory && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetCategoryForm();
                                        setActiveTab('categories');
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'subcategoryForm' && selectedCategory && (
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold mb-4">
                        {selectedSubcategory ? 'Edit Subcategory' : 'Add Subcategory to ' + selectedCategory.categoryName}
                    </h2>
                    <form onSubmit={handleSubcategorySubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Subcategory Name</label>
                            <input
                                type="text"
                                name="subCategoryName"
                                value={subcategoryForm.subCategoryName}
                                onChange={handleSubcategoryInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Image URL</label>
                            <input
                                type="text"
                                name="subCategoryImage"
                                value={subcategoryForm.subCategoryImage}
                                onChange={handleSubcategoryInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Description</label>
                            <textarea
                                name="subCategoryDescription"
                                value={subcategoryForm.subCategoryDescription}
                                onChange={handleSubcategoryInputChange}
                                className="w-full p-2 border rounded"
                                rows="3"
                                required
                            />
                        </div>
                        <div className="mb-4 flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={subcategoryForm.isActive}
                                onChange={handleSubcategoryInputChange}
                                className="mr-2"
                            />
                            <label>Active</label>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                {selectedSubcategory ? 'Update' : 'Create'}
                            </button>
                            {selectedSubcategory && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetSubcategoryForm();
                                        setActiveTab('categories');
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}