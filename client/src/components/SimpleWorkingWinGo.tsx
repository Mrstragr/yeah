import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { apiRequest } from '../lib/queryClient';
import { useSmartBalance } from '../hooks/useSmartBalance';

interface SimpleWorkingWinGoProps {
  onBack: () => void;
}

export default function SimpleWorkingWinGo({ onBack }: SimpleWorkingWinGoProps) {
  const { balance, refreshBalance } = useSmartBalance();
  
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState(10);
  const [activeBet, setActiveBet] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [gameActive, setGameActive] = useState(true);

  // Generate period
  const generatePeriod = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const periods30s = Math.floor((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 30);
    const sequence = String(periods30s).padStart(4, '0');
    return `${year}${month}${day}${sequence}`;
  };

  // Initialize timer
  useEffect(() => {
    setCurrentPeriod(generatePeriod());
    
    const timer = setInterval(() => {
      const now = new Date();
      const secondsInPeriod = now.getSeconds() % 30;
      const remaining = 30 - secondsInPeriod;
      
      setTimeRemaining(remaining);
      
      if (remaining === 30) {
        processGameResult();
        setCurrentPeriod(generatePeriod());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const processGameResult = async () => {
    if (!activeBet) return;

    const resultNumber = Math.floor(Math.random() * 10);
    const resultColor = resultNumber === 0 || resultNumber === 5 ? 'green' : 
                       [1, 3, 7, 9].includes(resultNumber) ? 'red' : 'green';

    const result = { period: activeBet.period, number: resultNumber, color: resultColor };
    setLastResult(result);
    setGameHistory(prev => [resultNumber, ...prev.slice(0, 9)]);

    // Check win
    let isWin = false;
    let winAmount = 0;

    if (activeBet.betType === 'number' && activeBet.betValue === resultNumber) {
      isWin = true;
      winAmount = activeBet.amount * 9;
    } else if (activeBet.betType === 'color' && activeBet.betValue === resultColor) {
      isWin = true;
      winAmount = activeBet.amount * 2;
    }

    try {
      await apiRequest('POST', '/api/games/bet', {
        gameId: 1,
        betAmount: activeBet.amount,
        betType: activeBet.betType,
        betValue: activeBet.betValue,
        won: isWin,
        winAmount: winAmount
      });
      refreshBalance();
    } catch (error) {
      console.error('Bet processing error:', error);
    }

    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      setActiveBet(null);
    }, 3000);
  };

  const placeBet = (betType: string, betValue: any) => {
    if (timeRemaining <= 5 || parseInt(balance) < betAmount) return;
    
    setActiveBet({
      betType,
      betValue,
      amount: betAmount,
      period: currentPeriod
    });
  };

  const getNumberColor = (num: number) => {
    if (num === 0 || num === 5) return 'bg-green-500';
    if ([1, 3, 7, 9].includes(num)) return 'bg-red-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center text-white">
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </button>
        <h1 className="text-xl font-bold">Simple WinGo</h1>
        <div className="text-right">
          <div className="text-sm">Balance</div>
          <div className="text-lg font-bold text-yellow-400">₹{balance}</div>
        </div>
      </div>

      {/* Timer */}
      <div className="text-center mb-6">
        <div className="text-2xl font-bold mb-2">Time Remaining</div>
        <div className={`text-4xl font-bold ${timeRemaining <= 5 ? 'text-red-400' : 'text-green-400'}`}>
          {timeRemaining}s
        </div>
        <div className="text-sm text-gray-300">Period: {currentPeriod}</div>
      </div>

      {/* Game History */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-center">Recent Results</h3>
        <div className="flex space-x-2 overflow-x-auto">
          {gameHistory.map((num, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-10 h-10 rounded-full ${getNumberColor(num)} flex items-center justify-center text-white font-bold`}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      {/* Bet Amount */}
      <div className="mb-6 bg-white/10 rounded-lg p-4">
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

      {/* Color Betting */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-center">Choose Color (2x)</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => placeBet('color', 'green')}
            disabled={timeRemaining <= 5}
            className="py-4 bg-green-500 rounded-lg font-bold disabled:opacity-50"
          >
            GREEN
          </button>
          <button
            onClick={() => placeBet('color', 'red')}
            disabled={timeRemaining <= 5}
            className="py-4 bg-red-500 rounded-lg font-bold disabled:opacity-50"
          >
            RED
          </button>
        </div>
      </div>

      {/* Number Betting */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-center">Choose Number (9x)</h3>
        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <button
              key={number}
              onClick={() => placeBet('number', number)}
              disabled={timeRemaining <= 5}
              className={`aspect-square rounded-lg ${getNumberColor(number)} text-white font-bold text-lg disabled:opacity-50`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      {/* Active Bet */}
      {activeBet && (
        <div className="mb-4 bg-yellow-500/20 rounded-lg p-4 border border-yellow-500">
          <div className="text-center">
            <div className="font-bold">Active Bet</div>
            <div>{activeBet.betType}: {activeBet.betValue} • ₹{activeBet.amount}</div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && lastResult && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-black p-8 rounded-2xl text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <div className="text-2xl font-bold mb-4">Result</div>
              <div className={`w-20 h-20 rounded-full ${getNumberColor(lastResult.number)} flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4`}>
                {lastResult.number}
              </div>
              <div className="text-lg">
                Number: {lastResult.number} | Color: {lastResult.color}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}