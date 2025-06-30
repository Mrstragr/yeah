import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Clock, TrendingUp, Zap, DollarSign } from 'lucide-react';

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

interface LiveBet {
  id: string;
  username: string;
  amount: number;
  multiplier?: number;
  status: 'active' | 'cashed' | 'lost';
}

interface GameHistory {
  multiplier: number;
  id: string;
}

export default function OfficialAviatorGame({ onBack, user, onBalanceUpdate }: AviatorGameProps) {
  // Game State
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [countdown, setCountdown] = useState(5);
  const [gameId, setGameId] = useState(Date.now().toString());
  
  // Betting State
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashOut, setAutoCashOut] = useState(2.0);
  const [hasBet, setHasBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [cashOutMultiplier, setCashOutMultiplier] = useState(0);
  const [balance, setBalance] = useState(parseFloat(user.walletBalance));
  
  // Live Data
  const [liveBets, setLiveBets] = useState<LiveBet[]>([]);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([
    { multiplier: 1.23, id: '1' },
    { multiplier: 2.45, id: '2' },
    { multiplier: 1.78, id: '3' },
    { multiplier: 3.21, id: '4' },
    { multiplier: 1.56, id: '5' },
    { multiplier: 4.12, id: '6' },
    { multiplier: 1.89, id: '7' },
    { multiplier: 2.67, id: '8' },
  ]);
  
  // Animation
  const [planePosition, setPlanePosition] = useState({ x: 5, y: 80 });
  const gameInterval = useRef<NodeJS.Timeout>();
  const multiplierInterval = useRef<NodeJS.Timeout>();

  // Generate realistic live bets
  useEffect(() => {
    const names = ['Player1', 'Raj_Kumar', 'Priya123', 'AviatorPro', 'Lucky777', 'GameMaster', 'WinBig'];
    const newLiveBets: LiveBet[] = [];
    
    for (let i = 0; i < 8; i++) {
      newLiveBets.push({
        id: `bet-${i}`,
        username: names[Math.floor(Math.random() * names.length)],
        amount: Math.floor(Math.random() * 500) + 10,
        status: 'active'
      });
    }
    setLiveBets(newLiveBets);
  }, [gameState]);

  // Main game loop
  useEffect(() => {
    if (gameState === 'waiting') {
      const countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            startGame();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdownTimer);
    }
  }, [gameState]);

  const startGame = () => {
    setGameState('flying');
    setCurrentMultiplier(1.00);
    setPlanePosition({ x: 5, y: 80 });
    setHasCashedOut(false);
    setCashOutMultiplier(0);
    setGameId(Date.now().toString());
    
    // Generate crash point
    const crashPoint = generateCrashPoint();
    let multiplier = 1.00;
    
    multiplierInterval.current = setInterval(() => {
      multiplier += 0.01;
      setCurrentMultiplier(multiplier);
      
      // Update plane position
      const progress = Math.min((multiplier - 1) / (crashPoint - 1), 1);
      setPlanePosition({
        x: 5 + (progress * 85),
        y: 80 - (progress * 70)
      });
      
      // Auto cash out check
      if (autoCashOut > 0 && multiplier >= autoCashOut && hasBet && !hasCashedOut) {
        handleCashOut();
      }
      
      // Crash check
      if (multiplier >= crashPoint) {
        crash();
      }
    }, 100);
  };

  const generateCrashPoint = (): number => {
    // Weighted random for realistic crash points
    const rand = Math.random();
    if (rand < 0.5) return 1 + Math.random() * 1; // 1.0 - 2.0 (50%)
    if (rand < 0.8) return 2 + Math.random() * 3; // 2.0 - 5.0 (30%)
    if (rand < 0.95) return 5 + Math.random() * 10; // 5.0 - 15.0 (15%)
    return 15 + Math.random() * 35; // 15.0 - 50.0 (5%)
  };

  const crash = () => {
    if (multiplierInterval.current) {
      clearInterval(multiplierInterval.current);
    }
    
    setGameState('crashed');
    
    // Update live bets
    setLiveBets(prev => prev.map(bet => ({
      ...bet,
      status: bet.status === 'cashed' ? 'cashed' : 'lost'
    })));
    
    // Add to history
    setGameHistory(prev => [
      { multiplier: currentMultiplier, id: gameId },
      ...prev.slice(0, 19)
    ]);
    
    setTimeout(() => {
      setGameState('waiting');
      setCountdown(5);
      setHasBet(false);
    }, 3000);
  };

  const handleBet = async () => {
    if (betAmount > balance || gameState !== 'waiting') return;
    
    setHasBet(true);
    setBalance(prev => prev - betAmount);
    
    // Add user to live bets
    setLiveBets(prev => [
      { id: 'user', username: user.username, amount: betAmount, status: 'active' },
      ...prev.slice(0, 7)
    ]);
  };

  const handleCashOut = () => {
    if (!hasBet || hasCashedOut || gameState !== 'flying') return;
    
    setHasCashedOut(true);
    setCashOutMultiplier(currentMultiplier);
    const winAmount = betAmount * currentMultiplier;
    setBalance(prev => prev + winAmount);
    
    // Update user bet in live bets
    setLiveBets(prev => prev.map(bet =>
      bet.id === 'user' ? { ...bet, multiplier: currentMultiplier, status: 'cashed' } : bet
    ));
    
    onBalanceUpdate();
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier < 2) return 'text-white';
    if (multiplier < 5) return 'text-green-400';
    if (multiplier < 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHistoryColor = (multiplier: number) => {
    if (multiplier < 2) return 'bg-gray-600';
    if (multiplier < 5) return 'bg-green-600';
    if (multiplier < 10) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-black text-white">
      {/* Header - Exact Official Style */}
      <div className="bg-black/50 p-4 flex items-center justify-between border-b border-gray-700">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-white hover:text-blue-400"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="font-semibold">Back</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-yellow-400">AVIATOR</h1>
          <div className="text-sm text-gray-300">Official Game</div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-green-400">₹{balance.toFixed(2)}</div>
          <div className="text-sm text-gray-300">Balance</div>
        </div>
      </div>

      {/* Game Area - Official Layout */}
      <div className="relative h-96 bg-gradient-to-br from-blue-800 to-black overflow-hidden">
        {/* Stars Background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Airplane */}
        <motion.div
          className="absolute text-4xl"
          style={{
            left: `${planePosition.x}%`,
            top: `${planePosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          animate={gameState === 'crashed' ? { 
            rotate: [0, 180, 360],
            scale: [1, 0.5, 0],
            opacity: [1, 0.5, 0]
          } : {
            rotate: gameState === 'flying' ? -15 : 0
          }}
          transition={{ duration: gameState === 'crashed' ? 2 : 0.5 }}
        >
          ✈️
        </motion.div>

        {/* Flight Path */}
        {gameState === 'flying' && (
          <svg className="absolute inset-0 w-full h-full">
            <path
              d={`M ${planePosition.x * 4} ${planePosition.y * 3.84} Q 200 300 400 100`}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
            />
          </svg>
        )}

        {/* Main Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="text-center"
            animate={gameState === 'crashed' ? { scale: [1, 1.2, 0.8] } : {}}
          >
            <div className={`text-8xl font-bold ${
              gameState === 'crashed' ? 'text-red-500' : 
              gameState === 'flying' ? getMultiplierColor(currentMultiplier) : 
              'text-white'
            }`}>
              {gameState === 'waiting' ? countdown :
               gameState === 'crashed' ? 'FLEW AWAY!' :
               `${currentMultiplier.toFixed(2)}x`}
            </div>
            
            {gameState === 'waiting' && (
              <div className="text-yellow-400 text-xl mt-4 animate-pulse">
                Waiting for next round...
              </div>
            )}
            
            {gameState === 'flying' && (
              <div className="text-green-400 text-xl mt-4">
                Flying...
              </div>
            )}
          </motion.div>
        </div>

        {/* Round ID Display */}
        <div className="absolute top-4 left-4 bg-black/50 rounded-lg p-2">
          <div className="text-xs text-gray-400">Round</div>
          <div className="text-sm font-mono text-white">#{gameId.slice(-6)}</div>
        </div>
      </div>

      {/* Statistics Bar - Official Style */}
      <div className="bg-black/80 p-3 border-y border-gray-700">
        <div className="flex justify-around text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">1,234</div>
            <div className="text-xs text-gray-400">Players</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">₹45.6K</div>
            <div className="text-xs text-gray-400">Total Bet</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">₹89.2K</div>
            <div className="text-xs text-gray-400">Total Win</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">2.45x</div>
            <div className="text-xs text-gray-400">Avg Multi</div>
          </div>
        </div>
      </div>

      {/* Game History - Official Design */}
      <div className="p-4 bg-black/60">
        <div className="text-sm text-gray-400 mb-2">Recent Results</div>
        <div className="flex space-x-2 overflow-x-auto">
          {gameHistory.map((game, index) => (
            <div
              key={game.id}
              className={`min-w-[60px] h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                getHistoryColor(game.multiplier)
              }`}
            >
              {game.multiplier.toFixed(2)}x
            </div>
          ))}
        </div>
      </div>

      {/* Betting Panel - Exact Official Layout */}
      <div className="p-4 bg-black/80">
        <div className="grid grid-cols-2 gap-4">
          {/* Bet Amount */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Bet Amount</div>
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                className="bg-red-600 px-4 py-2 rounded-lg text-white font-bold"
                disabled={gameState === 'flying'}
              >
                -
              </button>
              <div className="text-2xl font-bold text-white">₹{betAmount}</div>
              <button
                onClick={() => setBetAmount(Math.min(5000, betAmount + 10))}
                className="bg-green-600 px-4 py-2 rounded-lg text-white font-bold"
                disabled={gameState === 'flying'}
              >
                +
              </button>
            </div>
            
            {/* Quick Amounts */}
            <div className="grid grid-cols-3 gap-2">
              {[10, 100, 500].map(amount => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  disabled={gameState === 'flying'}
                  className={`py-2 px-3 rounded font-medium text-sm ${
                    betAmount === amount 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Cash Out */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Auto Cash Out</div>
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setAutoCashOut(Math.max(0, autoCashOut - 0.1))}
                className="bg-red-600 px-4 py-2 rounded-lg text-white font-bold"
              >
                -
              </button>
              <div className="text-2xl font-bold text-white">
                {autoCashOut === 0 ? 'OFF' : `${autoCashOut.toFixed(1)}x`}
              </div>
              <button
                onClick={() => setAutoCashOut(Math.min(50, autoCashOut + 0.1))}
                className="bg-green-600 px-4 py-2 rounded-lg text-white font-bold"
              >
                +
              </button>
            </div>
            
            {/* Quick Multipliers */}
            <div className="grid grid-cols-3 gap-2">
              {[1.5, 2.0, 3.0].map(multi => (
                <button
                  key={multi}
                  onClick={() => setAutoCashOut(multi)}
                  className={`py-2 px-3 rounded font-medium text-sm ${
                    autoCashOut === multi 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {multi}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            onClick={handleBet}
            disabled={gameState !== 'waiting' || hasBet || betAmount > balance}
            className={`py-4 rounded-lg font-bold text-lg transition-colors ${
              gameState !== 'waiting' || hasBet || betAmount > balance
                ? 'bg-gray-600 text-gray-400'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {hasBet ? 'Bet Placed' : `Bet ₹${betAmount}`}
          </button>

          <button
            onClick={handleCashOut}
            disabled={!hasBet || hasCashedOut || gameState !== 'flying'}
            className={`py-4 rounded-lg font-bold text-lg transition-colors ${
              !hasBet || hasCashedOut || gameState !== 'flying'
                ? 'bg-gray-600 text-gray-400'
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
          >
            {hasCashedOut ? `Cashed ${cashOutMultiplier.toFixed(2)}x` :
             hasBet && gameState === 'flying' ? `Cash Out ${currentMultiplier.toFixed(2)}x` :
             'Cash Out'}
          </button>
        </div>
      </div>

      {/* Live Bets - Official Style */}
      <div className="p-4 bg-black/60">
        <div className="text-sm text-gray-400 mb-3 flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Live Bets
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {liveBets.map(bet => (
            <div key={bet.id} className="flex items-center justify-between text-sm bg-gray-800/50 rounded p-2">
              <div className="flex items-center space-x-3">
                <div className="text-blue-300 font-medium">{bet.username}</div>
                <div className="text-yellow-400">₹{bet.amount}</div>
              </div>
              <div className={`font-bold ${
                bet.status === 'cashed' ? 'text-green-400' :
                bet.status === 'lost' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {bet.status === 'cashed' ? `${bet.multiplier?.toFixed(2)}x` :
                 bet.status === 'lost' ? 'Lost' : 'Flying...'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}