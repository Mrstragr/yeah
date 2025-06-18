import { useState } from 'react';

interface GameCardProps {
  gameType: string;
  title: string;
  subtitle?: string;
  onClick: () => void;
  className?: string;
}

export const GameCardWithImages = ({ gameType, title, subtitle = "TB GAME", onClick, className = "" }: GameCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getGameImageContent = () => {
    switch (gameType) {
      case 'wingo':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 overflow-hidden">
            {/* Colorful Wheel Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center animate-float">
                <div className="w-12 h-12 rounded-full bg-gradient-conic from-red-500 via-yellow-500 via-green-500 via-blue-500 to-red-500" 
                     style={{animation: 'spin 3s linear infinite'}}></div>
              </div>
            </div>
            {/* Numbers overlay */}
            <div className="absolute inset-0">
              <div className="absolute top-2 left-2 text-white font-bold text-xs neon-text">0</div>
              <div className="absolute top-2 right-2 text-white font-bold text-xs neon-text">5</div>
              <div className="absolute bottom-2 left-2 text-white font-bold text-xs neon-text">7</div>
              <div className="absolute bottom-2 right-2 text-white font-bold text-xs neon-text">2</div>
            </div>
            {/* Enhanced sparkle effects */}
            <div className="absolute top-1 left-1/2 w-1 h-1 bg-yellow-300 rounded-full animate-sparkle"></div>
            <div className="absolute bottom-3 right-3 w-1 h-1 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-1 w-0.5 h-0.5 bg-pink-300 rounded-full animate-ping"></div>
          </div>
        );
      
      case 'k3':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 overflow-hidden">
            {/* Three Dice */}
            <div className="absolute inset-0 flex items-center justify-center space-x-1">
              <div className="w-4 h-4 bg-white rounded border border-gray-300 flex items-center justify-center">
                <div className="w-1 h-1 bg-black rounded-full"></div>
              </div>
              <div className="w-4 h-4 bg-white rounded border border-gray-300 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                  <div></div>
                  <div></div>
                  <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                </div>
              </div>
              <div className="w-4 h-4 bg-white rounded border border-gray-300 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-0.5">
                  <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                  <div></div>
                  <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                  <div></div>
                  <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                  <div></div>
                  <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                  <div></div>
                  <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/20"></div>
          </div>
        );
      
      case '5d':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 overflow-hidden">
            {/* 5D Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white font-bold text-lg drop-shadow-lg">5D</div>
            </div>
            {/* Number pattern */}
            <div className="absolute inset-0">
              <div className="absolute top-1 left-1 text-white/60 text-xs">1</div>
              <div className="absolute top-1 right-1 text-white/60 text-xs">2</div>
              <div className="absolute bottom-1 left-1 text-white/60 text-xs">3</div>
              <div className="absolute bottom-1 right-1 text-white/60 text-xs">4</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/80 text-sm">5</div>
            </div>
          </div>
        );
      
      case 'trx':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 overflow-hidden">
            {/* TRX Pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white font-bold text-sm">TRX</div>
            </div>
            {/* Wingo elements */}
            <div className="absolute top-2 right-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"></div>
            </div>
            <div className="absolute bottom-2 left-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-red-500"></div>
            </div>
          </div>
        );
      
      case 'aviator':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 overflow-hidden">
            {/* Airplane */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-xl">✈️</div>
            </div>
            {/* Flight path */}
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <path 
                  d="M10,80 Q50,20 90,40" 
                  stroke="rgba(255,255,255,0.3)" 
                  strokeWidth="2" 
                  fill="none"
                  strokeDasharray="2,2"
                />
              </svg>
            </div>
            {/* Multiplier display */}
            <div className="absolute bottom-1 right-2 text-white text-xs font-bold">2.5x</div>
          </div>
        );
      
      case 'mines':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-gray-700 via-slate-600 to-gray-800 overflow-hidden">
            {/* Mine grid */}
            <div className="absolute inset-0 p-2">
              <div className="grid grid-cols-4 gap-0.5 h-full">
                {Array.from({length: 16}).map((_, i) => (
                  <div 
                    key={i}
                    className={`bg-gray-500 rounded-sm ${i === 5 ? 'bg-red-500' : i === 10 ? 'bg-green-500' : ''}`}
                  >
                    {i === 5 && <div className="text-white text-xs text-center">💣</div>}
                    {i === 10 && <div className="text-white text-xs text-center">💎</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'dragon-tiger':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 overflow-hidden">
            {/* Dragon and Tiger */}
            <div className="absolute inset-0 flex items-center justify-between px-1">
              <div className="text-red-200 text-sm">🐉</div>
              <div className="text-white text-xs font-bold">VS</div>
              <div className="text-orange-200 text-sm">🐅</div>
            </div>
            {/* Cards */}
            <div className="absolute bottom-1 left-1">
              <div className="w-3 h-4 bg-white rounded-sm border border-gray-300 flex items-center justify-center">
                <div className="text-red-500 text-xs">A</div>
              </div>
            </div>
            <div className="absolute bottom-1 right-1">
              <div className="w-3 h-4 bg-white rounded-sm border border-gray-300 flex items-center justify-center">
                <div className="text-black text-xs">K</div>
              </div>
            </div>
          </div>
        );
      
      case 'cricket':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-lg">🏏</div>
            </div>
            <div className="absolute bottom-1 right-1 text-white text-xs">99</div>
          </div>
        );
      
      case 'dice':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center space-x-1">
              <div className="w-4 h-4 bg-white rounded border border-gray-300 flex items-center justify-center">
                <div className="w-1 h-1 bg-black rounded-full"></div>
              </div>
              <div className="w-4 h-4 bg-white rounded border border-gray-300 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                  <div></div>
                  <div></div>
                  <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-lg">🎮</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className={`game-card relative rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${className}`}
      onClick={onClick}
    >
      {/* Game Image/Graphics */}
      <div className="w-full h-24">
        {getGameImageContent()}
      </div>
      
      {/* Game Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2">
        <div className="text-white font-bold text-sm">{title}</div>
        <div className="text-white/80 text-xs">{subtitle}</div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
    </div>
  );
};