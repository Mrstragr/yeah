import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  GamepadIcon, 
  Wallet, 
  Gift, 
  Trophy, 
  BarChart3,
  Settings,
  User,
  Bell,
  Search,
  Menu,
  X,
  Crown,
  Coins,
  Star,
  Zap,
  ChevronDown
} from "lucide-react";

interface PremiumNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: any;
}

export function PremiumNavigation({ activeSection, onSectionChange, user }: PremiumNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, description: 'Main dashboard' },
    { id: 'games', label: 'Games', icon: GamepadIcon, description: 'All games' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, description: 'Your balance' },
    { id: 'promotions', label: 'Promotions', icon: Gift, description: 'Bonuses & offers' },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy, description: 'Compete & win' },
    { id: 'analytics', label: 'Stats', icon: BarChart3, description: 'Performance data' },
  ];

  return (
    <>
      {/* Premium Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/20 backdrop-blur-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  TashanWin
                </h1>
                <p className="text-xs text-gray-400">Premium Gaming</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navigationItems.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`relative px-6 py-3 transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                      onClick={() => onSectionChange(item.id)}
                    >
                      <IconComponent className="w-5 h-5 mr-2" />
                      {item.label}
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                          layoutId="activeTab"
                        />
                      )}
                      {item.id === 'promotions' && (
                        <Badge className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5">
                          NEW
                        </Badge>
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </nav>

            {/* User Section */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Search */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex w-10 h-10 p-0 text-gray-400 hover:text-white hover:bg-white/10"
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Notifications */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-10 h-10 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <Bell className="w-5 h-5" />
                </Button>
                {notifications > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {notifications}
                  </motion.div>
                )}
              </div>

              {/* User Balance */}
              {user && (
                <motion.div 
                  className="hidden md:flex items-center space-x-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Coins className="w-5 h-5 text-green-400" />
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-400">
                      ₹{parseFloat(user.walletBalance || '0').toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Balance</div>
                  </div>
                </motion.div>
              )}

              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-2 hover:bg-white/10"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/api/placeholder/32/32" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm font-bold">
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-white">
                      {user?.username || 'Guest'}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center">
                      <Star className="w-3 h-3 mr-1 text-yellow-400" />
                      VIP Level 3
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold">
                              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-white">{user?.username || 'Guest'}</div>
                            <div className="text-sm text-gray-400">{user?.email}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                          <User className="w-4 h-4 mr-3" />
                          Profile Settings
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                          <Settings className="w-4 h-4 mr-3" />
                          Preferences
                        </Button>
                        <div className="border-t border-gray-700 my-2"></div>
                        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10">
                          <Zap className="w-4 h-4 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden w-10 h-10 p-0 text-gray-400 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden border-t border-purple-500/20 bg-slate-900/95 backdrop-blur-xl"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-4">
                <div className="space-y-2">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          isActive 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                        onClick={() => {
                          onSectionChange(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <IconComponent className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div>{item.label}</div>
                          <div className="text-xs opacity-70">{item.description}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>

                {/* Mobile User Balance */}
                {user && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400">Your Balance</div>
                        <div className="text-xl font-bold text-green-400">
                          ₹{parseFloat(user.walletBalance || '0').toLocaleString()}
                        </div>
                      </div>
                      <Coins className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setUserMenuOpen(false)} 
        />
      )}
    </>
  );
}