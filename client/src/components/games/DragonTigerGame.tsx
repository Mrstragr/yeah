import React, { useState, useEffect } from 'react';
import { X, Clock, TrendingUp, History, Zap, Crown } from 'lucide-react';

interface DragonTigerGameProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onTransaction: (amount: number, type: 'deposit' | 'withdraw') => void;
}

interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: string;
  value: number;
}

interface GameResult {
  id: string;
  dragonCard: Card;
  tigerCard: Card;
  result: 'dragon' | 'tiger' | 'tie';
  time: string;
}

interface BetHistory {
  id: string;
  bets: {[key: string]: number};
  result: 'dragon' | 'tiger' | 'tie';
  winnings: number;
  profit: number;
  time: string;
}

export function DragonTigerGame({ isOpen, onClose, walletBalance, onTransaction }: DragonTigerGameProps) {
  const [gameState, setGameState] = useState<'betting' | 'dealing' | 'result'>('betting');
  const [timeLeft, setTimeLeft] = useState(15);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBets, setSelectedBets] = useState<{[key: string]: number}>({});
  const [currentResult, setCurrentResult] = useState<GameResult | null>(null);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([
    { id: '1', dragonCard: {suit: 'hearts', rank: 'K', value: 13}, tigerCard: {suit: 'spades', rank: '7', value: 7}, result: 'dragon', time: '15:29' },
    { id: '2', dragonCard: {suit: 'diamonds', rank: '5', value: 5}, tigerCard: {suit: 'clubs', rank: 'J', value: 11}, result: 'tiger', time: '15:28' },
    { id: '3', dragonCard: {suit: 'spades', rank: 'A', value: 1}, tigerCard: {suit: 'hearts', rank: 'A', value: 1}, result: 'tie', time: '15:27' },
    { id: '4', dragonCard: {suit: 'clubs', rank: '9', value: 9}, tigerCard: {suit: 'diamonds', rank: '3', value: 3}, result: 'dragon', time: '15:26' }
  ]);
  const [betHistory, setBetHistory] = useState<BetHistory[]>([]);
  const [showResult, setShowResult] = useState(false);

  const quickAmounts = [10, 50, 100, 500, 1000];

  const betOptions = [
    { id: 'dragon', label: 'Dragon', multiplier: '1:1', color: 'bg-red-600', icon: '🐉' },
    { id: 'tiger', label: 'Tiger', multiplier: '1:1', color: 'bg-orange-600', icon: '🐅' },
    { id: 'tie', label: 'Tie', multiplier: '8:1', color: 'bg-purple-600', icon: '⚖️' }
  ];

  const suitBets = [
    { id: 'dragon-red', label: 'Dragon Red', multiplier: '1:1', color: 'bg-red-500' },
    { id: 'dragon-black', label: 'Dragon Black', multiplier: '1:1', color: 'bg-gray-800' },
    { id: 'tiger-red', label: 'Tiger Red', multiplier: '1:1', color: 'bg-red-500' },
    { id: 'tiger-black', label: 'Tiger Black', multiplier: '1:1', color: 'bg-gray-800' }
  ];

  const oddEvenBets = [
    { id: 'dragon-odd', label: 'Dragon Odd', multiplier: '1:1', color: 'bg-blue-500' },
    { id: 'dragon-even', label: 'Dragon Even', multiplier: '1:1', color: 'bg-green-500' },
    { id: 'tiger-odd', label: 'Tiger Odd', multiplier: '1:1', color: 'bg-blue-500' },
    { id: 'tiger-even', label: 'Tiger Even', multiplier: '1:1', color: 'bg-green-500' }
  ];

  useEffect(() => {
    if (!isOpen) return;

    if (gameState === 'betting') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleGameStart();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, isOpen]);

  const generateCard = (): Card => {
    const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    let value = parseInt(rank);
    
    if (rank === 'A') value = 1;
    else if (['J', 'Q', 'K'].includes(rank)) value = [11, 12, 13][['J', 'Q', 'K'].indexOf(rank)];
    
    return { suit, rank, value };
  };

  const handleGameStart = () => {
    if (Object.keys(selectedBets).length === 0) {
      setGameState('betting');
      setTimeLeft(15);
      return;
    }

    const totalBetAmount = getTotalBetAmount();
    onTransaction(totalBetAmount, 'withdraw');

    setGameState('dealing');
    
    setTimeout(() => {
      const dragonCard = generateCard();
      const tigerCard = generateCard();
      
      let result: 'dragon' | 'tiger' | 'tie';
      if (dragonCard.value > tigerCard.value) result = 'dragon';
      else if (tigerCard.value > dragonCard.value) result = 'tiger';
      else result = 'tie';

      const newResult: GameResult = {
        id: Date.now().toString(),
        dragonCard,
        tigerCard,
        result,
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      };

      setCurrentResult(newResult);
      setGameHistory(prev => [newResult, ...prev.slice(0, 9)]);
      setGameState('result');
      setShowResult(true);
      
      calculateWinnings(newResult);

      setTimeout(() => {
        setShowResult(false);
        setGameState('betting');
        setTimeLeft(15);
        setSelectedBets({});
      }, 5000);
    }, 2000);
  };

  const calculateWinnings = (result: GameResult) => {
    let totalWinnings = 0;
    const totalBet = getTotalBetAmount();

    Object.entries(selectedBets).forEach(([betType, amount]) => {
      let won = false;
      let multiplier = 1;

      if (betType === 'dragon' && result.result === 'dragon') {
        won = true;
        multiplier = 2;
      } else if (betType === 'tiger' && result.result === 'tiger') {
        won = true;
        multiplier = 2;
      } else if (betType === 'tie' && result.result === 'tie') {
        won = true;
        multiplier = 9;
      } else if (betType === 'dragon-red' && result.result === 'dragon' && ['hearts', 'diamonds'].includes(result.dragonCard.suit)) {
        won = true;
        multiplier = 2;
      } else if (betType === 'dragon-black' && result.result === 'dragon' && ['clubs', 'spades'].includes(result.dragonCard.suit)) {
        won = true;
        multiplier = 2;
      } else if (betType === 'tiger-red' && result.result === 'tiger' && ['hearts', 'diamonds'].includes(result.tigerCard.suit)) {
        won = true;
        multiplier = 2;
      } else if (betType === 'tiger-black' && result.result === 'tiger' && ['clubs', 'spades'].includes(result.tigerCard.suit)) {
        won = true;
        multiplier = 2;
      } else if (betType === 'dragon-odd' && result.result === 'dragon' && result.dragonCard.value % 2 === 1) {
        won = true;
        multiplier = 2;
      } else if (betType === 'dragon-even' && result.result === 'dragon' && result.dragonCard.value % 2 === 0) {
        won = true;
        multiplier = 2;
      } else if (betType === 'tiger-odd' && result.result === 'tiger' && result.tigerCard.value % 2 === 1) {
        won = true;
        multiplier = 2;
      } else if (betType === 'tiger-even' && result.result === 'tiger' && result.tigerCard.value % 2 === 0) {
        won = true;
        multiplier = 2;
      }

      if (won) {
        totalWinnings += amount * multiplier;
      }
    });

    if (totalWinnings > 0) {
      onTransaction(totalWinnings, 'deposit');
    }

    // Add to bet history
    const newBetHistory: BetHistory = {
      id: Date.now().toString(),
      bets: {...selectedBets},
      result: result.result,
      winnings: totalWinnings,
      profit: totalWinnings - totalBet,
      time: result.time
    };

    setBetHistory(prev => [newBetHistory, ...prev.slice(0, 9)]);
  };

  const placeBet = (betType: string) => {
    if (gameState !== 'betting') return;
    
    const totalBets = getTotalBetAmount();
    if (totalBets + betAmount > walletBalance) {
      alert('Insufficient balance');
      return;
    }

    if (timeLeft <= 3) {
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

  const getCardDisplay = (card: Card | null) => {
    if (!card) return null;
    
    const suitSymbols = {
      hearts: '♥️',
      diamonds: '♦️',
      clubs: '♣️',
      spades: '♠️'
    };

    const isRed = ['hearts', 'diamonds'].includes(card.suit);

    return (
      <div className={`w-20 h-28 bg-white rounded-lg border-2 flex flex-col items-center justify-center shadow-lg ${isRed ? 'text-red-500' : 'text-black'}`}>
        <div className="text-2xl font-bold">{card.rank}</div>
        <div className="text-xl">{suitSymbols[card.suit]}</div>
      </div>
    );
  };

  const getResultIcon = (result: string) => {
    switch(result) {
      case 'dragon': return '🐉';
      case 'tiger': return '🐅';
      case 'tie': return '⚖️';
      default: return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <span className="text-2xl">🐉</span>
                <span className="text-2xl">🐅</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Dragon Tiger</h2>
                <p className="text-sm opacity-90">Classic card battle</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          {/* Game Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Timer and Status */}
            <div className="bg-gray-100 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-red-500" />
                  <span className="text-2xl font-bold text-red-500">
                    {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
                    {String(timeLeft % 60).padStart(2, '0')}
                  </span>
                </div>
                {timeLeft <= 3 && gameState === 'betting' && (
                  <div className="text-red-500 font-bold animate-pulse">Betting Closed</div>
                )}
                {gameState === 'dealing' && (
                  <div className="text-blue-500 font-bold animate-pulse">Dealing Cards...</div>
                )}
              </div>

              {getTotalBetAmount() > 0 && (
                <div className="mb-2">
                  <span className="text-sm text-gray-600">Total Bet: </span>
                  <span className="font-bold text-red-500">₹{getTotalBetAmount()}</span>
                </div>
              )}
            </div>

            {/* Card Display */}
            <div className="bg-green-800 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <h3 className="text-white text-xl font-bold mb-4 flex items-center justify-center">
                    <span className="mr-2">🐉</span>
                    Dragon
                  </h3>
                  <div className="flex justify-center">
                    {gameState === 'result' && currentResult ? 
                      getCardDisplay(currentResult.dragonCard) : 
                      <div className="w-20 h-28 bg-blue-900 rounded-lg border-2 border-white flex items-center justify-center">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                    }
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-white text-xl font-bold mb-4 flex items-center justify-center">
                    <span className="mr-2">🐅</span>
                    Tiger
                  </h3>
                  <div className="flex justify-center">
                    {gameState === 'result' && currentResult ? 
                      getCardDisplay(currentResult.tigerCard) : 
                      <div className="w-20 h-28 bg-orange-900 rounded-lg border-2 border-white flex items-center justify-center">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                    }
                  </div>
                </div>
              </div>

              {gameState === 'result' && currentResult && (
                <div className="text-center mt-6">
                  <div className="text-white text-2xl font-bold">
                    {currentResult.result.charAt(0).toUpperCase() + currentResult.result.slice(1)} Wins!
                  </div>
                  <div className="text-yellow-300 text-lg">
                    Dragon: {currentResult.dragonCard.rank} vs Tiger: {currentResult.tigerCard.rank}
                  </div>
                </div>
              )}
            </div>

            {/* Bet Amount Selection */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Bet Amount:</span>
                <span className="font-bold text-lg">₹{betAmount}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {quickAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    disabled={gameState !== 'betting'}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                      betAmount === amount 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-600 text-center mt-2">
                Balance: ₹{walletBalance.toFixed(2)}
              </div>
            </div>

            {/* Main Bets */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold mb-3">Main Bets</h3>
              <div className="grid grid-cols-3 gap-3">
                {betOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => placeBet(option.id)}
                    disabled={gameState !== 'betting' || timeLeft <= 3}
                    className={`${option.color} text-white py-4 px-4 rounded-lg font-bold transition-all disabled:opacity-50 relative`}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
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
            </div>

            {/* Side Bets */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold mb-3">Side Bets</h3>
              
              {/* Color Bets */}
              <h4 className="font-medium mb-2">Color Bets</h4>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {suitBets.map(bet => (
                  <button
                    key={bet.id}
                    onClick={() => placeBet(bet.id)}
                    disabled={gameState !== 'betting' || timeLeft <= 3}
                    className={`${bet.color} text-white py-3 px-2 rounded-lg font-medium transition-all disabled:opacity-50 relative text-xs`}
                  >
                    <div>{bet.label}</div>
                    <div className="text-xs">{bet.multiplier}</div>
                    {selectedBets[bet.id] && (
                      <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs px-1 py-0.5 rounded-full">
                        ₹{selectedBets[bet.id]}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Odd/Even Bets */}
              <h4 className="font-medium mb-2">Odd/Even Bets</h4>
              <div className="grid grid-cols-4 gap-2">
                {oddEvenBets.map(bet => (
                  <button
                    key={bet.id}
                    onClick={() => placeBet(bet.id)}
                    disabled={gameState !== 'betting' || timeLeft <= 3}
                    className={`${bet.color} text-white py-3 px-2 rounded-lg font-medium transition-all disabled:opacity-50 relative text-xs`}
                  >
                    <div>{bet.label}</div>
                    <div className="text-xs">{bet.multiplier}</div>
                    {selectedBets[bet.id] && (
                      <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs px-1 py-0.5 rounded-full">
                        ₹{selectedBets[bet.id]}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Game History */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <History className="w-4 h-4 mr-2" />
                Game Results
              </h3>
              <div className="space-y-2">
                {gameHistory.slice(0, 8).map((game, index) => (
                  <div key={game.id} className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
                    <div className="text-sm">
                      <div className="font-medium">{game.time}</div>
                      <div className="text-gray-500">
                        D:{game.dragonCard.rank} vs T:{game.tigerCard.rank}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg">{getResultIcon(game.result)}</div>
                      <div className="text-xs font-medium capitalize">{game.result}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bet History */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                My Bets
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {betHistory.slice(0, 5).map((bet) => (
                  <div key={bet.id} className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
                    <div className="text-sm">
                      <div className="font-medium">
                        {Object.keys(bet.bets).length} bet{Object.keys(bet.bets).length > 1 ? 's' : ''}
                      </div>
                      <div className="text-gray-500">{bet.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{bet.winnings}</div>
                      <div className={`text-sm ${bet.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {bet.profit >= 0 ? '+' : ''}₹{bet.profit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold mb-3">Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Dragon Wins:</span>
                  <span className="text-red-500">
                    {gameHistory.filter(g => g.result === 'dragon').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tiger Wins:</span>
                  <span className="text-orange-500">
                    {gameHistory.filter(g => g.result === 'tiger').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ties:</span>
                  <span className="text-purple-500">
                    {gameHistory.filter(g => g.result === 'tie').length}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>My Profit:</span>
                  <span className={betHistory.reduce((sum, b) => sum + b.profit, 0) >= 0 ? 'text-green-500' : 'text-red-500'}>
                    ₹{betHistory.reduce((sum, b) => sum + b.profit, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Result Overlay */}
        {showResult && currentResult && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
            <div className="bg-white rounded-xl p-8 text-center max-w-md mx-4">
              <h3 className="text-2xl font-bold mb-4">Round Result</h3>
              
              <div className="flex justify-center space-x-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Dragon</div>
                  {getCardDisplay(currentResult.dragonCard)}
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Tiger</div>
                  {getCardDisplay(currentResult.tigerCard)}
                </div>
              </div>

              <div className="text-3xl mb-2">{getResultIcon(currentResult.result)}</div>
              <div className="text-2xl font-bold mb-2 capitalize">
                {currentResult.result} Wins!
              </div>
              
              {betHistory[0] && (
                <div className="text-lg">
                  {betHistory[0].profit > 0 ? (
                    <div className="text-green-500">You won ₹{betHistory[0].winnings}!</div>
                  ) : (
                    <div className="text-red-500">Better luck next time!</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}