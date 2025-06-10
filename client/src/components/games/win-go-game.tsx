import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Timer, Coins, TrendingUp, History } from "lucide-react";

interface WinGoGameProps {
  gameId: number;
  gameTitle: string;
  onBet: (amount: number, choice: string) => void;
  onClose: () => void;
}

export default function WinGoGame({ gameId, gameTitle, onBet, onClose }: WinGoGameProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [currentRound, setCurrentRound] = useState(202412101);
  const [isGameActive, setIsGameActive] = useState(true);
  const { toast } = useToast();

  const betAmounts = [10, 50, 100, 500, 1000];
  const colorChoices = [
    { name: "Green", value: "green", color: "bg-green-500", odds: "1:2" },
    { name: "Red", value: "red", color: "bg-red-500", odds: "1:2" },
    { name: "Violet", value: "violet", color: "bg-purple-500", odds: "1:4.5" }
  ];

  const numberChoices = Array.from({ length: 10 }, (_, i) => ({
    number: i,
    color: i === 0 || i === 5 ? "violet" : i % 2 === 0 ? "red" : "green",
    odds: "1:9"
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Start new round
          const newResult = Math.floor(Math.random() * 10);
          const resultColor = newResult === 0 || newResult === 5 ? "violet" : 
                             newResult % 2 === 0 ? "red" : "green";
          
          setGameHistory(prev => [{
            round: currentRound,
            result: newResult,
            color: resultColor,
            time: new Date().toLocaleTimeString()
          }, ...prev.slice(0, 9)]);
          
          setCurrentRound(prev => prev + 1);
          setIsGameActive(false);
          
          // Allow betting for next round after 5 seconds
          setTimeout(() => {
            setIsGameActive(true);
            setSelectedChoice(null);
          }, 5000);
          
          return 60;
        }
        
        if (prev === 30) {
          setIsGameActive(false);
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentRound]);

  const handleBet = () => {
    if (!selectedChoice || betAmount <= 0) {
      toast({
        title: "Invalid Bet",
        description: "Please select an amount and choice",
        variant: "destructive"
      });
      return;
    }

    onBet(betAmount, selectedChoice);
    toast({
      title: "Bet Placed",
      description: `₹${betAmount} on ${selectedChoice}`,
    });
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "green": return "bg-green-500";
      case "red": return "bg-red-500";
      case "violet": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gaming-dark rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-gaming font-bold text-gaming-gold">{gameTitle}</h2>
            <Button onClick={onClose} variant="outline" size="sm">
              Close
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Game Timer and Info */}
            <div className="lg:col-span-1">
              <Card className="game-card mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center text-gaming-gold">
                    <Timer className="w-5 h-5 mr-2" />
                    Round {currentRound}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-casino-text-secondary mb-4">
                      {timeLeft > 30 ? "Betting Open" : "Betting Closed"}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gaming-gold h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(timeLeft / 60) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Results */}
              <Card className="game-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-gaming-gold">
                    <History className="w-5 h-5 mr-2" />
                    Recent Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {gameHistory.map((result, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-casino-text-secondary">#{result.round}</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded ${getColorClass(result.color)} flex items-center justify-center text-white text-xs font-bold`}>
                            {result.result}
                          </div>
                          <span className="text-white">{result.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Betting Area */}
            <div className="lg:col-span-2">
              {/* Bet Amount Selection */}
              <Card className="game-card mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center text-gaming-gold">
                    <Coins className="w-5 h-5 mr-2" />
                    Select Bet Amount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {betAmounts.map(amount => (
                      <Button
                        key={amount}
                        variant={betAmount === amount ? "default" : "outline"}
                        className={`${betAmount === amount ? 'bg-gaming-gold text-black' : ''}`}
                        onClick={() => setBetAmount(amount)}
                        disabled={!isGameActive}
                      >
                        ₹{amount}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Color Betting */}
              <Card className="game-card mb-4">
                <CardHeader>
                  <CardTitle className="text-gaming-gold">Choose Color</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {colorChoices.map(choice => (
                      <Button
                        key={choice.value}
                        className={`h-16 ${choice.color} hover:opacity-80 text-white ${
                          selectedChoice === choice.value ? 'ring-4 ring-gaming-gold' : ''
                        }`}
                        onClick={() => setSelectedChoice(choice.value)}
                        disabled={!isGameActive}
                      >
                        <div className="text-center">
                          <div className="font-bold">{choice.name}</div>
                          <div className="text-sm opacity-90">{choice.odds}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Number Betting */}
              <Card className="game-card mb-4">
                <CardHeader>
                  <CardTitle className="text-gaming-gold">Choose Number</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {numberChoices.map(choice => (
                      <Button
                        key={choice.number}
                        className={`h-16 ${getColorClass(choice.color)} hover:opacity-80 text-white ${
                          selectedChoice === choice.number.toString() ? 'ring-4 ring-gaming-gold' : ''
                        }`}
                        onClick={() => setSelectedChoice(choice.number.toString())}
                        disabled={!isGameActive}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold">{choice.number}</div>
                          <div className="text-xs opacity-90">{choice.odds}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Place Bet Button */}
              <div className="flex justify-between items-center">
                <div className="text-casino-text-secondary">
                  Selected: {selectedChoice ? (
                    <Badge variant="default" className="ml-2">
                      {selectedChoice} - ₹{betAmount}
                    </Badge>
                  ) : "None"}
                </div>
                <Button
                  onClick={handleBet}
                  disabled={!selectedChoice || !isGameActive}
                  className="bg-gaming-gold text-black hover:bg-yellow-500 px-8 py-3 font-bold"
                >
                  Place Bet ₹{betAmount}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}