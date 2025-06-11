import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Circle, Play, RotateCcw } from "lucide-react";

interface BallNumberProps {
  userBalance: string;
  onBet: (amount: number, gameData: any) => Promise<void>;
}

export function BallNumber({ userBalance, onBet }: BallNumberProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [drawnNumber, setDrawnNumber] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<{won: boolean, payout: number, number: number} | null>(null);
  const [gameHistory, setGameHistory] = useState<{numbers: number[], drawn: number, won: boolean}[]>([
    {numbers: [7, 14, 21], drawn: 14, won: true},
    {numbers: [3, 8, 15], drawn: 22, won: false},
    {numbers: [1, 12, 25], drawn: 25, won: true},
    {numbers: [5, 18, 30], drawn: 9, won: false},
    {numbers: [2, 19, 28], drawn: 19, won: true}
  ]);
  const [ballAnimation, setBallAnimation] = useState<number[]>([]);

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];
  const maxSelections = 5;

  const toggleNumber = (number: number) => {
    if (isSpinning) return;
    
    setSelectedNumbers(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      } else if (prev.length < maxSelections) {
        return [...prev, number].sort((a, b) => a - b);
      }
      return prev;
    });
  };

  const clearSelections = () => {
    if (!isSpinning) {
      setSelectedNumbers([]);
    }
  };

  const quickPick = () => {
    if (isSpinning) return;
    
    const numbers: number[] = [];
    while (numbers.length < 3) {
      const num = Math.floor(Math.random() * 36) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    setSelectedNumbers(numbers.sort((a, b) => a - b));
  };

  const getMultiplier = () => {
    switch (selectedNumbers.length) {
      case 1: return 35; // Single number bet
      case 2: return 17; // Two numbers
      case 3: return 11; // Three numbers
      case 4: return 8;  // Four numbers
      case 5: return 6;  // Five numbers
      default: return 0;
    }
  };

  const spinBall = async () => {
    if (isSpinning || selectedNumbers.length === 0 || betAmount > parseFloat(userBalance)) return;

    setIsSpinning(true);
    setLastResult(null);
    setDrawnNumber(null);

    // Animate ball spinning
    const spinDuration = 3000;
    const animationInterval = setInterval(() => {
      setBallAnimation(Array.from({length: 5}, () => Math.floor(Math.random() * 36) + 1));
    }, 100);

    setTimeout(() => {
      clearInterval(animationInterval);
      
      // Generate final result (1-36)
      const finalNumber = Math.floor(Math.random() * 36) + 1;
      setDrawnNumber(finalNumber);
      setIsSpinning(false);

      // Check win condition
      const won = selectedNumbers.includes(finalNumber);
      const multiplier = getMultiplier();
      const payout = won ? betAmount * multiplier * 0.95 : 0; // 5% house edge

      setLastResult({
        won: won,
        payout: payout,
        number: finalNumber
      });

      // Add to history
      setGameHistory(prev => [{
        numbers: [...selectedNumbers],
        drawn: finalNumber,
        won: won
      }, ...prev.slice(0, 4)]);

      // Place bet
      onBet(betAmount, {
        type: 'ball-number',
        betAmount,
        selectedNumbers: [...selectedNumbers],
        drawnNumber: finalNumber,
        won: won,
        payout: payout,
        multiplier: multiplier
      });
    }, spinDuration);
  };

  const getNumberColor = (number: number) => {
    if (number === 0) return 'bg-green-500';
    if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(number)) {
      return 'bg-red-500';
    }
    return 'bg-black';
  };

  return (
    <div className="space-y-6">
      {/* Professional 3D Game Display */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white shadow-2xl border border-orange-700/50">
        <CardHeader className="bg-gradient-to-r from-orange-800/30 to-red-800/30 backdrop-blur-sm">
          <CardTitle className="text-center text-4xl font-black flex items-center justify-center gap-3 neon-text">
            🎱 BALL NUMBER <span className="text-lg text-orange-300 font-bold">LUCKY NUMBERS</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center space-y-8">
            {/* Enhanced 3D Ball Display */}
            <div className="flex justify-center items-center h-48 relative">
              {/* Particle Effects */}
              {isSpinning && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-orange-400 rounded-full animate-ping"
                      style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${0.3 + Math.random()}s`
                      }}
                    ></div>
                  ))}
                </div>
              )}
              
              <div 
                className={`w-32 h-32 rounded-full border-6 border-white shadow-2xl flex items-center justify-center text-4xl font-black transition-all duration-300 transform-gpu ${
                  isSpinning ? 'animate-spin bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 scale-125' : 'bg-gradient-to-br from-white to-gray-100 text-gray-900 scale-100'
                } drop-shadow-2xl`}
                style={{
                  boxShadow: isSpinning 
                    ? '0 20px 40px rgba(255, 165, 0, 0.6), inset 0 5px 15px rgba(255, 255, 255, 0.3)' 
                    : '0 15px 30px rgba(0,0,0,0.4), inset 0 5px 15px rgba(255, 255, 255, 0.3)',
                  transform: isSpinning ? 'scale(1.3) rotateZ(720deg)' : 'scale(1)'
                }}
              >
                {isSpinning ? (
                  <div className="animate-pulse text-white font-black">🎯</div>
                ) : (
                  drawnNumber || '?'
                )}
              </div>
            </div>

            {/* Result Display */}
            {!isSpinning && drawnNumber !== null && (
              <div className="space-y-4">
                <div className="text-4xl font-bold text-yellow-300">
                  Ball: {drawnNumber}
                </div>
                
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

            {isSpinning && (
              <div className="text-xl font-semibold text-yellow-200 animate-pulse">
                Spinning ball...
              </div>
            )}

            {/* Selected Numbers Display */}
            {selectedNumbers.length > 0 && (
              <div className="flex justify-center gap-2 flex-wrap">
                <span className="text-sm text-gray-200">Selected:</span>
                {selectedNumbers.map(num => (
                  <Badge key={num} variant="secondary" className="text-white bg-white/20">
                    {num}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Number Selection Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Select Numbers (Max {maxSelections})</span>
            <div className="space-x-2">
              <Button size="sm" variant="outline" onClick={quickPick} disabled={isSpinning}>
                Quick Pick
              </Button>
              <Button size="sm" variant="outline" onClick={clearSelections} disabled={isSpinning}>
                Clear
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({length: 36}, (_, i) => i + 1).map(number => (
              <Button
                key={number}
                variant={selectedNumbers.includes(number) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleNumber(number)}
                disabled={isSpinning || (selectedNumbers.length >= maxSelections && !selectedNumbers.includes(number))}
                className={`h-10 w-10 p-0 text-white ${getNumberColor(number)} ${
                  selectedNumbers.includes(number) ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                {number}
              </Button>
            ))}
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
            {/* Bet Amount */}
            <div>
              <label className="text-sm font-medium mb-2 block">Bet Amount</label>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min="10"
                max={parseFloat(userBalance)}
                disabled={isSpinning}
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
                  disabled={isSpinning || amount > parseFloat(userBalance)}
                >
                  ${amount}
                </Button>
              ))}
            </div>

            {/* Payout Information */}
            {selectedNumbers.length > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Numbers Selected:</span>
                  <span className="font-semibold">{selectedNumbers.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Win Chance:</span>
                  <span className="font-semibold">
                    {((selectedNumbers.length / 36) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Multiplier:</span>
                  <span className="font-semibold">{getMultiplier()}x</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Potential Payout:</span>
                  <span className="font-semibold">${(betAmount * getMultiplier() * 0.95).toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Spin Button */}
            <Button 
              onClick={spinBall}
              disabled={isSpinning || selectedNumbers.length === 0 || betAmount > parseFloat(userBalance)}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Play className="w-4 h-4 mr-2" />
              {isSpinning ? 'Spinning...' : `Spin Ball - $${betAmount}`}
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
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">#{gameHistory.length - index}</span>
                    <Badge variant={game.won ? 'default' : 'destructive'}>
                      {game.won ? 'Won' : 'Lost'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex gap-1">
                      {game.numbers.map(num => (
                        <span key={num} className="px-1 py-0.5 bg-gray-200 rounded text-xs">
                          {num}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>→</span>
                      <span className={`px-2 py-1 rounded text-white text-xs ${getNumberColor(game.drawn)}`}>
                        {game.drawn}
                      </span>
                    </div>
                  </div>
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