import { useState } from 'react';
import axios from 'axios';
import { homeUrl } from '../lib/baseUrl';


export const useCreateCateogry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);  
// subcategorycreate
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



  
export const useCreateSubCateogry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);  
// subcategorycreate
  const createSubCategory = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response =await axios.post(`${homeUrl}/subcategorycreate`,formData)
      setSuccess(true);
      return response.data;  
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);  
    }
  }
  return {createSubCategory,loading , error,success}
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

export const useDeleteCategory = ()=>{
  const [loading,setloading]= useState(false)
  const [error,setError]= useState(null)
  const [success,setSuccess]=useState(false)

  const deleteCategory= async(id)=>{
    setloading(true)
    try{
          const response = axios.delete(`${homeUrl}/deletecategory/${id}`)
          setSuccess(true)
          return response.data
    }catch{
      setError

    }finally{
      setloading(false)
    }
  }
  return {deleteCategory,loading,error,success}
}
/// categoryupdatebyid


export const useUpdateCategory = ()=>{
  const [loading,setloading]= useState(false)
  const [error,setError]= useState(null)
  const [success,setSuccess]=useState(false)

  const updateCategory= async(id)=>{
    setloading(true)
    try{
          const response = axios.put(`${homeUrl}/updatecategory/${id}`)
          setSuccess(true)
          return response.data
    }catch{
      setError

    }finally{
      setloading(false)
    }
  }
  return {updateCategory,loading,error,success}
}