import React, { useState, useEffect } from 'react';

interface LimboGameProps {
  onClose: () => void;
}

export const LimboGame: React.FC<LimboGameProps> = ({ onClose }) => {
  const [betAmount, setBetAmount] = useState(100);
  const [targetMultiplier, setTargetMultiplier] = useState(2.00);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);

  const calculateWinChance = () => {
    return (1 / targetMultiplier) * 100;
  };

  const playLimbo = async () => {
    setIsPlaying(true);
    setCurrentMultiplier(1.00);
    
    // Animate multiplier increase
    const animationDuration = 2000;
    const steps = 50;
    const stepDuration = animationDuration / steps;
    
    for (let i = 0; i <= steps; i++) {
      setTimeout(() => {
        const progress = i / steps;
        const displayMultiplier = 1 + progress * (Math.random() * 10);
        setCurrentMultiplier(displayMultiplier);
      }, i * stepDuration);
    }
    
    setTimeout(() => {
      // Generate final multiplier (exponential distribution for realism)
      const random = Math.random();
      const crashMultiplier = Math.pow(1 / random, 0.5);
      
      const isWin = crashMultiplier >= targetMultiplier;
      const winAmount = isWin ? betAmount * targetMultiplier : 0;
      
      setGameResult({
        crashMultiplier,
        targetMultiplier,
        isWin,
        winAmount
      });
      
      setCurrentMultiplier(crashMultiplier);
      setIsPlaying(false);
    }, animationDuration);
  };

  return (
    <div className="limbo-game">
      <div className="game-header">
        <button onClick={onClose} className="back-btn">←</button>
        <h2>Limbo</h2>
        <div className="balance">₹1000.00</div>
      </div>

      <div className="limbo-display">
        <div className="multiplier-container">
          <div className={`multiplier-display ${isPlaying ? 'pulsing' : ''}`}>
            {currentMultiplier.toFixed(2)}x
          </div>
          <div className="multiplier-label">
            {isPlaying ? 'Rising...' : 'Target: ' + targetMultiplier.toFixed(2) + 'x'}
          </div>
        </div>

        <div className="rocket-animation">
          <div className={`rocket ${isPlaying ? 'flying' : ''}`}>🚀</div>
          <div className="trail"></div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Win Chance</div>
            <div className="stat-value">{calculateWinChance().toFixed(1)}%</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Payout</div>
            <div className="stat-value">{targetMultiplier.toFixed(2)}x</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Potential Win</div>
            <div className="stat-value">₹{(betAmount * targetMultiplier).toFixed(2)}</div>
          </div>
        </div>
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
          <label>Target Multiplier</label>
          <div className="multiplier-input">
            <button onClick={() => setTargetMultiplier(Math.max(1.01, targetMultiplier - 0.1))}>-</button>
            <span>{targetMultiplier.toFixed(2)}x</span>
            <button onClick={() => setTargetMultiplier(Math.min(100, targetMultiplier + 0.1))}>+</button>
          </div>
        </div>

        <div className="quick-multipliers">
          {[1.5, 2.0, 5.0, 10.0].map(mult => (
            <button 
              key={mult}
              className={`quick-mult ${targetMultiplier === mult ? 'active' : ''}`}
              onClick={() => setTargetMultiplier(mult)}
            >
              {mult}x
            </button>
          ))}
        </div>

        <button 
          className="play-btn"
          onClick={playLimbo}
          disabled={isPlaying}
        >
          {isPlaying ? 'Flying...' : 'Launch Rocket'}
        </button>
      </div>

      {gameResult && (
        <div className={`result-modal ${gameResult.isWin ? 'win' : 'lose'}`}>
          <h3>{gameResult.isWin ? '🚀 Success!' : '💥 Crashed!'}</h3>
          <div className="result-details">
            <p>Rocket reached: {gameResult.crashMultiplier.toFixed(2)}x</p>
            <p>Your target: {gameResult.targetMultiplier.toFixed(2)}x</p>
            {gameResult.isWin ? (
              <p className="win-amount">Won: ₹{gameResult.winAmount.toFixed(2)}</p>
            ) : (
              <p className="lose-amount">Lost: ₹{betAmount}</p>
            )}
          </div>
          <button onClick={() => setGameResult(null)}>Play Again</button>
        </div>
      )}

      <style>{`
        .limbo-game {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          color: white;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(0,0,0,0.5);
        }

        .back-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }

        .limbo-display {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
        }

        .multiplier-container {
          text-align: center;
          margin-bottom: 40px;
        }

        .multiplier-display {
          font-size: 72px;
          font-weight: bold;
          color: #00ff88;
          text-shadow: 0 0 20px #00ff88;
          margin-bottom: 10px;
          transition: all 0.3s;
        }

        .multiplier-display.pulsing {
          animation: pulse 0.5s infinite alternate;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }

        .multiplier-label {
          font-size: 16px;
          opacity: 0.8;
        }

        .rocket-animation {
          position: relative;
          margin: 40px 0;
          height: 100px;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .rocket {
          font-size: 48px;
          transition: all 2s ease-out;
        }

        .rocket.flying {
          transform: translateY(-50px) rotate(15deg);
          animation: fly 2s ease-out;
        }

        @keyframes fly {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
          100% { transform: translateY(-50px) rotate(15deg); }
        }

        .trail {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 0;
          background: linear-gradient(to top, #ff6b35, transparent);
          transition: height 2s ease-out;
        }

        .rocket.flying + .trail {
          height: 80px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          width: 100%;
          max-width: 400px;
        }

        .stat-card {
          background: rgba(255,255,255,0.1);
          padding: 15px;
          border-radius: 10px;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.8;
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 16px;
          font-weight: bold;
          color: #00ff88;
        }

        .game-controls {
          background: rgba(255,255,255,0.95);
          padding: 20px;
          color: black;
        }

        .control-group {
          margin-bottom: 20px;
          text-align: center;
        }

        .control-group label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .amount-input, .multiplier-input {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        .amount-input button, .multiplier-input button {
          width: 40px;
          height: 40px;
          border: none;
          background: #1a1a2e;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
        }

        .amount-input span, .multiplier-input span {
          font-size: 18px;
          font-weight: bold;
          min-width: 100px;
        }

        .quick-multipliers {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 20px;
        }

        .quick-mult {
          padding: 8px 16px;
          border: 2px solid #1a1a2e;
          background: white;
          color: #1a1a2e;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
        }

        .quick-mult.active {
          background: #1a1a2e;
          color: white;
        }

        .play-btn {
          background: #00ff88;
          color: black;
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
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
          border: 3px solid #00ff88;
          color: black;
          min-width: 300px;
        }

        .result-modal.lose {
          border-color: #ff6b35;
        }

        .result-details p {
          margin: 10px 0;
        }

        .win-amount {
          color: #00ff88 !important;
          font-weight: bold;
          font-size: 18px;
        }

        .lose-amount {
          color: #ff6b35 !important;
          font-weight: bold;
          font-size: 18px;
        }

        .result-modal button {
          background: #1a1a2e;
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