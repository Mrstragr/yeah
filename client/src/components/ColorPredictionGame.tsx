import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Zap, Trophy, TrendingUp } from 'lucide-react';

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
  timestamp: Date;
}

export default function ColorPredictionGame({ onBack, user, onBalanceUpdate }: ColorPredictionGameProps) {
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [selectedColor, setSelectedColor] = useState<'red' | 'green' | 'violet' | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [gamePhase, setGamePhase] = useState<'betting' | 'waiting' | 'result'>('betting');
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);
  const [currentResult, setCurrentResult] = useState<GameRecord | null>(null);
  const [balance, setBalance] = useState(parseFloat(user.walletBalance));
  const [loading, setLoading] = useState(false);
  const [betMultiplier, setBetMultiplier] = useState(1);

  // Color mapping based on bg-678 style
  const getColorFromNumber = (num: number): 'red' | 'green' | 'violet' => {
    if (num === 0 || num === 5) return 'violet';
    if (num % 2 === 1) return 'red';
    return 'green';
  };

  // Generate period ID
  const generatePeriod = (): string => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = Math.floor(now.getMinutes() / 3) * 3;
    const minuteStr = minute.toString().padStart(2, '0');
    return `${year}${month}${day}${hour}${minuteStr}`;
  };

  // Initialize game
  useEffect(() => {
    setCurrentPeriod(generatePeriod());
    
    // Initialize with some historical data
    const history: GameRecord[] = [];
    for (let i = 9; i >= 0; i--) {
      const result = Math.floor(Math.random() * 10);
      const color = getColorFromNumber(result);
      const time = new Date(Date.now() - (i + 1) * 3 * 60 * 1000);
      history.push({
        period: generatePeriod(),
        result,
        color,
        timestamp: time
      });
    }
    setGameHistory(history);
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (gamePhase === 'betting') {
            setGamePhase('waiting');
            return 30; // 30 seconds waiting phase
          } else if (gamePhase === 'waiting') {
            // Generate result
            const result = Math.floor(Math.random() * 10);
            const color = getColorFromNumber(result);
            const newRecord: GameRecord = {
              period: currentPeriod,
              result,
              color,
              timestamp: new Date()
            };
            setCurrentResult(newRecord);
            setGameHistory(prev => [newRecord, ...prev.slice(0, 9)]);
            setGamePhase('result');
            return 10; // 10 seconds result display
          } else {
            // Start new round
            setCurrentPeriod(generatePeriod());
            setGamePhase('betting');
            setCurrentResult(null);
            setSelectedColor(null);
            setSelectedNumber(null);
            return 180; // 3 minutes betting
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase, currentPeriod]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const placeBet = async () => {
    if (!selectedColor && selectedNumber === null) {
      alert('Please select a color or number to bet on');
      return;
    }

    if (betAmount > balance) {
      alert('Insufficient balance');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/games/bet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameType: 'color-prediction',
          betAmount,
          betData: {
            color: selectedColor,
            number: selectedNumber,
            period: currentPeriod,
            multiplier: betMultiplier
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBalance(prev => prev - betAmount);
        onBalanceUpdate();
        alert(`Bet placed successfully! Period: ${currentPeriod}`);
      } else {
        alert(data.message || 'Failed to place bet');
      }
    } catch (error) {
      console.error('Betting error:', error);
      alert('Connection error while placing bet');
    } finally {
      setLoading(false);
    }
  };

  const getColorClass = (color: 'red' | 'green' | 'violet') => {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'green': return 'bg-green-500';
      case 'violet': return 'bg-purple-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20">
        <button onClick={onBack} className="text-white p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <div className="text-white font-bold text-lg">Color Prediction</div>
          <div className="text-yellow-300 text-sm">Period: {currentPeriod}</div>
        </div>
        <div className="text-right">
          <div className="text-yellow-300 text-sm">Balance</div>
          <div className="text-white font-bold">₹{balance.toFixed(2)}</div>
        </div>
      </div>

      {/* Timer */}
      <div className="mx-4 my-4 bg-black/30 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-white">
            <Clock className="w-5 h-5 mr-2" />
            <span className="font-semibold">
              {gamePhase === 'betting' ? 'Betting Time' : 
               gamePhase === 'waiting' ? 'Waiting for Result' : 'Result'}
            </span>
          </div>
          <div className={`text-2xl font-bold ${
            timeLeft <= 30 ? 'text-red-400' : 'text-yellow-300'
          }`}>
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              gamePhase === 'betting' ? 'bg-green-500' :
              gamePhase === 'waiting' ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            style={{
              width: gamePhase === 'betting' ? `${(timeLeft / 180) * 100}%` :
                     gamePhase === 'waiting' ? `${(timeLeft / 30) * 100}%` :
                     `${(timeLeft / 10) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Current Result Display */}
      <AnimatePresence>
        {currentResult && gamePhase === 'result' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="mx-4 mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-center"
          >
            <div className="text-black font-bold text-lg mb-2">RESULT</div>
            <div className="flex items-center justify-center space-x-4">
              <div className={`w-16 h-16 ${getColorClass(currentResult.color)} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                {currentResult.result}
              </div>
              <div className="text-black">
                <div className="text-2xl font-bold">{currentResult.result}</div>
                <div className="text-sm uppercase">{currentResult.color}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Betting Section */}
      {gamePhase === 'betting' && (
        <div className="px-4">
          {/* Color Selection */}
          <div className="bg-black/30 rounded-2xl p-4 mb-4">
            <div className="text-white font-semibold mb-3">Select Color</div>
            <div className="grid grid-cols-3 gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedColor('green');
                  setSelectedNumber(null);
                  setBetMultiplier(2);
                }}
                className={`bg-green-500 rounded-xl p-4 text-white font-bold text-lg relative ${
                  selectedColor === 'green' ? 'ring-4 ring-yellow-300' : ''
                }`}
              >
                GREEN
                <div className="text-xs mt-1">2x</div>
                {selectedColor === 'green' && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedColor('violet');
                  setSelectedNumber(null);
                  setBetMultiplier(4.5);
                }}
                className={`bg-purple-500 rounded-xl p-4 text-white font-bold text-lg relative ${
                  selectedColor === 'violet' ? 'ring-4 ring-yellow-300' : ''
                }`}
              >
                VIOLET
                <div className="text-xs mt-1">4.5x</div>
                {selectedColor === 'violet' && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedColor('red');
                  setSelectedNumber(null);
                  setBetMultiplier(2);
                }}
                className={`bg-red-500 rounded-xl p-4 text-white font-bold text-lg relative ${
                  selectedColor === 'red' ? 'ring-4 ring-yellow-300' : ''
                }`}
              >
                RED
                <div className="text-xs mt-1">2x</div>
                {selectedColor === 'red' && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                )}
              </motion.button>
            </div>
          </div>

          {/* Number Selection */}
          <div className="bg-black/30 rounded-2xl p-4 mb-4">
            <div className="text-white font-semibold mb-3">Select Number (9x payout)</div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedNumber(num);
                    setSelectedColor(null);
                    setBetMultiplier(9);
                  }}
                  className={`aspect-square rounded-xl text-white font-bold text-lg relative ${
                    num === 0 || num === 5 ? 'bg-purple-500' :
                    num % 2 === 1 ? 'bg-red-500' : 'bg-green-500'
                  } ${selectedNumber === num ? 'ring-4 ring-yellow-300' : ''}`}
                >
                  {num}
                  {selectedNumber === num && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center text-black text-xs">
                      ✓
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Bet Amount */}
          <div className="bg-black/30 rounded-2xl p-4 mb-4">
            <div className="text-white font-semibold mb-3">Bet Amount</div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                className="bg-red-500 p-3 rounded-lg text-white font-bold"
              >
                -10
              </button>
              <div className="text-white text-xl font-bold">₹{betAmount}</div>
              <button
                onClick={() => setBetAmount(betAmount + 10)}
                className="bg-green-500 p-3 rounded-lg text-white font-bold"
              >
                +10
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[10, 50, 100, 500].map(amount => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`py-2 rounded-lg font-medium ${
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

          {/* Place Bet Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={placeBet}
            disabled={loading || (!selectedColor && selectedNumber === null)}
            className={`w-full py-4 rounded-2xl font-bold text-lg mb-4 ${
              loading || (!selectedColor && selectedNumber === null)
                ? 'bg-gray-600 text-gray-400'
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
            }`}
          >
            {loading ? 'Placing Bet...' : 
             `Place Bet ₹${betAmount} (${betMultiplier}x payout)`}
          </motion.button>
        </div>
      )}

      {/* Game History */}
      <div className="px-4 pb-20">
        <div className="bg-black/30 rounded-2xl p-4">
          <div className="text-white font-semibold mb-3 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Recent Results
          </div>
          <div className="grid grid-cols-5 gap-2">
            {gameHistory.slice(0, 10).map((record, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 ${getColorClass(record.color)} rounded-lg flex items-center justify-center text-white font-bold mb-1 mx-auto`}>
                  {record.result}
                </div>
                <div className="text-white text-xs">{record.period.slice(-4)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}