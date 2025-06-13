import { useState } from 'react';
import { 
  Home, 
  BarChart3, 
  Gift, 
  Wallet, 
  User, 
  Bell, 
  ChevronRight,
  ArrowLeft,
  Copy,
  Settings,
  MessageCircle,
  Users,
  HelpCircle,
  LogOut,
  Download,
  TrendingUp
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const HomeScreen = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with exact 91CLUB styling */}
      <div className="header-gradient">
        <div className="flex items-center justify-between mb-6">
          <div className="text-91club text-white">91CLUB</div>
          <Bell className="w-6 h-6 text-white" />
        </div>
        
        {/* Promotional Banner */}
        <div className="card-white p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Only deposit funds through the official 91CLUB website and you can</div>
              <div className="text-sm text-gray-600">check from our alternative link at 91club.com the page are similar in look</div>
            </div>
            <div className="w-16 h-16 bg-red-gradient rounded-full flex items-center justify-center ml-4">
              <span className="text-white text-xs font-bold">91</span>
            </div>
          </div>
        </div>

        {/* Balance Section */}
        <div className="card-white p-4 mb-4">
          <div className="text-gray-500 text-sm mb-1">Wallet balance</div>
          <div className="balance-text">₹0.39</div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button className="action-btn bg-orange-button text-white">
            Withdraw
          </button>
          <button className="action-btn bg-red-button text-white">
            Deposits
          </button>
        </div>

        {/* Wheel & VIP Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-3 text-center">
            <div className="text-white font-medium text-sm">Wheel</div>
            <div className="text-white text-xs">of fortune</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3 text-center">
            <div className="text-white font-medium text-sm">VIP</div>
            <div className="text-white text-xs">privileges</div>
          </div>
        </div>
      </div>

      {/* Game Categories Navigation */}
      <div className="category-nav">
        <div className="flex space-x-6 overflow-x-auto">
          {[
            { name: 'Lobby', icon: '🏠', active: true },
            { name: 'PK', icon: '⚔️', active: false },
            { name: 'Mines', icon: '💎', active: false },
            { name: 'Original', icon: '🎯', active: false },
            { name: 'Fishing', icon: '🎣', active: false },
            { name: 'Lottery', icon: '🎰', active: false }
          ].map((category) => (
            <div key={category.name} className="category-item">
              <div className={`category-icon ${category.active ? 'active' : 'inactive'}`}>
                <span className="text-lg">{category.icon}</span>
              </div>
              <span className={`category-label ${category.active ? 'active' : 'inactive'}`}>
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="content-padding">
        {/* Lottery Section */}
        <div className="section-spacing">
          <div className="section-header">
            <div className="section-left">
              <div className="section-dot bg-red-500"></div>
              <span className="section-title">Lottery</span>
            </div>
            <div className="section-right">
              <span>Detail</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          
          <div className="lottery-grid">
            <div className="lottery-card-blue game-card">
              <div className="game-title mb-1">WIN GO</div>
              <div className="text-2xl font-bold">1</div>
            </div>
            <div className="lottery-card-pink game-card">
              <div className="game-title mb-1">K3</div>
              <div className="text-sm">Lotre</div>
            </div>
            <div className="lottery-card-green game-card">
              <div className="game-title mb-1">5D</div>
              <div className="text-sm">Lotre</div>
            </div>
            <div className="lottery-card-purple game-card">
              <div className="text-sm font-bold mb-1">TRX WINGO</div>
              <div className="text-xs">Win</div>
            </div>
          </div>
        </div>

        {/* MOTO RACING */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-center text-white shadow-lg">
            <div className="text-2xl font-bold">MOTO RACING</div>
          </div>
        </div>

        {/* Mini Games */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
              <span className="font-semibold text-gray-800">Mini game</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <span className="text-sm">Detail</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl p-4 text-center text-white">
              <div className="text-xs font-bold">DRAGON</div>
              <div className="text-xs font-bold">TIGER</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-center text-white">
              <div className="text-sm font-bold">GOAL</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-center text-white">
              <div className="text-sm font-bold">DICE</div>
            </div>
          </div>
        </div>

        {/* Recommended Games */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
              <span className="font-semibold text-gray-800">Recommended Games</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-red-700 to-red-800 rounded-2xl p-4 text-center text-white">
              <div className="text-sm font-bold mb-1">AVIATOR</div>
              <div className="text-xs">x500+</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-4 text-center text-white">
              <div className="text-sm font-bold">MINES</div>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-4 text-center text-white">
              <div className="text-sm font-bold">GOAL</div>
            </div>
          </div>
        </div>

        {/* Slots */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
              <span className="font-semibold text-gray-800">Slots</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <span className="text-sm">Detail</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {['JILI', 'JDB', 'CQ9'].map((game, index) => (
              <div key={game} className="bg-white rounded-2xl p-4 shadow-sm border">
                <div className={`h-16 rounded-xl mb-2 flex items-center justify-center ${
                  ['bg-gradient-to-br from-purple-500 to-pink-500', 
                   'bg-gradient-to-br from-blue-500 to-indigo-500',
                   'bg-gradient-to-br from-orange-500 to-red-500'][index]
                }`}>
                  <span className="text-white font-bold">{game}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rummy */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              <span className="font-semibold text-gray-800">Rummy</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <span className="text-sm">Detail</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border">
            <div className="h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">505</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ActivityScreen = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-red-400 to-pink-500 px-4 pt-12 pb-6 text-center">
        <div className="text-white text-2xl font-bold mb-2">91CLUB</div>
        <div className="text-white text-xl font-semibold mb-3">Activity</div>
        <div className="text-white/90 text-sm mb-1">Please remember to follow the event page</div>
        <div className="text-white/90 text-sm">We will launch new feedback activities from time to time!</div>
      </div>

      <div className="px-4 py-6">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { name: 'Activity Award', color: 'bg-orange-100', iconColor: 'text-orange-500', icon: '🏆' },
            { name: 'Invitation bonus', color: 'bg-blue-100', iconColor: 'text-blue-500', icon: '👥' },
            { name: 'Betting mobile', color: 'bg-yellow-100', iconColor: 'text-yellow-500', icon: '📱' },
            { name: 'Super Jackpot', color: 'bg-green-100', iconColor: 'text-green-500', icon: '💰' }
          ].map((item) => (
            <div key={item.name} className="text-center">
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <span className="text-lg">{item.icon}</span>
              </div>
              <div className="text-xs text-gray-600 leading-tight">{item.name}</div>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <span className="text-lg">🎁</span>
          </div>
          <div className="text-xs text-gray-600">First gift</div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-4 text-white">
            <div className="text-lg font-bold mb-2">Gifts</div>
            <div className="text-sm opacity-90">Enter the redemption code to receive gift rewards</div>
          </div>

          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl p-4 text-white">
            <div className="text-lg font-bold mb-2">Attendance bonus</div>
            <div className="text-sm opacity-90">The more consecutive days you sign in, the higher the reward will be</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border shadow-sm">
            <div className="text-lg font-bold text-red-500">Benefits of Using ARWALLET</div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-4 text-white">
            <div className="text-lg font-bold mb-2">New Member First Deposit Bonus</div>
          </div>
        </div>
      </div>
    </div>
  );

  const WalletScreen = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-red-400 to-pink-500 px-4 pt-12 pb-8">
        <div className="flex items-center mb-6">
          <ArrowLeft className="w-6 h-6 text-white mr-4" />
          <div className="text-white text-xl font-bold">Wallet</div>
        </div>
        
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div className="text-4xl font-bold mb-2">₹0.39</div>
          <div className="text-white/90 mb-6">Total balance</div>
          
          <div className="flex justify-center space-x-12">
            <div className="text-center">
              <div className="text-lg font-bold">156816</div>
              <div className="text-xs text-white/80">Total deposit</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">167805</div>
              <div className="text-xs text-white/80">Total withdrawal</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-400">0%</div>
              <div className="text-xl font-bold text-gray-800 mb-1">₹0.00</div>
              <div className="text-sm text-gray-500">Main wallet</div>
            </div>
            <div className="relative w-20 h-20">
              <div className="w-full h-full rounded-full border-8 border-red-400"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-red-400">100%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-400 mb-1">₹0.39</div>
              <div className="text-sm text-gray-500">3rd party wallet</div>
            </div>
          </div>
          
          <button className="w-full bg-red-400 text-white py-3 rounded-xl font-medium">
            Main wallet transfer
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { name: 'Deposit', icon: '💳', color: 'bg-orange-100' },
            { name: 'Withdraw', icon: '💰', color: 'bg-blue-100' },
            { name: 'Deposit history', icon: '📊', color: 'bg-red-100' },
            { name: 'Withdrawal history', icon: '📈', color: 'bg-yellow-100' }
          ].map((item) => (
            <div key={item.name} className="text-center">
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <span className="text-lg">{item.icon}</span>
              </div>
              <div className="text-xs text-gray-600 leading-tight">{item.name}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="bg-red-400 text-white py-4 rounded-xl">
            <div className="font-bold text-lg">6.49</div>
            <div className="text-sm">All Game</div>
          </button>
          <button className="bg-gray-100 text-gray-600 py-4 rounded-xl">
            <div className="font-bold text-lg">6.38</div>
            <div className="text-sm">Evolution</div>
          </button>
        </div>
      </div>
    </div>
  );

  const AccountScreen = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-red-400 to-pink-500 px-4 pt-12 pb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="text-white">
            <div className="text-xl font-bold">ANURAG KUMAR</div>
            <div className="text-sm flex items-center">
              🎯 Copy
            </div>
            <div className="text-sm">UID: 396313</div>
            <div className="text-xs opacity-90">Last login: 2025-06-13 19:34:40</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4">
          <div className="text-gray-500 text-sm mb-1">Total balance</div>
          <div className="text-2xl font-bold text-gray-800">₹0.39</div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { name: 'ARWallet', icon: '💳', color: 'bg-red-100' },
            { name: 'Deposit', icon: '💰', color: 'bg-blue-100' },
            { name: 'Withdraw', icon: '📤', color: 'bg-green-100' },
            { name: 'VIP', icon: '👑', color: 'bg-purple-100' }
          ].map((item) => (
            <div key={item.name} className="text-center">
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <span className="text-lg">{item.icon}</span>
              </div>
              <div className="text-xs text-gray-600">{item.name}</div>
            </div>
          ))}
        </div>

        <div className="space-y-1">
          {[
            { icon: '📊', title: 'Game History', subtitle: 'My game history', color: 'bg-blue-100' },
            { icon: '💳', title: 'Transaction', subtitle: 'My transaction history', color: 'bg-green-100' },
            { icon: '💰', title: 'Deposit', subtitle: 'My deposit history', color: 'bg-red-100' },
            { icon: '📤', title: 'Withdraw', subtitle: 'My withdraw history', color: 'bg-yellow-100' },
            { icon: '🔔', title: 'Notification', color: 'bg-pink-100', badge: '33' },
            { icon: '🎁', title: 'Gifts', color: 'bg-red-100' },
            { icon: '📈', title: 'Game statistics', color: 'bg-orange-100' },
            { icon: '🌐', title: 'Language', color: 'bg-blue-100', value: 'English' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 px-2">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-sm">{item.icon}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">{item.title}</div>
                  {item.subtitle && <div className="text-sm text-gray-500">{item.subtitle}</div>}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {item.badge && (
                  <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {item.badge}
                  </div>
                )}
                {item.value && (
                  <span className="text-sm text-gray-500">{item.value}</span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 mb-6">
          <div className="text-lg font-bold text-gray-800 mb-4">Service center</div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'Settings', icon: '⚙️', color: 'bg-pink-100' },
              { name: 'Feedback', icon: '💬', color: 'bg-red-100' },
              { name: 'Announcement', icon: '📢', color: 'bg-yellow-100' },
              { name: 'Customer Service', icon: '🎧', color: 'bg-orange-100' },
              { name: "Beginner's Guide", icon: '📖', color: 'bg-red-100' },
              { name: 'About us', icon: '👥', color: 'bg-gray-100' }
            ].map((item) => (
              <div key={item.name} className="text-center">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div className="text-xs text-gray-600 leading-tight">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full py-4 border border-red-400 text-red-400 rounded-xl font-medium flex items-center justify-center space-x-2">
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  const PromotionScreen = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-red-400 to-pink-500 px-4 pt-12 pb-6 text-center">
        <div className="text-white text-2xl font-bold mb-1">Agency</div>
        <div className="text-white text-sm">🎯</div>
      </div>

      <div className="px-4 py-6">
        <div className="bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl p-6 text-white text-center mb-6">
          <div className="text-5xl font-bold mb-2">0</div>
          <div className="text-sm mb-4 opacity-90">Yesterday's total commission</div>
          <div className="text-xs mb-6 opacity-80">Upgrade the level to increase commission percentage</div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-xl p-3">
              <div className="font-bold text-sm">Direct subordinates</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <div className="font-bold text-sm">Team subordinates</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">0</div>
              <div className="text-xs text-gray-500 mb-3">number of register</div>
              <div className="text-xl font-bold text-gray-800">0</div>
              <div className="text-xs text-gray-500 mb-3">Deposit Number</div>
              <div className="font-bold text-gray-800 mb-1">Deposit amount</div>
              <div className="text-2xl font-bold text-gray-800">0</div>
              <div className="text-xs text-gray-500">Number of people making first deposit</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">0</div>
              <div className="text-xs text-gray-500 mb-3">number of register</div>
              <div className="text-xl font-bold text-gray-800">0</div>
              <div className="text-xs text-gray-500 mb-3">Deposit Number</div>
              <div className="font-bold text-gray-800 mb-1">Deposit amount</div>
              <div className="text-2xl font-bold text-gray-800">0</div>
              <div className="text-xs text-gray-500">Number of people making first deposit</div>
            </div>
          </div>
        </div>

        <button className="w-full bg-red-400 text-white py-4 rounded-xl font-bold text-lg mb-6">
          INVITATION LINK
        </button>

        <div className="space-y-1">
          {[
            { icon: '🏆', title: 'Partner rewards' },
            { icon: '📋', title: 'Copy invitation code', value: '3654752684217' },
            { icon: '👥', title: 'Subordinate data' },
            { icon: '💰', title: 'Commission detail' },
            { icon: '📋', title: 'Invitation rules' },
            { icon: '🎧', title: 'Agent line customer service' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 px-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">{item.icon}</span>
                </div>
                <span className="font-medium text-gray-800">{item.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                {item.value && (
                  <>
                    <span className="text-sm text-gray-500 font-mono">{item.value}</span>
                    <Copy className="w-4 h-4 text-gray-400" />
                  </>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'activity': return <ActivityScreen />;
      case 'promotion': return <PromotionScreen />;
      case 'wallet': return <WalletScreen />;
      case 'account': return <AccountScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderScreen()}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bottom-nav safe-bottom">
        <div className="flex">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'activity', icon: BarChart3, label: 'Activity' },
            { id: 'promotion', icon: Gift, label: 'Promotion' },
            { id: 'wallet', icon: Wallet, label: 'Wallet' },
            { id: 'account', icon: User, label: 'Account' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="bottom-nav-item"
            >
              <div className={`bottom-nav-icon ${activeTab === tab.id ? 'active' : 'inactive'}`}>
                <tab.icon className="w-5 h-5" />
              </div>
              <span className={`bottom-nav-label ${activeTab === tab.id ? 'active' : 'inactive'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;