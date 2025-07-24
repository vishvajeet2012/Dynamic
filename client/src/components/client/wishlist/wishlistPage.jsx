import { useEffect } from "react";
import { useGetAllProductsWithWishlist } from "../../../hooks/Product/Product";

export default function Wishlistpage() {



const { getAllProductsWithWishlist, loading, productsWithWishlist, error, success }=useGetAllProductsWithWishlist()

    useEffect(()=>{
getAllProductsWithWishlist()
    },[])
  return (
    <div className="wishlist-page">
      <h1>Your Wishlist</h1>
      {productsWithWishlist?.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-items">
        <h1>vjdfiovjadfophop</h1>
          {/* {wishlist.map((item) => (
            <AdaptiveProductCard key={item._id} item={item} />
          ))} */}
        </div>
      )}
    </div>
  );
}