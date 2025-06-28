import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, TrendingUp, Target, Zap, DollarSign,
  ArrowUp, ArrowDown, Clock, Trophy, Star,
  Plus, Minus, RotateCcw, CheckCircle, XCircle,
  Volume2, VolumeX, Settings, Info, Gift
} from 'lucide-react';

interface GameProps {
  user: any;
  onClose: () => void;
  gameType: string;
}

// Enhanced WinGo Game with Premium Animations
export function EnhancedWinGoGame({ user, onClose, gameType }: GameProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState<'small' | 'big' | 'red' | 'green' | 'violet' | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameRound, setGameRound] = useState(202406280001);
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [participants, setParticipants] = useState(Math.floor(Math.random() * 500) + 100);
  const [totalBets, setTotalBets] = useState(Math.floor(Math.random() * 50000) + 10000);

  const gameInterval = useRef<NodeJS.Timeout>();
  const participantsInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    startNewRound();
    
    // Simulate live participants
    participantsInterval.current = setInterval(() => {
      setParticipants(prev => prev + Math.floor(Math.random() * 3) - 1);
      setTotalBets(prev => prev + Math.floor(Math.random() * 1000));
    }, 2000);

    return () => {
      if (gameInterval.current) clearInterval(gameInterval.current);
      if (participantsInterval.current) clearInterval(participantsInterval.current);
    };
  }, []);

  const startNewRound = () => {
    setTimeLeft(30);
    setGameResult(null);
    setIsPlaying(false);
    setShowWinAnimation(false);
    
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
    }, 8000);
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
      const amount = betAmount * multiplier;
      setWinAmount(amount);
      setShowWinAnimation(true);
      setTimeout(() => setShowWinAnimation(false), 3000);
    }
  };

  const placeBet = () => {
    if (!selectedBet && selectedNumber === null) {
      return;
    }
    
    if (betAmount < 10) {
      return;
    }

    setIsPlaying(true);
    setTotalBets(prev => prev + betAmount);
  };

  const getNumberColor = (num: number) => {
    if (num === 0 || num === 5) return 'text-purple-400 bg-purple-900/30';
    return num % 2 === 0 ? 'text-red-400 bg-red-900/30' : 'text-green-400 bg-green-900/30';
  };

  const colors = [
    { id: 'red', name: 'Red', color: 'bg-gradient-to-br from-red-500 to-red-600', odds: '2x' },
    { id: 'green', name: 'Green', color: 'bg-gradient-to-br from-green-500 to-green-600', odds: '2x' },
    { id: 'violet', name: 'Violet', color: 'bg-gradient-to-br from-purple-500 to-purple-600', odds: '4.5x' }
  ];

  const sizes = [
    { id: 'small', name: 'Small', desc: '0-4', odds: '2x' },
    { id: 'big', name: 'Big', desc: '5-9', odds: '2x' }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 min-h-screen relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] animate-pulse"></div>
      </div>

      {/* Win Animation Overlay */}
      <AnimatePresence>
        {showWinAnimation && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="text-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.div 
                className="text-8xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                🎉
              </motion.div>
              <motion.h2 
                className="text-4xl font-bold text-yellow-400 mb-2"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                BIG WIN!
              </motion.h2>
              <motion.p 
                className="text-2xl text-white font-bold"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                ₹{winAmount.toFixed(2)}
              </motion.p>
              <motion.div 
                className="mt-4 flex justify-center space-x-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-yellow-400 rounded-full"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ delay: i * 0.1, duration: 0.6, repeat: Infinity }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto p-4 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Win Go</h1>
            <p className="text-emerald-400 text-sm">1 Minute Game</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-slate-800 rounded-lg text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </motion.button>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>
        </div>

        {/* Live Stats */}
        <motion.div 
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-emerald-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-emerald-400 text-sm">Live Players</div>
              <motion.div 
                className="text-white font-bold text-lg"
                key={participants}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {participants}
              </motion.div>
            </div>
            <div>
              <div className="text-emerald-400 text-sm">Total Bets</div>
              <motion.div 
                className="text-white font-bold text-lg"
                key={totalBets}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                ₹{totalBets.toLocaleString()}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Game Timer with Enhanced Animation */}
        <motion.div 
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white text-center mb-6 relative overflow-hidden"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated Background Circles */}
          <div className="absolute inset-0">
            <motion.div 
              className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full"
              animate={{ 
                x: ['-50%', '150%'],
                y: ['-50%', '150%']
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full"
              animate={{ 
                x: ['50%', '-150%'],
                y: ['50%', '-150%']
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-6 h-6" />
              </motion.div>
              <motion.span 
                className="text-4xl font-bold"
                animate={timeLeft <= 5 ? { 
                  scale: [1, 1.2, 1],
                  color: ['#ffffff', '#ef4444', '#ffffff']
                } : {}}
                transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }}
              >
                {timeLeft}s
              </motion.span>
            </div>
            
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-emerald-100">Round</span>
              <motion.span 
                className="font-mono font-bold"
                key={gameRound}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                #{gameRound}
              </motion.span>
            </div>

            {gameResult && (
              <motion.div 
                className="mt-4 p-6 bg-white/20 backdrop-blur-sm rounded-xl"
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <motion.div 
                  className="text-6xl font-bold mb-4"
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 1 }}
                >
                  {gameResult.number}
                </motion.div>
                <motion.div 
                  className={`w-12 h-12 rounded-full mx-auto mb-4 ${
                    gameResult.color === 'red' ? 'bg-red-500' :
                    gameResult.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                  }`}
                  animate={{ 
                    scale: [0, 1.3, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 0.8 }}
                />
                <motion.p 
                  className="text-xl font-bold"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {gameResult.color.toUpperCase()} - {gameResult.size.toUpperCase()}
                </motion.p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Bet Amount */}
        <motion.div 
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-emerald-400" />
            Bet Amount
          </h3>
          <div className="flex items-center space-x-4 mb-4">
            <motion.button
              onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05, backgroundColor: '#475569' }}
              whileTap={{ scale: 0.95 }}
            >
              <Minus className="w-5 h-5" />
            </motion.button>
            <div className="flex-1 text-center">
              <motion.div 
                className="text-3xl font-bold text-white"
                key={betAmount}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                ₹{betAmount}
              </motion.div>
            </div>
            <motion.button
              onClick={() => setBetAmount(betAmount + 10)}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05, backgroundColor: '#475569' }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[10, 50, 100, 500].map(amount => (
              <motion.button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`py-3 rounded-lg text-sm font-medium transition-all ${
                  betAmount === amount 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                ₹{amount}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Color Betting */}
        <motion.div 
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-700"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <Target className="w-5 h-5 mr-2 text-emerald-400" />
            Choose Color
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {colors.map(color => (
              <motion.button
                key={color.id}
                onClick={() => setSelectedBet(color.id as any)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedBet === color.id ? 'border-white shadow-xl' : 'border-transparent'
                } ${color.color} relative overflow-hidden`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * parseInt(color.id.charAt(0)) }}
              >
                <div className="relative z-10">
                  <div className="text-white font-bold text-lg">{color.name}</div>
                  <div className="text-white/90 text-sm">{color.odds}</div>
                </div>
                {selectedBet === color.id && (
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Size Betting */}
        <motion.div 
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-white font-semibold mb-3">Choose Size</h3>
          <div className="grid grid-cols-2 gap-3">
            {sizes.map(size => (
              <motion.button
                key={size.id}
                onClick={() => setSelectedBet(size.id as any)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedBet === size.id 
                    ? 'border-emerald-500 bg-emerald-900/50 shadow-xl' 
                    : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-white font-bold text-lg">{size.name}</div>
                <div className="text-gray-300 text-sm">{size.desc}</div>
                <div className="text-emerald-400 text-sm font-semibold">{size.odds}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Number Betting */}
        <motion.div 
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-white font-semibold mb-3">Choose Number (9x odds)</h3>
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <motion.button
                key={num}
                onClick={() => setSelectedNumber(num)}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                  selectedNumber === num 
                    ? 'border-emerald-500 bg-emerald-900/50 shadow-xl' 
                    : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                } ${getNumberColor(num)}`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * num }}
              >
                <span className="font-bold text-xl">{num}</span>
                <span className="text-xs opacity-75">9x</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Place Bet Button */}
        <motion.button
          onClick={placeBet}
          disabled={timeLeft < 5 || isPlaying || (!selectedBet && selectedNumber === null)}
          className={`w-full py-4 rounded-xl font-bold text-lg mb-6 transition-all ${
            timeLeft < 5 || isPlaying || (!selectedBet && selectedNumber === null)
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-xl'
          }`}
          whileHover={!(timeLeft < 5 || isPlaying) ? { scale: 1.02, y: -2 } : {}}
          whileTap={!(timeLeft < 5 || isPlaying) ? { scale: 0.98 } : {}}
        >
          {isPlaying ? (
            <span className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Bet Placed!
            </span>
          ) : timeLeft < 5 ? (
            <span className="flex items-center justify-center">
              <XCircle className="w-5 h-5 mr-2" />
              Betting Closed
            </span>
          ) : (!selectedBet && selectedNumber === null) ? (
            'Select Your Bet First'
          ) : (
            <span className="flex items-center justify-center">
              <Play className="w-5 h-5 mr-2" />
              Place Bet - ₹{betAmount}
            </span>
          )}
        </motion.button>

        {/* Enhanced Game History */}
        <motion.div 
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-white font-semibold mb-3 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-emerald-400" />
            Recent Results
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {gameHistory.map((result, index) => (
              <motion.div
                key={`${result.round}-${index}`}
                className="aspect-square rounded-xl bg-slate-700/50 border border-slate-600 flex flex-col items-center justify-center relative overflow-hidden"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  damping: 15
                }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <span className="font-bold text-white text-lg">{result.number}</span>
                <motion.div 
                  className={`w-4 h-4 rounded-full mt-1 ${
                    result.color === 'red' ? 'bg-red-500' :
                    result.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                  }`}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      '0 0 0px rgba(0,0,0,0)',
                      '0 0 10px rgba(16, 185, 129, 0.5)',
                      '0 0 0px rgba(0,0,0,0)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Enhanced Aviator Game with Professional Animations
export function EnhancedAviatorGame({ user, onClose }: GameProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [hasCrashed, setHasCrashed] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [nextRoundTimer, setNextRoundTimer] = useState(5);
  const [userBalance, setUserBalance] = useState(parseFloat(user.walletBalance));
  const [multiplierHistory, setMultiplierHistory] = useState<number[]>([]);
  const [participants, setParticipants] = useState(Math.floor(Math.random() * 200) + 50);
  const [showCashOutEffect, setShowCashOutEffect] = useState(false);

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
    setShowCashOutEffect(false);

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

    const crashPoint = Math.random() * 8 + 1.5; // Random crash between 1.5x and 9.5x
    
    gameInterval.current = setInterval(() => {
      setMultiplier(prev => {
        const increment = prev < 2 ? 0.01 : prev < 5 ? 0.02 : 0.05;
        const newMultiplier = prev + increment;
        
        if (newMultiplier >= crashPoint) {
          crash(newMultiplier);
          return prev;
        }
        return newMultiplier;
      });
    }, 100);
  };

  const crash = (finalMultiplier: number) => {
    setIsFlying(false);
    setHasCrashed(true);
    setIsGameActive(false);
    setMultiplierHistory(prev => [finalMultiplier, ...prev.slice(0, 9)]);
    if (gameInterval.current) clearInterval(gameInterval.current);
    
    setTimeout(() => {
      startNextRound();
    }, 4000);
  };

  const placeBet = () => {
    if (betAmount > userBalance || isGameActive) return;
    setUserBalance(prev => prev - betAmount);
  };

  const cashOut = () => {
    if (!isGameActive || hasCashedOut) return;
    
    setHasCashedOut(true);
    setShowCashOutEffect(true);
    const winAmount = betAmount * multiplier;
    setUserBalance(prev => prev + winAmount);
    setTimeout(() => setShowCashOutEffect(false), 2000);
  };

  const getMultiplierColor = () => {
    if (multiplier < 2) return 'text-white';
    if (multiplier < 5) return 'text-green-400';
    if (multiplier < 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 min-h-screen relative overflow-hidden">
      {/* Animated Sky Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-500/20"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        {/* Floating Clouds */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-20"
            style={{ 
              top: `${20 + i * 25}%`,
              left: `-10%`
            }}
            animate={{ 
              x: ['0vw', '110vw'],
            }}
            transition={{ 
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            ☁️
          </motion.div>
        ))}
      </div>

      {/* Cash Out Effect */}
      <AnimatePresence>
        {showCashOutEffect && (
          <motion.div 
            className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <motion.div 
                className="text-6xl mb-4"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1 }}
              >
                💰
              </motion.div>
              <motion.h2 
                className="text-3xl font-bold text-green-400"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                CASHED OUT!
              </motion.h2>
              <motion.p 
                className="text-xl text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                ₹{(betAmount * multiplier).toFixed(2)}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto p-4 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Aviator</h1>
            <p className="text-blue-400 text-sm">Fly High, Cash Out Smart</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 text-center border border-blue-500/20">
            <div className="text-blue-400 text-sm">Players</div>
            <div className="text-white font-bold">{participants}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 text-center border border-blue-500/20">
            <div className="text-blue-400 text-sm">Last Crash</div>
            <div className="text-white font-bold">
              {multiplierHistory[0] ? `${multiplierHistory[0].toFixed(2)}x` : '--'}
            </div>
          </div>
        </div>

        {/* Game Area with Enhanced Animation */}
        <motion.div 
          className="bg-gradient-to-b from-blue-800/30 to-slate-800/30 backdrop-blur-sm rounded-xl p-6 text-center mb-6 relative overflow-hidden border border-blue-500/20"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          {/* Flight Path */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30"></div>
          
          <div className="relative z-10 h-40 flex items-center justify-center">
            {nextRoundTimer > 0 ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <motion.div 
                  className="text-6xl mb-4"
                  animate={{ 
                    rotateY: [0, 180, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ✈️
                </motion.div>
                <motion.div 
                  className="text-2xl font-bold text-white"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Taking off in {nextRoundTimer}s
                </motion.div>
              </motion.div>
            ) : hasCrashed ? (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <motion.div 
                  className="text-6xl mb-4"
                  animate={{ 
                    rotate: [0, -45, 45, 0],
                    scale: [1, 0.8, 1.2, 1]
                  }}
                  transition={{ duration: 0.8 }}
                >
                  💥
                </motion.div>
                <motion.div 
                  className="text-4xl font-bold text-red-400 mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  {multiplier.toFixed(2)}x
                </motion.div>
                <motion.div 
                  className="text-xl text-red-300"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  CRASHED!
                </motion.div>
              </motion.div>
            ) : (
              <motion.div className="text-center w-full">
                <motion.div 
                  className="text-6xl mb-4"
                  animate={isFlying ? { 
                    x: ['-50%', '50%', '-50%'],
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0]
                  } : {}}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  ✈️
                </motion.div>
                <motion.div 
                  className={`text-6xl font-bold mb-4 ${getMultiplierColor()}`}
                  animate={{ 
                    scale: [1, 1.05, 1],
                    textShadow: [
                      '0 0 0px rgba(0,0,0,0)',
                      '0 0 20px rgba(59, 130, 246, 0.5)',
                      '0 0 0px rgba(0,0,0,0)'
                    ]
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  {multiplier.toFixed(2)}x
                </motion.div>
                {isGameActive && !hasCashedOut && (
                  <motion.button
                    onClick={cashOut}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-xl"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ 
                      boxShadow: [
                        '0 0 0px rgba(0,0,0,0)',
                        '0 0 30px rgba(34, 197, 94, 0.4)',
                        '0 0 0px rgba(0,0,0,0)'
                      ]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    CASH OUT
                  </motion.button>
                )}
                {hasCashedOut && (
                  <motion.div 
                    className="text-green-400 font-bold text-xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    CASHED OUT AT {multiplier.toFixed(2)}x!
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Balance Display */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 text-center border border-slate-700">
          <div className="text-gray-400 text-sm">Balance</div>
          <motion.div 
            className="text-white text-2xl font-bold"
            key={userBalance}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
          >
            ₹{userBalance.toFixed(2)}
          </motion.div>
        </div>

        {/* Bet Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-3">Bet Amount</h3>
          <div className="flex items-center space-x-4 mb-4">
            <motion.button
              onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Minus className="w-5 h-5" />
            </motion.button>
            <div className="flex-1 text-center">
              <motion.div 
                className="text-2xl font-bold text-white"
                key={betAmount}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                ₹{betAmount}
              </motion.div>
            </div>
            <motion.button
              onClick={() => setBetAmount(betAmount + 10)}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          <motion.button
            onClick={placeBet}
            disabled={isGameActive || nextRoundTimer === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              isGameActive || nextRoundTimer === 0
                ? 'bg-gray-600 text-gray-400'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl'
            }`}
            whileHover={!(isGameActive || nextRoundTimer === 0) ? { scale: 1.02, y: -2 } : {}}
            whileTap={!(isGameActive || nextRoundTimer === 0) ? { scale: 0.98 } : {}}
          >
            {isGameActive ? 'Game In Progress' : nextRoundTimer > 0 ? 'Place Bet' : 'Starting...'}
          </motion.button>
        </div>

        {/* Flight History */}
        <motion.div 
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-white font-semibold mb-3">Flight History</h3>
          <div className="grid grid-cols-5 gap-2">
            {multiplierHistory.map((mult, index) => (
              <motion.div
                key={index}
                className={`p-3 rounded-lg text-center font-bold ${
                  mult < 2 ? 'bg-red-900/50 text-red-400' :
                  mult < 5 ? 'bg-yellow-900/50 text-yellow-400' :
                  'bg-green-900/50 text-green-400'
                }`}
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                {mult.toFixed(2)}x
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
// Enhanced Mines Game with Professional Animations
export function EnhancedMinesGame({ user, onClose }: GameProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [mineCount, setMineCount] = useState(3);
  const [mines, setMines] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [userBalance, setUserBalance] = useState(parseFloat(user.walletBalance));
  const [showExplosion, setShowExplosion] = useState<number | null>(null);
  const [showGemEffect, setShowGemEffect] = useState<number | null>(null);

  const startGame = () => {
    if (betAmount > userBalance) return;
    const minePositions: number[] = [];
    while (minePositions.length < mineCount) {
      const pos = Math.floor(Math.random() * 25);
      if (!minePositions.includes(pos)) minePositions.push(pos);
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
      setGameActive(false);
      setRevealed([...revealed, index]);
      setShowExplosion(index);
    } else {
      const newRevealed = [...revealed, index];
      setRevealed(newRevealed);
      setShowGemEffect(index);
      const safeRevealed = newRevealed.filter(pos => !mines.includes(pos)).length;
      const totalSafe = 25 - mineCount;
      setCurrentMultiplier(Math.pow(totalSafe / (totalSafe - safeRevealed + 1), safeRevealed));
    }
  };

  const cashOut = () => {
    if (!gameActive) return;
    setUserBalance(prev => prev + betAmount * currentMultiplier);
    setGameActive(false);
  };

  const resetGame = () => {
    setMines([]);
    setRevealed([]);
    setGameActive(false);
    setCurrentMultiplier(1);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Enhanced Mines</h1>
            <p className="text-purple-400 text-sm">Professional Gaming Experience</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-purple-500/20">
            <div className="text-purple-400 text-sm">Balance</div>
            <div className="text-white text-lg font-bold">₹{userBalance.toFixed(2)}</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-emerald-500/20">
            <div className="text-emerald-400 text-sm">Multiplier</div>
            <div className="text-emerald-400 text-lg font-bold">{currentMultiplier.toFixed(2)}x</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-red-500/20">
            <div className="text-red-400 text-sm">Mines</div>
            <div className="text-red-400 text-lg font-bold">{mineCount}</div>
          </div>
        </div>

        {!gameActive && (
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Game Settings</h3>
            <div className="mb-4">
              <label className="text-gray-300 text-sm mb-2 block">Bet Amount</label>
              <div className="flex items-center space-x-3">
                <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))} className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl">
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center">
                  <div className="text-white font-bold text-xl">₹{betAmount}</div>
                </div>
                <button onClick={() => setBetAmount(betAmount + 10)} className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-gray-300 text-sm mb-2 block">Number of Mines</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 3, 5].map(count => (
                  <button key={count} onClick={() => setMineCount(count)} className={`py-3 rounded-xl font-medium ${mineCount === count ? "bg-purple-600 text-white" : "bg-slate-700 text-gray-300"}`}>
                    {count} Mine{count > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }, (_, index) => (
              <button key={index} onClick={() => revealTile(index)} disabled={!gameActive} className="aspect-square rounded-lg flex items-center justify-center relative">
                {!revealed.includes(index) ? (
                  <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-400">?</div>
                ) : mines.includes(index) ? (
                  <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center text-3xl">💣</div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-3xl">💎</div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {!gameActive ? (
            <button onClick={startGame} disabled={betAmount > userBalance} className={`w-full py-4 rounded-xl font-bold text-lg ${betAmount > userBalance ? "bg-gray-600 text-gray-400" : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white"}`}>
              {betAmount > userBalance ? "Insufficient Balance" : "Start Game"}
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={cashOut} className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white py-4 rounded-xl font-bold">
                Cash Out ₹{(betAmount * currentMultiplier).toFixed(2)}
              </button>
              <button onClick={resetGame} className="bg-slate-700 text-white py-4 rounded-xl font-bold">Reset</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
