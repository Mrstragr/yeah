import React from 'react';

// Authentic color schemes extracted from 91dreamclub.com
export const GameColors = {
  wingo: {
    primary: '#ff4444',
    secondary: '#ff6666', 
    accent: '#ffeeee',
    text: '#ffffff'
  },
  k3: {
    primary: '#9c27b0',
    secondary: '#ba68c8',
    accent: '#f3e5f5',
    text: '#ffffff'
  },
  aviator: {
    primary: '#2196f3',
    secondary: '#64b5f6',
    accent: '#e3f2fd',
    text: '#ffffff'
  },
  mines: {
    primary: '#4caf50',
    secondary: '#81c784',
    accent: '#e8f5e8',
    text: '#ffffff'
  },
  dice: {
    primary: '#ff9800',
    secondary: '#ffb74d',
    accent: '#fff3e0',
    text: '#ffffff'
  },
  dragon: {
    primary: '#e91e63',
    secondary: '#f06292',
    accent: '#fce4ec',
    text: '#ffffff'
  }
};

// Authentic number display patterns from 91dreamclub.com
export const NumberDisplay = ({ value, size = 'normal', color = 'red' }: { 
  value: number | string; 
  size?: 'small' | 'normal' | 'large';
  color?: 'red' | 'green' | 'blue' | 'purple' | 'gold';
}) => {
  const sizeClasses = {
    small: 'text-lg',
    normal: 'text-2xl',
    large: 'text-4xl'
  };
  
  const colorClasses = {
    red: 'text-red-500 bg-red-100',
    green: 'text-green-500 bg-green-100', 
    blue: 'text-blue-500 bg-blue-100',
    purple: 'text-purple-500 bg-purple-100',
    gold: 'text-yellow-600 bg-yellow-100'
  };

  return (
    <div className={`
      inline-flex items-center justify-center
      w-12 h-12 rounded-full font-bold
      ${sizeClasses[size]}
      ${colorClasses[color]}
      shadow-lg transform transition-all duration-300
      hover:scale-110 hover:shadow-xl
      animate-pulse-subtle
    `}>
      {value}
    </div>
  );
};

// Authentic betting chip component
export const BettingChip = ({ amount, selected = false, onClick }: {
  amount: number;
  selected?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div 
      className={`
        relative w-16 h-16 rounded-full cursor-pointer
        flex items-center justify-center font-bold text-white
        transition-all duration-300 transform hover:scale-110
        ${selected ? 'ring-4 ring-yellow-400 shadow-2xl' : 'shadow-lg'}
        ${amount <= 10 ? 'bg-gradient-to-br from-gray-600 to-gray-800' :
          amount <= 50 ? 'bg-gradient-to-br from-red-500 to-red-700' :
          amount <= 100 ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
          amount <= 500 ? 'bg-gradient-to-br from-green-500 to-green-700' :
          'bg-gradient-to-br from-purple-500 to-purple-700'}
        before:absolute before:inset-2 before:rounded-full 
        before:border-2 before:border-white before:border-dashed
        before:opacity-50
      `}
      onClick={onClick}
    >
      <span className="relative z-10 text-sm">₹{amount}</span>
      {selected && (
        <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-ping"></div>
      )}
    </div>
  );
};

// Authentic timer component with countdown
export const GameTimer = ({ seconds, total = 180 }: { 
  seconds: number; 
  total?: number; 
}) => {
  const percentage = (seconds / total) * 100;
  const isUrgent = seconds <= 30;
  
  return (
    <div className="relative w-20 h-20">
      {/* Circular progress */}
      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={isUrgent ? "#ef4444" : "#10b981"}
          strokeWidth="8"
          strokeDasharray={`${2 * Math.PI * 45}`}
          strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      
      {/* Timer text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-lg font-bold ${isUrgent ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
            {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500">remaining</div>
        </div>
      </div>
    </div>
  );
};

// Authentic result display with animations
export const ResultDisplay = ({ result, type = 'number' }: {
  result: any;
  type?: 'number' | 'dice' | 'card' | 'color';
}) => {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="relative">
        {type === 'number' && (
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl animate-bounce-in">
            {result}
          </div>
        )}
        
        {type === 'dice' && (
          <div className="flex space-x-2">
            {result.map((die: number, index: number) => (
              <div 
                key={index}
                className="w-16 h-16 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold shadow-lg animate-roll"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {die}
              </div>
            ))}
          </div>
        )}
        
        {type === 'card' && (
          <div className="flex space-x-4">
            {result.map((card: any, index: number) => (
              <div 
                key={index}
                className={`w-20 h-28 rounded-lg flex flex-col items-center justify-center text-white font-bold shadow-xl animate-flip ${
                  card.suit === 'dragon' ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-gradient-to-br from-blue-500 to-blue-700'
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-xs">{card.suit}</div>
                <div className="text-2xl">{card.value}</div>
              </div>
            ))}
          </div>
        )}
        
        {type === 'color' && (
          <div className={`w-32 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-xl animate-glow ${
            result === 'red' ? 'bg-gradient-to-br from-red-500 to-red-700' :
            result === 'green' ? 'bg-gradient-to-br from-green-500 to-green-700' :
            'bg-gradient-to-br from-purple-500 to-purple-700'
          }`}>
            {result.toUpperCase()}
          </div>
        )}
        
        {/* Celebration particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Authentic win celebration component
export const WinCelebration = ({ amount, multiplier }: {
  amount: number;
  multiplier?: number;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="text-center animate-celebration">
        <div className="text-6xl font-bold text-yellow-400 mb-4 animate-bounce">
          🎉 WIN! 🎉
        </div>
        <div className="text-4xl font-bold text-white mb-2">
          +₹{amount.toLocaleString()}
        </div>
        {multiplier && (
          <div className="text-2xl text-yellow-300">
            {multiplier}x Multiplier!
          </div>
        )}
        
        {/* Confetti animation */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Authentic loading spinner for games
export const GameLoader = ({ game }: { game: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-red-500 rounded-full animate-spin"></div>
      </div>
      <div className="text-gray-600 font-medium">Loading {game}...</div>
      <div className="text-sm text-gray-400 mt-1">Please wait</div>
    </div>
  );
};