import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Crown, Timer, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onBack: () => void;
}

interface Bet {
  type: string;
  amount: number;
  odds: number;
}

export default function RealMoneySicBo({ onBack }: Props) {
  const [balance, setBalance] = useState(12580.45);
  const [betAmount, setBetAmount] = useState(100);
  const [bets, setBets] = useState<{ [key: string]: number }>({});
  const [gamePhase, setGamePhase] = useState<'betting' | 'rolling' | 'result'>('betting');
  const [dice, setDice] = useState<number[]>([1, 2, 3]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [roundNumber, setRoundNumber] = useState(1);
  const [totalWin, setTotalWin] = useState(0);
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    if (gamePhase === 'betting' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'betting') {
      rollDice();
    }
  }, [timeLeft, gamePhase]);

  const placeBet = (betType: string, odds: number) => {
    const totalBetAmount = Object.values(bets).reduce((sum, bet) => sum + bet, 0) + betAmount;
    
    if (totalBetAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough funds for this bet",
        variant: "destructive",
      });
      return;
    }

    setBets(prev => ({
      ...prev,
      [betType]: (prev[betType] || 0) + betAmount
    }));

    setBalance(prev => prev - betAmount);
    
    toast({
      title: "Bet Placed",
      description: `₹${betAmount} on ${betType}`,
    });
  };

  const rollDice = async () => {
    if (Object.keys(bets).length === 0) {
      setTimeLeft(30);
      toast({
        title: "No Bets Placed",
        description: "Place a bet to continue",
        variant: "destructive",
      });
      return;
    }

    setGamePhase('rolling');

    // Animate dice rolling
    for (let i = 0; i < 10; i++) {
      setDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Final dice result
    const finalDice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];
    
    setDice(finalDice);
    setGamePhase('result');
    
    // Calculate winnings
    let totalWinnings = 0;
    const total = finalDice.reduce((sum, die) => sum + die, 0);
    
    Object.entries(bets).forEach(([betType, betAmount]) => {
      let won = false;
      let payout = 0;
      
      switch (betType) {
        case 'small':
          if (total >= 4 && total <= 10 && !isTriple(finalDice)) {
            won = true;
            payout = betAmount * 2;
          }
          break;
        case 'big':
          if (total >= 11 && total <= 17 && !isTriple(finalDice)) {
            won = true;
            payout = betAmount * 2;
          }
          break;
        case 'odd':
          if (total % 2 === 1 && !isTriple(finalDice)) {
            won = true;
            payout = betAmount * 2;
          }
          break;
        case 'even':
          if (total % 2 === 0 && !isTriple(finalDice)) {
            won = true;
            payout = betAmount * 2;
          }
          break;
        default:
          // Number bets (4-17)
          if (betType.startsWith('total-')) {
            const targetTotal = parseInt(betType.split('-')[1]);
            if (total === targetTotal) {
              won = true;
              payout = betAmount * getTotalOdds(targetTotal);
            }
          }
          // Single number bets
          else if (betType.startsWith('single-')) {
            const targetNumber = parseInt(betType.split('-')[1]);
            const count = finalDice.filter(die => die === targetNumber).length;
            if (count > 0) {
              won = true;
              payout = betAmount * (count + 1);
            }
          }
          break;
      }
      
      if (won) {
        totalWinnings += payout;
      }
    });

    setTotalWin(totalWinnings);
    setBalance(prev => prev + totalWinnings);
    
    if (totalWinnings > 0) {
      toast({
        title: "🎉 WIN!",
        description: `You won ₹${totalWinnings.toFixed(2)}!`,
      });
    } else {
      toast({
        title: "Better luck next time",
        description: `Dice: ${finalDice.join(', ')} (Total: ${total})`,
        variant: "destructive",
      });
    }
    
    // Reset for next round
    setTimeout(() => {
      setGamePhase('betting');
      setBets({});
      setTotalWin(0);
      setTimeLeft(30);
      setRoundNumber(prev => prev + 1);
    }, 5000);
  };

  const isTriple = (dice: number[]) => {
    return dice[0] === dice[1] && dice[1] === dice[2];
  };

  const getTotalOdds = (total: number) => {
    const odds: { [key: number]: number } = {
      4: 60, 5: 30, 6: 17, 7: 12, 8: 8, 9: 6, 10: 6,
      11: 6, 12: 6, 13: 8, 14: 12, 15: 17, 16: 30, 17: 60
    };
    return odds[total] || 2;
  };

  const DiceIcon = ({ value }: { value: number }) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const Icon = icons[value - 1];
    return <Icon className="w-8 h-8" />;
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex items-center justify-between">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">Sic Bo</h1>
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
            {gamePhase === 'rolling' && 'Rolling Dice...'}
            {gamePhase === 'result' && 'Round Complete'}
          </div>
        </div>
      </div>

      {/* Dice Display */}
      <div className="p-4">
        <div className="bg-black/30 rounded-xl p-6 text-center mb-4">
          <div className="text-lg font-bold mb-4">Dice Result</div>
          <div className="flex justify-center space-x-4 mb-4">
            {dice.map((value, index) => (
              <motion.div
                key={index}
                animate={gamePhase === 'rolling' ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.2, repeat: gamePhase === 'rolling' ? Infinity : 0 }}
                className="w-16 h-16 bg-white text-black rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg"
              >
                <DiceIcon value={value} />
              </motion.div>
            ))}
          </div>
          <div className="text-xl font-bold">
            Total: {dice.reduce((sum, die) => sum + die, 0)}
          </div>
        </div>

        {/* Bet Amount Selection */}
        <div className="bg-black/30 rounded-xl p-4 mb-4">
          <div className="text-sm mb-2">Bet Amount:</div>
          <div className="grid grid-cols-4 gap-2">
            {[50, 100, 500, 1000].map(amount => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`py-2 rounded-lg font-bold text-sm ${
                  betAmount === amount 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-700 text-white'
                }`}
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>

        {/* Betting Options */}
        <div className="space-y-4">
          {/* Big/Small/Odd/Even */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => placeBet('small', 2)}
              disabled={gamePhase !== 'betting'}
              className="bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-bold disabled:opacity-50"
            >
              <div>SMALL</div>
              <div className="text-xs">4-10 (2:1)</div>
              {bets.small && <div className="text-yellow-300 text-xs">₹{bets.small}</div>}
            </button>
            
            <button
              onClick={() => placeBet('big', 2)}
              disabled={gamePhase !== 'betting'}
              className="bg-red-600 hover:bg-red-700 p-3 rounded-xl font-bold disabled:opacity-50"
            >
              <div>BIG</div>
              <div className="text-xs">11-17 (2:1)</div>
              {bets.big && <div className="text-yellow-300 text-xs">₹{bets.big}</div>}
            </button>
            
            <button
              onClick={() => placeBet('odd', 2)}
              disabled={gamePhase !== 'betting'}
              className="bg-green-600 hover:bg-green-700 p-3 rounded-xl font-bold disabled:opacity-50"
            >
              <div>ODD</div>
              <div className="text-xs">Odd Total (2:1)</div>
              {bets.odd && <div className="text-yellow-300 text-xs">₹{bets.odd}</div>}
            </button>
            
            <button
              onClick={() => placeBet('even', 2)}
              disabled={gamePhase !== 'betting'}
              className="bg-orange-600 hover:bg-orange-700 p-3 rounded-xl font-bold disabled:opacity-50"
            >
              <div>EVEN</div>
              <div className="text-xs">Even Total (2:1)</div>
              {bets.even && <div className="text-yellow-300 text-xs">₹{bets.even}</div>}
            </button>
          </div>

          {/* Single Number Bets */}
          <div className="bg-black/30 rounded-xl p-4">
            <div className="text-sm font-bold mb-3">Single Number Bets</div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map(number => (
                <button
                  key={number}
                  onClick={() => placeBet(`single-${number}`, 3)}
                  disabled={gamePhase !== 'betting'}
                  className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-bold disabled:opacity-50"
                >
                  <DiceIcon value={number} />
                  <div className="text-xs mt-1">1-3x</div>
                  {bets[`single-${number}`] && <div className="text-yellow-300 text-xs">₹{bets[`single-${number}`]}</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Total Bets */}
          <div className="bg-black/30 rounded-xl p-4">
            <div className="text-sm font-bold mb-3">Total Sum Bets (High Payouts)</div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(total => (
                <button
                  key={total}
                  onClick={() => placeBet(`total-${total}`, getTotalOdds(total))}
                  disabled={gamePhase !== 'betting'}
                  className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded font-bold disabled:opacity-50"
                >
                  <div>{total}</div>
                  <div className="text-xs">{getTotalOdds(total)}:1</div>
                  {bets[`total-${total}`] && <div className="text-yellow-300 text-xs">₹{bets[`total-${total}`]}</div>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Win Display */}
        <AnimatePresence>
          {totalWin > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-center mt-4"
            >
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-bold text-lg">
                <Crown className="w-5 h-5 mr-2" />
                Won: ₹{totalWin.toFixed(2)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Rules */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 mt-4 text-sm">
          <h3 className="font-bold mb-2">How to Play:</h3>
          <div className="space-y-1">
            <div>• Predict the outcome of three dice</div>
            <div>• Small (4-10) & Big (11-17) pay 2:1</div>
            <div>• Single numbers pay based on appearances</div>
            <div>• Total sum bets offer high payouts (up to 60:1)</div>
            <div>• Triples beat Small/Big bets</div>
          </div>
        </div>
      </div>
    </div>
  );
}