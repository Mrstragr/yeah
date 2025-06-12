import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GamePlayModal } from "@/components/game-play-modal";
import { CasinoSliders } from "@/components/casino-sliders";
import { PlinkoModal } from "@/components/plinko-modal";
import { AchievementsShowcase } from "@/components/achievements-showcase";
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



export default function Home() {
  const [showPlinkoModal, setShowPlinkoModal] = useState(false);

  const handlePlayPlinko = () => {
    setShowPlinkoModal(true);
  };

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
        {/* CASINO GAME SLIDERS - FINAL VERSION */}
        <div className="bg-red-900 p-6 rounded-lg space-y-4">
          <h2 className="text-2xl font-bold text-white">🎰 CLASSIC CASINO GAMES</h2>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-4" style={{minWidth: 'max-content'}}>
              <div className="bg-yellow-600 p-6 rounded-lg text-center min-w-[200px] hover:bg-yellow-500 transition-colors cursor-pointer">
                <div className="text-5xl mb-3">✈️</div>
                <h3 className="font-bold text-white text-lg mb-2">Aviator</h3>
                <p className="text-yellow-100 text-sm mb-3">Watch the plane fly and cash out</p>
                <button className="bg-white text-yellow-600 px-4 py-2 rounded font-bold hover:bg-yellow-100 transition-colors">
                  PLAY NOW
                </button>
              </div>
              <div className="bg-yellow-600 p-6 rounded-lg text-center min-w-[200px] hover:bg-yellow-500 transition-colors cursor-pointer">
                <div className="text-5xl mb-3">🪙</div>
                <h3 className="font-bold text-white text-lg mb-2">Coin Flip</h3>
                <p className="text-yellow-100 text-sm mb-3">Simple heads or tails betting</p>
                <button className="bg-white text-yellow-600 px-4 py-2 rounded font-bold hover:bg-yellow-100 transition-colors">
                  PLAY NOW
                </button>
              </div>
              <div className="bg-yellow-600 p-6 rounded-lg text-center min-w-[200px] hover:bg-yellow-500 transition-colors cursor-pointer">
                <div className="text-5xl mb-3">🎲</div>
                <h3 className="font-bold text-white text-lg mb-2">Dice Roll</h3>
                <p className="text-yellow-100 text-sm mb-3">Roll dice and predict combinations</p>
                <button className="bg-white text-yellow-600 px-4 py-2 rounded font-bold hover:bg-yellow-100 transition-colors">
                  PLAY NOW
                </button>
              </div>
              <div className="bg-yellow-600 p-6 rounded-lg text-center min-w-[200px] hover:bg-yellow-500 transition-colors cursor-pointer">
                <div className="text-5xl mb-3">🎫</div>
                <h3 className="font-bold text-white text-lg mb-2">Scratch Cards</h3>
                <p className="text-yellow-100 text-sm mb-3">Instant win scratch cards</p>
                <button className="bg-white text-yellow-600 px-4 py-2 rounded font-bold hover:bg-yellow-100 transition-colors">
                  PLAY NOW
                </button>
              </div>
              <div className="bg-yellow-600 p-6 rounded-lg text-center min-w-[200px] hover:bg-yellow-500 transition-colors cursor-pointer">
                <div className="text-5xl mb-3">🎡</div>
                <h3 className="font-bold text-white text-lg mb-2">Roulette</h3>
                <p className="text-yellow-100 text-sm mb-3">Classic casino roulette wheel</p>
                <button className="bg-white text-yellow-600 px-4 py-2 rounded font-bold hover:bg-yellow-100 transition-colors">
                  PLAY NOW
                </button>
              </div>
              <div className="bg-yellow-600 p-6 rounded-lg text-center min-w-[200px] hover:bg-yellow-500 transition-colors cursor-pointer">
                <div className="text-5xl mb-3">🃏</div>
                <h3 className="font-bold text-white text-lg mb-2">Blackjack</h3>
                <p className="text-yellow-100 text-sm mb-3">Beat the dealer with 21</p>
                <button className="bg-white text-yellow-600 px-4 py-2 rounded font-bold hover:bg-yellow-100 transition-colors">
                  PLAY NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-6 rounded-lg space-y-4 border-2 border-purple-400">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">🚀 NEW GAMES</h2>
            <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              JUST LAUNCHED
            </span>
          </div>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-4" style={{minWidth: 'max-content'}}>
              <div className="bg-green-600 p-8 rounded-lg text-center min-w-[250px] hover:scale-105 transition-all cursor-pointer border-2 border-white" onClick={handlePlayPlinko}>
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="font-bold text-white text-xl mb-3">PLINKO</h3>
                <p className="text-white text-sm mb-4 opacity-90">Drop balls and win big multipliers!</p>
                <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-colors">
                  PLAY NOW
                </button>
              </div>
              <div className="bg-purple-600 p-8 rounded-lg text-center min-w-[250px] hover:scale-105 transition-all cursor-pointer border-2 border-white">
                <div className="text-6xl mb-4">🌈</div>
                <h3 className="font-bold text-white text-xl mb-3">COLOR PREDICTION</h3>
                <p className="text-white text-sm mb-4 opacity-90">Predict colors and multiply winnings!</p>
                <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-colors">
                  COMING SOON
                </button>
              </div>
              <div className="bg-blue-600 p-8 rounded-lg text-center min-w-[250px] hover:scale-105 transition-all cursor-pointer border-2 border-white">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="font-bold text-white text-xl mb-3">CRASH GAME</h3>
                <p className="text-white text-sm mb-4 opacity-90">Watch the multiplier grow and cash out!</p>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-colors">
                  COMING SOON
                </button>
              </div>
              <div className="bg-indigo-600 p-8 rounded-lg text-center min-w-[250px] hover:scale-105 transition-all cursor-pointer border-2 border-white">
                <div className="text-6xl mb-4">💎</div>
                <h3 className="font-bold text-white text-xl mb-3">MINES</h3>
                <p className="text-white text-sm mb-4 opacity-90">Find gems while avoiding mines!</p>
                <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-colors">
                  COMING SOON
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Winner Ticker */}
        <LiveWinnerTicker />

        {/* Jackpot Section */}
        <JackpotCounter />

        {/* Achievements Showcase */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-casino font-bold text-casino-gold">
              🏆 Your Achievements
            </h2>
            <Button variant="ghost" size="sm" className="text-casino-gold">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <AchievementsShowcase />
        </div>

        {/* Game Categories */}
        <div>
          <h2 className="text-xl font-casino font-bold text-casino-gold mb-4">
            Game Categories
          </h2>
          <GameCategories />
        </div>

        {/* Casino Game Sliders */}
        <CasinoSliders onPlayPlinko={handlePlayPlinko} />

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
      
      {/* Plinko Game Modal */}
      <PlinkoModal
        isOpen={showPlinkoModal}
        onClose={() => setShowPlinkoModal(false)}
        onWin={(amount: string) => {
          console.log(`Won ${amount} in Plinko!`);
        }}
      />
    </div>
  );
}