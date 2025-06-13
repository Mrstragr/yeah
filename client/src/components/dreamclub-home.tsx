import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Bell, Star, TrendingUp, Gamepad2, Zap, Crown, Trophy } from "lucide-react";
import { DreamClubGameModal } from "./dreamclub-game-modal";

interface User {
  id: number;
  username: string;
  walletBalance: string;
  bonusBalance: string;
}

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

export function DreamClubHome() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  const { data: games } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const categories = [
    { id: "all", name: "All", icon: Star, color: "from-purple-500 to-pink-500" },
    { id: "lottery", name: "Lottery", icon: TrendingUp, color: "from-blue-500 to-purple-500" },
    { id: "slots", name: "Slots", icon: Gamepad2, color: "from-pink-500 to-red-500" },
    { id: "sports", name: "Sports", icon: Trophy, color: "from-green-500 to-blue-500" },
    { id: "casino", name: "Casino", icon: Crown, color: "from-yellow-500 to-orange-500" },
    { id: "fishing", name: "Fishing", icon: Zap, color: "from-cyan-500 to-blue-500" },
  ];

  const balance = user ? parseFloat(user.walletBalance || "0") : 0;
  const bonusBalance = user ? parseFloat(user.bonusBalance || "0") : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Welcome back</p>
              <p className="text-white font-semibold">{user?.username || "Guest"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Total Balance</p>
              <p className="text-white text-2xl font-bold">₹{(balance + bonusBalance).toFixed(2)}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div>
                  <p className="text-white/60 text-xs">Main</p>
                  <p className="text-white text-sm font-semibold">₹{balance.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Bonus</p>
                  <p className="text-pink-300 text-sm font-semibold">₹{bonusBalance.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium">
                Deposit
              </button>
              <button className="bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium">
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <h3 className="text-white text-xl font-bold mb-2">Welcome Bonus</h3>
            <p className="text-white/90 text-sm mb-4">Get up to ₹10,000 bonus on your first deposit!</p>
            <button className="bg-white text-purple-600 px-6 py-2 rounded-xl font-semibold text-sm">
              Claim Now
            </button>
          </div>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6">
        <h3 className="text-white text-lg font-semibold mb-4">Game Categories</h3>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`relative p-4 rounded-2xl transition-all ${
                  isSelected 
                    ? `bg-gradient-to-r ${category.color} shadow-lg scale-105` 
                    : "bg-slate-800/50 hover:bg-slate-700/50"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-gray-400"}`} />
                  <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-gray-400"}`}>
                    {category.name}
                  </span>
                </div>
                {isSelected && (
                  <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hot Games Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">🔥 Hot Games</h3>
          <button className="text-pink-400 text-sm font-medium">View All</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {games?.slice(0, 4).map((game) => (
            <div key={game.id} className="bg-slate-800/50 rounded-2xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  HOT
                </div>
                <div className="absolute bottom-2 left-2">
                  <p className="text-white font-semibold text-sm">{game.title}</p>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-yellow-400 text-xs font-medium">⭐ {game.rating}</span>
                  <span className="text-green-400 text-xs font-medium">₹{game.jackpot}</span>
                </div>
                <button 
                  onClick={() => setSelectedGame(game)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-xl text-sm font-medium hover:scale-105 transition-all"
                >
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Winners */}
      <div className="px-4 mb-8">
        <h3 className="text-white text-lg font-semibold mb-4">🏆 Recent Winners</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Player****{index + 1}</p>
                  <p className="text-gray-400 text-xs">Won in Aviator</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-bold text-sm">₹{(Math.random() * 10000 + 1000).toFixed(0)}</p>
                <p className="text-gray-400 text-xs">{index + 1}m ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Modal */}
      {selectedGame && (
        <DreamClubGameModal
          game={selectedGame}
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          userBalance={balance}
        />
      )}
    </div>
  );
}