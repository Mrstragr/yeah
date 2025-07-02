import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Zap, Target, TrendingUp, Crown, Gift, Eye } from 'lucide-react';
import CongratulationsPopup from './CongratulationsPopup';

interface EnhancedBG678InterfaceProps {
  onBack: () => void;
  balance: string;
  updateBalance: (amount: number, type: 'add' | 'subtract') => void;
}

export default function EnhancedBG678Interface({ onBack, balance, updateBalance }: EnhancedBG678InterfaceProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState(100);
  const [gameResult, setGameResult] = useState<number[] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [period, setPeriod] = useState('20250624205053');
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [winAmount, setWinAmount] = useState(0);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Start new round
          return 180;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const winGoNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const colors = ['green', 'red', 'green', 'red', 'green', 'red', 'green', 'red', 'green', 'red'];
  const sizes = ['big', 'small', 'big', 'small', 'big', 'small', 'big', 'small', 'big', 'small'];

  const toggleNumber = (num: number) => {
    setSelectedNumbers(prev => 
      prev.includes(num) 
        ? prev.filter(n => n !== num)
        : [...prev, num]
    );
  };

  const playGame = async () => {
    if (selectedNumbers.length === 0 || parseFloat(balance) < betAmount) return;

    setIsPlaying(true);
    updateBalance(betAmount, 'subtract');

    // Simulate game result
    setTimeout(() => {
      const result = [Math.floor(Math.random() * 10)];
      setGameResult(result);
      
      // Check if won
      if (selectedNumbers.includes(result[0])) {
        const winnings = betAmount * 9;
        setWinAmount(winnings);
        updateBalance(winnings, 'add');
        setShowWinPopup(true);
      }
      
      setIsPlaying(false);
      setSelectedNumbers([]);
    }, 3000);
  };

  const quickBetAmounts = [100, 500, 1000, 5000];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-white text-lg font-bold">BG678</h1>
          <p className="text-green-100 text-sm">Win Go • 3 minute</p>
        </div>
        <div className="text-right">
          <div className="text-white text-sm">Balance</div>
          <div className="text-yellow-300 font-bold">₹{balance}</div>
        </div>
      </div>

      {/* Game Info Bar */}
      <div className="bg-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-semibold">Time remaining</span>
          </div>
          <motion.div
            key={timeRemaining}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg"
          >
            {formatTime(timeRemaining)}
          </motion.div>
        </div>
        
        <div className="bg-black/20 rounded-lg p-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Period</span>
            <span className="text-white font-mono">{period}</span>
          </div>
        </div>
      </div>

      {/* Game Result Display */}
      {gameResult && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center">
            <h3 className="text-white text-sm mb-3">Latest Result</h3>
            <div className="flex justify-center space-x-2">
              {gameResult.map((num, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                    colors[num] === 'green' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {num}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Betting Interface */}
      <div className="p-4 space-y-4">
        {/* Color Betting */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
          <h3 className="text-white text-sm font-semibold mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Color Prediction
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <button className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition-colors">
              Green • 2x
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-bold transition-colors">
              Violet • 4.5x
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold transition-colors">
              Red • 2x
            </button>
          </div>
        </div>

        {/* Number Betting */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
          <h3 className="text-white text-sm font-semibold mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Number Selection • 9x
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {winGoNumbers.map((num) => (
              <motion.button
                key={num}
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleNumber(num)}
                className={`aspect-square rounded-lg font-bold text-white transition-all ${
                  selectedNumbers.includes(num)
                    ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50'
                    : colors[num] === 'green'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {num}
              </motion.button>
            ))}
          </div>
          
          {selectedNumbers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30"
            >
              <p className="text-yellow-300 text-sm">
                Selected: {selectedNumbers.join(', ')} • Potential win: ₹{(betAmount * 9).toLocaleString()}
              </p>
            </motion.div>
          )}
        </div>

        {/* Size Betting */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
          <h3 className="text-white text-sm font-semibold mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Size Prediction
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold transition-colors">
              Big (5-9) • 2x
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold transition-colors">
              Small (0-4) • 2x
            </button>
          </div>
        </div>

        {/* Bet Amount */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
          <h3 className="text-white text-sm font-semibold mb-3">Bet Amount</h3>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {quickBetAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  betAmount === amount
                    ? 'bg-yellow-500 text-black'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                ₹{amount}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="flex-1 bg-black/20 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-yellow-500 focus:outline-none"
              placeholder="Enter amount"
            />
            <button
              onClick={playGame}
              disabled={isPlaying || selectedNumbers.length === 0 || parseFloat(balance) < betAmount}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-black disabled:text-gray-400 px-6 py-3 rounded-lg font-bold transition-all flex items-center space-x-2"
            >
              {isPlaying ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                  />
                  <span>Playing...</span>
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4" />
                  <span>Play</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
          <h3 className="text-white text-sm font-semibold mb-3 flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            Game Statistics
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-green-400 text-lg font-bold">22</div>
              <div className="text-white/70 text-xs">Green</div>
            </div>
            <div>
              <div className="text-purple-400 text-lg font-bold">4.5x</div>
              <div className="text-white/70 text-xs">Violet</div>
            </div>
            <div>
              <div className="text-red-400 text-lg font-bold">2x</div>
              <div className="text-white/70 text-xs">Red</div>
            </div>
          </div>
        </div>
      </div>

      {/* Congratulations Popup */}
      <CongratulationsPopup
        isOpen={showWinPopup}
        onClose={() => setShowWinPopup(false)}
        winAmount={winAmount}
        gameType="Win Go"
        multiplier={9}
      />
    </div>
  );
}