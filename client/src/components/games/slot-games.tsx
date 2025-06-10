import { useState, useEffect } from "react";

interface SlotGameProps {
  title: string;
  onPlay: (betAmount: number) => void;
  onClose: () => void;
}

const SlotReel = ({ symbols, isSpinning, reelIndex }: { symbols: string[]; isSpinning: boolean; reelIndex: number }) => {
  return (
    <div className="relative bg-gradient-to-br from-gray-100 via-white to-gray-200 rounded-2xl p-2 shadow-2xl border-4 border-gray-300 overflow-hidden">
      {/* 3D effect overlays */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent rounded-2xl"></div>
      <div className="absolute inset-2 bg-gradient-to-br from-transparent to-black/10 rounded-xl"></div>
      
      {/* Spinning particles */}
      {isSpinning && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60 animate-particle-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1.5 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
      
      <div className={`relative z-10 transition-all duration-200 ${isSpinning ? 'animate-slot-spin' : ''}`}>
        {symbols.map((symbol, symbolIndex) => (
          <div 
            key={symbolIndex} 
            className={`
              text-5xl text-center py-4 transition-all duration-300 relative
              ${symbolIndex === 1 ? 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 rounded-xl shadow-xl transform scale-110 border-2 border-yellow-600' : 'hover:scale-105'}
              ${isSpinning ? 'blur-sm' : 'filter-none'}
            `}
            style={{
              animationDelay: `${reelIndex * 100 + symbolIndex * 50}ms`,
              textShadow: symbolIndex === 1 ? '0 0 20px rgba(255, 215, 0, 0.8)' : '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <span className="relative z-10 drop-shadow-lg">{symbol}</span>
            {symbolIndex === 1 && !isSpinning && (
              <div className="absolute inset-0 bg-yellow-400 opacity-20 rounded-xl animate-pulse"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Glow effect when spinning */}
      {isSpinning && (
        <div className="absolute inset-0 rounded-2xl border-2 border-yellow-400 animate-ping opacity-40"></div>
      )}
    </div>
  );
};

const WinCelebration = ({ winAmount, isJackpot }: { winAmount: number; isJackpot: boolean }) => {
  if (winAmount <= 0) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 pointer-events-none">
      <div className="text-center">
        {/* Particle explosion */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-particle-float"
              style={{
                left: `${50 + (Math.random() - 0.5) * 100}%`,
                top: `${50 + (Math.random() - 0.5) * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          <div className="text-8xl mb-4 animate-bounce">
            {isJackpot ? '💎🏆💎' : '🎰✨🎰'}
          </div>
          <div className={`text-6xl font-bold animate-pulse mb-4 ${isJackpot ? 'text-yellow-300' : 'text-green-400'}`}>
            {isJackpot ? 'MEGA JACKPOT!' : 'BIG WIN!'}
          </div>
          <div className="text-4xl font-bold text-white">
            ₹{winAmount.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export function SlotMachineGame({ title, onPlay, onClose }: SlotGameProps) {
  const [reels, setReels] = useState([['🍒', '🍋', '🍊'], ['🍒', '🍋', '🍊'], ['🍒', '🍋', '🍊']]);
  const [spinning, setSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [balance, setBalance] = useState(1000);
  const [lastWin, setLastWin] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [spinsRemaining, setSpinsRemaining] = useState(0);
  const [showWinCelebration, setShowWinCelebration] = useState(false);

  const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣', '🔔'];
  const payouts = {
    '🍒': { 3: 5, 2: 2 },
    '🍋': { 3: 10, 2: 3 },
    '🍊': { 3: 15, 2: 4 },
    '🍇': { 3: 20, 2: 5 },
    '⭐': { 3: 50, 2: 10 },
    '💎': { 3: 100, 2: 20 },
    '7️⃣': { 3: 500, 2: 50 },
    '🔔': { 3: 1000, 2: 100 }
  };

  const calculateWin = (result: string[][]) => {
    const paylines = [
      [result[0][1], result[1][1], result[2][1]], // Middle row
      [result[0][0], result[1][0], result[2][0]], // Top row
      [result[0][2], result[1][2], result[2][2]], // Bottom row
      [result[0][0], result[1][1], result[2][2]], // Diagonal top-left to bottom-right
      [result[0][2], result[1][1], result[2][0]]  // Diagonal bottom-left to top-right
    ];

    let totalWin = 0;
    
    paylines.forEach(line => {
      const symbol = line[0];
      if (symbol in payouts) {
        const symbolPayouts = payouts[symbol as keyof typeof payouts];
        if (line.every(s => s === symbol)) {
          totalWin += symbolPayouts[3] * betAmount;
        } else if (line.slice(0, 2).every(s => s === symbol)) {
          totalWin += symbolPayouts[2] * betAmount;
        }
      }
    });

    return totalWin;
  };

  const spin = async () => {
    if (spinning || balance < betAmount) return;
    
    setSpinning(true);
    setBalance(prev => prev - betAmount);
    
    // Simulate spinning animation
    for (let i = 0; i < 10; i++) {
      setReels([
        [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]],
        [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]],
        [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]]
      ]);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Final result
    const finalReels = [
      [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]],
      [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]],
      [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]]
    ];
    
    setReels(finalReels);
    
    const winAmount = calculateWin(finalReels);
    setLastWin(winAmount);
    if (winAmount > 0) {
      setBalance(prev => prev + winAmount);
      setShowWinCelebration(true);
      onPlay(winAmount);
      setTimeout(() => setShowWinCelebration(false), 4000);
    }
    
    setSpinning(false);
    
    if (autoPlay && spinsRemaining > 1) {
      setSpinsRemaining(prev => prev - 1);
      setTimeout(() => spin(), 1000);
    } else if (spinsRemaining <= 1) {
      setAutoPlay(false);
      setSpinsRemaining(0);
    }
  };

  const startAutoPlay = (spins: number) => {
    setAutoPlay(true);
    setSpinsRemaining(spins);
    spin();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#2a1a3a] to-[#1a0a2a] z-50 flex flex-col">
      {/* Enhanced Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-yellow-400 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-pink-400 rounded-full blur-xl animate-ping"></div>
      </div>

      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-[#1e1e1e] via-[#3a2a4a] to-[#1e1e1e] p-4 flex items-center justify-between shadow-2xl border-b border-purple-500/20">
        <button 
          onClick={onClose} 
          className="text-white text-xl hover:text-purple-400 transition-all duration-300 hover:scale-110 transform"
        >
          ←
        </button>
        <h1 className="text-white font-bold text-lg bg-gradient-to-r from-white via-purple-400 to-white bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="text-yellow-400 text-lg font-bold">₹{balance}</div>
      </div>

      <div className="flex-1 bg-transparent p-4">
        {/* Enhanced Slot Machine */}
        <div className="bg-gradient-to-br from-[#2a2a2a] via-[#3a3a3a] to-[#2a2a2a] rounded-2xl p-6 mb-6 shadow-2xl border border-gray-700">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {reels.map((reel, reelIndex) => (
              <SlotReel
                key={reelIndex}
                symbols={reel}
                isSpinning={spinning}
                reelIndex={reelIndex}
              />
            ))}
          </div>

          {lastWin > 0 && !showWinCelebration && (
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-[#D4AF37] animate-pulse drop-shadow-lg">
                💰 WIN! ₹{lastWin.toLocaleString()} 💰
              </div>
            </div>
          )}

          {/* Paytable */}
          <div className="bg-[#1e1e1e] rounded p-3 mb-4">
            <div className="text-white text-sm mb-2">Paytable (3 symbols)</div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {Object.entries(payouts).map(([symbol, payout]) => (
                <div key={symbol} className="text-white text-center">
                  <div className="text-lg mb-1">{symbol}</div>
                  <div>₹{payout[3] * betAmount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#1e1e1e] rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-white text-sm mb-2 block">Bet Amount</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {[1, 5, 10, 25].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`p-2 rounded text-sm ${
                      betAmount === amount ? 'bg-[#D4AF37] text-black' : 'bg-[#2a2a2a] text-white'
                    }`}
                    disabled={spinning}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Auto Play</label>
              <div className="grid grid-cols-2 gap-2">
                {[10, 25, 50, 100].map((spins) => (
                  <button
                    key={spins}
                    onClick={() => startAutoPlay(spins)}
                    className="bg-[#2a2a2a] text-white p-2 rounded text-sm"
                    disabled={spinning || autoPlay || balance < betAmount}
                  >
                    {spins} spins
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={spin}
              disabled={spinning || balance < betAmount || autoPlay}
              className="flex-1 bg-[#D4AF37] text-black py-3 rounded-lg font-bold disabled:opacity-50"
            >
              {spinning ? 'SPINNING...' : autoPlay ? `AUTO (${spinsRemaining})` : `SPIN ₹${betAmount}`}
            </button>
            
            {autoPlay && (
              <button
                onClick={() => {setAutoPlay(false); setSpinsRemaining(0);}}
                className="bg-red-500 text-white px-4 py-3 rounded-lg font-bold"
              >
                STOP
              </button>
            )}
          </div>
        </div>

        {/* Win Celebration Overlay */}
        {showWinCelebration && (
          <WinCelebration winAmount={lastWin} isJackpot={lastWin >= 1000} />
        )}
      </div>
    </div>
  );
}

export function MegaJackpotSlot({ title, onPlay, onClose }: SlotGameProps) {
  const [reels, setReels] = useState([['💎', '⭐', '🔔'], ['💎', '⭐', '🔔'], ['💎', '⭐', '🔔']]);
  const [spinning, setSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(50);
  const [jackpot, setJackpot] = useState(1250000);
  const [lastWin, setLastWin] = useState(0);

  const symbols = ['💎', '⭐', '🔔', '7️⃣', '🍀', '👑', '💰', '🎰'];

  useEffect(() => {
    const timer = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 100));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const spin = async () => {
    if (spinning) return;
    
    setSpinning(true);
    
    // Spinning animation
    for (let i = 0; i < 15; i++) {
      setReels([
        [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]],
        [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]],
        [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]]
      ]);
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    // Final result
    const finalReels = [
      [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]],
      [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]],
      [symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)], symbols[Math.floor(Math.random() * symbols.length)]]
    ];
    
    setReels(finalReels);
    
    // Check for jackpot (very rare)
    const middleLine = [finalReels[0][1], finalReels[1][1], finalReels[2][1]];
    if (middleLine.every(symbol => symbol === '💎')) {
      setLastWin(jackpot);
      onPlay(jackpot);
      setJackpot(500000); // Reset jackpot
    } else {
      // Regular wins
      let winAmount = 0;
      if (middleLine.every(symbol => symbol === middleLine[0])) {
        winAmount = betAmount * 10;
      } else if (middleLine.slice(0, 2).every(symbol => symbol === middleLine[0])) {
        winAmount = betAmount * 2;
      }
      
      setLastWin(winAmount);
      if (winAmount > 0) {
        onPlay(winAmount);
      }
    }
    
    setSpinning(false);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-[#1e1e1e] p-3 flex items-center justify-between">
        <button onClick={onClose} className="text-white text-lg">←</button>
        <h1 className="text-white font-medium">{title}</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 bg-gradient-to-b from-yellow-900 to-yellow-700 p-4">
        {/* Jackpot Display */}
        <div className="text-center mb-4">
          <div className="text-[#D4AF37] text-lg font-bold mb-2">MEGA JACKPOT</div>
          <div className="text-white text-3xl font-bold">₹{jackpot.toLocaleString()}</div>
        </div>

        {/* Slot Machine */}
        <div className="bg-[#2a2a2a] rounded-lg p-4 mb-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {reels.map((reel, reelIndex) => (
              <div key={reelIndex} className="bg-gradient-to-b from-yellow-200 to-yellow-400 rounded p-2">
                {reel.map((symbol, symbolIndex) => (
                  <div key={symbolIndex} className={`text-4xl text-center py-3 ${
                    symbolIndex === 1 ? 'bg-[#D4AF37] rounded shadow-lg' : ''
                  }`}>
                    {symbol}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {lastWin > 0 && (
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-[#D4AF37] animate-pulse">
                {lastWin === jackpot ? 'JACKPOT! ' : 'WIN! '}₹{lastWin.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-[#1e1e1e] rounded-lg p-4">
          <div className="mb-4">
            <label className="text-white text-sm mb-2 block">Bet Amount</label>
            <div className="grid grid-cols-4 gap-2">
              {[50, 100, 250, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`p-2 rounded text-sm ${
                    betAmount === amount ? 'bg-[#D4AF37] text-black' : 'bg-[#2a2a2a] text-white'
                  }`}
                  disabled={spinning}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={spin}
            disabled={spinning}
            className="w-full bg-[#D4AF37] text-black py-4 rounded-lg font-bold text-xl disabled:opacity-50"
          >
            {spinning ? 'SPINNING...' : `SPIN ₹${betAmount}`}
          </button>

          <div className="text-center mt-3 text-white text-xs">
            💎💎💎 on center line wins MEGA JACKPOT!
          </div>
        </div>
      </div>
    </div>
  );
}