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
  X,
  ChevronRight,
  ArrowLeft,
  Copy,
  Settings,
  MessageCircle,
  Users,
  HelpCircle,
  LogOut
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const GameCard = ({ title, image, category, index }: any) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="h-24 bg-gradient-to-br from-red-400 to-purple-500 flex items-center justify-center">
        <span className="text-white text-2xl font-bold">{title}</span>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-400 to-pink-400 px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-white text-xl font-bold">91CLUB</div>
          <Bell className="w-6 h-6 text-white" />
        </div>
        
        {/* User Balance Card */}
        <div className="bg-white rounded-2xl p-4 mb-4">
          <div className="text-gray-600 text-sm mb-1">Wallet balance</div>
          <div className="text-2xl font-bold text-gray-800">₹0.39</div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button className="bg-orange-400 text-white py-3 rounded-xl font-medium">
            Withdraw
          </button>
          <button className="bg-red-400 text-white py-3 rounded-xl font-medium">
            Deposits
          </button>
        </div>

        {/* Wheel of Fortune & VIP */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-3 text-center">
            <div className="text-white text-sm font-medium">Wheel</div>
            <div className="text-white text-xs">of fortune</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3 text-center">
            <div className="text-white text-sm font-medium">VIP</div>
            <div className="text-white text-xs">privileges</div>
          </div>
        </div>
      </div>

      {/* Game Categories */}
      <div className="px-4 py-4">
        <div className="flex space-x-4 mb-6">
          {['Lobby', 'PK', 'Mines', 'Original', 'Fishing', 'Lottery'].map((tab, index) => (
            <div key={tab} className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                tab === 'Lobby' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                <span className="text-xs font-medium">{tab}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lottery Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-400 rounded-full"></div>
              <span className="font-medium">Lottery</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-500">Detail</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 text-center text-white">
              <div className="text-lg font-bold">WIN GO</div>
              <div className="text-sm">1</div>
            </div>
            <div className="bg-gradient-to-br from-pink-400 to-red-500 rounded-2xl p-4 text-center text-white">
              <div className="text-lg font-bold">K3</div>
              <div className="text-sm">Lotre</div>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-4 text-center text-white">
              <div className="text-lg font-bold">5D</div>
              <div className="text-sm">Lotre</div>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-4 text-center text-white">
              <div className="text-lg font-bold">TRX WINGO</div>
              <div className="text-sm">Win</div>
            </div>
          </div>
        </div>

        {/* Moto Racing */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl p-4 text-center text-white">
            <div className="text-xl font-bold">MOTO RACING</div>
          </div>
        </div>

        {/* Mini Games */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-400 rounded-full"></div>
              <span className="font-medium">Mini game</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-500">Detail</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-blue-400 to-teal-500 rounded-2xl p-4 text-center text-white">
              <div className="text-sm font-bold">DRAGON</div>
              <div className="text-sm font-bold">TIGER</div>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-4 text-center text-white">
              <div className="text-sm font-bold">GOAL</div>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-4 text-center text-white">
              <div className="text-sm font-bold">DICE</div>
            </div>
          </div>
        </div>

        {/* Recommended Games */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
              <span className="font-medium">Recommended Games</span>
            </div>
            <div className="flex items-center space-x-1">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-4 text-center text-white">
              <div className="text-lg font-bold">AVIATOR</div>
              <div className="text-sm">x500+</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-4 text-center text-white">
              <div className="text-sm font-bold">MINES</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-4 text-center text-white">
              <div className="text-sm font-bold">GOAL</div>
            </div>
          </div>
        </div>

        {/* Slots */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
              <span className="font-medium">Slots</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-500">Detail</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <GameCard title="JILI" />
            <GameCard title="JDB" />
            <GameCard title="CQ9" />
          </div>
        </div>
      </div>
    </div>
  );

  const ActivityScreen = () => (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-400 to-pink-400 px-4 py-6 text-center">
        <div className="text-white text-xl font-bold mb-2">91CLUB</div>
        <div className="text-white text-lg font-medium">Activity</div>
        <div className="text-white/90 text-sm">Please remember to follow the event page</div>
        <div className="text-white/90 text-sm">We will launch new feedback activities from time to time!</div>
      </div>

      <div className="px-4 py-6">
        {/* Activity Icons */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-2">
              <Trophy className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-xs text-gray-600">Activity Award</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-xs text-gray-600">Invitation bonus</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-2">
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-xs text-gray-600">Betting mobile</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-2">
              <Crown className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-xs text-gray-600">Super Jackpot</div>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Gift className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-xs text-gray-600">First gift</div>
        </div>

        {/* Promotional Cards */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl p-4 text-white">
            <div className="text-lg font-bold mb-2">Gifts</div>
            <div className="text-sm">Enter the redemption code to receive gift rewards</div>
          </div>

          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl p-4 text-white">
            <div className="text-lg font-bold mb-2">Attendance bonus</div>
            <div className="text-sm">The more consecutive days you sign in, the higher the reward will be</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border">
            <div className="text-lg font-bold mb-2 text-red-500">Benefits of Using ARWALLET</div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-4 text-white">
            <div className="text-lg font-bold mb-2">New Member First Deposit Bonus</div>
          </div>
        </div>
      </div>
    </div>
  );

  const WalletScreen = () => (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-400 to-pink-400 px-4 py-6">
        <div className="flex items-center mb-4">
          <ArrowLeft className="w-6 h-6 text-white mr-4" />
          <div className="text-white text-xl font-bold">Wallet</div>
        </div>
        
        <div className="text-center text-white">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold mb-2">₹0.39</div>
          <div className="text-white/90">Total balance</div>
          
          <div className="flex justify-center space-x-8 mt-4">
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
        {/* Wallet Distribution */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <div className="text-lg font-bold">0%</div>
              <div className="text-lg font-bold">₹0.00</div>
              <div className="text-sm text-gray-500">Main wallet</div>
            </div>
            <div className="w-20 h-20 relative">
              <div className="w-full h-full rounded-full border-8 border-red-400"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-red-400">100%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">₹0.39</div>
              <div className="text-sm text-gray-500">3rd party wallet</div>
            </div>
          </div>
          
          <button className="w-full bg-red-400 text-white py-3 rounded-xl font-medium">
            Main wallet transfer
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Download className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-xs text-gray-600">Deposit</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-xs text-gray-600">Withdraw</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Download className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-xs text-gray-600">Deposit history</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-xs text-gray-600">Withdrawal history</div>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-red-400 text-white py-4 rounded-xl font-medium">
            6.49
            <div className="text-sm">All Game</div>
          </button>
          <button className="bg-gray-100 text-gray-600 py-4 rounded-xl font-medium">
            6.38
            <div className="text-sm">Evolution</div>
          </button>
        </div>
      </div>
    </div>
  );

  const AccountScreen = () => (
    <div className="pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-red-400 to-pink-400 px-4 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="text-white">
            <div className="text-xl font-bold">ANURAG KUMAR</div>
            <div className="text-sm">🎯 Copy</div>
            <div className="text-sm">UID: 396313</div>
            <div className="text-xs">Last login: 2025-06-13 19:34:40</div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-2xl p-4">
          <div className="text-gray-600 text-sm mb-1">Total balance</div>
          <div className="text-2xl font-bold text-gray-800">₹0.39</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Wallet className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-xs text-gray-600">ARWallet</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Download className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-xs text-gray-600">Deposit</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-xs text-gray-600">Withdraw</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Crown className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-xs text-gray-600">VIP</div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          <div className="flex items-center justify-between py-4 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-blue-500" />
              </div>
              <span className="font-medium">Game History</span>
              <span className="text-sm text-gray-500">My game history</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between py-4 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-green-500" />
              </div>
              <span className="font-medium">Transaction</span>
              <span className="text-sm text-gray-500">My transaction history</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between py-4 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Download className="w-4 h-4 text-red-500" />
              </div>
              <span className="font-medium">Deposit</span>
              <span className="text-sm text-gray-500">My deposit history</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between py-4 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-yellow-500" />
              </div>
              <span className="font-medium">Withdraw</span>
              <span className="text-sm text-gray-500">My withdraw history</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between py-4 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-pink-500" />
              </div>
              <span className="font-medium">Notification</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">33</div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between py-4 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Gift className="w-4 h-4 text-red-500" />
              </div>
              <span className="font-medium">Gifts</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between py-4 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-orange-500" />
              </div>
              <span className="font-medium">Game statistics</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between py-4 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-blue-500">🌐</span>
              </div>
              <span className="font-medium">Language</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">English</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Service Center */}
        <div className="mt-8">
          <div className="text-lg font-bold mb-4">Service center</div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Settings className="w-6 h-6 text-pink-500" />
              </div>
              <div className="text-xs text-gray-600">Settings</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <MessageCircle className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-xs text-gray-600">Feedback</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Bell className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="text-xs text-gray-600">Announcement</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <HelpCircle className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-xs text-gray-600">Customer Service</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-xs font-bold text-red-500">📖</span>
              </div>
              <div className="text-xs text-gray-600">Beginner's Guide</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-gray-500" />
              </div>
              <div className="text-xs text-gray-600">About us</div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full mt-8 py-4 border border-red-400 text-red-400 rounded-xl font-medium flex items-center justify-center space-x-2">
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  const PromotionScreen = () => (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-400 to-pink-400 px-4 py-6 text-center">
        <div className="text-white text-xl font-bold">Agency</div>
        <div className="text-white text-xs mt-1">🎯</div>
      </div>

      <div className="px-4 py-6">
        {/* Commission Stats */}
        <div className="bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl p-6 text-white text-center mb-6">
          <div className="text-4xl font-bold mb-2">0</div>
          <div className="text-sm mb-4">Yesterday's total commission</div>
          <div className="text-xs mb-4">Upgrade the level to increase commission percentage</div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-xl p-3">
              <div className="font-bold">Direct subordinates</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <div className="font-bold">Team subordinates</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-500 mb-2">number of register</div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-500 mb-2">Deposit Number</div>
            <div className="font-bold">Deposit amount</div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-500">Number of people making first deposit</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-500 mb-2">number of register</div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-500 mb-2">Deposit Number</div>
            <div className="font-bold">Deposit amount</div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-500">Number of people making first deposit</div>
          </div>
        </div>

        {/* Invitation Link */}
        <button className="w-full bg-red-400 text-white py-4 rounded-xl font-bold mb-6">
          INVITATION LINK
        </button>

        {/* Menu Items */}
        <div className="space-y-1">
          <div className="flex items-center justify-between py-4 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-red-500" />
              </div>
              <span className="font-medium">Partner rewards</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between py-4 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Copy className="w-4 h-4 text-red-500" />
              </div>
              <span className="font-medium">Copy invitation code</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">3654752684217</span>
              <Copy className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between py-4 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-red-500" />
              </div>
              <span className="font-medium">Subordinate data</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between py-4 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-red-500" />
              </div>
              <span className="font-medium">Commission detail</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between py-4 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-red-500">📋</span>
              </div>
              <span className="font-medium">Invitation rules</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between py-4 px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-red-500" />
              </div>
              <span className="font-medium">Agent line customer service</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'activity':
        return <ActivityScreen />;
      case 'promotion':
        return <PromotionScreen />;
      case 'wallet':
        return <WalletScreen />;
      case 'account':
        return <AccountScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderScreen()}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
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
              className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'text-red-500'
                  : 'text-gray-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeTab === tab.id ? 'bg-red-500 text-white' : 'bg-transparent'
              }`}>
                <tab.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;