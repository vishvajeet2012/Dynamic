// import { useWishlist } from "../../../../context/wishListhContext";

// export default function CartPageProduct() {
//   const { toggleWishlist, wishlistItems, isInWishlist, productsWithWishlistStatus } = useWishlist();


//   return (
//     <>

//       <div className="border      h-auo">
//         <div className=" border-black  "
//         >

//           <div className=" border-b py-2 px-4 ">
//             <p className="text-base font-bold">My Bag (0 item)</p>
//           </div>



//           <div className=" border-b p-4">
//             {productsWithWishlistStatus?.wishlist &&
//               productsWithWishlistStatus?.wishlist?.map((product, idx) => (console.log(product),
//                 <div className="flex gap-4 border-b border-gray-400 p-4"
//                   key={product._id || idx}
//                 >
//                   <div className="h-52 " >
//                     <img className="h-52 object-contain aspect-[4/5]" src={product?.images?.[0]?.imagesUrls} alt="product image" />



//                   </div>
//                   <div className="flex flex-col md:flex-row justify-between w-full">
//                     <div className="flex flex-col gap-2">
//                       <p className="font-bold ">{product?.name}</p>
//                       <div className="flex flex-row items-center text-sm gap-2">
//                         <p className="font-bold">{product?.category?.categoryName} :</p>
//                         <p>{product?.subcategories?.[0]?.subCategoryName}</p></div>
//                       <p className="text-sm text-gray-400"><span className="text-black pr-1 font-bold text-sm">Color:</span>{product?.color}</p>
//                      {product?.theme&& <p className="text-sm text-gray-400"> <span className="text-black pr-1 font-bold text-sm">Color:</span> {product?.theme}</p>}
//                       <p className="text-sm text-gray-500">Quantity: <span className="text-black font-bold">{product?.quantity||"1"}</span></p>

//                     </div>
//                     <div classNa me="flex flex-row md:flex-col gap-2">
//                       <p className="text-base text-gray-500">Price: <span className="text-black font-bold">{product?.sellingPrice}</span></p>

//                     </div>
//                   </div>
//                 </div>
//               ))}

//             <div className="flex justify-between items-center border-b p-4">
//               <p className="text-sm text-gray-500">Total:</p>

//             </div>



//           </div>




//         </div>







//       </div>




//     </>


//   )
// }
















import { useWishlist } from "../../../../context/wishListhContext";

export default function CartPageProduct() {
  const { toggleWishlist, productsWithWishlistStatus } = useWishlist();

  const cartItems = productsWithWishlistStatus?.wishlist || [];
  const totalItems = cartItems.length;

  const totalPrice = cartItems.reduce((acc, product) => {
    const price = Number(product?.sellingPrice) || 0;
    return acc + price;
  }, 0);

  return (
    <>
      <div className="border h-auto">
        <div className="border-black">
          <div className="border-b py-2 px-4">
            <p className="text-base font-bold">
              My Bag ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </p>
          </div>

          <div className="p-4">
            {totalItems > 0 ? (
              cartItems.map((product, idx) => (
                <div
                  className="flex gap-4 border-b border-gray-200 p-4"
                  key={product._id || idx}
                >
                  <div className="h-52 w-40 flex-shrink-0">
                    <img
                      className="h-full w-full object-contain aspect-[4/5]"
                      src={product?.images?.[0]?.imagesUrls}
                      alt={product?.name || "product image"}
                    />
                  </div>

                  <div className="flex flex-col md:flex-row justify-between w-full gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="font-bold text-lg">{product?.name}</p>
                      <div className="flex flex-row items-center text-sm gap-2">
                        <p className="font-bold">{product?.category?.categoryName}:</p>
                        <p>{product?.subcategories?.[0]?.subCategoryName}</p>
                      </div>
                      <p className="text-sm">
                        <span className="font-bold text-black pr-1">Color:</span>
                        <span className="text-gray-500">{product?.color}</span>
                      </p>
                      {product?.theme && (
                        <p className="text-sm">
                          <span className="font-bold text-black pr-1">Theme:</span>
                          <span className="text-gray-500">{product?.theme}</span>
                        </p>
                      )}
                       <p className="text-sm">
                          <span className="font-bold text-black pr-1">Quantity:</span>
                          <span className="text-gray-500">{product?.quantity || "1"}</span>
                        </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end justify-between gap-4">
                       <p className="text-base">
                        <span className="text-gray-500">Price: </span>
                        <span className="text-black font-bold">₹{product?.sellingPrice}</span>
                      </p>
                      <button
                        onClick={() => toggleWishlist(product._id)}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Your bag is empty.</p>
              </div>
            )}

            {totalItems > 0 && (
              <div className="flex justify-between items-center p-4 mt-4">
                <p className="text-lg font-bold">Total:</p>
                <p className="text-lg font-bold">₹{totalPrice.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}