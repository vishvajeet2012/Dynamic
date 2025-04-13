import { useState } from 'react';
import axios from 'axios';
import { homeUrl } from '../lib/baseUrl';


export const useCreateCateogry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);  

  const createCategory = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response =await axios.post(`${homeUrl}/categorycreate`,formData)
      setSuccess(true);
      return response.data;  
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);  
    }
  }
  return {createCategory,loading , error,success}
  }




export const useGetAllCategories = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState();

  const fetechCategories = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.get(`${homeUrl}/getallcategory`)
       setCategories(response.data);
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);
    }
  };
     
  return {categories,  fetechCategories, loading, error, success };
};