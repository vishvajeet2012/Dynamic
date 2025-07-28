import { useCart } from "../../../../context/cartContext"

export default function AddToCart({productDetail, productId, quantity, size, color}){
const {  loading,
        cartItems,
        error,
        
        // Functions
        addToCart,
        getCartItems,
        updateCartItem,
        removeCartItem,
        getTotalItems,
        getTotalPrice,
        }=  useCart()

      const handleAddToCart =(e)=>{
        console.log(e,"thisb ")
        addToCart(e)
      }

  return(
        <>

                   <button 
                   onClick={()=>handleAddToCart({productId,  productId, quantity, size, color})}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition-colors"
              disabled={productDetail?.stock <= 0}
            >
              {productDetail?.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

        </>
    )
}