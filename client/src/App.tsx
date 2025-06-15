import { useState } from 'react';
import { 
  Home, 
  Activity, 
  Gift, 
  Wallet, 
  User, 
  Bell, 
  ChevronRight,
  ArrowLeft,
  Copy,
  MoreHorizontal
} from 'lucide-react';
import { GameModal } from './components/GameModal';
import { WalletModal } from './components/WalletModal';
import { WinGoGame } from './components/games/WinGoGame';
import { K3LotreGame } from './components/games/K3LotreGame';
import { AviatorGame } from './components/games/AviatorGame';
import { MinesGame } from './components/games/MinesGame';
import { DiceGame } from './components/games/DiceGame';
import { DragonTigerGame } from './components/games/DragonTigerGame';
import { LiveFeatures } from './components/LiveFeatures';
import { RealTimeUpdates } from './components/RealTimeUpdates';
import { LoginInterface } from './components/LoginInterface';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [walletBalance, setWalletBalance] = useState(0.39);
  const [selectedGame, setSelectedGame] = useState<{id: string, name: string, type: 'lottery' | 'mini' | 'recommended' | 'slot'} | null>(null);
  const [walletModal, setWalletModal] = useState<{type: 'deposit' | 'withdraw', isOpen: boolean}>({type: 'deposit', isOpen: false});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<{phone?: string; email?: string; username?: string} | null>(null);

  const handleTransaction = (amount: number, type: 'deposit' | 'withdraw') => {
    if (type === 'deposit') {
      setWalletBalance(prev => prev + amount);
    } else {
      setWalletBalance(prev => prev - amount);
    }
  };

  const handleLogin = async (credentials: { phone?: string; email?: string; password: string; rememberMe: boolean }) => {
    try {
      const { apiService } = await import('./lib/api');
      const result = await apiService.login(credentials);
      
      setUser({
        phone: result.user.phone,
        email: result.user.email,
        username: result.user.username
      });
      setIsAuthenticated(true);
      setShowLogin(false);
      setWalletBalance(parseFloat(result.user.walletBalance));
    } catch (error: any) {
      console.error('Login failed:', error.message);
      // Show error to user - for now just log it
    }
  };

  const handleLogout = async () => {
    try {
      const { apiService } = await import('./lib/api');
      apiService.clearToken();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setIsAuthenticated(false);
    setUser(null);
    setWalletBalance(0);
    setActiveTab('home');
  };

  // Show landing page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-400 to-purple-500">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative px-6 py-12 text-center">
              <div className="flex items-center justify-center mb-8">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3 shadow-2xl">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">9</span>
                  </div>
                </div>
                <span className="text-4xl font-bold text-white tracking-wider">91CLUB</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                Experience the Ultimate<br />Gaming Platform
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Join millions of players worldwide in<br />
                the most exciting gaming experience
              </p>
              <button
                onClick={() => setShowLogin(true)}
                className="bg-white text-red-500 px-12 py-4 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 mb-8"
              >
                Get Started
              </button>
              <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto text-center">
                <div className="text-white">
                  <div className="text-2xl font-bold">2.5M+</div>
                  <div className="text-sm opacity-90">Active Players</div>
                </div>
                <div className="text-white">
                  <div className="text-2xl font-bold">₹50L+</div>
                  <div className="text-sm opacity-90">Daily Payouts</div>
                </div>
                <div className="text-white">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm opacity-90">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <LoginInterface
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      </>
    );
  }

  const HomeScreen = () => (
    <div className="app-container pb-20 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      {/* Enhanced Header Section */}
      <div className="header-section bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="header-top relative z-10 flex items-center justify-between p-6 text-white">
          <div className="logo-text text-3xl font-black tracking-wider flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-red-500 text-xl font-bold">91</span>
            </div>
            91CLUB
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="notification-icon w-6 h-6 text-white hover:text-yellow-300 transition-colors cursor-pointer" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-30 transition-all">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        
        {/* Info Banner - Exact Match */}
        <div className="info-banner">
          <div className="info-content">
            <div className="info-text-line">Only deposit funds through the official 91CLUB website and you can</div>
            <div className="info-text-line">check from our alternative link at 91club.com the page are similar in look</div>
          </div>
          <div className="info-logo">91</div>
        </div>

        {/* Enhanced Balance Card */}
        <div className="balance-card bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-2xl p-6 shadow-2xl border border-yellow-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="balance-label text-yellow-900 font-medium text-sm opacity-90">Wallet Balance</div>
              <div className="balance-amount text-2xl font-bold text-yellow-900">₹{walletBalance.toFixed(2)}</div>
              <div className="text-yellow-800 text-xs mt-1">Available for play</div>
            </div>
            <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-yellow-800" />
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="action-buttons flex gap-4 px-4 mt-4">
          <button 
            className="withdraw-btn flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            onClick={() => setWalletModal({type: 'withdraw', isOpen: true})}
          >
            <ArrowLeft className="w-5 h-5" />
            Withdraw
          </button>
          <button 
            className="deposit-btn flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            onClick={() => setWalletModal({type: 'deposit', isOpen: true})}
          >
            <Gift className="w-5 h-5" />
            Deposit
          </button>
        </div>

        {/* Enhanced Feature Cards */}
        <div className="feature-cards flex gap-4 px-4 mt-6">
          <div className="wheel-card flex-1 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute top-2 right-2 text-2xl opacity-80">🎡</div>
            <div className="feature-title text-lg font-bold mb-1">Wheel</div>
            <div className="feature-subtitle text-sm opacity-90">of Fortune</div>
            <div className="text-xs mt-2 opacity-75">Spin to win prizes</div>
          </div>
          <div className="vip-card flex-1 bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute top-2 right-2 text-2xl opacity-80">👑</div>
            <div className="feature-title text-lg font-bold mb-1">VIP</div>
            <div className="feature-subtitle text-sm opacity-90">Privileges</div>
            <div className="text-xs mt-2 opacity-75">Exclusive benefits</div>
          </div>
        </div>

        {/* Enhanced Promotional Banner */}
        <div className="promo-banner-section px-4 mt-6">
          <div className="main-promo-banner bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="promo-content relative z-10 flex items-center justify-between">
              <div className="promo-text text-white">
                <div className="promo-title text-2xl font-bold mb-2">🎉 NEW MEMBER BONUS</div>
                <div className="promo-subtitle text-lg font-semibold mb-1">Get ₹5000 bonus on first deposit</div>
                <div className="promo-details text-sm opacity-90">Valid until 31st Dec 2024</div>
              </div>
              <button className="promo-btn bg-white text-red-600 px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                CLAIM NOW
              </button>
            </div>
          </div>
          
          <div className="secondary-promos flex gap-2 mt-4">
            <div className="mini-promo flex-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl p-4 text-white text-center shadow-lg">
              <span className="mini-promo-icon text-2xl block mb-1">🔥</span>
              <span className="mini-promo-text text-sm font-semibold">Daily Cashback 10%</span>
            </div>
            <div className="mini-promo flex-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl p-4 text-white text-center shadow-lg">
              <span className="mini-promo-icon text-2xl block mb-1">⚡</span>
              <span className="mini-promo-text text-sm font-semibold">Fast Withdrawal</span>
            </div>
            <div className="mini-promo flex-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-xl p-4 text-white text-center shadow-lg">
              <span className="mini-promo-icon text-2xl block mb-1">🎯</span>
              <span className="mini-promo-text text-sm font-semibold">Win Rate 98.5%</span>
            </div>
          </div>
        </div>

        {/* Enhanced Real-time Statistics */}
        <div className="stats-section px-4 mt-6">
          <div className="stats-header bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 mb-4 flex items-center justify-between">
            <span className="stats-title text-white font-bold flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              LIVE STATS
            </span>
            <span className="online-count text-green-400 font-semibold text-sm">1,247 playing now</span>
          </div>
          <div className="stats-grid grid grid-cols-2 gap-4">
            <div className="stat-item bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white shadow-lg">
              <div className="stat-value text-2xl font-bold">₹2,45,680</div>
              <div className="stat-label text-sm opacity-90">Today's Jackpot</div>
            </div>
            <div className="stat-item bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white shadow-lg">
              <div className="stat-value text-2xl font-bold">98.5%</div>
              <div className="stat-label text-sm opacity-90">Win Rate</div>
            </div>
            <div className="stat-item bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white shadow-lg">
              <div className="stat-value text-2xl font-bold">₹89,320</div>
              <div className="stat-label text-sm opacity-90">Last Winner</div>
            </div>
            <div className="stat-item bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
              <div className="stat-value text-2xl font-bold">847</div>
              <div className="stat-label text-sm opacity-90">Winners Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Category Navigation */}
      <div className="category-section bg-white shadow-lg rounded-t-3xl mt-6 px-4 py-6">
        <div className="category-list flex justify-between items-center">
          {[
            { name: 'Lobby', active: true, icon: '🏠', color: 'from-blue-500 to-cyan-500' },
            { name: 'PK', active: false, icon: '⚔️', color: 'from-red-500 to-pink-500' },
            { name: 'Mines', active: false, icon: '💎', color: 'from-purple-500 to-indigo-500' },
            { name: 'Original', active: false, icon: '🎯', color: 'from-green-500 to-emerald-500' },
            { name: 'Fishing', active: false, icon: '🎣', color: 'from-teal-500 to-cyan-500' },
            { name: 'Lottery', active: false, icon: '🎰', color: 'from-orange-500 to-yellow-500' }
          ].map((cat) => (
            <div key={cat.name} className="category-item flex flex-col items-center cursor-pointer group">
              <div className={`category-circle w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-all duration-300 group-hover:scale-110 mb-2 ${
                cat.active 
                  ? `bg-gradient-to-br ${cat.color} text-white transform scale-110` 
                  : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
              }`}>
                {cat.icon}
              </div>
              <div className={`category-name text-xs font-medium transition-colors ${
                cat.active ? 'text-gray-800' : 'text-gray-500 group-hover:text-gray-700'
              }`}>
                {cat.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Content - Exact Match */}
      <div className="content-section">
        {/* Quick Stats Bar */}
        <div className="quick-stats-bar">
          <div className="quick-stat">
            <div className="quick-stat-icon">🎯</div>
            <div className="quick-stat-info">
              <div className="quick-stat-value">2,847</div>
              <div className="quick-stat-label">Playing Now</div>
            </div>
          </div>
          <div className="quick-stat">
            <div className="quick-stat-icon">💰</div>
            <div className="quick-stat-info">
              <div className="quick-stat-value">₹1.2M</div>
              <div className="quick-stat-label">Today's Wins</div>
            </div>
          </div>
          <div className="quick-stat">
            <div className="quick-stat-icon">⚡</div>
            <div className="quick-stat-info">
              <div className="quick-stat-value">98.7%</div>
              <div className="quick-stat-label">Win Rate</div>
            </div>
          </div>
        </div>

        {/* Enhanced Lottery Section */}
        <div className="game-section bg-white px-4 py-6">
          <div className="section-header flex items-center justify-between mb-6">
            <div className="section-left flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <span className="section-title text-xl font-bold text-gray-800">Lottery Games</span>
              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-semibold">HOT</span>
            </div>
            <div className="section-right flex items-center gap-2 text-gray-500 cursor-pointer hover:text-gray-700">
              <span className="detail-text text-sm font-medium">View All</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          
          <div className="lottery-games grid grid-cols-2 gap-4">
            <div 
              className="lottery-item bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedGame({id: 'wingo', name: 'WIN GO', type: 'lottery'})}
            >
              <div className="absolute top-2 right-2 text-3xl opacity-30">🎯</div>
              <div className="lottery-title text-lg font-bold mb-1">WIN GO</div>
              <div className="lottery-number text-3xl font-black">1</div>
              <div className="text-xs opacity-80 mt-2">Next: 00:45</div>
            </div>
            <div 
              className="lottery-item bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedGame({id: 'k3', name: 'K3 Lotre', type: 'lottery'})}
            >
              <div className="absolute top-2 right-2 text-3xl opacity-30">🎲</div>
              <div className="lottery-title text-lg font-bold">K3</div>
              <div className="lottery-subtitle text-sm opacity-90">Lottery</div>
              <div className="text-xs opacity-80 mt-2">Live Now</div>
            </div>
            <div 
              className="lottery-item bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedGame({id: '5d', name: '5D Lotre', type: 'lottery'})}
            >
              <div className="absolute top-2 right-2 text-3xl opacity-30">🎰</div>
              <div className="lottery-title text-lg font-bold">5D</div>
              <div className="lottery-subtitle text-sm opacity-90">Lottery</div>
              <div className="text-xs opacity-80 mt-2">Next: 01:15</div>
            </div>
            <div 
              className="lottery-item bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedGame({id: 'trx', name: 'TRX WINGO', type: 'lottery'})}
            >
              <div className="absolute top-2 right-2 text-3xl opacity-30">⚡</div>
              <div className="lottery-title-small text-sm font-bold">TRX WINGO</div>
              <div className="lottery-subtitle-small text-xs opacity-90">Crypto Win</div>
              <div className="text-xs opacity-80 mt-2">Fast Mode</div>
            </div>
          </div>
        </div>

        {/* Enhanced MOTO RACING Banner */}
        <div className="moto-banner bg-gradient-to-r from-red-600 to-orange-500 mx-4 my-6 p-4 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="moto-text relative z-10 text-white text-2xl font-black text-center flex items-center justify-center gap-3">
            🏁 MOTO RACING 🏁
          </div>
        </div>

        {/* Enhanced Mini Games */}
        <div className="game-section bg-white px-4 py-6">
          <div className="section-header flex items-center justify-between mb-6">
            <div className="section-left flex items-center gap-3">
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="section-title text-xl font-bold text-gray-800">Mini Games</span>
              <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-semibold">NEW</span>
            </div>
            <div className="section-right flex items-center gap-2 text-gray-500 cursor-pointer hover:text-gray-700">
              <span className="detail-text text-sm font-medium">View All</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          
          <div className="mini-games flex gap-4">
            <div 
              className="mini-item flex-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedGame({id: 'dragontiger', name: 'DRAGON TIGER', type: 'mini'})}
            >
              <div className="absolute top-2 right-2 text-3xl opacity-30">🐲</div>
              <div className="mini-title-two text-sm font-bold">DRAGON</div>
              <div className="mini-title-two text-sm font-bold">TIGER</div>
              <div className="text-xs opacity-80 mt-3">Classic Card Battle</div>
            </div>
            <div 
              className="mini-item flex-1 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedGame({id: 'goal', name: 'GOAL', type: 'mini'})}
            >
              <div className="absolute top-2 right-2 text-3xl opacity-30">⚽</div>
              <div className="mini-title text-lg font-bold">GOAL</div>
              <div className="text-xs opacity-80 mt-3">Football Prediction</div>
            </div>
            <div 
              className="mini-item flex-1 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedGame({id: 'dice', name: 'DICE', type: 'mini'})}
            >
              <div className="absolute top-2 right-2 text-3xl opacity-30">🎲</div>
              <div className="mini-title text-lg font-bold">DICE</div>
              <div className="text-xs opacity-80 mt-3">Lucky Roll</div>
            </div>
          </div>
        </div>

        {/* Enhanced Recommended Games */}
        <div className="game-section bg-white px-4 py-6">
          <div className="section-header flex items-center justify-between mb-6">
            <div className="section-left flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="section-title text-xl font-bold text-gray-800">Recommended Games</span>
              <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full font-semibold">POPULAR</span>
            </div>
            <div className="section-right flex items-center gap-2 text-gray-500 cursor-pointer hover:text-gray-700">
              <span className="detail-text text-sm font-medium">View All</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          
          <div className="recommended-games flex gap-4">
            <div 
              className="rec-item flex-1 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedGame({id: 'aviator', name: 'AVIATOR', type: 'recommended'})}
            >
              <div className="absolute top-2 right-2 text-3xl opacity-30">✈️</div>
              <div className="rec-title text-lg font-bold mb-1">AVIATOR</div>
              <div className="rec-subtitle text-sm opacity-90 font-semibold">x500+ Multiplier</div>
              <div className="text-xs opacity-80 mt-3">Crash Game</div>
            </div>
            <div 
              className="rec-item flex-1 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedGame({id: 'mines', name: 'MINES', type: 'recommended'})}
            >
              <div className="absolute top-2 right-2 text-3xl opacity-30">💎</div>
              <div className="rec-title text-lg font-bold mb-1">MINES</div>
              <div className="rec-subtitle text-sm opacity-90">Strategic Play</div>
              <div className="text-xs opacity-80 mt-3">Risk & Reward</div>
            </div>
            <div 
              className="rec-item flex-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedGame({id: 'goal2', name: 'GOAL', type: 'recommended'})}
            >
              <div className="absolute top-2 right-2 text-3xl opacity-30">⚽</div>
              <div className="rec-title text-lg font-bold mb-1">GOAL</div>
              <div className="rec-subtitle text-sm opacity-90">Sports Betting</div>
              <div className="text-xs opacity-80 mt-3">Live Scores</div>
            </div>
          </div>
        </div>

        {/* Slots */}
        <div className="game-section">
          <div className="section-header">
            <div className="section-left">
              <div className="orange-dot"></div>
              <span className="section-title">Slots</span>
            </div>
            <div className="section-right">
              <span className="detail-text">Detail</span>
              <ChevronRight className="chevron" />
            </div>
          </div>
          
          <div className="slots-games">
            <div 
              className="slot-item"
              onClick={() => setSelectedGame({id: 'jili', name: 'JILI SLOTS', type: 'slot'})}
            >
              <div className="slot-preview purple-slot">JILI</div>
            </div>
            <div 
              className="slot-item"
              onClick={() => setSelectedGame({id: 'jdb', name: 'JDB SLOTS', type: 'slot'})}
            >
              <div className="slot-preview blue-slot">JDB</div>
            </div>
            <div 
              className="slot-item"
              onClick={() => setSelectedGame({id: 'cq9', name: 'CQ9 SLOTS', type: 'slot'})}
            >
              <div className="slot-preview orange-slot">CQ9</div>
            </div>
          </div>
        </div>

        {/* Rummy */}
        <div className="game-section">
          <div className="section-header">
            <div className="section-left">
              <div className="red-dot"></div>
              <span className="section-title">Rummy</span>
            </div>
            <div className="section-right">
              <span className="detail-text">Detail</span>
              <ChevronRight className="chevron" />
            </div>
          </div>
          
          <div className="rummy-game">
            <div 
              className="rummy-card"
              onClick={() => setSelectedGame({id: 'rummy', name: 'RUMMY 505', type: 'slot'})}
            >
              505
            </div>
          </div>
        </div>

        {/* Hot Games & Winners Section */}
        <div className="hot-section">
          <div className="section-header">
            <div className="section-left">
              <div className="fire-icon">🔥</div>
              <span className="section-title">HOT GAMES</span>
            </div>
            <div className="section-right">
              <span className="view-all">View All</span>
              <ChevronRight className="chevron" />
            </div>
          </div>
          
          <div className="hot-games-grid">
            <div 
              className="hot-game-card wingo-hot"
              onClick={() => setSelectedGame({id: 'wingo', name: 'WIN GO', type: 'lottery'})}
            >
              <div className="hot-badge">HOT</div>
              <div className="hot-game-title">WIN GO</div>
              <div className="hot-game-subtitle">Next: 2:15</div>
              <div className="hot-game-multiplier">x98.5</div>
            </div>
            
            <div 
              className="hot-game-card aviator-hot"
              onClick={() => setSelectedGame({id: 'aviator', name: 'Aviator', type: 'mini'})}
            >
              <div className="hot-badge">LIVE</div>
              <div className="hot-game-title">Aviator</div>
              <div className="hot-game-subtitle">Flying Now</div>
              <div className="hot-game-multiplier">x15.64</div>
            </div>
            
            <div 
              className="hot-game-card mines-hot"
              onClick={() => setSelectedGame({id: 'mines', name: 'Mines', type: 'mini'})}
            >
              <div className="hot-badge">WIN</div>
              <div className="hot-game-title">Mines</div>
              <div className="hot-game-subtitle">Safe Spots</div>
              <div className="hot-game-multiplier">x45.2</div>
            </div>
          </div>
        </div>

        {/* Winner Announcements */}
        <div className="winners-section">
          <div className="winner-banner">
            <div className="winner-icon">🏆</div>
            <div className="winner-text">
              <div className="winner-name">ProGamer98 won ₹89,320</div>
              <div className="winner-game">on Dragon Tiger just now!</div>
            </div>
            <div className="winner-amount">+₹89,320</div>
          </div>
        </div>

        {/* Live Features Section */}
        <div className="content-section">
          <LiveFeatures walletBalance={walletBalance} />
        </div>

        {/* Real-time Updates Component */}
        <RealTimeUpdates onWalletUpdate={(bonus) => setWalletBalance(prev => prev + bonus)} />
      </div>
    </div>
  );

  const ActivityScreen = () => (
    <div className="app-container pb-20 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <div className="header-section">
        <div className="header-top">
          <div className="logo-text">91CLUB</div>
        </div>
        <div className="page-title">Activity</div>
        <div className="page-description">
          <div>Please remember to follow the event page</div>
          <div>We will launch new feedback activities from time to time!</div>
        </div>
      </div>

      <div className="content-section">
        <div className="activity-grid-top">
          {[
            { name: 'Activity Award', icon: '🏆', bg: 'orange-bg' },
            { name: 'Invitation bonus', icon: '👥', bg: 'blue-bg' },
            { name: 'Betting mobile', icon: '📱', bg: 'yellow-bg' },
            { name: 'Super Jackpot', icon: '💰', bg: 'green-bg' }
          ].map((item) => (
            <div key={item.name} className="activity-item">
              <div className={`activity-icon ${item.bg}`}>{item.icon}</div>
              <div className="activity-label">{item.name}</div>
            </div>
          ))}
        </div>

        <div className="activity-center">
          <div className="activity-icon purple-bg">🎁</div>
          <div className="activity-label">First gift</div>
        </div>

        <div className="activity-banners">
          <div className="banner red-banner">
            <div className="banner-title">Gifts</div>
            <div className="banner-desc">Enter the redemption code to receive gift rewards</div>
          </div>
          <div className="banner orange-banner">
            <div className="banner-title">Attendance bonus</div>
            <div className="banner-desc">The more consecutive days you sign in, the higher the reward will be</div>
          </div>
          <div className="banner white-banner">
            <div className="banner-title red-text">Benefits of Using ARWALLET</div>
          </div>
          <div className="banner yellow-banner">
            <div className="banner-title">New Member First Deposit Bonus</div>
          </div>
        </div>
      </div>
    </div>
  );

  const WalletScreen = () => (
    <div className="app-container pb-20 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <div className="header-section">
        <div className="header-top">
          <ArrowLeft className="back-icon" />
          <div className="page-title">Wallet</div>
        </div>
        
        <div className="wallet-info">
          <div className="wallet-icon-container">
            <Wallet className="wallet-icon" />
          </div>
          <div className="wallet-balance">₹{walletBalance.toFixed(2)}</div>
          <div className="wallet-label">Total balance</div>
          
          <div className="wallet-stats">
            <div className="stat-item">
              <div className="stat-number">156816</div>
              <div className="stat-label">Total deposit</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">167805</div>
              <div className="stat-label">Total withdrawal</div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="wallet-transfer-card">
          <div className="transfer-info">
            <div className="main-wallet">
              <div className="transfer-percent">0%</div>
              <div className="transfer-amount">₹0.00</div>
              <div className="transfer-label">Main wallet</div>
            </div>
            <div className="circle-progress">
              <div className="progress-circle">100%</div>
            </div>
            <div className="third-party-wallet">
              <div className="transfer-amount red">₹0.39</div>
              <div className="transfer-label">3rd party wallet</div>
            </div>
          </div>
          <button className="transfer-btn">Main wallet transfer</button>
        </div>

        <div className="wallet-actions">
          {[
            { name: 'Deposit', icon: '💳' },
            { name: 'Withdraw', icon: '💰' },
            { name: 'Deposit history', icon: '📊' },
            { name: 'Withdrawal history', icon: '📈' }
          ].map((action) => (
            <div key={action.name} className="wallet-action">
              <div className="action-icon">{action.icon}</div>
              <div className="action-name">{action.name}</div>
            </div>
          ))}
        </div>

        <div className="wallet-games">
          <button className="game-btn active">
            <div className="game-number">6.49</div>
            <div className="game-name">All Game</div>
          </button>
          <button className="game-btn">
            <div className="game-number">6.38</div>
            <div className="game-name">Evolution</div>
          </button>
        </div>
      </div>
    </div>
  );

  const AccountScreen = () => (
    <div className="app-container pb-20 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <div className="header-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <User className="avatar-icon" />
          </div>
          <div className="profile-info">
            <div className="profile-name">ANURAG KUMAR</div>
            <div className="profile-copy">🎯 Copy</div>
            <div className="profile-uid">UID: 396313</div>
            <div className="profile-login">Last login: 2025-06-13 19:34:40</div>
          </div>
        </div>

        <div className="balance-card">
          <div className="balance-label">Total balance</div>
          <div className="balance-amount">₹{walletBalance.toFixed(2)}</div>
        </div>
      </div>

      <div className="content-section">
        <div className="account-actions">
          {[
            { name: 'ARWallet', icon: '💳' },
            { name: 'Deposit', icon: '💰' },
            { name: 'Withdraw', icon: '📤' },
            { name: 'VIP', icon: '👑' }
          ].map((action) => (
            <div key={action.name} className="account-action">
              <div className="action-icon">{action.icon}</div>
              <div className="action-name">{action.name}</div>
            </div>
          ))}
        </div>

        <div className="menu-list">
          {[
            { icon: '📊', title: 'Game History', subtitle: 'My game history' },
            { icon: '💳', title: 'Transaction', subtitle: 'My transaction history' },
            { icon: '💰', title: 'Deposit', subtitle: 'My deposit history' },
            { icon: '📤', title: 'Withdraw', subtitle: 'My withdraw history' },
            { icon: '🔔', title: 'Notification', badge: '33' },
            { icon: '🎁', title: 'Gifts' },
            { icon: '📈', title: 'Game statistics' },
            { icon: '🌐', title: 'Language', value: 'English' }
          ].map((item, index) => (
            <div key={index} className="menu-item">
              <div className="menu-left">
                <div className="menu-icon">{item.icon}</div>
                <div className="menu-text">
                  <div className="menu-title">{item.title}</div>
                  {item.subtitle && <div className="menu-subtitle">{item.subtitle}</div>}
                </div>
              </div>
              <div className="menu-right">
                {item.badge && <div className="menu-badge">{item.badge}</div>}
                {item.value && <div className="menu-value">{item.value}</div>}
                <ChevronRight className="menu-chevron" />
              </div>
            </div>
          ))}
        </div>

        <div className="service-section">
          <div className="service-title">Service center</div>
          <div className="service-grid">
            {[
              { name: 'Settings', icon: '⚙️' },
              { name: 'Feedback', icon: '💬' },
              { name: 'Announcement', icon: '📢' },
              { name: 'Customer Service', icon: '🎧' },
              { name: "Beginner's Guide", icon: '📖' },
              { name: 'About us', icon: '👥' }
            ].map((service) => (
              <div key={service.name} className="service-item">
                <div className="service-icon">{service.icon}</div>
                <div className="service-name">{service.name}</div>
              </div>
            ))}
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  const PromotionScreen = () => (
    <div className="app-container pb-20 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <div className="header-section">
        <div className="header-top">
          <div className="logo-text">Agency</div>
          <div className="agency-icon">🎯</div>
        </div>
      </div>

      <div className="content-section">
        <div className="commission-card">
          <div className="commission-amount">0</div>
          <div className="commission-label">Yesterday's total commission</div>
          <div className="commission-subtitle">Upgrade the level to increase commission percentage</div>
          
          <div className="commission-actions">
            <div className="commission-item">Direct subordinates</div>
            <div className="commission-item">Team subordinates</div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">number of register</div>
            <div className="stat-number">0</div>
            <div className="stat-label">Deposit Number</div>
            <div className="stat-title">Deposit amount</div>
            <div className="stat-number">0</div>
            <div className="stat-label">Number of people making first deposit</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">number of register</div>
            <div className="stat-number">0</div>
            <div className="stat-label">Deposit Number</div>
            <div className="stat-title">Deposit amount</div>
            <div className="stat-number">0</div>
            <div className="stat-label">Number of people making first deposit</div>
          </div>
        </div>

        <button className="invitation-link-btn">INVITATION LINK</button>

        <div className="promotion-menu">
          {[
            { icon: '🏆', title: 'Partner rewards' },
            { icon: '📋', title: 'Copy invitation code', code: '3654752684217' },
            { icon: '👥', title: 'Subordinate data' },
            { icon: '💰', title: 'Commission detail' },
            { icon: '📋', title: 'Invitation rules' },
            { icon: '🎧', title: 'Agent line customer service' }
          ].map((item, index) => (
            <div key={index} className="promotion-item">
              <div className="promotion-left">
                <div className="promotion-icon">{item.icon}</div>
                <div className="promotion-title">{item.title}</div>
              </div>
              <div className="promotion-right">
                {item.code && (
                  <>
                    <div className="invitation-code">{item.code}</div>
                    <Copy className="copy-icon" />
                  </>
                )}
                <ChevronRight className="promotion-chevron" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'activity': return <ActivityScreen />;
      case 'promotion': return <PromotionScreen />;
      case 'wallet': return <WalletScreen />;
      case 'account': return <AccountScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="app-wrapper">
      {renderScreen()}

      {/* Bottom Navigation - Exact Match */}
      {/* Enhanced Bottom Navigation */}
      <div className="bottom-navigation fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 shadow-2xl z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {[
            { id: 'home', icon: Home, label: 'Home', color: 'text-blue-500' },
            { id: 'activity', icon: Activity, label: 'Activity', color: 'text-green-500' },
            { id: 'promotion', icon: Gift, label: 'Promotion', color: 'text-purple-500' },
            { id: 'wallet', icon: Wallet, label: 'Wallet', color: 'text-yellow-500' },
            { id: 'account', icon: User, label: 'Account', color: 'text-red-500' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 ${
                activeTab === tab.id 
                  ? `bg-gradient-to-t from-gray-100 to-white shadow-lg transform scale-110 ${tab.color}` 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="nav-icon-wrapper relative">
                <tab.icon className={`nav-icon w-6 h-6 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                {activeTab === tab.id && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                )}
              </div>
              <span className={`nav-label text-xs font-medium mt-1 ${
                activeTab === tab.id ? 'font-bold' : ''
              }`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Comprehensive Game Modals */}
      {selectedGame?.id === 'wingo' && (
        <WinGoGame
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          walletBalance={walletBalance}
          onTransaction={handleTransaction}
        />
      )}
      
      {selectedGame?.id === 'k3' && (
        <K3LotreGame
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          walletBalance={walletBalance}
          onTransaction={handleTransaction}
        />
      )}
      
      {selectedGame?.id === 'aviator' && (
        <AviatorGame
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          walletBalance={walletBalance}
          onTransaction={handleTransaction}
        />
      )}
      
      {selectedGame?.id === 'mines' && (
        <MinesGame
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          walletBalance={walletBalance}
          onTransaction={handleTransaction}
        />
      )}
      
      {selectedGame?.id === 'dice' && (
        <DiceGame
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          walletBalance={walletBalance}
          onTransaction={handleTransaction}
        />
      )}
      
      {selectedGame?.id === 'dragon' && (
        <DragonTigerGame
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          walletBalance={walletBalance}
          onTransaction={handleTransaction}
        />
      )}
      
      {/* Fallback for slot games and other simple games */}
      {selectedGame && !['wingo', 'k3', 'aviator', 'mines', 'dice', 'dragon'].includes(selectedGame.id) && (
        <GameModal
          game={selectedGame}
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}

      {/* Wallet Modal */}
      <WalletModal
        type={walletModal.type}
        isOpen={walletModal.isOpen}
        onClose={() => setWalletModal({...walletModal, isOpen: false})}
        currentBalance={walletBalance}
        onTransaction={handleTransaction}
      />

      {/* Login Interface */}
      <LoginInterface
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;