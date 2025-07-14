import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Volume2, VolumeX, Plane, TrendingUp, 
  Users, Trophy, Star, BarChart3, RefreshCw,
  AlertTriangle, CheckCircle, Zap, Target
} from 'lucide-react';

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

interface FlightHistory {
  multiplier: number;
  timestamp: Date;
  crashed: boolean;
}

interface BetData {
  amount: number;
  autoCashOut?: number;
  isActive: boolean;
  cashOutAt?: number;
  winAmount?: number;
}

export default function ProductionReadyAviator({ onBack, user, onBalanceUpdate }: Props) {
  // Game States
  const [gamePhase, setGamePhase] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [flightDuration, setFlightDuration] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeToNextFlight, setTimeToNextFlight] = useState(5);
  
  // Canvas and Animation
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [planePosition, setPlanePosition] = useState({ x: 50, y: 300 });
  const [flightPath, setFlightPath] = useState<Array<{x: number, y: number}>>([]);
  
  // Betting States
  const [bet1, setBet1] = useState<BetData>({ amount: 10, isActive: false });
  const [bet2, setBet2] = useState<BetData>({ amount: 10, isActive: false });
  const [bet1Amount, setBet1Amount] = useState('10');
  const [bet2Amount, setBet2Amount] = useState('10');
  const [bet1AutoCashOut, setBet1AutoCashOut] = useState('');
  const [bet2AutoCashOut, setBet2AutoCashOut] = useState('');
  
  // Game Data
  const [flightHistory, setFlightHistory] = useState<FlightHistory[]>([
    { multiplier: 2.34, timestamp: new Date(), crashed: true },
    { multiplier: 1.05, timestamp: new Date(), crashed: true },
    { multiplier: 5.67, timestamp: new Date(), crashed: true },
    { multiplier: 1.23, timestamp: new Date(), crashed: true },
    { multiplier: 8.90, timestamp: new Date(), crashed: true },
    { multiplier: 1.45, timestamp: new Date(), crashed: true },
    { multiplier: 3.21, timestamp: new Date(), crashed: true },
  ]);
  
  // Statistics
  const [playerStats, setPlayerStats] = useState({
    totalFlights: 89,
    winRate: 45.2,
    biggestWin: 1240,
    averageMultiplier: 2.76,
    currentStreak: 3
  });

  // Quick bet amounts
  const quickAmounts = ['10', '50', '100', '500', '1000'];

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const drawGame = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.strokeStyle = '#ffffff20';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      
      // Draw flight path
      if (flightPath.length > 1) {
        ctx.strokeStyle = gamePhase === 'crashed' ? '#ef4444' : '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(flightPath[0].x, flightPath[0].y);
        for (let i = 1; i < flightPath.length; i++) {
          ctx.lineTo(flightPath[i].x, flightPath[i].y);
        }
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = gamePhase === 'crashed' ? '#ef4444' : '#10b981';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      
      // Draw plane
      if (gamePhase === 'flying' || gamePhase === 'crashed') {
        const planeSize = 20;
        ctx.fillStyle = gamePhase === 'crashed' ? '#ef4444' : '#ffffff';
        ctx.save();
        ctx.translate(planePosition.x, planePosition.y);
        
        // Simple plane shape
        ctx.beginPath();
        ctx.moveTo(-planeSize/2, 0);
        ctx.lineTo(planeSize/2, -planeSize/4);
        ctx.lineTo(planeSize/2, planeSize/4);
        ctx.closePath();
        ctx.fill();
        
        // Plane trail
        if (gamePhase === 'flying') {
          ctx.strokeStyle = '#ffffff40';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-planeSize, 0);
          ctx.lineTo(-planeSize*2, 0);
          ctx.stroke();
        }
        
        ctx.restore();
      }
      
      // Draw multiplier
      if (gamePhase === 'flying') {
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#10b981';
        ctx.textAlign = 'center';
        ctx.fillText(`${currentMultiplier.toFixed(2)}x`, canvas.width/2, 60);
      } else if (gamePhase === 'crashed') {
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#ef4444';
        ctx.textAlign = 'center';
        ctx.fillText('CRASHED!', canvas.width/2, canvas.height/2);
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`at ${currentMultiplier.toFixed(2)}x`, canvas.width/2, canvas.height/2 + 30);
      }
    };
    
    drawGame();
    
    if (gamePhase === 'flying') {
      animationRef.current = requestAnimationFrame(drawGame);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gamePhase, currentMultiplier, planePosition, flightPath]);

  // Game loop effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gamePhase === 'waiting') {
      interval = setInterval(() => {
        setTimeToNextFlight(prev => {
          if (prev <= 1) {
            startFlight();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gamePhase === 'flying') {
      interval = setInterval(() => {
        setFlightDuration(prev => prev + 0.1);
        
        // Update multiplier with realistic curve
        const newMultiplier = Math.pow(Math.E, flightDuration * 0.2);
        setCurrentMultiplier(newMultiplier);
        
        // Update plane position
        const progress = Math.min(flightDuration * 0.1, 1);
        const newX = 50 + (progress * 300);
        const newY = 300 - (Math.pow(progress, 0.7) * 200);
        
        setPlanePosition({ x: newX, y: newY });
        setFlightPath(prev => [...prev, { x: newX, y: newY }]);
        
        // Check for crash (random probability increases over time)
        const crashProbability = Math.min(flightDuration * 0.01, 0.8);
        if (Math.random() < crashProbability && flightDuration > 1) {
          crashPlane();
        }
        
        // Auto cash out checks
        if (bet1.isActive && bet1.autoCashOut && newMultiplier >= bet1.autoCashOut) {
          cashOut(1);
        }
        if (bet2.isActive && bet2.autoCashOut && newMultiplier >= bet2.autoCashOut) {
          cashOut(2);
        }
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [gamePhase, flightDuration, bet1, bet2]);

  const startFlight = () => {
    setGamePhase('flying');
    setFlightDuration(0);
    setCurrentMultiplier(1.00);
    setPlanePosition({ x: 50, y: 300 });
    setFlightPath([{ x: 50, y: 300 }]);
    playSound('takeoff');
  };

  const crashPlane = () => {
    setGamePhase('crashed');
    
    // Add to history
    const newFlight: FlightHistory = {
      multiplier: currentMultiplier,
      timestamp: new Date(),
      crashed: true
    };
    setFlightHistory(prev => [newFlight, ...prev.slice(0, 19)]);
    
    // Handle active bets
    if (bet1.isActive && !bet1.cashOutAt) {
      setBet1(prev => ({ ...prev, isActive: false, winAmount: 0 }));
    }
    if (bet2.isActive && !bet2.cashOutAt) {
      setBet2(prev => ({ ...prev, isActive: false, winAmount: 0 }));
    }
    
    playSound('crash');
    
    // Reset for next round
    setTimeout(() => {
      setGamePhase('waiting');
      setTimeToNextFlight(5);
      setBet1(prev => ({ ...prev, isActive: false, cashOutAt: undefined, winAmount: undefined }));
      setBet2(prev => ({ ...prev, isActive: false, cashOutAt: undefined, winAmount: undefined }));
    }, 3000);
  };

  const placeBet = (betNumber: 1 | 2) => {
    if (gamePhase !== 'waiting') return;
    
    const amount = parseInt(betNumber === 1 ? bet1Amount : bet2Amount);
    const autoCashOut = betNumber === 1 ? 
      (bet1AutoCashOut ? parseFloat(bet1AutoCashOut) : undefined) :
      (bet2AutoCashOut ? parseFloat(bet2AutoCashOut) : undefined);
    
    if (amount < 10) return;
    
    const newBet: BetData = {
      amount,
      autoCashOut,
      isActive: true
    };
    
    if (betNumber === 1) {
      setBet1(newBet);
    } else {
      setBet2(newBet);
    }
    
    playSound('bet');
  };

  const cashOut = (betNumber: 1 | 2) => {
    if (gamePhase !== 'flying') return;
    
    const bet = betNumber === 1 ? bet1 : bet2;
    if (!bet.isActive || bet.cashOutAt) return;
    
    const winAmount = bet.amount * currentMultiplier;
    
    if (betNumber === 1) {
      setBet1(prev => ({ ...prev, cashOutAt: currentMultiplier, winAmount }));
    } else {
      setBet2(prev => ({ ...prev, cashOutAt: currentMultiplier, winAmount }));
    }
    
    onBalanceUpdate();
    playSound('cashout');
  };

  const playSound = (type: string) => {
    if (!soundEnabled) return;
    console.log(`Playing sound: ${type}`);
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier < 2) return 'text-red-400';
    if (multiplier < 5) return 'text-yellow-400';
    if (multiplier < 10) return 'text-green-400';
    return 'text-purple-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-lg">
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              <Plane className="w-6 h-6 text-blue-400" />
              <div>
                <div className="text-xl font-bold">Aviator</div>
                <div className="text-sm opacity-70">Crash Game</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm opacity-70">Balance</div>
              <div className="text-lg font-bold text-green-400">₹{user.walletBalance}</div>
            </div>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Game Status */}
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>{Math.floor(Math.random() * 500 + 200)} playing</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Last: {flightHistory[0]?.multiplier.toFixed(2)}x</span>
            </div>
          </div>
          
          {gamePhase === 'waiting' && (
            <div className="text-yellow-400">
              Next flight in {timeToNextFlight}s
            </div>
          )}
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative h-64 bg-gradient-to-b from-blue-900 to-purple-900">
        <canvas 
          ref={canvasRef}
          className="w-full h-full"
        />
        
        {/* Game Status Overlay */}
        {gamePhase === 'waiting' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {timeToNextFlight}
              </div>
              <div className="text-lg opacity-70">
                Starting in...
              </div>
            </div>
          </div>
        )}
        
        {gamePhase === 'flying' && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="text-6xl font-bold text-green-400 animate-pulse">
              {currentMultiplier.toFixed(2)}x
            </div>
          </div>
        )}
      </div>

      {/* Flight History */}
      <div className="bg-gray-800 px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {flightHistory.slice(0, 10).map((flight, index) => (
            <div 
              key={index}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                getMultiplierColor(flight.multiplier)
              } bg-gray-700`}
            >
              {flight.multiplier.toFixed(2)}x
            </div>
          ))}
        </div>
      </div>

      {/* Betting Panel */}
      <div className="p-4 space-y-4">
        {/* Bet Controls */}
        <div className="grid grid-cols-2 gap-4">
          {/* Bet 1 */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="text-sm opacity-70 mb-2">Bet 1</div>
            
            {/* Amount Input */}
            <div className="mb-3">
              <div className="text-xs opacity-70 mb-1">Amount</div>
              <input
                type="number"
                value={bet1Amount}
                onChange={(e) => setBet1Amount(e.target.value)}
                disabled={bet1.isActive}
                className="w-full bg-gray-700 rounded-lg p-2 text-white"
                min="10"
              />
            </div>
            
            {/* Quick Amounts */}
            <div className="grid grid-cols-5 gap-1 mb-3">
              {quickAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setBet1Amount(amount)}
                  disabled={bet1.isActive}
                  className="py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                >
                  {amount}
                </button>
              ))}
            </div>
            
            {/* Auto Cash Out */}
            <div className="mb-3">
              <div className="text-xs opacity-70 mb-1">Auto Cash Out</div>
              <input
                type="number"
                value={bet1AutoCashOut}
                onChange={(e) => setBet1AutoCashOut(e.target.value)}
                disabled={bet1.isActive}
                className="w-full bg-gray-700 rounded-lg p-2 text-white"
                placeholder="Optional"
                step="0.01"
                min="1.01"
              />
            </div>
            
            {/* Bet/Cash Out Button */}
            {!bet1.isActive ? (
              <button
                onClick={() => placeBet(1)}
                disabled={gamePhase === 'flying'}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-3 rounded-lg font-bold transition-colors"
              >
                Bet ₹{bet1Amount}
              </button>
            ) : bet1.cashOutAt ? (
              <div className="text-center py-3">
                <div className="text-green-400 font-bold">Cashed Out!</div>
                <div className="text-sm">₹{bet1.winAmount?.toFixed(2)} at {bet1.cashOutAt.toFixed(2)}x</div>
              </div>
            ) : (
              <button
                onClick={() => cashOut(1)}
                disabled={gamePhase !== 'flying'}
                className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 py-3 rounded-lg font-bold transition-colors animate-pulse"
              >
                Cash Out ₹{(bet1.amount * currentMultiplier).toFixed(2)}
              </button>
            )}
          </div>

          {/* Bet 2 */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="text-sm opacity-70 mb-2">Bet 2</div>
            
            {/* Amount Input */}
            <div className="mb-3">
              <div className="text-xs opacity-70 mb-1">Amount</div>
              <input
                type="number"
                value={bet2Amount}
                onChange={(e) => setBet2Amount(e.target.value)}
                disabled={bet2.isActive}
                className="w-full bg-gray-700 rounded-lg p-2 text-white"
                min="10"
              />
            </div>
            
            {/* Quick Amounts */}
            <div className="grid grid-cols-5 gap-1 mb-3">
              {quickAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setBet2Amount(amount)}
                  disabled={bet2.isActive}
                  className="py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                >
                  {amount}
                </button>
              ))}
            </div>
            
            {/* Auto Cash Out */}
            <div className="mb-3">
              <div className="text-xs opacity-70 mb-1">Auto Cash Out</div>
              <input
                type="number"
                value={bet2AutoCashOut}
                onChange={(e) => setBet2AutoCashOut(e.target.value)}
                disabled={bet2.isActive}
                className="w-full bg-gray-700 rounded-lg p-2 text-white"
                placeholder="Optional"
                step="0.01"
                min="1.01"
              />
            </div>
            
            {/* Bet/Cash Out Button */}
            {!bet2.isActive ? (
              <button
                onClick={() => placeBet(2)}
                disabled={gamePhase === 'flying'}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-3 rounded-lg font-bold transition-colors"
              >
                Bet ₹{bet2Amount}
              </button>
            ) : bet2.cashOutAt ? (
              <div className="text-center py-3">
                <div className="text-green-400 font-bold">Cashed Out!</div>
                <div className="text-sm">₹{bet2.winAmount?.toFixed(2)} at {bet2.cashOutAt.toFixed(2)}x</div>
              </div>
            ) : (
              <button
                onClick={() => cashOut(2)}
                disabled={gamePhase !== 'flying'}
                className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 py-3 rounded-lg font-bold transition-colors animate-pulse"
              >
                Cash Out ₹{(bet2.amount * currentMultiplier).toFixed(2)}
              </button>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-sm opacity-70 mb-3">Your Statistics</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-400">{playerStats.totalFlights}</div>
              <div className="text-xs opacity-70">Flights</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">{playerStats.winRate}%</div>
              <div className="text-xs opacity-70">Win Rate</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">₹{playerStats.biggestWin}</div>
              <div className="text-xs opacity-70">Best Win</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}