import { useState, useEffect } from "react";

interface DiceRollProps {
  title: string;
  onPlay: (betAmount: number) => void;
  onClose: () => void;
}

export function DiceRollGame({ title, onPlay, onClose }: DiceRollProps) {
  const [gamePhase, setGamePhase] = useState<'betting' | 'rolling' | 'result'>('betting');
  const [selectedBet, setSelectedBet] = useState<'big' | 'small' | 'specific' | null>(null);
  const [specificNumber, setSpecificNumber] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [diceResults, setDiceResults] = useState<number[]>([1, 1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [rollAnimation, setRollAnimation] = useState(0);

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
        onPlay(prize);
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
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-[#1e1e1e] p-3 flex items-center justify-between">
        <button onClick={onClose} className="text-white text-lg">←</button>
        <h1 className="text-white font-medium">{title}</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 bg-gradient-to-b from-green-900 via-emerald-900 to-green-900 p-4 flex flex-col">
        {/* Game Status */}
        <div className="text-center mb-6">
          {gamePhase === 'betting' && (
            <div className="text-white text-xl font-bold">
              Place Your Bet
            </div>
          )}
          {gamePhase === 'rolling' && (
            <div className="text-[#D4AF37] text-xl font-bold animate-pulse">
              Rolling Dice...
            </div>
          )}
          {gamePhase === 'result' && (
            <div className={`text-xl font-bold ${winAmount > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {winAmount > 0 ? `🎉 You Won ₹${winAmount.toFixed(2)}!` : 'Try Again!'}
            </div>
          )}
        </div>

        {/* Dice Display */}
        <div className="flex-1 flex flex-col items-center justify-center mb-6">
          <div className="flex gap-4 mb-4">
            {diceResults.map((die, index) => (
              <DiceComponent key={index} value={die} index={index} />
            ))}
          </div>
          
          <div className="text-center">
            <div className="text-white text-lg mb-2">
              Total: <span className="text-[#D4AF37] font-bold text-2xl">{total}</span>
            </div>
            <div className="text-white text-sm">
              {total >= 11 ? 'BIG' : 'SMALL'} ({total >= 4 && total <= 10 ? 'Small: 4-10' : 'Big: 11-17'})
            </div>
          </div>
        </div>

        {/* Betting Options */}
        {gamePhase === 'betting' && (
          <div className="space-y-4">
            {/* Big/Small Bets */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {setSelectedBet('big'); setSpecificNumber(null);}}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  selectedBet === 'big' 
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-black scale-105' 
                    : 'bg-[#2a2a2a] border-gray-600 text-white hover:border-[#D4AF37]'
                }`}
              >
                <div className="text-2xl mb-2">🔺</div>
                <div className="font-bold">BIG</div>
                <div className="text-sm opacity-80">11-17 (1.95x)</div>
              </button>
              
              <button
                onClick={() => {setSelectedBet('small'); setSpecificNumber(null);}}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  selectedBet === 'small' 
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-black scale-105' 
                    : 'bg-[#2a2a2a] border-gray-600 text-white hover:border-[#D4AF37]'
                }`}
              >
                <div className="text-2xl mb-2">🔻</div>
                <div className="font-bold">SMALL</div>
                <div className="text-sm opacity-80">4-10 (1.95x)</div>
              </button>
            </div>

            {/* Specific Number Bets */}
            <div className="bg-[#1e1e1e] rounded-lg p-4">
              <div className="text-white text-sm mb-3 text-center">Specific Number (3x per match)</div>
              <div className="grid grid-cols-6 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => {setSelectedBet('specific'); setSpecificNumber(num);}}
                    className={`p-3 rounded border-2 transition-all duration-200 ${
                      selectedBet === 'specific' && specificNumber === num
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-black scale-105' 
                        : 'bg-[#2a2a2a] border-gray-600 text-white hover:border-[#D4AF37]'
                    }`}
                  >
                    <DiceComponent value={num} index={0} />
                  </button>
                ))}
              </div>
            </div>

            {/* Bet Amount */}
            <div className="bg-[#1e1e1e] rounded-lg p-4">
              <div className="text-white text-sm mb-3 text-center">Bet Amount</div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[50, 100, 250, 500].map((amount) => (
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
                onClick={rollDice}
                disabled={!selectedBet}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                  selectedBet 
                    ? 'bg-[#D4AF37] text-black hover:bg-yellow-500 transform hover:scale-105' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {selectedBet ? `ROLL DICE - ₹${betAmount}` : 'SELECT YOUR BET'}
              </button>
            </div>
          </div>
        )}

        {/* Result Display */}
        {gamePhase === 'result' && (
          <div className="text-center space-y-4">
            <div className="text-white text-lg">
              Your bet: <span className="text-[#D4AF37] font-bold">
                {selectedBet === 'specific' ? `Number ${specificNumber}` : selectedBet?.toUpperCase()}
              </span>
            </div>
            <div className="text-white text-lg">
              Result: <span className="text-[#D4AF37] font-bold">{total} ({total >= 11 ? 'BIG' : 'SMALL'})</span>
            </div>
            {winAmount > 0 && (
              <div className="bg-green-600 p-4 rounded-lg animate-pulse">
                <div className="text-white text-xl font-bold">Winner!</div>
                <div className="text-white text-lg">You won ₹{winAmount.toFixed(2)}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}