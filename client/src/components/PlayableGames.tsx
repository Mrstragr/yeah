import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, TrendingUp, Target, Zap, DollarSign,
  ArrowUp, ArrowDown, Clock, Trophy, Star,
  Plus, Minus, RotateCcw, CheckCircle, XCircle
} from 'lucide-react';

interface GameProps {
  user: any;
  onClose: () => void;
  gameType: string;
}

// WinGo Game Component
export function WinGoGame({ user, onClose, gameType }: GameProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState<'small' | 'big' | 'red' | 'green' | 'violet' | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameRound, setGameRound] = useState(1);
  const [gameHistory, setGameHistory] = useState<any[]>([]);

  const gameInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    startNewRound();
    return () => {
      if (gameInterval.current) clearInterval(gameInterval.current);
    };
  }, []);

  const startNewRound = () => {
    setTimeLeft(30);
    setGameResult(null);
    setIsPlaying(false);
    
    gameInterval.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          generateResult();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const generateResult = () => {
    const randomNumber = Math.floor(Math.random() * 10);
    const color = randomNumber === 0 || randomNumber === 5 ? 'violet' : 
                 randomNumber % 2 === 0 ? 'red' : 'green';
    const size = randomNumber < 5 ? 'small' : 'big';

    const result = { number: randomNumber, color, size, round: gameRound };
    setGameResult(result);
    setGameHistory(prev => [result, ...prev.slice(0, 9)]);
    setGameRound(prev => prev + 1);

    // Check if user won
    if (selectedBet || selectedNumber !== null) {
      checkWin(result);
    }

    setTimeout(() => {
      setGameResult(null);
      setSelectedBet(null);
      setSelectedNumber(null);
    }, 5000);
  };

  const checkWin = (result: any) => {
    let won = false;
    let multiplier = 0;

    if (selectedNumber === result.number) {
      won = true;
      multiplier = result.number === 0 || result.number === 5 ? 4.5 : 9;
    } else if (selectedBet === result.color) {
      won = true;
      multiplier = result.color === 'violet' ? 4.5 : 2;
    } else if (selectedBet === result.size) {
      won = true;
      multiplier = 2;
    }

    if (won) {
      const winAmount = betAmount * multiplier;
      // Here you would update user balance
      alert(`You won ₹${winAmount}! (${multiplier}x multiplier)`);
    } else {
      alert(`You lost ₹${betAmount}. Better luck next time!`);
    }
  };

  const placeBet = () => {
    if (!selectedBet && selectedNumber === null) {
      alert('Please select a bet first!');
      return;
    }
    
    if (betAmount < 10) {
      alert('Minimum bet is ₹10');
      return;
    }

    setIsPlaying(true);
    // Here you would deduct bet amount from user balance
  };

  const colors = [
    { id: 'red', name: 'Red', color: 'bg-red-500', odds: '2x' },
    { id: 'green', name: 'Green', color: 'bg-green-500', odds: '2x' },
    { id: 'violet', name: 'Violet', color: 'bg-purple-500', odds: '4.5x' }
  ];

  const sizes = [
    { id: 'small', name: 'Small (0-4)', odds: '2x' },
    { id: 'big', name: 'Big (5-9)', odds: '2x' }
  ];

  return (
    <div className="bg-slate-900 min-h-screen p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Win Go 1Min</h1>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {/* Game Timer */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white text-center mb-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Clock className="w-6 h-6" />
            <span className="text-3xl font-bold">{timeLeft}s</span>
          </div>
          <p className="text-emerald-100">Round #{gameRound}</p>
          {gameResult && (
            <motion.div 
              className="mt-4 p-4 bg-white/20 rounded-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <div className="text-4xl font-bold mb-2">{gameResult.number}</div>
              <div className={`w-8 h-8 rounded mx-auto mb-2 ${
                gameResult.color === 'red' ? 'bg-red-500' :
                gameResult.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
              }`} />
              <p>{gameResult.color.toUpperCase()} - {gameResult.size.toUpperCase()}</p>
            </motion.div>
          )}
        </div>

        {/* Bet Amount */}
        <div className="bg-slate-800 rounded-xl p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Bet Amount</h3>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Minus className="w-5 h-5" />
            </motion.button>
            <div className="flex-1 text-center">
              <div className="text-2xl font-bold text-white">₹{betAmount}</div>
            </div>
            <motion.button
              onClick={() => setBetAmount(betAmount + 10)}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[10, 50, 100, 500].map(amount => (
              <motion.button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`py-2 rounded text-sm font-medium ${
                  betAmount === amount ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ₹{amount}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Color Betting */}
        <div className="bg-slate-800 rounded-xl p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Choose Color</h3>
          <div className="grid grid-cols-3 gap-3">
            {colors.map(color => (
              <motion.button
                key={color.id}
                onClick={() => setSelectedBet(color.id as any)}
                className={`p-4 rounded-lg border-2 ${
                  selectedBet === color.id ? 'border-white' : 'border-transparent'
                } ${color.color}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-white font-bold">{color.name}</div>
                <div className="text-white text-sm">{color.odds}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Size Betting */}
        <div className="bg-slate-800 rounded-xl p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Choose Size</h3>
          <div className="grid grid-cols-2 gap-3">
            {sizes.map(size => (
              <motion.button
                key={size.id}
                onClick={() => setSelectedBet(size.id as any)}
                className={`p-4 rounded-lg border-2 ${
                  selectedBet === size.id ? 'border-emerald-500 bg-emerald-900/30' : 'border-slate-600 bg-slate-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-white font-bold">{size.name}</div>
                <div className="text-emerald-400 text-sm">{size.odds}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Number Betting */}
        <div className="bg-slate-800 rounded-xl p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Choose Number (9x odds)</h3>
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <motion.button
                key={num}
                onClick={() => setSelectedNumber(num)}
                className={`aspect-square rounded-lg border-2 flex items-center justify-center ${
                  selectedNumber === num ? 'border-emerald-500 bg-emerald-900/30' : 'border-slate-600 bg-slate-700'
                } ${
                  num === 0 || num === 5 ? 'text-purple-400' :
                  num % 2 === 0 ? 'text-red-400' : 'text-green-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="font-bold text-lg">{num}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Place Bet Button */}
        <motion.button
          onClick={placeBet}
          disabled={timeLeft < 5 || isPlaying}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white py-4 rounded-xl font-bold text-lg mb-6"
          whileHover={{ scale: isPlaying ? 1 : 1.02 }}
          whileTap={{ scale: isPlaying ? 1 : 0.98 }}
        >
          {isPlaying ? 'Bet Placed!' : timeLeft < 5 ? 'Betting Closed' : 'Place Bet'}
        </motion.button>

        {/* Game History */}
        <div className="bg-slate-800 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Recent Results</h3>
          <div className="grid grid-cols-5 gap-2">
            {gameHistory.map((result, index) => (
              <motion.div
                key={`${result.round}-${index}`}
                className="aspect-square rounded bg-slate-700 flex flex-col items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="font-bold text-white">{result.number}</span>
                <div className={`w-3 h-3 rounded mt-1 ${
                  result.color === 'red' ? 'bg-red-500' :
                  result.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                }`} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Aviator Game Component
export function AviatorGame({ user, onClose }: GameProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [hasCrashed, setHasCrashed] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [nextRoundTimer, setNextRoundTimer] = useState(5);
  const [userBalance, setUserBalance] = useState(parseFloat(user.walletBalance));

  const gameInterval = useRef<NodeJS.Timeout>();
  const timerInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    startNextRound();
    return () => {
      if (gameInterval.current) clearInterval(gameInterval.current);
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, []);

  const startNextRound = () => {
    setHasCrashed(false);
    setHasCashedOut(false);
    setIsGameActive(false);
    setMultiplier(1.00);
    setNextRoundTimer(5);

    timerInterval.current = setInterval(() => {
      setNextRoundTimer(prev => {
        if (prev <= 1) {
          if (timerInterval.current) clearInterval(timerInterval.current);
          startFlight();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startFlight = () => {
    setIsFlying(true);
    setIsGameActive(true);
    setMultiplier(1.00);

    const crashPoint = Math.random() * 10 + 1; // Random crash between 1x and 11x
    
    gameInterval.current = setInterval(() => {
      setMultiplier(prev => {
        const newMultiplier = prev + 0.01;
        if (newMultiplier >= crashPoint) {
          crash();
          return prev;
        }
        return newMultiplier;
      });
    }, 50);
  };

  const crash = () => {
    setIsFlying(false);
    setHasCrashed(true);
    setIsGameActive(false);
    if (gameInterval.current) clearInterval(gameInterval.current);
    
    setTimeout(() => {
      startNextRound();
    }, 3000);
  };

  const placeBet = () => {
    if (betAmount > userBalance) {
      alert('Insufficient balance!');
      return;
    }
    setUserBalance(prev => prev - betAmount);
  };

  const cashOut = () => {
    if (!isGameActive || hasCashedOut) return;
    
    setHasCashedOut(true);
    const winAmount = betAmount * multiplier;
    setUserBalance(prev => prev + winAmount);
    alert(`Cashed out at ${multiplier.toFixed(2)}x! Won ₹${winAmount.toFixed(2)}`);
  };

  return (
    <div className="bg-slate-900 min-h-screen p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Aviator</h1>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {/* Game Area */}
        <div className="bg-gradient-to-b from-blue-900 to-slate-800 rounded-xl p-6 text-center mb-6 relative overflow-hidden">
          <div className="relative z-10">
            {nextRoundTimer > 0 ? (
              <div>
                <div className="text-6xl mb-4">✈️</div>
                <div className="text-white text-2xl font-bold">Starting in {nextRoundTimer}s</div>
              </div>
            ) : hasCrashed ? (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                className="text-red-400"
              >
                <div className="text-6xl mb-4">💥</div>
                <div className="text-4xl font-bold">{multiplier.toFixed(2)}x</div>
                <div className="text-xl">CRASHED!</div>
              </motion.div>
            ) : (
              <motion.div
                animate={isFlying ? { y: [-20, -40, -20] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-6xl mb-4">✈️</div>
                <div className="text-6xl font-bold text-white">{multiplier.toFixed(2)}x</div>
                {isGameActive && !hasCashedOut && (
                  <motion.button
                    onClick={cashOut}
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold text-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    CASH OUT
                  </motion.button>
                )}
                {hasCashedOut && (
                  <div className="mt-4 text-emerald-400 font-bold text-xl">
                    CASHED OUT AT {multiplier.toFixed(2)}x!
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Balance Display */}
        <div className="bg-slate-800 rounded-xl p-4 mb-6 text-center">
          <div className="text-gray-400 text-sm">Balance</div>
          <div className="text-white text-2xl font-bold">₹{userBalance.toFixed(2)}</div>
        </div>

        {/* Bet Controls */}
        <div className="bg-slate-800 rounded-xl p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Bet Amount</h3>
          <div className="flex items-center space-x-4 mb-4">
            <motion.button
              onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Minus className="w-5 h-5" />
            </motion.button>
            <div className="flex-1 text-center">
              <div className="text-2xl font-bold text-white">₹{betAmount}</div>
            </div>
            <motion.button
              onClick={() => setBetAmount(betAmount + 10)}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          <motion.button
            onClick={placeBet}
            disabled={isGameActive || nextRoundTimer === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white py-4 rounded-xl font-bold text-lg"
            whileHover={{ scale: isGameActive ? 1 : 1.02 }}
            whileTap={{ scale: isGameActive ? 1 : 0.98 }}
          >
            {isGameActive ? 'Game In Progress' : nextRoundTimer > 0 ? 'Place Bet' : 'Starting...'}
          </motion.button>
        </div>

        {/* Game Info */}
        <div className="bg-slate-800 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">How to Play</h3>
          <div className="text-gray-300 text-sm space-y-2">
            <p>• Place your bet before the plane takes off</p>
            <p>• Watch the multiplier increase as the plane flies</p>
            <p>• Cash out before the plane crashes to win</p>
            <p>• The longer you wait, the higher the multiplier</p>
            <p>• But be careful - the plane can crash at any time!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mines Game Component  
export function MinesGame({ user, onClose }: GameProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [mineCount, setMineCount] = useState(3);
  const [gameGrid, setGameGrid] = useState<boolean[]>(Array(25).fill(false));
  const [mines, setMines] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [userBalance, setUserBalance] = useState(parseFloat(user.walletBalance));

  const startGame = () => {
    if (betAmount > userBalance) {
      alert('Insufficient balance!');
      return;
    }

    // Generate random mine positions
    const minePositions: number[] = [];
    while (minePositions.length < mineCount) {
      const pos = Math.floor(Math.random() * 25);
      if (!minePositions.includes(pos)) {
        minePositions.push(pos);
      }
    }

    setMines(minePositions);
    setRevealed([]);
    setGameActive(true);
    setCurrentMultiplier(1);
    setUserBalance(prev => prev - betAmount);
  };

  const revealTile = (index: number) => {
    if (!gameActive || revealed.includes(index)) return;

    if (mines.includes(index)) {
      // Hit a mine - game over
      setGameActive(false);
      setRevealed([...revealed, index]);
      alert('💥 You hit a mine! Game over!');
      // Show all mines
      setTimeout(() => setRevealed(mines), 500);
    } else {
      // Safe tile
      const newRevealed = [...revealed, index];
      setRevealed(newRevealed);
      
      // Calculate new multiplier based on revealed safe tiles
      const safeRevealed = newRevealed.filter(pos => !mines.includes(pos)).length;
      const totalSafe = 25 - mineCount;
      const newMultiplier = Math.pow(totalSafe / (totalSafe - safeRevealed + 1), safeRevealed);
      setCurrentMultiplier(newMultiplier);
    }
  };

  const cashOut = () => {
    if (!gameActive) return;
    
    const winAmount = betAmount * currentMultiplier;
    setUserBalance(prev => prev + winAmount);
    setGameActive(false);
    alert(`Cashed out! Won ₹${winAmount.toFixed(2)} (${currentMultiplier.toFixed(2)}x)`);
  };

  const resetGame = () => {
    setGameGrid(Array(25).fill(false));
    setMines([]);
    setRevealed([]);
    setGameActive(false);
    setCurrentMultiplier(1);
  };

  const getTileIcon = (index: number) => {
    if (!revealed.includes(index)) return '?';
    if (mines.includes(index)) return '💣';
    return '💎';
  };

  return (
    <div className="bg-slate-900 min-h-screen p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Mines</h1>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {/* Balance & Multiplier */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <div className="text-gray-400 text-sm">Balance</div>
            <div className="text-white text-xl font-bold">₹{userBalance.toFixed(2)}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center">
            <div className="text-gray-400 text-sm">Multiplier</div>
            <div className="text-emerald-400 text-xl font-bold">{currentMultiplier.toFixed(2)}x</div>
          </div>
        </div>

        {/* Game Settings */}
        {!gameActive && (
          <div className="bg-slate-800 rounded-xl p-4 mb-6">
            <h3 className="text-white font-semibold mb-3">Game Settings</h3>
            
            {/* Bet Amount */}
            <div className="mb-4">
              <label className="text-gray-300 text-sm mb-2 block">Bet Amount</label>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                  className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <div className="flex-1 text-center text-white font-bold">₹{betAmount}</div>
                <motion.button
                  onClick={() => setBetAmount(betAmount + 10)}
                  className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Mine Count */}
            <div className="mb-4">
              <label className="text-gray-300 text-sm mb-2 block">Number of Mines</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 3, 5].map(count => (
                  <motion.button
                    key={count}
                    onClick={() => setMineCount(count)}
                    className={`py-2 rounded font-medium ${
                      mineCount === count ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {count} Mine{count > 1 ? 's' : ''}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Game Grid */}
        <div className="bg-slate-800 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }, (_, index) => (
              <motion.button
                key={index}
                onClick={() => revealTile(index)}
                disabled={!gameActive}
                className={`aspect-square rounded flex items-center justify-center text-2xl font-bold ${
                  revealed.includes(index)
                    ? mines.includes(index)
                      ? 'bg-red-500 text-white'
                      : 'bg-emerald-500 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-gray-400'
                }`}
                whileHover={{ scale: gameActive && !revealed.includes(index) ? 1.05 : 1 }}
                whileTap={{ scale: gameActive && !revealed.includes(index) ? 0.95 : 1 }}
              >
                {getTileIcon(index)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Game Controls */}
        <div className="space-y-3">
          {!gameActive ? (
            <motion.button
              onClick={startGame}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Game
            </motion.button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                onClick={cashOut}
                className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-bold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cash Out
              </motion.button>
              <motion.button
                onClick={resetGame}
                className="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-bold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reset
              </motion.button>
            </div>
          )}
        </div>

        {/* Game Instructions */}
        <div className="bg-slate-800 rounded-xl p-4 mt-6">
          <h3 className="text-white font-semibold mb-3">How to Play</h3>
          <div className="text-gray-300 text-sm space-y-1">
            <p>• Choose your bet amount and number of mines</p>
            <p>• Click tiles to reveal diamonds 💎</p>
            <p>• Avoid hitting mines 💣</p>
            <p>• Your multiplier increases with each safe tile</p>
            <p>• Cash out anytime to secure your winnings</p>
          </div>
        </div>
      </div>
    </div>
  );
}