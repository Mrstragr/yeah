import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, TrendingUp, Users, Clock, Zap, Target, Trophy, DollarSign, Plane } from 'lucide-react';

interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  isVerified: boolean;
}

interface AviatorGameProps {
  onBack: () => void;
  user: User;
  onBalanceUpdate: () => void;
}

interface BetResult {
  multiplier: number;
  won: boolean;
  amount: number;
  winAmount: number;
}

interface LiveBet {
  id: string;
  username: string;
  amount: number;
  cashOut?: number;
  status: 'active' | 'cashed' | 'lost';
}

interface GameHistory {
  multiplier: number;
  timestamp: Date;
  crashed: boolean;
}

export default function EnhancedAviatorGame({ onBack, user, onBalanceUpdate }: AviatorGameProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashOut, setAutoCashOut] = useState(2.0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [hasBet, setHasBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [cashOutMultiplier, setCashOutMultiplier] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(parseFloat(user.walletBalance));
  const [liveBets, setLiveBets] = useState<LiveBet[]>([]);
  const [totalPlayers, setTotalPlayers] = useState(1234);
  const [totalWagered, setTotalWagered] = useState(45678);
  const [lastResult, setLastResult] = useState<BetResult | null>(null);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [roundId, setRoundId] = useState('');
  const [planePath, setPlanePath] = useState({ x: 10, y: 50 });
  const [planeTrail, setPlaneTrail] = useState<{x: number, y: number}[]>([]);

  // Sound effects simulation
  const playSound = (type: 'bet' | 'cashout' | 'crash' | 'flying') => {
    // In real implementation, would play actual sounds
    console.log(`Playing ${type} sound`);
  };

  // Generate realistic game history
  useEffect(() => {
    const generateHistory = () => {
      const history: GameHistory[] = [];
      for (let i = 0; i < 20; i++) {
        const rand = Math.random();
        let multiplier;
        
        if (rand < 0.3) {
          multiplier = 1.0 + Math.random() * 0.5; // 30% chance of 1.0-1.5x
        } else if (rand < 0.6) {
          multiplier = 1.5 + Math.random() * 1.5; // 30% chance of 1.5-3.0x
        } else if (rand < 0.85) {
          multiplier = 3.0 + Math.random() * 7.0; // 25% chance of 3.0-10.0x
        } else {
          multiplier = 10.0 + Math.random() * 90.0; // 15% chance of 10x+
        }

        history.push({
          multiplier: Math.round(multiplier * 100) / 100,
          timestamp: new Date(Date.now() - i * 30000),
          crashed: true
        });
      }
      setGameHistory(history.reverse());
    };

    generateHistory();
    generateLiveBets();
  }, []);

  // Generate realistic live bets
  const generateLiveBets = () => {
    const usernames = ['Player1', 'Ace', 'Winner99', 'Lucky7', 'Pro123', 'Beast', 'King', 'Warrior'];
    const bets: LiveBet[] = [];
    
    for (let i = 0; i < 8; i++) {
      bets.push({
        id: `bet_${i}`,
        username: usernames[i] || `Player${i}`,
        amount: Math.floor(Math.random() * 500) + 10,
        status: 'active'
      });
    }
    setLiveBets(bets);
  };

  // Advanced multiplier calculation with realistic crash probability
  const calculateCrashPoint = () => {
    const rand = Math.random();
    
    // Weighted probability distribution
    if (rand < 0.25) return 1.0 + Math.random() * 0.5; // 25% crash between 1.0-1.5x
    if (rand < 0.45) return 1.5 + Math.random() * 1.5; // 20% crash between 1.5-3.0x
    if (rand < 0.65) return 3.0 + Math.random() * 2.0; // 20% crash between 3.0-5.0x
    if (rand < 0.80) return 5.0 + Math.random() * 5.0; // 15% crash between 5.0-10.0x
    if (rand < 0.90) return 10.0 + Math.random() * 10.0; // 10% crash between 10.0-20.0x
    if (rand < 0.96) return 20.0 + Math.random() * 30.0; // 6% crash between 20.0-50.0x
    return 50.0 + Math.random() * 950.0; // 4% crash between 50.0-1000.0x
  };

  // Game loop with realistic timing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let animationFrame: number;

    if (gameState === 'waiting') {
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
      const crashPoint = calculateCrashPoint();
      const startTime = Date.now();
      
      const updateMultiplier = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const newMultiplier = 1 + (elapsed / 2); // Slower progression
        
        // Update plane position
        setPlanePath(prev => ({
          x: Math.min(90, 10 + (elapsed * 8)),
          y: Math.max(10, 50 - (elapsed * 4))
        }));

        // Add to trail
        setPlaneTrail(prev => {
          const newTrail = [...prev, planePath];
          return newTrail.slice(-20); // Keep last 20 points
        });

        if (newMultiplier >= crashPoint) {
          crashGame(crashPoint);
          return;
        }

        setCurrentMultiplier(newMultiplier);

        // Auto cash out check
        if (hasBet && !hasCashedOut && autoCashOut > 0 && newMultiplier >= autoCashOut) {
          handleCashOut();
          return;
        }

        // Update live bets with cash outs
        setLiveBets(prev => prev.map(bet => {
          if (bet.status === 'active' && Math.random() < 0.02) {
            return {
              ...bet,
              cashOut: newMultiplier,
              status: 'cashed'
            };
          }
          return bet;
        }));

        animationFrame = requestAnimationFrame(updateMultiplier);
      };

      updateMultiplier();
    }

    return () => {
      if (interval) clearInterval(interval);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [gameState, hasBet, hasCashedOut, autoCashOut]);

  const startNewRound = () => {
    const newRoundId = `aviator_${Date.now()}`;
    setRoundId(newRoundId);
    setGameState('flying');
    setCurrentMultiplier(1.00);
    setHasCashedOut(false);
    setCashOutMultiplier(0);
    setPlanePath({ x: 10, y: 50 });
    setPlaneTrail([]);
    generateLiveBets();
    playSound('flying');
  };

  const crashGame = (crashPoint: number) => {
    setGameState('crashed');
    setCurrentMultiplier(crashPoint);
    
    // Add to history
    setGameHistory(prev => [{
      multiplier: crashPoint,
      timestamp: new Date(),
      crashed: true
    }, ...prev.slice(0, 19)]);

    // Mark all remaining bets as lost
    setLiveBets(prev => prev.map(bet => 
      bet.status === 'active' ? { ...bet, status: 'lost' } : bet
    ));

    // Check if player lost
    if (hasBet && !hasCashedOut) {
      setLastResult({
        multiplier: crashPoint,
        won: false,
        amount: betAmount,
        winAmount: 0
      });
    }

    playSound('crash');
    
    // Reset for next round
    setTimeout(() => {
      setGameState('waiting');
      setCountdown(5);
      setHasBet(false);
      setLastResult(null);
    }, 3000);
  };

  const placeBet = async () => {
    if (gameState !== 'waiting' || hasBet || betAmount > balance) return;

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
          betAmount,
          betData: {
            autoCashOut,
            roundId
          }
        }),
      });

      if (response.ok) {
        setHasBet(true);
        setBalance(prev => prev - betAmount);
        onBalanceUpdate();
        playSound('bet');

        // Add player bet to live bets
        setLiveBets(prev => [{
          id: `player_${Date.now()}`,
          username: user.username,
          amount: betAmount,
          status: 'active'
        }, ...prev.slice(0, 7)]);
      }
    } catch (error) {
      console.error('Bet error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCashOut = async () => {
    if (!hasBet || hasCashedOut || gameState !== 'flying') return;

    setHasCashedOut(true);
    setCashOutMultiplier(currentMultiplier);
    const winAmount = betAmount * currentMultiplier;
    
    setBalance(prev => prev + winAmount);
    setLastResult({
      multiplier: currentMultiplier,
      won: true,
      amount: betAmount,
      winAmount
    });

    setShowWinAnimation(true);
    setTimeout(() => setShowWinAnimation(false), 2000);

    // Update live bets
    setLiveBets(prev => prev.map(bet => 
      bet.username === user.username && bet.status === 'active' 
        ? { ...bet, cashOut: currentMultiplier, status: 'cashed' }
        : bet
    ));

    onBalanceUpdate();
    playSound('cashout');
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier < 2) return 'text-green-400';
    if (multiplier < 5) return 'text-yellow-400';
    if (multiplier < 10) return 'text-orange-400';
    return 'text-red-400';
  };

  const getHistoryColor = (multiplier: number) => {
    if (multiplier < 2) return 'bg-red-500';
    if (multiplier < 5) return 'bg-yellow-500';
    if (multiplier < 10) return 'bg-green-500';
    return 'bg-purple-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/30">
        <button onClick={onBack} className="text-white p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <div className="text-white font-bold text-lg flex items-center">
            <Plane className="w-5 h-5 mr-2" />
            AVIATOR
          </div>
          <div className="text-blue-300 text-sm">Round: {roundId.slice(-6)}</div>
        </div>
        <div className="text-right">
          <div className="text-blue-300 text-sm">Balance</div>
          <div className="text-white font-bold">₹{balance.toFixed(2)}</div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="px-4 py-2 bg-black/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-green-400 font-bold text-lg">{totalPlayers}</div>
            <div className="text-gray-400 text-xs">Players</div>
          </div>
          <div>
            <div className="text-yellow-400 font-bold text-lg">₹{totalWagered.toLocaleString()}</div>
            <div className="text-gray-400 text-xs">Total Bet</div>
          </div>
          <div>
            <div className="text-blue-400 font-bold text-lg">
              {gameHistory.length > 0 ? `${gameHistory[0].multiplier}x` : '---'}
            </div>
            <div className="text-gray-400 text-xs">Last Crash</div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative h-80 mx-4 my-4 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl overflow-hidden border border-blue-500/30">
        {/* Game Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Plane Trail */}
        <svg className="absolute inset-0 w-full h-full">
          <path
            d={`M ${planeTrail.map((point, i) => 
              `${i === 0 ? 'M' : 'L'} ${point.x}% ${point.y}%`
            ).join(' ')}`}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            opacity="0.6"
          />
        </svg>

        {/* Plane */}
        <motion.div
          className="absolute w-12 h-12 text-4xl"
          style={{
            left: `${planePath.x}%`,
            top: `${planePath.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          animate={gameState === 'crashed' ? { 
            rotate: [0, 180, 360],
            scale: [1, 0.5, 0]
          } : {
            rotate: gameState === 'flying' ? -15 : 0
          }}
          transition={{ duration: gameState === 'crashed' ? 1 : 0.5 }}
        >
          ✈️
        </motion.div>

        {/* Multiplier Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center"
            animate={gameState === 'crashed' ? { scale: [1, 1.5, 0] } : { scale: 1 }}
          >
            <div className={`text-6xl font-bold ${
              gameState === 'crashed' ? 'text-red-500' : 
              gameState === 'flying' ? getMultiplierColor(currentMultiplier) : 'text-white'
            }`}>
              {gameState === 'waiting' ? countdown : 
               gameState === 'crashed' ? 'CRASHED!' : 
               `${currentMultiplier.toFixed(2)}x`}
            </div>
            {gameState === 'waiting' && (
              <div className="text-white text-lg mt-2">Next round in...</div>
            )}
          </motion.div>
        </div>

        {/* Win Animation */}
        <AnimatePresence>
          {showWinAnimation && lastResult?.won && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-green-500/20"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <div className="text-center text-white">
                <div className="text-4xl font-bold">WON!</div>
                <div className="text-2xl">₹{lastResult.winAmount.toFixed(2)}</div>
                <div className="text-lg">{lastResult.multiplier.toFixed(2)}x</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Betting Controls */}
      <div className="px-4 mb-4">
        <div className="bg-black/30 rounded-2xl p-4">
          {/* Bet Amount */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Bet Amount</span>
              <span className="text-blue-400 text-sm">Min: ₹10 | Max: ₹10,000</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                className="bg-red-500 p-3 rounded-lg text-white font-bold"
                disabled={gameState === 'flying'}
              >
                -10
              </button>
              <div className="text-white text-2xl font-bold">₹{betAmount}</div>
              <button
                onClick={() => setBetAmount(Math.min(10000, betAmount + 10))}
                className="bg-green-500 p-3 rounded-lg text-white font-bold"
                disabled={gameState === 'flying'}
              >
                +10
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[10, 50, 100, 500].map(amount => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  disabled={gameState === 'flying'}
                  className={`py-2 rounded-lg font-medium ${
                    betAmount === amount 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Cash Out */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Auto Cash Out</span>
              <button
                onClick={() => setAutoCashOut(0)}
                className={`text-sm px-2 py-1 rounded ${
                  autoCashOut === 0 ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'
                }`}
              >
                OFF
              </button>
            </div>
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setAutoCashOut(Math.max(1.1, autoCashOut - 0.1))}
                className="bg-orange-500 p-2 rounded-lg text-white"
                disabled={gameState === 'flying'}
              >
                -0.1
              </button>
              <div className="text-white text-xl font-bold">
                {autoCashOut > 0 ? `${autoCashOut.toFixed(1)}x` : 'OFF'}
              </div>
              <button
                onClick={() => setAutoCashOut(autoCashOut + 0.1)}
                className="bg-orange-500 p-2 rounded-lg text-white"
                disabled={gameState === 'flying'}
              >
                +0.1
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={placeBet}
              disabled={gameState !== 'waiting' || hasBet || loading || betAmount > balance}
              className={`py-4 rounded-xl font-bold text-lg ${
                gameState !== 'waiting' || hasBet || betAmount > balance
                  ? 'bg-gray-600 text-gray-400'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {loading ? 'Placing...' : 
               hasBet ? 'Bet Placed' : 
               `Bet ₹${betAmount}`}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCashOut}
              disabled={!hasBet || hasCashedOut || gameState !== 'flying'}
              className={`py-4 rounded-xl font-bold text-lg ${
                !hasBet || hasCashedOut || gameState !== 'flying'
                  ? 'bg-gray-600 text-gray-400'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {hasCashedOut ? `Cashed ${cashOutMultiplier.toFixed(2)}x` : 
               hasBet && gameState === 'flying' ? `Cash Out ${currentMultiplier.toFixed(2)}x` :
               'Cash Out'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Live Bets */}
      <div className="px-4 mb-4">
        <div className="bg-black/30 rounded-2xl p-4">
          <div className="text-white font-semibold mb-3 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Live Bets
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {liveBets.map(bet => (
              <div key={bet.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="text-blue-300">{bet.username}</div>
                  <div className="text-yellow-400">₹{bet.amount}</div>
                </div>
                <div className={`font-bold ${
                  bet.status === 'cashed' ? 'text-green-400' :
                  bet.status === 'lost' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {bet.status === 'cashed' ? `${bet.cashOut?.toFixed(2)}x` :
                   bet.status === 'lost' ? 'Lost' : 'Active'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game History */}
      <div className="px-4 pb-20">
        <div className="bg-black/30 rounded-2xl p-4">
          <div className="text-white font-semibold mb-3 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Recent Results
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {gameHistory.slice(0, 10).map((game, index) => (
              <div
                key={index}
                className={`min-w-[60px] h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                  getHistoryColor(game.multiplier)
                }`}
              >
                {game.multiplier.toFixed(2)}x
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}