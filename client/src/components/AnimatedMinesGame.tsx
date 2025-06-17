import { useState, useEffect } from 'react';
import { ParticleSystem } from './ParticleSystem';

interface AnimatedMinesGameProps {
  betAmount: number;
  onGameResult: (result: any) => void;
  isPlaying: boolean;
}

interface Tile {
  id: number;
  revealed: boolean;
  isMine: boolean;
  isHighlighted: boolean;
}

export const AnimatedMinesGame = ({ betAmount, onGameResult, isPlaying }: AnimatedMinesGameProps) => {
  const [gameBoard, setGameBoard] = useState<Tile[]>([]);
  const [mineCount, setMineCount] = useState(3);
  const [revealedSafe, setRevealedSafe] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [showParticles, setShowParticles] = useState(false);
  const [animatingTile, setAnimatingTile] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [recentWins, setRecentWins] = useState<number[]>([]);

  const gridSize = 25;
  const safeSpots = gridSize - mineCount;

  useEffect(() => {
    if (isPlaying && !gameStarted) {
      initializeGame();
    }
  }, [isPlaying, mineCount]);

  const initializeGame = () => {
    const minePositions = generateMinePositions();
    const board: Tile[] = Array.from({ length: gridSize }, (_, index) => ({
      id: index,
      revealed: false,
      isMine: minePositions.includes(index),
      isHighlighted: false
    }));
    
    setGameBoard(board);
    setRevealedSafe(0);
    setGameEnded(false);
    setCurrentMultiplier(1.0);
    setGameStarted(true);
  };

  const generateMinePositions = (): number[] => {
    const positions: number[] = [];
    while (positions.length < mineCount) {
      const pos = Math.floor(Math.random() * gridSize);
      if (!positions.includes(pos)) {
        positions.push(pos);
      }
    }
    return positions;
  };

  const calculateMultiplier = (revealed: number): number => {
    if (revealed === 0) return 1.0;
    const base = safeSpots / (safeSpots - revealed + 1);
    return Number((base ** revealed).toFixed(2));
  };

  const revealTile = async (index: number) => {
    if (gameEnded || gameBoard[index].revealed) return;

    setAnimatingTile(index);
    
    // Animation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newBoard = [...gameBoard];
    newBoard[index].revealed = true;
    
    if (newBoard[index].isMine) {
      // Hit a mine - reveal all mines
      newBoard.forEach(tile => {
        if (tile.isMine) {
          tile.revealed = true;
          tile.isHighlighted = true;
        }
      });
      setGameBoard(newBoard);
      setGameEnded(true);
      setAnimatingTile(null);
      
      // Send loss result
      onGameResult({
        betType: 'mines',
        mineCount,
        revealedTiles: [index],
        isWin: false,
        winAmount: 0,
        multiplier: 0
      });
    } else {
      // Safe tile
      const newRevealedSafe = revealedSafe + 1;
      const multiplier = calculateMultiplier(newRevealedSafe);
      
      setRevealedSafe(newRevealedSafe);
      setCurrentMultiplier(multiplier);
      setGameBoard(newBoard);
      setAnimatingTile(null);
      
      // Check if all safe tiles are revealed
      if (newRevealedSafe === safeSpots) {
        setGameEnded(true);
        setShowParticles(true);
        setRecentWins(prev => [multiplier, ...prev.slice(0, 4)]);
        
        onGameResult({
          betType: 'mines',
          mineCount,
          revealedTiles: Array.from({length: newRevealedSafe}, (_, i) => i),
          isWin: true,
          winAmount: betAmount * multiplier,
          multiplier: multiplier
        });
        
        setTimeout(() => setShowParticles(false), 3000);
      }
    }
  };

  const cashOut = () => {
    if (!gameEnded && revealedSafe > 0) {
      setGameEnded(true);
      setShowParticles(true);
      setRecentWins(prev => [currentMultiplier, ...prev.slice(0, 4)]);
      
      onGameResult({
        betType: 'mines',
        mineCount,
        revealedTiles: Array.from({length: revealedSafe}, (_, i) => i),
        isWin: true,
        winAmount: betAmount * currentMultiplier,
        multiplier: currentMultiplier
      });
      
      setTimeout(() => setShowParticles(false), 3000);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameEnded(false);
    setRevealedSafe(0);
    setCurrentMultiplier(1.0);
    setGameBoard([]);
  };

  const getTileContent = (tile: Tile) => {
    if (!tile.revealed) {
      return animatingTile === tile.id ? '💎' : '';
    }
    if (tile.isMine) {
      return '💣';
    }
    return '💎';
  };

  const getTileStyle = (tile: Tile) => {
    let baseClass = "w-12 h-12 border-2 rounded-lg font-bold text-lg flex items-center justify-center transition-all duration-500 transform ";
    
    if (!tile.revealed) {
      baseClass += animatingTile === tile.id 
        ? "bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 scale-110 animate-pulse shadow-lg shadow-yellow-500/50" 
        : "bg-gradient-to-br from-gray-600 to-gray-800 border-gray-500 hover:scale-105 hover:shadow-lg cursor-pointer";
    } else if (tile.isMine) {
      baseClass += tile.isHighlighted 
        ? "bg-gradient-to-br from-red-500 to-red-700 border-red-400 animate-bounce shadow-lg shadow-red-500/50" 
        : "bg-gradient-to-br from-red-600 to-red-800 border-red-500";
    } else {
      baseClass += "bg-gradient-to-br from-green-400 to-green-600 border-green-300 shadow-lg shadow-green-500/50";
    }
    
    return baseClass;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4">
      <ParticleSystem isActive={showParticles} type="coins" />
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-4 animate-pulse">
          💣 MINES 💣
        </h1>
        
        {/* Recent Wins */}
        {recentWins.length > 0 && (
          <div className="bg-black/40 p-4 rounded-lg mb-4">
            <h3 className="text-white text-sm mb-2">Recent Wins:</h3>
            <div className="flex justify-center gap-2">
              {recentWins.map((mult, index) => (
                <div 
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-bold bg-green-500 text-white
                    ${index === 0 ? 'ring-2 ring-yellow-400 scale-110 animate-bounce' : ''}
                  `}
                >
                  {mult.toFixed(2)}x
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mine Count Selection */}
      {!gameStarted && (
        <div className="max-w-md mx-auto mb-6">
          <div className="bg-black/40 p-6 rounded-lg">
            <h3 className="text-white text-xl font-bold text-center mb-4">Select Mine Count</h3>
            <div className="grid grid-cols-4 gap-3">
              {[1, 3, 5, 10, 15, 20, 22, 24].map(count => (
                <button
                  key={count}
                  onClick={() => setMineCount(count)}
                  className={`p-3 rounded-lg font-bold transition-all duration-300 transform
                    ${mineCount === count 
                      ? 'bg-gradient-to-br from-red-500 to-red-700 text-white scale-110 shadow-lg' 
                      : 'bg-gradient-to-br from-gray-600 to-gray-800 text-white hover:scale-105'
                    }`}
                >
                  {count}
                </button>
              ))}
            </div>
            <button
              onClick={initializeGame}
              className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 
                       text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Game Board */}
      {gameStarted && (
        <>
          {/* Game Stats */}
          <div className="max-w-md mx-auto mb-6">
            <div className="bg-black/40 p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-gray-400 text-sm">Mines</div>
                  <div className="text-red-400 text-xl font-bold">{mineCount}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Multiplier</div>
                  <div className="text-yellow-400 text-xl font-bold">{currentMultiplier.toFixed(2)}x</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Potential Win</div>
                  <div className="text-green-400 text-xl font-bold">₹{(betAmount * currentMultiplier).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Grid */}
          <div className="max-w-lg mx-auto mb-6">
            <div className="bg-black/40 p-6 rounded-lg">
              <div className="grid grid-cols-5 gap-2 mb-4">
                {gameBoard.map((tile) => (
                  <button
                    key={tile.id}
                    onClick={() => revealTile(tile.id)}
                    disabled={gameEnded || tile.revealed || animatingTile !== null}
                    className={getTileStyle(tile)}
                  >
                    {getTileContent(tile)}
                  </button>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4">
                {!gameEnded && revealedSafe > 0 && (
                  <button
                    onClick={cashOut}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 
                             text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Cash Out ₹{(betAmount * currentMultiplier).toFixed(2)}
                  </button>
                )}
                
                {gameEnded && (
                  <button
                    onClick={resetGame}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 
                             text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    New Game
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Game Status */}
          <div className="text-center">
            <div className="bg-black/40 p-4 rounded-lg inline-block">
              <div className="text-white">
                {gameEnded ? (
                  revealedSafe === safeSpots ? (
                    <div className="text-green-400 font-bold">🎉 Perfect Game! All safe tiles found!</div>
                  ) : gameBoard.some(t => t.revealed && t.isMine) ? (
                    <div className="text-red-400 font-bold">💥 Boom! You hit a mine!</div>
                  ) : (
                    <div className="text-green-400 font-bold">✅ Cashed out successfully!</div>
                  )
                ) : (
                  <div>
                    {revealedSafe === 0 ? (
                      "Click tiles to reveal them. Avoid the mines!"
                    ) : (
                      `${revealedSafe}/${safeSpots} safe tiles found. Keep going or cash out!`
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};