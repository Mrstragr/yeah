import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Plane, TrendingUp, History, Clock, Zap, Target, DollarSign, ArrowLeft } from 'lucide-react';

interface FlightResult {
  multiplier: number;
  timestamp: Date;
  crashed: boolean;
}

interface BetData {
  amount: number;
  cashOutMultiplier?: number;
  status: 'active' | 'cashed_out' | 'crashed';
  winAmount?: number;
}

export default function OfficialAviator({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Game state
  const [gamePhase, setGamePhase] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [crashMultiplier, setCrashMultiplier] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [balance, setBalance] = useState(0);
  const [flightHistory, setFlightHistory] = useState<FlightResult[]>([]);
  
  // Betting state
  const [bet1, setBet1] = useState<BetData | null>(null);
  const [bet2, setBet2] = useState<BetData | null>(null);
  const [betAmount1, setBetAmount1] = useState(100);
  const [betAmount2, setBetAmount2] = useState(100);
  const [autoCashOut1, setAutoCashOut1] = useState<number | null>(null);
  const [autoCashOut2, setAutoCashOut2] = useState<number | null>(null);
  
  // Animation state
  const [planePosition, setPlanePosition] = useState({ x: 50, y: 350 });
  const [flightPath, setFlightPath] = useState<{x: number, y: number}[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize game
  useEffect(() => {
    loadUserBalance();
    loadFlightHistory();
    startWaitingPhase();
  }, []);

  // Canvas animation - Official Aviator style
  useEffect(() => {
    if (isAnimating && canvasRef.current) {
      drawOfficialFlightPath();
    }
  }, [planePosition, flightPath, isAnimating, currentMultiplier]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (gamePhase === 'waiting') {
            startFlight();
            return 0;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase]);

  const loadUserBalance = useCallback(async () => {
    try {
      const response = await api.getBalance();
      setBalance(response.balance);
    } catch (error) {
      console.error('Failed to load balance:', error);
      setBalance(10000); // Demo balance
    }
  }, []);

  const loadFlightHistory = useCallback(async () => {
    try {
      const mockHistory: FlightResult[] = [
        { multiplier: 2.45, timestamp: new Date(), crashed: true },
        { multiplier: 1.23, timestamp: new Date(), crashed: true },
        { multiplier: 5.67, timestamp: new Date(), crashed: true },
        { multiplier: 1.08, timestamp: new Date(), crashed: true },
        { multiplier: 3.21, timestamp: new Date(), crashed: true },
        { multiplier: 1.89, timestamp: new Date(), crashed: true },
        { multiplier: 7.42, timestamp: new Date(), crashed: true },
        { multiplier: 1.15, timestamp: new Date(), crashed: true },
      ];
      setFlightHistory(mockHistory);
    } catch (error) {
      console.error('Failed to load flight history:', error);
    }
  }, []);

  // Official Aviator graph drawing function
  const drawOfficialFlightPath = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with official dark background
    ctx.fillStyle = '#0F1B0C'; // Official Aviator dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw gradient sky background (changes with multiplier)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (currentMultiplier < 2) {
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#0f0f1a');
    } else if (currentMultiplier < 5) {
      gradient.addColorStop(0, '#2d1b69');
      gradient.addColorStop(1, '#11101d');
    } else {
      gradient.addColorStop(0, '#5533ff');
      gradient.addColorStop(1, '#1a1a2e');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw the official red ascending curve
    if (flightPath.length > 1) {
      ctx.strokeStyle = '#FF4444'; // Official Aviator red color
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Add glow effect to the curve
      ctx.shadowColor = '#FF4444';
      ctx.shadowBlur = 10;
      
      ctx.beginPath();
      ctx.moveTo(flightPath[0].x, flightPath[0].y);
      
      // Use quadratic curves for smooth official Aviator trajectory
      for (let i = 1; i < flightPath.length; i++) {
        const currentPoint = flightPath[i];
        const prevPoint = flightPath[i - 1];
        
        if (i === flightPath.length - 1) {
          ctx.lineTo(currentPoint.x, currentPoint.y);
        } else {
          const nextPoint = flightPath[i + 1];
          const cpx = (prevPoint.x + currentPoint.x) / 2;
          const cpy = (prevPoint.y + currentPoint.y) / 2;
          ctx.quadraticCurveTo(cpx, cpy, currentPoint.x, currentPoint.y);
        }
      }
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowBlur = 0;
    }

    // Draw the vintage biplane (official Aviator style)
    drawOfficialPlane(ctx, planePosition.x, planePosition.y);

    // Draw multiplier display (official style)
    drawOfficialMultiplierDisplay(ctx);

  }, [flightPath, planePosition, currentMultiplier]);

  const drawOfficialPlane = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.save();
    
    // Plane body (vintage biplane style)
    ctx.fillStyle = '#FFD700'; // Golden yellow for visibility
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    
    // Main fuselage
    ctx.fillRect(x - 15, y - 3, 30, 6);
    ctx.strokeRect(x - 15, y - 3, 30, 6);
    
    // Wings
    ctx.fillRect(x - 10, y - 8, 20, 3);
    ctx.strokeRect(x - 10, y - 8, 20, 3);
    ctx.fillRect(x - 8, y + 5, 16, 3);
    ctx.strokeRect(x - 8, y + 5, 16, 3);
    
    // Propeller
    ctx.fillStyle = '#888888';
    ctx.beginPath();
    ctx.arc(x + 15, y, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Propeller blades (spinning effect)
    const time = Date.now() * 0.02;
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const angle = (time + i * (Math.PI * 2 / 3)) % (Math.PI * 2);
      const bladeX = x + 15 + Math.cos(angle) * 8;
      const bladeY = y + Math.sin(angle) * 8;
      ctx.beginPath();
      ctx.moveTo(x + 15, y);
      ctx.lineTo(bladeX, bladeY);
      ctx.stroke();
    }
    
    // Plane trail/exhaust
    if (gamePhase === 'flying') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(x - 20 - i * 5, y + Math.sin(time + i) * 2, 3 - i * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  };

  const drawOfficialMultiplierDisplay = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Large multiplier display (official Aviator style)
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = gamePhase === 'crashed' ? '#FF4444' : '#00FF00';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';
    
    const multiplierText = gamePhase === 'crashed' ? 
      `${crashMultiplier.toFixed(2)}x FLEW AWAY!` : 
      `${currentMultiplier.toFixed(2)}x`;
    
    // Text shadow for visibility
    ctx.strokeText(multiplierText, canvas.width / 2, 80);
    ctx.fillText(multiplierText, canvas.width / 2, 80);
  };

  const startWaitingPhase = () => {
    setGamePhase('waiting');
    setCurrentMultiplier(1.00);
    setCrashMultiplier(0);
    setTimeLeft(5);
    setFlightPath([]);
    setPlanePosition({ x: 50, y: 350 });
    setIsAnimating(false);
    
    // Reset bets
    setBet1(null);
    setBet2(null);
  };

  const startFlight = () => {
    setGamePhase('flying');
    setIsAnimating(true);
    setTimeLeft(0);
    
    // Generate random crash point (1.00 to 50.00)
    const crashPoint = Math.random() * 49 + 1;
    setCrashMultiplier(Number(crashPoint.toFixed(2)));
    
    // Initialize flight path
    setFlightPath([{ x: 50, y: 350 }]);
    
    // Start flight animation
    animateOfficialFlight(crashPoint);
    
    // Play takeoff sound
    playSound('takeoff');
  };

  const animateOfficialFlight = (crashPoint: number) => {
    const startTime = Date.now();
    const flightDuration = Math.min(crashPoint * 1000, 30000); // Max 30 seconds
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / flightDuration;
      
      if (progress >= 1) {
        // Crash
        crashFlight();
        return;
      }
      
      // Calculate current multiplier with official Aviator curve
      const multiplier = 1 + (crashPoint - 1) * progress;
      setCurrentMultiplier(Number(multiplier.toFixed(2)));
      
      // Calculate plane position with authentic curve
      const canvas = canvasRef.current;
      if (canvas) {
        const x = 50 + (progress * (canvas.width - 100));
        // Official Aviator uses logarithmic curve for authentic feel
        const curveHeight = Math.log(1 + progress * 4) * 100;
        const y = 350 - curveHeight;
        
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
    
    // Cancel animation
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
    
    // Play crash sound
    playSound('crash');
    
    // Add to history
    setFlightHistory(prev => [
      { multiplier: crashMultiplier, timestamp: new Date(), crashed: true },
      ...prev.slice(0, 9)
    ]);
    
    // Start next round after 3 seconds
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
    
    try {
      // Deduct bet amount from balance
      setBalance(prev => prev - amount);
      
      // Set bet data
      const betData: BetData = {
        amount,
        status: 'active'
      };
      
      if (betNumber === 1) {
        setBet1(betData);
      } else {
        setBet2(betData);
      }
      
      toast({
        title: "Bet Placed",
        description: `₹${amount} bet placed successfully!`,
      });
      
    } catch (error: any) {
      toast({
        title: "Bet Failed",
        description: error.message || "Failed to place bet",
        variant: "destructive",
      });
    }
  };

  const cashOut = async (betNumber: 1 | 2) => {
    const bet = betNumber === 1 ? bet1 : bet2;
    if (!bet || bet.status !== 'active' || gamePhase !== 'flying') return;
    
    try {
      const winAmount = bet.amount * currentMultiplier;
      
      // Update balance
      setBalance(prev => prev + winAmount);
      
      // Update bet status
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
      
      toast({
        title: "Cash Out Successful!",
        description: `Won ₹${winAmount.toFixed(2)} at ${currentMultiplier.toFixed(2)}x`,
      });
      
    } catch (error: any) {
      toast({
        title: "Cash Out Failed",
        description: error.message || "Failed to cash out",
        variant: "destructive",
      });
    }
  };

  const playSound = (soundType: 'takeoff' | 'crash' | 'cashout') => {
    console.log(`Playing sound: ${soundType}`);
    // In a real implementation, you would play actual audio files
  };

  // Preset bet amounts
  const presetAmounts = [10, 50, 100, 500, 1000];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Official Aviator</h1>
              <p className="text-gray-300 text-sm">by Spribe Gaming</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
            Balance: ₹{balance.toLocaleString()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Game Area */}
        <div className="lg:col-span-2">
          <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-0">
              {/* Game Canvas */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={400}
                  className="w-full h-[400px] rounded-t-lg"
                />
                
                {/* Game Status Overlay */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="flex justify-between items-center">
                    <div className="text-white">
                      {gamePhase === 'waiting' && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          <span className="text-lg font-bold">Next flight in {timeLeft}s</span>
                        </div>
                      )}
                      {gamePhase === 'flying' && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-400" />
                          <span className="text-lg font-bold text-green-400">Flying...</span>
                        </div>
                      )}
                      {gamePhase === 'crashed' && (
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-red-400" />
                          <span className="text-lg font-bold text-red-400">Flew Away!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Betting Interface */}
              <div className="p-6 bg-gray-900/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bet 1 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-400" />
                      <span className="text-white font-semibold">Bet 1</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-300 text-sm">Bet Amount</label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="number"
                            value={betAmount1}
                            onChange={(e) => setBetAmount1(Number(e.target.value))}
                            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            min="10"
                            max={balance}
                            disabled={gamePhase === 'flying'}
                          />
                        </div>
                        <div className="flex gap-1 mt-2">
                          {presetAmounts.map(amount => (
                            <Button
                              key={amount}
                              variant="outline"
                              size="sm"
                              onClick={() => setBetAmount1(amount)}
                              className="text-xs"
                              disabled={gamePhase === 'flying'}
                            >
                              {amount}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-gray-300 text-sm">Auto Cash Out</label>
                        <input
                          type="number"
                          value={autoCashOut1 || ''}
                          onChange={(e) => setAutoCashOut1(e.target.value ? Number(e.target.value) : null)}
                          placeholder="Auto cash out at..."
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1"
                          min="1.01"
                          step="0.01"
                          disabled={gamePhase === 'flying'}
                        />
                      </div>
                      
                      {!bet1 ? (
                        <Button
                          onClick={() => placeBet(1)}
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={gamePhase !== 'waiting' || betAmount1 > balance}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
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
                        <div className={`w-full p-3 rounded-lg text-center font-semibold ${
                          bet1.status === 'cashed_out' ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'
                        }`}>
                          {bet1.status === 'cashed_out' 
                            ? `Won ₹${bet1.winAmount?.toFixed(2)} at ${bet1.cashOutMultiplier?.toFixed(2)}x`
                            : 'Lost - Plane flew away'
                          }
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bet 2 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-400" />
                      <span className="text-white font-semibold">Bet 2</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-300 text-sm">Bet Amount</label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="number"
                            value={betAmount2}
                            onChange={(e) => setBetAmount2(Number(e.target.value))}
                            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            min="10"
                            max={balance}
                            disabled={gamePhase === 'flying'}
                          />
                        </div>
                        <div className="flex gap-1 mt-2">
                          {presetAmounts.map(amount => (
                            <Button
                              key={amount}
                              variant="outline"
                              size="sm"
                              onClick={() => setBetAmount2(amount)}
                              className="text-xs"
                              disabled={gamePhase === 'flying'}
                            >
                              {amount}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-gray-300 text-sm">Auto Cash Out</label>
                        <input
                          type="number"
                          value={autoCashOut2 || ''}
                          onChange={(e) => setAutoCashOut2(e.target.value ? Number(e.target.value) : null)}
                          placeholder="Auto cash out at..."
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white mt-1"
                          min="1.01"
                          step="0.01"
                          disabled={gamePhase === 'flying'}
                        />
                      </div>
                      
                      {!bet2 ? (
                        <Button
                          onClick={() => placeBet(2)}
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={gamePhase !== 'waiting' || betAmount2 > balance}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
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
                        <div className={`w-full p-3 rounded-lg text-center font-semibold ${
                          bet2.status === 'cashed_out' ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'
                        }`}>
                          {bet2.status === 'cashed_out' 
                            ? `Won ₹${bet2.winAmount?.toFixed(2)} at ${bet2.cashOutMultiplier?.toFixed(2)}x`
                            : 'Lost - Plane flew away'
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Flight History */}
          <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <History className="h-5 w-5" />
                Flight History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {flightHistory.map((flight, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      flight.multiplier >= 10 ? 'bg-purple-600/20' :
                      flight.multiplier >= 5 ? 'bg-blue-600/20' :
                      flight.multiplier >= 2 ? 'bg-green-600/20' : 'bg-red-600/20'
                    }`}
                  >
                    <span className={`font-bold ${
                      flight.multiplier >= 10 ? 'text-purple-300' :
                      flight.multiplier >= 5 ? 'text-blue-300' :
                      flight.multiplier >= 2 ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {flight.multiplier.toFixed(2)}x
                    </span>
                    <span className="text-gray-400 text-sm">
                      {flight.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live Players (Mock) */}
          <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Live Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-300">Player {i + 1}</span>
                    <span className="text-green-400">₹{(Math.random() * 1000 + 100).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}