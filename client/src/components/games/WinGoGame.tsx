import { useState, useEffect, useRef } from 'react';
import { Timer, Target, TrendingUp } from 'lucide-react';

interface WinGoGameProps {
  betAmount: number;
  onGameResult: (result: any) => void;
  isPlaying: boolean;
}

export const WinGoGame = ({ betAmount, onGameResult, isPlaying }: WinGoGameProps) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [lastResult, setLastResult] = useState<{ number: number; color: string } | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const numbers = Array.from({ length: 10 }, (_, i) => i);
  const colors = ['red', 'green', 'violet'];

  const getNumberColor = (num: number) => {
    if (num === 0) return 'red-violet';
    if (num === 5) return 'green-violet';
    if ([1, 3, 7, 9].includes(num)) return 'green';
    return 'red';
  };

  useEffect(() => {
    if (isPlaying && !gameStarted) {
      startGame();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentPeriod(`2024${Date.now().toString().slice(-6)}`);
    startCountdown();
  };

  const startCountdown = () => {
    setTimeLeft(30);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          executeGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const executeGame = () => {
    setSpinning(true);
    
    // Animate the spinning wheel
    const canvas = canvasRef.current;
    if (canvas) {
      animateWheel(canvas);
    }

    setTimeout(() => {
      const result = Math.floor(Math.random() * 10);
      const resultColor = getNumberColor(result);
      
      setLastResult({ number: result, color: resultColor });
      setSpinning(false);
      setShowResult(true);

      // Check if player won
      let isWin = false;
      let multiplier = 0;

      if (selectedNumber === result) {
        isWin = true;
        multiplier = result === 0 || result === 5 ? 4.5 : 9;
      } else if (selectedColor) {
        if (selectedColor === resultColor || 
            (selectedColor === 'violet' && (result === 0 || result === 5))) {
          isWin = true;
          multiplier = selectedColor === 'violet' ? 4.5 : 2;
        }
      }

      // Send game data to backend with proper bet parameters
      const gameData = {
        betType: selectedNumber !== null ? 'number' : 'color',
        betValue: selectedNumber !== null ? selectedNumber : selectedColor,
        gameResult: {
          number: result,
          color: resultColor,
          period: currentPeriod
        }
      };
      
      onGameResult(gameData);

      setTimeout(() => {
        setShowResult(false);
        startCountdown();
      }, 3000);
    }, 3000);
  };

  const animateWheel = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rotation = 0;
    let frameCount = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const animate = () => {
      frameCount++;
      
      // Optimize: Only redraw every 3rd frame
      if (frameCount % 3 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Simplified background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw spinning indicator instead of complex wheel
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        // Draw simple spinning circle segments
        for (let i = 0; i < 10; i++) {
          const angle = (i / 10) * Math.PI * 2;
          const startAngle = angle - Math.PI / 20;
          const endAngle = angle + Math.PI / 20;
          
          ctx.beginPath();
          ctx.arc(0, 0, 60, startAngle, endAngle);
          ctx.lineWidth = 8;
          
          const color = getNumberColor(i);
          if (color === 'red') ctx.strokeStyle = '#ff4757';
          else if (color === 'green') ctx.strokeStyle = '#2ed573';
          else ctx.strokeStyle = '#8e44ad';
          
          ctx.stroke();
          
          // Draw number
          const textX = Math.cos(angle) * 40;
          const textY = Math.sin(angle) * 40;
          ctx.fillStyle = 'white';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(i.toString(), textX, textY);
        }
        
        ctx.restore();

        // Draw center pointer
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 8);
        ctx.lineTo(centerX - 4, centerY + 4);
        ctx.lineTo(centerX + 4, centerY + 4);
        ctx.closePath();
        ctx.fillStyle = '#ffd700';
        ctx.fill();
      }

      rotation += 0.2;
      
      if (spinning) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  return (
    <div className="space-y-4">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-4 text-center">
        <div className="text-white text-lg font-bold">WinGo</div>
        <div className="text-purple-300 text-sm">Period: {currentPeriod}</div>
        <div className="text-3xl font-bold text-yellow-500 mt-2">
          {timeLeft > 0 ? `${timeLeft}s` : spinning ? 'SPINNING...' : 'COMPLETE'}
        </div>
      </div>

      {/* Spinning Wheel */}
      <div className="bg-slate-900 rounded-lg p-4 flex justify-center">
        <canvas 
          ref={canvasRef}
          width={200}
          height={200}
          className="rounded-lg"
        />
      </div>

      {/* Result Display */}
      {showResult && lastResult && (
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-4 text-center animate-pulse">
          <div className="text-white text-lg font-bold">Result</div>
          <div className="text-4xl font-bold text-white mt-2">
            <span 
              className={`inline-block w-16 h-16 rounded-full flex items-center justify-center ${
                lastResult.color === 'red' ? 'bg-red-500' :
                lastResult.color === 'green' ? 'bg-green-500' :
                'bg-purple-500'
              }`}
            >
              {lastResult.number}
            </span>
          </div>
        </div>
      )}

      {/* Betting Options */}
      <div className="space-y-4">
        {/* Number Selection */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-white font-bold mb-3">Select Number (9x payout)</div>
          <div className="grid grid-cols-5 gap-2">
            {numbers.map(num => (
              <button
                key={num}
                onClick={() => {
                  setSelectedNumber(selectedNumber === num ? null : num);
                  setSelectedColor(null);
                }}
                disabled={timeLeft === 0 || spinning}
                className={`p-3 rounded-lg font-bold transition-all ${
                  selectedNumber === num
                    ? 'bg-yellow-500 text-black scale-110'
                    : getNumberColor(num) === 'red'
                    ? 'bg-red-500 text-white hover:bg-red-400'
                    : getNumberColor(num) === 'green'
                    ? 'bg-green-500 text-white hover:bg-green-400'
                    : 'bg-purple-500 text-white hover:bg-purple-400'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-white font-bold mb-3">Select Color (2x payout)</div>
          <div className="grid grid-cols-3 gap-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(selectedColor === color ? null : color);
                  setSelectedNumber(null);
                }}
                disabled={timeLeft === 0 || spinning}
                className={`p-4 rounded-lg font-bold transition-all ${
                  selectedColor === color
                    ? 'bg-yellow-500 text-black scale-105'
                    : color === 'red'
                    ? 'bg-red-500 text-white hover:bg-red-400'
                    : color === 'green'
                    ? 'bg-green-500 text-white hover:bg-green-400'
                    : 'bg-purple-500 text-white hover:bg-purple-400'
                }`}
              >
                {color.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bet Summary */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="text-white font-bold mb-2">Your Bet</div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Amount: </span>
            <span className="text-white font-bold">₹{betAmount}</span>
          </div>
          <div>
            <span className="text-slate-400">Selection: </span>
            <span className="text-yellow-500 font-bold">
              {selectedNumber !== null ? `Number ${selectedNumber}` : 
               selectedColor ? `Color ${selectedColor}` : 'None'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};