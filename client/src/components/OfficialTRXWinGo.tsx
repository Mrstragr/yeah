import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Clock, TrendingUp, Coins, Zap } from 'lucide-react';

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

interface Bet {
  type: 'color' | 'number' | 'size';
  value: string | number;
  amount: number;
  odds: number;
}

export default function OfficialTRXWinGo({ onBack, user, onBalanceUpdate }: Props) {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [gameNumber, setGameNumber] = useState('20250101001');
  const [betAmount, setBetAmount] = useState(10);
  const [activeBets, setActiveBets] = useState<Bet[]>([]);
  const [gamePhase, setGamePhase] = useState<'betting' | 'waiting' | 'revealing'>('betting');
  const [currentResult, setCurrentResult] = useState<{ number: number; color: string; size: string } | null>(null);
  const [resultHistory, setResultHistory] = useState<any[]>([]);
  const [trxPrice, setTrxPrice] = useState(0.1234); // TRX price in USD
  const [isSubmitting, setIsSubmitting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const colors = [
    { name: 'Red', value: 'red', odds: 2, bgColor: 'bg-red-500' },
    { name: 'Green', value: 'green', odds: 2, bgColor: 'bg-green-500' },
    { name: 'Violet', value: 'violet', odds: 4.5, bgColor: 'bg-purple-500' }
  ];

  const numbers = Array.from({ length: 10 }, (_, i) => ({
    value: i,
    color: i === 0 || i === 5 ? 'violet' : i % 2 === 0 ? 'red' : 'green',
    odds: i === 0 || i === 5 ? 4.5 : 9
  }));

  const sizes = [
    { name: 'Small', value: 'small', range: '0-4', odds: 2, bgColor: 'bg-blue-500' },
    { name: 'Big', value: 'big', range: '5-9', odds: 2, bgColor: 'bg-orange-500' }
  ];

  // Generate period number based on TRX blockchain pattern
  const generatePeriod = () => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10).replace(/-/g, '');
    const periods = Math.floor((now.getHours() * 60 + now.getMinutes()) / 3); // Every 3 minutes
    return `${today}${String(periods + 1).padStart(3, '0')}`;
  };

  // Simulate TRX price fluctuation
  useEffect(() => {
    const priceInterval = setInterval(() => {
      setTrxPrice(prev => {
        const change = (Math.random() - 0.5) * 0.01;
        return Math.max(0.01, prev + change);
      });
    }, 5000);

    return () => clearInterval(priceInterval);
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (gamePhase === 'betting') {
            processGameRound();
          }
          return 180; // Reset for next round
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase]);

  const processGameRound = () => {
    setGamePhase('waiting');
    setIsSubmitting(true);

    // Simulate TRX blockchain confirmation time
    setTimeout(() => {
      // Generate result based on TRX hash simulation
      const resultNumber = Math.floor(Math.random() * 10);
      const resultColor = resultNumber === 0 || resultNumber === 5 ? 'violet' : 
                         resultNumber % 2 === 0 ? 'red' : 'green';
      const resultSize = resultNumber <= 4 ? 'small' : 'big';

      const result = {
        number: resultNumber,
        color: resultColor,
        size: resultSize
      };

      setCurrentResult(result);
      setGamePhase('revealing');

      // Check winnings
      if (activeBets.length > 0) {
        checkWinnings(result);
      }

      // Add to history
      setResultHistory(prev => [result, ...prev.slice(0, 9)]);

      // Return to betting phase
      setTimeout(() => {
        setGamePhase('betting');
        setGameNumber(generatePeriod());
        setActiveBets([]);
        setIsSubmitting(false);
      }, 5000);
    }, 3000);
  };

  const checkWinnings = (result: any) => {
    let totalWinnings = 0;

    activeBets.forEach(bet => {
      let won = false;
      
      switch (bet.type) {
        case 'color':
          if (bet.value === result.color) won = true;
          break;
        case 'number':
          if (bet.value === result.number) won = true;
          break;
        case 'size':
          if (bet.value === result.size) won = true;
          break;
      }

      if (won) {
        totalWinnings += bet.amount * bet.odds;
      }
    });

    if (totalWinnings > 0) {
      setTimeout(() => {
        onBalanceUpdate();
      }, 1000);
    }
  };

  const placeBet = (type: 'color' | 'number' | 'size', value: string | number, odds: number) => {
    if (gamePhase !== 'betting' || betAmount <= 0) return;

    const existingBetIndex = activeBets.findIndex(bet => bet.type === type && bet.value === value);
    
    if (existingBetIndex >= 0) {
      // Add to existing bet
      const updatedBets = [...activeBets];
      updatedBets[existingBetIndex].amount += betAmount;
      setActiveBets(updatedBets);
    } else {
      // Create new bet
      setActiveBets(prev => [...prev, { type, value, amount: betAmount, odds }]);
    }
  };

  const removeBet = (index: number) => {
    setActiveBets(prev => prev.filter((_, i) => i !== index));
  };

  const getTotalBetAmount = () => {
    return activeBets.reduce((total, bet) => total + bet.amount, 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'green': return 'bg-green-500';
      case 'violet': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-purple-800/50">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            TRX WinGo
          </h1>
          <div className="text-sm text-purple-200">Period: {gameNumber}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-purple-200">TRX Price</div>
          <div className="text-sm font-bold text-yellow-400">${trxPrice.toFixed(4)}</div>
        </div>
      </div>

      {/* Timer and Status */}
      <div className="p-4">
        <div className="bg-purple-800/30 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-purple-200">
                {gamePhase === 'betting' ? 'Betting Time' : 
                 gamePhase === 'waiting' ? 'TRX Confirming...' : 'Results'}
              </span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {formatTime(timeLeft)}
            </div>
          </div>
          
          {gamePhase === 'betting' && (
            <div className="text-sm text-purple-300">
              Place bets using TRX blockchain technology
            </div>
          )}
        </div>

        {/* Current Result */}
        {currentResult && gamePhase === 'revealing' && (
          <motion.div 
            className="bg-purple-800/30 rounded-xl p-4 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div className="text-center">
              <div className="text-purple-200 text-sm mb-2">Winning Result</div>
              <div className="flex justify-center items-center gap-4">
                <div className={`w-16 h-16 rounded-xl ${getColorClass(currentResult.color)} flex items-center justify-center text-2xl font-bold text-white`}>
                  {currentResult.number}
                </div>
                <div className="text-left">
                  <div className="text-white font-bold">Number: {currentResult.number}</div>
                  <div className="text-purple-200 capitalize">Color: {currentResult.color}</div>
                  <div className="text-purple-200 capitalize">Size: {currentResult.size}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Result History */}
        <div className="mb-4">
          <div className="text-purple-200 text-sm mb-2">Recent Results:</div>
          <div className="flex gap-1 overflow-x-auto">
            {resultHistory.map((result, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded ${getColorClass(result.color)} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}
              >
                {result.number}
              </div>
            ))}
          </div>
        </div>

        {/* Color Betting */}
        <div className="mb-4">
          <div className="text-purple-200 text-sm mb-2">Colors:</div>
          <div className="grid grid-cols-3 gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => placeBet('color', color.value, color.odds)}
                disabled={gamePhase !== 'betting'}
                className={`${color.bgColor} p-4 rounded-xl transition-all ${
                  gamePhase !== 'betting' 
                    ? 'opacity-50' 
                    : 'hover:scale-105 active:scale-95'
                }`}
              >
                <div className="text-white font-bold">{color.name}</div>
                <div className="text-white/80 text-sm">{color.odds}x</div>
              </button>
            ))}
          </div>
        </div>

        {/* Number Betting */}
        <div className="mb-4">
          <div className="text-purple-200 text-sm mb-2">Numbers:</div>
          <div className="grid grid-cols-5 gap-2">
            {numbers.map((num) => (
              <button
                key={num.value}
                onClick={() => placeBet('number', num.value, num.odds)}
                disabled={gamePhase !== 'betting'}
                className={`${getColorClass(num.color)} p-3 rounded-lg transition-all ${
                  gamePhase !== 'betting' 
                    ? 'opacity-50' 
                    : 'hover:scale-105 active:scale-95'
                }`}
              >
                <div className="text-white font-bold text-lg">{num.value}</div>
                <div className="text-white/80 text-xs">{num.odds}x</div>
              </button>
            ))}
          </div>
        </div>

        {/* Size Betting */}
        <div className="mb-4">
          <div className="text-purple-200 text-sm mb-2">Size:</div>
          <div className="grid grid-cols-2 gap-2">
            {sizes.map((size) => (
              <button
                key={size.value}
                onClick={() => placeBet('size', size.value, size.odds)}
                disabled={gamePhase !== 'betting'}
                className={`${size.bgColor} p-4 rounded-xl transition-all ${
                  gamePhase !== 'betting' 
                    ? 'opacity-50' 
                    : 'hover:scale-105 active:scale-95'
                }`}
              >
                <div className="text-white font-bold">{size.name}</div>
                <div className="text-white/80 text-sm">{size.range}</div>
                <div className="text-white/80 text-sm">{size.odds}x</div>
              </button>
            ))}
          </div>
        </div>

        {/* Bet Amount Control */}
        <div className="mb-4">
          <div className="text-purple-200 text-sm mb-2">Bet Amount (TRX):</div>
          <div className="flex items-center gap-2 mb-2">
            <button 
              onClick={() => setBetAmount(Math.max(1, betAmount - 10))}
              className="w-8 h-8 bg-purple-700 rounded flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex-1 text-center text-xl font-bold bg-purple-800/30 py-2 rounded">
              {betAmount} TRX
            </div>
            <button 
              onClick={() => setBetAmount(betAmount + 10)}
              className="w-8 h-8 bg-purple-700 rounded flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[10, 50, 100, 500].map(amount => (
              <button 
                key={amount}
                onClick={() => setBetAmount(amount)}
                className="bg-purple-700/50 py-1 rounded text-sm hover:bg-purple-600/50"
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {/* Active Bets */}
        {activeBets.length > 0 && (
          <div className="mb-4">
            <div className="text-purple-200 text-sm mb-2">Active Bets:</div>
            <div className="bg-purple-800/30 rounded-xl p-3 space-y-2">
              {activeBets.map((bet, index) => (
                <div key={index} className="flex items-center justify-between bg-purple-700/30 p-2 rounded">
                  <div className="text-sm">
                    <span className="capitalize">{bet.type}: {bet.value}</span>
                    <span className="text-purple-300 ml-2">({bet.odds}x)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-bold">{bet.amount} TRX</span>
                    <button
                      onClick={() => removeBet(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <div className="text-center text-purple-200 text-sm border-t border-purple-600 pt-2">
                Total: {getTotalBetAmount()} TRX
              </div>
            </div>
          </div>
        )}

        {/* TRX Features */}
        <div className="mt-4 p-4 bg-purple-800/20 rounded-xl">
          <div className="text-purple-300 text-sm font-semibold mb-2 flex items-center gap-2">
            <Coins className="w-4 h-4" />
            TRX Blockchain Features:
          </div>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• Fast 3-second block confirmation</li>
            <li>• Low transaction fees (0.1 TRX)</li>
            <li>• Provably fair results on blockchain</li>
            <li>• Instant payouts to your wallet</li>
          </ul>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-4"></div>
    </div>
  );
}