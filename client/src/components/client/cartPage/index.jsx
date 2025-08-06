import { useLocation, useNavigate } from "react-router-dom";
import CartPageProduct from "./CartPage";
import CartNavigation from "./CartNavigation";

export default function CartPage() {
const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">You must be logged in to view your cart.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
   

    return (

        <section className="w-full mt-4 px-4 lg:px-6 2xl:max-w-7xl 2xl:mx-auto">
           <CartNavigation/>

            <CartPageProduct />


        </section>
    );
}