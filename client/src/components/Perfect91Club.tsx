import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, Lock, Eye, EyeOff, ArrowLeft,
  Gift, Wallet, Trophy, User, Gamepad2,
  Plus, Minus, Play
} from 'lucide-react';
import WinGoGame from './WinGoGame';
import AviatorGame from './AviatorGame';

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
  const [showWallet, setShowWallet] = useState(false);
  const [walletAction, setWalletAction] = useState<'deposit' | 'withdraw' | null>(null);
  const [amount, setAmount] = useState(500);
  const [realTimeBalance, setRealTimeBalance] = useState<string>('0.00');
  const [showProfile, setShowProfile] = useState(false);
  const [currentGameView, setCurrentGameView] = useState<string | null>(null);

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
      id: 'aviator',
      name: 'AVIATOR',
      bgColor: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
      icon: '✈️',
      description: 'CRASH GAME'
    },
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

  // Real authentication with backend
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store auth token
        localStorage.setItem('authToken', data.token);
        
        // Fetch user profile
        const profileResponse = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${data.token}`,
          },
        });

        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          setUser(userData);
          setShowAuth(false);
          setPhone('');
          setPassword('');
        } else {
          alert('Failed to load user profile');
        }
      } else {
        alert(data.message || 'Login failed. Try demo: 9876543210 / demo123');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Connection error. Using demo mode.');
      
      // Fallback to demo mode
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
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch real-time wallet balance
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/wallet/balance', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRealTimeBalance(data.balance);
        setUser(prev => prev ? { ...prev, walletBalance: data.balance } : null);
      }
    } catch (error) {
      console.error('Balance fetch error:', error);
    }
  };

  // Handle deposit
  const handleDeposit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (response.ok) {
        // For demo mode, simulate Razorpay payment
        if (data.orderId) {
          alert(`Payment initiated for ₹${amount}. Order ID: ${data.orderId}`);
          
          // Simulate successful payment after 2 seconds
          setTimeout(async () => {
            const verifyResponse = await fetch('/api/wallet/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                orderId: data.orderId,
                paymentId: 'demo_payment_' + Date.now(),
                signature: 'demo_signature'
              }),
            });

            if (verifyResponse.ok) {
              alert('Deposit successful!');
              fetchBalance();
              setShowWallet(false);
              setWalletAction(null);
            }
          }, 2000);
        }
      } else {
        alert(data.message || 'Deposit failed');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Connection error during deposit');
    } finally {
      setLoading(false);
    }
  };

  // Handle withdrawal
  const handleWithdraw = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          amount,
          accountDetails: {
            bankName: 'Demo Bank',
            accountNumber: '1234567890',
            ifsc: 'DEMO0001234'
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Withdrawal request submitted! It will be processed within 24 hours.');
        fetchBalance();
        setShowWallet(false);
        setWalletAction(null);
      } else {
        alert(data.message || 'Withdrawal failed');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Connection error during withdrawal');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setShowProfile(false);
    setRealTimeBalance('0.00');
  };

  // Check for existing auth token on component mount
  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Try to fetch user profile with stored token
      fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(res => res.ok ? res.json() : null)
      .then(userData => {
        if (userData) {
          setUser(userData);
          setRealTimeBalance(userData.walletBalance);
        }
      })
      .catch(() => {
        // Token invalid, remove it
        localStorage.removeItem('authToken');
      });
    }
  }, []);

  // Load balance on component mount and user login
  React.useEffect(() => {
    if (user) {
      fetchBalance();
      setRealTimeBalance(user.walletBalance);
    }
  }, [user]);

  // Show WinGo game if selected
  if (currentGameView === 'wingo' && user) {
    return (
      <WinGoGame 
        onBack={() => setCurrentGameView(null)}
        user={user}
        onBalanceUpdate={fetchBalance}
      />
    );
  }

  // Show Aviator game if selected
  if (currentGameView === 'aviator' && user) {
    return (
      <AviatorGame 
        onBack={() => setCurrentGameView(null)}
        user={user}
        onBalanceUpdate={fetchBalance}
      />
    );
  }

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
              ₹{realTimeBalance || user.walletBalance}
              <button 
                onClick={fetchBalance}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                ↻
              </button>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => {
                setWalletAction('withdraw');
                setShowWallet(true);
              }}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600"
            >
              Withdraw
            </button>
            <button 
              onClick={() => {
                setWalletAction('deposit');
                setShowWallet(true);
              }}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600"
            >
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
              onClick={() => {
                if (game.name === 'WIN GO') {
                  setCurrentGameView('wingo');
                } else {
                  setSelectedGame(game);
                }
              }}
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

      {/* Wallet Modal */}
      <AnimatePresence>
        {showWallet && walletAction && (
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
                <h2 className="text-xl font-bold">
                  {walletAction === 'deposit' ? 'Deposit Money' : 'Withdraw Money'}
                </h2>
                <button 
                  onClick={() => {
                    setShowWallet(false);
                    setWalletAction(null);
                  }}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setAmount(Math.max(100, amount - 100))}
                      className="bg-red-500 p-3 rounded-lg text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="text-xl font-bold">₹{amount}</div>
                    <button
                      onClick={() => setAmount(amount + 100)}
                      className="bg-green-500 p-3 rounded-lg text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[500, 1000, 2000, 5000].map(preset => (
                      <button
                        key={preset}
                        onClick={() => setAmount(preset)}
                        className={`py-2 rounded-lg font-medium ${
                          amount === preset 
                            ? 'bg-red-500 text-white' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        ₹{preset}
                      </button>
                    ))}
                  </div>
                </div>

                {walletAction === 'withdraw' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="text-sm text-yellow-800">
                      <strong>Note:</strong> Withdrawals are processed within 24 hours. 
                      Minimum withdrawal: ₹100
                    </div>
                  </div>
                )}

                {walletAction === 'deposit' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm text-blue-800">
                      <strong>Payment Methods:</strong> UPI, Credit/Debit Cards, Net Banking
                    </div>
                  </div>
                )}

                <button
                  onClick={walletAction === 'deposit' ? handleDeposit : handleWithdraw}
                  disabled={loading || (walletAction === 'withdraw' && amount > parseFloat(realTimeBalance || user.walletBalance))}
                  className={`w-full py-3 rounded-lg font-bold ${
                    loading || (walletAction === 'withdraw' && amount > parseFloat(realTimeBalance || user.walletBalance))
                      ? 'bg-gray-400 text-gray-600'
                      : walletAction === 'deposit'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {loading 
                    ? 'Processing...' 
                    : walletAction === 'withdraw' && amount > parseFloat(realTimeBalance || user.walletBalance)
                    ? 'Insufficient Balance'
                    : walletAction === 'deposit' 
                    ? `Deposit ₹${amount}` 
                    : `Withdraw ₹${amount}`
                  }
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Account</h2>
                <button 
                  onClick={() => setShowProfile(false)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-bold text-lg">{user.username}</div>
                  <div className="text-gray-600">{user.phone}</div>
                  <div className="text-sm text-green-600 mt-1">
                    {user.isVerified ? '✓ Verified Account' : '⚠ Unverified'}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">₹{realTimeBalance || user.walletBalance}</div>
                    <div className="text-gray-600 text-sm">Current Balance</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      setShowProfile(false);
                      setWalletAction('deposit');
                      setShowWallet(true);
                    }}
                    className="w-full py-3 bg-red-500 text-white font-bold rounded-lg flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Money
                  </button>

                  <button 
                    onClick={() => {
                      setShowProfile(false);
                      // Add transaction history functionality here
                      alert('Transaction history coming soon!');
                    }}
                    className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-lg"
                  >
                    Transaction History
                  </button>

                  <button 
                    onClick={() => {
                      setShowProfile(false);
                      // Add settings functionality here
                      alert('Settings coming soon!');
                    }}
                    className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-lg"
                  >
                    Settings
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="w-full py-3 bg-gray-100 text-red-600 font-bold rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          <button 
            onClick={() => setShowProfile(true)}
            className="flex flex-col items-center py-3 text-gray-400"
          >
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