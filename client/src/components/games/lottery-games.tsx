import { useState, useEffect } from "react";

const NumberBall = ({ number, isSelected, isWinning, delay = 0 }: { 
  number: number; 
  isSelected?: boolean; 
  isWinning?: boolean; 
  delay?: number;
}) => (
  <div 
    className={`
      w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm
      transition-all duration-500 transform hover:scale-110 cursor-pointer
      ${isSelected ? 'bg-[#D4AF37] scale-110 shadow-lg' : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'}
      ${isWinning ? 'animate-bounce bg-green-500 shadow-lg' : ''}
    `}
    style={{ animationDelay: `${delay}ms` }}
  >
    {number}
  </div>
);

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
  const [lastResults, setLastResults] = useState([
    { period: "20250110000", number: 5, color: "green", size: "small" },
    { period: "20250109999", number: 8, color: "red", size: "big" },
    { period: "20250109998", number: 3, color: "green", size: "small" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          const newNumber = Math.floor(Math.random() * 10);
          const newColor = [0,5].includes(newNumber) ? "violet" : newNumber < 5 ? "green" : "red";
          const newSize = newNumber < 5 ? "small" : "big";
          
          setLastResults(prev => [
            { period: currentPeriod, number: newNumber, color: newColor, size: newSize },
            ...prev.slice(0, 2)
          ]);
          
          setCurrentPeriod(prev => String(Number(prev) + 1));
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
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-[#1e1e1e] p-3 flex items-center justify-between">
        <button onClick={onClose} className="text-white text-lg">←</button>
        <h1 className="text-white font-medium">{title}</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 bg-[#0a0a0a] p-3 overflow-y-auto">
        <div className="bg-[#1e1e1e] rounded-lg p-4 mb-4">
          <div className="text-center">
            <div className="text-[#D4AF37] text-sm mb-2">Period: {currentPeriod}</div>
            <div className="text-white text-2xl font-bold mb-2">
              {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
              {String(timeLeft % 60).padStart(2, '0')}
            </div>
            <div className="text-gray-400 text-xs">Time remaining</div>
          </div>
        </div>

        <div className="bg-[#1e1e1e] rounded-lg p-3 mb-4">
          <div className="text-white text-sm mb-3">Latest Results</div>
          <div className="flex gap-2 overflow-x-auto">
            {lastResults.map((result, index) => (
              <div key={index} className="flex-shrink-0 bg-[#2a2a2a] rounded p-2 text-center min-w-[80px]">
                <div className="text-xs text-gray-400 mb-1">
                  ...{result.period.slice(-3)}
                </div>
                <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-white font-bold ${
                  result.color === 'green' ? 'bg-green-500' : 
                  result.color === 'red' ? 'bg-red-500' : 'bg-purple-500'
                }`}>
                  {result.number}
                </div>
                <div className="text-xs text-gray-400">{result.size}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1e1e1e] rounded-lg p-3 mb-4">
          <div className="text-white text-sm mb-3">Select Color</div>
          <div className="grid grid-cols-3 gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`${color.bg} text-white p-3 rounded-lg text-center ${
                  selectedColor === color.name ? 'ring-2 ring-[#D4AF37]' : ''
                }`}
              >
                <div className="font-medium capitalize">{color.name}</div>
                <div className="text-xs">{color.odds}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#1e1e1e] rounded-lg p-3 mb-4">
          <div className="text-white text-sm mb-3">Select Number</div>
          <div className="grid grid-cols-5 gap-2">
            {numbers.map((num) => (
              <button
                key={num}
                onClick={() => setSelectedNumber(num)}
                className={`bg-[#2a2a2a] text-white p-3 rounded-lg text-center ${
                  selectedNumber === num ? 'ring-2 ring-[#D4AF37]' : ''
                } ${
                  [0,5].includes(num) ? 'bg-purple-600' : 
                  num < 5 ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                <div className="font-bold">{num}</div>
                <div className="text-xs">1:9</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#1e1e1e] rounded-lg p-3 mb-4">
          <div className="text-white text-sm mb-3">Bet Amount</div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[10, 50, 100, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`p-2 rounded text-center ${
                  betAmount === amount ? 'bg-[#D4AF37] text-black' : 'bg-[#2a2a2a] text-white'
                }`}
              >
                ₹{amount}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full bg-[#2a2a2a] text-white p-2 rounded"
            placeholder="Enter amount"
          />
        </div>

        <button
          onClick={handleBet}
          disabled={!selectedColor && selectedNumber === null}
          className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-bold disabled:opacity-50"
        >
          Confirm Bet ₹{betAmount}
        </button>
      </div>
    </div>
  );
}