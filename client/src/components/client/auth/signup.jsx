import { Link } from "react-router-dom";
import { useSignup } from "../../../hooks/auth/use-Auth"

export default function Signup() {
    const { Signup, loading, error, success } = useSignup();
    
    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const password = formData.get('password');
        
        await Signup({ firstName, lastName, email, password });
    }

    return (
        <>
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
                       {success && <p className="text-green-500 mt-2">{success}</p>}
                       
                       <p className="mt-4">
                         Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
                       </p>
                     </form> 
                   </div>
                 </div>
               </div>
             </div>
        </>
    )
}