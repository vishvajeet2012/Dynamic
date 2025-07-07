import { useState } from "react"
import { baseUrl } from "../../lib/baseUrl"
import axios from "axios"
import Signup from "../../components/client/auth/signup"


export const useGetSingleUser= ()=>{
const [laoding,setLoading]= useState(false)
const [error , setError]= useState(null)
const [user,setUser]= useState({})

            const getSingleUser = async()=>{
                setLoading(true)
                setError(null)
                try{
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${baseUrl}/getsingleuser`,{
                        headers: {
                            Authorization:  `Bearer ${token}`,
                             'Content-Type': 'application/json'
                        }
                    })
                    setUser(response.data)
                }catch(err){
                    setError(err)
                }finally{
                    setLoading(false)
                }
            }
            return {getSingleUser,laoding ,error,user}
}

export function useLogin(){
    const [loading,setloading]= useState(false)
    const [error,setError]= useState(null)
    const [success,setSuccess]= useState(null)
    const [token,setToken]= useState(null)
    const login = async (email,password)=>{
        setloading(true)
        setError(null)
        setSuccess(null)
        try{
            const response = await axios.post(`${baseUrl}/userFound`,email,password)
            setToken(response?.data?.token)
            setSuccess(true)
         return response.data.token;
        }catch(err){
            setError(err)
        }finally{
            setloading(false)
        }
    }
    return {login,loading,error,success,token}
}



export function useSignup(){
    const [loading,setloading]= useState(false)
    const [error,setError]= useState(null)
    const [success,setSuccess]= useState(null)

    const Signup = async (firstName,lastName, email,password)=>{
        setloading(true)
        setError(null)
        setSuccess(null)
        try{
            const response = await axios.post(`${baseUrl}/userSignup`, firstName, lastName, email, password)
            setSuccess(response.data)
            return response.data
        }catch(err){
            setError(err)
        }finally{
            setloading(false)
        }
    }
    return {Signup,loading,error,success}
}


export function useVerfiyOtp(){
    const [loading,setloading]= useState(false)
    const [error,setError]= useState(null)
    const [success,setSuccess]= useState(null)

    const verifyOtp = async(email,otp)=>{
        setloading(true)
        setError(null)
        setSuccess(null)
        try{
            const response = axios.post(`${baseUrl}/verifyotp`,{email,otp},{
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            setSuccess(response.data)
            return response.data
        }catch(err){
            setError(err)
        }finally{
            setloading(false)
        }
    }
return {verifyOtp,loading,error,success}

}




