import { useState } from "react";
import { useBannerCreate, usegetBannersByType, useUplaodImage } from "../../../../hooks/client/homePageHooks/use-banner";

export default function CreateBanner() {
  // Image upload state
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Banner form state
  const [formData, setFormData] = useState({
    bannerType: 'homepage',
    isActive: true,
    redirectUrl: '',
    startDate: '',
    endDate: ''
  });

  // Banner data state that will be sent to createBanner
  const [bannerData, setBannerData] = useState(null);

  // API hooks
  const { uploadImage, loading: uploadLoading, error: uploadError ,banners } = useUplaodImage();
  const { createBanner, loading: createLoading, error: createError, success: createSuccess } = useBannerCreate();

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
      setSelectedFile(null);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert("Please select an image file");
      return;
    }

    try {
      // First upload the image
      const uploadFormData = new FormData();
      uploadFormData.append('image', selectedFile);
      const uploadResponse = await uploadImage(uploadFormData);

      if (uploadResponse && uploadResponse.url && uploadResponse.publicId) {
        // Prepare the banner data
        const bannerPayload = {
          url: uploadResponse.url,
          publicId: uploadResponse.publicId,
          bannerType: formData.bannerType,
          isActive: formData.isActive,
          redirectUrl: formData.redirectUrl || undefined,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
          uploadedBy: uploadResponse.uploadedBy
        };

        // Set the banner data state
        setBannerData(bannerPayload);

        // Then create the banner with the prepared data
        await createBanner(bannerPayload);

        // Reset form on success
        if (createSuccess) {
          setFormData({
            bannerType: 'homepage',
            isActive: true,
            redirectUrl: '',
            startDate: '',
            endDate: ''
          });
          setPreviewImage(null);
          setSelectedFile(null);
          setBannerData(null);
        }
      }
    } catch (error) {
      console.error("Error creating banner:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 text-black p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6">Create New Banner</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
            {previewImage ? (
              <div className="mb-4 flex flex-col items-center">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="max-h-48 object-contain border rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setSelectedFile(null);
                  }}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              </div>
            )}
            {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
          </div>

          {/* Banner Details Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner Type</label>
              <select
                name="bannerType"
                value={formData.bannerType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="homepage">Homepage</option>
                <option value="promotional">Promotional</option>
                <option value="category">Category</option>
                <option value="product">Product</option>
                <option value="sidebar">Sidebar</option>
                <option value="footer">Footer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URL (optional)</label>
              <input
                type="url"
                name="redirectUrl"
                value={formData.redirectUrl}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Active Banner</label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (optional)</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date (optional)</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={uploadLoading || createLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {uploadLoading || createLoading ? (
                <span>Creating Banner...</span>
              ) : (
                <span>Create Banner</span>
              )}
            </button>
            {createError && <p className="mt-2 text-sm text-red-600">{createError}</p>}
            {createSuccess && (
              <p className="mt-2 text-sm text-green-600">Banner created successfully!</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}