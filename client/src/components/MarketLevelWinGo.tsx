import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, TrendingUp, Trophy, Star } from 'lucide-react';
import { apiRequest } from '../lib/queryClient';
import { useSmartBalance } from '../hooks/useSmartBalance';

interface MarketLevelWinGoProps {
  onBack: () => void;
}

interface GameResult {
  period: string;
  number: number;
  color: 'red' | 'green' | 'violet';
  size: 'big' | 'small';
  timestamp: Date;
}

interface ActiveBet {
  betType: 'number' | 'color' | 'size';
  betValue: any;
  amount: number;
  quantity: number;
  period: string;
}

export function MarketLevelWinGo({ onBack }: MarketLevelWinGoProps) {
  const { balance, refreshBalance } = useSmartBalance();
  
  // Game state
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [activeBet, setActiveBet] = useState<ActiveBet | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [quantity, setQuantity] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Generate authentic period format
  const generatePeriod = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const periods30s = Math.floor((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 30);
    const sequence = String(periods30s).padStart(4, '0');
    return `${year}${month}${day}${sequence}`;
  };

  // Initialize game
  useEffect(() => {
    setCurrentPeriod(generatePeriod());
    
    // Initialize with some realistic history
    const initialHistory: GameResult[] = [];
    for (let i = 0; i < 10; i++) {
      const number = Math.floor(Math.random() * 10);
      let color: 'red' | 'green' | 'violet';
      if (number === 0 || number === 5) {
        color = 'violet';
      } else if (number % 2 === 0) {
        color = 'red';
      } else {
        color = 'green';
      }
      
      initialHistory.unshift({
        period: `20250704${String(180000 - i * 30).padStart(6, '0')}`,
        number,
        color,
        size: number >= 5 ? 'big' : 'small',
        timestamp: new Date(Date.now() - (i + 1) * 30000)
      });
    }
    setGameHistory(initialHistory);
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleGameEnd();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle game end and result generation
  const handleGameEnd = async () => {
    const newPeriod = generatePeriod();
    
    // Generate authentic result using market logic
    const number = Math.floor(Math.random() * 10);
    let color: 'red' | 'green' | 'violet';
    if (number === 0 || number === 5) {
      color = 'violet';
    } else if (number % 2 === 0) {
      color = 'red';
    } else {
      color = 'green';
    }
    
    const result: GameResult = {
      period: currentPeriod,
      number,
      color,
      size: number >= 5 ? 'big' : 'small',
      timestamp: new Date()
    };

    // Process active bet if exists
    if (activeBet) {
      await processBetResult(activeBet, result);
      setActiveBet(null);
    }

    // Update game state
    setGameHistory(prev => [result, ...prev.slice(0, 9)]);
    setLastResult(result);
    setShowResult(true);
    setCurrentPeriod(newPeriod);

    // Auto-hide result after 3 seconds
    setTimeout(() => setShowResult(false), 3000);
  };

  // Process bet result with market-standard payouts
  const processBetResult = async (bet: ActiveBet, result: GameResult) => {
    let isWin = false;
    let multiplier = 0;

    switch (bet.betType) {
      case 'number':
        isWin = result.number === bet.betValue;
        multiplier = isWin ? 9.0 : 0;
        break;
      case 'color':
        isWin = result.color === bet.betValue;
        if (bet.betValue === 'violet') {
          multiplier = isWin ? 4.5 : 0;
        } else {
          multiplier = isWin ? 2.0 : 0;
        }
        break;
      case 'size':
        isWin = result.size === bet.betValue;
        multiplier = isWin ? 2.0 : 0;
        break;
    }

    if (isWin && multiplier > 0) {
      const winAmount = Math.floor(bet.amount * bet.quantity * multiplier);
      
      try {
        // Update balance on server
        const user = await apiRequest('GET', '/api/auth/user') as any;
        const newBalance = parseInt(user.walletBalance) + winAmount;
        
        await apiRequest('POST', '/api/wallet/update-balance', {
          newBalance: newBalance.toString()
        });
        
        refreshBalance();
        
        // Show win notification
        console.log(`🎉 WIN! ₹${winAmount} (${multiplier}x multiplier)`);
        
      } catch (error) {
        console.error('Error processing win:', error);
      }
    }
  };

  // Place bet
  const placeBet = async (betType: 'number' | 'color' | 'size', betValue: any) => {
    if (loading || timeRemaining <= 10) return; // Stop betting 10 seconds before period end
    
    const totalBet = betAmount * quantity;
    const currentBalance = parseInt(balance);
    
    if (totalBet > currentBalance) {
      alert('Insufficient balance!');
      return;
    }

    setLoading(true);

    try {
      // Deduct bet amount immediately (market standard)
      const newBalance = currentBalance - totalBet;
      
      await apiRequest('POST', '/api/wallet/update-balance', {
        newBalance: newBalance.toString()
      });
      
      refreshBalance();

      // Set active bet
      setActiveBet({
        betType,
        betValue,
        amount: betAmount,
        quantity,
        period: currentPeriod
      });

      console.log(`✅ Bet placed: ${betType} ${betValue} - ₹${totalBet}`);
      
    } catch (error) {
      console.error('Error placing bet:', error);
      alert('Failed to place bet');
    } finally {
      setLoading(false);
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'green': return 'bg-green-500';
      case 'violet': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getNumberColor = (number: number) => {
    if (number === 0 || number === 5) return 'violet';
    return number % 2 === 0 ? 'red' : 'green';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-black/20">
        <button
          onClick={onBack}
          className="flex items-center text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back
        </button>
        <div className="text-center">
          <div className="text-lg font-bold text-green-300">BG678 WinGo</div>
          <div className="text-sm text-white/70">30 Second Lottery</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-white/70">Balance</div>
          <div className="text-lg font-bold text-yellow-300">₹{balance}</div>
        </div>
      </div>

      {/* Timer and Period */}
      <div className="relative z-10 text-center py-6 bg-black/10">
        <div className="text-6xl font-bold text-white mb-2">
          {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:
          {String(timeRemaining % 60).padStart(2, '0')}
        </div>
        <div className="text-lg text-green-200 mb-2">Time Remaining</div>
        <div className="text-sm text-white/60">Period: {currentPeriod}</div>
        
        {activeBet && (
          <div className="mt-3 mx-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
            <div className="text-yellow-300 font-medium">
              Active Bet: {activeBet.betType.toUpperCase()} {activeBet.betValue} 
              × {activeBet.quantity} = ₹{activeBet.amount * activeBet.quantity}
            </div>
          </div>
        )}
      </div>

      {/* Game History */}
      <div className="relative z-10 mx-4 mb-4">
        <div className="text-center text-white/80 mb-3">Recent Results</div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {gameHistory.slice(0, 10).map((result, index) => (
            <div key={result.period} className="flex-shrink-0 text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getColorClass(result.color)}`}>
                {result.number}
              </div>
              <div className="text-xs text-white/60 mt-1">
                {result.size}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Betting Interface */}
      <div className="relative z-10 flex-1 bg-white/5 backdrop-blur-sm mx-4 rounded-3xl p-6">
        {/* Color Betting */}
        <div className="mb-6">
          <div className="text-center text-white/80 mb-4">Select Color</div>
          <div className="grid grid-cols-3 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeBet('color', 'green')}
              disabled={loading || timeRemaining <= 10}
              className="bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all"
            >
              Green
              <div className="text-sm opacity-80">2.00x</div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeBet('color', 'violet')}
              disabled={loading || timeRemaining <= 10}
              className="bg-purple-500 hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all"
            >
              Violet
              <div className="text-sm opacity-80">4.50x</div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeBet('color', 'red')}
              disabled={loading || timeRemaining <= 10}
              className="bg-red-500 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all"
            >
              Red
              <div className="text-sm opacity-80">2.00x</div>
            </motion.button>
          </div>
        </div>

        {/* Number Betting */}
        <div className="mb-6">
          <div className="text-center text-white/80 mb-4">Select Number</div>
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
              <motion.button
                key={number}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => placeBet('number', number)}
                disabled={loading || timeRemaining <= 10}
                className={`${getColorClass(getNumberColor(number))} hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all`}
              >
                {number}
                <div className="text-xs opacity-80">9.00x</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Size Betting */}
        <div className="mb-6">
          <div className="text-center text-white/80 mb-4">Select Size</div>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeBet('size', 'small')}
              disabled={loading || timeRemaining <= 10}
              className="bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all"
            >
              Small (0-4)
              <div className="text-sm opacity-80">2.00x</div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeBet('size', 'big')}
              disabled={loading || timeRemaining <= 10}
              className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all"
            >
              Big (5-9)
              <div className="text-sm opacity-80">2.00x</div>
            </motion.button>
          </div>
        </div>

        {/* Bet Amount and Quantity */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-white/80 mb-2">Bet Amount</div>
            <select
              value={betAmount}
              onChange={(e) => setBetAmount(parseInt(e.target.value))}
              className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white"
            >
              <option value={10}>₹10</option>
              <option value={50}>₹50</option>
              <option value={100}>₹100</option>
              <option value={500}>₹500</option>
              <option value={1000}>₹1000</option>
            </select>
          </div>
          
          <div>
            <div className="text-white/80 mb-2">Quantity</div>
            <select
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white"
            >
              <option value={1}>×1</option>
              <option value={5}>×5</option>
              <option value={10}>×10</option>
              <option value={50}>×50</option>
              <option value={100}>×100</option>
            </select>
          </div>
        </div>

        {/* Total Bet Display */}
        <div className="text-center text-yellow-300 font-bold text-lg mb-2">
          Total Bet: ₹{betAmount * quantity}
        </div>
        
        {timeRemaining <= 10 && (
          <div className="text-center text-red-300 font-medium">
            Betting closed - waiting for result
          </div>
        )}
      </div>

      {/* Result Popup */}
      <AnimatePresence>
        {showResult && lastResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center max-w-sm mx-4">
              <div className="text-2xl font-bold text-white mb-4">Result</div>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 ${getColorClass(lastResult.color)}`}>
                {lastResult.number}
              </div>
              <div className="text-lg text-white/80 mb-2">
                Color: {lastResult.color.toUpperCase()}
              </div>
              <div className="text-lg text-white/80 mb-4">
                Size: {lastResult.size.toUpperCase()}
              </div>
              <div className="text-sm text-white/60">
                Period: {lastResult.period}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}