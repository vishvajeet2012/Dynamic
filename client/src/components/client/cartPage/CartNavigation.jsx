import { useLocation } from "react-router-dom";

export default function CartNavigation(){

 const location = useLocation()  /// use hota hai pathname ko check kane ke liye

    const isActive = (path) => {
        return location.pathname === path ?  "primaryReds font-bold   capitalize" : "text-gray-500 capitalize font-bold";
    }


    return(
        <>
 <div className="flex my-6 flex-row justify-center   items-center">
                {location?.pathname === "/cart"? (
                    <p className={`text-base ${isActive("/cart")} `}>My Bag</p>
                ):(
  <p className={`text-base ${isActive("/cart")} `}>My Bag</p>

                )}


                <p className="border-dashed border-black border mx-2 w-14"></p>


                {location?.pathname === "/checkout" ? (
                    <p className={`text-base ${isActive("/checkout")} `}>Payment</p>
                ):(
                                        <p className={`text-base ${isActive("/checkout")} `}>Payment</p>

                )}


            </div>


        </>
    )
}