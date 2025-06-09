import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/game-card";
import { GamePlayModal } from "@/components/game-play-modal";
import { JackpotModal } from "@/components/jackpot-modal";
import { LiveCasino } from "@/components/live-casino";
import { SportsBetting } from "@/components/sports-betting";
import { LotteryGames } from "@/components/lottery-games";
import { SlotMachines } from "@/components/slot-machines";
import { Card, CardContent } from "@/components/ui/card";
import type { GameCategory, Game } from "@shared/schema";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug;
  const [showGameModal, setShowGameModal] = useState(false);
  const [showJackpotModal, setShowJackpotModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [winAmount, setWinAmount] = useState<string>("0");

  const { data: category, isLoading: categoryLoading } = useQuery<GameCategory>({
    queryKey: [`/api/categories/${slug}`],
    enabled: !!slug,
  });

  const { data: games, isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: [`/api/games?category=${slug}`],
    enabled: !!slug,
  });

  const handlePlayGame = (game: Game) => {
    setSelectedGame(game);
    setShowGameModal(true);
  };

  const handleGameWin = (amount: string) => {
    setWinAmount(amount);
    setShowGameModal(false);
    if (parseFloat(amount) > 10000) {
      setShowJackpotModal(true);
    }
  };

  // Handle specialized gambling categories
  const renderSpecializedCategory = () => {
    switch (slug?.toLowerCase()) {
      case 'casino':
      case 'live-casino':
        return <LiveCasino />;
      case 'sports':
      case 'sports-betting':
        return <SportsBetting />;
      case 'lottery':
        return <LotteryGames />;
      case 'slots':
        return <SlotMachines />;
      default:
        return null;
    }
  };

  const specializedContent = renderSpecializedCategory();
  if (specializedContent) {
    return (
      <div className="min-h-screen bg-casino-primary">
        <div className="container mx-auto px-4 py-6">
          {specializedContent}
        </div>
      </div>
    );
  }

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-casino-primary text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-casino-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-casino-text-muted">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-casino-primary text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-casino-gold text-4xl mb-4">⚠️</div>
          <h1 className="font-casino font-bold text-2xl mb-2 text-casino-gold">Category Not Found</h1>
          <p className="text-casino-text-muted">The requested game category could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-dark text-white">
      {/* Category Header */}
      <section className="bg-gradient-to-r from-gaming-charcoal to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`bg-gradient-to-br ${category.color} rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6`}>
              <i className={`${category.icon} text-white text-3xl`}></i>
            </div>
            <h1 className="font-orbitron font-bold text-4xl md:text-5xl text-white mb-4">
              {category.name}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {category.description} - Discover the best games in this category
            </p>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-orbitron font-bold text-2xl text-white mb-2">
                {category.name} Games
              </h2>
              <p className="text-gray-400">
                {gamesLoading ? "Loading..." : `${games?.length || 0} games available`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select className="bg-gaming-charcoal text-white border border-gray-700 rounded-lg px-4 py-2">
                <option>Sort by Popularity</option>
                <option>Sort by Rating</option>
                <option>Sort by Jackpot</option>
              </select>
            </div>
          </div>

          {gamesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="bg-gaming-charcoal animate-pulse">
                  <div className="w-full h-48 bg-gray-700"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-700 rounded w-16"></div>
                      <div className="h-8 bg-gray-700 rounded w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : games && games.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {games.map((game, index) => (
                <div key={game.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <GameCard game={game} onPlay={handlePlayGame} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <i className="fas fa-gamepad text-gaming-gold text-6xl mb-6"></i>
              <h3 className="font-orbitron font-bold text-2xl text-white mb-4">
                No Games Available
              </h3>
              <p className="text-gray-400 mb-8">
                We're working on adding more games to this category. Check back soon!
              </p>
              <Button className="bg-gaming-gold hover:bg-gaming-amber text-black font-semibold">
                Browse Other Categories
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Category Features */}
      <section className="py-16 bg-gaming-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-orbitron font-bold text-3xl text-white mb-4">
              Why Choose {category.name}?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gaming-dark p-6 text-center">
              <i className="fas fa-trophy text-gaming-gold text-3xl mb-4"></i>
              <h3 className="font-semibold text-white text-lg mb-2">High Payouts</h3>
              <p className="text-gray-400">
                Experience the highest payout rates in the industry with our premium games.
              </p>
            </Card>
            
            <Card className="bg-gaming-dark p-6 text-center">
              <i className="fas fa-shield-alt text-gaming-gold text-3xl mb-4"></i>
              <h3 className="font-semibold text-white text-lg mb-2">Fair Gaming</h3>
              <p className="text-gray-400">
                All our games are certified fair and use verified random number generators.
              </p>
            </Card>
            
            <Card className="bg-gaming-dark p-6 text-center">
              <i className="fas fa-headset text-gaming-gold text-3xl mb-4"></i>
              <h3 className="font-semibold text-white text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-400">
                Get instant help from our professional support team whenever you need it.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <GamePlayModal
        isOpen={showGameModal}
        onClose={() => setShowGameModal(false)}
        game={selectedGame}
        onWin={handleGameWin}
      />

      <JackpotModal 
        isOpen={showJackpotModal} 
        onClose={() => setShowJackpotModal(false)}
        winAmount={parseFloat(winAmount).toLocaleString()}
      />
    </div>
  );
}
