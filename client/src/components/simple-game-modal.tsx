import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Minus, Plus, TrendingUp, Coins, Zap } from "lucide-react";

interface SimpleGameModalProps {
  game: {
    id: number;
    title: string;
    description: string;
    category: string;
    jackpot: string;
  };
  user: any;
  onClose: () => void;
}

export function SimpleGameModal({ game, user, onClose }: SimpleGameModalProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [winAnimation, setWinAnimation] = useState(false);
  const [coinFlips, setCoinFlips] = useState<string[]>([]);
  const [diceValues, setDiceValues] = useState<number[]>([]);
  const [multiplier, setMultiplier] = useState(1.0);
  const [showParticles, setShowParticles] = useState(false);

  const quickBets = [50, 100, 500, 1000, 5000];

  const getGameIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'aviator': return '✈️';
      case 'coin flip': return '🪙';
      case 'dice roll': return '🎲';
      case 'big small': return '🎯';
      case 'blackjack': return '🃏';
      case 'lucky numbers': return '🎫';
      case 'plinko': return '⚪';
      default: return '🎮';
    }
  };

  const playGame = async () => {
    if (!user || parseFloat(user.balance) < betAmount) {
      setResult("Insufficient balance!");
      return;
    }

    setIsPlaying(true);
    setResult(null);

    try {
      // Call the actual betting API
      const response = await fetch('/api/games/bet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          gameId: game.id,
          betAmount: betAmount
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.result === 'win' ? 
          `🎉 You won ₹${data.winAmount}!` : 
          `💔 You lost ₹${betAmount}`
        );
        setGameState(data);
      } else {
        setResult(data.message || "Game error occurred");
      }
    } catch (error) {
      setResult("Network error - please try again");
    }

    setIsPlaying(false);

    // Add visual effects for wins
    if (data.result === 'win') {
      setWinAnimation(true);
      setShowParticles(true);
      setTimeout(() => {
        setWinAnimation(false);
        setShowParticles(false);
      }, 3000);
    }
  };

  // Game-specific animation effects
  const playAnimatedGame = async () => {
    setIsPlaying(true);
    setResult(null);

    // Game-specific animations
    if (game.title.toLowerCase() === 'coin flip') {
      animateCoinFlip();
    } else if (game.title.toLowerCase() === 'dice roll') {
      animateDiceRoll();
    } else if (game.title.toLowerCase() === 'aviator') {
      animateAviator();
    } else if (game.title.toLowerCase() === 'plinko') {
      animatePlinko();
    }

    // Call actual game API after animation
    setTimeout(() => {
      playGame();
    }, 2000);
  };

  const animateCoinFlip = () => {
    const flips = ['heads', 'tails'];
    let flipCount = 0;
    const flipInterval = setInterval(() => {
      setCoinFlips([flips[Math.random() > 0.5 ? 1 : 0]]);
      flipCount++;
      if (flipCount > 6) {
        clearInterval(flipInterval);
      }
    }, 200);
  };

  const animateDiceRoll = () => {
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValues([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
      rollCount++;
      if (rollCount > 8) {
        clearInterval(rollInterval);
      }
    }, 150);
  };

  const animateAviator = () => {
    let currentMultiplier = 1.0;
    const aviatorInterval = setInterval(() => {
      currentMultiplier += 0.1;
      setMultiplier(currentMultiplier);
      if (currentMultiplier > 3.0) {
        clearInterval(aviatorInterval);
        setMultiplier(1.0);
      }
    }, 100);
  };

  const animatePlinko = () => {
    // Simulate ball dropping animation
    let position = 0;
    const plinkoInterval = setInterval(() => {
      position += 10;
      if (position > 100) {
        clearInterval(plinkoInterval);
      }
    }, 50);
  };

  useEffect(() => {
    if (winAnimation) {
      const timer = setTimeout(() => setWinAnimation(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [winAnimation]);

  // Alternative simplified game play function
  const playSimpleGame = async () => {
    if (!user || parseFloat(user.balance) < betAmount) {
      setResult("Insufficient balance!");
      return;
    }

    setIsPlaying(true);
    setResult(null);

    // Simulate game delay with animations
    await new Promise(resolve => setTimeout(resolve, 2000));

    let winAmount = 0;
    let gameResult = "";

    // Game-specific logic
    switch (game.title.toLowerCase()) {
      case 'aviator':
        const multiplier = Math.random() * 10 + 1;
        if (Math.random() > 0.4) {
          winAmount = Math.floor(betAmount * multiplier);
          gameResult = `Plane flew to ${multiplier.toFixed(2)}x! Won ₹${winAmount}`;
        } else {
          gameResult = "Plane crashed! Better luck next time.";
        }
        break;

      case 'coin flip':
        const userChoice = Math.random() > 0.5 ? 'heads' : 'tails';
        const coinResult = Math.random() > 0.5 ? 'heads' : 'tails';
        if (userChoice === coinResult) {
          winAmount = betAmount * 2;
          gameResult = `Coin landed ${coinResult}! Won ₹${winAmount}`;
        } else {
          gameResult = `Coin landed ${coinResult}. Better luck next time!`;
        }
        break;

      case 'dice roll':
        const diceResult = Math.floor(Math.random() * 6) + 1;
        const userGuess = Math.floor(Math.random() * 6) + 1;
        if (diceResult === userGuess) {
          winAmount = betAmount * 6;
          gameResult = `Rolled ${diceResult}! Perfect guess! Won ₹${winAmount}`;
        } else if (Math.abs(diceResult - userGuess) <= 1) {
          winAmount = betAmount * 2;
          gameResult = `Rolled ${diceResult}. Close guess! Won ₹${winAmount}`;
        } else {
          gameResult = `Rolled ${diceResult}. Try again!`;
        }
        break;

      case 'big small':
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const dice3 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2 + dice3;
        const isBig = total >= 11;
        const userBet = Math.random() > 0.5 ? 'big' : 'small';
        
        if ((isBig && userBet === 'big') || (!isBig && userBet === 'small')) {
          winAmount = betAmount * 2;
          gameResult = `Rolled ${dice1}+${dice2}+${dice3}=${total} (${isBig ? 'Big' : 'Small'})! Won ₹${winAmount}`;
        } else {
          gameResult = `Rolled ${dice1}+${dice2}+${dice3}=${total} (${isBig ? 'Big' : 'Small'}). Try again!`;
        }
        break;

      case 'blackjack':
        const playerCards = Math.floor(Math.random() * 21) + 1;
        const dealerCards = Math.floor(Math.random() * 21) + 1;
        if (playerCards === 21) {
          winAmount = betAmount * 3;
          gameResult = `Blackjack! You got 21! Won ₹${winAmount}`;
        } else if (playerCards > dealerCards && playerCards <= 21) {
          winAmount = betAmount * 2;
          gameResult = `You: ${playerCards}, Dealer: ${dealerCards}. You win! Won ₹${winAmount}`;
        } else {
          gameResult = `You: ${playerCards}, Dealer: ${dealerCards}. Dealer wins!`;
        }
        break;

      case 'lucky numbers':
        const luckyNumber = Math.floor(Math.random() * 80) + 1;
        const userNumbers = Array.from({length: 5}, () => Math.floor(Math.random() * 80) + 1);
        const matches = userNumbers.filter(num => Math.abs(num - luckyNumber) <= 5).length;
        
        if (matches >= 3) {
          winAmount = betAmount * (matches * 2);
          gameResult = `Lucky number: ${luckyNumber}. ${matches} matches! Won ₹${winAmount}`;
        } else {
          gameResult = `Lucky number: ${luckyNumber}. ${matches} matches. Try again!`;
        }
        break;

      case 'plinko':
        const plinkoMultipliers = [0.5, 1, 2, 5, 10, 5, 2, 1, 0.5];
        const slot = Math.floor(Math.random() * plinkoMultipliers.length);
        const multiplier2 = plinkoMultipliers[slot];
        winAmount = Math.floor(betAmount * multiplier2);
        gameResult = `Ball landed in ${multiplier2}x slot! ${winAmount > betAmount ? `Won ₹${winAmount}` : 'Try again!'}`;
        break;

      default:
        const randomWin = Math.random() > 0.5;
        if (randomWin) {
          winAmount = betAmount * 2;
          gameResult = `You won! Won ₹${winAmount}`;
        } else {
          gameResult = "Better luck next time!";
        }
    }

    setResult(gameResult);
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">{getGameIcon(game.title)}</span>
              {game.title}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Game Description */}
          <p className="text-gray-300 mb-6 text-sm leading-relaxed">
            {game.description}
          </p>

          {/* Jackpot Display */}
          <div className="bg-gradient-to-r from-yellow-600 to-amber-600 rounded-lg p-3 mb-6 text-center">
            <p className="text-yellow-100 text-sm">Current Jackpot</p>
            <p className="text-white text-xl font-bold">₹{parseFloat(game.jackpot).toLocaleString()}</p>
          </div>

          {/* Bet Amount */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-3">Bet Amount</label>
            <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3 mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBetAmount(Math.max(10, betAmount - 50))}
                className="text-gray-300 hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-white text-xl font-bold">₹{betAmount}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBetAmount(betAmount + 50)}
                className="text-gray-300 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Quick Bet Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {quickBets.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(amount)}
                  className={`text-xs ${betAmount === amount 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                  }`}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Game Result */}
          {result && (
            <div className={`p-4 rounded-lg mb-6 text-center ${
              result.includes('Won') 
                ? 'bg-green-900/50 border border-green-700 text-green-300' 
                : 'bg-red-900/50 border border-red-700 text-red-300'
            }`}>
              <p className="font-medium">{result}</p>
            </div>
          )}

          {/* Play Button */}
          <Button
            onClick={playGame}
            disabled={isPlaying || !user || parseFloat(user?.walletBalance || '0') < betAmount}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Playing...
              </div>
            ) : (
              `🎮 Play for ₹${betAmount}`
            )}
          </Button>

          {/* User Balance */}
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              Your Balance: <span className="text-white font-semibold">₹{parseFloat(user?.walletBalance || '0').toLocaleString()}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}