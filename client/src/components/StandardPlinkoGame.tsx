import { useState, useEffect } from 'react';

interface StandardPlinkoGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const StandardPlinkoGame = ({ onClose, refreshBalance }: StandardPlinkoGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [ballCount, setBallCount] = useState(10);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'ended'>('betting');
  const [droppingBalls, setDroppingBalls] = useState<number[]>([]);
  const [results, setResults] = useState<number[]>([]);
  const [totalWin, setTotalWin] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlayCount, setAutoPlayCount] = useState(0);

  const multipliers = {
    low: [5.6, 2.1, 1.1, 1.0, 0.5, 1.0, 1.1, 2.1, 5.6],
    medium: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
    high: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29]
  };

  const [history, setHistory] = useState([
    { round: 8934, balls: 10, risk: 'medium', payout: 240 },
    { round: 8933, balls: 5, risk: 'high', payout: -100 },
    { round: 8932, balls: 20, risk: 'low', payout: 180 }
  ]);

  const playGame = async () => {
    if (gameState !== 'betting') return;
    
    setGameState('playing');
    setResults([]);
    setTotalWin(0);
    
    // Simulate balls dropping
    const ballResults: number[] = [];
    for (let i = 0; i < ballCount; i++) {
      setTimeout(() => {
        const slot = Math.floor(Math.random() * 9);
        const multiplier = multipliers[riskLevel][slot];
        const winAmount = betAmount * multiplier;
        
        ballResults.push(winAmount);
        setResults(prev => [...prev, winAmount]);
        setTotalWin(prev => prev + winAmount);
        
        if (ballResults.length === ballCount) {
          setTimeout(() => finishGame(ballResults), 1000);
        }
      }, i * 200);
    }
  };

  const finishGame = async (ballResults: number[]) => {
    setGameState('ended');
    
    const totalPayout = ballResults.reduce((sum, result) => sum + result, 0);
    const totalBet = betAmount * ballCount;
    
    try {
      const response = await fetch('/api/games/plinko/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo_token_' + Date.now()
        },
        body: JSON.stringify({
          betAmount: totalBet,
          ballCount,
          riskLevel,
          results: ballResults
        })
      });

      if (response.ok) {
        refreshBalance();
      }
    } catch (error) {
      console.error('Game error:', error);
    }
    
    setHistory(prev => [
      { round: prev[0].round + 1, balls: ballCount, risk: riskLevel, payout: totalPayout - totalBet },
      ...prev.slice(0, 19)
    ]);
    
    setTimeout(() => {
      setGameState('betting');
      setResults([]);
      setTotalWin(0);
      
      if (isAutoPlay && autoPlayCount > 0) {
        setAutoPlayCount(prev => prev - 1);
        setTimeout(playGame, 1000);
      }
    }, 3000);
  };

  return (
    <div className="standard-plinko">
      <div className="game-header">
        <button onClick={onClose} className="back-btn">←</button>
        <div className="game-title">
          <span>Plinko</span>
          <span className="provider">Spribe</span>
        </div>
        <div className="balance-display">₹8,807.50</div>
      </div>

      <div className="game-layout">
        <div className="main-game">
          <div className="plinko-board">
            <div className="pegs-container">
              {Array(8).fill(0).map((_, row) => (
                <div key={row} className="peg-row" style={{ marginLeft: `${row * 20}px` }}>
                  {Array(row + 1).fill(0).map((_, col) => (
                    <div key={col} className="peg"></div>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="multiplier-slots">
              {multipliers[riskLevel].map((mult, idx) => (
                <div key={idx} className={`slot ${mult >= 5 ? 'high' : mult >= 2 ? 'medium' : 'low'}`}>
                  <div className="multiplier">{mult}x</div>
                  <div className="ball-count">
                    {results.filter((_, i) => i % 9 === idx).length}
                  </div>
                </div>
              ))}
            </div>
            
            {gameState === 'playing' && (
              <div className="dropping-balls">
                {droppingBalls.map((ball, idx) => (
                  <div key={idx} className="ball" style={{ left: `${50 + (Math.random() - 0.5) * 20}%` }}>
                    ⚪
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="control-panel">
            <div className="bet-controls">
              <div className="bet-amount">
                <label>Bet per Ball</label>
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

              <div className="risk-selection">
                <label>Risk Level</label>
                <div className="risk-buttons">
                  {(['low', 'medium', 'high'] as const).map(risk => (
                    <button
                      key={risk}
                      className={`risk-btn ${riskLevel === risk ? 'active' : ''}`}
                      onClick={() => setRiskLevel(risk)}
                      disabled={gameState === 'playing'}
                    >
                      {risk.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ball-count-section">
                <label>Number of Balls</label>
                <div className="ball-input">
                  <button onClick={() => setBallCount(Math.max(1, ballCount - 1))}>-</button>
                  <input 
                    type="number" 
                    min="1" 
                    max="100"
                    value={ballCount} 
                    onChange={(e) => setBallCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    disabled={gameState === 'playing'}
                  />
                  <button onClick={() => setBallCount(Math.min(100, ballCount + 1))}>+</button>
                </div>
                <div className="quick-balls">
                  {[1, 10, 50, 100].map(count => (
                    <button 
                      key={count}
                      onClick={() => setBallCount(count)}
                      className={ballCount === count ? 'active' : ''}
                      disabled={gameState === 'playing'}
                    >
                      {count}
                    </button>
                  ))}
                </div>
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
                  <input 
                    type="number" 
                    placeholder="Rounds"
                    value={autoPlayCount || ''}
                    onChange={(e) => setAutoPlayCount(parseInt(e.target.value) || 0)}
                  />
                )}
              </div>
            </div>

            <div className="game-info">
              <div className="total-bet">
                Total Bet: ₹{betAmount * ballCount}
              </div>
              <div className="current-win">
                Current Win: ₹{totalWin.toFixed(2)}
              </div>
              <button 
                className={`play-btn ${gameState === 'playing' ? 'playing' : ''}`}
                onClick={playGame}
                disabled={gameState === 'playing'}
              >
                {gameState === 'playing' ? 'Dropping...' : 'Drop Balls'}
              </button>
            </div>
          </div>
        </div>

        <div className="side-panel">
          <div className="tabs">
            <button className="tab active">History</button>
            <button className="tab">Payouts</button>
          </div>

          <div className="tab-content">
            <div className="history-section">
              <div className="history-header">
                <span>Round</span>
                <span>Balls</span>
                <span>Payout</span>
              </div>
              {history.map((game, idx) => (
                <div key={idx} className="history-item">
                  <span className="round-id">#{game.round}</span>
                  <span className="ball-info">{game.balls}B</span>
                  <span className={`payout ${game.payout > 0 ? 'win' : 'lose'}`}>
                    {game.payout > 0 ? '+' : ''}₹{game.payout}
                  </span>
                </div>
              ))}
            </div>

            <div className="payouts-section">
              <div className="payout-header">Multipliers ({riskLevel})</div>
              <div className="payout-grid">
                {multipliers[riskLevel].map((mult, idx) => (
                  <div key={idx} className={`payout-item ${mult >= 5 ? 'high' : mult >= 2 ? 'medium' : 'low'}`}>
                    {mult}x
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .standard-plinko {
          background: #1a1f36;
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #252a44;
          border-bottom: 1px solid #3a3f5c;
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
          color: #8b92b5;
        }

        .balance-display {
          background: #f6ad55;
          padding: 8px 16px;
          border-radius: 6px;
          color: #1a202c;
          font-weight: bold;
        }

        .game-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          height: calc(100vh - 70px);
        }

        .main-game {
          display: flex;
          flex-direction: column;
          padding: 20px;
        }

        .plinko-board {
          flex: 1;
          background: #252a44;
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }

        .pegs-container {
          position: relative;
          height: 300px;
          margin-bottom: 20px;
        }

        .peg-row {
          display: flex;
          gap: 40px;
          margin-bottom: 30px;
        }

        .peg {
          width: 8px;
          height: 8px;
          background: #f6ad55;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(246,173,85,0.5);
        }

        .multiplier-slots {
          display: grid;
          grid-template-columns: repeat(9, 1fr);
          gap: 5px;
          margin-top: 20px;
        }

        .slot {
          background: #1a1f36;
          border-radius: 8px;
          padding: 15px 5px;
          text-align: center;
          border: 2px solid;
          transition: all 0.3s;
        }

        .slot.low {
          border-color: #e53e3e;
          background: linear-gradient(180deg, #1a1f36, rgba(229,62,62,0.1));
        }

        .slot.medium {
          border-color: #f6ad55;
          background: linear-gradient(180deg, #1a1f36, rgba(246,173,85,0.1));
        }

        .slot.high {
          border-color: #48bb78;
          background: linear-gradient(180deg, #1a1f36, rgba(72,187,120,0.1));
        }

        .multiplier {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .slot.low .multiplier { color: #e53e3e; }
        .slot.medium .multiplier { color: #f6ad55; }
        .slot.high .multiplier { color: #48bb78; }

        .ball-count {
          font-size: 12px;
          color: #8b92b5;
          background: #3a3f5c;
          border-radius: 10px;
          padding: 2px 6px;
          min-height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dropping-balls {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          pointer-events: none;
        }

        .ball {
          position: absolute;
          top: 0;
          font-size: 16px;
          animation: drop 2s ease-in;
        }

        @keyframes drop {
          0% { 
            top: 0; 
            transform: translateX(0);
          }
          25% { 
            transform: translateX(-10px);
          }
          50% { 
            transform: translateX(10px);
          }
          75% { 
            transform: translateX(-5px);
          }
          100% { 
            top: 350px; 
            transform: translateX(0);
          }
        }

        .control-panel {
          background: #252a44;
          border-radius: 15px;
          padding: 20px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 30px;
        }

        .bet-controls {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .bet-amount label,
        .risk-selection label,
        .ball-count-section label {
          display: block;
          margin-bottom: 8px;
          color: #8b92b5;
          font-size: 14px;
        }

        .amount-input,
        .ball-input {
          display: flex;
          background: #1a1f36;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .amount-input button,
        .ball-input button {
          background: #3a3f5c;
          border: none;
          color: white;
          padding: 10px 12px;
          cursor: pointer;
        }

        .amount-input input,
        .ball-input input {
          flex: 1;
          background: none;
          border: none;
          color: white;
          text-align: center;
          padding: 10px;
        }

        .risk-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
        }

        .risk-btn {
          background: #1a1f36;
          border: 1px solid #3a3f5c;
          color: white;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .risk-btn.active {
          background: #f6ad55;
          color: #1a202c;
          border-color: #f6ad55;
        }

        .quick-balls {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 3px;
        }

        .quick-balls button {
          background: #1a1f36;
          border: 1px solid #3a3f5c;
          color: white;
          padding: 6px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
        }

        .quick-balls button.active {
          background: #f6ad55;
          color: #1a202c;
          border-color: #f6ad55;
        }

        .auto-play label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #8b92b5;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .auto-play input[type="checkbox"] {
          accent-color: #f6ad55;
        }

        .auto-play input[type="number"] {
          background: #1a1f36;
          border: 1px solid #3a3f5c;
          color: white;
          padding: 6px;
          border-radius: 4px;
          width: 100%;
        }

        .game-info {
          display: flex;
          flex-direction: column;
          gap: 15px;
          justify-content: center;
          text-align: center;
        }

        .total-bet,
        .current-win {
          font-size: 16px;
          font-weight: bold;
        }

        .total-bet {
          color: #8b92b5;
        }

        .current-win {
          color: #48bb78;
        }

        .play-btn {
          background: linear-gradient(45deg, #f6ad55, #ed8936);
          border: none;
          color: #1a202c;
          padding: 15px 25px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .play-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(246,173,85,0.4);
        }

        .play-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .play-btn.playing {
          background: #e53e3e;
          color: white;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .side-panel {
          background: #252a44;
          border-left: 1px solid #3a3f5c;
          display: flex;
          flex-direction: column;
        }

        .tabs {
          display: flex;
          background: #3a3f5c;
        }

        .tab {
          flex: 1;
          background: none;
          border: none;
          color: #8b92b5;
          padding: 15px;
          cursor: pointer;
          font-size: 14px;
          border-bottom: 2px solid transparent;
        }

        .tab.active {
          color: white;
          border-bottom-color: #f6ad55;
        }

        .tab-content {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
        }

        .history-header {
          display: grid;
          grid-template-columns: 1fr 50px 70px;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #3a3f5c;
          font-size: 12px;
          color: #8b92b5;
          font-weight: bold;
        }

        .history-item {
          display: grid;
          grid-template-columns: 1fr 50px 70px;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #3a3f5c;
          font-size: 14px;
        }

        .round-id {
          color: #8b92b5;
          font-size: 12px;
        }

        .ball-info {
          color: #f6ad55;
          text-align: center;
          font-size: 12px;
        }

        .payout.win {
          color: #48bb78;
          font-weight: bold;
          text-align: right;
        }

        .payout.lose {
          color: #e53e3e;
          text-align: right;
        }

        .payout-header {
          font-weight: bold;
          margin-bottom: 15px;
          color: #f6ad55;
        }

        .payout-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .payout-item {
          padding: 10px;
          border-radius: 6px;
          text-align: center;
          font-weight: bold;
          font-size: 14px;
        }

        .payout-item.low {
          background: rgba(229,62,62,0.2);
          color: #e53e3e;
        }

        .payout-item.medium {
          background: rgba(246,173,85,0.2);
          color: #f6ad55;
        }

        .payout-item.high {
          background: rgba(72,187,120,0.2);
          color: #48bb78;
        }

        @media (max-width: 768px) {
          .game-layout {
            grid-template-columns: 1fr;
          }
          
          .bet-controls {
            grid-template-columns: 1fr 1fr;
          }
          
          .control-panel {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};