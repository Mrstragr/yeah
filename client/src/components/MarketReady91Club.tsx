import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Bell, Settings, Wallet, TrendingUp, Trophy, User } from 'lucide-react';
import AuthenticWinGoGame from './AuthenticWinGoGame';
import AuthenticAviatorGame from './AuthenticAviatorGame';
import AuthenticK3Game from './AuthenticK3Game';
import Authentic5DGame from './Authentic5DGame';
import RealWalletSystem from './RealWalletSystem';
import RealMoneyWinGo from './RealMoneyWinGo';
import RealMoneyMines from './RealMoneyMines';
import RealMoneyDragonTiger from './RealMoneyDragonTiger';
import RealMoneyTeenPatti from './RealMoneyTeenPatti';
import AuthenticationSystem from './AuthenticationSystem';
import RealMoneyRoulette from './RealMoneyRoulette';
import RealMoneyBaccarat from './RealMoneyBaccarat';
import RealMoneyAndarBahar from './RealMoneyAndarBahar';
import ComprehensiveTournamentSystem from './ComprehensiveTournamentSystem';
import EnhancedWalletSystem from './EnhancedWalletSystem';
import SocialFeaturesSystem from './SocialFeaturesSystem';
import RealMoneySicBo from './RealMoneySicBo';
import ColorTradingSystem from './ColorTradingSystem';
import AdvancedSecuritySystem from './AdvancedSecuritySystem';

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

  if (currentTab === 'wallet') {
    return <EnhancedWalletSystem onBack={() => setCurrentTab('home')} />;
  }

  if (currentTab === 'activity') {
    return <ComprehensiveTournamentSystem onBack={() => setCurrentTab('home')} />;
  }

  if (currentTab === 'community') {
    return <SocialFeaturesSystem onBack={() => setCurrentTab('home')} />;
  }

  if (currentGame === 'real-wingo') {
    return <RealMoneyWinGo onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'real-mines') {
    return <RealMoneyMines onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'real-dragon-tiger') {
    return <RealMoneyDragonTiger onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'real-teen-patti') {
    return <RealMoneyTeenPatti onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'real-roulette') {
    return <RealMoneyRoulette onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'real-baccarat') {
    return <RealMoneyBaccarat onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'real-andarbahar') {
    return <RealMoneyAndarBahar onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'real-sicbo') {
    return <RealMoneySicBo onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'color-trading') {
    return <ColorTradingSystem onBack={() => setCurrentGame(null)} />;
  }

  if (currentTab === 'security') {
    return <AdvancedSecuritySystem onBack={() => setCurrentTab('home')} />;
  }

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
        
        {/* Authentic Indian Gaming Header */}
        <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
            <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
          </div>
          
          <div className="relative z-10 px-6 py-6">
            {/* Top Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-black">91</span>
                </div>
                <div>
                  <div className="text-white text-2xl font-black tracking-wider">91CLUB</div>
                  <div className="text-red-100 text-sm font-semibold">India's #1 Gaming Platform</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
                    <Bell className="w-5 h-5 text-white" />
                  </button>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
                </div>
                <button className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
                  <Settings className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-r from-white/15 to-white/5 rounded-2xl p-5 backdrop-blur-md border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-red-100 text-sm font-medium">Total Balance</div>
                    <div className="text-white text-3xl font-black">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  </div>
                </div>
                <button 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200"
                >
                  <RefreshCw className={`w-6 h-6 text-white ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-green-300 text-lg font-bold">+₹{todayProfit.toLocaleString('en-IN')}</div>
                    <div className="text-red-100 text-xs">Today's Profit</div>
                  </div>
                  <div className="w-px h-8 bg-white/20"></div>
                  <div className="text-center">
                    <div className="text-yellow-300 text-lg font-bold flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +18.7%
                    </div>
                    <div className="text-red-100 text-xs">Win Rate</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="px-3 py-1 bg-green-500/20 rounded-full">
                    <div className="text-green-300 text-xs font-bold">VIP 3</div>
                  </div>
                  <div className="px-3 py-1 bg-yellow-500/20 rounded-full">
                    <div className="text-yellow-300 text-xs font-bold">🔥 HOT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative bg-gradient-to-r from-emerald-500 via-green-500 to-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <span>Deposit</span>
              </div>
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span>Withdraw</span>
              </div>
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Premium Promotional Banner */}
        <div className="px-6 pb-4">
          <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-6 text-white overflow-hidden shadow-2xl">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-400/30 to-transparent rounded-full -translate-x-8 -translate-y-8 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-white/10 to-transparent rounded-full translate-x-10 translate-y-10"></div>
              <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-yellow-400 rounded-full animate-bounce delay-1000"></div>
              <div className="absolute top-1/4 left-3/4 w-4 h-4 bg-white/40 rounded-full animate-ping delay-500"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="px-3 py-1 bg-yellow-400 rounded-full">
                      <div className="text-yellow-900 text-xs font-black">MEGA JACKPOT</div>
                    </div>
                    <div className="px-3 py-1 bg-red-500/30 rounded-full border border-red-300">
                      <div className="text-white text-xs font-bold">LIMITED TIME</div>
                    </div>
                  </div>
                  <div className="text-yellow-200 text-lg font-bold mb-1">WIN UP TO</div>
                  <div className="text-white text-4xl font-black mb-1">₹5,00,000</div>
                  <div className="text-pink-200 text-sm mb-4">Daily Lottery Draw • 8:00 PM</div>
                </div>
                <div className="text-right">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-2 rotate-12 shadow-lg">
                    <span className="text-2xl">🎰</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-orange-900 px-8 py-3 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  CLAIM NOW
                </motion.button>
                <div className="text-right">
                  <div className="text-white/80 text-sm">Players Online</div>
                  <div className="text-green-300 text-xl font-bold flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    24,789
                  </div>
                </div>
              </div>
            </div>
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

          {/* Premium Games Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            
            {/* Quick Access to Real Money Wallet */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentTab('wallet')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-2xl font-semibold text-center"
            >
              <div className="text-2xl mb-2">💰</div>
              <div>Real Wallet</div>
              <div className="text-xs opacity-80">Deposit & Withdraw</div>
            </motion.button>
            
            {/* Real Money Games Badge */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-2xl text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-semibold">Live Games</div>
              <div className="text-xs opacity-80">Real Money Betting</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            
            {/* WIN GO Game - Premium Design */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('wingo')}
              className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 rounded-3xl overflow-hidden shadow-2xl group h-40"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              
              {/* Hot Badge */}
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-black shadow-lg border border-white/30">
                  🔥 HOT
                </div>
              </div>
              
              {/* Game Icon */}
              <div className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-6 transition-transform">
                <span className="text-2xl">🎯</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="mb-3">
                  <div className="text-white text-xl font-black mb-1">WIN GO</div>
                  <div className="text-blue-100 text-sm font-semibold">Color Prediction Game</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-yellow-300 font-bold">⚡ 30 Seconds</div>
                    <div className="text-green-300 font-bold">🎰 Up to 9X</div>
                  </div>
                  <div className="bg-green-500/20 rounded-full px-2 py-1 border border-green-400/30">
                    <div className="text-green-300 text-xs font-bold flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      12.4K
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Real Money WIN GO Game - Premium Design */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('real-wingo')}
              className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 rounded-3xl overflow-hidden shadow-2xl group h-40"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              
              {/* Real Money Badge */}
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-gradient-to-r from-yellow-500 to-green-600 text-white text-xs px-2 py-1 rounded-full font-black shadow-lg border border-white/30">
                  💰 REAL ₹
                </div>
              </div>
              
              {/* Game Icon */}
              <div className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-yellow-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-6 transition-transform">
                <span className="text-2xl">💎</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="mb-3">
                  <div className="text-white text-xl font-black mb-1">REAL WINGO</div>
                  <div className="text-emerald-100 text-sm font-semibold">Real Money Betting</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-yellow-300 font-bold">💸 Real Cash</div>
                    <div className="text-green-300 font-bold">🎰 Up to 9X</div>
                  </div>
                  <div className="bg-green-500/20 rounded-full px-2 py-1 border border-green-400/30">
                    <div className="text-green-300 text-xs font-bold flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      LIVE
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Real Money Mines Game - Premium Design */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('real-mines')}
              className="relative bg-gradient-to-br from-orange-600 via-yellow-600 to-orange-700 rounded-3xl overflow-hidden shadow-2xl group h-40"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              
              {/* Risk Badge */}
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-gradient-to-r from-red-500 to-yellow-600 text-white text-xs px-2 py-1 rounded-full font-black shadow-lg border border-white/30">
                  ⚠️ HIGH RISK
                </div>
              </div>
              
              {/* Game Icon */}
              <div className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-6 transition-transform">
                <span className="text-2xl">💣</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="mb-3">
                  <div className="text-white text-xl font-black mb-1">MINES</div>
                  <div className="text-orange-100 text-sm font-semibold">Strategic Mining</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-yellow-300 font-bold">💰 Big Rewards</div>
                    <div className="text-green-300 font-bold">🎯 Strategy Game</div>
                  </div>
                  <div className="bg-green-500/20 rounded-full px-2 py-1 border border-green-400/30">
                    <div className="text-green-300 text-xs font-bold flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      ACTIVE
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Real Money Dragon Tiger Game - Premium Design */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('real-dragon-tiger')}
              className="relative bg-gradient-to-br from-red-600 via-pink-600 to-red-700 rounded-3xl overflow-hidden shadow-2xl group h-40"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              
              {/* Classic Badge */}
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-gradient-to-r from-yellow-500 to-red-600 text-white text-xs px-2 py-1 rounded-full font-black shadow-lg border border-white/30">
                  🎴 CLASSIC
                </div>
              </div>
              
              {/* Game Icon */}
              <div className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-red-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-6 transition-transform">
                <span className="text-2xl">🐉</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="mb-3">
                  <div className="text-white text-xl font-black mb-1">DRAGON TIGER</div>
                  <div className="text-red-100 text-sm font-semibold">Card Battle Game</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-yellow-300 font-bold">🃏 Card Game</div>
                    <div className="text-green-300 font-bold">⚡ Fast Rounds</div>
                  </div>
                  <div className="bg-green-500/20 rounded-full px-2 py-1 border border-green-400/30">
                    <div className="text-green-300 text-xs font-bold flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      LIVE
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Real Money Teen Patti Game - Premium Design */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('real-teen-patti')}
              className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 rounded-3xl overflow-hidden shadow-2xl group h-40"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              
              {/* Premium Badge */}
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white text-xs px-2 py-1 rounded-full font-black shadow-lg border border-white/30">
                  👑 PREMIUM
                </div>
              </div>
              
              {/* Game Icon */}
              <div className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-6 transition-transform">
                <span className="text-2xl">🎰</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="mb-3">
                  <div className="text-white text-xl font-black mb-1">TEEN PATTI</div>
                  <div className="text-purple-100 text-sm font-semibold">3 Card Classic</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-yellow-300 font-bold">🃏 3 Cards</div>
                    <div className="text-green-300 font-bold">🎯 Classic Game</div>
                  </div>
                  <div className="bg-green-500/20 rounded-full px-2 py-1 border border-green-400/30">
                    <div className="text-green-300 text-xs font-bold flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      HOT
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Real Money Roulette Game */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('real-roulette')}
              className="relative bg-gradient-to-br from-red-600 via-orange-600 to-yellow-700 rounded-3xl overflow-hidden shadow-2xl group h-40"
            >
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
              </div>
              
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-gradient-to-r from-yellow-500 to-red-600 text-white text-xs px-2 py-1 rounded-full font-black shadow-lg border border-white/30">
                  🎰 CASINO
                </div>
              </div>
              
              <div className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-yellow-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-6 transition-transform">
                <span className="text-2xl">🎯</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="mb-3">
                  <div className="text-white text-xl font-black mb-1">ROULETTE</div>
                  <div className="text-orange-100 text-sm font-semibold">European Style</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-yellow-300 font-bold">🎰 36x Payout</div>
                    <div className="text-green-300 font-bold">⚡ Live Wheel</div>
                  </div>
                  <div className="bg-green-500/20 rounded-full px-2 py-1 border border-green-400/30">
                    <div className="text-green-300 text-xs font-bold flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      LIVE
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Real Money Baccarat Game */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('real-baccarat')}
              className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 rounded-3xl overflow-hidden shadow-2xl group h-40"
            >
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
              </div>
              
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white text-xs px-2 py-1 rounded-full font-black shadow-lg border border-white/30">
                  🃏 CARDS
                </div>
              </div>
              
              <div className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-6 transition-transform">
                <span className="text-2xl">♠️</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="mb-3">
                  <div className="text-white text-xl font-black mb-1">BACCARAT</div>
                  <div className="text-emerald-100 text-sm font-semibold">Player vs Banker</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-yellow-300 font-bold">🎯 9:1 Tie</div>
                    <div className="text-green-300 font-bold">⚡ Fast Deals</div>
                  </div>
                  <div className="bg-green-500/20 rounded-full px-2 py-1 border border-green-400/30">
                    <div className="text-green-300 text-xs font-bold flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      LIVE
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Real Money Andar Bahar Game */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('real-andarbahar')}
              className="relative bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 rounded-3xl overflow-hidden shadow-2xl group h-40"
            >
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
              </div>
              
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs px-2 py-1 rounded-full font-black shadow-lg border border-white/30">
                  🇮🇳 DESI
                </div>
              </div>
              
              <div className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-6 transition-transform">
                <span className="text-2xl">🎲</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="mb-3">
                  <div className="text-white text-xl font-black mb-1">ANDAR BAHAR</div>
                  <div className="text-orange-100 text-sm font-semibold">Indian Classic</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-yellow-300 font-bold">🎯 2:1 Payout</div>
                    <div className="text-green-300 font-bold">⚡ Quick Game</div>
                  </div>
                  <div className="bg-green-500/20 rounded-full px-2 py-1 border border-green-400/30">
                    <div className="text-green-300 text-xs font-bold flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      HOT
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Real Money Sic Bo Game */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('real-sicbo')}
              className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 rounded-3xl overflow-hidden shadow-2xl group h-40"
            >
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
              </div>
              
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs px-2 py-1 rounded-full font-black shadow-lg border border-white/30">
                  🎲 DICE
                </div>
              </div>
              
              <div className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-6 transition-transform">
                <span className="text-2xl">🎲</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="mb-3">
                  <div className="text-white text-xl font-black mb-1">SIC BO</div>
                  <div className="text-purple-100 text-sm font-semibold">Three Dice Game</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-yellow-300 font-bold">🎯 60:1 Max</div>
                    <div className="text-green-300 font-bold">⚡ Fast Game</div>
                  </div>
                  <div className="bg-green-500/20 rounded-full px-2 py-1 border border-green-400/30">
                    <div className="text-green-300 text-xs font-bold flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      NEW
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Color Trading System */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('color-trading')}
              className="relative bg-gradient-to-br from-yellow-600 via-orange-600 to-red-700 rounded-3xl overflow-hidden shadow-2xl group h-40"
            >
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
              </div>
              
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xs px-2 py-1 rounded-full font-black shadow-lg border border-white/30">
                  📈 TRADING
                </div>
              </div>
              
              <div className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-6 transition-transform">
                <span className="text-2xl">📊</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="mb-3">
                  <div className="text-white text-xl font-black mb-1">COLOR TRADING</div>
                  <div className="text-orange-100 text-sm font-semibold">Market Trading</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-yellow-300 font-bold">💰 High Returns</div>
                    <div className="text-green-300 font-bold">📈 Live Market</div>
                  </div>
                  <div className="bg-green-500/20 rounded-full px-2 py-1 border border-green-400/30">
                    <div className="text-green-300 text-xs font-bold flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      HOT
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Aviator Game - Premium Design */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('aviator')}
              className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl overflow-hidden shadow-2xl group h-40"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-y-6 -translate-x-6"></div>
                <div className="absolute bottom-0 right-0 w-18 h-18 bg-white/5 rounded-full translate-y-6 translate-x-6"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              
              {/* Trending Badge */}
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs px-3 py-1 rounded-full font-black shadow-lg border border-white/30">
                  📈 TRENDING
                </div>
              </div>
              
              {/* Game Icon */}
              <div className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg -rotate-12 group-hover:-rotate-6 transition-transform">
                <span className="text-2xl">✈️</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="mb-3">
                  <div className="text-white text-xl font-black mb-1">AVIATOR</div>
                  <div className="text-emerald-100 text-sm font-semibold">Multiplier Crash Game</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-yellow-300 font-bold">⚡ Live Game</div>
                    <div className="text-green-300 font-bold">🚀 Up to 1000X</div>
                  </div>
                  <div className="bg-green-500/20 rounded-full px-2 py-1 border border-green-400/30">
                    <div className="text-green-300 text-xs font-bold flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      8.7K
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* K3 Game - Premium Design */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('k3')}
              className="relative bg-gradient-to-br from-pink-600 via-rose-600 to-red-700 rounded-3xl overflow-hidden shadow-2xl group h-40"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0">
                <div className="absolute top-1/2 right-0 w-16 h-16 bg-white/10 rounded-full translate-x-4"></div>
                <div className="absolute bottom-0 left-1/2 w-20 h-20 bg-white/5 rounded-full translate-y-6"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              
              {/* New Badge */}
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs px-3 py-1 rounded-full font-black shadow-lg border border-white/30">
                  ✨ NEW
                </div>
              </div>
              
              {/* Game Icon */}
              <div className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-red-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-6 transition-transform">
                <span className="text-2xl">🎲</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="mb-3">
                  <div className="text-white text-xl font-black mb-1">K3</div>
                  <div className="text-pink-100 text-sm font-semibold">Three Dice Game</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-yellow-300 font-bold">⚡ 1 Minute</div>
                    <div className="text-green-300 font-bold">🎰 Up to 216X</div>
                  </div>
                  <div className="bg-green-500/20 rounded-full px-2 py-1 border border-green-400/30">
                    <div className="text-green-300 text-xs font-bold flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      5.2K
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* 5D Game - Premium Design */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame('5d')}
              className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 rounded-3xl overflow-hidden shadow-2xl group h-40"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/3 w-14 h-14 bg-white/10 rounded-full -translate-y-2"></div>
                <div className="absolute bottom-0 right-0 w-22 h-22 bg-white/5 rounded-full translate-y-4 translate-x-4"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              
              {/* Jackpot Badge */}
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-yellow-900 text-xs px-3 py-1 rounded-full font-black shadow-lg border border-white/30">
                  💎 JACKPOT
                </div>
              </div>
              
              {/* Game Icon */}
              <div className="absolute top-4 left-4 w-14 h-14 bg-gradient-to-br from-purple-400 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg -rotate-12 group-hover:-rotate-6 transition-transform">
                <span className="text-2xl">🎰</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="mb-3">
                  <div className="text-white text-xl font-black mb-1">5D</div>
                  <div className="text-violet-100 text-sm font-semibold">5-Number Lottery</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-yellow-300 font-bold">⚡ 1 Minute</div>
                    <div className="text-green-300 font-bold">💰 Up to 100000X</div>
                  </div>
                  <div className="bg-green-500/20 rounded-full px-2 py-1 border border-green-400/30">
                    <div className="text-green-300 text-xs font-bold flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      3.8K
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Premium Recent Winners Section */}
        <div className="px-6 pb-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-gray-800">🏆 Big Winners</h3>
            <div className="text-sm text-red-600 font-bold">LIVE</div>
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'Raj***', game: 'WIN GO', amount: 156000, time: '2 min ago', multiplier: '9X', avatar: '🎯' },
              { name: 'Priya***', game: 'Aviator', amount: 234000, time: '5 min ago', multiplier: '12.5X', avatar: '✈️' },
              { name: 'Amit***', game: 'K3', amount: 89000, time: '8 min ago', multiplier: '216X', avatar: '🎲' },
              { name: 'Sunita***', game: '5D', amount: 445000, time: '12 min ago', multiplier: '100000X', avatar: '🎰' },
            ].map((winner, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-green-200 rounded-2xl p-4 shadow-lg overflow-hidden group hover:shadow-xl transition-all"
              >
                {/* Winner Animation Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-lg">{winner.avatar}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="font-black text-gray-800 text-lg">{winner.name}</div>
                        <div className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          {winner.multiplier}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="text-gray-600 font-semibold">{winner.game}</div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="text-gray-500">{winner.time}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-black text-2xl text-green-600 mb-1">
                      ₹{winner.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-green-500 font-bold bg-green-100 px-2 py-1 rounded-full">
                      🎉 BIG WIN
                    </div>
                  </div>
                </div>
                
                {/* Celebration Effects */}
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
                <div className="absolute bottom-2 left-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce delay-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* View All Winners Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            🏆 View All Winners Today
          </motion.button>
        </div>

        {/* Premium Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
          <div className="relative bg-white border-t border-gray-200 shadow-2xl">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500"></div>
            
            <div className="grid grid-cols-5 py-3">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentTab('home')}
                className={`flex flex-col items-center py-2 px-1 transition-all ${currentTab === 'home' ? 'text-red-600' : 'text-gray-400'}`}
              >
                <div className={`relative mb-2 ${currentTab === 'home' ? 'text-2xl' : 'text-xl'}`}>
                  <span className="text-2xl">🏠</span>
                  {currentTab === 'home' && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs font-semibold">Home</div>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentTab('games')}
                className={`flex flex-col items-center py-2 px-1 transition-all ${currentTab === 'games' ? 'text-red-600' : 'text-gray-400'}`}
              >
                <div className={`relative mb-2 ${currentTab === 'games' ? 'text-2xl' : 'text-xl'}`}>
                  <span className="text-2xl">🎮</span>
                  {currentTab === 'games' && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs font-semibold">Games</div>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentTab('promotion')}
                className="flex flex-col items-center py-2 px-1 text-red-600 relative"
              >
                <div className="relative mb-2">
                  <div className="text-3xl bg-gradient-to-br from-red-600 to-pink-600 text-white rounded-2xl w-14 h-14 flex items-center justify-center shadow-lg border-4 border-white">
                    🎁
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-black text-red-800">!</span>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                </div>
                <div className="text-xs font-black">Bonus</div>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentTab('wallet')}
                className={`flex flex-col items-center py-2 px-1 transition-all ${currentTab === 'wallet' ? 'text-red-600' : 'text-gray-400'}`}
              >
                <div className={`relative mb-2 ${currentTab === 'wallet' ? 'text-2xl' : 'text-xl'}`}>
                  <span className="text-2xl">💰</span>
                  {currentTab === 'wallet' && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs font-semibold">Wallet</div>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentTab('account')}
                className={`flex flex-col items-center py-2 px-1 transition-all ${currentTab === 'account' ? 'text-red-600' : 'text-gray-400'}`}
              >
                <div className={`relative mb-2 ${currentTab === 'account' ? 'text-2xl' : 'text-xl'}`}>
                  <User className="w-6 h-6" />
                  {currentTab === 'account' && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs font-semibold">Account</div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}