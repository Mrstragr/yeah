import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plane, Plus, Minus } from 'lucide-react';
import { apiRequest } from '../lib/queryClient';
import { useSmartBalance } from '../hooks/useSmartBalance';

interface SimpleWorkingAviatorProps {
  onBack: () => void;
}

export default function SimpleWorkingAviator({ onBack }: SimpleWorkingAviatorProps) {
  const { balance, refreshBalance } = useSmartBalance();
  
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [betAmount, setBetAmount] = useState(10);
  const [hasBet, setHasBet] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [countdown, setCountdown] = useState(5);

  // Game timer
  useEffect(() => {
    if (gameState === 'waiting') {
      setCountdown(5);
      const countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            startGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdownTimer);
    }
  }, [gameState]);

  const startGame = () => {
    setGameState('flying');
    setCurrentMultiplier(1.00);
    setCashedOut(false);
    
    // Generate crash point
    const crashMultiplier = Math.random() * 10 + 1; // 1x to 11x
    setCrashPoint(crashMultiplier);

    const gameTimer = setInterval(() => {
      setCurrentMultiplier(prev => {
        const newMultiplier = prev + 0.01;
        
        if (newMultiplier >= crashMultiplier) {
          clearInterval(gameTimer);
          crash(crashMultiplier);
          return crashMultiplier;
        }
        
        return newMultiplier;
      });
    }, 100);
  };

  const crash = (finalMultiplier: number) => {
    setGameState('crashed');
    
    // Process losing bets
    if (hasBet && !cashedOut) {
      try {
        apiRequest('POST', '/api/games/bet', {
          gameId: 2,
          betAmount: betAmount,
          betType: 'aviator',
          won: false,
          winAmount: 0
        });
        refreshBalance();
      } catch (error) {
        console.error('Bet processing error:', error);
      }
    }

    setGameHistory(prev => [parseFloat(finalMultiplier.toFixed(2)), ...prev.slice(0, 9)]);
    
    setTimeout(() => {
      setGameState('waiting');
      setHasBet(false);
      setCrashPoint(null);
    }, 3000);
  };

  const placeBet = () => {
    if (gameState !== 'waiting' || parseInt(balance) < betAmount) return;
    setHasBet(true);
  };

  const cashOut = async () => {
    if (!hasBet || cashedOut || gameState !== 'flying') return;
    
    const winAmount = betAmount * currentMultiplier;
    setCashedOut(true);
    
    try {
      await apiRequest('POST', '/api/games/bet', {
        gameId: 2,
        betAmount: betAmount,
        betType: 'aviator',
        won: true,
        winAmount: winAmount
      });
      refreshBalance();
    } catch (error) {
      console.error('Cash out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center text-white">
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </button>
        <h1 className="text-xl font-bold">Simple Aviator</h1>
        <div className="text-right">
          <div className="text-sm">Balance</div>
          <div className="text-lg font-bold text-yellow-400">₹{balance}</div>
        </div>
      </div>

      {/* Game Display */}
      <div className="bg-black/30 rounded-2xl p-6 mb-6 h-64 flex flex-col items-center justify-center relative">
        <div className="absolute top-4 left-4">
          {gameState === 'waiting' && (
            <div className="text-xl font-bold text-yellow-400">
              Starting in {countdown}s
            </div>
          )}
          {gameState === 'flying' && (
            <div className="text-xl font-bold text-green-400 flex items-center">
              <Plane className="w-6 h-6 mr-2" />
              FLYING
            </div>
          )}
          {gameState === 'crashed' && (
            <div className="text-xl font-bold text-red-400">
              CRASHED!
            </div>
          )}
        </div>

        {/* Multiplier Display */}
        <div className={`text-6xl font-bold mb-4 ${
          gameState === 'crashed' ? 'text-red-400' : 'text-green-400'
        }`}>
          {currentMultiplier.toFixed(2)}x
        </div>

        {/* Plane Animation */}
        {gameState === 'flying' && (
          <motion.div
            className="text-4xl"
            animate={{ 
              x: [0, 50, 100],
              y: [0, -20, -40],
              rotate: [0, 15, 30]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ✈️
          </motion.div>
        )}

        {/* Cash Out Button */}
        {hasBet && gameState === 'flying' && !cashedOut && (
          <motion.button
            onClick={cashOut}
            className="absolute bottom-4 bg-green-500 px-6 py-3 rounded-lg font-bold text-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            Cash Out ₹{(betAmount * currentMultiplier).toFixed(2)}
          </motion.button>
        )}
      </div>

      {/* Game History */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-center">Recent Multipliers</h3>
        <div className="flex space-x-2 overflow-x-auto">
          {gameHistory.map((multiplier, index) => (
            <div
              key={index}
              className={`flex-shrink-0 px-3 py-2 rounded-full font-bold ${
                multiplier >= 2 ? 'bg-green-500' : multiplier >= 1.5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            >
              {multiplier.toFixed(2)}x
            </div>
          ))}
        </div>
      </div>

      {/* Betting Controls */}
      <div className="bg-white/10 rounded-lg p-4">
        {/* Bet Amount */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <span>Bet Amount</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="px-4 py-2 bg-black/50 rounded font-bold text-yellow-400">
                ₹{betAmount}
              </div>
              <button
                onClick={() => setBetAmount(betAmount + 10)}
                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex space-x-2">
            {[10, 50, 100, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`flex-1 py-2 rounded font-bold ${
                  betAmount === amount ? 'bg-yellow-500 text-black' : 'bg-white/20'
                }`}
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>

        {/* Bet Button */}
        <button
          onClick={placeBet}
          disabled={gameState !== 'waiting' || hasBet || parseInt(balance) < betAmount}
          className={`w-full py-3 rounded-lg font-bold text-lg ${
            hasBet 
              ? 'bg-gray-500' 
              : 'bg-blue-500 hover:bg-blue-400'
          } disabled:opacity-50`}
        >
          {hasBet ? `Bet Placed: ₹${betAmount}` : `Place Bet ₹${betAmount}`}
        </button>
      </div>
    </div>
  );
}