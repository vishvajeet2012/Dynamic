import React from 'react';
import { CreditCard, Truck, ShoppingCart, Package, ShoppingBag } from 'lucide-react';

// Mock data for displaying the UI, this would come from props in a real app
const mockOrderItems = [
  {
    product: '60d5f2f9a3b4c9001f7e8a3a',
    name: 'Classic Crewneck T-Shirt',
    image: 'https://placehold.co/100x100/f0f0f0/333?text=T-Shirt',
    price: 25.00,
    size: 'L',
    color: 'White',
    quantity: 2,
  },
  {
    product: '60d5f2f9a3b4c9001f7e8a3b',
    name: 'Slim-Fit Denim Jeans',
    image: 'https://placehold.co/100x100/e0e0e0/333?text=Jeans',
    price: 75.00,
    size: '32/32',
    color: 'Blue',
    quantity: 1,
  },
   {
    product: '60d5f2f9a3b4c9001f7e8a3c',
    name: 'Leather Ankle Boots',
    image: 'https://placehold.co/100x100/d0d0d0/333?text=Boots',
    price: 120.00,
    size: '9',
    color: 'Black',
    quantity: 1,
  }
];

// This is a purely presentational component with no state or logic.
const OrderPlacementUI = () => {
  const subtotal = mockOrderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = 5.00;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 text-center mb-8 lg:mb-12">
          Complete Your Order
        </h1>

        <form className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Shipping, Payment & Items */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md">
              {/* Shipping Information */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
                  <Truck className="w-6 h-6 mr-3 text-indigo-600" /> Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                    <input type="text" id="address" name="address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-600 mb-1">City</label>
                    <input type="text" id="city" name="city" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-600 mb-1">Postal Code</label>
                    <input type="text" id="postalCode" name="postalCode" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-600 mb-1">State / Province</label>
                    <input type="text" id="state" name="state" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-600 mb-1">Country</label>
                    <input type="text" id="country" name="country" defaultValue="USA" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                  </div>
                   <div className="md:col-span-2">
                    <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    <input type="tel" id="phoneNo" name="phoneNo" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required placeholder="For delivery updates" />
                  </div>
                </div>
              </div>

              <hr className="my-8 border-gray-200" />

              {/* Payment Method */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-indigo-600" /> Payment Method
                </h2>
                <div className="space-y-4">
                  {/* For a real app, you would add onClick handlers here to manage state */}
                  <div className={`p-4 border rounded-lg cursor-pointer transition border-gray-300`}>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Pay Online</span>
                      <div className="flex items-center space-x-2">
                          <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-6"/>
                          <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-6"/>
                          <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="Paypal" className="h-6"/>
                      </div>
                    </div>
                     <p className="text-sm text-gray-500 mt-1">Use your credit card, debit card, or PayPal.</p>
                  </div>
                  <div className={`p-4 border rounded-lg cursor-pointer transition border-indigo-600 ring-2 ring-indigo-500 bg-indigo-50`}>
                     <span className="font-semibold text-gray-800">Cash on Delivery (COD)</span>
                     <p className="text-sm text-gray-500 mt-1">Pay with cash when your order is delivered.</p>
                  </div>
                </div>
              </div>
              
              <hr className="my-8 border-gray-200" />

              {/* Order Items section */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
                  <ShoppingBag className="w-6 h-6 mr-3 text-indigo-600" /> Your Items
                </h2>
                <div className="space-y-4">
                  {mockOrderItems.map((item) => (
                    <div key={item.product} className="flex items-center space-x-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover border" 
                           onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/ccc/FFF?text=Error'; }}/>
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.color} / {item.size}
                        </p>
                         <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          
        </form>
      </div>

       {/* Success Modal - remains hidden by default */}
      <div id="successModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm mx-auto">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">Order Placed!</h3>
              <p className="text-gray-600 my-4">Your order has been placed successfully. We'll notify you once it's on its way.</p>
              <button type="button" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition">
                  Continue Shopping
              </button>
          </div>
      </div>
    </div>
  );
};
