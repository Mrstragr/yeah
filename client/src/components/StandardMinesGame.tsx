import { useState, useEffect } from 'react';

interface StandardMinesGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const StandardMinesGame = ({ onClose, refreshBalance }: StandardMinesGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [mineCount, setMineCount] = useState(3);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'ended'>('betting');
  const [grid, setGrid] = useState<Array<Array<{ revealed: boolean; isMine: boolean; }>>>(
    Array(5).fill(null).map(() => Array(5).fill({ revealed: false, isMine: false }))
  );
  const [safeSpots, setSafeSpots] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlayCount, setAutoPlayCount] = useState(0);
  const [autoPickTiles, setAutoPickTiles] = useState(3);
  const [history, setHistory] = useState([
    { round: 15234, mines: 3, picks: 5, multiplier: 2.4, result: 240 },
    { round: 15233, mines: 5, picks: 2, multiplier: 1.8, result: -100 },
    { round: 15232, mines: 1, picks: 10, multiplier: 8.5, result: 850 }
  ]);
  const [statistics, setStatistics] = useState({
    totalGames: 247,
    winRate: 68.4,
    totalWagered: 25780,
    totalWon: 28940,
    biggestWin: 5670,
    currentStreak: 3
  });

  const multipliers = {
    1: [1.03, 1.09, 1.17, 1.29, 1.46, 1.71, 2.09, 2.71, 3.77, 5.70, 9.43, 18.86, 56.57, 340.43, 4756.00],
    2: [1.09, 1.20, 1.37, 1.62, 1.99, 2.53, 3.35, 4.61, 6.63, 10.12, 16.54, 29.75, 62.33, 165.96, 827.83],
    3: [1.17, 1.34, 1.60, 1.99, 2.58, 3.49, 4.91, 7.26, 11.37, 19.04, 34.47, 69.95, 167.87, 503.60, 2515.00],
    4: [1.29, 1.54, 1.92, 2.51, 3.43, 4.86, 7.26, 11.37, 18.90, 34.47, 69.95, 160.89, 482.68, 2034.50, 15217.50],
    5: [1.46, 1.81, 2.36, 3.23, 4.65, 7.09, 11.37, 19.04, 34.47, 69.95, 160.89, 441.86, 1767.40, 10604.40]
  };

  useEffect(() => {
    initializeGrid();
  }, [mineCount]);

  const initializeGrid = () => {
    const newGrid = Array(5).fill(null).map(() => 
      Array(5).fill(null).map(() => ({ 
        revealed: false, 
        isMine: false
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
    setGameState('playing');
    setSafeSpots(0);
    setCurrentMultiplier(1.0);
    initializeGrid();
  };

  const revealTile = async (row: number, col: number) => {
    if (gameState !== 'playing' || grid[row][col].revealed) return;
    
    const newGrid = [...grid];
    newGrid[row][col].revealed = true;
    setGrid(newGrid);
    
    if (newGrid[row][col].isMine) {
      // Hit mine - game over
      setGameState('ended');
      
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
        const winAmount = betAmount * currentMultiplier;
        
        // Add to history
        setHistory(prev => [
          { round: prev[0].round + 1, mines: mineCount, picks: safeSpots, multiplier: currentMultiplier, result: winAmount - betAmount },
          ...prev.slice(0, 9)
        ]);
        
        setGameState('ended');
        refreshBalance();
      }
    } catch (error) {
      console.error('Cash out error:', error);
    }
  };

  const resetGame = () => {
    setGameState('betting');
    setSafeSpots(0);
    setCurrentMultiplier(1.0);
    initializeGrid();
  };

  const getWinChance = () => {
    const totalTiles = 25;
    const safeTiles = totalTiles - mineCount;
    const remainingTiles = totalTiles - safeSpots;
    const remainingSafe = safeTiles - safeSpots;
    return Math.round((remainingSafe / remainingTiles) * 100);
  };

  return (
    <div className="standard-mines">
      <div className="game-header">
        <button onClick={onClose} className="back-btn">←</button>
        <div className="game-title">
          <span>Mines</span>
          <span className="provider">Spribe</span>
        </div>
        <div className="balance-display">₹8,807.50</div>
      </div>

      <div className="game-layout">
        <div className="main-game">
          <div className="game-area">
            <div className="mines-grid">
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="grid-row">
                  {row.map((cell, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      className={`mine-tile ${cell.revealed ? 'revealed' : ''} ${
                        cell.revealed && cell.isMine ? 'mine' : ''
                      } ${cell.revealed && !cell.isMine ? 'safe' : ''}`}
                      onClick={() => revealTile(rowIndex, colIndex)}
                      disabled={gameState !== 'playing'}
                    >
                      {cell.revealed ? (
                        cell.isMine ? '💣' : '💎'
                      ) : ''}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="game-info">
              <div className="current-stats">
                <div className="stat-item">
                  <span className="stat-label">Mines</span>
                  <span className="stat-value">{mineCount}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Gems Found</span>
                  <span className="stat-value">{safeSpots}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Next Tile Win Chance</span>
                  <span className="stat-value">{getWinChance()}%</span>
                </div>
              </div>

              <div className="multiplier-section">
                <div className="current-multiplier">
                  <span>Current Multiplier</span>
                  <span className="multiplier-value">{currentMultiplier.toFixed(2)}x</span>
                </div>
                <div className="next-multiplier">
                  <span>Next: {(multipliers[mineCount as keyof typeof multipliers][safeSpots] || 0).toFixed(2)}x</span>
                </div>
              </div>
            </div>
          </div>

          <div className="betting-panel">
            <div className="bet-controls">
              <div className="bet-amount">
                <label>Bet Amount</label>
                <div className="amount-input">
                  <button onClick={() => setBetAmount(Math.max(10, betAmount / 2))}>½</button>
                  <input 
                    type="number" 
                    value={betAmount} 
                    onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 10))}
                    disabled={gameState === 'playing'}
                  />
                  <button onClick={() => setBetAmount(betAmount * 2)}>2×</button>
                </div>
              </div>

              <div className="mine-selection">
                <label>Mines</label>
                <select 
                  value={mineCount} 
                  onChange={(e) => setMineCount(parseInt(e.target.value))}
                  disabled={gameState === 'playing'}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(count => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
              </div>

              <div className="auto-play">
                <label>
                  <input 
                    type="checkbox" 
                    checked={isAutoPlay} 
                    onChange={(e) => setIsAutoPlay(e.target.checked)}
                  />
                  Auto Play
                </label>
                {isAutoPlay && (
                  <div className="auto-settings">
                    <input 
                      type="number" 
                      placeholder="Number of games"
                      value={autoPlayCount || ''}
                      onChange={(e) => setAutoPlayCount(parseInt(e.target.value) || 0)}
                    />
                    <input 
                      type="number" 
                      placeholder="Auto pick tiles"
                      value={autoPickTiles}
                      onChange={(e) => setAutoPickTiles(parseInt(e.target.value) || 3)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="action-buttons">
              {gameState === 'betting' && (
                <button className="play-btn" onClick={startGame}>
                  Play ₹{betAmount}
                </button>
              )}
              
              {gameState === 'playing' && (
                <>
                  <button 
                    className="cashout-btn" 
                    onClick={cashOut}
                    disabled={safeSpots === 0}
                  >
                    Cash Out ₹{(betAmount * currentMultiplier).toFixed(2)}
                  </button>
                  <div className="potential-win">
                    Potential: ₹{(betAmount * (multipliers[mineCount as keyof typeof multipliers][safeSpots] || currentMultiplier)).toFixed(2)}
                  </div>
                </>
              )}
              
              {gameState === 'ended' && (
                <button className="play-again-btn" onClick={resetGame}>
                  Play Again
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="side-panel">
          <div className="tabs">
            <button className="tab active">History</button>
            <button className="tab">Statistics</button>
            <button className="tab">How to Play</button>
          </div>

          <div className="tab-content">
            <div className="history-section">
              <div className="history-header">
                <span>Round</span>
                <span>Mines</span>
                <span>Result</span>
              </div>
              {history.map((game, idx) => (
                <div key={idx} className="history-item">
                  <span className="round-id">#{game.round}</span>
                  <span className="mine-info">{game.mines}M/{game.picks}P</span>
                  <span className={`result-amount ${game.result > 0 ? 'win' : 'lose'}`}>
                    {game.result > 0 ? '+' : ''}₹{game.result}
                  </span>
                </div>
              ))}
            </div>

            <div className="statistics-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-number">{statistics.totalGames}</span>
                  <span className="stat-label">Total Games</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{statistics.winRate}%</span>
                  <span className="stat-label">Win Rate</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">₹{statistics.totalWagered}</span>
                  <span className="stat-label">Total Wagered</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">₹{statistics.totalWon}</span>
                  <span className="stat-label">Total Won</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">₹{statistics.biggestWin}</span>
                  <span className="stat-label">Biggest Win</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{statistics.currentStreak}</span>
                  <span className="stat-label">Current Streak</span>
                </div>
              </div>
            </div>

            <div className="rules-section">
              <div className="rule-item">
                <h4>How to Play</h4>
                <p>Click tiles to reveal gems. Avoid mines to win!</p>
              </div>
              <div className="rule-item">
                <h4>Multipliers</h4>
                <p>Each safe tile increases your multiplier. More mines = higher multipliers.</p>
              </div>
              <div className="rule-item">
                <h4>Cash Out</h4>
                <p>Cash out anytime to secure your winnings before hitting a mine.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .standard-mines {
          background: #0f172a;
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #1e293b;
          border-bottom: 1px solid #334155;
        }

        .back-btn {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
        }

        .game-title {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .game-title span:first-child {
          font-size: 18px;
          font-weight: bold;
        }

        .provider {
          font-size: 12px;
          color: #64748b;
        }

        .balance-display {
          background: #059669;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: bold;
        }

        .game-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          height: calc(100vh - 70px);
        }

        .main-game {
          display: flex;
          flex-direction: column;
          padding: 20px;
        }

        .game-area {
          flex: 1;
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .mines-grid {
          display: grid;
          grid-template-rows: repeat(5, 1fr);
          gap: 4px;
          background: #1e293b;
          padding: 20px;
          border-radius: 12px;
        }

        .grid-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
        }

        .mine-tile {
          width: 60px;
          height: 60px;
          background: #475569;
          border: 2px solid #64748b;
          border-radius: 8px;
          color: white;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mine-tile:hover:not(.revealed):not(:disabled) {
          background: #64748b;
          border-color: #94a3b8;
          transform: scale(1.05);
        }

        .mine-tile.revealed {
          cursor: not-allowed;
        }

        .mine-tile.safe {
          background: #059669;
          border-color: #10b981;
        }

        .mine-tile.mine {
          background: #dc2626;
          border-color: #ef4444;
          animation: explode 0.3s ease-out;
        }

        @keyframes explode {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .mine-tile:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .game-info {
          flex: 1;
          margin-left: 40px;
        }

        .current-stats {
          background: #1e293b;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .stat-item:last-child {
          margin-bottom: 0;
        }

        .stat-label {
          color: #94a3b8;
        }

        .stat-value {
          font-weight: bold;
          color: white;
        }

        .multiplier-section {
          background: #1e293b;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .current-multiplier {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 10px;
        }

        .multiplier-value {
          font-size: 36px;
          font-weight: bold;
          color: #10b981;
          margin-top: 5px;
        }

        .next-multiplier {
          color: #64748b;
          font-size: 14px;
        }

        .betting-panel {
          background: #1e293b;
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
        }

        .bet-controls {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .bet-amount label,
        .mine-selection label {
          display: block;
          margin-bottom: 8px;
          color: #94a3b8;
          font-size: 14px;
        }

        .amount-input {
          display: flex;
          background: #334155;
          border-radius: 6px;
          overflow: hidden;
        }

        .amount-input button {
          background: #475569;
          border: none;
          color: white;
          padding: 10px 12px;
          cursor: pointer;
          font-size: 12px;
        }

        .amount-input input {
          flex: 1;
          background: none;
          border: none;
          color: white;
          text-align: center;
          padding: 10px;
        }

        .mine-selection select {
          width: 100%;
          background: #334155;
          border: 1px solid #475569;
          color: white;
          padding: 10px;
          border-radius: 6px;
        }

        .auto-play label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .auto-play input[type="checkbox"] {
          accent-color: #10b981;
        }

        .auto-settings {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .auto-settings input {
          background: #334155;
          border: 1px solid #475569;
          color: white;
          padding: 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .action-buttons {
          text-align: center;
        }

        .play-btn,
        .cashout-btn,
        .play-again-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }

        .play-btn {
          background: #10b981;
          color: white;
        }

        .play-btn:hover {
          background: #059669;
        }

        .cashout-btn {
          background: #f59e0b;
          color: white;
          margin-bottom: 10px;
        }

        .cashout-btn:hover {
          background: #d97706;
        }

        .cashout-btn:disabled {
          background: #6b7280;
          cursor: not-allowed;
        }

        .play-again-btn {
          background: #3b82f6;
          color: white;
        }

        .play-again-btn:hover {
          background: #2563eb;
        }

        .potential-win {
          color: #94a3b8;
          font-size: 14px;
          text-align: center;
        }

        .side-panel {
          background: #1e293b;
          border-left: 1px solid #334155;
          display: flex;
          flex-direction: column;
        }

        .tabs {
          display: flex;
          background: #334155;
        }

        .tab {
          flex: 1;
          background: none;
          border: none;
          color: #94a3b8;
          padding: 15px 10px;
          cursor: pointer;
          font-size: 14px;
          border-bottom: 2px solid transparent;
        }

        .tab.active {
          color: white;
          border-bottom-color: #10b981;
        }

        .tab-content {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
        }

        .history-header {
          display: grid;
          grid-template-columns: 1fr 80px 80px;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #334155;
          font-size: 12px;
          color: #94a3b8;
          font-weight: bold;
        }

        .history-item {
          display: grid;
          grid-template-columns: 1fr 80px 80px;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #334155;
          font-size: 14px;
        }

        .round-id {
          color: #64748b;
          font-size: 12px;
        }

        .mine-info {
          color: #94a3b8;
          font-size: 12px;
        }

        .result-amount.win {
          color: #10b981;
          font-weight: bold;
        }

        .result-amount.lose {
          color: #ef4444;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .stat-card {
          background: #334155;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 18px;
          font-weight: bold;
          color: #10b981;
          margin-bottom: 5px;
        }

        .stat-label {
          color: #94a3b8;
          font-size: 12px;
        }

        .rules-section {
          padding-top: 10px;
        }

        .rule-item {
          margin-bottom: 20px;
        }

        .rule-item h4 {
          color: #10b981;
          margin-bottom: 8px;
        }

        .rule-item p {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .game-layout {
            grid-template-columns: 1fr;
          }
          
          .game-area {
            flex-direction: column;
          }
          
          .game-info {
            margin-left: 0;
            margin-top: 20px;
          }
          
          .bet-controls {
            grid-template-columns: 1fr;
          }
          
          .mine-tile {
            width: 50px;
            height: 50px;
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};