import { useState } from "react";
import axios from "axios"; 
import { homeUrl } from "../../lib/baseUrl";

export const useCreateAboutUs = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const createAboutUs = async (formData) => {
    console.log(formData);
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${homeUrl}/createaboutus`, formData);
      setSuccess(response?.data);
      
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { createAboutUs, loading, error, success };
};


export const  useGetAboutUs = ()=>{
  const [loading,setLoading]= useState(false)
  const [error,setError]=useState(null)
  const [getAllAboutUs,setAboutUs]= useState([])
      const fetechAboutUs = async()=>{
          setLoading(true)
          setError(null)
          try{
              const response = await axios.get(`${homeUrl}/getaboutus`)
              setAboutUs(response.data)

      }catch(err){
      setError(err)
      }finally{
          setLoading(false)  
      }
    }
    return {fetechAboutUs, loading ,error,getAllAboutUs}

}