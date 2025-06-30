import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plane, DollarSign, Timer } from 'lucide-react';

interface AviatorGameProps {
  onBack: () => void;
  user: any;
  onBalanceUpdate: () => void;
}

interface GameRound {
  roundId: string;
  multiplier: number;
  crashed: boolean;
  timeStarted: number;
  duration: number;
}

export default function AviatorGame({ onBack, user, onBalanceUpdate }: AviatorGameProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [hasBet, setHasBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [cashOutMultiplier, setCashOutMultiplier] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // Game loop effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameState === 'waiting') {
      // Countdown to next round
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            startNewRound();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameState === 'flying') {
      // Increase multiplier
      interval = setInterval(() => {
        setCurrentMultiplier(prev => {
          const newMultiplier = prev + 0.01;
          
          // Random crash probability that increases with multiplier
          const crashProbability = Math.min(0.02 + (newMultiplier - 1) * 0.03, 0.15);
          
          if (Math.random() < crashProbability) {
            crashPlane(newMultiplier);
            return newMultiplier;
          }
          
          return newMultiplier;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [gameState]);

  const startNewRound = () => {
    setGameState('flying');
    setCurrentMultiplier(1.00);
    setHasBet(false);
    setHasCashedOut(false);
    setCashOutMultiplier(0);
    setCountdown(5);
  };

  const crashPlane = (crashMultiplier: number) => {
    setGameState('crashed');
    setGameHistory(prev => [crashMultiplier, ...prev.slice(0, 9)]);
    
    // Auto payout if user hasn't cashed out and has bet
    if (hasBet && !hasCashedOut) {
      // User loses the bet
      console.log(`Plane crashed at ${crashMultiplier.toFixed(2)}x - Bet lost`);
    }
    
    // Wait 3 seconds then start new round
    setTimeout(() => {
      setGameState('waiting');
      setCountdown(5);
    }, 3000);
  };

  const placeBet = async () => {
    if (gameState !== 'waiting' || betAmount <= 0) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/games/bet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameType: 'aviator',
          period: Date.now().toString(),
          bets: [{
            type: 'aviator_bet',
            amount: betAmount,
            multiplier: 1.0
          }],
          totalAmount: betAmount
        }),
      });

      if (response.ok) {
        setHasBet(true);
        onBalanceUpdate();
      } else {
        const data = await response.json();
        alert(data.error || 'Bet failed');
      }
    } catch (error) {
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const cashOut = async () => {
    if (!hasBet || hasCashedOut || gameState !== 'flying') return;
    
    setLoading(true);
    try {
      const winAmount = betAmount * currentMultiplier;
      const token = localStorage.getItem('authToken');
      
      // In a real implementation, this would call a cashout endpoint
      // For demo, we'll simulate instant cashout
      setHasCashedOut(true);
      setCashOutMultiplier(currentMultiplier);
      
      console.log(`Cashed out at ${currentMultiplier.toFixed(2)}x for ₹${winAmount.toFixed(2)}`);
      alert(`Cashed out successfully! Won ₹${winAmount.toFixed(2)}`);
      
      // Update balance (this would be handled by backend in real app)
      onBalanceUpdate();
    } catch (error) {
      alert('Cashout failed');
    } finally {
      setLoading(false);
    }
  };

  const getMultiplierColor = () => {
    if (currentMultiplier < 2) return 'text-green-400';
    if (currentMultiplier < 5) return 'text-yellow-400';
    if (currentMultiplier < 10) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={onBack} className="flex items-center text-white">
          <ArrowLeft className="w-6 h-6 mr-2" />
          <span className="font-medium">Aviator</span>
        </button>
        <div className="text-right">
          <div className="text-sm opacity-80">Balance</div>
          <div className="font-bold">₹{user.walletBalance}</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative h-96 mx-4 mb-6 bg-gradient-to-b from-sky-400 to-blue-600 rounded-xl overflow-hidden">
        {/* Clouds Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-16 h-8 bg-white/20 rounded-full blur-sm"></div>
          <div className="absolute top-20 right-20 w-20 h-10 bg-white/15 rounded-full blur-sm"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-12 bg-white/10 rounded-full blur-sm"></div>
        </div>

        {/* Multiplier Display */}
        <div className="absolute top-6 left-6 z-10">
          <div className={`text-6xl font-bold ${getMultiplierColor()}`}>
            {gameState === 'crashed' ? 'CRASHED!' : `${currentMultiplier.toFixed(2)}x`}
          </div>
          {gameState === 'waiting' && (
            <div className="text-2xl text-white/80">
              Next round in {countdown}s
            </div>
          )}
        </div>

        {/* Plane */}
        <AnimatePresence>
          {gameState === 'flying' && (
            <motion.div
              className="absolute bottom-10 left-10"
              initial={{ x: 0, y: 0, rotate: 0 }}
              animate={{ 
                x: 300, 
                y: -200, 
                rotate: -15,
                transition: { 
                  duration: Math.min(currentMultiplier * 2, 20),
                  ease: "easeOut"
                }
              }}
            >
              <Plane className="w-12 h-12 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crash Effect */}
        <AnimatePresence>
          {gameState === 'crashed' && (
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl">💥</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Game History */}
      <div className="mx-4 mb-6">
        <div className="text-sm text-white/60 mb-2">Recent Multipliers</div>
        <div className="flex space-x-2 overflow-x-auto">
          {gameHistory.map((mult, index) => (
            <div
              key={index}
              className={`px-3 py-1 rounded-full text-sm font-bold flex-shrink-0 ${
                mult < 2 ? 'bg-red-500/20 text-red-400' :
                mult < 5 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}
            >
              {mult.toFixed(2)}x
            </div>
          ))}
        </div>
      </div>

      {/* Betting Panel */}
      <div className="mx-4 bg-white/10 rounded-xl p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Bet Amount */}
          <div>
            <div className="text-sm text-white/60 mb-2">Bet Amount</div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setBetAmount(Math.max(1, betAmount - 10))}
                className="bg-red-500 p-2 rounded-lg"
                disabled={gameState === 'flying'}
              >
                -
              </button>
              <div className="flex-1 text-center text-xl font-bold">₹{betAmount}</div>
              <button
                onClick={() => setBetAmount(betAmount + 10)}
                className="bg-green-500 p-2 rounded-lg"
                disabled={gameState === 'flying'}
              >
                +
              </button>
            </div>
            <div className="flex space-x-1 mt-2">
              {[10, 50, 100, 500].map(amount => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  disabled={gameState === 'flying'}
                  className={`flex-1 py-1 rounded text-xs ${
                    betAmount === amount 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/20 text-white/60'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Cashout */}
          <div>
            <div className="text-sm text-white/60 mb-2">Auto Cashout</div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-lg font-bold">2.00x</div>
              <div className="text-xs text-white/60">Auto cashout at</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          {!hasBet && gameState === 'waiting' && (
            <button
              onClick={placeBet}
              disabled={loading || betAmount > parseFloat(user.walletBalance)}
              className={`w-full py-3 rounded-lg font-bold text-xl ${
                loading || betAmount > parseFloat(user.walletBalance)
                  ? 'bg-gray-600 text-gray-400'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {loading ? 'Placing Bet...' : 
               betAmount > parseFloat(user.walletBalance) ? 'Insufficient Balance' :
               `Bet ₹${betAmount}`}
            </button>
          )}

          {hasBet && gameState === 'flying' && !hasCashedOut && (
            <button
              onClick={cashOut}
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-xl bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? 'Cashing Out...' : `Cash Out ₹${(betAmount * currentMultiplier).toFixed(2)}`}
            </button>
          )}

          {hasBet && hasCashedOut && (
            <div className="w-full py-3 rounded-lg font-bold text-xl bg-green-500 text-white text-center">
              Cashed Out at {cashOutMultiplier.toFixed(2)}x
            </div>
          )}

          {gameState === 'waiting' && hasBet && (
            <div className="w-full py-3 rounded-lg font-bold text-xl bg-blue-500 text-white text-center">
              Bet Placed - ₹{betAmount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}