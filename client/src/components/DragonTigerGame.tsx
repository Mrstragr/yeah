import { useState, useEffect } from 'react';

interface DragonTigerGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const DragonTigerGame = ({ onClose, refreshBalance }: DragonTigerGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'betting' | 'revealing' | 'finished'>('betting');
  const [cards, setCards] = useState<{ dragon: number | null; tiger: number | null }>({ dragon: null, tiger: null });
  const [result, setResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [roundNumber, setRoundNumber] = useState(1001);
  const [history, setHistory] = useState(['Dragon', 'Tiger', 'Tie', 'Dragon', 'Tiger']);

  const cardNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const suits = ['♠️', '♥️', '♦️', '♣️'];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          if (gameState === 'betting') {
            startRound();
          }
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const startRound = () => {
    if (!selectedBet) return;

    setGameState('revealing');
    
    // Generate random cards
    const dragonCard = Math.floor(Math.random() * 13) + 1;
    const tigerCard = Math.floor(Math.random() * 13) + 1;
    
    setTimeout(() => {
      setCards({ dragon: dragonCard, tiger: tigerCard });
      
      setTimeout(() => {
        finishRound(dragonCard, tigerCard);
      }, 2000);
    }, 1000);
  };

  const finishRound = async (dragonCard: number, tigerCard: number) => {
    let winner: string;
    let winMultiplier = 0;
    
    if (dragonCard > tigerCard) {
      winner = 'dragon';
    } else if (tigerCard > dragonCard) {
      winner = 'tiger';
    } else {
      winner = 'tie';
    }

    const isWin = selectedBet === winner;
    if (isWin) {
      winMultiplier = winner === 'tie' ? 8 : 2;
    }

    try {
      const response = await fetch('/api/games/dragon-tiger/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo_token_1750315135559'
        },
        body: JSON.stringify({
          betAmount,
          betType: selectedBet
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        setResult({
          isWin,
          winner,
          winAmount: isWin ? betAmount * winMultiplier : 0,
          dragonCard,
          tigerCard
        });

        setHistory(prev => [winner.charAt(0).toUpperCase() + winner.slice(1), ...prev.slice(0, 4)]);
        refreshBalance();
      }
    } catch (error) {
      console.error('Dragon Tiger error:', error);
    }

    setGameState('finished');
    
    setTimeout(() => {
      setGameState('betting');
      setCards({ dragon: null, tiger: null });
      setSelectedBet(null);
      setResult(null);
      setRoundNumber(prev => prev + 1);
      setTimeLeft(15);
    }, 4000);
  };

  const getCardDisplay = (cardValue: number | null) => {
    if (!cardValue) return { name: '?', suit: '' };
    const suit = suits[Math.floor(Math.random() * suits.length)];
    return { name: cardNames[cardValue - 1], suit };
  };

  const placeBet = (betType: string) => {
    if (gameState !== 'betting') return;
    setSelectedBet(betType);
  };

  return (
    <div className="dragon-tiger-game">
      <div className="game-header">
        <button onClick={onClose} className="back-btn">←</button>
        <h2>Dragon Tiger</h2>
        <div className="round-info">
          <span>Round #{roundNumber}</span>
          <span className={`timer ${timeLeft <= 5 ? 'warning' : ''}`}>{timeLeft}s</span>
        </div>
      </div>

      <div className="game-history">
        <span>Recent: </span>
        {history.map((outcome, idx) => (
          <span key={idx} className={`history-item ${outcome.toLowerCase()}`}>
            {outcome.charAt(0)}
          </span>
        ))}
      </div>

      <div className="game-area">
        <div className="card-section">
          <div className="dragon-side">
            <h3>🐉 Dragon</h3>
            <div className={`card ${cards.dragon ? 'revealed' : ''}`}>
              {cards.dragon ? (
                <div className="card-content">
                  <span className="card-value">{getCardDisplay(cards.dragon).name}</span>
                  <span className="card-suit">{getCardDisplay(cards.dragon).suit}</span>
                </div>
              ) : (
                <div className="card-back">🎴</div>
              )}
            </div>
          </div>

          <div className="vs-section">
            <div className="vs-text">VS</div>
            {result && (
              <div className={`result-indicator ${result.winner}`}>
                {result.winner === 'tie' ? 'TIE' : result.winner.toUpperCase() + ' WINS'}
              </div>
            )}
          </div>

          <div className="tiger-side">
            <h3>🐅 Tiger</h3>
            <div className={`card ${cards.tiger ? 'revealed' : ''}`}>
              {cards.tiger ? (
                <div className="card-content">
                  <span className="card-value">{getCardDisplay(cards.tiger).name}</span>
                  <span className="card-suit">{getCardDisplay(cards.tiger).suit}</span>
                </div>
              ) : (
                <div className="card-back">🎴</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="betting-section">
        <div className="bet-amount-selector">
          <label>Bet Amount</label>
          <div className="amount-buttons">
            {[50, 100, 500, 1000].map(amount => (
              <button 
                key={amount}
                className={`amount-btn ${betAmount === amount ? 'selected' : ''}`}
                onClick={() => setBetAmount(amount)}
                disabled={gameState !== 'betting'}
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>

        <div className="betting-options">
          <button 
            className={`bet-option dragon ${selectedBet === 'dragon' ? 'selected' : ''}`}
            onClick={() => placeBet('dragon')}
            disabled={gameState !== 'betting' || timeLeft <= 3}
          >
            <div className="bet-label">🐉 Dragon</div>
            <div className="bet-payout">1:2</div>
            {selectedBet === 'dragon' && <div className="bet-amount-display">₹{betAmount}</div>}
          </button>

          <button 
            className={`bet-option tie ${selectedBet === 'tie' ? 'selected' : ''}`}
            onClick={() => placeBet('tie')}
            disabled={gameState !== 'betting' || timeLeft <= 3}
          >
            <div className="bet-label">🤝 Tie</div>
            <div className="bet-payout">1:8</div>
            {selectedBet === 'tie' && <div className="bet-amount-display">₹{betAmount}</div>}
          </button>

          <button 
            className={`bet-option tiger ${selectedBet === 'tiger' ? 'selected' : ''}`}
            onClick={() => placeBet('tiger')}
            disabled={gameState !== 'betting' || timeLeft <= 3}
          >
            <div className="bet-label">🐅 Tiger</div>
            <div className="bet-payout">1:2</div>
            {selectedBet === 'tiger' && <div className="bet-amount-display">₹{betAmount}</div>}
          </button>
        </div>

        {result && (
          <div className={`result-popup ${result.isWin ? 'win' : 'lose'}`}>
            <h3>{result.isWin ? 'You Win!' : 'You Lose!'}</h3>
            <p>Result: {result.winner.charAt(0).toUpperCase() + result.winner.slice(1)}</p>
            <p>Dragon: {getCardDisplay(result.dragonCard).name} | Tiger: {getCardDisplay(result.tigerCard).name}</p>
            {result.isWin && <p className="win-amount">Won: ₹{result.winAmount}</p>}
          </div>
        )}
      </div>

      <style jsx>{`
        .dragon-tiger-game {
          background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%);
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: rgba(0,0,0,0.3);
        }

        .back-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }

        .game-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .round-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .timer {
          background: #4CAF50;
          padding: 5px 10px;
          border-radius: 15px;
          font-weight: bold;
        }

        .timer.warning {
          background: #ff4444;
          animation: pulse 1s ease infinite;
        }

        .game-history {
          padding: 15px 20px;
          background: rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .history-item {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
        }

        .history-item.dragon {
          background: #FF6B6B;
        }

        .history-item.tiger {
          background: #4ECDC4;
        }

        .history-item.tie {
          background: #FFD93D;
          color: #333;
        }

        .game-area {
          padding: 30px 20px;
        }

        .card-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 400px;
          margin: 0 auto;
        }

        .dragon-side, .tiger-side {
          text-align: center;
        }

        .dragon-side h3, .tiger-side h3 {
          margin: 0 0 15px 0;
          font-size: 18px;
        }

        .card {
          width: 80px;
          height: 120px;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: transform 0.5s ease;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }

        .card.revealed {
          transform: rotateY(180deg);
        }

        .card-back {
          font-size: 40px;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #333;
        }

        .card-value {
          font-size: 24px;
          font-weight: bold;
        }

        .card-suit {
          font-size: 20px;
        }

        .vs-section {
          text-align: center;
          margin: 0 20px;
        }

        .vs-text {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .result-indicator {
          padding: 8px 12px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 12px;
          animation: fadeIn 0.5s ease;
        }

        .result-indicator.dragon {
          background: #FF6B6B;
        }

        .result-indicator.tiger {
          background: #4ECDC4;
        }

        .result-indicator.tie {
          background: #FFD93D;
          color: #333;
        }

        .betting-section {
          padding: 20px;
          background: rgba(255,255,255,0.1);
          margin: 20px;
          border-radius: 15px;
        }

        .bet-amount-selector {
          margin-bottom: 20px;
        }

        .bet-amount-selector label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .amount-buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .amount-btn {
          background: rgba(255,255,255,0.1);
          border: 2px solid transparent;
          color: white;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .amount-btn.selected {
          border-color: #FFD700;
          background: rgba(255,215,0,0.2);
        }

        .amount-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .betting-options {
          display: flex;
          gap: 10px;
        }

        .bet-option {
          flex: 1;
          background: rgba(255,255,255,0.1);
          border: 3px solid transparent;
          color: white;
          padding: 20px 10px;
          border-radius: 12px;
          cursor: pointer;
          text-align: center;
          transition: all 0.3s;
          position: relative;
        }

        .bet-option.dragon {
          background: linear-gradient(135deg, #FF6B6B, #ff5252);
        }

        .bet-option.tiger {
          background: linear-gradient(135deg, #4ECDC4, #26A69A);
        }

        .bet-option.tie {
          background: linear-gradient(135deg, #FFD93D, #FFC107);
          color: #333;
        }

        .bet-option.selected {
          border-color: #FFD700;
          transform: scale(1.05);
        }

        .bet-option:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .bet-label {
          font-weight: bold;
          margin-bottom: 8px;
        }

        .bet-payout {
          font-size: 12px;
          opacity: 0.9;
        }

        .bet-amount-display {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #FFD700;
          color: #333;
          padding: 4px 8px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: bold;
        }

        .result-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          color: #333;
          padding: 30px;
          border-radius: 15px;
          text-align: center;
          z-index: 1000;
          animation: slideUp 0.5s ease;
        }

        .result-popup.win {
          border: 3px solid #4CAF50;
        }

        .result-popup.lose {
          border: 3px solid #f44336;
        }

        .result-popup h3 {
          margin: 0 0 15px 0;
          font-size: 20px;
        }

        .result-popup p {
          margin: 8px 0;
        }

        .win-amount {
          color: #4CAF50;
          font-weight: bold;
          font-size: 18px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translate(-50%, 100%); }
          to { transform: translate(-50%, -50%); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};