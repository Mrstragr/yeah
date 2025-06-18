import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Zap, Target, DollarSign } from 'lucide-react';

interface ImprovedAviatorGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const ImprovedAviatorGame = ({ onClose, refreshBalance }: ImprovedAviatorGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [cashOutTarget, setCashOutTarget] = useState(2.0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [isFlying, setIsFlying] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [hasBet, setHasBet] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showPlane, setShowPlane] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isFlying) {
        setCountdown(prev => {
          if (prev <= 1) {
            startNewRound();
            return 5;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isFlying]);

  useEffect(() => {
    if (isFlying && !cashedOut) {
      animateMultiplier();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isFlying, cashedOut]);

  const animateMultiplier = () => {
    const startTime = Date.now();
    const duration = Math.random() * 15000 + 5000; // 5-20 seconds
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if (progress < 1 && !cashedOut) {
        // Exponential growth curve
        const newMultiplier = 1 + (Math.pow(progress * 10, 1.5) * 0.1);
        setCurrentMultiplier(newMultiplier);
        
        // Auto cash out if target reached
        if (hasBet && newMultiplier >= cashOutTarget) {
          handleCashOut();
        } else {
          animationRef.current = requestAnimationFrame(animate);
        }
      } else {
        // Plane crashed
        endRound(currentMultiplier, false);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const startNewRound = () => {
    setIsFlying(true);
    setCurrentMultiplier(1.0);
    setCashedOut(false);
    setGameResult(null);
    setShowPlane(true);
    setCountdown(5);
  };

  const placeBet = () => {
    if (isFlying || betAmount <= 0) return;
    setHasBet(true);
  };

  const handleCashOut = async () => {
    if (!hasBet || cashedOut || !isFlying) return;
    
    setCashedOut(true);
    const winAmount = Math.floor(betAmount * currentMultiplier);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/games/aviator/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          betAmount,
          cashOutMultiplier: currentMultiplier
        })
      });

      if (response.ok) {
        const result = await response.json();
        setGameResult({
          ...result,
          winAmount,
          isWin: true,
          multiplier: currentMultiplier
        });
        refreshBalance();
      }
    } catch (error) {
      console.error('Cash out error:', error);
    }
    
    endRound(currentMultiplier, true);
  };

  const endRound = (finalMultiplier: number, playerCashedOut: boolean) => {
    setIsFlying(false);
    setShowPlane(false);
    setHasBet(false);
    
    // Add to history
    setGameHistory(prev => [finalMultiplier, ...prev.slice(0, 9)]);
    
    if (!playerCashedOut && hasBet) {
      // Player lost
      setGameResult({
        isWin: false,
        winAmount: 0,
        multiplier: finalMultiplier,
        result: { crashMultiplier: finalMultiplier }
      });
    }
    
    // Reset for next round
    setTimeout(() => {
      setCountdown(5);
    }, 2000);
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier < 1.5) return 'text-white';
    if (multiplier < 2) return 'text-yellow-400';
    if (multiplier < 5) return 'text-orange-400';
    return 'text-red-400';
  };

  const getHistoryColor = (multiplier: number) => {
    if (multiplier < 2) return 'bg-red-600';
    if (multiplier < 5) return 'bg-yellow-600';
    return 'bg-green-600';
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Aviator</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        {/* Game Display */}
        <div className="relative h-64 mb-6 bg-gradient-to-b from-sky-400 to-blue-600 rounded-xl overflow-hidden">
          {/* Sky background with clouds */}
          <div className="absolute inset-0">
            <div className="absolute top-4 left-4 w-16 h-8 bg-white/30 rounded-full"></div>
            <div className="absolute top-8 right-8 w-12 h-6 bg-white/20 rounded-full"></div>
            <div className="absolute bottom-12 left-12 w-20 h-10 bg-white/25 rounded-full"></div>
          </div>
          
          {/* Plane */}
          {showPlane && (
            <div 
              className={`absolute bottom-8 transition-all duration-500 ${
                isFlying ? 'left-3/4 bottom-3/4' : 'left-4 bottom-8'
              }`}
            >
              <div className="text-4xl transform rotate-45">✈️</div>
            </div>
          )}
          
          {/* Multiplier Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {isFlying ? (
                <div className={`text-6xl font-bold ${getMultiplierColor(currentMultiplier)} animate-pulse`}>
                  {currentMultiplier.toFixed(2)}x
                </div>
              ) : (
                <div className="text-white">
                  {countdown > 0 ? (
                    <div className="text-4xl font-bold">{countdown}</div>
                  ) : (
                    <div className="text-2xl">CRASHED!</div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Trail effect */}
          {isFlying && (
            <div className="absolute bottom-12 left-8 w-32 h-1 bg-gradient-to-r from-yellow-400 to-transparent opacity-70"></div>
          )}
        </div>

        {/* Game History */}
        <div className="mb-6">
          <h3 className="text-white text-lg mb-3 font-bold flex items-center gap-2">
            <TrendingUp size={20} />
            Recent Flights
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {gameHistory.map((multiplier, index) => (
              <div
                key={index}
                className={`min-w-[60px] h-10 rounded-lg flex items-center justify-center font-bold text-white text-sm ${getHistoryColor(multiplier)}`}
              >
                {multiplier.toFixed(2)}x
              </div>
            ))}
          </div>
        </div>

        {/* Betting Interface */}
        <div className="space-y-4 mb-6">
          {/* Bet Amount */}
          <div>
            <h3 className="text-white text-lg mb-3 font-bold">Bet Amount</h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[100, 500, 1000].map(amount => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`py-3 rounded-lg font-bold transition-all ${
                    betAmount === amount
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                  disabled={isFlying}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg text-center text-xl font-bold"
              min="10"
              max="50000"
              disabled={isFlying}
            />
          </div>

          {/* Auto Cash Out */}
          <div>
            <h3 className="text-white text-lg mb-3 font-bold">Auto Cash Out</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1.01"
                max="100"
                step="0.01"
                value={cashOutTarget}
                onChange={(e) => setCashOutTarget(parseFloat(e.target.value) || 2.0)}
                className="flex-1 px-3 py-3 bg-gray-800 text-white rounded-lg text-center font-bold"
                disabled={isFlying}
              />
              <span className="text-white font-bold">x</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isFlying ? (
            <button
              onClick={placeBet}
              disabled={countdown > 0 || betAmount <= 0}
              className={`w-full py-4 rounded-xl font-bold text-xl transition-all transform ${
                countdown > 0 || betAmount <= 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105 shadow-lg'
              }`}
            >
              {countdown > 0 ? `NEXT ROUND IN ${countdown}s` : `BET ₹${betAmount}`}
            </button>
          ) : (
            <button
              onClick={handleCashOut}
              disabled={!hasBet || cashedOut}
              className={`w-full py-4 rounded-xl font-bold text-xl transition-all transform ${
                !hasBet || cashedOut
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:scale-105 shadow-lg animate-pulse'
              }`}
            >
              {cashedOut 
                ? `CASHED OUT AT ${currentMultiplier.toFixed(2)}x` 
                : `CASH OUT ₹${Math.floor(betAmount * currentMultiplier)}`
              }
            </button>
          )}
        </div>

        {/* Game Result */}
        {gameResult && (
          <div className={`mt-6 p-6 rounded-xl ${
            gameResult.isWin 
              ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500' 
              : 'bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500'
          }`}>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-3 ${
                gameResult.isWin ? 'text-green-400' : 'text-red-400'
              }`}>
                {gameResult.isWin ? '🚀 SUCCESSFUL FLIGHT!' : '💥 PLANE CRASHED!'}
              </div>
              <div className="text-white text-xl mb-2">
                Flight ended at: <span className="font-bold text-yellow-400">
                  {gameResult.multiplier?.toFixed(2)}x
                </span>
              </div>
              <div className="text-white text-lg">
                {gameResult.isWin ? `+₹${gameResult.winAmount}` : `-₹${betAmount}`}
              </div>
            </div>
          </div>
        )}

        {/* Strategy Tips */}
        <div className="mt-6 p-4 bg-blue-900/30 rounded-lg">
          <h4 className="text-white font-bold mb-2 flex items-center gap-2">
            <Target size={16} />
            Pro Tips
          </h4>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• Cash out early for consistent small wins</li>
            <li>• Set auto cash-out for disciplined gameplay</li>
            <li>• Higher multipliers are riskier but more rewarding</li>
            <li>• Manage your bankroll wisely</li>
          </ul>
        </div>
      </div>
    </div>
  );
};