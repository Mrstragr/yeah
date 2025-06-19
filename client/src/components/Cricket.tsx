import { useState, useEffect } from 'react';

interface CricketProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const Cricket = ({ onClose, refreshBalance }: CricketProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState<'four' | 'six' | 'wicket' | null>(null);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'result'>('betting');
  const [currentBall, setCurrentBall] = useState(0);
  const [totalBalls] = useState(6);
  const [ballResult, setBallResult] = useState<string>('');
  const [gameResult, setGameResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const ballOutcomes = ['dot', 'single', 'double', 'triple', 'four', 'six', 'wicket'];
  const ballOutcomeEmojis = {
    'dot': '🚫',
    'single': '1️⃣',
    'double': '2️⃣', 
    'triple': '3️⃣',
    'four': '🔥',
    'six': '⭐',
    'wicket': '🏏'
  };

  const placeBet = async () => {
    if (!selectedBet || betAmount <= 0) {
      alert('Please select a bet type and amount');
      return;
    }

    setIsLoading(true);
    setGameState('playing');
    setCurrentBall(1);

    // Simulate cricket over
    for (let ball = 1; ball <= totalBalls; ball++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const outcome = ballOutcomes[Math.floor(Math.random() * ballOutcomes.length)];
      setBallResult(outcome);
      setCurrentBall(ball);

      if (outcome === 'wicket' && ball < totalBalls) {
        // End over early on wicket
        await new Promise(resolve => setTimeout(resolve, 1000));
        break;
      }
    }

    // Determine if bet won
    const finalOutcome = ballResult;
    const isWin = finalOutcome === selectedBet;
    const winAmount = isWin ? betAmount * getMultiplier(selectedBet) : 0;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/games/cricket/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          betAmount,
          betType: selectedBet,
          betValue: selectedBet
        })
      });

      if (response.ok) {
        const result = await response.json();
        setGameResult(result);
        setGameState('result');
        refreshBalance();
      }
    } catch (error) {
      console.error('Cricket game error:', error);
    }

    setIsLoading(false);
  };

  const getMultiplier = (betType: string) => {
    switch (betType) {
      case 'four': return 4;
      case 'six': return 6;
      case 'wicket': return 3;
      default: return 2;
    }
  };

  const resetGame = () => {
    setGameState('betting');
    setCurrentBall(0);
    setBallResult('');
    setGameResult(null);
    setSelectedBet(null);
  };

  return (
    <div className="cricket-game">
      <div className="cricket-header">
        <h2>🏏 Cricket</h2>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="cricket-field">
        <div className="pitch">
          <div className="wickets">🏏</div>
          <div className="cricket-ball">🔴</div>
          <div className="batsman">🏃‍♂️</div>
        </div>
      </div>

      {gameState === 'betting' && (
        <div className="betting-section">
          <div className="bet-options">
            <h3>Choose your prediction:</h3>
            <div className="bet-buttons">
              <button 
                className={`bet-btn ${selectedBet === 'four' ? 'selected' : ''}`}
                onClick={() => setSelectedBet('four')}
              >
                🔥 Four (4x)
              </button>
              <button 
                className={`bet-btn ${selectedBet === 'six' ? 'selected' : ''}`}
                onClick={() => setSelectedBet('six')}
              >
                ⭐ Six (6x)
              </button>
              <button 
                className={`bet-btn ${selectedBet === 'wicket' ? 'selected' : ''}`}
                onClick={() => setSelectedBet('wicket')}
              >
                🏏 Wicket (3x)
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

          <button 
            onClick={placeBet} 
            disabled={!selectedBet || isLoading}
            className="play-btn"
          >
            {isLoading ? 'Starting Over...' : 'Start Over'}
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-progress">
          <div className="over-info">
            <h3>Over in Progress</h3>
            <div className="ball-count">Ball {currentBall}/6</div>
          </div>
          
          <div className="current-ball">
            <div className="ball-animation">🔴</div>
            {ballResult && (
              <div className="ball-outcome">
                {ballOutcomeEmojis[ballResult as keyof typeof ballOutcomeEmojis]} {ballResult.toUpperCase()}
              </div>
            )}
          </div>

          <div className="your-bet">
            Your bet: {selectedBet?.toUpperCase()} for ₹{betAmount}
          </div>
        </div>
      )}

      {gameState === 'result' && gameResult && (
        <div className="result-section">
          <div className={`result-card ${gameResult.isWin ? 'win' : 'lose'}`}>
            <h3>{gameResult.isWin ? '🎉 You Won!' : '😔 You Lost'}</h3>
            <div className="result-details">
              <p>Final Ball: {ballResult.toUpperCase()}</p>
              <p>Your Bet: {selectedBet?.toUpperCase()}</p>
              <p>Amount: ₹{betAmount}</p>
              {gameResult.isWin && <p>Winnings: ₹{gameResult.winAmount}</p>}
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
        .cricket-game {
          background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
          color: white;
          padding: 20px;
          border-radius: 15px;
          max-width: 400px;
          margin: 0 auto;
        }

        .cricket-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .cricket-field {
          background: #2E7D32;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
          text-align: center;
        }

        .pitch {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 24px;
        }

        .betting-section, .game-progress, .result-section {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 15px;
        }

        .bet-buttons {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin: 15px 0;
        }

        .bet-btn {
          padding: 12px;
          border: 2px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .bet-btn.selected {
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

        .play-btn, .play-again-btn {
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

        .ball-animation {
          font-size: 40px;
          animation: bounce 1s infinite;
        }

        .ball-outcome {
          font-size: 20px;
          margin-top: 10px;
          font-weight: bold;
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

        .result-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
          60% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};