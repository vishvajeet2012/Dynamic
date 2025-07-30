import React, { useEffect, useState } from 'react';
import { CreditCard, Truck, ShoppingCart, Package, ShoppingBag, Plus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetSingleUser } from '../../../hooks/auth/use-Auth';
import { usePlaceOrder } from '../../../hooks/userOrder';




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

const { placeOrder,loading , error,success}=usePlaceOrder()


         const  {getSingleUser,laoding:userLoading ,error:userError,user}  =  useGetSingleUser()
      useEffect(()=>{
        getSingleUser()
      },[])
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Home',
      address: '123 Main Street',
      city: 'Jaipur',
      state: 'Rajasthan',
      postalCode: '302001',
      country: 'India',
      phone: '+91 9876543210'
    },
    {
      id: 2,
      name: 'Office',
      address: '456 Business Park',
      city: 'Jaipur',
      state: 'Rajasthan',
      postalCode: '302017',
      country: 'India',
      phone: '+91 9876543211'
    }
  ]);
  
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    
  });

  const subtotal = mockOrderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = 5.00;
  const grandTotal = subtotal + shippingFee;

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.address && newAddress.city) {
      const address = {
        id: addresses.length + 1,
        ...newAddress
      };
      setNewAddress({
        name: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phone: ''
      });
      setIsDialogOpen(false);


    }


    };

  async function handlePlaceOrder (){
    await  placeOrder(selectedAddress)
  }
      console.log(selectedAddress)
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 text-center mb-8 lg:mb-12">
          Complete Your Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md">
              {/* Address List */}
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
                          <Label htmlFor="addressName">Address Name</Label>
                          <Input
                            id="addressName"
                            placeholder="e.g., Home, Office"
                            value={newAddress.name}
                            onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="fullAddress">Address</Label>
                          <Input
                            id="fullAddress"
                            placeholder="Street address"
                            value={newAddress.address}
                            onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="newCity">City</Label>
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
                            <Label htmlFor="newPostal">Postal Code</Label>
                            <Input
                              id="newPostal"
                              placeholder="Postal Code"
                              value={newAddress.postalCode}
                              onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
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
                          <Label htmlFor="newPhone">Phone Number</Label>
                          <Input
                            id="newPhone"
                            placeholder="Phone number"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                          />
                            <Label htmlFor="Default">Default Address</Label>
                        <Input 
                        type="checkbox"
  id="Default"
  checked={newAddress.isDefault}
  onChange={(e) =>
    setNewAddress({ ...newAddress, isDefault: e.target.checked })
  }
/>

                        </div>
                        <Button onClick={handleAddAddress} className="w-full">
                          Add Address
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="space-y-3">
                  {user?.addresses?.map((addr) => (
                    <div
                      key={addr.id}
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
                          <p className="text-sm  text-gray-600 mt-1">
                      {addr?.fullAddress}, {addr.city}, {addr.state} {addr.pincode}
                          </p>
                          <p className="text-sm text-gray-500">{addr.phone}</p>
                        </div>
                        {selectedAddress?.id === addr._id && (
                          <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="my-8 border-gray-200" />

              {/* Payment Method */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-indigo-600" /> Payment Method
                </h2>
                <div className="space-y-4">
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

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md sticky top-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
                <Package className="w-6 h-6 mr-3 text-indigo-600" /> Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({mockOrderItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${shippingFee.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-semibold text-gray-800">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button onClick={handlePlaceOrder} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition text-lg">
                Place Order
              </Button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
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

export default OrderPlacementUI;