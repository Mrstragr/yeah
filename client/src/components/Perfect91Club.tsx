import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, Lock, Eye, EyeOff, ArrowLeft,
  Gift, Wallet, Trophy, User, Gamepad2,
  Plus, Minus, Play
} from 'lucide-react';

// EXACT 91CLUB REPLICA - Same colors, same UI, same everything
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

export function Perfect91Club() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);

  // EXACT 91CLUB games with same colors and names
  const lotteryGames: Game[] = [
    {
      id: 'wingo',
      name: 'WIN GO',
      bgColor: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      icon: '🎯',
      description: '1 Min'
    },
    {
      id: 'k3',
      name: 'K3',
      bgColor: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      icon: '🎲',
      description: '1 Min'
    },
    {
      id: '5d',
      name: '5D',
      bgColor: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      icon: '🎪',
      description: '1 Min'
    },
    {
      id: 'trx-wingo',
      name: 'TRX WINGO',
      bgColor: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
      icon: '⚡',
      description: 'TRX'
    }
  ];

  const miniGames: Game[] = [
    {
      id: 'space-dice',
      name: 'SPACE\nDICE',
      bgColor: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      icon: '🎲',
      description: 'TB GAME'
    },
    {
      id: 'goal-wave',
      name: 'GOAL\nWAVE',
      bgColor: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      icon: '⚽',
      description: 'TB GAME'
    },
    {
      id: 'mini-roulette',
      name: 'MINI\nROULETTE',
      bgColor: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
      icon: '🎡',
      description: 'TB GAME'
    }
  ];

  const recommendedGames: Game[] = [
    {
      id: 'dice-game',
      name: 'DICE',
      bgColor: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
      icon: '🎲',
      description: 'TB GAME'
    },
    {
      id: 'plinko',
      name: 'PLINKO',
      bgColor: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      icon: '🔴',
      description: 'TB GAME'
    },
    {
      id: 'hilo',
      name: 'HILO',
      bgColor: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      icon: '🎯',
      description: 'TB GAME'
    }
  ];

  const slotGames: Game[] = [
    {
      id: 'slot1',
      name: 'SLOT',
      bgColor: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
      icon: '🎰',
      description: 'SLOT'
    },
    {
      id: 'slot2',
      name: 'SLOT',
      bgColor: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      icon: '🎰',
      description: 'SLOT'
    },
    {
      id: 'slot3',
      name: 'SLOT',
      bgColor: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      icon: '🎰',
      description: 'SLOT'
    }
  ];

  // Demo login function - exact same as before
  const handleLogin = async () => {
    setLoading(true);
    try {
      if (phone === '9876543210' && password === 'demo123') {
        const demoUser = {
          id: 1,
          username: 'Demo User',
          phone: '9876543210',
          email: 'demo@91club.com',
          walletBalance: '1000.00',
          isVerified: true
        };
        
        setUser(demoUser);
        setShowAuth(false);
        setPhone('');
        setPassword('');
      } else {
        alert('Demo credentials: 9876543210 / demo123');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show auth screen if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-orange-500 flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {/* EXACT 91CLUB logo */}
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-red-600 mb-2">
              ⭕91CLUB
            </div>
            <div className="text-gray-600">Welcome to 91Club</div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            <div className="text-center text-sm text-gray-600 mt-4">
              Demo: 9876543210 / demo123
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* EXACT 91CLUB Header */}
      <div className="bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-red-600 flex items-center">
            ⭕91CLUB
            <div className="ml-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            🔊 If you have not received your withdrawal within 3 days, please contact our service center...
          </div>
        </div>
      </div>

      {/* EXACT Special Attendance Bonus Banner */}
      <div className="px-4 pt-4">
        <div 
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-lg font-bold mb-1">
                SPECIAL ATTENDANCE BONUS
              </div>
              <div className="text-white text-sm mb-2">
                PROVIDED BY 91CLUB
              </div>
              <div className="text-white text-sm">
                up to
              </div>
              <div className="text-yellow-300 text-4xl font-bold">
                558RS
              </div>
              <button className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold mt-2">
                CLAIM IT RIGHT AWAY
              </button>
            </div>
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl">
              👸
            </div>
          </div>
        </div>
      </div>

      {/* EXACT Wallet Section */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-yellow-600 text-sm flex items-center">
              🟡 Wallet balance
            </div>
            <div className="text-2xl font-bold text-black flex items-center">
              ₹{user.walletBalance}
              <span className="ml-2 text-gray-400">↻</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold">
              Withdraw
            </button>
            <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold">
              Deposit
            </button>
          </div>
        </div>

        {/* EXACT Fortune Wheel and VIP Section */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div 
            className="rounded-2xl p-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)' }}
          >
            <div className="text-center text-white">
              <div className="text-3xl mb-1">🎡</div>
              <div className="font-bold text-lg">Wheel</div>
              <div className="text-sm">of fortune</div>
            </div>
          </div>
          <div 
            className="rounded-2xl p-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' }}
          >
            <div className="text-center text-white">
              <div className="text-3xl mb-1">👑</div>
              <div className="font-bold text-lg">VIP</div>
              <div className="text-sm">privileges</div>
            </div>
          </div>
        </div>
      </div>

      {/* EXACT Game Categories Tabs */}
      <div className="px-4">
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-4">
          <button className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-bold flex items-center justify-center">
            🔴 Lobby
          </button>
          <button className="flex-1 py-2 text-gray-600 text-sm font-bold flex items-center justify-center">
            🎮 Mini game
          </button>
          <button className="flex-1 py-2 text-gray-600 text-sm font-bold flex items-center justify-center">
            🎰 Slots
          </button>
          <button className="flex-1 py-2 text-gray-600 text-sm font-bold flex items-center justify-center">
            🃏 Card
          </button>
          <button className="flex-1 py-2 text-gray-600 text-sm font-bold flex items-center justify-center">
            🐟 Fishing
          </button>
        </div>
      </div>

      {/* EXACT Lottery Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center mb-3">
          <span className="text-red-500 text-lg mr-2">⭕</span>
          <span className="font-bold text-lg">Lottery</span>
        </div>
        <div className="text-gray-600 text-sm mb-4">
          The games are independently developed by our team, fun, fair, and safe
        </div>
        <div className="grid grid-cols-2 gap-3">
          {lotteryGames.map((game) => (
            <motion.div
              key={game.id}
              className="rounded-2xl p-6 text-white relative overflow-hidden cursor-pointer"
              style={{ background: game.bgColor }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedGame(game)}
            >
              <div className="text-3xl mb-2">{game.icon}</div>
              <div className="font-bold text-xl whitespace-pre-line">
                {game.name}
              </div>
              <div className="text-sm opacity-90 mt-1">
                {game.description}
              </div>
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">7</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{selectedGame.name}</h2>
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedGame.icon}</div>
                <div className="text-gray-600 mb-6">
                  Coming soon! This game is under development.
                </div>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="w-full py-3 bg-red-500 text-white font-bold rounded-lg"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXACT Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 gap-1">
          <button className="flex flex-col items-center py-3 text-gray-400">
            <Gift className="w-5 h-5 mb-1" />
            <span className="text-xs">Promotion</span>
          </button>
          <button className="flex flex-col items-center py-3 text-gray-400">
            <Trophy className="w-5 h-5 mb-1" />
            <span className="text-xs">Activity</span>
          </button>
          <button className="flex flex-col items-center py-3 text-red-500">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mb-1">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold">Game</span>
          </button>
          <button className="flex flex-col items-center py-3 text-gray-400">
            <Wallet className="w-5 h-5 mb-1" />
            <span className="text-xs">Wallet</span>
          </button>
          <button className="flex flex-col items-center py-3 text-gray-400">
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Account</span>
          </button>
        </div>
      </div>

      {/* Bottom padding for navigation */}
      <div className="h-20"></div>
    </div>
  );
}