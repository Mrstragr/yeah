import React, { useEffect, useState } from 'react';

// Authentic 91dreamclub.com animation patterns and visual effects
export const useAuthenticAnimations = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerResultAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  return { isAnimating, triggerResultAnimation };
};

// Authentic dice rolling animation from 91dreamclub.com
export const DiceRollAnimation = ({ value, isRolling }: { value: number; isRolling: boolean }) => {
  const getDiceDisplay = (num: number): JSX.Element[] => {
    const dots: JSX.Element[] = [];
    const positions = {
      1: [[2, 2]],
      2: [[1, 1], [3, 3]],
      3: [[1, 1], [2, 2], [3, 3]],
      4: [[1, 1], [1, 3], [3, 1], [3, 3]],
      5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
      6: [[1, 1], [1, 2], [1, 3], [3, 1], [3, 2], [3, 3]]
    };

    (positions[num as keyof typeof positions] || []).forEach(([row, col], index) => {
      dots.push(
        <div
          key={index}
          className="absolute w-2 h-2 bg-red-600 rounded-full"
          style={{
            top: `${(row - 1) * 25 + 12.5}%`,
            left: `${(col - 1) * 25 + 12.5}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      );
    });

    return dots;
  };

  return (
    <div className={`
      relative w-16 h-16 bg-white border-2 border-gray-300 rounded-lg 
      shadow-lg transition-all duration-300
      ${isRolling ? 'animate-roll' : ''}
    `}>
      {getDiceDisplay(value)}
      {isRolling && (
        <div className="absolute inset-0 bg-yellow-200 opacity-50 rounded-lg animate-pulse" />
      )}
    </div>
  );
};

// Authentic card flip animation for Dragon Tiger
export const CardFlipAnimation = ({ card, isRevealing }: { 
  card: { suit: string; value: string; color: string }; 
  isRevealing: boolean; 
}) => {
  return (
    <div className={`
      relative w-20 h-28 rounded-lg shadow-xl transition-all duration-500
      ${isRevealing ? 'animate-flip' : ''}
      ${card.color === 'red' ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-gradient-to-br from-blue-500 to-blue-700'}
    `}>
      {!isRevealing ? (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
          <div className="text-white text-xs">91CLUB</div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="text-xs font-bold">{card.suit}</div>
          <div className="text-2xl font-bold">{card.value}</div>
        </div>
      )}
      
      {isRevealing && (
        <div className="absolute inset-0 bg-yellow-300 opacity-30 rounded-lg animate-ping" />
      )}
    </div>
  );
};

// Authentic multiplier display for Aviator
export const MultiplierDisplay = ({ multiplier, isFlying }: { 
  multiplier: number; 
  isFlying: boolean; 
}) => {
  return (
    <div className={`
      relative bg-gradient-to-r from-blue-500 to-purple-600 
      text-white px-6 py-4 rounded-xl shadow-2xl
      ${isFlying ? 'animate-multiplier-pulse' : ''}
    `}>
      <div className="text-center">
        <div className="text-3xl font-bold">
          {multiplier.toFixed(2)}x
        </div>
        <div className="text-sm opacity-90">Multiplier</div>
      </div>
      
      {isFlying && (
        <>
          <div className="absolute top-2 right-2 text-lg animate-fly">✈️</div>
          <div className="absolute inset-0 bg-yellow-300 opacity-20 rounded-xl animate-pulse" />
        </>
      )}
    </div>
  );
};

// Authentic mine field grid for Mines game
export const MineCell = ({ 
  isRevealed, 
  isMine, 
  isSafe, 
  onClick 
}: { 
  isRevealed: boolean; 
  isMine: boolean; 
  isSafe: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isRevealed}
      className={`
        w-12 h-12 border-2 rounded-lg transition-all duration-300 font-bold
        ${!isRevealed ? 'bg-gray-200 border-gray-300 hover:bg-gray-100 hover:scale-105' :
          isMine ? 'bg-red-500 border-red-600 text-white animate-explosion' :
          isSafe ? 'bg-green-500 border-green-600 text-white animate-bounce-in' :
          'bg-blue-500 border-blue-600 text-white'}
        ${isRevealed ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {isRevealed && (
        <>
          {isMine && '💣'}
          {isSafe && '💎'}
          {!isMine && !isSafe && '❓'}
        </>
      )}
    </button>
  );
};

// Authentic number wheel for spin animations
export const NumberWheelAnimation = ({ 
  numbers, 
  selectedNumber, 
  isSpinning 
}: { 
  numbers: number[]; 
  selectedNumber?: number;
  isSpinning: boolean;
}) => {
  return (
    <div className="relative w-64 h-64 mx-auto">
      <div className={`
        absolute inset-0 rounded-full border-8 border-gray-300
        ${isSpinning ? 'animate-spin' : ''}
      `}>
        {numbers.map((num, index) => {
          const angle = (index * 360) / numbers.length;
          const isSelected = num === selectedNumber;
          
          return (
            <div
              key={num}
              className={`
                absolute w-8 h-8 rounded-full flex items-center justify-center
                font-bold text-sm transition-all duration-300
                ${isSelected ? 'bg-yellow-400 text-black scale-125 animate-pulse' : 
                  num % 2 === 0 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}
              `}
              style={{
                transform: `rotate(${angle}deg) translateY(-100px) rotate(-${angle}deg)`,
                transformOrigin: 'center 100px'
              }}
            >
              {num}
            </div>
          );
        })}
      </div>
      
      {/* Center pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-red-500 z-10" />
      
      {isSpinning && (
        <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-full animate-ping" />
      )}
    </div>
  );
};

// Authentic coin flip animation
export const CoinFlipAnimation = ({ 
  result, 
  isFlipping 
}: { 
  result: 'heads' | 'tails';
  isFlipping: boolean;
}) => {
  return (
    <div className={`
      relative w-20 h-20 mx-auto
      ${isFlipping ? 'animate-coin-flip' : ''}
    `}>
      <div className={`
        absolute inset-0 rounded-full border-4 border-yellow-400
        flex items-center justify-center font-bold text-lg
        ${result === 'heads' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'}
        text-white shadow-2xl
      `}>
        {result === 'heads' ? '👑' : 'T'}
      </div>
      
      {isFlipping && (
        <div className="absolute inset-0 bg-yellow-300 opacity-50 rounded-full animate-pulse" />
      )}
    </div>
  );
};

// Authentic progress bar with glow effects
export const ProgressBarWithGlow = ({ 
  progress, 
  color = 'blue' 
}: { 
  progress: number; 
  color?: 'blue' | 'red' | 'green' | 'purple';
}) => {
  const colorClasses = {
    blue: 'from-blue-400 to-blue-600',
    red: 'from-red-400 to-red-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600'
  };

  return (
    <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`
          h-full bg-gradient-to-r ${colorClasses[color]} 
          transition-all duration-1000 ease-out
          relative overflow-hidden
        `}
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-white opacity-30 animate-shimmer" />
      </div>
      
      {progress > 80 && (
        <div className="absolute inset-0 bg-yellow-300 opacity-20 animate-pulse rounded-full" />
      )}
    </div>
  );
};