import { useState } from "react";
import axios from "axios";
import { homeUrl } from "../../lib/baseUrl";

export const useuploadImage = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const uploadImage = async (formData) => {
    if (!formData || !(formData instanceof FormData)) {
      console.error("Invalid formData passed to uploadImage");
      setError("No file uploaded");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try { const token = localStorage.getItem('token');
      const response = await axios.post(`${homeUrl}/uploadImage`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
         Authorization:  `Bearer ${token}`
        },
      });

      setImage(response.data.url || response.data); // depends on backend
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return { image, loading, error, success, uploadImage };
};
