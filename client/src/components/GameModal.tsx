import { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';

interface GameModalProps {
  game: {
    id: string;
    name: string;
    type: 'lottery' | 'mini' | 'recommended' | 'slot';
  };
  isOpen: boolean;
  onClose: () => void;
}

export function GameModal({ game, isOpen, onClose }: GameModalProps) {
  const [balance, setBalance] = useState(0.39);
  const [betAmount, setBetAmount] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [gameHistory, setGameHistory] = useState<Array<{id: string, result: string, amount: number, win: boolean}>>([]);

  // WIN GO Game Logic
  const playWinGo = () => {
    setIsPlaying(true);
    setResult(null);
    
    setTimeout(() => {
      const randomResult = Math.floor(Math.random() * 10);
      const isWin = Math.random() > 0.6; // 40% win rate
      const winAmount = isWin ? betAmount * 2 : 0;
      
      setResult(randomResult.toString());
      setBalance(prev => prev - betAmount + winAmount);
      setGameHistory(prev => [{
        id: Date.now().toString(),
        result: randomResult.toString(),
        amount: betAmount,
        win: isWin
      }, ...prev.slice(0, 9)]);
      setIsPlaying(false);
    }, 3000);
  };

  // K3 Lottery Game Logic
  const playK3 = () => {
    setIsPlaying(true);
    setResult(null);
    
    setTimeout(() => {
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      const dice3 = Math.floor(Math.random() * 6) + 1;
      const total = dice1 + dice2 + dice3;
      const isWin = Math.random() > 0.65; // 35% win rate
      const winAmount = isWin ? betAmount * 3 : 0;
      
      setResult(`${dice1}-${dice2}-${dice3} (${total})`);
      setBalance(prev => prev - betAmount + winAmount);
      setGameHistory(prev => [{
        id: Date.now().toString(),
        result: `${dice1}-${dice2}-${dice3}`,
        amount: betAmount,
        win: isWin
      }, ...prev.slice(0, 9)]);
      setIsPlaying(false);
    }, 4000);
  };

  // Aviator Game Logic
  const playAviator = () => {
    setIsPlaying(true);
    setResult(null);
    
    setTimeout(() => {
      const multiplier = (Math.random() * 10 + 1).toFixed(2);
      const isWin = Math.random() > 0.7; // 30% win rate
      const winAmount = isWin ? betAmount * parseFloat(multiplier) : 0;
      
      setResult(`${multiplier}x`);
      setBalance(prev => prev - betAmount + winAmount);
      setGameHistory(prev => [{
        id: Date.now().toString(),
        result: `${multiplier}x`,
        amount: betAmount,
        win: isWin
      }, ...prev.slice(0, 9)]);
      setIsPlaying(false);
    }, 5000);
  };

  // Mines Game Logic
  const playMines = () => {
    setIsPlaying(true);
    setResult(null);
    
    setTimeout(() => {
      const mines = Math.floor(Math.random() * 5) + 1;
      const safe = Math.floor(Math.random() * 20) + 1;
      const isWin = safe > mines;
      const winAmount = isWin ? betAmount * (25 - mines) / 5 : 0;
      
      setResult(isWin ? `Safe (${safe})` : `Mine (${mines})`);
      setBalance(prev => prev - betAmount + winAmount);
      setGameHistory(prev => [{
        id: Date.now().toString(),
        result: isWin ? `Safe ${safe}` : `Mine ${mines}`,
        amount: betAmount,
        win: isWin
      }, ...prev.slice(0, 9)]);
      setIsPlaying(false);
    }, 2000);
  };

  // Dice Game Logic
  const playDice = () => {
    setIsPlaying(true);
    setResult(null);
    
    setTimeout(() => {
      const dice = Math.floor(Math.random() * 6) + 1;
      const isWin = dice >= 4; // Win on 4, 5, or 6
      const winAmount = isWin ? betAmount * 1.8 : 0;
      
      setResult(dice.toString());
      setBalance(prev => prev - betAmount + winAmount);
      setGameHistory(prev => [{
        id: Date.now().toString(),
        result: dice.toString(),
        amount: betAmount,
        win: isWin
      }, ...prev.slice(0, 9)]);
      setIsPlaying(false);
    }, 1500);
  };

  const playGame = () => {
    if (balance < betAmount) {
      alert('Insufficient balance!');
      return;
    }

    switch (game.id) {
      case 'wingo':
        playWinGo();
        break;
      case 'k3':
        playK3();
        break;
      case 'aviator':
        playAviator();
        break;
      case 'mines':
        playMines();
        break;
      case 'dice':
        playDice();
        break;
      default:
        // Default game logic
        setIsPlaying(true);
        setTimeout(() => {
          const isWin = Math.random() > 0.5;
          const winAmount = isWin ? betAmount * 2 : 0;
          setResult(isWin ? 'WIN' : 'LOSE');
          setBalance(prev => prev - betAmount + winAmount);
          setIsPlaying(false);
        }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-t-2xl text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{game.name}</h2>
            <button onClick={onClose} className="p-1">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-2 text-sm opacity-90">
            Balance: ₹{balance.toFixed(2)}
          </div>
        </div>

        {/* Game Content */}
        <div className="p-4">
          {/* Bet Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bet Amount
            </label>
            <div className="flex gap-2">
              {[1, 5, 10, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    betAmount === amount
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
          </div>

          {/* Game Display */}
          <div className="bg-gray-50 rounded-xl p-6 mb-4 text-center">
            {isPlaying ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mb-4"></div>
                <div className="text-lg font-semibold text-gray-700">Playing...</div>
              </div>
            ) : result ? (
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-red-500 mb-2">{result}</div>
                <div className={`text-lg font-semibold ${
                  gameHistory[0]?.win ? 'text-green-600' : 'text-red-600'
                }`}>
                  {gameHistory[0]?.win ? 'YOU WIN!' : 'YOU LOSE'}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                <div className="text-lg font-semibold mb-2">Ready to Play</div>
                <div className="text-sm">Click play to start the game</div>
              </div>
            )}
          </div>

          {/* Play Button */}
          <button
            onClick={playGame}
            disabled={isPlaying || balance < betAmount}
            className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all ${
              isPlaying || balance < betAmount
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 active:scale-95'
            }`}
          >
            {isPlaying ? 'Playing...' : `Play (₹${betAmount})`}
          </button>

          {/* Game History */}
          {gameHistory.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Results</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {gameHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{item.result}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">₹{item.amount}</span>
                      <span className={`text-sm font-semibold ${
                        item.win ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.win ? '+' : '-'}₹{item.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Game Rules */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-2">How to Play</h4>
            <div className="text-sm text-blue-700">
              {game.id === 'wingo' && "Predict the number (0-9). Win 2x your bet!"}
              {game.id === 'k3' && "Three dice roll. Predict the outcome. Win 3x your bet!"}
              {game.id === 'aviator' && "Cash out before the plane crashes. Multiplier increases!"}
              {game.id === 'mines' && "Avoid the mines and find safe spots. Higher risk, higher reward!"}
              {game.id === 'dice' && "Roll 4, 5, or 6 to win. Win 1.8x your bet!"}
              {!['wingo', 'k3', 'aviator', 'mines', 'dice'].includes(game.id) && "Place your bet and see if luck is on your side!"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}