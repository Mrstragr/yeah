import React from 'react';

// Comprehensive visual enhancements based on 91dreamclub.com design patterns
export const GameBackgroundEffects = ({ gameType }: { gameType: string }) => {
  const getBackgroundPattern = () => {
    switch(gameType) {
      case 'wingo':
        return (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500 to-pink-500"></div>
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
        );
      case 'k3':
        return (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600 to-pink-600"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
            }}></div>
          </div>
        );
      case 'aviator':
        return (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent)`
            }}></div>
          </div>
        );
      case 'mines':
        return (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500 to-emerald-600"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {getBackgroundPattern()}
    </div>
  );
};

// Authentic button styling from 91dreamclub.com
export const AuthenticButton = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick,
  disabled = false,
  className = ''
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  const baseClasses = 'font-bold rounded-lg transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-lg hover:shadow-xl',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl'
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-6 py-2.5 text-base',
    large: 'px-8 py-3.5 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

// Authentic card styling patterns
export const AuthenticCard = ({ 
  children, 
  title,
  className = '',
  glowColor = 'red'
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
  glowColor?: 'red' | 'blue' | 'green' | 'purple' | 'yellow';
}) => {
  const glowClasses = {
    red: 'shadow-red-500/20 hover:shadow-red-500/40',
    blue: 'shadow-blue-500/20 hover:shadow-blue-500/40',
    green: 'shadow-green-500/20 hover:shadow-green-500/40',
    purple: 'shadow-purple-500/20 hover:shadow-purple-500/40',
    yellow: 'shadow-yellow-500/20 hover:shadow-yellow-500/40'
  };

  return (
    <div className={`
      bg-white rounded-xl shadow-2xl border border-gray-200
      transition-all duration-300 hover:transform hover:scale-[1.02]
      ${glowClasses[glowColor]} ${className}
    `}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

// Authentic status indicators
export const StatusIndicator = ({ 
  status, 
  label 
}: { 
  status: 'online' | 'offline' | 'playing' | 'waiting';
  label?: string;
}) => {
  const statusConfig = {
    online: { color: 'bg-green-500', animation: 'animate-pulse' },
    offline: { color: 'bg-gray-400', animation: '' },
    playing: { color: 'bg-blue-500', animation: 'animate-bounce' },
    waiting: { color: 'bg-yellow-500', animation: 'animate-ping' }
  };

  const { color, animation } = statusConfig[status];

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${color} ${animation}`}></div>
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  );
};

// Authentic loading states
export const GameLoadingSpinner = ({ game }: { game: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-red-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl">🎮</div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="text-lg font-bold text-gray-700">Loading {game}</div>
        <div className="text-sm text-gray-500 mt-1">Please wait...</div>
      </div>
    </div>
  );
};

// Authentic notification popup
export const GameNotification = ({ 
  type, 
  message, 
  isVisible,
  onClose 
}: {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  isVisible: boolean;
  onClose: () => void;
}) => {
  if (!isVisible) return null;

  const typeConfig = {
    success: { bg: 'bg-green-500', icon: '✅' },
    error: { bg: 'bg-red-500', icon: '❌' },
    info: { bg: 'bg-blue-500', icon: 'ℹ️' },
    warning: { bg: 'bg-yellow-500', icon: '⚠️' }
  };

  const { bg, icon } = typeConfig[type];

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slideInRight">
      <div className={`${bg} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 max-w-sm`}>
        <div className="text-xl">{icon}</div>
        <div className="flex-1">
          <div className="font-medium">{message}</div>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-200 text-xl leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Authentic game stats display
export const GameStatsDisplay = ({ 
  stats 
}: { 
  stats: Array<{ label: string; value: string | number; trend?: 'up' | 'down' | 'stable' }>;
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 text-center"
        >
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {stat.value}
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">
            {stat.label}
          </div>
          {stat.trend && (
            <div className={`text-xs mt-1 ${
              stat.trend === 'up' ? 'text-green-500' :
              stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'
            }`}>
              {stat.trend === 'up' ? '↗️' : stat.trend === 'down' ? '↘️' : '→'}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};