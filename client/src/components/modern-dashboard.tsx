import { useState, useEffect } from "react";

interface ModernDashboardProps {
  games: any[];
  categories: any[];
  onGameSelect: (gameId: string) => void;
}

export function ModernDashboard({ games, categories, onGameSelect }: ModernDashboardProps) {
  const [activeTab, setActiveTab] = useState('hot');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Map game titles to component identifiers
  const getGameIdentifier = (gameTitle: string) => {
    const gameMap: { [key: string]: string } = {
      'Win Go 1Min': 'wingo1',
      'Win Go 3Min': 'wingo3', 
      'Win Go 5Min': 'wingo5',
      '5D Lottery': '5d',
      'K3 Lottery': 'k3',
      'Trx Win Go': 'trx',
      'Aviator': 'aviator',
      'JetX': 'jetx',
      'Andar Bahar': 'andarbahar',
      'Teen Patti': 'teenpatti',
      'Dragon Tiger': 'dragontiger',
      'Baccarat': 'baccarat',
      'Classic Slots': 'slots',
      'Mega Jackpot': 'megajackpot',
      'Coin Flip': 'coinflip',
      'Dice Roll': 'diceroll',
      'High Low Cards': 'highlow',
      'Big Small': 'bigsmall'
    };
    return gameMap[gameTitle] || gameTitle.toLowerCase().replace(/\s+/g, '');
  };

  const GameCard = ({ game, featured = false }: { game: any; featured?: boolean }) => (
    <div 
      onClick={() => onGameSelect(getGameIdentifier(game.title))}
      className={`
        group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500
        ${featured ? 'col-span-2 row-span-2' : ''}
        hover:scale-105 hover:shadow-2xl hover:shadow-[#D4AF37]/20
        bg-gradient-to-br from-[#2a2a2a] via-[#3a3a3a] to-[#2a2a2a]
        border border-gray-700 hover:border-[#D4AF37]/50
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500 rounded-full blur-2xl"></div>
      </div>

      <div className="relative p-4 h-full flex flex-col">
        {/* Game Icon/Image */}
        <div className={`${featured ? 'h-32' : 'h-16'} mb-3 flex items-center justify-center`}>
          <div className={`
            ${featured ? 'w-20 h-20' : 'w-12 h-12'} 
            bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-2xl 
            flex items-center justify-center shadow-xl
            group-hover:scale-110 transition-transform duration-300
          `}>
            <span className={`text-black font-bold ${featured ? 'text-2xl' : 'text-lg'}`}>
              {game.title.charAt(0)}
            </span>
          </div>
        </div>

        {/* Game Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className={`text-casino-text font-bold group-hover:text-casino-gold transition-colors ${featured ? 'text-lg mb-2' : 'text-sm mb-1'}`}>
              {game.title}
            </h3>
            <p className={`text-casino-text-muted ${featured ? 'text-sm' : 'text-xs'}`}>
              {game.description}
            </p>
          </div>

          {/* Game Stats */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-casino-text-muted">
                  {Math.floor(Math.random() * 200 + 50)} playing
                </span>
              </div>
            </div>
            <div className="text-[#D4AF37] text-xs font-bold">
              {game.jackpot || '₹' + (Math.floor(Math.random() * 10000) + 1000)}
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );

  const CategoryTab = ({ category, isActive, onClick }: { category: string; isActive: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300
        ${isActive 
          ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-casino-text-dark shadow-lg scale-105' 
          : 'bg-[#2a2a2a] text-casino-text-muted hover:text-casino-text hover:bg-[#3a3a3a]'
        }
      `}
    >
      {category}
    </button>
  );

  return (
    <div className="relative z-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-6 mb-6 rounded-2xl mx-4 mt-4">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#D4AF37] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-purple-500 rounded-full blur-2xl animate-bounce"></div>
        </div>
        
        <div className="relative text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent mb-2">
            Welcome to Premium Gaming
          </h2>
          <p className="text-casino-text-muted mb-4">Experience the thrill of authentic casino games with real cash rewards</p>
          
          {/* Live Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="bg-[#2a2a2a] rounded-xl p-3">
              <div className="text-[#D4AF37] font-bold text-lg">₹1.2M</div>
              <div className="text-gray-400 text-xs">Today's Payouts</div>
            </div>
            <div className="bg-[#2a2a2a] rounded-xl p-3">
              <div className="text-green-500 font-bold text-lg">1,247</div>
              <div className="text-gray-400 text-xs">Players Online</div>
            </div>
            <div className="bg-[#2a2a2a] rounded-xl p-3">
              <div className="text-purple-500 font-bold text-lg">₹5.8M</div>
              <div className="text-gray-400 text-xs">Total Jackpot</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {['🔥 Hot', '🎰 Slots', '🃏 Cards', '🎲 Dice', '⚡ Quick', '🏆 Jackpot'].map((category) => (
            <CategoryTab 
              key={category}
              category={category}
              isActive={activeTab === category.split(' ')[1].toLowerCase()}
              onClick={() => setActiveTab(category.split(' ')[1].toLowerCase())}
            />
          ))}
        </div>
      </div>

      {/* Game Grid */}
      <div className="px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {games.slice(0, 8).map((game, index) => (
            <GameCard 
              key={game.id} 
              game={game} 
              featured={index === 0}
            />
          ))}
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="mx-4 mb-6 relative overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 rounded-2xl p-6">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-xl mb-2">🎉 Weekend Bonus</h3>
            <p className="text-gray-300 text-sm mb-3">Get 100% bonus on your next deposit</p>
            <button className="bg-[#D4AF37] text-black px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform">
              Claim Now
            </button>
          </div>
          <div className="text-6xl opacity-50">💰</div>
        </div>
      </div>

      {/* Recent Winners */}
      <div className="mx-4 mb-6">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          🏆 Recent Big Wins
        </h3>
        <div className="space-y-3">
          {[
            { name: "Player***89", game: "Mega Jackpot", amount: "₹45,680" },
            { name: "Lucky***23", game: "Aviator", amount: "₹32,150" },
            { name: "Winner***56", game: "Dragon Tiger", amount: "₹28,940" },
          ].map((winner, index) => (
            <div key={index} className="bg-gradient-to-r from-[#2a2a2a] to-[#3a3a3a] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🎊</span>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{winner.name}</div>
                  <div className="text-gray-400 text-xs">{winner.game}</div>
                </div>
              </div>
              <div className="text-[#D4AF37] font-bold">{winner.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}