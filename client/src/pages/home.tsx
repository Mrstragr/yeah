import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GamePlayModal } from "@/components/game-play-modal";
import type { Game } from "@shared/schema";
import { 
  Trophy, 
  Zap, 
  Crown, 
  DollarSign, 
  TrendingUp,
  Users,
  Gamepad2,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  PlayCircle,
  Star,
  Clock,
  ArrowRight
} from "lucide-react";

// Category Icons mapping
const categoryIcons = {
  "Lobby": Crown,
  "Lottery": Trophy,
  "Popular": TrendingUp,
  "Mini Games": Gamepad2,
  "Casino": Dice1,
  "Slots": Dice2,
  "Sports": Users,
  "PVC": Dice3,
  "Fishing": Dice4,
  "Rummy": Dice5,
  "Live Casino": Dice6
};

// Live Winner Ticker Component
function LiveWinnerTicker() {
  const [currentWinner, setCurrentWinner] = useState(0);
  
  const winners = [
    { name: "Player7849", game: "Dragon Tiger", amount: "₹12,450", time: "2 min ago" },
    { name: "Lucky888", game: "Teen Patti", amount: "₹8,750", time: "5 min ago" },
    { name: "Winner123", game: "Andar Bahar", amount: "₹15,200", time: "8 min ago" },
    { name: "Casino999", game: "Baccarat", amount: "₹22,100", time: "12 min ago" },
    { name: "Royal777", game: "Roulette", amount: "₹6,890", time: "15 min ago" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWinner((prev) => (prev + 1) % winners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const winner = winners[currentWinner];

  return (
    <div className="winner-ticker">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-casino-gold rounded-full flex items-center justify-center">
          <Trophy className="w-4 h-4 text-casino-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-casino-gold truncate">
            {winner.name} won {winner.amount}
          </p>
          <p className="text-xs text-casino-text-muted">
            Playing {winner.game} • {winner.time}
          </p>
        </div>
        <div className="live-indicator">
          <Badge variant="destructive" className="bg-casino-red text-white text-xs">
            LIVE
          </Badge>
        </div>
      </div>
    </div>
  );
}

// Jackpot Counter Component
function JackpotCounter() {
  const [jackpot, setJackpot] = useState(12847293);

  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 50) + 10);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="casino-card casino-card-gradient p-6 text-center">
      <div className="flex items-center justify-center mb-2">
        <Crown className="w-6 h-6 text-casino-gold mr-2" />
        <h3 className="text-lg font-casino text-casino-gold">MEGA JACKPOT</h3>
      </div>
      <div className="jackpot-glow text-3xl font-casino font-bold mb-2">
        ₹{jackpot.toLocaleString('en-IN')}
      </div>
      <p className="text-sm text-casino-text-muted">Next draw in 2:45:18</p>
      <Button className="btn-casino-primary mt-4 w-full">
        <PlayCircle className="w-4 h-4 mr-2" />
        Play Now
      </Button>
    </div>
  );
}

// Game Categories Grid
function GameCategories() {
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    retry: false,
  });

  const casinoCategories = [
    { name: "Lottery", slug: "lottery", color: "from-casino-gold to-casino-orange", games: 25 },
    { name: "Popular", slug: "popular", color: "from-casino-red to-casino-purple", games: 42 },
    { name: "Mini Games", slug: "minigames", color: "from-casino-blue to-casino-green", games: 18 },
    { name: "Casino", slug: "casino", color: "from-casino-purple to-casino-red", games: 156 },
    { name: "Slots", slug: "slots", color: "from-casino-orange to-casino-gold", games: 89 },
    { name: "Sports", slug: "sports", color: "from-casino-green to-casino-blue", games: 12 },
    { name: "Rummy", slug: "rummy", color: "from-casino-gold to-casino-red", games: 8 },
    { name: "Fishing", slug: "fishing", color: "from-casino-blue to-casino-purple", games: 15 }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {casinoCategories.map((category) => {
        const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Gamepad2;
        
        return (
          <Link key={category.slug} href={`/category/${category.slug}`}>
            <Card className="casino-card cursor-pointer group">
              <CardContent className="p-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 mx-auto`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-casino font-bold text-center text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-xs text-casino-text-muted text-center">
                  {category.games} Games
                </p>
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" className="btn-casino-secondary w-full text-xs">
                    Play Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

// Featured Games Carousel
function FeaturedGames() {
  const featuredGames = [
    {
      id: 1,
      title: "Teen Patti Gold",
      provider: "Live Casino",
      image: "🃏",
      players: 1247,
      jackpot: "₹45,67,890"
    },
    {
      id: 2,
      title: "Andar Bahar Live",
      provider: "Evolution",
      image: "🎰",
      players: 892,
      jackpot: "₹23,45,120"
    },
    {
      id: 3,
      title: "Dragon Tiger",
      provider: "Ezugi",
      image: "🐲",
      players: 654,
      jackpot: "₹18,90,450"
    },
    {
      id: 4,
      title: "Indian Roulette",
      provider: "NetEnt",
      image: "🎯",
      players: 432,
      jackpot: "₹12,34,567"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-casino font-bold text-casino-gold">
          🔥 Hot Games
        </h2>
        <Button variant="ghost" size="sm" className="text-casino-gold">
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featuredGames.map((game) => (
          <Card key={game.id} className="game-card cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-casino-gold to-casino-orange rounded-xl flex items-center justify-center text-2xl">
                  {game.image}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-casino font-bold text-white truncate">
                    {game.title}
                  </h3>
                  <p className="text-sm text-casino-text-muted">
                    {game.provider}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center text-xs text-casino-green">
                      <Users className="w-3 h-3 mr-1" />
                      {game.players}
                    </div>
                    <div className="text-xs text-casino-gold font-semibold">
                      💰 {game.jackpot}
                    </div>
                  </div>
                </div>
                <Button size="sm" className="btn-casino-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Recent Winners Section
function RecentWinners() {
  const { data: topEarners = [] } = useQuery({
    queryKey: ["/api/leaderboard"],
    retry: false,
  });

  const mockWinners = [
    { name: "Player***49", game: "Teen Patti", amount: "₹1,24,500", avatar: "🎭" },
    { name: "Lucky***88", game: "Dragon Tiger", amount: "₹87,450", avatar: "🎪" },
    { name: "Winner***23", game: "Andar Bahar", amount: "₹65,780", avatar: "🎨" },
    { name: "Royal***77", game: "Baccarat", amount: "₹45,230", avatar: "👑" },
    { name: "Casino***99", game: "Roulette", amount: "₹38,900", avatar: "🎯" }
  ];

  return (
    <div className="casino-card p-6">
      <div className="flex items-center mb-4">
        <Trophy className="w-5 h-5 text-casino-gold mr-2" />
        <h3 className="text-lg font-casino font-bold text-casino-gold">
          Today's Big Winners
        </h3>
      </div>
      
      <div className="space-y-3">
        {mockWinners.map((winner, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-casino-accent/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-casino-gold to-casino-orange rounded-full flex items-center justify-center text-sm">
                {winner.avatar}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{winner.name}</p>
                <p className="text-xs text-casino-text-muted">{winner.game}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-casino font-bold text-casino-green text-sm">
                +{winner.amount}
              </p>
              <p className="text-xs text-casino-text-muted">
                {Math.floor(Math.random() * 30) + 1}m ago
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Casino Games Section - Direct Access to Popular Games
function CasinoGamesSection() {
  const [showGameModal, setShowGameModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);

  const { data: allGames = [] } = useQuery<Game[]>({
    queryKey: ["/api/games"],
    retry: false,
  });

  // Filter for the specific casino games we built
  const casinoGames = allGames.filter((game: Game) => 
    ['Aviator', 'Coin Flip', 'Dice Roll', 'Scratch Cards', 'Plinko', 'Plinko Casino'].includes(game.title)
  );

  // Define static casino games to ensure they always display
  const staticCasinoGames = [
    { id: 172, title: 'Dice Roll', description: 'Roll the dice and predict combinations', category: 'minigames' },
    { id: 173, title: 'Coin Flip', description: 'Simple heads or tails betting', category: 'minigames' },
    { id: 206, title: 'Aviator', description: 'Watch the plane fly and cash out before it crashes', category: 'crash' },
    { id: 207, title: 'Plinko Casino', description: 'Drop the ball and watch it bounce through pegs! Hit the 25x multiplier slot for massive wins!', category: 'Casino' },
    { id: 999, title: 'Scratch Cards', description: 'Instant win scratch cards', category: 'minigames' }
  ];

  // Ensure Plinko always appears by adding it to the display
  const ensurePlinkoGame = { 
    id: 207, 
    title: 'Plinko Casino', 
    description: 'Drop the ball and watch it bounce through pegs! Hit the 25x multiplier slot for massive wins!', 
    category: 'Casino',
    imageUrl: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250',
    rating: '4.8',
    jackpot: '₹15,00,000'
  };

  const handlePlayGame = (game: any) => {
    setSelectedGame(game);
    setShowGameModal(true);
  };

  // Always include Plinko in the display
  const plinkoGames = allGames.filter((game: Game) => 
    game.title.toLowerCase().includes("plinko")
  );
  
  // Combine all games and ensure Plinko Casino is always included
  const allCasinoGames = [...casinoGames, ...plinkoGames, ensurePlinkoGame];
  const uniqueGames = allCasinoGames.filter((game, index, self) => 
    index === self.findIndex(g => g.id === game.id)
  );
  
  const displayGames = uniqueGames.length > 0 ? uniqueGames : staticCasinoGames;

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-casino font-bold text-casino-gold">
            🎰 Popular Casino Games
          </h2>
          <Button variant="ghost" size="sm" className="text-casino-gold">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayGames.map((game: any) => (
            <Card key={game.id} className="game-card cursor-pointer group" onClick={() => handlePlayGame(game)}>
              <CardContent className="p-4">
                <div className="aspect-square bg-gradient-to-br from-casino-gold to-casino-orange rounded-xl flex items-center justify-center text-3xl mb-3">
                  {game.title === 'Aviator' && '✈️'}
                  {game.title === 'Coin Flip' && '🪙'}
                  {game.title === 'Dice Roll' && '🎲'}
                  {game.title === 'Scratch Cards' && '🎫'}
                  {(game.title === 'Plinko' || game.title === 'Plinko Casino') && '🎯'}
                </div>
                <h3 className="font-casino font-bold text-white text-center text-sm truncate mb-2">
                  {game.title}
                </h3>
                <div className="text-center">
                  <Button size="sm" className="btn-casino-primary w-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Play Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Game Play Modal */}
      {showGameModal && selectedGame && (
        <GamePlayModal
          isOpen={showGameModal}
          onClose={() => setShowGameModal(false)}
          game={selectedGame}
          onWin={(amount: string) => {
            console.log(`Won ${amount} in ${selectedGame.title}`);
            setShowGameModal(false);
          }}
        />
      )}
    </>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-casino-primary">
      {/* Header with Balance */}
      <div className="bg-casino-secondary border-b border-casino-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-casino font-bold text-casino-gold">AR079</h1>
            <p className="text-sm text-casino-text-muted">Welcome back, Player!</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-casino-text-muted">Wallet Balance</p>
            <p className="text-xl font-casino font-bold text-casino-gold">₹5,000.00</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* CASINO GAMES - TOP PRIORITY DISPLAY */}
        <div className="bg-red-500 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-white mb-4">🎰 CASINO GAMES</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded text-center">
              <div className="text-4xl mb-2">✈️</div>
              <h3 className="font-bold">Aviator</h3>
            </div>
            <div className="bg-white p-4 rounded text-center">
              <div className="text-4xl mb-2">🪙</div>
              <h3 className="font-bold">Coin Flip</h3>
            </div>
            <div className="bg-white p-4 rounded text-center">
              <div className="text-4xl mb-2">🎲</div>
              <h3 className="font-bold">Dice Roll</h3>
            </div>
            <div className="bg-white p-4 rounded text-center">
              <div className="text-4xl mb-2">🎫</div>
              <h3 className="font-bold">Scratch Cards</h3>
            </div>
          </div>
        </div>

        {/* Live Winner Ticker */}
        <LiveWinnerTicker />

        {/* Jackpot Section */}
        <JackpotCounter />

        {/* Game Categories */}
        <div>
          <h2 className="text-xl font-casino font-bold text-casino-gold mb-4">
            Game Categories
          </h2>
          <GameCategories />
        </div>

        {/* Casino Games - Direct Access */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-casino font-bold text-casino-gold">
              🎰 Popular Casino Games
            </h2>
            <Button variant="ghost" size="sm" className="text-casino-gold">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="game-card cursor-pointer group">
              <CardContent className="p-4">
                <div className="aspect-square bg-gradient-to-br from-casino-gold to-casino-orange rounded-xl flex items-center justify-center text-3xl mb-3">
                  ✈️
                </div>
                <h3 className="font-casino font-bold text-white text-center text-sm truncate mb-2">
                  Aviator
                </h3>
                <div className="text-center">
                  <Button size="sm" className="btn-casino-primary w-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Play Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="game-card cursor-pointer group">
              <CardContent className="p-4">
                <div className="aspect-square bg-gradient-to-br from-casino-gold to-casino-orange rounded-xl flex items-center justify-center text-3xl mb-3">
                  🪙
                </div>
                <h3 className="font-casino font-bold text-white text-center text-sm truncate mb-2">
                  Coin Flip
                </h3>
                <div className="text-center">
                  <Button size="sm" className="btn-casino-primary w-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Play Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="game-card cursor-pointer group">
              <CardContent className="p-4">
                <div className="aspect-square bg-gradient-to-br from-casino-gold to-casino-orange rounded-xl flex items-center justify-center text-3xl mb-3">
                  🎲
                </div>
                <h3 className="font-casino font-bold text-white text-center text-sm truncate mb-2">
                  Dice Roll
                </h3>
                <div className="text-center">
                  <Button size="sm" className="btn-casino-primary w-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Play Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="game-card cursor-pointer group">
              <CardContent className="p-4">
                <div className="aspect-square bg-gradient-to-br from-casino-gold to-casino-orange rounded-xl flex items-center justify-center text-3xl mb-3">
                  🎫
                </div>
                <h3 className="font-casino font-bold text-white text-center text-sm truncate mb-2">
                  Scratch Cards
                </h3>
                <div className="text-center">
                  <Button size="sm" className="btn-casino-primary w-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Play Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Featured Games */}
        <FeaturedGames />

        {/* Recent Winners */}
        <RecentWinners />

        {/* Disclaimer */}
        <div className="bg-casino-accent/30 border border-casino-border rounded-lg p-4">
          <p className="text-xs text-casino-text-muted text-center leading-relaxed">
            🎯 AR079 operates fair lottery, blockchain games, live casinos, and slot machines. 
            All games are verified fair with 10,000+ live dealers. Fast deposits & withdrawals available.
            <br />
            ⚠️ Gambling can be addictive. Play responsibly. 18+ only.
          </p>
        </div>
      </div>
    </div>
  );
}