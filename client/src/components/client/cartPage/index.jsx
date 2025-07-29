import { useLocation, useNavigate } from "react-router-dom";
import CartPageProduct from "./CartPage";

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
    const location = useLocation()  /// use hota hai pathname ko check kane ke liye

    const isActive = (path) => {
        return location.pathname === path ?  "primaryReds font-bold   capitalize" : "text-gray-500 capitalize font-bold";
    }


    return (

        <section className="w-full mt-4 px-4 lg:px-6 2xl:max-w-7xl 2xl:mx-auto">
            <div className="flex my-6 flex-row justify-center   items-center">
                {location?.pathname === "/cart" && (
                    <p className={`text-base ${isActive("/cart")} `}>My Bag</p>
                )}

                <p className="border-dashed border-black border mx-2 w-14"></p>

                {location?.pathname === "/cart" && (
                    <p className={`text-base ${isActive("/shipment")} `}>Address</p>
                )}

                <p className="border-dashed border-black border mx-2 w-14"></p>


                {location?.pathname === "/cart" && (
                    <p className={`text-base ${isActive("/payment")} `}>Payment</p>
                )}


            </div>


            <CartPageProduct />


        </section>
    );
}