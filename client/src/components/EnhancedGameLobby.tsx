import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Trophy, Star, TrendingUp, Users, 
  Clock, Zap, Target, Crown, Gift, BarChart3,
  Gamepad2, Dice1, Heart, Coins, Plane
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
  category: 'lottery' | 'crash' | 'casino' | 'slots';
  featured: boolean;
  hot: boolean;
}

export default function EnhancedGameLobby({ onBack, user, onGameSelect }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'lottery' | 'crash' | 'casino' | 'slots'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const games: GameCard[] = [
    {
      id: 'wingo',
      name: 'Win Go',
      description: 'Color & Number Prediction',
      minBet: 10,
      maxWin: '9x',
      players: 1247,
      winRate: '45.2%',
      icon: Target,
      gradient: 'from-green-500 to-emerald-600',
      category: 'lottery',
      featured: true,
      hot: true
    },
    {
      id: 'aviator',
      name: 'Aviator',
      description: 'Crash Multiplier Game',
      minBet: 10,
      maxWin: '100x+',
      players: 892,
      winRate: '38.7%',
      icon: Plane,
      gradient: 'from-blue-500 to-cyan-600',
      category: 'crash',
      featured: true,
      hot: true
    },
    {
      id: 'k3-lottery',
      name: 'K3 Lottery',
      description: 'Dice Sum Prediction',
      minBet: 5,
      maxWin: '50x',
      players: 634,
      winRate: '42.1%',
      icon: Dice1,
      gradient: 'from-purple-500 to-violet-600',
      category: 'lottery',
      featured: false,
      hot: true
    },
    {
      id: 'dragon-tiger',
      name: 'Dragon Tiger',
      description: 'Card Battle Game',
      minBet: 20,
      maxWin: '2x',
      players: 423,
      winRate: '48.9%',
      icon: Heart,
      gradient: 'from-red-500 to-pink-600',
      category: 'casino',
      featured: false,
      hot: false
    },
    {
      id: 'mines',
      name: 'Mines',
      description: 'Mine Field Strategy',
      minBet: 15,
      maxWin: '24x',
      players: 567,
      winRate: '41.3%',
      icon: Zap,
      gradient: 'from-yellow-500 to-orange-600',
      category: 'casino',
      featured: false,
      hot: false
    },
    {
      id: '5d-lottery',
      name: '5D Lottery',
      description: 'Multi-Digit Prediction',
      minBet: 8,
      maxWin: '100x',
      players: 789,
      winRate: '35.8%',
      icon: BarChart3,
      gradient: 'from-indigo-500 to-purple-600',
      category: 'lottery',
      featured: false,
      hot: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Games', icon: Gamepad2 },
    { id: 'lottery', name: 'Lottery', icon: Target },
    { id: 'crash', name: 'Crash', icon: TrendingUp },
    { id: 'casino', name: 'Casino', icon: Heart },
    { id: 'slots', name: 'Slots', icon: Coins }
  ];

  const filteredGames = games.filter(game => {
    const categoryMatch = selectedCategory === 'all' || game.category === selectedCategory;
    const searchMatch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const featuredGames = games.filter(game => game.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-lg">
              <ArrowLeft size={24} />
            </button>
            <div>
              <div className="text-xl font-bold">Game Lobby</div>
              <div className="text-sm opacity-70">Choose your game</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm opacity-70">Balance</div>
            <div className="text-lg font-bold text-green-400">₹{user.walletBalance}</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search games..."
          className="w-full bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-white placeholder-white/60 border border-white/20 focus:border-white/40 focus:outline-none"
        />
      </div>

      {/* Categories */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === category.id 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <category.icon size={16} />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Games */}
      {selectedCategory === 'all' && (
        <div className="px-4 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-bold">Featured Games</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {featuredGames.map(game => (
              <motion.div
                key={game.id}
                onClick={() => onGameSelect(game.id)}
                className={`relative bg-gradient-to-r ${game.gradient} rounded-2xl p-6 cursor-pointer overflow-hidden`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}></div>
                </div>

                {/* Hot Badge */}
                {game.hot && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                      🔥 HOT
                    </div>
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <game.icon size={24} className="text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{game.name}</div>
                        <div className="text-white/80">{game.description}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-white/80">Min Bet</div>
                      <div className="font-bold">₹{game.minBet}</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/80">Max Win</div>
                      <div className="font-bold">{game.maxWin}</div>
                    </div>
                    <div>
                      <div className="text-sm text-white/80">Players</div>
                      <div className="font-bold">{game.players}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Games Grid */}
      <div className="px-4 pb-20">
        <div className="flex items-center gap-2 mb-4">
          <Gamepad2 className="w-5 h-5 text-blue-400" />
          <span className="text-lg font-bold">
            {selectedCategory === 'all' ? 'All Games' : categories.find(c => c.id === selectedCategory)?.name}
          </span>
          <span className="text-sm text-white/60">({filteredGames.length} games)</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {filteredGames.map(game => (
            <motion.div
              key={game.id}
              onClick={() => onGameSelect(game.id)}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Game Icon and Hot Badge */}
              <div className="relative mb-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${game.gradient} rounded-lg flex items-center justify-center mb-2`}>
                  <game.icon size={20} className="text-white" />
                </div>
                {game.hot && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
              
              {/* Game Info */}
              <div className="mb-3">
                <div className="font-bold text-sm mb-1">{game.name}</div>
                <div className="text-xs text-white/70">{game.description}</div>
              </div>
              
              {/* Stats */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Min Bet:</span>
                  <span className="text-green-400">₹{game.minBet}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Max Win:</span>
                  <span className="text-yellow-400">{game.maxWin}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Players:</span>
                  <span className="text-blue-400">{game.players}</span>
                </div>
              </div>
              
              {/* Play Button */}
              <button className={`w-full mt-3 py-2 rounded-lg text-sm font-bold transition-all bg-gradient-to-r ${game.gradient} hover:shadow-lg`}>
                Play Now
              </button>
            </motion.div>
          ))}
        </div>

        {/* No Games Found */}
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎮</div>
            <div className="text-lg font-bold mb-2">No games found</div>
            <div className="text-white/60">Try adjusting your search or category filters</div>
          </div>
        )}
      </div>

      {/* Floating Stats */}
      <div className="fixed bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl p-3 border border-white/20">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-white/80">{games.reduce((sum, game) => sum + game.players, 0)} online</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-white/80">₹2.4M won today</span>
            </div>
          </div>
          <div className="text-green-400 font-bold">
            {user.username}
          </div>
        </div>
      </div>
    </div>
  );
}