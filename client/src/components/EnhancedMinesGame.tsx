import { useState, useEffect } from 'react';

interface EnhancedMinesGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const EnhancedMinesGame = ({ onClose, refreshBalance }: EnhancedMinesGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [mineCount, setMineCount] = useState(3);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'ended'>('betting');
  const [grid, setGrid] = useState<Array<Array<{ revealed: boolean; isMine: boolean; gems: number }>>>(
    Array(5).fill(null).map(() => Array(5).fill({ revealed: false, isMine: false, gems: 0 }))
  );
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [safeSpots, setSafeSpots] = useState(0);
  const [totalWin, setTotalWin] = useState(0);
  const [result, setResult] = useState<any>(null);

  const multipliers = {
    1: [1.03, 1.09, 1.17, 1.29, 1.46, 1.71, 2.09, 2.71, 3.77, 5.70, 9.43, 18.86, 56.57, 340.43, 4756.00],
    2: [1.09, 1.20, 1.37, 1.62, 1.99, 2.53, 3.35, 4.61, 6.63, 10.12, 16.54, 29.75, 62.33, 165.96, 827.83],
    3: [1.17, 1.34, 1.60, 1.99, 2.58, 3.49, 4.91, 7.26, 11.37, 19.04, 34.47, 69.95, 167.87, 503.60, 2515.00],
    4: [1.29, 1.54, 1.92, 2.51, 3.43, 4.86, 7.26, 11.37, 18.90, 34.47, 69.95, 160.89, 482.68, 2034.50, 15217.50],
    5: [1.46, 1.81, 2.36, 3.23, 4.65, 7.09, 11.37, 19.04, 34.47, 69.95, 160.89, 441.86, 1767.40, 10604.40],
    6: [1.71, 2.20, 2.97, 4.32, 6.63, 10.79, 19.04, 37.42, 82.33, 215.25, 683.50, 3073.58, 23051.90],
    7: [2.09, 2.76, 3.91, 5.98, 9.93, 17.84, 34.47, 75.63, 191.73, 594.04, 2376.20, 14257.10],
    8: [2.71, 3.71, 5.49, 8.82, 15.41, 29.75, 63.07, 152.25, 433.57, 1516.50, 7582.50],
    9: [3.77, 5.40, 8.33, 14.15, 26.44, 55.12, 129.20, 344.53, 1148.40, 4593.70],
    10: [5.70, 8.64, 14.77, 27.47, 57.38, 135.44, 367.67, 1286.80, 5147.20]
  };

  useEffect(() => {
    initializeGrid();
  }, [mineCount]);

  const initializeGrid = () => {
    const newGrid = Array(5).fill(null).map(() => 
      Array(5).fill(null).map(() => ({ 
        revealed: false, 
        isMine: false, 
        gems: Math.floor(Math.random() * 3) + 1 
      }))
    );
    
    // Place mines randomly
    const minePositions = new Set();
    while (minePositions.size < mineCount) {
      const pos = Math.floor(Math.random() * 25);
      minePositions.add(pos);
    }
    
    minePositions.forEach(pos => {
      const row = Math.floor(pos / 5);
      const col = pos % 5;
      newGrid[row][col].isMine = true;
    });
    
    setGrid(newGrid);
  };

  const startGame = () => {
    if (gameState !== 'betting') return;
    setGameState('playing');
    setSafeSpots(0);
    setCurrentMultiplier(1.0);
    setTotalWin(0);
    initializeGrid();
  };

  const revealTile = async (row: number, col: number) => {
    if (gameState !== 'playing' || grid[row][col].revealed) return;
    
    const newGrid = [...grid];
    newGrid[row][col].revealed = true;
    setGrid(newGrid);
    
    if (newGrid[row][col].isMine) {
      // Hit a mine - game over
      setGameState('ended');
      setResult({
        isWin: false,
        message: 'BOOM! You hit a mine!',
        winAmount: 0
      });
      
      // Reveal all mines
      setTimeout(() => {
        const finalGrid = [...newGrid];
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 5; j++) {
            if (finalGrid[i][j].isMine) {
              finalGrid[i][j].revealed = true;
            }
          }
        }
        setGrid(finalGrid);
      }, 500);
      
    } else {
      // Safe tile
      const newSafeSpots = safeSpots + 1;
      setSafeSpots(newSafeSpots);
      
      const multiplierArray = multipliers[mineCount as keyof typeof multipliers];
      const newMultiplier = multiplierArray[newSafeSpots - 1] || multiplierArray[multiplierArray.length - 1];
      setCurrentMultiplier(newMultiplier);
      setTotalWin(betAmount * newMultiplier);
    }
  };

  const cashOut = async () => {
    if (gameState !== 'playing' || safeSpots === 0) return;
    
    try {
      const response = await fetch('/api/games/mines/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo_token_' + Date.now()
        },
        body: JSON.stringify({
          betAmount,
          mineCount,
          revealedTiles: safeSpots
        })
      });

      if (response.ok) {
        setGameState('ended');
        setResult({
          isWin: true,
          message: 'Successful Cash Out!',
          winAmount: totalWin
        });
        refreshBalance();
      }
    } catch (error) {
      console.error('Cash out error:', error);
    }
  };

  const resetGame = () => {
    setGameState('betting');
    setResult(null);
    setSafeSpots(0);
    setCurrentMultiplier(1.0);
    setTotalWin(0);
    initializeGrid();
  };

  return (
    <div className="enhanced-mines-game">
      <div className="game-header">
        <button onClick={onClose} className="close-btn">← Back</button>
        <h2>Mines</h2>
        <div className="balance">₹8,807</div>
      </div>

      <div className="game-container">
        <div className="game-board">
          <div className="mines-grid">
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="grid-row">
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`grid-cell ${cell.revealed ? 'revealed' : ''} ${
                      cell.revealed && cell.isMine ? 'mine' : ''
                    } ${cell.revealed && !cell.isMine ? 'safe' : ''}`}
                    onClick={() => revealTile(rowIndex, colIndex)}
                  >
                    {cell.revealed ? (
                      cell.isMine ? (
                        <div className="mine">💣</div>
                      ) : (
                        <div className="gem">💎</div>
                      )
                    ) : (
                      <div className="hidden-tile">?</div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          <div className="game-info">
            <div className="multiplier-display">
              <div className="current-multiplier">
                {currentMultiplier.toFixed(2)}x
              </div>
              <div className="potential-win">
                ₹{totalWin.toFixed(2)}
              </div>
            </div>
            
            <div className="stats">
              <div className="stat">
                <span>Safe Tiles:</span>
                <span>{safeSpots}</span>
              </div>
              <div className="stat">
                <span>Mines:</span>
                <span>{mineCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="control-panel">
          {gameState === 'betting' && (
            <div className="betting-controls">
              <div className="bet-settings">
                <div className="setting">
                  <label>Bet Amount</label>
                  <div className="amount-selector">
                    <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))}>-</button>
                    <input 
                      type="number" 
                      value={betAmount} 
                      onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 10))}
                    />
                    <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
                  </div>
                </div>
                
                <div className="setting">
                  <label>Mines</label>
                  <div className="mine-selector">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(count => (
                      <button
                        key={count}
                        className={mineCount === count ? 'active' : ''}
                        onClick={() => setMineCount(count)}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <button className="start-btn" onClick={startGame}>
                Start Game - ₹{betAmount}
              </button>
            </div>
          )}
          
          {gameState === 'playing' && (
            <div className="playing-controls">
              <button 
                className="cashout-btn" 
                onClick={cashOut}
                disabled={safeSpots === 0}
              >
                Cash Out - ₹{totalWin.toFixed(2)}
              </button>
              <div className="next-multiplier">
                Next: {(multipliers[mineCount as keyof typeof multipliers][safeSpots] || 0).toFixed(2)}x
              </div>
            </div>
          )}
          
          {gameState === 'ended' && result && (
            <div className="result-panel">
              <div className={`result ${result.isWin ? 'win' : 'lose'}`}>
                <div className="result-message">{result.message}</div>
                <div className="result-amount">
                  {result.isWin ? `Won ₹${result.winAmount.toFixed(2)}` : 'Better luck next time!'}
                </div>
                <button className="play-again-btn" onClick={resetGame}>
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .enhanced-mines-game {
          background: linear-gradient(135deg, #2c1810 0%, #8b4513 50%, #daa520 100%);
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(10px);
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 10px;
          border-radius: 8px;
          transition: background 0.3s;
        }

        .close-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        .balance {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          padding: 10px 20px;
          border-radius: 25px;
          color: #333;
          font-weight: bold;
          font-size: 18px;
        }

        .game-container {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 20px;
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .game-board {
          background: rgba(0,0,0,0.2);
          border-radius: 15px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .mines-grid {
          display: grid;
          grid-template-rows: repeat(5, 1fr);
          gap: 8px;
          margin-bottom: 20px;
        }

        .grid-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }

        .grid-cell {
          aspect-ratio: 1;
          background: linear-gradient(145deg, #4a4a4a, #2a2a2a);
          border: 2px solid #555;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .grid-cell:hover:not(.revealed) {
          background: linear-gradient(145deg, #5a5a5a, #3a3a3a);
          border-color: #777;
          transform: scale(1.05);
        }

        .grid-cell.revealed {
          cursor: not-allowed;
          border-color: #888;
        }

        .grid-cell.safe {
          background: linear-gradient(145deg, #2e7d32, #1b5e20);
          border-color: #4caf50;
          animation: reveal-safe 0.5s ease-out;
        }

        .grid-cell.mine {
          background: linear-gradient(145deg, #d32f2f, #b71c1c);
          border-color: #f44336;
          animation: reveal-mine 0.5s ease-out;
        }

        @keyframes reveal-safe {
          0% { transform: scale(1) rotateY(0deg); }
          50% { transform: scale(1.1) rotateY(90deg); }
          100% { transform: scale(1) rotateY(0deg); }
        }

        @keyframes reveal-mine {
          0% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(0.9); }
          75% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .hidden-tile {
          font-size: 24px;
          color: #bbb;
          font-weight: bold;
        }

        .gem {
          font-size: 28px;
          animation: sparkle 1s ease-in-out infinite;
        }

        .mine {
          font-size: 28px;
          animation: explode 0.5s ease-out;
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.1); filter: brightness(1.2); }
        }

        @keyframes explode {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }

        .game-info {
          text-align: center;
        }

        .multiplier-display {
          background: rgba(0,0,0,0.3);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .current-multiplier {
          font-size: 48px;
          font-weight: bold;
          color: #FFD700;
          margin-bottom: 10px;
        }

        .potential-win {
          font-size: 24px;
          color: #4caf50;
          font-weight: bold;
        }

        .stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .stat {
          background: rgba(0,0,0,0.2);
          padding: 15px;
          border-radius: 10px;
          text-align: center;
        }

        .control-panel {
          background: rgba(0,0,0,0.2);
          border-radius: 15px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .betting-controls {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .bet-settings {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .setting label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .amount-selector {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .amount-selector button {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          padding: 15px 20px;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
        }

        .amount-selector input {
          flex: 1;
          background: none;
          border: none;
          color: white;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          padding: 15px;
        }

        .mine-selector {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 5px;
        }

        .mine-selector button {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .mine-selector button.active,
        .mine-selector button:hover {
          background: #FFD700;
          color: #333;
          transform: scale(1.05);
        }

        .start-btn {
          background: linear-gradient(45deg, #4CAF50, #45a049);
          border: none;
          color: white;
          padding: 20px;
          border-radius: 15px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(76,175,80,0.4);
        }

        .start-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(76,175,80,0.6);
        }

        .playing-controls {
          text-align: center;
        }

        .cashout-btn {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          border: none;
          color: #333;
          padding: 20px 30px;
          border-radius: 15px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 15px;
          box-shadow: 0 4px 15px rgba(255,215,0,0.4);
        }

        .cashout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255,215,0,0.6);
        }

        .cashout-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .next-multiplier {
          font-size: 16px;
          color: #bbb;
        }

        .result-panel {
          text-align: center;
        }

        .result {
          background: rgba(0,0,0,0.5);
          padding: 30px;
          border-radius: 15px;
        }

        .result.win {
          border: 2px solid #4CAF50;
          box-shadow: 0 0 20px rgba(76,175,80,0.5);
        }

        .result.lose {
          border: 2px solid #f44336;
          box-shadow: 0 0 20px rgba(244,67,54,0.5);
        }

        .result-message {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .result-amount {
          font-size: 20px;
          color: #FFD700;
          margin-bottom: 20px;
        }

        .play-again-btn {
          background: linear-gradient(45deg, #2196F3, #1976D2);
          border: none;
          color: white;
          padding: 15px 30px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .play-again-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(33,150,243,0.4);
        }

        @media (max-width: 768px) {
          .game-container {
            grid-template-columns: 1fr;
          }
          
          .mines-grid {
            max-width: 300px;
            margin: 0 auto 20px;
          }
          
          .mine-selector {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
};