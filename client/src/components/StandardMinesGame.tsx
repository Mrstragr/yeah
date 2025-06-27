import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface StandardMinesGameProps {
  onClose: () => void;
  refreshBalance: () => Promise<void>;
}

export const StandardMinesGame = ({ onClose, refreshBalance }: StandardMinesGameProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [mineCount, setMineCount] = useState(3);
  const [gameActive, setGameActive] = useState(false);
  const [revealedTiles, setRevealedTiles] = useState<number[]>([]);
  const [minePositions, setMinePositions] = useState<number[]>([]);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { toast } = useToast();

  const totalTiles = 25;

  const startGame = async () => {
    if (betAmount < 1) {
      toast({
        title: 'Invalid Bet',
        description: 'Minimum bet amount is ₹1',
        variant: 'destructive',
      });
      return;
    }

    setGameActive(true);
    setRevealedTiles([]);
    setMinePositions([]);
    setCurrentMultiplier(1);
    setGameResult(null);

    // Generate random mine positions for demo
    const mines = [];
    while (mines.length < mineCount) {
      const pos = Math.floor(Math.random() * totalTiles);
      if (!mines.includes(pos)) {
        mines.push(pos);
      }
    }
    setMinePositions(mines);
  };

  const revealTile = async (tileIndex: number) => {
    if (!gameActive || revealedTiles.includes(tileIndex) || isPlaying) return;

    setIsPlaying(true);

    // Check if it's a mine
    if (minePositions.includes(tileIndex)) {
      // Hit a mine - game over
      setGameActive(false);
      setRevealedTiles([...revealedTiles, tileIndex]);
      
      try {
        const response = await apiRequest('POST', '/api/games/mines/play', {
          betAmount,
          mineCount,
          revealedTiles: [...revealedTiles, tileIndex]
        });

        const result = await response.json();
        setGameResult(result);
        
        toast({
          title: 'Game Over!',
          description: `You hit a mine and lost ₹${betAmount}`,
          variant: 'destructive',
        });

        await refreshBalance();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to process game',
          variant: 'destructive',
        });
      }
    } else {
      // Safe tile
      const newRevealed = [...revealedTiles, tileIndex];
      setRevealedTiles(newRevealed);
      
      // Calculate multiplier
      const safeCount = newRevealed.length;
      const multiplier = calculateMultiplier(safeCount, mineCount);
      setCurrentMultiplier(multiplier);

      toast({
        title: 'Safe!',
        description: `Current multiplier: ${multiplier.toFixed(2)}x`,
      });
    }

    setIsPlaying(false);
  };

  const cashOut = async () => {
    if (!gameActive || revealedTiles.length === 0) return;

    setIsPlaying(true);
    setGameActive(false);

    try {
      const response = await apiRequest('POST', '/api/games/mines/play', {
        betAmount,
        mineCount,
        revealedTiles
      });

      const result = await response.json();
      setGameResult(result);
      
      const winAmount = betAmount * currentMultiplier;
      toast({
        title: 'Cashed Out!',
        description: `You won ₹${winAmount.toFixed(2)}!`,
      });

      await refreshBalance();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cash out',
        variant: 'destructive',
      });
    } finally {
      setIsPlaying(false);
    }
  };

  const calculateMultiplier = (safeCount: number, mines: number) => {
    const safeTiles = totalTiles - mines;
    let multiplier = 1;
    
    for (let i = 0; i < safeCount; i++) {
      multiplier *= (safeTiles - i) / (totalTiles - mines - i);
    }
    
    return Math.max(1, multiplier * 0.97); // House edge
  };

  const getTileContent = (tileIndex: number) => {
    if (!revealedTiles.includes(tileIndex)) {
      return '?';
    }
    
    if (minePositions.includes(tileIndex)) {
      return '💣';
    }
    
    return '💎';
  };

  const getTileClass = (tileIndex: number) => {
    let className = 'mine-tile';
    
    if (revealedTiles.includes(tileIndex)) {
      if (minePositions.includes(tileIndex)) {
        className += ' mine';
      } else {
        className += ' safe';
      }
    }
    
    return className;
  };

  return (
    <div className="mines-game">
      <div className="game-header">
        <button onClick={onClose} className="back-button">
          ← Back
        </button>
        <h2>Mines</h2>
        <div className="multiplier-display">
          {currentMultiplier.toFixed(2)}x
        </div>
      </div>

      <div className="game-content">
        {/* Game Controls */}
        <div className="controls-section">
          <div className="control-group">
            <label>Bet Amount</label>
            <div className="bet-controls">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min="1"
                max="100000"
                disabled={gameActive}
                className="bet-input"
              />
              <div className="quick-bets">
                {[10, 50, 100, 500].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    disabled={gameActive}
                    className={`quick-bet ${betAmount === amount ? 'active' : ''}`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="control-group">
            <label>Mines Count</label>
            <div className="mines-controls">
              {[1, 3, 5, 7, 10].map(count => (
                <button
                  key={count}
                  onClick={() => setMineCount(count)}
                  disabled={gameActive}
                  className={`mine-count-btn ${mineCount === count ? 'active' : ''}`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="game-board">
          <div className="mines-grid">
            {Array.from({ length: totalTiles }, (_, index) => (
              <button
                key={index}
                className={getTileClass(index)}
                onClick={() => revealTile(index)}
                disabled={!gameActive || revealedTiles.includes(index) || isPlaying}
              >
                {getTileContent(index)}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="actions-section">
          {!gameActive ? (
            <button onClick={startGame} className="start-button">
              Start Game - Bet ₹{betAmount}
            </button>
          ) : (
            <div className="game-actions">
              <button 
                onClick={cashOut} 
                disabled={revealedTiles.length === 0 || isPlaying}
                className="cashout-button"
              >
                Cash Out - ₹{(betAmount * currentMultiplier).toFixed(2)}
              </button>
              <div className="game-stats">
                <span>Revealed: {revealedTiles.length}</span>
                <span>Mines: {mineCount}</span>
                <span>Safe tiles left: {totalTiles - mineCount - revealedTiles.length}</span>
              </div>
            </div>
          )}
        </div>

        {/* Game Result */}
        {gameResult && (
          <div className="result-display">
            <h3>Game Result</h3>
            <div className="result-info">
              <p className={gameResult.isWin ? 'win' : 'lose'}>
                {gameResult.isWin ? 
                  `Won ₹${gameResult.winAmount}` : 
                  `Lost ₹${betAmount}`
                }
              </p>
              <p>Multiplier: {gameResult.multiplier || currentMultiplier.toFixed(2)}x</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .mines-game {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          z-index: 1000;
          overflow-y: auto;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.2);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .back-button {
          background: none;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          padding: 8px;
        }

        .multiplier-display {
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 16px;
        }

        .game-content {
          padding: 20px;
        }

        .controls-section {
          margin-bottom: 30px;
        }

        .control-group {
          margin-bottom: 20px;
        }

        .control-group label {
          display: block;
          margin-bottom: 10px;
          color: #fbbf24;
          font-weight: 500;
        }

        .bet-controls, .mines-controls {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .bet-input {
          padding: 10px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: white;
          font-size: 16px;
          width: 120px;
        }

        .quick-bets, .mines-controls {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .quick-bet, .mine-count-btn {
          padding: 8px 16px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .quick-bet.active, .mine-count-btn.active {
          background: linear-gradient(45deg, #10b981, #059669);
          border-color: #10b981;
        }

        .game-board {
          margin-bottom: 30px;
        }

        .mines-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          max-width: 400px;
          margin: 0 auto;
        }

        .mine-tile {
          aspect-ratio: 1;
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }

        .mine-tile:hover:not(:disabled) {
          background: rgba(255,255,255,0.2);
          transform: scale(1.05);
        }

        .mine-tile:disabled {
          cursor: not-allowed;
        }

        .mine-tile.safe {
          background: linear-gradient(45deg, #10b981, #059669);
          border-color: #10b981;
        }

        .mine-tile.mine {
          background: linear-gradient(45deg, #dc2626, #ef4444);
          border-color: #dc2626;
          animation: explode 0.5s ease-out;
        }

        @keyframes explode {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .actions-section {
          margin-bottom: 20px;
        }

        .start-button, .cashout-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(45deg, #10b981, #059669);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 15px;
        }

        .start-button:hover, .cashout-button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        }

        .cashout-button:disabled {
          background: #374151;
          cursor: not-allowed;
        }

        .game-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255,255,255,0.1);
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
        }

        .result-display {
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .result-display h3 {
          margin-bottom: 15px;
          color: #fbbf24;
        }

        .result-info p {
          margin: 8px 0;
          font-size: 16px;
        }

        .result-info p.win {
          color: #10b981;
          font-weight: bold;
        }

        .result-info p.lose {
          color: #dc2626;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .mines-grid {
            max-width: 300px;
            gap: 6px;
          }

          .mine-tile {
            font-size: 14px;
          }

          .game-stats {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};