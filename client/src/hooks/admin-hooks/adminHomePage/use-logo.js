import { useState } from "react";
import { homeUrl } from "../../../lib/baseUrl";
import axios from "axios";


export const CreateLogo = ()=>{
    const [loading,setLoading]= useState(false)
    const [error,setError]= useState(null)
    const [success,setSuccess]= useState(null)
    const uploadUrl = async (formData) => {
        const token = localStorage.getItem("token");
        try {
          setLoading(true);
          setError(null);
          const response = await axios.post(`${homeUrl}/homelogo`, formData,{
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
          setSuccess(response?.data);
          
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      return {uploadUrl,loading ,error,success}        

}



export const usedeleteCloudImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const cloudImageDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      setError(null);
      const response = await axios.delete(`${homeUrl}/deleteImage/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(response?.data);
      return response?.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete cloud image");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { cloudImageDelete, loading, error, success };
};

export const deleteHomeLogo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const deleteLogoHome = async (logoId) => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      setError(null);
      const response = await axios.delete(`${homeUrl}/deletehomelogo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(response?.data);
      return response?.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete logo record");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteLogoHome, loading, error, success };
};