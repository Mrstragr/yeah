import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Clock, TrendingUp, Target, Star } from 'lucide-react';

interface User {
  id: number;
  username: string;
  walletBalance: string;
}

interface Props {
  onBack: () => void;
  user: User;
  onBalanceUpdate: () => void;
}

interface BetOption {
  type: 'sum' | 'straight' | 'combination' | 'position';
  name: string;
  odds: string;
  description: string;
}

export default function Official5D({ onBack, user, onBalanceUpdate }: Props) {
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameNumber, setGameNumber] = useState('20250101001');
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBetType, setSelectedBetType] = useState<string>('sum');
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [gamePhase, setGamePhase] = useState<'betting' | 'drawing' | 'result'>('betting');
  const [currentResult, setCurrentResult] = useState<number[]>([]);
  const [drawingNumbers, setDrawingNumbers] = useState<number[]>([0, 0, 0, 0, 0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const betOptions: BetOption[] = [
    { type: 'sum', name: 'Sum Total', odds: '1:9.8', description: 'Bet on sum of 5 digits' },
    { type: 'straight', name: 'Straight', odds: '1:98000', description: 'Exact 5-digit match' },
    { type: 'combination', name: 'Combination', odds: '1:326', description: 'Any arrangement' },
    { type: 'position', name: 'Position', odds: '1:9.8', description: 'Number in specific position' }
  ];

  const quickAmounts = [10, 50, 100, 500, 1000];

  // Generate period number
  const generatePeriod = () => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10).replace(/-/g, '');
    const periods = Math.floor((now.getHours() * 60 + now.getMinutes()) / 1); // Every minute
    return `${today}${String(periods + 1).padStart(3, '0')}`;
  };

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (gamePhase === 'betting') {
            startDrawing();
          }
          return 60; // Reset for next round
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase]);

  const startDrawing = () => {
    setGamePhase('drawing');
    setDrawingNumbers([0, 0, 0, 0, 0]);
    
    // Animate drawing process
    const animationInterval = setInterval(() => {
      setDrawingNumbers(prev => prev.map(() => Math.floor(Math.random() * 10)));
    }, 100);

    // Stop animation and show result after 3 seconds
    setTimeout(() => {
      clearInterval(animationInterval);
      const finalResult = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
      setCurrentResult(finalResult);
      setDrawingNumbers(finalResult);
      setGamePhase('result');
      
      if (isPlaying) {
        checkWin(finalResult);
      }
      
      // Return to betting phase after 5 seconds
      setTimeout(() => {
        setGamePhase('betting');
        setGameNumber(generatePeriod());
        setIsPlaying(false);
        setWinAmount(0);
        setSelectedNumbers([]);
      }, 5000);
    }, 3000);
  };

  const checkWin = (result: number[]) => {
    let won = false;
    let multiplier = 0;

    switch (selectedBetType) {
      case 'sum':
        const sum = result.reduce((a, b) => a + b, 0);
        const selectedSum = selectedNumbers[0];
        if (sum === selectedSum) {
          won = true;
          multiplier = 9.8;
        }
        break;
      
      case 'straight':
        if (JSON.stringify(result) === JSON.stringify(selectedNumbers)) {
          won = true;
          multiplier = 98000;
        }
        break;
      
      case 'combination':
        const sortedResult = [...result].sort();
        const sortedSelected = [...selectedNumbers].sort();
        if (JSON.stringify(sortedResult) === JSON.stringify(sortedSelected)) {
          won = true;
          multiplier = 326;
        }
        break;
      
      case 'position':
        // Check if any selected number matches its position
        const matches = selectedNumbers.filter((num, index) => result[index] === num);
        if (matches.length > 0) {
          won = true;
          multiplier = 9.8 * matches.length;
        }
        break;
    }

    if (won) {
      const winnings = betAmount * multiplier;
      setWinAmount(winnings);
      setTimeout(() => {
        onBalanceUpdate();
      }, 1000);
    }
  };

  const placeBet = () => {
    if (selectedNumbers.length === 0 || gamePhase !== 'betting') return;
    
    setIsPlaying(true);
  };

  const handleNumberSelect = (number: number) => {
    if (selectedBetType === 'sum') {
      setSelectedNumbers([number]);
    } else if (selectedBetType === 'straight' || selectedBetType === 'combination') {
      if (selectedNumbers.length < 5) {
        setSelectedNumbers([...selectedNumbers, number]);
      }
    } else if (selectedBetType === 'position') {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-900 text-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-green-800/50">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">5D Lottery</h1>
          <div className="text-sm text-green-200">Period: {gameNumber}</div>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Timer and Status */}
      <div className="p-4">
        <div className="bg-green-800/30 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="text-green-200">
                {gamePhase === 'betting' ? 'Betting Time' : 
                 gamePhase === 'drawing' ? 'Drawing...' : 'Results'}
              </span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {formatTime(timeLeft)}
            </div>
          </div>
          
          {gamePhase === 'betting' && (
            <div className="text-sm text-green-300">
              Place your bets before time runs out!
            </div>
          )}
        </div>

        {/* Current Result Display */}
        <div className="bg-green-800/30 rounded-xl p-4 mb-4">
          <div className="text-center mb-3">
            <div className="text-green-200 text-sm mb-2">
              {gamePhase === 'drawing' ? 'Drawing Numbers...' : 'Latest Result'}
            </div>
            <div className="flex justify-center gap-2">
              {drawingNumbers.map((number, index) => (
                <motion.div
                  key={index}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold ${
                    gamePhase === 'drawing' 
                      ? 'bg-yellow-500 text-black animate-pulse' 
                      : 'bg-green-600 text-white'
                  }`}
                  animate={gamePhase === 'drawing' ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3, repeat: gamePhase === 'drawing' ? Infinity : 0 }}
                >
                  {number}
                </motion.div>
              ))}
            </div>
            
            {gamePhase === 'result' && currentResult.length > 0 && (
              <div className="mt-3">
                <div className="text-green-300 text-sm">
                  Sum: {currentResult.reduce((a, b) => a + b, 0)}
                </div>
                {winAmount > 0 && (
                  <motion.div 
                    className="text-yellow-400 text-lg font-bold mt-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    🎉 You Won ₹{winAmount.toFixed(2)}!
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bet Type Selection */}
        <div className="mb-4">
          <div className="text-green-200 text-sm mb-2">Select Bet Type:</div>
          <div className="grid grid-cols-2 gap-2">
            {betOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => {
                  setSelectedBetType(option.type);
                  setSelectedNumbers([]);
                }}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedBetType === option.type
                    ? 'bg-green-600 border-green-400 text-white'
                    : 'bg-green-800/30 border-green-600 text-green-200 hover:bg-green-700/30'
                }`}
              >
                <div className="font-semibold">{option.name}</div>
                <div className="text-xs text-green-300">{option.odds}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Number Selection */}
        <div className="mb-4">
          <div className="text-green-200 text-sm mb-2">
            {selectedBetType === 'sum' ? 'Select Sum (0-45):' :
             selectedBetType === 'straight' || selectedBetType === 'combination' ? 'Select 5 Numbers:' :
             'Select Numbers for Positions:'}
          </div>
          
          {selectedBetType === 'sum' ? (
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 46 }, (_, i) => i).map(num => (
                <button
                  key={num}
                  onClick={() => handleNumberSelect(num)}
                  className={`p-2 rounded text-sm transition-colors ${
                    selectedNumbers.includes(num)
                      ? 'bg-green-500 text-white'
                      : 'bg-green-800/30 text-green-200 hover:bg-green-700/30'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => i).map(num => (
                <button
                  key={num}
                  onClick={() => handleNumberSelect(num)}
                  className={`p-3 rounded text-lg font-bold transition-colors ${
                    selectedNumbers.includes(num)
                      ? 'bg-green-500 text-white'
                      : 'bg-green-800/30 text-green-200 hover:bg-green-700/30'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
          
          {selectedNumbers.length > 0 && (
            <div className="mt-2 p-2 bg-green-800/30 rounded">
              <div className="text-green-200 text-sm">Selected: {selectedNumbers.join(', ')}</div>
              <button
                onClick={() => setSelectedNumbers([])}
                className="text-red-400 text-sm hover:text-red-300"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Bet Amount */}
        <div className="mb-4">
          <div className="text-green-200 text-sm mb-2">Bet Amount:</div>
          <div className="flex items-center gap-2 mb-2">
            <button 
              onClick={() => setBetAmount(Math.max(1, betAmount - 10))}
              className="w-8 h-8 bg-green-700 rounded flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex-1 text-center text-xl font-bold bg-green-800/30 py-2 rounded">
              ₹{betAmount}
            </div>
            <button 
              onClick={() => setBetAmount(betAmount + 10)}
              className="w-8 h-8 bg-green-700 rounded flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {quickAmounts.map(amount => (
              <button 
                key={amount}
                onClick={() => setBetAmount(amount)}
                className="bg-green-700/50 py-1 rounded text-sm hover:bg-green-600/50"
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>

        {/* Place Bet Button */}
        <button 
          onClick={placeBet}
          disabled={selectedNumbers.length === 0 || gamePhase !== 'betting' || isPlaying}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
            selectedNumbers.length === 0 || gamePhase !== 'betting' || isPlaying
              ? 'bg-gray-600 text-gray-400'
              : 'bg-green-600 text-white hover:bg-green-500'
          }`}
        >
          {isPlaying ? 'Bet Placed!' : 
           gamePhase !== 'betting' ? 'Round in Progress' :
           selectedNumbers.length === 0 ? 'Select Numbers' :
           `Place Bet ₹${betAmount}`}
        </button>

        {/* Game Rules */}
        <div className="mt-4 p-4 bg-green-800/20 rounded-xl">
          <div className="text-green-300 text-sm font-semibold mb-2">How to Play:</div>
          <ul className="text-green-200 text-xs space-y-1">
            <li>• 5D draws 5 numbers (0-9) every minute</li>
            <li>• Sum: Bet on total sum of all 5 numbers</li>
            <li>• Straight: Match exact sequence</li>
            <li>• Combination: Match numbers in any order</li>
            <li>• Position: Match specific position numbers</li>
          </ul>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-4"></div>
    </div>
  );
}