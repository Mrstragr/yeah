import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  BarChart3,
  Sparkles,
  Target,
  Award,
  Clock,
  DollarSign,
  Volume2,
  VolumeX
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

interface EnhancedPremiumInterfaceProps {
  games: Game[];
  onGameSelect: (game: Game) => void;
  user: any;
}

export function EnhancedPremiumInterface({ games, onGameSelect, user }: EnhancedPremiumInterfaceProps) {
  const [featuredGame, setFeaturedGame] = useState(0);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [hoveredGame, setHoveredGame] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showStats, setShowStats] = useState(false);

  const categories = [
    { 
      name: "ALL", 
      icon: Flame, 
      color: "from-orange-500 to-red-500", 
      gradient: "bg-gradient-to-r from-orange-500/20 to-red-500/20",
      border: "border-orange-500/50",
      games: games,
      count: games.length
    },
    { 
      name: "CRASH", 
      icon: Zap, 
      color: "from-blue-500 to-cyan-500", 
      gradient: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/50",
      games: games.filter(g => g.category === 'crash'),
      count: games.filter(g => g.category === 'crash').length
    },
    { 
      name: "CASINO", 
      icon: Crown, 
      color: "from-purple-500 to-pink-500", 
      gradient: "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/50",
      games: games.filter(g => g.category === 'casino'),
      count: games.filter(g => g.category === 'casino').length
    },
    { 
      name: "MINI GAMES", 
      icon: Trophy, 
      color: "from-yellow-500 to-amber-500", 
      gradient: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20",
      border: "border-yellow-500/50",
      games: games.filter(g => g.category === 'minigames'),
      count: games.filter(g => g.category === 'minigames').length
    },
    { 
      name: "LOTTERY", 
      icon: Target, 
      color: "from-green-500 to-emerald-500", 
      gradient: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
      border: "border-green-500/50",
      games: games.filter(g => g.category === 'lottery'),
      count: games.filter(g => g.category === 'lottery').length
    },
  ];

  const featuredGames = games.slice(0, 3);
  const activeGames = categories.find(cat => cat.name === activeCategory)?.games || [];

  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedGame((prev) => (prev + 1) % featuredGames.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredGames.length]);

  const getGameIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'aviator': return '✈️';
      case 'coin flip': return '🪙';
      case 'dice roll': return '🎲';
      case 'big small': return '🎯';
      case 'blackjack': return '🃏';
      case 'lucky numbers': return '🎫';
      case 'plinko': return '⚪';
      default: return '🎮';
    }
  };

  const formatJackpot = (amount: string) => {
    const num = parseFloat(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
    return `₹${num.toFixed(0)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-96 h-96 rounded-full opacity-10 ${
              i % 2 === 0 ? 'bg-purple-500' : 'bg-blue-500'
            }`}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
          />
        ))}
      </div>

      {/* Header Section */}
      <div className="relative z-10 px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              TashanWin Casino
            </motion.h1>
            <p className="text-gray-300 mt-2">Premium Gaming Experience</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-gray-400 hover:text-white"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className="text-gray-400 hover:text-white"
            >
              <BarChart3 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* User Stats Bar */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-800"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Balance</p>
                  <p className="text-white font-bold text-lg">₹{parseFloat(user?.walletBalance || '0').toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Games Played</p>
                  <p className="text-white font-bold text-lg">47</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Total Wins</p>
                  <p className="text-green-400 font-bold text-lg">₹18,450</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Win Rate</p>
                  <p className="text-blue-400 font-bold text-lg">68%</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured Game Hero Section */}
        {featuredGames.length > 0 && (
          <motion.div 
            className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50 mb-4">
                    🔥 FEATURED GAME
                  </Badge>
                  <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-3">
                    <span className="text-4xl">{getGameIcon(featuredGames[featuredGame]?.title)}</span>
                    {featuredGames[featuredGame]?.title}
                  </h2>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {featuredGames[featuredGame]?.description}
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-300 font-semibold">
                        {formatJackpot(featuredGames[featuredGame]?.jackpot || '0')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-orange-400" />
                      <span className="text-orange-300">{featuredGames[featuredGame]?.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-300">{Math.floor(Math.random() * 500) + 100} playing</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => featuredGames[featuredGame] && onGameSelect(featuredGames[featuredGame])}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Play Now
                  </Button>
                </div>
                
                <div className="w-full md:w-80 h-48 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center border border-gray-600">
                  <span className="text-6xl opacity-50">{getGameIcon(featuredGames[featuredGame]?.title)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Navigation */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Game Categories
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                    activeCategory === category.name
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{category.name}</span>
                  <Badge className="bg-white/20 text-white text-xs">
                    {category.count}
                  </Badge>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {activeGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group cursor-pointer"
                onClick={() => onGameSelect(game)}
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
              >
                <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700/50 overflow-hidden backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                  <CardContent className="p-0">
                    {/* Game Image/Icon */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span className="text-6xl relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                        {getGameIcon(game.title)}
                      </span>
                      
                      {/* Live indicator */}
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                        🔴 LIVE
                      </div>
                      
                      {/* Rating */}
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        {game.rating}
                      </div>
                    </div>

                    {/* Game Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-white text-lg mb-2 group-hover:text-purple-300 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {game.description}
                      </p>
                      
                      {/* Game Stats */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Jackpot</span>
                          <span className="text-yellow-400 font-bold bg-yellow-900/30 px-2 py-1 rounded text-sm">
                            {formatJackpot(game.jackpot)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Players</span>
                          <span className="text-green-400 font-semibold bg-green-900/30 px-2 py-1 rounded text-sm">
                            {Math.floor(Math.random() * 300) + 50}
                          </span>
                        </div>
                      </div>

                      {/* Play Button */}
                      <Button
                        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 transform group-hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          onGameSelect(game);
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {activeGames.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-6 opacity-50">🎮</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No Games in {activeCategory} Category
            </h3>
            <p className="text-gray-400 text-lg">
              Check back soon for new games in this category!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}