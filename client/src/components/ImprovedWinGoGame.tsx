import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, TrendingUp, Clock, Star } from 'lucide-react';

interface ImprovedWinGoGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const ImprovedWinGoGame = ({ onClose, refreshBalance }: ImprovedWinGoGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [gameResult, setGameResult] = useState<any>(null);
  const [lastResults, setLastResults] = useState<number[]>([]);
  const [winStreak, setWinStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const spinnerRef = useRef<HTMLDivElement>(null);

  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const colors = ['red', 'green', 'violet'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          triggerAutoSpin();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getNumberColor = (num: number): string => {
    if ([1, 3, 7, 9].includes(num)) return 'red';
    if ([2, 4, 6, 8].includes(num)) return 'green';
    if ([0, 5].includes(num)) return 'violet';
    return 'gray';
  };

  const getColorClass = (color: string): string => {
    switch (color) {
      case 'red': return 'bg-gradient-to-br from-red-500 to-red-700 text-white';
      case 'green': return 'bg-gradient-to-br from-green-500 to-green-700 text-white';
      case 'violet': return 'bg-gradient-to-br from-purple-500 to-purple-700 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const triggerAutoSpin = () => {
    if (!isSpinning) {
      const randomResult = Math.floor(Math.random() * 10);
      setLastResults(prev => [randomResult, ...prev.slice(0, 9)]);
      animateSpinner(randomResult);
    }
  };

  const animateSpinner = (finalResult: number) => {
    setIsSpinning(true);
    
    if (spinnerRef.current) {
      // Create spinning animation
      spinnerRef.current.style.animation = 'spin 3s ease-out';
      
      setTimeout(() => {
        setIsSpinning(false);
        if (spinnerRef.current) {
          spinnerRef.current.style.animation = '';
        }
      }, 3000);
    }
  };

  const playGame = async () => {
    if (!selectedNumber && !selectedColor) {
      alert('Please select a number or color to bet on');
      return;
    }

    setIsSpinning(true);
    setGameResult(null);

    try {
      const token = localStorage.getItem('authToken');
      const body: any = { betAmount };

      if (selectedNumber !== null) {
        body.betType = 'number';
        body.betValue = selectedNumber;
      } else if (selectedColor) {
        body.betType = 'color';
        body.betValue = selectedColor;
      }

      // Visual spinning effect
      animateSpinner(0);

      const response = await fetch('/api/games/wingo/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const result = await response.json();
        
        setTimeout(() => {
          setGameResult(result);
          setLastResults(prev => [result.result.number, ...prev.slice(0, 9)]);
          
          if (result.isWin) {
            setWinStreak(prev => prev + 1);
            triggerWinCelebration(result.winAmount);
            if (soundEnabled) playWinSound();
          } else {
            setWinStreak(0);
            if (soundEnabled) playLoseSound();
          }
          
          refreshBalance();
        }, 3000);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Game failed. Please try again.');
        setIsSpinning(false);
      }
    } catch (error) {
      alert('Game error. Please try again.');
      setIsSpinning(false);
    }
  };

  const triggerWinCelebration = (amount: number) => {
    setShowCelebration(true);
    
    // Create particle effects
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        createParticle();
      }, i * 50);
    }
    
    setTimeout(() => setShowCelebration(false), 4000);
  };

  const createParticle = () => {
    const particle = document.createElement('div');
    particle.className = 'win-particle';
    particle.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 10px;
      height: 10px;
      background: linear-gradient(45deg, #FFD700, #FFA500);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      animation: particle-explosion 3s ease-out forwards;
    `;
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 3000);
  };

  const playWinSound = () => {
    // Win sound effect simulation
    console.log('Playing win sound');
  };

  const playLoseSound = () => {
    // Lose sound effect simulation
    console.log('Playing lose sound');
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">Win Go</h2>
            {winStreak > 0 && (
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                {winStreak} WIN STREAK 🔥
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        {/* Game Timer */}
        <div className="text-center mb-6">
          <div className="text-white text-lg mb-2">Next Draw In</div>
          <div className="text-4xl font-bold text-yellow-400 mb-2">
            {countdown}s
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((30 - countdown) / 30) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Spinning Wheel */}
        <div className="text-center mb-6">
          <div className="relative">
            <div 
              ref={spinnerRef}
              className={`w-32 h-32 mx-auto rounded-full border-4 border-yellow-400 flex items-center justify-center text-4xl font-bold ${
                isSpinning ? 'animate-spin' : ''
              } ${gameResult ? getColorClass(getNumberColor(gameResult.result?.number || 0)) : 'bg-gray-800'}`}
            >
              {isSpinning ? '?' : (gameResult?.result?.number ?? '?')}
            </div>
            {isSpinning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-lg font-bold animate-pulse">
                  SPINNING...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Results */}
        <div className="mb-6">
          <h3 className="text-white text-lg mb-3 font-bold flex items-center gap-2">
            <TrendingUp size={20} />
            Recent Results
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {lastResults.map((result, index) => (
              <div
                key={index}
                className={`min-w-[40px] h-10 rounded-lg flex items-center justify-center font-bold ${getColorClass(getNumberColor(result))}`}
              >
                {result}
              </div>
            ))}
          </div>
        </div>

        {/* Bet Amount */}
        <div className="mb-6">
          <h3 className="text-white text-lg mb-3 font-bold">Bet Amount</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[100, 500, 1000].map(amount => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`py-3 rounded-lg font-bold transition-all ${
                  betAmount === amount
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                disabled={isSpinning}
              >
                ₹{amount}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg text-center text-xl font-bold"
            min="10"
            max="50000"
            disabled={isSpinning}
          />
        </div>

        {/* Number Selection */}
        <div className="mb-6">
          <h3 className="text-white text-lg mb-3 font-bold">Select Number (9x)</h3>
          <div className="grid grid-cols-5 gap-2">
            {numbers.map(num => (
              <button
                key={num}
                onClick={() => {
                  setSelectedNumber(num);
                  setSelectedColor(null);
                }}
                className={`h-14 rounded-xl font-bold text-lg transition-all transform ${
                  selectedNumber === num
                    ? 'scale-110 shadow-lg ring-2 ring-yellow-400'
                    : 'hover:scale-105'
                } ${getColorClass(getNumberColor(num))}`}
                disabled={isSpinning}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-6">
          <h3 className="text-white text-lg mb-3 font-bold">Select Color</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'red', multiplier: '2x' },
              { name: 'green', multiplier: '2x' },
              { name: 'violet', multiplier: '4.5x' }
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
                } ${getColorClass(color.name)}`}
                disabled={isSpinning}
              >
                {color.name.toUpperCase()} {color.multiplier}
              </button>
            ))}
          </div>
        </div>

        {/* Play Button */}
        <button
          onClick={playGame}
          disabled={isSpinning || (!selectedNumber && !selectedColor)}
          className={`w-full py-4 rounded-xl font-bold text-xl transition-all transform ${
            isSpinning || (!selectedNumber && !selectedColor)
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white hover:scale-105 shadow-lg'
          }`}
        >
          {isSpinning ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              SPINNING...
            </div>
          ) : (
            `PLAY FOR ₹${betAmount}`
          )}
        </button>

        {/* Game Result */}
        {gameResult && !isSpinning && (
          <div className={`mt-6 p-6 rounded-xl ${
            gameResult.isWin 
              ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500' 
              : 'bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500'
          }`}>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-3 ${
                gameResult.isWin ? 'text-green-400' : 'text-red-400'
              }`}>
                {gameResult.isWin ? '🎉 YOU WON!' : '💔 TRY AGAIN'}
              </div>
              <div className="text-white text-xl mb-2">
                Result: <span className={`font-bold ${getColorClass(getNumberColor(gameResult.result.number))}`}>
                  {gameResult.result.number}
                </span>
              </div>
              <div className="text-white text-lg">
                {gameResult.isWin ? `+₹${gameResult.winAmount}` : `-₹${betAmount}`}
              </div>
              {gameResult.multiplier && (
                <div className="text-gray-300 text-sm mt-1">
                  Multiplier: {gameResult.multiplier}x
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Win Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-4">🎉</div>
            <div className="text-4xl font-bold text-yellow-400 animate-pulse">
              MEGA WIN!
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes particle-explosion {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) translate(${Math.random() * 400 - 200}px, ${Math.random() * 400 - 200}px) scale(0);
              opacity: 0;
            }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(1080deg); }
          }
        `
      }} />
    </div>
  );
};