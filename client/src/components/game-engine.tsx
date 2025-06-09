import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Game } from "@shared/schema";

interface GameEngineProps {
  game: Game;
  onWin: (amount: string) => void;
  onClose: () => void;
}

// Teen Patti Game Logic
const TeenPattiGame = ({ game, onWin, onClose }: GameEngineProps) => {
  const [betAmount, setBetAmount] = useState("100");
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [gameState, setGameState] = useState<"betting" | "dealing" | "result">("betting");
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const { toast } = useToast();

  const cards = ["A♠", "K♠", "Q♠", "J♠", "10♠", "9♠", "8♠", "7♠", "6♠", "5♠", "4♠", "3♠", "2♠"];

  const dealCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const player = shuffled.slice(0, 3);
    const dealer = shuffled.slice(3, 6);
    
    setPlayerCards(player);
    setDealerCards(dealer);
    setGameState("dealing");

    setTimeout(() => {
      const playerScore = calculateHandScore(player);
      const dealerScore = calculateHandScore(dealer);
      const won = playerScore > dealerScore;
      
      setResult(won ? "win" : "lose");
      setGameState("result");
      
      if (won) {
        const winnings = (parseFloat(betAmount) * 1.95).toFixed(2);
        onWin(winnings);
        toast({
          title: "You Won!",
          description: `Congratulations! You won ₹${winnings}`,
        });
      } else {
        toast({
          title: "House Wins",
          description: "Better luck next time!",
          variant: "destructive",
        });
      }
    }, 3000);
  };

  const calculateHandScore = (hand: string[]): number => {
    // Simplified scoring for demo
    return Math.random() * 100;
  };

  return (
    <Card className="casino-card">
      <CardHeader>
        <CardTitle className="text-casino-gold flex items-center justify-between">
          Teen Patti Live
          <Badge className="bg-casino-red">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {gameState === "betting" && (
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Bet Amount (₹)</label>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="bg-casino-secondary border-casino-accent text-white"
                min="10"
                max="50000"
              />
            </div>
            <Button 
              onClick={dealCards}
              className="btn-casino-primary w-full"
              disabled={!betAmount || parseFloat(betAmount) < 10}
            >
              Deal Cards - ₹{betAmount}
            </Button>
          </div>
        )}

        {(gameState === "dealing" || gameState === "result") && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <h3 className="text-white font-medium mb-3">Your Cards</h3>
                <div className="flex justify-center space-x-2">
                  {playerCards.map((card, i) => (
                    <div key={i} className="w-12 h-16 bg-white rounded border text-black text-xs flex items-center justify-center font-bold">
                      {card}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-white font-medium mb-3">Dealer Cards</h3>
                <div className="flex justify-center space-x-2">
                  {dealerCards.map((card, i) => (
                    <div key={i} className="w-12 h-16 bg-white rounded border text-black text-xs flex items-center justify-center font-bold">
                      {gameState === "result" ? card : "?"}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {gameState === "result" && (
              <div className="text-center space-y-4">
                <div className={`text-2xl font-bold ${result === "win" ? "text-casino-gold" : "text-casino-red"}`}>
                  {result === "win" ? "YOU WIN!" : "DEALER WINS"}
                </div>
                <div className="flex space-x-3">
                  <Button onClick={() => {
                    setGameState("betting");
                    setPlayerCards([]);
                    setDealerCards([]);
                    setResult(null);
                  }} className="btn-casino-secondary flex-1">
                    Play Again
                  </Button>
                  <Button onClick={onClose} className="btn-casino-outline flex-1">
                    Exit
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Crash Game Logic
const CrashGame = ({ game, onWin, onClose }: GameEngineProps) => {
  const [betAmount, setBetAmount] = useState("100");
  const [multiplier, setMultiplier] = useState(1.00);
  const [gameState, setGameState] = useState<"betting" | "flying" | "crashed">("betting");
  const [cashedOut, setCashedOut] = useState(false);
  const [crashPoint, setCrashPoint] = useState(0);
  const { toast } = useToast();

  const startFlight = () => {
    const crash = 1 + Math.random() * 10; // Random crash between 1x and 11x
    setCrashPoint(crash);
    setGameState("flying");
    setCashedOut(false);

    const interval = setInterval(() => {
      setMultiplier(prev => {
        const next = prev + 0.01;
        if (next >= crash) {
          clearInterval(interval);
          setGameState("crashed");
          if (!cashedOut) {
            toast({
              title: "Crashed!",
              description: `Plane crashed at ${crash.toFixed(2)}x`,
              variant: "destructive",
            });
          }
          return crash;
        }
        return next;
      });
    }, 50);
  };

  const cashOut = () => {
    if (gameState === "flying" && !cashedOut) {
      setCashedOut(true);
      const winnings = (parseFloat(betAmount) * multiplier).toFixed(2);
      onWin(winnings);
      toast({
        title: "Cashed Out!",
        description: `You won ₹${winnings} at ${multiplier.toFixed(2)}x`,
      });
    }
  };

  return (
    <Card className="casino-card">
      <CardHeader>
        <CardTitle className="text-casino-gold">Crash Rocket</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {gameState === "betting" && (
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Bet Amount (₹)</label>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="bg-casino-secondary border-casino-accent text-white"
                min="10"
                max="50000"
              />
            </div>
            <Button onClick={startFlight} className="btn-casino-primary w-full">
              Start Flight - ₹{betAmount}
            </Button>
          </div>
        )}

        {(gameState === "flying" || gameState === "crashed") && (
          <div className="text-center space-y-6">
            <div className="text-6xl">🚀</div>
            <div className="text-4xl font-bold text-casino-gold">
              {multiplier.toFixed(2)}x
            </div>
            
            {gameState === "flying" && !cashedOut && (
              <Button onClick={cashOut} className="btn-casino-primary text-lg px-8 py-3">
                Cash Out: ₹{(parseFloat(betAmount) * multiplier).toFixed(2)}
              </Button>
            )}

            {(gameState === "crashed" || cashedOut) && (
              <div className="space-y-4">
                <div className="text-lg text-casino-text-muted">
                  {cashedOut ? `Cashed out at ${multiplier.toFixed(2)}x` : `Crashed at ${crashPoint.toFixed(2)}x`}
                </div>
                <div className="flex space-x-3">
                  <Button onClick={() => {
                    setGameState("betting");
                    setMultiplier(1.00);
                    setCashedOut(false);
                  }} className="btn-casino-secondary flex-1">
                    Play Again
                  </Button>
                  <Button onClick={onClose} className="btn-casino-outline flex-1">
                    Exit
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Slot Machine Game Logic
const SlotGame = ({ game, onWin, onClose }: GameEngineProps) => {
  const [betAmount, setBetAmount] = useState("100");
  const [reels, setReels] = useState(["🍎", "🍎", "🍎"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const { toast } = useToast();

  const symbols = ["🍎", "🍊", "🍋", "🍇", "🍉", "⭐", "💎", "🔔"];
  const winningCombos = {
    "💎💎💎": 50,
    "⭐⭐⭐": 25,
    "🔔🔔🔔": 15,
    "🍇🍇🍇": 10,
    "🍉🍉🍉": 8,
    "🍋🍋🍋": 6,
    "🍊🍊🍊": 4,
    "🍎🍎🍎": 2,
  };

  const spin = () => {
    setIsSpinning(true);
    
    const spinInterval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      setIsSpinning(false);
      
      const finalReels = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ];
      setReels(finalReels);
      
      const combination = finalReels.join("");
      const multiplier = winningCombos[combination as keyof typeof winningCombos];
      
      if (multiplier) {
        const winnings = (parseFloat(betAmount) * multiplier).toFixed(2);
        onWin(winnings);
        toast({
          title: "JACKPOT!",
          description: `${combination} - You won ₹${winnings}!`,
        });
      } else {
        toast({
          title: "No Match",
          description: "Try again for big wins!",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  return (
    <Card className="casino-card">
      <CardHeader>
        <CardTitle className="text-casino-gold">Bollywood Riches</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-casino-secondary rounded-lg p-6">
          <div className="flex justify-center space-x-4 mb-6">
            {reels.map((symbol, i) => (
              <div key={i} className={`w-20 h-20 bg-white rounded-lg flex items-center justify-center text-4xl border-4 ${isSpinning ? 'animate-spin' : ''}`}>
                {symbol}
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Bet Amount (₹)</label>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="bg-casino-primary border-casino-accent text-white"
                min="10"
                max="50000"
                disabled={isSpinning}
              />
            </div>
            
            <Button 
              onClick={spin} 
              disabled={isSpinning || !betAmount}
              className="btn-casino-primary w-full text-lg py-3"
            >
              {isSpinning ? "Spinning..." : `SPIN - ₹${betAmount}`}
            </Button>
          </div>
        </div>

        <div className="bg-casino-secondary rounded-lg p-4">
          <h4 className="text-casino-gold font-medium mb-2">Paytable</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-casino-text-muted">
            <div>💎💎💎 = 50x</div>
            <div>⭐⭐⭐ = 25x</div>
            <div>🔔🔔🔔 = 15x</div>
            <div>🍇🍇🍇 = 10x</div>
          </div>
        </div>

        <Button onClick={onClose} className="btn-casino-outline w-full">
          Exit Game
        </Button>
      </CardContent>
    </Card>
  );
};

// Main Game Engine Component
export function GameEngine({ game, onWin, onClose }: GameEngineProps) {
  const renderGame = () => {
    switch (game.category.toLowerCase()) {
      case "casino":
        if (game.title.toLowerCase().includes("teen patti")) {
          return <TeenPattiGame game={game} onWin={onWin} onClose={onClose} />;
        }
        return <TeenPattiGame game={game} onWin={onWin} onClose={onClose} />;
      
      case "mini games":
      case "minigames":
        if (game.title.toLowerCase().includes("crash")) {
          return <CrashGame game={game} onWin={onWin} onClose={onClose} />;
        }
        return <CrashGame game={game} onWin={onWin} onClose={onClose} />;
      
      case "slots":
        return <SlotGame game={game} onWin={onWin} onClose={onClose} />;
      
      default:
        return <SlotGame game={game} onWin={onWin} onClose={onClose} />;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {renderGame()}
    </div>
  );
}