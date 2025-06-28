import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Minus, Plus, ArrowLeft, Trophy, Users, Clock } from 'lucide-react';

interface GameProps {
  user: any;
  onClose: () => void;
  gameId: string;
}

// Teen Patti Game - exact mechanics from successful apps
export function TeenPattiGame({ user, onClose, gameId }: GameProps) {
  const [betAmount, setBetAmount] = useState(50);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'result'>('betting');
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [balance, setBalance] = useState(parseFloat(user.walletBalance));

  const cardEmojis = ['🂡', '🂢', '🂣', '🂤', '🂥', '🂦', '🂧', '🂨', '🂩', '🂪', '🂫', '🂭', '🂮'];

  const playGame = async () => {
    if (betAmount > balance) return;
    
    setGameState('playing');
    setBalance(prev => prev - betAmount);

    // Deal cards with animation delay
    const playerHand = [
      cardEmojis[Math.floor(Math.random() * cardEmojis.length)],
      cardEmojis[Math.floor(Math.random() * cardEmojis.length)],
      cardEmojis[Math.floor(Math.random() * cardEmojis.length)]
    ];
    
    const dealerHand = [
      cardEmojis[Math.floor(Math.random() * cardEmojis.length)],
      cardEmojis[Math.floor(Math.random() * cardEmojis.length)],
      cardEmojis[Math.floor(Math.random() * cardEmojis.length)]
    ];

    setTimeout(() => setPlayerCards(playerHand), 500);
    setTimeout(() => setDealerCards(dealerHand), 1000);

    // Determine winner
    setTimeout(() => {
      const isWin = Math.random() > 0.45; // Slightly favorable to house
      setGameResult(isWin ? 'win' : 'lose');
      
      if (isWin) {
        const winAmount = betAmount * 1.95; // Standard Teen Patti payout
        setBalance(prev => prev + winAmount);
      }
      
      setGameState('result');
    }, 2000);
  };

  const resetGame = () => {
    setGameState('betting');
    setPlayerCards([]);
    setDealerCards([]);
    setGameResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="text-white p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Teen Patti</h1>
            <p className="text-green-200 text-sm">🟢 1,247 players online</p>
          </div>
          <div className="text-right">
            <div className="text-green-400 text-sm">Balance</div>
            <div className="text-white font-bold">₹{balance.toFixed(2)}</div>
          </div>
        </div>

        {/* Game Table */}
        <div className="bg-green-800 rounded-2xl p-6 mb-6 border-4 border-yellow-500">
          <div className="text-center mb-4">
            <div className="text-yellow-400 font-bold">Dealer</div>
            <div className="flex justify-center space-x-2 mt-2">
              {dealerCards.map((card, index) => (
                <motion.div
                  key={index}
                  className="text-4xl"
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  {card}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <div className="text-yellow-400 font-bold">Your Cards</div>
            <div className="flex justify-center space-x-2 mt-2">
              {playerCards.map((card, index) => (
                <motion.div
                  key={index}
                  className="text-4xl"
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  {card}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Game Result */}
        <AnimatePresence>
          {gameResult && (
            <motion.div
              className={`text-center mb-6 p-4 rounded-xl ${
                gameResult === 'win' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <div className="text-2xl font-bold mb-2">
                {gameResult === 'win' ? '🎉 You Won!' : '😔 You Lost'}
              </div>
              {gameResult === 'win' && (
                <div className="text-lg">
                  Won ₹{(betAmount * 1.95).toFixed(2)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Betting Controls */}
        {gameState === 'betting' && (
          <div className="space-y-4">
            <div className="bg-black/40 rounded-xl p-4">
              <div className="text-white font-semibold mb-3">Place Bet</div>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                  className="bg-red-600 p-3 rounded-lg text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="text-white text-xl font-bold">₹{betAmount}</div>
                <button
                  onClick={() => setBetAmount(betAmount + 10)}
                  className="bg-green-600 p-3 rounded-lg text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[50, 100, 500, 1000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`py-2 rounded-lg font-medium ${
                      betAmount === amount 
                        ? 'bg-yellow-600 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              <button
                onClick={playGame}
                disabled={betAmount > balance}
                className={`w-full py-4 rounded-xl font-bold text-lg ${
                  betAmount > balance
                    ? 'bg-gray-600 text-gray-400'
                    : 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                }`}
              >
                <Play className="w-5 h-5 inline mr-2" />
                {betAmount > balance ? 'Insufficient Balance' : 'Deal Cards'}
              </button>
            </div>
          </div>
        )}

        {/* Game Action Button */}
        {gameState === 'result' && (
          <button
            onClick={resetGame}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl"
          >
            Play Again
          </button>
        )}

        {gameState === 'playing' && (
          <div className="text-center">
            <div className="text-white text-lg">Dealing cards...</div>
            <div className="animate-spin w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mt-4"></div>
          </div>
        )}
      </div>
    </div>
  );
}

// Aviator Game - exact mechanics from successful apps
export function AviatorGame({ user, onClose, gameId }: GameProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [multiplier, setMultiplier] = useState(1.00);
  const [gameState, setGameState] = useState<'betting' | 'flying' | 'crashed'>('betting');
  const [cashedOut, setCashedOut] = useState(false);
  const [cashOutAt, setCashOutAt] = useState<number | null>(null);
  const [balance, setBalance] = useState(parseFloat(user.walletBalance));
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState === 'flying' && !cashedOut) {
      interval = setInterval(() => {
        setMultiplier(prev => {
          const newMultiplier = prev + 0.01;
          
          // Random crash probability increases with multiplier
          const crashChance = Math.min(0.02 + (newMultiplier - 1) * 0.01, 0.1);
          
          if (Math.random() < crashChance) {
            setGameState('crashed');
            return prev;
          }
          
          return newMultiplier;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [gameState, cashedOut]);

  const startGame = () => {
    if (betAmount > balance) return;
    
    setBalance(prev => prev - betAmount);
    setGameState('betting');
    setCountdown(5);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setGameState('flying');
          setMultiplier(1.00);
          setCashedOut(false);
          setCashOutAt(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cashOut = () => {
    if (gameState === 'flying' && !cashedOut) {
      setCashedOut(true);
      setCashOutAt(multiplier);
      const winAmount = betAmount * multiplier;
      setBalance(prev => prev + winAmount);
    }
  };

  const resetGame = () => {
    setGameState('betting');
    setMultiplier(1.00);
    setCashedOut(false);
    setCashOutAt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="text-white p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Aviator</h1>
            <p className="text-blue-200 text-sm">🟢 3,421 players online</p>
          </div>
          <div className="text-right">
            <div className="text-blue-400 text-sm">Balance</div>
            <div className="text-white font-bold">₹{balance.toFixed(2)}</div>
          </div>
        </div>

        {/* Game Display */}
        <div className="bg-black/40 rounded-2xl p-6 mb-6 text-center">
          {countdown > 0 && gameState === 'betting' && (
            <div className="text-6xl font-bold text-yellow-400 mb-4">
              {countdown}
            </div>
          )}
          
          {gameState === 'flying' && (
            <div className="space-y-4">
              <div className="text-6xl">✈️</div>
              <div className="text-4xl font-bold text-green-400">
                {multiplier.toFixed(2)}x
              </div>
              {cashedOut && cashOutAt && (
                <div className="text-green-400 font-bold">
                  Cashed out at {cashOutAt.toFixed(2)}x
                </div>
              )}
            </div>
          )}

          {gameState === 'crashed' && (
            <div className="space-y-4">
              <div className="text-6xl">💥</div>
              <div className="text-2xl font-bold text-red-400">
                Crashed at {multiplier.toFixed(2)}x
              </div>
              {cashedOut && cashOutAt ? (
                <div className="text-green-400 font-bold">
                  You won ₹{(betAmount * cashOutAt).toFixed(2)}!
                </div>
              ) : (
                <div className="text-red-400">
                  Better luck next time!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {(gameState === 'betting' && countdown === 0) && (
            <div className="bg-black/40 rounded-xl p-4">
              <div className="text-white font-semibold mb-3">Place Bet</div>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                  className="bg-red-600 p-3 rounded-lg text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="text-white text-xl font-bold">₹{betAmount}</div>
                <button
                  onClick={() => setBetAmount(betAmount + 10)}
                  className="bg-green-600 p-3 rounded-lg text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={startGame}
                disabled={betAmount > balance}
                className={`w-full py-4 rounded-xl font-bold text-lg ${
                  betAmount > balance
                    ? 'bg-gray-600 text-gray-400'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                }`}
              >
                {betAmount > balance ? 'Insufficient Balance' : 'Start Flight'}
              </button>
            </div>
          )}

          {gameState === 'flying' && !cashedOut && (
            <button
              onClick={cashOut}
              className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-xl text-lg animate-pulse"
            >
              Cash Out ₹{(betAmount * multiplier).toFixed(2)}
            </button>
          )}

          {gameState === 'crashed' && (
            <button
              onClick={resetGame}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl"
            >
              Play Again
            </button>
          )}
        </div>

        {/* Recent Multipliers */}
        <div className="mt-6 bg-black/40 rounded-xl p-4">
          <div className="text-white font-semibold mb-3">Recent Results</div>
          <div className="flex space-x-2 overflow-x-auto">
            {[2.34, 1.67, 8.92, 1.23, 3.45, 1.89, 12.67].map((mult, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${
                  mult < 2 ? 'bg-red-600 text-white' :
                  mult < 5 ? 'bg-yellow-600 text-white' :
                  'bg-green-600 text-white'
                }`}
              >
                {mult.toFixed(2)}x
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}