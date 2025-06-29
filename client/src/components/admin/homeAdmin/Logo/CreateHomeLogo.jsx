import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { homeUrl } from "../../../../lib/baseUrl";
import { usedeleteCloudImage, deleteHomeLogo } from "../../../../hooks/admin-hooks/adminHomePage/use-logo";
import { getLogoheader } from "../../../../hooks/client/homePageHooks/use-headerLogo";

export default function CreateHomeLogo() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentLogo, setCurrentLogo] = useState(null);
  
  // Logo fetching hook
  const { getLogo, loading: logoLoading, success: logoSuccess } = getLogoheader();
  
  // Delete hooks
  const { 
    cloudImageDelete, 
    loading: cloudDeleteLoading, 
    error: cloudDeleteError 
  } = usedeleteCloudImage();
  
  const { 
    deleteLogoHome, 
    loading: deleteLoading, 
    error: deleteError,
    success: deleteSuccess 
  } = deleteHomeLogo();

  // Set current logo when data loads
  useEffect(() => {
    setCurrentLogo(logoSuccess?.logo);
  }, [logoSuccess]);

  // Clear current logo when deleted successfully
  useEffect(() => {
    if (deleteSuccess) {
      setCurrentLogo(null);
      setSuccess("Logo deleted successfully");
    }
  }, [deleteSuccess]);

  // Handle form submission for new logo
  const onSubmit = async (data) => {
    if (!data.image || data.image.length === 0) {
      setError("Please select an image file");
      return;
    }

    const formData = new FormData();
    formData.append("image", data.image[0]);

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const token = localStorage.getItem('token');
      
      // Upload image to cloud
      const uploadResponse = await axios.post(`${homeUrl}/uploadImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });

      // Create logo record in database
      const createResponse = await axios.post(
        `${homeUrl}/homelogo`,
         uploadResponse?.data?.image ,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh logo data
      const logoData = await getLogo();
      setCurrentLogo(logoData?.logo);
      
      setSuccess("Logo uploaded successfully!");
      reset();
      setPreviewImage(null);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  // Preview image when file selected
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  // Handle logo deletion
  const handleDeleteLogo = async () => {
    if (!currentLogo) return;

    try {
      setError(null);
      
      // First delete from cloud storage
      await cloudImageDelete(currentLogo.publicId);
      
      // Then delete from database
      await deleteLogoHome(currentLogo._id);
      
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.message || "Failed to delete logo. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Logo Management</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Current Logo Section */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Current Logo</h3>
          
          {logoLoading || deleteLoading || cloudDeleteLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : currentLogo ? (
            <div className="flex flex-col items-center space-y-4">
              <img 
                src={currentLogo.url} 
                alt="Current Logo" 
                className="h-32 object-contain mb-4"
              />
              <button
                onClick={handleDeleteLogo}
                disabled={deleteLoading || cloudDeleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading || cloudDeleteLoading ? 'Deleting...' : 'Delete Logo'}
              </button>
              {(deleteError || cloudDeleteError) && (
                <div className="p-2 text-sm text-red-700 bg-red-100 rounded-md">
                  {deleteError || cloudDeleteError}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No logo uploaded yet
            </div>
          )}
        </div>

        {/* Upload Logo Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Upload New Logo</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                {...register("image", {
                  required: "Image is required",
                })}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
              )}
            </div>

            {previewImage && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="h-32 w-full object-contain border rounded bg-white p-2"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Upload Logo'}
            </button>

            {error && (
              <div className="p-3 mt-4 text-sm text-red-700 bg-red-100 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 mt-4 text-sm text-green-700 bg-green-100 rounded-md">
                {success}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Logo Guidelines */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">Logo Guidelines</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Recommended size: 300px × 100px</li>
          <li>Transparent background preferred (PNG format)</li>
          <li>Maximum file size: 2MB</li>
          <li>High contrast for better visibility</li>
        </ul>
      </div>
    </div>
  );
}