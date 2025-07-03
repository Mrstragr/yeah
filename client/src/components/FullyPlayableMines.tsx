import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bomb, Gem, DollarSign, RotateCcw } from 'lucide-react';
import { useSmartBalance } from '../hooks/useSmartBalance';

interface Tile {
  id: number;
  revealed: boolean;
  hasMine: boolean;
  hasGem: boolean;
}

interface GameState {
  tiles: Tile[];
  mineCount: number;
  gemsRevealed: number;
  multiplier: number;
  isGameActive: boolean;
  gameEnded: boolean;
  won: boolean;
  betAmount: number;
}

const FullyPlayableMines: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { balance, updateBalance } = useSmartBalance();
  const [gameState, setGameState] = useState<GameState>({
    tiles: [],
    mineCount: 3,
    gemsRevealed: 0,
    multiplier: 1,
    isGameActive: false,
    gameEnded: false,
    won: false,
    betAmount: 100
  });

  const [selectedMines, setSelectedMines] = useState(3);
  const [betAmount, setBetAmount] = useState(100);

  // Multiplier calculation based on gems revealed and mine count
  const calculateMultiplier = (gemsRevealed: number, mineCount: number): number => {
    if (gemsRevealed === 0) return 1;
    
    const totalTiles = 25;
    const safeTiles = totalTiles - mineCount;
    
    // Calculate multiplier using probability theory
    let multiplier = 1;
    for (let i = 0; i < gemsRevealed; i++) {
      const remaining = safeTiles - i;
      const totalRemaining = totalTiles - i;
      multiplier *= (totalRemaining / remaining) * 0.97; // 3% house edge
    }
    
    return Math.max(multiplier, 1);
  };

  // Initialize game board
  const initializeGame = () => {
    const tiles: Tile[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      revealed: false,
      hasMine: false,
      hasGem: false
    }));

    setGameState({
      tiles,
      mineCount: selectedMines,
      gemsRevealed: 0,
      multiplier: 1,
      isGameActive: false,
      gameEnded: false,
      won: false,
      betAmount: betAmount
    });
  };

  // Start new game
  const startGame = () => {
    const currentBalance = parseFloat(balance);
    if (currentBalance < betAmount) {
      alert('Insufficient balance!');
      return;
    }

    // Deduct bet amount
    updateBalance(betAmount, 'subtract');

    // Initialize tiles
    const tiles: Tile[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      revealed: false,
      hasMine: false,
      hasGem: false
    }));

    // Randomly place mines
    const minePositions = new Set<number>();
    while (minePositions.size < selectedMines) {
      const pos = Math.floor(Math.random() * 25);
      minePositions.add(pos);
    }

    // Set mines and gems
    tiles.forEach((tile, index) => {
      if (minePositions.has(index)) {
        tile.hasMine = true;
      } else {
        tile.hasGem = true;
      }
    });

    setGameState({
      tiles,
      mineCount: selectedMines,
      gemsRevealed: 0,
      multiplier: 1,
      isGameActive: true,
      gameEnded: false,
      won: false,
      betAmount: betAmount
    });
  };

  // Reveal tile
  const revealTile = (tileId: number) => {
    if (!gameState.isGameActive || gameState.gameEnded) return;

    const tile = gameState.tiles.find(t => t.id === tileId);
    if (!tile || tile.revealed) return;

    const newTiles = gameState.tiles.map(t => 
      t.id === tileId ? { ...t, revealed: true } : t
    );

    if (tile.hasMine) {
      // Game over - hit mine
      const finalTiles = newTiles.map(t => ({ ...t, revealed: true }));
      setGameState(prev => ({
        ...prev,
        tiles: finalTiles,
        isGameActive: false,
        gameEnded: true,
        won: false
      }));
    } else {
      // Safe tile - reveal gem
      const newGemsRevealed = gameState.gemsRevealed + 1;
      const newMultiplier = calculateMultiplier(newGemsRevealed, gameState.mineCount);
      
      setGameState(prev => ({
        ...prev,
        tiles: newTiles,
        gemsRevealed: newGemsRevealed,
        multiplier: newMultiplier
      }));

      // Check if all safe tiles are revealed
      const totalSafeTiles = 25 - gameState.mineCount;
      if (newGemsRevealed === totalSafeTiles) {
        // Won the game
        const winAmount = betAmount * newMultiplier;
        updateBalance(winAmount, 'add');
        
        setGameState(prev => ({
          ...prev,
          isGameActive: false,
          gameEnded: true,
          won: true
        }));
      }
    }
  };

  // Cash out
  const cashOut = () => {
    if (!gameState.isGameActive || gameState.gemsRevealed === 0) return;

    const winAmount = gameState.betAmount * gameState.multiplier;
    updateBalance(winAmount, 'add');

    setGameState(prev => ({
      ...prev,
      isGameActive: false,
      gameEnded: true,
      won: true
    }));
  };

  // Reset game
  const resetGame = () => {
    initializeGame();
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const potentialWin = gameState.betAmount * gameState.multiplier;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Mines</h1>
          <p className="text-gray-300">Find the gems, avoid the mines!</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-300">Balance</p>
          <p className="text-xl font-bold text-yellow-400">₹{parseFloat(balance).toFixed(2)}</p>
        </div>
      </div>

      {/* Game Controls */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bet Amount */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Bet Amount</label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              disabled={gameState.isGameActive}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white disabled:opacity-50"
              min="10"
            />
          </div>

          {/* Mine Count */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Mines</label>
            <select
              value={selectedMines}
              onChange={(e) => setSelectedMines(Number(e.target.value))}
              disabled={gameState.isGameActive}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white disabled:opacity-50"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {/* Game Actions */}
          <div className="flex flex-col space-y-2">
            {!gameState.isGameActive && !gameState.gameEnded && (
              <button
                onClick={startGame}
                className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Start Game
              </button>
            )}
            
            {gameState.isGameActive && gameState.gemsRevealed > 0 && (
              <button
                onClick={cashOut}
                className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Cash Out
              </button>
            )}
            
            {gameState.gameEnded && (
              <button
                onClick={resetGame}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Game</span>
              </button>
            )}
          </div>
        </div>

        {/* Game Stats */}
        {gameState.isGameActive && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-300">Gems Found</p>
              <p className="text-xl font-bold text-green-400">{gameState.gemsRevealed}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-300">Multiplier</p>
              <p className="text-xl font-bold text-yellow-400">{gameState.multiplier.toFixed(2)}x</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-300">Potential Win</p>
              <p className="text-xl font-bold text-blue-400">₹{potentialWin.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-300">Mines Left</p>
              <p className="text-xl font-bold text-red-400">{gameState.mineCount}</p>
            </div>
          </div>
        )}
      </div>

      {/* Game Result */}
      <AnimatePresence>
        {gameState.gameEnded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`${gameState.won ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'} rounded-lg p-6 mb-6 text-center text-white`}
          >
            <h2 className="text-2xl font-bold mb-2">
              {gameState.won ? '🎉 Congratulations!' : '💥 Game Over!'}
            </h2>
            <p className="text-lg">
              {gameState.won 
                ? `You won ₹${potentialWin.toFixed(2)}!` 
                : 'You hit a mine! Better luck next time.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Board */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="grid grid-cols-5 gap-2 max-w-lg mx-auto">
          {gameState.tiles.map((tile) => (
            <motion.button
              key={tile.id}
              onClick={() => revealTile(tile.id)}
              disabled={!gameState.isGameActive || tile.revealed}
              className={`
                aspect-square rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all duration-200
                ${tile.revealed 
                  ? tile.hasMine 
                    ? 'bg-red-600 border-red-500 text-white' 
                    : 'bg-green-600 border-green-500 text-white'
                  : 'bg-gray-600 border-gray-500 hover:bg-gray-500 hover:border-gray-400 active:scale-95'
                }
                ${!gameState.isGameActive ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
              `}
              whileHover={gameState.isGameActive && !tile.revealed ? { scale: 1.05 } : {}}
              whileTap={gameState.isGameActive && !tile.revealed ? { scale: 0.95 } : {}}
            >
              {tile.revealed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  {tile.hasMine ? <Bomb className="w-6 h-6" /> : <Gem className="w-6 h-6" />}
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 rounded-lg p-4 mt-6">
        <h3 className="text-lg font-semibold mb-2">How to Play</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Choose your bet amount and number of mines</li>
          <li>• Click tiles to reveal gems and avoid mines</li>
          <li>• Each gem increases your multiplier</li>
          <li>• Cash out anytime to secure your winnings</li>
          <li>• Hit a mine and lose everything!</li>
        </ul>
      </div>
    </div>
  );
};

export default FullyPlayableMines;