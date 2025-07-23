import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Timer, Coins, TrendingUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface GamePeriod {
  id: number;
  gameType: string;
  period: string;
  status: string;
  startTime: string;
}

interface UserBet {
  id: number;
  betType: string;
  betValue: string;
  betAmount: string;
  multiplier: string;
  status: string;
}

interface Props {
  onBack?: () => void;
}

export default function RealMoneyWinGo({ onBack }: Props) {
  const [selectedBetType, setSelectedBetType] = useState<"color" | "number" | "size">("color");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [betAmount, setBetAmount] = useState<number>(10);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [gamePhase, setGamePhase] = useState<"betting" | "drawing" | "result">("betting");
  const queryClient = useQueryClient();

  // Fetch current game period
  const { data: currentPeriod, isLoading: periodLoading } = useQuery({
    queryKey: ['/api/games/wingo/current-period'],
    refetchInterval: 1000, // Refresh every second
  });

  // Fetch user's active bets
  const { data: userBets } = useQuery({
    queryKey: ['/api/games/wingo/my-bets'],
  });

  // Fetch wallet balance
  const { data: walletData } = useQuery({
    queryKey: ['/api/wallet/balance'],
    refetchInterval: 5000,
  });

  // Place bet mutation
  const placeBetMutation = useMutation({
    mutationFn: async ({ betType, betValue, betAmount, multiplier }: any) => {
      const response = await apiRequest("POST", "/api/games/bet", {
        gameType: "wingo",
        betType,
        betValue,
        betAmount,
        multiplier,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Bet Placed Successfully!",
          description: `₹${betAmount} bet placed on ${selectedValue}`,
        });
        setSelectedValue("");
        queryClient.invalidateQueries({ queryKey: ['/api/games/wingo/my-bets'] });
        queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Bet Failed",
        description: error.message || "Failed to place bet",
        variant: "destructive",
      });
    },
  });

  // Game timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (gamePhase === "betting" && timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else if (timeLeft === 0 && gamePhase === "betting") {
        setGamePhase("drawing");
        setTimeLeft(5); // 5 seconds for drawing
      } else if (gamePhase === "drawing" && timeLeft === 0) {
        setGamePhase("result");
        setTimeLeft(10); // 10 seconds for result display
      } else if (gamePhase === "result" && timeLeft === 0) {
        setGamePhase("betting");
        setTimeLeft(30); // New betting round
      } else if (gamePhase !== "betting" && timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gamePhase]);

  const handlePlaceBet = () => {
    if (!selectedValue) {
      toast({
        title: "Select Option",
        description: "Please choose a color, number, or size to bet on",
        variant: "destructive",
      });
      return;
    }

    if (betAmount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Minimum bet amount is ₹1",
        variant: "destructive",
      });
      return;
    }

    if (gamePhase !== "betting") {
      toast({
        title: "Betting Closed",
        description: "Please wait for the next round",
        variant: "destructive",
      });
      return;
    }

    let multiplier = 2; // Default multiplier
    if (selectedBetType === "color" && selectedValue === "violet") multiplier = 4.5;
    if (selectedBetType === "number") multiplier = 9;

    placeBetMutation.mutate({
      betType: selectedBetType,
      betValue: selectedValue,
      betAmount,
      multiplier,
    });
  };

  const colors = [
    { name: "green", multiplier: "2x", bgColor: "bg-green-500" },
    { name: "violet", multiplier: "4.5x", bgColor: "bg-purple-500" },
    { name: "red", multiplier: "2x", bgColor: "bg-red-500" },
  ];

  const numbers = Array.from({ length: 10 }, (_, i) => ({
    number: i,
    multiplier: "9x",
    color: i === 0 || i === 5 ? "purple" : [1, 3, 7, 9].includes(i) ? "green" : "red",
  }));

  const sizes = [
    { name: "small", multiplier: "2x", range: "0-4" },
    { name: "big", multiplier: "2x", range: "5-9" },
  ];

  const currentBalance = walletData?.balance ? parseFloat(walletData.balance) : 0;
  const activeBets: UserBet[] = userBets?.bets || [];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Game Header with Timer */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-6 h-6" />
              WinGo Game
            </div>
            {onBack && (
              <button 
                onClick={onBack}
                className="text-white/80 hover:text-white text-sm font-medium"
              >
                ← Back
              </button>
            )}
            <div className="text-right">
              <div className="text-sm opacity-80">Period: {currentPeriod?.period || "Loading..."}</div>
              <div className="text-lg font-bold">
                {gamePhase === "betting" && `Betting: ${timeLeft}s`}
                {gamePhase === "drawing" && `Drawing: ${timeLeft}s`}
                {gamePhase === "result" && `Result: ${timeLeft}s`}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              <span>Balance: ₹{currentBalance.toFixed(2)}</span>
            </div>
            <div className="text-sm">
              Status: {gamePhase === "betting" ? "🟢 Open for Bets" : 
                      gamePhase === "drawing" ? "🟡 Drawing..." : "🔴 Result Time"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Bets */}
      {activeBets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Your Active Bets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {activeBets.map((bet) => (
                <div key={bet.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{bet.betValue}</div>
                    <div className="text-sm text-gray-600">({bet.betType})</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{parseFloat(bet.betAmount).toFixed(2)}</div>
                    <div className="text-sm text-green-600">{parseFloat(bet.multiplier).toFixed(1)}x</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Betting Options */}
      {gamePhase === "betting" && (
        <div className="grid gap-6">
          {/* Color Betting */}
          <Card>
            <CardHeader>
              <CardTitle>Select Color</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {colors.map((color) => (
                  <Button
                    key={color.name}
                    variant={selectedBetType === "color" && selectedValue === color.name ? "default" : "outline"}
                    onClick={() => {
                      setSelectedBetType("color");
                      setSelectedValue(color.name);
                    }}
                    className={`h-16 flex flex-col gap-1 ${color.bgColor} text-white hover:opacity-80`}
                  >
                    <div className="capitalize font-semibold">{color.name}</div>
                    <div className="text-xs">{color.multiplier}</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Number Betting */}
          <Card>
            <CardHeader>
              <CardTitle>Select Number</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {numbers.map((num) => (
                  <Button
                    key={num.number}
                    variant={selectedBetType === "number" && selectedValue === num.number.toString() ? "default" : "outline"}
                    onClick={() => {
                      setSelectedBetType("number");
                      setSelectedValue(num.number.toString());
                    }}
                    className={`h-16 flex flex-col gap-1 ${
                      num.color === "green" ? "bg-green-500 text-white" :
                      num.color === "red" ? "bg-red-500 text-white" :
                      "bg-purple-500 text-white"
                    } hover:opacity-80`}
                  >
                    <div className="text-lg font-bold">{num.number}</div>
                    <div className="text-xs">{num.multiplier}</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Size Betting */}
          <Card>
            <CardHeader>
              <CardTitle>Select Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {sizes.map((size) => (
                  <Button
                    key={size.name}
                    variant={selectedBetType === "size" && selectedValue === size.name ? "default" : "outline"}
                    onClick={() => {
                      setSelectedBetType("size");
                      setSelectedValue(size.name);
                    }}
                    className="h-16 flex flex-col gap-1"
                  >
                    <div className="capitalize font-semibold">{size.name}</div>
                    <div className="text-xs">{size.range} • {size.multiplier}</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bet Amount & Place Bet */}
          <Card>
            <CardHeader>
              <CardTitle>Place Your Bet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bet Amount</label>
                <div className="flex gap-2">
                  {[10, 50, 100, 500, 1000].map((amount) => (
                    <Button
                      key={amount}
                      variant={betAmount === amount ? "default" : "outline"}
                      onClick={() => setBetAmount(amount)}
                      size="sm"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedValue && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-800">
                    <div>Selected: <strong>{selectedValue}</strong> ({selectedBetType})</div>
                    <div>Bet Amount: <strong>₹{betAmount}</strong></div>
                    <div>Potential Win: <strong>₹{(betAmount * (
                      selectedBetType === "color" && selectedValue === "violet" ? 4.5 :
                      selectedBetType === "number" ? 9 : 2
                    )).toFixed(2)}</strong></div>
                  </div>
                </div>
              )}

              <Button
                onClick={handlePlaceBet}
                disabled={placeBetMutation.isPending || !selectedValue || betAmount > currentBalance}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {placeBetMutation.isPending ? "Placing Bet..." : 
                 betAmount > currentBalance ? "Insufficient Balance" :
                 selectedValue ? `Place Bet ₹${betAmount}` : "Select Option"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game Status Display */}
      {gamePhase !== "betting" && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-2xl font-bold mb-4">
              {gamePhase === "drawing" && "🎲 Drawing in progress..."}
              {gamePhase === "result" && "🎉 Result announced!"}
            </div>
            <div className="text-lg text-gray-600">
              Next round starts in {timeLeft} seconds
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}