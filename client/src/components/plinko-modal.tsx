import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { X, Play, RotateCcw } from "lucide-react";

interface PlinkoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWin: (amount: string) => void;
}

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const MULTIPLIERS = [0, 0.2, 0.5, 1, 2, 5, 10, 25, 10, 5, 2, 1, 0.5, 0.2, 0];
const SLOT_WIDTH = 40;
const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 500;
const PEG_ROWS = 8;
const PEGS_PER_ROW = 7;

export function PlinkoModal({ isOpen, onClose, onWin }: PlinkoModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [betAmount, setBetAmount] = useState("10");
  const [isPlaying, setIsPlaying] = useState(false);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [gameHistory, setGameHistory] = useState<{ bet: number; win: number; multiplier: number }[]>([]);
  const [balance, setBalance] = useState(5000);

  const pegs = useRef<{ x: number; y: number }[]>([]);

  // Initialize pegs
  useEffect(() => {
    const pegArray = [];
    for (let row = 0; row < PEG_ROWS; row++) {
      const pegsInRow = PEGS_PER_ROW - Math.floor(row / 2);
      const rowY = 80 + row * 50;
      const startX = BOARD_WIDTH / 2 - (pegsInRow - 1) * 35;
      
      for (let col = 0; col < pegsInRow; col++) {
        pegArray.push({
          x: startX + col * 70 + (row % 2) * 35,
          y: rowY
        });
      }
    }
    pegs.current = pegArray;
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
      
      // Draw background
      ctx.fillStyle = 'linear-gradient(135deg, #1a1a2e, #16213e)';
      ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
      
      // Draw pegs
      pegs.current.forEach(peg => {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd700';
        ctx.fill();
        ctx.strokeStyle = '#ffed4e';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Glow effect
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw multiplier slots
      const slotY = BOARD_HEIGHT - 40;
      MULTIPLIERS.forEach((multiplier, index) => {
        const slotX = index * SLOT_WIDTH + 20;
        const slotColor = multiplier >= 10 ? '#ff4757' : multiplier >= 2 ? '#ffa502' : '#2ed573';
        
        ctx.fillStyle = slotColor;
        ctx.fillRect(slotX, slotY, SLOT_WIDTH - 2, 30);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${multiplier}x`, slotX + SLOT_WIDTH / 2, slotY + 20);
      });

      // Update and draw balls
      setBalls(prevBalls => {
        const updatedBalls = prevBalls.map(ball => {
          let newBall = { ...ball };
          
          // Apply gravity
          newBall.vy += 0.3;
          
          // Update position
          newBall.x += newBall.vx;
          newBall.y += newBall.vy;
          
          // Collision with pegs
          pegs.current.forEach(peg => {
            const dx = newBall.x - peg.x;
            const dy = newBall.y - peg.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < newBall.radius + 8) {
              const angle = Math.atan2(dy, dx);
              newBall.vx = Math.cos(angle) * 3 + (Math.random() - 0.5) * 2;
              newBall.vy = Math.abs(Math.sin(angle)) * 2 + 1;
              
              // Move ball away from peg
              newBall.x = peg.x + Math.cos(angle) * (newBall.radius + 8);
              newBall.y = peg.y + Math.sin(angle) * (newBall.radius + 8);
            }
          });
          
          // Bounce off walls
          if (newBall.x < newBall.radius || newBall.x > BOARD_WIDTH - newBall.radius) {
            newBall.vx *= -0.8;
            newBall.x = Math.max(newBall.radius, Math.min(BOARD_WIDTH - newBall.radius, newBall.x));
          }
          
          return newBall;
        });

        // Check for balls that reached the bottom
        const activeBalls = updatedBalls.filter(ball => {
          if (ball.y > BOARD_HEIGHT - 50) {
            // Calculate which slot the ball landed in
            const slotIndex = Math.max(0, Math.min(MULTIPLIERS.length - 1, Math.floor(ball.x / SLOT_WIDTH)));
            const multiplier = MULTIPLIERS[slotIndex];
            const bet = parseFloat(betAmount);
            const winAmount = bet * multiplier;
            
            // Update game history
            setGameHistory(prev => [...prev, { bet, win: winAmount, multiplier }]);
            setBalance(prev => prev - bet + winAmount);
            
            if (winAmount > bet) {
              onWin(winAmount.toString());
            }
            
            return false; // Remove this ball
          }
          return true; // Keep this ball
        });

        // Draw remaining balls
        activeBalls.forEach(ball => {
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
          ctx.fillStyle = ball.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Ball glow
          ctx.shadowColor = ball.color;
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        if (activeBalls.length === 0) {
          setIsPlaying(false);
        }

        return activeBalls;
      });

      if (balls.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, balls.length, betAmount, onWin]);

  const dropBall = () => {
    const bet = parseFloat(betAmount);
    if (bet <= 0 || bet > balance) return;

    const newBall: Ball = {
      id: Date.now(),
      x: BOARD_WIDTH / 2 + (Math.random() - 0.5) * 20,
      y: 20,
      vx: (Math.random() - 0.5) * 2,
      vy: 1,
      radius: 12,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    };

    setBalls([newBall]);
    setIsPlaying(true);
  };

  const resetGame = () => {
    setBalls([]);
    setIsPlaying(false);
    setGameHistory([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-casino-secondary border-casino-border">
        <DialogHeader>
          <DialogTitle className="text-casino-gold font-casino text-2xl flex items-center gap-2">
            🎯 Plinko Casino
            <Button variant="ghost" size="sm" onClick={onClose} className="ml-auto">
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <Card className="bg-casino-accent border-casino-border">
              <CardContent className="p-4">
                <canvas
                  ref={canvasRef}
                  width={BOARD_WIDTH}
                  height={BOARD_HEIGHT}
                  className="w-full border-2 border-casino-gold rounded-lg bg-gradient-to-b from-casino-primary to-casino-secondary"
                />
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-4">
            {/* Balance */}
            <Card className="bg-casino-accent border-casino-border">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-casino-text-muted text-sm">Balance</p>
                  <p className="text-casino-gold font-casino text-2xl">₹{balance.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Betting Controls */}
            <Card className="bg-casino-accent border-casino-border">
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="text-casino-text text-sm">Bet Amount</label>
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="bg-casino-primary border-casino-border text-casino-text"
                    disabled={isPlaying}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={dropBall}
                    disabled={isPlaying || parseFloat(betAmount) <= 0 || parseFloat(betAmount) > balance}
                    className="btn-casino-primary"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Drop Ball
                  </Button>
                  <Button
                    onClick={resetGame}
                    variant="outline"
                    className="border-casino-border text-casino-text"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Multiplier Guide */}
            <Card className="bg-casino-accent border-casino-border">
              <CardContent className="p-4">
                <h3 className="text-casino-gold font-bold mb-2">Multipliers</h3>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {MULTIPLIERS.map((mult, index) => (
                    <div
                      key={index}
                      className={`text-center p-1 rounded ${
                        mult >= 10 ? 'bg-red-500' : mult >= 2 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                    >
                      {mult}x
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Game History */}
            <Card className="bg-casino-accent border-casino-border">
              <CardContent className="p-4">
                <h3 className="text-casino-gold font-bold mb-2">Recent Results</h3>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {gameHistory.slice(-5).reverse().map((game, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span>₹{game.bet}</span>
                      <span className={game.win > game.bet ? 'text-green-400' : 'text-red-400'}>
                        {game.multiplier}x (₹{game.win.toFixed(2)})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}