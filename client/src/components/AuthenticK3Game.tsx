import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Volume2 } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function AuthenticK3Game({ onBack }: Props) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentPeriod, setCurrentPeriod] = useState(20250721001);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBets, setSelectedBets] = useState<string[]>([]);
  const [balance, setBalance] = useState(12580.45);
  const [gamePhase, setGamePhase] = useState<'betting' | 'drawing' | 'result'>('betting');
  const [lastResult, setLastResult] = useState({ dice: [3, 5, 2], sum: 10 });
  const [diceAnimation, setDiceAnimation] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (gamePhase === 'betting') {
            setGamePhase('drawing');
            setDiceAnimation(true);
            return 5;
          } else if (gamePhase === 'drawing') {
            setGamePhase('result');
            // Generate dice result
            const dice1 = Math.floor(Math.random() * 6) + 1;
            const dice2 = Math.floor(Math.random() * 6) + 1;
            const dice3 = Math.floor(Math.random() * 6) + 1;
            const sum = dice1 + dice2 + dice3;
            setLastResult({ dice: [dice1, dice2, dice3], sum });
            setDiceAnimation(false);
            return 10;
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

  const getDiceColor = (value: number): string => {
    return value <= 3 ? 'bg-red-500' : 'bg-green-500';
  };

  const getSumColor = (sum: number): string => {
    if (sum >= 4 && sum <= 10) return 'text-red-500';
    return 'text-green-500';
  };

  const gameHistory = [
    { period: 20250721000, dice: [4, 6, 1], sum: 11 },
    { period: 20250720999, dice: [2, 3, 5], sum: 10 },
    { period: 20250720998, dice: [6, 6, 4], sum: 16 },
    { period: 20250720997, dice: [1, 2, 3], sum: 6 },
    { period: 20250720996, dice: [5, 5, 5], sum: 15 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-600 to-red-800">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-red-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <div className="text-2xl font-bold">K3</div>
              <div className="text-pink-100 text-sm">Dice Game</div>
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
                <div className="text-pink-100 text-sm">Available Balance</div>
                <div className="text-white text-2xl font-bold">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              </div>
              <div className="text-right">
                <div className="text-pink-100 text-sm">Total Bets</div>
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
                   gamePhase === 'drawing' ? 'Rolling Dice...' : 'Result'}
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
                {gamePhase === 'betting' ? '🎲 Place Your Bets' : 
                 gamePhase === 'drawing' ? '🎲 Rolling Dice' : '🏆 Result Declared'}
              </div>
            </div>
          </div>
        </div>

        {/* Dice Display */}
        <div className="mx-6 mt-6">
          <div className="bg-gray-100 rounded-2xl p-6">
            <div className="flex justify-center space-x-4 mb-4">
              {(gamePhase === 'result' ? lastResult.dice : [0, 0, 0]).map((die, index) => (
                <motion.div
                  key={index}
                  animate={diceAnimation ? { rotate: [0, 360, 720] } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`w-16 h-16 ${getDiceColor(die)} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
                >
                  {gamePhase === 'result' ? die : '?'}
                </motion.div>
              ))}
            </div>
            
            {gamePhase === 'result' && (
              <div className="text-center">
                <div className="text-gray-600 text-sm mb-1">Total Sum</div>
                <div className={`text-4xl font-bold ${getSumColor(lastResult.sum)}`}>
                  {lastResult.sum}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {lastResult.sum >= 4 && lastResult.sum <= 10 ? 'SMALL (4-10)' : 'BIG (11-17)'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Betting Options */}
        <div className="px-6 py-4">
          
          {/* Sum Betting */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Sum Betting</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBet('small')}
                disabled={gamePhase !== 'betting'}
                className={`${selectedBets.includes('small') ? 'bg-red-600 ring-2 ring-yellow-400' : 'bg-red-500 hover:bg-red-600'} text-white py-4 rounded-xl font-bold text-lg ${
                  gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                SMALL
                <div className="text-sm opacity-90 mt-1">4-10 • 2X</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBet('big')}
                disabled={gamePhase !== 'betting'}
                className={`${selectedBets.includes('big') ? 'bg-green-600 ring-2 ring-yellow-400' : 'bg-green-500 hover:bg-green-600'} text-white py-4 rounded-xl font-bold text-lg ${
                  gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                BIG
                <div className="text-sm opacity-90 mt-1">11-17 • 2X</div>
              </motion.button>
            </div>
          </div>

          {/* Specific Sum Betting */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Specific Sum (216X)</h3>
            <div className="grid grid-cols-7 gap-2">
              {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((sum) => (
                <motion.button
                  key={sum}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBet(`sum-${sum}`)}
                  disabled={gamePhase !== 'betting'}
                  className={`${selectedBets.includes(`sum-${sum}`) ? 'bg-purple-600 ring-2 ring-yellow-400' : 'bg-purple-500 hover:bg-purple-600'} text-white w-12 h-12 rounded-xl font-bold text-sm ${
                    gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {sum}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Triple Betting */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Triple Betting</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBet('any-triple')}
                disabled={gamePhase !== 'betting'}
                className={`${selectedBets.includes('any-triple') ? 'bg-orange-600 ring-2 ring-yellow-400' : 'bg-orange-500 hover:bg-orange-600'} text-white py-4 rounded-xl font-bold text-lg ${
                  gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                ANY TRIPLE
                <div className="text-sm opacity-90 mt-1">30X</div>
              </motion.button>
              
              <div className="col-span-2">
                <div className="text-sm text-gray-600 mb-2">Specific Triple (180X)</div>
                <div className="grid grid-cols-6 gap-1">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <motion.button
                      key={num}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBet(`triple-${num}`)}
                      disabled={gamePhase !== 'betting'}
                      className={`${selectedBets.includes(`triple-${num}`) ? 'bg-indigo-600 ring-2 ring-yellow-400' : 'bg-indigo-500 hover:bg-indigo-600'} text-white w-10 h-10 rounded-lg font-bold text-sm ${
                        gamePhase !== 'betting' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {num}{num}{num}
                    </motion.button>
                  ))}
                </div>
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
                      ? 'bg-pink-600 text-white' 
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
                      ? 'bg-pink-600 text-white' 
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
                <div className="text-center">Dice</div>
                <div className="text-center">Sum</div>
                <div className="text-center">Size</div>
              </div>
              
              {gameHistory.map((result, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 text-sm py-2 border-b border-gray-200 last:border-b-0">
                  <div className="text-center text-gray-600 text-xs">...{result.period.toString().slice(-4)}</div>
                  <div className="flex justify-center space-x-1">
                    {result.dice.map((die, diceIndex) => (
                      <div key={diceIndex} className={`w-6 h-6 ${getDiceColor(die)} rounded text-white text-xs flex items-center justify-center font-bold`}>
                        {die}
                      </div>
                    ))}
                  </div>
                  <div className={`text-center font-bold ${getSumColor(result.sum)}`}>
                    {result.sum}
                  </div>
                  <div className="text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      result.sum >= 11 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.sum >= 11 ? 'BIG' : 'SMALL'}
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