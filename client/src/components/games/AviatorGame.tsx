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
    let planeTrail: { x: number; y: number; alpha: number }[] = [];

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      multiplier = Math.min(1.00 + elapsed * 0.7, crashPoint);
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(10, 15, 26, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw dark gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0f1a');
      gradient.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 8; i++) {
        const x = (canvas.width / 8) * i;
        const y = (canvas.height / 8) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Calculate plane position along curve
      const progress = Math.min(elapsed / 10, 1);
      const baseX = 50 + (progress * (canvas.width - 100));
      const baseY = canvas.height - 100;
      
      // Curved trajectory
      const curveHeight = Math.sin(progress * Math.PI * 0.8) * 120;
      const planeX = baseX;
      const planeY = baseY - curveHeight - (elapsed * 20);

      // Add to trail
      planeTrail.push({ x: planeX, y: planeY, alpha: 1.0 });
      if (planeTrail.length > 20) planeTrail.shift();

      // Draw trajectory trail
      ctx.strokeStyle = multiplier < crashPoint ? '#00ff88' : '#ff4757';
      ctx.lineWidth = 3;
      ctx.shadowColor = multiplier < crashPoint ? '#00ff88' : '#ff4757';
      ctx.shadowBlur = 10;
      
      if (planeTrail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(planeTrail[0].x, planeTrail[0].y);
        for (let i = 1; i < planeTrail.length; i++) {
          ctx.lineTo(planeTrail[i].x, planeTrail[i].y);
        }
        ctx.stroke();
      }
      
      ctx.shadowBlur = 0;

      // Draw plane trail effect
      planeTrail.forEach((point, i) => {
        const alpha = (i / planeTrail.length) * 0.5;
        ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
        ctx.font = `${12 + (alpha * 8)}px Arial`;
        ctx.fillText('✈️', point.x - 6, point.y + 3);
      });

      // Draw main plane
      if (multiplier < crashPoint) {
        // Flying plane with glow
        ctx.fillStyle = '#00ff88';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 15;
        ctx.font = 'bold 24px Arial';
        ctx.fillText('✈️', planeX - 12, planeY + 8);
        
        // Engine trail particles
        for (let i = 0; i < 3; i++) {
          const trailX = planeX - 20 - (i * 8);
          const trailY = planeY + 5 + (Math.sin(elapsed * 10 + i) * 3);
          ctx.fillStyle = `rgba(255, 165, 0, ${0.8 - i * 0.2})`;
          ctx.fillRect(trailX, trailY, 4, 2);
        }
      } else {
        // Crashed plane with explosion
        ctx.fillStyle = '#ff4757';
        ctx.shadowColor = '#ff4757';
        ctx.shadowBlur = 20;
        ctx.font = 'bold 28px Arial';
        ctx.fillText('💥', planeX - 14, planeY + 10);
        
        // Explosion particles
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const dist = 15 + Math.sin(elapsed * 20) * 10;
          const particleX = planeX + Math.cos(angle) * dist;
          const particleY = planeY + Math.sin(angle) * dist;
          ctx.fillStyle = `rgba(255, ${100 + Math.random() * 100}, 0, 0.8)`;
          ctx.beginPath();
          ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.shadowBlur = 0;

      // Update multiplier display
      setCurrentMultiplier(multiplier);

      if (multiplier >= crashPoint) {
        setCrashed(true);
        setIsFlying(false);
        setTimeout(() => {
          onGameResult({
            betType: 'aviator',
            multiplier: crashPoint,
            cashOutMultiplier: cashedOut ? multiplier : null,
            isWin: cashedOut,
            winAmount: cashedOut ? betAmount * multiplier : 0
          });
        }, 1000);
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
        betType: 'aviator',
        multiplier: currentMultiplier,
        cashOutMultiplier: currentMultiplier,
        isWin: true,
        winAmount: betAmount * currentMultiplier
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-4 text-center">
        <div className="text-white text-xl font-bold">Aviator</div>
        <div className="text-blue-300 text-sm">Fly high, cash out before the crash!</div>
      </div>

      {/* Main Game Area */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg p-4 overflow-hidden">
        <canvas 
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full h-64 rounded-lg border border-slate-700"
        />
        
        {/* Multiplier Display - Large and prominent */}
        <div className="absolute top-6 left-6 bg-black/80 rounded-lg px-6 py-3 border-2 border-green-500">
          <div className={`text-4xl font-bold ${crashed ? 'text-red-500' : cashedOut ? 'text-yellow-500' : 'text-green-500'}`}>
            {currentMultiplier.toFixed(2)}x
          </div>
        </div>

        {/* Recent Multipliers History */}
        <div className="absolute top-6 right-6 bg-black/70 rounded-lg px-3 py-2">
          <div className="text-white text-xs mb-1">Recent</div>
          <div className="flex space-x-1 text-xs">
            <span className="text-red-400">1.02x</span>
            <span className="text-green-400">3.45x</span>
            <span className="text-red-400">1.00x</span>
            <span className="text-green-400">2.10x</span>
          </div>
        </div>

        {/* Cash Out Button - More prominent */}
        {isFlying && !crashed && !cashedOut && (
          <button
            onClick={cashOut}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-4 px-12 rounded-lg text-xl shadow-xl animate-pulse border-2 border-yellow-300"
          >
            CASH OUT {currentMultiplier.toFixed(2)}x
          </button>
        )}

        {/* Game Status Messages */}
        {crashed && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white font-bold py-3 px-8 rounded-lg text-lg animate-bounce">
            CRASHED at {currentMultiplier.toFixed(2)}x!
          </div>
        )}

        {cashedOut && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg">
            CASHED OUT at {currentMultiplier.toFixed(2)}x!
          </div>
        )}

        {!gameStarted && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg">
            Click PLAY to start flying!
          </div>
        )}
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-sm">Bet Amount</div>
          <div className="text-white font-bold text-lg">₹{betAmount}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-sm">Potential Win</div>
          <div className="text-green-500 font-bold text-lg">₹{(betAmount * currentMultiplier).toFixed(0)}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-sm">Status</div>
          <div className={`font-bold text-lg ${
            crashed ? 'text-red-500' : 
            cashedOut ? 'text-green-500' : 
            isFlying ? 'text-yellow-500' : 
            'text-blue-500'
          }`}>
            {!gameStarted ? 'Ready' : 
             isFlying ? 'Flying' : 
             crashed ? 'Crashed' : 
             cashedOut ? 'Won' : 'Complete'}
          </div>
        </div>
      </div>

      {/* Betting Instructions */}
      <div className="bg-slate-800 rounded-lg p-4 text-center">
        <div className="text-white text-sm">
          Watch the plane fly and cash out before it crashes! Higher multipliers = bigger wins but higher risk.
        </div>
      </div>
    </div>
  );
};