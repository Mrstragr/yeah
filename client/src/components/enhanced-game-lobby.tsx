import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  TrendingUp, 
  Crown, 
  Zap, 
  Trophy,
  Target,
  Clock,
  DollarSign,
  Grid3X3,
  List,
  SlidersHorizontal
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

interface EnhancedGameLobbyProps {
  onGameSelect: (gameId: number, gameTitle: string) => void;
}

export function EnhancedGameLobby({ onGameSelect }: EnhancedGameLobbyProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const { data: games = [] } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const categories = [
    { id: 'all', name: 'All Games', icon: '🎯', color: '#ff6b35', count: games.length },
    { id: 'crash', name: 'Crash', icon: '✈️', color: '#4dabf7', count: games.filter(g => g.category === 'crash').length },
    { id: 'casino', name: 'Casino', icon: '🃏', color: '#f7931e', count: games.filter(g => g.category === 'casino').length },
    { id: 'minigames', name: 'Mini Games', icon: '🎲', color: '#69db7c', count: games.filter(g => g.category === 'minigames').length },
    { id: 'lottery', name: 'Lottery', icon: '🎫', color: '#da77f2', count: games.filter(g => g.category === 'lottery').length }
  ];

  const filteredGames = games.filter(game => {
    const matchesCategory = activeCategory === 'all' || game.category === activeCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return parseFloat(b.rating) - parseFloat(a.rating);
      case 'jackpot':
        return parseFloat(b.jackpot) - parseFloat(a.jackpot);
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

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

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
    return `₹${num.toFixed(0)}`;
  };

  const getRandomPlayers = () => Math.floor(Math.random() * 500) + 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Game Lobby
        </motion.h1>
        <p className="text-gray-300">Choose your favorite game and start winning</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
            />
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>

            <div className="flex border border-gray-700 rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`px-3 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={`px-3 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
            >
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-purple-500"
                  >
                    <option value="popular">Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="jackpot">Biggest Jackpot</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Tabs */}
      <div className="mb-8">
        <div className="flex overflow-x-auto py-2 gap-3 scrollbar-hide">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.name}</span>
              <Badge className="bg-white/20 text-white text-xs">
                {category.count}
              </Badge>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Games Display */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {sortedGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group cursor-pointer"
                onClick={() => onGameSelect(game.id, game.title)}
              >
                <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700/50 overflow-hidden backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                  <CardContent className="p-0">
                    {/* Game Image */}
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
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Jackpot</p>
                          <p className="text-yellow-400 font-bold text-sm">
                            {formatAmount(game.jackpot)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Players</p>
                          <p className="text-green-400 font-bold text-sm">
                            {getRandomPlayers()}
                          </p>
                        </div>
                      </div>

                      {/* Play Button */}
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          onGameSelect(game.id, game.title);
                        }}
                      >
                        Play Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {sortedGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => onGameSelect(game.id, game.title)}
              >
                <Card className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Game Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                        {getGameIcon(game.title)}
                      </div>

                      {/* Game Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                            {game.title}
                          </h3>
                          <Badge className="bg-red-500/20 text-red-300 border-red-500/50">
                            LIVE
                          </Badge>
                        </div>
                        <p className="text-gray-400 mb-3">
                          {game.description}
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-300">{game.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-green-300">{formatAmount(game.jackpot)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-300">{getRandomPlayers()} playing</span>
                          </div>
                        </div>
                      </div>

                      {/* Play Button */}
                      <Button
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          onGameSelect(game.id, game.title);
                        }}
                      >
                        Play Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {sortedGames.length === 0 && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-6xl mb-6 opacity-50">🎮</div>
          <h3 className="text-2xl font-bold text-white mb-4">
            No Games Found
          </h3>
          <p className="text-gray-400 text-lg mb-6">
            Try adjusting your search or filters
          </p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('all');
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Clear Filters
          </Button>
        </motion.div>
      )}

      {/* Results Counter */}
      <div className="mt-8 text-center">
        <p className="text-gray-400">
          Showing {sortedGames.length} of {games.length} games
        </p>
      </div>
    </div>
  );
}