import { useState } from "react"
import { baseUrl } from "../../lib/baseUrl"
import axios from "axios"
import Signup from "../../components/client/auth/signup"
export function useLogin(){
    const [loading,setloading]= useState(false)
    const [error,setError]= useState(null)
    const [success,setSuccess]= useState(null)

    const login = async (email,password)=>{
        setloading(true)
        setError(null)
        setSuccess(null)
        try{
            const response = await axios.post(`${baseUrl}/userFound`,email,password)
            setSuccess(true)
            return response.data
        }catch(err){
            setError(err)
        }finally{
            setloading(false)
        }
    }
    return {login,loading,error,success}
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
            setSuccess(true)
            return response.data
        }catch(err){
            setError(err)
        }finally{
            setloading(false)
        }
    }
    return {Signup,loading,error,success}
}