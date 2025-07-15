import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { 
  Gamepad2, 
  Search, 
  Star, 
  TrendingUp, 
  Clock, 
  Users, 
  Trophy,
  Zap,
  Target,
  Sword,
  Plane,
  Bomb,
  Dice1
} from 'lucide-react';
import { GameThumbnails, OfficialAviatorThumbnail } from './GameThumbnails';

interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  players: number;
  minBet: number;
  maxMultiplier: number;
  rating: number;
  isHot: boolean;
  isNew: boolean;
  component: string;
}

interface GameLobbyProps {
  onSelectGame: (gameId: string) => void;
}

export default function GameLobby({ onSelectGame }: GameLobbyProps) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [games] = useState<Game[]>([
    {
      id: 'wingo',
      title: 'WinGo',
      description: 'Color and number prediction game with 30-second rounds',
      category: 'lottery',
      icon: <Target className="w-8 h-8" />,
      color: 'text-green-500',
      bgGradient: 'from-green-400 to-emerald-600',
      players: 12847,
      minBet: 10,
      maxMultiplier: 9,
      rating: 4.8,
      isHot: true,
      isNew: false,
      component: 'ProductionWinGo'
    },
    {
      id: 'aviator',
      title: 'Aviator',
      description: 'Crash game with real-time multipliers and cash-out system',
      category: 'crash',
      icon: <Plane className="w-8 h-8" />,
      color: 'text-blue-500',
      bgGradient: 'from-blue-400 to-purple-600',
      players: 8934,
      minBet: 10,
      maxMultiplier: 100,
      rating: 4.9,
      isHot: true,
      isNew: false,
      component: 'ProductionAviator'
    },
    {
      id: 'official-aviator',
      title: 'Official Aviator',
      description: 'Authentic Spribe Aviator with exact official graph design',
      category: 'crash',
      icon: <GameThumbnails.aviator className="w-8 h-8" />,
      color: 'text-red-500',
      bgGradient: 'from-red-500 to-orange-600',
      players: 15234,
      minBet: 10,
      maxMultiplier: 200,
      rating: 5.0,
      isHot: true,
      isNew: true,
      component: 'OfficialAviator'
    },
    {
      id: 'mines',
      title: 'Mines',
      description: 'Strategic minefield game with progressive multipliers',
      category: 'strategy',
      icon: <Bomb className="w-8 h-8" />,
      color: 'text-purple-500',
      bgGradient: 'from-purple-400 to-pink-600',
      players: 5672,
      minBet: 10,
      maxMultiplier: 25,
      rating: 4.7,
      isHot: false,
      isNew: true,
      component: 'ProductionMines'
    },
    {
      id: 'dice',
      title: 'Dice',
      description: 'Number prediction game with customizable multipliers',
      category: 'prediction',
      icon: <Dice1 className="w-8 h-8" />,
      color: 'text-orange-500',
      bgGradient: 'from-orange-400 to-red-600',
      players: 4521,
      minBet: 10,
      maxMultiplier: 99,
      rating: 4.6,
      isHot: false,
      isNew: false,
      component: 'ProductionDice'
    },
    {
      id: 'dragon-tiger',
      title: 'Dragon Tiger',
      description: 'Classic card battle game with live dealing',
      category: 'cards',
      icon: <Sword className="w-8 h-8" />,
      color: 'text-red-500',
      bgGradient: 'from-red-400 to-orange-600',
      players: 3847,
      minBet: 10,
      maxMultiplier: 8,
      rating: 4.5,
      isHot: false,
      isNew: false,
      component: 'ProductionDragonTiger'
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Games', count: games.length },
    { id: 'lottery', name: 'Lottery', count: games.filter(g => g.category === 'lottery').length },
    { id: 'crash', name: 'Crash', count: games.filter(g => g.category === 'crash').length },
    { id: 'strategy', name: 'Strategy', count: games.filter(g => g.category === 'strategy').length },
    { id: 'prediction', name: 'Prediction', count: games.filter(g => g.category === 'prediction').length },
    { id: 'cards', name: 'Cards', count: games.filter(g => g.category === 'cards').length },
  ];

  useEffect(() => {
    loadUserBalance();
  }, []);

  const loadUserBalance = async () => {
    try {
      const response = await api.getBalance();
      setBalance(response.balance);
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const hotGames = games.filter(game => game.isHot);
  const newGames = games.filter(game => game.isNew);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Game Lobby
        </h1>
        <p className="text-gray-600">Choose your game • Real money • Instant payouts</p>
      </div>

      {/* Balance & Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-blue-500" />
              Gaming Dashboard
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              Balance: ₹{balance.toFixed(2)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{games.length}</div>
              <div className="text-sm text-gray-600">Available Games</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{hotGames.length}</div>
              <div className="text-sm text-gray-600">Hot Games</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{newGames.length}</div>
              <div className="text-sm text-gray-600">New Games</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {games.reduce((total, game) => total + game.players, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Active Players</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Hot Games Section */}
      {hotGames.length > 0 && selectedCategory === 'all' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            Hot Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotGames.map(game => (
              <Card key={game.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`${game.color}`}>
                      {game.id === 'official-aviator' ? 
                        <OfficialAviatorThumbnail className="w-8 h-8" /> : 
                        game.icon
                      }
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                        HOT
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs">{game.rating}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{game.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {game.players.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {game.maxMultiplier}x
                    </div>
                  </div>
                  <Button 
                    className={`w-full bg-gradient-to-r ${game.bgGradient} hover:opacity-90`}
                    onClick={() => onSelectGame(game.id)}
                  >
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Games */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          {selectedCategory === 'all' ? 'All Games' : 
           categories.find(c => c.id === selectedCategory)?.name || 'Games'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGames.map(game => (
            <Card key={game.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${game.color}`}>
                    {game.id === 'official-aviator' ? 
                      <OfficialAviatorThumbnail className="w-8 h-8" /> : 
                      game.icon
                    }
                  </div>
                  <div className="flex gap-1">
                    {game.isHot && (
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                        HOT
                      </Badge>
                    )}
                    {game.isNew && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        NEW
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs">{game.rating}</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{game.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {game.players.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    {game.maxMultiplier}x max
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Min ₹{game.minBet}
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {game.category}
                  </div>
                </div>
                <Button 
                  className={`w-full bg-gradient-to-r ${game.bgGradient} hover:opacity-90`}
                  onClick={() => onSelectGame(game.id)}
                >
                  Play Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* No Games Found */}
      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <Gamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">No games found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Gaming Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Gaming Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Live Games</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0.3s</div>
              <div className="text-sm text-gray-600">Avg Payout</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">99%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">₹10</div>
              <div className="text-sm text-gray-600">Min Bet</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}