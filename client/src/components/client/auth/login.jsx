
import { useAuth } from "../../../../context/authConext";
import { useLogin } from "../../../hooks/auth/use-Auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() { 
  const { login: loginApi, loading, error, success } = useLogin();
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    const token = await loginApi({ email, password });
    if (token) {
      authLogin(token); // Store token via context
      navigate('/dashboard'); // Redirect to protected route
    }
  }
  return (
    <div className="">
      <div className="w-full flex flex-row h-screen">
        <div className="w-1/2 p-6 bg-orange-600">
          <div className="text-2xl font-bold">Login</div>
        </div>
        <div className="w-1/2 p-6">
          <div className="h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md">
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
                {loading ? 'Logging in...' : 'Login'}
              </button>
              
              {error && <p className="text-red-500 mt-2">{error}</p>}
              {success && <p className="text-green-500 mt-2">{success}</p>}
              
              <p className="mt-4">
                Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
              </p>
            </form> 
          </div>
        </div>
      </div>
    </div>
  )
}