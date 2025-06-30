import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, Target, TrendingUp } from 'lucide-react';

interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  isVerified: boolean;
}

interface DiceGameProps {
  onBack: () => void;
  user: User;
  onBalanceUpdate: () => void;
}

interface DiceResult {
  value: number;
  timestamp: Date;
  won: boolean;
  prediction: 'over' | 'under';
  threshold: number;
}

export default function OfficialDice({ onBack, user, onBalanceUpdate }: DiceGameProps) {
  // Game State
  const [diceValue, setDiceValue] = useState(50);
  const [threshold, setThreshold] = useState(50);
  const [prediction, setPrediction] = useState<'over' | 'under'>('over');
  const [betAmount, setBetAmount] = useState(10);
  const [balance, setBalance] = useState(parseFloat(user.walletBalance));
  const [isRolling, setIsRolling] = useState(false);
  const [gameHistory, setGameHistory] = useState<DiceResult[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<DiceResult | null>(null);

  // Calculate payout multiplier based on probability
  const calculateMultiplier = () => {
    const winChance = prediction === 'over' ? (100 - threshold) : threshold;
    return Math.max(1.1, (95 / winChance)); // 95% house edge
  };

  const rollDice = async () => {
    if (betAmount > balance || isRolling) return;
    
    setIsRolling(true);
    setBalance(prev => prev - betAmount);
    
    // Animate dice rolling
    const rollAnimation = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 100) + 1);
    }, 100);

    setTimeout(() => {
      clearInterval(rollAnimation);
      
      // Final result
      const finalValue = Math.floor(Math.random() * 100) + 1;
      setDiceValue(finalValue);
      
      const won = (prediction === 'over' && finalValue > threshold) || 
                   (prediction === 'under' && finalValue < threshold);
      
      const result: DiceResult = {
        value: finalValue,
        timestamp: new Date(),
        won,
        prediction,
        threshold
      };
      
      setLastResult(result);
      setGameHistory(prev => [result, ...prev.slice(0, 9)]);
      
      if (won) {
        const winAmount = betAmount * calculateMultiplier();
        setBalance(prev => prev + winAmount);
        onBalanceUpdate();
      }
      
      setShowResult(true);
      setIsRolling(false);
      
      setTimeout(() => {
        setShowResult(false);
      }, 3000);
    }, 2000);
  };

  const getResultColor = (value: number) => {
    if (value <= 25) return 'from-red-500 to-red-600';
    if (value <= 50) return 'from-orange-500 to-orange-600';
    if (value <= 75) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-900 via-red-900 to-black text-white max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center space-x-2 text-white">
          <ArrowLeft className="w-6 h-6" />
          <span className="font-semibold">Back</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold">DICE GAME</h1>
          <div className="text-sm opacity-90">Predict the Number</div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold">₹{balance.toFixed(2)}</div>
          <div className="text-sm opacity-90">Balance</div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="p-6">
        {/* Dice Display */}
        <div className="text-center mb-8">
          <motion.div
            className={`w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br ${getResultColor(diceValue)} shadow-2xl flex items-center justify-center mb-4`}
            animate={isRolling ? { rotateX: 360, rotateY: 360 } : {}}
            transition={{ duration: 0.2, repeat: isRolling ? Infinity : 0 }}
          >
            <div className="text-4xl font-bold text-white">
              {diceValue}
            </div>
          </motion.div>
          
          {showResult && lastResult && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`p-4 rounded-xl ${lastResult.won ? 'bg-green-600' : 'bg-red-600'}`}
            >
              <div className="text-xl font-bold">
                {lastResult.won ? '🎉 YOU WON!' : '💸 TRY AGAIN'}
              </div>
              {lastResult.won && (
                <div className="text-lg">
                  Won ₹{(betAmount * calculateMultiplier()).toFixed(2)}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Threshold Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">Threshold: {threshold}</span>
            <span className="text-lg font-semibold">Multiplier: {calculateMultiplier().toFixed(2)}x</span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="1"
              max="99"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value))}
              disabled={isRolling}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div 
              className="absolute top-0 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg pointer-events-none"
              style={{ width: `${threshold}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-300 mt-1">
            <span>1</span>
            <span>50</span>
            <span>99</span>
          </div>
        </div>

        {/* Prediction Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPrediction('under')}
            className={`p-6 rounded-2xl font-bold text-lg shadow-lg ${
              prediction === 'under' 
                ? 'bg-gradient-to-b from-blue-500 to-blue-600 ring-4 ring-yellow-400' 
                : 'bg-gradient-to-b from-blue-400 to-blue-500'
            }`}
            disabled={isRolling}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">📉</div>
              <div>UNDER {threshold}</div>
              <div className="text-sm opacity-90">Win Chance: {threshold}%</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPrediction('over')}
            className={`p-6 rounded-2xl font-bold text-lg shadow-lg ${
              prediction === 'over' 
                ? 'bg-gradient-to-b from-green-500 to-green-600 ring-4 ring-yellow-400' 
                : 'bg-gradient-to-b from-green-400 to-green-500'
            }`}
            disabled={isRolling}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <div>OVER {threshold}</div>
              <div className="text-sm opacity-90">Win Chance: {100 - threshold}%</div>
            </div>
          </motion.button>
        </div>

        {/* Bet Amount */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Bet Amount</h3>
          <div className="flex items-center justify-between mb-3 bg-gray-800 rounded-xl p-3">
            <button
              onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
              className="w-10 h-10 bg-red-500 rounded-full text-white font-bold"
              disabled={isRolling}
            >
              -
            </button>
            <div className="text-2xl font-bold">₹{betAmount}</div>
            <button
              onClick={() => setBetAmount(Math.min(5000, betAmount + 10))}
              className="w-10 h-10 bg-green-500 rounded-full text-white font-bold"
              disabled={isRolling}
            >
              +
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[10, 50, 100, 500].map(amount => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                disabled={isRolling}
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

        {/* Roll Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={rollDice}
          disabled={isRolling || betAmount > balance}
          className={`w-full py-6 rounded-2xl font-bold text-xl shadow-lg ${
            isRolling || betAmount > balance
              ? 'bg-gray-600 text-gray-400'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
          }`}
        >
          {isRolling ? 'ROLLING...' : `ROLL DICE - ₹${betAmount}`}
        </motion.button>

        {/* Potential Win */}
        <div className="text-center mt-4 p-3 bg-gray-800 rounded-xl">
          <div className="text-sm text-gray-400">Potential Win</div>
          <div className="text-2xl font-bold text-green-400">
            ₹{(betAmount * calculateMultiplier()).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Game History */}
      <div className="p-4 bg-black/50 border-t border-gray-700">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Recent Rolls
        </h3>
        <div className="space-y-2">
          {gameHistory.slice(0, 5).map((result, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getResultColor(result.value)} flex items-center justify-center font-bold`}>
                  {result.value}
                </div>
                <div className="text-sm">
                  <div>{result.prediction.toUpperCase()} {result.threshold}</div>
                  <div className="text-gray-400">{result.timestamp.toLocaleTimeString()}</div>
                </div>
              </div>
              <div className={`font-bold ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                {result.won ? 'WIN' : 'LOSE'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}