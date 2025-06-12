import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Home, 
  Gamepad2, 
  Wallet, 
  Trophy, 
  Gift, 
  User, 
  Bell, 
  Settings,
  Search,
  Filter,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ModernNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: any;
}

export function ModernNavigation({ activeSection, onSectionChange, user }: ModernNavigationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const mainNavItems = [
    { 
      id: 'home', 
      icon: Home, 
      label: 'Home', 
      color: 'text-blue-400',
      activeColor: 'bg-blue-500/20 border-blue-500/50 text-blue-300'
    },
    { 
      id: 'games', 
      icon: Gamepad2, 
      label: 'Games', 
      color: 'text-purple-400',
      activeColor: 'bg-purple-500/20 border-purple-500/50 text-purple-300'
    },
    { 
      id: 'wallet', 
      icon: Wallet, 
      label: 'Wallet', 
      color: 'text-green-400',
      activeColor: 'bg-green-500/20 border-green-500/50 text-green-300'
    },
    { 
      id: 'tournaments', 
      icon: Trophy, 
      label: 'Tournaments', 
      color: 'text-yellow-400',
      activeColor: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
    },
    { 
      id: 'promotions', 
      icon: Gift, 
      label: 'Bonus', 
      color: 'text-pink-400',
      activeColor: 'bg-pink-500/20 border-pink-500/50 text-pink-300',
      badge: 'New'
    }
  ];

  const gameCategories = [
    { id: 'slots', name: 'Slots', icon: '🎰', count: 45 },
    { id: 'cards', name: 'Cards', icon: '🃏', count: 12 },
    { id: 'dice', name: 'Dice', icon: '🎲', count: 8 },
    { id: 'crash', name: 'Crash', icon: '🚀', count: 6 },
    { id: 'lottery', name: 'Lottery', icon: '🎫', count: 15 },
    { id: 'quick', name: 'Quick', icon: '⚡', count: 20 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900/50 backdrop-blur-lg border-b border-gray-700/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TashanWin</h1>
              <p className="text-xs text-gray-400">Premium Gaming</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5 text-gray-400" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-xs">
              3
            </Badge>
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="h-5 w-5 text-gray-400" />
          </Button>

          {user && (
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700/50">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">{user.username}</p>
                <p className="text-xs text-green-400">₹{user.walletBalance}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search games, tournaments, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-purple-500/50"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-4">
        <div className="grid grid-cols-5 gap-2">
          {mainNavItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSectionChange(item.id)}
              className={`
                relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200
                ${activeSection === item.id 
                  ? item.activeColor
                  : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-700/50 hover:border-gray-600/50'
                }
              `}
            >
              <item.icon className={`h-6 w-6 ${
                activeSection === item.id ? '' : item.color
              }`} />
              <span className={`text-xs font-medium ${
                activeSection === item.id ? '' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
              
              {item.badge && (
                <Badge className="absolute -top-1 -right-1 h-5 w-8 p-0 bg-red-500 text-xs">
                  {item.badge}
                </Badge>
              )}
              
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Game Categories (when in games section) */}
      {activeSection === 'games' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4"
        >
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Categories</h3>
            <div className="grid grid-cols-3 gap-3">
              {gameCategories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-3 bg-gray-800/40 border border-gray-700/40 rounded-lg hover:border-purple-500/50 transition-all duration-200"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{category.name}</p>
                    <p className="text-xs text-gray-400">{category.count} games</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <Trophy className="h-6 w-6 text-yellow-400" />
              <span className="text-xs text-purple-300">Live</span>
            </div>
            <h4 className="text-sm font-semibold text-white">Daily Tournament</h4>
            <p className="text-xs text-gray-400">₹50,000 Prize Pool</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <Gift className="h-6 w-6 text-pink-400" />
              <span className="text-xs text-green-300">New</span>
            </div>
            <h4 className="text-sm font-semibold text-white">Welcome Bonus</h4>
            <p className="text-xs text-gray-400">Claim 100% Match</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
}