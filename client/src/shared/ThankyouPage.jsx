import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderByUserId } from "../hooks/userOrder";
import { BiMoney } from "react-icons/bi";
import { MdPayment } from "react-icons/md";
import { FaFirstOrderAlt } from "react-icons/fa";
import FullScreenLoader from "./loading";

export default function ThankYouPage() {
  const { id } = useParams();
  const { getOrderByUserId, data, loading } = useGetOrderByUserId();
  const navigate = useNavigate();

  useEffect(() => {
    getOrderByUserId(id);
  }, [id]);
  if(loading) return <FullScreenLoader/>;


  return (
    <div className="w-full mt-8 px-4 h-screen lg:px-6 2xl:max-w-7xl 2xl:mx-auto flex justify-center items-start">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full  border border-gray-200">
     
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-black">
            {data?.message || "Thank you for your order!"}
          </h1>
          <p className="text-gray-500 mt-2">
            Your purchase ID:{" "}
            <span className="font-semibold text-gray-700">{id}</span>
          </p>
        </div>

     
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center shadow-sm">
            <BiMoney className="text-3xl text-green-500 mb-2" />
            <p className="text-sm text-gray-500">Payment Method</p>
            <p className="font-semibold text-gray-800">
              {data?.data?.paymentMethod || "--"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center shadow-sm">
            <FaFirstOrderAlt className="text-3xl text-blue-500 mb-2" />
            <p className="text-sm text-gray-500">Order Status</p>
            <p className="font-semibold text-gray-800">
              {data?.data?.status || "--"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center shadow-sm">
            <MdPayment className="text-3xl text-purple-500 mb-2" />
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-semibold text-gray-800">
              ₹{data?.data?.totalPrice || "0"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-primaryReds hover:bg-red-600 transition text-white font-medium px-6 py-3 rounded-lg shadow-md"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
