import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Crown, Shield, Swords } from 'lucide-react';
import { useSmartBalance } from '../hooks/useSmartBalance';

interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: string;
  value: number;
}

interface GameState {
  phase: 'betting' | 'dealing' | 'result';
  dragonCard: Card | null;
  tigerCard: Card | null;
  winner: 'dragon' | 'tiger' | 'tie' | null;
  timeRemaining: number;
  bets: { type: 'dragon' | 'tiger' | 'tie'; amount: number }[];
  totalBet: number;
  winAmount: number;
}

const FullyPlayableDragonTiger: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { balance, updateBalance } = useSmartBalance();
  const [gameState, setGameState] = useState<GameState>({
    phase: 'betting',
    dragonCard: null,
    tigerCard: null,
    winner: null,
    timeRemaining: 30,
    bets: [],
    totalBet: 0,
    winAmount: 0
  });

  const [selectedBet, setSelectedBet] = useState<'dragon' | 'tiger' | 'tie' | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [gameHistory, setGameHistory] = useState<{ winner: string; dragonCard: Card; tigerCard: Card }[]>([]);

  // Card deck
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  const createCard = (): Card => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    
    let value: number;
    if (rank === 'A') value = 1;
    else if (['J', 'Q', 'K'].includes(rank)) value = 10 + ['J', 'Q', 'K'].indexOf(rank) + 1;
    else value = parseInt(rank);
    
    return { suit, rank, value };
  };

  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'hearts': return '♥️';
      case 'diamonds': return '♦️';
      case 'clubs': return '♣️';
      case 'spades': return '♠️';
      default: return '';
    }
  };

  const getSuitColor = (suit: string) => {
    return ['hearts', 'diamonds'].includes(suit) ? 'text-red-500' : 'text-black';
  };

  // Game timer
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          if (prev.phase === 'betting') {
            // Start dealing phase
            dealCards();
            return { ...prev, phase: 'dealing', timeRemaining: 3 };
          } else if (prev.phase === 'dealing') {
            // Show result
            return { ...prev, phase: 'result', timeRemaining: 8 };
          } else if (prev.phase === 'result') {
            // Start new round
            return {
              phase: 'betting',
              dragonCard: null,
              tigerCard: null,
              winner: null,
              timeRemaining: 30,
              bets: [],
              totalBet: 0,
              winAmount: 0
            };
          }
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dealCards = () => {
    const dragonCard = createCard();
    const tigerCard = createCard();
    
    let winner: 'dragon' | 'tiger' | 'tie';
    if (dragonCard.value > tigerCard.value) {
      winner = 'dragon';
    } else if (tigerCard.value > dragonCard.value) {
      winner = 'tiger';
    } else {
      winner = 'tie';
    }

    // Calculate winnings
    let totalWin = 0;
    gameState.bets.forEach(bet => {
      if (bet.type === winner) {
        const multiplier = winner === 'tie' ? 8 : 2;
        totalWin += bet.amount * multiplier;
      }
    });

    // Update balance
    if (totalWin > 0) {
      updateBalance(totalWin, 'add');
    }

    setGameState(prev => ({
      ...prev,
      dragonCard,
      tigerCard,
      winner,
      winAmount: totalWin
    }));

    // Add to history
    setGameHistory(prev => [
      { winner, dragonCard, tigerCard },
      ...prev.slice(0, 9)
    ]);
  };

  const placeBet = () => {
    if (!selectedBet || betAmount <= 0 || gameState.phase !== 'betting') return;
    
    const currentBalance = parseFloat(balance);
    if (currentBalance < betAmount) {
      alert('Insufficient balance!');
      return;
    }

    // Deduct bet amount
    updateBalance(betAmount, 'subtract');

    // Add bet
    setGameState(prev => ({
      ...prev,
      bets: [...prev.bets, { type: selectedBet, amount: betAmount }],
      totalBet: prev.totalBet + betAmount
    }));

    setSelectedBet(null);
  };

  const formatTime = (seconds: number) => {
    return seconds.toString().padStart(2, '0');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-yellow-900 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Dragon Tiger</h1>
          <p className="text-gray-300">Highest card wins!</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-300">Balance</p>
          <p className="text-xl font-bold text-yellow-400">₹{parseFloat(balance).toFixed(2)}</p>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6 text-center">
        <div className="text-lg font-semibold mb-2">
          {gameState.phase === 'betting' && 'Place Your Bets'}
          {gameState.phase === 'dealing' && 'Dealing Cards...'}
          {gameState.phase === 'result' && 'Round Result'}
        </div>
        <div className="text-3xl font-bold text-yellow-400">
          {formatTime(gameState.timeRemaining)}
        </div>
      </div>

      {/* Game Arena */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          {/* Dragon Side */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Crown className="w-8 h-8 text-red-500" />
              <h2 className="text-2xl font-bold text-red-500">DRAGON</h2>
            </div>
            <div className="w-32 h-44 bg-gray-700 rounded-lg border-2 border-red-500 flex items-center justify-center relative">
              <AnimatePresence>
                {gameState.dragonCard ? (
                  <motion.div
                    initial={{ rotateY: 180, scale: 0 }}
                    animate={{ rotateY: 0, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-lg w-28 h-40 flex flex-col items-center justify-center text-4xl font-bold border-2 border-gray-300"
                  >
                    <div className={getSuitColor(gameState.dragonCard.suit)}>
                      {gameState.dragonCard.rank}
                    </div>
                    <div className="text-2xl">
                      {getSuitSymbol(gameState.dragonCard.suit)}
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-blue-600 rounded-lg w-28 h-40 flex items-center justify-center">
                    <Crown className="w-12 h-12 text-white" />
                  </div>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-2 text-sm text-gray-300">
              Multiplier: 2x
            </div>
          </div>

          {/* VS */}
          <div className="text-center">
            <Swords className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
            <div className="text-xl font-bold">VS</div>
          </div>

          {/* Tiger Side */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-bold text-orange-500">TIGER</h2>
            </div>
            <div className="w-32 h-44 bg-gray-700 rounded-lg border-2 border-orange-500 flex items-center justify-center relative">
              <AnimatePresence>
                {gameState.tigerCard ? (
                  <motion.div
                    initial={{ rotateY: 180, scale: 0 }}
                    animate={{ rotateY: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white rounded-lg w-28 h-40 flex flex-col items-center justify-center text-4xl font-bold border-2 border-gray-300"
                  >
                    <div className={getSuitColor(gameState.tigerCard.suit)}>
                      {gameState.tigerCard.rank}
                    </div>
                    <div className="text-2xl">
                      {getSuitSymbol(gameState.tigerCard.suit)}
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-orange-600 rounded-lg w-28 h-40 flex items-center justify-center">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-2 text-sm text-gray-300">
              Multiplier: 2x
            </div>
          </div>
        </div>

        {/* Tie Option */}
        <div className="text-center mt-6">
          <div className="bg-purple-700 rounded-lg p-4 inline-block">
            <h3 className="text-lg font-bold text-purple-200 mb-2">TIE</h3>
            <div className="text-sm text-purple-300">Multiplier: 8x</div>
          </div>
        </div>
      </div>

      {/* Game Result */}
      <AnimatePresence>
        {gameState.phase === 'result' && gameState.winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`${
              gameState.winner === 'dragon' ? 'bg-gradient-to-r from-red-500 to-red-600' :
              gameState.winner === 'tiger' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
              'bg-gradient-to-r from-purple-500 to-purple-600'
            } rounded-lg p-6 mb-6 text-center`}
          >
            <h2 className="text-3xl font-bold mb-2">
              {gameState.winner === 'dragon' && '🐉 DRAGON WINS!'}
              {gameState.winner === 'tiger' && '🐅 TIGER WINS!'}
              {gameState.winner === 'tie' && '🤝 TIE!'}
            </h2>
            {gameState.winAmount > 0 && (
              <p className="text-2xl font-bold">
                You Won: ₹{gameState.winAmount.toFixed(2)}!
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Betting Interface */}
      {gameState.phase === 'betting' && (
        <div className="space-y-4">
          {/* Bet Selection */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Choose Your Bet</h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedBet('dragon')}
                className={`bg-red-600 hover:bg-red-500 p-4 rounded-lg font-semibold transition-colors ${
                  selectedBet === 'dragon' ? 'ring-4 ring-yellow-400' : ''
                }`}
              >
                <Crown className="w-6 h-6 mx-auto mb-2" />
                <div>DRAGON</div>
                <div className="text-sm">2x</div>
              </button>
              
              <button
                onClick={() => setSelectedBet('tie')}
                className={`bg-purple-600 hover:bg-purple-500 p-4 rounded-lg font-semibold transition-colors ${
                  selectedBet === 'tie' ? 'ring-4 ring-yellow-400' : ''
                }`}
              >
                <Swords className="w-6 h-6 mx-auto mb-2" />
                <div>TIE</div>
                <div className="text-sm">8x</div>
              </button>
              
              <button
                onClick={() => setSelectedBet('tiger')}
                className={`bg-orange-600 hover:bg-orange-500 p-4 rounded-lg font-semibold transition-colors ${
                  selectedBet === 'tiger' ? 'ring-4 ring-yellow-400' : ''
                }`}
              >
                <Shield className="w-6 h-6 mx-auto mb-2" />
                <div>TIGER</div>
                <div className="text-sm">2x</div>
              </button>
            </div>
          </div>

          {/* Bet Amount */}
          {selectedBet && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Bet Amount</h3>
              <div className="flex items-center space-x-4 mb-4">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  placeholder="Enter amount"
                  min="10"
                />
                <button
                  onClick={placeBet}
                  disabled={!selectedBet || betAmount <= 0}
                  className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Place Bet
                </button>
              </div>
              <div className="flex space-x-2">
                {[100, 500, 1000, 5000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Current Bets */}
      {gameState.bets.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold mb-4">Your Bets</h3>
          <div className="space-y-2">
            {gameState.bets.map((bet, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                <span className="capitalize font-semibold">{bet.type}</span>
                <span>₹{bet.amount}</span>
              </div>
            ))}
            <div className="border-t border-gray-600 pt-2 flex justify-between font-bold">
              <span>Total Bet:</span>
              <span>₹{gameState.totalBet}</span>
            </div>
          </div>
        </div>
      )}

      {/* Game History */}
      <div className="bg-gray-800 rounded-lg p-4 mt-6">
        <h3 className="text-lg font-semibold mb-4">Recent Results</h3>
        <div className="flex space-x-2 overflow-x-auto">
          {gameHistory.map((game, index) => (
            <div key={index} className="flex-shrink-0 text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                game.winner === 'dragon' ? 'bg-red-500' :
                game.winner === 'tiger' ? 'bg-orange-500' :
                'bg-purple-500'
              }`}>
                {game.winner === 'dragon' ? 'D' : game.winner === 'tiger' ? 'T' : 'X'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullyPlayableDragonTiger;