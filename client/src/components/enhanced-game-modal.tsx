import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Minus, Plus, TrendingUp, Coins, Zap } from "lucide-react";

interface EnhancedGameModalProps {
  game: {
    id: number;
    title: string;
    description: string;
    category: string;
    jackpot: string;
  };
  user: any;
  onClose: () => void;
}

export function EnhancedGameModal({ game, user, onClose }: EnhancedGameModalProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [winAnimation, setWinAnimation] = useState(false);
  const [coinFlips, setCoinFlips] = useState<string[]>([]);
  const [diceValues, setDiceValues] = useState<number[]>([]);
  const [multiplier, setMultiplier] = useState(1.0);
  const [showParticles, setShowParticles] = useState(false);

  const quickBets = [50, 100, 500, 1000, 5000];

  const getGameIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'aviator': return '✈️';
      case 'coin flip': return '🪙';
      case 'dice roll': return '🎲';
      case 'big small': return '🎯';
      case 'blackjack': return '🃏';
      case 'lucky numbers': return '🎫';
      case 'plinko': return '⚪';
      default: return '🎮';
    }
  };

  const playGame = async () => {
    if (!user || parseFloat(user.balance) < betAmount) {
      setResult("Insufficient balance!");
      return;
    }

    setIsPlaying(true);
    setResult(null);

    // Game-specific animations
    if (game.title.toLowerCase() === 'coin flip') {
      animateCoinFlip();
    } else if (game.title.toLowerCase() === 'dice roll') {
      animateDiceRoll();
    } else if (game.title.toLowerCase() === 'aviator') {
      animateAviator();
    }

    try {
      // Call the actual betting API
      const response = await fetch('/api/games/bet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          gameId: game.id,
          betAmount: betAmount
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const isWin = data.result === 'win';
        setResult(isWin ? 
          `🎉 You won ₹${data.winAmount}!` : 
          `💔 You lost ₹${betAmount}`
        );

        // Add visual effects for wins
        if (isWin) {
          setWinAnimation(true);
          setShowParticles(true);
          setTimeout(() => {
            setWinAnimation(false);
            setShowParticles(false);
          }, 3000);
        }
      } else {
        setResult(data.message || "Game error occurred");
      }
    } catch (error) {
      setResult("Network error - please try again");
    }

    setIsPlaying(false);
  };

  const animateCoinFlip = () => {
    const flips = ['heads', 'tails'];
    let flipCount = 0;
    const flipInterval = setInterval(() => {
      setCoinFlips([flips[Math.random() > 0.5 ? 1 : 0]]);
      flipCount++;
      if (flipCount > 6) {
        clearInterval(flipInterval);
      }
    }, 200);
  };

  const animateDiceRoll = () => {
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValues([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
      rollCount++;
      if (rollCount > 8) {
        clearInterval(rollInterval);
      }
    }, 150);
  };

  const animateAviator = () => {
    let currentMultiplier = 1.0;
    const aviatorInterval = setInterval(() => {
      currentMultiplier += 0.1;
      setMultiplier(currentMultiplier);
      if (currentMultiplier > 3.0) {
        clearInterval(aviatorInterval);
        setMultiplier(1.0);
      }
    }, 100);
  };

  useEffect(() => {
    if (winAnimation) {
      const timer = setTimeout(() => setWinAnimation(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [winAnimation]);

  const renderGameSpecificUI = () => {
    switch (game.title.toLowerCase()) {
      case 'aviator':
        return (
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg p-4 mb-4">
            <div className="text-center">
              <div className={`text-4xl mb-2 ${isPlaying ? 'aviator-fly-animation' : ''}`}>✈️</div>
              <div className={`text-2xl font-bold text-blue-400 ${isPlaying ? 'multiplier-animation' : ''}`}>
                {isPlaying ? `${multiplier.toFixed(2)}x` : '1.00x'}
              </div>
              <div className="text-gray-400 text-sm">Current Multiplier</div>
            </div>
          </div>
        );

      case 'coin flip':
        return (
          <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-lg p-4 mb-4">
            <div className="text-center">
              <div className={`text-6xl mb-2 transform transition-transform duration-300 ${isPlaying ? 'coin-animation' : ''}`}>
                🪙
              </div>
              {coinFlips.length > 0 && (
                <div className="text-lg font-bold text-yellow-400 capitalize">
                  {coinFlips[0]}
                </div>
              )}
            </div>
          </div>
        );

      case 'dice roll':
        return (
          <div className="bg-gradient-to-br from-red-900/50 to-pink-900/50 rounded-lg p-4 mb-4">
            <div className="flex justify-center gap-2 mb-2">
              {(diceValues.length > 0 ? diceValues : [1, 1, 1]).map((value, index) => (
                <div 
                  key={index}
                  className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl font-bold text-black transform transition-transform duration-200 ${isPlaying ? 'dice-roll-animation' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {value}
                </div>
              ))}
            </div>
            <div className="text-center text-red-400 font-bold">
              Total: {(diceValues.length > 0 ? diceValues : [1, 1, 1]).reduce((a, b) => a + b, 0)}
            </div>
          </div>
        );

      case 'blackjack':
        return (
          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-lg p-4 mb-4">
            <div className="text-center">
              <div className="text-4xl mb-2">🃏</div>
              <div className="text-lg text-green-400">Beat the dealer to 21!</div>
            </div>
          </div>
        );

      case 'plinko':
        return (
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-lg p-4 mb-4">
            <div className="text-center">
              <div className="text-4xl mb-2">⚪</div>
              <div className="grid grid-cols-5 gap-1 mb-2">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-purple-400 rounded-full mx-auto"></div>
                ))}
              </div>
              <div className="text-lg text-purple-400">Drop the ball!</div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gradient-to-br from-gray-900/50 to-slate-900/50 rounded-lg p-4 mb-4">
            <div className="text-center">
              <div className="text-4xl mb-2">{getGameIcon(game.title)}</div>
              <div className="text-lg text-gray-400">{game.description}</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-backdrop">
      <Card className={`w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 transform transition-all duration-300 modal-content ${winAnimation ? 'scale-105 border-yellow-500 win-animation' : ''}`}>
        <CardContent className="p-6">
          {/* Particles Effect */}
          {showParticles && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                ></div>
              ))}
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-3xl">{getGameIcon(game.title)}</span>
                {game.title}
              </h2>
              <p className="text-gray-400 text-sm mt-1">{game.description}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Game Specific UI */}
          {renderGameSpecificUI()}

          {/* Bet Amount */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-3">Bet Amount</label>
            <div className="flex items-center gap-2 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBetAmount(Math.max(50, betAmount - 50))}
                disabled={isPlaying}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-center">
                <span className="text-white font-bold text-lg">₹{betAmount}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBetAmount(Math.min(5000, betAmount + 50))}
                disabled={isPlaying}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Bet Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {quickBets.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(amount)}
                  disabled={isPlaying}
                  className={`border-gray-600 text-gray-300 hover:bg-gray-700 ${betAmount === amount ? 'bg-purple-600 border-purple-500' : ''}`}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Balance Display */}
          <div className="flex justify-between items-center mb-6 p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400">Balance:</span>
            </div>
            <span className="text-green-400 font-bold">₹{parseFloat(user?.balance || '0').toLocaleString()}</span>
          </div>

          {/* Play Button */}
          <Button
            onClick={playGame}
            disabled={isPlaying || parseFloat(user?.balance || '0') < betAmount}
            className={`w-full py-4 text-lg font-bold transition-all duration-300 ${
              isPlaying 
                ? 'bg-gray-600 cursor-not-allowed' 
                : winAnimation
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {isPlaying ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Playing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Play Now - ₹{betAmount}
              </div>
            )}
          </Button>

          {/* Result */}
          {result && (
            <div className={`mt-4 p-4 rounded-lg text-center font-bold transform transition-all duration-500 ${
              result.includes('won') || result.includes('🎉')
                ? 'bg-green-900/50 text-green-400 border border-green-600 scale-105'
                : result.includes('lost') || result.includes('💔')
                ? 'bg-red-900/50 text-red-400 border border-red-600'
                : 'bg-yellow-900/50 text-yellow-400 border border-yellow-600'
            }`}>
              {result}
            </div>
          )}

          {/* Jackpot Display */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Jackpot: ₹{parseFloat(game.jackpot).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}