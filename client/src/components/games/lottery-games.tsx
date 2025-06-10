import { useState, useEffect } from "react";

const NumberBall = ({ number, isSelected, isWinning, delay = 0, isDrawing = false }: { 
  number: number; 
  isSelected?: boolean; 
  isWinning?: boolean; 
  delay?: number;
  isDrawing?: boolean;
}) => (
  <div 
    className={`
      relative w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm
      transition-all duration-700 transform hover:scale-110 cursor-pointer
      ${isSelected ? 'bg-gradient-to-br from-[#FFD700] to-[#B8860B] scale-110 shadow-2xl shadow-[#D4AF37]/50' : 'bg-gradient-to-br from-[#3a3a3a] to-[#2a2a2a] hover:from-[#4a4a4a] hover:to-[#3a3a3a]'}
      ${isWinning ? 'animate-pulse bg-gradient-to-br from-green-400 to-green-600 shadow-2xl shadow-green-500/50' : ''}
      ${isDrawing ? 'animate-spin' : ''}
      before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-tr before:from-white/20 before:to-transparent before:opacity-60
      after:absolute after:inset-1 after:rounded-full after:bg-gradient-to-br after:from-transparent after:to-black/20
    `}
    style={{ 
      animationDelay: `${delay}ms`,
      boxShadow: isSelected ? '0 0 30px rgba(212, 175, 55, 0.6), inset 0 2px 10px rgba(255, 255, 255, 0.3)' : 
                 isWinning ? '0 0 30px rgba(34, 197, 94, 0.8)' : 
                 '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 2px 5px rgba(255, 255, 255, 0.1)'
    }}
  >
    <span className="relative z-10 drop-shadow-lg">{number}</span>
    {isSelected && (
      <div className="absolute inset-0 rounded-full animate-ping bg-[#D4AF37] opacity-30"></div>
    )}
  </div>
);

const ParticleEffect = ({ isActive }: { isActive: boolean }) => {
  if (!isActive) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

interface LotteryGameProps {
  title: string;
  onPlay: (betAmount: number) => void;
  onClose: () => void;
}

export function WinGoGame({ title, onPlay, onClose }: LotteryGameProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [currentPeriod, setCurrentPeriod] = useState("20250110001");
  const [isDrawing, setIsDrawing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [lastResults, setLastResults] = useState([
    { period: "20250110000", number: 5, color: "green", size: "small" },
    { period: "20250109999", number: 8, color: "red", size: "big" },
    { period: "20250109998", number: 3, color: "green", size: "small" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Start drawing animation
          setIsDrawing(true);
          
          setTimeout(() => {
            const newNumber = Math.floor(Math.random() * 10);
            const newColor = [0,5].includes(newNumber) ? "violet" : newNumber < 5 ? "green" : "red";
            const newSize = newNumber < 5 ? "small" : "big";
            
            setWinningNumber(newNumber);
            setIsDrawing(false);
            setShowResult(true);
            
            // Show result for 3 seconds then add to history
            setTimeout(() => {
              setLastResults(prev => [
                { period: currentPeriod, number: newNumber, color: newColor, size: newSize },
                ...prev.slice(0, 2)
              ]);
              setShowResult(false);
              setWinningNumber(null);
              setCurrentPeriod(prev => String(Number(prev) + 1));
            }, 3000);
          }, 2000);
          
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPeriod]);

  const colors = [
    { name: "green", bg: "bg-green-500", odds: "1:2" },
    { name: "red", bg: "bg-red-500", odds: "1:2" },
    { name: "violet", bg: "bg-purple-500", odds: "1:4.5" }
  ];

  const numbers = Array.from({ length: 10 }, (_, i) => i);

  const handleBet = () => {
    if (selectedColor || selectedNumber !== null) {
      onPlay(betAmount);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] z-50 flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#D4AF37] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-500 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-green-500 rounded-full blur-xl animate-ping"></div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e1e1e] via-[#2a2a2a] to-[#1e1e1e] p-4 flex items-center justify-between shadow-2xl">
        <button 
          onClick={onClose} 
          className="text-white text-xl hover:text-[#D4AF37] transition-colors duration-300 hover:scale-110 transform"
        >
          ←
        </button>
        <h1 className="text-white font-bold text-lg bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 bg-transparent p-4 overflow-y-auto">
        {/* Timer Section with Enhanced Animation */}
        <div className="relative bg-gradient-to-br from-[#2a2a2a] via-[#3a3a3a] to-[#2a2a2a] rounded-2xl p-6 mb-6 shadow-2xl border border-gray-700">
          <ParticleEffect isActive={timeLeft <= 5 || isDrawing} />
          
          <div className="text-center relative z-10">
            <div className="text-[#D4AF37] text-sm mb-3 font-medium">
              Period: <span className="font-bold">{currentPeriod}</span>
            </div>
            
            {/* Enhanced Timer Display */}
            <div className={`
              text-white text-4xl font-bold mb-3 transition-all duration-500
              ${timeLeft <= 10 ? 'text-red-400 animate-pulse scale-110' : ''}
              ${isDrawing ? 'animate-bounce text-[#D4AF37]' : ''}
            `}>
              {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
              {String(timeLeft % 60).padStart(2, '0')}
            </div>
            
            <div className={`text-gray-400 text-sm transition-all duration-300 ${timeLeft <= 5 ? 'text-red-400 font-bold' : ''}`}>
              {isDrawing ? '🎲 Drawing Numbers...' : timeLeft <= 5 ? '⏰ Betting Ends Soon!' : 'Time remaining'}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mt-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 rounded-full ${
                  timeLeft <= 10 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                  'bg-gradient-to-r from-[#D4AF37] to-[#B8860B]'
                }`}
                style={{ width: `${(timeLeft / 60) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Result Display */}
        {showResult && winningNumber !== null && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-3xl p-8 text-center border-2 border-[#D4AF37] shadow-2xl">
              <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">🎉 Winning Number!</h2>
              <NumberBall number={winningNumber} isWinning={true} />
              <p className="text-white mt-4">
                {[0,5].includes(winningNumber) ? 'Violet' : winningNumber < 5 ? 'Green' : 'Red'} • 
                {winningNumber < 5 ? 'Small' : 'Big'}
              </p>
            </div>
          </div>
        )}

        {/* Latest Results with Enhanced Display */}
        <div className="bg-gradient-to-br from-[#2a2a2a] via-[#3a3a3a] to-[#2a2a2a] rounded-2xl p-4 mb-6 shadow-xl border border-gray-700">
          <div className="text-white text-lg mb-4 font-bold flex items-center gap-2">
            📊 Latest Results
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {lastResults.map((result, index) => (
              <div key={index} className="flex-shrink-0 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-3 text-center min-w-[90px] border border-gray-600 shadow-lg">
                <div className="text-xs text-[#D4AF37] mb-2 font-medium">
                  #{result.period.slice(-3)}
                </div>
                <NumberBall 
                  number={result.number} 
                  isWinning={false}
                  delay={index * 100}
                />
                <div className="text-xs text-gray-400 mt-2 font-medium">
                  {result.color} • {result.size}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Color Selection */}
        <div className="bg-gradient-to-br from-[#2a2a2a] via-[#3a3a3a] to-[#2a2a2a] rounded-2xl p-4 mb-6 shadow-xl border border-gray-700">
          <div className="text-white text-lg mb-4 font-bold flex items-center gap-2">
            🎨 Select Color
          </div>
          <div className="grid grid-cols-3 gap-3">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`
                  relative overflow-hidden p-4 rounded-xl text-center transition-all duration-300 transform
                  ${color.name === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500' : ''}
                  ${color.name === 'red' ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500' : ''}
                  ${color.name === 'violet' ? 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500' : ''}
                  ${selectedColor === color.name ? 'ring-4 ring-[#D4AF37] scale-105 shadow-2xl shadow-[#D4AF37]/30' : 'hover:scale-102'}
                  text-white shadow-lg
                `}
              >
                <div className="relative z-10">
                  <div className="font-bold text-lg capitalize mb-1">{color.name}</div>
                  <div className="text-sm opacity-90">Odds: {color.odds}</div>
                </div>
                {selectedColor === color.name && (
                  <div className="absolute inset-0 bg-white/10 animate-pulse rounded-xl"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Number Selection */}
        <div className="bg-gradient-to-br from-[#2a2a2a] via-[#3a3a3a] to-[#2a2a2a] rounded-2xl p-4 mb-6 shadow-xl border border-gray-700">
          <div className="text-white text-lg mb-4 font-bold flex items-center gap-2">
            🔢 Select Number
          </div>
          <div className="grid grid-cols-5 gap-3">
            {numbers.map((num) => (
              <button
                key={num}
                onClick={() => setSelectedNumber(num)}
                className={`
                  relative p-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105
                  ${selectedNumber === num ? 'ring-4 ring-[#D4AF37] scale-110 shadow-2xl shadow-[#D4AF37]/30' : ''}
                  ${[0,5].includes(num) ? 'bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600' : 
                    num < 5 ? 'bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600' : 
                    'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600'}
                  text-white shadow-lg
                `}
              >
                <div className="relative z-10">
                  <div className="font-bold text-xl mb-1">{num}</div>
                  <div className="text-xs opacity-80">x9.5</div>
                </div>
                {selectedNumber === num && (
                  <div className="absolute inset-0 bg-white/10 animate-pulse rounded-xl"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Bet Amount Section */}
        <div className="bg-gradient-to-br from-[#2a2a2a] via-[#3a3a3a] to-[#2a2a2a] rounded-2xl p-4 mb-6 shadow-xl border border-gray-700">
          <div className="text-white text-lg mb-4 font-bold flex items-center gap-2">
            💰 Bet Amount
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[10, 50, 100, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`
                  p-3 rounded-xl text-center transition-all duration-300 transform font-bold
                  ${betAmount === amount 
                    ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-black scale-105 shadow-2xl shadow-[#D4AF37]/30' 
                    : 'bg-gradient-to-br from-[#3a3a3a] to-[#2a2a2a] text-white hover:from-[#4a4a4a] hover:to-[#3a3a3a] hover:scale-102'
                  }
                  shadow-lg border border-gray-600
                `}
              >
                ₹{amount}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full bg-gradient-to-r from-[#2a2a2a] to-[#3a3a3a] text-white p-4 rounded-xl border border-gray-600 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-300"
            placeholder="Enter custom amount"
          />
        </div>

        {/* Enhanced Confirm Button */}
        <button
          onClick={handleBet}
          disabled={(!selectedColor && selectedNumber === null) || timeLeft <= 5}
          className={`
            w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform shadow-2xl
            ${(!selectedColor && selectedNumber === null) || timeLeft <= 5
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black hover:from-[#FFD700] hover:to-[#D4AF37] hover:scale-105 active:scale-95 shadow-[#D4AF37]/40'
            }
          `}
        >
          {timeLeft <= 5 ? '⏰ Betting Closed' : `🎯 Confirm Bet ₹${betAmount}`}
        </button>
      </div>
    </div>
  );
}