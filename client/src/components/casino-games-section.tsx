import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GamePlayModal } from "@/components/game-play-modal";
import { PlayCircle, ArrowRight } from "lucide-react";

interface CasinoGame {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: string;
  imageUrl?: string;
  rating?: string;
  isActive?: boolean;
  jackpot?: string;
}

const casinoGames: CasinoGame[] = [
  {
    id: 206,
    title: 'Aviator',
    description: 'Watch the plane fly and cash out before it crashes',
    category: 'crash',
    icon: '✈️'
  },
  {
    id: 173,
    title: 'Coin Flip',
    description: 'Simple heads or tails betting',
    category: 'minigames',
    icon: '🪙'
  },
  {
    id: 172,
    title: 'Dice Roll',
    description: 'Roll the dice and predict combinations',
    category: 'minigames',
    icon: '🎲'
  },
  {
    id: 207,
    title: 'Plinko Casino',
    description: 'Drop the ball and watch it bounce through pegs! Hit the 25x multiplier slot for massive wins!',
    category: 'Casino',
    icon: '🎯'
  },
  {
    id: 999,
    title: 'Scratch Cards',
    description: 'Instant win scratch cards',
    category: 'minigames',
    icon: '🎫'
  }
];

export function CasinoGamesSection() {
  const [showGameModal, setShowGameModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<CasinoGame | null>(null);

  const handlePlayGame = (game: CasinoGame) => {
    setSelectedGame(game);
    setShowGameModal(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-casino font-bold text-casino-gold">
            🎰 Popular Casino Games
          </h2>
          <Button variant="ghost" size="sm" className="text-casino-gold">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {casinoGames.map((game) => (
            <Card key={game.id} className="game-card cursor-pointer group" onClick={() => handlePlayGame(game)}>
              <CardContent className="p-4">
                <div className="aspect-square bg-gradient-to-br from-casino-gold to-casino-orange rounded-xl flex items-center justify-center text-3xl mb-3">
                  {game.icon}
                </div>
                <h3 className="font-casino font-bold text-white text-center text-sm truncate mb-2">
                  {game.title}
                </h3>
                <div className="text-center">
                  <Button size="sm" className="btn-casino-primary w-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Play Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Game Play Modal */}
      {showGameModal && selectedGame && (
        <GamePlayModal
          isOpen={showGameModal}
          onClose={() => setShowGameModal(false)}
          game={{
            ...selectedGame,
            imageUrl: selectedGame.imageUrl || '',
            rating: selectedGame.rating || '4.5',
            isActive: selectedGame.isActive || true,
            jackpot: selectedGame.jackpot || '₹1,00,000'
          }}
          onWin={(amount: string) => {
            console.log(`Won ${amount} in ${selectedGame.title}`);
            setShowGameModal(false);
          }}
        />
      )}
    </>
  );
}