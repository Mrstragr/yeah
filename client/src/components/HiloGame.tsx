import React, { useState, useEffect } from 'react';

interface HiloGameProps {
  onClose: () => void;
}

export const HiloGame: React.FC<HiloGameProps> = ({ onClose }) => {
  const [betAmount, setBetAmount] = useState(100);
  const [currentCard, setCurrentCard] = useState<number>(7);
  const [nextCard, setNextCard] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<'higher' | 'lower' | null>(null);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalWinnings, setTotalWinnings] = useState(0);

  const cardNames = {
    1: 'A', 11: 'J', 12: 'Q', 13: 'K'
  };

  const getCardName = (num: number) => cardNames[num] || num.toString();

  const getMultiplier = (current: number, prediction: 'higher' | 'lower') => {
    const cardsAbove = prediction === 'higher' ? (13 - current) : (current - 1);
    const probability = cardsAbove / 12; // Excluding current card
    return Math.max(1.1, (0.9 / probability));
  };

  const playRound = async () => {
    if (!prediction) return;
    
    setIsPlaying(true);
    
    setTimeout(() => {
      const newCard = Math.floor(Math.random() * 13) + 1;
      setNextCard(newCard);
      
      let isWin = false;
      if (prediction === 'higher' && newCard > currentCard) isWin = true;
      if (prediction === 'lower' && newCard < currentCard) isWin = true;
      
      const multiplier = getMultiplier(currentCard, prediction);
      const winAmount = isWin ? betAmount * multiplier : 0;
      
      if (isWin) {
        setStreak(prev => prev + 1);
        setTotalWinnings(prev => prev + winAmount);
      } else {
        setStreak(0);
        setTotalWinnings(0);
      }
      
      setGameResult({
        isWin,
        winAmount,
        multiplier,
        nextCard: newCard
      });
      
      setIsPlaying(false);
    }, 1500);
  };

  const continueGame = () => {
    setCurrentCard(nextCard!);
    setNextCard(null);
    setGameResult(null);
    setPrediction(null);
    setBetAmount(Math.floor(totalWinnings || betAmount));
  };

  const cashOut = () => {
    // Cash out logic here
    setGameResult(null);
    setStreak(0);
    setTotalWinnings(0);
    newGame();
  };

  const newGame = () => {
    setCurrentCard(Math.floor(Math.random() * 13) + 1);
    setNextCard(null);
    setGameResult(null);
    setPrediction(null);
    setStreak(0);
    setTotalWinnings(0);
  };

  return (
    <div className="hilo-game">
      <div className="game-header">
        <button onClick={onClose} className="back-btn">←</button>
        <h2>Hi-Lo Cards</h2>
        <div className="balance">₹1000.00</div>
      </div>

      <div className="game-stats">
        <div className="stat">
          <div className="stat-label">Streak</div>
          <div className="stat-value">{streak}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Total Winnings</div>
          <div className="stat-value">₹{totalWinnings.toFixed(2)}</div>
        </div>
      </div>

      <div className="cards-container">
        <div className="current-card">
          <div className="card">
            <div className="card-value">{getCardName(currentCard)}</div>
            <div className="card-suit">♠</div>
          </div>
          <div className="card-label">Current Card</div>
        </div>

        <div className="vs-divider">VS</div>

        <div className="next-card">
          <div className={`card ${nextCard ? 'revealed' : 'hidden'}`}>
            {nextCard ? (
              <>
                <div className="card-value">{getCardName(nextCard)}</div>
                <div className="card-suit">♥</div>
              </>
            ) : (
              <div className="card-back">?</div>
            )}
          </div>
          <div className="card-label">Next Card</div>
        </div>
      </div>

      <div className="prediction-section">
        <div className="prediction-buttons">
          <button 
            className={`prediction-btn higher ${prediction === 'higher' ? 'selected' : ''}`}
            onClick={() => setPrediction('higher')}
            disabled={isPlaying || gameResult}
          >
            <div className="btn-icon">📈</div>
            <div className="btn-label">HIGHER</div>
            <div className="btn-multiplier">{getMultiplier(currentCard, 'higher').toFixed(2)}x</div>
          </button>
          
          <button 
            className={`prediction-btn lower ${prediction === 'lower' ? 'selected' : ''}`}
            onClick={() => setPrediction('lower')}
            disabled={isPlaying || gameResult}
          >
            <div className="btn-icon">📉</div>
            <div className="btn-label">LOWER</div>
            <div className="btn-multiplier">{getMultiplier(currentCard, 'lower').toFixed(2)}x</div>
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

        {!gameResult ? (
          <button 
            className="play-btn"
            onClick={playRound}
            disabled={!prediction || isPlaying}
          >
            {isPlaying ? 'Revealing...' : 'Reveal Card'}
          </button>
        ) : (
          <div className="result-actions">
            {gameResult.isWin ? (
              <>
                <button className="continue-btn" onClick={continueGame}>
                  Continue (₹{Math.floor(totalWinnings || betAmount)})
                </button>
                <button className="cashout-btn" onClick={cashOut}>
                  Cash Out (₹{totalWinnings.toFixed(2)})
                </button>
              </>
            ) : (
              <button className="new-game-btn" onClick={newGame}>
                New Game
              </button>
            )}
          </div>
        )}
      </div>

      {gameResult && (
        <div className={`result-modal ${gameResult.isWin ? 'win' : 'lose'}`}>
          <h3>{gameResult.isWin ? '🎉 Correct!' : '😞 Wrong!'}</h3>
          <div className="result-details">
            <p>Your prediction: {prediction?.toUpperCase()}</p>
            <p>Cards: {getCardName(currentCard)} → {getCardName(gameResult.nextCard)}</p>
            {gameResult.isWin ? (
              <p className="win-amount">Won: ₹{gameResult.winAmount.toFixed(2)}</p>
            ) : (
              <p className="lose-amount">Lost: ₹{betAmount}</p>
            )}
          </div>
        </div>
      )}

      <style>{`
        .hilo-game {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
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
          background: rgba(0,0,0,0.3);
        }

        .back-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }

        .game-stats {
          display: flex;
          justify-content: space-around;
          padding: 15px;
          background: rgba(255,255,255,0.1);
        }

        .stat {
          text-align: center;
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.8;
        }

        .stat-value {
          font-size: 18px;
          font-weight: bold;
        }

        .cards-container {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 40px 20px;
          flex: 1;
        }

        .current-card, .next-card {
          text-align: center;
        }

        .card {
          width: 100px;
          height: 140px;
          background: white;
          border-radius: 15px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: black;
          font-weight: bold;
          margin-bottom: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .card.hidden {
          background: #333;
          color: white;
        }

        .card-value {
          font-size: 32px;
        }

        .card-suit {
          font-size: 24px;
          margin-top: 10px;
        }

        .card-back {
          font-size: 48px;
          color: #666;
        }

        .card-label {
          font-size: 14px;
          opacity: 0.8;
        }

        .vs-divider {
          font-size: 24px;
          font-weight: bold;
        }

        .card.revealed {
          animation: flipCard 0.6s ease-in-out;
        }

        @keyframes flipCard {
          0% { transform: rotateY(180deg); }
          100% { transform: rotateY(0deg); }
        }

        .prediction-section {
          padding: 20px;
        }

        .prediction-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .prediction-btn {
          flex: 1;
          max-width: 150px;
          padding: 20px 15px;
          border: 2px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: white;
          border-radius: 15px;
          cursor: pointer;
          text-align: center;
          transition: all 0.3s;
        }

        .prediction-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .prediction-btn.selected {
          border-color: #4CAF50;
          background: rgba(76, 175, 80, 0.3);
        }

        .prediction-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-icon {
          font-size: 24px;
          margin-bottom: 5px;
        }

        .btn-label {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .btn-multiplier {
          font-size: 14px;
          color: #FFD700;
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
          background: #1e3c72;
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

        .play-btn, .continue-btn, .cashout-btn, .new-game-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-bottom: 10px;
        }

        .play-btn {
          background: #4CAF50;
          color: white;
        }

        .continue-btn {
          background: #2196F3;
          color: white;
        }

        .cashout-btn {
          background: #FF9800;
          color: white;
        }

        .new-game-btn {
          background: #9C27B0;
          color: white;
        }

        .play-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .result-actions {
          display: flex;
          gap: 10px;
        }

        .result-actions button {
          flex: 1;
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
          color: black;
          min-width: 300px;
        }

        .result-modal.lose {
          border-color: #f44336;
        }

        .result-details p {
          margin: 10px 0;
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
      `}</style>
    </div>
  );
};