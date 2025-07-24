import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Crown, Zap, Trophy, Timer, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onBack: () => void;
}

interface Card {
  suit: string;
  value: string;
  color: 'red' | 'black';
}

export default function RealMoneyAndarBahar({ onBack }: Props) {
  const [balance, setBalance] = useState(12580.45);
  const [betAmount, setBetAmount] = useState(100);
  const [selectedBet, setSelectedBet] = useState<'andar' | 'bahar' | null>(null);
  const [gamePhase, setGamePhase] = useState<'betting' | 'dealing' | 'result'>('betting');
  const [jokerCard, setJokerCard] = useState<Card | null>(null);
  const [andarCards, setAndarCards] = useState<Card[]>([]);
  const [baharCards, setBaharCards] = useState<Card[]>([]);
  const [winner, setWinner] = useState<'andar' | 'bahar' | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [roundNumber, setRoundNumber] = useState(1);
  const [winAmount, setWinAmount] = useState(0);
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    if (gamePhase === 'betting' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'betting') {
      dealCards();
    }
  }, [timeLeft, gamePhase]);

  const createRandomCard = (): Card => {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const value = values[Math.floor(Math.random() * values.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    return {
      suit,
      value,
      color: ['♥', '♦'].includes(suit) ? 'red' : 'black'
    };
  };

  const placeBet = (betType: 'andar' | 'bahar') => {
    if (betAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough funds to place this bet",
        variant: "destructive",
      });
      return;
    }

    setSelectedBet(betType);
    setBalance(prev => prev - betAmount);
    
    toast({
      title: "Bet Placed",
      description: `₹${betAmount} on ${betType.toUpperCase()}`,
    });
  };

  const dealCards = async () => {
    if (!selectedBet) {
      setTimeLeft(20);
      toast({
        title: "No Bet Placed",
        description: "Place a bet to continue",
        variant: "destructive",
      });
      return;
    }

    setGamePhase('dealing');

    // Set joker card
    const joker = createRandomCard();
    setJokerCard(joker);

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Deal cards alternately to Andar and Bahar
    const andarDeck: Card[] = [];
    const baharDeck: Card[] = [];
    let currentSide = 'andar';
    let matchFound = false;

    const dealingInterval = setInterval(() => {
      const newCard = createRandomCard();
      
      if (currentSide === 'andar') {
        andarDeck.push(newCard);
        setAndarCards([...andarDeck]);
      } else {
        baharDeck.push(newCard);
        setBaharCards([...baharDeck]);
      }

      // Check if card matches joker value
      if (newCard.value === joker.value) {
        matchFound = true;
        clearInterval(dealingInterval);
        
        const gameWinner = currentSide as 'andar' | 'bahar';
        setWinner(gameWinner);
        setGamePhase('result');
        
        // Calculate winnings
        let payout = 0;
        if (selectedBet === gameWinner) {
          // Andar pays 0.9:1, Bahar pays 1:1
          payout = selectedBet === 'andar' ? betAmount * 1.9 : betAmount * 2;
        }
        
        if (payout > 0) {
          setWinAmount(payout);
          setBalance(prev => prev + payout);
          toast({
            title: "🎉 WIN!",
            description: `You won ₹${payout.toFixed(2)}!`,
          });
        } else {
          toast({
            title: "Better luck next time",
            description: `${gameWinner.toUpperCase()} won this round`,
            variant: "destructive",
          });
        }
        
        // Reset for next round
        setTimeout(() => {
          setGamePhase('betting');
          setSelectedBet(null);
          setJokerCard(null);
          setAndarCards([]);
          setBaharCards([]);
          setWinner(null);
          setWinAmount(0);
          setTimeLeft(20);
          setRoundNumber(prev => prev + 1);
        }, 4000);
      }

      // Switch sides
      currentSide = currentSide === 'andar' ? 'bahar' : 'andar';
    }, 800);

    // Safety timeout
    setTimeout(() => {
      if (!matchFound) {
        clearInterval(dealingInterval);
        // Force a winner if no match found (shouldn't happen normally)
        const randomWinner = Math.random() < 0.5 ? 'andar' : 'bahar';
        setWinner(randomWinner);
        setGamePhase('result');
      }
    }, 20000);
  };

  const CardComponent = ({ card, isJoker = false }: { card: Card; isJoker?: boolean }) => (
    <motion.div
      initial={{ scale: 0, rotateY: 180 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-16 h-24 rounded-lg border-2 flex items-center justify-center text-sm font-bold ${
        isJoker 
          ? 'border-yellow-400 bg-gradient-to-br from-yellow-200 to-orange-300 text-black shadow-lg ring-2 ring-yellow-400'
          : 'border-white bg-white'
      } ${card.color === 'red' ? 'text-red-500' : 'text-black'}`}
    >
      <div className="text-center">
        <div className="text-xs">{card.value}</div>
        <div className="text-lg">{card.suit}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 flex items-center justify-between">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">Andar Bahar</h1>
          <div className="text-sm opacity-90">Balance: ₹{balance.toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs">Round</div>
          <div className="font-bold">{roundNumber}</div>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-black/30 p-3 text-center">
        <div className="flex items-center justify-center space-x-2">
          <Timer className="w-4 h-4" />
          <div className="font-bold">
            {gamePhase === 'betting' && `Betting: ${timeLeft}s`}
            {gamePhase === 'dealing' && 'Dealing Cards...'}
            {gamePhase === 'result' && 'Round Complete'}
          </div>
        </div>
      </div>

      {/* Game Layout */}
      <div className="p-4 space-y-4">
        {/* Joker Card */}
        <div className="text-center">
          <div className="text-sm font-bold mb-2 text-yellow-300">JOKER CARD</div>
          <div className="flex justify-center">
            {jokerCard ? (
              <CardComponent card={jokerCard} isJoker={true} />
            ) : (
              <div className="w-16 h-24 rounded-lg border-2 border-dashed border-yellow-400 flex items-center justify-center">
                <Crown className="w-8 h-8 text-yellow-400" />
              </div>
            )}
          </div>
          {jokerCard && (
            <div className="text-xs mt-2 text-yellow-300">
              Match this card to win!
            </div>
          )}
        </div>

        {/* Game Areas */}
        <div className="grid grid-cols-2 gap-4">
          {/* Andar Side */}
          <div className="bg-black/20 rounded-xl p-4">
            <div className="text-center mb-3">
              <h3 className="text-lg font-bold text-blue-400">ANDAR</h3>
              <div className="text-xs text-blue-300">1.9:1 Payout</div>
            </div>
            <div className="min-h-[120px]">
              <div className="grid grid-cols-2 gap-2">
                {andarCards.map((card, index) => (
                  <CardComponent key={index} card={card} />
                ))}
              </div>
            </div>
            <div className="text-center text-xs mt-2 text-gray-300">
              Cards: {andarCards.length}
            </div>
          </div>

          {/* Bahar Side */}
          <div className="bg-black/20 rounded-xl p-4">
            <div className="text-center mb-3">
              <h3 className="text-lg font-bold text-red-400">BAHAR</h3>
              <div className="text-xs text-red-300">2:1 Payout</div>
            </div>
            <div className="min-h-[120px]">
              <div className="grid grid-cols-2 gap-2">
                {baharCards.map((card, index) => (
                  <CardComponent key={index} card={card} />
                ))}
              </div>
            </div>
            <div className="text-center text-xs mt-2 text-gray-300">
              Cards: {baharCards.length}
            </div>
          </div>
        </div>

        {/* Winner Display */}
        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-bold text-lg">
                <Trophy className="w-5 h-5 mr-2" />
                {winner.toUpperCase()} WINS!
              </div>
              {winAmount > 0 && (
                <div className="text-green-400 font-bold text-xl mt-2">
                  You Won: ₹{winAmount.toFixed(2)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Betting Section */}
      <div className="p-4 space-y-4">
        {/* Bet Amount */}
        <div className="bg-black/30 rounded-xl p-4">
          <div className="text-sm mb-2">Bet Amount:</div>
          <div className="grid grid-cols-4 gap-2">
            {[100, 500, 1000, 5000].map(amount => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`py-2 rounded-lg font-bold text-sm ${
                  betAmount === amount 
                    ? 'bg-yellow-500 text-black' 
                    : 'bg-gray-700 text-white'
                }`}
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>

        {/* Betting Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => placeBet('andar')}
            disabled={gamePhase !== 'betting'}
            className={`p-4 rounded-xl font-bold transition-colors ${
              selectedBet === 'andar' 
                ? 'bg-blue-500 text-white ring-2 ring-yellow-400' 
                : 'bg-blue-600 hover:bg-blue-700'
            } disabled:opacity-50`}
          >
            <Target className="w-6 h-6 mx-auto mb-2" />
            BET ANDAR
            <div className="text-xs">1.9:1</div>
          </button>
          
          <button
            onClick={() => placeBet('bahar')}
            disabled={gamePhase !== 'betting'}
            className={`p-4 rounded-xl font-bold transition-colors ${
              selectedBet === 'bahar' 
                ? 'bg-red-500 text-white ring-2 ring-yellow-400' 
                : 'bg-red-600 hover:bg-red-700'
            } disabled:opacity-50`}
          >
            <Target className="w-6 h-6 mx-auto mb-2" />
            BET BAHAR
            <div className="text-xs">2:1</div>
          </button>
        </div>

        {/* Deal Button */}
        {selectedBet && gamePhase === 'betting' && timeLeft > 10 && (
          <Button
            onClick={dealCards}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-4"
          >
            <Zap className="w-5 h-5 mr-2" />
            DEAL CARDS
          </Button>
        )}

        {/* Game Rules */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-4 text-sm">
          <h3 className="font-bold mb-2">How to Play:</h3>
          <div className="space-y-1">
            <div>• Joker card is dealt first</div>
            <div>• Cards are dealt alternately to Andar & Bahar</div>
            <div>• First side to match joker value wins</div>
            <div>• Andar pays 1.9:1, Bahar pays 2:1</div>
          </div>
        </div>
      </div>
    </div>
  );
}