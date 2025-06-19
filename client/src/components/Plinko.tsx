import { useState, useEffect } from 'react';

interface PlinkoProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const Plinko = ({ onClose, refreshBalance }: PlinkoProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [ballPosition, setBallPosition] = useState<number[]>([]);
  const [isDropping, setIsDropping] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const multipliers = {
    low: [1.5, 1.2, 1.1, 1.0, 0.5, 1.0, 1.1, 1.2, 1.5],
    medium: [5.6, 2.1, 1.1, 1.0, 0.5, 1.0, 1.1, 2.1, 5.6],
    high: [29, 4, 1.5, 1, 0.2, 1, 1.5, 4, 29]
  };

  const dropBall = async () => {
    if (betAmount <= 0) {
      alert('Please enter a valid bet amount');
      return;
    }

    setIsDropping(true);
    setShowResult(false);
    setBallPosition([]);

    // Simulate ball dropping through pegs
    const path: number[] = [];
    let currentPosition = 4; // Start at center

    for (let row = 0; row < 8; row++) {
      // Random direction (left or right)
      const direction = Math.random() > 0.5 ? 1 : -1;
      currentPosition = Math.max(0, Math.min(8, currentPosition + direction));
      path.push(currentPosition);
      
      // Animate ball movement
      await new Promise(resolve => {
        setTimeout(() => {
          setBallPosition([...path]);
          resolve(void 0);
        }, 300);
      });
    }

    // Final position determines multiplier
    const finalPosition = currentPosition;
    const multiplier = multipliers[riskLevel][finalPosition];
    const winAmount = betAmount * multiplier;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/games/plinko/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          betAmount,
          betType: riskLevel,
          betValue: finalPosition,
          multiplier,
          riskLevel
        })
      });

      if (response.ok) {
        const result = await response.json();
        setGameResult({
          ...result,
          winAmount,
          multiplier,
          finalPosition,
          isWin: multiplier >= 1
        });
        setShowResult(true);
        refreshBalance();
      }
    } catch (error) {
      console.error('Plinko game error:', error);
    }

    setIsDropping(false);
  };

  const resetGame = () => {
    setShowResult(false);
    setGameResult(null);
    setBallPosition([]);
  };

  return (
    <div className="plinko-game">
      <div className="plinko-header">
        <h2>🎯 Plinko</h2>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="plinko-board">
        <div className="ball-drop-zone">
          {isDropping && (
            <div className="ball" style={{
              left: `${ballPosition.length > 0 ? (ballPosition[ballPosition.length - 1] * 11.11) + 5.55 : 50}%`,
              top: `${ballPosition.length * 12.5}%`,
              transition: 'all 0.3s ease'
            }}>
              🔴
            </div>
          )}
        </div>

        <div className="pegs">
          {Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 9 - row }, (_, col) => (
              <div
                key={`${row}-${col}`}
                className="peg"
                style={{
                  left: `${(col + row * 0.5) * 11.11 + 11.11}%`,
                  top: `${(row + 1) * 12.5}%`
                }}
              >
                ⚪
              </div>
            ))
          )}
        </div>

        <div className="multiplier-slots">
          {multipliers[riskLevel].map((mult, index) => (
            <div
              key={index}
              className={`multiplier-slot ${mult >= 2 ? 'high' : mult >= 1 ? 'medium' : 'low'}`}
            >
              {mult}x
            </div>
          ))}
        </div>
      </div>

      {!showResult && (
        <div className="betting-section">
          <div className="risk-selector">
            <h3>Risk Level:</h3>
            <div className="risk-buttons">
              <button
                className={`risk-btn ${riskLevel === 'low' ? 'selected' : ''}`}
                onClick={() => setRiskLevel('low')}
              >
                Low Risk
              </button>
              <button
                className={`risk-btn ${riskLevel === 'medium' ? 'selected' : ''}`}
                onClick={() => setRiskLevel('medium')}
              >
                Medium Risk
              </button>
              <button
                className={`risk-btn ${riskLevel === 'high' ? 'selected' : ''}`}
                onClick={() => setRiskLevel('high')}
              >
                High Risk
              </button>
            </div>
          </div>

          <div className="bet-amount-section">
            <label>Bet Amount: ₹{betAmount}</label>
            <div className="amount-buttons">
              <button onClick={() => setBetAmount(10)}>₹10</button>
              <button onClick={() => setBetAmount(50)}>₹50</button>
              <button onClick={() => setBetAmount(100)}>₹100</button>
              <button onClick={() => setBetAmount(500)}>₹500</button>
            </div>
          </div>

          <div className="multiplier-info">
            <h4>Possible Multipliers ({riskLevel} risk):</h4>
            <div className="multiplier-display">
              {multipliers[riskLevel].map((mult, idx) => (
                <span key={idx} className={`mult ${mult >= 2 ? 'high' : mult >= 1 ? 'medium' : 'low'}`}>
                  {mult}x
                </span>
              ))}
            </div>
          </div>

          <button 
            onClick={dropBall} 
            disabled={isDropping}
            className="drop-btn"
          >
            {isDropping ? 'Dropping Ball...' : 'Drop Ball'}
          </button>
        </div>
      )}

      {showResult && gameResult && (
        <div className="result-section">
          <div className={`result-card ${gameResult.isWin ? 'win' : 'lose'}`}>
            <h3>{gameResult.isWin ? '🎉 Ball Landed!' : '😔 Better Luck!'}</h3>
            <div className="result-details">
              <p>Multiplier: {gameResult.multiplier}x</p>
              <p>Risk Level: {riskLevel.toUpperCase()}</p>
              <p>Bet Amount: ₹{betAmount}</p>
              <p className={gameResult.isWin ? 'win-amount' : 'lose-amount'}>
                {gameResult.isWin ? `Won: ₹${gameResult.winAmount.toFixed(2)}` : `Lost: ₹${betAmount}`}
              </p>
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

      <style jsx>{`
        .plinko-game {
          background: linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%);
          color: white;
          padding: 20px;
          border-radius: 15px;
          max-width: 400px;
          margin: 0 auto;
        }

        .plinko-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .plinko-board {
          background: rgba(0,0,0,0.3);
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 20px;
          position: relative;
          height: 300px;
        }

        .ball-drop-zone {
          position: relative;
          height: 100%;
        }

        .ball {
          position: absolute;
          font-size: 12px;
          z-index: 10;
        }

        .pegs {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .peg {
          position: absolute;
          font-size: 8px;
          transform: translate(-50%, -50%);
        }

        .multiplier-slots {
          position: absolute;
          bottom: 10px;
          left: 0;
          right: 0;
          display: grid;
          grid-template-columns: repeat(9, 1fr);
          gap: 2px;
          padding: 0 10px;
        }

        .multiplier-slot {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          padding: 4px 2px;
          text-align: center;
          font-size: 10px;
          font-weight: bold;
        }

        .multiplier-slot.high {
          background: #4CAF50;
        }

        .multiplier-slot.medium {
          background: #FF9800;
        }

        .multiplier-slot.low {
          background: #f44336;
        }

        .betting-section {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 15px;
        }

        .risk-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin: 10px 0;
        }

        .risk-btn {
          padding: 8px;
          border: 2px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .risk-btn.selected {
          border-color: #FFD700;
          background: rgba(255,215,0,0.2);
        }

        .amount-buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin: 10px 0;
        }

        .amount-buttons button {
          padding: 8px;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }

        .multiplier-info {
          margin: 15px 0;
        }

        .multiplier-display {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .mult {
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: bold;
        }

        .mult.high {
          background: #4CAF50;
        }

        .mult.medium {
          background: #FF9800;
        }

        .mult.low {
          background: #f44336;
        }

        .drop-btn, .play-again-btn {
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

        .drop-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
      `}</style>
    </div>
  );
};