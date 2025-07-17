import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useSmartBalance } from '@/hooks/useSmartBalance';

interface GameResult {
  period: string;
  number: number;
  color: string;
  bigSmall: string;
  timestamp: Date;
}

interface BetSelection {
  type: 'color' | 'number' | 'size';
  value: string | number;
  multiplier: number;
  amount: number;
}

interface Props {
  onBack: () => void;
  user?: any;
  onBalanceUpdate?: (newBalance: number) => void;
}

export function AuthenticBG678WinGo({ onBack, user, onBalanceUpdate }: Props) {
  const { balance, updateBalance } = useSmartBalance();
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [selectedBets, setSelectedBets] = useState<BetSelection[]>([]);
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [isBetting, setIsBetting] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [showBetSuccess, setShowBetSuccess] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameRunning, setIsGameRunning] = useState(false);

  // Generate period number in authentic format
  const generatePeriod = useCallback(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(Math.floor(now.getMinutes() / 3) * 3).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
  }, []);

  // Initialize game
  useEffect(() => {
    setCurrentPeriod(generatePeriod());
    
    // Load demo history
    setGameHistory([
      { period: '20250501018643', number: 0, color: 'red', bigSmall: 'small', timestamp: new Date() },
      { period: '20250501018642', number: 8, color: 'red', bigSmall: 'big', timestamp: new Date() },
      { period: '20250501018641', number: 8, color: 'red', bigSmall: 'big', timestamp: new Date() },
    ]);
  }, [generatePeriod]);

  // Game timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleGameEnd();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-close congratulations popup
  useEffect(() => {
    if (showCongrats) {
      const timer = setTimeout(() => {
        setShowCongrats(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCongrats]);

  const handleGameEnd = () => {
    if (selectedBets.length === 0) {
      setCurrentPeriod(generatePeriod());
      return;
    }

    setIsGameRunning(true);
    
    // Generate result
    const resultNumber = Math.floor(Math.random() * 10);
    const resultColor = resultNumber === 0 ? 'red' : 
                       resultNumber === 5 ? 'green' : 
                       [1, 3, 7, 9].includes(resultNumber) ? 'green' : 'red';
    const resultSize = resultNumber >= 5 ? 'big' : 'small';

    // Calculate winnings
    let totalWin = 0;
    selectedBets.forEach(bet => {
      let isWin = false;
      
      if (bet.type === 'color' && bet.value === resultColor) isWin = true;
      if (bet.type === 'number' && bet.value === resultNumber) isWin = true;
      if (bet.type === 'size' && bet.value === resultSize) isWin = true;
      
      if (isWin) {
        totalWin += bet.amount * bet.multiplier;
      }
    });

    // Update balance and show results
    if (totalWin > 0) {
      updateBalance(totalWin, 'add');
      setWinAmount(totalWin);
      setTimeout(() => setShowCongrats(true), 1000);
    }

    // Add to history
    const newResult: GameResult = {
      period: currentPeriod,
      number: resultNumber,
      color: resultColor,
      bigSmall: resultSize,
      timestamp: new Date()
    };
    
    setGameHistory(prev => [newResult, ...prev.slice(0, 9)]);
    setSelectedBets([]);
    setCurrentPeriod(generatePeriod());
    
    setTimeout(() => setIsGameRunning(false), 2000);
  };

  const placeBet = (type: 'color' | 'number' | 'size', value: string | number, mult: number) => {
    const totalBetAmount = betAmount * multiplier;
    
    if (parseFloat(balance) < totalBetAmount) {
      alert('Insufficient balance!');
      return;
    }

    const newBet: BetSelection = {
      type,
      value,
      multiplier: mult,
      amount: totalBetAmount
    };

    setSelectedBets(prev => [...prev, newBet]);
    updateBalance(totalBetAmount, 'subtract');
    setIsBetting(true);
    setShowBetSuccess(true);
    
    setTimeout(() => setShowBetSuccess(false), 1500);
    setTimeout(() => setIsBetting(false), 300);
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return 'bg-gradient-to-b from-red-400 to-red-600 text-white';
    if (num === 5) return 'bg-gradient-to-b from-green-400 to-green-600 text-white';
    if ([1, 3, 7, 9].includes(num)) return 'bg-gradient-to-b from-green-400 to-green-600 text-white';
    return 'bg-gradient-to-b from-red-400 to-red-600 text-white';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Authentic BG678 Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-white">
              <ArrowLeft size={24} />
            </button>
            <div className="text-white font-bold text-xl">BG678</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-white">
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <div className="text-white text-sm">💰 ₹{balance}</div>
          </div>
        </div>
      </div>

      {/* Game Types Row */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="flex justify-between">
          <button className="p-2 bg-green-500 text-white rounded-lg font-bold text-xs">
            Win Go<br />30S
          </button>
          <button className="p-2 bg-gray-200 text-gray-600 rounded-lg font-bold text-xs">
            TRX<br />1Min
          </button>
          <button className="p-2 bg-gray-200 text-gray-600 rounded-lg font-bold text-xs">
            TRX<br />3Min
          </button>
          <button className="p-2 bg-gray-200 text-gray-600 rounded-lg font-bold text-xs">
            TRX<br />5Min
          </button>
          <button className="p-2 bg-gray-200 text-gray-600 rounded-lg font-bold text-xs">
            TRX<br />10Min
          </button>
        </div>
      </div>

      {/* Game Info Section */}
      <div className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
        {/* How to Play & Timer */}
        <div className="flex justify-between items-center mb-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
            📖 How to play
          </button>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Time remaining</div>
            <div className="flex items-center gap-1">
              {String(Math.floor(timeRemaining / 60)).padStart(1, '0').split('').map((digit, i) => (
                <div key={i} className="bg-black text-white px-2 py-1 rounded text-lg font-bold">
                  {digit}
                </div>
              ))}
              <span className="text-black font-bold">:</span>
              {String(timeRemaining % 60).padStart(2, '0').split('').map((digit, i) => (
                <div key={i} className="bg-black text-white px-2 py-1 rounded text-lg font-bold">
                  {digit}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Period Info */}
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600 mb-1">WinGo 30 second</div>
          <div className="flex justify-center gap-1 mb-2">
            {[0, 1, 2, 3, 4].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">⚡</span>
              </div>
            ))}
          </div>
          <div className="text-lg font-bold">{currentPeriod}</div>
        </div>

        {/* Color Betting */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => placeBet('color', 'green', 2)}
            className="bg-green-500 text-white py-3 rounded-lg font-bold"
          >
            Green <span className="text-sm">2X</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => placeBet('color', 'violet', 4.5)}
            className="bg-purple-600 text-white py-3 rounded-lg font-bold"
          >
            Violet <span className="text-sm">4.5X</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => placeBet('color', 'red', 2)}
            className="bg-red-500 text-white py-3 rounded-lg font-bold"
          >
            Red <span className="text-sm">2X</span>
          </motion.button>
        </div>

        {/* Number Grid */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeBet('number', num, num === 0 || num === 5 ? 4.5 : 9)}
              className={`aspect-square rounded-xl ${getNumberColor(num)} text-2xl font-bold shadow-lg border-2 border-white`}
            >
              {num}
            </motion.button>
          ))}
        </div>

        {/* Random & Multiplier Row */}
        <div className="flex items-center gap-2 mb-4">
          <button className="bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm">
            Random
          </button>
          {[1, 5, 10, 20, 50, 100].map(mult => (
            <button
              key={mult}
              onClick={() => setMultiplier(mult)}
              className={`px-3 py-2 rounded-lg text-sm font-bold ${
                multiplier === mult 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              X{mult}
            </button>
          ))}
        </div>

        {/* Big/Small Betting */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => placeBet('size', 'big', 2)}
            className="bg-orange-500 text-white py-4 rounded-lg font-bold text-lg"
          >
            Big <span className="text-sm">2X</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => placeBet('size', 'small', 2)}
            className="bg-blue-500 text-white py-4 rounded-lg font-bold text-lg"
          >
            Small <span className="text-sm">2X</span>
          </motion.button>
        </div>
      </div>

      {/* Betting Amount Selection */}
      {selectedBets.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg"
        >
          <div className="bg-orange-400 text-white p-3 rounded-lg mb-3">
            <div className="text-center font-bold">WinGo 30 second</div>
            <div className="text-center text-sm">Select: big</div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">Balance</span>
            <div className="flex items-center gap-2">
              {[1, 10, 100, 1000].map(amount => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`px-3 py-1 rounded ${
                    betAmount === amount ? 'bg-orange-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">Quantity</span>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 bg-orange-500 text-white rounded">-</button>
              <span className="px-4 py-1 bg-gray-100 rounded">{multiplier}</span>
              <button className="w-8 h-8 bg-orange-500 text-white rounded">+</button>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            {[1, 5, 10, 20, 50, 100].map(mult => (
              <button
                key={mult}
                onClick={() => setMultiplier(mult)}
                className={`px-3 py-1 rounded text-sm ${
                  multiplier === mult ? 'bg-orange-500 text-white' : 'bg-gray-200'
                }`}
              >
                X{mult}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setSelectedBets([])}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-bold"
            >
              Cancel
            </button>
            <button className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-bold">
              Total bet ₹{betAmount * multiplier * selectedBets.length}
            </button>
          </div>
        </motion.div>
      )}

      {/* Game History */}
      <div className="mx-4 mt-4 mb-20">
        <div className="flex gap-2 mb-3">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm">
            Game history
          </button>
          <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold text-sm">
            Chart
          </button>
          <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold text-sm">
            My history
          </button>
        </div>

        <div className="bg-white rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 bg-green-500 text-white p-3 text-sm font-bold">
            <div>Period</div>
            <div>Number</div>
            <div>Big Small</div>
            <div>Color</div>
          </div>
          {gameHistory.map((result, index) => (
            <div key={index} className="grid grid-cols-4 p-3 border-b text-sm">
              <div className="text-gray-600">{result.period}</div>
              <div className={`font-bold ${result.color === 'red' ? 'text-red-500' : 'text-green-500'}`}>
                {result.number}
              </div>
              <div className="capitalize">{result.bigSmall}</div>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${
                  result.color === 'red' ? 'bg-red-500' : 
                  result.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                }`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Congratulations Popup */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-orange-400 to-red-500 rounded-2xl p-6 mx-4 text-center"
            >
              <div className="text-6xl mb-4">🏆</div>
              <div className="text-white text-3xl font-bold mb-2">Congratulations</div>
              <div className="text-white text-sm mb-4">Lottery results: Red ⭕ Big</div>
              <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
                <div className="text-sm mb-1">Bonus</div>
                <div className="text-3xl font-bold">₹{winAmount}</div>
                <div className="text-xs">Period:wingo30second {currentPeriod}</div>
              </div>
              <div className="text-white text-sm">⏰ 3 seconds auto close</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bet Success Notification */}
      <AnimatePresence>
        {showBetSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold z-50"
          >
            Bet success
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}

export default AuthenticBG678WinGo;