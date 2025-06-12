import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface CoinFlipGameProps {
  game: any;
  user: any;
  onBack: () => void;
}

export function CoinFlipGame({ game, user, onBack }: CoinFlipGameProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails'>('heads');
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);
  const [gameResult, setGameResult] = useState<string | null>(null);

  const quickBets = [50, 100, 500, 1000, 5000];

  const flipCoin = async () => {
    if (!user || parseFloat(user.walletBalance) < betAmount) {
      setGameResult("Insufficient balance!");
      return;
    }

    setIsFlipping(true);
    setGameResult(null);
    setCoinResult(null);

    // Simulate coin flip animation delay
    setTimeout(() => {
      const result = Math.random() < 0.5 ? 'heads' : 'tails';
      setCoinResult(result);
      setIsFlipping(false);

      if (result === selectedSide) {
        const winAmount = betAmount * 1.95; // 95% payout for fair odds
        setGameResult(`🎉 You won! ${result.toUpperCase()} - ₹${Math.floor(winAmount)}`);
      } else {
        setGameResult(`😔 You lost! It was ${result.toUpperCase()}`);
      }
    }, 2000);
  };

  const resetGame = () => {
    setCoinResult(null);
    setGameResult(null);
    setIsFlipping(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-gradient-to-br from-yellow-900 via-orange-900 to-amber-900 border-2 border-yellow-500">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-yellow-400">🪙 Coin Flip</h2>
            <Button variant="outline" onClick={onBack} className="border-yellow-500 text-yellow-400">
              ← Back
            </Button>
          </div>

          {/* Coin Display */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <AnimatePresence>
                {isFlipping ? (
                  <motion.div
                    key="flipping"
                    className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-4xl shadow-2xl"
                    animate={{ rotateY: [0, 360, 720, 1080] }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  >
                    🪙
                  </motion.div>
                ) : coinResult ? (
                  <motion.div
                    key={coinResult}
                    initial={{ scale: 0, rotateY: 0 }}
                    animate={{ scale: 1, rotateY: coinResult === 'heads' ? 0 : 180 }}
                    className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-5xl shadow-2xl"
                  >
                    {coinResult === 'heads' ? '👑' : '⚡'}
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-4xl shadow-2xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    🪙
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Side Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              onClick={() => setSelectedSide('heads')}
              disabled={isFlipping}
              className={`py-8 text-lg font-bold transition-all ${
                selectedSide === 'heads'
                  ? 'bg-yellow-600 text-white scale-105'
                  : 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
              }`}
            >
              👑 HEADS
            </Button>
            <Button
              onClick={() => setSelectedSide('tails')}
              disabled={isFlipping}
              className={`py-8 text-lg font-bold transition-all ${
                selectedSide === 'tails'
                  ? 'bg-yellow-600 text-white scale-105'
                  : 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
              }`}
            >
              ⚡ TAILS
            </Button>
          </div>

          {/* Bet Amount */}
          <div className="mb-6">
            <label className="block text-yellow-300 text-sm font-medium mb-2">
              Bet Amount: ₹{betAmount}
            </label>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {quickBets.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  disabled={isFlipping}
                  className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
                    betAmount === amount
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
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
              disabled={isFlipping}
              className="w-full"
            />
          </div>

          {/* Action Button */}
          <div className="space-y-4">
            {!gameResult && (
              <Button
                onClick={flipCoin}
                disabled={isFlipping || !user || parseFloat(user.walletBalance) < betAmount}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-xl font-bold"
              >
                {isFlipping ? "Flipping..." : `🎲 Flip for ${selectedSide.toUpperCase()}`}
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
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  Play Again
                </Button>
              </div>
            )}
          </div>

          {/* Game Info */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-yellow-300 text-sm">
              Win Rate: 50% • Payout: 1.95x
            </p>
            <p className="text-yellow-300">
              Balance: <span className="text-white font-bold">₹{parseFloat(user?.walletBalance || '0').toLocaleString()}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}