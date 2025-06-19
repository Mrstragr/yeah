import { useState, useEffect } from 'react';

interface MiniRouletteProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const MiniRoulette = ({ onClose, refreshBalance }: MiniRouletteProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBets, setSelectedBets] = useState<{[key: string]: number}>({});
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const rouletteNumbers = [
    { number: 0, color: 'green' },
    { number: 1, color: 'red' }, { number: 2, color: 'black' }, { number: 3, color: 'red' },
    { number: 4, color: 'black' }, { number: 5, color: 'red' }, { number: 6, color: 'black' },
    { number: 7, color: 'red' }, { number: 8, color: 'black' }, { number: 9, color: 'red' },
    { number: 10, color: 'black' }, { number: 11, color: 'red' }, { number: 12, color: 'black' }
  ];

  const placeBet = (betType: string, value?: number) => {
    const currentAmount = selectedBets[betType] || 0;
    setSelectedBets({
      ...selectedBets,
      [betType]: currentAmount + betAmount
    });
  };

  const clearBets = () => {
    setSelectedBets({});
  };

  const spinRoulette = async () => {
    if (Object.keys(selectedBets).length === 0) {
      alert('Please place at least one bet');
      return;
    }

    setIsSpinning(true);
    setShowResult(false);

    // Generate winning number
    const winning = Math.floor(Math.random() * 13);
    setWinningNumber(winning);

    // Calculate rotation
    const numberAngle = 360 / 13;
    const targetAngle = winning * numberAngle;
    const spinRotation = 1800 + targetAngle; // 5 full rotations + target

    setRotation(spinRotation);

    setTimeout(async () => {
      // Calculate winnings
      let totalWinAmount = 0;
      const winningColor = rouletteNumbers[winning].color;
      const isEven = winning !== 0 && winning % 2 === 0;
      const isOdd = winning !== 0 && winning % 2 === 1;
      const isLow = winning >= 1 && winning <= 6;
      const isHigh = winning >= 7 && winning <= 12;

      // Check each bet
      Object.entries(selectedBets).forEach(([betType, amount]) => {
        let multiplier = 0;

        switch (betType) {
          case `number-${winning}`:
            multiplier = 35; // Direct number hit
            break;
          case 'red':
            if (winningColor === 'red') multiplier = 2;
            break;
          case 'black':
            if (winningColor === 'black') multiplier = 2;
            break;
          case 'green':
            if (winningColor === 'green') multiplier = 35;
            break;
          case 'even':
            if (isEven) multiplier = 2;
            break;
          case 'odd':
            if (isOdd) multiplier = 2;
            break;
          case 'low':
            if (isLow) multiplier = 2;
            break;
          case 'high':
            if (isHigh) multiplier = 2;
            break;
        }

        totalWinAmount += amount * multiplier;
      });

      const totalBetAmount = Object.values(selectedBets).reduce((sum, amount) => sum + amount, 0);

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/games/roulette/play', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            betAmount: totalBetAmount,
            betType: 'multiple',
            betValue: selectedBets,
            winningNumber: winning
          })
        });

        if (response.ok) {
          const result = await response.json();
          setGameResult({
            ...result,
            winAmount: totalWinAmount,
            winningNumber: winning,
            winningColor,
            totalBetAmount,
            isWin: totalWinAmount > 0
          });
          setShowResult(true);
          refreshBalance();
        }
      } catch (error) {
        console.error('Roulette game error:', error);
      }

      setIsSpinning(false);
    }, 4000);
  };

  const resetGame = () => {
    setShowResult(false);
    setGameResult(null);
    setSelectedBets({});
    setWinningNumber(null);
    setRotation(0);
  };

  const totalBetAmount = Object.values(selectedBets).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="roulette-game">
      <div className="roulette-header">
        <h2>🎰 Mini Roulette</h2>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="roulette-wheel-container">
        <div className="wheel-pointer">▼</div>
        <div 
          className="roulette-wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.23, 1, 0.32, 1)' : 'none'
          }}
        >
          {rouletteNumbers.map((num, index) => (
            <div
              key={num.number}
              className={`wheel-number ${num.color}`}
              style={{ transform: `rotate(${index * (360/13)}deg)` }}
            >
              {num.number}
            </div>
          ))}
        </div>
      </div>

      {winningNumber !== null && (
        <div className="winning-display">
          <div className={`winning-number ${rouletteNumbers[winningNumber].color}`}>
            {winningNumber}
          </div>
        </div>
      )}

      {!showResult && (
        <div className="betting-section">
          <div className="bet-controls">
            <div className="chip-selector">
              <h4>Chip Value: ₹{betAmount}</h4>
              <div className="chip-buttons">
                <button onClick={() => setBetAmount(10)} className={betAmount === 10 ? 'selected' : ''}>₹10</button>
                <button onClick={() => setBetAmount(25)} className={betAmount === 25 ? 'selected' : ''}>₹25</button>
                <button onClick={() => setBetAmount(50)} className={betAmount === 50 ? 'selected' : ''}>₹50</button>
                <button onClick={() => setBetAmount(100)} className={betAmount === 100 ? 'selected' : ''}>₹100</button>
              </div>
            </div>

            <div className="number-grid">
              <div className="zero-section">
                <button 
                  className={`number-btn green ${selectedBets['number-0'] ? 'has-bet' : ''}`}
                  onClick={() => placeBet('number-0')}
                >
                  0 {selectedBets['number-0'] && `(₹${selectedBets['number-0']})`}
                </button>
              </div>
              
              <div className="numbers-section">
                {rouletteNumbers.slice(1).map(num => (
                  <button 
                    key={num.number}
                    className={`number-btn ${num.color} ${selectedBets[`number-${num.number}`] ? 'has-bet' : ''}`}
                    onClick={() => placeBet(`number-${num.number}`)}
                  >
                    {num.number} {selectedBets[`number-${num.number}`] && `(₹${selectedBets[`number-${num.number}`]})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="outside-bets">
              <button 
                className={`outside-btn ${selectedBets['red'] ? 'has-bet' : ''}`}
                onClick={() => placeBet('red')}
              >
                Red (2x) {selectedBets['red'] && `₹${selectedBets['red']}`}
              </button>
              <button 
                className={`outside-btn ${selectedBets['black'] ? 'has-bet' : ''}`}
                onClick={() => placeBet('black')}
              >
                Black (2x) {selectedBets['black'] && `₹${selectedBets['black']}`}
              </button>
              <button 
                className={`outside-btn ${selectedBets['even'] ? 'has-bet' : ''}`}
                onClick={() => placeBet('even')}
              >
                Even (2x) {selectedBets['even'] && `₹${selectedBets['even']}`}
              </button>
              <button 
                className={`outside-btn ${selectedBets['odd'] ? 'has-bet' : ''}`}
                onClick={() => placeBet('odd')}
              >
                Odd (2x) {selectedBets['odd'] && `₹${selectedBets['odd']}`}
              </button>
              <button 
                className={`outside-btn ${selectedBets['low'] ? 'has-bet' : ''}`}
                onClick={() => placeBet('low')}
              >
                1-6 (2x) {selectedBets['low'] && `₹${selectedBets['low']}`}
              </button>
              <button 
                className={`outside-btn ${selectedBets['high'] ? 'has-bet' : ''}`}
                onClick={() => placeBet('high')}
              >
                7-12 (2x) {selectedBets['high'] && `₹${selectedBets['high']}`}
              </button>
            </div>

            <div className="bet-summary">
              <div>Total Bets: ₹{totalBetAmount}</div>
              <div className="action-buttons">
                <button onClick={clearBets} className="clear-btn">Clear Bets</button>
                <button 
                  onClick={spinRoulette} 
                  disabled={isSpinning || totalBetAmount === 0}
                  className="spin-btn"
                >
                  {isSpinning ? 'Spinning...' : 'Spin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showResult && gameResult && (
        <div className="result-section">
          <div className={`result-card ${gameResult.isWin ? 'win' : 'lose'}`}>
            <h3>{gameResult.isWin ? '🎉 You Won!' : '😔 House Wins'}</h3>
            <div className="result-details">
              <p>Winning Number: <span className={gameResult.winningColor}>{gameResult.winningNumber}</span></p>
              <p>Total Bet: ₹{gameResult.totalBetAmount}</p>
              {gameResult.isWin ? (
                <p className="win-amount">Won: ₹{gameResult.winAmount}</p>
              ) : (
                <p className="lose-amount">Lost: ₹{gameResult.totalBetAmount}</p>
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
        .roulette-game {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          padding: 20px;
          border-radius: 15px;
          max-width: 500px;
          margin: 0 auto;
          max-height: 90vh;
          overflow-y: auto;
        }

        .roulette-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .roulette-wheel-container {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 15px auto;
        }

        .wheel-pointer {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 20px;
          color: #FFD700;
          z-index: 10;
        }

        .roulette-wheel {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          position: relative;
          border: 3px solid #FFD700;
          background: #333;
        }

        .wheel-number {
          position: absolute;
          width: 15px;
          height: 15px;
          top: 50%;
          left: 50%;
          transform-origin: 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          margin-left: 75px;
          margin-top: -7.5px;
        }

        .wheel-number.red {
          background: #ff4444;
          color: white;
        }

        .wheel-number.black {
          background: #333;
          color: white;
        }

        .wheel-number.green {
          background: #4CAF50;
          color: white;
        }

        .winning-display {
          text-align: center;
          margin: 10px 0;
        }

        .winning-number {
          display: inline-block;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;
          margin: 0 auto;
        }

        .betting-section {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          padding: 15px;
          margin-top: 15px;
        }

        .chip-buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 5px;
          margin: 8px 0;
        }

        .chip-buttons button {
          padding: 6px;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
        }

        .chip-buttons button.selected {
          background: #FFD700;
          color: #333;
        }

        .zero-section {
          margin-bottom: 10px;
        }

        .numbers-section {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          margin-bottom: 10px;
        }

        .number-btn {
          padding: 8px 4px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 4px;
          cursor: pointer;
          font-size: 10px;
          font-weight: bold;
          transition: all 0.2s;
        }

        .number-btn.red {
          background: #ff4444;
          color: white;
        }

        .number-btn.black {
          background: #333;
          color: white;
        }

        .number-btn.green {
          background: #4CAF50;
          color: white;
        }

        .number-btn.has-bet {
          box-shadow: 0 0 8px #FFD700;
        }

        .outside-bets {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 5px;
          margin: 10px 0;
        }

        .outside-btn {
          padding: 8px 4px;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 10px;
          transition: all 0.2s;
        }

        .outside-btn.has-bet {
          background: rgba(255,215,0,0.3);
          border-color: #FFD700;
        }

        .bet-summary {
          margin-top: 15px;
          text-align: center;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }

        .clear-btn, .spin-btn, .play-again-btn {
          padding: 10px;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        }

        .clear-btn {
          background: #666;
          color: white;
        }

        .spin-btn {
          background: #FFD700;
          color: #333;
        }

        .spin-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .result-card {
          text-align: center;
          padding: 15px;
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