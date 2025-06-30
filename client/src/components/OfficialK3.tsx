import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Users, Trophy, Zap } from 'lucide-react';

interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  isVerified: boolean;
}

interface K3GameProps {
  onBack: () => void;
  user: User;
  onBalanceUpdate: () => void;
}

interface K3Result {
  period: string;
  dice1: number;
  dice2: number;
  dice3: number;
  sum: number;
  type: 'big' | 'small';
  timestamp: Date;
}

export default function OfficialK3({ onBack, user, onBalanceUpdate }: K3GameProps) {
  // Game State
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute for K3
  const [gamePhase, setGamePhase] = useState<'betting' | 'waiting' | 'result'>('betting');
  
  // Betting State
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [balance, setBalance] = useState(parseFloat(user.walletBalance));
  const [loading, setLoading] = useState(false);
  const [hasBet, setHasBet] = useState(false);
  
  // Game Data
  const [gameHistory, setGameHistory] = useState<K3Result[]>([
    { period: '20241201001', dice1: 3, dice2: 4, dice3: 2, sum: 9, type: 'small', timestamp: new Date() },
    { period: '20241201002', dice1: 6, dice2: 5, dice3: 4, sum: 15, type: 'big', timestamp: new Date() },
    { period: '20241201003', dice1: 1, dice2: 2, dice3: 3, sum: 6, type: 'small', timestamp: new Date() },
  ]);
  const [currentResult, setCurrentResult] = useState<K3Result | null>(null);
  const [diceAnimation, setDiceAnimation] = useState({ dice1: 1, dice2: 1, dice3: 1 });

  // Generate period for K3
  const generatePeriod = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}`;
  };

  // Timer and game loop
  useEffect(() => {
    setCurrentPeriod(generatePeriod());
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (gamePhase === 'betting') {
            startWaitingPhase();
            return 20; // 20 seconds waiting with dice animation
          } else if (gamePhase === 'waiting') {
            showResult();
            return 10; // 10 seconds result display
          } else {
            startNewRound();
            return 60; // 1 minute betting
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase]);

  // Animate dice during waiting phase
  useEffect(() => {
    if (gamePhase === 'waiting') {
      const animationInterval = setInterval(() => {
        setDiceAnimation({
          dice1: Math.floor(Math.random() * 6) + 1,
          dice2: Math.floor(Math.random() * 6) + 1,
          dice3: Math.floor(Math.random() * 6) + 1,
        });
      }, 200);

      return () => clearInterval(animationInterval);
    }
  }, [gamePhase]);

  const startWaitingPhase = () => {
    setGamePhase('waiting');
  };

  const showResult = () => {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const dice3 = Math.floor(Math.random() * 6) + 1;
    const sum = dice1 + dice2 + dice3;
    
    const newResult: K3Result = {
      period: currentPeriod,
      dice1,
      dice2,
      dice3,
      sum,
      type: sum >= 11 ? 'big' : 'small',
      timestamp: new Date()
    };
    
    setCurrentResult(newResult);
    setDiceAnimation({ dice1, dice2, dice3 });
    setGameHistory(prev => [newResult, ...prev.slice(0, 9)]);
    setGamePhase('result');
    
    // Check if user won
    if (hasBet && selectedBet) {
      checkWin(newResult);
    }
  };

  const startNewRound = () => {
    setGamePhase('betting');
    setCurrentPeriod(generatePeriod());
    setSelectedBet(null);
    setHasBet(false);
    setCurrentResult(null);
    setDiceAnimation({ dice1: 1, dice2: 1, dice3: 1 });
  };

  const checkWin = (result: K3Result) => {
    if (!selectedBet) return;
    
    let won = false;
    let multiplier = 1;
    
    if (selectedBet === result.type) {
      won = true;
      multiplier = 2;
    } else if (selectedBet === result.sum.toString()) {
      won = true;
      multiplier = getSumMultiplier(result.sum);
    }
    
    if (won) {
      const winAmount = betAmount * multiplier;
      setBalance(prev => prev + winAmount);
      onBalanceUpdate();
    }
  };

  const getSumMultiplier = (sum: number): number => {
    // K3 sum payout multipliers
    const multipliers: { [key: number]: number } = {
      3: 50, 4: 30, 5: 18, 6: 14, 7: 12, 8: 8, 9: 7, 10: 6,
      11: 6, 12: 7, 13: 8, 14: 12, 15: 14, 16: 18, 17: 30, 18: 50
    };
    return multipliers[sum] || 2;
  };

  const placeBet = (betType: string) => {
    if (gamePhase !== 'betting' || loading || betAmount > balance) return;
    
    setLoading(true);
    setSelectedBet(betType);
    setHasBet(true);
    setBalance(prev => prev - betAmount);
    
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const DiceDisplay = ({ value, animate = false }: { value: number; animate?: boolean }) => (
    <motion.div
      className="w-16 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center"
      animate={animate ? { rotateX: 360, rotateY: 360 } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="text-2xl font-bold text-black">{value}</div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-900 via-purple-900 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-4 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center space-x-2 text-white">
          <ArrowLeft className="w-6 h-6" />
          <span className="font-semibold">Back</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold">K3 LOTTERY</h1>
          <div className="text-sm opacity-90">1Min</div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold">₹{balance.toFixed(2)}</div>
          <div className="text-sm opacity-90">Balance</div>
        </div>
      </div>

      {/* Game Info Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm opacity-80">Period</div>
            <div className="font-mono text-lg">{currentPeriod}</div>
          </div>
          <div className="text-center">
            <div className="text-sm opacity-80">
              {gamePhase === 'betting' ? 'Betting Time' : 
               gamePhase === 'waiting' ? 'Rolling Dice...' : 'Result'}
            </div>
            <div className="text-3xl font-bold text-yellow-300">
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80">Round</div>
            <div className="font-bold">{gameHistory.length + 1}</div>
          </div>
        </div>
      </div>

      {/* Dice Display Area */}
      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {gamePhase === 'betting' ? 'Place Your Bets' :
             gamePhase === 'waiting' ? 'Rolling Dice...' : 'Final Result'}
          </h3>
          
          <div className="flex justify-center space-x-4 mb-4">
            <DiceDisplay value={diceAnimation.dice1} animate={gamePhase === 'waiting'} />
            <DiceDisplay value={diceAnimation.dice2} animate={gamePhase === 'waiting'} />
            <DiceDisplay value={diceAnimation.dice3} animate={gamePhase === 'waiting'} />
          </div>

          {(gamePhase === 'waiting' || gamePhase === 'result') && (
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                SUM: {diceAnimation.dice1 + diceAnimation.dice2 + diceAnimation.dice3}
              </div>
              {gamePhase === 'result' && currentResult && (
                <div className={`text-xl font-bold mt-2 ${
                  currentResult.type === 'big' ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {currentResult.type.toUpperCase()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Result Animation */}
        {currentResult && gamePhase === 'result' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-6 p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl text-center"
          >
            <div className="text-2xl font-bold">🎲 RESULT 🎲</div>
            <div className="text-lg mt-2">
              {currentResult.dice1} + {currentResult.dice2} + {currentResult.dice3} = {currentResult.sum}
            </div>
          </motion.div>
        )}

        {/* Betting Options */}
        {gamePhase === 'betting' && (
          <>
            {/* Big/Small Betting */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Sum Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => placeBet('small')}
                  disabled={loading}
                  className={`p-6 rounded-2xl font-bold text-lg shadow-lg ${
                    selectedBet === 'small' 
                      ? 'bg-gradient-to-b from-blue-500 to-blue-600 ring-4 ring-yellow-400' 
                      : 'bg-gradient-to-b from-blue-400 to-blue-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">🔵</div>
                    <div>SMALL</div>
                    <div className="text-sm opacity-90">3-10</div>
                    <div className="text-lg font-bold mt-2 bg-white text-blue-600 rounded-lg py-1">×2</div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => placeBet('big')}
                  disabled={loading}
                  className={`p-6 rounded-2xl font-bold text-lg shadow-lg ${
                    selectedBet === 'big' 
                      ? 'bg-gradient-to-b from-red-500 to-red-600 ring-4 ring-yellow-400' 
                      : 'bg-gradient-to-b from-red-400 to-red-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">🔴</div>
                    <div>BIG</div>
                    <div className="text-sm opacity-90">11-18</div>
                    <div className="text-lg font-bold mt-2 bg-white text-red-600 rounded-lg py-1">×2</div>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Sum Betting */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Exact Sum</h3>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 16 }, (_, i) => i + 3).map(sum => (
                  <motion.button
                    key={sum}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => placeBet(sum.toString())}
                    disabled={loading}
                    className={`aspect-square rounded-xl text-white font-bold text-lg shadow-lg ${
                      sum <= 10 ? 'bg-gradient-to-b from-blue-400 to-blue-600' : 'bg-gradient-to-b from-red-400 to-red-600'
                    } ${selectedBet === sum.toString() ? 'ring-4 ring-yellow-400' : ''}`}
                  >
                    <div>
                      <div>{sum}</div>
                      <div className="text-xs">×{getSumMultiplier(sum)}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Bet Amount */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Bet Amount</h3>
              <div className="flex items-center justify-between mb-3 bg-gray-800 rounded-xl p-3">
                <button
                  onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                  className="w-10 h-10 bg-red-500 rounded-full text-white font-bold"
                  disabled={loading}
                >
                  -
                </button>
                <div className="text-2xl font-bold">₹{betAmount}</div>
                <button
                  onClick={() => setBetAmount(Math.min(5000, betAmount + 10))}
                  className="w-10 h-10 bg-green-500 rounded-full text-white font-bold"
                  disabled={loading}
                >
                  +
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {[10, 50, 100, 500].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    disabled={loading}
                    className={`py-2 px-3 rounded-lg font-medium ${
                      betAmount === amount 
                        ? 'bg-yellow-500 text-black' 
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Bet Status */}
            {hasBet && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-4 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl text-center"
              >
                <div className="font-bold text-lg">🎉 Bet Placed!</div>
                <div className="text-lg mt-1">
                  {selectedBet} - ₹{betAmount}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Game History */}
      <div className="p-4 bg-black/50 border-t border-gray-700">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Recent Results
        </h3>
        <div className="space-y-2">
          {gameHistory.slice(0, 5).map((result, index) => (
            <div key={result.period} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
              <div className="text-sm font-mono">{result.period}</div>
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-6 h-6 bg-white rounded text-black text-xs flex items-center justify-center font-bold">
                    {result.dice1}
                  </div>
                  <div className="w-6 h-6 bg-white rounded text-black text-xs flex items-center justify-center font-bold">
                    {result.dice2}
                  </div>
                  <div className="w-6 h-6 bg-white rounded text-black text-xs flex items-center justify-center font-bold">
                    {result.dice3}
                  </div>
                </div>
                <div className="text-sm font-bold">
                  Sum: {result.sum}
                </div>
                <div className={`text-sm font-bold ${
                  result.type === 'big' ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {result.type.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}