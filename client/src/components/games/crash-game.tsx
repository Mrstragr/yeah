import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Zap, Users, History } from "lucide-react";

interface CrashGameProps {
  gameId: number;
  gameTitle: string;
  onBet: (amount: number, multiplier?: number) => void;
  onClose: () => void;
}

export default function CrashGame({ gameId, gameTitle, onBet, onClose }: CrashGameProps) {
  const [multiplier, setMultiplier] = useState(1.00);
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashout, setAutoCashout] = useState<number | null>(null);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'rising' | 'crashed'>('waiting');
  const [timeLeft, setTimeLeft] = useState(10);
  const [isBetPlaced, setIsBetPlaced] = useState(false);
  const [currentBet, setCurrentBet] = useState(0);
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [activePlayers, setActivePlayers] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const betAmounts = [10, 50, 100, 500, 1000];

  useEffect(() => {
    // Initialize with some history
    setGameHistory([2.45, 1.23, 15.67, 1.08, 3.21, 1.45, 8.90, 1.12, 2.77, 1.89]);
    setActivePlayers(Math.floor(Math.random() * 50) + 20);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (gamePhase === 'waiting') {
        setTimeLeft(prev => {
          if (prev <= 1) {
            startGame();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase]);

  const startGame = () => {
    setGamePhase('rising');
    setTimeLeft(0);
    setMultiplier(1.00);
    
    // Determine crash point (weighted towards lower multipliers for realism)
    const random = Math.random();
    let crashPoint: number;
    
    if (random < 0.4) {
      crashPoint = 1 + Math.random() * 1.5; // 1.00 - 2.50
    } else if (random < 0.7) {
      crashPoint = 2.5 + Math.random() * 2.5; // 2.50 - 5.00
    } else if (random < 0.9) {
      crashPoint = 5 + Math.random() * 5; // 5.00 - 10.00
    } else {
      crashPoint = 10 + Math.random() * 40; // 10.00 - 50.00
    }

    let currentMultiplier = 1.00;
    const increment = 0.01;
    const speed = 50; // milliseconds

    intervalRef.current = setInterval(() => {
      currentMultiplier += increment;
      setMultiplier(Number(currentMultiplier.toFixed(2)));

      // Auto cashout check
      if (isBetPlaced && autoCashout && currentMultiplier >= autoCashout) {
        handleCashout();
      }

      // Crash check
      if (currentMultiplier >= crashPoint) {
        crashGame(crashPoint);
        return;
      }
    }, speed);
  };

  const crashGame = (crashPoint: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setGamePhase('crashed');
    setMultiplier(crashPoint);
    
    // Add to history
    setGameHistory(prev => [crashPoint, ...prev.slice(0, 9)]);
    
    // If player had bet and didn't cash out, they lose
    if (isBetPlaced) {
      toast({
        title: "Crashed!",
        description: `Game crashed at ${crashPoint.toFixed(2)}x. You lost ₹${currentBet}`,
        variant: "destructive"
      });
    }

    // Reset for next round
    setTimeout(() => {
      setGamePhase('waiting');
      setTimeLeft(10);
      setIsBetPlaced(false);
      setCurrentBet(0);
      setActivePlayers(Math.floor(Math.random() * 50) + 20);
    }, 3000);
  };

  const handlePlaceBet = () => {
    if (gamePhase !== 'waiting' || betAmount <= 0) {
      toast({
        title: "Cannot Place Bet",
        description: gamePhase !== 'waiting' ? "Wait for next round" : "Invalid bet amount",
        variant: "destructive"
      });
      return;
    }

    setIsBetPlaced(true);
    setCurrentBet(betAmount);
    onBet(betAmount);
    
    toast({
      title: "Bet Placed",
      description: `₹${betAmount} bet placed${autoCashout ? ` with auto cashout at ${autoCashout}x` : ''}`,
    });
  };

  const handleCashout = () => {
    if (!isBetPlaced || gamePhase !== 'rising') return;

    const winAmount = Math.floor(currentBet * multiplier);
    setIsBetPlaced(false);
    
    toast({
      title: "Cashed Out!",
      description: `Won ₹${winAmount} at ${multiplier}x multiplier`,
    });

    onBet(winAmount, multiplier);
  };

  const getMultiplierColor = () => {
    if (gamePhase === 'crashed') return 'text-red-500';
    if (multiplier < 2) return 'text-green-400';
    if (multiplier < 5) return 'text-yellow-400';
    if (multiplier < 10) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gaming-dark rounded-lg w-full max-w-6xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-gaming font-bold text-gaming-gold">{gameTitle}</h2>
            <Button onClick={onClose} variant="outline" size="sm">
              Close
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Game Display */}
            <div className="lg:col-span-3">
              <Card className="game-card h-96 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gaming-accent/20 to-transparent" />
                <div className="relative h-full flex flex-col items-center justify-center">
                  {gamePhase === 'waiting' && (
                    <div className="text-center">
                      <div className="text-6xl font-bold text-gaming-gold mb-4">
                        {timeLeft}
                      </div>
                      <div className="text-xl text-casino-text-secondary">
                        Next round starting...
                      </div>
                    </div>
                  )}
                  
                  {(gamePhase === 'rising' || gamePhase === 'crashed') && (
                    <div className="text-center">
                      <div className={`text-8xl font-bold mb-4 ${getMultiplierColor()}`}>
                        {multiplier.toFixed(2)}x
                      </div>
                      <div className="flex items-center justify-center space-x-4 text-casino-text-secondary">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {activePlayers} players
                        </div>
                        {gamePhase === 'crashed' && (
                          <div className="text-red-500 font-bold">
                            CRASHED!
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Animated background effect for rising phase */}
                  {gamePhase === 'rising' && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 opacity-50" />
                    </div>
                  )}
                </div>
              </Card>

              {/* Betting Controls */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="game-card">
                  <CardHeader>
                    <CardTitle className="text-gaming-gold text-lg">Place Bet</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-casino-text-secondary text-sm">Bet Amount</label>
                      <div className="grid grid-cols-5 gap-1 mt-2">
                        {betAmounts.map(amount => (
                          <Button
                            key={amount}
                            variant={betAmount === amount ? "default" : "outline"}
                            size="sm"
                            className={`${betAmount === amount ? 'bg-gaming-gold text-black' : ''}`}
                            onClick={() => setBetAmount(amount)}
                            disabled={gamePhase === 'rising'}
                          >
                            ₹{amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-casino-text-secondary text-sm">Auto Cashout (Optional)</label>
                      <Input
                        type="number"
                        step="0.01"
                        min="1.01"
                        placeholder="e.g., 2.00"
                        value={autoCashout || ''}
                        onChange={(e) => setAutoCashout(e.target.value ? parseFloat(e.target.value) : null)}
                        className="mt-2"
                        disabled={gamePhase === 'rising'}
                      />
                    </div>

                    <Button
                      onClick={handlePlaceBet}
                      disabled={gamePhase !== 'waiting' || isBetPlaced}
                      className="w-full bg-gaming-gold text-black hover:bg-yellow-500 font-bold"
                    >
                      {isBetPlaced ? `Bet Placed: ₹${currentBet}` : `Place Bet ₹${betAmount}`}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="game-card">
                  <CardHeader>
                    <CardTitle className="text-gaming-gold text-lg">Cash Out</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        ₹{Math.floor(currentBet * multiplier)}
                      </div>
                      <div className="text-casino-text-secondary text-sm">
                        Potential Win
                      </div>
                    </div>

                    <Button
                      onClick={handleCashout}
                      disabled={!isBetPlaced || gamePhase !== 'rising'}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-3"
                    >
                      {gamePhase === 'rising' && isBetPlaced 
                        ? `Cash Out ${multiplier.toFixed(2)}x` 
                        : 'Cash Out'
                      }
                    </Button>

                    {isBetPlaced && autoCashout && (
                      <div className="text-center text-sm text-casino-text-secondary">
                        Auto cashout at {autoCashout}x
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar - History and Stats */}
            <div className="lg:col-span-1">
              <Card className="game-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-gaming-gold">
                    <History className="w-5 h-5 mr-2" />
                    Recent Crashes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {gameHistory.map((crash, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2 rounded text-sm ${
                          crash < 2 ? 'bg-red-900/30 text-red-400' :
                          crash < 5 ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-green-900/30 text-green-400'
                        }`}
                      >
                        <span>#{index + 1}</span>
                        <span className="font-bold">{crash.toFixed(2)}x</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="game-card mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center text-gaming-gold">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-casino-text-secondary">Average</span>
                    <span className="text-white">
                      {(gameHistory.reduce((a, b) => a + b, 0) / gameHistory.length).toFixed(2)}x
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-casino-text-secondary">Highest</span>
                    <span className="text-green-400">
                      {Math.max(...gameHistory).toFixed(2)}x
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-casino-text-secondary">Lowest</span>
                    <span className="text-red-400">
                      {Math.min(...gameHistory).toFixed(2)}x
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-casino-text-secondary">Active Players</span>
                    <span className="text-white">{activePlayers}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}