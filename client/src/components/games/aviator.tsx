import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameStartTimeRef = useRef<number>(0);

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startGame = async () => {
    if (isFlying || betAmount > parseFloat(userBalance)) return;

    setIsFlying(true);
    setHasPlaced(true);
    setHasCashedOut(false);
    setMultiplier(1.00);
    setLastResult(null);
    gameStartTimeRef.current = Date.now();

    // Generate crash point (1.00 to 10.00 with weighted probability)
    const random = Math.random();
    let crashPoint: number;
    
    if (random < 0.4) {
      // 40% chance of crash between 1.00-2.00
      crashPoint = 1.00 + Math.random() * 1.00;
    } else if (random < 0.7) {
      // 30% chance of crash between 2.00-5.00
      crashPoint = 2.00 + Math.random() * 3.00;
    } else if (random < 0.9) {
      // 20% chance of crash between 5.00-10.00
      crashPoint = 5.00 + Math.random() * 5.00;
    } else {
      // 10% chance of crash between 10.00-50.00
      crashPoint = 10.00 + Math.random() * 40.00;
    }

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - gameStartTimeRef.current) / 1000;
      const currentMultiplier = 1.00 + (elapsed * 0.5); // Increases by 0.5x per second
      
      setMultiplier(currentMultiplier);

      // Auto cash out if enabled
      if (autoCashOut && currentMultiplier >= autoCashOut && !hasCashedOut) {
        cashOut(currentMultiplier);
        return;
      }

      // Check if crashed
      if (currentMultiplier >= crashPoint) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        setIsFlying(false);
        setHasPlaced(false);
        
        const crashed = !hasCashedOut;
        const finalPayout = crashed ? 0 : betAmount * multiplier;
        
        setLastResult({
          crashed,
          multiplier: crashPoint,
          payout: finalPayout
        });

        // Update game history
        setGameHistory(prev => [crashPoint, ...prev.slice(0, 4)]);

        // Call onBet with result
        onBet(crashed ? -betAmount : finalPayout - betAmount, {
          gameType: 'aviator',
          multiplier: crashed ? crashPoint : multiplier,
          crashed,
          betAmount
        });
      }
    }, 100); // Update every 100ms for smooth animation
  };

  const cashOut = async (currentMultiplier?: number) => {
    if (!isFlying || hasCashedOut) return;

    const finalMultiplier = currentMultiplier || multiplier;
    setHasCashedOut(true);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setIsFlying(false);
    setHasPlaced(false);
    
    const payout = betAmount * finalMultiplier;
    
    setLastResult({
      crashed: false,
      multiplier: finalMultiplier,
      payout
    });

    // Call onBet with winnings
    await onBet(payout - betAmount, {
      gameType: 'aviator',
      multiplier: finalMultiplier,
      crashed: false,
      betAmount
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">🛩️ Aviator</h1>
        <p className="text-gray-300">Watch the plane fly and cash out before it crashes!</p>
        <div className="mt-2">
          <Badge variant="secondary" className="bg-green-600 text-white">
            Balance: ₹{parseFloat(userBalance).toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* Game Area */}
      <Card className="bg-gradient-to-br from-blue-900 to-purple-900 border-blue-600 min-h-96">
        <CardContent className="p-8">
          <div className="relative h-80 bg-gradient-to-t from-green-800 to-blue-400 rounded-lg overflow-hidden">
            {/* Sky background */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-400 via-blue-300 to-blue-600"></div>
            
            {/* Clouds */}
            <div className="absolute top-10 left-20 w-16 h-8 bg-white rounded-full opacity-70"></div>
            <div className="absolute top-16 right-32 w-12 h-6 bg-white rounded-full opacity-50"></div>
            <div className="absolute top-6 right-16 w-20 h-10 bg-white rounded-full opacity-60"></div>
            
            {/* Plane */}
            <div className={`absolute bottom-10 left-10 text-4xl transition-all duration-300 ${isFlying ? 'transform translate-x-96 -translate-y-32' : ''}`}>
              ✈️
            </div>
            
            {/* Multiplier Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`text-6xl font-bold ${isFlying ? 'text-green-400' : 'text-white'} transition-colors`}>
                {multiplier.toFixed(2)}x
              </div>
            </div>
            
            {/* Game Status */}
            <div className="absolute top-4 left-4">
              {isFlying && (
                <Badge className="bg-green-600 text-white">
                  FLYING
                </Badge>
              )}
              {lastResult && (
                <Badge className={lastResult.crashed ? "bg-red-600" : "bg-green-600"}>
                  {lastResult.crashed ? "CRASHED" : "CASHED OUT"}
                </Badge>
              )}
            </div>
            
            {/* Last Result */}
            {lastResult && (
              <div className="absolute bottom-4 left-4 text-white">
                <div className={`text-2xl font-bold ${lastResult.crashed ? 'text-red-400' : 'text-green-400'}`}>
                  {lastResult.crashed ? `❌ Crashed at ${lastResult.multiplier.toFixed(2)}x` : `✅ Won ₹${lastResult.payout.toFixed(2)}`}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Betting Panel */}
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Place Your Bet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bet Amount */}
            <div className="space-y-2">
              <label className="text-gray-300 text-sm">Bet Amount (₹)</label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                min="1"
                max={parseFloat(userBalance)}
                disabled={isFlying}
              />
            </div>

            {/* Quick Bet Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map(amount => (
                <Button
                  key={amount}
                  variant={betAmount === amount ? 'default' : 'outline'}
                  className={betAmount === amount ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  onClick={() => setBetAmount(amount)}
                  disabled={isFlying}
                  size="sm"
                >
                  ₹{amount}
                </Button>
              ))}
            </div>

            {/* Auto Cash Out */}
            <div className="space-y-2">
              <label className="text-gray-300 text-sm">Auto Cash Out (Optional)</label>
              <input
                type="number"
                value={autoCashOut || ''}
                onChange={(e) => setAutoCashOut(e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="e.g., 2.00"
                step="0.01"
                min="1.01"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                disabled={isFlying}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {!isFlying ? (
                <Button
                  onClick={startGame}
                  disabled={betAmount > parseFloat(userBalance) || betAmount < 1}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg py-3"
                >
                  Bet ₹{betAmount}
                </Button>
              ) : (
                <Button
                  onClick={() => cashOut()}
                  disabled={hasCashedOut}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg py-3"
                >
                  {hasCashedOut ? "Cashed Out!" : `Cash Out ${multiplier.toFixed(2)}x`}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Game Stats */}
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Game History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-2">
                {gameHistory.map((mult, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-center text-sm font-bold ${
                      mult >= 2.00 
                        ? 'bg-green-600 text-white' 
                        : mult >= 1.50 
                        ? 'bg-yellow-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {mult.toFixed(2)}x
                  </div>
                ))}
              </div>
              
              <div className="mt-4 space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Low Risk (1.00-1.99x):</span>
                  <span className="text-red-400">40% chance</span>
                </div>
                <div className="flex justify-between">
                  <span>Medium Risk (2.00-4.99x):</span>
                  <span className="text-yellow-400">30% chance</span>
                </div>
                <div className="flex justify-between">
                  <span>High Risk (5.00x+):</span>
                  <span className="text-green-400">30% chance</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Rules */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">How to Play Aviator</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-2">
          <p>• Place your bet before the plane takes off</p>
          <p>• Watch the multiplier increase as the plane flies higher</p>
          <p>• Cash out before the plane crashes to win your bet × multiplier</p>
          <p>• If the plane crashes before you cash out, you lose your bet</p>
          <p>• Set auto cash out to automatically collect winnings at your target multiplier</p>
          <p>• Higher multipliers mean bigger wins but higher risk of crashing</p>
          <p>• Minimum bet: ₹1 | Maximum bet: Your balance</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Aviator;