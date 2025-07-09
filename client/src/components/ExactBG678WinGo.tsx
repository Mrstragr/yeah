import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, HelpCircle, BarChart3, MessageCircle } from 'lucide-react';
import { apiRequest } from '../lib/queryClient';
import { useSmartBalance } from '../hooks/useSmartBalance';

interface ExactBG678WinGoProps {
  onBack: () => void;
}

export default function ExactBG678WinGo({ onBack }: ExactBG678WinGoProps) {
  const { balance, refreshBalance } = useSmartBalance();
  
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [currentPeriod, setCurrentPeriod] = useState('202505010186');
  const [gameHistory, setGameHistory] = useState([
    { period: '202505010186', number: 0, result: 'Small' },
    { period: '202505010185', number: 8, result: 'Big' },
    { period: '202505010184', number: 0, result: 'Small' },
    { period: '202505010183', number: 8, result: 'Big' },
    { period: '202505010182', number: 0, result: 'Small' }
  ]);
  
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [multiplier, setMultiplier] = useState('X1');
  const [showBetModal, setShowBetModal] = useState(false);
  const [currentTab, setCurrentTab] = useState('Game History');
  const [activeBet, setActiveBet] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  // Timer management
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (activeBet) {
            processGameResult();
          }
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeBet]);

  const processGameResult = async () => {
    if (!activeBet) return;

    const resultNumber = Math.floor(Math.random() * 10);
    const result = {
      period: currentPeriod,
      number: resultNumber,
      result: resultNumber >= 5 ? 'Big' : 'Small'
    };

    setLastResult(result);
    setGameHistory(prev => [result, ...prev.slice(0, 4)]);

    // Check win conditions
    let isWin = false;
    let winAmount = 0;
    const multiplierValue = parseInt(multiplier.replace('X', ''));
    const totalBet = betAmount * quantity * multiplierValue;

    if (activeBet.betType === 'color' && activeBet.betValue === getNumberColor(resultNumber)) {
      isWin = true;
      winAmount = totalBet * 2;
    } else if (activeBet.betType === 'number' && activeBet.betValue === resultNumber) {
      isWin = true;
      winAmount = totalBet * 9;
    } else if (activeBet.betType === 'size' && activeBet.betValue === (resultNumber >= 5 ? 'Big' : 'Small')) {
      isWin = true;
      winAmount = totalBet * 2;
    }

    try {
      await apiRequest('POST', '/api/games/bet', {
        gameId: 1,
        betAmount: totalBet,
        betType: activeBet.betType,
        betValue: activeBet.betValue,
        won: isWin,
        winAmount: winAmount
      });
      refreshBalance();
    } catch (error) {
      console.error('Bet processing error:', error);
    }

    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      setActiveBet(null);
    }, 3000);
  };

  const getNumberColor = (num: number) => {
    if (num === 0 || num === 5) return 'violet';
    if ([1, 3, 7, 9].includes(num)) return 'green';
    return 'red';
  };

  const handleBetSelection = (betType: string, betValue: any) => {
    setSelectedBet(`${betType}-${betValue}`);
    setShowBetModal(true);
  };

  const placeBet = () => {
    if (!selectedBet || timeRemaining <= 5) return;
    
    const [betType, betValue] = selectedBet.split('-');
    const multiplierValue = parseInt(multiplier.replace('X', ''));
    const totalBet = betAmount * quantity * multiplierValue;
    
    if (parseFloat(balance) < totalBet) return;
    
    setActiveBet({
      betType,
      betValue,
      amount: totalBet,
      period: currentPeriod
    });
    setShowBetModal(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600 text-white relative">
      {/* Header */}
      <div className="bg-green-500 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <div className="text-lg font-bold">BG678</div>
        </div>
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-5 h-5" />
          <HelpCircle className="w-5 h-5" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-green-500 px-4 py-2 flex space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">Win</span>
          </div>
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <span className="text-xs">Go</span>
          </div>
        </div>
      </div>

      {/* How to Play & Timer */}
      <div className="bg-green-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-green-600 px-3 py-1 rounded-full text-sm">
            📘 How to play
          </div>
          <div className="text-sm">WinGo 30 Second</div>
        </div>
        <div className="text-right">
          <div className="text-sm">Time remaining</div>
          <div className="text-2xl font-bold">{formatTime(timeRemaining)}</div>
          <div className="text-xs">{currentPeriod}</div>
        </div>
      </div>

      {/* Color Betting */}
      <div className="px-4 py-4 bg-white text-black">
        <div className="flex space-x-2 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBetSelection('color', 'green')}
            className="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold text-lg relative"
          >
            Green
            <span className="absolute top-1 right-2 text-xs">2X</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBetSelection('color', 'violet')}
            className="flex-1 bg-purple-500 text-white py-3 rounded-lg font-bold text-lg relative"
          >
            Violet
            <span className="absolute top-1 right-2 text-xs">4.5X</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBetSelection('color', 'red')}
            className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold text-lg relative"
          >
            Red
            <span className="absolute top-1 right-2 text-xs">2X</span>
          </motion.button>
        </div>

        {/* Number Betting */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <motion.button
              key={number}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBetSelection('number', number)}
              className={`aspect-square rounded-full text-white font-bold text-lg flex items-center justify-center ${
                number === 0 || number === 5 ? 'bg-purple-500' : 
                [1, 3, 7, 9].includes(number) ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {number}
            </motion.button>
          ))}
        </div>

        {/* Size Betting */}
        <div className="bg-orange-400 rounded-lg p-3 mb-4">
          <div className="text-white font-bold text-center mb-2">WinGo 30 second</div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBetSelection('size', 'Small')}
              className="flex-1 bg-white text-orange-400 py-2 rounded font-bold"
            >
              Small
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBetSelection('size', 'Big')}
              className="flex-1 bg-white text-orange-400 py-2 rounded font-bold"
            >
              Big
            </motion.button>
          </div>
        </div>

        {/* Multiplier Selection */}
        <div className="flex space-x-2 mb-4">
          <span className="text-gray-500">Random</span>
          {['X1', 'X5', 'X10', 'X20', 'X50', 'X100'].map((mult) => (
            <button
              key={mult}
              onClick={() => setMultiplier(mult)}
              className={`px-3 py-1 rounded ${
                multiplier === mult ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {mult}
            </button>
          ))}
        </div>

        {/* Game History/Chart Toggle */}
        <div className="flex mb-4">
          <button
            onClick={() => setCurrentTab('Game History')}
            className={`flex-1 py-2 font-bold ${
              currentTab === 'Game History' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Game History
          </button>
          <button
            onClick={() => setCurrentTab('Chart')}
            className={`flex-1 py-2 font-bold ${
              currentTab === 'Chart' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Chart
          </button>
        </div>

        {/* History Table */}
        {currentTab === 'Game History' && (
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="bg-green-500 text-white px-4 py-2 grid grid-cols-3 text-sm font-bold">
              <span>Period</span>
              <span>Number</span>
              <span>Big Small</span>
            </div>
            {gameHistory.map((item, index) => (
              <div key={index} className="px-4 py-2 border-b grid grid-cols-3 text-sm">
                <span className="text-gray-600">{item.period}</span>
                <span className={`font-bold ${
                  item.number === 0 || item.number === 5 ? 'text-purple-500' : 
                  [1, 3, 7, 9].includes(item.number) ? 'text-green-500' : 'text-red-500'
                }`}>
                  {item.number}
                </span>
                <span>{item.result}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Bet Display */}
      {activeBet && (
        <div className="fixed bottom-20 left-4 right-4 bg-yellow-400 text-black p-3 rounded-lg">
          <div className="text-center font-bold">
            Bet Success! {activeBet.betType}: {activeBet.betValue} • ₹{activeBet.amount}
          </div>
        </div>
      )}

      {/* Bet Modal */}
      <AnimatePresence>
        {showBetModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-end z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full rounded-t-2xl p-6 text-black"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
            >
              <div className="bg-orange-400 text-white p-3 rounded-lg mb-4">
                <div className="font-bold">WinGo 30 second</div>
                <div className="text-sm">Select: {selectedBet?.split('-')[1]}</div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span>Balance</span>
                <div className="flex items-center space-x-2">
                  <span>{betAmount}</span>
                  <span>10</span>
                  <span>100</span>
                  <span className="bg-orange-400 text-white px-3 py-1 rounded">1000</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span>Quantity</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 bg-orange-400 text-white rounded flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="px-4">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 bg-orange-400 text-white rounded flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-2 mb-4">
                {['X1', 'X5', 'X10', 'X20', 'X50', 'X100'].map((mult) => (
                  <button
                    key={mult}
                    onClick={() => setMultiplier(mult)}
                    className={`px-3 py-1 rounded ${
                      multiplier === mult ? 'bg-orange-400 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {mult}
                  </button>
                ))}
              </div>

              <div className="flex items-center mb-4">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">I agree (*Pre-sale rules)</span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setShowBetModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={placeBet}
                  className="flex-1 bg-orange-400 text-white py-3 rounded-lg font-bold"
                >
                  Total {betAmount * quantity * parseInt(multiplier.replace('X', ''))}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && lastResult && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-black p-8 rounded-2xl text-center max-w-sm w-full mx-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              <div className="text-2xl font-bold mb-4">Period {lastResult.period}</div>
              <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold ${
                lastResult.number === 0 || lastResult.number === 5 ? 'bg-purple-500' : 
                [1, 3, 7, 9].includes(lastResult.number) ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {lastResult.number}
              </div>
              <div className="text-lg font-bold mb-2">{lastResult.result}</div>
              <div className="text-sm text-gray-600">
                {getNumberColor(lastResult.number).charAt(0).toUpperCase() + getNumberColor(lastResult.number).slice(1)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}