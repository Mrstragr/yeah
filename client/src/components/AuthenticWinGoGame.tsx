import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Volume2 } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function AuthenticWinGoGame({ onBack }: Props) {
  const [timeLeft, setTimeLeft] = useState(25);
  const [currentPeriod, setCurrentPeriod] = useState(20250721001);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [balance, setBalance] = useState(12580.45);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gamePhase, setGamePhase] = useState<'betting' | 'drawing' | 'result'>('betting');
  const [lastResult, setLastResult] = useState({ number: 7, color: 'red' });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (gamePhase === 'betting') {
            setGamePhase('drawing');
            return 5;
          } else if (gamePhase === 'drawing') {
            setGamePhase('result');
            // Generate result
            const resultNumber = Math.floor(Math.random() * 10);
            const resultColor = getColorForNumber(resultNumber);
            setLastResult({ number: resultNumber, color: resultColor });
            return 10;
          } else {
            setGamePhase('betting');
            setCurrentPeriod(prev => prev + 1);
            setSelectedBet(null);
            return 25;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase]);

  const getColorForNumber = (num: number): string => {
    if (num === 0 || num === 5) return 'violet';
    if ([1, 3, 7, 9].includes(num)) return 'red';
    return 'green';
  };

  const getNumberButtonColor = (num: number): string => {
    if (num === 0 || num === 5) return 'bg-purple-500 hover:bg-purple-600';
    if ([1, 3, 7, 9].includes(num)) return 'bg-red-500 hover:bg-red-600';
    return 'bg-green-500 hover:bg-green-600';
  };

  const handleBet = (betType: string) => {
    if (gamePhase !== 'betting' || balance < betAmount) return;
    setSelectedBet(betType);
    setBalance(prev => prev - betAmount);
    setIsPlaying(true);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const gameHistory = [
    { period: 20250721000, number: 8, big: true, color: 'green' },
    { period: 20250720999, number: 2, big: false, color: 'green' },
    { period: 20250720998, number: 5, big: false, color: 'violet' },
    { period: 20250720997, number: 9, big: true, color: 'red' },
    { period: 20250720996, number: 1, big: false, color: 'red' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <div className="text-2xl font-bold">WIN GO</div>
              <div className="text-green-100 text-sm">Color Prediction Game</div>
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
                <div className="text-green-100 text-sm">Available Balance</div>
                <div className="text-white text-2xl font-bold">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              </div>
              <div className="text-right">
                <div className="text-green-100 text-sm">Current Bet</div>
                <div className="text-white text-xl font-bold">₹{betAmount}</div>
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
                   gamePhase === 'drawing' ? 'Drawing...' : 'Result'}
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
                 gamePhase === 'drawing' ? '🎲 Drawing Result' : '🏆 Result Declared'}
              </div>
            </div>
          </div>
        </div>

        {/* Last Result Display */}
        {gamePhase === 'result' && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-6 mt-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white text-center"
          >
            <div className="text-lg font-bold mb-2">🎉 RESULT 🎉</div>
            <div className="flex items-center justify-center space-x-4 mb-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                getNumberButtonColor(lastResult.number).replace('hover:bg-', '').replace('bg-', 'bg-').split(' ')[0]
              } text-white`}>
                {lastResult.number}
              </div>
              <div className="text-center">
                <div className="text-sm opacity-90">Color: {lastResult.color.toUpperCase()}</div>
                <div className="text-sm opacity-90">Size: {lastResult.number >= 5 ? 'BIG' : 'SMALL'}</div>
              </div>
            </div>
            {isPlaying && selectedBet && (
              <div className="text-sm">
                {selectedBet === `number-${lastResult.number}` || 
                 selectedBet === lastResult.color ||
                 (selectedBet === 'big' && lastResult.number >= 5) ||
                 (selectedBet === 'small' && lastResult.number < 5) ? (
                  <div className="text-green-200">🎉 YOU WON!</div>
                ) : (
                  <div className="text-red-200">😔 Better luck next time</div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Color Betting Section */}
        <div className="px-6 py-4">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Choose Color (2X - 4.5X)</h3>
            <div className="grid grid-cols-3 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBet('green')}
                disabled={gamePhase !== 'betting'}
                className={`bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg relative ${
                  selectedBet === 'green' ? 'ring-4 ring-yellow-400' : ''
                } ${gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                GREEN
                <div className="text-sm opacity-90 mt-1">2.00X</div>
                {selectedBet === 'green' && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-green-800">✓</span>
                  </div>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBet('violet')}
                disabled={gamePhase !== 'betting'}
                className={`bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-xl font-bold text-lg relative ${
                  selectedBet === 'violet' ? 'ring-4 ring-yellow-400' : ''
                } ${gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                VIOLET
                <div className="text-sm opacity-90 mt-1">4.50X</div>
                {selectedBet === 'violet' && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-800">✓</span>
                  </div>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBet('red')}
                disabled={gamePhase !== 'betting'}
                className={`bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold text-lg relative ${
                  selectedBet === 'red' ? 'ring-4 ring-yellow-400' : ''
                } ${gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                RED
                <div className="text-sm opacity-90 mt-1">2.00X</div>
                {selectedBet === 'red' && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-red-800">✓</span>
                  </div>
                )}
              </motion.button>
            </div>
          </div>

          {/* Number Betting Section */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Choose Number (9X)</h3>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBet(`number-${num}`)}
                  disabled={gamePhase !== 'betting'}
                  className={`${getNumberButtonColor(num)} text-white w-16 h-16 rounded-2xl font-bold text-xl relative transition-all ${
                    selectedBet === `number-${num}` ? 'ring-4 ring-yellow-400' : ''
                  } ${gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {num}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs bg-black/30 px-1 rounded">
                    9X
                  </div>
                  {selectedBet === `number-${num}` && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-800">✓</span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Size Betting Section */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Choose Size (2X)</h3>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBet('small')}
                disabled={gamePhase !== 'betting'}
                className={`bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg relative ${
                  selectedBet === 'small' ? 'ring-4 ring-yellow-400' : ''
                } ${gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                SMALL
                <div className="text-sm opacity-90 mt-1">0,1,2,3,4 • 2.00X</div>
                {selectedBet === 'small' && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-800">✓</span>
                  </div>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBet('big')}
                disabled={gamePhase !== 'betting'}
                className={`bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg relative ${
                  selectedBet === 'big' ? 'ring-4 ring-yellow-400' : ''
                } ${gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                BIG
                <div className="text-sm opacity-90 mt-1">5,6,7,8,9 • 2.00X</div>
                {selectedBet === 'big' && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-800">✓</span>
                  </div>
                )}
              </motion.button>
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
                      ? 'bg-red-600 text-white' 
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
                      ? 'bg-red-600 text-white' 
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
              <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-500 mb-3">
                <div className="text-center">Period</div>
                <div className="text-center">Number</div>
                <div className="text-center">Size</div>
                <div className="text-center">Color</div>
              </div>
              
              {gameHistory.map((result, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 text-sm py-2 border-b border-gray-200 last:border-b-0">
                  <div className="text-center text-gray-600 text-xs">...{result.period.toString().slice(-4)}</div>
                  <div className="text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold ${
                      getNumberButtonColor(result.number).split(' ')[0]
                    }`}>
                      {result.number}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      result.big ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {result.big ? 'BIG' : 'SMALL'}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className={`w-4 h-4 rounded-full inline-block ${
                      result.color === 'violet' ? 'bg-purple-500' : 
                      result.color === 'red' ? 'bg-red-500' : 'bg-green-500'
                    }`}></span>
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