import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { homeUrl } from '../src/lib/baseUrl.js';
import { toast } from "sonner"

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [productsWithWishlistStatus, setProductsWithWishlistStatus] = useState([]);

    // Toggle wishlist status (add/remove)
    const toggleWishlist = async (productId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const response = await axios.post(`${homeUrl}/addtoWishlist`, { productId }, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            });
            
            // Update local state based on response
           /// setWishlistItems(response?.data);
            
            // Show success notification
           toast (response.data.message || 'Wishlist updated successflly',
               
           );
            
            // Automatically refresh the wishlist and products
          ///  setProductsWithWishlistStatus([])
            await fetchProductsWithWishlistStatus();
            
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to update wishlist';
            
            // Show error notification
            toast(errorMsg)
            
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductsWithWishlistStatus = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if(!token) return;
            const response = await axios.post(`${homeUrl}/getAllProductsWithWishlist`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            });
            
            setProductsWithWishlistStatus(response?.data);
            setWishlistItems(response.data || []);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to load products';
            
          toast(errorMsg)   
            
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Check if a product is in wishlist
    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item._id === productId || item.productId === productId);
    };

    // Initial data load
    useEffect(() => {
        fetchProductsWithWishlistStatus();
    }, []);

    return (
        <WishlistContext.Provider
            value={{
                loading,
                wishlistItems,
                productsWithWishlistStatus,
                toggleWishlist,
                fetchProductsWithWishlistStatus,
                isInWishlist
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};
const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export { useWishlist };