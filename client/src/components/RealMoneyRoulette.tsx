import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, DollarSign, Trophy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Props {
  onBack: () => void;
}

export default function RealMoneyRoulette({ onBack }: Props) {
  const [balance, setBalance] = useState(12580.45);
  const [betAmount, setBetAmount] = useState(100);
  const [selectedBets, setSelectedBets] = useState<{[key: string]: number}>({});
  const [isSpinning, setIsSpinning] = useState(false);
  const [gamePhase, setGamePhase] = useState<'betting' | 'spinning' | 'result'>('betting');
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalBet, setTotalBet] = useState(0);
  const [winAmount, setWinAmount] = useState(0);
  const { toast } = useToast();

  // Roulette numbers with colors
  const rouletteNumbers = [
    { num: 0, color: 'green' },
    { num: 32, color: 'red' }, { num: 15, color: 'black' }, { num: 19, color: 'red' },
    { num: 4, color: 'black' }, { num: 21, color: 'red' }, { num: 2, color: 'black' },
    { num: 25, color: 'red' }, { num: 17, color: 'black' }, { num: 34, color: 'red' },
    { num: 6, color: 'black' }, { num: 27, color: 'red' }, { num: 13, color: 'black' },
    { num: 36, color: 'red' }, { num: 11, color: 'black' }, { num: 30, color: 'red' },
    { num: 8, color: 'black' }, { num: 23, color: 'red' }, { num: 10, color: 'black' },
    { num: 5, color: 'red' }, { num: 24, color: 'black' }, { num: 16, color: 'red' },
    { num: 33, color: 'black' }, { num: 1, color: 'red' }, { num: 20, color: 'black' },
    { num: 14, color: 'red' }, { num: 31, color: 'black' }, { num: 9, color: 'red' },
    { num: 22, color: 'black' }, { num: 18, color: 'red' }, { num: 29, color: 'black' },
    { num: 7, color: 'red' }, { num: 28, color: 'black' }, { num: 12, color: 'red' },
    { num: 35, color: 'black' }, { num: 3, color: 'red' }, { num: 26, color: 'black' }
  ];

  // Timer countdown
  useEffect(() => {
    if (gamePhase === 'betting' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'betting') {
      startSpin();
    }
  }, [timeLeft, gamePhase]);

  const placeBet = (betType: string) => {
    if (betAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough funds to place this bet",
        variant: "destructive",
      });
      return;
    }

    setSelectedBets(prev => ({
      ...prev,
      [betType]: (prev[betType] || 0) + betAmount
    }));
    setTotalBet(prev => prev + betAmount);
    setBalance(prev => prev - betAmount);
    
    toast({
      title: "Bet Placed",
      description: `₹${betAmount} on ${betType}`,
    });
  };

  const startSpin = async () => {
    if (Object.keys(selectedBets).length === 0) {
      setTimeLeft(30);
      toast({
        title: "No Bets Placed",
        description: "Place at least one bet to spin",
        variant: "destructive",
      });
      return;
    }

    setGamePhase('spinning');
    setIsSpinning(true);

    try {
      const response = await apiRequest('POST', '/api/games/roulette/spin', {
        bets: selectedBets,
        totalAmount: totalBet
      });

      if (response.ok) {
        const result = await response.json();
        const winning = result.winningNumber;
        
        // Animate spin
        const spins = 5 + Math.random() * 3;
        const finalRotation = (spins * 360) + (winning * (360 / 37));
        setRotation(finalRotation);
        
        setTimeout(() => {
          setWinningNumber(winning);
          setGamePhase('result');
          setIsSpinning(false);
          
          if (result.winAmount > 0) {
            setWinAmount(result.winAmount);
            setBalance(prev => prev + result.winAmount);
            toast({
              title: "🎉 WIN!",
              description: `You won ₹${result.winAmount}!`,
            });
          } else {
            toast({
              title: "Better luck next time",
              description: "No winning bets this round",
              variant: "destructive",
            });
          }
          
          // Reset for next round
          setTimeout(() => {
            setGamePhase('betting');
            setSelectedBets({});
            setTotalBet(0);
            setWinAmount(0);
            setWinningNumber(null);
            setTimeLeft(30);
          }, 5000);
        }, 3000);
      }
    } catch (error) {
      toast({
        title: "Spin Failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      setGamePhase('betting');
      setIsSpinning(false);
    }
  };

  const getBetTypeColor = (betType: string) => {
    if (betType.includes('Red')) return 'bg-red-500';
    if (betType.includes('Black')) return 'bg-gray-800';
    if (betType.includes('Green')) return 'bg-green-500';
    return 'bg-blue-500';
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 flex items-center justify-between">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">European Roulette</h1>
          <div className="text-sm opacity-90">Balance: ₹{balance.toFixed(2)}</div>
        </div>
        <div className="w-6 h-6" />
      </div>

      {/* Timer and Game Status */}
      <div className="bg-black/30 p-4 text-center">
        <div className="flex items-center justify-center space-x-4">
          <Clock className="w-5 h-5" />
          <div className="text-lg font-bold">
            {gamePhase === 'betting' && `Betting: ${timeLeft}s`}
            {gamePhase === 'spinning' && 'Spinning...'}
            {gamePhase === 'result' && 'Round Complete'}
          </div>
        </div>
        {totalBet > 0 && (
          <div className="text-sm mt-2 text-yellow-300">
            Total Bet: ₹{totalBet.toFixed(2)}
          </div>
        )}
      </div>

      {/* Roulette Wheel */}
      <div className="p-6 flex justify-center">
        <div className="relative w-64 h-64 rounded-full border-8 border-yellow-500 bg-gradient-to-br from-green-800 to-green-900 overflow-hidden">
          <motion.div
            className="w-full h-full rounded-full relative"
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: "easeOut" }}
            style={{
              background: `conic-gradient(
                ${rouletteNumbers.map((num, i) => 
                  `${num.color === 'red' ? '#ef4444' : num.color === 'black' ? '#1f2937' : '#22c55e'} ${(i/37)*100}% ${((i+1)/37)*100}%`
                ).join(', ')}
              )`
            }}
          >
            {/* Numbers around the wheel */}
            {rouletteNumbers.map((num, index) => {
              const angle = (index / 37) * 360;
              return (
                <div
                  key={index}
                  className="absolute text-white text-xs font-bold"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-100px) rotate(-${angle}deg)`,
                  }}
                >
                  {num.num}
                </div>
              );
            })}
          </motion.div>
          
          {/* Ball indicator */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
        </div>
      </div>

      {/* Winning Number Display */}
      <AnimatePresence>
        {winningNumber !== null && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center bg-yellow-500 text-black px-6 py-3 rounded-full font-bold text-lg">
              <Trophy className="w-5 h-5 mr-2" />
              Winning: {winningNumber}
            </div>
            {winAmount > 0 && (
              <div className="text-green-400 font-bold text-xl mt-2">
                You Won: ₹{winAmount.toFixed(2)}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Betting Options */}
      <div className="p-4 space-y-4">
        {/* Bet Amount Selector */}
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

        {/* Quick Bet Options */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => placeBet('Red')}
            disabled={gamePhase !== 'betting'}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-50 p-4 rounded-xl font-bold transition-colors"
          >
            RED (2x)
            {selectedBets['Red'] && (
              <div className="text-sm">₹{selectedBets['Red']}</div>
            )}
          </button>
          
          <button
            onClick={() => placeBet('Black')}
            disabled={gamePhase !== 'betting'}
            className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 p-4 rounded-xl font-bold transition-colors"
          >
            BLACK (2x)
            {selectedBets['Black'] && (
              <div className="text-sm">₹{selectedBets['Black']}</div>
            )}
          </button>
          
          <button
            onClick={() => placeBet('Odd')}
            disabled={gamePhase !== 'betting'}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 p-4 rounded-xl font-bold transition-colors"
          >
            ODD (2x)
            {selectedBets['Odd'] && (
              <div className="text-sm">₹{selectedBets['Odd']}</div>
            )}
          </button>
          
          <button
            onClick={() => placeBet('Even')}
            disabled={gamePhase !== 'betting'}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-4 rounded-xl font-bold transition-colors"
          >
            EVEN (2x)
            {selectedBets['Even'] && (
              <div className="text-sm">₹{selectedBets['Even']}</div>
            )}
          </button>
          
          <button
            onClick={() => placeBet('1-18')}
            disabled={gamePhase !== 'betting'}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 p-3 rounded-xl font-bold text-sm transition-colors"
          >
            1-18 (2x)
            {selectedBets['1-18'] && (
              <div className="text-xs">₹{selectedBets['1-18']}</div>
            )}
          </button>
          
          <button
            onClick={() => placeBet('19-36')}
            disabled={gamePhase !== 'betting'}
            className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 p-3 rounded-xl font-bold text-sm transition-colors"
          >
            19-36 (2x)
            {selectedBets['19-36'] && (
              <div className="text-xs">₹{selectedBets['19-36']}</div>
            )}
          </button>
        </div>

        {/* Green Zero Bet */}
        <button
          onClick={() => placeBet('Zero')}
          disabled={gamePhase !== 'betting'}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 p-4 rounded-xl font-bold transition-colors"
        >
          ZERO (36x)
          {selectedBets['Zero'] && (
            <div className="text-sm">₹{selectedBets['Zero']}</div>
          )}
        </button>

        {/* Manual Spin Button (for testing) */}
        {gamePhase === 'betting' && timeLeft > 20 && (
          <Button
            onClick={startSpin}
            disabled={Object.keys(selectedBets).length === 0}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-4"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            SPIN NOW
          </Button>
        )}
      </div>
    </div>
  );
}