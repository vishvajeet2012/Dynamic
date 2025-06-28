import axios from "axios";
import { homeUrl } from "../../lib/baseUrl";
import { useState } from "react";

export default function useCreateProduct(){
   const [Product, setCreateProduct] = useState({});
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(null);

   const createProduct = async (productToCreate) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try{
        const token  = localStorage.getItem('token')

        const response = await axios.post(`${homeUrl}/productcreate`,productToCreate,{
            headers:{
                'Content-Type': 'application/json',
                authorization:`Bearer ${token}`
                
            }
        })
        setCreateProduct(response?.data);
        setSuccess(response?.data);
        return response?.data
    }catch(error){
        setError(error)
    }finally{
        setLoading(false)       
    }   
   }
   return {createProduct,loading ,Product, error,success}
}