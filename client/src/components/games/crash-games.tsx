import { useState, useEffect } from "react";

interface CrashGameProps {
  title: string;
  onPlay: (betAmount: number) => void;
  onClose: () => void;
}

const FlightPath = ({ multiplier, gamePhase }: { multiplier: number; gamePhase: string }) => {
  const pathData = [];
  for (let i = 0; i <= multiplier - 1; i += 0.1) {
    const x = (i / 10) * 100;
    const y = 100 - (Math.log(1 + i) * 30);
    pathData.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
  }
  
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.8" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {pathData.length > 1 && (
        <path
          d={pathData.join(' ')}
          stroke="url(#pathGradient)"
          strokeWidth="0.5"
          fill="none"
          filter="url(#glow)"
          className={gamePhase === 'flying' ? 'animate-pulse' : ''}
        />
      )}
      
      {/* Grid lines for professional look */}
      {[...Array(10)].map((_, i) => (
        <g key={i} opacity="0.1">
          <line x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="white" strokeWidth="0.1" />
          <line x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="white" strokeWidth="0.1" />
        </g>
      ))}
    </svg>
  );
};

const ParticleSystem = ({ isActive, color = "#D4AF37" }: { isActive: boolean; color?: string }) => {
  if (!isActive) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full opacity-70"
          style={{
            backgroundColor: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            boxShadow: `0 0 6px ${color}`
          }}
        />
      ))}
    </div>
  );
};

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
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] z-50 flex flex-col">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-[#1e1e1e] via-[#2a2a3a] to-[#1e1e1e] p-4 flex items-center justify-between shadow-2xl border-b border-blue-500/20">
        <button 
          onClick={onClose} 
          className="text-white text-xl hover:text-blue-400 transition-all duration-300 hover:scale-110 transform"
        >
          ←
        </button>
        <h1 className="text-white font-bold text-lg bg-gradient-to-r from-white via-blue-400 to-white bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        {/* Animated Sky Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-400 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-indigo-400 rounded-full blur-2xl animate-pulse"></div>
        </div>

        {/* Flight Path Visualization */}
        <FlightPath multiplier={multiplier} gamePhase={gamePhase} />
        
        {/* Particle Effects */}
        <ParticleSystem isActive={gamePhase === 'flying'} color="#60A5FA" />

        {/* Game Area */}
        <div className="h-2/3 flex items-center justify-center relative z-10">
          {gamePhase === 'betting' && (
            <div className="text-center text-white">
              <div className="relative mb-6">
                <div className="text-8xl animate-bounce filter drop-shadow-2xl">✈️</div>
                <div className="absolute inset-0 text-8xl animate-ping opacity-30">✈️</div>
              </div>
              <div className="text-2xl font-bold mb-2 text-blue-200">Next Flight Departing</div>
              <div className="text-6xl font-bold text-[#D4AF37] animate-pulse drop-shadow-lg">{timeLeft}s</div>
              <div className="mt-4 text-lg text-blue-300">Prepare for takeoff...</div>
            </div>
          )}
          
          {gamePhase === 'flying' && (
            <div className="text-center text-white relative">
              <div className="relative mb-6">
                <div 
                  className="text-8xl transition-all duration-100 filter drop-shadow-2xl" 
                  style={{
                    transform: `translateX(${(multiplier - 1) * 30}px) translateY(-${(multiplier - 1) * 15}px) rotate(${(multiplier - 1) * 5}deg)`,
                    filter: `hue-rotate(${(multiplier - 1) * 10}deg) brightness(${1 + (multiplier - 1) * 0.1})`
                  }}
                >
                  ✈️
                </div>
                <div className="absolute inset-0 opacity-50 animate-pulse">
                  <div 
                    className="text-8xl" 
                    style={{
                      transform: `translateX(${(multiplier - 1) * 30}px) translateY(-${(multiplier - 1) * 15}px) rotate(${(multiplier - 1) * 5}deg)`,
                    }}
                  >
                    ✈️
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="text-8xl font-bold text-[#D4AF37] animate-pulse drop-shadow-2xl">
                  {multiplier.toFixed(2)}x
                </div>
                <div className="absolute inset-0 text-8xl font-bold text-yellow-300 opacity-30 animate-ping">
                  {multiplier.toFixed(2)}x
                </div>
              </div>
              
              <div className="mt-4 text-xl text-green-300 animate-bounce">
                Flying High! Cash out anytime
              </div>
            </div>
          )}
          
          {gamePhase === 'crashed' && (
            <div className="text-center text-white relative">
              <div className="relative mb-6">
                <div className="text-8xl animate-bounce filter drop-shadow-2xl">💥</div>
                <div className="absolute inset-0 text-8xl animate-ping opacity-50">💥</div>
                <ParticleSystem isActive={true} color="#EF4444" />
              </div>
              <div className="text-5xl font-bold text-red-400 animate-pulse drop-shadow-lg mb-2">
                CRASHED!
              </div>
              <div className="text-3xl font-bold text-red-300">
                at {multiplier.toFixed(2)}x
              </div>
              <div className="mt-4 text-lg text-gray-300">
                Better luck next flight
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