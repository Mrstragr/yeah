import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, User, Wallet, Gift, MoreHorizontal, Search,
  TrendingUp, Star, Clock, Trophy, Zap, Crown,
  Phone, Lock, Mail, Eye, EyeOff, ChevronRight,
  CreditCard, ArrowUpRight, ArrowDownLeft, 
  Plus, Minus, Play, RefreshCw, Target,
  Award, Calendar, Bell, Settings, LogOut
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  walletBalance: string;
  bonusBalance: string;
  level: number;
  avatar?: string;
}

interface Game {
  id: string;
  name: string;
  type: string;
  category: string;
  thumbnail: string;
  isHot?: boolean;
  isNew?: boolean;
  minBet: number;
  maxBet: number;
  rtp?: number;
}

const GAMES_DATA: Game[] = [
  // Lottery Games
  { id: 'wingo-1min', name: 'Win Go 1Min', type: 'lottery', category: 'lottery', thumbnail: '🎯', isHot: true, minBet: 10, maxBet: 10000, rtp: 97.5 },
  { id: 'wingo-3min', name: 'Win Go 3Min', type: 'lottery', category: 'lottery', thumbnail: '🎯', minBet: 10, maxBet: 10000, rtp: 97.5 },
  { id: 'wingo-5min', name: 'Win Go 5Min', type: 'lottery', category: 'lottery', thumbnail: '🎯', minBet: 10, maxBet: 10000, rtp: 97.5 },
  { id: 'wingo-10min', name: 'Win Go 10Min', type: 'lottery', category: 'lottery', thumbnail: '🎯', minBet: 10, maxBet: 10000, rtp: 97.5 },
  { id: 'k3-lotre', name: 'K3 Lotre', type: 'lottery', category: 'lottery', thumbnail: '🎲', isNew: true, minBet: 5, maxBet: 5000, rtp: 96.8 },
  { id: '5d-lotre', name: '5D Lotre', type: 'lottery', category: 'lottery', thumbnail: '🔢', minBet: 5, maxBet: 5000, rtp: 95.5 },
  
  // Casino Games
  { id: 'aviator', name: 'Aviator', type: 'crash', category: 'casino', thumbnail: '✈️', isHot: true, minBet: 10, maxBet: 50000, rtp: 97.0 },
  { id: 'mines', name: 'Mines', type: 'crash', category: 'casino', thumbnail: '💎', minBet: 10, maxBet: 10000, rtp: 97.0 },
  { id: 'dragon-tiger', name: 'Dragon Tiger', type: 'cards', category: 'casino', thumbnail: '🐉', minBet: 50, maxBet: 25000, rtp: 96.7 },
  { id: 'teen-patti', name: 'Teen Patti', type: 'cards', category: 'casino', thumbnail: '🃏', isHot: true, minBet: 50, maxBet: 50000, rtp: 97.2 },
  { id: 'andar-bahar', name: 'Andar Bahar', type: 'cards', category: 'casino', thumbnail: '🎴', minBet: 25, maxBet: 25000, rtp: 96.6 },
  { id: 'blackjack', name: 'Blackjack', type: 'cards', category: 'casino', thumbnail: '🖤', minBet: 100, maxBet: 50000, rtp: 99.4 },
  
  // Mini Games
  { id: 'limbo', name: 'Limbo', type: 'crash', category: 'mini', thumbnail: '🚀', minBet: 5, maxBet: 10000, rtp: 99.0 },
  { id: 'plinko', name: 'Plinko', type: 'arcade', category: 'mini', thumbnail: '⚪', minBet: 5, maxBet: 5000, rtp: 99.0 },
  { id: 'dice', name: 'Dice', type: 'dice', category: 'mini', thumbnail: '🎲', minBet: 10, maxBet: 10000, rtp: 98.0 },
  { id: 'wheel', name: 'Wheel', type: 'wheel', category: 'mini', thumbnail: '🎡', minBet: 10, maxBet: 10000, rtp: 96.5 }
];

export default function Perfect91ClubPlatform() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameCategory, setGameCategory] = useState('all');
  const [showPassword, setShowPassword] = useState(false);
  
  const [authData, setAuthData] = useState({
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  // Demo user data
  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
      setUser({
        id: 10,
        username: 'demo',
        email: 'demo@91club.com',
        phone: '9876543210',
        walletBalance: '10814.50',
        bonusBalance: '100.00',
        level: 5,
        avatar: '👤'
      });
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: authData.phone,
          password: authData.password
        })
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        setIsLoggedIn(true);
        setShowAuth(false);
        setAuthData({ phone: '', email: '', password: '', confirmPassword: '', otp: '' });
      } else {
        alert('Login failed: ' + data.error);
      }
    } catch (error) {
      alert('Login error: ' + error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsLoggedIn(false);
    setCurrentTab('home');
  };

  const filteredGames = gameCategory === 'all' 
    ? GAMES_DATA 
    : GAMES_DATA.filter(game => game.category === gameCategory);

  const playGame = (game: Game) => {
    if (!isLoggedIn) {
      setShowAuth(true);
      return;
    }
    setSelectedGame(game);
    setShowGameModal(true);
  };

  // Render Auth Modal
  const renderAuthModal = () => (
    <AnimatePresence>
      {showAuth && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-md border border-emerald-500/20"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <button 
                onClick={() => setShowAuth(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    placeholder="9876543210 (Demo)"
                    value={authData.phone}
                    onChange={(e) => setAuthData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={authData.email}
                      onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-300 text-sm mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="demo123 (Demo Password)"
                    value={authData.password}
                    onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-12 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={authData.confirmPassword}
                      onChange={(e) => setAuthData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {authMode === 'login' && (
                <div className="bg-emerald-900/30 border border-emerald-600/30 rounded-lg p-4 text-center">
                  <h4 className="text-emerald-400 font-semibold mb-2">Demo Account</h4>
                  <p className="text-gray-300 text-sm mb-2">Phone: 9876543210</p>
                  <p className="text-gray-300 text-sm mb-3">Password: demo123</p>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthData(prev => ({
                        ...prev,
                        phone: '9876543210',
                        password: 'demo123'
                      }));
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Fill Demo Details
                  </button>
                </div>
              )}

              <motion.button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  authMode === 'login' ? 'Login' : 'Register'
                )}
              </motion.button>

              <div className="text-center">
                <span className="text-gray-400">
                  {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                </span>
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-emerald-400 hover:text-emerald-300 ml-2 font-medium"
                >
                  {authMode === 'login' ? 'Register' : 'Login'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render Home Tab
  const renderHome = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Perfect91Club</h1>
            <p className="text-gray-400 text-sm">Premium Gaming Experience</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Search className="w-6 h-6 text-gray-400" />
          <Bell className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* Balance Card */}
      {isLoggedIn && user && (
        <motion.div 
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-emerald-100 text-sm">Total Balance</p>
              <p className="text-3xl font-bold">₹{user.walletBalance}</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-100 text-sm">Bonus</p>
              <p className="text-xl font-semibold">₹{user.bonusBalance}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <motion.button 
              onClick={() => setCurrentTab('wallet')}
              className="flex-1 bg-white/20 backdrop-blur-sm py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              <span>Deposit</span>
            </motion.button>
            <motion.button 
              onClick={() => setCurrentTab('wallet')}
              className="flex-1 bg-white/20 backdrop-blur-sm py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Minus className="w-5 h-5" />
              <span>Withdraw</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Game Categories */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {[
          { id: 'all', name: 'All', icon: '🎮' },
          { id: 'lottery', name: 'Lottery', icon: '🎯' },
          { id: 'casino', name: 'Casino', icon: '🎰' },
          { id: 'mini', name: 'Mini Games', icon: '🎲' }
        ].map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setGameCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              gameCategory === category.id
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </motion.button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredGames.map((game) => (
          <motion.div
            key={game.id}
            onClick={() => playGame(game)}
            className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-emerald-500/50 cursor-pointer relative overflow-hidden"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {game.isHot && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                HOT
              </div>
            )}
            {game.isNew && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                NEW
              </div>
            )}
            
            <div className="text-center">
              <div className="text-4xl mb-3">{game.thumbnail}</div>
              <h3 className="text-white font-semibold mb-1">{game.name}</h3>
              <p className="text-gray-400 text-sm mb-2">Min: ₹{game.minBet}</p>
              {game.rtp && (
                <div className="flex items-center justify-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-sm font-medium">{game.rtp}% RTP</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Render Wallet Tab
  const renderWallet = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Wallet</h2>
        <Settings className="w-6 h-6 text-gray-400" />
      </div>

      {isLoggedIn && user ? (
        <>
          {/* Balance Overview */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm mb-2">Available Balance</p>
              <p className="text-4xl font-bold text-white">₹{user.walletBalance}</p>
              <p className="text-emerald-400 text-sm mt-1">+ ₹{user.bonusBalance} Bonus</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-lg font-semibold flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowDownLeft className="w-5 h-5" />
                <span>Deposit</span>
              </motion.button>
              <motion.button 
                className="bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowUpRight className="w-5 h-5" />
                <span>Withdraw</span>
              </motion.button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Payment Methods</h3>
            <div className="space-y-3">
              {[
                { name: 'UPI', icon: '📱', available: true },
                { name: 'Paytm', icon: '💳', available: true },
                { name: 'PhonePe', icon: '📲', available: true },
                { name: 'Bank Transfer', icon: '🏦', available: true },
                { name: 'Credit/Debit Card', icon: '💳', available: true }
              ].map((method) => (
                <div key={method.name} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <span className="text-white font-medium">{method.name}</span>
                  </div>
                  <span className={`text-sm font-medium ${method.available ? 'text-emerald-400' : 'text-gray-400'}`}>
                    {method.available ? 'Available' : 'Coming Soon'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {[
                { type: 'deposit', amount: '₹1,000', time: '2 hours ago', status: 'success' },
                { type: 'withdraw', amount: '₹500', time: '1 day ago', status: 'pending' },
                { type: 'deposit', amount: '₹2,000', time: '3 days ago', status: 'success' }
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'deposit' ? 'bg-emerald-600' : 'bg-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? 
                        <ArrowDownLeft className="w-4 h-4 text-white" /> : 
                        <ArrowUpRight className="w-4 h-4 text-white" />
                      }
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.amount}</p>
                      <p className="text-gray-400 text-sm">{transaction.time}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
                    transaction.status === 'success' ? 'text-emerald-400' : 
                    transaction.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
          <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">Login Required</h3>
          <p className="text-gray-400 mb-4">Please login to access your wallet</p>
          <motion.button 
            onClick={() => setShowAuth(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Login Now
          </motion.button>
        </div>
      )}
    </div>
  );

  // Render Account Tab
  const renderAccount = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Account</h2>
        {isLoggedIn && (
          <motion.button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        )}
      </div>

      {isLoggedIn && user ? (
        <>
          {/* Profile Card */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-2xl">
                {user.avatar || '👤'}
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">{user.username}</h3>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-emerald-400 text-sm">Level {user.level} Player</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Total Balance</p>
                <p className="text-white font-bold text-lg">₹{user.walletBalance}</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Bonus Balance</p>
                <p className="text-emerald-400 font-bold text-lg">₹{user.bonusBalance}</p>
              </div>
            </div>
          </div>

          {/* Account Options */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Account Settings</h3>
            <div className="space-y-3">
              {[
                { icon: User, label: 'Edit Profile', action: () => {} },
                { icon: CreditCard, label: 'Payment Methods', action: () => setCurrentTab('wallet') },
                { icon: Trophy, label: 'Game History', action: () => {} },
                { icon: Award, label: 'Achievements', action: () => {} },
                { icon: Settings, label: 'Preferences', action: () => {} },
                { icon: Bell, label: 'Notifications', action: () => {} }
              ].map((option, index) => (
                <motion.button
                  key={index}
                  onClick={option.action}
                  className="w-full flex items-center justify-between p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center space-x-3">
                    <option.icon className="w-5 h-5 text-emerald-400" />
                    <span className="text-white">{option.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </motion.button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">Login Required</h3>
          <p className="text-gray-400 mb-4">Please login to access your account</p>
          <motion.button 
            onClick={() => setShowAuth(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Login Now
          </motion.button>
        </div>
      )}
    </div>
  );

  // Bottom Navigation
  const bottomNavItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'promotions', icon: Gift, label: 'Promotions' },
    { id: 'account', icon: User, label: 'Account' },
    { id: 'more', icon: MoreHorizontal, label: 'More' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-md mx-auto bg-slate-900 min-h-screen relative">
        {/* Main Content */}
        <div className="pb-20 p-4">
          {currentTab === 'home' && renderHome()}
          {currentTab === 'wallet' && renderWallet()}
          {currentTab === 'promotions' && (
            <div className="text-center text-white py-20">
              <Gift className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
              <h2 className="text-2xl font-bold mb-2">Promotions</h2>
              <p className="text-gray-400">Amazing offers coming soon!</p>
            </div>
          )}
          {currentTab === 'account' && renderAccount()}
          {currentTab === 'more' && (
            <div className="text-center text-white py-20">
              <MoreHorizontal className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
              <h2 className="text-2xl font-bold mb-2">More Options</h2>
              <p className="text-gray-400">Additional features coming soon!</p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-slate-800 border-t border-slate-700 px-4 py-2">
          <div className="flex items-center justify-around">
            {bottomNavItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                  currentTab === item.id 
                    ? 'text-emerald-400 bg-emerald-900/30' 
                    : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Auth Modal */}
        {renderAuthModal()}

        {/* Login Prompt */}
        {!isLoggedIn && (
          <motion.div 
            className="fixed top-4 right-4 z-40"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.button
              onClick={() => setShowAuth(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}