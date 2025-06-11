import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Game } from "@shared/schema";

interface GameCardProps {
  game: Game;
  onPlay?: (game: Game) => void;
}

export function GameCard({ game, onPlay }: GameCardProps) {
  return (
    <Card className="casino-card group overflow-hidden cursor-pointer relative">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={game.imageUrl} 
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Premium Rating Badge */}
        <div className="absolute top-3 right-3 gold-gradient backdrop-blur-sm text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-yellow-400">
          ⭐ {game.rating}
        </div>
        
        {/* Hot Badge */}
        {parseFloat(game.jackpot) > 50000 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-gaming-red via-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
            <i className="fas fa-fire mr-1"></i>
            HOT
          </div>
        )}
        
        {/* Live Player Indicator */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/30 shadow-lg">
          <span className="inline-block w-2 h-2 bg-gaming-green rounded-full mr-2 animate-pulse"></span>
          {Math.floor(Math.random() * 500) + 100} live
        </div>
      </div>
      <CardContent className="p-6 bg-gaming-secondary/50">
        <h3 className="font-gaming font-bold text-white text-lg mb-2 group-hover:text-gaming-gold transition-colors duration-300 tracking-wide">
          {game.title}
        </h3>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">{game.description}</p>
        
        {parseFloat(game.jackpot) > 0 && (
          <div className="mb-4 p-3 bg-gradient-to-r from-gaming-gold/15 to-gaming-gold/5 border border-gaming-gold/40 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-gaming-gold text-sm font-gaming font-semibold flex items-center">
                <i className="fas fa-trophy mr-2 text-gaming-gold"></i>
                JACKPOT
              </span>
              <span className="text-gaming-gold font-gaming font-bold text-lg animate-pulse">
                ${parseFloat(game.jackpot).toLocaleString()}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="w-2 h-2 bg-gaming-green rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">LIVE</span>
            </div>
          </div>
          <Button 
            className="casino-button font-bold text-sm px-6 py-2 rounded-lg"
            onClick={() => onPlay?.(game)}
          >
            ▶ PLAY NOW
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
