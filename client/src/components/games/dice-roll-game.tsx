import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface DiceRollGameProps {
  game: any;
  user: any;
  onBack: () => void;
}

export function DiceRollGame({ game, user, onBack }: DiceRollGameProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [prediction, setPrediction] = useState<number>(7);
  const [betType, setBetType] = useState<'exact' | 'over' | 'under'>('exact');
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number[]>([1, 1]);
  const [gameResult, setGameResult] = useState<string | null>(null);

  const quickBets = [50, 100, 500, 1000, 5000];

  const rollDice = async () => {
    if (!user || parseFloat(user.walletBalance) < betAmount) {
      setGameResult("Insufficient balance!");
      return;
    }

    setIsRolling(true);
    setGameResult(null);

    // Animate dice rolling
    const rollAnimation = setInterval(() => {
      setDiceResult([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(rollAnimation);
      const finalResult = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ];
      setDiceResult(finalResult);
      setIsRolling(false);

      const sum = finalResult[0] + finalResult[1];
      let won = false;
      let multiplier = 0;

      switch (betType) {
        case 'exact':
          won = sum === prediction;
          // Higher payouts for harder predictions
          if (sum === 2 || sum === 12) multiplier = 30;
          else if (sum === 3 || sum === 11) multiplier = 15;
          else if (sum === 4 || sum === 10) multiplier = 9;
          else if (sum === 5 || sum === 9) multiplier = 6;
          else if (sum === 6 || sum === 8) multiplier = 5;
          else if (sum === 7) multiplier = 4;
          break;
        case 'over':
          won = sum > prediction;
          multiplier = 1.8;
          break;
        case 'under':
          won = sum < prediction;
          multiplier = 1.8;
          break;
      }

      if (won) {
        const winAmount = Math.floor(betAmount * multiplier);
        setGameResult(`🎉 You won! Dice: ${finalResult[0]} + ${finalResult[1]} = ${sum} - ₹${winAmount}`);
      } else {
        setGameResult(`😔 You lost! Dice: ${finalResult[0]} + ${finalResult[1]} = ${sum}`);
      }
    }, 2000);
  };

  const resetGame = () => {
    setGameResult(null);
    setIsRolling(false);
  };

  const getDiceEmoji = (value: number) => {
    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return diceEmojis[value - 1];
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-red-900 via-purple-900 to-pink-900 border-2 border-red-500">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-red-400">🎲 Dice Roll</h2>
            <Button variant="outline" onClick={onBack} className="border-red-500 text-red-400">
              ← Back
            </Button>
          </div>

          {/* Dice Display */}
          <div className="flex justify-center gap-8 mb-8">
            {diceResult.map((die, index) => (
              <motion.div
                key={index}
                className="w-24 h-24 bg-white rounded-lg flex items-center justify-center text-4xl shadow-2xl"
                animate={isRolling ? { rotate: [0, 360] } : { rotate: 0 }}
                transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
              >
                {getDiceEmoji(die)}
              </motion.div>
            ))}
          </div>

          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-white">
              Sum: {diceResult[0] + diceResult[1]}
            </div>
          </div>

          {/* Bet Type Selection */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Button
              onClick={() => setBetType('exact')}
              disabled={isRolling}
              className={`py-4 font-bold transition-all ${
                betType === 'exact'
                  ? 'bg-red-600 text-white scale-105'
                  : 'bg-gray-700 text-red-300 hover:bg-gray-600'
              }`}
            >
              EXACT NUMBER
            </Button>
            <Button
              onClick={() => setBetType('over')}
              disabled={isRolling}
              className={`py-4 font-bold transition-all ${
                betType === 'over'
                  ? 'bg-red-600 text-white scale-105'
                  : 'bg-gray-700 text-red-300 hover:bg-gray-600'
              }`}
            >
              OVER
            </Button>
            <Button
              onClick={() => setBetType('under')}
              disabled={isRolling}
              className={`py-4 font-bold transition-all ${
                betType === 'under'
                  ? 'bg-red-600 text-white scale-105'
                  : 'bg-gray-700 text-red-300 hover:bg-gray-600'
              }`}
            >
              UNDER
            </Button>
          </div>

          {/* Prediction Selection */}
          <div className="mb-6">
            <label className="block text-red-300 text-sm font-medium mb-2">
              {betType === 'exact' ? 'Predict exact sum:' : 
               betType === 'over' ? 'Sum will be over:' : 'Sum will be under:'} {prediction}
            </label>
            <div className="grid grid-cols-11 gap-1">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <button
                  key={num}
                  onClick={() => setPrediction(num)}
                  disabled={isRolling}
                  className={`py-2 px-1 rounded text-sm font-medium transition-colors ${
                    prediction === num
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-red-300 hover:bg-gray-600'
                  } disabled:opacity-50`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Bet Amount */}
          <div className="mb-6">
            <label className="block text-red-300 text-sm font-medium mb-2">
              Bet Amount: ₹{betAmount}
            </label>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {quickBets.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  disabled={isRolling}
                  className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
                    betAmount === amount
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-red-300 hover:bg-gray-600'
                  } disabled:opacity-50`}
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
              disabled={isRolling}
              className="w-full"
            />
          </div>

          {/* Action Button */}
          <div className="space-y-4">
            {!gameResult && (
              <Button
                onClick={rollDice}
                disabled={isRolling || !user || parseFloat(user.walletBalance) < betAmount}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-xl font-bold"
              >
                {isRolling ? "Rolling..." : "🎲 Roll Dice"}
              </Button>
            )}

            {gameResult && (
              <div className="space-y-4">
                <div className={`text-center p-4 rounded-lg ${
                  gameResult.includes('won') ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                }`}>
                  {gameResult}
                </div>
                <Button
                  onClick={resetGame}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Roll Again
                </Button>
              </div>
            )}
          </div>

          {/* Game Info */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-red-300 text-sm">
              {betType === 'exact' ? 'Exact payouts: 2,12(30x) • 3,11(15x) • 4,10(9x) • 5,9(6x) • 6,8(5x) • 7(4x)' :
               'Over/Under payout: 1.8x'}
            </p>
            <p className="text-red-300">
              Balance: <span className="text-white font-bold">₹{parseFloat(user?.walletBalance || '0').toLocaleString()}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}