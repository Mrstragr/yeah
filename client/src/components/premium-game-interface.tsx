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
  DollarSign
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

interface PremiumGameInterfaceProps {
  games: Game[];
  onGameSelect: (game: Game) => void;
  user: any;
}

export function PremiumGameInterface({ games, onGameSelect, user }: PremiumGameInterfaceProps) {
  const [featuredGame, setFeaturedGame] = useState(0);
  const [activeCategory, setActiveCategory] = useState("HOT");
  const [hoveredGame, setHoveredGame] = useState<number | null>(null);

  const categories = [
    { 
      name: "ALL", 
      icon: Flame, 
      color: "from-red-500 to-orange-500", 
      gradient: "bg-gradient-to-r from-red-500/20 to-orange-500/20",
      border: "border-red-500/50",
      games: games 
    },
    { 
      name: "CRASH", 
      icon: Zap, 
      color: "from-blue-500 to-cyan-500", 
      gradient: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/50",
      games: games.filter(g => g.category === 'crash') 
    },
    { 
      name: "CASINO", 
      icon: Crown, 
      color: "from-purple-500 to-pink-500", 
      gradient: "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/50",
      games: games.filter(g => g.category === 'casino') 
    },
    { 
      name: "MINI GAMES", 
      icon: Trophy, 
      color: "from-yellow-500 to-amber-500", 
      gradient: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20",
      border: "border-yellow-500/50",
      games: games.filter(g => g.category === 'minigames') 
    },
    { 
      name: "LOTTERY", 
      icon: Target, 
      color: "from-green-500 to-emerald-500", 
      gradient: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
      border: "border-green-500/50",
      games: games.filter(g => g.category === 'lottery') 
    },
  ];

  const featuredGames = games.slice(0, 3);
  const activeGames = categories.find(cat => cat.name === activeCategory)?.games || [];

  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedGame((prev) => (prev + 1) % featuredGames.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredGames.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-500/5 rounded-full blur-2xl"
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 space-y-12 px-4 py-6">
        {/* Ultra Premium Hero Banner */}
        <motion.div 
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 text-white shadow-2xl border border-purple-500/20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0">
            <motion.div 
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-6 flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center space-x-4"
                >
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-6 py-2 text-sm shadow-lg rounded-full">
                    <Flame className="w-4 h-4 mr-2" />
                    LIVE NOW
                  </Badge>
                  <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold px-6 py-2 text-sm shadow-lg rounded-full">
                    <Users className="w-4 h-4 mr-2" />
                    2,847 Players
                  </Badge>
                </motion.div>
                
                <motion.h1 
                  className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  TashanWin
                  <span className="block text-3xl font-medium text-purple-200 mt-2">
                    Premium Gaming Platform
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-purple-100 max-w-2xl leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  Experience next-generation gaming with cutting-edge graphics, instant payouts, 
                  progressive jackpots, and industry-leading security. Join millions of winners worldwide.
                </motion.p>
                
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                      <div>
                        <div className="text-2xl font-bold text-green-400">₹12.5M</div>
                        <div className="text-xs text-gray-300">Won Today</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-6 h-6 text-blue-400" />
                      <div>
                        <div className="text-2xl font-bold text-blue-400">98.5%</div>
                        <div className="text-xs text-gray-300">RTP Rate</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-6 h-6 text-yellow-400" />
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">24/7</div>
                        <div className="text-xs text-gray-300">Support</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <Award className="w-6 h-6 text-purple-400" />
                      <div>
                        <div className="text-2xl font-bold text-purple-400">500+</div>
                        <div className="text-xs text-gray-300">Games</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                className="hidden xl:block ml-8"
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1.1, duration: 1 }}
              >
                <div className="relative">
                  <motion.div 
                    className="w-80 h-80 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full opacity-20"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div 
                    className="absolute inset-8 bg-gradient-to-br from-purple-400 via-pink-500 to-blue-500 rounded-full opacity-30"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <div className="absolute inset-20 bg-gradient-to-br from-white to-yellow-200 rounded-full opacity-40 flex items-center justify-center">
                    <Crown className="w-20 h-20 text-yellow-600" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Premium Category Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <Sparkles className="w-8 h-8 mr-3 text-yellow-400" />
              Game Categories
            </h2>
            <Button 
              variant="outline" 
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              const isActive = activeCategory === category.name;
              
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 border-2 ${
                      isActive 
                        ? `${category.border} bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl ${category.gradient}` 
                        : 'border-gray-700/50 bg-gray-800/50 hover:border-gray-600'
                    }`}
                    onClick={() => setActiveCategory(category.name)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                      <p className="text-gray-400 text-sm">{category.games.length} games</p>
                      {isActive && (
                        <motion.div
                          className="mt-3 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                          layoutId="activeCategory"
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Premium Games Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <Target className="w-8 h-8 mr-3 text-blue-400" />
              {activeCategory} Games
            </h2>
            <div className="flex items-center space-x-2 text-gray-400">
              <span className="text-sm">Sort by:</span>
              <select className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm">
                <option>Popularity</option>
                <option>Newest</option>
                <option>Jackpot Size</option>
              </select>
            </div>
          </div>
          
          <AnimatePresence>
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              layout
            >
              {activeGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  onHoverStart={() => setHoveredGame(game.id)}
                  onHoverEnd={() => setHoveredGame(null)}
                >
                  <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group shadow-xl">
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center relative overflow-hidden">
                        <motion.div
                          className="absolute inset-0 bg-black/20"
                          animate={hoveredGame === game.id ? { opacity: 0 } : { opacity: 1 }}
                        />
                        <div className="text-6xl">{getCategoryEmoji(game.category)}</div>
                        
                        {hoveredGame === game.id && (
                          <motion.div
                            className="absolute inset-0 bg-black/60 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Button 
                              onClick={() => onGameSelect(game)}
                              className="bg-white text-black hover:bg-gray-200 font-bold px-8 py-3 rounded-full shadow-lg"
                            >
                              <Play className="w-5 h-5 mr-2" />
                              Play Now
                            </Button>
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500 text-black font-bold">
                          <Star className="w-3 h-3 mr-1" />
                          {game.rating}
                        </Badge>
                      </div>
                      
                      <div className="absolute top-4 right-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/20 hover:bg-white/30">
                            <Heart className="w-4 h-4 text-white" />
                          </Button>
                          <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/20 hover:bg-white/30">
                            <Share2 className="w-4 h-4 text-white" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                            {game.title}
                          </h3>
                          <p className="text-gray-400 text-sm line-clamp-2">{game.description}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-bold">{game.jackpot}</span>
                          </div>
                          <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                            {game.category.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <motion.div
                          className="w-full h-2 bg-gray-700 rounded-full overflow-hidden"
                          whileHover={{ scale: 1.05 }}
                        >
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${Math.random() * 40 + 60}%` }}
                            transition={{ duration: 2, delay: index * 0.1 }}
                          />
                        </motion.div>
                        <div className="text-xs text-gray-500">Jackpot Progress</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function getCategoryEmoji(category: string): string {
  switch (category) {
    case 'hot': return '🔥';
    case 'slots': return '🎰';
    case 'live': return '📺';
    case 'jackpot': return '🏆';
    default: return '🎮';
  }
}