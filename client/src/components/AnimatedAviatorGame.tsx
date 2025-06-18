import { useState, useEffect, useRef } from 'react';
import { ParticleSystem } from './ParticleSystem';

interface AnimatedAviatorGameProps {
  betAmount: number;
  onGameResult: (result: any) => void;
  isPlaying: boolean;
}

export const AnimatedAviatorGame = ({ betAmount, onGameResult, isPlaying }: AnimatedAviatorGameProps) => {
  const [gamePhase, setGamePhase] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [cashedOut, setCashedOut] = useState(false);
  const [crashPoint, setCrashPoint] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [planePosition, setPlanePosition] = useState({ x: 50, y: 250 });
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gameStartTime = useRef(0);

  useEffect(() => {
    if (isPlaying && gamePhase === 'waiting') {
      startGame();
    }
    return () => {
      // Cleanup animations when component unmounts
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);
  
  // Additional cleanup on component unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const startGame = async () => {
    setGamePhase('flying');
    setCurrentMultiplier(1.0);
    setCashedOut(false);
    setPlanePosition({ x: 50, y: 250 });
    gameStartTime.current = Date.now();
    
    // Generate crash point locally first, then sync with backend later
    setCrashPoint(generateCrashPoint());
    
    animateFlight();
  };

  const generateCrashPoint = () => {
    // Realistic crash point generation (similar to real Aviator)
    const random = Math.random();
    if (random < 0.3) return 1.0 + Math.random() * 0.5; // 30% chance: 1.0x - 1.5x
    if (random < 0.6) return 1.5 + Math.random() * 1.0; // 30% chance: 1.5x - 2.5x
    if (random < 0.85) return 2.5 + Math.random() * 2.5; // 25% chance: 2.5x - 5.0x
    return 5.0 + Math.random() * 20; // 15% chance: 5.0x - 25.0x
  };

  const animateFlight = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const newMultiplier = 1 + (elapsed * 0.5); // Multiplier increases over time
      
      if (newMultiplier >= crashPoint && !cashedOut) {
        // Plane crashed
        setGamePhase('crashed');
        setCurrentMultiplier(crashPoint);
        
        // Add crash to history
        setGameHistory(prev => [crashPoint, ...prev.slice(0, 9)]);
        
        // Send result to backend
        onGameResult({
          cashOutMultiplier: 1.0, // Minimum cash out
          gameResult: {
            crashMultiplier: crashPoint,
            cashedOut: false
          }
        });
        
        setTimeout(() => {
          setGamePhase('waiting');
        }, 3000);
        return;
      }
      
      setCurrentMultiplier(newMultiplier);
      
      // Update plane position
      const newX = 50 + (elapsed * 30);
      const newY = 250 - (Math.log(newMultiplier) * 80);
      setPlanePosition({ x: newX, y: newY });
      
      drawScene(ctx, canvas.width, canvas.height, newX, newY, newMultiplier);
      
      if (gamePhase === 'flying' && !cashedOut) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animate();
  };

  const drawScene = (ctx: CanvasRenderingContext2D, width: number, height: number, planeX: number, planeY: number, multiplier: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw stars
    for (let i = 0; i < 50; i++) {
      const x = (i * 37) % width;
      const y = (i * 23) % height;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw trajectory line
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(50, 250);
    
    for (let x = 50; x <= planeX; x += 5) {
      const progress = (x - 50) / 30;
      const mult = 1 + (progress * 0.5);
      const y = 250 - (Math.log(mult) * 80);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Draw plane
    ctx.save();
    ctx.translate(planeX, planeY);
    
    // Plane body
    ctx.fillStyle = '#ff6b6b';
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Plane wings
    ctx.fillStyle = '#4ecdc4';
    ctx.beginPath();
    ctx.ellipse(-5, -2, 15, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-5, 2, 15, 4, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Engine trail
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `rgba(255, 100, 100, ${0.8 - i * 0.15})`;
      ctx.beginPath();
      ctx.ellipse(-25 - i * 5, 0, 8 - i, 3 - i * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
    
    // Draw multiplier display
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = gamePhase === 'crashed' ? '#ff4757' : '#00ff88';
    ctx.textAlign = 'center';
    ctx.shadowColor = gamePhase === 'crashed' ? '#ff4757' : '#00ff88';
    ctx.shadowBlur = 20;
    ctx.fillText(`${multiplier.toFixed(2)}x`, width / 2, 80);
    ctx.shadowBlur = 0;
    
    // Status text
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    if (gamePhase === 'crashed') {
      ctx.fillStyle = '#ff4757';
      ctx.fillText('CRASHED!', width / 2, 120);
    } else if (cashedOut) {
      ctx.fillStyle = '#00ff88';
      ctx.fillText('CASHED OUT!', width / 2, 120);
    }
  };

  const cashOut = () => {
    if (gamePhase === 'flying' && !cashedOut) {
      setCashedOut(true);
      setGamePhase('waiting');
      setShowParticles(true);
      
      // Add to history
      setGameHistory(prev => [currentMultiplier, ...prev.slice(0, 9)]);
      
      // Send win result to backend
      onGameResult({
        cashOutMultiplier: currentMultiplier,
        gameResult: {
          crashMultiplier: crashPoint,
          cashedOut: true,
          cashOutAt: currentMultiplier
        }
      });
      
      setTimeout(() => {
        setShowParticles(false);
        setGamePhase('waiting');
      }, 3000);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <ParticleSystem isActive={showParticles} type="win" />
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-4 animate-pulse">
          ✈️ AVIATOR ✈️
        </h1>
        
        {/* Game History */}
        <div className="bg-black/40 p-4 rounded-lg mb-4">
          <h3 className="text-white text-sm mb-2">Recent Multipliers:</h3>
          <div className="flex justify-center gap-2 flex-wrap">
            {gameHistory.map((mult, index) => (
              <div 
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-bold
                  ${mult >= 2 ? 'bg-green-500 text-white' : mult >= 1.5 ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'}
                  ${index === 0 ? 'ring-2 ring-white scale-110' : ''}
                `}
                style={{
                  animation: index === 0 ? 'bounce 1s infinite' : undefined
                }}
              >
                {mult.toFixed(2)}x
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="flex justify-center mb-6">
        <div className="relative bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-4 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            className="rounded-lg"
          />
          
          {/* Overlay UI */}
          <div className="absolute top-4 left-4 bg-black/60 p-3 rounded-lg">
            <div className="text-white text-sm">
              <div>Bet: ₹{betAmount}</div>
              <div className="text-yellow-400">
                {gamePhase === 'flying' ? 'Flying...' : gamePhase === 'crashed' ? 'Crashed!' : 'Next Round'}
              </div>
            </div>
          </div>
          
          {/* Cash Out Button */}
          {gamePhase === 'flying' && !cashedOut && (
            <div className="absolute bottom-4 right-4">
              <button
                onClick={cashOut}
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 
                         text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 
                         transition-all duration-200 animate-pulse"
              >
                CASH OUT
                <div className="text-sm">₹{(betAmount * currentMultiplier).toFixed(2)}</div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Game Stats */}
      <div className="max-w-md mx-auto bg-black/40 p-6 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-gray-400 text-sm">Current Multiplier</div>
            <div className={`text-2xl font-bold ${gamePhase === 'crashed' ? 'text-red-400' : 'text-green-400'}`}>
              {currentMultiplier.toFixed(2)}x
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Potential Win</div>
            <div className="text-yellow-400 text-2xl font-bold">
              ₹{(betAmount * currentMultiplier).toFixed(2)}
            </div>
          </div>
        </div>
        
        {gamePhase === 'waiting' && (
          <div className="text-center mt-4">
            <div className="text-white">Get ready for next round...</div>
          </div>
        )}
        
        {gamePhase === 'crashed' && (
          <div className="text-center mt-4">
            <div className="text-red-400 font-bold">Plane crashed at {crashPoint.toFixed(2)}x!</div>
            {cashedOut ? (
              <div className="text-green-400">You cashed out in time! ✓</div>
            ) : (
              <div className="text-red-400">Better luck next time!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};