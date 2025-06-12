import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Star, 
  Users, 
  TrendingUp, 
  Crown, 
  Zap, 
  Gift,
  Flame,
  Trophy,
  ChevronRight,
  Heart,
  Share2,
  BarChart3
} from "lucide-react";

interface Game {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  rating: string;
  jackpot: string;
  isActive: boolean;
}

interface ModernGameInterfaceProps {
  games: Game[];
  onGameSelect: (game: Game) => void;
  user: any;
}

export function ModernGameInterface({ games, onGameSelect, user }: ModernGameInterfaceProps) {
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [hotGames, setHotGames] = useState<Game[]>([]);
  const [newGames, setNewGames] = useState<Game[]>([]);
  const [activePromo, setActivePromo] = useState(0);

  useEffect(() => {
    if (games.length > 0) {
      setFeaturedGames(games.slice(0, 5));
      setHotGames(games.filter(g => parseFloat(g.rating) > 4.5).slice(0, 8));
      setNewGames(games.slice(-6));
    }
  }, [games]);

  const promoSlides = [
    {
      title: "Welcome Bonus",
      subtitle: "Get 100% Match Bonus",
      description: "Up to ₹10,000 + 100 Free Spins",
      gradient: "from-purple-600 via-pink-600 to-red-500",
      icon: Gift
    },
    {
      title: "VIP Program",
      subtitle: "Exclusive Rewards",
      description: "Daily cashback up to 15%",
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      icon: Crown
    },
    {
      title: "Daily Jackpot",
      subtitle: "Must Drop Today",
      description: "₹5,00,000 Guaranteed Prize",
      gradient: "from-green-500 via-blue-500 to-purple-600",
      icon: Trophy
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromo((prev) => (prev + 1) % promoSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const getGameIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'slots': return '🎰';
      case 'cards': return '🃏';
      case 'dice': return '🎲';
      case 'crash': return '🚀';
      case 'lottery': return '🎫';
      case 'quick': return '⚡';
      default: return '🎮';
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Promotion Slider */}
      <div className="relative h-48 rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePromo}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className={`absolute inset-0 bg-gradient-to-br ${promoSlides[activePromo].gradient}`}
          >
            <div className="relative h-full flex items-center justify-between p-6 text-white">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
    {(() => {
                  const IconComponent = promoSlides[activePromo].icon;
                  return <IconComponent className="h-6 w-6" />;
                })()}
                  <span className="text-sm font-medium opacity-90">{promoSlides[activePromo].subtitle}</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">{promoSlides[activePromo].title}</h2>
                <p className="text-lg opacity-90">{promoSlides[activePromo].description}</p>
              </div>
              <Button 
                size="lg" 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
              >
                Claim Now
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
          </motion.div>
        </AnimatePresence>
        
        {/* Slide indicators */}
        <div className="absolute bottom-4 left-6 flex gap-2">
          {promoSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActivePromo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activePromo ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4 text-center"
        >
          <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">2,847</p>
          <p className="text-xs text-blue-300">Online Players</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-4 text-center"
        >
          <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">₹45L</p>
          <p className="text-xs text-green-300">Today's Wins</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4 text-center"
        >
          <Trophy className="h-6 w-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">₹2.5Cr</p>
          <p className="text-xs text-purple-300">Total Jackpots</p>
        </motion.div>
      </div>

      {/* Featured Games Carousel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Featured Games
          </h3>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {featuredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[280px] group cursor-pointer"
              onClick={() => onGameSelect(game)}
            >
              <Card className="bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative h-40 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-gray-900/30 rounded-t-lg">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">{getGameIcon(game.category)}</span>
                    </div>
                    
                    {/* Game badges */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-orange-500/90 text-white border-0">
                        <Flame className="h-3 w-3 mr-1" />
                        Hot
                      </Badge>
                    </div>
                    
                    <div className="absolute top-3 right-3 flex gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-black/30 hover:bg-black/50">
                        <Heart className="h-4 w-4 text-white" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-black/30 hover:bg-black/50">
                        <Share2 className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                    
                    {/* Jackpot overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 rounded-full px-3 py-1 text-center">
                        <p className="text-xs font-bold text-white">
                          💰 {formatCurrency(game.jackpot)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors">
                        {game.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-yellow-500 font-medium">{game.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{game.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {game.category}
                      </Badge>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hot Games Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Trending Now
          </h3>
          <a href="/analytics" className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            View Analytics
          </a>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {hotGames.slice(0, 6).map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer"
              onClick={() => onGameSelect(game)}
            >
              <Card className="bg-gray-800/30 border-gray-700/30 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-lg flex items-center justify-center text-2xl">
                      {getGameIcon(game.category)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors truncate">
                        {game.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-yellow-500">{game.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-green-400">{formatCurrency(game.jackpot)}</span>
                      </div>
                    </div>
                    
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 group-hover:bg-blue-600/20">
                      <Play className="h-4 w-4 text-blue-400" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* User Recommendations */}
      {user && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Recommended for You
            </h3>
            <span className="text-sm text-gray-400">Based on your play style</span>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {newGames.slice(0, 3).map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => onGameSelect(game)}
              >
                <Card className="bg-gradient-to-r from-gray-800/40 to-gray-800/20 border-gray-700/40 hover:border-purple-500/50 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600/40 to-blue-600/40 rounded-xl flex items-center justify-center text-3xl">
                        {getGameIcon(game.category)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors">
                            {game.title}
                          </h4>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            New
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-2 line-clamp-1">{game.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm text-yellow-500">{game.rating}</span>
                            </div>
                            <span className="text-sm text-green-400 font-medium">
                              {formatCurrency(game.jackpot)}
                            </span>
                          </div>
                          
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          >
                            Try Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}