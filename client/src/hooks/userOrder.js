import axios from "axios";
import { useState } from "react"
import { homeUrl } from "../lib/baseUrl";

export const usePlaceOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);  
// subcategorycreate
  const  placeOrder = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
const token =localStorage.getItem('token')
    try {
      const response =await axios.post(`${homeUrl}/placeorder`, {shippingInfo:formData},
         {
                   headers:{
                
                authorization:`Bearer ${token}`
                
            }
                }
            
      )
      setSuccess(true);
      return response.data;  
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);  
    }
  }
  return {placeOrder,loading , error,success}
  }

