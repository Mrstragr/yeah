import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Trophy, Star, TrendingUp, Users, 
  Clock, Zap, Target, Crown, Gift, BarChart3,
  Gamepad2, Dice1, Heart, Coins, Plane, Search,
  Filter, RefreshCw, Volume2, Share2, Info
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  walletBalance: string;
}

interface Props {
  onBack: () => void;
  user: User;
  onGameSelect: (gameId: string) => void;
}

interface GameCard {
  id: string;
  name: string;
  description: string;
  minBet: number;
  maxWin: string;
  players: number;
  winRate: string;
  icon: React.ElementType;
  gradient: string;
  category: 'lottery' | 'crash' | 'casino' | 'cards' | 'sports';
  featured: boolean;
  hot: boolean;
  jackpot?: string;
  lastWinner?: string;
}

export default function AuthenticGameLobby({ onBack, user, onGameSelect }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'lottery' | 'crash' | 'casino' | 'cards' | 'sports'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const games: GameCard[] = [
    {
      id: 'authentic-wingo',
      name: 'Win Go',
      description: 'Color & Number Prediction • 30s rounds',
      minBet: 10,
      maxWin: '9x',
      players: 12847,
      winRate: '45.2%',
      icon: Target,
      gradient: 'from-emerald-500 via-green-500 to-emerald-600',
      category: 'lottery',
      featured: true,
      hot: true,
      jackpot: '₹4,56,890',
      lastWinner: 'Raj***89'
    },
    {
      id: 'authentic-aviator',
      name: 'Aviator',
      description: 'Crash Multiplier Game • Unlimited potential',
      minBet: 10,
      maxWin: '1000x+',
      players: 8943,
      winRate: '38.7%',
      icon: Plane,
      gradient: 'from-red-500 via-orange-500 to-red-600',
      category: 'crash',
      featured: true,
      hot: true,
      jackpot: '₹8,94,567',
      lastWinner: 'Priya***23'
    },
    {
      id: 'k3-lottery',
      name: 'K3 Lottery',
      description: 'Dice Sum Prediction • Fast results',
      minBet: 5,
      maxWin: '50x',
      players: 6734,
      winRate: '42.1%',
      icon: Dice1,
      gradient: 'from-purple-500 via-violet-500 to-purple-600',
      category: 'lottery',
      featured: false,
      hot: true,
      lastWinner: 'Amit***45'
    },
    {
      id: '5d-lottery',
      name: '5D Lottery',
      description: 'Five digit prediction • High rewards',
      minBet: 10,
      maxWin: '100x',
      players: 4567,
      winRate: '35.8%',
      icon: BarChart3,
      gradient: 'from-blue-500 via-indigo-500 to-blue-600',
      category: 'lottery',
      featured: false,
      hot: false,
      lastWinner: 'Sunita***67'
    },
    {
      id: 'color-prediction',
      name: 'Color Game',
      description: 'Simple color prediction • Quick wins',
      minBet: 10,
      maxWin: '3x',
      players: 9876,
      winRate: '48.9%',
      icon: Heart,
      gradient: 'from-pink-500 via-rose-500 to-pink-600',
      category: 'lottery',
      featured: false,
      hot: true,
      lastWinner: 'Vikash***12'
    },
    {
      id: 'teen-patti',
      name: 'Teen Patti',
      description: 'Traditional card game • Live dealer',
      minBet: 50,
      maxWin: '20x',
      players: 3456,
      winRate: '41.2%',
      icon: Gamepad2,
      gradient: 'from-yellow-500 via-amber-500 to-yellow-600',
      category: 'cards',
      featured: false,
      hot: false,
      lastWinner: 'Rohit***34'
    },
    {
      id: 'dragon-tiger',
      name: 'Dragon Tiger',
      description: 'Card battle game • Simple rules',
      minBet: 20,
      maxWin: '8x',
      players: 2345,
      winRate: '46.7%',
      icon: Zap,
      gradient: 'from-orange-500 via-red-500 to-orange-600',
      category: 'cards',
      featured: false,
      hot: false,
      lastWinner: 'Neha***78'
    },
    {
      id: 'andar-bahar',
      name: 'Andar Bahar',
      description: 'Classic Indian card game • Live action',
      minBet: 25,
      maxWin: '10x',
      players: 1987,
      winRate: '44.3%',
      icon: Crown,
      gradient: 'from-teal-500 via-cyan-500 to-teal-600',
      category: 'cards',
      featured: false,
      hot: false,
      lastWinner: 'Suresh***56'
    },
    {
      id: 'mines',
      name: 'Mines',
      description: 'Strategic minefield • Progressive rewards',
      minBet: 10,
      maxWin: '500x',
      players: 1234,
      winRate: '52.1%',
      icon: Gift,
      gradient: 'from-gray-500 via-slate-500 to-gray-600',
      category: 'casino',
      featured: false,
      hot: false,
      lastWinner: 'Kavita***90'
    },
    {
      id: 'cricket-bet',
      name: 'Cricket Live',
      description: 'Live cricket betting • Real matches',
      minBet: 100,
      maxWin: '50x',
      players: 7890,
      winRate: '39.4%',
      icon: Users,
      gradient: 'from-green-600 via-emerald-600 to-green-700',
      category: 'sports',
      featured: true,
      hot: true,
      lastWinner: 'Deepak***45'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Games', icon: Gamepad2 },
    { id: 'lottery', name: 'Lottery', icon: Target },
    { id: 'crash', name: 'Crash', icon: Plane },
    { id: 'casino', name: 'Casino', icon: Dice1 },
    { id: 'cards', name: 'Cards', icon: Heart },
    { id: 'sports', name: 'Sports', icon: Trophy }
  ];

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const featuredGames = games.filter(game => game.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white max-w-md mx-auto relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-12 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-8 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-28 h-28 bg-green-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-600 to-indigo-700 p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Gamepad2 className="w-6 h-6" />
              Game Lobby
            </h1>
            <p className="text-purple-100 text-sm">{filteredGames.length} games available</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:border-white/40"
          />
        </div>
      </div>

      {/* Platform Statistics */}
      <div className="relative z-10 bg-black/30 backdrop-blur-sm p-4 border-b border-white/10">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-300">Online</span>
            </div>
            <p className="text-lg font-bold text-white">45,892</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-300">Jackpot</span>
            </div>
            <p className="text-lg font-bold text-white">₹12.4L</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-300">Payout</span>
            </div>
            <p className="text-lg font-bold text-white">97.2%</p>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm p-4 border-b border-white/10">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Games Banner */}
      {selectedCategory === 'all' && (
        <div className="relative z-10 p-4">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Featured Games
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {featuredGames.slice(0, 2).map((game) => {
              const Icon = game.icon;
              return (
                <motion.button
                  key={game.id}
                  onClick={() => onGameSelect(game.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative bg-gradient-to-br ${game.gradient} rounded-xl p-4 text-left overflow-hidden`}
                >
                  {game.hot && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      HOT
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{game.name}</h3>
                      <p className="text-white/80 text-xs">{game.maxWin} max win</p>
                    </div>
                  </div>
                  
                  <div className="text-white/90 text-xs mb-2">{game.description}</div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-xs">
                      {game.players.toLocaleString()} playing
                    </span>
                    <span className="text-white font-bold text-sm">
                      {game.jackpot}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Games Grid */}
      <div className="relative z-10 p-4">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-purple-400" />
          {selectedCategory === 'all' ? 'All Games' : categories.find(c => c.id === selectedCategory)?.name}
          <span className="text-sm text-gray-400">({filteredGames.length})</span>
        </h2>
        
        <div className="space-y-3">
          <AnimatePresence>
            {filteredGames.map((game, index) => {
              const Icon = game.icon;
              return (
                <motion.button
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onGameSelect(game.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-left hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    {/* Game Icon */}
                    <div className={`bg-gradient-to-br ${game.gradient} rounded-xl p-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Game Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-lg">{game.name}</h3>
                        {game.hot && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            HOT
                          </span>
                        )}
                        {game.featured && (
                          <Star className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-2">{game.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-gray-400">
                          <Users className="w-3 h-3 inline mr-1" />
                          {game.players.toLocaleString()}
                        </span>
                        <span className="text-green-400">
                          <TrendingUp className="w-3 h-3 inline mr-1" />
                          {game.winRate}
                        </span>
                        <span className="text-yellow-400">
                          <Trophy className="w-3 h-3 inline mr-1" />
                          {game.maxWin}
                        </span>
                      </div>
                      
                      {game.lastWinner && (
                        <p className="text-purple-300 text-xs mt-1">
                          Last winner: {game.lastWinner}
                        </p>
                      )}
                    </div>
                    
                    {/* Min Bet */}
                    <div className="text-right">
                      <div className="text-gray-400 text-xs mb-1">Min Bet</div>
                      <div className="text-white font-bold">₹{game.minBet}</div>
                      {game.jackpot && (
                        <div className="text-yellow-400 text-xs mt-1">
                          <Gift className="w-3 h-3 inline mr-1" />
                          {game.jackpot}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No games found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-gradient-to-br from-gray-900 to-black rounded-t-2xl p-6 border-t border-white/20"
            >
              <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6"></div>
              
              <h3 className="text-xl font-bold text-white mb-6">Filter Games</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm mb-3">Game Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(1).map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id as any);
                            setShowFilters(false);
                          }}
                          className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                            selectedCategory === category.id
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{category.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-3">Quick Filters</label>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-red-600 rounded-lg text-white text-sm">
                      Hot Games
                    </button>
                    <button className="px-4 py-2 bg-yellow-600 rounded-lg text-white text-sm">
                      Featured
                    </button>
                    <button className="px-4 py-2 bg-green-600 rounded-lg text-white text-sm">
                      High RTP
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl py-3 text-white font-bold mt-6"
              >
                Apply Filters
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Space */}
      <div className="h-20"></div>
    </div>
  );
}