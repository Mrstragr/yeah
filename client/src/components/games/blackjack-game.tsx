import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Coins, TrendingUp, Heart, Diamond, Club, Spade } from "lucide-react";

interface BlackjackGameProps {
  game: any;
  user: any;
  onBack: () => void;
}

interface PlayingCard {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: string;
  numValue: number;
}

export function BlackjackGame({ game, user, onBack }: BlackjackGameProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [playerCards, setPlayerCards] = useState<PlayingCard[]>([]);
  const [dealerCards, setDealerCards] = useState<PlayingCard[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'finished'>('betting');
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [result, setResult] = useState<'win' | 'lose' | 'push' | null>(null);
  const [gameHistory, setGameHistory] = useState<any[]>([]);

  const suits = {
    hearts: { icon: Heart, color: 'text-red-500' },
    diamonds: { icon: Diamond, color: 'text-red-500' },
    clubs: { icon: Club, color: 'text-black' },
    spades: { icon: Spade, color: 'text-black' }
  };

  const createDeck = (): PlayingCard[] => {
    const deck: PlayingCard[] = [];
    const suits: ('hearts' | 'diamonds' | 'clubs' | 'spades')[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    suits.forEach(suit => {
      values.forEach(value => {
        let numValue = parseInt(value);
        if (value === 'A') numValue = 11;
        else if (['J', 'Q', 'K'].includes(value)) numValue = 10;
        
        deck.push({ suit, value, numValue });
      });
    });
    
    return deck.sort(() => Math.random() - 0.5);
  };

  const calculateScore = (cards: PlayingCard[]): number => {
    let score = 0;
    let aces = 0;
    
    cards.forEach(card => {
      if (card.value === 'A') {
        aces++;
        score += 11;
      } else {
        score += card.numValue;
      }
    });
    
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    
    return score;
  };

  const dealCard = (deck: PlayingCard[]): PlayingCard => {
    return deck.pop() || createDeck()[0];
  };

  const startGame = () => {
    if (betAmount < 10) return;
    
    const deck = createDeck();
    const playerHand = [dealCard(deck), dealCard(deck)];
    const dealerHand = [dealCard(deck), dealCard(deck)];
    
    setPlayerCards(playerHand);
    setDealerCards(dealerHand);
    setPlayerScore(calculateScore(playerHand));
    setDealerScore(calculateScore([dealerHand[0]])); // Only show first dealer card
    setGameState('playing');
    setResult(null);
  };

  const hit = () => {
    const deck = createDeck();
    const newCard = dealCard(deck);
    const newPlayerCards = [...playerCards, newCard];
    const newScore = calculateScore(newPlayerCards);
    
    setPlayerCards(newPlayerCards);
    setPlayerScore(newScore);
    
    if (newScore > 21) {
      endGame(newPlayerCards, dealerCards, 'bust');
    }
  };

  const stand = () => {
    let newDealerCards = [...dealerCards];
    const deck = createDeck();
    
    while (calculateScore(newDealerCards) < 17) {
      newDealerCards.push(dealCard(deck));
    }
    
    setDealerCards(newDealerCards);
    endGame(playerCards, newDealerCards, 'stand');
  };

  const endGame = (finalPlayerCards: PlayingCard[], finalDealerCards: PlayingCard[], reason: string) => {
    const finalPlayerScore = calculateScore(finalPlayerCards);
    const finalDealerScore = calculateScore(finalDealerCards);
    
    setPlayerScore(finalPlayerScore);
    setDealerScore(finalDealerScore);
    
    let gameResult: 'win' | 'lose' | 'push';
    let payout = 0;
    
    if (reason === 'bust') {
      gameResult = 'lose';
    } else if (finalDealerScore > 21) {
      gameResult = 'win';
      payout = betAmount * 2;
    } else if (finalPlayerScore > finalDealerScore) {
      gameResult = 'win';
      payout = betAmount * 2;
    } else if (finalPlayerScore < finalDealerScore) {
      gameResult = 'lose';
    } else {
      gameResult = 'push';
      payout = betAmount;
    }
    
    setResult(gameResult);
    setGameState('finished');
    
    const newGame = {
      playerCards: finalPlayerCards,
      dealerCards: finalDealerCards,
      playerScore: finalPlayerScore,
      dealerScore: finalDealerScore,
      bet: betAmount,
      result: gameResult,
      payout,
      timestamp: new Date()
    };
    
    setGameHistory(prev => [newGame, ...prev.slice(0, 9)]);
  };

  const newGame = () => {
    setPlayerCards([]);
    setDealerCards([]);
    setPlayerScore(0);
    setDealerScore(0);
    setGameState('betting');
    setResult(null);
  };

  const renderCard = (card: PlayingCard, hidden = false) => {
    if (hidden) {
      return (
        <div className="w-16 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center border-2 border-white/20">
          <div className="text-white text-xs">🂠</div>
        </div>
      );
    }

    const SuitIcon = suits[card.suit].icon;
    return (
      <div className="w-16 h-24 bg-white rounded-lg flex flex-col items-center justify-center border-2 border-gray-300 shadow-lg">
        <div className={`text-lg font-bold ${suits[card.suit].color}`}>
          {card.value}
        </div>
        <SuitIcon className={`w-6 h-6 ${suits[card.suit].color}`} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">♠️ Blackjack</h1>
            <p className="text-gray-300 text-sm">Beat the dealer to 21</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Balance</p>
            <p className="text-lg font-bold text-green-400">₹{parseFloat(user?.walletBalance || '0').toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Game Table */}
            <Card className="bg-gradient-to-br from-green-800/30 to-green-600/30 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white text-center">Blackjack Table</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Dealer Section */}
                <div className="mb-8">
                  <div className="text-center mb-4">
                    <h3 className="text-white text-lg font-bold">Dealer</h3>
                    <p className="text-gray-300">Score: {gameState === 'playing' ? '?' : dealerScore}</p>
                  </div>
                  <div className="flex justify-center space-x-2">
                    {dealerCards.map((card, index) => (
                      <motion.div
                        key={index}
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        {renderCard(card, gameState === 'playing' && index === 1)}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Player Section */}
                <div className="mb-6">
                  <div className="text-center mb-4">
                    <h3 className="text-white text-lg font-bold">Your Hand</h3>
                    <p className="text-gray-300">Score: {playerScore}</p>
                  </div>
                  <div className="flex justify-center space-x-2">
                    {playerCards.map((card, index) => (
                      <motion.div
                        key={index}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        {renderCard(card)}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Game Result */}
                {result && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center mb-6"
                  >
                    <div className={`text-2xl font-bold mb-2 ${
                      result === 'win' ? 'text-green-400' : 
                      result === 'lose' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {result === 'win' ? 'You Win!' : 
                       result === 'lose' ? 'You Lose!' : 'Push!'}
                    </div>
                    {result === 'win' && (
                      <div className="text-green-400 font-bold">
                        Won ₹{(betAmount * 2).toLocaleString()}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Game Controls */}
                <div className="flex justify-center space-x-4">
                  {gameState === 'betting' && (
                    <div className="space-y-4 w-full max-w-md">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Bet Amount (₹10 - ₹{Math.min(10000, parseFloat(user?.walletBalance || '0'))})
                        </label>
                        <Input
                          type="number"
                          value={betAmount}
                          onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 0))}
                          className="bg-gray-700 border-gray-600 text-white"
                          min={10}
                          max={Math.min(10000, parseFloat(user?.walletBalance || '0'))}
                        />
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        {[100, 500, 1000, 2500].map((amount) => (
                          <Button
                            key={amount}
                            onClick={() => setBetAmount(amount)}
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs py-2"
                          >
                            ₹{amount}
                          </Button>
                        ))}
                      </div>

                      <Button
                        onClick={startGame}
                        disabled={betAmount < 10}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-lg font-bold"
                      >
                        Deal Cards (₹{betAmount.toLocaleString()})
                      </Button>
                    </div>
                  )}

                  {gameState === 'playing' && (
                    <div className="flex space-x-4">
                      <Button
                        onClick={hit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-bold"
                      >
                        Hit
                      </Button>
                      <Button
                        onClick={stand}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-bold"
                      >
                        Stand
                      </Button>
                    </div>
                  )}

                  {gameState === 'finished' && (
                    <Button
                      onClick={newGame}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-bold"
                    >
                      New Game
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rules */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                  Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-300">
                <div>• Get closer to 21 than dealer</div>
                <div>• Aces = 1 or 11</div>
                <div>• Face cards = 10</div>
                <div>• Over 21 = bust (lose)</div>
                <div>• Dealer hits on 16</div>
                <div>• Winning pays 2:1</div>
              </CardContent>
            </Card>

            {/* Recent Games */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                  Recent Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {gameHistory.length > 0 ? (
                    gameHistory.map((game, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                        <div className="text-xs text-gray-400">
                          {game.playerScore} vs {game.dealerScore}
                        </div>
                        <div className={`text-xs font-bold ${
                          game.result === 'win' ? 'text-green-400' : 
                          game.result === 'lose' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {game.result === 'win' ? `+₹${game.payout}` : 
                           game.result === 'lose' ? `-₹${game.bet}` : '₹0'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No games played yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}