import { useState, useEffect } from 'react';

interface LimboProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const Limbo = ({ onClose, refreshBalance }: LimboProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [targetMultiplier, setTargetMultiplier] = useState(2.0);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'result'>('betting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [finalMultiplier, setFinalMultiplier] = useState(0);

  const placeBet = async () => {
    if (betAmount <= 0 || targetMultiplier < 1.01) {
      alert('Please enter valid bet amount and target multiplier');
      return;
    }

    setIsLoading(true);
    setGameState('playing');
    setCurrentMultiplier(1.0);

    // Generate random final multiplier
    const crashPoint = Math.random() * 100 + 1; // 1-101
    setFinalMultiplier(crashPoint);

    // Animate multiplier going up
    let current = 1.0;
    const interval = setInterval(() => {
      current += 0.1;
      setCurrentMultiplier(current);

      if (current >= crashPoint) {
        clearInterval(interval);
        finishGame(crashPoint);
      }
    }, 100);
  };

  const finishGame = async (crashPoint: number) => {
    const isWin = targetMultiplier <= crashPoint;
    const winAmount = isWin ? betAmount * targetMultiplier : 0;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/games/limbo/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          betAmount,
          targetMultiplier,
          betType: 'multiplier',
          betValue: targetMultiplier
        })
      });

      if (response.ok) {
        const result = await response.json();
        setGameResult({
          ...result,
          isWin,
          winAmount,
          crashPoint,
          targetMultiplier
        });
        setGameState('result');
        refreshBalance();
      }
    } catch (error) {
      console.error('Limbo game error:', error);
    }

    setIsLoading(false);
  };

  const resetGame = () => {
    setGameState('betting');
    setCurrentMultiplier(1.0);
    setGameResult(null);
    setFinalMultiplier(0);
  };

  const quickMultipliers = [1.5, 2.0, 3.0, 5.0, 10.0, 50.0, 100.0];

  return (
    <div className="limbo-game">
      <div className="limbo-header">
        <h2>🚀 Limbo</h2>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="limbo-display">
        <div className="multiplier-display">
          <div className="current-mult">
            {gameState === 'playing' ? currentMultiplier.toFixed(2) : finalMultiplier.toFixed(2)}x
          </div>
          {gameState === 'playing' && (
            <div className="rocket">🚀</div>
          )}
          {gameState === 'result' && (
            <div className="crash-indicator">💥 CRASHED!</div>
          )}
        </div>
      </div>

      {gameState === 'betting' && (
        <div className="betting-section">
          <div className="bet-controls">
            <div className="control-group">
              <label>Bet Amount</label>
              <div className="amount-input">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  min="1"
                />
                <span>₹</span>
              </div>
              <div className="quick-amounts">
                <button onClick={() => setBetAmount(10)}>₹10</button>
                <button onClick={() => setBetAmount(50)}>₹50</button>
                <button onClick={() => setBetAmount(100)}>₹100</button>
                <button onClick={() => setBetAmount(500)}>₹500</button>
              </div>
            </div>

            <div className="control-group">
              <label>Target Multiplier</label>
              <div className="multiplier-input">
                <input
                  type="number"
                  value={targetMultiplier}
                  onChange={(e) => setTargetMultiplier(Number(e.target.value))}
                  min="1.01"
                  step="0.01"
                />
                <span>x</span>
              </div>
              <div className="quick-multipliers">
                {quickMultipliers.map(mult => (
                  <button 
                    key={mult}
                    onClick={() => setTargetMultiplier(mult)}
                    className={targetMultiplier === mult ? 'selected' : ''}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>

            <div className="payout-info">
              <div className="potential-payout">
                Potential Payout: ₹{(betAmount * targetMultiplier).toFixed(2)}
              </div>
              <div className="win-chance">
                Win Chance: {(100 / targetMultiplier).toFixed(1)}%
              </div>
            </div>
          </div>

          <button 
            onClick={placeBet} 
            disabled={isLoading}
            className="bet-btn"
          >
            {isLoading ? 'Starting...' : 'Place Bet'}
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="playing-section">
          <div className="game-info">
            <h3>🚀 Rocket Climbing!</h3>
            <div className="target-info">
              Target: {targetMultiplier}x
            </div>
            <div className="bet-info">
              Bet: ₹{betAmount}
            </div>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${Math.min((currentMultiplier / targetMultiplier) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {gameState === 'result' && gameResult && (
        <div className="result-section">
          <div className={`result-card ${gameResult.isWin ? 'win' : 'lose'}`}>
            <h3>{gameResult.isWin ? '🎉 You Won!' : '💥 Crashed!'}</h3>
            <div className="result-details">
              <p>Crashed at: {finalMultiplier.toFixed(2)}x</p>
              <p>Your Target: {targetMultiplier}x</p>
              <p>Bet Amount: ₹{betAmount}</p>
              {gameResult.isWin ? (
                <p className="win-amount">Won: ₹{gameResult.winAmount.toFixed(2)}</p>
              ) : (
                <p className="lose-amount">Lost: ₹{betAmount}</p>
              )}
            </div>
          </div>
          
          <div className="result-actions">
            <button onClick={resetGame} className="play-again-btn">
              Play Again
            </button>
            <button onClick={onClose} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        .limbo-game {
          background: linear-gradient(135deg, #FF5722 0%, #E64A19 100%);
          color: white;
          padding: 20px;
          border-radius: 15px;
          max-width: 400px;
          margin: 0 auto;
        }

        .limbo-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .limbo-display {
          background: rgba(0,0,0,0.3);
          border-radius: 10px;
          padding: 30px;
          text-align: center;
          margin-bottom: 20px;
          position: relative;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .current-mult {
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 10px;
          text-shadow: 0 0 20px rgba(255,255,255,0.5);
        }

        .rocket {
          font-size: 40px;
          animation: rocket-fly 2s infinite;
        }

        .crash-indicator {
          font-size: 20px;
          color: #ff4444;
          font-weight: bold;
        }

        .betting-section {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 20px;
        }

        .control-group {
          margin-bottom: 20px;
        }

        .control-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }

        .amount-input, .multiplier-input {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.1);
          border-radius: 5px;
          padding: 5px;
          margin-bottom: 10px;
        }

        .amount-input input, .multiplier-input input {
          flex: 1;
          background: none;
          border: none;
          color: white;
          padding: 8px;
          font-size: 16px;
        }

        .amount-input span, .multiplier-input span {
          padding: 0 10px;
          font-weight: bold;
        }

        .quick-amounts, .quick-multipliers {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 5px;
        }

        .quick-multipliers {
          grid-template-columns: repeat(3, 1fr);
        }

        .quick-amounts button, .quick-multipliers button {
          padding: 8px;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: white;
          border-radius: 5px;
          cursor: pointer;
          font-size: 12px;
        }

        .quick-multipliers button.selected {
          background: rgba(255,215,0,0.3);
          border-color: #FFD700;
        }

        .payout-info {
          background: rgba(0,0,0,0.2);
          border-radius: 5px;
          padding: 10px;
          margin-top: 15px;
        }

        .bet-btn, .play-again-btn {
          width: 100%;
          padding: 15px;
          background: #FFD700;
          color: #333;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 15px;
        }

        .playing-section {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 15px;
        }

        .progress-bar {
          background: rgba(0,0,0,0.3);
          height: 10px;
          border-radius: 5px;
          margin-top: 15px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4CAF50, #FFD700);
          transition: width 0.1s;
        }

        .result-card {
          text-align: center;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .result-card.win {
          background: rgba(76, 175, 80, 0.3);
          border: 2px solid #4CAF50;
        }

        .result-card.lose {
          background: rgba(244, 67, 54, 0.3);
          border: 2px solid #f44336;
        }

        .win-amount {
          color: #4CAF50;
          font-weight: bold;
          font-size: 18px;
        }

        .lose-amount {
          color: #f44336;
          font-weight: bold;
        }

        .result-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        @keyframes rocket-fly {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};