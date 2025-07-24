import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const homeUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [productsWithWishlistStatus, setProductsWithWishlistStatus] = useState([]);

    // Toggle wishlist status (add/remove)
    const toggleWishlist = async (productId) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${homeUrl}/addtoWishlist`, { productId }, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            });
            
            // Update local state based on response
            setWishlistItems(response.data.wishlist || response.data);
            setSuccess(response.data.message || 'Wishlist updated successfully');
            
            // Refresh products with wishlist status
            await fetchProductsWithWishlistStatus();
            
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to update wishlist';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Get all products with wishlist status
    const fetchProductsWithWishlistStatus = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${homeUrl}/getAllProductsWithWishlist`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            });
            
            setProductsWithWishlistStatus(response.data.products);
            setWishlistItems(response.data.wishlist || []);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to load products';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Check if a product is in wishlist
    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item._id === productId || item.productId === productId);
    };

    // Clear messages
    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    // Initial data load
    useEffect(() => {
        fetchProductsWithWishlistStatus();
    }, []);

    return (
        <WishlistContext.Provider
            value={{
                loading,
                error,
                success,
                wishlistItems,
                productsWithWishlistStatus,
                toggleWishlist,
                fetchProductsWithWishlistStatus,
                isInWishlist,
                clearMessages
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};