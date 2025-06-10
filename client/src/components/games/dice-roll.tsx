import { useState, useEffect } from "react";

interface DiceRollProps {
  title: string;
  onPlay: (betAmount: number) => void;
  onClose: () => void;
}

const Enhanced3DDice = ({ value, index, isRolling, rollAnimation }: { 
  value: number; 
  index: number; 
  isRolling: boolean; 
  rollAnimation: number; 
}) => {
  const dots = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]]
  };

  return (
    <div className="relative perspective-1000">
      {/* Enhanced particle system */}
      {isRolling && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-80 animate-particle-float"
              style={{
                left: `${Math.random() * 80}px`,
                top: `${Math.random() * 80}px`,
                animationDelay: `${Math.random() * 1.5}s`,
                animationDuration: `${1 + Math.random() * 1.5}s`
              }}
            />
          ))}
          {/* Energy rings */}
          {[...Array(2)].map((_, i) => (
            <div
              key={`ring-${i}`}
              className="absolute rounded-2xl border-2 border-green-400 opacity-40 animate-ping"
              style={{
                width: `${90 + i * 20}px`,
                height: `${90 + i * 20}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
      )}
      
      {/* Enhanced 3D dice */}
      <div 
        className={`
          relative w-24 h-24 rounded-2xl transform-gpu preserve-3d
          transition-all duration-300 
          ${isRolling ? 'animate-dice-roll' : 'hover:scale-110 hover:rotate-6'}
          bg-gradient-to-br from-white via-gray-50 to-gray-200
          border-4 border-gray-300 shadow-2xl
        `}
        style={{
          animationDelay: `${index * 200}ms`,
          transform: isRolling ? 
            `rotate3d(${Math.sin(rollAnimation * 0.5)}, ${Math.cos(rollAnimation * 0.5)}, 1, ${rollAnimation * 60}deg) scale(1.15)` : 
            'rotate3d(0, 0, 1, 0deg) scale(1)',
          boxShadow: isRolling 
            ? '0 0 40px rgba(34, 197, 94, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.4), 0 15px 50px rgba(0, 0, 0, 0.5)' 
            : '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 3px 10px rgba(255, 255, 255, 0.6)'
        }}
      >
        {/* Multiple lighting layers */}
        <div className="absolute inset-1 rounded-xl bg-gradient-to-tr from-white/50 via-transparent to-transparent"></div>
        <div className="absolute inset-4 rounded-lg bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
        
        {/* Dice face grid */}
        <div className="absolute inset-3 grid grid-cols-3 gap-1">
          {Array.from({ length: 9 }, (_, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const shouldShowDot = dots[value as keyof typeof dots]?.some(([r, c]) => r === row && c === col);
            
            return (
              <div
                key={i}
                className={`
                  relative w-4 h-4 rounded-full transition-all duration-300 z-10
                  ${shouldShowDot ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-inner' : 'bg-transparent'}
                  ${shouldShowDot && isRolling ? 'animate-pulse scale-125 shadow-2xl' : ''}
                `}
                style={{
                  boxShadow: shouldShowDot ? 'inset 0 3px 6px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.3)' : 'none'
                }}
              />
            );
          })}
        </div>
        
        {/* Multiple glow layers when rolling */}
        {isRolling && (
          <>
            <div className="absolute inset-0 rounded-2xl border-3 border-green-400 animate-ping opacity-50"></div>
            <div className="absolute inset-1 rounded-xl border-2 border-emerald-300 animate-pulse opacity-40"></div>
            <div className="absolute inset-2 rounded-lg border border-white animate-ping opacity-30"></div>
          </>
        )}
      </div>
      
      {/* Dynamic ground shadow */}
      <div 
        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-black/30 rounded-full blur-lg transition-all duration-300"
        style={{
          width: isRolling ? '80px' : '60px',
          height: isRolling ? '12px' : '8px',
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
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-particle-float"
            style={{
              left: `${50 + (Math.random() - 0.5) * 100}%`,
              top: `${50 + (Math.random() - 0.5) * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        
        <div className="relative z-10">
          <div className="text-9xl mb-6 animate-bounce">🎲</div>
          <div className="text-7xl font-bold animate-pulse mb-6 text-green-400">
            JACKPOT!
          </div>
          <div className="text-5xl font-bold text-yellow-400">
            ₹{winAmount.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export function DiceRollGame({ title, onPlay, onClose }: DiceRollProps) {
  const [gamePhase, setGamePhase] = useState<'betting' | 'rolling' | 'result'>('betting');
  const [selectedBet, setSelectedBet] = useState<'big' | 'small' | 'specific' | null>(null);
  const [specificNumber, setSpecificNumber] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [diceResults, setDiceResults] = useState<number[]>([1, 1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [rollAnimation, setRollAnimation] = useState(0);
  const [showWinCelebration, setShowWinCelebration] = useState(false);

  const rollDice = async () => {
    if (!selectedBet) return;
    
    setGamePhase('rolling');
    setIsRolling(true);
    setRollAnimation(0);
    
    // Animate rolling for 3 seconds
    const rollInterval = setInterval(() => {
      setDiceResults([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
      setRollAnimation(prev => prev + 1);
    }, 100);
    
    setTimeout(() => {
      clearInterval(rollInterval);
      
      // Final result
      const finalResults = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ];
      
      setDiceResults(finalResults);
      setIsRolling(false);
      
      // Calculate win
      const total = finalResults.reduce((sum, die) => sum + die, 0);
      let prize = 0;
      
      if (selectedBet === 'big' && total >= 11) {
        prize = betAmount * 1.95;
      } else if (selectedBet === 'small' && total <= 10) {
        prize = betAmount * 1.95;
      } else if (selectedBet === 'specific' && specificNumber && finalResults.includes(specificNumber)) {
        const count = finalResults.filter(die => die === specificNumber).length;
        prize = betAmount * count * 3;
      }
      
      setWinAmount(prize);
      if (prize > 0) {
        setShowWinCelebration(true);
        onPlay(prize);
        setTimeout(() => setShowWinCelebration(false), 4000);
      }
      
      setGamePhase('result');
      
      setTimeout(() => {
        resetGame();
      }, 5000);
    }, 3000);
  };

  const resetGame = () => {
    setGamePhase('betting');
    setSelectedBet(null);
    setSpecificNumber(null);
    setDiceResults([1, 1, 1]);
    setIsRolling(false);
    setWinAmount(0);
    setRollAnimation(0);
  };

  const DiceComponent = ({ value, index }: { value: number; index: number }) => {
    const dots = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [0, 2], [2, 0], [2, 2]],
      5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
      6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]]
    };

    return (
      <div className="relative">
        {/* Particle effects during roll */}
        {isRolling && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-particle-float"
                style={{
                  left: `${Math.random() * 60}px`,
                  top: `${Math.random() * 60}px`,
                  animationDelay: `${Math.random() * 1}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}
        
        <div 
          className={`
            relative w-20 h-20 rounded-2xl shadow-2xl
            grid grid-cols-3 gap-1 p-3 transition-all duration-150 transform-gpu perspective-1000
            ${isRolling ? 'animate-dice-roll' : 'hover:scale-110 hover:rotate-6'}
            bg-gradient-to-br from-white via-gray-50 to-gray-200
            border-4 border-gray-300
            before:absolute before:inset-1 before:rounded-xl before:bg-gradient-to-tr before:from-white/40 before:to-transparent
            after:absolute after:inset-2 after:rounded-lg after:bg-gradient-to-br after:from-transparent after:to-black/10
          `}
          style={{
            animationDelay: `${index * 150}ms`,
            transform: isRolling ? 
              `rotate3d(${Math.sin(rollAnimation)}, ${Math.cos(rollAnimation)}, 1, ${rollAnimation * 45}deg) scale(1.1)` : 
              'rotate3d(0, 0, 1, 0deg) scale(1)',
            boxShadow: isRolling 
              ? '0 0 30px rgba(255, 255, 255, 0.8), 0 10px 40px rgba(0, 0, 0, 0.4)' 
              : '0 8px 25px rgba(0, 0, 0, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.6)'
          }}
        >
          {Array.from({ length: 9 }, (_, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const shouldShowDot = dots[value as keyof typeof dots]?.some(([r, c]) => r === row && c === col);
            
            return (
              <div
                key={i}
                className={`
                  relative w-3 h-3 rounded-full transition-all duration-300 z-10
                  ${shouldShowDot ? 'bg-gradient-to-br from-gray-800 to-black shadow-inner' : 'bg-transparent'}
                  ${shouldShowDot && isRolling ? 'animate-pulse scale-110' : ''}
                `}
                style={{
                  boxShadow: shouldShowDot ? 'inset 0 2px 4px rgba(0, 0, 0, 0.6)' : 'none'
                }}
              />
            );
          })}
          
          {/* Glow ring when rolling */}
          {isRolling && (
            <div className="absolute inset-0 rounded-2xl border-2 border-green-400 animate-ping opacity-60"></div>
          )}
        </div>
        
        {/* Ground shadow */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-black/20 rounded-full blur-sm"></div>
      </div>
    );
  };

  const total = diceResults.reduce((sum, die) => sum + die, 0);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a2a1a] to-[#0a2a0a] z-50 flex flex-col">
      {/* Enhanced Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 left-20 w-44 h-44 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-28 right-28 w-36 h-36 bg-emerald-400 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-yellow-400 rounded-full blur-xl animate-ping"></div>
      </div>

      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-[#1e1e1e] via-[#2a3a2a] to-[#1e1e1e] p-4 flex items-center justify-between shadow-2xl border-b border-green-500/20">
        <button 
          onClick={onClose} 
          className="text-white text-xl hover:text-green-400 transition-all duration-300 hover:scale-110 transform"
        >
          ←
        </button>
        <h1 className="text-white font-bold text-lg bg-gradient-to-r from-white via-green-400 to-white bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="text-yellow-400 text-lg font-bold">₹{betAmount}</div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-green-900/50 via-emerald-900/50 to-green-900/50 p-6 flex flex-col">
        {/* Enhanced Game Status */}
        <div className="text-center mb-8">
          {gamePhase === 'betting' && (
            <div className="text-white text-3xl font-bold win-glow animate-pulse">
              🎲 Place Your Bet 🎲
            </div>
          )}
          {gamePhase === 'rolling' && (
            <div className="text-[#D4AF37] text-3xl font-bold win-glow">
              ✨ Rolling Dice... ✨
            </div>
          )}
          {gamePhase === 'result' && !showWinCelebration && (
            <div className={`text-3xl font-bold ${winAmount > 0 ? 'text-green-400 win-glow' : 'text-red-400'}`}>
              {winAmount > 0 ? `🎉 You Won ₹${winAmount.toFixed(2)}! 🎉` : '🎲 Try Again! 🎲'}
            </div>
          )}
        </div>

        {/* Enhanced Dice Display */}
        <div className="flex-1 flex flex-col items-center justify-center mb-8">
          <div className="flex gap-6 mb-6">
            {diceResults.map((die, index) => (
              <Enhanced3DDice 
                key={index} 
                value={die} 
                index={index} 
                isRolling={isRolling}
                rollAnimation={rollAnimation}
              />
            ))}
          </div>
          
          <div className="text-center bg-gradient-to-br from-[#1e1e1e] via-[#2a2a2a] to-[#1e1e1e] rounded-2xl p-6 border border-gray-700 shadow-2xl">
            <div className="text-white text-2xl mb-3">
              Total: <span className="text-[#D4AF37] font-bold text-4xl win-glow">{total}</span>
            </div>
            <div className="text-white text-lg">
              <span className={`font-bold ${total >= 11 ? 'text-orange-400' : 'text-blue-400'}`}>
                {total >= 11 ? '🔺 BIG' : '🔻 SMALL'}
              </span>
              <span className="text-gray-400 ml-2">
                ({total >= 11 ? 'Big: 11-17' : 'Small: 3-10'})
              </span>
            </div>
          </div>
        </div>

        {/* Betting Options */}
        {gamePhase === 'betting' && (
          <div className="space-y-4">
            {/* Enhanced Big/Small Bets */}
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => {setSelectedBet('big'); setSpecificNumber(null);}}
                className={`p-6 rounded-2xl border-3 transition-all duration-300 transform ${
                  selectedBet === 'big' 
                    ? 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 border-orange-300 text-black scale-105 shadow-2xl card-glow' 
                    : 'bg-gradient-to-br from-[#2a2a2a] via-[#3a3a3a] to-[#2a2a2a] border-gray-600 text-white hover:border-orange-400 hover:scale-105'
                }`}
              >
                <div className="text-5xl mb-3">🔺</div>
                <div className="font-bold text-xl mb-2">BIG</div>
                <div className="text-lg opacity-80">11-17 (1.95x)</div>
              </button>
              
              <button
                onClick={() => {setSelectedBet('small'); setSpecificNumber(null);}}
                className={`p-6 rounded-2xl border-3 transition-all duration-300 transform ${
                  selectedBet === 'small' 
                    ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 border-blue-300 text-black scale-105 shadow-2xl card-glow' 
                    : 'bg-gradient-to-br from-[#2a2a2a] via-[#3a3a3a] to-[#2a2a2a] border-gray-600 text-white hover:border-blue-400 hover:scale-105'
                }`}
              >
                <div className="text-5xl mb-3">🔻</div>
                <div className="font-bold text-xl mb-2">SMALL</div>
                <div className="text-lg opacity-80">3-10 (1.95x)</div>
              </button>
            </div>

            {/* Enhanced Specific Number Bets */}
            <div className="bg-gradient-to-br from-[#1e1e1e] via-[#2a2a2a] to-[#1e1e1e] rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="text-white text-lg mb-4 text-center font-bold">🎯 Specific Number (3x per match) 🎯</div>
              <div className="grid grid-cols-6 gap-3 mb-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => {setSelectedBet('specific'); setSpecificNumber(num);}}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 transform ${
                      selectedBet === 'specific' && specificNumber === num
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#DAA520] border-yellow-300 text-black scale-105 shadow-lg card-glow' 
                        : 'bg-gradient-to-r from-[#2a2a2a] to-[#3a3a3a] border-gray-600 text-white hover:border-yellow-400 hover:scale-105'
                    }`}
                  >
                    <Enhanced3DDice value={num} index={0} isRolling={false} rollAnimation={0} />
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Bet Amount */}
            <div className="bg-gradient-to-br from-[#1e1e1e] via-[#2a2a2a] to-[#1e1e1e] rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="text-white text-lg mb-4 text-center font-bold">💰 Bet Amount 💰</div>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[50, 100, 250, 500].map((amount) => (
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
                onClick={rollDice}
                disabled={!selectedBet}
                className={`w-full py-4 rounded-xl font-bold text-xl transition-all duration-300 transform ${
                  selectedBet 
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#DAA520] text-black hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 shadow-lg' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                {selectedBet ? `🎲 ROLL DICE - ₹${betAmount} 🎲` : 'SELECT YOUR BET'}
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Result Display */}
        {gamePhase === 'result' && !showWinCelebration && (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-br from-[#1e1e1e] via-[#2a2a2a] to-[#1e1e1e] rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="text-white text-2xl mb-4">
                Your bet: <span className="text-[#D4AF37] font-bold win-glow">
                  {selectedBet === 'specific' ? `🎯 Number ${specificNumber}` : `${selectedBet === 'big' ? '🔺' : '🔻'} ${selectedBet?.toUpperCase()}`}
                </span>
              </div>
              <div className="text-white text-2xl mb-4">
                Result: <span className="text-[#D4AF37] font-bold win-glow">{total} ({total >= 11 ? '🔺 BIG' : '🔻 SMALL'})</span>
              </div>
              {winAmount > 0 && (
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl animate-pulse shadow-lg">
                  <div className="text-white text-3xl font-bold mb-2">🎉 Winner! 🎉</div>
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