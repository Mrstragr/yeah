import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Wallet, Trophy, Gift, 
  Phone, Lock, Eye, EyeOff,
  Plus, Minus, Play, Home,
  Settings, LogOut, Bell
} from 'lucide-react';

// Copied from successful Indian gaming apps - exact patterns
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
  icon: string;
  category: string;
  minBet: number;
  maxBet: number;
  isLive: boolean;
  players: number;
}

// Market-standard games layout copied from MPL/Teen Patti Gold
const MARKET_GAMES: Game[] = [
  { id: 'teen-patti', name: 'Teen Patti', icon: '🃏', category: 'Card', minBet: 10, maxBet: 10000, isLive: true, players: 1247 },
  { id: 'andar-bahar', name: 'Andar Bahar', icon: '🎴', category: 'Card', minBet: 5, maxBet: 5000, isLive: true, players: 892 },
  { id: 'dragon-tiger', name: 'Dragon Tiger', icon: '🐉', category: 'Card', minBet: 10, maxBet: 8000, isLive: true, players: 634 },
  { id: 'rummy', name: 'Rummy', icon: '🎯', category: 'Card', minBet: 20, maxBet: 15000, isLive: true, players: 2156 },
  { id: 'aviator', name: 'Aviator', icon: '✈️', category: 'Crash', minBet: 1, maxBet: 50000, isLive: true, players: 3421 },
  { id: 'mines', name: 'Mines', icon: '💎', category: 'Strategy', minBet: 5, maxBet: 25000, isLive: true, players: 567 },
  { id: 'baccarat', name: 'Baccarat', icon: '🎲', category: 'Card', minBet: 50, maxBet: 100000, isLive: true, players: 789 },
  { id: 'blackjack', name: 'Blackjack', icon: '♠️', category: 'Card', minBet: 25, maxBet: 50000, isLive: true, players: 445 }
];

// Exact UI patterns from successful apps
export default function MarketStandardPlatform() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showWallet, setShowWallet] = useState(false);
  const [depositAmount, setDepositAmount] = useState(500);
  const [loading, setLoading] = useState(false);

  // Market-standard authentication - exact flow from Teen Patti Gold
  const handleAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        setShowAuth(false);
        setPhone('');
        setPassword('');
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
    setLoading(false);
  };

  // Standard wallet deposit - copied from MPL pattern
  const handleDeposit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ amount: depositAmount })
      });
      
      const data = await response.json();
      if (data.success && data.orderId) {
        // Standard Razorpay integration
        const options = {
          key: 'rzp_test_your_key_here',
          amount: depositAmount * 100,
          currency: 'INR',
          order_id: data.orderId,
          name: 'Perfect91Club',
          description: 'Wallet Deposit',
          handler: function(response: any) {
            console.log('Payment successful:', response);
            // Update balance after successful payment
            if (user) {
              setUser({
                ...user,
                walletBalance: (parseFloat(user.walletBalance) + depositAmount).toString()
              });
            }
            setShowWallet(false);
          }
        };
        
        // @ts-ignore
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error('Deposit error:', error);
    }
    setLoading(false);
  };

  // Demo login for testing - standard pattern
  useEffect(() => {
    const demoLogin = async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            phone: '9876543210', 
            password: 'demo123' 
          })
        });
        
        const data = await response.json();
        if (data.success) {
          localStorage.setItem('authToken', data.token);
          setUser(data.user);
        }
      } catch (error) {
        console.error('Demo login failed:', error);
      }
    };
    
    if (!user) {
      demoLogin();
    }
  }, []);

  // Not logged in - standard login screen like Teen Patti Gold
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-8">
              <motion.div 
                className="text-6xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎰
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">Perfect91Club</h1>
              <p className="text-purple-200">Real Money Gaming</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <motion.button
                onClick={handleAuth}
                disabled={loading || !phone || !password}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </motion.button>

              <div className="text-center text-sm text-purple-200">
                Demo: 9876543210 / demo123
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header - exact copy of MPL header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">{user.username}</div>
                <div className="text-purple-300 text-sm">ID: {user.id}</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setShowWallet(true)}
                className="flex items-center space-x-2 bg-green-600 px-4 py-2 rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Wallet className="w-4 h-4 text-white" />
                <span className="text-white font-bold">₹{parseFloat(user.walletBalance).toFixed(2)}</span>
              </motion.button>
              <Bell className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid - exact MPL layout */}
      <div className="max-w-md mx-auto p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Live Games</h2>
          <div className="grid grid-cols-2 gap-4">
            {MARKET_GAMES.map((game) => (
              <motion.div
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-white/10 cursor-pointer"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{game.icon}</div>
                  <div className="text-white font-semibold text-sm">{game.name}</div>
                  <div className="text-purple-300 text-xs">{game.category}</div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-green-400">🟢 {game.players}</span>
                    <span className="text-gray-300">₹{game.minBet}-{game.maxBet}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Promotions - standard MPL pattern */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-bold">Daily Bonus</div>
              <div className="text-yellow-100 text-sm">Win up to ₹10,000</div>
            </div>
            <Gift className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Wallet Modal - standard Razorpay integration */}
      <AnimatePresence>
        {showWallet && (
          <motion.div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-slate-900 rounded-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Add Money</h3>
              
              <div className="mb-4">
                <div className="text-gray-300 text-sm mb-2">Current Balance</div>
                <div className="text-2xl font-bold text-green-400">₹{parseFloat(user.walletBalance).toFixed(2)}</div>
              </div>

              <div className="mb-4">
                <div className="text-gray-300 text-sm mb-2">Deposit Amount</div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setDepositAmount(Math.max(100, depositAmount - 100))}
                    className="bg-slate-700 p-2 rounded-lg"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-white text-xl font-bold">₹{depositAmount}</div>
                  </div>
                  <button
                    onClick={() => setDepositAmount(depositAmount + 100)}
                    className="bg-slate-700 p-2 rounded-lg"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {[500, 1000, 2000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setDepositAmount(amount)}
                    className={`py-2 rounded-lg font-medium ${
                      depositAmount === amount 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-slate-700 text-gray-300'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <motion.button
                  onClick={handleDeposit}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Processing...' : `Pay ₹${depositAmount}`}
                </motion.button>
                <button
                  onClick={() => setShowWallet(false)}
                  className="w-full py-3 bg-slate-700 text-white font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div 
            className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-slate-900 rounded-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{selectedGame.icon}</div>
                <h3 className="text-2xl font-bold text-white">{selectedGame.name}</h3>
                <p className="text-gray-300">🟢 {selectedGame.players} players online</p>
              </div>

              <div className="bg-slate-800 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-gray-300 text-sm">Min Bet</div>
                    <div className="text-green-400 font-bold">₹{selectedGame.minBet}</div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm">Max Bet</div>
                    <div className="text-green-400 font-bold">₹{selectedGame.maxBet}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-5 h-5 inline mr-2" />
                  Play Now
                </motion.button>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="w-full py-3 bg-slate-700 text-white font-bold rounded-xl"
                >
                  Back
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation - exact MPL pattern */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-black/40 backdrop-blur-sm border-t border-white/10">
        <div className="grid grid-cols-4 gap-1 p-2">
          <button className="flex flex-col items-center py-2 text-purple-400">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-400">
            <Trophy className="w-5 h-5" />
            <span className="text-xs">Leaderboard</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-400">
            <Wallet className="w-5 h-5" />
            <span className="text-xs">Wallet</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-400">
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}