import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Timer, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';

interface Props {
  onBack?: () => void;
}

interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: string;
  numValue: number;
}

interface GameRound {
  id: string;
  dragonCard: Card | null;
  tigerCard: Card | null;
  result: 'dragon' | 'tiger' | 'tie' | null;
  status: 'betting' | 'dealing' | 'finished';
}

interface Bet {
  type: 'dragon' | 'tiger' | 'tie';
  amount: number;
}

export default function RealMoneyDragonTiger({ onBack }: Props) {
  const [balance, setBalance] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<GameRound>({
    id: '1',
    dragonCard: null,
    tigerCard: null,
    result: null,
    status: 'betting'
  });
  
  const [bets, setBets] = useState<Bet[]>([]);
  const [selectedBetAmount, setSelectedBetAmount] = useState<number>(10);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [isLoading, setIsLoading] = useState(false);
  const [gameHistory, setGameHistory] = useState<string[]>([]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (currentRound.status === 'betting') {
            dealCards();
          }
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentRound.status]);

  // Fetch balance
  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await apiRequest('GET', '/api/wallet/balance');
      const data = await response.json();
      setBalance(data.balance || 0);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  const generateCard = (): Card => {
    const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const numValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const valueIndex = Math.floor(Math.random() * values.length);
    
    return {
      suit,
      value: values[valueIndex],
      numValue: numValues[valueIndex]
    };
  };

  const placeBet = async (type: 'dragon' | 'tiger' | 'tie') => {
    if (selectedBetAmount > balance || currentRound.status !== 'betting') return;

    const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0) + selectedBetAmount;
    if (totalBetAmount > balance) {
      alert('Insufficient balance for this bet!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/games/dragon-tiger/bet', {
        type,
        amount: selectedBetAmount,
        roundId: currentRound.id
      });

      if (response.ok) {
        setBets(prev => [...prev, { type, amount: selectedBetAmount }]);
        await fetchBalance();
      }
    } catch (error) {
      console.error('Failed to place bet:', error);
    }
    setIsLoading(false);
  };

  const dealCards = async () => {
    if (bets.length === 0) {
      // No bets placed, start new round
      setCurrentRound(prev => ({
        ...prev,
        status: 'betting'
      }));
      setTimeLeft(20);
      return;
    }

    setCurrentRound(prev => ({ ...prev, status: 'dealing' }));
    
    // Generate cards
    const dragonCard = generateCard();
    const tigerCard = generateCard();
    
    // Deal dragon card first
    setTimeout(() => {
      setCurrentRound(prev => ({ ...prev, dragonCard }));
    }, 1000);
    
    // Deal tiger card second
    setTimeout(() => {
      setCurrentRound(prev => ({ ...prev, tigerCard }));
    }, 2000);
    
    // Determine result and process bets
    setTimeout(async () => {
      let result: 'dragon' | 'tiger' | 'tie';
      
      if (dragonCard.numValue > tigerCard.numValue) {
        result = 'dragon';
      } else if (tigerCard.numValue > dragonCard.numValue) {
        result = 'tiger';
      } else {
        result = 'tie';
      }

      setCurrentRound(prev => ({ ...prev, result, status: 'finished' }));
      setGameHistory(prev => [result, ...prev.slice(0, 9)]);

      // Process winnings
      await processWinnings(result);
      
      // Start new round after 3 seconds
      setTimeout(() => {
        startNewRound();
      }, 3000);
      
    }, 3000);
  };

  const processWinnings = async (result: 'dragon' | 'tiger' | 'tie') => {
    let totalWinnings = 0;
    
    bets.forEach(bet => {
      if (bet.type === result) {
        const multiplier = result === 'tie' ? 8 : 1.95; // Tie pays 8:1, Dragon/Tiger pays 1.95:1
        totalWinnings += bet.amount * multiplier;
      }
    });

    if (totalWinnings > 0) {
      try {
        await apiRequest('POST', '/api/games/dragon-tiger/win', {
          amount: totalWinnings,
          result,
          roundId: currentRound.id
        });
        await fetchBalance();
      } catch (error) {
        console.error('Failed to process winnings:', error);
      }
    }
  };

  const startNewRound = () => {
    setCurrentRound({
      id: Date.now().toString(),
      dragonCard: null,
      tigerCard: null,
      result: null,
      status: 'betting'
    });
    setBets([]);
    setTimeLeft(20);
  };

  const getSuitSymbol = (suit: Card['suit']) => {
    switch (suit) {
      case 'hearts': return '♥️';
      case 'diamonds': return '♦️';
      case 'clubs': return '♣️';
      case 'spades': return '♠️';
    }
  };

  const getSuitColor = (suit: Card['suit']) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-black';
  };

  const CardComponent = ({ card, label, isWinner }: { card: Card | null, label: string, isWinner?: boolean }) => (
    <div className="text-center">
      <div className={`text-lg font-bold mb-2 ${isWinner ? 'text-yellow-500' : 'text-gray-700'}`}>
        {label} {isWinner && '👑'}
      </div>
      <div className={`w-24 h-32 bg-white rounded-lg shadow-lg border-2 flex flex-col items-center justify-center ${
        isWinner ? 'border-yellow-400 shadow-yellow-200' : 'border-gray-300'
      }`}>
        {card ? (
          <>
            <div className={`text-2xl font-bold ${getSuitColor(card.suit)}`}>
              {card.value}
            </div>
            <div className="text-2xl">
              {getSuitSymbol(card.suit)}
            </div>
          </>
        ) : (
          <div className="text-gray-400 text-4xl">?</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-green-900">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {onBack && (
                <button onClick={onBack} className="text-white/80 hover:text-white">
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <div>
                <h1 className="text-white text-2xl font-bold">DRAGON TIGER</h1>
                <p className="text-red-100 text-sm">Classic Card Battle</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-red-100 text-sm">Balance</div>
              <div className="text-white text-xl font-bold">₹{balance.toFixed(2)}</div>
            </div>
          </div>

          {/* Timer */}
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Timer className="w-5 h-5 text-white" />
              <span className="text-white font-medium">
                {currentRound.status === 'betting' ? 'Betting Time' : 'Dealing Cards'}
              </span>
            </div>
            <div className="text-white text-2xl font-bold">
              {currentRound.status === 'betting' ? `${timeLeft}s` : 'DEALING...'}
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="p-6">
          {/* Cards Display */}
          <div className="flex justify-around items-center mb-6">
            <CardComponent 
              card={currentRound.dragonCard} 
              label="DRAGON" 
              isWinner={currentRound.result === 'dragon'}
            />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600 mb-2">VS</div>
              {currentRound.result && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold"
                >
                  {currentRound.result.toUpperCase()}
                </motion.div>
              )}
            </div>
            <CardComponent 
              card={currentRound.tigerCard} 
              label="TIGER"
              isWinner={currentRound.result === 'tiger'}
            />
          </div>

          {/* Betting Options */}
          {currentRound.status === 'betting' && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Bet Amount:</span>
                <div className="flex gap-2">
                  {[10, 50, 100, 500].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setSelectedBetAmount(amount)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        selectedBetAmount === amount 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => placeBet('dragon')}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 py-8 flex flex-col"
                >
                  <div className="text-2xl mb-1">🐉</div>
                  <div className="font-bold">DRAGON</div>
                  <div className="text-xs opacity-80">1.95x</div>
                </Button>
                
                <Button
                  onClick={() => placeBet('tie')}
                  disabled={isLoading}
                  className="bg-yellow-600 hover:bg-yellow-700 py-8 flex flex-col"
                >
                  <div className="text-2xl mb-1">🤝</div>
                  <div className="font-bold">TIE</div>
                  <div className="text-xs opacity-80">8.0x</div>
                </Button>
                
                <Button
                  onClick={() => placeBet('tiger')}
                  disabled={isLoading}
                  className="bg-orange-600 hover:bg-orange-700 py-8 flex flex-col"
                >
                  <div className="text-2xl mb-1">🐅</div>
                  <div className="font-bold">TIGER</div>
                  <div className="text-xs opacity-80">1.95x</div>
                </Button>
              </div>
            </div>
          )}

          {/* Current Bets */}
          {bets.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold mb-2">Your Bets:</h3>
              <div className="space-y-2">
                {bets.map((bet, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="capitalize font-medium">{bet.type}</span>
                    <span>₹{bet.amount}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Bet:</span>
                  <span>₹{bets.reduce((sum, bet) => sum + bet.amount, 0)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Game History */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold mb-3">Recent Results:</h3>
            <div className="flex gap-2 flex-wrap">
              {gameHistory.map((result, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    result === 'dragon' ? 'bg-red-500' :
                    result === 'tiger' ? 'bg-orange-500' : 'bg-yellow-500'
                  }`}
                >
                  {result === 'dragon' ? 'D' : result === 'tiger' ? 'T' : 'TIE'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}