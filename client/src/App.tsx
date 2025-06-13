import { useState } from 'react';
import { 
  Home, 
  BarChart3, 
  Gift, 
  Wallet, 
  User, 
  Bell, 
  Search,
  Star,
  TrendingUp,
  Zap,
  Crown,
  Trophy,
  Download,
  Menu,
  X
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                91DreamClub
              </h1>
              <p className="text-xs text-gray-400">Premium Gaming</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-gray-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center"
            >
              {showMenu ? <X className="w-5 h-5 text-gray-300" /> : <Menu className="w-5 h-5 text-gray-300" />}
            </button>
          </div>
        </div>
      </header>

      {/* Balance & VIP Section */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm">Total Balance</p>
                <p className="text-3xl font-bold text-white">₹10,000.00</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-medium">VIP 3</span>
                </div>
                <p className="text-white/80 text-xs">Level Progress</p>
                <div className="w-20 h-2 bg-white/20 rounded-full mt-1">
                  <div className="w-3/4 h-full bg-yellow-400 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="flex-1 bg-white/20 backdrop-blur-sm rounded-2xl py-3 font-medium">
                Deposit
              </button>
              <button className="flex-1 bg-white/20 backdrop-blur-sm rounded-2xl py-3 font-medium">
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search games..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Game Categories */}
      <div className="px-4 mb-6">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {['All', 'Hot', 'Slots', 'Live', 'Sports', 'Lottery'].map((category) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-2xl font-medium whitespace-nowrap transition-all ${
                category === 'All' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Welcome Bonus</h3>
                <p className="text-white/80 text-sm mb-3">Get up to ₹50,000 bonus on first deposit</p>
                <button className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-2xl font-medium">
                  Claim Now
                </button>
              </div>
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                <Gift className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="px-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Popular Games</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Aviator', icon: '✈️', jackpot: '50,000', rating: '4.8' },
            { name: 'Coin Flip', icon: '🪙', jackpot: '25,000', rating: '4.7' },
            { name: 'Dice Roll', icon: '🎲', jackpot: '30,000', rating: '4.6' },
            { name: 'Big Small', icon: '🎯', jackpot: '40,000', rating: '4.9' },
            { name: 'Blackjack', icon: '🃏', jackpot: '60,000', rating: '4.8' },
            { name: 'Lucky Numbers', icon: '🍀', jackpot: '35,000', rating: '4.5' },
          ].map((game, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-4 border border-slate-700/50 hover:scale-105 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-xl">
                  {game.icon}
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-300">{game.rating}</span>
                  </div>
                  <p className="text-xs text-gray-400">Rating</p>
                </div>
              </div>
              
              <h3 className="font-bold text-white mb-2">{game.name}</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-yellow-400 text-xs font-medium">⭐ {game.rating}</span>
                <span className="text-green-400 text-xs font-medium">₹{game.jackpot}</span>
              </div>
              <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-2xl text-sm font-medium hover:scale-105 transition-all shadow-lg">
                Play Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Winners */}
      <div className="px-4 mb-6">
        <h2 className="text-xl font-bold mb-4">🔥 Live Winners</h2>
        <div className="space-y-3">
          {[
            { name: 'Raj***', game: 'Aviator', amount: '8,500', time: '2m ago' },
            { name: 'Priya***', game: 'Blackjack', amount: '12,000', time: '5m ago' },
            { name: 'Amit***', game: 'Lucky Numbers', amount: '6,750', time: '8m ago' },
          ].map((winner, index) => (
            <div key={index} className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{winner.name}</p>
                    <p className="text-sm text-gray-400">{winner.game}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-sm">₹{winner.amount}</p>
                  <p className="text-gray-400 text-xs">{winner.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download App Banner */}
      <div className="px-4 mb-20">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Download Our App</h3>
                <p className="text-white/80 text-sm mb-3">Get exclusive bonuses and faster gameplay</p>
                <button className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-2xl font-medium flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700">
        <div className="flex items-center justify-around py-3">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'activity', icon: BarChart3, label: 'Activity' },
            { id: 'promotion', icon: Gift, label: 'Promotion' },
            { id: 'wallet', icon: Wallet, label: 'Wallet' },
            { id: 'account', icon: User, label: 'Account' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-2xl transition-all ${
                activeTab === tab.id
                  ? 'text-purple-400'
                  : 'text-gray-400'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-purple-400' : 'text-gray-400'}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;