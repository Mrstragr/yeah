import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

interface DiceRollProps {
  userBalance: string;
  onBet: (amount: number, gameData: any) => Promise<void>;
}

export function DiceRoll({ userBalance, onBet }: DiceRollProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [prediction, setPrediction] = useState<'under' | 'over'>('under');
  const [targetNumber, setTargetNumber] = useState(50);
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<{won: boolean, payout: number, roll: number} | null>(null);
  const [gameHistory, setGameHistory] = useState<{prediction: string, target: number, roll: number, won: boolean}[]>([
    {prediction: 'under', target: 50, roll: 23, won: true},
    {prediction: 'over', target: 70, roll: 89, won: true},
    {prediction: 'under', target: 30, roll: 45, won: false},
    {prediction: 'over', target: 60, roll: 12, won: false},
    {prediction: 'under', target: 40, roll: 37, won: true}
  ]);
  const [animatingDice, setAnimatingDice] = useState([1, 1]);

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  const getDiceIcon = (value: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const Icon = icons[value - 1] || Dice1;
    return <Icon className="w-12 h-12" />;
  };

  const calculateMultiplier = () => {
    if (prediction === 'under') {
      return (99 / targetNumber) * 0.95; // 5% house edge
    } else {
      return (99 / (99 - targetNumber)) * 0.95; // 5% house edge
    }
  };

  const rollDice = async () => {
    if (isRolling || betAmount > parseFloat(userBalance)) return;

    setIsRolling(true);
    setDiceResult(null);
    setLastResult(null);

    // Animate dice rolling
    const rollDuration = 2000;
    const rollInterval = setInterval(() => {
      setAnimatingDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
    }, 100);

    // Generate result (1-99)
    const result = Math.floor(Math.random() * 99) + 1;
    
    setTimeout(() => {
      clearInterval(rollInterval);
      
      // Convert to dice display (simulate two dice for visual appeal)
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      setAnimatingDice([dice1, dice2]);
      
      setDiceResult(result);
      setIsRolling(false);

      // Check win condition
      const won = prediction === 'under' ? result < targetNumber : result > targetNumber;
      const multiplier = calculateMultiplier();
      const payout = won ? betAmount * multiplier : 0;

      setLastResult({
        won: won,
        payout: payout,
        roll: result
      });

      // Add to history
      setGameHistory(prev => [{
        prediction: prediction,
        target: targetNumber,
        roll: result,
        won: won
      }, ...prev.slice(0, 4)]);

      // Place bet
      onBet(betAmount, {
        type: 'dice-roll',
        betAmount,
        prediction,
        targetNumber,
        result: result,
        won: won,
        payout: payout,
        multiplier: multiplier
      });
    }, rollDuration);
  };

  return (
    <div className="space-y-6">
      {/* Game Display */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-red-600 to-purple-700 text-white">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Dice Animation */}
            <div className="flex justify-center gap-4">
              <div className={`p-4 bg-white rounded-lg shadow-2xl text-gray-800 transition-transform duration-200 ${
                isRolling ? 'animate-bounce' : ''
              }`}>
                {getDiceIcon(animatingDice[0])}
              </div>
              <div className={`p-4 bg-white rounded-lg shadow-2xl text-gray-800 transition-transform duration-200 ${
                isRolling ? 'animate-bounce' : ''
              }`}>
                {getDiceIcon(animatingDice[1])}
              </div>
            </div>

            {/* Result Display */}
            {!isRolling && diceResult !== null && (
              <div className="space-y-4">
                <div className="text-6xl font-bold text-yellow-300">
                  {diceResult}
                </div>
                <Badge variant={lastResult?.won ? 'default' : 'destructive'} className="text-lg px-4 py-2">
                  {prediction.toUpperCase()} {targetNumber} - {lastResult?.won ? 'WIN' : 'LOSE'}
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

            {isRolling && (
              <div className="text-xl font-semibold text-yellow-200 animate-pulse">
                Rolling...
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
            {/* Prediction Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Prediction</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={prediction === 'under' ? 'default' : 'outline'}
                  onClick={() => setPrediction('under')}
                  disabled={isRolling}
                >
                  Under {targetNumber}
                </Button>
                <Button
                  variant={prediction === 'over' ? 'default' : 'outline'}
                  onClick={() => setPrediction('over')}
                  disabled={isRolling}
                >
                  Over {targetNumber}
                </Button>
              </div>
            </div>

            {/* Target Number */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Target Number: {targetNumber}
              </label>
              <input
                type="range"
                min="2"
                max="98"
                value={targetNumber}
                onChange={(e) => setTargetNumber(Number(e.target.value))}
                disabled={isRolling}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2</span>
                <span>50</span>
                <span>98</span>
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
                disabled={isRolling}
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
                  ${amount}
                </Button>
              ))}
            </div>

            {/* Payout Information */}
            <div className="p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Win Chance:</span>
                <span className="font-semibold">
                  {prediction === 'under' ? 
                    `${((targetNumber - 1) / 99 * 100).toFixed(1)}%` : 
                    `${((99 - targetNumber) / 99 * 100).toFixed(1)}%`
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Multiplier:</span>
                <span className="font-semibold">{calculateMultiplier().toFixed(2)}x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Potential Payout:</span>
                <span className="font-semibold">${(betAmount * calculateMultiplier()).toFixed(2)}</span>
              </div>
            </div>

            {/* Roll Button */}
            <Button 
              onClick={rollDice}
              disabled={isRolling || betAmount > parseFloat(userBalance)}
              className="w-full bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600"
            >
              {isRolling ? 'Rolling...' : `Roll Dice - $${betAmount}`}
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
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      #{gameHistory.length - index}
                    </div>
                    <div className="text-xs text-gray-600">
                      {game.prediction} {game.target} → {game.roll}
                    </div>
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