import { Link, useNavigate } from "react-router-dom";
import { useResendOtp, useSignup, useVerfiyOtp } from "../../../hooks/auth/use-Auth";
import { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "../../../../context/authConext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";

export default function Signup() {
  const { Signup, loading, error, success } = useSignup();
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
  }, [success?.status]);

  return (
    <>
      {showOtp ? (
        <OtpVerification email={success?.data?.email} />
      ) : (
        <div className="min-h-screen flex">
          {/* Left side - Branding */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-red-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="flex flex-col justify-center items-center text-white p-12 relative z-10">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-6">Join Our Community</h1>
                <p className="text-xl opacity-90 mb-8">
                  Create your account and start your journey with us today
                </p>
                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-6 w-6" />
                    <span className="text-lg">Secure & Protected</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-6 w-6" />
                    <span className="text-lg">Personalized Experience</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-6 w-6" />
                    <span className="text-lg">Instant Verification</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Signup Form */}
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
            <div className="w-full max-w-md">
              <Card className="shadow-lg border-0">
                <CardHeader className="space-y-2 text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
                  <CardDescription className="text-gray-600">
                    Fill in your details to get started
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                          First Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="John"
                            className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                          Last Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Doe"
                            className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="pl-10 pr-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium transition-all duration-200"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>

                    {error && (
                      <div className="p-3 rounded-md bg-red-50 border border-red-200">
                        <p className="text-sm text-red-600">
                          {error.response?.data?.message || error.message || 'An error occurred'}
                        </p>
                      </div>
                    )}

                    {success && (
                      <div className="p-3 rounded-md bg-green-50 border border-green-200">
                        <p className="text-sm text-green-600">
                          {success.message || "Signup successful!"}
                        </p>
                      </div>
                    )}
                  </form>

                  <div className="text-center text-sm">
                    <span className="text-gray-600">
                      Already have an account?{' '}
                      <Link 
                        to="/login" 
                        className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                      >
                        Sign in
                      </Link>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function OtpVerification({ email }) {
  const [otp, setOtp] = useState("");
  
  const { verifyOtp, loading: otpLoading, error: otpError, success: otpSuccess } = useVerfiyOtp();
  const { resendOtp, loading, error, success } = useResendOtp();
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleFrom = async (e) => {
    e.preventDefault();

    setTimeout(async () => {
      if (otp.length === 6) {
        console.log("OTP verified:", otp);
        await verifyOtp(email, otp);
      } else {
        setError("Please enter a 6-digit code");
      }
    }, 1000);
  };

  const HandleResendOtp = async () => {
    await resendOtp(email);
  };

  useEffect(() => {
    authLogin(otpSuccess?.data?.token);
    if (otpSuccess?.data?.token) {
      navigate('/');
    }
    console.log(otpSuccess?.data?.token);
  }, [otpSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Verify Your Account</CardTitle>
            <CardDescription className="text-gray-600">
              We've sent a 6-digit code to your email
            </CardDescription>
            <p className="text-gray-800 font-medium text-sm bg-gray-100 px-3 py-1 rounded-md inline-block">
              {email}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleFrom} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP 
                  maxLength={6} 
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  className="gap-2"
                >
                  <InputOTPGroup className="gap-2">
                    {[...Array(6)].map((_, index) => (
                      <InputOTPSlot 
                        key={index} 
                        index={index}
                        className="w-12 h-12 text-lg font-semibold border-2 border-gray-200 focus:border-orange-500"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>          
              </div>

              <Button
                type="submit"
                disabled={otpLoading}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium transition-all duration-200"
              >
                {otpLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Account'
                )}
              </Button>

              {(otpSuccess?.data?.message || success?.data?.message) && (
                <div className="p-3 rounded-md bg-green-50 border border-green-200">
                  <p className="text-sm text-green-600 text-center">
                    {success?.data?.message || otpSuccess?.data?.message}
                  </p>
                </div>
              )}

              {(otpError || error) && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 text-center">
                    {otpError?.message || error?.message || 'Verification failed'}
                  </p>
                </div>
              )}

              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Didn't receive the code?{' '}
                  <Button
                    onClick={HandleResendOtp}
                    type="button"
                    variant="link"
                    disabled={loading}
                    className="p-0 h-auto font-medium text-orange-600 hover:text-orange-500"
                  >
                    {loading ? 'Sending...' : 'Resend OTP'}
                  </Button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}