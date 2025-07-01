import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Trophy } from 'lucide-react';

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

export default function BG678ColorPrediction({ onBack, user, onBalanceUpdate }: Props) {
  // Game State
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentPeriod, setCurrentPeriod] = useState('20250501018564');
  const [gamePhase, setGamePhase] = useState<'betting' | 'waiting' | 'result'>('betting');
  
  // Betting State
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [showWinModal, setShowWinModal] = useState(false);
  const [winAmount, setWinAmount] = useState(19600);
  const [loading, setLoading] = useState(false);

  // Game History
  const [gameHistory] = useState([
    { period: '20250501018563', number: 0, result: 'Small', color: 'red' },
    { period: '20250501018562', number: 8, result: 'Big', color: 'green' },
    { period: '20250501018561', number: 6, result: 'Big', color: 'red' },
  ]);

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Start new round
          setGamePhase('waiting');
          setTimeout(() => {
            setGamePhase('result');
            // Show result for 3 seconds
            setTimeout(() => {
              setGamePhase('betting');
              setCurrentPeriod(prev => (parseInt(prev) + 1).toString());
            }, 3000);
          }, 2000);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBet = (type: string) => {
    setSelectedBet(type);
  };

  const handleSubmitBet = async () => {
    if (!selectedBet) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show congratulations modal for demonstration
      if (Math.random() > 0.5) {
        setShowWinModal(true);
        setTimeout(() => setShowWinModal(false), 4000);
      }
    } catch (error) {
      console.error('Bet failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const numberColors = {
    0: 'text-red-500 bg-red-100',
    1: 'text-green-500 bg-green-100',
    2: 'text-red-500 bg-red-100',
    3: 'text-green-500 bg-green-100',
    4: 'text-red-500 bg-red-100',
    5: 'text-purple-500 bg-purple-100',
    6: 'text-red-500 bg-red-100',
    7: 'text-green-500 bg-green-100',
    8: 'text-red-500 bg-red-100',
    9: 'text-green-500 bg-green-100',
  };

  return (
    <div className="min-h-screen bg-gray-100 max-w-md mx-auto relative">
      {/* Header */}
      <div className="bg-green-500 text-white p-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-xl font-bold">BG678</div>
          <div className="flex gap-2">
            <button className="bg-green-600 px-4 py-1 rounded-full text-sm">📞</button>
            <button className="bg-green-600 px-4 py-1 rounded-full text-sm">🎧</button>
          </div>
        </div>
        
        <div className="flex gap-2 mb-4">
          <button className="bg-white text-green-500 px-6 py-2 rounded-full font-semibold flex-1">
            Withdraw
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold flex-1">
            Deposit
          </button>
        </div>

        <div className="bg-green-400 p-2 rounded flex items-center">
          <span className="text-sm">📋 Detail</span>
        </div>
      </div>

      {/* Game Selection Tabs */}
      <div className="bg-white flex shadow-sm">
        {['Win Go 1Min', 'Win Go 3Min', 'Win Go 5Min', 'Win Go 10Min', 'Win Go'].map((game, index) => (
          <button 
            key={game}
            className={`flex-1 py-3 text-xs ${index === 1 ? 'bg-green-500 text-white' : 'text-gray-500'}`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 mx-auto mb-1"></div>
            {game}
          </button>
        ))}
      </div>

      {/* Game Info */}
      <div className="bg-white p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <button className="bg-green-500 text-white px-4 py-2 rounded text-sm">
            📖 How to play
          </button>
          <div className="text-right">
            <div className="text-sm text-gray-600">Time remaining</div>
            <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">WinGo 30 second</div>
        <div className="flex items-center gap-2 mt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center">
              <span className="text-xs">❤️</span>
            </div>
          ))}
          <span className="text-lg font-bold">{currentPeriod}</span>
        </div>
      </div>

      {/* Color Betting Options */}
      <div className="bg-white p-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button 
            onClick={() => handleBet('green')}
            className={`bg-green-500 text-white py-3 rounded font-bold text-lg ${selectedBet === 'green' ? 'ring-4 ring-green-300' : ''}`}
          >
            Green <span className="text-sm">2X</span>
          </button>
          <button 
            onClick={() => handleBet('violet')}
            className={`bg-purple-500 text-white py-3 rounded font-bold text-lg ${selectedBet === 'violet' ? 'ring-4 ring-purple-300' : ''}`}
          >
            Violet <span className="text-sm">4.5X</span>
          </button>
          <button 
            onClick={() => handleBet('red')}
            className={`bg-red-500 text-white py-3 rounded font-bold text-lg ${selectedBet === 'red' ? 'ring-4 ring-red-300' : ''}`}
          >
            Red <span className="text-sm">2X</span>
          </button>
        </div>

        {/* Number Grid */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleBet(`number-${num}`)}
              className={`w-12 h-12 rounded-full border-2 font-bold text-lg ${
                selectedBet === `number-${num}` ? 'ring-4 ring-blue-300' : ''
              } ${numberColors[num as keyof typeof numberColors]}`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Size Betting */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button 
            onClick={() => handleBet('big')}
            className={`bg-orange-500 text-white py-3 rounded font-bold ${selectedBet === 'big' ? 'ring-4 ring-orange-300' : ''}`}
          >
            Big <span className="text-sm">2X</span>
          </button>
          <button 
            onClick={() => handleBet('small')}
            className={`bg-blue-500 text-white py-3 rounded font-bold ${selectedBet === 'small' ? 'ring-4 ring-blue-300' : ''}`}
          >
            Small <span className="text-sm">2X</span>
          </button>
        </div>
      </div>

      {/* Game History */}
      <div className="bg-white p-4 border-t">
        <div className="flex justify-between text-sm mb-2">
          <button className="text-green-500 font-semibold">Game history</button>
          <button className="text-gray-500">Chart</button>
          <button className="text-gray-500">My history</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="p-2 text-left">Period</th>
                <th className="p-2 text-center">Number</th>
                <th className="p-2 text-center">Big/Small</th>
                <th className="p-2 text-center">Color</th>
              </tr>
            </thead>
            <tbody>
              {gameHistory.map((game, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{game.period}</td>
                  <td className="p-2 text-center">
                    <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-white ${
                      game.color === 'red' ? 'bg-red-500' : game.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                    }`}>
                      {game.number}
                    </span>
                  </td>
                  <td className="p-2 text-center">{game.result}</td>
                  <td className="p-2 text-center">
                    <div className={`w-4 h-4 rounded-full mx-auto ${
                      game.color === 'red' ? 'bg-red-500' : game.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                    }`}></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Betting Panel */}
      {selectedBet && (
        <div className="fixed bottom-0 left-0 right-0 bg-orange-400 text-white p-4 max-w-md mx-auto">
          <div className="text-center font-bold mb-3">WinGo 30 second</div>
          <div className="bg-white text-black p-2 rounded mb-3 text-center">
            Select {selectedBet}
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span>Balance</span>
            <div className="flex items-center gap-2">
              <span>1</span>
              <span>10</span>
              <span>100</span>
              <span className="bg-orange-500 px-3 py-1 rounded">1000</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span>Quantity</span>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedBet(null)}
              className="flex-1 bg-gray-500 text-white py-3 rounded font-bold"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmitBet}
              disabled={loading}
              className="flex-1 bg-green-500 text-white py-3 rounded font-bold"
            >
              {loading ? 'Placing...' : 'Confirm'}
            </button>
          </div>
        </div>
      )}

      {/* Congratulations Modal */}
      <AnimatePresence>
        {showWinModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gradient-to-b from-red-500 to-orange-500 rounded-2xl p-6 text-white text-center max-w-sm w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <div className="text-6xl mb-4">🏆</div>
              <div className="text-2xl font-bold mb-2">Congratulations</div>
              <div className="text-sm mb-4">Lottery results</div>
              
              <div className="bg-white/20 rounded-lg p-3 mb-4">
                <div className="text-sm mb-2">Red • 8 • Big</div>
                <div className="bg-red-100 text-red-800 rounded px-3 py-2 font-bold">
                  Bonus
                </div>
                <div className="text-2xl font-bold mt-2">₹{winAmount}</div>
              </div>
              
              <div className="text-xs text-white/80">
                Period:wingo30 result:{currentPeriod}
              </div>
              
              <div className="text-xs text-white/80 mt-2">
                ⏱ 3 seconds auto close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}