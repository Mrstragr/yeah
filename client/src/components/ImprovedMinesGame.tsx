import { useState, useEffect } from 'react';
import { Bomb, Gem, RotateCcw, Target } from 'lucide-react';

interface ImprovedMinesGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const ImprovedMinesGame = ({ onClose, refreshBalance }: ImprovedMinesGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [mineCount, setMineCount] = useState(3);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'finished'>('betting');
  const [revealedTiles, setRevealedTiles] = useState<Set<number>>(new Set());
  const [minePositions, setMinePositions] = useState<Set<number>>(new Set());
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [gameResult, setGameResult] = useState<any>(null);
  const [hitMine, setHitMine] = useState(false);

  const BOARD_SIZE = 25; // 5x5 grid
  const tiles = Array.from({ length: BOARD_SIZE }, (_, i) => i);

  const multiplierTable = {
    1: [1.01, 1.03, 1.06, 1.10, 1.15, 1.20, 1.27, 1.35, 1.44, 1.55],
    3: [1.16, 1.37, 1.65, 2.00, 2.47, 3.09, 3.95, 5.17, 6.88, 9.44],
    5: [1.29, 1.71, 2.35, 3.35, 4.95, 7.59, 12.14, 20.56, 37.00, 71.11],
    10: [2.18, 4.12, 8.59, 19.8, 49.5, 138.6, 462.0, 1848.0, 9240.0, 61600.0]
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const gemsRevealed = revealedTiles.size;
      const multipliers = multiplierTable[mineCount as keyof typeof multiplierTable] || multiplierTable[3];
      setCurrentMultiplier(multipliers[Math.min(gemsRevealed, multipliers.length - 1)] || 1.0);
    }
  }, [revealedTiles, mineCount, gameState]);

  const startGame = () => {
    // Generate random mine positions
    const mines = new Set<number>();
    while (mines.size < mineCount) {
      mines.add(Math.floor(Math.random() * BOARD_SIZE));
    }
    
    setMinePositions(mines);
    setRevealedTiles(new Set());
    setGameState('playing');
    setGameResult(null);
    setHitMine(false);
    setCurrentMultiplier(1.0);
  };

  const revealTile = (tileIndex: number) => {
    if (gameState !== 'playing' || revealedTiles.has(tileIndex)) return;

    const newRevealed = new Set(revealedTiles);
    newRevealed.add(tileIndex);
    setRevealedTiles(newRevealed);

    if (minePositions.has(tileIndex)) {
      // Hit a mine!
      setHitMine(true);
      setGameState('finished');
      setGameResult({
        isWin: false,
        winAmount: 0,
        gemsFound: newRevealed.size - 1,
        hitMine: true
      });
    } else {
      // Found a gem!
      const gemsFound = newRevealed.size;
      const maxPossibleGems = BOARD_SIZE - mineCount;
      
      if (gemsFound === maxPossibleGems) {
        // All gems found!
        cashOut();
      }
    }
  };

  const cashOut = async () => {
    if (gameState !== 'playing') return;

    const winAmount = Math.floor(betAmount * currentMultiplier);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/games/mines/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          betAmount,
          mineCount,
          revealedTiles: Array.from(revealedTiles)
        })
      });

      if (response.ok) {
        const result = await response.json();
        setGameResult({
          ...result,
          isWin: true,
          winAmount,
          gemsFound: revealedTiles.size
        });
        refreshBalance();
      }
    } catch (error) {
      console.error('Cash out error:', error);
    }

    setGameState('finished');
  };

  const resetGame = () => {
    setGameState('betting');
    setRevealedTiles(new Set());
    setMinePositions(new Set());
    setGameResult(null);
    setHitMine(false);
    setCurrentMultiplier(1.0);
  };

  const getTileContent = (tileIndex: number) => {
    if (!revealedTiles.has(tileIndex)) {
      return gameState === 'finished' && minePositions.has(tileIndex) ? (
        <Bomb className="text-red-500" size={24} />
      ) : '?';
    }

    return minePositions.has(tileIndex) ? (
      <Bomb className="text-red-500" size={24} />
    ) : (
      <Gem className="text-green-400" size={24} />
    );
  };

  const getTileClass = (tileIndex: number) => {
    if (!revealedTiles.has(tileIndex)) {
      if (gameState === 'finished' && minePositions.has(tileIndex)) {
        return 'bg-red-600 border-red-400';
      }
      return gameState === 'playing' 
        ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 cursor-pointer' 
        : 'bg-gray-700 border-gray-600';
    }

    return minePositions.has(tileIndex) 
      ? 'bg-red-600 border-red-400' 
      : 'bg-green-600 border-green-400';
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Mines</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-6 max-w-lg mx-auto">
        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-3 rounded-lg text-center">
            <div className="text-white font-bold text-lg">{currentMultiplier.toFixed(2)}x</div>
            <div className="text-blue-100 text-sm">Multiplier</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-3 rounded-lg text-center">
            <div className="text-white font-bold text-lg">{revealedTiles.size}</div>
            <div className="text-green-100 text-sm">Gems Found</div>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-3 rounded-lg text-center">
            <div className="text-white font-bold text-lg">{mineCount}</div>
            <div className="text-red-100 text-sm">Mines</div>
          </div>
        </div>

        {/* Betting Interface */}
        {gameState === 'betting' && (
          <div className="space-y-4 mb-6">
            {/* Bet Amount */}
            <div>
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
              />
            </div>

            {/* Mine Count */}
            <div>
              <h3 className="text-white text-lg mb-3 font-bold">Number of Mines</h3>
              <div className="grid grid-cols-4 gap-2">
                {[1, 3, 5, 10].map(count => (
                  <button
                    key={count}
                    onClick={() => setMineCount(count)}
                    className={`py-3 rounded-lg font-bold transition-all ${
                      mineCount === count
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full py-4 rounded-xl font-bold text-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105 transition-all transform shadow-lg"
            >
              START GAME
            </button>
          </div>
        )}

        {/* Game Board */}
        <div className="mb-6">
          <div className="grid grid-cols-5 gap-2 bg-gray-800 p-4 rounded-xl">
            {tiles.map(tileIndex => (
              <button
                key={tileIndex}
                onClick={() => revealTile(tileIndex)}
                className={`aspect-square border-2 rounded-lg flex items-center justify-center text-xl font-bold transition-all transform hover:scale-105 ${getTileClass(tileIndex)}`}
                disabled={gameState !== 'playing' || revealedTiles.has(tileIndex)}
              >
                {getTileContent(tileIndex)}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {gameState === 'playing' && (
          <div className="space-y-3 mb-6">
            <button
              onClick={cashOut}
              disabled={revealedTiles.size === 0}
              className={`w-full py-4 rounded-xl font-bold text-xl transition-all transform ${
                revealedTiles.size === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:scale-105 shadow-lg animate-pulse'
              }`}
            >
              CASH OUT ₹{Math.floor(betAmount * currentMultiplier)}
            </button>
          </div>
        )}

        {gameState === 'finished' && (
          <button
            onClick={resetGame}
            className="w-full py-4 rounded-xl font-bold text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 transition-all transform shadow-lg flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            PLAY AGAIN
          </button>
        )}

        {/* Game Result */}
        {gameResult && (
          <div className={`mt-6 p-6 rounded-xl ${
            gameResult.isWin 
              ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500' 
              : 'bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500'
          }`}>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-3 ${
                gameResult.isWin ? 'text-green-400' : 'text-red-400'
              }`}>
                {gameResult.isWin ? '💎 GEMS COLLECTED!' : '💥 MINE HIT!'}
              </div>
              <div className="text-white text-xl mb-2">
                Gems Found: <span className="font-bold text-green-400">{gameResult.gemsFound}</span>
              </div>
              <div className="text-white text-lg">
                {gameResult.isWin ? `+₹${gameResult.winAmount}` : `-₹${betAmount}`}
              </div>
              {gameResult.isWin && (
                <div className="text-gray-300 text-sm mt-1">
                  Multiplier: {currentMultiplier.toFixed(2)}x
                </div>
              )}
            </div>
          </div>
        )}

        {/* Strategy Guide */}
        <div className="mt-6 p-4 bg-green-900/30 rounded-lg">
          <h4 className="text-white font-bold mb-2 flex items-center gap-2">
            <Target size={16} />
            Strategy Tips
          </h4>
          <ul className="text-green-200 text-sm space-y-1">
            <li>• More mines = higher multipliers but more risk</li>
            <li>• Cash out early for safer profits</li>
            <li>• Each gem increases your multiplier</li>
            <li>• One mine ends the game instantly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};