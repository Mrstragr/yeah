import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import AuthenticWinGoGame from './AuthenticWinGoGame';

interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  isVerified: boolean;
}

interface Props {
  user: User;
  onLogout: () => void;
}

export default function Authentic91Club({ user, onLogout }: Props) {
  const [currentTab, setCurrentTab] = useState('games');
  const [showWinGo, setShowWinGo] = useState(false);
  const [balance, setBalance] = useState(parseFloat(user.walletBalance || '0'));

  const handleBalanceUpdate = () => {
    // Refresh balance from user data
    setBalance(parseFloat(user.walletBalance || '0'));
  };

  if (showWinGo) {
    return <AuthenticWinGoGame onBack={() => setShowWinGo(false)} user={user} onBalanceUpdate={handleBalanceUpdate} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        
        {/* Header with 91Club branding */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-red-500 text-sm font-bold">91</span>
              </div>
              <div className="text-lg font-bold">91CLUB</div>
            </div>
            <button className="p-2">
              <div className="w-6 h-6 bg-white/20 rounded-full"></div>
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        <div className="bg-gray-50 px-4 py-2 border-b">
          <div className="flex items-center text-xs text-gray-600">
            <span className="mr-2">📢</span>
            <span>If you have not received your withdrawal within 3 days, please contact our service center with your bank statement (PDF/VIDEO) and PDF password (Phone number)</span>
          </div>
        </div>

        {/* Special Promotional Banner */}
        <div className="px-4 py-3">
          <div className="bg-gradient-to-r from-yellow-600 to-red-600 rounded-xl p-4 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-white text-lg font-bold mb-1">SPECIAL ATTENDANCE BONUS</div>
              <div className="text-white text-sm mb-2">PROVIDED BY 91CLUB</div>
              <div className="text-yellow-300 text-xs mb-3">up to</div>
              <div className="text-white text-3xl font-bold mb-2">558RS</div>
              <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-sm">
                CLAIM IT RIGHT AWAY
              </button>
            </div>
            <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-8 -translate-y-4"></div>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-gray-500 text-sm mb-1">💰 Wallet balance</div>
              <div className="text-2xl font-bold">₹{balance.toFixed(2)}</div>
            </div>
            <button onClick={handleBalanceUpdate} className="p-2">
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button className="flex-1 bg-gradient-to-r from-orange-400 to-yellow-400 text-white py-3 rounded-xl font-bold">
              Withdraw
            </button>
            <button className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-bold">
              Deposit
            </button>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="px-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-xl p-4 text-white">
              <div className="text-2xl mb-2">🎡</div>
              <div className="font-bold">Wheel</div>
              <div className="text-sm opacity-90">of fortune</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-4 text-white">
              <div className="text-2xl mb-2">👑</div>
              <div className="font-bold">VIP</div>
              <div className="text-sm opacity-90">privileges</div>
            </div>
          </div>
        </div>

        {/* Game Categories */}
        <div className="px-4 py-3">
          <div className="flex space-x-6 mb-4">
            <button className="flex items-center space-x-2 text-red-500 border-b-2 border-red-500 pb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="font-bold">Lobby</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500">
              <span>🎮</span>
              <span>Mini game</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500">
              <span>🎰</span>
              <span>Slots</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500">
              <span>🃏</span>
              <span>Card</span>
            </button>
          </div>
        </div>

        {/* Lottery Section */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⚪</span>
              </div>
              <span className="font-bold text-lg">Lottery</span>
            </div>
          </div>
          <div className="text-gray-500 text-sm mb-4">
            The games are independently developed by our team, fun, fair, and safe
          </div>

          {/* Lottery Games Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* WIN GO */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowWinGo(true)}
              className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-4 text-white text-left relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="text-2xl mb-2">✨</div>
                <div className="font-bold text-lg">WIN GO</div>
                <div className="text-sm opacity-90">1 Min</div>
                <div className="absolute top-2 right-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">7</span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/20 rounded-full"></div>
            </motion.button>

            {/* K3 */}
            <div className="bg-gradient-to-br from-pink-400 to-red-500 rounded-2xl p-4 text-white text-left relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-2xl mb-2">🎲</div>
                <div className="font-bold text-lg">K3</div>
                <div className="text-sm opacity-90">1 Min</div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/20 rounded-full"></div>
            </div>

            {/* 5D */}
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-4 text-white text-left relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-bold text-lg">5D</div>
                <div className="text-sm opacity-90">1 Min</div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/20 rounded-full"></div>
            </div>

            {/* TRX WINGO */}
            <div className="bg-gradient-to-br from-purple-400 to-violet-500 rounded-2xl p-4 text-white text-left relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-bold text-lg">TRX WINGO</div>
                <div className="text-sm opacity-90">TRX</div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-20"></div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
          <div className="grid grid-cols-5 py-2">
            <button 
              onClick={() => setCurrentTab('promotion')}
              className={`flex flex-col items-center py-2 px-1 ${currentTab === 'promotion' ? 'text-red-500' : 'text-gray-400'}`}
            >
              <div className="text-lg mb-1">🎁</div>
              <div className="text-xs font-medium">Promotion</div>
            </button>
            
            <button 
              onClick={() => setCurrentTab('activity')}
              className={`flex flex-col items-center py-2 px-1 ${currentTab === 'activity' ? 'text-red-500' : 'text-gray-400'}`}
            >
              <div className="text-lg mb-1">📊</div>
              <div className="text-xs font-medium">Activity</div>
            </button>
            
            <button 
              onClick={() => setCurrentTab('games')}
              className={`flex flex-col items-center py-2 px-1 ${currentTab === 'games' ? 'text-red-500' : 'text-gray-400'} relative`}
            >
              <div className="text-2xl mb-1">🎮</div>
              <div className="text-xs font-medium">Games</div>
              {currentTab === 'games' && (
                <div className="absolute bottom-0 w-full h-1 bg-red-500 rounded-t-full"></div>
              )}
            </button>
            
            <button 
              onClick={() => setCurrentTab('wallet')}
              className={`flex flex-col items-center py-2 px-1 ${currentTab === 'wallet' ? 'text-red-500' : 'text-gray-400'}`}
            >
              <div className="text-lg mb-1">💰</div>
              <div className="text-xs font-medium">Wallet</div>
            </button>
            
            <button 
              onClick={() => setCurrentTab('account')}
              className={`flex flex-col items-center py-2 px-1 ${currentTab === 'account' ? 'text-red-500' : 'text-gray-400'}`}
            >
              <div className="text-lg mb-1">👤</div>
              <div className="text-xs font-medium">Account</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}