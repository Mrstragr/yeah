import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, TrendingUp, TrendingDown } from "lucide-react";

interface BigSmallProps {
  userBalance: string;
  onBet: (amount: number, gameData: any) => Promise<void>;
}

export function BigSmall({ userBalance, onBet }: BigSmallProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedBet, setSelectedBet] = useState<'big' | 'small' | 'triple'>('big');
  const [isRolling, setIsRolling] = useState(false);
  const [diceResults, setDiceResults] = useState([1, 1, 1]);
  const [lastResult, setLastResult] = useState<{won: boolean, payout: number, total: number, bet: string} | null>(null);
  const [gameHistory, setGameHistory] = useState<{bet: string, total: number, dice: number[], won: boolean}[]>([
    {bet: 'big', total: 15, dice: [5, 4, 6], won: true},
    {bet: 'small', total: 8, dice: [2, 3, 3], won: true},
    {bet: 'big', total: 9, dice: [3, 3, 3], won: false},
    {bet: 'small', total: 14, dice: [4, 5, 5], won: false},
    {bet: 'big', total: 16, dice: [6, 5, 5], won: true}
  ]);

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  const getDiceIcon = (value: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const Icon = icons[value - 1] || Dice1;
    return <Icon className="w-8 h-8" />;
  };

  const getMultiplier = () => {
    switch (selectedBet) {
      case 'big':
      case 'small':
        return 1.95; // 5% house edge
      case 'triple':
        return 150; // High risk, high reward
      default:
        return 1.95;
    }
  };

  const rollDice = async () => {
    if (isRolling || betAmount > parseFloat(userBalance)) return;

    setIsRolling(true);
    setLastResult(null);

    // Animate dice rolling
    const rollDuration = 3000;
    const rollInterval = setInterval(() => {
      setDiceResults([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      
      // Generate final result
      const finalDice = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ];
      
      setDiceResults(finalDice);
      setIsRolling(false);

      const total = finalDice.reduce((sum, die) => sum + die, 0);
      const isTriple = finalDice[0] === finalDice[1] && finalDice[1] === finalDice[2];
      
      let won = false;
      if (selectedBet === 'big' && total >= 11 && total <= 17 && !isTriple) {
        won = true;
      } else if (selectedBet === 'small' && total >= 4 && total <= 10 && !isTriple) {
        won = true;
      } else if (selectedBet === 'triple' && isTriple) {
        won = true;
      }

      const multiplier = getMultiplier();
      const payout = won ? betAmount * multiplier : 0;

      setLastResult({
        won: won,
        payout: payout,
        total: total,
        bet: selectedBet
      });

      // Add to history
      setGameHistory(prev => [{
        bet: selectedBet,
        total: total,
        dice: finalDice,
        won: won
      }, ...prev.slice(0, 4)]);

      // Place bet
      onBet(betAmount, {
        type: 'big-small',
        betAmount,
        selectedBet,
        diceResults: finalDice,
        total: total,
        won: won,
        payout: payout,
        multiplier: multiplier
      });
    }, rollDuration);
  };

  const total = diceResults.reduce((sum, die) => sum + die, 0);
  const isTriple = diceResults[0] === diceResults[1] && diceResults[1] === diceResults[2];

  return (
    <div className="space-y-6">
      {/* Game Display */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-green-600 to-blue-700 text-white">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Dice Display */}
            <div className="flex justify-center gap-4">
              {diceResults.map((die, index) => (
                <div key={index} className={`p-4 bg-white rounded-lg shadow-2xl text-gray-800 transition-transform duration-200 ${
                  isRolling ? 'animate-bounce' : ''
                }`}>
                  {getDiceIcon(die)}
                </div>
              ))}
            </div>

            {/* Total Display */}
            <div className="space-y-2">
              <div className="text-6xl font-bold text-yellow-300">
                {total}
              </div>
              
              {!isRolling && (
                <div className="space-y-2">
                  <div className="flex justify-center gap-2">
                    <Badge variant={total >= 11 && !isTriple ? 'default' : 'secondary'}>
                      BIG ({total >= 11 && !isTriple ? '✓' : '✗'})
                    </Badge>
                    <Badge variant={total <= 10 && !isTriple ? 'default' : 'secondary'}>
                      SMALL ({total <= 10 && !isTriple ? '✓' : '✗'})
                    </Badge>
                    <Badge variant={isTriple ? 'default' : 'secondary'}>
                      TRIPLE ({isTriple ? '✓' : '✗'})
                    </Badge>
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

              {isRolling && (
                <div className="text-xl font-semibold text-yellow-200 animate-pulse">
                  Rolling dice...
                </div>
              )}
            </div>
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
            {/* Bet Type Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Choose Bet Type</label>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant={selectedBet === 'big' ? 'default' : 'outline'}
                  onClick={() => setSelectedBet('big')}
                  disabled={isRolling}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>BIG (11-17)</span>
                  </div>
                  <Badge variant="secondary">1.95x</Badge>
                </Button>
                <Button
                  variant={selectedBet === 'small' ? 'default' : 'outline'}
                  onClick={() => setSelectedBet('small')}
                  disabled={isRolling}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    <span>SMALL (4-10)</span>
                  </div>
                  <Badge variant="secondary">1.95x</Badge>
                </Button>
                <Button
                  variant={selectedBet === 'triple' ? 'default' : 'outline'}
                  onClick={() => setSelectedBet('triple')}
                  disabled={isRolling}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Dice1 className="w-4 h-4" />
                    <span>TRIPLE (Any)</span>
                  </div>
                  <Badge variant="secondary">150x</Badge>
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
                <span>Selected Bet:</span>
                <span className="font-semibold uppercase">{selectedBet}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Win Chance:</span>
                <span className="font-semibold">
                  {selectedBet === 'triple' ? '2.8%' : '48.6%'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Multiplier:</span>
                <span className="font-semibold">{getMultiplier()}x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Potential Payout:</span>
                <span className="font-semibold">${(betAmount * getMultiplier()).toFixed(2)}</span>
              </div>
            </div>

            {/* Roll Button */}
            <Button 
              onClick={rollDice}
              disabled={isRolling || betAmount > parseFloat(userBalance)}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
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
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">#{gameHistory.length - index}</span>
                    <Badge variant={game.won ? 'default' : 'destructive'}>
                      {game.won ? 'Won' : 'Lost'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 uppercase">{game.bet}</span>
                    <div className="flex items-center gap-1">
                      {game.dice.map((die, i) => (
                        <div key={i} className="w-6 h-6 bg-white border rounded flex items-center justify-center text-xs">
                          {die}
                        </div>
                      ))}
                      <span className="ml-2 font-semibold">{game.total}</span>
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