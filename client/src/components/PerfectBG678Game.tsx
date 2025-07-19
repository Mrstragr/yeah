import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Settings, Volume2 } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function PerfectBG678Game({ onBack }: Props) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [currentPeriod, setCurrentPeriod] = useState('20250501101864');
  const [betAmount, setBetAmount] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [balance, setBalance] = useState(10000);

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

  // EXACT color mapping from screenshots
  const getNumberColor = (num: number) => {
    if (num === 0 || num === 5) return 'bg-purple-500 text-white'; // Purple for 0,5
    if ([1, 3, 7, 9].includes(num)) return 'bg-red-500 text-white'; // Red for 1,3,7,9
    return 'bg-green-500 text-white'; // Green for 2,4,6,8
  };

  const betAmounts = [1, 10, 100, 1000];
  const multipliers = ['X10', 'X20', 'X50', 'X100'];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        
        {/* Mobile Status Bar */}
        <div className="bg-black text-white px-4 py-1 text-xs flex justify-between">
          <span>7:48 🔵</span>
          <div className="flex space-x-1">
            <span>📶</span>
            <span>🔋</span>
            <span>56%</span>
          </div>
        </div>

        {/* Browser URL Bar - EXACT */}
        <div className="bg-gray-700 text-white px-4 py-2 text-xs">
          <div className="flex items-center space-x-2">
            <span>🏠</span>
            <span className="text-gray-300">bg678game1.com/w1p</span>
            <span>➕</span>
            <span>📱</span>
            <span>⋮</span>
          </div>
        </div>

        {/* EXACT BG678 Header - Green */}
        <div className="bg-green-500 px-4 py-3 text-white relative">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <div className="text-xl font-bold">BG678</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-1">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="p-1">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Win Go Period Selection Tabs - EXACT */}
        <div className="bg-white px-4 py-3">
          <div className="flex justify-between">
            {[
              { time: '30s', active: false },
              { time: '1K', active: true },
              { time: '3K', active: false },
              { time: '5K', active: false },
              { time: '10K', active: false }
            ].map((period, index) => (
              <button
                key={index}
                className={`flex flex-col items-center p-2 rounded-lg ${
                  period.active ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <div className="text-sm">{index === 1 ? '✓' : '⏱️'}</div>
                <div className="text-xs font-semibold">Win Go</div>
                <div className="text-xs">{period.time}</div>
              </button>
            ))}
          </div>
        </div>

        {/* How to play button - EXACT */}
        <div className="px-4 mb-4">
          <button className="w-full bg-green-500 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center">
            📖 How to play
          </button>
        </div>

        {/* Timer and Period Display - EXACT */}
        <div className="bg-green-500 mx-4 rounded-lg p-4 text-white mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm mb-1">WinGo 30 second</div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-6 h-6 bg-pink-400 rounded-full text-xs flex items-center justify-center">
                    ●
                  </div>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm">Time remaining</div>
              <div className="text-2xl font-bold font-mono">
                0 0 : {Math.floor(timeLeft / 10)} {timeLeft % 10}
              </div>
              <div className="text-xs mt-1">{currentPeriod}</div>
            </div>
          </div>
        </div>

        {/* Color Betting Section - EXACT */}
        <div className="px-4 mb-4">
          <div className="flex space-x-2">
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
        </div>

        {/* Number Grid - EXACT colors as screenshots */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => setSelectedBet(`number-${num}`)}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg relative ${
                  getNumberColor(num)
                } ${selectedBet === `number-${num}` ? 'ring-2 ring-yellow-400' : ''}`}
              >
                {num}
                <div className="absolute -top-1 -right-1 text-xs text-gray-500">
                  9X
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Orange WinGo Betting Section - EXACT */}
        <div className="mx-4 mb-4">
          <div className="bg-orange-400 rounded-t-2xl p-4 text-white">
            <div className="text-center font-bold text-lg mb-2">WinGo 30 second</div>
            <div className="bg-white rounded-lg p-2">
              <button className="w-full text-center text-gray-600 py-2">
                Select big
              </button>
            </div>
          </div>
        </div>

        {/* Balance and Quantity Controls - EXACT */}
        <div className="px-4 mb-4">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">Balance</span>
              <div className="flex space-x-2">
                {betAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`px-3 py-1 rounded text-sm font-bold ${
                      betAmount === amount 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {amount}
                  </button>
                ))}
                <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm font-bold">
                  1000
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Quantity</span>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 bg-orange-500 text-white rounded flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="text-lg font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 bg-orange-500 text-white rounded flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Multiplier Controls - EXACT */}
        <div className="px-4 mb-6">
          <div className="flex space-x-2">
            {multipliers.map((mult) => (
              <button
                key={mult}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded text-sm font-bold hover:bg-orange-500 hover:text-white transition-colors"
              >
                {mult}
              </button>
            ))}
          </div>
        </div>

        {/* Game History - EXACT */}
        <div className="px-4 mb-6">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600 mb-2">
              <div className="text-center">Period</div>
              <div className="text-center">Number</div>
              <div className="text-center">Big Small</div>
              <div className="text-center">Color</div>
            </div>
            
            {[
              { period: '20250101863', number: 0, size: 'Small', color: 'purple' },
              { period: '20250101862', number: 8, size: 'Big', color: 'green' },
              { period: '20250101861', number: 2, size: 'Small', color: 'green' }
            ].map((result, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 text-xs py-2 border-b border-gray-200 last:border-b-0">
                <div className="text-center text-gray-600 text-xs">{result.period}</div>
                <div className="text-center">
                  <span className={`inline-block w-6 h-6 rounded-full text-white text-xs leading-6 font-bold ${
                    getNumberColor(result.number).replace('text-white', '')
                  }`}>
                    {result.number}
                  </span>
                </div>
                <div className="text-center text-gray-600">{result.size}</div>
                <div className="text-center">
                  <span className={`w-3 h-3 rounded-full inline-block ${
                    result.color === 'purple' ? 'bg-purple-500' : 
                    result.color === 'red' ? 'bg-red-500' : 'bg-green-500'
                  }`}></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instagram-style bottom with BG678 Game tag */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 text-white p-4 max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white">
              B
            </div>
            <div>
              <div className="font-semibold">BG678 Game</div>
              <div className="text-sm text-gray-300">20.7K</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm">Color Prediction:</div>
            <div className="text-sm">Understanding and Analyzi...</div>
          </div>
          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold mt-3 flex items-center justify-center">
            Play game →
          </button>
        </div>

        {/* Bottom spacing */}
        <div className="h-40"></div>
      </div>
    </div>
  );
}