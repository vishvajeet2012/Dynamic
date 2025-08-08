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





  export const useGetAllOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setSuccess] = useState(false);  
// subcategorycreate
  const  getallorder = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
const token =localStorage.getItem('token')
    try {
      const response =await axios.post(`${homeUrl}/getallorder`,{},
         {
                   headers:{
                
                authorization:`Bearer ${token}`
                
            }
                }
            
      )
      setSuccess(response.data);
      return response.data;  
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);  
    }
  }
  return {getallorder,loading , error,data}
  }



   export const useupdateOrderStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setSuccess] = useState(false);  
// subcategorycreate
  const  updateOrderStatus = async (orderId,status) => {
    setLoading(true);  
    setError(null);
    setSuccess(false);
    console.log(orderId)
const token =localStorage.getItem('token')
    try {
      const response =await axios.post(`${homeUrl}/updateOrderStatus`,{orderId,status},
         {
                   headers:{
                
                authorization:`Bearer ${token}`
                
            }
                }
            
      )
      setSuccess(response.data);
      return response.data;  
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);  
    }
  }
  return {updateOrderStatus,loading , error,data}
  }





  export const useGetOrderByUserId = ()=>{
    const [loading,setLoading] = useState(true)
    const [error,setError]=useState(null)
    const [data,setData] = useState()
    const [success,setSuccess]=useState()

    const getOrderByUserId = async(orderId)=>{

 setLoading(true);  
    setError(null);
    setSuccess(false);

const token =localStorage.getItem('token')
    try {
      const response =await axios.post(`${homeUrl}/getOrderbyId`,{orderId:orderId},
         {
                   headers:{
                
                authorization:`Bearer ${token}`
                
            }
                }
            
      )
      setSuccess(true)
      setData(response.data);
      return response.data;  
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);  
    }
  }
return { getOrderByUserId,success,loading,error ,data}

  }