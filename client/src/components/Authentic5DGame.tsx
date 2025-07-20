import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Volume2 } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function Authentic5DGame({ onBack }: Props) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentPeriod, setCurrentPeriod] = useState(20250721001);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBets, setSelectedBets] = useState<string[]>([]);
  const [balance, setBalance] = useState(12580.45);
  const [gamePhase, setGamePhase] = useState<'betting' | 'drawing' | 'result'>('betting');
  const [lastResult, setLastResult] = useState([3, 7, 2, 9, 1]);
  const [ballAnimation, setBallAnimation] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (gamePhase === 'betting') {
            setGamePhase('drawing');
            setBallAnimation(true);
            return 8;
          } else if (gamePhase === 'drawing') {
            setGamePhase('result');
            // Generate 5D result
            const newResult = Array(5).fill(0).map(() => Math.floor(Math.random() * 10));
            setLastResult(newResult);
            setBallAnimation(false);
            return 12;
          } else {
            setGamePhase('betting');
            setCurrentPeriod(prev => prev + 1);
            setSelectedBets([]);
            return 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase]);

  const handleBet = (betType: string) => {
    if (gamePhase !== 'betting' || balance < betAmount) return;
    
    if (selectedBets.includes(betType)) {
      setSelectedBets(prev => prev.filter(bet => bet !== betType));
      setBalance(prev => prev + betAmount);
    } else {
      setSelectedBets(prev => [...prev, betType]);
      setBalance(prev => prev - betAmount);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSum = (numbers: number[]): number => {
    return numbers.reduce((sum, num) => sum + num, 0);
  };

  const gameHistory = [
    { period: 20250721000, numbers: [5, 8, 3, 2, 7], sum: 25 },
    { period: 20250720999, numbers: [1, 9, 6, 4, 3], sum: 23 },
    { period: 20250720998, numbers: [8, 2, 7, 9, 1], sum: 27 },
    { period: 20250720997, numbers: [4, 6, 8, 5, 2], sum: 25 },
    { period: 20250720996, numbers: [9, 1, 4, 7, 6], sum: 27 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-800">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <div className="text-2xl font-bold">5D</div>
              <div className="text-indigo-100 text-sm">Number Game</div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Balance Display */}
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-indigo-100 text-sm">Available Balance</div>
                <div className="text-white text-2xl font-bold">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              </div>
              <div className="text-right">
                <div className="text-indigo-100 text-sm">Total Bets</div>
                <div className="text-white text-xl font-bold">₹{selectedBets.length * betAmount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Timer and Period */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 mx-6 mt-6 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-orange-100 text-sm mb-1">Current Period</div>
                <div className="text-white text-lg font-bold">{currentPeriod}</div>
              </div>
              <div className="text-right">
                <div className="text-orange-100 text-sm mb-1">
                  {gamePhase === 'betting' ? 'Betting Time' : 
                   gamePhase === 'drawing' ? 'Drawing Numbers...' : 'Result'}
                </div>
                <div className="text-white text-3xl font-bold font-mono">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {/* Game Phase Indicator */}
            <div className="flex justify-center">
              <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                gamePhase === 'betting' ? 'bg-green-500' : 
                gamePhase === 'drawing' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}>
                {gamePhase === 'betting' ? '🎯 Place Your Bets' : 
                 gamePhase === 'drawing' ? '🎱 Drawing Numbers' : '🏆 Result Declared'}
              </div>
            </div>
          </div>
        </div>

        {/* Number Display */}
        <div className="mx-6 mt-6">
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6">
            <div className="text-center mb-4">
              <div className="text-gray-600 text-sm mb-2">Winning Numbers</div>
              <div className="flex justify-center space-x-3 mb-4">
                {(gamePhase === 'result' ? lastResult : [0, 0, 0, 0, 0]).map((num, index) => (
                  <motion.div
                    key={index}
                    animate={ballAnimation ? { 
                      y: [0, -20, 0],
                      rotate: [0, 180, 360] 
                    } : {}}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.1,
                      repeat: ballAnimation ? Infinity : 0,
                      repeatType: "loop"
                    }}
                    className="relative"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white">
                      {gamePhase === 'result' ? num : '?'}
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-500">
                      {index + 1}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {gamePhase === 'result' && (
                <div className="text-center">
                  <div className="text-gray-600 text-sm mb-1">Total Sum</div>
                  <div className="text-4xl font-bold text-purple-600">
                    {getSum(lastResult)}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    {getSum(lastResult) >= 23 ? 'BIG (23-45)' : 'SMALL (0-22)'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Betting Options */}
        <div className="px-6 py-4">
          
          {/* Sum Betting */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Sum Betting (2X)</h3>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBet('sum-small')}
                disabled={gamePhase !== 'betting'}
                className={`${selectedBets.includes('sum-small') ? 'bg-blue-600 ring-2 ring-yellow-400' : 'bg-blue-500 hover:bg-blue-600'} text-white py-4 rounded-xl font-bold text-lg ${
                  gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                SMALL
                <div className="text-sm opacity-90 mt-1">0-22 • 2X</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBet('sum-big')}
                disabled={gamePhase !== 'betting'}
                className={`${selectedBets.includes('sum-big') ? 'bg-orange-600 ring-2 ring-yellow-400' : 'bg-orange-500 hover:bg-orange-600'} text-white py-4 rounded-xl font-bold text-lg ${
                  gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                BIG
                <div className="text-sm opacity-90 mt-1">23-45 • 2X</div>
              </motion.button>
            </div>
          </div>

          {/* Position Betting */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Position Betting (10X)</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((position) => (
                <div key={position} className="bg-gray-100 rounded-xl p-3">
                  <div className="text-sm font-semibold text-gray-600 mb-2">Position {position}</div>
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <motion.button
                        key={num}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBet(`pos-${position}-${num}`)}
                        disabled={gamePhase !== 'betting'}
                        className={`${selectedBets.includes(`pos-${position}-${num}`) ? 'bg-purple-600 ring-2 ring-yellow-400' : 'bg-purple-500 hover:bg-purple-600'} text-white w-8 h-8 rounded-lg font-bold text-sm ${
                          gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {num}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* First/Last Betting */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">First & Last Position (10X)</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-600 mb-2">First Number</div>
                <div className="grid grid-cols-5 gap-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <motion.button
                      key={num}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBet(`first-${num}`)}
                      disabled={gamePhase !== 'betting'}
                      className={`${selectedBets.includes(`first-${num}`) ? 'bg-green-600 ring-1 ring-yellow-400' : 'bg-green-500 hover:bg-green-600'} text-white w-8 h-8 rounded-lg font-bold text-xs ${
                        gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-600 mb-2">Last Number</div>
                <div className="grid grid-cols-5 gap-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <motion.button
                      key={num}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBet(`last-${num}`)}
                      disabled={gamePhase !== 'betting'}
                      className={`${selectedBets.includes(`last-${num}`) ? 'bg-red-600 ring-1 ring-yellow-400' : 'bg-red-500 hover:bg-red-600'} text-white w-8 h-8 rounded-lg font-bold text-xs ${
                        gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Straight Betting */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Straight Betting (100000X)</h3>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-white">
              <div className="text-center mb-3">
                <div className="text-sm opacity-90 mb-2">Enter 5-digit combination</div>
                <div className="flex justify-center space-x-2 mb-3">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <input
                      key={index}
                      type="number"
                      min="0"
                      max="9"
                      className="w-12 h-12 bg-white/20 rounded-lg text-center font-bold text-xl border-2 border-white/30 focus:border-white focus:outline-none"
                      placeholder="0"
                    />
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBet('straight-combination')}
                  disabled={gamePhase !== 'betting'}
                  className={`bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-xl font-bold text-sm transition-all ${
                    gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  BET STRAIGHT ₹{betAmount}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Bet Amount Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Bet Amount</h3>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[10, 50, 100, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`py-2 px-3 rounded-lg font-bold text-sm transition-all ${
                    betAmount === amount 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1000, 5000, 10000, 50000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`py-2 px-3 rounded-lg font-bold text-sm transition-all ${
                    betAmount === amount 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ₹{amount >= 1000 ? `${amount/1000}K` : amount}
                </button>
              ))}
            </div>
          </div>

          {/* Game History */}
          <div className="mb-20">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Recent Results</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-500 mb-3">
                <div className="text-center">Period</div>
                <div className="text-center">Numbers</div>
                <div className="text-center">Sum</div>
              </div>
              
              {gameHistory.map((result, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 text-sm py-2 border-b border-gray-200 last:border-b-0">
                  <div className="text-center text-gray-600 text-xs">...{result.period.toString().slice(-4)}</div>
                  <div className="flex justify-center space-x-1">
                    {result.numbers.map((num, numIndex) => (
                      <div key={numIndex} className="w-6 h-6 bg-purple-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                        {num}
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-indigo-600">{result.sum}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      result.sum >= 23 ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {result.sum >= 23 ? 'BIG' : 'SMALL'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}