import { useState, useEffect } from 'react';

interface MinesGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const MinesGame = ({ onClose, refreshBalance }: MinesGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [mineCount, setMineCount] = useState(3);
  const [gameBoard, setGameBoard] = useState<Array<{ revealed: boolean; isMine: boolean; index: number }>>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'finished'>('betting');
  const [revealedTiles, setRevealedTiles] = useState<number[]>([]);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [canCashOut, setCanCashOut] = useState(false);
  const [result, setResult] = useState<any>(null);

  const BOARD_SIZE = 25;

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const board = Array.from({ length: BOARD_SIZE }, (_, index) => ({
      revealed: false,
      isMine: false,
      index
    }));
    setGameBoard(board);
  };

  const startGame = () => {
    // Generate random mine positions
    const minePositions = new Set<number>();
    while (minePositions.size < mineCount) {
      minePositions.add(Math.floor(Math.random() * BOARD_SIZE));
    }

    const newBoard = gameBoard.map((tile, index) => ({
      ...tile,
      isMine: minePositions.has(index),
      revealed: false
    }));

    setGameBoard(newBoard);
    setGameState('playing');
    setRevealedTiles([]);
    setCurrentMultiplier(1.0);
    setCanCashOut(false);
    setResult(null);
  };

  const revealTile = (index: number) => {
    if (gameState !== 'playing' || gameBoard[index].revealed) return;

    const tile = gameBoard[index];
    
    if (tile.isMine) {
      // Hit a mine - game over
      const newBoard = gameBoard.map(t => ({ ...t, revealed: true }));
      setGameBoard(newBoard);
      setGameState('finished');
      setResult({
        isWin: false,
        hitMine: true,
        finalMultiplier: 0,
        winAmount: 0
      });
      return;
    }

    // Safe tile revealed
    const newRevealedTiles = [...revealedTiles, index];
    const newBoard = [...gameBoard];
    newBoard[index].revealed = true;
    
    setGameBoard(newBoard);
    setRevealedTiles(newRevealedTiles);
    
    // Calculate multiplier based on revealed tiles and mine count
    const safeTiles = BOARD_SIZE - mineCount;
    const revealedCount = newRevealedTiles.length;
    const multiplier = calculateMultiplier(revealedCount, mineCount);
    
    setCurrentMultiplier(multiplier);
    setCanCashOut(true);
  };

  const calculateMultiplier = (revealed: number, mines: number): number => {
    const safeTiles = BOARD_SIZE - mines;
    const baseMultiplier = 0.97; // House edge
    
    let multiplier = 1;
    for (let i = 0; i < revealed; i++) {
      multiplier *= (safeTiles / (safeTiles - i)) * baseMultiplier;
    }
    
    return Math.round(multiplier * 100) / 100;
  };

  const cashOut = async () => {
    if (!canCashOut || gameState !== 'playing') return;

    try {
      const response = await fetch('/api/games/mines/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo_token_1750315135559'
        },
        body: JSON.stringify({
          betAmount,
          mineCount,
          revealedTiles
        })
      });

      if (response.ok) {
        const data = await response.json();
        const winAmount = Math.floor(betAmount * currentMultiplier);
        
        setResult({
          isWin: true,
          hitMine: false,
          finalMultiplier: currentMultiplier,
          winAmount
        });
        
        setGameState('finished');
        refreshBalance();
        
        setTimeout(() => {
          initializeBoard();
          setGameState('betting');
          setResult(null);
        }, 4000);
      }
    } catch (error) {
      console.error('Mines error:', error);
    }
  };

  return (
    <div className="mines-game">
      <div className="game-header">
        <button onClick={onClose} className="back-btn">←</button>
        <h2>Mines</h2>
        <div className="game-info">
          {gameState === 'betting' && 'Place your bet'}
          {gameState === 'playing' && `${revealedTiles.length} tiles revealed`}
          {gameState === 'finished' && (result?.isWin ? 'Winner!' : 'Game Over')}
        </div>
      </div>

      <div className="game-controls">
        {gameState === 'betting' && (
          <div className="betting-controls">
            <div className="control-group">
              <label>Bet Amount</label>
              <div className="amount-selector">
                <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))}>-</button>
                <span>₹{betAmount}</span>
                <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
              </div>
            </div>
            
            <div className="control-group">
              <label>Mines ({mineCount})</label>
              <div className="mine-selector">
                {[1, 3, 5, 10, 15, 20].map(count => (
                  <button 
                    key={count}
                    className={`mine-btn ${mineCount === count ? 'selected' : ''}`}
                    onClick={() => setMineCount(count)}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
            
            <button className="start-btn" onClick={startGame}>
              Start Game
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="playing-controls">
            <div className="multiplier-display">
              <span>Current Multiplier: {currentMultiplier.toFixed(2)}x</span>
              <span>Potential Win: ₹{Math.floor(betAmount * currentMultiplier)}</span>
            </div>
            
            {canCashOut && (
              <button className="cashout-btn" onClick={cashOut}>
                Cash Out ₹{Math.floor(betAmount * currentMultiplier)}
              </button>
            )}
          </div>
        )}

        {gameState === 'finished' && result && (
          <div className="result-display">
            <div className={`result-message ${result.isWin ? 'win' : 'lose'}`}>
              {result.isWin ? (
                <>
                  <h3>Congratulations!</h3>
                  <p>You won ₹{result.winAmount}</p>
                  <p>Multiplier: {result.finalMultiplier}x</p>
                </>
              ) : (
                <>
                  <h3>Game Over!</h3>
                  <p>You hit a mine!</p>
                  <p>Better luck next time</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="game-board">
        {gameBoard.map((tile, index) => (
          <button
            key={index}
            className={`tile ${tile.revealed ? (tile.isMine ? 'mine' : 'safe') : 'hidden'}`}
            onClick={() => revealTile(index)}
            disabled={gameState !== 'playing' || tile.revealed}
          >
            {tile.revealed && (tile.isMine ? '💣' : '💎')}
          </button>
        ))}
      </div>

      <style jsx>{`
        .mines-game {
          background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%);
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: rgba(0,0,0,0.3);
        }

        .back-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }

        .game-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .game-info {
          font-size: 14px;
          background: rgba(255,255,255,0.2);
          padding: 5px 10px;
          border-radius: 15px;
        }

        .game-controls {
          padding: 20px;
          background: rgba(255,255,255,0.05);
          margin: 20px;
          border-radius: 15px;
        }

        .betting-controls {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .control-group label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .amount-selector {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 5px;
        }

        .amount-selector button {
          background: #34495E;
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }

        .amount-selector span {
          flex: 1;
          text-align: center;
          font-weight: bold;
          font-size: 16px;
        }

        .mine-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .mine-btn {
          background: rgba(255,255,255,0.1);
          border: 2px solid transparent;
          color: white;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .mine-btn.selected {
          border-color: #E74C3C;
          background: rgba(231,76,60,0.2);
        }

        .start-btn {
          background: linear-gradient(45deg, #27AE60, #2ECC71);
          border: none;
          color: white;
          padding: 15px;
          border-radius: 10px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
        }

        .playing-controls {
          text-align: center;
        }

        .multiplier-display {
          background: rgba(255,255,255,0.1);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .multiplier-display span {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .cashout-btn {
          background: linear-gradient(45deg, #F39C12, #E67E22);
          border: none;
          color: white;
          padding: 15px 30px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          animation: pulse 1s ease infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .result-display {
          text-align: center;
        }

        .result-message {
          padding: 20px;
          border-radius: 10px;
        }

        .result-message.win {
          background: rgba(46,204,113,0.2);
          border: 2px solid #2ECC71;
        }

        .result-message.lose {
          background: rgba(231,76,60,0.2);
          border: 2px solid #E74C3C;
        }

        .result-message h3 {
          margin: 0 0 10px 0;
          font-size: 20px;
        }

        .result-message p {
          margin: 5px 0;
        }

        .game-board {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          padding: 20px;
          max-width: 400px;
          margin: 0 auto;
        }

        .tile {
          aspect-ratio: 1;
          border: none;
          border-radius: 8px;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tile.hidden {
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(255,255,255,0.3);
        }

        .tile.hidden:hover {
          background: rgba(255,255,255,0.2);
          transform: scale(1.05);
        }

        .tile.safe {
          background: #27AE60;
          color: white;
        }

        .tile.mine {
          background: #E74C3C;
          color: white;
          animation: explosion 0.5s ease;
        }

        @keyframes explosion {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .tile:disabled {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};