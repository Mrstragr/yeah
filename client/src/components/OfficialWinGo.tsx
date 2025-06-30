import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Users, Trophy, TrendingUp, Zap } from 'lucide-react';

interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  isVerified: boolean;
}

interface WinGoGameProps {
  onBack: () => void;
  user: User;
  onBalanceUpdate: () => void;
}

interface GameRecord {
  period: string;
  result: number;
  color: 'red' | 'green' | 'violet';
  size: 'big' | 'small';
  timestamp: Date;
}

export default function OfficialWinGo({ onBack, user, onBalanceUpdate }: WinGoGameProps) {
  // Game State
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute for WinGo
  const [gamePhase, setGamePhase] = useState<'betting' | 'waiting' | 'result'>('betting');
  
  // Betting State
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [balance, setBalance] = useState(parseFloat(user.walletBalance));
  const [loading, setLoading] = useState(false);
  const [hasBet, setHasBet] = useState(false);
  
  // Game Data
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([
    { period: '20241201001', result: 4, color: 'green', size: 'small', timestamp: new Date() },
    { period: '20241201002', result: 7, color: 'red', size: 'big', timestamp: new Date() },
    { period: '20241201003', result: 0, color: 'violet', size: 'small', timestamp: new Date() },
    { period: '20241201004', result: 8, color: 'green', size: 'big', timestamp: new Date() },
    { period: '20241201005', result: 1, color: 'red', size: 'small', timestamp: new Date() },
  ]);
  const [currentResult, setCurrentResult] = useState<GameRecord | null>(null);

  // WinGo color logic (same as bg-678)
  const getColorFromNumber = (num: number): 'red' | 'green' | 'violet' => {
    if (num === 0 || num === 5) return 'violet';
    if (num % 2 === 1) return 'red'; // 1,3,7,9
    return 'green'; // 2,4,6,8
  };

  const getSizeFromNumber = (num: number): 'big' | 'small' => {
    return num >= 5 ? 'big' : 'small';
  };

  // Generate period for 1-minute game
  const generatePeriod = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}`;
  };

  // Timer and game loop (1-minute cycles)
  useEffect(() => {
    setCurrentPeriod(generatePeriod());
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (gamePhase === 'betting') {
            startWaitingPhase();
            return 10; // 10 seconds waiting
          } else if (gamePhase === 'waiting') {
            showResult();
            return 5; // 5 seconds result display
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

  const startWaitingPhase = () => {
    setGamePhase('waiting');
  };

  const showResult = () => {
    const resultNum = Math.floor(Math.random() * 10);
    const newResult: GameRecord = {
      period: currentPeriod,
      result: resultNum,
      color: getColorFromNumber(resultNum),
      size: getSizeFromNumber(resultNum),
      timestamp: new Date()
    };
    
    setCurrentResult(newResult);
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
  };

  const checkWin = (result: GameRecord) => {
    if (!selectedBet) return;
    
    let won = false;
    let multiplier = 1;
    
    if (selectedBet === result.color) {
      won = true;
      if (result.color === 'violet') multiplier = 4.5;
      else multiplier = 2;
    } else if (selectedBet === result.size) {
      won = true;
      multiplier = 2;
    } else if (selectedBet === result.result.toString()) {
      won = true;
      multiplier = 9;
    }
    
    if (won) {
      const winAmount = betAmount * multiplier;
      setBalance(prev => prev + winAmount);
      onBalanceUpdate();
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-900 to-black text-white max-w-md mx-auto">
      {/* Header - WinGo 1Min Style */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-white"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="font-semibold">Back</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold">Win Go</h1>
          <div className="text-sm opacity-90">1Min</div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold">₹{balance.toFixed(2)}</div>
          <div className="text-sm opacity-90">Balance</div>
        </div>
      </div>

      {/* Game Info Bar */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm opacity-80">Period</div>
            <div className="font-mono text-lg">{currentPeriod}</div>
          </div>
          <div className="text-center">
            <div className="text-sm opacity-80">
              {gamePhase === 'betting' ? 'Betting Time' : 
               gamePhase === 'waiting' ? 'Waiting...' : 'Result'}
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

      {/* Live Result Animation */}
      {currentResult && gamePhase === 'result' && (
        <div className="p-6 bg-gradient-to-r from-green-500 to-blue-500 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "backOut" }}
          >
            <div className="text-2xl font-semibold mb-4">🎉 Winner Number 🎉</div>
            <div className="flex items-center justify-center space-x-6">
              <motion.div 
                className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-black text-3xl font-bold shadow-lg"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 1 }}
              >
                {currentResult.result}
              </motion.div>
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full mx-auto mb-2 ${
                  currentResult.color === 'red' ? 'bg-red-500' :
                  currentResult.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                }`}></div>
                <div className="text-lg font-bold">
                  {currentResult.color.toUpperCase()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {currentResult.size.toUpperCase()}
                </div>
                <div className="text-sm opacity-90">
                  ({currentResult.result >= 5 ? '5-9' : '0-4'})
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Betting Interface */}
      <div className="p-4">
        {/* Color Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Select Color</h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Green */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeBet('green')}
              disabled={gamePhase !== 'betting' || loading}
              className={`p-6 rounded-2xl bg-gradient-to-b from-green-400 to-green-600 text-white font-bold shadow-xl ${
                selectedBet === 'green' ? 'ring-4 ring-yellow-400 ring-opacity-80' : ''
              } ${gamePhase !== 'betting' ? 'opacity-50' : ''}`}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-3 border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-2xl">🟢</span>
                </div>
                <div className="text-lg font-bold">GREEN</div>
                <div className="text-sm opacity-90">2,4,6,8</div>
                <div className="text-lg font-bold mt-2 bg-white text-green-600 rounded-lg py-1">×2</div>
              </div>
            </motion.button>

            {/* Violet */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeBet('violet')}
              disabled={gamePhase !== 'betting' || loading}
              className={`p-6 rounded-2xl bg-gradient-to-b from-purple-400 to-purple-600 text-white font-bold shadow-xl ${
                selectedBet === 'violet' ? 'ring-4 ring-yellow-400 ring-opacity-80' : ''
              } ${gamePhase !== 'betting' ? 'opacity-50' : ''}`}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-3 border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-2xl">🟣</span>
                </div>
                <div className="text-lg font-bold">VIOLET</div>
                <div className="text-sm opacity-90">0,5</div>
                <div className="text-lg font-bold mt-2 bg-white text-purple-600 rounded-lg py-1">×4.5</div>
              </div>
            </motion.button>

            {/* Red */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeBet('red')}
              disabled={gamePhase !== 'betting' || loading}
              className={`p-6 rounded-2xl bg-gradient-to-b from-red-400 to-red-600 text-white font-bold shadow-xl ${
                selectedBet === 'red' ? 'ring-4 ring-yellow-400 ring-opacity-80' : ''
              } ${gamePhase !== 'betting' ? 'opacity-50' : ''}`}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-3 border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-2xl">🔴</span>
                </div>
                <div className="text-lg font-bold">RED</div>
                <div className="text-sm opacity-90">1,3,7,9</div>
                <div className="text-lg font-bold mt-2 bg-white text-red-600 rounded-lg py-1">×2</div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Size Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Select Size</h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeBet('small')}
              disabled={gamePhase !== 'betting' || loading}
              className={`p-6 rounded-2xl bg-gradient-to-b from-cyan-400 to-blue-600 text-white font-bold shadow-xl ${
                selectedBet === 'small' ? 'ring-4 ring-yellow-400 ring-opacity-80' : ''
              } ${gamePhase !== 'betting' ? 'opacity-50' : ''}`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🔵</div>
                <div className="text-xl font-bold">SMALL</div>
                <div className="text-sm opacity-90">0,1,2,3,4</div>
                <div className="text-lg font-bold mt-2 bg-white text-blue-600 rounded-lg py-1">×2</div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeBet('big')}
              disabled={gamePhase !== 'betting' || loading}
              className={`p-6 rounded-2xl bg-gradient-to-b from-orange-400 to-red-600 text-white font-bold shadow-xl ${
                selectedBet === 'big' ? 'ring-4 ring-yellow-400 ring-opacity-80' : ''
              } ${gamePhase !== 'betting' ? 'opacity-50' : ''}`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🟠</div>
                <div className="text-xl font-bold">BIG</div>
                <div className="text-sm opacity-90">5,6,7,8,9</div>
                <div className="text-lg font-bold mt-2 bg-white text-orange-600 rounded-lg py-1">×2</div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Number Grid */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Select Number</h3>
          <div className="grid grid-cols-5 gap-3">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => placeBet(num.toString())}
                disabled={gamePhase !== 'betting' || loading}
                className={`aspect-square rounded-2xl text-white font-bold text-2xl shadow-lg ${
                  getColorFromNumber(num) === 'red' ? 'bg-gradient-to-b from-red-400 to-red-600' :
                  getColorFromNumber(num) === 'green' ? 'bg-gradient-to-b from-green-400 to-green-600' :
                  'bg-gradient-to-b from-purple-400 to-purple-600'
                } ${selectedBet === num.toString() ? 'ring-4 ring-yellow-400 ring-opacity-80' : ''} ${
                  gamePhase !== 'betting' ? 'opacity-50' : ''
                }`}
              >
                {num}
              </motion.button>
            ))}
          </div>
          <div className="text-center text-lg text-yellow-300 mt-3 font-semibold">
            🎯 Win ×9 Times!
          </div>
        </div>

        {/* Bet Amount Controls */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Bet Amount</h3>
          <div className="flex items-center justify-between mb-4 bg-gray-800 rounded-2xl p-4">
            <button
              onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
              className="w-12 h-12 bg-red-500 rounded-full text-white font-bold shadow-lg"
            >
              -
            </button>
            <div className="text-3xl font-bold">₹{betAmount}</div>
            <button
              onClick={() => setBetAmount(Math.min(5000, betAmount + 10))}
              className="w-12 h-12 bg-green-500 rounded-full text-white font-bold shadow-lg"
            >
              +
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[10, 50, 100, 500].map(amount => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`py-3 px-4 rounded-xl font-bold transition-all ${
                  betAmount === amount 
                    ? 'bg-yellow-500 text-black shadow-lg scale-105' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
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
            className="mb-6 p-4 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl text-center shadow-lg"
          >
            <div className="font-bold text-lg">🎉 Bet Placed Successfully!</div>
            <div className="text-lg mt-1">
              {selectedBet?.toUpperCase()} - ₹{betAmount}
            </div>
          </motion.div>
        )}
      </div>

      {/* Game History */}
      <div className="p-4 bg-black/50 border-t border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center justify-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
          Recent Results
        </h3>
        <div className="space-y-3">
          {gameHistory.slice(0, 5).map((record, index) => (
            <motion.div 
              key={record.period}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between bg-gray-800/80 rounded-xl p-4"
            >
              <div className="text-sm font-mono text-gray-300">{record.period}</div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-bold text-lg">
                  {record.result}
                </div>
                <div className={`w-8 h-8 rounded-full ${
                  record.color === 'red' ? 'bg-red-500' :
                  record.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                }`}></div>
                <div className="text-base font-bold">
                  {record.size.toUpperCase()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}