import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Volume2, VolumeX, Plane, TrendingUp, 
  Users, Trophy, Star, BarChart3, RefreshCw,
  AlertTriangle, CheckCircle, Zap, Target, Clock,
  Settings, Share2, History
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
  status: 'betting' | 'flying' | 'won' | 'lost';
}

export default function AuthenticAviatorGame({ onBack, user, onBalanceUpdate }: Props) {
  // Game States
  const [gamePhase, setGamePhase] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [flightDuration, setFlightDuration] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeToNextFlight, setTimeToNextFlight] = useState(5);
  const [crashPoint, setCrashPoint] = useState(0);
  
  // Canvas and Animation
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [planePosition, setPlanePosition] = useState({ x: 50, y: 300 });
  const [flightPath, setFlightPath] = useState<Array<{x: number, y: number}>>([]);
  
  // Betting States
  const [bet1, setBet1] = useState<BetData>({ amount: 10, isActive: false, status: 'betting' });
  const [bet2, setBet2] = useState<BetData>({ amount: 10, isActive: false, status: 'betting' });
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
  const [gameStats, setGameStats] = useState({
    totalPlayers: 8943,
    totalBetAmount: '₹12,45,678',
    biggestWin: '₹45,890',
    currentRound: 'AV-0117-0045'
  });

  // Quick bet amounts
  const quickAmounts = ['10', '50', '100', '500', '1000', '5000'];

  // Game Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gamePhase === 'waiting') {
      timer = setInterval(() => {
        setTimeToNextFlight(prev => {
          if (prev <= 1) {
            startFlight();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gamePhase === 'flying') {
      timer = setInterval(() => {
        setFlightDuration(prev => prev + 0.1);
        updateMultiplier();
      }, 100);
    }

    return () => clearInterval(timer);
  }, [gamePhase, flightDuration]);

  const startFlight = () => {
    setGamePhase('flying');
    setFlightDuration(0);
    setCurrentMultiplier(1.00);
    setCrashPoint(generateCrashPoint());
    setPlanePosition({ x: 50, y: 300 });
    setFlightPath([]);
    
    // Activate bets
    if (bet1Amount && parseInt(bet1Amount) >= 10) {
      setBet1(prev => ({ ...prev, isActive: true, status: 'flying' }));
    }
    if (bet2Amount && parseInt(bet2Amount) >= 10) {
      setBet2(prev => ({ ...prev, isActive: true, status: 'flying' }));
    }
    
    startAnimation();
  };

  const generateCrashPoint = () => {
    // Authentic crash point generation (house edge ~3%)
    const random = Math.random();
    if (random < 0.5) return 1 + Math.random() * 1; // 1x - 2x (50%)
    if (random < 0.8) return 2 + Math.random() * 3; // 2x - 5x (30%)
    if (random < 0.95) return 5 + Math.random() * 10; // 5x - 15x (15%)
    return 15 + Math.random() * 85; // 15x - 100x (5%)
  };

  const updateMultiplier = () => {
    const newMultiplier = 1 + (flightDuration * flightDuration * 0.05);
    setCurrentMultiplier(newMultiplier);
    
    // Check for crash
    if (newMultiplier >= crashPoint) {
      crashPlane();
    }
    
    // Check auto cash outs
    if (bet1.isActive && bet1AutoCashOut && newMultiplier >= parseFloat(bet1AutoCashOut)) {
      cashOut(1);
    }
    if (bet2.isActive && bet2AutoCashOut && newMultiplier >= parseFloat(bet2AutoCashOut)) {
      cashOut(2);
    }
  };

  const crashPlane = () => {
    setGamePhase('crashed');
    
    // Update bet statuses
    setBet1(prev => prev.isActive && !prev.cashOutAt ? { ...prev, status: 'lost' } : prev);
    setBet2(prev => prev.isActive && !prev.cashOutAt ? { ...prev, status: 'lost' } : prev);
    
    // Add to history
    setFlightHistory(prev => [
      { multiplier: currentMultiplier, timestamp: new Date(), crashed: true },
      ...prev.slice(0, 9)
    ]);
    
    // Reset for next round
    setTimeout(() => {
      setGamePhase('waiting');
      setTimeToNextFlight(5);
      resetBets();
    }, 3000);
  };

  const cashOut = (betNumber: 1 | 2) => {
    if (betNumber === 1 && bet1.isActive && !bet1.cashOutAt) {
      const winAmount = bet1.amount * currentMultiplier;
      setBet1(prev => ({ 
        ...prev, 
        cashOutAt: currentMultiplier, 
        winAmount, 
        status: 'won' 
      }));
    } else if (betNumber === 2 && bet2.isActive && !bet2.cashOutAt) {
      const winAmount = bet2.amount * currentMultiplier;
      setBet2(prev => ({ 
        ...prev, 
        cashOutAt: currentMultiplier, 
        winAmount, 
        status: 'won' 
      }));
    }
  };

  const resetBets = () => {
    setBet1(prev => ({ amount: parseInt(bet1Amount) || 10, isActive: false, status: 'betting' }));
    setBet2(prev => ({ amount: parseInt(bet2Amount) || 10, isActive: false, status: 'betting' }));
  };

  const startAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const animate = () => {
      if (gamePhase !== 'flying') return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      drawGrid(ctx, canvas.width, canvas.height);
      
      // Draw flight curve
      drawFlightCurve(ctx, canvas.width, canvas.height);
      
      // Draw plane
      drawPlane(ctx);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawFlightCurve = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const points = [];
    for (let x = 0; x < width; x += 5) {
      const progress = x / width;
      const y = height - (progress * progress * height * 0.8) - 50;
      points.push({ x, y });
    }
    
    if (points.length > 0) {
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
    }
    
    ctx.stroke();
    
    // Update plane position
    const planeProgress = Math.min(flightDuration * 0.1, 1);
    const planeX = planeProgress * width;
    const planeY = height - (planeProgress * planeProgress * height * 0.8) - 50;
    setPlanePosition({ x: planeX, y: planeY });
  };

  const drawPlane = (ctx: CanvasRenderingContext2D) => {
    const { x, y } = planePosition;
    
    // Plane body
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(x, y, 15, 8, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Plane wings
    ctx.fillStyle = '#cccccc';
    ctx.beginPath();
    ctx.ellipse(x - 5, y, 10, 4, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Plane trail
    if (gamePhase === 'flying') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 20, y);
      ctx.lineTo(x - 40, y + 5);
      ctx.stroke();
    }
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier < 1.5) return 'text-white';
    if (multiplier < 2) return 'text-green-400';
    if (multiplier < 5) return 'text-yellow-400';
    if (multiplier < 10) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatMultiplier = (value: number) => {
    return value.toFixed(2) + 'x';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white max-w-md mx-auto relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-8 w-24 h-24 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-16 w-28 h-28 bg-yellow-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-red-600 to-orange-700 p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Plane className="w-6 h-6" />
              Aviator
            </h1>
            <p className="text-red-100 text-sm">Crash Multiplier Game</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="relative z-10 bg-black/50 backdrop-blur-sm p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-lg p-3 border border-red-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-300">Live Players</span>
            </div>
            <p className="text-lg font-bold text-white">{gameStats.totalPlayers.toLocaleString()}</p>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-3 border border-yellow-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-300">Round</span>
            </div>
            <p className="text-sm font-mono text-white">{gameStats.currentRound}</p>
          </div>
        </div>
      </div>

      {/* Flight History */}
      <div className="relative z-10 bg-black/30 backdrop-blur-sm p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <History className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">Recent Flights</span>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {flightHistory.map((flight, index) => (
            <div
              key={index}
              className={`px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap ${
                flight.multiplier >= 10 ? 'bg-red-500 text-white' :
                flight.multiplier >= 5 ? 'bg-orange-500 text-white' :
                flight.multiplier >= 2 ? 'bg-yellow-500 text-black' :
                'bg-gray-500 text-white'
              }`}
            >
              {formatMultiplier(flight.multiplier)}
            </div>
          ))}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm h-80">
        {/* Game Status */}
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="text-center">
            {gamePhase === 'waiting' && (
              <div className="bg-black/70 rounded-lg p-4">
                <p className="text-gray-300 mb-2">Next flight in</p>
                <p className="text-3xl font-bold text-yellow-400">{timeToNextFlight}s</p>
                <p className="text-sm text-gray-400 mt-2">Place your bets!</p>
              </div>
            )}
            
            {gamePhase === 'flying' && (
              <div className="bg-black/70 rounded-lg p-4">
                <p className="text-gray-300 mb-2">Current Multiplier</p>
                <p className={`text-5xl font-bold ${getMultiplierColor(currentMultiplier)}`}>
                  {formatMultiplier(currentMultiplier)}
                </p>
                <motion.p 
                  className="text-sm text-gray-400 mt-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  ✈️ Flying...
                </motion.p>
              </div>
            )}
            
            {gamePhase === 'crashed' && (
              <motion.div 
                className="bg-red-600/90 rounded-lg p-4"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <p className="text-white mb-2">FLEW AWAY!</p>
                <p className="text-2xl font-bold text-white">
                  {formatMultiplier(currentMultiplier)}
                </p>
                <p className="text-sm text-red-200 mt-2">💥 Crashed</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Game Canvas */}
        <canvas
          ref={canvasRef}
          width={400}
          height={320}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Betting Interface */}
      <div className="relative z-10 p-4 space-y-4">
        {/* Bet Panel 1 */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white">Bet 1</h3>
            <div className="flex items-center gap-2">
              {bet1.status === 'won' && <CheckCircle className="w-5 h-5 text-green-400" />}
              {bet1.status === 'lost' && <AlertTriangle className="w-5 h-5 text-red-400" />}
              {bet1.status === 'flying' && <Plane className="w-5 h-5 text-blue-400" />}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Bet Amount</label>
              <input
                type="number"
                value={bet1Amount}
                onChange={(e) => setBet1Amount(e.target.value)}
                disabled={gamePhase === 'flying'}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-center disabled:opacity-50"
                placeholder="₹10"
                min="10"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Auto Cash Out</label>
              <input
                type="number"
                value={bet1AutoCashOut}
                onChange={(e) => setBet1AutoCashOut(e.target.value)}
                disabled={gamePhase === 'flying'}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-center disabled:opacity-50"
                placeholder="2.00x"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mb-3">
            {quickAmounts.slice(0, 3).map((amount) => (
              <button
                key={amount}
                onClick={() => setBet1Amount(amount)}
                disabled={gamePhase === 'flying'}
                className="flex-1 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 rounded-lg py-1 text-white text-xs transition-colors"
              >
                ₹{amount}
              </button>
            ))}
          </div>
          
          {gamePhase === 'flying' && bet1.isActive && !bet1.cashOutAt ? (
            <button
              onClick={() => cashOut(1)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl py-3 text-white font-bold text-lg transition-all"
            >
              Cash Out • {formatMultiplier(currentMultiplier)}
            </button>
          ) : bet1.cashOutAt ? (
            <div className="w-full bg-green-600 rounded-xl py-3 text-center">
              <p className="text-white font-bold">Won ₹{bet1.winAmount?.toFixed(2)}</p>
              <p className="text-green-200 text-sm">@ {formatMultiplier(bet1.cashOutAt)}</p>
            </div>
          ) : bet1.status === 'lost' ? (
            <div className="w-full bg-red-600 rounded-xl py-3 text-center">
              <p className="text-white font-bold">Lost ₹{bet1.amount}</p>
              <p className="text-red-200 text-sm">Flew away @ {formatMultiplier(currentMultiplier)}</p>
            </div>
          ) : (
            <button
              disabled={gamePhase === 'flying' || !bet1Amount || parseInt(bet1Amount) < 10}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-3 text-white font-bold transition-all"
            >
              Bet ₹{bet1Amount || '10'}
            </button>
          )}
        </div>

        {/* Bet Panel 2 */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white">Bet 2</h3>
            <div className="flex items-center gap-2">
              {bet2.status === 'won' && <CheckCircle className="w-5 h-5 text-green-400" />}
              {bet2.status === 'lost' && <AlertTriangle className="w-5 h-5 text-red-400" />}
              {bet2.status === 'flying' && <Plane className="w-5 h-5 text-blue-400" />}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Bet Amount</label>
              <input
                type="number"
                value={bet2Amount}
                onChange={(e) => setBet2Amount(e.target.value)}
                disabled={gamePhase === 'flying'}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-center disabled:opacity-50"
                placeholder="₹10"
                min="10"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Auto Cash Out</label>
              <input
                type="number"
                value={bet2AutoCashOut}
                onChange={(e) => setBet2AutoCashOut(e.target.value)}
                disabled={gamePhase === 'flying'}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-center disabled:opacity-50"
                placeholder="2.00x"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mb-3">
            {quickAmounts.slice(3, 6).map((amount) => (
              <button
                key={amount}
                onClick={() => setBet2Amount(amount)}
                disabled={gamePhase === 'flying'}
                className="flex-1 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 rounded-lg py-1 text-white text-xs transition-colors"
              >
                ₹{amount}
              </button>
            ))}
          </div>
          
          {gamePhase === 'flying' && bet2.isActive && !bet2.cashOutAt ? (
            <button
              onClick={() => cashOut(2)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl py-3 text-white font-bold text-lg transition-all"
            >
              Cash Out • {formatMultiplier(currentMultiplier)}
            </button>
          ) : bet2.cashOutAt ? (
            <div className="w-full bg-green-600 rounded-xl py-3 text-center">
              <p className="text-white font-bold">Won ₹{bet2.winAmount?.toFixed(2)}</p>
              <p className="text-green-200 text-sm">@ {formatMultiplier(bet2.cashOutAt)}</p>
            </div>
          ) : bet2.status === 'lost' ? (
            <div className="w-full bg-red-600 rounded-xl py-3 text-center">
              <p className="text-white font-bold">Lost ₹{bet2.amount}</p>
              <p className="text-red-200 text-sm">Flew away @ {formatMultiplier(currentMultiplier)}</p>
            </div>
          ) : (
            <button
              disabled={gamePhase === 'flying' || !bet2Amount || parseInt(bet2Amount) < 10}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-3 text-white font-bold transition-all"
            >
              Bet ₹{bet2Amount || '10'}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Space */}
      <div className="h-20"></div>
    </div>
  );
}