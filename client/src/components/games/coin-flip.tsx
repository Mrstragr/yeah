import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CoinFlipProps {
  userBalance: string;
  onBet: (amount: number, gameData: any) => Promise<void>;
}

export function CoinFlip({ userBalance, onBet }: CoinFlipProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails" | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [gameResult, setGameResult] = useState<{
    coinResult: "heads" | "tails";
    won: boolean;
    winAmount: number;
  } | null>(null);
  const [gameHistory, setGameHistory] = useState<("heads" | "tails")[]>([]);
  const [coinRotation, setCoinRotation] = useState(0);

  const quickAmounts = [10, 50, 100, 250, 500, 1000];

  const flipCoin = async () => {
    if (!selectedSide || betAmount <= 0 || betAmount > parseFloat(userBalance)) return;

    setIsFlipping(true);
    setGameResult(null);

    // Simulate coin flip animation
    let rotations = 0;
    const flipInterval = setInterval(() => {
      rotations += 180;
      setCoinRotation(rotations);
    }, 100);

    // Determine result after 2 seconds
    setTimeout(async () => {
      clearInterval(flipInterval);
      
      const coinResult: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails";
      const won = coinResult === selectedSide;
      const winAmount = won ? betAmount * 2 : 0;

      // Final rotation to show result
      const finalRotation = coinResult === "heads" ? Math.floor(rotations / 360) * 360 : Math.floor(rotations / 360) * 360 + 180;
      setCoinRotation(finalRotation);

      setGameResult({
        coinResult,
        won,
        winAmount
      });

      // Add to history
      setGameHistory(prev => [coinResult, ...prev.slice(0, 9)]);

      // Submit bet result
      await onBet(betAmount, {
        type: 'coinflip',
        selectedSide,
        coinResult,
        win: won,
        multiplier: won ? 2 : 0
      });

      setIsFlipping(false);
      setSelectedSide(null);
    }, 2000);
  };

  const resetGame = () => {
    setGameResult(null);
    setSelectedSide(null);
    setCoinRotation(0);
  };

  return (
    <div className="space-y-6">
      {/* Professional 3D Game Display */}
      <Card className="bg-gradient-to-br from-slate-900 via-amber-900 to-yellow-900 text-white shadow-2xl border border-amber-700/50">
        <CardHeader className="bg-gradient-to-r from-amber-800/30 to-yellow-800/30 backdrop-blur-sm">
          <CardTitle className="text-center text-4xl font-black flex items-center justify-center gap-3 neon-text">
            🪙 COIN FLIP <span className="text-lg text-amber-300 font-bold">50/50 CHANCE</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          {/* Enhanced Coin Display */}
          <div className="flex justify-center items-center h-80 relative">
            {/* Particle Effects */}
            {isFlipping && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${0.5 + Math.random()}s`
                    }}
                  ></div>
                ))}
              </div>
            )}
            
            <div 
              className={`relative w-40 h-40 transition-all duration-200 transform-gpu ${
                isFlipping ? 'coin-animation scale-110' : 'scale-100'
              } drop-shadow-2xl`}
              style={{ 
                transform: `rotateY(${coinRotation}deg) scale(${isFlipping ? 1.2 : 1})`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Enhanced Heads Side */}
              <div 
                className="absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-600 border-6 border-yellow-700 flex items-center justify-center text-6xl font-bold shadow-2xl"
                style={{ 
                  backfaceVisibility: 'hidden',
                  boxShadow: '0 0 30px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.2)'
                }}
              >
                👑
              </div>
              
              {/* Enhanced Tails Side */}
              <div 
                className="absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-br from-slate-300 via-slate-500 to-slate-700 border-6 border-slate-800 flex items-center justify-center text-6xl font-bold shadow-2xl"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  boxShadow: '0 0 30px rgba(148, 163, 184, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.2)'
                }}
              >
                ⚡
              </div>
            </div>
          </div>

          {/* Game Result */}
          {gameResult && (
            <div className={`text-center p-4 rounded-lg border-2 ${
              gameResult.won 
                ? 'bg-green-500/20 border-green-500 text-green-300' 
                : 'bg-red-500/20 border-red-500 text-red-300'
            }`}>
              <div className="text-2xl font-bold mb-2">
                {gameResult.won ? '🎉 You Won!' : '💸 You Lost!'}
              </div>
              <div className="text-lg">
                Coin landed on: <span className="font-bold capitalize">{gameResult.coinResult}</span>
              </div>
              {gameResult.won && (
                <div className="text-xl font-bold text-green-400 mt-2">
                  Won ₹{gameResult.winAmount}
                </div>
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
            <CardTitle className="text-slate-900 font-bold">Place Your Bet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 bg-[#edebebbf] p-6">
            {/* Bet Amount */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-900">Bet Amount (₹)</label>
              <Input
                type="number"
                min="1"
                max={parseFloat(userBalance)}
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
                disabled={isFlipping}
                className="text-center font-bold"
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(amount)}
                  disabled={isFlipping || amount > parseFloat(userBalance)}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>

            {/* Side Selection */}
            <div>
              <label className="block text-sm font-medium mb-3 text-slate-900">Choose Side</label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={selectedSide === "heads" ? "default" : "outline"}
                  onClick={() => setSelectedSide("heads")}
                  disabled={isFlipping}
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                >
                  <span className="text-2xl">👑</span>
                  <span className="font-bold">HEADS</span>
                </Button>
                <Button
                  variant={selectedSide === "tails" ? "default" : "outline"}
                  onClick={() => setSelectedSide("tails")}
                  disabled={isFlipping}
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                >
                  <span className="text-2xl">⚡</span>
                  <span className="font-bold">TAILS</span>
                </Button>
              </div>
            </div>

            {/* Flip Button */}
            <Button
              onClick={flipCoin}
              disabled={!selectedSide || isFlipping || betAmount > parseFloat(userBalance)}
              className="casino-button w-full h-12 text-lg"
            >
              {isFlipping ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Flipping...
                </div>
              ) : (
                `🪙 FLIP COIN - BET ₹${betAmount}`
              )}
            </Button>

            {gameResult && (
              <Button
                onClick={resetGame}
                variant="outline"
                className="w-full"
              >
                Play Again
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Statistics and History */}
        <Card>
          <CardHeader className="bg-[#dededeed]">
            <CardTitle className="text-slate-900 font-bold">Game History & Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 bg-[#edebebbf] p-6">
            {/* Current Balance */}
            <div className="p-3 bg-slate-100 rounded-lg border">
              <div className="text-sm text-slate-700 font-medium">Your Balance</div>
              <div className="text-xl font-bold text-slate-900">₹{userBalance}</div>
            </div>

            {/* Potential Win */}
            {selectedSide && !gameResult && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-700 font-medium">Potential Win</div>
                <div className="text-xl font-bold text-green-800">₹{betAmount * 2}</div>
              </div>
            )}

            {/* Recent Results */}
            <div>
              <h4 className="font-medium mb-3 text-slate-900">Recent Results</h4>
              <div className="grid grid-cols-5 gap-2">
                {gameHistory.slice(0, 10).map((result, index) => (
                  <div 
                    key={index}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg ${
                      result === "heads" 
                        ? 'bg-yellow-50 border-yellow-500 text-yellow-800' 
                        : 'bg-slate-50 border-slate-500 text-slate-800'
                    }`}
                  >
                    {result === "heads" ? "👑" : "⚡"}
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            {gameHistory.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-slate-900">Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-700 font-medium">Heads</div>
                    <div className="font-bold text-slate-900">
                      {gameHistory.filter(r => r === "heads").length} 
                      <span className="text-slate-600 ml-1">
                        ({Math.round((gameHistory.filter(r => r === "heads").length / gameHistory.length) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-700 font-medium">Tails</div>
                    <div className="font-bold text-slate-900">
                      {gameHistory.filter(r => r === "tails").length}
                      <span className="text-slate-600 ml-1">
                        ({Math.round((gameHistory.filter(r => r === "tails").length / gameHistory.length) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}