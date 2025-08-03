import React, { useEffect, useState } from 'react';
import { CreditCard, Truck, ShoppingCart, Package, ShoppingBag, Plus, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetSingleUser } from '../../../hooks/auth/use-Auth';
import { usePlaceOrder } from '../../../hooks/userOrder';
import { useCart } from '../../../../context/cartContext';
import { useUserProfileUpdate } from '../../../hooks/client/homePageHooks/use-user';

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

const OrderPlacementUI = () => {
  const { placeOrder, loading, placeOrderData,getCartItems, error, success, cartItems } = useCart();
  const { getSingleUser, loading: userLoading, error: userError, user } = useGetSingleUser();
  const {userProfileUpdate,loading:addressUpdate,error:addressupdateError,success:adrreessUpdateSuceess}=useUserProfileUpdate()




  useEffect(() => {
    getSingleUser();
    getCartItems()
  }, []);




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

  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0 && !selectedAddress) {
      const defaultAddr = user.addresses.find(addr => addr.default) || user.addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [user, selectedAddress]);

  const orderItems = cartItems?.cart
 
  const subtotal = 21;
  const shippingFee = 5.00;
  const grandTotal = subtotal + shippingFee;

  const handleAddAddress = async() => {
    if (newAddress.label && newAddress.fullAddress && newAddress.city && newAddress.pincode && newAddress.phoneNo) {
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
     await userProfileUpdate(newAddress)
      // Refresh user data to get updated addresses
      getSingleUser();
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
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
        orderItems: orderItems.map(item => ({
          product: item.product || item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity
        })),
        itemsPrice: subtotal,
        shippingPrice: shippingFee,
        totalPrice: grandTotal
      };

      await placeOrder(orderData);
      
      if (success) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error('Order placement failed:', err);
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

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 text-center mb-8 lg:mb-12">
          Complete Your Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md">
              {/* Address Section */}
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
                            <Label htmlFor="newState">State *</Label>
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
                        <Button onClick={handleAddAddress} className="w-full">
                          Add Address
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="space-y-3">
                  {userLoading ? (
                    <div className="text-center py-4">Loading addresses...</div>
                  ) : user?.addresses && user.addresses.length > 0 ? (
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

              {/* Order Items section */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
                  <ShoppingBag className="w-6 h-6 mr-3 text-indigo-600" /> Your Items
                </h2>
                <div className="space-y-4">
                  {orderItems?.map((item, index) => (
                    <div key={item.product || item._id || index} className="flex items-center space-x-4">
                      <img 
                        src={item.images[0]?.imagesUrls} 
                        alt={item.name} 
                        className="w-20 h-20 rounded-lg aspect-[8/9] object-contain border" 
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src='https://placehold.co/100x100/ccc/FFF?text=Error'; 
                        }}
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.color} / {item.size}
                        </p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">{(item.sellingPrice * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md sticky top-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
                <Package className="w-6 h-6 mr-3 text-indigo-600" /> Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${shippingFee.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-semibold text-gray-800">
                  <span>Total</span>
                  <span>${cartItems?.totalAmount}</span>
                </div>grandTotal
              </div>

              <Button 
                onClick={handlePlaceOrder} 
                disabled={loading || !selectedAddress}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition text-lg"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </div>
            </div>
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