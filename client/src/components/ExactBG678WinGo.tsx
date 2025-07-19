import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function ExactBG678WinGo({ onBack }: Props) {
  const [timeLeft, setTimeLeft] = useState(23);
  const [currentPeriod, setCurrentPeriod] = useState('20250501101863');
  const [betAmount, setBetAmount] = useState(1);
  const [selectedBet, setSelectedBet] = useState<string | null>(null);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Start new period
          const newPeriod = (parseInt(currentPeriod) + 1).toString();
          setCurrentPeriod(newPeriod);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPeriod]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getNumberColor = (num: number) => {
    if (num === 0 || num === 5) return 'bg-gradient-to-br from-purple-500 to-violet-600 text-white';
    if ([1, 3, 7, 9].includes(num)) return 'bg-gradient-to-br from-red-500 to-red-600 text-white';
    return 'bg-gradient-to-br from-green-500 to-green-600 text-white';
  };

  const multipliers = ['X1', 'X5', 'X10', 'X20', 'X50', 'X100'];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        
        {/* EXACT Green Header like BG678 */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold">BG678</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded"></div>
              <div className="w-6 h-6 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>

        {/* Progress Bar - exactly like screenshot */}
        <div className="bg-green-500 h-1">
          <div 
            className="bg-yellow-400 h-1 transition-all duration-1000" 
            style={{ width: `${((30 - timeLeft) / 30) * 100}%` }}
          ></div>
        </div>

        {/* Win Go Period Selection - EXACT like screenshot */}
        <div className="bg-white p-4">
          <div className="flex justify-between mb-4">
            {[30, '1K', '3K', '5K', '10K'].map((time, index) => (
              <button
                key={index}
                className={`flex flex-col items-center p-2 rounded-lg ${
                  index === 0 ? 'bg-green-500 text-white' : 'bg-gray-100'
                }`}
              >
                <div className="text-2xl mb-1">{index === 0 ? '🎯' : '⏱️'}</div>
                <div className="text-xs font-semibold">Win Go</div>
                <div className="text-xs">{time}s</div>
              </button>
            ))}
          </div>

          {/* How to play button - EXACT */}
          <button className="w-full bg-green-500 text-white py-2 rounded-lg mb-4 text-sm font-semibold">
            📖 How to play
          </button>

          {/* Timer Display - EXACT like screenshot */}
          <div className="bg-green-500 rounded-lg p-4 text-white mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm">Time remaining</div>
                <div className="text-3xl font-bold font-mono">
                  0 0 : {Math.floor(timeLeft / 10)} {timeLeft % 10}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs">Period</div>
                <div className="text-sm font-mono">{currentPeriod}</div>
              </div>
            </div>
          </div>

          {/* Color Betting - EXACT like screenshot */}
          <div className="flex space-x-2 mb-4">
            <button 
              onClick={() => setSelectedBet('green')}
              className={`flex-1 bg-green-500 text-white py-3 rounded-lg font-bold ${
                selectedBet === 'green' ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              Green 2X
            </button>
            <button 
              onClick={() => setSelectedBet('violet')}
              className={`flex-1 bg-purple-500 text-white py-3 rounded-lg font-bold ${
                selectedBet === 'violet' ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              Violet 4.5X
            </button>
            <button 
              onClick={() => setSelectedBet('red')}
              className={`flex-1 bg-red-500 text-white py-3 rounded-lg font-bold ${
                selectedBet === 'red' ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              Red 2X
            </button>
          </div>

          {/* Number Grid - EXACT like screenshot with colored circles */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => setSelectedBet(`number-${num}`)}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  getNumberColor(num)
                } ${selectedBet === `number-${num}` ? 'ring-2 ring-yellow-400' : ''}`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Multiplier Selection - EXACT */}
          <div className="flex justify-between mb-4">
            <span className="text-sm font-semibold">Random</span>
            {multipliers.map((mult) => (
              <button
                key={mult}
                onClick={() => setBetAmount(parseInt(mult.slice(1)))}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  betAmount === parseInt(mult.slice(1)) 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {mult}
              </button>
            ))}
          </div>

          {/* Big/Small Betting - EXACT like screenshot */}
          <div className="flex space-x-2 mb-6">
            <button 
              onClick={() => setSelectedBet('big')}
              className={`flex-1 bg-orange-400 text-white py-3 rounded-lg font-bold ${
                selectedBet === 'big' ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              Big 2X
            </button>
            <button 
              onClick={() => setSelectedBet('small')}
              className={`flex-1 bg-blue-400 text-white py-3 rounded-lg font-bold ${
                selectedBet === 'small' ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              Small 2X
            </button>
          </div>

          {/* Bottom Tabs - EXACT like screenshot */}
          <div className="flex bg-gray-100 rounded-lg">
            <button className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold">
              Game history
            </button>
            <button className="flex-1 py-2 font-semibold text-gray-600">
              Chart
            </button>
            <button className="flex-1 py-2 font-semibold text-gray-600">
              My history
            </button>
          </div>

          {/* Game History Table - EXACT */}
          <div className="mt-4">
            <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600 mb-2">
              <div className="text-center">Period</div>
              <div className="text-center">Number</div>
              <div className="text-center">Big Small</div>
              <div className="text-center">Color</div>
            </div>
            
            {[
              { period: '20250101863', number: 0, size: 'Small', color: 'violet' },
              { period: '20250101862', number: 8, size: 'Big', color: 'red' },
              { period: '20250101861', number: 2, size: 'Small', color: 'green' }
            ].map((result, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 text-xs py-2 border-b border-gray-100">
                <div className="text-center text-gray-600">{result.period}</div>
                <div className="text-center">
                  <span className={`inline-block w-6 h-6 rounded-full text-white text-xs leading-6 ${
                    getNumberColor(result.number).replace('bg-gradient-to-br', 'bg')
                  }`}>
                    {result.number}
                  </span>
                </div>
                <div className="text-center text-gray-600">{result.size}</div>
                <div className="text-center">
                  <span className={`w-3 h-3 rounded-full inline-block ${
                    result.color === 'violet' ? 'bg-purple-500' : 
                    result.color === 'red' ? 'bg-red-500' : 'bg-green-500'
                  }`}></span>
                </div>
              </div>
            ))}
          </div>

          {/* Congratulations Popup - like screenshot */}
          {selectedBet && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 mx-4 text-center relative">
                <div className="text-4xl mb-4">🎉</div>
                <div className="text-xl font-bold text-green-600 mb-2">Congratulations</div>
                <div className="text-gray-600 mb-4">
                  Receive Green → Bonus<br />
                  ₹21560<br />
                  <span className="text-xs">Your earnings for this round is ₹20500.0</span>
                </div>
                <div className="text-xs text-gray-500 mb-4">
                  ⏰ 3 seconds auto close
                </div>
                <button 
                  onClick={() => setSelectedBet(null)}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}