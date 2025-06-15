import React, { useState, useEffect, useRef } from 'react';
import { X, TrendingUp, Plane, DollarSign, Clock, Users, Target } from 'lucide-react';
import { BettingChip, GameTimer, WinCelebration } from '../AuthenticGameElements';
import { MultiplierDisplay } from '../AuthenticAnimations';

interface AviatorGameProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onTransaction: (amount: number, type: 'deposit' | 'withdraw') => void;
}

interface FlightResult {
  id: string;
  multiplier: number;
  crashedAt: number;
  time: string;
}

interface Player {
  name: string;
  bet: number;
  cashedOut?: number;
  winAmount?: number;
}

export function AviatorGame({ isOpen, onClose, walletBalance, onTransaction }: AviatorGameProps) {
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashOut, setAutoCashOut] = useState<number | null>(null);
  const [hasBet, setHasBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [timeToNextRound, setTimeToNextRound] = useState(5);
  const [flightHistory, setFlightHistory] = useState<FlightResult[]>([
    { id: '1', multiplier: 2.45, crashedAt: 2.45, time: '15:29:30' },
    { id: '2', multiplier: 1.23, crashedAt: 1.23, time: '15:28:45' },
    { id: '3', multiplier: 8.67, crashedAt: 8.67, time: '15:28:00' },
    { id: '4', multiplier: 1.05, crashedAt: 1.05, time: '15:27:15' },
    { id: '5', multiplier: 3.21, crashedAt: 3.21, time: '15:26:30' }
  ]);
  const [players, setPlayers] = useState<Player[]>([
    { name: 'Player1', bet: 100, cashedOut: 1.5, winAmount: 150 },
    { name: 'Player2', bet: 50, cashedOut: 2.2, winAmount: 110 },
    { name: 'Player3', bet: 200 },
    { name: 'You', bet: 0 }
  ]);
  const [winAmount, setWinAmount] = useState(0);
  const animationRef = useRef<number>();

  const quickAmounts = [10, 50, 100, 500, 1000];
  const quickCashOuts = [1.5, 2.0, 5.0, 10.0];

  useEffect(() => {
    if (!isOpen) return;

    if (gameState === 'waiting') {
      const waitTimer = setInterval(() => {
        setTimeToNextRound(prev => {
          if (prev <= 1) {
            startFlight();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(waitTimer);
    }

    if (gameState === 'flying') {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const newMultiplier = 1 + (elapsed * 0.1) + (elapsed * elapsed * 0.01);
        
        setCurrentMultiplier(newMultiplier);

        // Auto cash out
        if (autoCashOut && newMultiplier >= autoCashOut && hasBet && !hasCashedOut) {
          handleCashOut();
          return;
        }

        // Random crash
        const crashProbability = Math.pow(elapsed / 10, 2) * 0.01;
        if (Math.random() < crashProbability || newMultiplier > 20) {
          handleCrash(newMultiplier);
          return;
        }

        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [gameState, autoCashOut, hasBet, hasCashedOut, isOpen]);

  const startFlight = () => {
    setGameState('flying');
    setCurrentMultiplier(1.00);
    setHasCashedOut(false);
    setWinAmount(0);
    
    // Reset player states
    setPlayers(prev => prev.map(player => ({
      ...player,
      cashedOut: undefined,
      winAmount: undefined
    })));
  };

  const handlePlaceBet = () => {
    if (betAmount > walletBalance) {
      alert('Insufficient balance');
      return;
    }

    if (gameState !== 'waiting') {
      alert('Wait for next round to place bet');
      return;
    }

    setHasBet(true);
    onTransaction(betAmount, 'withdraw');
    
    setPlayers(prev => prev.map(player => 
      player.name === 'You' ? { ...player, bet: betAmount } : player
    ));
  };

  const handleCashOut = () => {
    if (!hasBet || hasCashedOut || gameState !== 'flying') return;

    const winnings = betAmount * currentMultiplier;
    setHasCashedOut(true);
    setWinAmount(winnings);
    onTransaction(winnings, 'deposit');

    setPlayers(prev => prev.map(player => 
      player.name === 'You' 
        ? { ...player, cashedOut: currentMultiplier, winAmount: winnings }
        : player
    ));
  };

  const handleCrash = (crashMultiplier: number) => {
    setGameState('crashed');
    
    const newResult: FlightResult = {
      id: Date.now().toString(),
      multiplier: crashMultiplier,
      crashedAt: crashMultiplier,
      time: new Date().toLocaleTimeString('en-US', { hour12: false })
    };

    setFlightHistory(prev => [newResult, ...prev.slice(0, 9)]);

    // Simulate other players cashing out
    setPlayers(prev => prev.map(player => {
      if (player.name !== 'You' && !player.cashedOut && Math.random() > 0.3) {
        const cashOutAt = 1 + Math.random() * (crashMultiplier - 1);
        return {
          ...player,
          cashedOut: cashOutAt,
          winAmount: player.bet * cashOutAt
        };
      }
      return player;
    }));

    setTimeout(() => {
      setGameState('waiting');
      setHasBet(false);
      setTimeToNextRound(5);
    }, 3000);
  };

  const getMultiplierColor = () => {
    if (currentMultiplier < 2) return 'text-green-500';
    if (currentMultiplier < 5) return 'text-yellow-500';
    if (currentMultiplier < 10) return 'text-orange-500';
    return 'text-red-500';
  };

  const getHistoryColor = (multiplier: number) => {
    if (multiplier < 2) return 'bg-red-500';
    if (multiplier < 5) return 'bg-yellow-500';
    if (multiplier < 10) return 'bg-green-500';
    return 'bg-purple-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 text-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Plane className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Aviator</h2>
                <p className="text-sm opacity-90">Real-time Multiplier Game</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Game Display */}
            <div className="bg-gray-800 rounded-xl p-6 h-64 relative overflow-hidden">
              {/* Background Grid */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Multiplier Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                {gameState === 'waiting' ? (
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">Next Round</div>
                    <div className="text-2xl text-blue-400">{timeToNextRound}s</div>
                  </div>
                ) : gameState === 'flying' ? (
                  <div className="text-center">
                    <div className={`text-6xl font-bold mb-4 ${getMultiplierColor()}`}>
                      {currentMultiplier.toFixed(2)}x
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Plane className={`w-8 h-8 text-blue-400 ${gameState === 'flying' ? 'animate-bounce' : ''}`} />
                      <span className="text-lg">Flying...</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-4 text-red-500">
                      {currentMultiplier.toFixed(2)}x
                    </div>
                    <div className="text-2xl text-red-400">CRASHED!</div>
                  </div>
                )}
              </div>

              {/* Plane Animation */}
              {gameState === 'flying' && (
                <div 
                  className="absolute bottom-4 left-4 transition-all duration-1000"
                  style={{
                    transform: `translateX(${(currentMultiplier - 1) * 50}px) translateY(-${(currentMultiplier - 1) * 20}px)`
                  }}
                >
                  <Plane className="w-6 h-6 text-blue-400 transform rotate-45" />
                </div>
              )}
            </div>

            {/* Betting Controls */}
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bet Amount */}
                <div>
                  <label className="block text-sm font-medium mb-2">Bet Amount</label>
                  <div className="flex space-x-2 mb-2">
                    {quickAmounts.map(amount => (
                      <button
                        key={amount}
                        onClick={() => setBetAmount(amount)}
                        disabled={gameState === 'flying'}
                        className={`px-3 py-1 rounded text-sm transition-all disabled:opacity-50 ${
                          betAmount === amount 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
                    disabled={gameState === 'flying'}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    placeholder="Enter bet amount"
                  />
                </div>

                {/* Auto Cash Out */}
                <div>
                  <label className="block text-sm font-medium mb-2">Auto Cash Out</label>
                  <div className="flex space-x-2 mb-2">
                    {quickCashOuts.map(multiplier => (
                      <button
                        key={multiplier}
                        onClick={() => setAutoCashOut(multiplier)}
                        className={`px-3 py-1 rounded text-sm transition-all ${
                          autoCashOut === multiplier 
                            ? 'bg-yellow-500 text-black' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {multiplier}x
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={autoCashOut || ''}
                    onChange={(e) => setAutoCashOut(parseFloat(e.target.value) || null)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-yellow-500"
                    placeholder="Auto cash out at"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-4">
                {!hasBet ? (
                  <button
                    onClick={handlePlaceBet}
                    disabled={gameState === 'flying' || betAmount <= 0 || betAmount > walletBalance}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 text-white py-3 px-6 rounded-lg font-bold transition-all"
                  >
                    Place Bet (₹{betAmount})
                  </button>
                ) : !hasCashedOut && gameState === 'flying' ? (
                  <button
                    onClick={handleCashOut}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-bold transition-all animate-pulse"
                  >
                    Cash Out (₹{(betAmount * currentMultiplier).toFixed(2)})
                  </button>
                ) : (
                  <div className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-bold text-center">
                    {hasCashedOut ? `Cashed Out: ₹${winAmount.toFixed(2)}` : 'Waiting...'}
                  </div>
                )}
              </div>

              <div className="mt-2 text-sm text-gray-400 text-center">
                Balance: ₹{walletBalance.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Live Players */}
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Live Bets
              </h3>
              <div className="space-y-2">
                {players.filter(p => p.bet > 0).map((player, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className={player.name === 'You' ? 'text-blue-400 font-bold' : 'text-gray-300'}>
                      {player.name}
                    </span>
                    <div className="text-right">
                      <div>₹{player.bet}</div>
                      {player.cashedOut && (
                        <div className="text-green-400 text-xs">
                          @{player.cashedOut.toFixed(2)}x
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flight History */}
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Flight History
              </h3>
              <div className="grid grid-cols-5 gap-1">
                {flightHistory.map((result, index) => (
                  <div
                    key={result.id}
                    className={`${getHistoryColor(result.multiplier)} text-white text-xs p-2 rounded text-center font-bold`}
                    title={`${result.multiplier.toFixed(2)}x at ${result.time}`}
                  >
                    {result.multiplier.toFixed(1)}x
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Statistics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Average:</span>
                  <span>
                    {(flightHistory.reduce((sum, r) => sum + r.multiplier, 0) / flightHistory.length).toFixed(2)}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Highest:</span>
                  <span className="text-green-400">
                    {Math.max(...flightHistory.map(r => r.multiplier)).toFixed(2)}x
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Lowest:</span>
                  <span className="text-red-400">
                    {Math.min(...flightHistory.map(r => r.multiplier)).toFixed(2)}x
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}