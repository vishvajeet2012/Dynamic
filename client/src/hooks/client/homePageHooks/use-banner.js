import { useState } from "react"
import { homeUrl } from "../../../lib/baseUrl";
import axios from "axios";
export const useBannerCreate = ()=>{
    const [loading,setloading]= useState(false)
    const [error,setError]= useState(null)
    const [success,setSuccess]= useState(null)


    const createBanner= async (bannerPayload)=>{
        setloading(true)
        setError(null)
        setSuccess(null)
       const { 
  bannerType, 
  endDate, 
  isActive, 
  publicId, 
  redirectUrl, 
  startDate, 
  uploadedBy, 
  url 
} = bannerPayload;
        console.log(bannerPayload,"supeerkbh")
        try{
            const token   = localStorage.getItem('token')
            const response = await axios.post(`${homeUrl}/bannercreates`,{url,uploadedBy,startDate,endDate,isActive,publicId,redirectUrl,bannerType},{
                headers:{
                 
                    Authorization: `Bearer ${token}`
                }
            })
            setSuccess(true)
            return response.data
        }catch(err){
            setError(err)
        }finally{
            setloading(false)
        }
    }
    return {createBanner,loading ,error,success}
}





export const usegetBannersByType = ()=>{

    const [loading ,setLoading] = useState(false)
    const [error , setError] = useState(null)
    const [success , setSuccess] = useState(null)
    const [banners , setBanners] = useState([])
        const getBanner  = async (bannerType,isActive)=>{
            try{
                const token = localStorage.getItem('token')
                const response = await axios.post(`${homeUrl}/getbannersbytype`,
                    {
                        bannerType:bannerType,
                        isActive:isActive,
                    },{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setBanners(response.data)
                setSuccess(true)
                
            }catch(err){
                setError(err)
            }finally{
            setLoading(false)
            if(error){
                setError(null)
            }
            
            }
        }
        return {getBanner,loading ,error,success,banners}
}






export const useUplaodImage = ()=>{

    const [loading ,setLoading] = useState(false)
    const [error , setError] = useState(null)
    const [success , setSuccess] = useState(null)
    const [banners , setBanners] = useState([])
        const uploadImage  = async (formData)=>{
            try{
                const token = localStorage.getItem('token')
                const response = await axios.post(`${homeUrl}/uploadImage`,formData,
                    {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setBanners(response.data?.image)
                setSuccess(true)
                return response.data?.image
            }catch(err){
                setError(err)
            }finally{
            setLoading(false)
            if(error){
                setError(null)
            }
            
            }
        }
        return {uploadImage,loading ,error,success,banners}
}



export const useGetBannnerData =(bannerType)=>{


        const [loading,setLoading ] = useState(false)
        const [error,setError] = useState(null)
        const [success,setSuccess] = useState(null)

        const getAllBannerData = async()=>{
            try{
                const token = localStorage.getItem('token')
                const response = await axios.post(`${homeUrl}/getbannersbytype`,{bannerType},{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setSuccess(true)
                return response.data?.data
            }catch(err){
                setError(err)
            }finally{
            setLoading(false)
            if(error){
                setError(null)
            }
            
            }
        }
return {getAllBannerData,loading ,error,success}
}