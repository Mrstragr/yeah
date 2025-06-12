import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UniversalGameProps {
  game: {
    id: number;
    title: string;
    category: string;
    rating: string;
    jackpot: string;
  };
  user: any;
  onBack: () => void;
}

export function UniversalGame({ game, user, onBack }: UniversalGameProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [gameState, setGameState] = useState<any>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const quickBets = [50, 100, 500, 1000, 5000];

  const handlePlay = async () => {
    if (!user || parseFloat(user.walletBalance) < betAmount) {
      alert("Insufficient balance!");
      return;
    }

    setIsPlaying(true);
    setResult(null);

    // Simulate game logic based on category
    let winMultiplier = 0;
    let gameResult = "";

    switch (game.category) {
      case 'hot':
      case 'slots':
        // Slot-style game with random multipliers
        const slotResult = Math.random();
        if (slotResult > 0.7) {
          winMultiplier = Math.random() * 5 + 1; // 1x to 6x
          gameResult = `🎰 JACKPOT! ${winMultiplier.toFixed(1)}x multiplier!`;
        } else if (slotResult > 0.4) {
          winMultiplier = Math.random() * 2 + 0.5; // 0.5x to 2.5x
          gameResult = `🎯 Win! ${winMultiplier.toFixed(1)}x multiplier!`;
        } else {
          gameResult = "💸 Better luck next time!";
        }
        break;

      case 'cards':
        // Card game simulation
        const cardResult = Math.random();
        if (cardResult > 0.6) {
          winMultiplier = Math.random() * 3 + 1; // 1x to 4x
          gameResult = `🃏 Cards in your favor! ${winMultiplier.toFixed(1)}x win!`;
        } else {
          gameResult = "🃏 House wins this round!";
        }
        break;

      case 'dice':
        // Dice game simulation
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2;
        
        if (total >= 10) {
          winMultiplier = total / 6; // Higher totals = better multiplier
          gameResult = `🎲 Rolled ${dice1} + ${dice2} = ${total}! ${winMultiplier.toFixed(1)}x win!`;
        } else {
          gameResult = `🎲 Rolled ${dice1} + ${dice2} = ${total}. Try again!`;
        }
        break;

      case 'quick':
        // Quick win/lose with high volatility
        const quickResult = Math.random();
        if (quickResult > 0.8) {
          winMultiplier = Math.random() * 10 + 2; // 2x to 12x
          gameResult = `⚡ MEGA WIN! ${winMultiplier.toFixed(1)}x multiplier!`;
        } else if (quickResult > 0.5) {
          winMultiplier = Math.random() * 1.5 + 0.8; // 0.8x to 2.3x
          gameResult = `⚡ Quick win! ${winMultiplier.toFixed(1)}x!`;
        } else {
          gameResult = "⚡ Too quick this time!";
        }
        break;

      case 'jackpot':
        // Jackpot games with rare big wins
        const jackpotResult = Math.random();
        if (jackpotResult > 0.99) {
          winMultiplier = Math.random() * 50 + 20; // 20x to 70x MEGA JACKPOT
          gameResult = `🏆 MEGA JACKPOT! ${winMultiplier.toFixed(1)}x MASSIVE WIN!`;
        } else if (jackpotResult > 0.85) {
          winMultiplier = Math.random() * 5 + 2; // 2x to 7x
          gameResult = `🏆 Jackpot win! ${winMultiplier.toFixed(1)}x!`;
        } else {
          gameResult = "🏆 Keep trying for the jackpot!";
        }
        break;

      default:
        // Default game logic
        const defaultResult = Math.random();
        if (defaultResult > 0.5) {
          winMultiplier = Math.random() * 2 + 1;
          gameResult = `🎮 You win! ${winMultiplier.toFixed(1)}x!`;
        } else {
          gameResult = "🎮 Try again!";
        }
    }

    // Simulate game delay
    setTimeout(() => {
      setResult(gameResult);
      setIsPlaying(false);

      if (winMultiplier > 0) {
        const winAmount = Math.floor(betAmount * winMultiplier);
        console.log(`Won ₹${winAmount} on bet of ₹${betAmount}`);
      } else {
        console.log(`Lost ₹${betAmount}`);
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-yellow-500">
        <CardContent className="p-6">
          {/* Game Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">{game.title}</h2>
            <div className="flex justify-between text-sm text-gray-300">
              <span>⭐ {game.rating}</span>
              <span>🏆 {game.jackpot}</span>
            </div>
          </div>

          {/* Bet Amount Selection */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Bet Amount: ₹{betAmount}
            </label>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {quickBets.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
                    betAmount === amount
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
            <input
              type="range"
              min="50"
              max="5000"
              step="50"
              value={betAmount}
              onChange={(e) => setBetAmount(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Game Area */}
          <div className="bg-black/50 rounded-lg p-4 mb-6 min-h-[120px] flex items-center justify-center">
            {isPlaying ? (
              <div className="text-center">
                <div className="animate-spin w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-yellow-400 font-medium">Playing...</p>
              </div>
            ) : result ? (
              <div className="text-center">
                <p className="text-lg font-bold text-white mb-2">{result}</p>
                <Button
                  onClick={() => setResult(null)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Play Again
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-4">
                  {game.category === 'slots' && '🎰'}
                  {game.category === 'cards' && '🃏'}
                  {game.category === 'dice' && '🎲'}
                  {game.category === 'quick' && '⚡'}
                  {game.category === 'jackpot' && '🏆'}
                  {game.category === 'hot' && '🔥'}
                </div>
                <p className="text-gray-300">Ready to play {game.title}?</p>
              </div>
            )}
          </div>

          {/* Balance & Actions */}
          <div className="space-y-4">
            <div className="text-center text-gray-300">
              Balance: ₹{parseFloat(user?.walletBalance || '0').toFixed(2)}
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handlePlay}
                disabled={isPlaying || parseFloat(user?.walletBalance || '0') < betAmount}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:opacity-50"
              >
                {isPlaying ? 'Playing...' : `Bet ₹${betAmount}`}
              </Button>
              
              <Button
                onClick={onBack}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}