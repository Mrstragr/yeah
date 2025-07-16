import { useState } from 'react';
import { X } from 'lucide-react';
import { AnimatedWinGoGame } from './AnimatedWinGoGame';
import { SimpleWinGoGame } from './SimpleWinGoGame';
// Aviator imports removed
import { BasicGameModal } from './BasicGameModal';
import { AnimatedMinesGame } from './AnimatedMinesGame';
import { AnimatedDragonTigerGame } from './AnimatedDragonTigerGame';

interface ModernGameModalProps {
  gameType: string;
  onClose: () => void;
  refreshBalance: () => void;
}

export const ModernGameModal = ({ gameType, onClose, refreshBalance }: ModernGameModalProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGameResult = async (result: any) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please login first');
        setIsPlaying(false);
        return null;
      }
      
      // Validate bet amount before sending
      if (betAmount <= 0 || betAmount > 50000) {
        alert('Invalid bet amount');
        setIsPlaying(false);
        return null;
      }

      const response = await fetch(`/api/games/${gameType}/play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          betAmount,
          betType: result.betType || 'default',
          betValue: result.betValue,
          cashOutMultiplier: result.cashOutMultiplier,
          mineCount: result.mineCount,
          revealedTiles: result.revealedTiles,
          prediction: result.prediction,
          targetNumber: result.targetNumber,
          gameResult: result.gameResult || result
        })
      });

      if (response.ok) {
        const serverResult = await response.json();
        
        // Refresh balance after game
        refreshBalance();
        
        // Show enhanced result notification
        setTimeout(() => {
          if (serverResult.isWin) {
            // Create celebratory notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-lg shadow-2xl z-50 animate-bounce';
            notification.innerHTML = `
              <div class="text-center">
                <div class="text-2xl mb-2">🎉 BIG WIN! 🎉</div>
                <div class="text-xl font-bold">₹${serverResult.winAmount}</div>
                <div class="text-sm opacity-90">${serverResult.multiplier}x Multiplier</div>
              </div>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
              document.body.removeChild(notification);
            }, 5000);
          }
        }, 500);
        
        // Return server result for frontend to use
        return serverResult;
      } else {
        const errorData = await response.json();
        
        // Handle specific error types with better user feedback
        if (errorData.error === 'Insufficient balance') {
          alert('Insufficient balance! Please deposit more funds to continue playing.');
        } else if (errorData.error === 'Invalid bet amount') {
          alert('Invalid bet amount! Please enter a valid amount between ₹10 and ₹50,000.');
        } else {
          alert(errorData.error || 'Game failed. Please try again.');
        }
        return null;
      }
    } catch (error: any) {
      console.error('Game error:', error);
      alert('Game failed. Please try again.');
      return null;
    } finally {
      setIsPlaying(false);
    }
  };

  const startGame = () => {
    setIsPlaying(true);
  };

  const renderGame = () => {
    const commonProps = {
      betAmount,
      onGameResult: handleGameResult,
      isPlaying
    };

    switch (gameType) {
      case 'wingo':
        return <SimpleWinGoGame {...commonProps} />;
      case 'aviator':
        return (
          <div className="min-h-screen bg-gradient-to-br from-red-900 to-black p-4 text-white">
            <h2 className="text-4xl font-bold mb-4">✈️ AVIATOR</h2>
            <div className="text-center">Aviator game loading...</div>
          </div>
        );
      case 'mines':
        return <AnimatedMinesGame {...commonProps} />;
      case 'dragon-tiger':
        return <AnimatedDragonTigerGame {...commonProps} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 p-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">🎮 {gameType.toUpperCase()} 🎮</h2>
            <p className="text-white text-xl mb-8">Enhanced version coming soon!</p>
            <div className="bg-black/40 p-8 rounded-lg max-w-md mx-auto">
              <div className="mb-6">
                <label className="text-white block mb-2">Bet Amount:</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="w-full p-3 rounded-lg text-center text-xl font-bold"
                  min="10"
                  max="10000"
                />
              </div>
              <button
                onClick={startGame}
                disabled={isPlaying}
                className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 
                         text-white font-bold py-4 px-8 rounded-lg shadow-lg transform hover:scale-105 
                         transition-all duration-200 disabled:opacity-50"
              >
                {isPlaying ? 'Playing...' : `Play for ₹${betAmount}`}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full 
                 shadow-lg transform hover:scale-110 transition-all duration-200"
      >
        <X size={24} />
      </button>

      {/* Bet Amount Controls */}
      <div className="absolute top-4 left-4 z-60 bg-black/60 p-4 rounded-lg">
        <div className="text-white text-sm mb-2">Bet Amount</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBetAmount(Math.max(10, betAmount - 50))}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            -50
          </button>
          <span className="text-white font-bold text-lg min-w-[80px] text-center">₹{betAmount}</span>
          <button
            onClick={() => setBetAmount(betAmount + 50)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          >
            +50
          </button>
        </div>
        <div className="flex gap-1 mt-2">
          {[100, 500, 1000, 5000].map(amount => (
            <button
              key={amount}
              onClick={() => setBetAmount(amount)}
              className={`px-2 py-1 rounded text-xs font-bold transition-all
                ${betAmount === amount 
                  ? 'bg-yellow-500 text-black' 
                  : 'bg-gray-600 text-white hover:bg-gray-500'
                }`}
            >
              {amount}
            </button>
          ))}
        </div>
      </div>

      {/* Game Content */}
      {renderGame()}
    </div>
  );
};