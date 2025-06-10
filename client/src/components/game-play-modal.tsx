import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Trophy, AlertCircle } from "lucide-react";
import type { Game } from "@shared/schema";
import type { GamePlayResult, User } from "@/lib/types";
import DiceRoll from "@/components/games/dice-roll";
import CoinFlip from "@/components/games/coin-flip";

interface GamePlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  onWin: (amount: string) => void;
}

export function GamePlayModal({ isOpen, onClose, game, onWin }: GamePlayModalProps) {
  const [betAmount, setBetAmount] = useState("100");
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const playGameMutation = useMutation({
    mutationFn: async (requestData: { gameId: number; userId: number; betAmount: string }): Promise<GamePlayResult> => {
      const response = await apiRequest("POST", `/api/games/${requestData.gameId}/play`, {
        userId: requestData.userId,
        betAmount: requestData.betAmount,
        gameType: game?.category?.toLowerCase(),
        gameData: {}
      });
      const result = await response.json();
      return result as GamePlayResult;
    },
    onSuccess: (result: GamePlayResult) => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/jackpot"] });
      
      if (result.result === "win") {
        toast({
          title: "🎉 Congratulations!",
          description: `You won ₹${result.winAmount}!`,
          variant: "default",
        });
        onWin(result.winAmount);
      } else {
        toast({
          title: "Better luck next time!",
          description: `You lost ₹${betAmount}`,
          variant: "destructive",
        });
      }
      setIsPlaying(false);
    },
    onError: (error: any) => {
      console.error("Game play error:", error);
      toast({
        title: "Game Error",
        description: error.message || "Something went wrong while playing the game",
        variant: "destructive",
      });
      setIsPlaying(false);
    },
  });

  const handlePlay = async () => {
    if (!user || !game) return;

    const amount = parseFloat(betAmount);
    if (amount < 10) {
      toast({
        title: "Invalid Bet Amount",
        description: "Minimum bet amount is ₹10",
        variant: "destructive",
      });
      return;
    }

    const userBalance = parseFloat(user?.walletBalance || "0");
    if (userBalance < amount) {
      toast({
        title: "Insufficient Balance",
        description: "Please add money to your wallet to continue playing",
        variant: "destructive",
      });
      return;
    }

    setIsPlaying(true);
    playGameMutation.mutate({
      gameId: game.id,
      userId: user.id,
      betAmount: betAmount,
    });
  };

  if (!isOpen || !game) return null;

  // Handle specific games with custom components
  if (game.title === "Dice Roll") {
    return (
      <DiceRoll 
        userBalance={user?.walletBalance || "0"}
        onBet={async (amount: number, gameData: any) => {
          await new Promise((resolve) => {
            onWin(amount.toString());
            queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
            resolve(undefined);
          });
        }}
      />
    );
  }

  if (game.title === "Coin Flip") {
    return (
      <CoinFlip 
        userBalance={user?.walletBalance || "0"}
        onBet={async (amount: number, gameData: any) => {
          await new Promise((resolve) => {
            onWin(amount.toString());
            queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
            resolve(undefined);
          });
        }}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="game-card max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-gaming-gold font-gaming">
            <Trophy className="w-5 h-5 mr-2" />
            {game.title}
          </DialogTitle>
          <DialogDescription className="text-gray-400 font-exo">
            {game.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Balance */}
          <div className="bg-gaming-accent/20 p-4 rounded-lg border border-gaming-border-light">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="w-4 h-4 text-gaming-gold mr-2" />
                <span className="text-gray-300 font-exo">Your Balance:</span>
              </div>
              <Badge variant="secondary" className="bg-green-600 text-white font-gaming">
                ₹{parseFloat(user?.walletBalance || "0").toLocaleString()}
              </Badge>
            </div>
          </div>

          {/* Bet Amount */}
          <div className="space-y-3">
            <Label htmlFor="bet-amount" className="text-gaming-gold font-exo">
              Bet Amount (₹)
            </Label>
            <Input
              id="bet-amount"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              min="10"
              max={parseFloat(user?.walletBalance || "0")}
              className="bg-gaming-surface border-gaming-border-light text-white font-gaming"
              disabled={isPlaying}
            />
            <p className="text-xs text-gray-400 font-exo">
              Min: ₹10 | Max: ₹{user?.walletBalance || "0"}
            </p>
          </div>

          {/* Quick Bet Buttons */}
          <div className="flex gap-2 flex-wrap">
            {["50", "100", "200", "500"].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setBetAmount(amount)}
                disabled={isPlaying || parseFloat(user?.walletBalance || "0") < parseFloat(amount)}
                className="border-gaming-border-light text-gaming-gold hover:bg-gaming-accent"
              >
                ₹{amount}
              </Button>
            ))}
          </div>

          {/* Game Info */}
          <div className="bg-gaming-accent/20 p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-exo">Win Chance:</span>
              <span className="text-green-400 font-gaming">35%</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-400 font-exo">Max Multiplier:</span>
              <span className="text-gaming-gold font-gaming">5x</span>
            </div>
          </div>

          {/* Insufficient Balance Warning */}
          {user && parseFloat(user.walletBalance || "0") < parseFloat(betAmount) && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                <p className="text-red-400 text-sm font-exo">
                  Insufficient wallet balance. Please add money to continue.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gaming-border-light text-gray-300 hover:bg-gaming-accent/50"
            disabled={isPlaying}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePlay}
            disabled={isPlaying || !user || parseFloat(user?.walletBalance || "0") < parseFloat(betAmount)}
            className="bg-gradient-to-r from-gaming-gold to-yellow-500 text-black font-gaming hover:from-yellow-500 hover:to-gaming-gold"
          >
            {isPlaying ? "Playing..." : `Play for ₹${betAmount}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}