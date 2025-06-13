import { useState } from "react";
import { X, Minus, Plus, Zap } from "lucide-react";

interface Game {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  rating: string;
  jackpot: string;
  isActive: boolean;
}

interface DreamClubGameModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
  userBalance: number;
}

export function DreamClubGameModal({ game, isOpen, onClose, userBalance }: DreamClubGameModalProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showParticles, setShowParticles] = useState(false);

  const quickAmounts = [50, 100, 500, 1000, 5000];

  const handleBetAmountChange = (amount: number) => {
    if (amount >= 10 && amount <= userBalance) {
      setBetAmount(amount);
    }
  };

  const handlePlayGame = async () => {
    if (betAmount > userBalance) {
      setResult("Insufficient balance!");
      return;
    }

    setIsPlaying(true);
    setResult(null);

    try {
      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/games/bet', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          gameId: game.id,
          betAmount: betAmount
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const isWin = data.result === 'win';
        setResult(data.message || (isWin ? 
          `🎉 You won ₹${data.winAmount}!` : 
          `💔 You lost ₹${betAmount}`
        ));

        if (isWin) {
          setShowParticles(true);
          setTimeout(() => {
            setShowParticles(false);
          }, 3000);
        }

        // Refresh user data to show updated balance
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setResult(data.message || "Game error occurred");
      }
    } catch (error) {
      setResult("Network error - please try again");
    }

    setIsPlaying(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-3xl w-full max-w-md overflow-hidden relative">
        {/* Particles Animation */}
        {showParticles && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-6 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold">{game.title}</h2>
                  <p className="text-white/80 text-sm">{game.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Game Area */}
            <div className="bg-white/10 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl font-bold">1.00x</span>
              </div>
              <p className="text-white/80 text-sm">Current Multiplier</p>
            </div>
          </div>
        </div>

        {/* Betting Section */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-white text-lg font-semibold mb-4">Bet Amount</h3>
            
            {/* Amount Input */}
            <div className="bg-slate-700/50 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => handleBetAmountChange(betAmount - 10)}
                  className="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center"
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>
                
                <div className="text-center">
                  <p className="text-white text-2xl font-bold">₹{betAmount}</p>
                </div>
                
                <button
                  onClick={() => handleBetAmountChange(betAmount + 10)}
                  className="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    betAmount === amount
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50"
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>

            {/* Balance */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-400">Balance:</span>
              <span className="text-green-400 font-bold">₹{userBalance.toFixed(2)}</span>
            </div>

            {/* Play Button */}
            <button
              onClick={handlePlayGame}
              disabled={isPlaying || betAmount > userBalance}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                isPlaying || betAmount > userBalance
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105"
              }`}
            >
              {isPlaying ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Playing...</span>
                </div>
              ) : (
                `⚡ Play Now - ₹${betAmount}`
              )}
            </button>

            {/* Result */}
            {result && (
              <div className={`mt-4 p-4 rounded-2xl text-center font-bold ${
                result.includes("won") || result.includes("🎉")
                  ? "bg-green-500/20 border border-green-500/50 text-green-300"
                  : "bg-red-500/20 border border-red-500/50 text-red-300"
              }`}>
                {result}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}