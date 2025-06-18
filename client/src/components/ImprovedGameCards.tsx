import { useState } from 'react';
import { Star, TrendingUp, Users, Zap } from 'lucide-react';

interface GameCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  multiplier: string;
  playerCount: number;
  isHot: boolean;
  isNew: boolean;
  category: string;
  minBet: number;
  maxBet: number;
  winRate: number;
}

interface ImprovedGameCardsProps {
  onGameSelect: (gameType: string) => void;
}

export const ImprovedGameCards = ({ onGameSelect }: ImprovedGameCardsProps) => {
  const [filter, setFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const gameCards: GameCard[] = [
    {
      id: 'wingo',
      name: 'Win Go',
      description: 'Predict numbers & colors',
      icon: '🎯',
      multiplier: 'Up to 9x',
      playerCount: 2847,
      isHot: true,
      isNew: false,
      category: 'lottery',
      minBet: 10,
      maxBet: 10000,
      winRate: 45
    },
    {
      id: 'aviator',
      name: 'Aviator',
      description: 'Cash out before crash',
      icon: '✈️',
      multiplier: 'Up to 1000x',
      playerCount: 1923,
      isHot: true,
      isNew: false,
      category: 'crash',
      minBet: 10,
      maxBet: 50000,
      winRate: 42
    },
    {
      id: 'mines',
      name: 'Mines',
      description: 'Avoid mines, find gems',
      icon: '💎',
      multiplier: 'Up to 24x',
      playerCount: 856,
      isHot: false,
      isNew: true,
      category: 'skill',
      minBet: 10,
      maxBet: 5000,
      winRate: 48
    },
    {
      id: 'dragon-tiger',
      name: 'Dragon Tiger',
      description: 'Classic card battle',
      icon: '🐉',
      multiplier: 'Up to 8x',
      playerCount: 645,
      isHot: false,
      isNew: false,
      category: 'cards',
      minBet: 10,
      maxBet: 25000,
      winRate: 47
    },
    {
      id: 'k3',
      name: 'K3 Lottery',
      description: 'Triple dice prediction',
      icon: '🎲',
      multiplier: 'Up to 180x',
      playerCount: 432,
      isHot: false,
      isNew: false,
      category: 'lottery',
      minBet: 10,
      maxBet: 1000,
      winRate: 35
    },
    {
      id: 'dice',
      name: 'Dice',
      description: 'Over/Under prediction',
      icon: '🎯',
      multiplier: 'Up to 5x',
      playerCount: 298,
      isHot: false,
      isNew: false,
      category: 'dice',
      minBet: 10,
      maxBet: 2000,
      winRate: 49
    }
  ];

  const categories = [
    { id: 'all', name: 'All Games', icon: '🎮' },
    { id: 'lottery', name: 'Lottery', icon: '🎱' },
    { id: 'crash', name: 'Crash', icon: '📈' },
    { id: 'cards', name: 'Cards', icon: '🃏' },
    { id: 'skill', name: 'Skill', icon: '🧠' },
    { id: 'dice', name: 'Dice', icon: '🎲' }
  ];

  const filteredGames = filter === 'all' 
    ? gameCards 
    : gameCards.filter(game => game.category === filter);

  const getWinRateColor = (rate: number) => {
    if (rate >= 45) return 'text-green-400';
    if (rate >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setFilter(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              filter === category.id
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span>{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map(game => (
          <div
            key={game.id}
            onMouseEnter={() => setHoveredCard(game.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onGameSelect(game.id)}
            className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 cursor-pointer transition-all duration-300 border ${
              hoveredCard === game.id
                ? 'border-purple-500 transform scale-105 shadow-2xl shadow-purple-500/20'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            {/* Badges */}
            <div className="absolute top-3 right-3 flex gap-1">
              {game.isHot && (
                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                  🔥 HOT
                </div>
              )}
              {game.isNew && (
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  NEW
                </div>
              )}
            </div>

            {/* Game Icon & Name */}
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{game.icon}</div>
              <h3 className="text-xl font-bold text-white">{game.name}</h3>
              <p className="text-gray-400 text-sm">{game.description}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-black/30 rounded-lg p-3 text-center">
                <div className="text-yellow-400 font-bold text-lg">{game.multiplier}</div>
                <div className="text-gray-400 text-xs">Max Win</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3 text-center">
                <div className="text-blue-400 font-bold text-lg">{game.playerCount}</div>
                <div className="text-gray-400 text-xs">Playing Now</div>
              </div>
            </div>

            {/* Win Rate */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Win Rate</span>
              <span className={`font-bold ${getWinRateColor(game.winRate)}`}>
                {game.winRate}%
              </span>
            </div>

            {/* Bet Range */}
            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
              <span>Min: ₹{game.minBet}</span>
              <span>Max: ₹{game.maxBet.toLocaleString()}</span>
            </div>

            {/* Progress Bar for Win Rate */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  game.winRate >= 45 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  game.winRate >= 40 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                  'bg-gradient-to-r from-red-400 to-red-600'
                }`}
                style={{ width: `${game.winRate}%` }}
              ></div>
            </div>

            {/* Play Button */}
            <button className={`w-full py-3 rounded-lg font-bold transition-all transform ${
              hoveredCard === game.id
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white scale-105 shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}>
              Play Now
            </button>

            {/* Hover Effect Overlay */}
            {hoveredCard === game.id && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-xl pointer-events-none"></div>
            )}
          </div>
        ))}
      </div>

      {/* Featured Games Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Star className="text-yellow-400" />
          Featured Games
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gameCards.filter(game => game.isHot).map(game => (
            <div
              key={`featured-${game.id}`}
              onClick={() => onGameSelect(game.id)}
              className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 border border-purple-500/30"
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">{game.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{game.name}</h3>
                  <p className="text-gray-300">{game.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-yellow-400 font-bold">{game.multiplier}</span>
                    <span className="text-blue-400 flex items-center gap-1">
                      <Users size={16} />
                      {game.playerCount}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-2">
                    🔥 HOT
                  </div>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-bold transition-all">
                    Play
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{gameCards.length}</div>
          <div className="text-green-100 text-sm">Total Games</div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">
            {gameCards.reduce((sum, game) => sum + game.playerCount, 0).toLocaleString()}
          </div>
          <div className="text-blue-100 text-sm">Players Online</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">1000x</div>
          <div className="text-purple-100 text-sm">Max Multiplier</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">24/7</div>
          <div className="text-yellow-100 text-sm">Available</div>
        </div>
      </div>
    </div>
  );
};