import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Game } from "@shared/schema";

interface GameCardProps {
  game: Game;
  onPlay?: (game: Game) => void;
}

export function GameCard({ game, onPlay }: GameCardProps) {
  return (
    <Card className="bg-gaming-dark hover:shadow-2xl hover:shadow-gaming-gold/20 transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden group">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={game.imageUrl} 
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2 right-2 bg-gaming-gold text-black px-2 py-1 rounded-full text-xs font-bold">
          <i className="fas fa-star mr-1"></i>
          {game.rating}
        </div>
        {parseFloat(game.jackpot) > 50000 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
            HOT
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-gaming-gold transition-colors duration-200">
          {game.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{game.description}</p>
        
        {parseFloat(game.jackpot) > 0 && (
          <div className="mb-4 p-3 bg-gradient-to-r from-gaming-gold/10 to-gaming-amber/10 border border-gaming-gold/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gaming-gold text-sm font-medium flex items-center">
                <i className="fas fa-trophy mr-1"></i>
                Jackpot:
              </span>
              <span className="text-gaming-gold font-bold animate-pulse">
                ${parseFloat(game.jackpot).toLocaleString()}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <i className="fas fa-users text-gray-400 text-xs"></i>
              <span className="text-gray-400 text-xs">
                {Math.floor(Math.random() * 500) + 100} playing
              </span>
            </div>
          </div>
          <Button 
            className="bg-gaming-gold hover:bg-gaming-amber text-black font-semibold transition-all duration-200 hover:scale-105"
            size="sm"
            onClick={() => onPlay?.(game)}
          >
            <i className="fas fa-play mr-2"></i>
            Play Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
