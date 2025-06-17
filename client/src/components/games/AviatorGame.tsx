import { useState, useEffect, useRef } from 'react';
import { Plane, TrendingUp } from 'lucide-react';

interface AviatorGameProps {
  betAmount: number;
  onGameResult: (result: any) => void;
  isPlaying: boolean;
}

export const AviatorGame = ({ betAmount, onGameResult, isPlaying }: AviatorGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isPlaying && !gameStarted) {
      startGame();
    }
  }, [isPlaying, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setIsFlying(true);
    setCrashed(false);
    setCashedOut(false);
    setCurrentMultiplier(1.00);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Simulate random crash point between 1.01x and 10.00x
    const crashPoint = Math.random() * 9 + 1.01;
    
    animateGame(canvas, crashPoint);
  };

  const animateGame = (canvas: HTMLCanvasElement, crashPoint: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = Date.now();
    let multiplier = 1.00;
    let frameCount = 0;

    const animate = () => {
      frameCount++;
      const elapsed = (Date.now() - startTime) / 1000;
      multiplier = Math.min(1.00 + elapsed * 0.8, crashPoint);
      
      // Optimize: Only redraw every other frame for better performance
      if (frameCount % 2 === 0) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Simplified background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Simplified grid - fewer lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
          const x = (canvas.width / 5) * i;
          const y = (canvas.height / 5) * i;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Calculate plane position
        const planeX = Math.min(50 + (elapsed * 40), canvas.width - 50);
        const planeY = Math.max(canvas.height - 100 - (elapsed * 30), 50);

        // Draw simplified trajectory line
        ctx.strokeStyle = multiplier < crashPoint ? '#00ff88' : '#ff4757';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, canvas.height - 100);
        ctx.lineTo(planeX, planeY);
        ctx.stroke();

        // Draw plane (simplified)
        ctx.fillStyle = multiplier < crashPoint ? '#00ff88' : '#ff4757';
        ctx.font = '20px Arial';
        ctx.fillText(multiplier < crashPoint ? '✈️' : '💥', planeX - 10, planeY + 6);
      }

      // Update multiplier display
      setCurrentMultiplier(multiplier);

      if (multiplier >= crashPoint) {
        setCrashed(true);
        setIsFlying(false);
        onGameResult({
          multiplier: crashPoint,
          isWin: cashedOut,
          winAmount: cashedOut ? betAmount * multiplier : 0
        });
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const cashOut = () => {
    if (isFlying && !crashed) {
      setCashedOut(true);
      setIsFlying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      onGameResult({
        multiplier: currentMultiplier,
        isWin: true,
        winAmount: betAmount * currentMultiplier
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg p-4">
        <canvas 
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full h-64 rounded-lg border border-slate-700"
        />
        
        {/* Multiplier Display */}
        <div className="absolute top-6 left-6 bg-black/70 rounded-lg px-4 py-2">
          <div className={`text-3xl font-bold ${crashed ? 'text-red-500' : 'text-green-500'}`}>
            {currentMultiplier.toFixed(2)}x
          </div>
        </div>

        {/* Status Display */}
        <div className="absolute top-6 right-6 bg-black/70 rounded-lg px-4 py-2">
          <div className="text-white text-sm">
            {!gameStarted ? 'Ready' : 
             isFlying ? 'Flying...' : 
             crashed ? 'Crashed!' : 
             cashedOut ? 'Cashed Out!' : 'Waiting...'}
          </div>
        </div>

        {/* Cash Out Button */}
        {isFlying && !crashed && (
          <button
            onClick={cashOut}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg animate-pulse"
          >
            Cash Out {currentMultiplier.toFixed(2)}x
          </button>
        )}
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-slate-400 text-xs">Bet Amount</div>
          <div className="text-white font-bold">₹{betAmount}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-slate-400 text-xs">Potential Win</div>
          <div className="text-green-500 font-bold">₹{(betAmount * currentMultiplier).toFixed(0)}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-slate-400 text-xs">Status</div>
          <div className={`font-bold ${crashed ? 'text-red-500' : cashedOut ? 'text-green-500' : 'text-yellow-500'}`}>
            {!gameStarted ? 'Ready' : 
             isFlying ? 'Active' : 
             crashed ? 'Lost' : 
             cashedOut ? 'Won' : 'Waiting'}
          </div>
        </div>
      </div>
    </div>
  );
};