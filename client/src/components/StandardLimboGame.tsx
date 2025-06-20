import { useState, useEffect } from 'react';

interface StandardLimboGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const StandardLimboGame = ({ onClose, refreshBalance }: StandardLimboGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [targetMultiplier, setTargetMultiplier] = useState(2.0);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'ended'>('betting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [result, setResult] = useState<any>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlayCount, setAutoPlayCount] = useState(0);
  const [history, setHistory] = useState([
    { round: 15678, target: 2.5, result: 3.45, won: true },
    { round: 15677, target: 5.0, result: 2.12, won: false },
    { round: 15676, target: 1.5, result: 8.92, won: true }
  ]);

  const playGame = async () => {
    if (gameState !== 'betting') return;
    
    setGameState('playing');
    setCurrentMultiplier(1.00);
    
    // Animate multiplier increase
    const interval = setInterval(() => {
      setCurrentMultiplier(prev => {
        const increment = 0.01 + (Math.random() * 0.02);
        const newMultiplier = prev + increment;
        
        // Generate crash point based on house edge
        const crashPoint = Math.pow(Math.E, Math.random() * Math.log(100));
        
        if (newMultiplier >= crashPoint) {
          clearInterval(interval);
          setTimeout(() => showResult(newMultiplier), 100);
          return newMultiplier;
        }
        
        return newMultiplier;
      });
    }, 50);
  };

  const showResult = async (finalMultiplier: number) => {
    setGameState('ended');
    
    const won = finalMultiplier >= targetMultiplier;
    const winAmount = won ? betAmount * targetMultiplier : 0;
    
    try {
      const response = await fetch('/api/games/limbo/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo_token_' + Date.now()
        },
        body: JSON.stringify({
          betAmount,
          targetMultiplier,
          finalMultiplier
        })
      });

      if (response.ok) {
        refreshBalance();
      }
    } catch (error) {
      console.error('Game error:', error);
    }
    
    setResult({
      won,
      finalMultiplier,
      targetMultiplier,
      winAmount
    });
    
    setHistory(prev => [
      { round: prev[0].round + 1, target: targetMultiplier, result: finalMultiplier, won },
      ...prev.slice(0, 19)
    ]);
    
    setTimeout(() => {
      setGameState('betting');
      setResult(null);
      setCurrentMultiplier(1.00);
      
      if (isAutoPlay && autoPlayCount > 0) {
        setAutoPlayCount(prev => prev - 1);
        setTimeout(playGame, 1000);
      }
    }, 3000);
  };

  const getWinChance = () => {
    return Math.round((1 / targetMultiplier) * 100);
  };

  return (
    <div className="standard-limbo">
      <div className="game-header">
        <button onClick={onClose} className="back-btn">←</button>
        <div className="game-title">
          <span>Limbo</span>
          <span className="provider">Spribe</span>
        </div>
        <div className="balance-display">₹8,807.50</div>
      </div>

      <div className="game-layout">
        <div className="main-game">
          <div className="game-area">
            <div className="multiplier-display">
              <div className={`multiplier ${gameState === 'ended' ? (result?.won ? 'win' : 'lose') : ''}`}>
                {currentMultiplier.toFixed(2)}x
              </div>
              {gameState === 'betting' && (
                <div className="target-display">Target: {targetMultiplier.toFixed(2)}x</div>
              )}
              {result && (
                <div className={`result-text ${result.won ? 'win' : 'lose'}`}>
                  {result.won ? `Won ₹${result.winAmount}!` : 'Crashed!'}
                </div>
              )}
            </div>

            <div className="game-stats">
              <div className="stat-item">
                <span>Win Chance</span>
                <span>{getWinChance()}%</span>
              </div>
              <div className="stat-item">
                <span>Payout</span>
                <span>₹{(betAmount * targetMultiplier).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="control-panel">
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

              <div className="target-multiplier">
                <label>Target Multiplier</label>
                <div className="multiplier-input">
                  <button onClick={() => setTargetMultiplier(Math.max(1.01, targetMultiplier - 0.1))}>-</button>
                  <input 
                    type="number" 
                    step="0.01"
                    min="1.01"
                    value={targetMultiplier} 
                    onChange={(e) => setTargetMultiplier(Math.max(1.01, parseFloat(e.target.value) || 1.01))}
                    disabled={gameState === 'playing'}
                  />
                  <button onClick={() => setTargetMultiplier(targetMultiplier + 0.1)}>+</button>
                </div>
                <div className="quick-multipliers">
                  {[1.5, 2.0, 5.0, 10.0].map(mult => (
                    <button 
                      key={mult}
                      onClick={() => setTargetMultiplier(mult)}
                      className={targetMultiplier === mult ? 'active' : ''}
                      disabled={gameState === 'playing'}
                    >
                      {mult}x
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

            <div className="action-section">
              <button 
                className={`play-btn ${gameState === 'playing' ? 'playing' : ''}`}
                onClick={playGame}
                disabled={gameState === 'playing'}
              >
                {gameState === 'playing' ? 'Playing...' : `Bet ₹${betAmount}`}
              </button>
            </div>
          </div>
        </div>

        <div className="side-panel">
          <div className="tabs">
            <button className="tab active">History</button>
            <button className="tab">Statistics</button>
          </div>

          <div className="tab-content">
            <div className="history-section">
              <div className="history-header">
                <span>Round</span>
                <span>Target</span>
                <span>Result</span>
              </div>
              {history.map((game, idx) => (
                <div key={idx} className="history-item">
                  <span className="round-id">#{game.round}</span>
                  <span className="target">{game.target}x</span>
                  <span className={`result ${game.won ? 'win' : 'lose'}`}>
                    {game.result.toFixed(2)}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .standard-limbo {
          background: #0d1421;
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #1a2332;
          border-bottom: 1px solid #2d3748;
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
          color: #718096;
        }

        .balance-display {
          background: #38a169;
          padding: 8px 16px;
          border-radius: 6px;
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
          padding: 30px;
        }

        .game-area {
          flex: 1;
          background: #1a2332;
          border-radius: 15px;
          padding: 40px;
          margin-bottom: 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .multiplier-display {
          margin-bottom: 30px;
        }

        .multiplier {
          font-size: 72px;
          font-weight: bold;
          color: #38a169;
          margin-bottom: 15px;
          transition: all 0.1s;
        }

        .multiplier.win {
          color: #38a169;
          text-shadow: 0 0 30px rgba(56,161,105,0.6);
        }

        .multiplier.lose {
          color: #e53e3e;
          text-shadow: 0 0 30px rgba(229,62,62,0.6);
        }

        .target-display {
          font-size: 20px;
          color: #a0aec0;
        }

        .result-text {
          font-size: 24px;
          font-weight: bold;
          margin-top: 10px;
        }

        .result-text.win {
          color: #38a169;
        }

        .result-text.lose {
          color: #e53e3e;
        }

        .game-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          width: 100%;
          max-width: 400px;
        }

        .stat-item {
          background: #2d3748;
          padding: 20px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .stat-item span:first-child {
          color: #a0aec0;
          font-size: 14px;
        }

        .stat-item span:last-child {
          color: white;
          font-size: 18px;
          font-weight: bold;
        }

        .control-panel {
          background: #1a2332;
          border-radius: 15px;
          padding: 30px;
          display: flex;
          gap: 30px;
        }

        .bet-controls {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
        }

        .bet-amount label,
        .target-multiplier label {
          display: block;
          margin-bottom: 10px;
          color: #a0aec0;
          font-size: 14px;
        }

        .amount-input,
        .multiplier-input {
          display: flex;
          background: #2d3748;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .amount-input button,
        .multiplier-input button {
          background: #4a5568;
          border: none;
          color: white;
          padding: 12px 16px;
          cursor: pointer;
          font-weight: bold;
        }

        .amount-input input,
        .multiplier-input input {
          flex: 1;
          background: none;
          border: none;
          color: white;
          text-align: center;
          padding: 12px;
          font-size: 16px;
        }

        .quick-multipliers {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 5px;
        }

        .quick-multipliers button {
          background: #2d3748;
          border: 1px solid #4a5568;
          color: white;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .quick-multipliers button.active {
          background: #38a169;
          border-color: #38a169;
        }

        .auto-play label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #a0aec0;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .auto-play input[type="checkbox"] {
          accent-color: #38a169;
        }

        .auto-play input[type="number"] {
          background: #2d3748;
          border: 1px solid #4a5568;
          color: white;
          padding: 8px;
          border-radius: 4px;
          width: 100%;
        }

        .action-section {
          display: flex;
          align-items: end;
        }

        .play-btn {
          background: linear-gradient(45deg, #38a169, #2f855a);
          border: none;
          color: white;
          padding: 20px 40px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(56,161,105,0.3);
        }

        .play-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(56,161,105,0.4);
        }

        .play-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .play-btn.playing {
          background: #e53e3e;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .side-panel {
          background: #1a2332;
          border-left: 1px solid #2d3748;
          display: flex;
          flex-direction: column;
        }

        .tabs {
          display: flex;
          background: #2d3748;
        }

        .tab {
          flex: 1;
          background: none;
          border: none;
          color: #a0aec0;
          padding: 15px;
          cursor: pointer;
          font-size: 14px;
          border-bottom: 2px solid transparent;
        }

        .tab.active {
          color: white;
          border-bottom-color: #38a169;
        }

        .tab-content {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
        }

        .history-header {
          display: grid;
          grid-template-columns: 1fr 60px 60px;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #2d3748;
          font-size: 12px;
          color: #a0aec0;
          font-weight: bold;
        }

        .history-item {
          display: grid;
          grid-template-columns: 1fr 60px 60px;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #2d3748;
          font-size: 14px;
        }

        .round-id {
          color: #718096;
          font-size: 12px;
        }

        .target {
          color: #a0aec0;
          text-align: center;
        }

        .result.win {
          color: #38a169;
          font-weight: bold;
          text-align: center;
        }

        .result.lose {
          color: #e53e3e;
          text-align: center;
        }

        @media (max-width: 768px) {
          .game-layout {
            grid-template-columns: 1fr;
          }
          
          .bet-controls {
            grid-template-columns: 1fr;
          }
          
          .control-panel {
            flex-direction: column;
            gap: 20px;
          }
          
          .multiplier {
            font-size: 48px;
          }
        }
      `}</style>
    </div>
  );
};