import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, TrendingUp } from 'lucide-react';

interface User {
  id: number;
  username: string;
  walletBalance: string;
}

interface Props {
  onBack: () => void;
  user: User;
  onBalanceUpdate: () => void;
}

interface BetData {
  amount: number;
  multiplier: number;
  cashOut: number;
  active: boolean;
}

interface LeaderboardEntry {
  username: string;
  bet: number;
  multiplier: number;
  cashOut: number;
}

export default function AuthenticAviatorGame({ onBack, user, onBalanceUpdate }: Props) {
  // Game State
  const [gamePhase, setGamePhase] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [countdown, setCountdown] = useState(5);
  const [isFlying, setIsFlying] = useState(false);
  
  // Betting State
  const [bet1, setBet1] = useState<BetData>({ amount: 100, multiplier: 1.00, cashOut: 0, active: false });
  const [bet2, setBet2] = useState<BetData>({ amount: 200, multiplier: 1.00, cashOut: 0, active: false });
  const [autoCashOut1, setAutoCashOut1] = useState(false);
  const [autoCashOut2, setAutoCashOut2] = useState(false);
  const [showCrashModal, setShowCrashModal] = useState(false);
  const [lastCrashMultiplier, setLastCrashMultiplier] = useState(9.81);
  
  // Leaderboard
  const [leaderboard] = useState<LeaderboardEntry[]>([
    { username: '7***9', bet: 8000.00, multiplier: 5.17, cashOut: 41360.00 },
    { username: '7***9', bet: 8000.00, multiplier: 10.47, cashOut: 83760.00 },
    { username: '4***a', bet: 8000.00, multiplier: 1.51, cashOut: 12080.00 },
    { username: 'm***4', bet: 6924.45, multiplier: 2.33, cashOut: 16133.99 },
    { username: 'j****', bet: 5842.53, multiplier: 3.30, cashOut: 19280.37 },
    { username: 'j****', bet: 5842.53, multiplier: 1.83, cashOut: 10691.84 },
    { username: 'm***n', bet: 5653.80, multiplier: 2.02, cashOut: 11420.68 },
  ]);

  // Recent multipliers history
  const [multiplierHistory] = useState([2.61, 2.80, 1.31, 1.06, 2.74, 1.78, 1.36, 1.03, 1.51, 1.73]);

  // Game simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gamePhase === 'waiting') {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setGamePhase('flying');
            setIsFlying(true);
            setCurrentMultiplier(1.00);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gamePhase === 'flying') {
      interval = setInterval(() => {
        setCurrentMultiplier(prev => {
          const newMultiplier = prev + (Math.random() * 0.05 + 0.01);
          
          // Random crash chance increases with multiplier
          const crashChance = Math.random();
          const crashProbability = Math.min(0.02 + (newMultiplier - 1) * 0.01, 0.1);
          
          if (crashChance < crashProbability) {
            setGamePhase('crashed');
            setIsFlying(false);
            setLastCrashMultiplier(newMultiplier);
            setShowCrashModal(true);
            setTimeout(() => {
              setShowCrashModal(false);
              setGamePhase('waiting');
              setCountdown(5);
            }, 3000);
            return newMultiplier;
          }
          
          return newMultiplier;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [gamePhase]);

  const handleBet = (betNumber: 1 | 2) => {
    if (gamePhase !== 'waiting') return;
    
    if (betNumber === 1) {
      setBet1(prev => ({ ...prev, active: true }));
    } else {
      setBet2(prev => ({ ...prev, active: true }));
    }
  };

  const handleCashOut = (betNumber: 1 | 2) => {
    if (gamePhase !== 'flying') return;
    
    if (betNumber === 1 && bet1.active) {
      setBet1(prev => ({ 
        ...prev, 
        active: false, 
        cashOut: prev.amount * currentMultiplier,
        multiplier: currentMultiplier 
      }));
    } else if (betNumber === 2 && bet2.active) {
      setBet2(prev => ({ 
        ...prev, 
        active: false, 
        cashOut: prev.amount * currentMultiplier,
        multiplier: currentMultiplier 
      }));
    }
  };

  const adjustBetAmount = (betNumber: 1 | 2, change: number) => {
    if (betNumber === 1) {
      setBet1(prev => ({ ...prev, amount: Math.max(10, prev.amount + change) }));
    } else {
      setBet2(prev => ({ ...prev, amount: Math.max(10, prev.amount + change) }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-red-500 font-bold text-lg">Aviator</div>
        <div className="text-green-400 text-sm">₹{user.walletBalance}</div>
      </div>

      {/* Multiplier History */}
      <div className="flex items-center justify-center gap-1 py-2 bg-black/30">
        {multiplierHistory.map((mult, index) => (
          <div 
            key={index}
            className={`text-xs px-2 py-1 rounded ${
              mult >= 2 ? 'text-green-400' : mult >= 1.5 ? 'text-yellow-400' : 'text-red-400'
            }`}
          >
            {mult.toFixed(2)}x
          </div>
        ))}
      </div>

      {/* Game Area */}
      <div className="relative h-80 bg-gradient-to-b from-purple-900 via-purple-800 to-gray-900 overflow-hidden">
        {/* Flying Plane Animation */}
        <AnimatePresence>
          {isFlying && (
            <motion.div
              className="absolute"
              initial={{ x: -50, y: 200 }}
              animate={{ 
                x: 300,
                y: 50,
                rotate: -15
              }}
              exit={{ x: 400, y: 0 }}
              transition={{ 
                duration: 10,
                ease: "easeOut"
              }}
            >
              <div className="text-4xl">✈️</div>
              <div className="w-32 h-1 bg-red-500 -mt-6 -ml-4"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Multiplier Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          {gamePhase === 'waiting' ? (
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">Starting in</div>
              <div className="text-6xl font-bold text-green-400">{countdown}</div>
            </div>
          ) : (
            <div className="text-center">
              <motion.div 
                className="text-6xl font-bold text-white mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {currentMultiplier.toFixed(2)}x
              </motion.div>
              {gamePhase === 'flying' && (
                <div className="text-green-400 text-lg font-semibold">
                  🚀 Flying...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fun Mode Label */}
        {gamePhase === 'flying' && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-black px-4 py-1 rounded font-bold text-sm">
            FUN MODE
          </div>
        )}
      </div>

      {/* Betting Controls */}
      <div className="p-4 space-y-4">
        {/* Bet Panel 1 */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400">Bet</span>
            <span className="text-gray-400">Auto</span>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <button 
              onClick={() => adjustBetAmount(1, -10)}
              className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex-1 text-center text-2xl font-bold">
              {bet1.amount.toFixed(2)}
            </div>
            <button 
              onClick={() => adjustBetAmount(1, 10)}
              className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-3">
            {[5, 10, 50, 100].map(amount => (
              <button 
                key={amount}
                onClick={() => setBet1(prev => ({ ...prev, amount }))}
                className="bg-gray-700 py-1 rounded text-sm"
              >
                {amount}
              </button>
            ))}
          </div>

          {gamePhase === 'waiting' ? (
            <button 
              onClick={() => handleBet(1)}
              className={`w-full py-3 rounded font-bold text-lg ${
                bet1.active 
                  ? 'bg-gray-600 text-gray-400' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
              disabled={bet1.active}
            >
              {bet1.active ? 'BET PLACED' : `BET ${bet1.amount.toFixed(2)} ₹`}
            </button>
          ) : bet1.active ? (
            <button 
              onClick={() => handleCashOut(1)}
              className="w-full py-3 bg-orange-500 text-white rounded font-bold text-lg hover:bg-orange-600"
            >
              CASH OUT {(bet1.amount * currentMultiplier).toFixed(2)} ₹
            </button>
          ) : bet1.cashOut > 0 ? (
            <div className="w-full py-3 bg-green-600 text-white rounded font-bold text-lg text-center">
              WON {bet1.cashOut.toFixed(2)} ₹ ({bet1.multiplier.toFixed(2)}x)
            </div>
          ) : (
            <div className="w-full py-3 bg-gray-600 text-gray-400 rounded font-bold text-lg text-center">
              NEXT ROUND
            </div>
          )}
        </div>

        {/* Bet Panel 2 */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400">Bet</span>
            <span className="text-gray-400">Auto</span>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <button 
              onClick={() => adjustBetAmount(2, -10)}
              className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex-1 text-center text-2xl font-bold">
              {bet2.amount.toFixed(2)}
            </div>
            <button 
              onClick={() => adjustBetAmount(2, 10)}
              className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-3">
            {[5, 10, 50, 100].map(amount => (
              <button 
                key={amount}
                onClick={() => setBet2(prev => ({ ...prev, amount }))}
                className="bg-gray-700 py-1 rounded text-sm"
              >
                {amount}
              </button>
            ))}
          </div>

          {gamePhase === 'waiting' ? (
            <button 
              onClick={() => handleBet(2)}
              className={`w-full py-3 rounded font-bold text-lg ${
                bet2.active 
                  ? 'bg-gray-600 text-gray-400' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
              disabled={bet2.active}
            >
              {bet2.active ? 'BET PLACED' : `BET ${bet2.amount.toFixed(2)} ₹`}
            </button>
          ) : bet2.active ? (
            <button 
              onClick={() => handleCashOut(2)}
              className="w-full py-3 bg-orange-500 text-white rounded font-bold text-lg hover:bg-orange-600"
            >
              CASH OUT {(bet2.amount * currentMultiplier).toFixed(2)} ₹
            </button>
          ) : bet2.cashOut > 0 ? (
            <div className="w-full py-3 bg-green-600 text-white rounded font-bold text-lg text-center">
              WON {bet2.cashOut.toFixed(2)} ₹ ({bet2.multiplier.toFixed(2)}x)
            </div>
          ) : (
            <div className="w-full py-3 bg-gray-600 text-gray-400 rounded font-bold text-lg text-center">
              NEXT ROUND
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Tabs */}
      <div className="bg-gray-800 p-4">
        <div className="flex gap-4 mb-4">
          <button className="text-white font-semibold border-b-2 border-green-400 pb-2">All Bets</button>
          <button className="text-gray-400">My Bets</button>
          <button className="text-gray-400">Top</button>
        </div>
        
        <div className="text-green-400 mb-3">TOTAL BETS: 3914</div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {leaderboard.map((entry, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-700 rounded p-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                <span className="text-white">{entry.username}</span>
              </div>
              <div className="text-yellow-400">{entry.bet.toFixed(2)}₹</div>
              <div className={`px-2 py-1 rounded text-xs font-bold ${
                entry.multiplier >= 5 ? 'bg-purple-600' : 
                entry.multiplier >= 3 ? 'bg-green-600' : 
                entry.multiplier >= 2 ? 'bg-blue-600' : 'bg-gray-600'
              }`}>
                {entry.multiplier.toFixed(2)}x
              </div>
              <div className="text-green-400">{entry.cashOut.toFixed(2)}₹</div>
            </div>
          ))}
        </div>
      </div>

      {/* Crash Modal */}
      <AnimatePresence>
        {showCrashModal && (
          <motion.div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-black rounded-lg p-8 text-center border border-red-500"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
            >
              <div className="text-white text-2xl mb-2">FLEW AWAY!</div>
              <div className="text-red-500 text-4xl font-bold mb-4">
                {lastCrashMultiplier.toFixed(2)}x
              </div>
              <div className="text-gray-400">Plane crashed at {lastCrashMultiplier.toFixed(2)}x</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}