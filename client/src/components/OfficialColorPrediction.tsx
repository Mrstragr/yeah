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

interface ColorPredictionGameProps {
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

export default function OfficialColorPrediction({ onBack, user, onBalanceUpdate }: ColorPredictionGameProps) {
  // Game State
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes like bg-678
  const [gamePhase, setGamePhase] = useState<'betting' | 'waiting' | 'result'>('betting');
  
  // Betting State
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [balance, setBalance] = useState(parseFloat(user.walletBalance));
  const [loading, setLoading] = useState(false);
  const [hasBet, setHasBet] = useState(false);
  
  // Game Data
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([
    { period: '20241201001', result: 3, color: 'red', size: 'small', timestamp: new Date() },
    { period: '20241201002', result: 8, color: 'green', size: 'big', timestamp: new Date() },
    { period: '20241201003', result: 5, color: 'violet', size: 'big', timestamp: new Date() },
    { period: '20241201004', result: 2, color: 'green', size: 'small', timestamp: new Date() },
    { period: '20241201005', result: 7, color: 'red', size: 'big', timestamp: new Date() },
  ]);
  const [currentResult, setCurrentResult] = useState<GameRecord | null>(null);

  // Exact bg-678 color logic
  const getColorFromNumber = (num: number): 'red' | 'green' | 'violet' => {
    if (num === 0 || num === 5) return 'violet';
    if (num % 2 === 1) return 'red'; // 1,3,7,9
    return 'green'; // 2,4,6,8
  };

  const getSizeFromNumber = (num: number): 'big' | 'small' => {
    return num >= 5 ? 'big' : 'small';
  };

  // Generate period like bg-678
  const generatePeriod = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const minutes = Math.floor(now.getMinutes() / 3) + 1;
    return `${year}${month}${day}${String(minutes).padStart(3, '0')}`;
  };

  // Timer and game loop
  useEffect(() => {
    setCurrentPeriod(generatePeriod());
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (gamePhase === 'betting') {
            startWaitingPhase();
            return 30; // 30 seconds waiting
          } else if (gamePhase === 'waiting') {
            showResult();
            return 10; // 10 seconds result display
          } else {
            startNewRound();
            return 180; // 3 minutes betting
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
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white">
      {/* Header - bg-678 Style */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-white"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="font-semibold">Back</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold">Win Go</h1>
          <div className="text-sm opacity-90">3Min</div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold">₹{balance.toFixed(2)}</div>
          <div className="text-sm opacity-90">Balance</div>
        </div>
      </div>

      {/* Game Info Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
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
            <div className="text-2xl font-bold text-yellow-300">
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80">Round</div>
            <div className="font-bold">{gameHistory.length + 1}</div>
          </div>
        </div>
      </div>

      {/* Current Result Display */}
      {currentResult && gamePhase === 'result' && (
        <div className="p-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-center">
          <div className="text-lg font-semibold mb-2">Latest Result</div>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black text-2xl font-bold">
              {currentResult.result}
            </div>
            <div className="text-center">
              <div className={`w-8 h-8 rounded-full mx-auto mb-1 ${
                currentResult.color === 'red' ? 'bg-red-500' :
                currentResult.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
              }`}></div>
              <div className="text-sm font-semibold">
                {currentResult.color.toUpperCase()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">
                {currentResult.size.toUpperCase()}
              </div>
              <div className="text-sm">({currentResult.result >= 5 ? '5-9' : '0-4'})</div>
            </div>
          </div>
        </div>
      )}

      {/* Betting Options - Exact bg-678 Layout */}
      <div className="p-4">
        {/* Color Betting */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Select Color</h3>
          <div className="grid grid-cols-3 gap-3">
            {/* Green */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeBet('green')}
              disabled={gamePhase !== 'betting' || loading}
              className={`p-4 rounded-xl bg-gradient-to-b from-green-400 to-green-600 text-white font-bold shadow-lg ${
                selectedBet === 'green' ? 'ring-4 ring-yellow-400' : ''
              } ${gamePhase !== 'betting' ? 'opacity-50' : ''}`}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2 border-2 border-white shadow-md"></div>
                <div className="text-sm">GREEN</div>
                <div className="text-xs opacity-90">2,4,6,8</div>
                <div className="text-sm font-bold mt-1">×2</div>
              </div>
            </motion.button>

            {/* Violet */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeBet('violet')}
              disabled={gamePhase !== 'betting' || loading}
              className={`p-4 rounded-xl bg-gradient-to-b from-purple-400 to-purple-600 text-white font-bold shadow-lg ${
                selectedBet === 'violet' ? 'ring-4 ring-yellow-400' : ''
              } ${gamePhase !== 'betting' ? 'opacity-50' : ''}`}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-2 border-2 border-white shadow-md"></div>
                <div className="text-sm">VIOLET</div>
                <div className="text-xs opacity-90">0,5</div>
                <div className="text-sm font-bold mt-1">×4.5</div>
              </div>
            </motion.button>

            {/* Red */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeBet('red')}
              disabled={gamePhase !== 'betting' || loading}
              className={`p-4 rounded-xl bg-gradient-to-b from-red-400 to-red-600 text-white font-bold shadow-lg ${
                selectedBet === 'red' ? 'ring-4 ring-yellow-400' : ''
              } ${gamePhase !== 'betting' ? 'opacity-50' : ''}`}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-2 border-2 border-white shadow-md"></div>
                <div className="text-sm">RED</div>
                <div className="text-xs opacity-90">1,3,7,9</div>
                <div className="text-sm font-bold mt-1">×2</div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Size Betting */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Select Size</h3>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeBet('small')}
              disabled={gamePhase !== 'betting' || loading}
              className={`p-4 rounded-xl bg-gradient-to-b from-blue-400 to-blue-600 text-white font-bold shadow-lg ${
                selectedBet === 'small' ? 'ring-4 ring-yellow-400' : ''
              } ${gamePhase !== 'betting' ? 'opacity-50' : ''}`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🔵</div>
                <div className="text-lg">SMALL</div>
                <div className="text-sm opacity-90">0,1,2,3,4</div>
                <div className="text-sm font-bold mt-1">×2</div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeBet('big')}
              disabled={gamePhase !== 'betting' || loading}
              className={`p-4 rounded-xl bg-gradient-to-b from-orange-400 to-orange-600 text-white font-bold shadow-lg ${
                selectedBet === 'big' ? 'ring-4 ring-yellow-400' : ''
              } ${gamePhase !== 'betting' ? 'opacity-50' : ''}`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🟠</div>
                <div className="text-lg">BIG</div>
                <div className="text-sm opacity-90">5,6,7,8,9</div>
                <div className="text-sm font-bold mt-1">×2</div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Number Betting */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Select Number</h3>
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => placeBet(num.toString())}
                disabled={gamePhase !== 'betting' || loading}
                className={`aspect-square rounded-xl text-white font-bold text-lg shadow-lg ${
                  getColorFromNumber(num) === 'red' ? 'bg-gradient-to-b from-red-400 to-red-600' :
                  getColorFromNumber(num) === 'green' ? 'bg-gradient-to-b from-green-400 to-green-600' :
                  'bg-gradient-to-b from-purple-400 to-purple-600'
                } ${selectedBet === num.toString() ? 'ring-4 ring-yellow-400' : ''} ${
                  gamePhase !== 'betting' ? 'opacity-50' : ''
                }`}
              >
                {num}
              </motion.button>
            ))}
          </div>
          <div className="text-center text-sm text-gray-300 mt-2">
            Payout: ×9
          </div>
        </div>

        {/* Bet Amount */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Bet Amount</h3>
          <div className="flex items-center justify-between mb-3 bg-gray-800 rounded-xl p-3">
            <button
              onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
              className="w-10 h-10 bg-red-500 rounded-full text-white font-bold"
            >
              -
            </button>
            <div className="text-2xl font-bold">₹{betAmount}</div>
            <button
              onClick={() => setBetAmount(Math.min(5000, betAmount + 10))}
              className="w-10 h-10 bg-green-500 rounded-full text-white font-bold"
            >
              +
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[10, 50, 100, 500].map(amount => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
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
          <div className="mb-4 p-3 bg-green-600 rounded-xl text-center">
            <div className="font-bold">Bet Placed!</div>
            <div className="text-sm">
              {selectedBet} - ₹{betAmount}
            </div>
          </div>
        )}
      </div>

      {/* Game History */}
      <div className="p-4 bg-black/50">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Recent Results
        </h3>
        <div className="space-y-2">
          {gameHistory.slice(0, 5).map((record, index) => (
            <div key={record.period} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
              <div className="text-sm font-mono">{record.period}</div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold">
                  {record.result}
                </div>
                <div className={`w-6 h-6 rounded-full ${
                  record.color === 'red' ? 'bg-red-500' :
                  record.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                }`}></div>
                <div className="text-sm font-semibold">
                  {record.size.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}