import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { homeUrl } from "../src/lib/baseUrl";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);

    // Get token from localStorage
    const getToken = () => localStorage.getItem('token');

    // Add item to cart
    const addToCart = async (productId, quantity, size, color) => {
        setLoading(true);
        setError(null);
        
        try {
            const token = getToken();
            const response = await axios.post(`${homeUrl}/addToCart`, 
                productId, 
                quantity, 
                size, 
                color 
            , {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            });
            
            // Refresh cart items after adding
            await getCartItems();
            return response.data;
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add item to cart');
            console.error('Add to cart error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get all cart items
    const getCartItems = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const token = getToken();
            const response = await axios.get(`${homeUrl}/getallcart`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            
            setCartItems(response.data.cartItems || []);
            return response.data;
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch cart items');
            console.error('Get cart items error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Update cart item
    const updateCartItem = async (itemId, quantity) => {
        setLoading(true);
        setError(null);
        
        try {
            const token = getToken();
            const response = await axios.post(`${homeUrl}/updateCartItem`, {
                itemId,
                quantity
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            });
            
            // Refresh cart items after updating
            await getCartItems();
            return response.data;
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update cart item');
            console.error('Update cart item error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Remove cart item
    const removeCartItem = async (itemId) => {
        setLoading(true);
        setError(null);
        
        try {
            const token = getToken();
            const response = await axios.post(`${homeUrl}/removeCartItem`, {
                itemId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            });
            
            // Refresh cart items after removing
            await getCartItems();
            return response.data;
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to remove cart item');
            console.error('Remove cart item error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate total items in cart
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Calculate total price
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const value = {
        // State
        loading,
        cartItems,
        error,
        
        // Functions
        addToCart,
        getCartItems,
        updateCartItem,
        removeCartItem,
        getTotalItems,
        getTotalPrice,
        
        // Clear error
        clearError: () => setError(null)
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};