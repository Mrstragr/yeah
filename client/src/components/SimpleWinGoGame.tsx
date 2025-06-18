import { useState, useEffect } from 'react';

interface SimpleWinGoGameProps {
  betAmount: number;
  onGameResult: (result: any) => void;
  isPlaying: boolean;
}

export const SimpleWinGoGame = ({ betAmount, onGameResult, isPlaying }: SimpleWinGoGameProps) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [countdown, setCountdown] = useState(30);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<{ number: number; color: string } | null>(null);

  const numbers = Array.from({ length: 10 }, (_, i) => i);
  const colors = ['red', 'green', 'violet'];

  const getNumberColor = (num: number) => {
    if (num === 0) return 'red-violet';
    if (num === 5) return 'green-violet';
    if ([1, 3, 7, 9].includes(num)) return 'green';
    if ([2, 4, 6, 8].includes(num)) return 'red';
    return 'red';
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'red': return 'bg-gradient-to-br from-red-500 to-red-700 text-white';
      case 'green': return 'bg-gradient-to-br from-green-500 to-green-700 text-white';
      case 'violet': return 'bg-gradient-to-br from-purple-500 to-purple-700 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  useEffect(() => {
    if (countdown > 0 && !isSpinning) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isSpinning) {
      setCountdown(30);
    }
  }, [countdown, isSpinning]);

  const playGame = async () => {
    if (!selectedNumber && !selectedColor) {
      alert('Please select a number or color to bet on');
      return;
    }

    setIsSpinning(true);
    setCountdown(0);

    const gameData = {
      betType: selectedNumber !== null ? 'number' : 'color',
      betValue: selectedNumber !== null ? selectedNumber : selectedColor
    };

    // Call the game result handler and handle response
    const resultPromise = onGameResult(gameData);
    
    // Show spinning animation
    setTimeout(async () => {
      try {
        const result = await resultPromise;
        
        if (result && result.result && typeof result.result.number === 'number') {
          const serverNumber = result.result.number;
          const resultColor = getNumberColor(serverNumber);
          setLastResult({ number: serverNumber, color: resultColor });
        } else {
          // Fallback to random result if server response is invalid
          const fallbackNumber = Math.floor(Math.random() * 10);
          const resultColor = getNumberColor(fallbackNumber);
          setLastResult({ number: fallbackNumber, color: resultColor });
        }
      } catch (error) {
        console.error('Game error:', error);
        // Fallback to random result on error
        const fallbackNumber = Math.floor(Math.random() * 10);
        const resultColor = getNumberColor(fallbackNumber);
        setLastResult({ number: fallbackNumber, color: resultColor });
      }
      
      setIsSpinning(false);
      setCountdown(30);
    }, 2000);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-black rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Win Go</h2>
        <div className="text-lg text-yellow-400">
          {isSpinning ? 'Drawing...' : `Next Draw: ${countdown}s`}
        </div>
      </div>

      {/* Last Result */}
      {lastResult && (
        <div className="text-center mb-6 p-4 bg-gray-800 rounded-lg">
          <div className="text-white text-sm mb-2">Last Result</div>
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-xl font-bold ${getColorClass(lastResult.color)}`}>
            {lastResult.number}
          </div>
        </div>
      )}

      {/* Number Selection */}
      <div className="mb-6">
        <h3 className="text-white text-lg mb-3">Select Number</h3>
        <div className="grid grid-cols-5 gap-2">
          {numbers.map(num => (
            <button
              key={num}
              onClick={() => {
                setSelectedNumber(num);
                setSelectedColor('');
              }}
              className={`h-12 rounded-lg font-bold transition-all ${
                selectedNumber === num
                  ? 'ring-2 ring-yellow-400 scale-105'
                  : ''
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
        <h3 className="text-white text-lg mb-3">Select Color</h3>
        <div className="grid grid-cols-3 gap-3">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => {
                setSelectedColor(color);
                setSelectedNumber(null);
              }}
              className={`h-12 rounded-lg font-bold transition-all ${
                selectedColor === color
                  ? 'ring-2 ring-yellow-400 scale-105'
                  : ''
              } ${getColorClass(color)}`}
              disabled={isSpinning}
            >
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bet Amount Display */}
      <div className="mb-6 p-3 bg-gray-800 rounded-lg">
        <div className="text-white text-center">
          Bet Amount: <span className="text-yellow-400 font-bold">₹{betAmount}</span>
        </div>
      </div>

      {/* Play Button */}
      <button
        onClick={playGame}
        disabled={isSpinning || (!selectedNumber && !selectedColor)}
        className={`w-full py-3 rounded-lg font-bold text-xl transition-all ${
          isSpinning || (!selectedNumber && !selectedColor)
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:scale-105 shadow-lg'
        }`}
      >
        {isSpinning ? 'Drawing...' : 'Play Now'}
      </button>
    </div>
  );
};