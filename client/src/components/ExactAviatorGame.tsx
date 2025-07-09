import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { apiRequest } from '../lib/queryClient';
import { useSmartBalance } from '../hooks/useSmartBalance';

interface ExactAviatorGameProps {
  onBack: () => void;
}

export default function ExactAviatorGame({ onBack }: ExactAviatorGameProps) {
  const { balance, refreshBalance } = useSmartBalance();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [betAmount, setBetAmount] = useState(100);
  const [betAmount2, setBetAmount2] = useState(200);
  const [hasBet1, setHasBet1] = useState(false);
  const [hasBet2, setHasBet2] = useState(false);
  const [cashedOut1, setCashedOut1] = useState(false);
  const [cashedOut2, setCashedOut2] = useState(false);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);
  const [gameHistory, setGameHistory] = useState([
    2.61, 2.80, 1.51, 1.06, 2.24, 1.76, 1.36, 1.03, 1.51, 1.73, 1.09
  ]);
  const [countdown, setCountdown] = useState(5);
  const [showCashOutSuccess, setShowCashOutSuccess] = useState(false);
  const [cashOutAmount, setCashOutAmount] = useState(0);
  const [animationId, setAnimationId] = useState<number | null>(null);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gameState === 'flying') {
        // Draw the red curve
        ctx.beginPath();
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 3;
        
        const progress = (currentMultiplier - 1) * 50;
        const curveHeight = canvas.height * 0.6;
        
        ctx.moveTo(0, curveHeight);
        for (let x = 0; x <= Math.min(progress, canvas.width); x++) {
          const y = curveHeight - (Math.pow(x / 50, 1.5) * 100);
          ctx.lineTo(x, Math.max(y, 50));
        }
        ctx.stroke();

        // Draw plane
        const planeX = Math.min(progress, canvas.width - 30);
        const planeY = Math.max(curveHeight - (Math.pow(planeX / 50, 1.5) * 100), 50);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText('✈️', planeX, planeY);
      }

      if (gameState === 'crashed') {
        // Draw explosion effect
        ctx.fillStyle = '#ff4444';
        ctx.font = '24px Arial';
        ctx.fillText('💥 FLEW AWAY', canvas.width / 2 - 60, canvas.height / 2);
      }

      const id = requestAnimationFrame(animate);
      setAnimationId(id);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [gameState, currentMultiplier]);

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
    setCashedOut1(false);
    setCashedOut2(false);
    
    // Generate crash point based on real aviator algorithm
    const crashMultiplier = Math.random() < 0.5 ? 
      1 + Math.random() * 2 : // 50% chance for 1x-3x
      1 + Math.random() * 10; // 50% chance for 1x-11x
    
    setCrashPoint(crashMultiplier);

    const gameTimer = setInterval(() => {
      setCurrentMultiplier(prev => {
        const increment = prev < 2 ? 0.01 : prev < 5 ? 0.02 : 0.05;
        const newMultiplier = prev + increment;
        
        if (newMultiplier >= crashMultiplier) {
          clearInterval(gameTimer);
          crash(crashMultiplier);
          return crashMultiplier;
        }
        
        return newMultiplier;
      });
    }, 100);
  };

  const crash = async (finalMultiplier: number) => {
    setGameState('crashed');
    
    // Process losing bets
    if (hasBet1 && !cashedOut1) {
      try {
        await apiRequest('POST', '/api/games/bet', {
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

    if (hasBet2 && !cashedOut2) {
      try {
        await apiRequest('POST', '/api/games/bet', {
          gameId: 2,
          betAmount: betAmount2,
          betType: 'aviator',
          won: false,
          winAmount: 0
        });
        refreshBalance();
      } catch (error) {
        console.error('Bet processing error:', error);
      }
    }

    setGameHistory(prev => [parseFloat(finalMultiplier.toFixed(2)), ...prev.slice(0, 10)]);
    
    setTimeout(() => {
      setGameState('waiting');
      setHasBet1(false);
      setHasBet2(false);
      setCrashPoint(null);
    }, 3000);
  };

  const placeBet1 = () => {
    if (gameState !== 'waiting' || parseFloat(balance) < betAmount) return;
    setHasBet1(true);
  };

  const placeBet2 = () => {
    if (gameState !== 'waiting' || parseFloat(balance) < betAmount2) return;
    setHasBet2(true);
  };

  const cashOut1 = async () => {
    if (!hasBet1 || cashedOut1 || gameState !== 'flying') return;
    
    const winAmount = betAmount * currentMultiplier;
    setCashedOut1(true);
    setCashOutAmount(winAmount);
    setShowCashOutSuccess(true);
    
    setTimeout(() => setShowCashOutSuccess(false), 2000);
    
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

  const cashOut2 = async () => {
    if (!hasBet2 || cashedOut2 || gameState !== 'flying') return;
    
    const winAmount = betAmount2 * currentMultiplier;
    setCashedOut2(true);
    setCashOutAmount(winAmount);
    setShowCashOutSuccess(true);
    
    setTimeout(() => setShowCashOutSuccess(false), 2000);
    
    try {
      await apiRequest('POST', '/api/games/bet', {
        gameId: 2,
        betAmount: betAmount2,
        betType: 'aviator',
        won: true,
        winAmount: winAmount
      });
      refreshBalance();
    } catch (error) {
      console.error('Cash out error:', error);
    }
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= 2) return 'text-green-400';
    if (multiplier >= 1.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-lg font-bold text-red-400">Aviator</div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Balance</div>
          <div className="text-yellow-400 font-bold">{balance} USD</div>
        </div>
      </div>

      {/* Game History */}
      <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2 overflow-x-auto">
        {gameHistory.map((multiplier, index) => (
          <div
            key={index}
            className={`flex-shrink-0 px-2 py-1 rounded text-sm font-bold ${getMultiplierColor(multiplier)} bg-gray-700`}
          >
            {multiplier.toFixed(2)}x
          </div>
        ))}
      </div>

      {/* Game Display */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full absolute inset-0"
          style={{ height: '300px' }}
        />
        
        {/* Multiplier Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`text-6xl font-bold ${
            gameState === 'crashed' ? 'text-red-400' : 'text-white'
          }`}>
            {currentMultiplier.toFixed(2)}x
          </div>
        </div>

        {/* Game State Indicators */}
        <div className="absolute top-4 left-4">
          {gameState === 'waiting' && (
            <div className="text-yellow-400 font-bold">
              Next round in {countdown}s
            </div>
          )}
          {gameState === 'flying' && (
            <div className="text-green-400 font-bold">
              🔥 FUN MODE
            </div>
          )}
          {gameState === 'crashed' && (
            <div className="text-red-400 font-bold">
              FLEW AWAY AT {crashPoint?.toFixed(2)}x
            </div>
          )}
        </div>

        {/* Cash Out Success */}
        <AnimatePresence>
          {showCashOutSuccess && (
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-lg font-bold"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              You have cashed out! {currentMultiplier.toFixed(2)}x
              <div className="text-center text-2xl font-bold">
                WIN {cashOutAmount.toFixed(2)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Betting Controls */}
      <div className="bg-gray-800 p-4 space-y-4">
        {/* First Bet */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setBetAmount(Math.max(1, betAmount - 10))}
                className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-white font-bold">{betAmount}</div>
              <button
                onClick={() => setBetAmount(betAmount + 10)}
                className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setBetAmount(1)}
                className="px-3 py-1 bg-gray-600 rounded text-sm"
              >
                1
              </button>
              <button
                onClick={() => setBetAmount(5)}
                className="px-3 py-1 bg-gray-600 rounded text-sm"
              >
                5
              </button>
              <button
                onClick={() => setBetAmount(10)}
                className="px-3 py-1 bg-gray-600 rounded text-sm"
              >
                10
              </button>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={placeBet1}
              disabled={gameState !== 'waiting' || hasBet1}
              className={`flex-1 py-3 rounded-lg font-bold ${
                hasBet1 ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-400'
              } disabled:opacity-50`}
            >
              {hasBet1 ? 'BET' : `BET ${betAmount} USD`}
            </button>
            <button
              onClick={cashOut1}
              disabled={!hasBet1 || cashedOut1 || gameState !== 'flying'}
              className={`flex-1 py-3 rounded-lg font-bold ${
                hasBet1 && !cashedOut1 && gameState === 'flying' 
                  ? 'bg-green-500 hover:bg-green-400' 
                  : 'bg-gray-500'
              } disabled:opacity-50`}
            >
              {cashedOut1 ? 'CASHED OUT' : `CASH OUT ${(betAmount * currentMultiplier).toFixed(2)}`}
            </button>
          </div>
        </div>

        {/* Second Bet */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setBetAmount2(Math.max(1, betAmount2 - 10))}
                className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-white font-bold">{betAmount2}</div>
              <button
                onClick={() => setBetAmount2(betAmount2 + 10)}
                className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setBetAmount2(1)}
                className="px-3 py-1 bg-gray-600 rounded text-sm"
              >
                1
              </button>
              <button
                onClick={() => setBetAmount2(5)}
                className="px-3 py-1 bg-gray-600 rounded text-sm"
              >
                5
              </button>
              <button
                onClick={() => setBetAmount2(10)}
                className="px-3 py-1 bg-gray-600 rounded text-sm"
              >
                10
              </button>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={placeBet2}
              disabled={gameState !== 'waiting' || hasBet2}
              className={`flex-1 py-3 rounded-lg font-bold ${
                hasBet2 ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-400'
              } disabled:opacity-50`}
            >
              {hasBet2 ? 'BET' : `BET ${betAmount2} USD`}
            </button>
            <button
              onClick={cashOut2}
              disabled={!hasBet2 || cashedOut2 || gameState !== 'flying'}
              className={`flex-1 py-3 rounded-lg font-bold ${
                hasBet2 && !cashedOut2 && gameState === 'flying' 
                  ? 'bg-green-500 hover:bg-green-400' 
                  : 'bg-gray-500'
              } disabled:opacity-50`}
            >
              {cashedOut2 ? 'CASHED OUT' : `CASH OUT ${(betAmount2 * currentMultiplier).toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}