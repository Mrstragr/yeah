import { useState, useEffect } from "react";

interface CoinFlipProps {
  title: string;
  onPlay: (betAmount: number) => void;
  onClose: () => void;
}

export function CoinFlipGame({ title, onPlay, onClose }: CoinFlipProps) {
  const [gamePhase, setGamePhase] = useState<'betting' | 'flipping' | 'result'>('betting');
  const [betSide, setBetSide] = useState<'heads' | 'tails' | null>(null);
  const [betAmount, setBetAmount] = useState(50);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [flipCount, setFlipCount] = useState(0);

  const flipCoin = async () => {
    if (!betSide) return;
    
    setGamePhase('flipping');
    setIsFlipping(true);
    setFlipCount(0);
    
    // Animate flipping
    const flipInterval = setInterval(() => {
      setFlipCount(prev => prev + 1);
    }, 100);
    
    // Flip for 3 seconds
    setTimeout(() => {
      clearInterval(flipInterval);
      const coinResult: 'heads' | 'tails' = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(coinResult);
      setIsFlipping(false);
      
      // Check win
      if (coinResult === betSide) {
        const prize = betAmount * 1.95; // 95% payout
        setWinAmount(prize);
        onPlay(prize);
      } else {
        setWinAmount(0);
      }
      
      setGamePhase('result');
      
      // Reset after 4 seconds
      setTimeout(() => {
        resetGame();
      }, 4000);
    }, 3000);
  };

  const resetGame = () => {
    setGamePhase('betting');
    setBetSide(null);
    setResult(null);
    setIsFlipping(false);
    setWinAmount(0);
    setFlipCount(0);
  };

  const CoinComponent = () => {
    const isHeads = isFlipping ? flipCount % 2 === 0 : result === 'heads';
    
    return (
      <div className="relative">
        <div 
          className={`
            w-32 h-32 rounded-full border-4 border-[#D4AF37] flex items-center justify-center
            transition-all duration-100 transform
            ${isFlipping ? 'animate-spin' : 'hover:scale-105'}
            ${isHeads ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-gray-300 to-gray-500'}
            shadow-2xl
          `}
          style={{
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)',
          }}
        >
          <div className="text-4xl font-bold text-white">
            {isHeads ? '👑' : '🦅'}
          </div>
        </div>
        
        {isFlipping && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-36 border-4 border-[#D4AF37] rounded-full animate-ping opacity-30"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-[#1e1e1e] p-3 flex items-center justify-between">
        <button onClick={onClose} className="text-white text-lg">←</button>
        <h1 className="text-white font-medium">{title}</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 bg-gradient-to-b from-purple-900 via-blue-900 to-purple-900 p-4 flex flex-col">
        {/* Game Status */}
        <div className="text-center mb-6">
          {gamePhase === 'betting' && (
            <div className="text-white text-xl font-bold animate-pulse">
              Choose Heads or Tails
            </div>
          )}
          {gamePhase === 'flipping' && (
            <div className="text-[#D4AF37] text-xl font-bold">
              Flipping...
            </div>
          )}
          {gamePhase === 'result' && (
            <div className={`text-xl font-bold ${winAmount > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {winAmount > 0 ? `🎉 You Won ₹${winAmount.toFixed(2)}!` : 'Better Luck Next Time!'}
            </div>
          )}
        </div>

        {/* Coin */}
        <div className="flex-1 flex items-center justify-center mb-6">
          <CoinComponent />
        </div>

        {/* Betting Options */}
        {gamePhase === 'betting' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setBetSide('heads')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  betSide === 'heads' 
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-black scale-105' 
                    : 'bg-[#2a2a2a] border-gray-600 text-white hover:border-[#D4AF37]'
                }`}
              >
                <div className="text-3xl mb-2">👑</div>
                <div className="font-bold">HEADS</div>
                <div className="text-sm opacity-80">1.95x payout</div>
              </button>
              
              <button
                onClick={() => setBetSide('tails')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  betSide === 'tails' 
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-black scale-105' 
                    : 'bg-[#2a2a2a] border-gray-600 text-white hover:border-[#D4AF37]'
                }`}
              >
                <div className="text-3xl mb-2">🦅</div>
                <div className="font-bold">TAILS</div>
                <div className="text-sm opacity-80">1.95x payout</div>
              </button>
            </div>

            {/* Bet Amount */}
            <div className="bg-[#1e1e1e] rounded-lg p-4">
              <div className="text-white text-sm mb-3 text-center">Bet Amount</div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[10, 50, 100, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`p-2 rounded text-center transition-all duration-200 ${
                      betAmount === amount 
                        ? 'bg-[#D4AF37] text-black scale-105' 
                        : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              
              <button
                onClick={flipCoin}
                disabled={!betSide}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                  betSide 
                    ? 'bg-[#D4AF37] text-black hover:bg-yellow-500 transform hover:scale-105' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {betSide ? `FLIP COIN - ₹${betAmount}` : 'SELECT HEADS OR TAILS'}
              </button>
            </div>
          </div>
        )}

        {/* Result Display */}
        {gamePhase === 'result' && (
          <div className="text-center space-y-4">
            <div className="text-white text-lg">
              Result: <span className="text-[#D4AF37] font-bold uppercase">{result}</span>
            </div>
            <div className="text-white text-lg">
              Your choice: <span className="text-[#D4AF37] font-bold uppercase">{betSide}</span>
            </div>
            {winAmount > 0 && (
              <div className="bg-green-600 p-4 rounded-lg animate-pulse">
                <div className="text-white text-xl font-bold">Congratulations!</div>
                <div className="text-white text-lg">You won ₹{winAmount.toFixed(2)}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}