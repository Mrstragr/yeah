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
      {/* Game Display */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <CardContent className="p-6">
          <div className="relative h-64 mb-4">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="text-white">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Flight Path */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d={`M 0 ${256} Q ${planePosition.x * 4} ${planePosition.y * 2.56} ${planePosition.x * 4 + 50} ${planePosition.y * 2.56 - 20}`}
                stroke="#22d3ee"
                strokeWidth="3"
                fill="none"
                className="opacity-80"
              />
            </svg>

            {/* Plane */}
            <div 
              className="absolute transition-all duration-75"
              style={{ 
                left: `${planePosition.x}%`, 
                top: `${planePosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Plane 
                className={`w-8 h-8 transition-all duration-200 ${
                  gamePhase === 'crashed' ? 'text-red-500 animate-pulse' : 'text-yellow-400'
                }`}
                style={{ transform: 'rotate(-15deg)' }}
              />
            </div>

            {/* Multiplier Display */}
            <div className="absolute top-4 left-4">
              <div className={`text-4xl font-bold transition-all duration-200 ${
                gamePhase === 'crashed' ? 'text-red-500' : 'text-green-400'
              }`}>
                {gamePhase === 'waiting' ? (
                  countdown > 0 ? `${countdown}s` : 'Starting...'
                ) : (
                  `${multiplier.toFixed(2)}x`
                )}
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
            <CardTitle>Place Bet</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4 bg-[#edebebbf]">
            <div>
              <label className="text-sm font-medium mb-2 block">Bet Amount</label>
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
              <label className="text-sm font-medium mb-2 block">Auto Cash Out</label>
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
            <CardTitle>Game History</CardTitle>
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