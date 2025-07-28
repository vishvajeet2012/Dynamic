import { useState } from "react";
import { useCart } from "../../../../context/cartContext";

export default function RemoveCartProduct({  productId, quantity, size, color }){


      const {
        loading,
        cartItems,
        error,
        addToCart,
        getCartItems,
        updateCartItem,
        removeCartItem,
        getTotalItems,
        getTotalPrice,
      } = useCart();
    
      const [openModal, setOpenModal] = useState(false);
    
      const handleRemoveCart = (e) => {
        console.log(e)
        const { color, productId, quantity, size } = e;
        if (!size) {
          setOpenModal(true);
        } else {
          removeCartItem(productId, quantity, size, color);
        }
      };
    


    return(
        <>

   <button
                        onClick={() => handleRemoveCart({productId,quantity,size,color})}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm"
                      >
                        Remove
                      </button>


        </>
    )
}