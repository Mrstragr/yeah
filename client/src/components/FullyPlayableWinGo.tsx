import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Trophy, DollarSign } from 'lucide-react';
import { useSmartBalance } from '../hooks/useSmartBalance';

interface BetState {
  type: 'color' | 'number' | 'size';
  value: string | number;
  amount: number;
}

interface GameResult {
  number: number;
  color: 'green' | 'red' | 'violet';
  size: 'big' | 'small';
  period: string;
}

const FullyPlayableWinGo: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { balance, updateBalance } = useSmartBalance();
  const [gamePhase, setGamePhase] = useState<'betting' | 'waiting' | 'result'>('betting');
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes
  const [currentPeriod, setCurrentPeriod] = useState<string>('');
  const [bets, setBets] = useState<BetState[]>([]);
  const [selectedBet, setSelectedBet] = useState<BetState | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [recentResults, setRecentResults] = useState<GameResult[]>([]);
  const [winAmount, setWinAmount] = useState(0);

  // Generate period number
  const generatePeriod = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = Math.floor(now.getMinutes() / 3).toString().padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}`;
  };

  // Initialize game
  useEffect(() => {
    setCurrentPeriod(generatePeriod());
    
    // Generate some random recent results
    const results: GameResult[] = [];
    for (let i = 0; i < 10; i++) {
      const num = Math.floor(Math.random() * 10);
      results.push({
        number: num,
        color: num === 0 || num === 5 ? 'violet' : (num % 2 === 0 ? 'red' : 'green'),
        size: num >= 5 ? 'big' : 'small',
        period: (parseInt(generatePeriod()) - i - 1).toString()
      });
    }
    setRecentResults(results);
  }, []);

  // Game timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (gamePhase === 'betting') {
            // End betting, start result phase
            setGamePhase('waiting');
            setTimeout(() => {
              executeGame();
            }, 3000);
            return 10; // 10 seconds for result
          } else if (gamePhase === 'waiting' || gamePhase === 'result') {
            // Start new round
            setGamePhase('betting');
            setGameResult(null);
            setBets([]);
            setSelectedBet(null);
            setWinAmount(0);
            setCurrentPeriod(generatePeriod());
            return 180; // 3 minutes for next round
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase]);

  const executeGame = () => {
    // Generate random result
    const resultNumber = Math.floor(Math.random() * 10);
    const result: GameResult = {
      number: resultNumber,
      color: resultNumber === 0 || resultNumber === 5 ? 'violet' : (resultNumber % 2 === 0 ? 'red' : 'green'),
      size: resultNumber >= 5 ? 'big' : 'small',
      period: currentPeriod
    };

    setGameResult(result);
    setGamePhase('result');

    // Calculate winnings
    let totalWin = 0;
    bets.forEach(bet => {
      let won = false;
      let multiplier = 1;

      if (bet.type === 'color') {
        if (bet.value === result.color) {
          won = true;
          multiplier = result.color === 'violet' ? 4.5 : 2;
        }
      } else if (bet.type === 'number') {
        if (bet.value === result.number) {
          won = true;
          multiplier = 9;
        }
      } else if (bet.type === 'size') {
        if (bet.value === result.size) {
          won = true;
          multiplier = 2;
        }
      }

      if (won) {
        totalWin += bet.amount * multiplier;
      }
    });

    setWinAmount(totalWin);
    
    // Update balance
    if (totalWin > 0) {
      updateBalance(totalWin, 'add');
    }

    // Add to recent results
    setRecentResults(prev => [result, ...prev.slice(0, 9)]);
  };

  const placeBet = () => {
    if (!selectedBet || betAmount <= 0 || gamePhase !== 'betting') return;
    
    const currentBalance = parseFloat(balance);
    if (currentBalance < betAmount) {
      alert('Insufficient balance!');
      return;
    }

    // Deduct bet amount
    updateBalance(betAmount, 'subtract');

    // Add bet
    setBets(prev => [...prev, { ...selectedBet, amount: betAmount }]);
    setSelectedBet(null);
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-500';
      case 'red': return 'bg-red-500';
      case 'violet': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Win Go 3Min</h1>
          <p className="text-gray-300">Period: {currentPeriod}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-300">Balance</p>
          <p className="text-xl font-bold text-yellow-400">₹{parseFloat(balance).toFixed(2)}</p>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Clock className="w-5 h-5" />
          <span className="text-lg font-semibold">
            {gamePhase === 'betting' ? 'Betting Time' : 
             gamePhase === 'waiting' ? 'Drawing' : 'Result'}
          </span>
        </div>
        <div className="text-3xl font-bold text-yellow-400">
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Game Result */}
      <AnimatePresence>
        {gameResult && gamePhase === 'result' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 mb-6 text-center text-black"
          >
            <h2 className="text-2xl font-bold mb-4">Game Result</h2>
            <div className="flex items-center justify-center space-x-4">
              <div className={`w-16 h-16 rounded-full ${getColorClass(gameResult.color)} flex items-center justify-center text-white text-2xl font-bold`}>
                {gameResult.number}
              </div>
              <div>
                <p className="text-lg font-semibold">
                  {gameResult.color.toUpperCase()} • {gameResult.size.toUpperCase()}
                </p>
                {winAmount > 0 && (
                  <p className="text-2xl font-bold text-green-700">
                    You Won: ₹{winAmount.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Betting Interface */}
      {gamePhase === 'betting' && (
        <div className="space-y-6">
          {/* Color Betting */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Select Color</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { color: 'green', multiplier: '2x' },
                { color: 'red', multiplier: '2x' },
                { color: 'violet', multiplier: '4.5x' }
              ].map(item => (
                <button
                  key={item.color}
                  onClick={() => setSelectedBet({ type: 'color', value: item.color, amount: 0 })}
                  className={`${getColorClass(item.color)} hover:opacity-80 p-4 rounded-lg text-white font-semibold transition-opacity ${
                    selectedBet?.type === 'color' && selectedBet?.value === item.color ? 'ring-4 ring-yellow-400' : ''
                  }`}
                >
                  <div className="text-lg">{item.color.toUpperCase()}</div>
                  <div className="text-sm">{item.multiplier}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Number Betting */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Select Number (9x)</h3>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedBet({ type: 'number', value: i, amount: 0 })}
                  className={`bg-gray-700 hover:bg-gray-600 p-3 rounded-lg font-semibold transition-colors ${
                    selectedBet?.type === 'number' && selectedBet?.value === i ? 'ring-4 ring-yellow-400' : ''
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Size Betting */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Select Size (2x)</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { size: 'small', label: 'SMALL (0-4)' },
                { size: 'big', label: 'BIG (5-9)' }
              ].map(item => (
                <button
                  key={item.size}
                  onClick={() => setSelectedBet({ type: 'size', value: item.size, amount: 0 })}
                  className={`bg-blue-600 hover:bg-blue-500 p-4 rounded-lg font-semibold transition-colors ${
                    selectedBet?.type === 'size' && selectedBet?.value === item.size ? 'ring-4 ring-yellow-400' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bet Amount */}
          {selectedBet && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Bet Amount</h3>
              <div className="flex items-center space-x-4 mb-4">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  placeholder="Enter amount"
                  min="10"
                />
                <button
                  onClick={placeBet}
                  disabled={!selectedBet || betAmount <= 0}
                  className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Place Bet
                </button>
              </div>
              <div className="flex space-x-2">
                {[100, 500, 1000, 5000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Current Bets */}
      {bets.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold mb-4">Your Bets</h3>
          <div className="space-y-2">
            {bets.map((bet, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                <span>
                  {bet.type.toUpperCase()}: {bet.value} 
                </span>
                <span className="font-semibold">₹{bet.amount}</span>
              </div>
            ))}
            <div className="border-t border-gray-600 pt-2 flex justify-between font-bold">
              <span>Total Bet:</span>
              <span>₹{bets.reduce((sum, bet) => sum + bet.amount, 0)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Results */}
      <div className="bg-gray-800 rounded-lg p-4 mt-6">
        <h3 className="text-lg font-semibold mb-4">Recent Results</h3>
        <div className="flex space-x-2 overflow-x-auto">
          {recentResults.map((result, index) => (
            <div key={index} className="flex-shrink-0 text-center">
              <div className={`w-8 h-8 rounded-full ${getColorClass(result.color)} flex items-center justify-center text-white text-sm font-bold mb-1`}>
                {result.number}
              </div>
              <div className="text-xs text-gray-400">{result.period.slice(-4)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullyPlayableWinGo;