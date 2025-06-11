import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DiceRollProps {
  userBalance: string;
  onBet: (amount: number, gameData: any) => Promise<void>;
}

export function DiceRoll({ userBalance, onBet }: DiceRollProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [betType, setBetType] = useState<"numbers" | "range">("numbers");
  const [selectedRange, setSelectedRange] = useState<"low" | "high" | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<{
    won: boolean;
    winAmount: number;
    multiplier: number;
  } | null>(null);
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [animatingDice, setAnimatingDice] = useState<number[]>([1, 2, 3, 4, 5, 6]);

  const quickAmounts = [10, 50, 100, 250, 500, 1000];
  const diceNumbers = [1, 2, 3, 4, 5, 6];

  const toggleNumber = (num: number) => {
    if (betType !== "numbers") return;
    
    setSelectedNumbers(prev => 
      prev.includes(num) 
        ? prev.filter(n => n !== num)
        : [...prev, num]
    );
  };

  const calculatePayout = () => {
    if (betType === "numbers") {
      // Payout based on number of selected numbers
      const multipliers: Record<number, number> = {
        1: 6,    // 1 number = 6x
        2: 3,    // 2 numbers = 3x
        3: 2,    // 3 numbers = 2x
        4: 1.5,  // 4 numbers = 1.5x
        5: 1.2,  // 5 numbers = 1.2x
        6: 1.1   // 6 numbers = 1.1x
      };
      return multipliers[selectedNumbers.length] || 0;
    } else {
      return 2; // Range bets pay 2x (50/50 chance)
    }
  };

  const rollDice = async () => {
    if (betAmount <= 0 || betAmount > parseFloat(userBalance)) return;
    if (betType === "numbers" && selectedNumbers.length === 0) return;
    if (betType === "range" && !selectedRange) return;

    setIsRolling(true);
    setGameResult(null);
    setDiceResult(null);

    // Animate dice rolling
    const rollInterval = setInterval(() => {
      setAnimatingDice(prev => prev.map(() => Math.floor(Math.random() * 6) + 1));
    }, 100);

    // Determine result after 2 seconds
    setTimeout(async () => {
      clearInterval(rollInterval);
      
      const result = Math.floor(Math.random() * 6) + 1;
      setDiceResult(result);
      setAnimatingDice([result]);

      let won = false;
      if (betType === "numbers") {
        won = selectedNumbers.includes(result);
      } else {
        won = (selectedRange === "low" && result <= 3) || (selectedRange === "high" && result >= 4);
      }

      const multiplier = won ? calculatePayout() : 0;
      const winAmount = won ? betAmount * multiplier : 0;

      setGameResult({
        won,
        winAmount,
        multiplier
      });

      // Add to history
      setGameHistory(prev => [result, ...prev.slice(0, 9)]);

      // Submit bet result
      await onBet(betAmount, {
        type: 'dice',
        betType,
        selectedNumbers: betType === "numbers" ? selectedNumbers : [],
        selectedRange: betType === "range" ? selectedRange : null,
        diceResult: result,
        win: won,
        multiplier: multiplier
      });

      setIsRolling(false);
      
      // Reset selections after 3 seconds
      setTimeout(() => {
        setSelectedNumbers([]);
        setSelectedRange(null);
        setGameResult(null);
      }, 3000);
    }, 2000);
  };

  const getDiceEmoji = (number: number) => {
    const emojiMap: Record<number, string> = {
      1: "⚀", 2: "⚁", 3: "⚂", 4: "⚃", 5: "⚄", 6: "⚅"
    };
    return emojiMap[number] || "🎲";
  };

  return (
    <div className="space-y-6">
      {/* Professional 3D Game Display */}
      <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white shadow-2xl border border-purple-700/50">
        <CardHeader className="bg-gradient-to-r from-purple-800/30 to-indigo-800/30 backdrop-blur-sm">
          <CardTitle className="text-center text-4xl font-black flex items-center justify-center gap-3 neon-text">
            🎲 DICE ROLL <span className="text-lg text-purple-300 font-bold">PREDICT THE NUMBER</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          {/* Enhanced 3D Dice Display */}
          <div className="flex justify-center items-center h-48 relative">
            {/* Particle Effects */}
            {isRolling && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-purple-400 rounded-full animate-ping"
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
            
            <div className="relative">
              <div 
                className={`text-9xl transition-all duration-300 transform-gpu drop-shadow-2xl ${
                  isRolling ? 'animate-bounce scale-125' : 'scale-100'
                } filter brightness-125`}
                style={{
                  textShadow: '0 0 20px rgba(147, 51, 234, 0.8)',
                  transform: isRolling ? 'scale(1.3) rotateX(360deg)' : 'scale(1)'
                }}
              >
                {isRolling ? 
                  getDiceEmoji(animatingDice[0]) : 
                  (diceResult ? getDiceEmoji(diceResult) : "🎲")
                }
              </div>
              
              {/* Glow Effect */}
              <div className={`absolute inset-0 ${isRolling ? 'animate-pulse' : ''}`}>
                <div className="w-24 h-24 bg-purple-500/20 rounded-full blur-xl mx-auto mt-8"></div>
              </div>
            </div>
          </div>

          {/* Game Result */}
          {gameResult && diceResult && (
            <div className={`text-center p-4 rounded-lg border-2 ${
              gameResult.won 
                ? 'bg-green-500/20 border-green-500 text-green-300' 
                : 'bg-red-500/20 border-red-500 text-red-300'
            }`}>
              <div className="text-2xl font-bold mb-2">
                {gameResult.won ? '🎉 You Won!' : '💸 You Lost!'}
              </div>
              <div className="text-lg">
                Dice rolled: <span className="font-bold text-3xl">{getDiceEmoji(diceResult)} {diceResult}</span>
              </div>
              {gameResult.won && (
                <div className="text-xl font-bold text-green-400 mt-2">
                  Won ₹{gameResult.winAmount.toFixed(2)} ({gameResult.multiplier}x)
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                disabled={isRolling}
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
                  disabled={isRolling || amount > parseFloat(userBalance)}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>

            {/* Bet Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-3 text-slate-900">Bet Type</label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={betType === "numbers" ? "default" : "outline"}
                  onClick={() => {
                    setBetType("numbers");
                    setSelectedRange(null);
                  }}
                  disabled={isRolling}
                >
                  Specific Numbers
                </Button>
                <Button
                  variant={betType === "range" ? "default" : "outline"}
                  onClick={() => {
                    setBetType("range");
                    setSelectedNumbers([]);
                  }}
                  disabled={isRolling}
                >
                  High/Low
                </Button>
              </div>
            </div>

            {/* Number Selection */}
            {betType === "numbers" && (
              <div>
                <label className="block text-sm font-medium mb-3 text-slate-900">
                  Select Numbers ({selectedNumbers.length}/6)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {diceNumbers.map(num => (
                    <Button
                      key={num}
                      variant={selectedNumbers.includes(num) ? "default" : "outline"}
                      onClick={() => toggleNumber(num)}
                      disabled={isRolling}
                      className="h-16 flex flex-col items-center justify-center"
                    >
                      <span className="text-2xl">{getDiceEmoji(num)}</span>
                      <span className="font-bold">{num}</span>
                    </Button>
                  ))}
                </div>
                {selectedNumbers.length > 0 && (
                  <div className="text-sm text-gray-600 mt-2">
                    Payout: {calculatePayout()}x multiplier
                  </div>
                )}
              </div>
            )}

            {/* Range Selection */}
            {betType === "range" && (
              <div>
                <label className="block text-sm font-medium mb-3 text-slate-900">Select Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={selectedRange === "low" ? "default" : "outline"}
                    onClick={() => setSelectedRange("low")}
                    disabled={isRolling}
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    <span className="text-lg font-bold">LOW</span>
                    <span className="text-sm">1, 2, 3</span>
                    <span className="text-xs text-gray-500">2x payout</span>
                  </Button>
                  <Button
                    variant={selectedRange === "high" ? "default" : "outline"}
                    onClick={() => setSelectedRange("high")}
                    disabled={isRolling}
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    <span className="text-lg font-bold">HIGH</span>
                    <span className="text-sm">4, 5, 6</span>
                    <span className="text-xs text-gray-500">2x payout</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Roll Button */}
            <Button
              onClick={rollDice}
              disabled={
                isRolling || 
                betAmount > parseFloat(userBalance) ||
                (betType === "numbers" && selectedNumbers.length === 0) ||
                (betType === "range" && !selectedRange)
              }
              className="casino-button w-full h-12 text-lg"
            >
              {isRolling ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Rolling...
                </div>
              ) : (
                `🎲 ROLL DICE - BET ₹${betAmount}`
              )}
            </Button>
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
            {((betType === "numbers" && selectedNumbers.length > 0) || 
              (betType === "range" && selectedRange)) && !gameResult && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-700 font-medium">Potential Win</div>
                <div className="text-xl font-bold text-green-800">
                  ₹{(betAmount * calculatePayout()).toFixed(2)}
                </div>
                <div className="text-xs text-green-700 font-medium">
                  {calculatePayout()}x multiplier
                </div>
              </div>
            )}

            {/* Recent Results */}
            <div>
              <h4 className="font-medium mb-3 text-slate-900">Recent Results</h4>
              <div className="grid grid-cols-5 gap-2">
                {gameHistory.slice(0, 10).map((result, index) => (
                  <div 
                    key={index}
                    className="w-12 h-12 rounded-lg border-2 border-slate-300 flex items-center justify-center text-2xl bg-white shadow-sm"
                  >
                    {getDiceEmoji(result)}
                  </div>
                ))}
              </div>
            </div>

            {/* Number Frequency */}
            {gameHistory.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-slate-900">Number Frequency</h4>
                <div className="grid grid-cols-6 gap-1 text-xs">
                  {diceNumbers.map(num => {
                    const count = gameHistory.filter(r => r === num).length;
                    const percentage = gameHistory.length > 0 ? Math.round((count / gameHistory.length) * 100) : 0;
                    return (
                      <div key={num} className="text-center p-2 bg-slate-50 rounded border">
                        <div className="text-lg">{getDiceEmoji(num)}</div>
                        <div className="font-bold text-slate-900">{count}</div>
                        <div className="text-slate-600">{percentage}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Betting Tips */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Tips</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div>• Fewer numbers = Higher payout</div>
                <div>• High/Low bets pay 2x (50% chance)</div>
                <div>• Single number pays 6x (16.67% chance)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}