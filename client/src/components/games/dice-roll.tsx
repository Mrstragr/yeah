import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DiceRollProps {
  userBalance: string;
  onBet: (amount: number, gameData: any) => Promise<void>;
}

export function DiceRoll({ userBalance, onBet }: DiceRollProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedBet, setSelectedBet] = useState<'big' | 'small' | number | null>(null);
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [lastResult, setLastResult] = useState<{total: number, win: boolean, payout: number} | null>(null);

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  const rollDice = async () => {
    if (!selectedBet || isRolling) return;

    setIsRolling(true);
    setLastResult(null);

    // Animate dice rolling
    const rollInterval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
    }, 100);

    setTimeout(async () => {
      clearInterval(rollInterval);
      
      // Final dice values
      const finalDice1 = Math.floor(Math.random() * 6) + 1;
      const finalDice2 = Math.floor(Math.random() * 6) + 1;
      const total = finalDice1 + finalDice2;

      setDice1(finalDice1);
      setDice2(finalDice2);

      // Determine win/loss
      let isWin = false;
      let payout = 0;

      if (selectedBet === 'big' && total >= 8) {
        isWin = true;
        payout = betAmount * 1.95; // 1.95x payout for big/small
      } else if (selectedBet === 'small' && total <= 6) {
        isWin = true;
        payout = betAmount * 1.95;
      } else if (typeof selectedBet === 'number' && selectedBet === total) {
        isWin = true;
        payout = betAmount * 8; // 8x payout for exact number
      }

      setLastResult({ total, win: isWin, payout });

      // Place bet through parent component
      await onBet(isWin ? payout - betAmount : -betAmount, {
        gameType: 'dice-roll',
        bet: selectedBet,
        dice1: finalDice1,
        dice2: finalDice2,
        total,
        win: isWin
      });

      setIsRolling(false);
    }, 2000);
  };

  const DiceDisplay = ({ value }: { value: number }) => {
    const dotPositions: number[][][] = [
      [], // 0 (not used)
      [[50, 50]], // 1
      [[25, 25], [75, 75]], // 2
      [[25, 25], [50, 50], [75, 75]], // 3
      [[25, 25], [75, 25], [25, 75], [75, 75]], // 4
      [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]], // 5
      [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]] // 6
    ];

    const dots = dotPositions[value]?.map((pos, i) => (
      <div
        key={i}
        className="absolute w-3 h-3 bg-red-600 rounded-full"
        style={{ left: `${pos[0]}%`, top: `${pos[1]}%`, transform: 'translate(-50%, -50%)' }}
      />
    )) || [];

    return (
      <div className={`relative w-16 h-16 bg-white border-2 border-gray-300 rounded-lg ${isRolling ? 'animate-bounce' : ''}`}>
        {dots}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">🎲 Dice Roll</h1>
        <p className="text-gray-300">Roll two dice and predict the outcome</p>
        <div className="mt-2">
          <Badge variant="secondary" className="bg-green-600 text-white">
            Balance: ₹{parseFloat(userBalance).toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* Dice Display */}
      <Card className="bg-gradient-to-br from-purple-900 to-blue-900 border-purple-600">
        <CardContent className="p-8">
          <div className="flex justify-center items-center space-x-8">
            <DiceDisplay value={dice1} />
            <div className="text-4xl text-white font-bold">+</div>
            <DiceDisplay value={dice2} />
            <div className="text-4xl text-white font-bold">=</div>
            <div className="text-5xl font-bold text-yellow-400">
              {dice1 + dice2}
            </div>
          </div>
          
          {lastResult && (
            <div className="mt-6 text-center">
              <div className={`text-2xl font-bold ${lastResult.win ? 'text-green-400' : 'text-red-400'}`}>
                {lastResult.win ? `🎉 You Won ₹${lastResult.payout.toFixed(2)}!` : `❌ You Lost ₹${betAmount}`}
              </div>
              <div className="text-gray-300 mt-2">
                Total: {lastResult.total} ({lastResult.total >= 8 ? 'BIG' : lastResult.total <= 6 ? 'SMALL' : 'NEUTRAL'})
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Betting Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Big/Small Bets */}
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Big/Small Bets (1.95x)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={selectedBet === 'big' ? 'default' : 'outline'}
                className={`h-16 text-lg ${selectedBet === 'big' ? 'bg-red-600 hover:bg-red-700' : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'}`}
                onClick={() => setSelectedBet('big')}
              >
                BIG<br/>
                <span className="text-sm">(8-12)</span>
              </Button>
              <Button
                variant={selectedBet === 'small' ? 'default' : 'outline'}
                className={`h-16 text-lg ${selectedBet === 'small' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                onClick={() => setSelectedBet('small')}
              >
                SMALL<br/>
                <span className="text-sm">(2-6)</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Exact Number Bets */}
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Exact Total (8x)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-2">
              {[2,3,4,5,6,7,8,9,10,11,12].map(num => (
                <Button
                  key={num}
                  variant={selectedBet === num ? 'default' : 'outline'}
                  className={`h-12 ${selectedBet === num ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white'}`}
                  onClick={() => setSelectedBet(num)}
                >
                  {num}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bet Amount */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Bet Amount</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {quickAmounts.map(amount => (
              <Button
                key={amount}
                variant={betAmount === amount ? 'default' : 'outline'}
                className={betAmount === amount ? 'bg-green-600 hover:bg-green-700' : ''}
                onClick={() => setBetAmount(amount)}
              >
                ₹{amount}
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              min="1"
              max={parseFloat(userBalance)}
            />
            <Button
              onClick={rollDice}
              disabled={!selectedBet || isRolling || betAmount > parseFloat(userBalance)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg"
            >
              {isRolling ? 'Rolling...' : 'Roll Dice'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Game Rules */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Game Rules</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-2">
          <p>• <strong>BIG:</strong> Total 8-12 (Payout: 1.95x)</p>
          <p>• <strong>SMALL:</strong> Total 2-6 (Payout: 1.95x)</p>
          <p>• <strong>Exact Number:</strong> Predict exact total (Payout: 8x)</p>
          <p>• Minimum bet: ₹1 | Maximum bet: Your balance</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default DiceRoll;