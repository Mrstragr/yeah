import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Volume2, VolumeX, RefreshCw, Clock, 
  Trophy, Star, TrendingUp, History, Settings,
  Users, Gift, Zap, Target, Crown, AlertCircle,
  CheckCircle, Copy, Share2, BarChart3, Circle
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

export default function AuthenticWinGoGame({ onBack, user, onBalanceUpdate }: Props) {
  // Game States
  const [timeLeft, setTimeLeft] = useState(30);
  const [gamePhase, setGamePhase] = useState<'betting' | 'drawing' | 'result'>('betting');
  const [currentPeriod, setCurrentPeriod] = useState('20250117001');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Betting States  
  const [selectedTab, setSelectedTab] = useState<'lottery' | 'history' | 'record'>('lottery');
  const [betAmount, setBetAmount] = useState('10');
  const [selectedBets, setSelectedBets] = useState<BetData[]>([]);
  const [totalBetAmount, setTotalBetAmount] = useState(0);
  const [showBetModal, setShowBetModal] = useState(false);
  const [selectedBetType, setSelectedBetType] = useState<{type: string, value: any, multiplier: number} | null>(null);
  
  // Game Data
  const [currentResult, setCurrentResult] = useState<GameResult | null>(null);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([
    { period: '20250117000', number: 5, color: 'violet', size: 'small', timestamp: new Date() },
    { period: '20250116999', number: 8, color: 'red', size: 'big', timestamp: new Date() },
    { period: '20250116998', number: 2, color: 'red', size: 'small', timestamp: new Date() },
    { period: '20250116997', number: 0, color: 'violet', size: 'small', timestamp: new Date() },
    { period: '20250116996', number: 7, color: 'green', size: 'big', timestamp: new Date() },
  ]);
  
  // Statistics
  const [statistics, setStatistics] = useState({
    totalPlayers: 12847,
    totalWinnings: '₹2,84,750',
    winRate: 67.3,
    currentJackpot: '₹4,56,890'
  });

  // Responsive quick bet amounts
  const quickAmounts = ['10', '50', '100', '500', '1000', '5000'];
  
  // Get number color based on authentic Indian gaming rules
  const getNumberColor = (num: number): 'green' | 'red' | 'violet' => {
    if (num === 0 || num === 5) return 'violet';
    if (num === 1 || num === 3 || num === 7 || num === 9) return 'green';
    return 'red'; // 2, 4, 6, 8
  };

  // Get number size
  const getNumberSize = (num: number): 'big' | 'small' => {
    return num >= 5 ? 'big' : 'small';
  };

  // Color scheme matching real Indian platforms
  const colorStyles = {
    green: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-green-500/30',
    red: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30',
    violet: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/30',
    big: 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30',
    small: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (gamePhase === 'betting') {
            setGamePhase('drawing');
            return 5; // Drawing phase
          } else if (gamePhase === 'drawing') {
            generateResult();
            setGamePhase('result');
            return 10; // Result display
          } else {
            setGamePhase('betting');
            incrementPeriod();
            return 30; // Next round
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase]);

  const generateResult = () => {
    const number = Math.floor(Math.random() * 10);
    const color = getNumberColor(number);
    const size = getNumberSize(number);
    
    const result: GameResult = {
      period: currentPeriod,
      number,
      color,
      size,
      timestamp: new Date()
    };
    
    setCurrentResult(result);
    setGameHistory(prev => [result, ...prev.slice(0, 9)]);
  };

  const incrementPeriod = () => {
    const num = parseInt(currentPeriod.slice(-3)) + 1;
    setCurrentPeriod(`20250117${num.toString().padStart(3, '0')}`);
  };

  const handleBetSelection = (type: string, value: any, multiplier: number) => {
    setSelectedBetType({ type, value, multiplier });
    setShowBetModal(true);
  };

  const placeBet = () => {
    if (selectedBetType) {
      const bet: BetData = {
        type: selectedBetType.type as any,
        value: selectedBetType.value,
        amount: parseInt(betAmount),
        multiplier: selectedBetType.multiplier
      };
      
      setSelectedBets(prev => [...prev, bet]);
      setTotalBetAmount(prev => prev + bet.amount);
      setShowBetModal(false);
      setSelectedBetType(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white max-w-md mx-auto relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-red-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-emerald-600 to-green-700 p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold">Win Go</h1>
            <p className="text-green-100 text-sm">Color & Number Prediction</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Game Status Bar */}
      <div className="relative z-10 bg-black/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-center">
            <p className="text-gray-400 text-xs">Period</p>
            <p className="text-white font-mono text-sm">{currentPeriod}</p>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-xs">Time Left</p>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className={`font-mono text-xl font-bold ${
                timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-yellow-400'
              }`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-xs">Status</p>
            <p className={`text-sm font-semibold ${
              gamePhase === 'betting' ? 'text-green-400' : 
              gamePhase === 'drawing' ? 'text-yellow-400' : 'text-blue-400'
            }`}>
              {gamePhase === 'betting' ? 'Betting' : 
               gamePhase === 'drawing' ? 'Drawing' : 'Result'}
            </p>
          </div>
        </div>

        {/* Phase Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className={`h-2 rounded-full ${
              gamePhase === 'betting' ? 'bg-green-500' : 
              gamePhase === 'drawing' ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            initial={{ width: 0 }}
            animate={{ 
              width: gamePhase === 'betting' ? `${((30 - timeLeft) / 30) * 100}%` :
                     gamePhase === 'drawing' ? `${((5 - timeLeft) / 5) * 100}%` :
                     `${((10 - timeLeft) / 10) * 100}%`
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Statistics Panel */}
      <div className="relative z-10 bg-black/30 backdrop-blur-sm p-4 border-b border-white/10">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-3 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-300">Live Players</span>
            </div>
            <p className="text-lg font-bold text-white">{statistics.totalPlayers.toLocaleString()}</p>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-3 border border-yellow-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-300">Jackpot</span>
            </div>
            <p className="text-lg font-bold text-white">{statistics.currentJackpot}</p>
          </div>
        </div>
      </div>

      {/* Last Result Display */}
      {currentResult && gamePhase === 'result' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 bg-gradient-to-r from-indigo-600 to-purple-700 p-4 m-4 rounded-xl shadow-xl border border-indigo-500/50"
        >
          <div className="text-center">
            <h3 className="text-lg font-bold mb-3 text-white">Latest Result</h3>
            <div className="flex items-center justify-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${colorStyles[currentResult.color]} border-2 border-white/30`}>
                {currentResult.number}
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-200">Period: {currentResult.period}</p>
                <p className="text-sm text-gray-200">Color: <span className="capitalize">{currentResult.color}</span></p>
                <p className="text-sm text-gray-200">Size: <span className="capitalize">{currentResult.size}</span></p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Game Area */}
      <div className="relative z-10 p-4">
        {/* Tab Navigation */}
        <div className="flex mb-4 bg-black/30 rounded-lg p-1">
          {(['lottery', 'history', 'record'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                selectedTab === tab 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Lottery Tab */}
        {selectedTab === 'lottery' && (
          <div className="space-y-6">
            {/* Color Betting */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Color Prediction
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleBetSelection('color', 'green', 2)}
                  disabled={gamePhase !== 'betting'}
                  className={`h-16 rounded-xl font-bold text-lg transition-all ${colorStyles.green} disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
                >
                  GREEN
                  <div className="text-xs opacity-80">2x</div>
                </button>
                <button
                  onClick={() => handleBetSelection('color', 'violet', 4.5)}
                  disabled={gamePhase !== 'betting'}
                  className={`h-16 rounded-xl font-bold text-lg transition-all ${colorStyles.violet} disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
                >
                  VIOLET
                  <div className="text-xs opacity-80">4.5x</div>
                </button>
                <button
                  onClick={() => handleBetSelection('color', 'red', 2)}
                  disabled={gamePhase !== 'betting'}
                  className={`h-16 rounded-xl font-bold text-lg transition-all ${colorStyles.red} disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
                >
                  RED
                  <div className="text-xs opacity-80">2x</div>
                </button>
              </div>
            </div>

            {/* Number Betting */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Circle className="w-5 h-5 text-blue-400" />
                Number Selection
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                  <button
                    key={number}
                    onClick={() => handleBetSelection('number', number, 9)}
                    disabled={gamePhase !== 'betting'}
                    className={`h-14 rounded-xl font-bold text-lg transition-all ${colorStyles[getNumberColor(number)]} disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
                  >
                    {number}
                    <div className="text-xs opacity-80">9x</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Betting */}
            <div className="bg-black/30 rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-400" />
                Size Prediction
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleBetSelection('size', 'small', 2)}
                  disabled={gamePhase !== 'betting'}
                  className={`h-16 rounded-xl font-bold text-lg transition-all ${colorStyles.small} disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
                >
                  SMALL
                  <div className="text-xs opacity-80">0-4 • 2x</div>
                </button>
                <button
                  onClick={() => handleBetSelection('size', 'big', 2)}
                  disabled={gamePhase !== 'betting'}
                  className={`h-16 rounded-xl font-bold text-lg transition-all ${colorStyles.big} disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
                >
                  BIG
                  <div className="text-xs opacity-80">5-9 • 2x</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {selectedTab === 'history' && (
          <div className="bg-black/30 rounded-xl p-4 border border-white/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-purple-400" />
              Game History
            </h3>
            <div className="space-y-3">
              {gameHistory.map((result, index) => (
                <div key={result.period} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${colorStyles[result.color]}`}>
                      {result.number}
                    </div>
                    <div>
                      <p className="text-white font-medium">Period {result.period}</p>
                      <p className="text-gray-400 text-xs">{result.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm capitalize">{result.color}</p>
                    <p className="text-gray-400 text-xs capitalize">{result.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Record Tab */}
        {selectedTab === 'record' && (
          <div className="bg-black/30 rounded-xl p-4 border border-white/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              My Records
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-lg p-4 border border-green-500/30">
                <Trophy className="w-8 h-8 text-green-400 mb-2" />
                <p className="text-2xl font-bold text-white">67.3%</p>
                <p className="text-green-300 text-sm">Win Rate</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-lg p-4 border border-yellow-500/30">
                <Star className="w-8 h-8 text-yellow-400 mb-2" />
                <p className="text-2xl font-bold text-white">₹2,847</p>
                <p className="text-yellow-300 text-sm">Total Wins</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-lg p-4 border border-blue-500/30">
                <Zap className="w-8 h-8 text-blue-400 mb-2" />
                <p className="text-2xl font-bold text-white">5</p>
                <p className="text-blue-300 text-sm">Win Streak</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg p-4 border border-purple-500/30">
                <Crown className="w-8 h-8 text-purple-400 mb-2" />
                <p className="text-2xl font-bold text-white">₹980</p>
                <p className="text-purple-300 text-sm">Biggest Win</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Bets Display */}
      {selectedBets.length > 0 && (
        <div className="relative z-10 bg-gradient-to-r from-purple-600 to-indigo-700 p-4 m-4 rounded-xl shadow-xl border border-purple-500/50">
          <h3 className="text-lg font-bold mb-3 text-white">Active Bets</h3>
          <div className="space-y-2">
            {selectedBets.map((bet, index) => (
              <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-2">
                <span className="text-white text-sm">
                  {bet.type === 'color' ? bet.value.toUpperCase() : 
                   bet.type === 'number' ? `Number ${bet.value}` :
                   bet.value.toUpperCase()} • {bet.multiplier}x
                </span>
                <span className="text-yellow-400 font-bold">₹{bet.amount}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">Total Bet:</span>
              <span className="text-yellow-400 text-xl font-bold">₹{totalBetAmount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Betting Modal */}
      <AnimatePresence>
        {showBetModal && selectedBetType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 w-full max-w-sm border border-white/20"
            >
              <h3 className="text-xl font-bold text-white mb-4 text-center">Place Bet</h3>
              
              <div className="text-center mb-6">
                <div className={`inline-block px-6 py-3 rounded-xl ${
                  selectedBetType.type === 'color' ? colorStyles[selectedBetType.value as 'green' | 'red' | 'violet'] :
                  selectedBetType.type === 'size' ? colorStyles[selectedBetType.value as 'big' | 'small'] :
                  colorStyles[getNumberColor(selectedBetType.value)]
                }`}>
                  <span className="text-lg font-bold">
                    {selectedBetType.type === 'number' ? selectedBetType.value : selectedBetType.value.toUpperCase()}
                  </span>
                  <div className="text-sm opacity-80">{selectedBetType.multiplier}x multiplier</div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 text-sm mb-2">Bet Amount</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white text-lg font-bold text-center"
                  placeholder="Enter amount"
                  min="10"
                />
                <div className="flex gap-2 mt-3">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg py-2 text-white text-sm font-medium transition-colors"
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBetModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-xl py-3 text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={placeBet}
                  disabled={!betAmount || parseInt(betAmount) < 10}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-3 text-white font-bold transition-all"
                >
                  Place Bet
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Space */}
      <div className="h-20"></div>
    </div>
  );
}