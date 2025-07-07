import { Link, useNavigate } from "react-router-dom";
import { useSignup, useVerfiyOtp } from "../../../hooks/auth/use-Auth"
import { useState,useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useAuth } from "../../../../context/authConext";
export default function Signup() {
    const { Signup, loading, error, success } = useSignup();
  const [showOtp,setShowOtp]= useState(false)
    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const password = formData.get('password');
        
        await Signup({ firstName, lastName, email, password });
    }
   
      useEffect(() => {
        if (success?.status === 200) {
            setShowOtp(true);
        }
    }, [success?.status]); // Only


    return (
        <>{showOtp? (<OtpVerification email={success?.data?.email} />):(
           <div className="">
               <div className="w-full flex flex-row h-screen">
                 <div className="w-1/2 p-6 bg-orange-600">
                   <div className="text-2xl font-bold">Signup</div>
                 </div>
                 <div className="w-1/2 p-6">
                   <div className="h-screen flex justify-center items-center">
                     <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md">
                      <label htmlFor="firstName">First Name</label>
                       <input 
                         className="border p-2 rounded" 
                         type="text" 
                         id="firstName" 
                         name="firstName" 
                         required 
                       />
                    <label htmlFor="lastName">Last Name</label>
                       <input 
                         className="border p-2 rounded" 
                         type="text" 
                         id="lastName" 
                         name="lastName" 
                         required 
                       />

                       <label htmlFor="email">Email</label>
                       <input 
                         className="border p-2 rounded" 
                         type="email" 
                         id="email" 
                         name="email" 
                         required 
                       />
                       
                       <label htmlFor="password" className="mt-4">Password</label>
                       <input 
                         className="border p-2 rounded mb-4" 
                         type="password" 
                         id="password" 
                         name="password" 
                         required 
                       />
                       
                       <button 
                         className="bg-[#e11b23] p-2 text-white rounded hover:bg-red-700 transition-colors" 
                         type="submit"
                         disabled={loading}
                       >
                         {loading ? 'Signing up...' : 'Sign Up'}
                       </button>
                       
                       {/* Fixed error display - show only the message */}
                       {error && <p className="text-red-500 mt-2">
                         {error.response?.data?.message || error.message || 'An error occurred'}
                       </p>}
                       {success && <p className="text-green-500 mt-2">{success.message || "Signup successful!"}</p>}
                       
                       <p className="mt-4">
                         Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
                       </p>
                     </form> 
                   </div>
                 </div>
               </div>
             </div>)}

        </>
    )
}



 function OtpVerification({email}) {
  const [otp,setOtp]= useState("")
  const  {verifyOtp,loading:otpLoading,error:otpError,success:otpSuccess}=  useVerfiyOtp()
const { login: authLogin } = useAuth();
  const navigate = useNavigate();

const handleFrom = async(e)=>{

   e.preventDefault()

  setTimeout( async()=>{
if (otp.length === 6) {
        console.log("OTP verified:", otp);
   await verifyOtp(email,otp)
authLogin(otpSuccess?.token)
      } else {
        setError("Please enter a 6-digit code");
      }
      

  },1000)

}




  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Account</h1>
          <p className="text-gray-600">We've sent a 4-digit code to your email</p>
          <p className="text-gray-800 font-medium mt-1">user@example.com</p>
        </div>

        <form onSubmit={handleFrom}>
          <div className="flex justify-center space-x-4 mb-8">

    <InputOTP 
              maxLength={6} 
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>          
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 py-3 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Verify Account
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Didn't receive code? 
              <button
                type="button"
                className="text-blue-600 hover:underline ml-1"
              >
                Resend OTP
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}