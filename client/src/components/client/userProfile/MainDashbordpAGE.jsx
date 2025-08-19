import { useEffect, useState } from 'react';
import { 
  FiUser, 
  FiMail, 
  FiCalendar,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiHome,
  FiShoppingBag,
  FiCreditCard,
  FiHeart,
  FiSettings,
  FiBell
} from 'react-icons/fi';
import { useGetSingleUser } from "../../../hooks/auth/use-Auth.js";
import { useUserProfileUpdate } from '../../../hooks/client/homePageHooks/use-user.js';
import { useForm } from 'react-hook-form';
import { useUplaodImage } from '../../../hooks/client/homePageHooks/use-banner.js';
import { useAuth } from '../../../../context/authConext.jsx';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'orders', label: 'Orders', icon: <FiShoppingBag /> },
    { id: 'addresses', label: 'Addresses', icon: <FiHome /> },
    { id: 'payment', label: 'Payment Methods', icon: <FiCreditCard /> },
    { id: 'wishlist', label: 'Wishlist', icon: <FiHeart /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6">
      {/* Side Navigation */}
      <div className="w-full md:w-64 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">My Account</h2>
        <nav>
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        {activeTab === 'profile' && <ProfileSection />}
        {activeTab === 'addresses' && <AddressSection />}
        {activeTab === 'orders' && <OrdersSection />}
        {activeTab === 'payment' && <PaymentSection />}
        {activeTab === 'wishlist' && <WishlistSection />}
        {activeTab === 'notifications' && <NotificationsSection />}
        {activeTab === 'settings' && <SettingsSection />}
      </div>
    </div>
  );
}

function ProfileSection() {
  const { getSingleUser, loading: userLoading, error: userError, user } = useGetSingleUser();
  const { userProfileUpdate, loading: updateLoading, error: updateError, success: updateSuccess } = useUserProfileUpdate();
  const { uploadImage, loading: uploadLoading } = useUplaodImage();
  
  const [avatarPreview, setAvatarPreview] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue,
    reset
  } = useForm();

  useEffect(() => {
    getSingleUser();
  }, []);

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber || '',
        profilePicture: user.profilePicture || '',
        gender: user.gender || 'prefer-not-to-say',
        bio: user.bio || ''
      });
      setAvatarPreview(user.profilePicture);
    }
  }, [user, reset]);

  const handleImageChange = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    
    try {
      const response = await uploadImage(formData);
      if (response.url) {
        setAvatarPreview(response.url);
        setValue('profilePicture', response.url);
        setValue('originalId', response.publicId);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const onSubmitProfile = async (data) => {
    try {
      await userProfileUpdate(data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  const { login: authLogin ,logout} = useAuth();///for logut
    const navigate = useNavigate();
    const handleLogout = (e)=>{
      console.log(e)
logout()
    navigate(0);


    }


  return (
    <div className="bg-white rounded-lg shadow  p-2 md:p-6">
    <div className='flex  justify-between items-center '>
      <h2 className="  md:text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
            <button onClick={handleLogout} className=" text-sm md:text-base font-medium bg-primaryReds py-1 rounded-md px-4 text-white mb-6">logout</button>

      </div>
      <form onSubmit={handleSubmit(onSubmitProfile)}>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center w-full md:w-1/4">
            <div className="relative mb-4">
              <img 
                src={avatarPreview || '/default-avatar.png'} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
              {uploadLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Change Photo
              <input 
                type="file" 
                className="hidden" 
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
          </div>
          
          {/* Personal Info Form */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">First Name*</label>
              <input
                {...register("firstName", { required: "First name is required" })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Last Name*</label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Email*</label>
              <input
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Mobile Number</label>
              <input
                {...register("mobileNumber")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Gender</label>
              <select
                {...register("gender")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-1">Bio</label>
              <textarea
                {...register("bio")}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                disabled={updateLoading || uploadLoading}
              >
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function AddressSection() {
  const { getSingleUser, user } = useGetSingleUser();
  const { userProfileUpdate } = useUserProfileUpdate();
  
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  
  useEffect(() => {
    getSingleUser();
  }, []);

  const handleAddAddress = () => {
    setIsEditingAddress(true);
    setCurrentAddress(null);
  };

  const handleEditAddress = (address) => {
    setIsEditingAddress(true);
    setCurrentAddress(address);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const updatedAddresses = user.addresses.filter(addr => addr._id !== addressId);
      await userProfileUpdate({ addresses: updatedAddresses });
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const onSubmitAddress = async (addressData) => {
    try {
      let updatedAddresses = [...user.addresses];
      
      if (currentAddress) {
        const index = updatedAddresses.findIndex(addr => 
          addr._id === currentAddress._id || 
          addr.isDefault === currentAddress.isDefault
        );
        if (index !== -1) {
          updatedAddresses[index] = { ...addressData };
        }
      } else {
        // Add new address
        updatedAddresses.push({ 
          ...addressData,
          isDefault: updatedAddresses.length === 0
        });
      }
      
      // Update user with new addresses
      await userProfileUpdate({ addresses: updatedAddresses });
      
      // Reset form
      setIsEditingAddress(false);
      setCurrentAddress(null);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const updatedAddresses = user.addresses.map(addr => ({
        ...addr,
        isDefault: addr._id === addressId
      }));
      
      await userProfileUpdate({ addresses: updatedAddresses });
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Addresses</h2>
        <button
          onClick={handleAddAddress}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus className="mr-2" />
          Add New Address
        </button>
      </div>
      
      {isEditingAddress ? (
        <AddressForm 
          address={currentAddress}
          onSubmit={onSubmitAddress}
          onCancel={() => setIsEditingAddress(false)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user?.addresses?.map((address) => (
            <AddressCard 
              key={address._id || address.isDefault}
              address={address}
              onEdit={() => handleEditAddress(address)}
              onDelete={() => handleDeleteAddress(address._id)}
              onSetDefault={() => setDefaultAddress(address._id)}
              isDefault={address.isDefault}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AddressCard({ address, onEdit, onDelete, onSetDefault, isDefault }) {
  return (
    <div className={`border rounded-lg p-4 relative ${isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-800 capitalize">
          {address.label || 'Address'}
          {isDefault && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Default
            </span>
          )}
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={onEdit}
            className="text-gray-500 hover:text-blue-600"
            title="Edit"
          >
            <FiEdit />
          </button>
          <button 
            onClick={onDelete}
            className="text-gray-500 hover:text-red-600"
            title="Delete"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 mb-1">{address.fullAddress}</p>
      <p className="text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
      
      {!isDefault && (
        <button
          onClick={onSetDefault}
          className="mt-3 text-sm text-blue-600 hover:text-blue-800"
        >
          Set as Default
        </button>
      )}
    </div>
  );
}

function AddressForm({ address, onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: address || {
      fullAddress: '',
      city: '',
      state: '',
      pincode: '',
      label: 'home',
      isDefault: false
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm font-medium mb-1">Full Address*</label>
          <textarea
            {...register("fullAddress", { required: "Address is required" })}
            rows="3"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.fullAddress ? 'border-red-500' : 'border-gray-300'
            }`}
          ></textarea>
          {errors.fullAddress && (
            <p className="text-red-500 text-xs mt-1">{errors.fullAddress.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">City*</label>
          <input
            {...register("city", { required: "City is required" })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">State*</label>
          <input
            {...register("state", { required: "State is required" })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.state && (
            <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Pincode*</label>
          <input
            {...register("pincode", { 
              required: "Pincode is required",
              pattern: {
                value: /^[0-9]{6}$/,
                message: "Invalid pincode (must be 6 digits)"
              }
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.pincode ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.pincode && (
            <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Label</label>
          <select
            {...register("label")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          {address ? 'Update Address' : 'Add Address'}
        </button>
      </div>
    </form>
  );
}

// Placeholder components for other sections
function OrdersSection() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
      <div className="text-center py-12">
        <p className="text-gray-500">You haven't placed any orders yet.</p>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Start Shopping
        </button>
      </div>
    </div>
  );
}

function PaymentSection() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Methods</h2>
      <div className="text-center py-12">
        <p className="text-gray-500">No payment methods saved yet.</p>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Payment Method
        </button>
      </div>
    </div>
  );
}

function WishlistSection() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h2>
      <div className="text-center py-12">
        <p className="text-gray-500">Your wishlist is empty.</p>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Browse Products
        </button>
      </div>
    </div>
  );
}

function NotificationsSection() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between">
            <h3 className="font-medium">Order Confirmation</h3>
            <span className="text-sm text-gray-500">2 days ago</span>
          </div>
          <p className="text-gray-600 mt-1">Your order #12345 has been confirmed and is being processed.</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between">
            <h3 className="font-medium">Special Offer</h3>
            <span className="text-sm text-gray-500">1 week ago</span>
          </div>
          <p className="text-gray-600 mt-1">Get 20% off on your next purchase with code SUMMER20.</p>
        </div>
      </div>
    </div>
  );
}

function SettingsSection() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Current Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Update Password
          </button>
        </div>
        
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Notification Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-blue-600" defaultChecked />
              <span className="ml-2 text-gray-700">Email notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-blue-600" defaultChecked />
              <span className="ml-2 text-gray-700">SMS notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-blue-600" />
              <span className="ml-2 text-gray-700">Push notifications</span>
            </label>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}