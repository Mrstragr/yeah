import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Play, Wallet, User, Bell, Home, Trophy, Gift, Settings,
  Plus, Minus, Eye, EyeOff, Phone, Lock 
} from 'lucide-react';

// Official Game Components
import OfficialAviatorGame from './OfficialAviatorGame';
import { AuthenticBG678WinGo } from './AuthenticBG678WinGo';

interface User {
  id: string;
  username: string;
  phone: string;
  walletBalance: string;
}

interface Game {
  id: string;
  name: string;
  icon: string;
  category: string;
  isPopular?: boolean;
  isNew?: boolean;
  minBet: number;
  maxBet: number;
  players: number;
}

// Clean organized games list - no duplicates
const GAMES: Game[] = [
  { 
    id: 'aviator', 
    name: 'Aviator', 
    icon: '✈️', 
    category: 'Crash Game', 
    isPopular: true,
    minBet: 1, 
    maxBet: 50000, 
    players: 3421 
  },
  { 
    id: 'wingo', 
    name: 'Win Go', 
    icon: '🎯', 
    category: 'Lottery', 
    isPopular: true,
    minBet: 10, 
    maxBet: 10000, 
    players: 2156 
  },
  { 
    id: 'dragon-tiger', 
    name: 'Dragon Tiger', 
    icon: '🐉', 
    category: 'Card Game',
    minBet: 10, 
    maxBet: 8000, 
    players: 634 
  },
  { 
    id: 'mines', 
    name: 'Mines', 
    icon: '💎', 
    category: 'Strategy',
    minBet: 5, 
    maxBet: 25000, 
    players: 567 
  },
  { 
    id: 'teen-patti', 
    name: 'Teen Patti', 
    icon: '🃏', 
    category: 'Card Game',
    minBet: 10, 
    maxBet: 10000, 
    players: 1247 
  },
  { 
    id: 'andar-bahar', 
    name: 'Andar Bahar', 
    icon: '🎴', 
    category: 'Card Game',
    minBet: 5, 
    maxBet: 5000, 
    players: 892 
  }
];

export default function CleanPlatform() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'wallet' | 'account' | string>('home');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showWallet, setShowWallet] = useState(false);
  const [depositAmount, setDepositAmount] = useState(500);
  const [loading, setLoading] = useState(false);

  // Demo auto-login for quick testing
  useEffect(() => {
    const demoUser: User = {
      id: 'demo123',
      username: 'Player91',
      phone: '9876543210',
      walletBalance: '10000.00'
    };
    setUser(demoUser);
  }, []);

  // Wallet deposit handler
  const handleDeposit = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (user) {
        setUser({
          ...user,
          walletBalance: (parseFloat(user.walletBalance) + depositAmount).toString()
        });
      }
      setShowWallet(false);
    } catch (error) {
      console.error('Deposit error:', error);
    }
    setLoading(false);
  };

  // Show game if selected
  if (currentView === 'aviator' && user) {
    return (
      <OfficialAviatorGame 
        user={user}
        onBack={() => setCurrentView('home')}
        onBalanceUpdate={(newBalance) => setUser(prev => prev ? {...prev, walletBalance: newBalance.toString()} : null)}
      />
    );
  }

  if (currentView === 'wingo' && user) {
    return (
      <AuthenticBG678WinGo 
        onBack={() => setCurrentView('home')}
        user={user}
        onBalanceUpdate={(newBalance) => setUser(prev => prev ? {...prev, walletBalance: newBalance.toString()} : null)}
      />
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-white text-xl">Loading Perfect91Club...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header */}
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

      {/* Main Content */}
      {currentView === 'home' && (
        <div className="max-w-md mx-auto p-4">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-6">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2">Welcome to Perfect91Club!</h2>
              <p className="text-purple-100">Experience the best gaming platform in India</p>
              <div className="mt-4 bg-white/20 rounded-lg p-3">
                <div className="text-sm">Today's Bonus: ₹500 Free Play</div>
              </div>
            </div>
          </div>

          {/* Popular Games Section */}
          <div className="mb-6">
            <h3 className="text-white text-xl font-bold mb-4">🔥 Popular Games</h3>
            <div className="grid grid-cols-2 gap-4">
              {GAMES.filter(game => game.isPopular).map(game => (
                <motion.div
                  key={game.id}
                  onClick={() => setCurrentView(game.id)}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 cursor-pointer border border-gray-700"
                  whileHover={{ scale: 1.02, borderColor: '#8b5cf6' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{game.icon}</div>
                    <div className="text-white font-bold text-sm">{game.name}</div>
                    <div className="text-gray-400 text-xs">{game.category}</div>
                    <div className="text-green-400 text-xs mt-1">{game.players} playing</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* All Games Section */}
          <div className="mb-6">
            <h3 className="text-white text-xl font-bold mb-4">🎮 All Games</h3>
            <div className="space-y-3">
              {GAMES.map(game => (
                <motion.div
                  key={game.id}
                  onClick={() => setCurrentView(game.id)}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 cursor-pointer"
                  whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: '#8b5cf6' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{game.icon}</div>
                      <div>
                        <div className="text-white font-bold">{game.name}</div>
                        <div className="text-gray-400 text-sm">{game.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 text-sm font-bold">{game.players} players</div>
                      <div className="text-gray-400 text-xs">₹{game.minBet}-₹{game.maxBet}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      <AnimatePresence>
        {showWallet && (
          <motion.div 
            className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm"
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

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-black/40 backdrop-blur-sm border-t border-white/10">
        <div className="grid grid-cols-4 gap-1 p-2">
          <button 
            onClick={() => setCurrentView('home')}
            className="flex flex-col items-center py-2 text-purple-400"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => setCurrentView('wallet')}
            className="flex flex-col items-center py-2 text-gray-400"
          >
            <Wallet className="w-5 h-5" />
            <span className="text-xs">Wallet</span>
          </button>
          <button 
            onClick={() => setCurrentView('account')}
            className="flex flex-col items-center py-2 text-gray-400"
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Account</span>
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