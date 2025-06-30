import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Trophy, Minus, Plus } from 'lucide-react';

interface WinGoGameProps {
  onBack: () => void;
  user: any;
  onBalanceUpdate: () => void;
}

interface GamePeriod {
  period: string;
  timeRemaining: number;
  result?: {
    number: number;
    color: 'red' | 'green' | 'violet';
    size: 'small' | 'big';
  };
}

export default function WinGoGame({ onBack, user, onBalanceUpdate }: WinGoGameProps) {
  const [currentPeriod, setCurrentPeriod] = useState<GamePeriod>({
    period: '20250630001',
    timeRemaining: 180, // 3 minutes
  });
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBets, setSelectedBets] = useState<any[]>([]);
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Generate game period
  const generateNewPeriod = () => {
    const now = new Date();
    const periodNum = Math.floor(now.getTime() / 180000) % 1000;
    return `20250630${periodNum.toString().padStart(3, '0')}`;
  };

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPeriod(prev => {
        if (prev.timeRemaining <= 1) {
          // Game ended, show result
          const result = {
            number: Math.floor(Math.random() * 10),
            color: Math.random() > 0.5 ? (Math.random() > 0.5 ? 'red' : 'green') : 'violet' as 'red' | 'green' | 'violet',
            size: Math.random() > 0.5 ? 'big' : 'small' as 'small' | 'big'
          };
          
          setShowResult(true);
          setTimeout(() => {
            setShowResult(false);
            setSelectedBets([]);
            // Start new game
            setCurrentPeriod({
              period: generateNewPeriod(),
              timeRemaining: 180,
            });
          }, 5000);

          return {
            ...prev,
            timeRemaining: 0,
            result
          };
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Number colors mapping
  const getNumberColor = (num: number) => {
    if (num === 0 || num === 5) return 'violet';
    if ([1, 3, 7, 9].includes(num)) return 'green';
    if ([2, 4, 6, 8].includes(num)) return 'red';
    return 'violet';
  };

  // Add bet to selection
  const addBet = (type: string, value: any, odds: number) => {
    const bet = {
      id: Date.now(),
      type,
      value,
      amount: betAmount,
      odds,
      potential: betAmount * odds
    };
    setSelectedBets(prev => [...prev, bet]);
  };

  // Remove bet
  const removeBet = (id: number) => {
    setSelectedBets(prev => prev.filter(bet => bet.id !== id));
  };

  // Place bets
  const placeBets = async () => {
    if (selectedBets.length === 0) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const totalAmount = selectedBets.reduce((sum, bet) => sum + bet.amount, 0);
      
      const response = await fetch('/api/games/bet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameType: 'wingo',
          period: currentPeriod.period,
          bets: selectedBets,
          totalAmount
        }),
      });

      if (response.ok) {
        alert('Bets placed successfully!');
        onBalanceUpdate();
        setSelectedBets([]);
      } else {
        const data = await response.json();
        alert(data.message || 'Bet failed');
      }
    } catch (error) {
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-500 to-red-600">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <button onClick={onBack} className="flex items-center">
          <ArrowLeft className="w-6 h-6 mr-2" />
          <span className="font-medium">Win Go 1Min</span>
        </button>
        <div className="text-right">
          <div className="text-sm opacity-80">Balance</div>
          <div className="font-bold">₹{user.walletBalance}</div>
        </div>
      </div>

      {/* Game Info */}
      <div className="bg-white mx-4 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-gray-600 text-sm">Period</div>
            <div className="font-bold text-lg">{currentPeriod.period}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 text-sm">Time remaining</div>
            <div className="font-bold text-2xl text-red-500 flex items-center">
              <Clock className="w-5 h-5 mr-1" />
              {formatTime(currentPeriod.timeRemaining)}
            </div>
          </div>
        </div>

        {/* Result Display */}
        <AnimatePresence>
          {showResult && currentPeriod.result && (
            <motion.div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-center text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <div className="text-sm mb-2">Result</div>
              <div className="text-6xl font-bold mb-2">{currentPeriod.result.number}</div>
              <div className="flex justify-center space-x-4">
                <span className={`px-3 py-1 rounded ${
                  currentPeriod.result.color === 'red' ? 'bg-red-500' :
                  currentPeriod.result.color === 'green' ? 'bg-green-500' :
                  'bg-purple-500'
                }`}>
                  {currentPeriod.result.color.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded bg-gray-700">
                  {currentPeriod.result.size.toUpperCase()}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Betting Section */}
      {!showResult && (
        <div className="bg-white mx-4 rounded-lg p-4 mb-4">
          {/* Bet Amount */}
          <div className="mb-6">
            <div className="text-center mb-4">
              <div className="text-gray-600 text-sm mb-2">Select Amount</div>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setBetAmount(Math.max(1, betAmount - 10))}
                  className="bg-red-500 p-2 rounded-full text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="text-2xl font-bold">₹{betAmount}</div>
                <button
                  onClick={() => setBetAmount(betAmount + 10)}
                  className="bg-green-500 p-2 rounded-full text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-center space-x-2 mt-3">
                {[10, 50, 100, 500].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`px-4 py-2 rounded ${
                      betAmount === amount 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color Betting */}
          <div className="mb-6">
            <div className="text-center text-gray-700 font-medium mb-3">Select Color</div>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => addBet('color', 'green', 2)}
                className="bg-green-500 text-white py-4 rounded-lg font-bold"
              >
                GREEN
                <div className="text-sm">1:2</div>
              </button>
              <button
                onClick={() => addBet('color', 'violet', 4.5)}
                className="bg-purple-500 text-white py-4 rounded-lg font-bold"
              >
                VIOLET
                <div className="text-sm">1:4.5</div>
              </button>
              <button
                onClick={() => addBet('color', 'red', 2)}
                className="bg-red-500 text-white py-4 rounded-lg font-bold"
              >
                RED
                <div className="text-sm">1:2</div>
              </button>
            </div>
          </div>

          {/* Number Betting */}
          <div className="mb-6">
            <div className="text-center text-gray-700 font-medium mb-3">Select Number</div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => addBet('number', num, 9)}
                  className={`py-3 rounded-lg font-bold text-white ${
                    getNumberColor(num) === 'red' ? 'bg-red-500' :
                    getNumberColor(num) === 'green' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`}
                >
                  {num}
                  <div className="text-xs">1:9</div>
                </button>
              ))}
            </div>
          </div>

          {/* Size Betting */}
          <div className="mb-6">
            <div className="text-center text-gray-700 font-medium mb-3">Select Size</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => addBet('size', 'small', 2)}
                className="bg-blue-500 text-white py-4 rounded-lg font-bold"
              >
                SMALL (0-4)
                <div className="text-sm">1:2</div>
              </button>
              <button
                onClick={() => addBet('size', 'big', 2)}
                className="bg-orange-500 text-white py-4 rounded-lg font-bold"
              >
                BIG (5-9)
                <div className="text-sm">1:2</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Bets */}
      {selectedBets.length > 0 && (
        <div className="bg-white mx-4 rounded-lg p-4 mb-4">
          <div className="text-lg font-bold mb-3">Your Bets</div>
          {selectedBets.map(bet => (
            <div key={bet.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <div className="font-medium">{bet.type.toUpperCase()}: {bet.value}</div>
                <div className="text-sm text-gray-600">₹{bet.amount} × {bet.odds} = ₹{bet.potential}</div>
              </div>
              <button
                onClick={() => removeBet(bet.id)}
                className="text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between font-bold">
              <span>Total Bet: ₹{selectedBets.reduce((sum, bet) => sum + bet.amount, 0)}</span>
              <span>Max Win: ₹{selectedBets.reduce((sum, bet) => sum + bet.potential, 0)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Place Bet Button */}
      {selectedBets.length > 0 && !showResult && (
        <div className="p-4">
          <button
            onClick={placeBets}
            disabled={loading || currentPeriod.timeRemaining < 10}
            className={`w-full py-4 rounded-lg font-bold text-xl ${
              loading || currentPeriod.timeRemaining < 10
                ? 'bg-gray-400 text-gray-600'
                : 'bg-yellow-500 text-white'
            }`}
          >
            {loading ? 'Placing Bets...' : 
             currentPeriod.timeRemaining < 10 ? 'Betting Closed' :
             `Place Bet (₹${selectedBets.reduce((sum, bet) => sum + bet.amount, 0)})`}
          </button>
        </div>
      )}
    </div>
  );
}