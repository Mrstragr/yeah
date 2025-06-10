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
import type { GamePlayResult } from "@/lib/types";
import { DiceRollGame } from "@/components/games/dice-roll";
import { CoinFlipGame } from "@/components/games/coin-flip";

interface GamePlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  onWin: (amount: string) => void;
}

export function GamePlayModal({ isOpen, onClose, game, onWin }: GamePlayModalProps) {
  const [betAmount, setBetAmount] = useState("50");
  const [isPlaying, setIsPlaying] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const playGameMutation = useMutation({
    mutationFn: async (data: { gameId: number; userId: number; betAmount: string }): Promise<GamePlayResult> => {
      const response = await apiRequest("POST", `/api/games/${data.gameId}/play`, {
        userId: data.userId,
        betAmount: data.betAmount,
        gameType: game?.category?.toLowerCase(),
        gameData: {}
      });
      return response as GamePlayResult;
    },
    onSuccess: (result: GamePlayResult) => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/jackpot"] });
      
      if (result.result === "win") {
        onWin(result.winAmount);
        toast({
          title: "Congratulations!",
          description: `You won ₹${result.winAmount}! New balance: ₹${result.newBalance}`,
        });
      } else {
        toast({
          title: "Better luck next time!",
          description: `You lost ₹${betAmount}. New balance: ₹${result.newBalance}`,
          variant: "destructive",
        });
      }
      
      setIsPlaying(false);
      setTimeout(() => onClose(), 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Game Error",
        description: error.message || "Failed to play game",
        variant: "destructive",
      });
      setIsPlaying(false);
    }
  });

  const handlePlay = () => {
    if (!game || !betAmount) return;
    
    const amount = parseFloat(betAmount);
    if (amount < 10) {
      toast({
        title: "Invalid Bet",
        description: "Minimum bet amount is ₹10",
        variant: "destructive",
      });
      return;
    }

    if (user && parseFloat(user.walletBalance || "0") < amount) {
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
      userId: 1, // Demo user ID
      betAmount: betAmount,
    });
  };

  if (!isOpen || !game) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="game-card max-w-md">
        <DialogHeader>
          <DialogTitle className="font-gaming text-gaming-gold flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            {game.title}
          </DialogTitle>
          <DialogDescription className="text-gray-400 font-exo">
            Place your bet and test your luck with real Indian currency
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Wallet Balance Display */}
          <div className="bg-gaming-accent/30 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 font-exo">Wallet Balance</span>
              <div className="flex items-center">
                <Wallet className="w-4 h-4 mr-1 text-gaming-gold" />
                <span className="font-gaming font-semibold text-gaming-gold">
                  ₹{user?.walletBalance || "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Bet Amount Input */}
          <div>
            <Label htmlFor="bet-amount" className="font-gaming text-gray-300">
              Bet Amount (₹)
            </Label>
            <Input
              id="bet-amount"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="Enter bet amount"
              className="bg-gaming-accent border-gaming-border-light text-white"
              min="10"
              max={user?.walletBalance || "0"}
              disabled={isPlaying}
            />
            <p className="text-xs text-gray-400 mt-1 font-exo">
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

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPlaying}
            className="border-gaming-border-light text-gray-300 hover:bg-gaming-accent"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePlay}
            disabled={isPlaying || !betAmount || parseFloat(betAmount) < 10}
            className="btn-gaming-primary font-gaming"
          >
            {isPlaying ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Playing...
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                Play for ₹{betAmount}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}