import { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, TrendingUp, Gift, Star } from 'lucide-react';
import { ImprovedWinGoGame } from './ImprovedWinGoGame';
import { ImprovedAviatorGame } from './ImprovedAviatorGame';
import { ImprovedMinesGame } from './ImprovedMinesGame';
import { ImprovedDragonTigerGame } from './ImprovedDragonTigerGame';

interface EnhancedGameInterfaceProps {
  gameType: string;
  onClose: () => void;
  refreshBalance: () => void;
}

export const EnhancedGameInterface = ({ gameType, onClose, refreshBalance }: EnhancedGameInterfaceProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [winStreak, setWinStreak] = useState(0);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [multiplierAnimation, setMultiplierAnimation] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Quick bet amounts
  const quickBets = [50, 100, 250, 500, 1000, 2500];
  
  // Game-specific state
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [aviatorMultiplier, setAviatorMultiplier] = useState(1.0);
  const [cashOutTarget, setCashOutTarget] = useState(2.0);

  useEffect(() => {
    // Load game history from localStorage
    const history = localStorage.getItem(`gameHistory_${gameType}`);
    if (history) {
      setGameHistory(JSON.parse(history));
    }
  }, [gameType]);

  const playSound = (type: 'win' | 'lose' | 'bet') => {
    if (!soundEnabled) return;
    // Sound effects would be implemented here
    console.log(`Playing ${type} sound`);
  };

  const showWinCelebration = (amount: number) => {
    setShowCelebration(true);
    setMultiplierAnimation(true);
    
    // Create floating particles effect
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'win-particle';
        particle.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          width: 10px;
          height: 10px;
          background: #FFD700;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          animation: particle-float 2s ease-out forwards;
        `;
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
      }, i * 100);
    }

    setTimeout(() => {
      setShowCelebration(false);
      setMultiplierAnimation(false);
    }, 3000);
  };

  const handleGamePlay = async () => {
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

      // Prepare game data
      let gameData: any = { betAmount };
      
      switch (gameType) {
        case 'wingo':
          if (selectedNumber !== null) {
            gameData.betType = 'number';
            gameData.betValue = selectedNumber;
          } else if (selectedColor) {
            gameData.betType = 'color';
            gameData.betValue = selectedColor;
          } else {
            alert('Please select a number or color');
            setIsPlaying(false);
            return;
          }
          break;
        case 'aviator':
          gameData.cashOutMultiplier = cashOutTarget;
          break;
        default:
          gameData.betType = 'default';
      }

      playSound('bet');

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
        
        // Update game history
        const newHistory = [result, ...gameHistory.slice(0, 9)];
        setGameHistory(newHistory);
        localStorage.setItem(`gameHistory_${gameType}`, JSON.stringify(newHistory));
        
        if (result.isWin) {
          playSound('win');
          setWinStreak(prev => prev + 1);
          setTotalWinnings(prev => prev + result.winAmount);
          showWinCelebration(result.winAmount);
          
          // Achievement notifications
          if (winStreak + 1 === 3) {
            setTimeout(() => alert('🔥 3 WIN STREAK! You are on fire!'), 1000);
          } else if (winStreak + 1 === 5) {
            setTimeout(() => alert('🚀 5 WIN STREAK! Legendary player!'), 1000);
          }
        } else {
          playSound('lose');
          setWinStreak(0);
        }
        
        refreshBalance();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Game failed. Please try again.');
      }
    } catch (error) {
      console.error('Game error:', error);
      alert('Game failed. Please try again.');
    } finally {
      setIsPlaying(false);
    }
  };

  const renderWinGoInterface = () => (
    <div className="space-y-6">
      {/* Number Selection */}
      <div>
        <h3 className="text-white text-lg mb-3 font-bold">Numbers (9x payout)</h3>
        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => {
                setSelectedNumber(num);
                setSelectedColor(null);
              }}
              className={`h-14 rounded-xl font-bold text-lg transition-all transform ${
                selectedNumber === num
                  ? 'bg-yellow-500 text-black scale-110 shadow-lg shadow-yellow-500/50'
                  : 'bg-gradient-to-br from-purple-600 to-purple-800 text-white hover:scale-105'
              }`}
              disabled={isPlaying}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <h3 className="text-white text-lg mb-3 font-bold">Colors (2x/4.5x payout)</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'red', bg: 'from-red-500 to-red-700', multiplier: '2x' },
            { name: 'green', bg: 'from-green-500 to-green-700', multiplier: '2x' },
            { name: 'violet', bg: 'from-purple-500 to-purple-700', multiplier: '4.5x' }
          ].map(color => (
            <button
              key={color.name}
              onClick={() => {
                setSelectedColor(color.name);
                setSelectedNumber(null);
              }}
              className={`h-14 rounded-xl font-bold text-lg transition-all transform ${
                selectedColor === color.name
                  ? 'scale-110 shadow-lg ring-2 ring-yellow-400'
                  : 'hover:scale-105'
              } bg-gradient-to-br ${color.bg} text-white`}
              disabled={isPlaying}
            >
              {color.name.toUpperCase()} {color.multiplier}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAviatorInterface = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl p-6">
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-yellow-400">
            {aviatorMultiplier.toFixed(2)}x
          </div>
          <div className="text-gray-300">Current Multiplier</div>
        </div>
        
        <div className="mb-4">
          <label className="text-white block mb-2">Auto Cash Out At:</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1.01"
              max="100"
              step="0.01"
              value={cashOutTarget}
              onChange={(e) => setCashOutTarget(parseFloat(e.target.value) || 2.0)}
              className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-lg"
              disabled={isPlaying}
            />
            <span className="text-white">x</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDefaultInterface = () => (
    <div className="text-center py-8">
      <div className="text-6xl mb-4">🎮</div>
      <h3 className="text-2xl font-bold text-white mb-2">
        {gameType.charAt(0).toUpperCase() + gameType.slice(1)}
      </h3>
      <p className="text-gray-400">Quick play mode available</p>
    </div>
  );

  // Use improved game components for specific games
  if (gameType === 'wingo') {
    return <ImprovedWinGoGame onClose={onClose} refreshBalance={refreshBalance} />;
  }
  
  if (gameType === 'aviator') {
    return <ImprovedAviatorGame onClose={onClose} refreshBalance={refreshBalance} />;
  }
  
  if (gameType === 'mines') {
    return <ImprovedMinesGame onClose={onClose} refreshBalance={refreshBalance} />;
  }
  
  if (gameType === 'dragon-tiger') {
    return <ImprovedDragonTigerGame onClose={onClose} refreshBalance={refreshBalance} />;
  }

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">
              {gameType.charAt(0).toUpperCase() + gameType.slice(1)}
            </h2>
            {winStreak > 0 && (
              <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                {winStreak} WIN STREAK 🔥
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-3 rounded-lg text-center">
            <div className="text-green-100 text-sm">Win Streak</div>
            <div className="text-white font-bold text-lg">{winStreak}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-3 rounded-lg text-center">
            <div className="text-blue-100 text-sm">Games Played</div>
            <div className="text-white font-bold text-lg">{gameHistory.length}</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-3 rounded-lg text-center">
            <div className="text-yellow-100 text-sm">Total Won</div>
            <div className="text-white font-bold text-lg">₹{totalWinnings}</div>
          </div>
        </div>

        {/* Quick Bet Selection */}
        <div className="mb-6">
          <h3 className="text-white text-lg mb-3 font-bold">Quick Bet</h3>
          <div className="grid grid-cols-3 gap-2">
            {quickBets.map(amount => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`py-3 rounded-lg font-bold transition-all ${
                  betAmount === amount
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                disabled={isPlaying}
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Bet Amount */}
        <div className="mb-6">
          <h3 className="text-white text-lg mb-3 font-bold">Custom Amount</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBetAmount(Math.max(10, betAmount - 50))}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold"
              disabled={isPlaying}
            >
              -50
            </button>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg text-center text-xl font-bold"
              min="10"
              max="50000"
              disabled={isPlaying}
            />
            <button
              onClick={() => setBetAmount(Math.min(50000, betAmount + 50))}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold"
              disabled={isPlaying}
            >
              +50
            </button>
          </div>
        </div>

        {/* Game Interface */}
        <div className="mb-6">
          {gameType === 'wingo' && renderWinGoInterface()}
          {gameType === 'aviator' && renderAviatorInterface()}
          {!['wingo', 'aviator'].includes(gameType) && renderDefaultInterface()}
        </div>

        {/* Play Button */}
        <button
          onClick={handleGamePlay}
          disabled={isPlaying}
          className={`w-full py-4 rounded-xl font-bold text-xl transition-all transform ${
            isPlaying
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white hover:scale-105 shadow-lg'
          }`}
        >
          {isPlaying ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Playing...
            </div>
          ) : (
            `PLAY FOR ₹${betAmount}`
          )}
        </button>

        {/* Game Result */}
        {gameResult && (
          <div className={`mt-6 p-4 rounded-xl ${
            gameResult.isWin 
              ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500' 
              : 'bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500'
          }`}>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${
                gameResult.isWin ? 'text-green-400' : 'text-red-400'
              }`}>
                {gameResult.isWin ? '🎉 YOU WON!' : '💔 YOU LOST'}
              </div>
              <div className="text-white text-lg mb-2">
                {gameResult.isWin ? `+₹${gameResult.winAmount}` : `-₹${betAmount}`}
              </div>
              {gameResult.multiplier && (
                <div className="text-gray-300 text-sm">
                  Multiplier: {gameResult.multiplier}x
                </div>
              )}
            </div>
          </div>
        )}

        {/* Game History */}
        {gameHistory.length > 0 && (
          <div className="mt-6">
            <h3 className="text-white text-lg mb-3 font-bold">Recent Results</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {gameHistory.slice(0, 10).map((result, index) => (
                <div
                  key={index}
                  className={`min-w-[60px] h-12 rounded-lg flex items-center justify-center text-sm font-bold ${
                    result.isWin 
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {result.isWin ? 'W' : 'L'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Win Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl animate-bounce">🎉</div>
            <div className="text-4xl font-bold text-yellow-400 animate-pulse">
              BIG WIN!
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes particle-float {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0);
              opacity: 0;
            }
          }
        `
      }} />
    </div>
  );
};