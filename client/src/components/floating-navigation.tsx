import { useState } from "react";

interface FloatingNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function FloatingNavigation({ activeSection, onSectionChange }: FloatingNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home', gradient: 'from-blue-500 to-blue-600' },
    { id: 'games', icon: '🎮', label: 'Games', gradient: 'from-purple-500 to-purple-600' },
    { id: 'promotions', icon: '🎁', label: 'Bonus', gradient: 'from-pink-500 to-pink-600' },
    { id: 'wallet', icon: '💰', label: 'Wallet', gradient: 'from-green-500 to-green-600' },
    { id: 'vip', icon: '👑', label: 'VIP', gradient: 'from-yellow-500 to-yellow-600' },
  ];

  return (
    <>
      {/* Main Floating Navigation */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] rounded-2xl border border-[#D4AF37]/30 shadow-2xl backdrop-blur-lg">
          <div className="flex items-center gap-2 p-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl
                  transition-all duration-300 transform hover:scale-110
                  ${activeSection === item.id 
                    ? `bg-gradient-to-r ${item.gradient} shadow-lg scale-105` 
                    : 'hover:bg-[#3a3a3a]'
                  }
                `}
              >
                <span className={`text-lg ${activeSection === item.id ? 'text-white' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                <span className={`text-xs font-medium ${activeSection === item.id ? 'text-white' : 'text-gray-400'}`}>
                  {item.label}
                </span>
                {activeSection === item.id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Floating Button */}
      <div className="fixed bottom-20 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-14 h-14 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all duration-300"
          >
            <span className="text-black text-xl font-bold">⚡</span>
          </button>

          {/* Expanded Quick Actions */}
          {isExpanded && (
            <div className="absolute bottom-16 right-0 space-y-3">
              {[
                { icon: '🎯', label: 'Quick Bet', color: 'from-red-500 to-red-600' },
                { icon: '📊', label: 'Stats', color: 'from-blue-500 to-blue-600' },
                { icon: '🎪', label: 'Live', color: 'from-purple-500 to-purple-600' },
                { icon: '💬', label: 'Support', color: 'from-green-500 to-green-600' },
              ].map((action, index) => (
                <div
                  key={action.label}
                  className="animate-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <button className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300`}>
                    <span className="text-white text-lg">{action.icon}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live Chat Bubble */}
      <div className="fixed bottom-4 left-4 z-40">
        <button className="relative w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-xl flex items-center justify-center transform hover:scale-110 transition-all duration-300">
          <span className="text-white text-lg">💬</span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">3</span>
          </div>
        </button>
      </div>
    </>
  );
}