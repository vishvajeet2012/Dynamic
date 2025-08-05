import { useState } from "react";
import { useBannerCreate, usegetBannersByType, useUplaodImage } from "../../../../hooks/client/homePageHooks/use-banner";

export default function CreateBanner() {
  // Image upload states
  const [desktopImages, setDesktopImages] = useState([]);
  const [mobileImages, setMobileImages] = useState([]);
  const [imageOrders, setImageOrders] = useState({});
  
  // Banner form state
  const [formData, setFormData] = useState({
    bannerType: 'homepage',
    isActive: true,
    redirectUrl: '',
    startDate: '',
    endDate: ''
  });

  // API hooks
  const { uploadImage, loading: uploadLoading, error: uploadError } = useUplaodImage();
  const { createBanner, loading: createLoading, error: createError, success: createSuccess } = useBannerCreate();

  // Handle desktop image upload
  const handleDesktopUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      const response = await uploadImage(uploadFormData);

      if (response && response.url && response.publicId) {
        setDesktopImages(prev => [...prev, {
          url: response.url,
          publicId: response.publicId,
          order: desktopImages.length
        }]);
      }
    } catch (error) {
      console.error("Error uploading desktop image:", error);
    }
  };

  const handleMobileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      const response = await uploadImage(uploadFormData);

      if (response && response.url && response.publicId) {
        setMobileImages(prev => [...prev, {
          url: response.url,
          publicId: response.publicId,
          order: mobileImages.length
        }]);
      }
    } catch (error) {
      console.error("Error uploading mobile image:", error);
    }
  };

  // Remove an image from either desktop or mobile list
  const removeImage = (type, index) => {
    if (type === 'desktop') {
      setDesktopImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setMobileImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Update image order
  const updateImageOrder = (type, index, newOrder) => {
    const numericOrder = Number(newOrder);
    if (isNaN(numericOrder)) return;

    if (type === 'desktop') {
      setDesktopImages(prev => {
        const updated = [...prev];
        updated[index].order = numericOrder;
        return updated.sort((a, b) => a.order - b.order);
      });
    } else {
      setMobileImages(prev => {
        const updated = [...prev];
        updated[index].order = numericOrder;
        return updated.sort((a, b) => a.order - b.order);
      });
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
    
    if (desktopImages.length === 0 || mobileImages.length === 0) {
      alert("Please upload at least one desktop and one mobile image");
      return;
    }

    // Match desktop and mobile images by index (simplified approach)
    const images = desktopImages.map((desktopImg, index) => ({
      url: desktopImg.url,
      publicId: desktopImg.publicId,
      mobileUrl: mobileImages[index]?.url || desktopImg.url, // Fallback to desktop if mobile missing
      mobilePublicId: mobileImages[index]?.publicId || desktopImg.publicId,
      order: desktopImg.order
    }));

    try {
      const bannerPayload = {
        images,
        bannerType: formData.bannerType,
        isActive: formData.isActive,
        redirectUrl: formData.redirectUrl || undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        uploadedBy: "currentUserId" // Replace with actual user ID from auth context
      };
      
      console.log(bannerPayload,"this sishdi")
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
        setDesktopImages([]);
        setMobileImages([]);
      }
    } catch (error) {
      console.error("Error creating banner:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 text-black p-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6">Create New Banner</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Desktop Images Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Desktop Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {desktopImages.map((image, index) => (
                <div key={index} className="border rounded p-3 flex flex-col">
                  <img 
                    src={image.url} 
                    alt={`Desktop ${index}`} 
                    className="h-40 object-contain mb-2"
                  />
                  <div className="flex items-center mb-2">
                    <label className="mr-2 text-sm">Order:</label>
                    <input
                      type="number"
                      value={image.order}
                      onChange={(e) => updateImageOrder('desktop', index, e.target.value)}
                      className="w-16 p-1 border rounded"
                      min="0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage('desktop', index)}
                    className="mt-auto text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
              Upload Desktop Image
              <input 
                type="file" 
                className="hidden" 
                onChange={handleDesktopUpload}
                accept="image/*"
              />
            </label>
          </div>

          {/* Mobile Images Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Mobile Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {mobileImages.map((image, index) => (
                <div key={index} className="border rounded p-3 flex flex-col">
                  <img 
                    src={image.url} 
                    alt={`Mobile ${index}`} 
                    className="h-40 object-contain mb-2"
                  />
                  <div className="flex items-center mb-2">
                    <label className="mr-2 text-sm">Order:</label>
                    <input
                      type="number"
                      value={image.order}
                      onChange={(e) => updateImageOrder('mobile', index, e.target.value)}
                      className="w-16 p-1 border rounded"
                      min="0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage('mobile', index)}
                    className="mt-auto text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
              Upload Mobile Image
              <input 
                type="file" 
                className="hidden" 
                onChange={handleMobileUpload}
                accept="image/*"
              />
            </label>
          </div>

          {/* Banner Details Form */}
          <div className="space-y-4 mb-6">
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
                <option value="loginPage">Login Page</option>
                <option value="signupPage">Signup Page</option>
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
              disabled={uploadLoading || createLoading || desktopImages.length === 0 || mobileImages.length === 0}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {uploadLoading || createLoading ? (
                <span>Creating Banner...</span>
              ) : (
                <span>Create Banner</span>
              )}
            </button>
            {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
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