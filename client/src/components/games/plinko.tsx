import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Circle, Target, Zap } from "lucide-react";

interface PlinkoProps {
  userBalance: string;
  onBet: (amount: number, gameData: any) => Promise<void>;
}

export function Plinko({ userBalance, onBet }: PlinkoProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [isDropping, setIsDropping] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 0 });
  const [ballPath, setBallPath] = useState<{x: number, y: number}[]>([]);
  const [finalSlot, setFinalSlot] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<{won: boolean, payout: number, multiplier: number, slot: number} | null>(null);
  const [gameHistory, setGameHistory] = useState<{slot: number, multiplier: number, won: boolean}[]>([
    {slot: 7, multiplier: 10, won: true},
    {slot: 3, multiplier: 2, won: true},
    {slot: 0, multiplier: 0, won: false},
    {slot: 14, multiplier: 10, won: true},
    {slot: 8, multiplier: 3, won: true}
  ]);

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  // Plinko multipliers for 15 slots (0-14)
  const multipliers = [0, 0.5, 1, 1.5, 2, 3, 5, 10, 25, 10, 5, 3, 2, 1.5, 1];

  const getSlotColor = (multiplier: number) => {
    if (multiplier === 0) return 'bg-gray-600';
    if (multiplier <= 1) return 'bg-blue-500';
    if (multiplier <= 3) return 'bg-green-500';
    if (multiplier <= 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const dropBall = async () => {
    if (isDropping || betAmount > parseFloat(userBalance)) return;

    setIsDropping(true);
    setFinalSlot(null);
    setLastResult(null);
    setBallPath([]);

    // Simulate ball path through pegs
    const path: {x: number, y: number}[] = [];
    let currentX = 50; // Start at center
    
    // Generate path through 8 rows of pegs
    for (let row = 0; row < 8; row++) {
      const y = (row + 1) * 12.5; // Each row is 12.5% down
      
      // Ball bounces left or right at each peg
      const bounce = (Math.random() - 0.5) * 15; // Random bounce
      currentX = Math.max(5, Math.min(95, currentX + bounce));
      
      path.push({ x: currentX, y });
    }

    setBallPath(path);

    // Animate ball falling
    for (let i = 0; i < path.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setBallPosition(path[i]);
    }

    // Determine final slot based on final X position
    const slotIndex = Math.floor((currentX / 100) * 15);
    const finalSlotIndex = Math.max(0, Math.min(14, slotIndex));
    setFinalSlot(finalSlotIndex);

    const multiplier = multipliers[finalSlotIndex];
    const won = multiplier > 0;
    const payout = won ? betAmount * multiplier : 0;

    setLastResult({
      won: won,
      payout: payout,
      multiplier: multiplier,
      slot: finalSlotIndex
    });

    // Add to history
    setGameHistory(prev => [{
      slot: finalSlotIndex,
      multiplier: multiplier,
      won: won
    }, ...prev.slice(0, 4)]);

    // Place bet
    await onBet(betAmount, {
      type: 'plinko',
      betAmount,
      finalSlot: finalSlotIndex,
      multiplier: multiplier,
      won: won,
      payout: payout
    });

    setIsDropping(false);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setBallPosition({ x: 50, y: 0 });
      setBallPath([]);
      setFinalSlot(null);
      setLastResult(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Professional 3D Game Display */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white shadow-2xl border border-blue-700/50">
        <CardHeader className="bg-gradient-to-r from-blue-800/30 to-purple-800/30 backdrop-blur-sm">
          <CardTitle className="text-center text-4xl font-black flex items-center justify-center gap-3 neon-text">
            🎯 PLINKO <span className="text-lg text-blue-300 font-bold">DROP THE BALL</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center space-y-8">
            {/* Enhanced 3D Plinko Board */}
            <div className="relative h-96 bg-gradient-to-b from-blue-950 to-purple-950 rounded-2xl border-4 border-white/20 overflow-hidden">
              {/* Particle Effects */}
              {isDropping && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(25)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
                      style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${0.3 + Math.random()}s`
                      }}
                    ></div>
                  ))}
                </div>
              )}

              {/* Pegs */}
              {Array.from({ length: 8 }, (_, row) => (
                <div key={row} className="absolute flex justify-center w-full" style={{ top: `${(row + 1) * 12.5}%` }}>
                  {Array.from({ length: row + 3 }, (_, peg) => (
                    <div
                      key={peg}
                      className="w-3 h-3 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full mx-4 shadow-lg border border-yellow-600"
                      style={{
                        boxShadow: '0 0 10px rgba(255, 215, 0, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
                      }}
                    />
                  ))}
                </div>
              ))}

              {/* Enhanced 3D Ball */}
              <div
                className={`absolute w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-2xl transition-all duration-300 transform-gpu ${
                  isDropping ? 'animate-bounce' : ''
                } border-2 border-red-700`}
                style={{
                  left: `${ballPosition.x}%`,
                  top: `${ballPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 15px rgba(239, 68, 68, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                  zIndex: 10
                }}
              />

              {/* Ball Trail */}
              {ballPath.map((point, index) => (
                <div
                  key={index}
                  className="absolute w-2 h-2 bg-red-300/50 rounded-full"
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.6 - (index * 0.1)
                  }}
                />
              ))}

              {/* Multiplier Slots */}
              <div className="absolute bottom-0 w-full flex">
                {multipliers.map((multiplier, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-12 flex items-center justify-center text-xs font-bold border-r border-white/20 ${
                      getSlotColor(multiplier)
                    } ${finalSlot === index ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}
                  >
                    {multiplier}x
                  </div>
                ))}
              </div>
            </div>

            {/* Game Result */}
            {lastResult && finalSlot !== null && (
              <div className={`text-center p-6 rounded-xl border-2 backdrop-blur-md ${
                lastResult.won 
                  ? 'bg-green-500/20 border-green-500 text-green-300' 
                  : 'bg-red-500/20 border-red-500 text-red-300'
              }`}>
                <div className="text-3xl font-bold mb-3">
                  {lastResult.won ? '🎉 Winner!' : '💸 Try Again!'}
                </div>
                <div className="text-xl mb-2">
                  Ball landed in slot <span className="font-bold text-2xl">{finalSlot}</span>
                </div>
                <div className="text-lg">
                  Multiplier: <span className="font-bold">{lastResult.multiplier}x</span>
                </div>
                {lastResult.won && (
                  <div className="text-2xl font-bold text-green-400 mt-3">
                    Won ₹{lastResult.payout.toFixed(2)}!
                  </div>
                )}
              </div>
            )}

            {/* Game History */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-blue-300">Recent Results</h3>
              <div className="flex gap-2 justify-center flex-wrap">
                {gameHistory.map((game, index) => (
                  <Badge 
                    key={index} 
                    variant={game.won ? "default" : "secondary"}
                    className="text-xs"
                  >
                    Slot {game.slot}: {game.multiplier}x
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Betting Controls */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border border-slate-700">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bet Amount */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-300">Bet Amount (₹)</label>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="bg-slate-700 border-slate-600 text-white"
                min="1"
                max={userBalance}
              />
              <div className="flex gap-2 flex-wrap">
                {quickAmounts.map(amount => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount(amount)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Game Info */}
            <div className="space-y-3">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Your Balance:</span>
                  <span className="font-bold text-green-400">₹{userBalance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Potential Win:</span>
                  <span className="font-bold text-yellow-400">Up to ₹{(betAmount * 25).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Multiplier:</span>
                  <span className="text-gaming-gold font-gaming">25x</span>
                </div>
              </div>
            </div>
          </div>

          {/* Insufficient Balance Warning */}
          {parseFloat(userBalance) < betAmount && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <Circle className="w-5 h-5 text-red-300 mr-3" />
                <p className="text-red-200 text-sm font-bold">
                  Insufficient wallet balance. Please add money to continue.
                </p>
              </div>
            </div>
          )}

          {/* Drop Ball Button */}
          <Button
            onClick={dropBall}
            disabled={isDropping || parseFloat(userBalance) < betAmount}
            className="w-full casino-button py-4 text-xl"
          >
            {isDropping ? "🎯 Ball Dropping..." : `🎲 Drop Ball for ₹${betAmount}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}