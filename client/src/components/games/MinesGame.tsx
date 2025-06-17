import { useState, useEffect } from 'react';
import { Bomb, Gem, Star } from 'lucide-react';

interface MinesGameProps {
  betAmount: number;
  onGameResult: (result: any) => void;
  isPlaying: boolean;
}

export const MinesGame = ({ betAmount, onGameResult, isPlaying }: MinesGameProps) => {
  const [gameBoard, setGameBoard] = useState<Array<{ revealed: boolean; isMine: boolean; hasGem: boolean }>>([]);
  const [mineCount, setMineCount] = useState(3);
  const [revealedSafe, setRevealedSafe] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [hitMine, setHitMine] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);

  const totalTiles = 25;

  useEffect(() => {
    if (isPlaying && !gameStarted) {
      initializeGame();
    }
  }, [isPlaying, gameStarted]);

  const initializeGame = () => {
    const board = Array(totalTiles).fill(null).map(() => ({
      revealed: false,
      isMine: false,
      hasGem: false
    }));

    // Place mines randomly
    const minePositions = new Set<number>();
    while (minePositions.size < mineCount) {
      const pos = Math.floor(Math.random() * totalTiles);
      minePositions.add(pos);
    }

    minePositions.forEach(pos => {
      board[pos].isMine = true;
    });

    // Place gems in safe spots
    board.forEach((tile, index) => {
      if (!tile.isMine) {
        tile.hasGem = true;
      }
    });

    setGameBoard(board);
    setGameStarted(true);
    setGameEnded(false);
    setHitMine(false);
    setRevealedSafe(0);
    setCurrentMultiplier(1.0);
  };

  const revealTile = (index: number) => {
    if (gameEnded || gameBoard[index].revealed) return;

    const newBoard = [...gameBoard];
    newBoard[index].revealed = true;

    if (newBoard[index].isMine) {
      setHitMine(true);
      setGameEnded(true);
      // Reveal all mines
      newBoard.forEach(tile => {
        if (tile.isMine) tile.revealed = true;
      });
      onGameResult({
        isWin: false,
        winAmount: 0,
        multiplier: 0
      });
    } else {
      const newRevealedSafe = revealedSafe + 1;
      setRevealedSafe(newRevealedSafe);
      
      // Calculate multiplier based on revealed safe tiles
      const safeSpots = totalTiles - mineCount;
      const multiplier = 1 + (newRevealedSafe / safeSpots) * 2;
      setCurrentMultiplier(multiplier);

      // Check if all safe tiles are revealed
      if (newRevealedSafe === safeSpots) {
        setGameEnded(true);
        onGameResult({
          isWin: true,
          winAmount: betAmount * multiplier,
          multiplier: multiplier
        });
      }
    }

    setGameBoard(newBoard);
  };

  const cashOut = () => {
    if (!gameEnded && revealedSafe > 0) {
      setGameEnded(true);
      onGameResult({
        isWin: true,
        winAmount: betAmount * currentMultiplier,
        multiplier: currentMultiplier
      });
    }
  };

  const getTileContent = (tile: any, index: number) => {
    if (!tile.revealed) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center cursor-pointer hover:from-slate-500 hover:to-slate-600 transition-all duration-200 shadow-lg">
          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
        </div>
      );
    }

    if (tile.isMine) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center animate-pulse">
          <Bomb className="w-6 h-6 text-white" />
          <div className="absolute inset-0 bg-red-500 rounded-lg opacity-50 animate-ping"></div>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center animate-bounce">
        <Gem className="w-6 h-6 text-white drop-shadow-lg" />
        <div className="absolute inset-0 bg-green-400 rounded-lg opacity-30 animate-pulse"></div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Game Controls */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="text-white text-sm">Mines Count</label>
            <select 
              value={mineCount} 
              onChange={(e) => setMineCount(Number(e.target.value))}
              disabled={gameStarted && !gameEnded}
              className="ml-2 bg-slate-700 text-white rounded px-3 py-1"
            >
              <option value={1}>1 Mine</option>
              <option value={3}>3 Mines</option>
              <option value={5}>5 Mines</option>
              <option value={10}>10 Mines</option>
            </select>
          </div>
          
          {gameStarted && !gameEnded && revealedSafe > 0 && (
            <button
              onClick={cashOut}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-6 rounded-lg animate-pulse"
            >
              Cash Out {currentMultiplier.toFixed(2)}x
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div className="bg-slate-700 rounded p-2">
            <div className="text-slate-400">Bet</div>
            <div className="text-white font-bold">₹{betAmount}</div>
          </div>
          <div className="bg-slate-700 rounded p-2">
            <div className="text-slate-400">Multiplier</div>
            <div className="text-green-500 font-bold">{currentMultiplier.toFixed(2)}x</div>
          </div>
          <div className="bg-slate-700 rounded p-2">
            <div className="text-slate-400">Revealed</div>
            <div className="text-blue-500 font-bold">{revealedSafe}</div>
          </div>
          <div className="bg-slate-700 rounded p-2">
            <div className="text-slate-400">Potential</div>
            <div className="text-yellow-500 font-bold">₹{(betAmount * currentMultiplier).toFixed(0)}</div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4">
        <div className="grid grid-cols-5 gap-2">
          {gameBoard.map((tile, index) => (
            <div
              key={index}
              className="aspect-square relative"
              onClick={() => revealTile(index)}
            >
              {getTileContent(tile, index)}
            </div>
          ))}
        </div>
      </div>

      {/* Game Status */}
      {gameEnded && (
        <div className={`text-center p-4 rounded-lg ${hitMine ? 'bg-red-900/50' : 'bg-green-900/50'}`}>
          <div className={`text-2xl font-bold ${hitMine ? 'text-red-500' : 'text-green-500'}`}>
            {hitMine ? '💥 BOOM! You hit a mine!' : '💎 Success! You found the gems!'}
          </div>
          <div className="text-white mt-2">
            {hitMine ? 'Better luck next time!' : `You won ₹${(betAmount * currentMultiplier).toFixed(0)}!`}
          </div>
        </div>
      )}
    </div>
  );
};