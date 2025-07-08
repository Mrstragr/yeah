import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, TrendingUp, Trophy, Star, Zap, Target, Crown, Gift, Plus, Minus } from 'lucide-react';
import { apiRequest } from '../lib/queryClient';
import { useSmartBalance } from '../hooks/useSmartBalance';

interface PremiumAnimatedWinGoProps {
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

export default function PremiumAnimatedWinGo({ onBack }: PremiumAnimatedWinGoProps) {
  const { balance, refreshBalance } = useSmartBalance();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number, color: string, size: number}>>([]);

  // Premium particle animation system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background gradient animation
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.1)');
      gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.05)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floating particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.01; // gravity

        if (particle.y > canvas.height + 10) {
          particles[index] = {
            ...particle,
            x: Math.random() * canvas.width,
            y: -10,
            vy: Math.random() * 0.5 + 0.1
          };
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
      });

      requestAnimationFrame(animateParticles);
    };

    // Initialize particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: Math.random() * 0.5 + 0.1,
      color: ['#ef4444', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)],
      size: Math.random() * 3 + 1
    }));

    setParticles(newParticles);
    animateParticles();
  }, []);

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

  // Initialize game timer
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

    setLoading(true);
    
    try {
      // Generate authentic result
      const resultNumber = Math.floor(Math.random() * 10);
      const resultColor = resultNumber === 0 ? 'red' : 
                         resultNumber === 5 ? 'green' : 
                         [1, 3, 7, 9].includes(resultNumber) ? 'red' : 
                         [2, 4, 6, 8].includes(resultNumber) ? 'green' : 'violet';
      const resultSize = resultNumber >= 5 ? 'big' : 'small';

      const result: GameResult = {
        period: activeBet.period,
        number: resultNumber,
        color: resultColor,
        size: resultSize,
        timestamp: new Date()
      };

      setLastResult(result);
      setGameHistory(prev => [result, ...prev.slice(0, 9)]);

      // Check if won
      let isWin = false;
      let multiplier = 1;

      if (activeBet.betType === 'number' && activeBet.betValue === resultNumber) {
        isWin = true;
        multiplier = 9;
      } else if (activeBet.betType === 'color' && activeBet.betValue === resultColor) {
        isWin = true;
        multiplier = resultColor === 'violet' ? 4.5 : 2;
      } else if (activeBet.betType === 'size' && activeBet.betValue === resultSize) {
        isWin = true;
        multiplier = 2;
      }

      if (isWin) {
        const winAmount = activeBet.amount * activeBet.quantity * multiplier;
        
        // Update balance via API
        await apiRequest('POST', '/api/games/bet', {
          gameId: 1,
          betAmount: activeBet.amount * activeBet.quantity,
          betType: activeBet.betType,
          betValue: activeBet.betValue,
          won: true,
          winAmount: winAmount
        });

        setShowWinAnimation(true);
        setTimeout(() => setShowWinAnimation(false), 3000);
      } else {
        // Deduct bet amount
        await apiRequest('POST', '/api/games/bet', {
          gameId: 1,
          betAmount: activeBet.amount * activeBet.quantity,
          betType: activeBet.betType,
          betValue: activeBet.betValue,
          won: false,
          winAmount: 0
        });
      }

      refreshBalance();
      setShowResult(true);
      setTimeout(() => setShowResult(false), 5000);
      
    } catch (error) {
      console.error('Game processing error:', error);
    } finally {
      setLoading(false);
      setActiveBet(null);
    }
  };

  const placeBet = async (betType: string, betValue: any) => {
    if (timeRemaining <= 5 || parseInt(balance) < betAmount * quantity) return;

    const bet: ActiveBet = {
      betType: betType as any,
      betValue,
      amount: betAmount,
      quantity,
      period: currentPeriod
    };

    setActiveBet(bet);
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'red': return 'from-red-500 to-red-600';
      case 'green': return 'from-green-500 to-green-600';
      case 'violet': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const quickAmounts = [10, 100, 1000];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Premium Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1e1e3f 50%, #2d1b69 100%)' }}
      />

      {/* Animated Background Layers */}
      <div className="absolute inset-0 z-1">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-red-900/20"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(147, 51, 234, 0.2) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(239, 68, 68, 0.2) 100%)',
              'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(147, 51, 234, 0.2) 50%, rgba(59, 130, 246, 0.2) 100%)',
              'linear-gradient(225deg, rgba(59, 130, 246, 0.2) 0%, rgba(239, 68, 68, 0.2) 50%, rgba(147, 51, 234, 0.2) 100%)',
            ]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            onClick={onBack}
            className="flex items-center text-white/80 hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back
          </motion.button>
          
          <motion.div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              PREMIUM WIN GO
            </h1>
            <div className="text-sm text-gray-300">Period: {currentPeriod}</div>
          </motion.div>
          
          <motion.div 
            className="text-right"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-sm text-gray-300">Balance</div>
            <div className="text-lg font-bold text-yellow-400">₹{balance}</div>
          </motion.div>
        </motion.div>

        {/* Premium Timer Circle */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <div className="relative">
            <motion.div
              className="w-32 h-32 rounded-full border-4 border-purple-500/30 flex items-center justify-center"
              style={{
                background: 'conic-gradient(from 0deg, #8b5cf6, #ef4444, #3b82f6, #8b5cf6)',
                animation: 'spin 10s linear infinite'
              }}
            >
              <div className="w-28 h-28 rounded-full bg-black/80 flex flex-col items-center justify-center">
                <motion.div 
                  className="text-3xl font-bold text-white"
                  animate={{ scale: timeRemaining <= 5 ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: timeRemaining <= 5 ? Infinity : 0 }}
                >
                  {timeRemaining}
                </motion.div>
                <div className="text-xs text-gray-400">seconds</div>
              </div>
            </motion.div>
            
            {timeRemaining <= 5 && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-red-500"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>

        {/* Game History with Premium Animation */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold mb-3 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Recent Results
          </h3>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {gameHistory.slice(0, 10).map((result, index) => (
              <motion.div
                key={result.period}
                className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${getColorClass(result.color)} flex items-center justify-center text-white font-bold shadow-lg`}
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {result.number}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Betting Amount Controls */}
        <motion.div 
          className="mb-6 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-300">Bet Amount</span>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              
              <motion.div 
                className="px-4 py-2 bg-black/50 rounded-lg font-bold text-yellow-400 min-w-[80px] text-center"
                key={betAmount}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                ₹{betAmount}
              </motion.div>
              
              <motion.button
                onClick={() => setBetAmount(betAmount + 10)}
                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          <div className="flex space-x-2">
            {quickAmounts.map((amount) => (
              <motion.button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  betAmount === amount 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ₹{amount}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Premium Color Betting */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-lg font-bold mb-3 text-center text-white">Choose Color</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { color: 'green', label: 'Green', multiplier: '2x', gradient: 'from-green-400 to-green-600' },
              { color: 'violet', label: 'Violet', multiplier: '4.5x', gradient: 'from-purple-400 to-purple-600' },
              { color: 'red', label: 'Red', multiplier: '2x', gradient: 'from-red-400 to-red-600' }
            ].map((item) => (
              <motion.button
                key={item.color}
                onClick={() => placeBet('color', item.color)}
                disabled={timeRemaining <= 5 || loading}
                className={`relative py-6 rounded-2xl bg-gradient-to-br ${item.gradient} text-white font-bold shadow-lg disabled:opacity-50 overflow-hidden`}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ rotateX: 90 }}
                animate={{ rotateX: 0 }}
                transition={{ delay: 0.1 * (item.color === 'green' ? 0 : item.color === 'violet' ? 1 : 2) }}
              >
                <div className="relative z-10">
                  <div className="text-xl font-bold">{item.label}</div>
                  <div className="text-sm opacity-90">{item.multiplier}</div>
                </div>
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Premium Number Betting */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-lg font-bold mb-3 text-center text-white">Choose Number (9x)</h3>
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <motion.button
                key={number}
                onClick={() => placeBet('number', number)}
                disabled={timeRemaining <= 5 || loading}
                className={`aspect-square rounded-xl bg-gradient-to-br ${
                  number === 0 ? 'from-red-500 to-red-600' :
                  number === 5 ? 'from-green-500 to-green-600' :
                  [1, 3, 7, 9].includes(number) ? 'from-red-400 to-red-500' :
                  [2, 4, 6, 8].includes(number) ? 'from-green-400 to-green-500' :
                  'from-purple-400 to-purple-500'
                } text-white font-bold text-xl shadow-lg disabled:opacity-50`}
                whileHover={{ scale: 1.1, rotateZ: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ delay: 0.05 * number, type: "spring" }}
              >
                {number}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Premium Size Betting */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h3 className="text-lg font-bold mb-3 text-center text-white">Choose Size (2x)</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { size: 'small', label: 'Small (0-4)', gradient: 'from-blue-400 to-blue-600' },
              { size: 'big', label: 'Big (5-9)', gradient: 'from-orange-400 to-orange-600' }
            ].map((item) => (
              <motion.button
                key={item.size}
                onClick={() => placeBet('size', item.size)}
                disabled={timeRemaining <= 5 || loading}
                className={`py-6 rounded-2xl bg-gradient-to-br ${item.gradient} text-white font-bold shadow-lg disabled:opacity-50`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ x: item.size === 'small' ? -50 : 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * (item.size === 'small' ? 0 : 1) }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Active Bet Display */}
        <AnimatePresence>
          {activeBet && (
            <motion.div
              className="mb-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-4 border border-yellow-500/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="text-center">
                <div className="text-yellow-400 font-bold">Active Bet</div>
                <div className="text-white">
                  {activeBet.betType}: {activeBet.betValue} • ₹{activeBet.amount} x {activeBet.quantity}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Win Animation */}
        <AnimatePresence>
          {showWinAnimation && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center"
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                exit={{ scale: 0, rotateY: -180 }}
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  🎉
                </motion.div>
                <motion.h2
                  className="text-4xl font-bold text-yellow-400 mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  CONGRATULATIONS!
                </motion.h2>
                <div className="text-2xl text-white">You Won!</div>
              </motion.div>
              
              {/* Confetti Effect */}
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                    scale: 0
                  }}
                  animate={{
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight + 100,
                    scale: [0, 1, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 3,
                    delay: Math.random() * 0.5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}