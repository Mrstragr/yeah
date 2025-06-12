import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  GamepadIcon, 
  Wallet, 
  Gift, 
  Trophy, 
  BarChart3,
  Menu,
  X,
  Crown,
  Star,
  Coins,
  Bell,
  User
} from "lucide-react";

interface MobileOptimizedNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: any;
}

export function MobileOptimizedNavigation({ activeSection, onSectionChange, user }: MobileOptimizedNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, color: 'from-blue-500 to-cyan-500' },
    { id: 'games', label: 'Games', icon: GamepadIcon, color: 'from-purple-500 to-pink-500' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, color: 'from-green-500 to-emerald-500' },
    { id: 'promotions', label: 'Bonus', icon: Gift, color: 'from-yellow-500 to-orange-500' },
    { id: 'tournaments', label: 'Ranks', icon: Trophy, color: 'from-amber-500 to-yellow-500' },
    { id: 'analytics', label: 'Stats', icon: BarChart3, color: 'from-indigo-500 to-purple-500' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/20 backdrop-blur-xl">
        <div className="flex items-center justify-between px-3 py-3">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                <Star className="w-1.5 h-1.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">TashanWin</h1>
            </div>
          </div>

          {/* User Balance & Menu */}
          <div className="flex items-center space-x-3">
            {/* Balance Display */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg px-3 py-1">
              <div className="flex items-center space-x-1">
                <Coins className="w-3 h-3 text-green-400" />
                <span className="text-xs font-bold text-white">₹{parseFloat(user?.walletBalance || '0').toLocaleString()}</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="absolute top-0 right-0 w-72 h-full bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 border-l border-purple-500/20"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                {/* User Profile Section */}
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{user?.username || 'Player'}</h3>
                      <p className="text-xs text-purple-300">VIP Level 3</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Balance:</span>
                      <span className="text-green-400 font-bold">₹{parseFloat(user?.walletBalance || '0').toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Bonus:</span>
                      <span className="text-blue-400 font-bold">₹{parseFloat(user?.bonusBalance || '0').toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="space-y-2">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          onSectionChange(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all ${
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <motion.div
                            className="ml-auto w-2 h-2 bg-white rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-t border-purple-500/20 backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigationItems.slice(0, 4).map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                  isActive
                    ? 'bg-purple-600/30 text-purple-300'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <IconComponent className={`w-5 h-5 mb-1 ${isActive ? 'text-purple-300' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 bg-purple-400 rounded-full mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}