import React, { useState, useEffect } from 'react';
import { X, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, TrendingUp, RotateCcw, Target } from 'lucide-react';

interface DiceGameProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onTransaction: (amount: number, type: 'deposit' | 'withdraw') => void;
}

interface GameResult {
  id: string;
  dice: number;
  bets: {[key: string]: number};
  winnings: number;
  profit: number;
  time: string;
}

export function DiceGame({ isOpen, onClose, walletBalance, onTransaction }: DiceGameProps) {
  const [gameState, setGameState] = useState<'betting' | 'rolling' | 'result'>('betting');
  const [currentDice, setCurrentDice] = useState(1);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBets, setSelectedBets] = useState<{[key: string]: number}>({});
  const [gameHistory, setGameHistory] = useState<GameResult[]>([
    { id: '1', dice: 4, bets: {'number-4': 100}, winnings: 600, profit: 500, time: '15:29' },
    { id: '2', dice: 2, bets: {'even': 50, 'small': 25}, winnings: 150, profit: 75, time: '15:28' },
    { id: '3', dice: 6, bets: {'big': 100}, winnings: 200, profit: 100, time: '15:27' },
    { id: '4', dice: 1, bets: {'odd': 75}, winnings: 150, profit: 75, time: '15:26' }
  ]);
  const [isRolling, setIsRolling] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const quickAmounts = [10, 50, 100, 500, 1000];

  const betOptions = [
    { id: 'big', label: 'Big (4-6)', multiplier: '2x', color: 'bg-red-500' },
    { id: 'small', label: 'Small (1-3)', multiplier: '2x', color: 'bg-blue-500' },
    { id: 'odd', label: 'Odd', multiplier: '2x', color: 'bg-green-500' },
    { id: 'even', label: 'Even', multiplier: '2x', color: 'bg-purple-500' }
  ];

  const numberBets = [1, 2, 3, 4, 5, 6].map(num => ({
    id: `number-${num}`,
    number: num,
    multiplier: '6x',
    color: 'bg-yellow-500'
  }));

  const rollDice = () => {
    if (Object.keys(selectedBets).length === 0) {
      alert('Please place at least one bet');
      return;
    }

    const totalBetAmount = getTotalBetAmount();
    if (totalBetAmount > walletBalance) {
      alert('Insufficient balance');
      return;
    }

    setGameState('rolling');
    setIsRolling(true);
    onTransaction(totalBetAmount, 'withdraw');

    // Animate dice rolling
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setCurrentDice(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      
      if (rollCount >= 20) {
        clearInterval(rollInterval);
        const finalResult = Math.floor(Math.random() * 6) + 1;
        setCurrentDice(finalResult);
        setIsRolling(false);
        setTimeout(() => {
          setGameState('result');
          calculateWinnings(finalResult);
          setShowResult(true);
          setTimeout(() => setShowResult(false), 3000);
        }, 500);
      }
    }, 100);
  };

  const calculateWinnings = (diceResult: number) => {
    let totalWinnings = 0;
    let winningBets: {[key: string]: number} = {};

    Object.entries(selectedBets).forEach(([betType, amount]) => {
      let won = false;
      let multiplier = 1;

      if (betType === 'big' && diceResult >= 4) {
        won = true;
        multiplier = 2;
      } else if (betType === 'small' && diceResult <= 3) {
        won = true;
        multiplier = 2;
      } else if (betType === 'odd' && diceResult % 2 === 1) {
        won = true;
        multiplier = 2;
      } else if (betType === 'even' && diceResult % 2 === 0) {
        won = true;
        multiplier = 2;
      } else if (betType === `number-${diceResult}`) {
        won = true;
        multiplier = 6;
      }

      if (won) {
        const winAmount = amount * multiplier;
        totalWinnings += winAmount;
        winningBets[betType] = winAmount;
      }
    });

    if (totalWinnings > 0) {
      onTransaction(totalWinnings, 'deposit');
    }

    // Add to history
    const newResult: GameResult = {
      id: Date.now().toString(),
      dice: diceResult,
      bets: {...selectedBets},
      winnings: totalWinnings,
      profit: totalWinnings - getTotalBetAmount(),
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    };

    setGameHistory(prev => [newResult, ...prev.slice(0, 9)]);
  };

  const placeBet = (betType: string) => {
    const totalBets = getTotalBetAmount();
    if (totalBets + betAmount > walletBalance) {
      alert('Insufficient balance');
      return;
    }

    setSelectedBets(prev => ({
      ...prev,
      [betType]: (prev[betType] || 0) + betAmount
    }));
  };

  const clearBets = () => {
    setSelectedBets({});
  };

  const resetGame = () => {
    setGameState('betting');
    setSelectedBets({});
    setCurrentDice(1);
  };

  const getTotalBetAmount = () => {
    return Object.values(selectedBets).reduce((sum, amount) => sum + amount, 0);
  };

  const getDiceIcon = (value: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const Icon = icons[value - 1];
    return <Icon className="w-16 h-16" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Dice1 className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Dice Game</h2>
                <p className="text-sm opacity-90">Roll the dice and win big!</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Dice Display */}
          <div className="bg-gray-100 rounded-xl p-8 text-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 bg-white rounded-xl shadow-lg ${isRolling ? 'animate-spin' : ''}`}>
              <div className="text-yellow-500">
                {getDiceIcon(currentDice)}
              </div>
            </div>
            {gameState === 'rolling' && (
              <div className="mt-4 text-lg font-bold text-yellow-500 animate-pulse">
                Rolling...
              </div>
            )}
            {gameState === 'result' && (
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-800">Result: {currentDice}</div>
              </div>
            )}
          </div>

          {/* Bet Amount Selection */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Bet Amount:</span>
              <span className="font-bold text-lg">₹{betAmount}</span>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {quickAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  disabled={gameState !== 'betting'}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                    betAmount === amount 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
            {getTotalBetAmount() > 0 && (
              <div className="text-center">
                <span className="text-sm text-gray-600">Total Bet: </span>
                <span className="font-bold text-yellow-500">₹{getTotalBetAmount()}</span>
              </div>
            )}
            <div className="text-sm text-gray-600 text-center mt-1">
              Balance: ₹{walletBalance.toFixed(2)}
            </div>
          </div>

          {/* Betting Options */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold mb-3">Place Your Bets</h3>
            
            {/* Category Bets */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {betOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => placeBet(option.id)}
                  disabled={gameState !== 'betting'}
                  className={`${option.color} text-white py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 relative`}
                >
                  <div className="text-sm">{option.label}</div>
                  <div className="text-xs">{option.multiplier}</div>
                  {selectedBets[option.id] && (
                    <div className="absolute -top-2 -right-2 bg-white text-black text-xs px-2 py-1 rounded-full font-bold">
                      ₹{selectedBets[option.id]}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Number Bets */}
            <h4 className="font-medium mb-2">Bet on Specific Number</h4>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {numberBets.map(bet => (
                <button
                  key={bet.id}
                  onClick={() => placeBet(bet.id)}
                  disabled={gameState !== 'betting'}
                  className={`${bet.color} text-white py-3 px-2 rounded-lg font-bold transition-all disabled:opacity-50 relative text-sm`}
                >
                  <div className="text-lg">{bet.number}</div>
                  <div className="text-xs">{bet.multiplier}</div>
                  {selectedBets[bet.id] && (
                    <div className="absolute -top-2 -right-1 bg-white text-black text-xs px-1 py-0.5 rounded-full font-bold">
                      ₹{selectedBets[bet.id]}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {gameState === 'betting' ? (
                <>
                  <button
                    onClick={rollDice}
                    disabled={Object.keys(selectedBets).length === 0}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold transition-all"
                  >
                    Roll Dice
                  </button>
                  <button
                    onClick={clearBets}
                    disabled={Object.keys(selectedBets).length === 0}
                    className="px-4 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white py-3 rounded-lg transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={resetGame}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold transition-all"
                >
                  Play Again
                </button>
              )}
            </div>
          </div>

          {/* Game History */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Recent Games
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {gameHistory.slice(0, 5).map((game) => (
                <div key={game.id} className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 text-white rounded-lg flex items-center justify-center font-bold">
                      {game.dice}
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">
                        {Object.keys(game.bets).length} bet{Object.keys(game.bets).length > 1 ? 's' : ''}
                      </div>
                      <div className="text-gray-500">{game.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{game.winnings}</div>
                    <div className={`text-sm ${game.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {game.profit >= 0 ? '+' : ''}₹{game.profit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Games:</span>
                  <span>{gameHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Profit:</span>
                  <span className={gameHistory.reduce((sum, g) => sum + g.profit, 0) >= 0 ? 'text-green-500' : 'text-red-500'}>
                    ₹{gameHistory.reduce((sum, g) => sum + g.profit, 0)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Win Rate:</span>
                  <span>
                    {gameHistory.length > 0 
                      ? ((gameHistory.filter(g => g.profit > 0).length / gameHistory.length) * 100).toFixed(1)
                      : 0
                    }%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Win:</span>
                  <span className="text-green-500">
                    ₹{gameHistory.length > 0 
                      ? (gameHistory.reduce((sum, g) => sum + Math.max(0, g.profit), 0) / Math.max(1, gameHistory.filter(g => g.profit > 0).length)).toFixed(0)
                      : 0
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Result Overlay */}
        {showResult && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
            <div className="bg-white rounded-xl p-8 text-center max-w-sm mx-4">
              <h3 className="text-2xl font-bold mb-4">Game Result</h3>
              <div className="w-20 h-20 bg-yellow-500 text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <div className="text-3xl font-bold">{currentDice}</div>
              </div>
              <div className="text-lg mb-2">
                {gameHistory[0]?.winnings > 0 ? (
                  <div className="text-green-500 font-bold">
                    WIN: ₹{gameHistory[0]?.winnings}
                  </div>
                ) : (
                  <div className="text-red-500 font-bold">
                    LOSS: ₹{getTotalBetAmount()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}