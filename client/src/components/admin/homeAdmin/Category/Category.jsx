// /// 📁 File: AdminCategory.jsx

import { useEffect, useState } from "react";
import { 
    useGetAllCategories, 
    useCreateCateogry, 
    
     
    useCreateSubCateogry,
    useDeleteCategory,
    useUpdateCategory,
    useupdateSubCategory,
    useChildCateogryCreate
} from '../../../../hooks/useCategories';
import { useUplaodImage } from "../../../../hooks/client/homePageHooks/use-banner";

// // --- Icon Components (or import from a library like 'lucide-react') ---
// const PlusIcon = ({ className }) => (
//   <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
// );
// const EditIcon = ({ className }) => (
//   <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
// );
// const DeleteIcon = ({ className }) => (
//   <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
// );
// // --- End Icons ---


// export default function AdminCategory() {
//   const { uploadImage, loading: imageUploading } = useUplaodImage();
//   const { loading, error, categories, fetechCategories } = useGetAllCategories();
//   const { createCategory } = useCreateCateogry();
//   const { updateCategory } = useUpdateCategory();
//   const { deleteCategory } = useDeleteCategory();
//   const { createSubCategory } = useCreateSubCateogry();
//    const {childCategory,loading:childCategoryLoading , error:childCategoryError,success:childCategorySuccess}= useChildCateogryCreate()
//   const { subCategoryupdate } = useupdateSubCategory();
    
//   const [view, setView] = useState('welcome');
  
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedSubcategory, setSelectedSubcategory] = useState(null);

//   const [categoryName, setCategoryName] = useState("");
//   const [categoryDescription, setCategoryDescription] = useState("");
//   const [categoryIsActive, setCategoryIsActive] = useState(true);
//   const [categoryImageFile, setCategoryImageFile] = useState(null);
//   const [categoryImagePreview, setCategoryImagePreview] = useState("");
// const [subCategoryId,setSubCategoryid]=useState("")
//   const [subCategoryName, setSubCategoryName] = useState("");
//   const [subCategoryDescription, setSubCategoryDescription] = useState("");
//   const [subCategoryIsActive, setSubCategoryIsActive] = useState(true);
//   const [subCategoryImageFile, setSubCategoryImageFile] = useState(null);
//   const [subCategoryImagePreview, setSubCategoryImagePreview] = useState("");

//   useEffect(() => {
//     fetechCategories();
//   }, []);

//   const resetCategoryForm = () => {
//     setCategoryName(""); setCategoryDescription(""); setCategoryIsActive(true);
//     setCategoryImageFile(null); setCategoryImagePreview(""); setSelectedCategory(null);
//   };

//   const resetSubCategoryForm = () => {
//     setSubCategoryName(""); setSubCategoryDescription(""); setSubCategoryIsActive(true);
//     setSubCategoryImageFile(null); setSubCategoryImagePreview(""); setSelectedSubcategory(null);
//   };

//   const handleShowNewCategoryForm = () => {
//     resetCategoryForm();
//     setView('new-category');
//   };

//   const handleCategorySubmit = async (e) => {
//     e.preventDefault();
//     try {
//       let imageUrl = selectedCategory?.categoryImage || "";
//       let publicId = selectedCategory?.imagePublicId || "";

//       if (categoryImageFile) {
//         const formData = new FormData();
//         formData.append("image", categoryImageFile);
//         const res = await uploadImage(formData);
//         imageUrl = res.url;
//         publicId = res.public_id;
//       }

//       const data = {
//         categoryName, categoryDescription, isActive: categoryIsActive,
//         categoryImage: imageUrl, imagePublicId: publicId,
//       };

//       if (selectedCategory) {
//        // await updateCategory(selectedCategory._id, data);
//       } else {
//         await createCategory(data);
//       }

//       resetCategoryForm();
//       fetechCategories();
//       setView('welcome');
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // [FIX] Updated logic to handle both CREATE and UPDATE
//   const handleSubCategorySubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (!selectedCategory) return alert("A parent category must be selected.");

//       let imageUrl = selectedSubcategory?.subCategoryImage || "";
//       let publicId = selectedSubcategory?.imagePublicId || "";

//       if (subCategoryImageFile) {
//         const formData = new FormData();
//         formData.append("image", subCategoryImageFile);
//         const res = await uploadImage(formData);
//         imageUrl = res.url;
//         publicId = res.public_id;
//       }
      
//       const subCategoryData = {
//         subCategoryName, subCategoryDescription, isActive: subCategoryIsActive,
//         subCategoryImage: imageUrl, imagePublicId: publicId,
//         category: selectedCategory._id ,
//         subCategoryId
        
//       };

//       if (selectedSubcategory) {
//         // --- UPDATE LOGIC ---
//        await subCategoryupdate(subCategoryData);
//       } else {
//         // --- CREATE LOGIC ---
//         const sub = await createSubCategory(subCategoryData);
//        // await updateCategory(selectedCategory._id, { $push: { subcategories: sub._id } });
//       }
      
//       resetSubCategoryForm();
//       fetechCategories();
//       setView('welcome');
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleEditCategory = (cat) => {
//     resetSubCategoryForm();
//     setSelectedCategory(cat);
//     setCategoryName(cat.categoryName); setCategoryDescription(cat.categoryDescription);
//     setCategoryIsActive(cat.isActive); setCategoryImagePreview(cat.categoryImage);
//     setCategoryImageFile(null);
//     setView('edit-category');
//   };

//   const handleShowNewSubCategoryForm = (parentCategory) => {
//     resetSubCategoryForm();
//     setSelectedCategory(parentCategory);
//     setView('new-subcategory');
//   }

//   const handleEditSubCategory = (sub, parent) => {
//     resetCategoryForm();
    
//     setSubCategoryid(sub._id)
//     setSelectedCategory(parent);
//     setSelectedSubcategory(sub);

//     setSubCategoryName(sub.subCategoryName); setSubCategoryDescription(sub.subCategoryDescription);
//     setSubCategoryIsActive(sub.isActive); setSubCategoryImagePreview(sub.subCategoryImage);
//     setSubCategoryImageFile(null);
//     setView('edit-subcategory');
//   };

//   const handleDeleteCategory = async (id) => {
//     if (window.confirm("Are you sure you want to delete this category and all its subcategories?")) {
//       await deleteCategory(id);
//       fetechCategories();
//       setView('welcome');
//     }
//   };

//   const handleDeleteSubCategory = async (subId, parentId) => {
//     if (window.confirm("Are you sure you want to delete this subcategory?")) {
//       await updateCategory(parentId, { $pull: { subcategories: subId } });
//       fetechCategories();
//       setView('welcome');
//     }
//   };

//   const renderPanel = () => {
//     switch (view) {
//       case 'new-category':
//       case 'edit-category':
//         return <CategoryForm />;
//       case 'new-subcategory':
//       case 'edit-subcategory':
//         return <SubCategoryForm />;
//       case 'welcome':
//       default:
//         return (
//           <div className="flex flex-col items-center justify-center h-full text-center bg-gray-50 rounded-lg">
//             <h2 className="text-xl font-semibold text-gray-700">Manage Categories</h2>
//             <p className="mt-2 text-gray-500">Select a category to edit, or create a new one.</p>
//           </div>
//         );
//     }
//   };
  
//   const CategoryForm = () => (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">
//         {view === 'edit-category' ? "Edit Category" : "Create New Category"}
//       </h2>
//       <form onSubmit={handleCategorySubmit} className="space-y-6">
//         {/* Form content remains the same */}
//         <div>
//           <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
//           <input id="categoryName" type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g., Electronics" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
//         </div>
//         <div>
//           <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//           <textarea id="categoryDescription" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} placeholder="Briefly describe the category" rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
//         </div>
//         <div>
//           <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700">Image</label>
//             <div className="mt-1 flex items-center space-x-4">
//               <span className="h-20 w-20 rounded-md overflow-hidden bg-gray-100">
//                 {categoryImagePreview ? <img src={categoryImagePreview} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200"/>}
//               </span>
//               <input type="file" onChange={(e) => {setCategoryImageFile(e.target.files[0]); setCategoryImagePreview(URL.createObjectURL(e.target.files[0]));}} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
//             </div>
//         </div>
//         <div className="flex items-center">
//             <input id="categoryIsActive" type="checkbox" checked={categoryIsActive} onChange={(e) => setCategoryIsActive(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
//             <label htmlFor="categoryIsActive" className="ml-2 block text-sm text-gray-900">Set as Active</label>
//         </div>
//         <div className="flex justify-end space-x-4">
//             <button type="button" onClick={() => setView('welcome')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
//             <button type="submit" disabled={imageUploading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
//                 {imageUploading ? 'Uploading...' : (view === 'edit-category' ? 'Update Category' : 'Create Category')}
//             </button>
//         </div>
//       </form>
//     </div>
//   );
  
//   const SubCategoryForm = () => (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//        <h2 className="text-2xl font-bold mb-1 text-gray-800">
//         {view === 'edit-subcategory' ? "Edit Subcategory" : "Create Subcategory"}
//       </h2>
//       <p className="mb-6 text-sm text-gray-500">
//         Under Category: <span className="font-semibold">{selectedCategory?.categoryName}</span>
//       </p>
//       <form onSubmit={handleSubCategorySubmit} className="space-y-6">
//         {/* Form content remains the same */}
//         <div>
//           <label htmlFor="subCategoryName" className="block text-sm font-medium text-gray-700 mb-1">Subcategory Name</label>
//           <input id="subCategoryName" type="text" value={subCategoryName} onChange={(e) => setSubCategoryName(e.target.value)} placeholder="e.g., Smartphones" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
//         </div>
//         <div>
//           <label htmlFor="subCategoryDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//           <textarea id="subCategoryDescription" value={subCategoryDescription} onChange={(e) => setSubCategoryDescription(e.target.value)} placeholder="Briefly describe the subcategory" rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
//         </div>
//         <div>
//           <label htmlFor="subCategoryImage" className="block text-sm font-medium text-gray-700">Image</label>
//             <div className="mt-1 flex items-center space-x-4">
//               <span className="h-20 w-20 rounded-md overflow-hidden bg-gray-100">
//                 {subCategoryImagePreview ? <img src={subCategoryImagePreview} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200"/>}
//               </span>
//               <input type="file" onChange={(e) => {setSubCategoryImageFile(e.target.files[0]); setSubCategoryImagePreview(URL.createObjectURL(e.target.files[0]));}} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
//             </div>
//         </div>
//         <div className="flex items-center">
//             <input id="subCategoryIsActive" type="checkbox" checked={subCategoryIsActive} onChange={(e) => setSubCategoryIsActive(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
//             <label htmlFor="subCategoryIsActive" className="ml-2 block text-sm text-gray-900">Set as Active</label>
//         </div>
//         <div className="flex justify-end space-x-4">
//             <button type="button" onClick={() => setView('welcome')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
//             <button type="submit" disabled={imageUploading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
//                 {imageUploading ? 'Uploading...' : (view === 'edit-subcategory' ? 'Update Subcategory' : 'Create Subcategory')}
//             </button>
//         </div>
//       </form>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
//         {/* Left Column: Category List */}
//         <div className="md:col-span-1">
//           <div className="bg-white rounded-lg shadow-md p-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-gray-800">Categories</h2>
//               <button onClick={handleShowNewCategoryForm} className="flex items-center space-x-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-2">
//                 <PlusIcon className="h-4 w-4"/>
//                 <span>New</span>
//               </button>
//             </div>
//             <div className="space-y-2">
//               {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error.message}</p> : 
//                 categories?.length === 0 ? <p className="text-gray-500 text-sm text-center py-4">No categories found.</p> :
//                 categories?.map(cat => (
//                   <div key={cat._id} className={`rounded-lg border ${selectedCategory?._id === cat._id ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200'}`}>
//                       <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50" onClick={() => handleEditCategory(cat)}>
//                           <div className="flex items-center space-x-3">
//                             <img src={cat.categoryImage || 'https://via.placeholder.com/40'} alt={cat.categoryName} className="h-10 w-10 rounded-md object-cover bg-gray-200"/>
//                             <div>
//                               <p className="font-semibold text-gray-800">{cat.categoryName}</p>
//                               <p className={`text-xs font-medium ${cat.isActive ? 'text-green-600' : 'text-gray-500'}`}>{cat.isActive ? 'Active' : 'Inactive'}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                               <button onClick={(e) => { e.stopPropagation(); handleEditCategory(cat); }} className="p-1 text-gray-500 hover:text-blue-600"><EditIcon className="h-4 w-4"/></button>
//                               <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat._id); }} className="p-1 text-gray-500 hover:text-red-600"><DeleteIcon className="h-4 w-4"/></button>
//                           </div>
//                       </div>
//                       {cat.subcategories?.length > 0 && selectedCategory?._id === cat._id && (
//                         <div className="pb-2 px-3">
//                            <ul className="pl-4 border-l-2 border-gray-200 space-y-1">
//                              {cat.subcategories.map(sub => (
//                                <li key={sub._id} className="flex justify-between items-center text-sm p-1 rounded-md hover:bg-gray-100">
//                                    <div className="flex items-center space-x-2">
//                                     <img src={sub.subCategoryImage || 'https://via.placeholder.com/40'} alt={sub.subCategoryName} className="h-6 w-6 rounded object-cover bg-gray-200"/>
//                                     <span>{sub.subCategoryName}</span>
//                                    </div>
//                                    <div className="flex items-center">
//                                       <button onClick={() => handleEditSubCategory(sub, cat)} className="p-1 text-gray-400 hover:text-blue-600"><EditIcon className="h-4 w-4"/></button>
//                                       <button onClick={() => handleDeleteSubCategory(sub._id, cat._id)} className="p-1 text-gray-400 hover:text-red-600"><DeleteIcon className="h-4 w-4"/></button>
//                                    </div>
//                                </li>
//                              ))}
//                            </ul>
//                         </div>
//                       )}
//                       {selectedCategory?._id === cat._id && (
//                         <button onClick={(e) => { e.stopPropagation(); handleShowNewSubCategoryForm(cat); }} className="w-full text-left text-sm p-2 mt-1 bg-gray-50 hover:bg-gray-100 text-blue-600 font-medium rounded-b-lg flex items-center justify-center space-x-2">
//                           <PlusIcon className="h-4 w-4"/>
//                           <span>Add Subcategory</span>
//                         </button>
//                       )}
//                   </div>
//                 ))
//               }
//             </div>
//           </div>
//         </div>

//         {/* Right Column: Form Panel */}
//         <div className="md:col-span-2">
//           {renderPanel()}
//         </div>

//       </div>
//     </div>
//   );
// }






// 📁 File: AdminCategory.jsx




// --- Icon Components ---
const PlusIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);
const EditIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const DeleteIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);
const ChevronDownIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);
// --- End Icons ---

export default function AdminCategory() {
  const { uploadImage, loading: imageUploading } = useUplaodImage();
  const { loading, error, categories, fetechCategories } = useGetAllCategories();
  const { createCategory } = useCreateCateogry();
  const { updateCategory } = useUpdateCategory();
  const { deleteCategory } = useDeleteCategory();
  const { createSubCategory } = useCreateSubCateogry();
  const { childCategory, loading: childCategoryLoading, error: childCategoryError } = useChildCateogryCreate();
  const { subCategoryupdate } = useupdateSubCategory();
  // const { deleteSubCategory } = useDeleteSubCategory();
  // const { deleteChildCategory } = useDeleteChildCategory();
  // const { updateChildCategory } = useUpdateChildCategory();
  
  const [view, setView] = useState('welcome');
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedChildCategory, setSelectedChildCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubcategories, setExpandedSubcategories] = useState({});

  // Category Form State
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryIsActive, setCategoryIsActive] = useState(true);
  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState("");
  const [categoryBannerFile, setCategoryBannerFile] = useState(null);
  const [categoryBannerPreview, setCategoryBannerPreview] = useState("");

  // Subcategory Form State
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryDescription, setSubCategoryDescription] = useState("");
  const [subCategoryIsActive, setSubCategoryIsActive] = useState(true);
  const [subCategoryImageFile, setSubCategoryImageFile] = useState(null);
  const [subCategoryImagePreview, setSubCategoryImagePreview] = useState("");
  const [subCategoryBannerFile, setSubCategoryBannerFile] = useState(null);
  const [subCategoryBannerPreview, setSubCategoryBannerPreview] = useState("");

  // Child Category Form State
  const [childCategoryName, setChildCategoryName] = useState("");
  const [childCategoryDescription, setChildCategoryDescription] = useState("");
  const [childCategoryIsActive, setChildCategoryIsActive] = useState(true);
  const [childCategoryImageFile, setChildCategoryImageFile] = useState(null);
  const [childCategoryImagePreview, setChildCategoryImagePreview] = useState("");
  const [childCategoryBannerFile, setChildCategoryBannerFile] = useState(null);
  const [childCategoryBannerPreview, setChildCategoryBannerPreview] = useState("");

  useEffect(() => {
    fetechCategories();
  }, []);

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleSubcategoryExpansion = (subcategoryId) => {
    setExpandedSubcategories(prev => ({
      ...prev,
      [subcategoryId]: !prev[subcategoryId]
    }));
  };

  const resetAllForms = () => {
    resetCategoryForm();
    resetSubCategoryForm();
    resetChildCategoryForm();
  };

  const resetCategoryForm = () => {
    setCategoryName(""); 
    setCategoryDescription(""); 
    setCategoryIsActive(true);
    setCategoryImageFile(null); 
    setCategoryImagePreview(""); 
    setCategoryBannerFile(null);
    setCategoryBannerPreview("");
    setSelectedCategory(null);
  };

  const resetSubCategoryForm = () => {
    setSubCategoryName(""); 
    setSubCategoryDescription(""); 
    setSubCategoryIsActive(true);
    setSubCategoryImageFile(null); 
    setSubCategoryImagePreview(""); 
    setSubCategoryBannerFile(null);
    setSubCategoryBannerPreview("");
    setSelectedSubcategory(null);
  };

  const resetChildCategoryForm = () => {
    setChildCategoryName(""); 
    setChildCategoryDescription(""); 
    setChildCategoryIsActive(true);
    setChildCategoryImageFile(null); 
    setChildCategoryImagePreview(""); 
    setChildCategoryBannerFile(null);
    setChildCategoryBannerPreview("");
    setSelectedChildCategory(null);
  };

  const handleShowNewCategoryForm = () => {
    resetAllForms();
    setView('new-category');
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = selectedCategory?.categoryImage || "";
      let imagePublicId = selectedCategory?.imagePublicId || "";
      let bannerUrl = selectedCategory?.bannerImage || "";
      let bannerPublicId = selectedCategory?.bannerPublicId || "";

      if (categoryImageFile) {
        const formData = new FormData();
        formData.append("image", categoryImageFile);
        const res = await uploadImage(formData);
        imageUrl = res.url;
        imagePublicId = res.public_id;
      }

      if (categoryBannerFile) {
        const formData = new FormData();
        formData.append("image", categoryBannerFile);
        const res = await uploadImage(formData);
        bannerUrl = res.url;
        bannerPublicId = res.public_id;
      }

      const data = {
        categoryName, 
        categoryDescription, 
        isActive: categoryIsActive,
        categoryImage: imageUrl, 
        imagePublicId,
        bannerImage: bannerUrl,
        bannerPublicId
      };

      if (selectedCategory) {
        await updateCategory(selectedCategory._id, data);
      } else {
        await createCategory(data);
      }

      resetAllForms();
      fetechCategories();
      setView('welcome');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedCategory) return alert("A parent category must be selected.");

      let imageUrl = selectedSubcategory?.subCategoryImage || "";
      let imagePublicId = selectedSubcategory?.imagePublicId || "";
      let bannerUrl = selectedSubcategory?.bannerImage || "";
      let bannerPublicId = selectedSubcategory?.bannerPublicId || "";

      if (subCategoryImageFile) {
        const formData = new FormData();
        formData.append("image", subCategoryImageFile);
        const res = await uploadImage(formData);
        imageUrl = res.url;
        imagePublicId = res.public_id;
      }

      if (subCategoryBannerFile) {
        const formData = new FormData();
        formData.append("image", subCategoryBannerFile);
        const res = await uploadImage(formData);
        bannerUrl = res.url;
        bannerPublicId = res.public_id;
      }
      
      const subCategoryData = {
        subCategoryName, 
        subCategoryDescription, 
        isActive: subCategoryIsActive,
        subCategoryImage: imageUrl, 
        imagePublicId,
        bannerImage: bannerUrl,
        bannerPublicId,
        category: selectedCategory._id,
        subCategoryId: selectedSubcategory?._id || ""
      };

      if (selectedSubcategory) {
        await subCategoryupdate(subCategoryData);
      } else {
        await createSubCategory(subCategoryData);
      }
      
      resetSubCategoryForm();
      fetechCategories();
      setView('welcome');
    } catch (err) {
      console.error(err);
    }
  };

  const handleChildCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedSubcategory) return alert("A parent subcategory must be selected.");

      let imageUrl = selectedChildCategory?.childCategoryImage || "";
      let imagePublicId = selectedChildCategory?.imagePublicId || "";
      let bannerUrl = selectedChildCategory?.bannerImage || "";
      let bannerPublicId = selectedChildCategory?.bannerPublicId || "";

      if (childCategoryImageFile) {
        const formData = new FormData();
        formData.append("image", childCategoryImageFile);
        const res = await uploadImage(formData);
        imageUrl = res.url;
        imagePublicId = res.public_id;
      }

      if (childCategoryBannerFile) {
        const formData = new FormData();
        formData.append("image", childCategoryBannerFile);
        const res = await uploadImage(formData);
        bannerUrl = res.url;
        bannerPublicId = res.public_id;
      }
      
      const childCategoryData = {
        childCategoryName, 
        childCategoryDescription, 
        isActive: childCategoryIsActive,
        childCategoryImage: imageUrl, 
        imagePublicId,
        bannerImage: bannerUrl,
        bannerPublicId,
        subCategory: selectedSubcategory._id,
        childCategoryId: selectedChildCategory?._id || ""
      };

      if (selectedChildCategory) {
       // await updateChildCategory(childCategoryData);
      } else {
        await childCategory(childCategoryData);
      }
      
      resetChildCategoryForm();
      fetechCategories();
      setView('welcome');
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCategory = (cat) => {
    resetAllForms();
    setSelectedCategory(cat);
    setCategoryName(cat.categoryName); 
    setCategoryDescription(cat.categoryDescription);
    setCategoryIsActive(cat.isActive); 
    setCategoryImagePreview(cat.categoryImage);
    setCategoryBannerPreview(cat.bannerImage);
    setCategoryImageFile(null);
    setCategoryBannerFile(null);
    setView('edit-category');
  };

  const handleShowNewSubCategoryForm = (parentCategory) => {
    resetAllForms();
    setSelectedCategory(parentCategory);
    setView('new-subcategory');
  };

  const handleEditSubCategory = (sub, parent) => {
    resetAllForms();
    setSelectedCategory(parent);
    setSelectedSubcategory(sub);
    setSubCategoryName(sub.subCategoryName); 
    setSubCategoryDescription(sub.subCategoryDescription);
    setSubCategoryIsActive(sub.isActive); 
    setSubCategoryImagePreview(sub.subCategoryImage);
    setSubCategoryBannerPreview(sub.bannerImage);
    setSubCategoryImageFile(null);
    setSubCategoryBannerFile(null);
    setView('edit-subcategory');
  };

  const handleShowNewChildCategoryForm = (parentSubCategory) => {
    resetAllForms();
    setSelectedSubcategory(parentSubCategory);
    setView('new-childcategory');
  };

  const handleEditChildCategory = (child, parentSubCategory) => {
    resetAllForms();
    setSelectedSubcategory(parentSubCategory);
    setSelectedChildCategory(child);
    setChildCategoryName(child.childCategoryName); 
    setChildCategoryDescription(child.childCategoryDescription);
    setChildCategoryIsActive(child.isActive); 
    setChildCategoryImagePreview(child.childCategoryImage);
    setChildCategoryBannerPreview(child.bannerImage);
    setChildCategoryImageFile(null);
    setChildCategoryBannerFile(null);
    setView('edit-childcategory');
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category and all its subcategories/child categories?")) {
      await deleteCategory(id);
      fetechCategories();
      setView('welcome');
    }
  };

  const handleDeleteSubCategory = async (subId) => {
    if (window.confirm("Are you sure you want to delete this subcategory and all its child categories?")) {
     // await deleteSubCategory(subId);
      fetechCategories();
      setView('welcome');
    }
  };

  const handleDeleteChildCategory = async (childId) => {
    if (window.confirm("Are you sure you want to delete this child category?")) {
      ///await deleteChildCategory(childId);
      fetechCategories();
      setView('welcome');
    }
  };

  const renderPanel = () => {
    switch (view) {
      case 'new-category':
      case 'edit-category':
        return <CategoryForm />;
      case 'new-subcategory':
      case 'edit-subcategory':
        return <SubCategoryForm />;
      case 'new-childcategory':
      case 'edit-childcategory':
        return <ChildCategoryForm />;
      case 'welcome':
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700">Manage Categories</h2>
            <p className="mt-2 text-gray-500">Select a category to edit, or create a new one.</p>
          </div>
        );
    }
  };
  
  const CategoryForm = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {view === 'edit-category' ? "Edit Category" : "Create New Category"}
      </h2>
      <form onSubmit={handleCategorySubmit} className="space-y-6">
        <div>
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
          <input id="categoryName" type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g., Electronics" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div>
          <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea id="categoryDescription" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} placeholder="Briefly describe the category" rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div>
          <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700">Category Image</label>
            <div className="mt-1 flex items-center space-x-4">
              <span className="h-20 w-20 rounded-md overflow-hidden bg-gray-100">
                {categoryImagePreview ? <img src={categoryImagePreview} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200"/>}
              </span>
              <input type="file" onChange={(e) => {setCategoryImageFile(e.target.files[0]); setCategoryImagePreview(URL.createObjectURL(e.target.files[0]));}} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
        </div>
        <div>
          <label htmlFor="categoryBanner" className="block text-sm font-medium text-gray-700">Banner Image</label>
            <div className="mt-1 flex items-center space-x-4">
              <span className="h-20 w-40 rounded-md overflow-hidden bg-gray-100">
                {categoryBannerPreview ? <img src={categoryBannerPreview} alt="Banner Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200"/>}
              </span>
              <input type="file" onChange={(e) => {setCategoryBannerFile(e.target.files[0]); setCategoryBannerPreview(URL.createObjectURL(e.target.files[0]));}} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            <p className="mt-1 text-xs text-gray-500">Recommended size: 1200x300 pixels</p>
        </div>
        <div className="flex items-center">
            <input id="categoryIsActive" type="checkbox" checked={categoryIsActive} onChange={(e) => setCategoryIsActive(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
            <label htmlFor="categoryIsActive" className="ml-2 block text-sm text-gray-900">Set as Active</label>
        </div>
        <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => setView('welcome')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={imageUploading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                {imageUploading ? 'Uploading...' : (view === 'edit-category' ? 'Update Category' : 'Create Category')}
            </button>
        </div>
      </form>
    </div>
  );
  
  const SubCategoryForm = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-1 text-gray-800">
        {view === 'edit-subcategory' ? "Edit Subcategory" : "Create Subcategory"}
      </h2>
      <p className="mb-6 text-sm text-gray-500">
        Under Category: <span className="font-semibold">{selectedCategory?.categoryName}</span>
      </p>
      <form onSubmit={handleSubCategorySubmit} className="space-y-6">
        <div>
          <label htmlFor="subCategoryName" className="block text-sm font-medium text-gray-700 mb-1">Subcategory Name</label>
          <input id="subCategoryName" type="text" value={subCategoryName} onChange={(e) => setSubCategoryName(e.target.value)} placeholder="e.g., Smartphones" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div>
          <label htmlFor="subCategoryDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea id="subCategoryDescription" value={subCategoryDescription} onChange={(e) => setSubCategoryDescription(e.target.value)} placeholder="Briefly describe the subcategory" rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div>
          <label htmlFor="subCategoryImage" className="block text-sm font-medium text-gray-700">Subcategory Image</label>
            <div className="mt-1 flex items-center space-x-4">
              <span className="h-20 w-20 rounded-md overflow-hidden bg-gray-100">
                {subCategoryImagePreview ? <img src={subCategoryImagePreview} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200"/>}
              </span>
              <input type="file" onChange={(e) => {setSubCategoryImageFile(e.target.files[0]); setSubCategoryImagePreview(URL.createObjectURL(e.target.files[0]));}} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
        </div>
        <div>
          <label htmlFor="subCategoryBanner" className="block text-sm font-medium text-gray-700">Banner Image</label>
            <div className="mt-1 flex items-center space-x-4">
              <span className="h-20 w-40 rounded-md overflow-hidden bg-gray-100">
                {subCategoryBannerPreview ? <img src={subCategoryBannerPreview} alt="Banner Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200"/>}
              </span>
              <input type="file" onChange={(e) => {setSubCategoryBannerFile(e.target.files[0]); setSubCategoryBannerPreview(URL.createObjectURL(e.target.files[0]));}} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            <p className="mt-1 text-xs text-gray-500">Recommended size: 1200x300 pixels</p>
        </div>
        <div className="flex items-center">
            <input id="subCategoryIsActive" type="checkbox" checked={subCategoryIsActive} onChange={(e) => setSubCategoryIsActive(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
            <label htmlFor="subCategoryIsActive" className="ml-2 block text-sm text-gray-900">Set as Active</label>
        </div>
        <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => setView('welcome')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={imageUploading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                {imageUploading ? 'Uploading...' : (view === 'edit-subcategory' ? 'Update Subcategory' : 'Create Subcategory')}
            </button>
        </div>
      </form>
    </div>
  );

  const ChildCategoryForm = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-1 text-gray-800">
        {view === 'edit-childcategory' ? "Edit Child Category" : "Create Child Category"}
      </h2>
      <p className="mb-6 text-sm text-gray-500">
        Under Subcategory: <span className="font-semibold">{selectedSubcategory?.subCategoryName}</span>
        <br />
        Parent Category: <span className="font-semibold">{selectedCategory?.categoryName}</span>
      </p>
      <form onSubmit={handleChildCategorySubmit} className="space-y-6">
        <div>
          <label htmlFor="childCategoryName" className="block text-sm font-medium text-gray-700 mb-1">Child Category Name</label>
          <input id="childCategoryName" type="text" value={childCategoryName} onChange={(e) => setChildCategoryName(e.target.value)} placeholder="e.g., iPhone" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div>
          <label htmlFor="childCategoryDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea id="childCategoryDescription" value={childCategoryDescription} onChange={(e) => setChildCategoryDescription(e.target.value)} placeholder="Briefly describe the child category" rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div>
          <label htmlFor="childCategoryImage" className="block text-sm font-medium text-gray-700">Child Category Image</label>
            <div className="mt-1 flex items-center space-x-4">
              <span className="h-20 w-20 rounded-md overflow-hidden bg-gray-100">
                {childCategoryImagePreview ? <img src={childCategoryImagePreview} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200"/>}
              </span>
              <input type="file" onChange={(e) => {setChildCategoryImageFile(e.target.files[0]); setChildCategoryImagePreview(URL.createObjectURL(e.target.files[0]));}} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
        </div>
        <div>
          <label htmlFor="childCategoryBanner" className="block text-sm font-medium text-gray-700">Banner Image</label>
            <div className="mt-1 flex items-center space-x-4">
              <span className="h-20 w-40 rounded-md overflow-hidden bg-gray-100">
                {childCategoryBannerPreview ? <img src={childCategoryBannerPreview} alt="Banner Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200"/>}
              </span>
              <input type="file" onChange={(e) => {setChildCategoryBannerFile(e.target.files[0]); setChildCategoryBannerPreview(URL.createObjectURL(e.target.files[0]));}} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            <p className="mt-1 text-xs text-gray-500">Recommended size: 1200x300 pixels</p>
        </div>
        <div className="flex items-center">
            <input id="childCategoryIsActive" type="checkbox" checked={childCategoryIsActive} onChange={(e) => setChildCategoryIsActive(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
            <label htmlFor="childCategoryIsActive" className="ml-2 block text-sm text-gray-900">Set as Active</label>
        </div>
        <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => setView('welcome')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={imageUploading || childCategoryLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                {imageUploading ? 'Uploading...' : childCategoryLoading ? 'Processing...' : (view === 'edit-childcategory' ? 'Update Child Category' : 'Create Child Category')}
            </button>
        </div>
      </form>
      {childCategoryError && <p className="mt-4 text-sm text-red-600">{childCategoryError.message}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Category List */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Categories</h2>
              <button onClick={handleShowNewCategoryForm} className="flex items-center space-x-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-2">
                <PlusIcon className="h-4 w-4"/>
                <span>New</span>
              </button>
            </div>
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error.message}</p> : 
                categories?.length === 0 ? <p className="text-gray-500 text-sm text-center py-4">No categories found.</p> :
                categories?.map(cat => (
                  <div key={`cat-${cat._id}`} className={`rounded-lg border ${selectedCategory?._id === cat._id ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50" onClick={() => { handleEditCategory(cat); toggleCategoryExpansion(cat._id); }}>
                          <div className="flex items-center space-x-3">
                            <img src={cat.categoryImage || 'https://via.placeholder.com/40'} alt={cat.categoryName} className="h-10 w-10 rounded-md object-cover bg-gray-200"/>
                            <div>
                              <p className="font-semibold text-gray-800">{cat.categoryName}</p>
                              <p className={`text-xs font-medium ${cat.isActive ? 'text-green-600' : 'text-gray-500'}`}>{cat.isActive ? 'Active' : 'Inactive'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                              <button onClick={(e) => { e.stopPropagation(); handleEditCategory(cat); }} className="p-1 text-gray-500 hover:text-blue-600"><EditIcon className="h-4 w-4"/></button>
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat._id); }} className="p-1 text-gray-500 hover:text-red-600"><DeleteIcon className="h-4 w-4"/></button>
                              <button onClick={(e) => { e.stopPropagation(); toggleCategoryExpansion(cat._id); }} className="p-1 text-gray-500 hover:text-gray-700">
                                <ChevronDownIcon className={`h-4 w-4 transition-transform ${expandedCategories[cat._id] ? 'rotate-180' : ''}`}/>
                              </button>
                          </div>
                      </div>
                      {expandedCategories[cat._id] && (
                        <div className="pb-2 px-3">
                          {cat.subcategories?.length > 0 ? (
                            <ul className="space-y-2">
                              {cat.subcategories.map(sub => (
                                <li key={`sub-${sub._id}`} className={`rounded border ${selectedSubcategory?._id === sub._id ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}>
                                  <div className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); handleEditSubCategory(sub, cat); toggleSubcategoryExpansion(sub._id); }}>
                                    <div className="flex items-center space-x-2">
                                      <img src={sub.subCategoryImage || 'https://via.placeholder.com/30'} alt={sub.subCategoryName} className="h-6 w-6 rounded object-cover bg-gray-200"/>
                                      <span className="text-sm">{sub.subCategoryName}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <button onClick={(e) => { e.stopPropagation(); handleEditSubCategory(sub, cat); }} className="p-1 text-gray-400 hover:text-blue-600"><EditIcon className="h-3 w-3"/></button>
                                      <button onClick={(e) => { e.stopPropagation(); handleDeleteSubCategory(sub._id); }} className="p-1 text-gray-400 hover:text-red-600"><DeleteIcon className="h-3 w-3"/></button>
                                      <button onClick={(e) => { e.stopPropagation(); toggleSubcategoryExpansion(sub._id); }} className="p-1 text-gray-400 hover:text-gray-600">
                                        <ChevronDownIcon className={`h-3 w-3 transition-transform ${expandedSubcategories[sub._id] ? 'rotate-180' : ''}`}/>
                                      </button>
                                    </div>
                                  </div>
                                  {expandedSubcategories[sub._id] && (
                                    <div className="pl-4 pr-2 pb-2">
                                      {sub.childCategory?.length > 0 ? (
                                        <ul className="space-y-1">
                                          {sub.childCategory.map(child => (
                                            <li key={`child-${child._id}`} className={`flex items-center justify-between p-1 text-xs rounded ${selectedChildCategory?._id === child._id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                              <div className="flex items-center space-x-2">
                                                <img src={child.childCategoryImage || 'https://via.placeholder.com/20'} alt={child.childCategoryName} className="h-4 w-4 rounded object-cover bg-gray-300"/>
                                                <span>{child.childCategoryName}</span>
                                              </div>
                                              <div className="flex items-center">
                                                <button onClick={(e) => { e.stopPropagation(); handleEditChildCategory(child, sub); }} className="p-1 text-gray-400 hover:text-blue-600"><EditIcon className="h-3 w-3"/></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteChildCategory(child._id); }} className="p-1 text-gray-400 hover:text-red-600"><DeleteIcon className="h-3 w-3"/></button>
                                              </div>
                                            </li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <p className="text-xs text-gray-500 text-center py-1">No child categories</p>
                                      )}
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleShowNewChildCategoryForm(sub); }} 
                                        className="w-full mt-1 text-left text-xs p-1 bg-gray-200 hover:bg-gray-300 text-blue-600 rounded flex items-center justify-center space-x-1"
                                      >
                                        <PlusIcon className="h-3 w-3"/>
                                        <span>Add Child Category</span>
                                      </button>
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-gray-500 text-center py-2">No subcategories</p>
                          )}
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleShowNewSubCategoryForm(cat); }} 
                            className="w-full mt-2 text-left text-xs p-1.5 bg-gray-100 hover:bg-gray-200 text-blue-600 rounded flex items-center justify-center space-x-1"
                          >
                            <PlusIcon className="h-3 w-3"/>
                            <span>Add Subcategory</span>
                          </button>
                        </div>
                      )}
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* Right Column: Form Panel */}
        <div className="md:col-span-2">
          {renderPanel()}
        </div>

      </div>
    </div>
  );
}
