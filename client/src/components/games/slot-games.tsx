import { useState, useEffect } from "react";

interface SlotGameProps {
  title: string;
  onPlay: (betAmount: number) => void;
  onClose: () => void;
}

export function SlotMachineGame({ title, onPlay, onClose }: SlotGameProps) {
  const [reels, setReels] = useState([['🍒', '🍋', '🍊'], ['🍒', '🍋', '🍊'], ['🍒', '🍋', '🍊']]);
  const [spinning, setSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [balance, setBalance] = useState(1000);
  const [lastWin, setLastWin] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [spinsRemaining, setSpinsRemaining] = useState(0);

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
      onPlay(winAmount);
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
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-[#1e1e1e] p-3 flex items-center justify-between">
        <button onClick={onClose} className="text-white text-lg">←</button>
        <h1 className="text-white font-medium">{title}</h1>
        <div className="text-white text-sm">₹{balance}</div>
      </div>

      <div className="flex-1 bg-gradient-to-b from-purple-900 to-purple-700 p-4">
        {/* Slot Machine */}
        <div className="bg-[#2a2a2a] rounded-lg p-4 mb-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {reels.map((reel, reelIndex) => (
              <div key={reelIndex} className="bg-white rounded p-2">
                {reel.map((symbol, symbolIndex) => (
                  <div key={symbolIndex} className={`text-3xl text-center py-2 ${
                    symbolIndex === 1 ? 'bg-yellow-200 rounded' : ''
                  }`}>
                    {symbol}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {lastWin > 0 && (
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-[#D4AF37]">
                WIN! ₹{lastWin}
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