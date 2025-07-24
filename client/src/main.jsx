import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/authConext.jsx';
import { WishlistProvider } from '../context/wishListhContext.jsx';
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <App />
          <Toaster />
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
