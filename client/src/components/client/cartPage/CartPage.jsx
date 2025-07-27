import { useWishlist } from "../../../../context/wishListhContext";

export default function CartPageProduct(){
             const { toggleWishlist,wishlistItems, isInWishlist,productsWithWishlistStatus } = useWishlist();


return (
            <>

                        <div className="border      h-screen">
                <div className="border  border-black  "
>  

                                <div className=" px-4 ">
                                        <p className="text-base font-bold">My Bag (0 item)</p>           
                                </div>


                        
                         <div className=" ">
                                  {productsWithWishlistStatus?.wishlist &&
                                  productsWithWishlistStatus?.wishlist?.map((product, idx) => (console.log(product),
                                      <div className="flex  gap-4 border-b border-gray-200 p-4"
                                        key={product._id || idx}
                                      >
                                          <div className="" >
                                                    <img className="h-52 object-contain" src={product?.images?.[0]?.imagesUrls} alt="product image" />

                                        
                                      
</div>    <p className="font-bold ">{product?.name}</p>
        <p  className="text-gray-300">Color:{product?.color}</p>
                                      </div>
                                    ))}
                                </div>

                


</div>

        





                        </div>




            </>

   
)}