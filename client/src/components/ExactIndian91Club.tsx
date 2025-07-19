import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import ExactBG678WinGo from './ExactBG678WinGo';

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

export default function ExactIndian91Club({ user, onLogout }: Props) {
  const [currentTab, setCurrentTab] = useState('games');
  const [showWinGo, setShowWinGo] = useState(false);
  const [balance] = useState(0.67); // Exact balance from screenshot

  if (showWinGo) {
    return <ExactBG678WinGo onBack={() => setShowWinGo(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        
        {/* Status Bar */}
        <div className="bg-black text-white px-4 py-1 text-xs flex justify-between">
          <span>8:17</span>
          <div className="flex space-x-1">
            <span>📶</span>
            <span>🔋</span>
            <span>78%</span>
          </div>
        </div>

        {/* URL Bar - EXACT */}
        <div className="bg-gray-100 px-4 py-2 flex items-center">
          <div className="flex-1 bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-600">
            🏠 91dreamclub.com/#/
          </div>
          <button className="ml-2 p-1">⚙️</button>
        </div>

        {/* Header with 91CLUB Logo - EXACT */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">⭕</span>
            </div>
            <span className="text-red-500 text-xl font-bold">91CLUB</span>
          </div>
          <div className="bg-red-500 text-white p-2 rounded-full text-xs">🔔</div>
        </div>

        {/* Notification Banner - EXACT */}
        <div className="bg-gray-100 px-4 py-2 border-b">
          <div className="flex items-start text-xs text-gray-600">
            <span className="mr-2 mt-0.5">🔊</span>
            <span>If you have not received your withdrawal within 3 days, please contact our service center with your bank statement (PDF/VIDEO) and PDF password (Phone number)</span>
          </div>
        </div>

        {/* Main Promotional Banner - EXACT */}
        <div className="px-4 py-4">
          <div 
            className="rounded-2xl p-4 text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 30%, #CD853F  70%, #D2691E 100%)'
            }}
          >
            {/* Indian Woman Image Area */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-l from-black/20 to-transparent rounded-full"></div>
            
            <div className="relative z-10">
              <div className="text-white text-lg font-bold mb-1">SPECIAL ATTENDANCE BONUS</div>
              <div className="text-yellow-200 text-sm mb-2">PROVIDED BY 91CLUB</div>
              <div className="text-yellow-200 text-xs mb-2">up to</div>
              <div className="text-white text-4xl font-bold mb-3">558RS</div>
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors">
                CLAIM IT RIGHT AWAY
              </button>
            </div>
          </div>
        </div>

        {/* Wallet Balance Section - EXACT */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-gray-500 text-sm mb-1 flex items-center">
                <span className="mr-1">💰</span>
                Wallet balance
              </div>
              <div className="text-3xl font-bold">₹{balance.toFixed(2)}</div>
            </div>
            <button className="p-2">
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button className="flex-1 bg-gradient-to-r from-orange-400 to-yellow-500 text-white py-3 rounded-xl font-bold text-sm">
              Withdraw
            </button>
            <button className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-bold text-sm">
              Deposit
            </button>
          </div>
        </div>

        {/* Quick Action Cards - EXACT */}
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

        {/* Game Category Tabs - EXACT */}
        <div className="px-4 py-3">
          <div className="flex space-x-1">
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Lobby</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-500 text-sm">
              <span>🎮</span>
              <span>Mini game</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-500 text-sm">
              <span>🎰</span>
              <span>Slots</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-500 text-sm">
              <span>🃏</span>
              <span>Card</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-500 text-sm">
              <span>🎣</span>
              <span>Fishing</span>
            </button>
          </div>
        </div>

        {/* Lottery Section - EXACT */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🔴</span>
              </div>
              <span className="font-bold text-lg">Lottery</span>
            </div>
          </div>
          <div className="text-gray-500 text-sm mb-4">
            The games are independently developed by our team, fun, fair, and safe
          </div>

          {/* Lottery Games Grid - EXACT colors and layout */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            
            {/* WIN GO - EXACT blue gradient with sparkles */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowWinGo(true)}
              className="bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 rounded-2xl p-4 text-white text-left relative overflow-hidden h-24"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
              <div className="absolute top-2 right-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">7</span>
                </div>
              </div>
              <div className="relative z-10">
                <div className="text-2xl mb-1">✨</div>
                <div className="font-bold text-lg leading-tight">WIN GO</div>
                <div className="text-xs opacity-90">1 Min</div>
              </div>
              <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-white/20 rounded-full"></div>
              <div className="absolute left-2 top-2 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
            </motion.button>

            {/* K3 - EXACT pink gradient */}
            <div className="bg-gradient-to-br from-pink-400 via-red-400 to-pink-500 rounded-2xl p-4 text-white text-left relative overflow-hidden h-24">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
              <div className="relative z-10">
                <div className="text-2xl mb-1">🎲</div>
                <div className="font-bold text-lg leading-tight">K3</div>
                <div className="text-xs opacity-90">1 Min</div>
              </div>
              <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-white/20 rounded-full"></div>
            </div>

            {/* 5D - EXACT green gradient */}
            <div className="bg-gradient-to-br from-green-400 via-emerald-400 to-green-500 rounded-2xl p-4 text-white text-left relative overflow-hidden h-24">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
              <div className="relative z-10">
                <div className="text-2xl mb-1">🎯</div>
                <div className="font-bold text-lg leading-tight">5D</div>
                <div className="text-xs opacity-90">1 Min</div>
              </div>
              <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-white/20 rounded-full"></div>
            </div>

            {/* TRX WINGO - EXACT purple gradient */}
            <div className="bg-gradient-to-br from-purple-400 via-violet-400 to-purple-500 rounded-2xl p-4 text-white text-left relative overflow-hidden h-24">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
              <div className="relative z-10">
                <div className="text-2xl mb-1">⚡</div>
                <div className="font-bold text-lg leading-tight">TRX WINGO</div>
                <div className="text-xs opacity-90">TRX</div>
              </div>
              <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-20"></div>

        {/* Bottom Navigation - EXACT */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
          <div className="grid grid-cols-5 py-2">
            <button 
              onClick={() => setCurrentTab('promotion')}
              className={`flex flex-col items-center py-2 px-1 ${currentTab === 'promotion' ? 'text-red-500' : 'text-gray-400'}`}
            >
              <div className="text-lg mb-1">🎁</div>
              <div className="text-xs">Promotion</div>
            </button>
            
            <button 
              onClick={() => setCurrentTab('activity')}
              className={`flex flex-col items-center py-2 px-1 ${currentTab === 'activity' ? 'text-red-500' : 'text-gray-400'}`}
            >
              <div className="text-lg mb-1">📊</div>
              <div className="text-xs">Activity</div>
            </button>
            
            <button 
              onClick={() => setCurrentTab('games')}
              className="flex flex-col items-center py-2 px-1 text-red-500 relative"
            >
              <div className="text-2xl mb-1 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center">🎮</div>
              <div className="text-xs">Games</div>
            </button>
            
            <button 
              onClick={() => setCurrentTab('wallet')}
              className={`flex flex-col items-center py-2 px-1 ${currentTab === 'wallet' ? 'text-red-500' : 'text-gray-400'}`}
            >
              <div className="text-lg mb-1">💰</div>
              <div className="text-xs">Wallet</div>
            </button>
            
            <button 
              onClick={() => setCurrentTab('account')}
              className={`flex flex-col items-center py-2 px-1 ${currentTab === 'account' ? 'text-red-500' : 'text-gray-400'}`}
            >
              <div className="text-lg mb-1">👤</div>
              <div className="text-xs">Account</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}