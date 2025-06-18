import { useState, useEffect } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, TrendingUp, RotateCcw } from 'lucide-react';

interface ImprovedDiceGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const ImprovedDiceGame = ({ onClose, refreshBalance }: ImprovedDiceGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [prediction, setPrediction] = useState<'over' | 'under' | null>(null);
  const [targetNumber, setTargetNumber] = useState(50);
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<any>(null);
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [winChance, setWinChance] = useState(50);
  const [payout, setPayout] = useState(1.98);

  useEffect(() => {
    // Calculate win chance and payout based on target number and prediction
    let chance = 0;
    if (prediction === 'over') {
      chance = (100 - targetNumber) / 100;
    } else if (prediction === 'under') {
      chance = targetNumber / 100;
    }
    
    setWinChance(Math.round(chance * 100));
    setPayout(chance > 0 ? parseFloat((0.98 / chance).toFixed(2)) : 1);
  }, [targetNumber, prediction]);

  const getDiceIcon = (number: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const diceValue = Math.ceil(number / 16.67); // Convert 0-100 to 1-6
    const IconComponent = icons[Math.min(diceValue - 1, 5)];
    return <IconComponent size={48} className="text-white" />;
  };

  const rollDice = async () => {
    if (!prediction) {
      alert('Please select Over or Under');
      return;
    }

    setIsRolling(true);
    setGameResult(null);

    // Rolling animation
    const rollDuration = 2000;
    const rollInterval = 100;
    let elapsed = 0;

    const rollAnimation = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 100) + 1);
      elapsed += rollInterval;

      if (elapsed >= rollDuration) {
        clearInterval(rollAnimation);
        submitGame();
      }
    }, rollInterval);
  };

  const submitGame = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/games/dice/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          betAmount,
          prediction,
          targetNumber
        })
      });

      if (response.ok) {
        const result = await response.json();
        const finalResult = result.result?.diceValue || Math.floor(Math.random() * 100) + 1;
        
        setDiceResult(finalResult);
        setGameHistory(prev => [finalResult, ...prev.slice(0, 9)]);
        setGameResult(result);
        refreshBalance();
      }
    } catch (error) {
      console.error('Game error:', error);
      const finalResult = Math.floor(Math.random() * 100) + 1;
      setDiceResult(finalResult);
      setGameHistory(prev => [finalResult, ...prev.slice(0, 9)]);
    }

    setIsRolling(false);
  };

  const resetGame = () => {
    setDiceResult(null);
    setGameResult(null);
    setPrediction(null);
  };

  const getResultColor = (result: number) => {
    if (result <= 33) return 'text-red-400';
    if (result <= 66) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Dice</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        {/* Dice Display */}
        <div className="text-center mb-6">
          <div className="bg-gradient-to-br from-purple-800 to-indigo-800 rounded-xl p-8 mb-4">
            {isRolling ? (
              <div className="animate-spin">
                {getDiceIcon(50)}
              </div>
            ) : diceResult ? (
              <div className="space-y-2">
                {getDiceIcon(diceResult)}
                <div className={`text-4xl font-bold ${getResultColor(diceResult)}`}>
                  {diceResult}
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-4xl">
                🎲
              </div>
            )}
          </div>
          
          {isRolling && (
            <div className="text-white text-lg font-bold animate-pulse">
              Rolling...
            </div>
          )}
        </div>

        {/* Game History */}
        <div className="mb-6">
          <h3 className="text-white text-lg mb-3 font-bold flex items-center gap-2">
            <TrendingUp size={20} />
            Recent Rolls
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {gameHistory.map((result, index) => (
              <div
                key={index}
                className={`min-w-[50px] h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                  result <= 33 ? 'bg-red-600' : result <= 66 ? 'bg-yellow-600' : 'bg-green-600'
                } text-white`}
              >
                {result}
              </div>
            ))}
          </div>
        </div>

        {/* Bet Amount */}
        <div className="mb-6">
          <h3 className="text-white text-lg mb-3 font-bold">Bet Amount</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[100, 500, 1000].map(amount => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`py-3 rounded-lg font-bold transition-all ${
                  betAmount === amount
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                disabled={isRolling}
              >
                ₹{amount}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg text-center text-xl font-bold"
            min="10"
            max="50000"
            disabled={isRolling}
          />
        </div>

        {/* Target Number Slider */}
        <div className="mb-6">
          <h3 className="text-white text-lg mb-3 font-bold">Target Number: {targetNumber}</h3>
          <div className="relative">
            <input
              type="range"
              min="1"
              max="99"
              value={targetNumber}
              onChange={(e) => setTargetNumber(Number(e.target.value))}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              disabled={isRolling}
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>1</span>
              <span>50</span>
              <span>99</span>
            </div>
          </div>
        </div>

        {/* Prediction Buttons */}
        <div className="mb-6">
          <h3 className="text-white text-lg mb-3 font-bold">Prediction</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPrediction('under')}
              className={`py-4 rounded-xl font-bold text-lg transition-all transform ${
                prediction === 'under'
                  ? 'bg-gradient-to-br from-red-600 to-red-800 text-white scale-105 ring-2 ring-yellow-400'
                  : 'bg-gradient-to-br from-red-500 to-red-700 text-white hover:scale-105'
              }`}
              disabled={isRolling}
            >
              <div>UNDER {targetNumber}</div>
              <div className="text-sm opacity-80">{targetNumber}% chance</div>
            </button>
            
            <button
              onClick={() => setPrediction('over')}
              className={`py-4 rounded-xl font-bold text-lg transition-all transform ${
                prediction === 'over'
                  ? 'bg-gradient-to-br from-green-600 to-green-800 text-white scale-105 ring-2 ring-yellow-400'
                  : 'bg-gradient-to-br from-green-500 to-green-700 text-white hover:scale-105'
              }`}
              disabled={isRolling}
            >
              <div>OVER {targetNumber}</div>
              <div className="text-sm opacity-80">{100 - targetNumber}% chance</div>
            </button>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-3 rounded-lg text-center">
            <div className="text-white font-bold text-lg">{winChance}%</div>
            <div className="text-blue-100 text-sm">Win Chance</div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-3 rounded-lg text-center">
            <div className="text-white font-bold text-lg">{payout}x</div>
            <div className="text-purple-100 text-sm">Payout</div>
          </div>
        </div>

        {/* Roll Button */}
        <button
          onClick={rollDice}
          disabled={isRolling || !prediction}
          className={`w-full py-4 rounded-xl font-bold text-xl transition-all transform ${
            isRolling || !prediction
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:scale-105 shadow-lg'
          }`}
        >
          {isRolling ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ROLLING...
            </div>
          ) : (
            `ROLL FOR ₹${betAmount}`
          )}
        </button>

        {/* Reset Button */}
        {gameResult && (
          <button
            onClick={resetGame}
            className="w-full mt-3 py-3 rounded-lg font-bold text-lg bg-gray-700 text-white hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            ROLL AGAIN
          </button>
        )}

        {/* Game Result */}
        {gameResult && !isRolling && (
          <div className={`mt-6 p-6 rounded-xl ${
            gameResult.isWin 
              ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500' 
              : 'bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500'
          }`}>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-3 ${
                gameResult.isWin ? 'text-green-400' : 'text-red-400'
              }`}>
                {gameResult.isWin ? '🎉 YOU WON!' : '😞 YOU LOST'}
              </div>
              <div className="text-white text-xl mb-2">
                Roll: <span className={`font-bold ${getResultColor(diceResult || 0)}`}>
                  {diceResult}
                </span>
              </div>
              <div className="text-white text-lg">
                {gameResult.isWin ? `+₹${gameResult.winAmount}` : `-₹${betAmount}`}
              </div>
              {gameResult.multiplier && (
                <div className="text-gray-300 text-sm mt-1">
                  Multiplier: {gameResult.multiplier}x
                </div>
              )}
            </div>
          </div>
        )}

        {/* Game Rules */}
        <div className="mt-6 p-4 bg-purple-900/30 rounded-lg">
          <h4 className="text-white font-bold mb-2">How to Play</h4>
          <ul className="text-purple-200 text-sm space-y-1">
            <li>• Set your target number (1-99)</li>
            <li>• Choose Over or Under</li>
            <li>• Higher risk = higher payout</li>
            <li>• 50/50 odds give ~2x payout</li>
          </ul>
        </div>
      </div>
    </div>
  );
};