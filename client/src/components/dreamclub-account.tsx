import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Settings, Shield, HelpCircle, LogOut, ChevronRight, Crown, Star, Gift, Phone, Mail, Calendar } from "lucide-react";

interface UserData {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  bonusBalance: string;
  kycStatus: string;
  vipLevel: number;
}

export function DreamClubAccount() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { data: user } = useQuery<UserData>({
    queryKey: ["/api/auth/user"],
  });

  const menuItems = [
    {
      id: "profile",
      label: "Profile Settings",
      icon: User,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "security",
      label: "Security & Privacy",
      icon: Shield,
      color: "from-green-500 to-green-600",
    },
    {
      id: "vip",
      label: "VIP Membership",
      icon: Crown,
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "rewards",
      label: "My Rewards",
      icon: Gift,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "settings",
      label: "App Settings",
      icon: Settings,
      color: "from-gray-500 to-gray-600",
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      color: "from-cyan-500 to-blue-500",
    },
  ];

  const vipBenefits = [
    "Higher withdrawal limits",
    "Exclusive bonuses",
    "Priority customer support",
    "Special VIP tournaments",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold">{user?.username || "Guest"}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">VIP Level {user?.vipLevel || 0}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Star className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm">Member since 2024</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-2xl p-3">
              <p className="text-white/80 text-sm">KYC Status</p>
              <p className={`font-semibold ${user?.kycStatus === 'verified' ? 'text-green-400' : 'text-yellow-400'}`}>
                {user?.kycStatus === 'verified' ? 'Verified' : 'Pending'}
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3">
              <p className="text-white/80 text-sm">Total Earnings</p>
              <p className="text-white font-semibold">₹25,750</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full"></div>
      </div>

      {/* Profile Details */}
      <div className="bg-slate-800/50 rounded-2xl p-4 mb-6">
        <h3 className="text-white text-lg font-semibold mb-4">Profile Information</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Phone:</span>
            <span className="text-white">{user?.phone || "Not provided"}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Email:</span>
            <span className="text-white">{user?.email || "Not provided"}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Joined:</span>
            <span className="text-white">January 2024</span>
          </div>
        </div>
      </div>

      {/* VIP Status */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Crown className="w-6 h-6 text-white" />
            <span className="text-white font-bold text-lg">VIP Level {user?.vipLevel || 0}</span>
          </div>
          <button className="bg-white text-orange-600 px-4 py-2 rounded-xl font-semibold text-sm">
            Upgrade
          </button>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-white text-sm mb-1">
            <span>Progress to Level {(user?.vipLevel || 0) + 1}</span>
            <span>75%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: "75%" }}></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {vipBenefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-white" />
              <span className="text-white text-xs">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-3 mb-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className="w-full bg-slate-800/50 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-700/50 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <button
        onClick={() => setShowLogoutModal(true)}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl flex items-center justify-center space-x-2 font-semibold transition-all"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-white text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-400 text-sm mb-6">Are you sure you want to logout from your account?</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-slate-700 text-white py-3 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('authToken');
                  window.location.reload();
                }}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Version */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-xs">91DreamClub v2.1.0</p>
      </div>
    </div>
  );
}