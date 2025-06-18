import { useState, useEffect, useRef } from 'react';
import { ParticleSystem } from './ParticleSystem';

interface AnimatedWinGoGameProps {
  betAmount: number;
  onGameResult: (result: any) => void;
  isPlaying: boolean;
}

export const AnimatedWinGoGame = ({ betAmount, onGameResult, isPlaying }: AnimatedWinGoGameProps) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [lastResult, setLastResult] = useState<{ number: number; color: string } | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [resultAnimation, setResultAnimation] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [winStreaks, setWinStreaks] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const numbers = Array.from({ length: 10 }, (_, i) => i);
  const colors = ['red', 'green', 'violet'];

  const getNumberColor = (num: number) => {
    if (num === 0) return 'red-violet';
    if (num === 5) return 'green-violet';
    if ([1, 3, 7, 9].includes(num)) return 'green';
    if ([2, 4, 6, 8].includes(num)) return 'red';
    return 'red'; // fallback
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'red': return 'bg-gradient-to-br from-red-500 to-red-700 text-white shadow-red-500/50';
      case 'green': return 'bg-gradient-to-br from-green-500 to-green-700 text-white shadow-green-500/50';
      case 'violet': return 'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-purple-500/50';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-700 text-white';
    }
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
    
    const canvas = canvasRef.current;
    if (canvas) {
      animateWheel(canvas);
    }

    setTimeout(() => {
      const result = Math.floor(Math.random() * 10);
      const resultColor = getNumberColor(result);
      
      setLastResult({ number: result, color: resultColor });
      setSpinning(false);
      setResultAnimation(true);
      
      // Add to win streaks for visual effect
      setWinStreaks(prev => [result, ...prev.slice(0, 9)]);

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

      if (isWin) {
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 3000);
      }

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
        setResultAnimation(false);
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
    const radius = Math.min(centerX, centerY) - 20;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient background
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 69, 0, 0.4)');
      
      // Draw outer glow
      ctx.save();
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 20;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw wheel segments
      for (let i = 0; i < 10; i++) {
        const startAngle = (i / 10) * Math.PI * 2 + rotation;
        const endAngle = ((i + 1) / 10) * Math.PI * 2 + rotation;
        
        ctx.save();
        ctx.fillStyle = i % 2 === 0 ? '#FF6B6B' : '#4ECDC4';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius - 10, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        
        // Add inner shadow
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.stroke();
        ctx.restore();

        // Draw numbers
        const textAngle = startAngle + (endAngle - startAngle) / 2;
        const textX = centerX + Math.cos(textAngle) * (radius - 30);
        const textY = centerY + Math.sin(textAngle) * (radius - 30);
        
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeText(i.toString(), textX, textY);
        ctx.fillText(i.toString(), textX, textY);
        ctx.restore();
      }

      // Draw center circle
      ctx.save();
      ctx.fillStyle = '#FFD700';
      ctx.shadowColor = '#FFA500';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw pointer
      ctx.save();
      ctx.fillStyle = '#FF4757';
      ctx.shadowColor = '#FF3742';
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - radius + 5);
      ctx.lineTo(centerX - 10, centerY - radius + 25);
      ctx.lineTo(centerX + 10, centerY - radius + 25);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      rotation += 0.3 + (frameCount * 0.02);
      frameCount++;

      if (frameCount < 150) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <ParticleSystem isActive={showParticles} type="win" />
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-2 animate-pulse">
          🎰 WIN GO 🎰
        </h1>
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="bg-black/40 px-4 py-2 rounded-lg">
            <span className="text-yellow-400 font-bold">Period: {currentPeriod}</span>
          </div>
          <div className="bg-black/40 px-4 py-2 rounded-lg">
            <span className="text-white font-bold">Time: {timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Win Streaks Display */}
      <div className="flex justify-center mb-6">
        <div className="bg-black/40 p-4 rounded-lg">
          <h3 className="text-white text-sm mb-2">Recent Results:</h3>
          <div className="flex gap-2">
            {winStreaks.map((num, index) => (
              <div 
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                  ${getColorClass(getNumberColor(num))} 
                  ${index === 0 ? 'ring-2 ring-yellow-400 scale-110' : ''}`}
                style={{
                  animation: index === 0 ? 'bounce 1s infinite' : undefined
                }}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl"
          />
          {spinning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin text-6xl">🎯</div>
            </div>
          )}
        </div>
      </div>

      {/* Result Display */}
      {lastResult && resultAnimation && (
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-2xl shadow-2xl animate-bounce">
            <div className="text-white text-2xl font-bold mb-2">RESULT</div>
            <div className={`text-6xl font-bold ${getColorClass(lastResult.color)} rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-lg`}>
              {lastResult.number}
            </div>
            <div className="text-white mt-2 capitalize">{lastResult.color}</div>
          </div>
        </div>
      )}

      {/* Number Selection */}
      <div className="mb-6">
        <h3 className="text-white text-xl font-bold text-center mb-4">Select Number (9x)</h3>
        <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
          {numbers.map(num => (
            <button
              key={num}
              onClick={() => { setSelectedNumber(num); setSelectedColor(null); }}
              disabled={spinning}
              className={`
                w-16 h-16 rounded-xl font-bold text-xl transition-all duration-300 transform
                ${selectedNumber === num 
                  ? `${getColorClass(getNumberColor(num))} scale-110 shadow-2xl ring-4 ring-white` 
                  : `${getColorClass(getNumberColor(num))} hover:scale-105 shadow-lg opacity-80 hover:opacity-100`
                }
                ${spinning ? 'animate-pulse' : 'hover:animate-pulse'}
              `}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="mb-6">
        <h3 className="text-white text-xl font-bold text-center mb-4">Select Color (2x)</h3>
        <div className="flex justify-center gap-4">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => { setSelectedColor(color); setSelectedNumber(null); }}
              disabled={spinning}
              className={`
                px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform capitalize
                ${selectedColor === color 
                  ? `${getColorClass(color)} scale-110 shadow-2xl ring-4 ring-white` 
                  : `${getColorClass(color)} hover:scale-105 shadow-lg opacity-80 hover:opacity-100`
                }
                ${spinning ? 'animate-pulse' : 'hover:animate-pulse'}
              `}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="text-center">
        <div className="bg-black/40 p-4 rounded-lg inline-block">
          <div className="text-white">
            {spinning ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Drawing Result...
              </div>
            ) : timeLeft === 0 ? (
              "Game Complete!"
            ) : (
              `Place your bet! ${timeLeft}s remaining`
            )}
          </div>
          {(selectedNumber !== null || selectedColor) && (
            <div className="text-yellow-400 mt-2">
              Bet: {selectedNumber !== null ? `Number ${selectedNumber}` : `Color ${selectedColor}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};