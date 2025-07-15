import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Plane, TrendingUp, History, Clock, Zap, Target, DollarSign } from 'lucide-react';

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

export default function ProductionAviator() {
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
  const [planePosition, setPlanePosition] = useState({ x: 0, y: 0 });
  const [flightPath, setFlightPath] = useState<{x: number, y: number}[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Statistics
  const [totalBets, setTotalBets] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [maxMultiplier, setMaxMultiplier] = useState(0);
  const [averageMultiplier, setAverageMultiplier] = useState(0);

  // Initialize game
  useEffect(() => {
    loadUserBalance();
    loadFlightHistory();
    loadGameStats();
    startWaitingPhase();
  }, []);

  // Canvas animation
  useEffect(() => {
    if (isAnimating && canvasRef.current) {
      drawFlightPath();
    }
  }, [planePosition, flightPath, isAnimating]);

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
    }
  }, []);

  const loadFlightHistory = useCallback(async () => {
    try {
      // Simulate loading flight history
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

  const loadGameStats = useCallback(async () => {
    try {
      setTotalBets(45);
      setTotalWins(28);
      setMaxMultiplier(12.45);
      setAverageMultiplier(2.67);
    } catch (error) {
      console.error('Failed to load game stats:', error);
    }
  }, []);

  const startWaitingPhase = () => {
    setGamePhase('waiting');
    setTimeLeft(5);
    setCurrentMultiplier(1.00);
    setCrashMultiplier(0);
    setPlanePosition({ x: 0, y: 0 });
    setFlightPath([]);
    setIsAnimating(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const startFlight = () => {
    setGamePhase('flying');
    setIsAnimating(true);
    
    // Generate random crash multiplier
    const crashAt = generateCrashMultiplier();
    setCrashMultiplier(crashAt);
    
    // Start flight animation
    animateFlight(crashAt);
  };

  const generateCrashMultiplier = (): number => {
    // Weighted random for realistic crash multipliers
    const rand = Math.random();
    if (rand < 0.3) return 1.0 + Math.random() * 0.5; // 30% chance: 1.0x - 1.5x
    if (rand < 0.6) return 1.5 + Math.random() * 1.0; // 30% chance: 1.5x - 2.5x
    if (rand < 0.8) return 2.5 + Math.random() * 2.5; // 20% chance: 2.5x - 5.0x
    if (rand < 0.95) return 5.0 + Math.random() * 5.0; // 15% chance: 5.0x - 10.0x
    return 10.0 + Math.random() * 20.0; // 5% chance: 10.0x - 30.0x
  };

  const animateFlight = (crashAt: number) => {
    const startTime = Date.now();
    const flightDuration = Math.log(crashAt) * 3000 + 2000; // Logarithmic duration
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / flightDuration, 1);
      
      // Calculate current multiplier
      const multiplier = 1 + (crashAt - 1) * progress;
      setCurrentMultiplier(multiplier);
      
      // Check for auto cash-outs
      if (bet1 && bet1.status === 'active' && autoCashOut1 && multiplier >= autoCashOut1) {
        cashOut(1);
      }
      if (bet2 && bet2.status === 'active' && autoCashOut2 && multiplier >= autoCashOut2) {
        cashOut(2);
      }
      
      // Update plane position
      const canvas = canvasRef.current;
      if (canvas) {
        const x = (progress * canvas.width * 0.8) + 50;
        const y = canvas.height - 50 - (Math.log(multiplier) * 80);
        setPlanePosition({ x, y });
        setFlightPath(prev => [...prev, { x, y }]);
      }
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Crash!
        crash();
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const crash = async () => {
    setGamePhase('crashed');
    setIsAnimating(false);
    
    // Process crashed bets
    if (bet1 && bet1.status === 'active') {
      setBet1(prev => prev ? { ...prev, status: 'crashed' } : null);
    }
    if (bet2 && bet2.status === 'active') {
      setBet2(prev => prev ? { ...prev, status: 'crashed' } : null);
    }
    
    // Add to history
    const newResult: FlightResult = {
      multiplier: crashMultiplier,
      timestamp: new Date(),
      crashed: true
    };
    setFlightHistory(prev => [newResult, ...prev.slice(0, 19)]);
    
    // Show result for 3 seconds, then start new round
    setTimeout(() => {
      setBet1(null);
      setBet2(null);
      startWaitingPhase();
    }, 3000);
  };

  const placeBet = async (betNumber: 1 | 2) => {
    if (gamePhase !== 'waiting') {
      toast({
        title: "Betting Closed",
        description: "Cannot place bet during flight",
        variant: "destructive",
      });
      return;
    }

    const amount = betNumber === 1 ? betAmount1 : betAmount2;
    
    if (balance < amount) {
      toast({
        title: "Insufficient Balance",
        description: "Please add funds to your account",
        variant: "destructive",
      });
      return;
    }

    const newBet: BetData = {
      amount,
      status: 'active'
    };

    if (betNumber === 1) {
      setBet1(newBet);
    } else {
      setBet2(newBet);
    }

    setBalance(prev => prev - amount);

    toast({
      title: "Bet Placed",
      description: `₹${amount} bet placed`,
      variant: "default",
    });
  };

  const cashOut = async (betNumber: 1 | 2) => {
    const bet = betNumber === 1 ? bet1 : bet2;
    
    if (!bet || bet.status !== 'active') {
      return;
    }

    try {
      const winAmount = Math.floor(bet.amount * currentMultiplier);
      
      const result = await api.playAviator(bet.amount, currentMultiplier, false, currentMultiplier);
      
      if (result.isWin) {
        setBalance(prev => prev + winAmount);
        
        const updatedBet: BetData = {
          ...bet,
          status: 'cashed_out',
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
          description: `Won ₹${winAmount} at ${currentMultiplier.toFixed(2)}x`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Cash out failed:', error);
      toast({
        title: "Cash Out Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const drawFlightPath = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw flight path
    if (flightPath.length > 1) {
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(flightPath[0].x, flightPath[0].y);
      
      for (let i = 1; i < flightPath.length; i++) {
        ctx.lineTo(flightPath[i].x, flightPath[i].y);
      }
      ctx.stroke();
    }
    
    // Draw plane
    if (planePosition.x > 0) {
      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.fillText('✈️', planePosition.x - 10, planePosition.y + 5);
    }
    
    // Draw multiplier
    if (gamePhase === 'flying') {
      ctx.fillStyle = '#00ff88';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${currentMultiplier.toFixed(2)}x`, canvas.width / 2, 50);
    }
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier < 1.5) return 'text-red-500';
    if (multiplier < 2.5) return 'text-yellow-500';
    if (multiplier < 5.0) return 'text-green-500';
    return 'text-blue-500';
  };

  const getMultiplierBgColor = (multiplier: number) => {
    if (multiplier < 1.5) return 'bg-red-100';
    if (multiplier < 2.5) return 'bg-yellow-100';
    if (multiplier < 5.0) return 'bg-green-100';
    return 'bg-blue-100';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Aviator - Crash Game
        </h1>
        <p className="text-gray-600">Real-time multiplier game • Cash out before crash • Instant wins</p>
      </div>

      {/* Game Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">
                {gamePhase === 'waiting' ? 'Waiting for takeoff' : 
                 gamePhase === 'flying' ? 'Flying...' : 'Crashed!'}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="text-sm">
              Balance: ₹{balance.toFixed(2)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {gamePhase === 'waiting' && (
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                Starting in {timeLeft}s
              </div>
              <Progress value={(5 - timeLeft) / 5 * 100} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Flight Canvas */}
      <Card>
        <CardContent className="p-0">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full h-96 rounded-lg"
          />
        </CardContent>
      </Card>

      {/* Current Multiplier Display */}
      {gamePhase === 'flying' && (
        <Card className="bg-gradient-to-r from-green-400 to-blue-500">
          <CardContent className="text-center py-8">
            <div className="text-6xl font-bold text-white">
              {currentMultiplier.toFixed(2)}x
            </div>
            <div className="text-white text-lg mt-2">Current Multiplier</div>
          </CardContent>
        </Card>
      )}

      {/* Crash Result */}
      {gamePhase === 'crashed' && (
        <Card className="bg-gradient-to-r from-red-400 to-red-600">
          <CardContent className="text-center py-8">
            <div className="text-6xl font-bold text-white">
              {crashMultiplier.toFixed(2)}x
            </div>
            <div className="text-white text-lg mt-2">CRASHED!</div>
          </CardContent>
        </Card>
      )}

      {/* Betting Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bet 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Bet 1
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBetAmount1(Math.max(10, betAmount1 - 10))}
              >
                -
              </Button>
              <div className="flex-1 text-center px-4 py-2 bg-gray-100 rounded">
                ₹{betAmount1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBetAmount1(betAmount1 + 10)}
              >
                +
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">Auto Cash Out:</span>
              <input
                type="number"
                step="0.01"
                min="1.01"
                value={autoCashOut1 || ''}
                onChange={(e) => setAutoCashOut1(e.target.value ? parseFloat(e.target.value) : null)}
                className="flex-1 px-3 py-1 border rounded text-sm"
                placeholder="1.50"
              />
            </div>
            
            {!bet1 && gamePhase === 'waiting' && (
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => placeBet(1)}
              >
                Place Bet
              </Button>
            )}
            
            {bet1 && bet1.status === 'active' && gamePhase === 'flying' && (
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={() => cashOut(1)}
              >
                Cash Out {currentMultiplier.toFixed(2)}x
              </Button>
            )}
            
            {bet1 && bet1.status === 'cashed_out' && (
              <div className="text-center p-4 bg-green-100 rounded">
                <div className="text-green-800 font-bold">
                  Cashed Out: {bet1.cashOutMultiplier?.toFixed(2)}x
                </div>
                <div className="text-green-600">
                  Won: ₹{bet1.winAmount}
                </div>
              </div>
            )}
            
            {bet1 && bet1.status === 'crashed' && (
              <div className="text-center p-4 bg-red-100 rounded">
                <div className="text-red-800 font-bold">Crashed!</div>
                <div className="text-red-600">Lost: ₹{bet1.amount}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bet 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Bet 2
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBetAmount2(Math.max(10, betAmount2 - 10))}
              >
                -
              </Button>
              <div className="flex-1 text-center px-4 py-2 bg-gray-100 rounded">
                ₹{betAmount2}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBetAmount2(betAmount2 + 10)}
              >
                +
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">Auto Cash Out:</span>
              <input
                type="number"
                step="0.01"
                min="1.01"
                value={autoCashOut2 || ''}
                onChange={(e) => setAutoCashOut2(e.target.value ? parseFloat(e.target.value) : null)}
                className="flex-1 px-3 py-1 border rounded text-sm"
                placeholder="2.00"
              />
            </div>
            
            {!bet2 && gamePhase === 'waiting' && (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => placeBet(2)}
              >
                Place Bet
              </Button>
            )}
            
            {bet2 && bet2.status === 'active' && gamePhase === 'flying' && (
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={() => cashOut(2)}
              >
                Cash Out {currentMultiplier.toFixed(2)}x
              </Button>
            )}
            
            {bet2 && bet2.status === 'cashed_out' && (
              <div className="text-center p-4 bg-green-100 rounded">
                <div className="text-green-800 font-bold">
                  Cashed Out: {bet2.cashOutMultiplier?.toFixed(2)}x
                </div>
                <div className="text-green-600">
                  Won: ₹{bet2.winAmount}
                </div>
              </div>
            )}
            
            {bet2 && bet2.status === 'crashed' && (
              <div className="text-center p-4 bg-red-100 rounded">
                <div className="text-red-800 font-bold">Crashed!</div>
                <div className="text-red-600">Lost: ₹{bet2.amount}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Flight History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="w-5 h-5 text-gray-500" />
            Flight History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {flightHistory.map((result, index) => (
              <div
                key={index}
                className={`px-3 py-1 rounded text-sm font-medium ${getMultiplierBgColor(result.multiplier)} ${getMultiplierColor(result.multiplier)}`}
              >
                {result.multiplier.toFixed(2)}x
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalBets}</div>
              <div className="text-sm text-gray-600">Total Bets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalWins}</div>
              <div className="text-sm text-gray-600">Total Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{maxMultiplier.toFixed(2)}x</div>
              <div className="text-sm text-gray-600">Max Multiplier</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{averageMultiplier.toFixed(2)}x</div>
              <div className="text-sm text-gray-600">Average</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}