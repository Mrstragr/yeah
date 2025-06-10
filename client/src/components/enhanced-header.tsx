import { useState, useEffect } from "react";

interface EnhancedHeaderProps {
  user: any;
  userBalance: string;
  onLogout: () => void;
  refreshBalance: () => void;
}

export function EnhancedHeader({ user, userBalance, onLogout, refreshBalance }: EnhancedHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-4 shadow-2xl border-b border-[#D4AF37]/30 relative z-20">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-4 text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
          <div>{currentTime.toLocaleTimeString()}</div>
          <div className="flex items-center gap-1">
            <span>🌐</span>
            <span>1,247 players online</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="text-gray-400 hover:text-[#D4AF37] transition-colors">
              🔔
            </button>
            {notifications > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-bounce">
                {notifications}
              </div>
            )}
          </div>
          <button className="text-gray-400 hover:text-[#D4AF37] transition-colors">⚙️</button>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="relative group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] via-[#FFD700] to-[#B8860B] rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
              <span className="text-black font-bold text-xl">T</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
          </div>
          
          {/* Brand Info */}
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
              TashanWin
            </h1>
            <div className="flex items-center gap-2 text-sm text-[#D4AF37]">
              <span>Premium Gaming Platform</span>
              <div className="w-1 h-1 bg-[#D4AF37] rounded-full"></div>
              <span>Licensed & Secure</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Balance Card */}
          <div className="bg-gradient-to-r from-[#2a2a2a] via-[#3a3a3a] to-[#2a2a2a] px-6 py-3 rounded-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">₹</span>
              </div>
              <div>
                <div className="text-[#D4AF37] text-xs font-medium">Main Wallet</div>
                <div className="text-white text-lg font-bold group-hover:scale-105 transition-transform duration-300">
                  ₹{userBalance}
                </div>
              </div>
              <button 
                onClick={refreshBalance}
                className="text-[#D4AF37] hover:text-white transition-colors duration-300 ml-2"
              >
                🔄
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg">
              <span className="text-white">💰</span>
            </button>
            <button className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg">
              <span className="text-white">🎁</span>
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-lg">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#1a1a1a] rounded-full"></div>
            </div>
            
            <div className="hidden md:block">
              <div className="text-white font-medium">{user?.username || 'Player'}</div>
              <div className="text-[#D4AF37] text-xs">VIP Level 1</div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}