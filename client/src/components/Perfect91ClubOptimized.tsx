import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, Lock, Eye, EyeOff, ArrowLeft,
  Gift, Wallet, Trophy, User, Gamepad2,
  Plus, Minus, Play
} from 'lucide-react';
import WinGoGame from './WinGoGame';
import AuthenticAviatorGame from './AuthenticAviatorGame';
import BG678ColorPrediction from './BG678ColorPrediction';
import OfficialWinGo from './OfficialWinGo';
import OfficialDice from './OfficialDice';
import OfficialK3 from './OfficialK3';
import Official5D from './Official5D';
import OfficialTRXWinGo from './OfficialTRXWinGo';
import EnhancedPromotion from './EnhancedPromotion';
import EnhancedWallet from './EnhancedWallet';
import EnhancedActivity from './EnhancedActivity';
import { ErrorBoundary } from './ErrorBoundary';
import { useOptimizedBalance } from '../hooks/useOptimizedBalance';
import { useAuthPersistence } from '../hooks/useAuthPersistence';

interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  isVerified: boolean;
}

interface Game {
  id: string;
  name: string;
  bgColor: string;
  icon: string;
  description: string;
}

export function Perfect91ClubOptimized() {
  // Authentication with persistence
  const { user, isLoading: authLoading, login, logout } = useAuthPersistence();
  
  // Optimized balance management
  const { balance, updateLocalBalance, isLoading: balanceLoading } = useOptimizedBalance();
  
  // UI State Management
  const [showAuth, setShowAuth] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentGameView, setCurrentGameView] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'home' | 'promotion' | 'activity' | 'wallet' | 'account'>('home');

  // Memoized game data to prevent unnecessary re-renders
  const lotteryGames = useMemo(() => [
    {
      id: 'wingo',
      name: 'WIN GO',
      bgColor: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
      icon: '🎯',
      description: 'LOTTERY'
    },
    {
      id: 'k3',
      name: 'K3',
      bgColor: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
      icon: '🎲',
      description: 'LOTTERY'
    },
    {
      id: '5d',
      name: '5D',
      bgColor: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      icon: '🎰',
      description: 'LOTTERY'
    },
    {
      id: 'trx-wingo',
      name: 'TRX WINGO',
      bgColor: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      icon: '⚡',
      description: 'BLOCKCHAIN'
    }
  ], []);

  const recommendedGames = useMemo(() => [
    {
      id: 'aviator',
      name: 'AVIATOR',
      bgColor: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
      icon: '✈️',
      description: 'CRASH GAME'
    },
    {
      id: 'color-prediction',
      name: 'COLOR\nPREDICTION',
      bgColor: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
      icon: '🌈',
      description: 'PREDICTION'
    }
  ], []);

  // Optimized login handler
  const handleLogin = useCallback(async () => {
    if (!phone || !password) return;
    
    setLoading(true);
    try {
      const result = await login(phone, password);
      if (result.success) {
        setShowAuth(false);
        setPhone('');
        setPassword('');
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Connection error occurred');
    }
    setLoading(false);
  }, [phone, password, login]);

  // Optimized logout handler
  const handleLogout = useCallback(() => {
    logout();
    setCurrentTab('home');
    setCurrentGameView(null);
  }, [logout]);

  // Optimized balance update for games
  const handleBalanceUpdate = useCallback((amount: number, type: 'add' | 'subtract' = 'subtract') => {
    updateLocalBalance(amount, type);
  }, [updateLocalBalance]);

  // Game routing optimization
  const renderGameView = useCallback(() => {
    if (!user) return null;

    const gameProps = {
      onBack: () => setCurrentGameView(null),
      user: { ...user, walletBalance: balance },
      onBalanceUpdate: () => handleBalanceUpdate(0, 'add') // Refresh balance
    };

    switch (currentGameView) {
      case 'wingo':
        return <OfficialWinGo {...gameProps} />;
      case 'aviator':
        return <AuthenticAviatorGame {...gameProps} />;
      case 'color-prediction':
        return <BG678ColorPrediction {...gameProps} />;
      case 'dice':
        return <OfficialDice {...gameProps} />;
      case 'k3':
        return <OfficialK3 {...gameProps} />;
      case '5d':
        return <Official5D {...gameProps} />;
      case 'trx-wingo':
        return <OfficialTRXWinGo {...gameProps} />;
      default:
        return null;
    }
  }, [currentGameView, user, balance, handleBalanceUpdate]);

  // Section routing optimization
  const renderSection = useCallback(() => {
    if (!user) return null;

    switch (currentTab) {
      case 'promotion':
        return <EnhancedPromotion onBack={() => setCurrentTab('home')} user={user} />;
      case 'activity':
        return <EnhancedActivity onBack={() => setCurrentTab('home')} user={user} />;
      case 'wallet':
        return <EnhancedWallet onBack={() => setCurrentTab('home')} user={user} onBalanceUpdate={() => handleBalanceUpdate(0, 'add')} />;
      case 'account':
        return (
          <div className="min-h-screen bg-white max-w-md mx-auto">
            <div className="p-4 bg-red-500 text-white">
              <button onClick={() => setCurrentTab('home')} className="mb-4">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold">Account</h1>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold">Profile</h3>
                  <p>Username: {user.username}</p>
                  <p>Phone: {user.phone}</p>
                  <p>Email: {user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-3 rounded-lg font-bold"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [currentTab, user, handleBalanceUpdate, handleLogout]);

  // Handle game selection optimization
  const handleGameClick = useCallback((gameId: string) => {
    setCurrentGameView(gameId);
  }, []);

  // Loading states
  if (authLoading || balanceLoading) {
    return (
      <div className="min-h-screen bg-white max-w-md mx-auto flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Show game view if selected
  const gameComponent = renderGameView();
  if (gameComponent) {
    return <ErrorBoundary>{gameComponent}</ErrorBoundary>;
  }

  // Show section view if selected
  const sectionComponent = renderSection();
  if (sectionComponent) {
    return <ErrorBoundary>{sectionComponent}</ErrorBoundary>;
  }

  // Show authentication if no user
  if (!user) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-white max-w-md mx-auto">
          <div className="p-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-red-500 mb-2">Perfect91Club</h1>
              <p className="text-gray-600">Premium Gaming Experience</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="text-center text-sm text-gray-500">
                Demo credentials: 9876543210 / demo123
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Main home view
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-red-500 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Perfect91Club</h1>
              <p className="text-sm opacity-90">Welcome, {user.username}</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Balance</div>
              <div className="text-lg font-bold">₹{balance}</div>
            </div>
          </div>
        </div>

        {/* Lottery Games */}
        <div className="px-4 py-6">
          <div className="flex items-center mb-4">
            <span className="text-red-500 text-lg mr-2">⭕</span>
            <span className="font-bold text-lg">Lottery</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {lotteryGames.map((game) => (
              <motion.div
                key={game.id}
                className="rounded-2xl p-6 text-white relative overflow-hidden cursor-pointer"
                style={{ background: game.bgColor }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGameClick(game.id)}
              >
                <div className="text-3xl mb-2">{game.icon}</div>
                <div className="font-bold text-xl whitespace-pre-line">{game.name}</div>
                <div className="text-sm opacity-90 mt-1">{game.description}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommended Games */}
        <div className="px-4 pb-6">
          <div className="flex items-center mb-4">
            <span className="text-yellow-500 text-lg mr-2">👑</span>
            <span className="font-bold text-lg">Recommended</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recommendedGames.map((game) => (
              <motion.div
                key={game.id}
                className="rounded-2xl p-6 text-white relative overflow-hidden cursor-pointer"
                style={{ background: game.bgColor }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGameClick(game.id)}
              >
                <div className="text-3xl mb-2">{game.icon}</div>
                <div className="font-bold text-xl whitespace-pre-line">{game.name}</div>
                <div className="text-sm opacity-90 mt-1">{game.description}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
          <div className="flex items-center justify-around py-2">
            {[
              { key: 'home', icon: Gamepad2, label: 'Home', color: 'text-red-500' },
              { key: 'promotion', icon: Gift, label: 'Promotion', color: 'text-gray-600' },
              { key: 'activity', icon: Trophy, label: 'Activity', color: 'text-gray-600' },
              { key: 'wallet', icon: Wallet, label: 'Wallet', color: 'text-gray-600' },
              { key: 'account', icon: User, label: 'Account', color: 'text-gray-600' }
            ].map(({ key, icon: Icon, label, color }) => (
              <button
                key={key}
                onClick={() => setCurrentTab(key as any)}
                className={`flex flex-col items-center py-2 px-4 ${
                  currentTab === key ? 'text-red-500' : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
    </ErrorBoundary>
  );
}