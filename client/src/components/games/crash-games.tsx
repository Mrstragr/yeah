import { useState, useEffect } from "react";

interface CrashGameProps {
  title: string;
  onPlay: (betAmount: number) => void;
  onClose: () => void;
}

export function AviatorGame({ title, onPlay, onClose }: CrashGameProps) {
  const [gamePhase, setGamePhase] = useState<'betting' | 'flying' | 'crashed'>('betting');
  const [multiplier, setMultiplier] = useState(1.00);
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashout, setAutoCashout] = useState<number | null>(null);
  const [betPlaced, setBetPlaced] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7);
  const [history, setHistory] = useState([2.45, 1.23, 4.67, 1.89, 3.12]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gamePhase === 'betting') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGamePhase('flying');
            setMultiplier(1.00);
            setCashedOut(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gamePhase === 'flying') {
      timer = setInterval(() => {
        setMultiplier(prev => {
          const crashPoint = 1 + Math.random() * 10; // Random crash between 1x - 11x
          const newMultiplier = prev + 0.01;
          
          // Auto cashout
          if (autoCashout && newMultiplier >= autoCashout && betPlaced && !cashedOut) {
            setCashedOut(true);
            onPlay(betAmount * autoCashout);
          }
          
          if (newMultiplier >= crashPoint) {
            setGamePhase('crashed');
            setHistory(prev => [parseFloat(newMultiplier.toFixed(2)), ...prev.slice(0, 4)]);
            setTimeout(() => {
              setGamePhase('betting');
              setTimeLeft(7);
              setBetPlaced(false);
            }, 3000);
            return newMultiplier;
          }
          
          return newMultiplier;
        });
      }, 50);
    }

    return () => clearInterval(timer);
  }, [gamePhase, autoCashout, betPlaced, cashedOut, betAmount, onPlay]);

  const placeBet = () => {
    if (gamePhase === 'betting' && !betPlaced) {
      setBetPlaced(true);
    }
  };

  const cashOut = () => {
    if (gamePhase === 'flying' && betPlaced && !cashedOut) {
      setCashedOut(true);
      onPlay(betAmount * multiplier);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-[#1e1e1e] p-3 flex items-center justify-between">
        <button onClick={onClose} className="text-white text-lg">←</button>
        <h1 className="text-white font-medium">{title}</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 bg-gradient-to-b from-blue-900 to-blue-700 relative overflow-hidden">
        {/* Game Area */}
        <div className="h-2/3 flex items-center justify-center relative">
          {gamePhase === 'betting' && (
            <div className="text-center text-white">
              <div className="text-6xl mb-4">✈️</div>
              <div className="text-2xl font-bold">Next round in</div>
              <div className="text-4xl font-bold text-[#D4AF37]">{timeLeft}s</div>
            </div>
          )}
          
          {gamePhase === 'flying' && (
            <div className="text-center text-white">
              <div className="text-6xl mb-4" style={{
                transform: `translateX(${(multiplier - 1) * 20}px) translateY(-${(multiplier - 1) * 10}px)`
              }}>✈️</div>
              <div className="text-6xl font-bold text-[#D4AF37]">
                {multiplier.toFixed(2)}x
              </div>
            </div>
          )}
          
          {gamePhase === 'crashed' && (
            <div className="text-center text-white">
              <div className="text-6xl mb-4">💥</div>
              <div className="text-4xl font-bold text-red-500">
                CRASHED at {multiplier.toFixed(2)}x
              </div>
            </div>
          )}
        </div>

        {/* History */}
        <div className="absolute top-4 left-4">
          <div className="flex gap-2">
            {history.map((mult, index) => (
              <div key={index} className={`px-2 py-1 rounded text-xs font-bold ${
                mult >= 2 ? 'bg-green-500' : mult >= 1.5 ? 'bg-yellow-500' : 'bg-red-500'
              } text-white`}>
                {mult}x
              </div>
            ))}
          </div>
        </div>

        {/* Control Panel */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#1e1e1e] p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Bet Controls */}
            <div className="space-y-3">
              <div>
                <label className="text-white text-sm mb-2 block">Bet Amount</label>
                <div className="flex gap-2 mb-2">
                  {[10, 50, 100, 500].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      className={`px-3 py-1 rounded text-sm ${
                        betAmount === amount ? 'bg-[#D4AF37] text-black' : 'bg-[#2a2a2a] text-white'
                      }`}
                      disabled={gamePhase === 'flying'}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="w-full bg-[#2a2a2a] text-white p-2 rounded text-sm"
                  disabled={gamePhase === 'flying'}
                />
              </div>

              <div>
                <label className="text-white text-sm mb-2 block">Auto Cashout</label>
                <input
                  type="number"
                  step="0.01"
                  value={autoCashout || ''}
                  onChange={(e) => setAutoCashout(e.target.value ? Number(e.target.value) : null)}
                  className="w-full bg-[#2a2a2a] text-white p-2 rounded text-sm"
                  placeholder="Auto cashout at..."
                  disabled={gamePhase === 'flying'}
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="flex flex-col justify-center">
              {gamePhase === 'betting' && !betPlaced && (
                <button
                  onClick={placeBet}
                  className="bg-green-500 text-white py-4 rounded-lg font-bold text-lg"
                >
                  Place Bet ₹{betAmount}
                </button>
              )}
              
              {gamePhase === 'betting' && betPlaced && (
                <div className="bg-[#D4AF37] text-black py-4 rounded-lg font-bold text-lg text-center">
                  Bet Placed ₹{betAmount}
                </div>
              )}
              
              {gamePhase === 'flying' && betPlaced && !cashedOut && (
                <button
                  onClick={cashOut}
                  className="bg-[#D4AF37] text-black py-4 rounded-lg font-bold text-lg"
                >
                  Cash Out ₹{(betAmount * multiplier).toFixed(2)}
                </button>
              )}
              
              {gamePhase === 'flying' && (!betPlaced || cashedOut) && (
                <div className="bg-gray-500 text-white py-4 rounded-lg font-bold text-lg text-center">
                  {cashedOut ? `Cashed Out!` : 'Watch & Wait'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function JetXGame({ title, onPlay, onClose }: CrashGameProps) {
  const [gamePhase, setGamePhase] = useState<'betting' | 'flying' | 'crashed'>('betting');
  const [multiplier, setMultiplier] = useState(1.00);
  const [betAmount, setBetAmount] = useState(10);
  const [betPlaced, setBetPlaced] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gamePhase === 'betting') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGamePhase('flying');
            setMultiplier(1.00);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gamePhase === 'flying') {
      timer = setInterval(() => {
        setMultiplier(prev => {
          const crashPoint = 1 + Math.random() * 8;
          const newMultiplier = prev + 0.02;
          
          if (newMultiplier >= crashPoint) {
            setGamePhase('crashed');
            setTimeout(() => {
              setGamePhase('betting');
              setTimeLeft(5);
              setBetPlaced(false);
            }, 2000);
            return newMultiplier;
          }
          
          return newMultiplier;
        });
      }, 100);
    }

    return () => clearInterval(timer);
  }, [gamePhase]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-[#1e1e1e] p-3 flex items-center justify-between">
        <button onClick={onClose} className="text-white text-lg">←</button>
        <h1 className="text-white font-medium">{title}</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 bg-gradient-to-b from-purple-900 to-purple-700 relative">
        <div className="h-2/3 flex items-center justify-center">
          {gamePhase === 'betting' && (
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🚀</div>
              <div className="text-xl">Starting in {timeLeft}s</div>
            </div>
          )}
          
          {gamePhase === 'flying' && (
            <div className="text-center text-white">
              <div className="text-6xl mb-4 animate-pulse">🚀</div>
              <div className="text-5xl font-bold text-[#D4AF37]">
                {multiplier.toFixed(2)}x
              </div>
            </div>
          )}
          
          {gamePhase === 'crashed' && (
            <div className="text-center text-white">
              <div className="text-6xl mb-4">💥</div>
              <div className="text-3xl font-bold text-red-500">
                CRASHED {multiplier.toFixed(2)}x
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-[#1e1e1e] p-4">
          <div className="space-y-3">
            <div>
              <label className="text-white text-sm mb-2 block">Bet Amount</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[10, 50, 100, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`p-2 rounded text-sm ${
                      betAmount === amount ? 'bg-[#D4AF37] text-black' : 'bg-[#2a2a2a] text-white'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>

            {gamePhase === 'betting' && (
              <button
                onClick={() => {setBetPlaced(true); onPlay(betAmount);}}
                className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-bold"
              >
                Place Bet ₹{betAmount}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}