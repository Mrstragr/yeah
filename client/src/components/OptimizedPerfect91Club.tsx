import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Trophy, Wallet, Users, Shield, RefreshCw, Bell, Settings, ArrowLeft, Play, Crown, Star, TrendingUp, Gift, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Consolidated Game Components
import RealMoneySicBo from './RealMoneySicBo';
import ColorTradingSystem from './ColorTradingSystem';
import AdvancedSecuritySystem from './AdvancedSecuritySystem';
import EnhancedWalletSystem from './EnhancedWalletSystem';
import ComprehensiveTournamentSystem from './ComprehensiveTournamentSystem';
import SocialFeaturesSystem from './SocialFeaturesSystem';

// Core Game Components (keeping only essential ones)
import RealMoneyWinGo from './RealMoneyWinGo';
import RealMoneyMines from './RealMoneyMines';
import RealMoneyDragonTiger from './RealMoneyDragonTiger';
import RealMoneyTeenPatti from './RealMoneyTeenPatti';
import RealMoneyRoulette from './RealMoneyRoulette';
import RealMoneyBaccarat from './RealMoneyBaccarat';
import RealMoneyAndarBahar from './RealMoneyAndarBahar';

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

interface GameData {
  id: string;
  name: string;
  icon: string;
  category: string;
  players: string;
  status: string;
  multiplier: string;
  gradient: string;
  component: string;
}

export default function OptimizedPerfect91Club({ user, onLogout }: Props) {
  const [currentTab, setCurrentTab] = useState('home');
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [balance, setBalance] = useState(12580.45);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Optimized game data with memoization
  const gamesList = useMemo<GameData[]>(() => [
    {
      id: 'real-wingo',
      name: 'WIN GO',
      icon: '🎯',
      category: 'Prediction',
      players: '8.2K',
      status: 'HOT',
      multiplier: '9X Max',
      gradient: 'from-red-600 via-pink-600 to-rose-700',
      component: 'RealMoneyWinGo'
    },
    {
      id: 'real-sicbo',
      name: 'SIC BO',
      icon: '🎲',
      category: 'Dice',
      players: '5.4K',
      status: 'NEW',
      multiplier: '60X Max',
      gradient: 'from-indigo-600 via-purple-600 to-pink-700',
      component: 'RealMoneySicBo'
    },
    {
      id: 'color-trading',
      name: 'COLOR TRADING',
      icon: '📊',
      category: 'Trading',
      players: '3.1K',
      status: 'TRENDING',
      multiplier: 'High Returns',
      gradient: 'from-yellow-600 via-orange-600 to-red-700',
      component: 'ColorTradingSystem'
    },
    {
      id: 'real-mines',
      name: 'MINES',
      icon: '💎',
      category: 'Strategy',
      players: '6.8K',
      status: 'POPULAR',
      multiplier: '24X Max',
      gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
      component: 'RealMoneyMines'
    },
    {
      id: 'real-roulette',
      name: 'ROULETTE',
      icon: '🎡',
      category: 'Casino',
      players: '4.2K',
      status: 'CLASSIC',
      multiplier: '36X Max',
      gradient: 'from-red-600 via-orange-600 to-yellow-700',
      component: 'RealMoneyRoulette'
    },
    {
      id: 'real-baccarat',
      name: 'BACCARAT',
      icon: '🃏',
      category: 'Cards',
      players: '3.7K',
      status: 'VIP',
      multiplier: '9X Max',
      gradient: 'from-blue-600 via-indigo-600 to-purple-700',
      component: 'RealMoneyBaccarat'
    },
    {
      id: 'real-andarbahar',
      name: 'ANDAR BAHAR',
      icon: '🎴',
      category: 'Indian',
      players: '7.1K',
      status: 'FAVORITE',
      multiplier: '2X',
      gradient: 'from-green-600 via-emerald-600 to-teal-700',
      component: 'RealMoneyAndarBahar'
    },
    {
      id: 'real-teenpatti',
      name: 'TEEN PATTI',
      icon: '♠️',
      category: 'Indian',
      players: '9.3K',
      status: 'POPULAR',
      multiplier: '40X Max',
      gradient: 'from-purple-600 via-violet-600 to-indigo-700',
      component: 'RealMoneyTeenPatti'
    },
    {
      id: 'real-dragon-tiger',
      name: 'DRAGON TIGER',
      icon: '🐲',
      category: 'Cards',
      players: '4.9K',
      status: 'LIVE',
      multiplier: '11X Max',
      gradient: 'from-orange-600 via-red-600 to-pink-700',
      component: 'RealMoneyDragonTiger'
    }
  ], []);

  // Optimized refresh handler
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBalance(prev => prev + Math.random() * 100);
      toast({
        title: "Balance Updated",
        description: "Your latest balance has been synced",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Unable to update balance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, toast]);

  // Memoized recent winners data
  const recentWinners = useMemo(() => [
    { name: 'Raj***', game: 'WIN GO', amount: 156000, time: '2 min ago', multiplier: '9X', avatar: '🎯' },
    { name: 'Priya***', game: 'SIC BO', amount: 234000, time: '5 min ago', multiplier: '60X', avatar: '🎲' },
    { name: 'Amit***', game: 'MINES', amount: 89000, time: '8 min ago', multiplier: '24X', avatar: '💎' },
    { name: 'Sunita***', game: 'ROULETTE', amount: 445000, time: '12 min ago', multiplier: '36X', avatar: '🎡' },
  ], []);

  // Game component renderer
  const renderGameComponent = useCallback(() => {
    const gameComponents: { [key: string]: React.ComponentType<{ onBack: () => void }> } = {
      'real-wingo': RealMoneyWinGo,
      'real-sicbo': RealMoneySicBo,
      'color-trading': ColorTradingSystem,
      'real-mines': RealMoneyMines,
      'real-roulette': RealMoneyRoulette,
      'real-baccarat': RealMoneyBaccarat,
      'real-andarbahar': RealMoneyAndarBahar,
      'real-teenpatti': RealMoneyTeenPatti,
      'real-dragon-tiger': RealMoneyDragonTiger,
    };

    const GameComponent = currentGame ? gameComponents[currentGame] : null;
    return GameComponent ? <GameComponent onBack={() => setCurrentGame(null)} /> : null;
  }, [currentGame]);

  // Tab component renderer
  const renderTabComponent = useCallback(() => {
    const tabComponents: { [key: string]: React.ComponentType<{ onBack: () => void }> } = {
      wallet: EnhancedWalletSystem,
      activity: ComprehensiveTournamentSystem,
      community: SocialFeaturesSystem,
      security: AdvancedSecuritySystem,
    };

    const TabComponent = currentTab !== 'home' ? tabComponents[currentTab] : null;
    return TabComponent ? <TabComponent onBack={() => setCurrentTab('home')} /> : null;
  }, [currentTab]);

  // Early returns for better performance
  if (currentGame) {
    return renderGameComponent();
  }

  if (currentTab !== 'home') {
    return renderTabComponent();
  }

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative overflow-hidden">
      {/* Optimized Header */}
      <div className="relative bg-gradient-to-r from-red-600 via-pink-600 to-purple-700 p-6 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Crown className="w-7 h-7 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black">91CLUB</h1>
                <div className="text-pink-100 text-sm">Premium Gaming</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Bell className="w-4 h-4" />
              </Button>
              
              <Button 
                onClick={onLogout}
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Balance Display */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-pink-100 mb-1">Total Balance</div>
                <div className="text-2xl font-black">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-200 mb-1">Today's Profit</div>
                <div className="text-lg font-bold text-green-300">+₹2,340.75</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid - Optimized */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-800">🎮 Casino Games</h2>
          <div className="text-sm text-red-600 font-bold">LIVE</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {gamesList.map((game, index) => (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentGame(game.id)}
              className={`relative bg-gradient-to-br ${game.gradient} rounded-3xl overflow-hidden shadow-xl h-40 group`}
            >
              {/* Background Effects */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
              </div>
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-bold border border-white/30">
                  {game.status}
                </div>
              </div>
              
              {/* Game Icon */}
              <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm rotate-12 group-hover:rotate-6 transition-transform">
                <span className="text-2xl">{game.icon}</span>
              </div>
              
              {/* Game Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="mb-2">
                  <div className="text-white text-lg font-black mb-1">{game.name}</div>
                  <div className="text-white/80 text-sm">{game.category}</div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="text-yellow-200 font-bold">{game.multiplier}</div>
                    <div className="text-green-200 font-bold">{game.players} players</div>
                  </div>
                  <div className="bg-green-500/20 rounded-full px-2 py-1 border border-green-400/30">
                    <div className="text-green-200 font-bold flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      LIVE
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Recent Winners - Optimized */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-gray-800">🏆 Big Winners</h3>
            <div className="text-sm text-red-600 font-bold">LIVE</div>
          </div>
          
          <div className="space-y-3">
            {recentWinners.map((winner, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-green-200 rounded-2xl p-4 shadow-lg"
              >
                <div className="flex items-center justify-between">
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Optimized Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
        <div className="relative bg-white border-t border-gray-200 shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500"></div>
          
          <div className="grid grid-cols-5 py-3">
            {[
              { key: 'home', icon: Home, label: 'Home', emoji: '🏠' },
              { key: 'activity', icon: Trophy, label: 'Events', emoji: '🏆' },
              { key: 'wallet', icon: Wallet, label: 'Wallet', emoji: '💰' },
              { key: 'community', icon: Users, label: 'Social', emoji: '👥' },
              { key: 'security', icon: Shield, label: 'Security', emoji: '🛡️' }
            ].map(tab => (
              <motion.button 
                key={tab.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentTab(tab.key)}
                className={`flex flex-col items-center py-2 px-1 transition-all ${
                  currentTab === tab.key ? 'text-red-600' : 'text-gray-400'
                }`}
              >
                <div className={`relative mb-2 ${currentTab === tab.key ? 'text-2xl' : 'text-xl'}`}>
                  <span className="text-2xl">{tab.emoji}</span>
                  {currentTab === tab.key && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs font-semibold">{tab.label}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}