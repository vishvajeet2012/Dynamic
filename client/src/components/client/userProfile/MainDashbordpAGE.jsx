import { useState } from 'react';
import { 
  FiHome, // Replaced FiDashboard with FiHome
  FiUser, 
  FiMail, 
  FiBell, 
  FiSettings, 
  FiLogOut,
  FiChevronDown,
  FiSearch,
  FiCalendar,
  FiClock,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { BsGraphUp, BsCheck2All } from 'react-icons/bs';

export default function MainDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    role: 'Administrator'
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'profile':
        return <ProfileContent user={user} />;
      case 'settings':
        return <SettingsContent />;
      case 'messages':
        return <MessagesContent />;
      case 'notifications':
        return <NotificationsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Hidden on mobile */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="w-64 bg-white shadow-lg flex flex-col">
          {/* User Profile Section */}
          <div className="p-6 flex flex-col items-center border-b border-gray-200">
            <img 
              src={user.avatar} 
              alt="User Profile" 
              className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-primary-100"
            />
            <h3 className="font-semibold text-lg text-gray-800">{user.name}</h3>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className="mt-2 px-3 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full">
              {user.role}
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex-1 mt-2 px-2 space-y-1">
            <TabItem
              icon={<FiHome className="w-5 h-5" />} // Changed to FiHome
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')}
            />
            <TabItem 
              icon={<FiUser className="w-5 h-5" />} 
              label="Profile" 
              active={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')}
            />
            <TabItem 
              icon={<FiMail className="w-5 h-5" />} 
              label="Messages" 
              active={activeTab === 'messages'} 
              onClick={() => setActiveTab('messages')}
              badge={3}
            />
            <TabItem 
              icon={<FiBell className="w-5 h-5" />} 
              label="Notifications" 
              active={activeTab === 'notifications'} 
              onClick={() => setActiveTab('notifications')}
              badge={5}
            />
            <TabItem 
              icon={<FiSettings className="w-5 h-5" />} 
              label="Settings" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')}
            />
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <FiLogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="text-xl font-semibold text-gray-800 capitalize"
          >
            {activeTab}
          </button>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-gray-100 text-gray-600">
              <FiBell className="w-5 h-5" />
            </button>
            <img 
              src={user.avatar} 
              alt="User Profile" 
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex bg-white shadow-sm p-4 justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800 capitalize mr-4">
              {activeTab}
            </h1>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button className="relative p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center">
              <img 
                src={user.avatar} 
                alt="User Profile" 
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
              <span className="font-medium text-gray-700">{user.name}</span>
              <FiChevronDown className="ml-1 text-gray-500" />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Tab Item Component
function TabItem({ icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        active 
          ? 'bg-primary-100 text-primary-600' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
      {badge && (
        <span className="ml-auto bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

// Content Components
function DashboardContent() {
  const stats = [
    { title: "Total Projects", value: "24", change: "+12%", icon: <BsGraphUp className="w-6 h-6 text-primary-500" /> },
    { title: "Completed Tasks", value: "56", change: "+5%", icon: <BsCheck2All className="w-6 h-6 text-green-500" /> },
    { title: "Pending Requests", value: "3", change: "-2%", icon: <FiAlertCircle className="w-6 h-6 text-yellow-500" /> }
  ];

  const activities = [
    { id: 1, title: "Project Alpha Update", description: "New tasks assigned to you", time: "10 min ago", icon: <FiMail className="w-5 h-5 text-blue-500" /> },
    { id: 2, title: "Team Meeting", description: "Scheduled for tomorrow at 10 AM", time: "1 hour ago", icon: <FiCalendar className="w-5 h-5 text-purple-500" /> },
    { id: 3, title: "System Update", description: "New version available for download", time: "3 hours ago", icon: <FiSettings className="w-5 h-5 text-green-500" /> }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
          />
        ))}
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {activities.map(activity => (
            <ActivityItem key={activity.id} {...activity} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileContent({ user }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center">
            <img 
              src={user.avatar} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-primary-100 mb-4"
            />
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Change Photo
            </button>
          </div>
          
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <InfoField label="Full Name" value={user.name} icon={<FiUser className="w-5 h-5 text-gray-400" />} />
              <InfoField label="Email" value={user.email} icon={<FiMail className="w-5 h-5 text-gray-400" />} />
              <InfoField label="Join Date" value="January 15, 2023" icon={<FiCalendar className="w-5 h-5 text-gray-400" />} />
              <InfoField label="Last Login" value="2 hours ago" icon={<FiClock className="w-5 h-5 text-gray-400" />} />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Security</h3>
            <div className="relative">
              <InfoField 
                label="Password" 
                value={showPassword ? "mysecretpassword" : "••••••••"} 
                icon={<FiLock className="w-5 h-5 text-gray-400" />}
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-0 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsContent() {
  const settings = [
    { 
      title: "Account Information", 
      description: "Update your account details like email and phone number",
      icon: <FiUser className="w-5 h-5 text-primary-500" />
    },
    { 
      title: "Change Password", 
      description: "Update your account password for security",
      icon: <FiLock className="w-5 h-5 text-primary-500" />
    },
    { 
      title: "Notification Preferences", 
      description: "Manage how you receive notifications",
      icon: <FiBell className="w-5 h-5 text-primary-500" />
    },
    { 
      title: "Privacy Settings", 
      description: "Control your privacy options",
      icon: <FiCheckCircle className="w-5 h-5 text-primary-500" />
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {settings.map((setting, index) => (
          <div 
            key={index} 
            className={`p-6 ${index !== settings.length - 1 ? 'border-b border-gray-200' : ''}`}
          >
            <div className="flex items-start">
              <div className="p-2 bg-primary-50 rounded-lg mr-4">
                {setting.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{setting.title}</h3>
                <p className="text-gray-500 mt-1">{setting.description}</p>
              </div>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesContent() {
  const messages = [
    { id: 1, sender: "Sarah Johnson", preview: "About the project deadline...", time: "10:30 AM", unread: true },
    { id: 2, sender: "Team Updates", preview: "Weekly team meeting notes...", time: "Yesterday", unread: false },
    { id: 3, sender: "David Wilson", preview: "The design files you requested...", time: "Mar 15", unread: false }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
              message.unread ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                <FiUser className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h3 className={`text-sm font-medium truncate ${
                    message.unread ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {message.sender}
                  </h3>
                  <span className="text-xs text-gray-500">{message.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{message.preview}</p>
              </div>
              {message.unread && (
                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsContent() {
  const notifications = [
    { id: 1, title: "New project assigned", description: "You've been assigned to Project X", time: "Just now", read: false },
    { id: 2, title: "System update available", description: "Version 2.3 is now available", time: "30 min ago", read: true },
    { id: 3, title: "Payment received", description: "Your invoice #1234 has been paid", time: "2 hours ago", read: true }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
      
      <div className="space-y-3">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`p-4 bg-white rounded-lg shadow-sm ${
              !notification.read ? 'border-l-4 border-primary-500' : ''
            }`}
          >
            <div className="flex justify-between">
              <h3 className={`font-medium ${
                !notification.read ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {notification.title}
              </h3>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{notification.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, change, icon }) {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold my-2 text-gray-800">{value}</p>
          <p className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {change} from last week
          </p>
        </div>
        <div className="p-3 bg-primary-50 rounded-lg h-fit">
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value, icon }) {
  return (
    <div>
      <label className="block text-gray-500 text-sm font-medium mb-1">{label}</label>
      <div className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        <p className="text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function ActivityItem({ title, description, time, icon }) {
  return (
    <div className="flex items-start">
      <div className="p-2 bg-gray-100 rounded-lg mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
}