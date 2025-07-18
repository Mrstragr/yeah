import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { apiRequest } from '../lib/queryClient';
import { useSmartBalance } from '../hooks/useSmartBalance';

interface SimpleWorkingAviatorProps {
  onBack: () => void;
  balance?: number;
  onUpdateBalance?: (newBalance: number) => void;
}

export default function SimpleWorkingAviator({ onBack, balance: propBalance, onUpdateBalance }: SimpleWorkingAviatorProps) {
  const { balance: smartBalance, refreshBalance } = useSmartBalance();
  const balance = propBalance ?? smartBalance;
  
  const [gamePhase, setGamePhase] = useState<'betting' | 'flying' | 'crashed'>('betting');
  const [multiplier, setMultiplier] = useState(1.00);
  const [betAmount, setBetAmount] = useState(10);
  const [hasBet, setHasBet] = useState(false);
  const [hasPlacedBet, setHasPlacedBet] = useState(false);
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [lastCrash, setLastCrash] = useState<number>(0);
  const [cashOutAt, setCashOutAt] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [winAmount, setWinAmount] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [isCountingDown, setIsCountingDown] = useState(false);
  
  const gameRef = useRef<number>(0);
  const crashPoint = useRef<number>(0);
  const gameSpeed = useRef<number>(0.05);

  // Game cycle
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setIsCountingDown(true);
    setGamePhase('betting');
    setMultiplier(1.00);
    setHasBet(false);
    setHasPlacedBet(false);
    setShowResult(false);
    setCountdown(5);
    
    // Generate crash point (1.00 to 10.00)
    const random = Math.random();
    crashPoint.current = Math.max(1.00, Math.min(10.00, 1 + Math.pow(random, 2) * 9));
    
    // Countdown
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          setIsCountingDown(false);
          startFlying();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startFlying = () => {
    setGamePhase('flying');
    gameSpeed.current = 0.05 + Math.random() * 0.03;
    
    gameRef.current = setInterval(() => {
      setMultiplier(prev => {
        const newMultiplier = prev + gameSpeed.current;
        
        if (newMultiplier >= crashPoint.current) {
          clearInterval(gameRef.current);
          crashGame();
          return crashPoint.current;
        }
        
        return newMultiplier;
      });
    }, 100);
  };

  const crashGame = () => {
    setGamePhase('crashed');
    setLastCrash(crashPoint.current);
    setGameHistory(prev => [crashPoint.current, ...prev.slice(0, 9)]);
    
    // Check if player had bet and didn't cash out
    if (hasPlacedBet && !cashOutAt) {
      setResultMessage('You lost! Plane crashed before cash out.');
      setWinAmount(0);
      setShowResult(true);
    }
    
    // Start next game after delay
    setTimeout(() => {
      startNewGame();
    }, 3000);
  };

  const placeBet = async () => {
    if (betAmount > balance) {
      alert('Insufficient balance!');
      return;
    }
    
    setHasPlacedBet(true);
    setHasBet(true);
    setCashOutAt(0);
    
    // Deduct bet amount
    if (onUpdateBalance) {
      onUpdateBalance(balance - betAmount);
    }
    
    // Try to make API call to track bet
    try {
      await apiRequest('/api/games/play', {
        method: 'POST',
        body: {
          gameType: 'aviator',
          betAmount: betAmount,
          action: 'place_bet'
        }
      });
    } catch (error) {
      console.log('API call failed, continuing with demo mode');
    }
  };

  const cashOut = async () => {
    if (!hasPlacedBet || cashOutAt > 0) return;
    
    setCashOutAt(multiplier);
    const winnings = betAmount * multiplier;
    setWinAmount(winnings);
    setResultMessage(`Cashed out at ${multiplier.toFixed(2)}x!`);
    setShowResult(true);
    
    // Add winnings to balance
    if (onUpdateBalance) {
      onUpdateBalance(balance + winnings);
    }
    
    // Try to make API call to track win
    try {
      await apiRequest('/api/games/play', {
        method: 'POST',
        body: {
          gameType: 'aviator',
          betAmount: betAmount,
          multiplier: multiplier,
          winAmount: winnings,
          action: 'cash_out'
        }
      });
    } catch (error) {
      console.log('API call failed, continuing with demo mode');
    }
  };

  const getMultiplierColor = (mult: number) => {
    if (mult < 2) return 'text-green-400';
    if (mult < 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 flex items-center">
          <button
            onClick={onBack}
            className="mr-3 p-2 rounded-full bg-black bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-white text-lg font-bold">✈️ Aviator</h1>
          <div className="ml-auto bg-black bg-opacity-20 px-3 py-1 rounded-full">
            <span className="text-sm">₹{balance.toLocaleString()}</span>
          </div>
        </div>

        {/* Game Area */}
        <div className="p-4">
          {/* Game Display */}
          <div className="bg-gray-800 rounded-xl p-6 mb-4 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
            </div>
            
            <div className="relative z-10">
              {/* Game Status */}
              <div className="text-center mb-4">
                {isCountingDown ? (
                  <div className="text-4xl font-bold text-yellow-400">
                    {countdown}
                  </div>
                ) : gamePhase === 'betting' ? (
                  <div className="text-lg text-gray-300">Place your bets!</div>
                ) : gamePhase === 'flying' ? (
                  <div className="text-lg text-green-400">✈️ Flying...</div>
                ) : (
                  <div className="text-lg text-red-400">💥 Crashed!</div>
                )}
              </div>

              {/* Multiplier Display */}
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold ${getMultiplierColor(multiplier)}`}>
                  {multiplier.toFixed(2)}x
                </div>
                {gamePhase === 'crashed' && (
                  <div className="text-red-400 text-lg mt-2">
                    Crashed at {lastCrash.toFixed(2)}x
                  </div>
                )}
              </div>

              {/* Result Display */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center mb-4"
                  >
                    <div className={`text-lg font-semibold ${winAmount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {resultMessage}
                    </div>
                    {winAmount > 0 && (
                      <div className="text-2xl font-bold text-green-400">
                        +₹{winAmount.toFixed(2)}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Game History */}
          <div className="bg-gray-800 rounded-xl p-4 mb-4">
            <h3 className="text-white font-semibold mb-2">Recent Results</h3>
            <div className="flex space-x-2 overflow-x-auto">
              {gameHistory.map((crash, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-sm ${
                    crash >= 2 ? 'bg-green-600' : 'bg-red-600'
                  }`}
                >
                  {crash.toFixed(2)}x
                </div>
              ))}
            </div>
          </div>

          {/* Betting Controls */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-300">Bet Amount:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setBetAmount(Math.max(1, betAmount - 10))}
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-bold text-white min-w-[80px] text-center">
                  ₹{betAmount}
                </span>
                <button
                  onClick={() => setBetAmount(betAmount + 10)}
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {!hasPlacedBet ? (
                <button
                  onClick={placeBet}
                  disabled={gamePhase !== 'betting' || betAmount > balance}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all"
                >
                  Place Bet (₹{betAmount})
                </button>
              ) : (
                <button
                  onClick={cashOut}
                  disabled={gamePhase !== 'flying' || cashOutAt > 0}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    cashOutAt > 0 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-yellow-600 hover:bg-yellow-700 animate-pulse'
                  }`}
                >
                  {cashOutAt > 0 ? `Cashed Out (${cashOutAt.toFixed(2)}x)` : 'CASH OUT'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}