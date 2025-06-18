import { useState } from 'react';
import { Star, TrendingUp, Zap, Users, Trophy, Target } from 'lucide-react';

interface GameLobbyProps {
  onGameSelect: (gameType: string) => void;
}

export const GameLobby = ({ onGameSelect }: GameLobbyProps) => {
  const [selectedCategory, setSelectedCategory] = useState('popular');
  
  const gameCategories = {
    popular: [
      {
        id: 'wingo',
        name: 'Win Go',
        description: 'Predict numbers & colors for instant wins',
        icon: '🎯',
        maxMultiplier: '9x',
        winRate: '45%',
        players: 2847,
        isHot: true,
        bgGradient: 'from-red-500 to-pink-600'
      },
      {
        id: 'aviator',
        name: 'Aviator',
        description: 'Cash out before the plane crashes',
        icon: '✈️',
        maxMultiplier: '1000x',
        winRate: '42%',
        players: 1923,
        isHot: true,
        bgGradient: 'from-blue-500 to-cyan-600'
      },
      {
        id: 'mines',
        name: 'Mines',
        description: 'Find gems while avoiding hidden mines',
        icon: '💎',
        maxMultiplier: '24x',
        winRate: '48%',
        players: 856,
        isNew: true,
        bgGradient: 'from-green-500 to-emerald-600'
      }
    ],
    cards: [
      {
        id: 'dragon-tiger',
        name: 'Dragon Tiger',
        description: 'Classic card battle - highest wins',
        icon: '🐉',
        maxMultiplier: '8x',
        winRate: '47%',
        players: 645,
        bgGradient: 'from-orange-500 to-red-600'
      }
    ],
    dice: [
      {
        id: 'dice',
        name: 'Dice',
        description: 'Predict over/under with custom odds',
        icon: '🎲',
        maxMultiplier: '50x',
        winRate: '49%',
        players: 298,
        bgGradient: 'from-purple-500 to-indigo-600'
      }
    ]
  };

  const categories = [
    { id: 'popular', name: 'Popular', icon: '🔥' },
    { id: 'cards', name: 'Cards', icon: '🃏' },
    { id: 'dice', name: 'Dice', icon: '🎲' }
  ];

  const currentGames = gameCategories[selectedCategory as keyof typeof gameCategories] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Game Lobby</h1>
          <p className="text-gray-300">Choose your game and start winning</p>
        </div>

        {/* Live Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">5,847</div>
            <div className="text-blue-100 text-sm">Players Online</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">₹2.4M</div>
            <div className="text-green-100 text-sm">Total Winnings Today</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">1,234</div>
            <div className="text-yellow-100 text-sm">Games Played</div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">98.7%</div>
            <div className="text-purple-100 text-sm">Avg. Payout</div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentGames.map(game => (
            <div
              key={game.id}
              onClick={() => onGameSelect(game.id)}
              className="group relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${game.bgGradient} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
              
              {/* Badges */}
              <div className="absolute top-3 right-3 z-10 flex gap-1">
                {game.isHot && (
                  <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    🔥 HOT
                  </div>
                )}
                {game.isNew && (
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    ✨ NEW
                  </div>
                )}
              </div>

              <div className="relative p-6">
                {/* Game Icon */}
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{game.icon}</div>
                  <h3 className="text-xl font-bold text-white">{game.name}</h3>
                  <p className="text-gray-400 text-sm">{game.description}</p>
                </div>

                {/* Game Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-black/20 rounded-lg p-3 text-center">
                    <div className="text-yellow-400 font-bold">{game.maxMultiplier}</div>
                    <div className="text-gray-400 text-xs">Max Win</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 text-center">
                    <div className="text-green-400 font-bold">{game.winRate}</div>
                    <div className="text-gray-400 text-xs">Win Rate</div>
                  </div>
                </div>

                {/* Players Count */}
                <div className="flex items-center justify-center gap-2 mb-4 text-blue-400">
                  <Users size={16} />
                  <span className="text-sm font-medium">{game.players.toLocaleString()} playing</span>
                </div>

                {/* Play Button */}
                <button className="w-full py-3 rounded-lg font-bold transition-all transform group-hover:scale-105 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
                  PLAY NOW
                </button>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-purple-600/10 to-blue-600/10 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-gradient-to-r from-purple-800 via-blue-800 to-purple-800 rounded-xl p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="text-yellow-400" size={32} />
            <h2 className="text-2xl font-bold text-white">Join the Winners</h2>
          </div>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Experience the thrill of instant wins with our fair and transparent gaming platform. 
            All games use provably fair algorithms for guaranteed authenticity.
          </p>
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-green-400 text-2xl font-bold">98.7%</div>
              <div className="text-gray-400 text-sm">Return Rate</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 text-2xl font-bold">24/7</div>
              <div className="text-gray-400 text-sm">Support</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 text-2xl font-bold">Instant</div>
              <div className="text-gray-400 text-sm">Payouts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};