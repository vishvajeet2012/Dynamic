import axios from "axios"
import { useState } from "react"
import { baseUrl } from "../../../lib/baseUrl"

export const useUserProfileUpdate = ()=>{
const [loading,setloading]= useState(false)
    const [error,setError]= useState(null)
    const [success,setSuccess]= useState(null)
   
    const userProfileUpdate = async (data)=>{
        setloading(true)
        setError(null)
        setSuccess(null)
        try{
            const token = localStorage.getItem("token");
            const response = await axios.post(`${baseUrl}/userdataupdate`,data,{
                headers: {
                    authorization: `Bearer ${token}`,
                  },    
            })
         
            setSuccess(true)
         return response.data;
        }catch(err){
            setError(err)
        }finally{
            setloading(false)
        }
    }
    return {userProfileUpdate,loading,error,success}
}




export const useProfilePictureupdate= () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const userProfilePictureUpdate = async (fromData) => {
      setloading(true);
      setError(null);
      setSuccess(null);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${baseUrl}/userdataupdate`, {
        fromData
        }, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
    
        setSuccess(true);
        return response.data;
      } catch (err) {
        setError(err);
}
      finally {
        setloading(false);
      }
    };  
    return { userProfilePictureUpdate, loading, error, success };
  };
