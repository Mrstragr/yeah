import React, { useState, useEffect } from 'react';

interface SpaceDiceGameProps {
  onClose: () => void;
}

export const SpaceDiceGame: React.FC<SpaceDiceGameProps> = ({ onClose }) => {
  const [betAmount, setBetAmount] = useState(100);
  const [prediction, setPrediction] = useState<'big' | 'small' | 'odd' | 'even' | null>(null);
  const [diceResults, setDiceResults] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);
  const [totalSum, setTotalSum] = useState(0);

  const rollDice = async () => {
    if (!prediction) return;
    
    setIsRolling(true);
    setDiceResults([]);
    setGameResult(null);
    
    // Animate dice rolling
    const rollDuration = 2000;
    const rollInterval = 100;
    
    const rollAnimation = setInterval(() => {
      setDiceResults([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
    }, rollInterval);
    
    setTimeout(() => {
      clearInterval(rollAnimation);
      
      // Final dice results
      const finalResults = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ];
      
      const sum = finalResults.reduce((a, b) => a + b, 0);
      setDiceResults(finalResults);
      setTotalSum(sum);
      
      // Check win conditions
      let isWin = false;
      let multiplier = 0;
      
      switch (prediction) {
        case 'big':
          isWin = sum >= 11;
          multiplier = 2;
          break;
        case 'small':
          isWin = sum <= 10;
          multiplier = 2;
          break;
        case 'odd':
          isWin = sum % 2 === 1;
          multiplier = 2;
          break;
        case 'even':
          isWin = sum % 2 === 0;
          multiplier = 2;
          break;
      }
      
      const winAmount = isWin ? betAmount * multiplier : 0;
      
      setGameResult({
        sum,
        prediction,
        isWin,
        winAmount,
        multiplier
      });
      
      setIsRolling(false);
    }, rollDuration);
  };

  const renderDie = (value: number, index: number) => {
    const dots = [];
    const dotPositions = {
      1: [[50, 50]],
      2: [[25, 25], [75, 75]],
      3: [[25, 25], [50, 50], [75, 75]],
      4: [[25, 25], [75, 25], [25, 75], [75, 75]],
      5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
      6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]]
    };

    const positions = dotPositions[value] || [];
    
    return (
      <div key={index} className={`dice ${isRolling ? 'rolling' : ''}`}>
        <div className="dice-face">
          {positions.map(([x, y], dotIndex) => (
            <div 
              key={dotIndex}
              className="dice-dot"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-dice-game">
      <div className="game-header">
        <button onClick={onClose} className="back-btn">←</button>
        <h2>Space Dice</h2>
        <div className="balance">₹1000.00</div>
      </div>

      <div className="space-background">
        <div className="stars"></div>
        <div className="planets"></div>
        
        <div className="dice-container">
          <div className="dice-area">
            {diceResults.length > 0 ? (
              diceResults.map((value, index) => renderDie(value, index))
            ) : (
              <>
                {renderDie(1, 0)}
                {renderDie(2, 1)}
                {renderDie(3, 2)}
              </>
            )}
          </div>
          
          {totalSum > 0 && (
            <div className="sum-display">
              <div className="sum-label">Total Sum</div>
              <div className="sum-value">{totalSum}</div>
            </div>
          )}
        </div>
      </div>

      <div className="prediction-section">
        <div className="prediction-title">Make Your Prediction</div>
        <div className="prediction-buttons">
          <button 
            className={`pred-btn big ${prediction === 'big' ? 'selected' : ''}`}
            onClick={() => setPrediction('big')}
            disabled={isRolling}
          >
            <div className="pred-label">BIG</div>
            <div className="pred-range">11-18</div>
            <div className="pred-payout">2:1</div>
          </button>
          
          <button 
            className={`pred-btn small ${prediction === 'small' ? 'selected' : ''}`}
            onClick={() => setPrediction('small')}
            disabled={isRolling}
          >
            <div className="pred-label">SMALL</div>
            <div className="pred-range">3-10</div>
            <div className="pred-payout">2:1</div>
          </button>
          
          <button 
            className={`pred-btn odd ${prediction === 'odd' ? 'selected' : ''}`}
            onClick={() => setPrediction('odd')}
            disabled={isRolling}
          >
            <div className="pred-label">ODD</div>
            <div className="pred-range">Odd Sum</div>
            <div className="pred-payout">2:1</div>
          </button>
          
          <button 
            className={`pred-btn even ${prediction === 'even' ? 'selected' : ''}`}
            onClick={() => setPrediction('even')}
            disabled={isRolling}
          >
            <div className="pred-label">EVEN</div>
            <div className="pred-range">Even Sum</div>
            <div className="pred-payout">2:1</div>
          </button>
        </div>
      </div>

      <div className="game-controls">
        <div className="bet-amount-section">
          <label>Bet Amount</label>
          <div className="amount-input">
            <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))}>-</button>
            <span>₹{betAmount}</span>
            <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
          </div>
        </div>

        <button 
          className="roll-btn"
          onClick={rollDice}
          disabled={!prediction || isRolling}
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </button>
      </div>

      {gameResult && (
        <div className={`result-modal ${gameResult.isWin ? 'win' : 'lose'}`}>
          <h3>{gameResult.isWin ? '🎉 You Win!' : '😞 You Lose!'}</h3>
          <div className="result-details">
            <p>Sum: {gameResult.sum}</p>
            <p>Your prediction: {gameResult.prediction.toUpperCase()}</p>
            {gameResult.isWin ? (
              <p className="win-amount">Won: ₹{gameResult.winAmount}</p>
            ) : (
              <p className="lose-amount">Lost: ₹{betAmount}</p>
            )}
          </div>
          <button onClick={() => setGameResult(null)}>Play Again</button>
        </div>
      )}

      <style jsx>{`
        .space-dice-game {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #000814;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          color: white;
          overflow: hidden;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(0,0,0,0.5);
          position: relative;
          z-index: 10;
        }

        .back-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }

        .space-background {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse at center, #001d3d 0%, #000814 100%);
        }

        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20% 30%, #eee, transparent),
            radial-gradient(2px 2px at 40% 70%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90% 40%, #fff, transparent),
            radial-gradient(1px 1px at 50% 50%, #fff, transparent);
          background-repeat: repeat;
          background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
          animation: sparkle 8s linear infinite;
        }

        @keyframes sparkle {
          from { transform: translateY(0px); }
          to { transform: translateY(-550px); }
        }

        .planets {
          position: absolute;
          top: 20%;
          right: 10%;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #4facfe, #00f2fe);
          opacity: 0.7;
        }

        .dice-container {
          text-align: center;
          z-index: 5;
        }

        .dice-area {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 30px;
        }

        .dice {
          width: 60px;
          height: 60px;
          perspective: 1000px;
        }

        .dice.rolling {
          animation: rollAnimation 0.1s infinite;
        }

        @keyframes rollAnimation {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          25% { transform: rotateX(90deg) rotateY(90deg); }
          50% { transform: rotateX(180deg) rotateY(180deg); }
          75% { transform: rotateX(270deg) rotateY(270deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }

        .dice-face {
          width: 60px;
          height: 60px;
          background: linear-gradient(145deg, #fff 0%, #f0f0f0 100%);
          border: 2px solid #ddd;
          border-radius: 10px;
          position: relative;
          box-shadow: 
            0 0 20px rgba(0,200,255,0.5),
            inset 0 0 20px rgba(255,255,255,0.2);
        }

        .dice-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #333;
          border-radius: 50%;
        }

        .sum-display {
          margin-top: 20px;
        }

        .sum-label {
          font-size: 16px;
          color: #00f2fe;
          margin-bottom: 5px;
        }

        .sum-value {
          font-size: 36px;
          font-weight: bold;
          color: #fff;
          text-shadow: 0 0 20px #00f2fe;
        }

        .prediction-section {
          background: rgba(0,0,0,0.8);
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .prediction-title {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #00f2fe;
        }

        .prediction-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .pred-btn {
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(0,242,254,0.5);
          color: white;
          padding: 15px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
        }

        .pred-btn:hover {
          border-color: #00f2fe;
          background: rgba(0,242,254,0.2);
        }

        .pred-btn.selected {
          border-color: #00f2fe;
          background: rgba(0,242,254,0.3);
          box-shadow: 0 0 20px rgba(0,242,254,0.5);
        }

        .pred-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pred-label {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .pred-range {
          font-size: 12px;
          opacity: 0.8;
          margin-bottom: 3px;
        }

        .pred-payout {
          font-size: 14px;
          color: #00f2fe;
          font-weight: bold;
        }

        .game-controls {
          background: rgba(255,255,255,0.95);
          padding: 20px;
          color: black;
        }

        .bet-amount-section {
          text-align: center;
          margin-bottom: 20px;
        }

        .bet-amount-section label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .amount-input {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        .amount-input button {
          width: 40px;
          height: 40px;
          border: none;
          background: #000814;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
        }

        .amount-input span {
          font-size: 18px;
          font-weight: bold;
          min-width: 80px;
        }

        .roll-btn {
          background: linear-gradient(45deg, #00f2fe, #4facfe);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
          box-shadow: 0 4px 15px rgba(0,242,254,0.3);
        }

        .roll-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .result-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0,0,0,0.9);
          border: 2px solid #00f2fe;
          padding: 30px;
          border-radius: 20px;
          text-align: center;
          color: white;
          min-width: 300px;
          backdrop-filter: blur(10px);
        }

        .result-modal.lose {
          border-color: #ff6b35;
        }

        .result-details p {
          margin: 10px 0;
        }

        .win-amount {
          color: #00f2fe !important;
          font-weight: bold;
          font-size: 18px;
        }

        .lose-amount {
          color: #ff6b35 !important;
          font-weight: bold;
          font-size: 18px;
        }

        .result-modal button {
          background: #00f2fe;
          color: black;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
          margin-top: 15px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};