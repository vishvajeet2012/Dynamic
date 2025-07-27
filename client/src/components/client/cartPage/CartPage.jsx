import { useWishlist } from "../../../../context/wishListhContext";

export default function CartPageProduct() {
  const { toggleWishlist, wishlistItems, isInWishlist, productsWithWishlistStatus } = useWishlist();


  return (
    <>

      <div className="border      h-auo">
        <div className=" border-black  "
        >

          <div className=" border-b py-2 px-4 ">
            <p className="text-base font-bold">My Bag (0 item)</p>
          </div>



          <div className=" border-b p-4">
            {productsWithWishlistStatus?.wishlist &&
              productsWithWishlistStatus?.wishlist?.map((product, idx) => (console.log(product),
                <div className="flex gap-4 border-b border-gray-400 p-4"
                  key={product._id || idx}
                >
                  <div className="h-52 " >
                    <img className="h-52 object-contain aspect-[4/5]" src={product?.images?.[0]?.imagesUrls} alt="product image" />



                  </div>
                  <div className="flex flex-col md:flex-row justify-between w-full">
                    <div className="flex flex-col gap-2">
                      <p className="font-bold ">{product?.name}</p>
                      <div className="flex flex-row items-center text-sm gap-2">
                        <p className="font-bold">{product?.category?.categoryName} :</p>
                        <p>{product?.subcategories?.[0]?.subCategoryName}</p></div>
                      <p className="text-sm text-gray-400"><span className="text-black pr-1 font-bold text-sm">Color:</span>{product?.color}</p>
                     {product?.theme&& <p className="text-sm text-gray-400"> <span className="text-black pr-1 font-bold text-sm">Color:</span> {product?.theme}</p>}
                      <p className="text-sm text-gray-500">Quantity: <span className="text-black font-bold">{product?.quantity||"1"}</span></p>

                    </div>
                    <div classNa me="flex flex-row md:flex-col gap-2">
                      <p className="text-base text-gray-500">Price: <span className="text-black font-bold">{product?.sellingPrice}</span></p>

                    </div>
                  </div>
                </div>
              ))}

            <div className="flex justify-between items-center border-b p-4">
              <p className="text-sm text-gray-500">Total:</p>

            </div>



          </div>




        </div>







      </div>




    </>


  )
}