import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Timer, Users, Trophy } from 'lucide-react';
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

interface Hand {
  cards: Card[];
  handType: 'high-card' | 'pair' | 'flush' | 'straight' | 'trail' | 'straight-flush';
  rank: number;
}

interface GameState {
  playerHand: Card[];
  dealerHand: Card[];
  gamePhase: 'betting' | 'dealing' | 'reveal' | 'finished';
  result: 'player' | 'dealer' | 'tie' | null;
  betAmount: number;
}

export default function RealMoneyTeenPatti({ onBack }: Props) {
  const [balance, setBalance] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>({
    playerHand: [],
    dealerHand: [],
    gamePhase: 'betting',
    result: null,
    betAmount: 10
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [gameHistory, setGameHistory] = useState<string[]>([]);

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

  const generateDeck = (): Card[] => {
    const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const numValues = [14, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // Ace high
    
    const deck: Card[] = [];
    suits.forEach(suit => {
      values.forEach((value, index) => {
        deck.push({
          suit,
          value,
          numValue: numValues[index]
        });
      });
    });
    
    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
  };

  const dealCards = (deck: Card[]) => {
    const playerHand = deck.slice(0, 3);
    const dealerHand = deck.slice(3, 6);
    return { playerHand, dealerHand };
  };

  const evaluateHand = (cards: Card[]): Hand => {
    const sortedCards = [...cards].sort((a, b) => b.numValue - a.numValue);
    const values = sortedCards.map(c => c.numValue);
    const suits = sortedCards.map(c => c.suit);
    
    // Check for Trail (Three of a kind)
    if (values[0] === values[1] && values[1] === values[2]) {
      return {
        cards: sortedCards,
        handType: 'trail',
        rank: 6000 + values[0]
      };
    }
    
    // Check for Straight Flush
    const isFlush = suits.every(suit => suit === suits[0]);
    const isStraight = (values[0] - values[1] === 1) && (values[1] - values[2] === 1);
    
    if (isFlush && isStraight) {
      return {
        cards: sortedCards,
        handType: 'straight-flush',
        rank: 5000 + values[0]
      };
    }
    
    // Check for Flush
    if (isFlush) {
      return {
        cards: sortedCards,
        handType: 'flush',
        rank: 4000 + values[0] * 100 + values[1] * 10 + values[2]
      };
    }
    
    // Check for Straight
    if (isStraight) {
      return {
        cards: sortedCards,
        handType: 'straight',
        rank: 3000 + values[0]
      };
    }
    
    // Check for Pair
    if (values[0] === values[1] || values[1] === values[2] || values[0] === values[2]) {
      const pairValue = values[0] === values[1] ? values[0] : 
                       values[1] === values[2] ? values[1] : values[0];
      const kicker = values.find(v => v !== pairValue) || 0;
      return {
        cards: sortedCards,
        handType: 'pair',
        rank: 2000 + pairValue * 100 + kicker
      };
    }
    
    // High Card
    return {
      cards: sortedCards,
      handType: 'high-card',
      rank: values[0] * 100 + values[1] * 10 + values[2]
    };
  };

  const startGame = async () => {
    if (gameState.betAmount > balance) {
      alert('Insufficient balance!');
      return;
    }

    setIsLoading(true);
    try {
      // Place bet
      const betResponse = await apiRequest('POST', '/api/games/teen-patti/bet', {
        amount: gameState.betAmount
      });
      
      if (betResponse.ok) {
        setGameState(prev => ({ ...prev, gamePhase: 'dealing' }));
        
        // Generate and deal cards
        const deck = generateDeck();
        const { playerHand, dealerHand } = dealCards(deck);
        
        // Deal cards with animation
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            playerHand,
            dealerHand,
            gamePhase: 'reveal'
          }));
        }, 1500);
        
        // Determine winner and process result
        setTimeout(async () => {
          const playerHandEval = evaluateHand(playerHand);
          const dealerHandEval = evaluateHand(dealerHand);
          
          let result: 'player' | 'dealer' | 'tie';
          if (playerHandEval.rank > dealerHandEval.rank) {
            result = 'player';
          } else if (dealerHandEval.rank > playerHandEval.rank) {
            result = 'dealer';
          } else {
            result = 'tie';
          }
          
          setGameState(prev => ({ ...prev, result, gamePhase: 'finished' }));
          setGameHistory(prev => [result, ...prev.slice(0, 9)]);
          
          // Process winnings
          if (result === 'player') {
            const winAmount = gameState.betAmount * 1.9; // Player wins pay 1.9:1
            await apiRequest('POST', '/api/games/teen-patti/win', {
              amount: winAmount,
              result
            });
          } else if (result === 'tie') {
            // Return bet on tie
            await apiRequest('POST', '/api/games/teen-patti/win', {
              amount: gameState.betAmount,
              result
            });
          }
          
          await fetchBalance();
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to start game:', error);
    }
    setIsLoading(false);
  };

  const resetGame = () => {
    setGameState({
      playerHand: [],
      dealerHand: [],
      gamePhase: 'betting',
      result: null,
      betAmount: gameState.betAmount
    });
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

  const getHandTypeName = (handType: Hand['handType']) => {
    switch (handType) {
      case 'trail': return 'Trail (Three of a Kind)';
      case 'straight-flush': return 'Straight Flush';
      case 'flush': return 'Flush';
      case 'straight': return 'Straight';
      case 'pair': return 'Pair';
      case 'high-card': return 'High Card';
    }
  };

  const CardComponent = ({ card, index = 0 }: { card: Card, index?: number }) => (
    <motion.div
      initial={{ rotateY: 180, scale: 0.8 }}
      animate={{ rotateY: 0, scale: 1 }}
      transition={{ delay: index * 0.2, duration: 0.5 }}
      className="w-16 h-22 bg-white rounded-lg shadow-lg border-2 border-gray-300 flex flex-col items-center justify-center"
    >
      <div className={`text-lg font-bold ${getSuitColor(card.suit)}`}>
        {card.value}
      </div>
      <div className="text-lg">
        {getSuitSymbol(card.suit)}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {onBack && (
                <button onClick={onBack} className="text-white/80 hover:text-white">
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <div>
                <h1 className="text-white text-2xl font-bold">TEEN PATTI</h1>
                <p className="text-purple-100 text-sm">3 Card Classic</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-purple-100 text-sm">Balance</div>
              <div className="text-white text-xl font-bold">₹{balance.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="p-6">
          
          {/* Dealer Hand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="font-bold text-gray-800">DEALER</span>
              {gameState.result === 'dealer' && (
                <Trophy className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            
            <div className="flex justify-center gap-2 mb-2">
              {gameState.dealerHand.length > 0 ? (
                gameState.dealerHand.map((card, index) => (
                  <CardComponent key={index} card={card} index={index} />
                ))
              ) : (
                [0, 1, 2].map(index => (
                  <div
                    key={index}
                    className="w-16 h-22 bg-gray-300 rounded-lg border-2 border-gray-400 flex items-center justify-center"
                  >
                    <div className="text-gray-500 text-2xl">?</div>
                  </div>
                ))
              )}
            </div>
            
            {gameState.dealerHand.length > 0 && gameState.gamePhase === 'finished' && (
              <div className="text-sm text-gray-600">
                {getHandTypeName(evaluateHand(gameState.dealerHand).handType)}
              </div>
            )}
          </div>

          {/* VS Indicator */}
          <div className="text-center mb-8">
            <div className="text-2xl font-bold text-gray-600">VS</div>
            {gameState.result && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`mt-2 px-4 py-2 rounded-full text-sm font-bold ${
                  gameState.result === 'player' ? 'bg-green-400 text-green-900' :
                  gameState.result === 'dealer' ? 'bg-red-400 text-red-900' :
                  'bg-yellow-400 text-yellow-900'
                }`}
              >
                {gameState.result === 'player' ? 'YOU WIN!' :
                 gameState.result === 'dealer' ? 'DEALER WINS' : 'TIE'}
              </motion.div>
            )}
          </div>

          {/* Player Hand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-blue-800">PLAYER</span>
              {gameState.result === 'player' && (
                <Trophy className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            
            <div className="flex justify-center gap-2 mb-2">
              {gameState.playerHand.length > 0 ? (
                gameState.playerHand.map((card, index) => (
                  <CardComponent key={index} card={card} index={index} />
                ))
              ) : (
                [0, 1, 2].map(index => (
                  <div
                    key={index}
                    className="w-16 h-22 bg-blue-100 rounded-lg border-2 border-blue-300 flex items-center justify-center"
                  >
                    <div className="text-blue-400 text-2xl">?</div>
                  </div>
                ))
              )}
            </div>
            
            {gameState.playerHand.length > 0 && gameState.gamePhase === 'finished' && (
              <div className="text-sm text-blue-600">
                {getHandTypeName(evaluateHand(gameState.playerHand).handType)}
              </div>
            )}
          </div>

          {/* Betting Controls */}
          {gameState.gamePhase === 'betting' && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="font-medium">Bet Amount:</span>
                <div className="flex gap-2">
                  {[10, 50, 100, 500, 1000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setGameState(prev => ({ ...prev, betAmount: amount }))}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        gameState.betAmount === amount 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={startGame}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 py-4 text-lg"
              >
                {isLoading ? 'Dealing Cards...' : `PLAY - ₹${gameState.betAmount}`}
              </Button>
            </div>
          )}

          {/* Game Actions */}
          {gameState.gamePhase === 'finished' && (
            <div className="mb-6">
              <Button
                onClick={resetGame}
                className="w-full bg-green-600 hover:bg-green-700 py-4 text-lg"
              >
                PLAY AGAIN
              </Button>
            </div>
          )}

          {/* Game Status */}
          {gameState.gamePhase === 'dealing' && (
            <div className="text-center py-8">
              <div className="text-lg font-bold text-purple-600 mb-2">Dealing Cards...</div>
              <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          )}

          {/* Game History */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold mb-3">Recent Results:</h3>
            <div className="flex gap-2 flex-wrap">
              {gameHistory.map((result, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    result === 'player' ? 'bg-green-500' :
                    result === 'dealer' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}
                >
                  {result === 'player' ? 'P' : result === 'dealer' ? 'D' : 'T'}
                </div>
              ))}
            </div>
          </div>

          {/* Hand Rankings Guide */}
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Hand Rankings (Highest to Lowest):</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <div>1. Trail (Three of a Kind) - AAA, KKK, QQQ...</div>
              <div>2. Straight Flush - A♠️K♠️Q♠️, K♥️Q♥️J♥️...</div>
              <div>3. Flush - A♠️K♠️J♠️, K♥️Q♥️9♥️...</div>
              <div>4. Straight - AKQ, KQJ, QJ10...</div>
              <div>5. Pair - AAK, KKQ, QQJ...</div>
              <div>6. High Card - AKJ, KQ9, QJ8...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}