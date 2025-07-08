import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plane, TrendingUp, Zap, Target } from 'lucide-react';
import { apiRequest } from '../lib/queryClient';
import { useSmartBalance } from '../hooks/useSmartBalance';

interface PremiumAviatorProps {
  onBack: () => void;
}

interface FlightData {
  multiplier: number;
  crashed: boolean;
  cashedOut: boolean;
  startTime: number;
}

export default function PremiumAviatorGame({ onBack }: PremiumAviatorProps) {
  const { balance, refreshBalance } = useSmartBalance();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [betAmount, setBetAmount] = useState(10);
  const [hasBet, setHasBet] = useState(false);
  const [autoCashOut, setAutoCashOut] = useState<number | null>(null);
  const [cashedOut, setCashedOut] = useState(false);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);
  const [planePosition, setPlanePosition] = useState({ x: 50, y: 300 });
  const [trail, setTrail] = useState<Array<{x: number, y: number}>>([]);
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [countdown, setCountdown] = useState(0);

  // Premium visual effects
  const [particles, setParticles] = useState<Array<{
    id: number, x: number, y: number, vx: number, vy: number, 
    color: string, size: number, life: number
  }>>([]);

  // Canvas animation system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const draw = () => {
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f0f23');
      gradient.addColorStop(0.5, '#1e1e3f');
      gradient.addColorStop(1, '#2d1b69');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const x = (canvas.width / 10) * i;
        const y = (canvas.height / 10) * i;
        
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw flight trail
      if (trail.length > 1) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#3b82f6';
        
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw particles
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw plane
      if (gameState === 'flying') {
        ctx.save();
        ctx.translate(planePosition.x, planePosition.y);
        
        // Plane glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#fbbf24';
        
        // Draw plane body
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-15, -5, 30, 10);
        
        // Draw wings
        ctx.fillRect(-20, -2, 10, 4);
        ctx.fillRect(10, -2, 10, 4);
        
        // Engine trail
        if (gameState === 'flying') {
          const trailGradient = ctx.createLinearGradient(-50, 0, -15, 0);
          trailGradient.addColorStop(0, 'rgba(255, 165, 0, 0)');
          trailGradient.addColorStop(1, 'rgba(255, 165, 0, 0.8)');
          ctx.fillStyle = trailGradient;
          ctx.fillRect(-50, -3, 35, 6);
        }
        
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, planePosition, trail, particles]);

  // Update particles
  useEffect(() => {
    const updateParticles = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 0.02
        })).filter(particle => particle.life > 0)
      );
    };

    const interval = setInterval(updateParticles, 16);
    return () => clearInterval(interval);
  }, []);

  // Game logic
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
    setPlanePosition({ x: 50, y: 300 });
    setTrail([{ x: 50, y: 300 }]);
    
    // Generate crash point (1.00 to 50.00)
    const crashMultiplier = Math.random() * 49 + 1;
    setCrashPoint(crashMultiplier);

    // Game progression
    const gameTimer = setInterval(() => {
      setCurrentMultiplier(prev => {
        const newMultiplier = prev + 0.01;
        
        // Update plane position
        const progress = (newMultiplier - 1) / (crashMultiplier - 1);
        const newX = 50 + progress * 300;
        const newY = 300 - progress * 200;
        
        setPlanePosition({ x: newX, y: newY });
        setTrail(prevTrail => [...prevTrail.slice(-20), { x: newX, y: newY }]);
        
        // Add engine particles
        setParticles(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: newX - 25,
          y: newY,
          vx: -2 - Math.random() * 2,
          vy: (Math.random() - 0.5) * 2,
          color: ['#ff6b35', '#f7931e', '#ffcc02'][Math.floor(Math.random() * 3)],
          size: Math.random() * 3 + 1,
          life: 1
        }]);
        
        // Check auto cash out
        if (autoCashOut && newMultiplier >= autoCashOut && hasBet && !cashedOut) {
          cashOut(newMultiplier);
        }
        
        // Check crash
        if (newMultiplier >= crashMultiplier) {
          clearInterval(gameTimer);
          crash();
          return crashMultiplier;
        }
        
        return newMultiplier;
      });
    }, 100);

    setTimeout(() => {
      if (gameState === 'flying') {
        clearInterval(gameTimer);
      }
    }, crashMultiplier * 1000);
  };

  const crash = () => {
    setGameState('crashed');
    
    // Explosion particles
    const explosionParticles = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: planePosition.x,
      y: planePosition.y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      color: ['#ff0000', '#ff6b35', '#ffcc02'][Math.floor(Math.random() * 3)],
      size: Math.random() * 5 + 2,
      life: 1
    }));
    
    setParticles(prev => [...prev, ...explosionParticles]);
    
    // Process losing bets
    if (hasBet && !cashedOut) {
      apiRequest('POST', '/api/games/bet', {
        gameId: 2,
        betAmount: betAmount,
        betType: 'aviator',
        won: false,
        winAmount: 0
      });
      refreshBalance();
    }

    setGameHistory(prev => [crashPoint || 1, ...prev.slice(0, 9)]);
    
    setTimeout(() => {
      setGameState('waiting');
      setHasBet(false);
      setCrashPoint(null);
      setTrail([]);
    }, 3000);
  };

  const placeBet = async () => {
    if (gameState !== 'waiting' || parseInt(balance) < betAmount) return;
    setHasBet(true);
  };

  const cashOut = async (multiplier?: number) => {
    if (!hasBet || cashedOut || gameState !== 'flying') return;
    
    const finalMultiplier = multiplier || currentMultiplier;
    const winAmount = betAmount * finalMultiplier;
    
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

  const quickAmounts = [10, 50, 100, 500];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
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
        
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            PREMIUM AVIATOR
          </h1>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-300">Balance</div>
          <div className="text-lg font-bold text-yellow-400">₹{balance}</div>
        </div>
      </motion.div>

      {/* Game Canvas */}
      <div className="relative h-96 mx-4 my-6 rounded-2xl overflow-hidden border-2 border-white/20 bg-black/50">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
        
        {/* Multiplier Display */}
        <motion.div 
          className="absolute top-4 left-4 text-4xl font-bold"
          animate={{ 
            scale: gameState === 'flying' ? [1, 1.1, 1] : 1,
            color: gameState === 'crashed' ? '#ef4444' : '#22c55e'
          }}
          transition={{ duration: 0.5, repeat: gameState === 'flying' ? Infinity : 0 }}
        >
          {currentMultiplier.toFixed(2)}x
        </motion.div>

        {/* Game State Indicator */}
        <div className="absolute top-4 right-4">
          {gameState === 'waiting' && (
            <motion.div 
              className="text-2xl font-bold text-yellow-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Starting in {countdown}s
            </motion.div>
          )}
          {gameState === 'flying' && (
            <motion.div 
              className="text-xl font-bold text-green-400 flex items-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Plane className="w-6 h-6 mr-2" />
              FLYING
            </motion.div>
          )}
          {gameState === 'crashed' && (
            <motion.div 
              className="text-xl font-bold text-red-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
              transition={{ type: "spring", damping: 10 }}
            >
              CRASHED!
            </motion.div>
          )}
        </div>

        {/* Cash Out Button */}
        <AnimatePresence>
          {hasBet && gameState === 'flying' && !cashedOut && (
            <motion.button
              onClick={() => cashOut()}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl font-bold text-xl shadow-lg"
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 50 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cash Out ₹{(betAmount * currentMultiplier).toFixed(2)}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Game History */}
      <motion.div 
        className="mx-4 mb-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h3 className="text-lg font-bold mb-3 text-center">Recent Multipliers</h3>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {gameHistory.map((multiplier, index) => (
            <motion.div
              key={index}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-bold ${
                multiplier >= 2 ? 'bg-green-500' : multiplier >= 1.5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {multiplier.toFixed(2)}x
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Betting Controls */}
      <motion.div 
        className="mx-4 bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Bet Amount */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-300">Bet Amount</span>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                -
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
                +
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
        </div>

        {/* Auto Cash Out */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Auto Cash Out</span>
            <input
              type="number"
              value={autoCashOut || ''}
              onChange={(e) => setAutoCashOut(e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="2.00"
              min="1.01"
              step="0.01"
              className="w-20 px-2 py-1 bg-black/50 border border-white/20 rounded text-center text-yellow-400"
            />
          </div>
        </div>

        {/* Bet Button */}
        <motion.button
          onClick={placeBet}
          disabled={gameState !== 'waiting' || hasBet || parseInt(balance) < betAmount}
          className={`w-full py-4 rounded-2xl font-bold text-xl transition-all ${
            hasBet 
              ? 'bg-gray-500 text-gray-300' 
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400'
          } disabled:opacity-50`}
          whileHover={{ scale: hasBet ? 1 : 1.02 }}
          whileTap={{ scale: hasBet ? 1 : 0.98 }}
        >
          {hasBet ? `Bet Placed: ₹${betAmount}` : `Place Bet ₹${betAmount}`}
        </motion.button>
      </motion.div>
    </div>
  );
}