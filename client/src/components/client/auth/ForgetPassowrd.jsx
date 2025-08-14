import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {useState} from 'react'
import { useForm } from "react-hook-form";

import { useforgetPassword, useverifyForgotPasswordOTP } from "../../../hooks/auth/use-Auth";

export default function ForgetPassowrd() {
 const {forgetPassword,loading,error,success}=   useforgetPassword()
const {verifyForgotPasswordOTP,loading:otpLoading,error:otpError,success:otpSuccess}= useverifyForgotPasswordOTP()
 const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

    const [otp, setOtp] = useState('');
const onSumbit = async(data)=>{
     if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    if(otp.length!==6){
        return setError('otp', { message: 'Please enter a 6-digit code' });
    }
    
    try{
      await  verifyForgotPasswordOTP(otp,data.password,data.confirmPassword)

    }catch(err){
        console.log(err)
    }


}
    
    return (
    <>  
        <div className="flex flex-col items-center justify-center h-screen">
     <form onSubmit={handleSubmit(onSumbit)} className="flex flex-col items-center justify-center border rounded-lg p-6 max-w-sm   space-y-4">
  <div className="w-full">
    <input
   {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
      type="password"
      placeholder="Password"
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <p className="text-red-500 text-sm mt-1">Password is required</p>
  </div>

  
  <div className="w-full">
    <input
  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: (value) => 
                      value === watch('password') || 'Passwords do not match'
                  })}
      type="password"
      placeholder="Confirm Password"
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
  </div>

  {/* OTP Field */}
  <div className="w-full">
    
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
    <p className="text-red-500 text-sm mt-1">OTP must be 6 digits</p>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mt-2"
  >
    Submit
  </button>
</form>
</div>
       </>
    )
}