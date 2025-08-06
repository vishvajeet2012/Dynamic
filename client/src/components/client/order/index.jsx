import React, { useEffect, useState, useMemo } from 'react';
import { CreditCard, MapPin, ShoppingBag, Plus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetSingleUser } from '../../../hooks/auth/use-Auth';
import { useCart } from '../../../../context/cartContext';
import { useUserProfileUpdate } from '../../../hooks/client/homePageHooks/use-user';
import CartNavigation from '../cartPage/CartNavigation';
import OrderSumary from '../cartPage/oderSummery';

const OrderPlacementUI = () => {
  const { placeOrder, loading, error, success, cartItems, getCartItems } = useCart();
  const { getSingleUser, loading: userLoading, user } = useGetSingleUser();
  const { userProfileUpdate, loading: addressUpdate, error: addressUpdateError, success: addressUpdateSuccess } = useUserProfileUpdate();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

  // Calculate totals properly
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

  // Set default address when user data loads
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0 && !selectedAddress) {
      const defaultAddr = user.addresses.find(addr => addr.default) || user.addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [user, selectedAddress]);

  // Show success modal when order is placed successfully
  useEffect(() => {
    if (success) {
      setShowSuccessModal(true);
    }
  }, [success]);

  const handleAddAddress = async () => {
    const requiredFields = ['label', 'fullAddress', 'city', 'pincode', 'phoneNo'];
    const missingFields = requiredFields.filter(field => !newAddress[field]?.trim());

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      await userProfileUpdate(newAddress);
      
      // Reset form
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
      await getSingleUser(); // Refresh user data
    } catch (error) {
      console.error('Failed to add address:', error);
      alert('Failed to add address. Please try again.');
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

      await placeOrder(orderData);
    } catch (err) {
      console.error('Order placement failed:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card (Stripe)',
      description: 'Pay securely with your credit or debit card',
      icons: [
        'https://img.icons8.com/color/48/000000/visa.png',
        'https://img.icons8.com/color/48/000000/mastercard.png',
        'https://img.icons8.com/color/48/000000/amex.png'
      ]
    },
    {
      id: 'razorpay',
      name: 'UPI/Net Banking (Razorpay)',
      description: 'Pay via UPI, Net Banking, or Wallet',
      icons: [
        'https://img.icons8.com/color/48/000000/google-pay.png',
        'https://img.icons8.com/color/48/000000/paytm.png'
      ]
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay with cash when your order is delivered',
      icons: []
    }
  ];

  if (userLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full mt-4 px-4 lg:px-6 2xl:max-w-7xl 2xl:mx-auto">
      <CartNavigation />
      <div className="container mx-auto px-4 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md">
              {/* Delivery Address Section */}
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
                    <div
                      key={method.id}
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
                        <div className="flex items-center space-x-2">
                          {method.icons.map((icon, index) => (
                            <img key={index} src={icon} alt="Payment icon" className="h-6" />
                          ))}
                          {selectedPaymentMethod === method.id && (
                            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center ml-2">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <hr className="my-8 border-gray-200" />

              {/* Order Items Section */}
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
              disabled={loading || !selectedAddress || !cartItems?.cart?.length}  
              handlePlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>

      {/* Success Modal */}
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

export default OrderPlacementUI;