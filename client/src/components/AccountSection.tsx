import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Shield, HelpCircle, CreditCard, Gift, LogOut, ChevronRight, Edit, Camera, Phone, Mail, Calendar, MapPin } from 'lucide-react';

interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  isVerified: boolean;
}

interface AccountSectionProps {
  user: User;
  balance: string;
  onLogout: () => void;
}

export default function AccountSection({ user, balance, onLogout }: AccountSectionProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'help'>('profile');
  const [editing, setEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: user?.username || 'Guest User',
    email: user?.email || 'guest@91club.com',
    phone: user?.phone || '9876543210',
    birthdate: '1990-01-01',
    location: 'Mumbai, India'
  });

  const menuItems = [
    {
      id: 'security',
      title: 'Security & Privacy',
      description: 'Password, 2FA, verification',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      description: 'Bank accounts, cards, UPI',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'promotions',
      title: 'My Promotions',
      description: 'Bonuses, rewards, referrals',
      icon: Gift,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'FAQ, contact us, live chat',
      icon: HelpCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const handleSaveProfile = () => {
    setEditing(false);
    // Save profile logic here
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 text-white">
        <div className="text-center">
          <h1 className="text-xl font-bold">Account</h1>
          <div className="text-sm opacity-90">Profile & Settings</div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || 'G'}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold text-gray-800">{user?.username || 'Guest User'}</div>
              <div className="text-sm text-gray-600">{user?.phone || '9876543210'}</div>
              <div className="flex items-center space-x-2 mt-2">
                {user.isVerified ? (
                  <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                    <Shield className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                    <Shield className="w-3 h-3" />
                    <span>Pending Verification</span>
                  </div>
                )}
                <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                  VIP Level 2
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">₹{balance}</div>
              <div className="text-xs text-gray-600">Balance</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">156</div>
              <div className="text-xs text-gray-600">Games Played</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">67%</div>
              <div className="text-xs text-gray-600">Win Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 mb-4">
        <div className="flex space-x-2 bg-gray-100 rounded-xl p-1">
          {[
            { key: 'profile', label: 'Profile' },
            { key: 'settings', label: 'Settings' },
            { key: 'help', label: 'Help' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="px-4 space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold">Personal Information</div>
              <button
                onClick={() => editing ? handleSaveProfile() : setEditing(true)}
                className="flex items-center space-x-2 text-blue-500 font-semibold"
              >
                {editing ? (
                  <>
                    <span>Save</span>
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Username</div>
                  {editing ? (
                    <input
                      type="text"
                      value={userInfo.username}
                      onChange={(e) => setUserInfo({...userInfo, username: e.target.value})}
                      className="font-semibold text-gray-800 border-b border-gray-300 outline-none"
                    />
                  ) : (
                    <div className="font-semibold text-gray-800">{userInfo.username}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Email</div>
                  {editing ? (
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      className="font-semibold text-gray-800 border-b border-gray-300 outline-none"
                    />
                  ) : (
                    <div className="font-semibold text-gray-800">{userInfo.email}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Phone</div>
                  <div className="font-semibold text-gray-800">{userInfo.phone}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Date of Birth</div>
                  {editing ? (
                    <input
                      type="date"
                      value={userInfo.birthdate}
                      onChange={(e) => setUserInfo({...userInfo, birthdate: e.target.value})}
                      className="font-semibold text-gray-800 border-b border-gray-300 outline-none"
                    />
                  ) : (
                    <div className="font-semibold text-gray-800">{userInfo.birthdate}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Location</div>
                  {editing ? (
                    <input
                      type="text"
                      value={userInfo.location}
                      onChange={(e) => setUserInfo({...userInfo, location: e.target.value})}
                      className="font-semibold text-gray-800 border-b border-gray-300 outline-none"
                    />
                  ) : (
                    <div className="font-semibold text-gray-800">{userInfo.location}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-lg font-bold mb-4">Account Statistics</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">23</div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">₹8,450</div>
                <div className="text-sm text-gray-600">Total Won</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">12</div>
                <div className="text-sm text-gray-600">Referrals</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="px-4 space-y-3">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          ))}

          {/* App Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-lg font-bold mb-4">App Settings</div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">Notifications</div>
                  <div className="text-sm text-gray-600">Game alerts, promotions</div>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">Sound Effects</div>
                  <div className="text-sm text-gray-600">Game sounds, win alerts</div>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">Auto-play</div>
                  <div className="text-sm text-gray-600">Automatic game rounds</div>
                </div>
                <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="w-full bg-red-500 text-white p-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </div>
      )}

      {/* Help Tab */}
      {activeTab === 'help' && (
        <div className="px-4 space-y-4">
          {/* Quick Help */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-lg font-bold mb-4">Quick Help</div>
            <div className="space-y-3">
              {[
                { title: 'How to deposit money?', answer: 'Use UPI, bank transfer or cards to add money instantly.' },
                { title: 'How to withdraw winnings?', answer: 'Go to Wallet → Withdraw and select your bank account.' },
                { title: 'Game rules and payouts?', answer: 'Each game has detailed rules available in the game lobby.' },
                { title: 'Account verification?', answer: 'Upload ID documents in Security & Privacy section.' }
              ].map((faq, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-800 text-sm">{faq.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{faq.answer}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-lg font-bold mb-4">Contact Support</div>
            <div className="space-y-3">
              <button className="w-full p-4 bg-green-500 text-white rounded-lg font-semibold flex items-center justify-center space-x-2">
                <span>💬</span>
                <span>Live Chat</span>
              </button>
              <button className="w-full p-4 bg-blue-500 text-white rounded-lg font-semibold flex items-center justify-center space-x-2">
                <span>📧</span>
                <span>Email Support</span>
              </button>
              <button className="w-full p-4 bg-purple-500 text-white rounded-lg font-semibold flex items-center justify-center space-x-2">
                <span>📞</span>
                <span>Call Support</span>
              </button>
            </div>
          </div>

          {/* App Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-lg font-bold mb-4">App Information</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Version</span>
                <span className="font-semibold">2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-semibold">June 30, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Build</span>
                <span className="font-semibold">#91234</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}