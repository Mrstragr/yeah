import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Bell, Settings, Wallet, TrendingUp, Trophy, User } from 'lucide-react';
import AuthenticWinGoGame from './AuthenticWinGoGame';
import AuthenticAviatorGame from './AuthenticAviatorGame';
import AuthenticK3Game from './AuthenticK3Game';
import Authentic5DGame from './Authentic5DGame';

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

export default function MarketReady91Club({ user, onLogout }: Props) {
  const [currentTab, setCurrentTab] = useState('home');
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [balance, setBalance] = useState(12580.45);
  const [todayProfit, setTodayProfit] = useState(2340.75);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh balance
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setBalance(prev => prev + Math.random() * 100);
      setIsRefreshing(false);
    }, 1000);
  };

  if (currentGame === 'wingo') {
    return <AuthenticWinGoGame onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'aviator') {
    return <AuthenticAviatorGame onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'k3') {
    return <AuthenticK3Game onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === '5d') {
    return <Authentic5DGame onBack={() => setCurrentGame(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-red-200 text-xl font-bold">91</span>
              </div>
              <div>
                <div className="text-white text-xl font-bold">91CLUB</div>
                <div className="text-red-100 text-sm">Premium Gaming</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-red-100 text-sm flex items-center">
                  <Wallet className="w-4 h-4 mr-1" />
                  Main Balance
                </div>
                <div className="text-white text-3xl font-bold">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              </div>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="text-red-100">
                Today's P&L: <span className="text-green-300 font-semibold">+₹{todayProfit.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center text-green-300">
                <TrendingUp className="w-4 h-4 mr-1" />
                +18.7%
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 hover:shadow-lg transition-all">
              <Wallet className="w-5 h-5" />
              <span>Deposit</span>
            </button>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 hover:shadow-lg transition-all">
              <TrendingUp className="w-5 h-5" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="px-6 pb-4">
          <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            <div className="relative z-10">
              <div className="text-yellow-100 text-sm font-semibold mb-1">MEGA BONUS EVENT</div>
              <div className="text-white text-2xl font-bold mb-2">WIN UP TO</div>
              <div className="text-white text-4xl font-bold mb-3">₹50,000</div>
              <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                CLAIM NOW
              </button>
            </div>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
          </div>
        </div>

        {/* Game Categories */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Popular Games</h2>
            <button className="text-red-600 text-sm font-semibold">View All</button>
          </div>
          
          <div className="flex space-x-3 mb-4">
            <button className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              🎯 Lottery
            </button>
            <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm">
              🎮 Arcade
            </button>
            <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm">
              🎰 Slots
            </button>
            <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm">
              🃏 Cards
            </button>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* WIN GO Game */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('wingo')}
              className="bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-2xl p-6 text-white text-left relative overflow-hidden h-32 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent group-hover:from-white/30 transition-all"></div>
              
              {/* Hot Badge */}
              <div className="absolute top-3 right-3">
                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  🔥 HOT
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="text-3xl mb-2">🎯</div>
                <div className="font-bold text-xl mb-1">WIN GO</div>
                <div className="text-blue-100 text-sm">Color Prediction</div>
                <div className="text-blue-100 text-xs mt-1">30 Sec • 2-9X</div>
              </div>
              
              {/* Live Players Count */}
              <div className="absolute bottom-3 left-6 bg-black/30 rounded-full px-2 py-1">
                <div className="text-xs text-white">🟢 12.4K playing</div>
              </div>
            </motion.button>

            {/* Aviator Game */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('aviator')}
              className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl p-6 text-white text-left relative overflow-hidden h-32 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent group-hover:from-white/30 transition-all"></div>
              
              {/* Trending Badge */}
              <div className="absolute top-3 right-3">
                <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  📈 TRENDING
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="text-3xl mb-2">✈️</div>
                <div className="font-bold text-xl mb-1">AVIATOR</div>
                <div className="text-emerald-100 text-sm">Crash Game</div>
                <div className="text-emerald-100 text-xs mt-1">Live • Up to 1000X</div>
              </div>
              
              {/* Live Players Count */}
              <div className="absolute bottom-3 left-6 bg-black/30 rounded-full px-2 py-1">
                <div className="text-xs text-white">🟢 8.7K playing</div>
              </div>
            </motion.button>

            {/* K3 Game */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('k3')}
              className="bg-gradient-to-br from-pink-500 via-rose-600 to-red-600 rounded-2xl p-6 text-white text-left relative overflow-hidden h-32 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent group-hover:from-white/30 transition-all"></div>
              
              <div className="relative z-10">
                <div className="text-3xl mb-2">🎲</div>
                <div className="font-bold text-xl mb-1">K3</div>
                <div className="text-pink-100 text-sm">Dice Game</div>
                <div className="text-pink-100 text-xs mt-1">1 Min • Up to 216X</div>
              </div>
              
              <div className="absolute bottom-3 left-6 bg-black/30 rounded-full px-2 py-1">
                <div className="text-xs text-white">🟢 5.2K playing</div>
              </div>
            </motion.button>

            {/* 5D Game */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('5d')}
              className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl p-6 text-white text-left relative overflow-hidden h-32 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent group-hover:from-white/30 transition-all"></div>
              
              <div className="relative z-10">
                <div className="text-3xl mb-2">🎰</div>
                <div className="font-bold text-xl mb-1">5D</div>
                <div className="text-indigo-100 text-sm">Number Game</div>
                <div className="text-indigo-100 text-xs mt-1">1 Min • Up to 10000X</div>
              </div>
              
              <div className="absolute bottom-3 left-6 bg-black/30 rounded-full px-2 py-1">
                <div className="text-xs text-white">🟢 3.8K playing</div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Recent Winners */}
        <div className="px-6 pb-20">
          <h3 className="text-lg font-bold text-gray-800 mb-3">🏆 Recent Winners</h3>
          <div className="space-y-2">
            {[
              { name: 'Raj***', game: 'WIN GO', amount: 15600, time: '2 min ago' },
              { name: 'Priya***', game: 'Aviator', amount: 23400, time: '5 min ago' },
              { name: 'Amit***', game: 'K3', amount: 8900, time: '8 min ago' },
            ].map((winner, index) => (
              <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{winner.name}</div>
                    <div className="text-sm text-gray-500">{winner.game} • {winner.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">+₹{winner.amount.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-green-500">Won</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
          <div className="grid grid-cols-5 py-2">
            <button 
              onClick={() => setCurrentTab('home')}
              className={`flex flex-col items-center py-2 px-1 ${currentTab === 'home' ? 'text-red-600' : 'text-gray-400'}`}
            >
              <div className="text-lg mb-1">🏠</div>
              <div className="text-xs">Home</div>
            </button>
            
            <button 
              onClick={() => setCurrentTab('games')}
              className={`flex flex-col items-center py-2 px-1 ${currentTab === 'games' ? 'text-red-600' : 'text-gray-400'}`}
            >
              <div className="text-lg mb-1">🎮</div>
              <div className="text-xs">Games</div>
            </button>
            
            <button 
              onClick={() => setCurrentTab('promotion')}
              className="flex flex-col items-center py-2 px-1 text-red-600 relative"
            >
              <div className="text-2xl mb-1 bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center">🎁</div>
              <div className="text-xs">Bonus</div>
            </button>
            
            <button 
              onClick={() => setCurrentTab('wallet')}
              className={`flex flex-col items-center py-2 px-1 ${currentTab === 'wallet' ? 'text-red-600' : 'text-gray-400'}`}
            >
              <div className="text-lg mb-1">💰</div>
              <div className="text-xs">Wallet</div>
            </button>
            
            <button 
              onClick={() => setCurrentTab('account')}
              className={`flex flex-col items-center py-2 px-1 ${currentTab === 'account' ? 'text-red-600' : 'text-gray-400'}`}
            >
              <User className="w-5 h-5 mb-1" />
              <div className="text-xs">Account</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}