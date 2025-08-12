import { useEffect, useState } from "react";
import { useCart } from "../../../../context/cartContext";
import RemoveCartProduct from "./RemoveCartProduct";
import OrderSumary from "./oderSummery";
import { Loader2, ShoppingCart } from "lucide-react"; // Icon for small spinner

export default function CartPageProduct() {
  const {
    loading,
    cartItems,
    getCartItems,
    updateCartItem,
  } = useCart();

  const [updatingProductId, setUpdatingProductId] = useState(null);

  useEffect(() => {
    getCartItems();
  }, []);

  const totalItems = cartItems?.cart?.length||0


  if(totalItems===0) return    <div className="lg:col-span-5 md:min-w-md">
        <div className="bg-white p-6 lg:p-8 border shadow-md sticky top-8 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some items to your cart before placing an order.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-primaryReds text-white font-bold py-2 px-6 rounded-lg hover:bg-primaryReds focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition"
          >
            Shop Now
          </button>
        </div>
      </div>

  const handleUpdateQuantity = async ({ productId, quantity, size, color }) => {
    setUpdatingProductId(productId);
    await updateCartItem({ productId, quantity, size, color });
    setUpdatingProductId(null);
  };

  return (
    <>
     
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div className="border w-full">
         {loading && (
        <div className="h-[2px] bg-gradient-to-r from-red-500 to-gray-300 animate-pulse w-full"></div>
      )}
          <div className="border-b py-2 px-4">
            <p className="text-base font-bold">
              My Bag ({totalItems} {totalItems === 1 ? "item" : "items"})
            </p>
          </div>

          <div className="p-4">
          
            {totalItems > 0 ? (
              cartItems?.cart?.map((product, idx) => (
                <div
                  className="flex gap-4 border-b border-gray-200 p-4"
                  key={product._id || idx}
                >
                  <div className="h-52 w-40 flex-shrink-0">
                    <img
                      loading="lazy"
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

                      <div className="flex items-center gap-2 text-sm mt-2">
                        <span className="font-bold text-black">Quantity:</span>
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() =>
                              handleUpdateQuantity({
                                productId: product.id,
                                quantity: product.quantity - 1,
                                size: product.size,
                                color: product.color,
                              })
                            }
                            disabled={
                              product.quantity <= 1 || updatingProductId === product.id
                            }
                            className="px-2 py-0.5 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                            {updatingProductId === product.id ? (
                            <Loader2 className="ml-2 h-4 w-4 animate-spin text-gray-500" />
                          ):(
                          <span className="px-3 py-0.5 bg-white border-x">
                            {product.quantity}
                          </span> )}
                          <button
                            onClick={() =>
                              handleUpdateQuantity({
                                productId: product.id,
                                quantity: product.quantity + 1,
                                size: product.size,
                                color: product.color,
                              })
                            }
                            disabled={updatingProductId === product.id}
                            className="px-2 py-0.5 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            +
                          </button>

                        
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end justify-between gap-4">
                      <p className="text-base">
                        <span className="text-gray-500">Price: </span>
                        <span className="text-black font-bold">
                          ₹{product?.sellingPrice}
                        </span>
                      </p>
                      <RemoveCartProduct
                        productId={product?.id}
                        quantity={product?.quantity}
                        size={product?.size}
                        color={product?.color}
                      />
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
                <p className="text-lg font-bold">
                  ₹{cartItems?.totalAmount?.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>

        <OrderSumary cartlength={totalItems} totalPrice={cartItems?.totalAmount?.toFixed(2)} />
      </div>
    </>
  );
}
