import React, { useEffect, useState, useMemo } from 'react';
import { CreditCard, MapPin, ShoppingBag, Plus, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetSingleUser } from '../../../hooks/auth/use-Auth';
import { useCart } from '../../../../context/cartContext';
import { useUserProfileUpdate } from '../../../hooks/client/homePageHooks/use-user';
import CartNavigation from '../cartPage/CartNavigation';
import OrderSumary from '../cartPage/oderSummery';
import FullScreenLoader from '../../../shared/loading';

import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { homeUrl } from '../../../lib/baseUrl';

const stripePromise = loadStripe("you key");

const StripeCardInput = ({ onCardChange, disabled }) => {
  const stripe = useStripe();
  const elements = useElements();

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-white">
      <div className="mb-3">
        <Label className="text-sm font-medium text-gray-700">Card Information</Label>
      </div>
      <CardElement
        options={cardElementOptions}
        onChange={onCardChange}
        disabled={disabled}
      />
      <div className="flex items-center mt-3 text-xs text-gray-500">
        <Lock className="w-3 h-3 mr-1" />
        Your payment information is secure and encrypted
      </div>
    </div>
  );
};

const OrderPlacementContent = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { placeOrder, loading, error, success, cartItems, getCartItems } = useCart();
  const { getSingleUser, loading: userLoading, user } = useGetSingleUser();
  const { userProfileUpdate, loading: addressUpdate, error: addressUpdateError, success: addressUpdateSuccess } = useUserProfileUpdate();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cardError, setCardError] = useState('');
  const [cardComplete, setCardComplete] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    fullAddress: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    phoneNo: '',
    default: false
  });

  const orderCalculations = useMemo(() => {
    if (!cartItems?.cart || cartItems.cart.length === 0) {
      return { subtotal: 0, shippingFee: 0, grandTotal: 0 };
    }

    const subtotal = cartItems.cart.reduce((sum, item) => {
      return sum + (item.sellingPrice || item.price || 0) * (item.quantity || 1);
    }, 0);

    const shippingFee = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
    const grandTotal = subtotal + shippingFee;

    return { subtotal, shippingFee, grandTotal };
  }, [cartItems]);

  useEffect(() => {
    getSingleUser();
    getCartItems();
  }, []);

  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0 && !selectedAddress) {
      const defaultAddr = user.addresses.find(addr => addr.default) || user.addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [user, selectedAddress]);

  useEffect(() => {
    if (success) {
      setShowSuccessModal(true);
    }
  }, [success]);

  const handleCardChange = (event) => {
    setCardError(event.error ? event.error.message : '');
    setCardComplete(event.complete);
  };

  const handleAddAddress = async () => {
    const requiredFields = ['label', 'fullAddress', 'city', 'pincode', 'phoneNo'];
    const missingFields = requiredFields.filter(field => !newAddress[field]?.trim());

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      await userProfileUpdate(newAddress);
      
      setNewAddress({
        label: '',
        fullAddress: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        phoneNo: '',
        default: false
      });
      
      setIsDialogOpen(false);
      await getSingleUser(); 
    } catch (error) {
      console.error('Failed to add address:', error);
      alert('Failed to add address. Please try again.');
    }
  };

  const createPaymentIntent = async (orderData) => {
    try {
      const response = await fetch(`${homeUrl}/createPaymentIntent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: orderData.totalPrice, 
          currency: 'inr',
          orderData: orderData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment intent');
      }

      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw error;
    }
  };

  const handleStripePayment = async (orderData) => {
    if (!stripe || !elements) {
      throw new Error('Stripe not loaded');
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement || !cardComplete) {
      throw new Error('Please complete your card information');
    }

    setProcessingPayment(true);

    try {
      const clientSecret = await createPaymentIntent(orderData);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.name || 'Customer',
            email: user?.email || '',
            phone: selectedAddress?.phoneNo || '',
            address: {
              line1: selectedAddress?.fullAddress || '',
              city: selectedAddress?.city || '',
              state: selectedAddress?.state || '',
              postal_code: selectedAddress?.pincode || '',
              country: 'IN',
            },
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Payment successful, place the order
        const updatedOrderData = {
          ...orderData,
          paymentResult: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString(),
            email_address: user?.email || '',
          },
        };

        await placeOrder(updatedOrderData);
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (error) {
      console.error('Stripe payment failed:', error);
      throw error;
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    if (!cartItems?.cart || cartItems.cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (selectedPaymentMethod === 'stripe' && cardError) {
      alert('Please fix card information errors before proceeding');
      return;
    }

    try {
      const orderData = {
        paymentMethod: selectedPaymentMethod,
        shippingInfo: {
          _id: selectedAddress._id,
          label: selectedAddress.label,
          fullAddress: selectedAddress.fullAddress,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          country: selectedAddress.country || 'India',
          phoneNo: selectedAddress.phoneNo,
          isDefault: selectedAddress.default || false
        },
        orderItems: cartItems.cart.map(item => ({
          product: item._id || item.product,
          name: item.name,
          image: item.images?.[0]?.imagesUrls || item.image,
          price: item.sellingPrice || item.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity
        })),
        itemsPrice: orderCalculations.subtotal,
        shippingPrice: orderCalculations.shippingFee,
        totalPrice: orderCalculations.grandTotal
      };

      if (selectedPaymentMethod === 'stripe') {
        await handleStripePayment(orderData);
      } else {
        // Cash on Delivery
        await placeOrder(orderData);
      }
    } catch (err) {
      console.error('Order placement failed:', err);
      alert(`Failed to place order: ${err.message}`);
    }
  };

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your credit or debit card',
      icon: (
        <svg width="32" height="14" viewBox="0 0 32 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#635bff" d="M14.007 5.333c0-.853.688-1.54 1.54-1.54.533 0 .987.267 1.253.68l1.013-.907c-.587-.693-1.453-1.133-2.427-1.133C13.773 2.433 12.547 3.66 12.547 5.333s1.226 2.9 2.84 2.9c.973 0 1.84-.44 2.427-1.133L16.8 6.193c-.266.413-.72.68-1.253.68-.852 0-1.54-.686-1.54-1.54zM9.96 8.1V5.88c0-.627-.44-.947-1.014-.947-.413 0-.827.213-1.08.653V2.567H6.433V8.1h1.433v-.36c.253.44.667.653 1.08.653.574 0 1.014-.32 1.014-.946zM8.527 5.88v1.093c-.16.294-.454.467-.747.467-.52 0-.854-.374-.854-.973s.334-.973.854-.973c.293 0 .587.173.747.386zM20.92 8.1V5.88c0-.627-.44-.947-1.013-.947-.414 0-.827.213-1.08.653V2.567h-1.434V8.1h1.434v-.36c.253.44.666.653 1.08.653.573 0 1.013-.32 1.013-.946zM19.487 5.88v1.093c-.16.294-.454.467-.747.467-.52 0-.854-.374-.854-.973s.334-.973.854-.973c.293 0 .587.173.747.386zM26.127 5.2c-.32-.467-.854-.767-1.514-.767-1.106 0-2.013.907-2.013 2.9s.907 2.9 2.013 2.9c.66 0 1.194-.3 1.514-.767v.534h1.433V2.567H26.127V5.2zm-1.24 2.013c-.573 0-1.013-.44-1.013-1.013s.44-1.013 1.013-1.013 1.013.44 1.013 1.013-.44 1.013-1.013 1.013zM4.533 7.133c0 .56-.44 1.014-1.013 1.014s-1.014-.454-1.014-1.014V2.567H1.073v4.566c0 1.374 1.08 2.467 2.447 2.467s2.447-1.093 2.447-2.467V2.567H4.533v4.566zM29.253 4.433c-1.28 0-2.253 1.013-2.253 2.247s.973 2.246 2.253 2.246 2.254-1.012 2.254-2.246-.974-2.247-2.254-2.247zm0 3.12c-.48 0-.867-.387-.867-.873s.387-.874.867-.874.866.388.866.874-.386.873-.866.873z"/>
          <path fill="#00d924" d="M2.98 10.733h26.04v.534H2.98z"/>
        </svg>
      )
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay with cash when your order is delivered',
      icon: (
        <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="6" width="28" height="16" rx="2" stroke="#059669" strokeWidth="2" fill="none"/>
          <circle cx="8" cy="14" r="3" stroke="#059669" strokeWidth="2" fill="none"/>
          <path d="M20 10h6M20 14h4M20 18h6" stroke="#059669" strokeWidth="2"/>
          <path d="M7 11h2v6h-2z" fill="#059669"/>
        </svg>
      )
    }
  ];

  const isOrderDisabled = loading || processingPayment || !selectedAddress || !cartItems?.cart?.length || 
    (selectedPaymentMethod === 'stripe' && (!cardComplete || cardError));

  if (userLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="w-full mt-4 px-4 lg:px-6 2xl:max-w-7xl 2xl:mx-auto">
      <CartNavigation />
      <div className="container mx-auto px-4 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-700 flex items-center">
                    <MapPin className="w-6 h-6 mr-3 text-indigo-600" /> Delivery Address
                  </h2>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="addressLabel">Address Label *</Label>
                          <Input
                            id="addressLabel"
                            placeholder="e.g., Home, Office"
                            value={newAddress.label}
                            onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="fullAddress">Full Address *</Label>
                          <Input
                            id="fullAddress"
                            placeholder="House/Flat No, Street, Area"
                            value={newAddress.fullAddress}
                            onChange={(e) => setNewAddress({...newAddress, fullAddress: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="newCity">City *</Label>
                            <Input
                              id="newCity"
                              placeholder="City"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="newState">State</Label>
                            <Input
                              id="newState"
                              placeholder="State"
                              value={newAddress.state}
                              onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="newPincode">Pincode *</Label>
                            <Input
                              id="newPincode"
                              placeholder="Pincode"
                              value={newAddress.pincode}
                              onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="newCountry">Country</Label>
                            <Input
                              id="newCountry"
                              value={newAddress.country}
                              onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="newPhone">Phone Number *</Label>
                          <Input
                            id="newPhone"
                            placeholder="Phone number"
                            value={newAddress.phoneNo}
                            onChange={(e) => setNewAddress({...newAddress, phoneNo: e.target.value})}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="defaultAddress"
                            checked={newAddress.default}
                            onChange={(e) => setNewAddress({ ...newAddress, default: e.target.checked })}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="defaultAddress">Set as default address</Label>
                        </div>
                        <Button 
                          onClick={handleAddAddress} 
                          className="w-full"
                          disabled={addressUpdate}
                        >
                          {addressUpdate ? 'Adding...' : 'Add Address'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="space-y-3">
                  {user?.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`p-4 border rounded-lg cursor-pointer transition ${
                          selectedAddress?._id === addr._id
                            ? 'border-indigo-600 ring-2 ring-indigo-500 bg-indigo-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedAddress(addr)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-800">{addr.label}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {addr.fullAddress}, {addr.city}, {addr.state} {addr.pincode}
                            </p>
                            <p className="text-sm text-gray-500">{addr.phoneNo}</p>
                            {addr.default && (
                              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                                Default
                              </span>
                            )}
                          </div>
                          {selectedAddress?._id === addr._id && (
                            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No addresses found. Please add a delivery address.</p>
                    </div>
                  )}
                </div>
              </div>

              <hr className="my-8 border-gray-200" />

              {/* Payment Method */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-indigo-600" /> Payment Method
                </h2>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id}>
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition ${
                          selectedPaymentMethod === method.id
                            ? 'border-indigo-600 ring-2 ring-indigo-500 bg-indigo-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-gray-800">{method.name}</span>
                            <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            {method.icon}
                            {selectedPaymentMethod === method.id && (
                              <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stripe Card Input */}
                      {selectedPaymentMethod === 'stripe' && method.id === 'stripe' && (
                        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <StripeCardInput 
                            onCardChange={handleCardChange}
                            disabled={loading || processingPayment}
                          />
                          {cardError && (
                            <div className="mt-2 text-sm text-red-600 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {cardError}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <hr className="my-8 border-gray-200" />

              <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
                  <ShoppingBag className="w-6 h-6 mr-3 text-indigo-600" /> Your Items
                </h2>
                <div className="space-y-4">
                  {cartItems?.cart?.map((item, index) => (
                    <div key={item._id || index} className="flex items-center space-x-4">
                      <img 
                        src={item.images?.[0]?.imagesUrls || 'https://placehold.co/100x100/ccc/FFF?text=Product'} 
                        alt={item.name} 
                        className="w-20 h-20 rounded-lg aspect-[8/9] object-contain border" 
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = 'https://placehold.co/100x100/ccc/FFF?text=Error'; 
                        }}
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.color} {item.size && `/ ${item.size}`}
                        </p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ₹{((item.sellingPrice || item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <OrderSumary  
              totalPrice={orderCalculations.grandTotal}  
              disabled={isOrderDisabled}  
              handlePlaceOrder={handlePlaceOrder}
              loading={loading || processingPayment}
              paymentMethod={selectedPaymentMethod}
            />
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm mx-auto">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">Order Placed!</h3>
            <p className="text-gray-600 my-4">
              Your order has been placed successfully. We'll notify you once it's on its way.
            </p>
            <Button 
              onClick={() => setShowSuccessModal(false)}
              className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderPlacementUI = () => {
  return (
    <Elements stripe={stripePromise}>
      <OrderPlacementContent />
    </Elements>
  );
};

export default OrderPlacementUI;