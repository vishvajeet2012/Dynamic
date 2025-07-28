import { useLocation } from "react-router-dom";
import CartPageProduct from "./CartPage";

export default function CartPage() {
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