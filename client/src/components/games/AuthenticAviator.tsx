import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Volume2, VolumeX, Users, Trophy } from 'lucide-react';

interface BetData {
  amount: number;
  cashOutMultiplier?: number;
  status: 'active' | 'cashed_out' | 'crashed';
  winAmount?: number;
}

interface FlightResult {
  multiplier: number;
  timestamp: Date;
  crashed: boolean;
}

export default function AuthenticAviator({ onBack }: { onBack: () => void }) {
  const [balance, setBalance] = useState(10000);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [timeLeft, setTimeLeft] = useState(5);
  const [crashMultiplier, setCrashMultiplier] = useState(2.34);
  const [isAnimating, setIsAnimating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Betting state
  const [betAmount1, setBetAmount1] = useState(10);
  const [betAmount2, setBetAmount2] = useState(10);
  const [bet1, setBet1] = useState<BetData | null>(null);
  const [bet2, setBet2] = useState<BetData | null>(null);
  const [autoCashOut1, setAutoCashOut1] = useState<number | null>(null);
  const [autoCashOut2, setAutoCashOut2] = useState<number | null>(null);
  
  // Flight path and animation
  const [flightPath, setFlightPath] = useState<{x: number, y: number}[]>([]);
  const [planePosition, setPlanePosition] = useState({ x: 50, y: 350 });
  const [flightHistory, setFlightHistory] = useState<FlightResult[]>([
    { multiplier: 2.34, timestamp: new Date(), crashed: true },
    { multiplier: 1.05, timestamp: new Date(), crashed: true },
    { multiplier: 5.67, timestamp: new Date(), crashed: true },
    { multiplier: 1.23, timestamp: new Date(), crashed: true },
    { multiplier: 8.90, timestamp: new Date(), crashed: true }
  ]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const { toast } = useToast();

  const presetAmounts = [10, 50, 100, 500, 1000];

  // Sound effects
  const playSound = (type: 'takeoff' | 'crash' | 'cashout') => {
    if (!soundEnabled) return;
    console.log(`Playing sound: ${type}`);
  };

  const toggleSound = () => setSoundEnabled(!soundEnabled);

  // Initialize canvas and start game loop
  useEffect(() => {
    startWaitingPhase();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Canvas drawing
  useEffect(() => {
    if (canvasRef.current) {
      drawGame();
    }
  }, [currentMultiplier, gamePhase, flightPath, planePosition]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Official Spribe Aviator background - exact dark theme
    ctx.fillStyle = '#0F1419';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid pattern - very subtle like official
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let i = 0; i <= canvas.width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw official red curve if flying
    if (flightPath.length > 1) {
      // Main red curve - exactly like Spribe
      ctx.strokeStyle = '#E53E3E';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Glow effect
      ctx.shadowColor = '#E53E3E';
      ctx.shadowBlur = 8;
      
      ctx.beginPath();
      ctx.moveTo(flightPath[0].x, flightPath[0].y);
      
      for (let i = 1; i < flightPath.length; i++) {
        ctx.lineTo(flightPath[i].x, flightPath[i].y);
      }
      ctx.stroke();
      
      // Fill under curve
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = '#E53E3E';
      ctx.beginPath();
      ctx.moveTo(flightPath[0].x, canvas.height);
      for (let i = 0; i < flightPath.length; i++) {
        ctx.lineTo(flightPath[i].x, flightPath[i].y);
      }
      ctx.lineTo(flightPath[flightPath.length - 1].x, canvas.height);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    // Draw plane
    drawPlane(ctx, planePosition.x, planePosition.y);

    // Draw multiplier display
    drawMultiplierDisplay(ctx);

  }, [flightPath, planePosition, currentMultiplier, gamePhase, crashMultiplier]);

  const drawPlane = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.save();
    
    // Official plane design - red theme
    ctx.fillStyle = '#E53E3E';
    
    // Plane body
    ctx.fillRect(x - 10, y - 2, 20, 4);
    
    // Wings
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(x - 6, y - 5, 12, 2);
    ctx.fillRect(x - 4, y + 3, 8, 2);
    
    // Nose
    ctx.fillStyle = '#E53E3E';
    ctx.beginPath();
    ctx.moveTo(x + 10, y - 2);
    ctx.lineTo(x + 15, y);
    ctx.lineTo(x + 10, y + 2);
    ctx.closePath();
    ctx.fill();
    
    // Propeller
    if (gamePhase === 'flying') {
      const time = Date.now() * 0.05;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const angle = (time + i * (Math.PI * 2 / 3)) % (Math.PI * 2);
        ctx.beginPath();
        ctx.moveTo(x + 15, y);
        ctx.lineTo(x + 15 + Math.cos(angle) * 8, y + Math.sin(angle) * 8);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  };

  const drawMultiplierDisplay = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = 150;
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (gamePhase === 'crashed') {
      // Crashed state
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#E53E3E';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 2;
      
      const crashText = `${crashMultiplier.toFixed(2)}x`;
      ctx.strokeText(crashText, centerX, centerY - 15);
      ctx.fillText(crashText, centerX, centerY - 15);
      
      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#FF6B6B';
      ctx.strokeText('FLEW AWAY!', centerX, centerY + 15);
      ctx.fillText('FLEW AWAY!', centerX, centerY + 15);
    } else if (gamePhase === 'flying') {
      // Flying state - dynamic colors based on multiplier
      ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, sans-serif';
      
      if (currentMultiplier < 2) {
        ctx.fillStyle = '#10B981'; // Green
      } else if (currentMultiplier < 5) {
        ctx.fillStyle = '#F59E0B'; // Orange
      } else if (currentMultiplier < 10) {
        ctx.fillStyle = '#EF4444'; // Red
      } else {
        ctx.fillStyle = '#8B5CF6'; // Purple
      }
      
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.lineWidth = 3;
      
      const multiplierText = `${currentMultiplier.toFixed(2)}x`;
      
      // Glow effect
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 15;
      
      ctx.strokeText(multiplierText, centerX, centerY);
      ctx.fillText(multiplierText, centerX, centerY);
      
      ctx.shadowBlur = 0;
    } else {
      // Waiting state
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('STARTING SOON...', centerX, centerY);
    }
  };

  const startWaitingPhase = () => {
    setGamePhase('waiting');
    setCurrentMultiplier(1.00);
    setTimeLeft(5);
    setFlightPath([]);
    setBet1(null);
    setBet2(null);
    
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          startFlightPhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startFlightPhase = () => {
    setGamePhase('flying');
    setIsAnimating(true);
    
    // Generate crash point (authentic Aviator algorithm)
    const crashPoint = Math.max(1.01, Math.random() * 50 + 1);
    setCrashMultiplier(Number(crashPoint.toFixed(2)));
    
    // Reset flight path
    setFlightPath([{ x: 50, y: 350 }]);
    setPlanePosition({ x: 50, y: 350 });
    
    playSound('takeoff');
    startTimeRef.current = Date.now();
    animateFlight(crashPoint);
  };

  const animateFlight = (crashPoint: number) => {
    const animate = () => {
      if (!startTimeRef.current) return;
      
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const progress = Math.min(elapsed / 10, 1); // 10 second max flight
      
      if (progress >= 1 || currentMultiplier >= crashPoint) {
        crashFlight();
        return;
      }
      
      // Calculate multiplier with authentic curve
      const multiplier = 1 + (crashPoint - 1) * Math.pow(progress, 0.7);
      setCurrentMultiplier(Number(multiplier.toFixed(2)));
      
      // Calculate plane position
      const canvas = canvasRef.current;
      if (canvas) {
        const x = 50 + (progress * (canvas.width - 150));
        const y = 350 - (Math.pow(progress, 0.5) * 200);
        
        setPlanePosition({ x, y });
        setFlightPath(prev => [...prev, { x, y }]);
      }
      
      // Check auto cash out
      checkAutoCashOut(multiplier);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const crashFlight = () => {
    setGamePhase('crashed');
    setIsAnimating(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Process crashed bets
    if (bet1 && bet1.status === 'active') {
      setBet1(prev => prev ? { ...prev, status: 'crashed', winAmount: 0 } : null);
    }
    if (bet2 && bet2.status === 'active') {
      setBet2(prev => prev ? { ...prev, status: 'crashed', winAmount: 0 } : null);
    }
    
    playSound('crash');
    
    // Add to history
    setFlightHistory(prev => [
      { multiplier: crashMultiplier, timestamp: new Date(), crashed: true },
      ...prev.slice(0, 9)
    ]);
    
    setTimeout(() => {
      startWaitingPhase();
    }, 3000);
  };

  const checkAutoCashOut = (multiplier: number) => {
    if (bet1 && bet1.status === 'active' && autoCashOut1 && multiplier >= autoCashOut1) {
      cashOut(1);
    }
    if (bet2 && bet2.status === 'active' && autoCashOut2 && multiplier >= autoCashOut2) {
      cashOut(2);
    }
  };

  const placeBet = async (betNumber: 1 | 2) => {
    if (gamePhase !== 'waiting') return;
    
    const amount = betNumber === 1 ? betAmount1 : betAmount2;
    
    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance to place this bet.",
        variant: "destructive",
      });
      return;
    }
    
    setBalance(prev => prev - amount);
    
    const betData: BetData = {
      amount,
      status: 'active'
    };
    
    if (betNumber === 1) {
      setBet1(betData);
    } else {
      setBet2(betData);
    }
  };

  const cashOut = (betNumber: 1 | 2) => {
    if (gamePhase !== 'flying') return;
    
    const bet = betNumber === 1 ? bet1 : bet2;
    if (!bet || bet.status !== 'active') return;
    
    const winAmount = bet.amount * currentMultiplier;
    setBalance(prev => prev + winAmount);
    
    const updatedBet = {
      ...bet,
      status: 'cashed_out' as const,
      cashOutMultiplier: currentMultiplier,
      winAmount
    };
    
    if (betNumber === 1) {
      setBet1(updatedBet);
    } else {
      setBet2(updatedBet);
    }
    
    playSound('cashout');
    
    toast({
      title: "Cash Out Successful!",
      description: `Won ₹${winAmount.toFixed(2)} at ${currentMultiplier.toFixed(2)}x`,
    });
  };

  return (
    <div className="min-h-screen bg-[#0F1419] text-white">
      {/* Official Header */}
      <div className="bg-[#1a1b23] border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/10 p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                ✈️
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Aviator</h1>
                <p className="text-xs text-gray-400">Crash Game</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-blue-400">
              <Users className="w-4 h-4" />
              <span>407 playing</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-yellow-400">
              <Trophy className="w-4 h-4" />
              <span>Last: {flightHistory[0]?.multiplier.toFixed(2)}x</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Balance</div>
              <div className="text-sm font-bold text-green-400">₹{balance.toFixed(2)}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleSound} className="text-gray-400 hover:text-white">
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-[400px] bg-[#0F1419]"
        />
        
        {/* History Strip */}
        <div className="absolute top-4 right-4 flex gap-2">
          {flightHistory.slice(0, 5).map((result, index) => (
            <div
              key={index}
              className={`px-3 py-1 rounded text-xs font-bold ${
                result.multiplier >= 2 ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
              }`}
            >
              {result.multiplier.toFixed(2)}x
            </div>
          ))}
        </div>
      </div>

      {/* Betting Interface - Exactly like official */}
      <div className="bg-[#1a1b23] p-4">
        <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Bet 1 */}
          <div className="space-y-3">
            <div className="text-sm text-gray-400">Bet 1</div>
            <div className="bg-[#2a2d3a] rounded-lg p-3 space-y-3">
              <div>
                <div className="text-xs text-gray-400 mb-1">Amount</div>
                <input
                  type="number"
                  value={betAmount1}
                  onChange={(e) => setBetAmount1(Number(e.target.value))}
                  className="w-full bg-[#3a3d4a] border border-gray-600 rounded px-3 py-2 text-white"
                  disabled={gamePhase === 'flying'}
                />
              </div>
              
              <div className="flex gap-1">
                {presetAmounts.map(amount => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount1(amount)}
                    className="text-xs bg-[#3a3d4a] border-gray-600 hover:bg-[#4a4d5a]"
                    disabled={gamePhase === 'flying'}
                  >
                    {amount}
                  </Button>
                ))}
              </div>
              
              <div>
                <div className="text-xs text-gray-400 mb-1">Auto Cash Out</div>
                <input
                  type="number"
                  value={autoCashOut1 || ''}
                  onChange={(e) => setAutoCashOut1(e.target.value ? Number(e.target.value) : null)}
                  placeholder="Auto cash out at..."
                  className="w-full bg-[#3a3d4a] border border-gray-600 rounded px-3 py-2 text-white"
                  step="0.01"
                  disabled={gamePhase === 'flying'}
                />
              </div>
              
              {!bet1 ? (
                <Button
                  onClick={() => placeBet(1)}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={gamePhase !== 'waiting'}
                >
                  Bet ₹{betAmount1}
                </Button>
              ) : bet1.status === 'active' ? (
                <Button
                  onClick={() => cashOut(1)}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={gamePhase !== 'flying'}
                >
                  Cash Out ₹{(bet1.amount * currentMultiplier).toFixed(2)}
                </Button>
              ) : (
                <div className={`w-full p-3 rounded text-center text-sm ${
                  bet1.status === 'cashed_out' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                }`}>
                  {bet1.status === 'cashed_out' 
                    ? `Won ₹${bet1.winAmount?.toFixed(2)} at ${bet1.cashOutMultiplier?.toFixed(2)}x`
                    : 'Lost'
                  }
                </div>
              )}
            </div>
          </div>

          {/* Bet 2 */}
          <div className="space-y-3">
            <div className="text-sm text-gray-400">Bet 2</div>
            <div className="bg-[#2a2d3a] rounded-lg p-3 space-y-3">
              <div>
                <div className="text-xs text-gray-400 mb-1">Amount</div>
                <input
                  type="number"
                  value={betAmount2}
                  onChange={(e) => setBetAmount2(Number(e.target.value))}
                  className="w-full bg-[#3a3d4a] border border-gray-600 rounded px-3 py-2 text-white"
                  disabled={gamePhase === 'flying'}
                />
              </div>
              
              <div className="flex gap-1">
                {presetAmounts.map(amount => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount2(amount)}
                    className="text-xs bg-[#3a3d4a] border-gray-600 hover:bg-[#4a4d5a]"
                    disabled={gamePhase === 'flying'}
                  >
                    {amount}
                  </Button>
                ))}
              </div>
              
              <div>
                <div className="text-xs text-gray-400 mb-1">Auto Cash Out</div>
                <input
                  type="number"
                  value={autoCashOut2 || ''}
                  onChange={(e) => setAutoCashOut2(e.target.value ? Number(e.target.value) : null)}
                  placeholder="Auto cash out at..."
                  className="w-full bg-[#3a3d4a] border border-gray-600 rounded px-3 py-2 text-white"
                  step="0.01"
                  disabled={gamePhase === 'flying'}
                />
              </div>
              
              {!bet2 ? (
                <Button
                  onClick={() => placeBet(2)}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={gamePhase !== 'waiting'}
                >
                  Bet ₹{betAmount2}
                </Button>
              ) : bet2.status === 'active' ? (
                <Button
                  onClick={() => cashOut(2)}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={gamePhase !== 'flying'}
                >
                  Cash Out ₹{(bet2.amount * currentMultiplier).toFixed(2)}
                </Button>
              ) : (
                <div className={`w-full p-3 rounded text-center text-sm ${
                  bet2.status === 'cashed_out' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                }`}>
                  {bet2.status === 'cashed_out' 
                    ? `Won ₹${bet2.winAmount?.toFixed(2)} at ${bet2.cashOutMultiplier?.toFixed(2)}x`
                    : 'Lost'
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}