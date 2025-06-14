import React, { useState, useEffect } from 'react';
import { X, Clock, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, TrendingUp, BarChart3 } from 'lucide-react';

interface K3LotreGameProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onTransaction: (amount: number, type: 'deposit' | 'withdraw') => void;
}

interface GameResult {
  period: string;
  dice: [number, number, number];
  sum: number;
  size: 'big' | 'small';
  parity: 'odd' | 'even';
  time: string;
}

export function K3LotreGame({ isOpen, onClose, walletBalance, onTransaction }: K3LotreGameProps) {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [currentPeriod, setCurrentPeriod] = useState('202406141530001');
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBets, setSelectedBets] = useState<{[key: string]: number}>({});
  const [gameHistory, setGameHistory] = useState<GameResult[]>([
    { period: '202406141529001', dice: [3, 4, 6], sum: 13, size: 'big', parity: 'odd', time: '15:29' },
    { period: '202406141528001', dice: [1, 2, 5], sum: 8, size: 'small', parity: 'even', time: '15:28' },
    { period: '202406141527001', dice: [6, 6, 5], sum: 17, size: 'big', parity: 'odd', time: '15:27' },
    { period: '202406141526001', dice: [2, 3, 4], sum: 9, size: 'small', parity: 'odd', time: '15:26' },
    { period: '202406141525001', dice: [1, 1, 4], sum: 6, size: 'small', parity: 'even', time: '15:25' }
  ]);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [activeTab, setActiveTab] = useState('sum');
  const [diceAnimation, setDiceAnimation] = useState(false);

  const quickAmounts = [10, 100, 1000, 10000];

  const sumBetOptions = [
    { sum: 4, multiplier: '50x', probability: '1.4%' },
    { sum: 5, multiplier: '25x', probability: '2.8%' },
    { sum: 6, multiplier: '15x', probability: '4.6%' },
    { sum: 7, multiplier: '12x', probability: '6.9%' },
    { sum: 8, multiplier: '8x', probability: '9.7%' },
    { sum: 9, multiplier: '6x', probability: '11.6%' },
    { sum: 10, multiplier: '6x', probability: '12.5%' },
    { sum: 11, multiplier: '6x', probability: '12.5%' },
    { sum: 12, multiplier: '6x', probability: '11.6%' },
    { sum: 13, multiplier: '8x', probability: '9.7%' },
    { sum: 14, multiplier: '12x', probability: '6.9%' },
    { sum: 15, multiplier: '15x', probability: '4.6%' },
    { sum: 16, multiplier: '25x', probability: '2.8%' },
    { sum: 17, multiplier: '50x', probability: '1.4%' }
  ];

  const basicBetOptions = [
    { id: 'big', label: 'Big (11-17)', multiplier: '2x', color: 'bg-red-500' },
    { id: 'small', label: 'Small (4-10)', multiplier: '2x', color: 'bg-blue-500' },
    { id: 'odd', label: 'Odd', multiplier: '2x', color: 'bg-green-500' },
    { id: 'even', label: 'Even', multiplier: '2x', color: 'bg-purple-500' }
  ];

  const tripleBets = [1, 2, 3, 4, 5, 6].map(num => ({
    id: `triple-${num}`,
    label: `Triple ${num}`,
    multiplier: '150x',
    number: num
  }));

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleGameEnd();
          return 180;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleGameEnd = () => {
    setDiceAnimation(true);
    
    setTimeout(() => {
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      const dice3 = Math.floor(Math.random() * 6) + 1;
      const sum = dice1 + dice2 + dice3;
      const size = sum >= 11 ? 'big' : 'small';
      const parity = sum % 2 === 0 ? 'even' : 'odd';
      const newPeriod = (parseInt(currentPeriod) + 1).toString();
      
      const newResult: GameResult = {
        period: currentPeriod,
        dice: [dice1, dice2, dice3],
        sum,
        size,
        parity,
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      };

      setLastResult(newResult);
      setGameHistory(prev => [newResult, ...prev.slice(0, 9)]);
      setCurrentPeriod(newPeriod);
      setDiceAnimation(false);
      setShowResult(true);
      
      calculateWinnings(newResult);

      setTimeout(() => setShowResult(false), 3000);
    }, 2000);
  };

  const calculateWinnings = (result: GameResult) => {
    let totalWinnings = 0;

    Object.entries(selectedBets).forEach(([betType, amount]) => {
      let won = false;
      let multiplier = 1;

      if (betType === 'big' && result.size === 'big') {
        won = true;
        multiplier = 2;
      } else if (betType === 'small' && result.size === 'small') {
        won = true;
        multiplier = 2;
      } else if (betType === 'odd' && result.parity === 'odd') {
        won = true;
        multiplier = 2;
      } else if (betType === 'even' && result.parity === 'even') {
        won = true;
        multiplier = 2;
      } else if (betType === `sum-${result.sum}`) {
        won = true;
        const sumOption = sumBetOptions.find(opt => opt.sum === result.sum);
        multiplier = parseFloat(sumOption?.multiplier.replace('x', '') || '1');
      } else if (betType.startsWith('triple-')) {
        const number = parseInt(betType.split('-')[1]);
        if (result.dice.every(die => die === number)) {
          won = true;
          multiplier = 150;
        }
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

    if (timeLeft <= 20) {
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getDiceIcon = (value: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const Icon = icons[value - 1];
    return <Icon className="w-8 h-8" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">K3 Lotre</h2>
              <p className="text-sm opacity-90">3 Min</p>
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
              <Clock className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold text-purple-500">
                {formatTime(timeLeft)}
              </span>
            </div>
            {timeLeft <= 20 && (
              <div className="text-red-500 font-bold animate-pulse">Betting Closed</div>
            )}
          </div>

          {getTotalBetAmount() > 0 && (
            <div className="text-center mb-2">
              <span className="text-sm text-gray-600">Total Bet: </span>
              <span className="font-bold text-purple-500">₹{getTotalBetAmount()}</span>
            </div>
          )}

          {/* Dice Display */}
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3].map((_, index) => (
              <div 
                key={index}
                className={`w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center ${
                  diceAnimation ? 'animate-bounce' : ''
                }`}
              >
                {lastResult && !diceAnimation ? (
                  <div className="text-purple-600">
                    {getDiceIcon(lastResult.dice[index])}
                  </div>
                ) : (
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
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
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>

        {/* Bet Tabs */}
        <div className="border-b">
          <div className="flex">
            {[
              { id: 'sum', label: 'Sum' },
              { id: 'basic', label: 'Big/Small' },
              { id: 'triple', label: 'Triple' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Betting Options */}
        <div className="p-4 max-h-60 overflow-y-auto">
          {activeTab === 'sum' && (
            <div className="grid grid-cols-2 gap-2">
              {sumBetOptions.map(option => (
                <button
                  key={option.sum}
                  onClick={() => placeBet(`sum-${option.sum}`)}
                  disabled={timeLeft <= 20}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all disabled:opacity-50 relative text-left"
                >
                  <div className="font-bold text-lg">{option.sum}</div>
                  <div className="text-xs text-gray-600">{option.multiplier}</div>
                  <div className="text-xs text-gray-500">{option.probability}</div>
                  {selectedBets[`sum-${option.sum}`] && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">
                      ₹{selectedBets[`sum-${option.sum}`]}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'basic' && (
            <div className="grid grid-cols-2 gap-2">
              {basicBetOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => placeBet(option.id)}
                  disabled={timeLeft <= 20}
                  className={`${option.color} text-white py-4 px-4 rounded-lg font-medium transition-all disabled:opacity-50 relative`}
                >
                  <div className="text-sm">{option.label}</div>
                  <div className="text-xs">{option.multiplier}</div>
                  {selectedBets[option.id] && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">
                      ₹{selectedBets[option.id]}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'triple' && (
            <div className="grid grid-cols-3 gap-2">
              {tripleBets.map(option => (
                <button
                  key={option.id}
                  onClick={() => placeBet(option.id)}
                  disabled={timeLeft <= 20}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 px-3 rounded-lg font-medium transition-all disabled:opacity-50 relative"
                >
                  <div className="text-lg font-bold">{option.number}</div>
                  <div className="text-xs">{option.multiplier}</div>
                  {selectedBets[option.id] && (
                    <div className="absolute -top-2 -right-1 bg-yellow-400 text-black text-xs px-1 py-0.5 rounded-full">
                      ₹{selectedBets[option.id]}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Game History */}
        <div className="p-4 border-t">
          <h3 className="font-medium mb-3 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Recent Results
          </h3>
          <div className="space-y-2">
            {gameHistory.slice(0, 3).map((result, index) => (
              <div key={result.period} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <div className="text-sm">
                  <div className="font-medium">{result.period}</div>
                  <div className="text-gray-500">{result.time}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {result.dice.map((die, i) => (
                      <div key={i} className="w-6 h-6 bg-purple-500 text-white rounded text-xs flex items-center justify-center font-bold">
                        {die}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-bold">{result.sum}</div>
                  <div className="text-xs text-gray-500">
                    {result.size} · {result.parity}
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
              <div className="flex justify-center space-x-2 mb-4">
                {lastResult.dice.map((die, i) => (
                  <div key={i} className="w-16 h-16 bg-purple-500 text-white rounded-lg flex items-center justify-center text-2xl font-bold">
                    {die}
                  </div>
                ))}
              </div>
              <div className="text-3xl font-bold mb-2">Sum: {lastResult.sum}</div>
              <div className="text-lg mb-2">
                <span className="capitalize">{lastResult.size}</span> · <span className="capitalize">{lastResult.parity}</span>
              </div>
              <div className="text-gray-500">Period: {lastResult.period}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}