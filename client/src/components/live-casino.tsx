import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Eye, 
  PlayCircle, 
  Volume2,
  Maximize,
  Heart,
  Star
} from "lucide-react";

interface LiveGame {
  id: number;
  title: string;
  dealer: string;
  players: number;
  viewers: number;
  minBet: string;
  maxBet: string;
  tableId: string;
  status: "live" | "waiting" | "break";
  image: string;
  category: string;
}

const liveGames: LiveGame[] = [
  {
    id: 1,
    title: "Teen Patti Live",
    dealer: "Priya",
    players: 8,
    viewers: 156,
    minBet: "₹10",
    maxBet: "₹50,000",
    tableId: "TP001",
    status: "live",
    image: "🃏",
    category: "Card Games"
  },
  {
    id: 2,
    title: "Andar Bahar Express",
    dealer: "Ravi",
    players: 12,
    viewers: 203,
    minBet: "₹5",
    maxBet: "₹25,000",
    tableId: "AB002",
    status: "live",
    image: "🎰",
    category: "Card Games"
  },
  {
    id: 3,
    title: "Dragon Tiger Gold",
    dealer: "Neha",
    players: 6,
    viewers: 89,
    minBet: "₹20",
    maxBet: "₹1,00,000",
    tableId: "DT003",
    status: "live",
    image: "🐲",
    category: "Card Games"
  },
  {
    id: 4,
    title: "Indian Roulette",
    dealer: "Amit",
    players: 15,
    viewers: 312,
    minBet: "₹50",
    maxBet: "₹2,00,000",
    tableId: "IR004",
    status: "live",
    image: "🎯",
    category: "Roulette"
  }
];

export function LiveCasino() {
  const [selectedGame, setSelectedGame] = useState<LiveGame | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (gameId: number) => {
    setFavorites(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const joinGame = (game: LiveGame) => {
    setSelectedGame(game);
    // In a real app, this would redirect to the game interface
    alert(`Joining ${game.title} - Table ${game.tableId}\nDealer: ${game.dealer}\nBet Range: ${game.minBet} - ${game.maxBet}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-casino font-bold text-casino-gold">
            🔴 Live Casino
          </h2>
          <p className="text-sm text-casino-text-muted">
            Play with real dealers in real-time
          </p>
        </div>
        <Badge className="bg-casino-red text-white">
          {liveGames.filter(g => g.status === "live").length} Tables Live
        </Badge>
      </div>

      {/* Live Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {liveGames.map((game) => (
          <Card key={game.id} className="game-card relative overflow-hidden">
            <CardContent className="p-0">
              {/* Game Image/Video Preview */}
              <div className="relative h-48 bg-gradient-to-br from-casino-accent to-casino-secondary">
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  {game.image}
                </div>
                
                {/* Live Badge */}
                {game.status === "live" && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-casino-red text-white text-xs animate-pulse">
                      🔴 LIVE
                    </Badge>
                  </div>
                )}

                {/* Favorite Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-3 right-3 text-white hover:text-casino-gold"
                  onClick={() => toggleFavorite(game.id)}
                >
                  <Heart 
                    className={`w-4 h-4 ${favorites.includes(game.id) ? 'fill-casino-red text-casino-red' : ''}`} 
                  />
                </Button>

                {/* Viewers Count */}
                <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black/50 rounded px-2 py-1">
                  <Eye className="w-3 h-3 text-white" />
                  <span className="text-xs text-white">{game.viewers}</span>
                </div>

                {/* Players Count */}
                <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-black/50 rounded px-2 py-1">
                  <Users className="w-3 h-3 text-casino-green" />
                  <span className="text-xs text-white">{game.players}/12</span>
                </div>
              </div>

              {/* Game Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-casino font-bold text-white text-lg">
                    {game.title}
                  </h3>
                  <p className="text-sm text-casino-text-muted">
                    Table {game.tableId} • Dealer: {game.dealer}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-casino-text-muted">Min Bet: </span>
                    <span className="text-casino-green font-semibold">{game.minBet}</span>
                  </div>
                  <div>
                    <span className="text-casino-text-muted">Max Bet: </span>
                    <span className="text-casino-gold font-semibold">{game.maxBet}</span>
                  </div>
                </div>

                <Button 
                  className="btn-casino-primary w-full"
                  onClick={() => joinGame(game)}
                  disabled={game.status !== "live"}
                >
                  {game.status === "live" ? (
                    <>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Join Table
                    </>
                  ) : (
                    "Table Closed"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Game Categories Filter */}
      <div className="flex flex-wrap gap-2">
        {["All", "Card Games", "Roulette", "Baccarat", "Blackjack"].map((category) => (
          <Button
            key={category}
            variant="ghost"
            size="sm"
            className="text-casino-text-muted hover:text-casino-gold hover:bg-casino-accent/50"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Live Stats */}
      <Card className="casino-card">
        <CardContent className="p-6">
          <h3 className="font-casino font-bold text-casino-gold mb-4">
            Live Casino Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-casino font-bold text-casino-gold">
                {liveGames.reduce((sum, game) => sum + game.players, 0)}
              </div>
              <div className="text-xs text-casino-text-muted">Players Online</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-casino font-bold text-casino-blue">
                {liveGames.reduce((sum, game) => sum + game.viewers, 0)}
              </div>
              <div className="text-xs text-casino-text-muted">Total Viewers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-casino font-bold text-casino-green">
                {liveGames.filter(g => g.status === "live").length}
              </div>
              <div className="text-xs text-casino-text-muted">Live Tables</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-casino font-bold text-casino-orange">
                24/7
              </div>
              <div className="text-xs text-casino-text-muted">Available</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}