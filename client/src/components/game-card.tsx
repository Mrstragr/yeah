import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Game } from "@shared/schema";

interface GameCardProps {
  game: Game;
  onPlay?: (gameId: number) => void;
}

export function GameCard({ game, onPlay }: GameCardProps) {
  return (
    <Card className="bg-gaming-dark hover:shadow-2xl hover:shadow-gaming-gold/20 transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={game.imageUrl} 
          alt={game.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <CardContent className="p-6">
        <h3 className="font-semibold text-white text-lg mb-2">{game.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{game.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fas fa-star text-gaming-gold"></i>
            <span className="text-white font-medium">{game.rating}</span>
          </div>
          <Button 
            className="bg-gaming-gold hover:bg-gaming-amber text-black font-semibold"
            size="sm"
            onClick={() => onPlay?.(game.id)}
          >
            Play Now
          </Button>
        </div>
        {parseFloat(game.jackpot) > 0 && (
          <div className="mt-4 p-2 bg-gaming-gold/10 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gaming-gold text-sm font-medium">Jackpot:</span>
              <span className="text-gaming-gold font-bold">
                ${parseFloat(game.jackpot).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
