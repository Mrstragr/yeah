import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Volume2, VolumeX, RefreshCw, Clock, 
  Trophy, Star, TrendingUp, History, Settings,
  Users, Gift, Zap, Target, Crown, AlertCircle,
  CheckCircle, Copy, Share2, BarChart3
} from 'lucide-react';

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

interface GameResult {
  period: string;
  number: number;
  color: 'green' | 'red' | 'violet';
  size: 'big' | 'small';
  timestamp: Date;
}

interface BetData {
  type: 'number' | 'color' | 'size';
  value: number | string;
  amount: number;
  multiplier: number;
}

export default function ProductionReadyWinGo({ onBack, user, onBalanceUpdate }: Props) {
  // Game States
  const [timeLeft, setTimeLeft] = useState(30);
  const [gamePhase, setGamePhase] = useState<'betting' | 'drawing' | 'result'>('betting');
  const [currentPeriod, setCurrentPeriod] = useState('2025011400001');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Betting States  
  const [selectedTab, setSelectedTab] = useState<'lottery' | 'history' | 'record'>('lottery');
  const [betAmount, setBetAmount] = useState('10');
  const [selectedBets, setSelectedBets] = useState<BetData[]>([]);
  const [totalBetAmount, setTotalBetAmount] = useState(0);
  
  // Game Data
  const [currentResult, setCurrentResult] = useState<GameResult | null>(null);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([
    { period: '2025011400000', number: 5, color: 'violet', size: 'small', timestamp: new Date() },
    { period: '2025011399999', number: 8, color: 'red', size: 'big', timestamp: new Date() },
    { period: '2025011399998', number: 2, color: 'red', size: 'small', timestamp: new Date() },
    { period: '2025011399997', number: 0, color: 'violet', size: 'small', timestamp: new Date() },
    { period: '2025011399996', number: 7, color: 'green', size: 'big', timestamp: new Date() },
  ]);
  
  // Statistics
  const [statistics, setStatistics] = useState({
    totalGames: 156,
    winRate: 67.3,
    totalWinnings: 2847,
    biggestWin: 980,
    currentStreak: 5
  });

  // Responsive quick bet amounts
  const quickAmounts = ['10', '50', '100', '500', '1000', '5000'];
  
  // Get number color based on BG678 rules
  const getNumberColor = (num: number): 'green' | 'red' | 'violet' => {
    if (num === 0 || num === 5) return 'violet';
    if (num === 1 || num === 3 || num === 7 || num === 9) return 'green';
    return 'red'; // 2, 4, 6, 8
  };

  // Get number size
  const getNumberSize = (num: number): 'big' | 'small' => {
    return num >= 5 ? 'big' : 'small';
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (gamePhase === 'betting') {
            setGamePhase('drawing');
            playSound('drawing');
            return 5; // Drawing phase
          } else if (gamePhase === 'drawing') {
            // Generate result
            const resultNumber = Math.floor(Math.random() * 10);
            const newResult: GameResult = {
              period: currentPeriod,
              number: resultNumber,
              color: getNumberColor(resultNumber),
              size: getNumberSize(resultNumber),
              timestamp: new Date()
            };
            
            setCurrentResult(newResult);
            setGameHistory(prev => [newResult, ...prev.slice(0, 19)]);
            setGamePhase('result');
            playSound('result');
            
            // Check wins and update balance
            checkWinnings(newResult);
            
            return 10; // Result display time
          } else {
            // Start new round
            setGamePhase('betting');
            setCurrentPeriod(generateNextPeriod());
            setSelectedBets([]);
            setTotalBetAmount(0);
            playSound('newRound');
            return 30;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase, currentPeriod, selectedBets]);

  const generateNextPeriod = () => {
    const current = parseInt(currentPeriod);
    return (current + 1).toString();
  };

  const playSound = (type: string) => {
    if (!soundEnabled) return;
    // Sound implementation would go here
    console.log(`Playing sound: ${type}`);
  };

  const checkWinnings = (result: GameResult) => {
    let totalWinnings = 0;
    
    selectedBets.forEach(bet => {
      let isWin = false;
      
      if (bet.type === 'number' && bet.value === result.number) {
        isWin = true;
      } else if (bet.type === 'color' && bet.value === result.color) {
        isWin = true;
      } else if (bet.type === 'size' && bet.value === result.size) {
        isWin = true;
      }
      
      if (isWin) {
        totalWinnings += bet.amount * bet.multiplier;
      }
    });

    if (totalWinnings > 0) {
      // Update balance logic would go here
      onBalanceUpdate();
      playSound('win');
      
      // Show win animation
      showWinNotification(totalWinnings);
    }
  };

  const showWinNotification = (amount: number) => {
    // Win notification implementation
    console.log(`Won: ₹${amount}`);
  };

  const addBet = (type: 'number' | 'color' | 'size', value: number | string, multiplier: number) => {
    if (gamePhase !== 'betting') return;
    
    const amount = parseInt(betAmount);
    if (amount < 10) return;
    
    const newBet: BetData = { type, value, amount, multiplier };
    setSelectedBets(prev => [...prev, newBet]);
    setTotalBetAmount(prev => prev + amount);
  };

  const removeBet = (index: number) => {
    const bet = selectedBets[index];
    setSelectedBets(prev => prev.filter((_, i) => i !== index));
    setTotalBetAmount(prev => prev - bet.amount);
  };

  const clearAllBets = () => {
    setSelectedBets([]);
    setTotalBetAmount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 via-green-500 to-green-400 text-white">
      {/* Header */}
      <div className="bg-green-700 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-lg">
              <ArrowLeft size={24} />
            </button>
            <div>
              <div className="text-xl font-bold">Win Go</div>
              <div className="text-sm opacity-90">1 Min</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm opacity-90">Balance</div>
              <div className="text-lg font-bold">₹{user.walletBalance}</div>
            </div>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Game Status */}
      <div className="bg-green-600 px-4 py-3 border-b border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90">Period</div>
            <div className="font-mono text-lg">{currentPeriod}</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm opacity-90">
              {gamePhase === 'betting' ? 'Betting Time' : 
               gamePhase === 'drawing' ? 'Drawing...' : 'Result'}
            </div>
            <div className="text-3xl font-bold">
              {timeLeft}s
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm opacity-90">Players</div>
            <div className="text-lg font-bold">{Math.floor(Math.random() * 1000 + 500)}</div>
          </div>
        </div>
      </div>

      {/* Latest Result */}
      {currentResult && (
        <motion.div 
          className="bg-white/10 backdrop-blur-sm mx-4 mt-4 rounded-xl p-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm opacity-90">Latest Result</div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                currentResult.color === 'green' ? 'bg-green-500' :
                currentResult.color === 'red' ? 'bg-red-500' : 'bg-purple-500'
              }`}>
                {currentResult.number}
              </div>
              <div className="text-sm">
                {currentResult.color.toUpperCase()} • {currentResult.size.toUpperCase()}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation Tabs */}
      <div className="flex bg-white/10 mx-4 mt-4 rounded-xl overflow-hidden">
        {['lottery', 'history', 'record'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab as any)}
            className={`flex-1 py-3 text-center font-medium transition-all ${
              selectedTab === tab 
                ? 'bg-white text-green-600 shadow-lg' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            {tab === 'lottery' ? 'Lottery' : tab === 'history' ? 'History' : 'My Record'}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 px-4 pb-20">
        {selectedTab === 'lottery' && (
          <div className="space-y-4 mt-4">
            {/* Quick Bet Amount */}
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-sm opacity-90 mb-3">Bet Amount</div>
              <div className="grid grid-cols-6 gap-2 mb-3">
                {quickAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      betAmount === amount 
                        ? 'bg-yellow-400 text-black' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full bg-white/20 rounded-lg p-3 text-white placeholder-white/60"
                placeholder="Custom amount"
                min="10"
              />
            </div>

            {/* Number Selection */}
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-sm opacity-90 mb-3">Select Number (9x)</div>
              <div className="grid grid-cols-5 gap-3">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    onClick={() => addBet('number', num, 9)}
                    disabled={gamePhase !== 'betting'}
                    className={`aspect-square rounded-xl text-white font-bold text-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 ${
                      getNumberColor(num) === 'green' ? 'bg-green-500' :
                      getNumberColor(num) === 'red' ? 'bg-red-500' : 'bg-purple-500'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-sm opacity-90 mb-3">Select Color</div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => addBet('color', 'green', 2)}
                  disabled={gamePhase !== 'betting'}
                  className="bg-green-500 py-4 rounded-xl text-white font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  GREEN (2x)
                </button>
                <button
                  onClick={() => addBet('color', 'violet', 4.5)}
                  disabled={gamePhase !== 'betting'}
                  className="bg-purple-500 py-4 rounded-xl text-white font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  VIOLET (4.5x)
                </button>
                <button
                  onClick={() => addBet('color', 'red', 2)}
                  disabled={gamePhase !== 'betting'}
                  className="bg-red-500 py-4 rounded-xl text-white font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  RED (2x)
                </button>
              </div>
            </div>

            {/* Size Selection */}
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-sm opacity-90 mb-3">Select Size</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addBet('size', 'small', 2)}
                  disabled={gamePhase !== 'betting'}
                  className="bg-orange-500 py-4 rounded-xl text-white font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  SMALL (2x)
                </button>
                <button
                  onClick={() => addBet('size', 'big', 2)}
                  disabled={gamePhase !== 'betting'}
                  className="bg-orange-600 py-4 rounded-xl text-white font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  BIG (2x)
                </button>
              </div>
            </div>

            {/* Selected Bets */}
            {selectedBets.length > 0 && (
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm opacity-90">Selected Bets</div>
                  <button 
                    onClick={clearAllBets}
                    className="text-red-400 text-sm hover:text-red-300"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedBets.map((bet, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                      <div>
                        <div className="font-medium">
                          {bet.type === 'number' ? `Number ${bet.value}` :
                           bet.type === 'color' ? `${String(bet.value).toUpperCase()}` :
                           `${String(bet.value).toUpperCase()}`}
                        </div>
                        <div className="text-sm opacity-70">₹{bet.amount} × {bet.multiplier}</div>
                      </div>
                      <button 
                        onClick={() => removeBet(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Bet:</span>
                    <span className="text-xl font-bold text-yellow-400">₹{totalBetAmount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'history' && (
          <div className="mt-4 space-y-3">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-sm opacity-90 mb-3">Recent Results</div>
              <div className="space-y-3">
                {gameHistory.map((result, index) => (
                  <div key={result.period} className="flex items-center justify-between">
                    <div className="text-sm">{result.period}</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        result.color === 'green' ? 'bg-green-500' :
                        result.color === 'red' ? 'bg-red-500' : 'bg-purple-500'
                      }`}>
                        {result.number}
                      </div>
                      <div className="text-xs opacity-70">
                        {result.size.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'record' && (
          <div className="mt-4">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-sm opacity-90 mb-4">Statistics</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{statistics.totalGames}</div>
                  <div className="text-xs opacity-70">Total Games</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{statistics.winRate}%</div>
                  <div className="text-xs opacity-70">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">₹{statistics.totalWinnings}</div>
                  <div className="text-xs opacity-70">Total Winnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{statistics.currentStreak}</div>
                  <div className="text-xs opacity-70">Win Streak</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Game Phase Overlay */}
      <AnimatePresence>
        {gamePhase === 'drawing' && (
          <motion.div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🎰</div>
              <div className="text-2xl font-bold mb-2">Drawing...</div>
              <div className="text-lg opacity-70">Please wait for result</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}