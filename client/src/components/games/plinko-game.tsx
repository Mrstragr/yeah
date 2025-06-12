import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Coins, TrendingUp, Circle } from "lucide-react";

interface PlinkoGameProps {
  game: any;
  user: any;
  onBack: () => void;
}

export function PlinkoGame({ game, user, onBack }: PlinkoGameProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [ballPosition, setBallPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDropping, setIsDropping] = useState(false);
  const [result, setResult] = useState<{ slot: number; multiplier: number; payout: number } | null>(null);
  const [gameHistory, setGameHistory] = useState<any[]>([]);

  const rows = 16;
  const slots = 17;

  // Multiplier tables for different risk levels
  const multipliers = {
    low: [1.5, 1.3, 1.1, 1.0, 0.7, 0.6, 0.5, 0.4, 0.5, 0.6, 0.7, 1.0, 1.1, 1.3, 1.5],
    medium: [5.6, 2.1, 1.4, 1.1, 1.0, 0.5, 0.2, 0.2, 0.2, 0.2, 0.5, 1.0, 1.1, 1.4, 2.1, 5.6],
    high: [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000]
  };

  const currentMultipliers = multipliers[riskLevel];

  const dropBall = () => {
    if (betAmount < 10 || isDropping) return;

    setIsDropping(true);
    setResult(null);
    setBallPosition({ x: 8, y: 0 }); // Start at center top

    // Simulate ball path
    let currentX = 8;
    let path = [{ x: currentX, y: 0 }];

    for (let row = 1; row <= rows; row++) {
      // Ball bounces left or right at each peg
      const direction = Math.random() < 0.5 ? -0.5 : 0.5;
      currentX += direction;
      
      // Keep ball within bounds
      currentX = Math.max(0, Math.min(slots - 1, currentX));
      path.push({ x: currentX, y: row });
    }

    // Animate ball drop
    let stepIndex = 0;
    const animateStep = () => {
      if (stepIndex < path.length) {
        setBallPosition(path[stepIndex]);
        stepIndex++;
        setTimeout(animateStep, 150);
      } else {
        // Ball has reached bottom
        const finalSlot = Math.round(currentX);
        const multiplier = currentMultipliers[finalSlot] || 0;
        const payout = Math.round(betAmount * multiplier);

        setResult({ slot: finalSlot, multiplier, payout });
        setIsDropping(false);
        setBallPosition(null);

        const newGame = {
          bet: betAmount,
          risk: riskLevel,
          slot: finalSlot,
          multiplier,
          payout,
          timestamp: new Date()
        };

        setGameHistory(prev => [newGame, ...prev.slice(0, 9)]);
      }
    };

    animateStep();
  };

  const renderPlinkoBoard = () => {
    const pegs = [];
    const multiplierSlots = [];

    // Generate pegs
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col <= row; col++) {
        const x = (slots / 2) - (row / 2) + col;
        const y = row + 1;
        
        pegs.push(
          <div
            key={`peg-${row}-${col}`}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${(x / slots) * 100}%`,
              top: `${(y / (rows + 2)) * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        );
      }
    }

    // Generate multiplier slots at bottom
    for (let i = 0; i < currentMultipliers.length; i++) {
      const multiplier = currentMultipliers[i];
      const isHighValue = multiplier >= 5;
      
      multiplierSlots.push(
        <div
          key={`slot-${i}`}
          className={`
            absolute bottom-0 text-xs font-bold rounded-t-lg border-2 text-center
            ${isHighValue 
              ? 'bg-gradient-to-t from-yellow-500 to-orange-500 border-yellow-400 text-black' 
              : multiplier >= 1 
              ? 'bg-gradient-to-t from-green-500 to-green-400 border-green-400 text-white'
              : 'bg-gradient-to-t from-red-500 to-red-400 border-red-400 text-white'
            }
          `}
          style={{
            left: `${(i / (currentMultipliers.length - 1)) * 100}%`,
            width: `${100 / currentMultipliers.length}%`,
            height: '40px',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {multiplier}x
        </div>
      );
    }

    return (
      <div className="relative w-full h-96 bg-gradient-to-b from-blue-900/20 to-purple-900/20 rounded-lg border border-purple-500/30 overflow-hidden">
        {pegs}
        {multiplierSlots}
        
        {/* Animated Ball */}
        {ballPosition && (
          <motion.div
            className="absolute w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg z-10"
            style={{
              left: `${(ballPosition.x / slots) * 100}%`,
              top: `${(ballPosition.y / (rows + 2)) * 100}%`,
            }}
            animate={{
              x: 0,
              y: 0,
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 0.15,
              scale: { duration: 0.3 }
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">🎯 Plinko</h1>
            <p className="text-gray-300 text-sm">Drop the ball and watch it bounce</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Balance</p>
            <p className="text-lg font-bold text-green-400">₹{parseFloat(user?.walletBalance || '0').toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Plinko Board */}
            <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-white text-center">Plinko Board</CardTitle>
              </CardHeader>
              <CardContent>
                {renderPlinkoBoard()}

                {/* Result Display */}
                {result && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center mt-6"
                  >
                    <div className="text-xl font-bold text-white mb-2">
                      Slot {result.slot + 1} - {result.multiplier}x Multiplier
                    </div>
                    {result.payout > 0 ? (
                      <div className="text-3xl font-bold text-yellow-400">
                        Won ₹{result.payout.toLocaleString()}!
                      </div>
                    ) : (
                      <div className="text-xl font-bold text-red-400">
                        Better luck next time!
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Game Controls */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Game Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Risk Level Selection */}
                <div>
                  <label className="block text-white text-sm font-medium mb-3">
                    Risk Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as const).map((risk) => (
                      <Button
                        key={risk}
                        onClick={() => setRiskLevel(risk)}
                        variant={riskLevel === risk ? 'default' : 'outline'}
                        className={`py-3 ${
                          riskLevel === risk
                            ? risk === 'low' 
                              ? 'bg-green-600 hover:bg-green-700'
                              : risk === 'medium'
                              ? 'bg-yellow-600 hover:bg-yellow-700'
                              : 'bg-red-600 hover:bg-red-700'
                            : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-bold capitalize">{risk}</div>
                          <div className="text-xs opacity-80">
                            {risk === 'low' ? 'Safe' : risk === 'medium' ? 'Balanced' : 'High Risk'}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Bet Amount */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Bet Amount (₹10 - ₹{Math.min(5000, parseFloat(user?.walletBalance || '0'))})
                  </label>
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 0))}
                    className="bg-gray-700 border-gray-600 text-white"
                    min={10}
                    max={Math.min(5000, parseFloat(user?.walletBalance || '0'))}
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[100, 500, 1000, 2500].map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs py-2"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={dropBall}
                  disabled={isDropping || betAmount < 10}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 text-lg font-bold"
                >
                  {isDropping ? 'Ball Dropping...' : `Drop Ball (₹${betAmount.toLocaleString()})`}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Risk Level Info */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                  Risk Levels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-300">
                <div>
                  <div className="text-green-400 font-bold">Low Risk:</div>
                  <div>Max: 1.5x, Safe returns</div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold">Medium Risk:</div>
                  <div>Max: 5.6x, Balanced</div>
                </div>
                <div>
                  <div className="text-red-400 font-bold">High Risk:</div>
                  <div>Max: 1000x, High volatility</div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Games */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                  Recent Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {gameHistory.length > 0 ? (
                    gameHistory.map((game, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                        <div className="text-xs">
                          <div className="text-gray-400">
                            {game.risk.toUpperCase()} - Slot {game.slot + 1}
                          </div>
                          <div className="text-gray-300">
                            {game.multiplier}x multiplier
                          </div>
                        </div>
                        <div className={`text-xs font-bold ${
                          game.payout > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {game.payout > 0 ? `+₹${game.payout}` : `-₹${game.bet}`}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No games played yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}