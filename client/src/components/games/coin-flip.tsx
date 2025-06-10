import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CoinFlipProps {
  userBalance: string;
  onBet: (amount: number, gameData: any) => Promise<void>;
}

export function CoinFlip({ userBalance, onBet }: CoinFlipProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<'heads' | 'tails'>('heads');
  const [lastResult, setLastResult] = useState<{result: 'heads' | 'tails', win: boolean, payout: number} | null>(null);

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  const flipCoin = async () => {
    if (!selectedSide || isFlipping) return;

    setIsFlipping(true);
    setLastResult(null);

    // Animate coin flipping
    let flips = 0;
    const flipInterval = setInterval(() => {
      setCoinResult(Math.random() > 0.5 ? 'heads' : 'tails');
      flips++;
    }, 150);

    setTimeout(async () => {
      clearInterval(flipInterval);
      
      // Final result
      const result = Math.random() > 0.5 ? 'heads' : 'tails';
      setCoinResult(result);

      // Determine win/loss
      const isWin = selectedSide === result;
      const payout = isWin ? betAmount * 2 : 0; // 2x payout for correct prediction

      setLastResult({ result, win: isWin, payout });

      // Place bet through parent component
      await onBet(isWin ? payout - betAmount : -betAmount, {
        gameType: 'coin-flip',
        bet: selectedSide,
        result,
        win: isWin
      });

      setIsFlipping(false);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">🪙 Coin Flip</h1>
        <p className="text-gray-300">Choose heads or tails and double your money</p>
        <div className="mt-2">
          <Badge variant="secondary" className="bg-green-600 text-white">
            Balance: ₹{parseFloat(userBalance).toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* Coin Display */}
      <Card className="bg-gradient-to-br from-yellow-900 to-orange-900 border-yellow-600">
        <CardContent className="p-8">
          <div className="flex justify-center items-center">
            <div className={`relative w-32 h-32 ${isFlipping ? 'animate-spin' : ''}`}>
              <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-4 border-yellow-300 flex items-center justify-center shadow-2xl">
                <div className="text-4xl font-bold text-yellow-900">
                  {coinResult === 'heads' ? '👑' : '🏛️'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {coinResult.toUpperCase()}
            </div>
            
            {lastResult && (
              <div className="mt-4">
                <div className={`text-2xl font-bold ${lastResult.win ? 'text-green-400' : 'text-red-400'}`}>
                  {lastResult.win ? `🎉 You Won ₹${lastResult.payout.toFixed(2)}!` : `❌ You Lost ₹${betAmount}`}
                </div>
                <div className="text-gray-300 mt-2">
                  Result: {lastResult.result.toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Betting Options */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Choose Your Side (2x Payout)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <Button
              variant={selectedSide === 'heads' ? 'default' : 'outline'}
              className={`h-24 text-xl ${selectedSide === 'heads' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
              onClick={() => setSelectedSide('heads')}
            >
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-2">👑</div>
                <div>HEADS</div>
              </div>
            </Button>
            <Button
              variant={selectedSide === 'tails' ? 'default' : 'outline'}
              className={`h-24 text-xl ${selectedSide === 'tails' ? 'bg-red-600 hover:bg-red-700' : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'}`}
              onClick={() => setSelectedSide('tails')}
            >
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-2">🏛️</div>
                <div>TAILS</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

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
              onClick={flipCoin}
              disabled={!selectedSide || isFlipping || betAmount > parseFloat(userBalance)}
              className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold text-lg"
            >
              {isFlipping ? 'Flipping...' : 'Flip Coin'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-600">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">50%</div>
            <div className="text-sm text-gray-400">Heads Chance</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-600">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">50%</div>
            <div className="text-sm text-gray-400">Tails Chance</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-600">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">2x</div>
            <div className="text-sm text-gray-400">Win Multiplier</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-600">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">0%</div>
            <div className="text-sm text-gray-400">House Edge</div>
          </CardContent>
        </Card>
      </div>

      {/* Game Rules */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Game Rules</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-2">
          <p>• Choose either HEADS (👑) or TAILS (🏛️)</p>
          <p>• If you guess correctly, you win 2x your bet amount</p>
          <p>• If you guess wrong, you lose your bet</p>
          <p>• Fair 50/50 chance - no house edge</p>
          <p>• Minimum bet: ₹1 | Maximum bet: Your balance</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default CoinFlip;