import { useState } from 'react';
import { X } from 'lucide-react';

interface BasicGameModalProps {
  gameType: string;
  onClose: () => void;
  refreshBalance: () => void;
}

export const BasicGameModal = ({ gameType, onClose, refreshBalance }: BasicGameModalProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);

  const handlePlay = async () => {
    setIsPlaying(true);
    setGameResult(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please login first');
        setIsPlaying(false);
        return;
      }

      if (betAmount <= 0 || betAmount > 50000) {
        alert('Invalid bet amount');
        setIsPlaying(false);
        return;
      }

      // Prepare game data based on game type
      let gameData: any = { betAmount };
      
      switch (gameType) {
        case 'wingo':
          gameData.betType = 'number';
          gameData.betValue = Math.floor(Math.random() * 10);
          break;
        case 'aviator':
          gameData.cashOutMultiplier = 2.0;
          break;
        case 'mines':
          gameData.mineCount = 3;
          gameData.revealedTiles = [1, 5, 8];
          break;
        case 'dice':
          gameData.prediction = 'over';
          gameData.targetNumber = 50;
          break;
        case 'dragon-tiger':
          gameData.betType = 'dragon';
          break;
        default:
          gameData.betType = 'default';
      }

      const response = await fetch(`/api/games/${gameType}/play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(gameData)
      });

      if (response.ok) {
        const result = await response.json();
        setGameResult(result);
        refreshBalance();
        
        if (result.isWin) {
          setTimeout(() => {
            alert(`🎉 You Won ₹${result.winAmount}! (${result.multiplier}x)`);
          }, 500);
        }
      } else {
        const errorData = await response.json();
        if (errorData.error === 'Insufficient balance') {
          alert('Insufficient balance! Please deposit more funds.');
        } else {
          alert(errorData.error || 'Game failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Game error:', error);
      alert('Game failed. Please try again.');
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg p-6 w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            {gameType.charAt(0).toUpperCase() + gameType.slice(1)}
          </h2>
          <div className="text-gray-400">Quick Play Mode</div>
        </div>

        {/* Bet Amount */}
        <div className="mb-6">
          <label className="text-white block mb-2">Bet Amount:</label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full p-3 rounded-lg text-center text-xl font-bold bg-gray-800 text-white"
            min="10"
            max="50000"
            disabled={isPlaying}
          />
        </div>

        {/* Game Result */}
        {gameResult && (
          <div className={`mb-6 p-4 rounded-lg text-center ${
            gameResult.isWin ? 'bg-green-600/20 border border-green-500' : 'bg-red-600/20 border border-red-500'
          }`}>
            <div className={`text-lg font-bold ${gameResult.isWin ? 'text-green-400' : 'text-red-400'}`}>
              {gameResult.isWin ? '🎉 WIN!' : '😔 LOSE'}
            </div>
            <div className="text-white text-sm mt-1">
              {gameResult.isWin ? `Won ₹${gameResult.winAmount}` : `Lost ₹${betAmount}`}
            </div>
            {gameResult.multiplier && (
              <div className="text-gray-300 text-xs">
                Multiplier: {gameResult.multiplier}x
              </div>
            )}
          </div>
        )}

        {/* Play Button */}
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className={`w-full py-4 rounded-lg font-bold text-xl transition-all ${
            isPlaying
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 shadow-lg'
          }`}
        >
          {isPlaying ? 'Playing...' : `Play ${gameType.toUpperCase()}`}
        </button>

        {/* Game Info */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          {gameType === 'wingo' && 'Number guessing game with 9x multiplier'}
          {gameType === 'aviator' && 'Cash out before the plane crashes'}
          {gameType === 'mines' && 'Avoid the mines and collect gems'}
          {gameType === 'dice' && 'Predict if dice roll is over/under'}
          {gameType === 'dragon-tiger' && 'Bet on Dragon vs Tiger cards'}
        </div>
      </div>
    </div>
  );
};