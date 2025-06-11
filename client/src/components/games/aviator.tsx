import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plane, TrendingUp, TrendingDown } from "lucide-react";

interface AviatorProps {
  userBalance: string;
  onBet: (amount: number, gameData: any) => Promise<void>;
}

export function Aviator({ userBalance, onBet }: AviatorProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [isFlying, setIsFlying] = useState(false);
  const [multiplier, setMultiplier] = useState(1.00);
  const [hasPlaced, setHasPlaced] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [lastResult, setLastResult] = useState<{crashed: boolean, multiplier: number, payout: number} | null>(null);
  const [gameHistory, setGameHistory] = useState<number[]>([2.34, 1.56, 8.92, 1.03, 4.67]);
  const [autoCashOut, setAutoCashOut] = useState<number | null>(null);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [countdown, setCountdown] = useState(0);
  const [planePosition, setPlanePosition] = useState({ x: 10, y: 80 });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameStartTimeRef = useRef<number>(0);
  const crashPointRef = useRef<number>(0);

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  useEffect(() => {
    startCountdown();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startCountdown = () => {
    setGamePhase('waiting');
    setCountdown(5);
    const countInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countInterval);
          startGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startGame = async () => {
    setGamePhase('flying');
    setIsFlying(true);
    setMultiplier(1.00);
    setHasCashedOut(false);
    setLastResult(null);
    setPlanePosition({ x: 10, y: 80 });
    gameStartTimeRef.current = Date.now();

    // Generate crash point (1.00 to 50.00 with weighted probability)
    const random = Math.random();
    let crashPoint: number;
    
    if (random < 0.5) {
      crashPoint = 1.00 + Math.random() * 1.00;
    } else if (random < 0.75) {
      crashPoint = 2.00 + Math.random() * 3.00;
    } else if (random < 0.92) {
      crashPoint = 5.00 + Math.random() * 10.00;
    } else {
      crashPoint = 15.00 + Math.random() * 35.00;
    }

    crashPointRef.current = crashPoint;

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - gameStartTimeRef.current;
      const currentMultiplier = 1 + (elapsed / 1000) * 0.1;
      
      setMultiplier(currentMultiplier);
      setPlanePosition(prev => ({
        x: Math.min(90, prev.x + 0.5),
        y: Math.max(20, prev.y - 0.3)
      }));

      // Auto cash out
      if (autoCashOut && currentMultiplier >= autoCashOut && hasPlaced && !hasCashedOut) {
        cashOut();
      }

      // Check if crashed
      if (currentMultiplier >= crashPoint) {
        crash();
      }
    }, 50);
  };

  const placeBet = async () => {
    if (gamePhase !== 'waiting' || betAmount > parseFloat(userBalance)) return;
    
    setHasPlaced(true);
    await onBet(betAmount, {
      type: 'aviator',
      betAmount,
      multiplier: null,
      result: 'pending'
    });
  };

  const cashOut = async () => {
    if (!hasPlaced || hasCashedOut || gamePhase !== 'flying') return;

    setHasCashedOut(true);
    const payout = betAmount * multiplier;
    
    setLastResult({
      crashed: false,
      multiplier: multiplier,
      payout: payout
    });

    await onBet(betAmount, {
      type: 'aviator',
      betAmount,
      multiplier: multiplier,
      result: 'win',
      payout: payout
    });
  };

  const crash = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setGamePhase('crashed');
    setIsFlying(false);

    if (hasPlaced && !hasCashedOut) {
      setLastResult({
        crashed: true,
        multiplier: multiplier,
        payout: 0
      });
    }

    // Add to history
    setGameHistory(prev => [multiplier, ...prev.slice(0, 4)]);

    // Reset for next round
    setTimeout(() => {
      setHasPlaced(false);
      setHasCashedOut(false);
      startCountdown();
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Professional 3D Game Display */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl border border-slate-700">
        <CardContent className="p-8">
          <div className="relative h-80 mb-6 rounded-xl overflow-hidden">
            {/* Animated Sky Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-indigo-800/30 to-purple-700/20"></div>
            
            {/* Professional Grid */}
            <div className="absolute inset-0 opacity-15">
              <svg width="100%" height="100%" className="text-cyan-400">
                <defs>
                  <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                    <path d="M 25 0 L 0 0 0 25" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Clouds Animation */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-12 left-0 w-24 h-12 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '0s', animationDuration: '4s'}}></div>
              <div className="absolute top-24 right-0 w-20 h-10 bg-white/15 rounded-full animate-pulse" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
              <div className="absolute top-40 left-1/3 w-16 h-8 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
            </div>

            {/* Enhanced Flight Path */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor: '#22d3ee', stopOpacity: 0.3}} />
                  <stop offset="50%" style={{stopColor: '#06b6d4', stopOpacity: 0.8}} />
                  <stop offset="100%" style={{stopColor: '#0891b2', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              <path
                d={`M 0 ${320} Q ${planePosition.x * 5} ${planePosition.y * 3.2} ${planePosition.x * 5 + 60} ${planePosition.y * 3.2 - 30}`}
                stroke="url(#pathGradient)"
                strokeWidth="4"
                fill="none"
                className="drop-shadow-lg filter brightness-125"
              />
            </svg>

            {/* Enhanced 3D Plane */}
            <div 
              className="absolute transition-all duration-100 transform-gpu"
              style={{ 
                left: `${planePosition.x}%`, 
                top: `${planePosition.y}%`,
                transform: `translate(-50%, -50%) scale(${gamePhase === 'flying' ? 1.2 : 1}) rotate(${gamePhase === 'crashed' ? '45deg' : '-10deg'})`
              }}
            >
              <div className="relative">
                <Plane 
                  className={`w-12 h-12 transition-all duration-200 drop-shadow-2xl ${
                    gamePhase === 'crashed' ? 'text-red-400 animate-bounce' : 'text-cyan-300'
                  } filter brightness-125`}
                />
                {/* Engine Trail Effect */}
                {gamePhase === 'flying' && (
                  <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                    <div className="w-8 h-1 bg-gradient-to-r from-orange-400 via-yellow-300 to-transparent rounded-full animate-pulse"></div>
                  </div>
                )}
                {/* Crash Effect */}
                {gamePhase === 'crashed' && (
                  <div className="absolute inset-0 animate-ping">
                    <div className="w-16 h-16 bg-red-500/30 rounded-full -translate-x-1/4 -translate-y-1/4"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Multiplier Display */}
            <div className="absolute top-8 left-8">
              <div className="glass-effect px-6 py-3 rounded-xl backdrop-blur-md">
                <div className={`text-5xl font-black transition-all duration-300 ${
                  gamePhase === 'crashed' ? 'text-red-400 animate-bounce' : 'text-yellow-300 multiplier-display'
                } drop-shadow-2xl neon-text`}>
                  {gamePhase === 'waiting' ? (
                    countdown > 0 ? `${countdown}s` : '🚀 Starting...'
                  ) : (
                    `${multiplier.toFixed(2)}x`
                  )}
                </div>
              </div>
            </div>

            {/* Game Status */}
            <div className="absolute top-4 right-4">
              <Badge variant={gamePhase === 'crashed' ? 'destructive' : 'default'}>
                {gamePhase === 'waiting' ? 'Waiting' : 
                 gamePhase === 'flying' ? 'Flying' : 'Crashed'}
              </Badge>
            </div>
          </div>

          {/* Result Display */}
          {lastResult && (
            <div className={`text-center py-2 rounded-lg ${
              lastResult.crashed ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
            }`}>
              {lastResult.crashed ? (
                <span>Crashed at {lastResult.multiplier.toFixed(2)}x - Lost ${betAmount}</span>
              ) : (
                <span>Cashed out at {lastResult.multiplier.toFixed(2)}x - Won ${lastResult.payout.toFixed(2)}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Betting Panel */}
        <Card>
          <CardHeader className="bg-[#dededeed]">
            <CardTitle className="text-slate-900 font-bold">Place Bet</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4 bg-[#edebebbf]">
            <div>
              <label className="text-sm font-medium mb-2 block text-slate-900">Bet Amount</label>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min="10"
                max={parseFloat(userBalance)}
                disabled={gamePhase === 'flying'}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(amount)}
                  disabled={gamePhase === 'flying' || amount > parseFloat(userBalance)}
                >
                  ${amount}
                </Button>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-slate-900">Auto Cash Out</label>
              <Input
                type="number"
                placeholder="e.g., 2.00"
                step="0.01"
                min="1.01"
                value={autoCashOut || ''}
                onChange={(e) => setAutoCashOut(e.target.value ? parseFloat(e.target.value) : null)}
              />
            </div>

            <div className="space-y-2">
              {!hasPlaced ? (
                <Button 
                  onClick={placeBet}
                  disabled={gamePhase !== 'waiting' || betAmount > parseFloat(userBalance)}
                  className="casino-button w-full text-lg py-3"
                >
                  🎯 BET ${betAmount}
                </Button>
              ) : (
                <Button 
                  onClick={cashOut}
                  disabled={hasCashedOut || gamePhase !== 'flying'}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg py-3 shadow-lg"
                >
                  💰 CASH OUT ${(betAmount * multiplier).toFixed(2)}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader className="flex flex-col space-y-1.5 p-6 bg-[#dededeed]">
            <CardTitle className="text-slate-900 font-bold">Game History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gameHistory.map((mult, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded border">
                  <span className="font-mono text-slate-900">#{gameHistory.length - index}</span>
                  <Badge 
                    variant={mult >= 2 ? 'default' : 'secondary'} 
                    className={`font-bold ${
                      mult >= 2 
                        ? 'bg-green-600 text-white' 
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    {mult.toFixed(2)}x
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}