import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Coins, Crown, DollarSign } from "lucide-react";

interface CoinFlipProps {
  userBalance: string;
  onBet: (amount: number, gameData: any) => Promise<void>;
}

export function CoinFlip({ userBalance, onBet }: CoinFlipProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails'>('heads');
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [lastResult, setLastResult] = useState<{side: string, won: boolean, payout: number} | null>(null);
  const [gameHistory, setGameHistory] = useState<{side: string, result: string, won: boolean}[]>([
    {side: 'heads', result: 'tails', won: false},
    {side: 'tails', result: 'tails', won: true},
    {side: 'heads', result: 'heads', won: true},
    {side: 'tails', result: 'heads', won: false},
    {side: 'heads', result: 'tails', won: false}
  ]);
  const [coinRotation, setCoinRotation] = useState(0);

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  const flipCoin = async () => {
    if (isFlipping || betAmount > parseFloat(userBalance)) return;

    setIsFlipping(true);
    setResult(null);
    setLastResult(null);

    // Animate coin flip
    const flipDuration = 2000;
    const flipInterval = setInterval(() => {
      setCoinRotation(prev => prev + 180);
    }, 100);

    // Determine result
    const flipResult = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = selectedSide === flipResult;
    const payout = won ? betAmount * 1.95 : 0; // 1.95x multiplier (5% house edge)

    setTimeout(() => {
      clearInterval(flipInterval);
      setResult(flipResult);
      setIsFlipping(false);
      
      setLastResult({
        side: selectedSide,
        won: won,
        payout: payout
      });

      // Add to history
      setGameHistory(prev => [{
        side: selectedSide,
        result: flipResult,
        won: won
      }, ...prev.slice(0, 4)]);

      // Place bet
      onBet(betAmount, {
        type: 'coin-flip',
        betAmount,
        selectedSide,
        result: flipResult,
        won: won,
        payout: payout
      });
    }, flipDuration);
  };

  return (
    <div className="space-y-6">
      {/* Game Display */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-600 to-orange-700 text-white">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Coin Animation */}
            <div className="relative mx-auto w-32 h-32 perspective-1000">
              <div 
                className={`relative w-full h-full transition-transform duration-100 transform-style-preserve-3d ${
                  isFlipping ? 'animate-pulse' : ''
                }`}
                style={{ transform: `rotateY(${coinRotation}deg)` }}
              >
                {/* Heads Side */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-4 border-yellow-300 shadow-2xl">
                    <Crown className="w-16 h-16 text-yellow-900" />
                  </div>
                </div>
                
                {/* Tails Side */}
                <div className="absolute inset-0 w-full h-full backface-hidden transform rotateY-180">
                  <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center border-4 border-gray-300 shadow-2xl">
                    <DollarSign className="w-16 h-16 text-gray-900" />
                  </div>
                </div>
              </div>
            </div>

            {/* Result Display */}
            {!isFlipping && result && (
              <div className="space-y-2">
                <Badge variant={result === 'heads' ? 'default' : 'secondary'} className="text-lg px-4 py-2">
                  Result: {result.toUpperCase()}
                </Badge>
                {lastResult && (
                  <div className={`text-lg font-semibold ${
                    lastResult.won ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {lastResult.won ? 
                      `Won $${lastResult.payout.toFixed(2)}!` : 
                      `Lost $${betAmount}`
                    }
                  </div>
                )}
              </div>
            )}

            {isFlipping && (
              <div className="text-xl font-semibold text-yellow-200 animate-pulse">
                Flipping...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Betting Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Place Your Bet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Side Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Choose Side</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedSide === 'heads' ? 'default' : 'outline'}
                  onClick={() => setSelectedSide('heads')}
                  disabled={isFlipping}
                  className="flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  Heads
                </Button>
                <Button
                  variant={selectedSide === 'tails' ? 'default' : 'outline'}
                  onClick={() => setSelectedSide('tails')}
                  disabled={isFlipping}
                  className="flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  Tails
                </Button>
              </div>
            </div>

            {/* Bet Amount */}
            <div>
              <label className="text-sm font-medium mb-2 block">Bet Amount</label>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min="10"
                max={parseFloat(userBalance)}
                disabled={isFlipping}
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
                  ${amount}
                </Button>
              ))}
            </div>

            {/* Potential Payout */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Potential Payout:</span>
                <span className="font-semibold">${(betAmount * 1.95).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Multiplier:</span>
                <span>1.95x</span>
              </div>
            </div>

            {/* Flip Button */}
            <Button 
              onClick={flipCoin}
              disabled={isFlipping || betAmount > parseFloat(userBalance)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              <Coins className="w-4 h-4 mr-2" />
              {isFlipping ? 'Flipping...' : `Flip Coin - $${betAmount}`}
            </Button>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Game History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gameHistory.map((game, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">#{gameHistory.length - index}</span>
                    <Badge variant="outline" className="text-xs">
                      {game.side}
                    </Badge>
                    <span className="text-sm">→</span>
                    <Badge variant={game.result === 'heads' ? 'default' : 'secondary'} className="text-xs">
                      {game.result}
                    </Badge>
                  </div>
                  <Badge variant={game.won ? 'default' : 'destructive'}>
                    {game.won ? 'Won' : 'Lost'}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Statistics Summary */}
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-green-600">
                    {gameHistory.filter(g => g.won).length}
                  </div>
                  <div className="text-gray-500">Wins</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-red-600">
                    {gameHistory.filter(g => !g.won).length}
                  </div>
                  <div className="text-gray-500">Losses</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}