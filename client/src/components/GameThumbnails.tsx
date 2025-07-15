import React from 'react';

// Official Aviator SVG Logo (inspired by Spribe design)
export const AviatorLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="aviatorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff4444" />
        <stop offset="100%" stopColor="#ff8844" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#aviatorGradient)" stroke="#fff" strokeWidth="2"/>
    <path d="M20 35 L32 25 L44 35 L40 40 L32 35 L24 40 Z" fill="#fff"/>
    <circle cx="32" cy="30" r="3" fill="#fff"/>
    <path d="M15 45 Q32 25 49 45" stroke="#fff" strokeWidth="2" fill="none"/>
  </svg>
);

// WinGo SVG Logo
export const WinGoLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wingoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4CAF50" />
        <stop offset="50%" stopColor="#8BC34A" />
        <stop offset="100%" stopColor="#4CAF50" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#wingoGradient)" stroke="#fff" strokeWidth="2"/>
    <circle cx="32" cy="32" r="20" fill="none" stroke="#fff" strokeWidth="2"/>
    <circle cx="32" cy="32" r="12" fill="#fff"/>
    <text x="32" y="37" textAnchor="middle" fill="#4CAF50" fontSize="10" fontWeight="bold">GO</text>
  </svg>
);

// Mines SVG Logo
export const MinesLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="minesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2196F3" />
        <stop offset="100%" stopColor="#1976D2" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="60" height="60" rx="8" fill="url(#minesGradient)" stroke="#fff" strokeWidth="2"/>
    <rect x="10" y="10" width="12" height="12" fill="#fff" opacity="0.8"/>
    <rect x="26" y="10" width="12" height="12" fill="#fff" opacity="0.6"/>
    <rect x="42" y="10" width="12" height="12" fill="#fff" opacity="0.8"/>
    <rect x="10" y="26" width="12" height="12" fill="#fff" opacity="0.6"/>
    <circle cx="32" cy="32" r="4" fill="#ff4444"/>
    <rect x="42" y="26" width="12" height="12" fill="#fff" opacity="0.6"/>
    <rect x="10" y="42" width="12" height="12" fill="#fff" opacity="0.8"/>
    <rect x="26" y="42" width="12" height="12" fill="#fff" opacity="0.6"/>
    <rect x="42" y="42" width="12" height="12" fill="#fff" opacity="0.8"/>
  </svg>
);

// Dice SVG Logo
export const DiceLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="diceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9C27B0" />
        <stop offset="100%" stopColor="#673AB7" />
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="48" height="48" rx="8" fill="url(#diceGradient)" stroke="#fff" strokeWidth="2"/>
    <circle cx="20" cy="20" r="3" fill="#fff"/>
    <circle cx="32" cy="32" r="3" fill="#fff"/>
    <circle cx="44" cy="44" r="3" fill="#fff"/>
    <circle cx="20" cy="44" r="3" fill="#fff"/>
    <circle cx="44" cy="20" r="3" fill="#fff"/>
  </svg>
);

// Dragon Tiger SVG Logo
export const DragonTigerLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dragonGradient" x1="0%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#ff4444" />
        <stop offset="100%" stopColor="#cc2222" />
      </linearGradient>
      <linearGradient id="tigerGradient" x1="50%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff8800" />
        <stop offset="100%" stopColor="#cc6600" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="#1a1a1a" stroke="#fff" strokeWidth="2"/>
    <path d="M32 2 A30 30 0 0 1 32 62 Z" fill="url(#dragonGradient)"/>
    <path d="M32 2 A30 30 0 0 0 32 62 Z" fill="url(#tigerGradient)"/>
    <circle cx="32" cy="32" r="8" fill="#fff"/>
    <text x="32" y="37" textAnchor="middle" fill="#333" fontSize="8" fontWeight="bold">VS</text>
  </svg>
);

// Game Thumbnails
export const GameThumbnails = {
  aviator: AviatorLogo,
  wingo: WinGoLogo,
  mines: MinesLogo,
  dice: DiceLogo,
  dragonTiger: DragonTigerLogo,
};

// Official Aviator thumbnail component with authentic styling
export const OfficialAviatorThumbnail = ({ className = "w-16 h-16" }: { className?: string }) => (
  <div className={`${className} relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black border-2 border-red-500/30`}>
    <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-orange-500/20" />
    <div className="relative h-full flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-3/4 h-3/4" xmlns="http://www.w3.org/2000/svg">
        {/* Plane */}
        <path d="M30 50 L50 35 L70 50 L65 60 L50 50 L35 60 Z" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
        <circle cx="50" cy="45" r="2" fill="#FFA500"/>
        {/* Ascending curve */}
        <path d="M10 80 Q30 60 50 50 Q70 40 90 20" stroke="#ff4444" strokeWidth="3" fill="none"/>
        {/* Multiplier text */}
        <text x="50" y="25" textAnchor="middle" fill="#00ff00" fontSize="12" fontWeight="bold">2.45x</text>
      </svg>
    </div>
  </div>
);

export default GameThumbnails;