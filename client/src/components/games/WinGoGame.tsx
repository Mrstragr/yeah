import React, { useState, useEffect } from 'react';
import { X, Clock, TrendingUp, History, Users } from 'lucide-react';

interface WinGoGameProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onTransaction: (amount: number, type: 'deposit' | 'withdraw') => void;
}

interface GameResult {
  period: string;
  result: number;
  color: 'green' | 'red' | 'violet';
  size: 'big' | 'small';
  time: string;
}

export function WinGoGame({ isOpen, onClose, walletBalance, onTransaction }: WinGoGameProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentPeriod, setCurrentPeriod] = useState('202406141530001');
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBets, setSelectedBets] = useState<{[key: string]: number}>({});
  const [gameHistory, setGameHistory] = useState<GameResult[]>([
    { period: '202406141529001', result: 5, color: 'violet', size: 'small', time: '15:29' },
    { period: '202406141528001', result: 8, color: 'red', size: 'big', time: '15:28' },
    { period: '202406141527001', result: 2, color: 'red', size: 'small', time: '15:27' },
    { period: '202406141526001', result: 1, color: 'green', size: 'small', time: '15:26' },
    { period: '202406141525001', result: 7, color: 'red', size: 'big', time: '15:25' }
  ]);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);

  const betOptions = [
    { id: 'green', label: 'Green', multiplier: '2x', color: 'bg-green-500' },
    { id: 'red', label: 'Red', multiplier: '2x', color: 'bg-red-500' },
    { id: 'violet', label: 'Violet', multiplier: '4.5x', color: 'bg-purple-500' },
    { id: 'big', label: 'Big', multiplier: '2x', color: 'bg-blue-500' },
    { id: 'small', label: 'Small', multiplier: '2x', color: 'bg-orange-500' }
  ];

  const numberBets = Array.from({ length: 10 }, (_, i) => ({
    number: i,
    color: i === 0 || i === 5 ? 'violet' : i % 2 === 0 ? 'red' : 'green',
    multiplier: i === 0 || i === 5 ? '4.5x' : '9x'
  }));

  const quickAmounts = [10, 100, 1000, 10000];

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleGameEnd();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleGameEnd = () => {
    const result = Math.floor(Math.random() * 10);
    const color = result === 0 || result === 5 ? 'violet' : result % 2 === 0 ? 'red' : 'green';
    const size = result >= 5 ? 'big' : 'small';
    const newPeriod = (parseInt(currentPeriod) + 1).toString();
    
    const newResult: GameResult = {
      period: currentPeriod,
      result,
      color,
      size,
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    };

    setLastResult(newResult);
    setGameHistory(prev => [newResult, ...prev.slice(0, 9)]);
    setCurrentPeriod(newPeriod);
    setShowResult(true);
    
    // Calculate winnings
    calculateWinnings(newResult);

    setTimeout(() => setShowResult(false), 3000);
  };

  const calculateWinnings = (result: GameResult) => {
    let totalWinnings = 0;

    Object.entries(selectedBets).forEach(([betType, amount]) => {
      let won = false;
      let multiplier = 1;

      if (betType === 'green' && result.color === 'green') {
        won = true;
        multiplier = 2;
      } else if (betType === 'red' && result.color === 'red') {
        won = true;
        multiplier = 2;
      } else if (betType === 'violet' && result.color === 'violet') {
        won = true;
        multiplier = 4.5;
      } else if (betType === 'big' && result.size === 'big') {
        won = true;
        multiplier = 2;
      } else if (betType === 'small' && result.size === 'small') {
        won = true;
        multiplier = 2;
      } else if (betType === result.result.toString()) {
        won = true;
        multiplier = result.result === 0 || result.result === 5 ? 4.5 : 9;
      }

      if (won) {
        totalWinnings += amount * multiplier;
      }
    });

    if (totalWinnings > 0) {
      onTransaction(totalWinnings - getTotalBetAmount(), 'deposit');
    } else {
      onTransaction(getTotalBetAmount(), 'withdraw');
    }

    setSelectedBets({});
  };

  const placeBet = (betType: string) => {
    const totalBets = getTotalBetAmount();
    if (totalBets + betAmount > walletBalance) {
      alert('Insufficient balance');
      return;
    }

    if (timeLeft <= 10) {
      alert('Betting closed for this round');
      return;
    }

    setSelectedBets(prev => ({
      ...prev,
      [betType]: (prev[betType] || 0) + betAmount
    }));
  };

  const getTotalBetAmount = () => {
    return Object.values(selectedBets).reduce((sum, amount) => sum + amount, 0);
  };

  const getNumberColor = (num: number) => {
    if (num === 0 || num === 5) return 'bg-purple-500';
    return num % 2 === 0 ? 'bg-red-500' : 'bg-green-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">WIN GO</h2>
              <p className="text-sm opacity-90">1 Min</p>
            </div>
            <button onClick={onClose} className="p-1">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Game Info */}
        <div className="p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-600">Period: {currentPeriod}</div>
            <div className="text-sm text-gray-600">Balance: ₹{walletBalance.toFixed(2)}</div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-red-500">
                {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
                {String(timeLeft % 60).padStart(2, '0')}
              </span>
            </div>
            {timeLeft <= 10 && (
              <div className="text-red-500 font-bold animate-pulse">Betting Closed</div>
            )}
          </div>

          {getTotalBetAmount() > 0 && (
            <div className="text-center mb-2">
              <span className="text-sm text-gray-600">Total Bet: </span>
              <span className="font-bold text-red-500">₹{getTotalBetAmount()}</span>
            </div>
          )}
        </div>

        {/* Bet Amount Selection */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Bet Amount:</span>
            <span className="font-bold text-lg">₹{betAmount}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map(amount => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  betAmount === amount 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>

        {/* Color & Size Bets */}
        <div className="p-4 border-b">
          <h3 className="font-medium mb-3">Select Color & Size</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {betOptions.slice(0, 3).map(option => (
              <button
                key={option.id}
                onClick={() => placeBet(option.id)}
                disabled={timeLeft <= 10}
                className={`${option.color} text-white py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 relative`}
              >
                <div>{option.label}</div>
                <div className="text-xs">{option.multiplier}</div>
                {selectedBets[option.id] && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">
                    ₹{selectedBets[option.id]}
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {betOptions.slice(3).map(option => (
              <button
                key={option.id}
                onClick={() => placeBet(option.id)}
                disabled={timeLeft <= 10}
                className={`${option.color} text-white py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 relative`}
              >
                <div>{option.label}</div>
                <div className="text-xs">{option.multiplier}</div>
                {selectedBets[option.id] && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">
                    ₹{selectedBets[option.id]}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Number Bets */}
        <div className="p-4 border-b">
          <h3 className="font-medium mb-3">Select Number</h3>
          <div className="grid grid-cols-5 gap-2">
            {numberBets.map(bet => (
              <button
                key={bet.number}
                onClick={() => placeBet(bet.number.toString())}
                disabled={timeLeft <= 10}
                className={`${getNumberColor(bet.number)} text-white py-3 px-2 rounded-lg font-bold transition-all disabled:opacity-50 relative text-sm`}
              >
                <div>{bet.number}</div>
                <div className="text-xs">{bet.multiplier}</div>
                {selectedBets[bet.number.toString()] && (
                  <div className="absolute -top-2 -right-1 bg-yellow-400 text-black text-xs px-1 py-0.5 rounded-full">
                    ₹{selectedBets[bet.number.toString()]}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Game History */}
        <div className="p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <History className="w-4 h-4 mr-2" />
            Recent Results
          </h3>
          <div className="space-y-2">
            {gameHistory.slice(0, 5).map((result, index) => (
              <div key={result.period} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <div className="text-sm">
                  <div className="font-medium">{result.period}</div>
                  <div className="text-gray-500">{result.time}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getNumberColor(result.result)}`}>
                    {result.result}
                  </div>
                  <div className="text-xs text-gray-500">
                    {result.color} · {result.size}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Result Overlay */}
        {showResult && lastResult && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
            <div className="bg-white rounded-xl p-8 text-center max-w-sm mx-4">
              <h3 className="text-2xl font-bold mb-4">Game Result</h3>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 ${getNumberColor(lastResult.result)}`}>
                {lastResult.result}
              </div>
              <div className="text-lg mb-2">
                <span className="capitalize">{lastResult.color}</span> · <span className="capitalize">{lastResult.size}</span>
              </div>
              <div className="text-gray-500">Period: {lastResult.period}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}