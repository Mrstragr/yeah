import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, TrendingUp, DollarSign } from 'lucide-react';

interface GameStats {
  multiplier: number;
  isFlying: boolean;
  crashed: boolean;
  cashedOut: boolean;
  cashOutMultiplier?: number;
  timeElapsed: number;
  altitude: number;
}

interface BettingState {
  betAmount: number;
  autoCashOut: number;
  isPlaying: boolean;
  winAmount: number;
}

const AdvancedAviatorGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const crashPointRef = useRef<number>(2.0);
  
  const [gameStats, setGameStats] = useState<GameStats>({
    multiplier: 1.00,
    isFlying: false,
    crashed: false,
    cashedOut: false,
    timeElapsed: 0,
    altitude: 0
  });

  const [betting, setBetting] = useState<BettingState>({
    betAmount: 100,
    autoCashOut: 2.0,
    isPlaying: false,
    winAmount: 0
  });

  const [graphData, setGraphData] = useState<{x: number, y: number}[]>([]);
  const [isWaitingForNextRound, setIsWaitingForNextRound] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Smooth exponential curve calculation
  const calculateMultiplier = (timeElapsed: number): number => {
    const baseGrowth = Math.pow(1.06, timeElapsed / 100);
    const randomFactor = 1 + (Math.random() - 0.5) * 0.01;
    return Math.max(1.0, baseGrowth * randomFactor);
  };

  // Determine crash point (random but weighted)
  const getCrashPoint = (): number => {
    const random = Math.random();
    if (random < 0.3) return 1.0 + Math.random() * 1.5; // 30% chance: 1.0-2.5x
    if (random < 0.6) return 2.5 + Math.random() * 2.5; // 30% chance: 2.5-5.0x
    if (random < 0.85) return 5.0 + Math.random() * 10; // 25% chance: 5.0-15.0x
    return 15.0 + Math.random() * 85; // 15% chance: 15.0-100.0x
  };

  // Draw animated graph
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    
    // Clear canvas with dark gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= 8; i++) {
      const y = (height / 8) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw the curve
    if (graphData.length > 1) {
      // Create gradient for the curve
      const curveGradient = ctx.createLinearGradient(0, height, 0, 0);
      curveGradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
      curveGradient.addColorStop(0.5, 'rgba(220, 38, 127, 0.9)');
      curveGradient.addColorStop(1, 'rgba(147, 51, 234, 1)');

      // Draw the area under curve
      ctx.beginPath();
      ctx.moveTo(graphData[0].x, height);
      graphData.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.lineTo(graphData[graphData.length - 1].x, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.fill();

      // Draw the main curve line
      ctx.beginPath();
      ctx.moveTo(graphData[0].x, graphData[0].y);
      
      for (let i = 1; i < graphData.length; i++) {
        const prev = graphData[i - 1];
        const curr = graphData[i];
        
        // Smooth bezier curve
        const cpx = prev.x + (curr.x - prev.x) * 0.5;
        const cpy = prev.y;
        ctx.quadraticCurveTo(cpx, cpy, curr.x, curr.y);
      }
      
      ctx.strokeStyle = curveGradient;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw glowing effect
      ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw the plane at the end of curve
      if (gameStats.isFlying) {
        const lastPoint = graphData[graphData.length - 1];
        if (lastPoint) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '20px Arial';
          ctx.fillText('✈️', lastPoint.x - 10, lastPoint.y - 10);
        }
      }
    }
  }, [graphData, gameStats.isFlying]);

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const timeElapsed = timestamp - startTimeRef.current;
    const multiplier = calculateMultiplier(timeElapsed);
    
    // Check for crash
    const shouldCrash = multiplier >= crashPointRef.current;

    if (shouldCrash && !gameStats.crashed) {
      // Game crashed
      setGameStats(prev => ({
        ...prev,
        crashed: true,
        isFlying: false,
        multiplier: crashPointRef.current
      }));
      
      // End round
      setTimeout(() => {
        setIsWaitingForNextRound(true);
        setCountdown(5);
      }, 1000);

      return;
    }

    // Auto cash out
    if (betting.autoCashOut > 0 && multiplier >= betting.autoCashOut && !gameStats.cashedOut && betting.isPlaying) {
      handleCashOut();
      return;
    }

    // Update game state
    setGameStats(prev => ({
      ...prev,
      multiplier: multiplier,
      timeElapsed: timeElapsed,
      altitude: multiplier * 50
    }));

    // Update graph data
    const canvas = canvasRef.current;
    if (canvas) {
      const x = Math.min((timeElapsed / 50), canvas.width - 50);
      const y = canvas.height - (multiplier - 1) * 50 - 50;
      
      setGraphData(prev => {
        const newData = [...prev, { x, y }];
        return newData.slice(-100); // Keep last 100 points
      });
    }

    if (gameStats.isFlying && !gameStats.crashed) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [gameStats, betting]);

  // Start new round
  const startRound = () => {
    crashPointRef.current = getCrashPoint();
    
    setGameStats({
      multiplier: 1.00,
      isFlying: true,
      crashed: false,
      cashedOut: false,
      timeElapsed: 0,
      altitude: 0
    });
    
    setGraphData([{ x: 0, y: canvasRef.current?.height ? canvasRef.current.height - 50 : 250 }]);
    startTimeRef.current = undefined;
    setIsWaitingForNextRound(false);
    
    if (betting.betAmount > 0) {
      setBetting(prev => ({ ...prev, isPlaying: true, winAmount: 0 }));
    }

    requestAnimationFrame(animate);
  };

  // Place bet
  const placeBet = () => {
    if (gameStats.isFlying || isWaitingForNextRound) return;
    
    setBetting(prev => ({ ...prev, isPlaying: true }));
    startRound();
  };

  // Cash out
  const handleCashOut = () => {
    if (!betting.isPlaying || gameStats.cashedOut || gameStats.crashed) return;

    const winAmount = betting.betAmount * gameStats.multiplier;
    
    setGameStats(prev => ({
      ...prev,
      cashedOut: true,
      cashOutMultiplier: prev.multiplier
    }));
    
    setBetting(prev => ({
      ...prev,
      winAmount: winAmount,
      isPlaying: false
    }));
  };

  // Countdown for next round
  useEffect(() => {
    if (isWaitingForNextRound && countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isWaitingForNextRound) {
      startRound();
    }
  }, [countdown, isWaitingForNextRound]);

  // Draw graph
  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-xl p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Plane className="text-red-500 text-2xl" />
          <h2 className="text-2xl font-bold text-white">Aviator</h2>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Balance</div>
          <div className="text-xl font-bold text-green-400">₹10,000.00</div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative mb-6 rounded-lg overflow-hidden border-2 border-gray-700">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full h-64 bg-gradient-to-br from-gray-900 to-purple-900"
        />
        
        {/* Multiplier Display */}
        <div className="absolute top-6 left-6">
          <AnimatePresence>
            <motion.div
              key={gameStats.multiplier}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="text-6xl font-bold text-white drop-shadow-lg"
              style={{
                color: gameStats.crashed ? '#ef4444' : 
                       gameStats.cashedOut ? '#10b981' : '#ffffff'
              }}
            >
              {gameStats.multiplier.toFixed(2)}x
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Status Messages */}
        <div className="absolute top-6 right-6">
          {gameStats.crashed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
            >
              FLEW AWAY! 🛫
            </motion.div>
          )}
          
          {gameStats.cashedOut && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold"
            >
              CASHED OUT! 💰
            </motion.div>
          )}
          
          {isWaitingForNextRound && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold"
            >
              Next Round: {countdown}s
            </motion.div>
          )}
        </div>

        {/* Win Display */}
        {betting.winAmount > 0 && (
          <div className="absolute bottom-6 left-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-xl"
            >
              Won: ₹{betting.winAmount.toFixed(2)}
            </motion.div>
          </div>
        )}
      </div>

      {/* Betting Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bet Amount */}
        <div className="bg-gray-800 rounded-lg p-4">
          <label className="block text-sm text-gray-400 mb-2">Bet Amount</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={betting.betAmount}
              onChange={(e) => setBetting(prev => ({ ...prev, betAmount: Number(e.target.value) }))}
              className="flex-1 bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
              min="10"
              max="10000"
              disabled={gameStats.isFlying}
            />
            <div className="flex space-x-1">
              {[50, 100, 500, 1000].map(amount => (
                <button
                  key={amount}
                  onClick={() => setBetting(prev => ({ ...prev, betAmount: amount }))}
                  className="px-2 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500"
                  disabled={gameStats.isFlying}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Auto Cash Out */}
        <div className="bg-gray-800 rounded-lg p-4">
          <label className="block text-sm text-gray-400 mb-2">Auto Cash Out</label>
          <input
            type="number"
            value={betting.autoCashOut}
            onChange={(e) => setBetting(prev => ({ ...prev, autoCashOut: Number(e.target.value) }))}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600"
            min="1.01"
            max="100"
            step="0.01"
            disabled={gameStats.isFlying}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={placeBet}
          disabled={gameStats.isFlying || isWaitingForNextRound || betting.betAmount <= 0}
          className={`flex-1 py-4 rounded-lg font-bold text-xl transition-all ${
            gameStats.isFlying || isWaitingForNextRound 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/25'
          }`}
        >
          {isWaitingForNextRound ? `Next Round (${countdown}s)` : 
           gameStats.isFlying ? 'Round in Progress' : 
           `BET ₹${betting.betAmount}`}
        </button>

        <button
          onClick={handleCashOut}
          disabled={!betting.isPlaying || gameStats.cashedOut || gameStats.crashed}
          className={`flex-1 py-4 rounded-lg font-bold text-xl transition-all ${
            betting.isPlaying && !gameStats.cashedOut && !gameStats.crashed
              ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-orange-500/25 animate-pulse'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {betting.isPlaying && !gameStats.cashedOut && !gameStats.crashed 
            ? `CASH OUT ${gameStats.multiplier.toFixed(2)}x`
            : 'CASH OUT'}
        </button>
      </div>

      {/* Recent Multipliers */}
      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-bold mb-2">Recent Results</h3>
        <div className="flex space-x-2 overflow-x-auto">
          {[2.31, 1.65, 37.60, 9.81, 1.02, 5.43, 12.67, 1.89].map((mult, index) => (
            <div
              key={index}
              className={`px-3 py-1 rounded text-sm font-bold ${
                mult < 2 ? 'bg-red-600 text-white' :
                mult < 10 ? 'bg-yellow-600 text-white' :
                'bg-green-600 text-white'
              }`}
            >
              {mult.toFixed(2)}x
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAviatorGame;