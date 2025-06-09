import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Game } from "@shared/schema";
import type { GamePlayResult } from "@/lib/types";

interface GamePlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  onWin: (amount: string) => void;
}

export function GamePlayModal({ isOpen, onClose, game, onWin }: GamePlayModalProps) {
  const [betAmount, setBetAmount] = useState("100");
  const [isPlaying, setIsPlaying] = useState(false);
  const queryClient = useQueryClient();

  const playGameMutation = useMutation({
    mutationFn: async (data: { gameId: number; userId: number; betAmount: string }) => {
      const response = await fetch(`/api/games/${data.gameId}/play`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data.userId, betAmount: data.betAmount }),
      });
      if (!response.ok) throw new Error('Failed to play game');
      return response.json() as Promise<GamePlayResult>;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/jackpot"] });
      
      if (result.result === "win") {
        onWin(result.winAmount);
      }
      
      setTimeout(() => {
        setIsPlaying(false);
        onClose();
      }, 2000);
    },
    onError: () => {
      setIsPlaying(false);
    }
  });

  const handlePlay = () => {
    if (!game || !betAmount) return;
    
    setIsPlaying(true);
    playGameMutation.mutate({
      gameId: game.id,
      userId: 1, // Demo user ID
      betAmount: betAmount
    });
  };

  const handleClose = () => {
    if (!isPlaying) {
      onClose();
      setBetAmount("100");
    }
  };

  if (!game) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gaming-secondary border border-gaming-border-light max-w-md shadow-2xl backdrop-blur-sm">
        <DialogHeader>
          <div className="text-center mb-4">
            <img 
              src={game.imageUrl} 
              alt={game.title}
              className="w-20 h-20 rounded-lg mx-auto mb-4 object-cover shadow-lg border border-gaming-border"
            />
            <DialogTitle className="font-gaming font-bold text-2xl text-gaming-gold tracking-wide">
              {game.title}
            </DialogTitle>
            <DialogDescription className="text-gray-300 font-exo">
              {game.description}
            </DialogDescription>
          </div>
        </DialogHeader>

        {!isPlaying ? (
          <div className="space-y-6">
            <div className="bg-gaming-dark rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Current Jackpot:</span>
                <span className="text-gaming-gold font-bold">
                  ${parseFloat(game.jackpot).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Rating:</span>
                <div className="flex items-center">
                  <i className="fas fa-star text-gaming-gold mr-1"></i>
                  <span className="text-white">{game.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bet-amount" className="text-white">Bet Amount ($)</Label>
              <Input
                id="bet-amount"
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="bg-gaming-dark border-gray-700 text-white"
                min="1"
                max="10000"
              />
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
              <p className="text-yellow-400 text-sm text-center">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                Gambling can be addictive. Please play responsibly.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin text-gaming-gold text-4xl mb-4">
              <i className="fas fa-dice"></i>
            </div>
            <h3 className="font-orbitron font-bold text-xl text-white mb-2">
              Playing {game.title}...
            </h3>
            <p className="text-gray-400">Good luck!</p>
            
            {playGameMutation.data && (
              <div className="mt-6 animate-slide-in-up">
                {playGameMutation.data.result === "win" ? (
                  <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
                    <i className="fas fa-trophy text-gaming-gold text-3xl mb-2"></i>
                    <h4 className="font-bold text-gaming-gold text-lg">Congratulations!</h4>
                    <p className="text-white">You won ${parseFloat(playGameMutation.data.winAmount).toLocaleString()}!</p>
                  </div>
                ) : (
                  <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
                    <i className="fas fa-heart-broken text-red-400 text-3xl mb-2"></i>
                    <h4 className="font-bold text-red-400 text-lg">Better luck next time!</h4>
                    <p className="text-white">Try again with a different strategy.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!isPlaying && (
          <DialogFooter className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePlay}
              className="bg-gaming-gold hover:bg-gaming-amber text-black font-bold"
              disabled={!betAmount || parseFloat(betAmount) <= 0}
            >
              <i className="fas fa-play mr-2"></i>
              Play Now - ${betAmount}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}