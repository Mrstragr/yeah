import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, TrendingUp, RotateCcw } from "lucide-react";

interface DiceGameProps {
  gameId: number;
  gameTitle: string;
  onBet: (amount: number, prediction: any) => void;
  onClose: () => void;
}

export default function DiceGame({ gameId, gameTitle, onBet, onClose }: DiceGameProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [prediction, setPrediction] = useState(50);
  const [betType, setBetType] = useState<'over' | 'under'>('over');
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [gameHistory, setGameHistory] = useState<{roll: number, prediction: number, type: 'over' | 'under', won: boolean}[]>([]);
  const [currentDice, setCurrentDice] = useState(1);
  const { toast } = useToast();

  const betAmounts = [10, 50, 100, 500, 1000];

  const getDiceIcon = (value: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const IconComponent = icons[value - 1] || Dice1;
    return <IconComponent className="w-16 h-16 text-gaming-gold" />;
  };

  const calculateWinChance = () => {
    if (betType === 'over') {
      return ((100 - prediction) / 100) * 100;
    } else {
      return (prediction / 100) * 100;
    }
  };

  const calculateMultiplier = () => {
    const winChance = calculateWinChance();
    return (95 / winChance).toFixed(2); // 95% house edge
  };

  const rollDice = async () => {
    if (betAmount <= 0) {
      toast({
        title: "Invalid Bet",
        description: "Please enter a valid bet amount",
        variant: "destructive"
      });
      return;
    }

    setIsRolling(true);
    
    // Animate dice rolling
    const rollAnimation = setInterval(() => {
      setCurrentDice(Math.floor(Math.random() * 6) + 1);
    }, 100);

    // Roll after 2 seconds
    setTimeout(() => {
      clearInterval(rollAnimation);
      
      const roll = Math.floor(Math.random() * 100) + 1;
      setLastRoll(roll);
      setCurrentDice(Math.floor((roll - 1) / 16.67) + 1); // Convert 0-100 to 1-6 for display
      
      const won = (betType === 'over' && roll > prediction) || (betType === 'under' && roll < prediction);
      const winAmount = won ? Math.floor(betAmount * parseFloat(calculateMultiplier())) : 0;
      
      setGameHistory(prev => [{
        roll,
        prediction,
        type: betType,
        won
      }, ...prev.slice(0, 9)]);

      if (won) {
        toast({
          title: "You Won!",
          description: `Rolled ${roll}, won ₹${winAmount}`,
        });
        onBet(winAmount);
      } else {
        toast({
          title: "You Lost",
          description: `Rolled ${roll}, lost ₹${betAmount}`,
          variant: "destructive"
        });
        onBet(-betAmount);
      }
      
      setIsRolling(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gaming-dark rounded-lg w-full max-w-5xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-gaming font-bold text-gaming-gold">{gameTitle}</h2>
            <Button onClick={onClose} variant="outline" size="sm">
              Close
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Game Display */}
            <div className="lg:col-span-2">
              <Card className="game-card h-80 relative">
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="mb-6">
                    {isRolling ? (
                      <div className="animate-bounce">
                        {getDiceIcon(currentDice)}
                      </div>
                    ) : (
                      getDiceIcon(currentDice)
                    )}
                  </div>
                  
                  {lastRoll !== null && !isRolling && (
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gaming-gold mb-2">
                        {lastRoll}
                      </div>
                      <div className="text-casino-text-secondary">
                        Last Roll
                      </div>
                    </div>
                  )}
                  
                  {isRolling && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gaming-gold mb-2">
                        Rolling...
                      </div>
                      <div className="text-casino-text-secondary">
                        Good luck!
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Betting Controls */}
              <div className="mt-6 space-y-4">
                <Card className="game-card">
                  <CardHeader>
                    <CardTitle className="text-gaming-gold">Bet Amount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {betAmounts.map(amount => (
                        <Button
                          key={amount}
                          variant={betAmount === amount ? "default" : "outline"}
                          className={`${betAmount === amount ? 'bg-gaming-gold text-black' : ''}`}
                          onClick={() => setBetAmount(amount)}
                          disabled={isRolling}
                        >
                          ₹{amount}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
                        placeholder="Custom amount"
                        disabled={isRolling}
                      />
                      <Button
                        onClick={() => setBetAmount(betAmount * 2)}
                        disabled={isRolling}
                        variant="outline"
                        size="sm"
                      >
                        2x
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="game-card">
                  <CardHeader>
                    <CardTitle className="text-gaming-gold">Prediction</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                      <Button
                        variant={betType === 'under' ? "default" : "outline"}
                        className={`flex-1 ${betType === 'under' ? 'bg-red-600 text-white' : ''}`}
                        onClick={() => setBetType('under')}
                        disabled={isRolling}
                      >
                        Under {prediction}
                      </Button>
                      <Button
                        variant={betType === 'over' ? "default" : "outline"}
                        className={`flex-1 ${betType === 'over' ? 'bg-green-600 text-white' : ''}`}
                        onClick={() => setBetType('over')}
                        disabled={isRolling}
                      >
                        Over {prediction}
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-casino-text-secondary">Prediction Value</span>
                        <span className="text-white">{prediction}</span>
                      </div>
                      <Slider
                        value={[prediction]}
                        onValueChange={(value) => setPrediction(value[0])}
                        max={99}
                        min={1}
                        step={1}
                        disabled={isRolling}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-casino-text-muted">
                        <span>1</span>
                        <span>50</span>
                        <span>99</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-gaming-accent/20 rounded-lg">
                        <div className="text-lg font-bold text-gaming-gold">
                          {calculateWinChance().toFixed(1)}%
                        </div>
                        <div className="text-sm text-casino-text-secondary">Win Chance</div>
                      </div>
                      <div className="p-3 bg-gaming-accent/20 rounded-lg">
                        <div className="text-lg font-bold text-gaming-gold">
                          {calculateMultiplier()}x
                        </div>
                        <div className="text-sm text-casino-text-secondary">Multiplier</div>
                      </div>
                    </div>

                    <Button
                      onClick={rollDice}
                      disabled={isRolling}
                      className="w-full bg-gaming-gold text-black hover:bg-yellow-500 font-bold py-3"
                    >
                      {isRolling ? (
                        <div className="flex items-center">
                          <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                          Rolling...
                        </div>
                      ) : (
                        `Roll Dice - ₹${betAmount}`
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* History and Stats */}
            <div className="lg:col-span-1">
              <Card className="game-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-gaming-gold">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Game History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {gameHistory.length === 0 ? (
                      <div className="text-center text-casino-text-muted py-8">
                        No games played yet
                      </div>
                    ) : (
                      gameHistory.map((game, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            game.won ? 'bg-green-900/30 border border-green-600/30' : 'bg-red-900/30 border border-red-600/30'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className={`font-bold ${game.won ? 'text-green-400' : 'text-red-400'}`}>
                              {game.won ? 'WIN' : 'LOSS'}
                            </span>
                            <span className="text-white font-bold">
                              {game.roll}
                            </span>
                          </div>
                          <div className="text-sm text-casino-text-secondary">
                            {game.type} {game.prediction} • {game.won ? '✓' : '✗'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {gameHistory.length > 0 && (
                <Card className="game-card mt-4">
                  <CardHeader>
                    <CardTitle className="text-gaming-gold">Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-casino-text-secondary">Games Played</span>
                      <span className="text-white">{gameHistory.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-casino-text-secondary">Win Rate</span>
                      <span className="text-green-400">
                        {((gameHistory.filter(g => g.won).length / gameHistory.length) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-casino-text-secondary">Average Roll</span>
                      <span className="text-white">
                        {(gameHistory.reduce((sum, g) => sum + g.roll, 0) / gameHistory.length).toFixed(1)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}