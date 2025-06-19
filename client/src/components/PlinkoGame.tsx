import React, { useState, useEffect } from 'react';

interface PlinkoGameProps {
  onClose: () => void;
}

export const PlinkoGame: React.FC<PlinkoGameProps> = ({ onClose }) => {
  const [betAmount, setBetAmount] = useState(100);
  const [ballCount, setBallCount] = useState(1);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [gameResult, setGameResult] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ballPosition, setBallPosition] = useState<number[]>([]);

  const multipliers = {
    low: [1.5, 1.2, 1.1, 1.0, 0.5, 0.3, 0.5, 1.0, 1.1, 1.2, 1.5],
    medium: [2.0, 1.8, 1.4, 1.0, 0.2, 0.0, 0.2, 1.0, 1.4, 1.8, 2.0],
    high: [3.0, 2.5, 1.5, 0.5, 0.0, 0.0, 0.0, 0.5, 1.5, 2.5, 3.0]
  };

  const playPlinko = async () => {
    setIsPlaying(true);
    setBallPosition([]);
    
    // Simulate ball dropping
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        setBallPosition(prev => [...prev, Math.random() > 0.5 ? 1 : -1]);
      }, i * 200);
    }
    
    setTimeout(() => {
      const finalPosition = Math.floor(Math.random() * multipliers[riskLevel].length);
      const multiplier = multipliers[riskLevel][finalPosition];
      const winAmount = betAmount * multiplier * ballCount;
      
      setGameResult({
        position: finalPosition,
        multiplier,
        winAmount,
        isWin: multiplier > 0
      });
      setIsPlaying(false);
    }, 2000);
  };

  return (
    <div className="plinko-game">
      <div className="game-header">
        <button onClick={onClose} className="back-btn">←</button>
        <h2>Plinko</h2>
        <div className="balance">₹1000.00</div>
      </div>

      <div className="plinko-board">
        <div className="drop-zone">
          <div className="ball-dropper">Drop Zone</div>
        </div>

        <div className="pegs-container">
          {[...Array(7)].map((_, row) => (
            <div key={row} className="peg-row">
              {[...Array(row + 2)].map((_, col) => (
                <div key={col} className="peg" />
              ))}
            </div>
          ))}
        </div>

        <div className="multipliers-row">
          {multipliers[riskLevel].map((mult, index) => (
            <div 
              key={index} 
              className={`multiplier ${gameResult?.position === index ? 'active' : ''}`}
              style={{
                color: mult > 1 ? '#4CAF50' : mult === 0 ? '#f44336' : '#FF9800'
              }}
            >
              {mult}x
            </div>
          ))}
        </div>

        {isPlaying && (
          <div className="falling-ball" style={{
            left: `${50 + ballPosition.reduce((sum, dir) => sum + dir * 5, 0)}%`
          }}>
            🔴
          </div>
        )}
      </div>

      <div className="game-controls">
        <div className="control-group">
          <label>Bet Amount</label>
          <div className="amount-input">
            <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))}>-</button>
            <span>₹{betAmount}</span>
            <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
          </div>
        </div>

        <div className="control-group">
          <label>Risk Level</label>
          <div className="risk-buttons">
            {(['low', 'medium', 'high'] as const).map(risk => (
              <button 
                key={risk}
                className={`risk-btn ${riskLevel === risk ? 'active' : ''}`}
                onClick={() => setRiskLevel(risk)}
              >
                {risk.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Balls</label>
          <div className="balls-input">
            <button onClick={() => setBallCount(Math.max(1, ballCount - 1))}>-</button>
            <span>{ballCount}</span>
            <button onClick={() => setBallCount(Math.min(10, ballCount + 1))}>+</button>
          </div>
        </div>

        <button 
          className="play-btn"
          onClick={playPlinko}
          disabled={isPlaying}
        >
          {isPlaying ? 'Dropping...' : 'Drop Ball'}
        </button>
      </div>

      {gameResult && (
        <div className={`result-modal ${gameResult.isWin ? 'win' : 'lose'}`}>
          <h3>{gameResult.isWin ? '🎉 Winner!' : '😔 Try Again!'}</h3>
          <div className="result-details">
            <p>Multiplier: {gameResult.multiplier}x</p>
            <p>Balls: {ballCount}</p>
            {gameResult.isWin ? (
              <p className="win-amount">Won: ₹{gameResult.winAmount.toFixed(2)}</p>
            ) : (
              <p className="lose-amount">Lost: ₹{betAmount * ballCount}</p>
            )}
          </div>
          <button onClick={() => setGameResult(null)}>Play Again</button>
        </div>
      )}

      <style>{`
        .plinko-game {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(0,0,0,0.3);
          color: white;
        }

        .back-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }

        .plinko-board {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          position: relative;
        }

        .drop-zone {
          margin-bottom: 20px;
        }

        .ball-dropper {
          background: rgba(255,255,255,0.9);
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: bold;
        }

        .pegs-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }

        .peg-row {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .peg {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
        }

        .multipliers-row {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .multiplier {
          background: rgba(255,255,255,0.9);
          padding: 8px 12px;
          border-radius: 5px;
          font-weight: bold;
          min-width: 40px;
          text-align: center;
          transition: all 0.3s;
        }

        .multiplier.active {
          transform: scale(1.2);
          box-shadow: 0 0 20px rgba(255,255,255,0.8);
        }

        .falling-ball {
          position: absolute;
          top: 80px;
          transform: translateX(-50%);
          font-size: 20px;
          transition: all 0.2s;
        }

        .game-controls {
          background: rgba(255,255,255,0.95);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .control-group {
          text-align: center;
        }

        .control-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }

        .amount-input, .balls-input {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        .amount-input button, .balls-input button {
          width: 40px;
          height: 40px;
          border: none;
          background: #667eea;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
        }

        .amount-input span, .balls-input span {
          font-size: 18px;
          font-weight: bold;
          min-width: 80px;
        }

        .risk-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .risk-btn {
          padding: 8px 16px;
          border: 2px solid #667eea;
          background: white;
          color: #667eea;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
        }

        .risk-btn.active {
          background: #667eea;
          color: white;
        }

        .play-btn {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
        }

        .play-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .result-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 30px;
          border-radius: 20px;
          text-align: center;
          border: 3px solid #4CAF50;
          min-width: 300px;
        }

        .result-modal.lose {
          border-color: #f44336;
        }

        .result-details p {
          margin: 10px 0;
          color: #333;
        }

        .win-amount {
          color: #4CAF50 !important;
          font-weight: bold;
          font-size: 18px;
        }

        .lose-amount {
          color: #f44336 !important;
          font-weight: bold;
          font-size: 18px;
        }

        .result-modal button {
          background: #667eea;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
};