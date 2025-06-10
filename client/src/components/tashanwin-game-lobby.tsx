import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

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

interface TashanWinGameLobbyProps {
  onGameSelect: (gameId: number, gameTitle: string) => void;
}

export function TashanWinGameLobby({ onGameSelect }: TashanWinGameLobbyProps) {
  const [activeTab, setActiveTab] = useState('hot');

  const { data: games = [] } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const categories = [
    { id: 'hot', name: 'Hot', icon: '🔥', color: '#ff6b35' },
    { id: 'slots', name: 'Slots', icon: '🎰', color: '#f7931e' },
    { id: 'cards', name: 'Cards', icon: '🃏', color: '#4dabf7' },
    { id: 'dice', name: 'Dice', icon: '🎲', color: '#69db7c' },
    { id: 'quick', name: 'Quick', icon: '⚡', color: '#ffd43b' },
    { id: 'jackpot', name: 'Jackpot', icon: '🏆', color: '#da77f2' }
  ];

  const getGamesByCategory = (category: string) => {
    return games.filter(game => game.category === category);
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
    <div className="bg-gradient-to-b from-[#1a1a2e] to-[#16213e] min-h-screen text-white">
      {/* Category Tabs */}
      <div className="sticky top-0 z-10 bg-[#1a1a2e]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="flex overflow-x-auto py-3 px-4 gap-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === category.id
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-black'
                  : 'bg-[#2a2a3e] text-gray-300 hover:bg-[#3a3a4e]'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {getGamesByCategory(activeTab).map((game) => (
            <div
              key={game.id}
              onClick={() => onGameSelect(game.id, game.title)}
              className="bg-gradient-to-br from-[#2a2a3e] to-[#1e1e32] rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 border border-gray-700/50"
            >
              {/* Game Image */}
              <div className="relative h-32 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <div className="text-4xl">{categories.find(c => c.id === activeTab)?.icon}</div>
                {/* Live indicator for some games */}
                {game.category === 'hot' && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    LIVE
                  </div>
                )}
              </div>

              {/* Game Info */}
              <div className="p-3">
                <h3 className="font-semibold text-sm text-white mb-1 truncate">
                  {game.title}
                </h3>
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                  {game.description}
                </p>
                
                {/* Game Stats */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Jackpot</span>
                    <span className="text-xs font-bold text-[#ffd700]">
                      {formatAmount(game.jackpot)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Players</span>
                    <span className="text-xs text-green-400">
                      {getRandomPlayers()} playing
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Rating</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-yellow-400">⭐</span>
                      <span className="text-xs text-white">{game.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {getGamesByCategory(activeTab).length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">{categories.find(c => c.id === activeTab)?.icon}</div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              No {categories.find(c => c.id === activeTab)?.name} Games Available
            </h3>
            <p className="text-gray-500">
              Check back soon for new games in this category!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}