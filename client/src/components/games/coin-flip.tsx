import { useState, useEffect } from "react";

interface CoinFlipProps {
  title: string;
  onPlay: (betAmount: number) => void;
  onClose: () => void;
}

const EnhancedCoin3D = ({ isFlipping, result, flipCount }: { 
  isFlipping: boolean; 
  result: 'heads' | 'tails' | null; 
  flipCount: number; 
}) => {
  const isHeads = isFlipping ? flipCount % 2 === 0 : result === 'heads';
  
  return (
    <div className="relative flex items-center justify-center perspective-1000">
      {/* Enhanced particle system */}
      {isFlipping && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-80 animate-particle-float"
              style={{
                left: `${50 + (Math.random() - 0.5) * 300}%`,
                top: `${50 + (Math.random() - 0.5) * 300}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1.5 + Math.random() * 2}s`
              }}
            />
          ))}
          {/* Energy rings */}
          {[...Array(3)].map((_, i) => (
            <div
              key={`ring-${i}`}
              className="absolute rounded-full border-2 border-yellow-400 opacity-30 animate-ping"
              style={{
                width: `${120 + i * 40}px`,
                height: `${120 + i * 40}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}
      
      {/* Enhanced 3D coin */}
      <div 
        className={`
          relative w-48 h-48 rounded-full transform-gpu preserve-3d
          transition-all duration-300 
          ${isFlipping ? 'animate-coin-flip' : 'hover:scale-110 hover:rotate-6'}
          ${isHeads ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-500'}
        `}
        style={{
          transform: isFlipping ? `rotateY(${flipCount * 180}deg) rotateX(${Math.sin(flipCount) * 20}deg)` : 'rotateY(0deg)',
          boxShadow: isFlipping 
            ? '0 0 80px rgba(255, 215, 0, 0.8), inset 0 0 40px rgba(255, 255, 255, 0.3), 0 20px 60px rgba(0, 0, 0, 0.5)' 
            : '0 0 50px rgba(255, 215, 0, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.3), 0 15px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Outer rim with detailed styling */}
        <div className="absolute inset-0 rounded-full border-8 border-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 shadow-inner"></div>
        
        {/* Inner coin face */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/20 to-black/20 flex items-center justify-center">
          <div className="relative z-10 text-center transform transition-all duration-300">
            <div className={`text-8xl mb-2 drop-shadow-2xl filter ${isFlipping ? 'blur-sm scale-90' : 'blur-none scale-100'}`}>
              {isHeads ? '👑' : '🦅'}
            </div>
            <div className={`text-lg font-bold text-white drop-shadow-lg ${isFlipping ? 'opacity-50' : 'opacity-100'}`}>
              {isHeads ? 'HEADS' : 'TAILS'}
            </div>
          </div>
        </div>
        
        {/* Multiple glow layers */}
        {isFlipping && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-ping opacity-40"></div>
            <div className="absolute inset-2 rounded-full border-3 border-yellow-300 animate-pulse opacity-50"></div>
            <div className="absolute inset-4 rounded-full border-2 border-white animate-ping opacity-30"></div>
          </>
        )}
        
        {/* Enhanced lighting effects */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/40 via-transparent to-transparent"></div>
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-transparent via-transparent to-black/30"></div>
      </div>
      
      {/* Dynamic ground shadow */}
      <div 
        className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/30 rounded-full blur-lg transition-all duration-300"
        style={{
          width: isFlipping ? '160px' : '120px',
          height: isFlipping ? '20px' : '15px',
        }}
      ></div>
    </div>
  );
};

const WinCelebration = ({ isVisible, winAmount }: { isVisible: boolean; winAmount: number }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 pointer-events-none">
      <div className="text-center">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-particle-float"
            style={{
              left: `${50 + (Math.random() - 0.5) * 100}%`,
              top: `${50 + (Math.random() - 0.5) * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        
        <div className="relative z-10">
          <div className="text-9xl mb-6 animate-bounce">🏆</div>
          <div className="text-7xl font-bold animate-pulse mb-6 text-green-400">
            BIG WIN!
          </div>
          <div className="text-5xl font-bold text-yellow-400">
            ₹{winAmount.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export function CoinFlipGame({ title, onPlay, onClose }: CoinFlipProps) {
  const [gamePhase, setGamePhase] = useState<'betting' | 'flipping' | 'result'>('betting');
  const [betSide, setBetSide] = useState<'heads' | 'tails' | null>(null);
  const [betAmount, setBetAmount] = useState(50);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [flipCount, setFlipCount] = useState(0);
  const [showWinCelebration, setShowWinCelebration] = useState(false);

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
        setShowWinCelebration(true);
        onPlay(prize);
        setTimeout(() => setShowWinCelebration(false), 4000);
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
      <div className="relative flex items-center justify-center">
        {/* Particle effects during flip */}
        {isFlipping && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-[#D4AF37] rounded-full opacity-70 animate-particle-float"
                style={{
                  left: `${50 + (Math.random() - 0.5) * 200}px`,
                  top: `${50 + (Math.random() - 0.5) * 200}px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
        
        {/* Main coin with 3D effect */}
        <div 
          className={`
            relative w-40 h-40 rounded-full border-8 border-[#D4AF37] flex items-center justify-center
            transition-all duration-150 transform-gpu perspective-1000
            ${isFlipping ? 'animate-coin-flip' : 'hover:scale-110 hover:rotate-12'}
            ${isHeads ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-500'}
            shadow-2xl
            before:absolute before:inset-2 before:rounded-full before:bg-gradient-to-tr before:from-white/30 before:to-transparent
            after:absolute after:inset-4 after:rounded-full after:bg-gradient-to-br after:from-transparent after:to-black/20
          `}
          style={{
            boxShadow: isFlipping 
              ? '0 0 60px rgba(212, 175, 55, 0.8), inset 0 4px 20px rgba(255, 255, 255, 0.3)' 
              : '0 0 40px rgba(212, 175, 55, 0.6), inset 0 4px 15px rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.3)',
            transform: isFlipping ? `rotateY(${flipCount * 180}deg)` : 'rotateY(0deg)',
          }}
        >
          {/* Coin face content */}
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-2 drop-shadow-lg filter">
              {isHeads ? '👑' : '🦅'}
            </div>
            <div className="text-sm font-bold text-white drop-shadow-md">
              {isHeads ? 'HEADS' : 'TAILS'}
            </div>
          </div>
          
          {/* Animated ring effects */}
          {isFlipping && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37] animate-ping opacity-40"></div>
              <div className="absolute inset-4 rounded-full border-2 border-yellow-300 animate-pulse opacity-60"></div>
            </>
          )}
        </div>
        
        {/* Glow effect */}
        <div className={`
          absolute inset-0 rounded-full transition-all duration-300
          ${isFlipping ? 'animate-glow-pulse' : ''}
        `} />
        
        {/* Ground shadow */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black/20 rounded-full blur-md"></div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2a] to-[#2a1a0a] z-50 flex flex-col">
      {/* Enhanced Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-16 left-16 w-48 h-48 bg-purple-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-24 right-24 w-36 h-36 bg-yellow-400 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/3 left-1/2 w-28 h-28 bg-blue-400 rounded-full blur-xl animate-ping"></div>
      </div>

      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-[#1e1e1e] via-[#2a2a3a] to-[#1e1e1e] p-4 flex items-center justify-between shadow-2xl border-b border-purple-500/20">
        <button 
          onClick={onClose} 
          className="text-white text-xl hover:text-purple-400 transition-all duration-300 hover:scale-110 transform"
        >
          ←
        </button>
        <h1 className="text-white font-bold text-lg bg-gradient-to-r from-white via-purple-400 to-white bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="text-yellow-400 text-lg font-bold">₹{betAmount}</div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-purple-900/50 p-6 flex flex-col">
        {/* Enhanced Game Status */}
        <div className="text-center mb-8">
          {gamePhase === 'betting' && (
            <div className="text-white text-3xl font-bold win-glow animate-pulse">
              🪙 Choose Heads or Tails 🪙
            </div>
          )}
          {gamePhase === 'flipping' && (
            <div className="text-[#D4AF37] text-3xl font-bold win-glow">
              ✨ Flipping... ✨
            </div>
          )}
          {gamePhase === 'result' && !showWinCelebration && (
            <div className={`text-3xl font-bold ${winAmount > 0 ? 'text-green-400 win-glow' : 'text-red-400'}`}>
              {winAmount > 0 ? `🎉 You Won ₹${winAmount.toFixed(2)}! 🎉` : '💫 Better Luck Next Time! 💫'}
            </div>
          )}
        </div>

        {/* Enhanced 3D Coin */}
        <div className="flex-1 flex items-center justify-center mb-8">
          <EnhancedCoin3D 
            isFlipping={isFlipping} 
            result={result} 
            flipCount={flipCount} 
          />
        </div>

        {/* Betting Options */}
        {gamePhase === 'betting' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => setBetSide('heads')}
                className={`p-6 rounded-2xl border-3 transition-all duration-300 transform ${
                  betSide === 'heads' 
                    ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 border-yellow-300 text-black scale-105 shadow-2xl card-glow' 
                    : 'bg-gradient-to-br from-[#2a2a2a] via-[#3a3a3a] to-[#2a2a2a] border-gray-600 text-white hover:border-yellow-400 hover:scale-105'
                }`}
              >
                <div className="text-5xl mb-3">👑</div>
                <div className="font-bold text-xl mb-2">HEADS</div>
                <div className="text-lg opacity-80">1.95x payout</div>
              </button>
              
              <button
                onClick={() => setBetSide('tails')}
                className={`p-6 rounded-2xl border-3 transition-all duration-300 transform ${
                  betSide === 'tails' 
                    ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 border-yellow-300 text-black scale-105 shadow-2xl card-glow' 
                    : 'bg-gradient-to-br from-[#2a2a2a] via-[#3a3a3a] to-[#2a2a2a] border-gray-600 text-white hover:border-yellow-400 hover:scale-105'
                }`}
              >
                <div className="text-5xl mb-3">🦅</div>
                <div className="font-bold text-xl mb-2">TAILS</div>
                <div className="text-lg opacity-80">1.95x payout</div>
              </button>
            </div>

            {/* Enhanced Bet Amount */}
            <div className="bg-gradient-to-br from-[#1e1e1e] via-[#2a2a2a] to-[#1e1e1e] rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="text-white text-lg mb-4 text-center font-bold">💰 Bet Amount 💰</div>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[10, 50, 100, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`p-3 rounded-xl text-center transition-all duration-300 font-bold ${
                      betAmount === amount 
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#DAA520] text-black shadow-lg transform scale-105 card-glow' 
                        : 'bg-gradient-to-r from-[#2a2a2a] to-[#3a3a3a] text-white hover:from-[#3a3a3a] hover:to-[#4a4a4a] hover:scale-105'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              
              <button
                onClick={flipCoin}
                disabled={!betSide}
                className={`w-full py-4 rounded-xl font-bold text-xl transition-all duration-300 transform ${
                  betSide 
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#DAA520] text-black hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 shadow-lg' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                {betSide ? `🪙 FLIP COIN - ₹${betAmount} 🪙` : 'SELECT HEADS OR TAILS'}
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Result Display */}
        {gamePhase === 'result' && !showWinCelebration && (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-br from-[#1e1e1e] via-[#2a2a2a] to-[#1e1e1e] rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="text-white text-2xl mb-4">
                Result: <span className="text-[#D4AF37] font-bold uppercase win-glow">{result}</span>
              </div>
              <div className="text-white text-2xl mb-4">
                Your choice: <span className="text-[#D4AF37] font-bold uppercase">{betSide}</span>
              </div>
              {winAmount > 0 && (
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl animate-pulse shadow-lg">
                  <div className="text-white text-3xl font-bold mb-2">🎉 Congratulations! 🎉</div>
                  <div className="text-white text-2xl font-bold">You won ₹{winAmount.toFixed(2)}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Win Celebration Overlay */}
        {showWinCelebration && (
          <WinCelebration isVisible={showWinCelebration} winAmount={winAmount} />
        )}
      </div>
    </div>
  );
}