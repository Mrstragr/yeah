import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Crown, Zap, Trophy, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Props {
  onBack: () => void;
}

interface Card {
  suit: string;
  value: string;
  points: number;
}

export default function RealMoneyBaccarat({ onBack }: Props) {
  const [balance, setBalance] = useState(12580.45);
  const [betAmount, setBetAmount] = useState(100);
  const [selectedBet, setSelectedBet] = useState<'player' | 'banker' | 'tie' | null>(null);
  const [gamePhase, setGamePhase] = useState<'betting' | 'dealing' | 'result'>('betting');
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [bankerCards, setBankerCards] = useState<Card[]>([]);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [bankerTotal, setBankerTotal] = useState(0);
  const [winner, setWinner] = useState<'player' | 'banker' | 'tie' | null>(null);
  const [timeLeft, setTimeLeft] = useState(25);
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

  const getCardPoints = (value: string): number => {
    if (['J', 'Q', 'K'].includes(value)) return 0;
    if (value === 'A') return 1;
    return parseInt(value);
  };

  const createRandomCard = (): Card => {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const value = values[Math.floor(Math.random() * values.length)];
    return {
      suit: suits[Math.floor(Math.random() * suits.length)],
      value,
      points: getCardPoints(value)
    };
  };

  const calculateTotal = (cards: Card[]): number => {
    const total = cards.reduce((sum, card) => sum + card.points, 0);
    return total % 10;
  };

  const placeBet = (betType: 'player' | 'banker' | 'tie') => {
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
      setTimeLeft(25);
      toast({
        title: "No Bet Placed",
        description: "Place a bet to continue",
        variant: "destructive",
      });
      return;
    }

    setGamePhase('dealing');

    try {
      const response = await apiRequest('POST', '/api/games/baccarat/deal', {
        bet: selectedBet,
        amount: betAmount
      });

      if (response.ok) {
        const result = await response.json();
        
        // Animate card dealing
        const pCards = [createRandomCard(), createRandomCard()];
        const bCards = [createRandomCard(), createRandomCard()];
        
        setPlayerCards([pCards[0]]);
        setTimeout(() => setBankerCards([bCards[0]]), 500);
        setTimeout(() => setPlayerCards(pCards), 1000);
        setTimeout(() => setBankerCards(bCards), 1500);
        
        const pTotal = calculateTotal(pCards);
        const bTotal = calculateTotal(bCards);
        
        setTimeout(() => {
          setPlayerTotal(pTotal);
          setBankerTotal(bTotal);
          
          // Determine winner
          let gameWinner: 'player' | 'banker' | 'tie';
          if (pTotal > bTotal) gameWinner = 'player';
          else if (bTotal > pTotal) gameWinner = 'banker';
          else gameWinner = 'tie';
          
          setWinner(gameWinner);
          setGamePhase('result');
          
          // Calculate winnings
          let payout = 0;
          if (selectedBet === gameWinner) {
            if (selectedBet === 'player') payout = betAmount * 2;
            else if (selectedBet === 'banker') payout = betAmount * 1.95; // 5% commission
            else if (selectedBet === 'tie') payout = betAmount * 9;
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
            setPlayerCards([]);
            setBankerCards([]);
            setPlayerTotal(0);
            setBankerTotal(0);
            setWinner(null);
            setWinAmount(0);
            setTimeLeft(25);
            setRoundNumber(prev => prev + 1);
          }, 4000);
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Deal Failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      setGamePhase('betting');
    }
  };

  const CardComponent = ({ card, isRevealed }: { card: Card; isRevealed: boolean }) => (
    <motion.div
      initial={{ rotateY: 180, scale: 0 }}
      animate={{ rotateY: isRevealed ? 0 : 180, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`w-16 h-24 rounded-lg border-2 border-white flex items-center justify-center text-lg font-bold ${
        isRevealed 
          ? `bg-white ${['♥', '♦'].includes(card.suit) ? 'text-red-500' : 'text-black'}`
          : 'bg-blue-800 text-white'
      }`}
    >
      {isRevealed ? (
        <div className="text-center">
          <div className="text-sm">{card.value}</div>
          <div className="text-lg">{card.suit}</div>
        </div>
      ) : (
        <div className="text-center">
          <Crown className="w-6 h-6 mx-auto" />
          <div className="text-xs">91</div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 flex items-center justify-between">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">Baccarat</h1>
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

      {/* Game Table */}
      <div className="p-4 space-y-6">
        {/* Banker Area */}
        <div className="bg-black/20 rounded-xl p-4">
          <div className="text-center mb-3">
            <h3 className="text-lg font-bold text-yellow-400">BANKER</h3>
            {bankerTotal > 0 && (
              <div className="text-2xl font-bold text-white">{bankerTotal}</div>
            )}
          </div>
          <div className="flex justify-center space-x-2">
            {bankerCards.map((card, index) => (
              <CardComponent key={index} card={card} isRevealed={gamePhase !== 'betting'} />
            ))}
          </div>
        </div>

        {/* VS Indicator */}
        <div className="text-center">
          <div className="inline-flex items-center bg-yellow-500 text-black px-4 py-2 rounded-full font-bold">
            <Zap className="w-4 h-4 mr-1" />
            VS
            <Zap className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* Player Area */}
        <div className="bg-black/20 rounded-xl p-4">
          <div className="text-center mb-3">
            <h3 className="text-lg font-bold text-blue-400">PLAYER</h3>
            {playerTotal > 0 && (
              <div className="text-2xl font-bold text-white">{playerTotal}</div>
            )}
          </div>
          <div className="flex justify-center space-x-2">
            {playerCards.map((card, index) => (
              <CardComponent key={index} card={card} isRevealed={gamePhase !== 'betting'} />
            ))}
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

      {/* Betting Options */}
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
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => placeBet('player')}
            disabled={gamePhase !== 'betting'}
            className={`p-4 rounded-xl font-bold transition-colors ${
              selectedBet === 'player' 
                ? 'bg-blue-500 text-white ring-2 ring-yellow-400' 
                : 'bg-blue-600 hover:bg-blue-700'
            } disabled:opacity-50`}
          >
            PLAYER
            <div className="text-xs">2:1</div>
          </button>
          
          <button
            onClick={() => placeBet('tie')}
            disabled={gamePhase !== 'betting'}
            className={`p-4 rounded-xl font-bold transition-colors ${
              selectedBet === 'tie' 
                ? 'bg-purple-500 text-white ring-2 ring-yellow-400' 
                : 'bg-purple-600 hover:bg-purple-700'
            } disabled:opacity-50`}
          >
            TIE
            <div className="text-xs">9:1</div>
          </button>
          
          <button
            onClick={() => placeBet('banker')}
            disabled={gamePhase !== 'betting'}
            className={`p-4 rounded-xl font-bold transition-colors ${
              selectedBet === 'banker' 
                ? 'bg-red-500 text-white ring-2 ring-yellow-400' 
                : 'bg-red-600 hover:bg-red-700'
            } disabled:opacity-50`}
          >
            BANKER
            <div className="text-xs">1.95:1</div>
          </button>
        </div>

        {/* Deal Button */}
        {selectedBet && gamePhase === 'betting' && timeLeft > 15 && (
          <Button
            onClick={dealCards}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-4"
          >
            DEAL CARDS
          </Button>
        )}
      </div>
    </div>
  );
}