import axios from "axios";
import { homeUrl } from "../../lib/baseUrl";
import { useState } from "react";

export const  useCreateProduct =()=>{
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


export const   useGetProduct=()=>{
    const [Product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const getProduct = async (id) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try{
            const token  = localStorage.getItem('token')
            const response = await axios.get(`${homeUrl}/getallproduct`,
                {
                   headers:{
                
                authorization:`Bearer ${token}`
                
            }
                }
            )
            setProduct(response);
            setSuccess(response?.data);
            return response?.data
        }catch(error){
            setError(error)
        }finally{
            setLoading(false)       
        }   
       }
       return {getProduct,loading ,Product, error,success}
}






export const   useAdminGetProduct=()=>{
    const [Product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const AdmingetProduct = async (id) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try{
            const token  = localStorage.getItem('token')
            const response = await axios.get(`${homeUrl}/getallproduct`,
                {
                   headers:{
                
                authorization:`Bearer ${token}`
                
            }
                }
            )
            setProduct(response);
            setSuccess(response?.data);
            return response?.data
        }catch(error){
            setError(error)
        }finally{
            setLoading(false)       
        }   
       }
       return {AdmingetProduct,loading ,Product, error,success}
}




export const useAdmindelteProduct =()=>{

    const [loading,setloading]=useState(false)
    const [error,setError]=useState(null)
    const [success,setProduct]=useState(null)
            const deleteProduct = async (formData) => {
                try{
                            const token  = localStorage.getItem('token')
                            const response = await axios.post(`${homeUrl}/productdetele`,formData,{
                                headers:{
                                    authorization:`Bearer ${token}`
                                }
                            })
                            setProduct(response)
                            return response
    }catch(error){
       setError(error)


    
    }finally{
        setloading(false)
    }

            }
            return {deleteProduct,loading,error,success}
    
}



export const useUpdateAdminPorduct = ()=>{
    const [loading,setloading]=useState(false)
    const [error,setError]=useState(null)
    const [success,setProduct]=useState(null)
            const updateProduct = async (formData) => {
                try{
                            const token  = localStorage.getItem('token')
                            const response = await axios.post(`${homeUrl}/updateproduct`,formData,{
                                headers:{
                                    authorization:`Bearer ${token}`
                                }
                            })
                            setProduct(response)
                            return response
    }catch(error){
       setError(error)


    
    }finally{
        setloading(false)
    }            }
            return {updateProduct,loading,error,success}    
}


export const useProductByKeys= ()=>{

    const [Product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const ProductByKeys = async (data) => {
         if (Object.keys(data).length === 0) {
        setLoading(true);
        
        return; // Exit the function early
    }
        
        setLoading(true);
        setError(null);
        setSuccess(null);
        try{
            const token  = localStorage.getItem('token')
            const response = await axios.post(`${homeUrl}/getProductbykeys`,{
data,


            },
                {
                   headers:{
                consume:'application/json',
                authorization:`Bearer ${token}`
                
            }
                }
            )
            setProduct(response);
            setSuccess(response?.data);
            return response?.data
        }catch(error){
            setError(error)
        }finally{
            setLoading(false)       
        }   
       }
       return {ProductByKeys
    ,loading ,Product, error,success}
}







export const useSubcategoryFilters = ()=>{

  const [loading,setloading]= useState(false)
  const [error,setError]= useState(null)
  const [success,setSuccess]=useState(false)
  const [filters, setFilters] = useState(null);
  const getFiltersForSubcategory = async(subcategoryId)=>{
    setloading(true)
    try{
   
          const response = await axios.post(`${homeUrl}/getFiltersForSubcategory`,{subcategoryId},{
            headers:{
              'Content-Type': 'application/json',
              authorization:`Bearer ${localStorage.getItem('token')}`
            }
          })
          setSuccess(true)
          setFilters(response?.data);
          return response.data
    }catch{
      setError

    }finally{
      setloading(false)
    }                     

  }
  return {getFiltersForSubcategory, filters,loading,error,success}
}   