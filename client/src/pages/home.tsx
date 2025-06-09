import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GameCard } from "@/components/game-card";
import { JackpotModal } from "@/components/jackpot-modal";
import { GamePlayModal } from "@/components/game-play-modal";
import { LiveTicker } from "@/components/live-ticker";
import type { GameCategory, Game } from "@shared/schema";
import type { TopEarner, JackpotStats } from "@/lib/types";

export default function Home() {
  const [showJackpotModal, setShowJackpotModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [winAmount, setWinAmount] = useState<string>("0");

  const { data: categories, isLoading: categoriesLoading } = useQuery<GameCategory[]>({
    queryKey: ["/api/categories"],
  });

  const { data: recommendedGames, isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ["/api/games?recommended=true"],
  });

  const { data: topEarners, isLoading: leaderboardLoading } = useQuery<TopEarner[]>({
    queryKey: ["/api/leaderboard"],
  });

  const { data: jackpotStats } = useQuery<JackpotStats>({
    queryKey: ["/api/stats/jackpot"],
  });

  const handlePlayGame = (game: Game) => {
    setSelectedGame(game);
    setShowGameModal(true);
  };

  const handleGameWin = (amount: string) => {
    setWinAmount(amount);
    setShowGameModal(false);
    // Large wins trigger jackpot modal
    if (parseFloat(amount) > 10000) {
      setShowJackpotModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gaming-dark text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-charcoal via-gray-900 to-gaming-dark"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-2 h-2 bg-gaming-gold rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-1 h-1 bg-gaming-amber rounded-full animate-pulse delay-75"></div>
          <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-gaming-emerald rounded-full animate-pulse delay-150"></div>
          <div className="absolute bottom-32 right-1/3 w-2 h-2 bg-gaming-gold rounded-full animate-pulse delay-300"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="font-orbitron font-black text-4xl md:text-6xl lg:text-7xl mb-6">
              <span className="text-white">Welcome to the</span>
              <span className="text-gaming-gold animate-glow block">Ultimate Gaming</span>
              <span className="text-white">Experience</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of players in the most exciting online gaming platform. 
              Win big with our premium games and exclusive tournaments.
            </p>
            
            {/* Jackpot Display */}
            <div className="bg-gradient-to-r from-gaming-gold to-gaming-amber text-black rounded-2xl p-6 mb-8 max-w-md mx-auto animate-pulse-gold">
              <div className="flex items-center justify-center space-x-3">
                <i className="fas fa-trophy text-2xl"></i>
                <div>
                  <p className="font-semibold text-sm">MEGA JACKPOT</p>
                  <p className="font-orbitron font-black text-2xl">
                    ${jackpotStats ? parseFloat(jackpotStats.totalJackpot).toLocaleString() : "2,847,392"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-gaming-gold hover:bg-gaming-amber text-black font-bold py-4 px-8 rounded-xl"
                size="lg"
              >
                <i className="fas fa-play mr-2"></i>Start Playing Now
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-gaming-gold text-gaming-gold hover:bg-gaming-gold hover:text-black font-bold py-4 px-8 rounded-xl"
                size="lg"
              >
                <i className="fas fa-gamepad mr-2"></i>Explore Games
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Winning Information */}
      <section className="bg-gradient-to-r from-gaming-charcoal to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 rounded-xl p-6 border border-gaming-gold/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gaming-gold rounded-full p-3">
                  <i className="fas fa-trophy text-black text-xl"></i>
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-gaming-gold text-lg">Latest Winning Information</h3>
                  <p className="text-gray-300">Congratulations to our recent winners!</p>
                </div>
              </div>
              <Button className="bg-gaming-gold hover:bg-gaming-amber text-black font-semibold">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Game Categories */}
      <section className="py-16 bg-gaming-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-orbitron font-bold text-3xl md:text-4xl text-white mb-4">Game Categories</h2>
            <p className="text-gray-400 text-lg">Choose from our wide selection of premium games</p>
          </div>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-gaming-charcoal rounded-xl p-6 animate-pulse">
                  <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories?.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/category/${category.slug}`}
                  className="group bg-gaming-charcoal hover:bg-gray-800 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-gaming-gold/20 cursor-pointer"
                >
                  <div className="text-center">
                    <div className={`bg-gradient-to-br ${category.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:animate-float`}>
                      <i className={`${category.icon} text-white text-2xl`}></i>
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-gaming-gold transition-colors duration-200">
                      {category.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{category.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recommended Games */}
      <section className="py-16 bg-gaming-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-orbitron font-bold text-3xl md:text-4xl text-white mb-2">Recommended Games</h2>
              <p className="text-gray-400 text-lg">Hand-picked games just for you</p>
            </div>
            <Button className="bg-gaming-gold hover:bg-gaming-amber text-black font-semibold">
              View All
            </Button>
          </div>
          
          {gamesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-gaming-dark animate-pulse">
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedGames?.map((game) => (
                <GameCard key={game.id} game={game} onPlay={handlePlayGame} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Today's Earnings */}
      <section className="py-16 bg-gaming-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gaming-charcoal p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="bg-gaming-gold rounded-full p-3">
                  <i className="fas fa-chart-line text-black text-2xl"></i>
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-2xl text-white">Today's Earnings Chart</h2>
                  <p className="text-gray-400">Top performers of the day</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gaming-gold font-orbitron font-bold text-2xl">$847,291</p>
                <p className="text-gray-400 text-sm">Total Winnings Today</p>
              </div>
            </div>
            
            {leaderboardLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-gaming-dark rounded-xl p-4 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                      <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-32"></div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topEarners?.map((earner, index) => (
                  <div key={earner.id} className="flex items-center justify-between bg-gaming-dark rounded-xl p-4 hover:bg-gray-800 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold ${
                        index === 0 ? "bg-gaming-gold text-black" :
                        index === 1 ? "bg-gray-500 text-white" :
                        "bg-amber-600 text-white"
                      }`}>
                        {index + 1}
                      </div>
                      <img 
                        src={`https://images.unsplash.com/photo-${
                          index === 0 ? "1472099645785-5658abf4ff4e" :
                          index === 1 ? "1507003211169-0a1dd7228f2d" :
                          "1494790108755-2616b612b829"
                        }?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40`}
                        alt="Player avatar" 
                        className="w-10 h-10 rounded-full" 
                      />
                      <div>
                        <p className="text-white font-semibold">{earner.username}</p>
                        <p className="text-gray-400 text-sm">{earner.gameTitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gaming-gold font-semibold">
                        ${parseFloat(earner.winAmount).toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-sm">
                        +{Math.floor((parseFloat(earner.winAmount) / parseFloat(earner.betAmount) - 1) * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 text-center">
              <Button className="bg-gaming-gold hover:bg-gaming-amber text-black font-semibold px-8 py-3">
                View Full Leaderboard
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 bg-gradient-to-r from-gaming-gold to-gaming-amber">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-black/20 rounded-full px-4 py-2 mb-4">
              <i className="fas fa-gift text-black mr-2"></i>
              <span className="text-black font-semibold">LIMITED TIME OFFER</span>
            </div>
            <h2 className="font-orbitron font-black text-3xl md:text-4xl text-black mb-4">
              Welcome Bonus: 100% Match + 50 Free Spins
            </h2>
            <p className="text-black/80 text-lg mb-6 max-w-2xl mx-auto">
              Join now and double your first deposit up to $1000, plus get 50 free spins on our most popular slots!
            </p>
            <Button className="bg-black hover:bg-gray-800 text-gaming-gold font-bold py-4 px-8 rounded-xl">
              <i className="fas fa-rocket mr-2"></i>Claim Your Bonus Now
            </Button>
          </div>
        </div>
      </section>

      <JackpotModal 
        isOpen={showJackpotModal} 
        onClose={() => setShowJackpotModal(false)}
        winAmount="125,000"
      />
    </div>
  );
}
