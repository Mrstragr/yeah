import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2 } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function AuthenticAviatorGame({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [multiplier, setMultiplier] = useState(1.00);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [betAmount1, setBetAmount1] = useState(10);
  const [betAmount2, setBetAmount2] = useState(10);
  const [isBet1Active, setIsBet1Active] = useState(false);
  const [isBet2Active, setIsBet2Active] = useState(false);
  const [cashOut1, setCashOut1] = useState(0);
  const [cashOut2, setCashOut2] = useState(0);
  const [balance, setBalance] = useState(12580.45);
  const [waitTime, setWaitTime] = useState(5);
  const [hasFlown, setHasFlown] = useState(false);

  // Game history multipliers
  const [gameHistory, setGameHistory] = useState([2.45, 1.23, 5.67, 1.89, 3.21, 1.45, 8.90, 2.34, 1.67, 4.56]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStatus === 'waiting') {
      interval = setInterval(() => {
        setWaitTime(prev => {
          if (prev <= 1) {
            setGameStatus('flying');
            setMultiplier(1.00);
            setHasFlown(false);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameStatus === 'flying') {
      interval = setInterval(() => {
        setMultiplier(prev => {
          const newMultiplier = prev + (Math.random() * 0.05 + 0.01);
          
          // Random crash probability that increases with multiplier
          const crashProbability = Math.min(0.01 * Math.pow(newMultiplier - 1, 1.5), 0.1);
          
          if (Math.random() < crashProbability || newMultiplier > 20) {
            setGameStatus('crashed');
            setHasFlown(true);
            
            // Update game history
            setGameHistory(prev => [newMultiplier, ...prev.slice(0, 9)]);
            
            // Reset after crash
            setTimeout(() => {
              setGameStatus('waiting');
              setWaitTime(5);
              setIsBet1Active(false);
              setIsBet2Active(false);
              setCashOut1(0);
              setCashOut2(0);
            }, 3000);
            
            return newMultiplier;
          }
          
          return newMultiplier;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [gameStatus]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 350;
    canvas.height = 200;

    const drawFlight = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dark background
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gameStatus === 'flying' || gameStatus === 'crashed') {
        // Draw flight curve
        const progress = Math.min((multiplier - 1) * 50, canvas.width - 50);
        const curveHeight = Math.min((multiplier - 1) * 20, canvas.height - 100);
        
        ctx.strokeStyle = gameStatus === 'crashed' ? '#ef4444' : '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(20, canvas.height - 30);
        
        // Smooth curve using quadratic bezier
        for (let x = 20; x <= 20 + progress; x++) {
          const normalizedX = (x - 20) / progress;
          const y = canvas.height - 30 - (Math.pow(normalizedX, 0.7) * curveHeight);
          ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw airplane at the end of curve
        if (!hasFlown) {
          const planeX = 20 + progress;
          const planeY = canvas.height - 30 - (Math.pow(progress / (canvas.width - 70), 0.7) * curveHeight);
          
          ctx.fillStyle = '#ffffff';
          ctx.font = '16px Arial';
          ctx.fillText('✈️', planeX - 8, planeY + 5);
        }

        // Show "FLEW AWAY" if crashed
        if (gameStatus === 'crashed') {
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('FLEW AWAY!', canvas.width / 2, canvas.height / 2);
          
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px Arial';
          ctx.fillText(`${multiplier.toFixed(2)}x`, canvas.width / 2, canvas.height / 2 + 30);
        }
      } else {
        // Waiting state
        ctx.fillStyle = '#6b7280';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('WAITING FOR NEXT ROUND...', canvas.width / 2, canvas.height / 2);
        
        ctx.font = '24px Arial';
        ctx.fillStyle = '#ef4444';
        ctx.fillText(waitTime.toString(), canvas.width / 2, canvas.height / 2 + 40);
      }
    };

    const animate = () => {
      drawFlight();
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [multiplier, gameStatus, waitTime, hasFlown]);

  const placeBet = (betNumber: 1 | 2) => {
    if (gameStatus !== 'waiting') return;
    
    const amount = betNumber === 1 ? betAmount1 : betAmount2;
    if (balance < amount) return;
    
    setBalance(prev => prev - amount);
    
    if (betNumber === 1) {
      setIsBet1Active(true);
    } else {
      setIsBet2Active(true);
    }
  };

  const cashOut = (betNumber: 1 | 2) => {
    if (gameStatus !== 'flying') return;
    
    const amount = betNumber === 1 ? betAmount1 : betAmount2;
    const winAmount = amount * multiplier;
    
    setBalance(prev => prev + winAmount);
    
    if (betNumber === 1) {
      setIsBet1Active(false);
      setCashOut1(multiplier);
    } else {
      setIsBet2Active(false);
      setCashOut2(multiplier);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-md mx-auto bg-gray-900 min-h-screen text-white">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <div className="text-2xl font-bold">✈️ AVIATOR</div>
              <div className="text-purple-100 text-sm">Crash Game</div>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Balance Display */}
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-purple-100 text-sm">Available Balance</div>
              <div className="text-white text-2xl font-bold">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>

        {/* Game History Strip */}
        <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {gameHistory.map((mult, index) => (
              <div 
                key={index}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold ${
                  mult >= 2 ? 'bg-green-600' : mult >= 1.5 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
              >
                {mult.toFixed(2)}x
              </div>
            ))}
          </div>
        </div>

        {/* Current Multiplier Display */}
        <div className="text-center py-6">
          <motion.div 
            animate={{ 
              scale: gameStatus === 'flying' ? [1, 1.1, 1] : 1,
              color: gameStatus === 'crashed' ? '#ef4444' : '#10b981'
            }}
            transition={{ duration: 0.5, repeat: gameStatus === 'flying' ? Infinity : 0 }}
            className="text-6xl font-bold"
          >
            {gameStatus === 'waiting' ? '---' : `${multiplier.toFixed(2)}x`}
          </motion.div>
          <div className="text-sm text-gray-400 mt-2">
            {gameStatus === 'waiting' && `Starting in ${waitTime}s`}
            {gameStatus === 'flying' && 'Flying...'}
            {gameStatus === 'crashed' && 'Crashed!'}
          </div>
        </div>

        {/* Game Canvas */}
        <div className="flex justify-center mb-6">
          <canvas 
            ref={canvasRef}
            className="border border-gray-700 rounded-lg"
          />
        </div>

        {/* Betting Interface */}
        <div className="px-6 pb-20">
          <div className="grid grid-cols-2 gap-4 mb-6">
            
            {/* Bet 1 */}
            <div className="bg-gray-800 rounded-2xl p-4">
              <div className="text-center mb-3">
                <div className="text-sm text-gray-400 mb-2">Bet 1</div>
                <div className="flex items-center justify-between mb-3">
                  <button 
                    onClick={() => setBetAmount1(Math.max(10, betAmount1 - 10))}
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600"
                  >
                    -
                  </button>
                  <input 
                    type="number"
                    value={betAmount1}
                    onChange={(e) => setBetAmount1(Math.max(10, parseInt(e.target.value) || 10))}
                    className="bg-gray-700 text-center rounded px-2 py-1 w-16 text-sm"
                  />
                  <button 
                    onClick={() => setBetAmount1(betAmount1 + 10)}
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600"
                  >
                    +
                  </button>
                </div>
                
                {!isBet1Active && gameStatus === 'waiting' && (
                  <button 
                    onClick={() => placeBet(1)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-sm transition-colors"
                  >
                    BET ₹{betAmount1}
                  </button>
                )}
                
                {isBet1Active && gameStatus === 'flying' && (
                  <button 
                    onClick={() => cashOut(1)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-bold text-sm transition-colors animate-pulse"
                  >
                    CASH OUT
                    <div className="text-xs">₹{(betAmount1 * multiplier).toFixed(2)}</div>
                  </button>
                )}
                
                {isBet1Active && gameStatus === 'waiting' && (
                  <div className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm text-center">
                    BETTING...
                  </div>
                )}
                
                {cashOut1 > 0 && (
                  <div className="text-green-400 text-sm mt-2">
                    ✓ Cashed out at {cashOut1.toFixed(2)}x
                  </div>
                )}
              </div>
            </div>

            {/* Bet 2 */}
            <div className="bg-gray-800 rounded-2xl p-4">
              <div className="text-center mb-3">
                <div className="text-sm text-gray-400 mb-2">Bet 2</div>
                <div className="flex items-center justify-between mb-3">
                  <button 
                    onClick={() => setBetAmount2(Math.max(10, betAmount2 - 10))}
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600"
                  >
                    -
                  </button>
                  <input 
                    type="number"
                    value={betAmount2}
                    onChange={(e) => setBetAmount2(Math.max(10, parseInt(e.target.value) || 10))}
                    className="bg-gray-700 text-center rounded px-2 py-1 w-16 text-sm"
                  />
                  <button 
                    onClick={() => setBetAmount2(betAmount2 + 10)}
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600"
                  >
                    +
                  </button>
                </div>
                
                {!isBet2Active && gameStatus === 'waiting' && (
                  <button 
                    onClick={() => placeBet(2)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-sm transition-colors"
                  >
                    BET ₹{betAmount2}
                  </button>
                )}
                
                {isBet2Active && gameStatus === 'flying' && (
                  <button 
                    onClick={() => cashOut(2)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-bold text-sm transition-colors animate-pulse"
                  >
                    CASH OUT
                    <div className="text-xs">₹{(betAmount2 * multiplier).toFixed(2)}</div>
                  </button>
                )}
                
                {isBet2Active && gameStatus === 'waiting' && (
                  <div className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm text-center">
                    BETTING...
                  </div>
                )}
                
                {cashOut2 > 0 && (
                  <div className="text-green-400 text-sm mt-2">
                    ✓ Cashed out at {cashOut2.toFixed(2)}x
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Bet Amounts */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Quick Bets</div>
            <div className="grid grid-cols-4 gap-2">
              {[10, 50, 100, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setBetAmount1(amount);
                    setBetAmount2(amount);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  ₹{amount}
                </button>
              ))}
            </div>
          </div>

          {/* Game Stats */}
          <div className="bg-gray-800 rounded-2xl p-4">
            <div className="text-sm text-gray-400 mb-2">Current Round Stats</div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-white text-lg font-bold">{gameHistory.length}</div>
                <div className="text-xs text-gray-400">Total Rounds</div>
              </div>
              <div>
                <div className="text-green-400 text-lg font-bold">
                  {(gameHistory.reduce((a, b) => a + b, 0) / gameHistory.length).toFixed(2)}x
                </div>
                <div className="text-xs text-gray-400">Average</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}