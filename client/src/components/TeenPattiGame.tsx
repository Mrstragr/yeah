import React, { useState, useEffect } from 'react';

interface TeenPattiGameProps {
  onClose: () => void;
}

export const TeenPattiGame: React.FC<TeenPattiGameProps> = ({ onClose }) => {
  const [betAmount, setBetAmount] = useState(100);
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [gamePhase, setGamePhase] = useState<'betting' | 'dealing' | 'result'>('betting');
  const [gameResult, setGameResult] = useState<any>(null);
  const [playerAction, setPlayerAction] = useState<'fold' | 'play' | null>(null);

  const cardSuits = ['♠', '♥', '♦', '♣'];
  const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const generateCard = () => {
    const suit = cardSuits[Math.floor(Math.random() * cardSuits.length)];
    const value = cardValues[Math.floor(Math.random() * cardValues.length)];
    return `${value}${suit}`;
  };

  const generateHand = () => {
    return [generateCard(), generateCard(), generateCard()];
  };

  const getHandRank = (cards: string[]) => {
    // Simplified Teen Patti hand ranking
    const values = cards.map(card => card.slice(0, -1));
    const suits = cards.map(card => card.slice(-1));
    
    // Check for trio (three of a kind)
    if (values[0] === values[1] && values[1] === values[2]) {
      return { rank: 5, name: 'Trio' };
    }
    
    // Check for pure sequence (straight flush)
    const isFlush = suits.every(suit => suit === suits[0]);
    const sortedValues = values.sort();
    const isSequence = isConsecutive(sortedValues);
    
    if (isFlush && isSequence) {
      return { rank: 4, name: 'Pure Sequence' };
    }
    
    // Check for sequence (straight)
    if (isSequence) {
      return { rank: 3, name: 'Sequence' };
    }
    
    // Check for flush (color)
    if (isFlush) {
      return { rank: 2, name: 'Color' };
    }
    
    // Check for pair
    if (values[0] === values[1] || values[1] === values[2] || values[0] === values[2]) {
      return { rank: 1, name: 'Pair' };
    }
    
    return { rank: 0, name: 'High Card' };
  };

  const isConsecutive = (values: string[]) => {
    const numValues = values.map(v => {
      if (v === 'A') return 1;
      if (v === 'J') return 11;
      if (v === 'Q') return 12;
      if (v === 'K') return 13;
      return parseInt(v);
    });
    
    numValues.sort((a, b) => a - b);
    
    for (let i = 1; i < numValues.length; i++) {
      if (numValues[i] !== numValues[i-1] + 1) {
        return false;
      }
    }
    return true;
  };

  const startGame = () => {
    setGamePhase('dealing');
    setPlayerCards([]);
    setDealerCards([]);
    setGameResult(null);
    setPlayerAction(null);

    // Deal cards with animation
    setTimeout(() => {
      const pCards = generateHand();
      const dCards = generateHand();
      
      setPlayerCards(pCards);
      setDealerCards(dCards);
      setGamePhase('result');
      
      // Determine winner
      const playerRank = getHandRank(pCards);
      const dealerRank = getHandRank(dCards);
      
      let winner = 'dealer';
      if (playerRank.rank > dealerRank.rank) {
        winner = 'player';
      } else if (playerRank.rank === dealerRank.rank) {
        winner = 'tie';
      }
      
      const winAmount = winner === 'player' ? betAmount * 2 : 0;
      
      setGameResult({
        winner,
        playerRank,
        dealerRank,
        winAmount,
        isWin: winner === 'player'
      });
    }, 2000);
  };

  const renderCard = (card: string, isHidden = false) => {
    if (isHidden) {
      return (
        <div className="card card-back">
          <div className="card-pattern">🂠</div>
        </div>
      );
    }

    const suit = card.slice(-1);
    const value = card.slice(0, -1);
    const isRed = suit === '♥' || suit === '♦';

    return (
      <div className={`card ${isRed ? 'red' : 'black'}`}>
        <div className="card-value">{value}</div>
        <div className="card-suit">{suit}</div>
      </div>
    );
  };

  return (
    <div className="teen-patti-game">
      <div className="game-header">
        <button onClick={onClose} className="back-btn">←</button>
        <h2>Teen Patti</h2>
        <div className="balance">₹1000.00</div>
      </div>

      <div className="game-table">
        <div className="dealer-section">
          <div className="dealer-label">Dealer</div>
          <div className="cards-container">
            {gamePhase === 'betting' ? (
              <div className="card-placeholder">Ready to deal</div>
            ) : (
              dealerCards.map((card, index) => (
                <div key={index} className="card-wrapper">
                  {renderCard(card, gamePhase === 'dealing')}
                </div>
              ))
            )}
          </div>
          {gameResult && (
            <div className="hand-rank">{gameResult.dealerRank.name}</div>
          )}
        </div>

        <div className="vs-divider">VS</div>

        <div className="player-section">
          <div className="player-label">You</div>
          <div className="cards-container">
            {gamePhase === 'betting' ? (
              <div className="card-placeholder">Place your bet</div>
            ) : (
              playerCards.map((card, index) => (
                <div key={index} className="card-wrapper">
                  {renderCard(card)}
                </div>
              ))
            )}
          </div>
          {gameResult && (
            <div className="hand-rank">{gameResult.playerRank.name}</div>
          )}
        </div>
      </div>

      <div className="game-controls">
        <div className="bet-section">
          <label>Bet Amount</label>
          <div className="amount-input">
            <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))}>-</button>
            <span>₹{betAmount}</span>
            <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
          </div>
        </div>

        {gamePhase === 'betting' && (
          <button className="play-btn" onClick={startGame}>
            Deal Cards
          </button>
        )}

        {gamePhase === 'dealing' && (
          <div className="dealing-message">Dealing cards...</div>
        )}

        {gameResult && (
          <div className="result-section">
            <div className={`result-message ${gameResult.isWin ? 'win' : 'lose'}`}>
              {gameResult.winner === 'player' && '🎉 You Win!'}
              {gameResult.winner === 'dealer' && '😞 Dealer Wins'}
              {gameResult.winner === 'tie' && '🤝 It\'s a Tie!'}
            </div>
            {gameResult.isWin && (
              <div className="win-amount">Won: ₹{gameResult.winAmount}</div>
            )}
            <button className="play-again-btn" onClick={() => setGamePhase('betting')}>
              Play Again
            </button>
          </div>
        )}
      </div>

      <style>{`
        .teen-patti-game {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%);
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

        .game-table {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          padding: 20px;
        }

        .dealer-section, .player-section {
          text-align: center;
        }

        .dealer-label, .player-label {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .cards-container {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 10px;
        }

        .card-wrapper {
          perspective: 1000px;
        }

        .card {
          width: 60px;
          height: 90px;
          background: white;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          transition: transform 0.3s;
        }

        .card.red {
          color: #DC143C;
        }

        .card.black {
          color: #000;
        }

        .card-back {
          background: #1a365d;
          color: #4a90e2;
        }

        .card-value {
          font-size: 16px;
          font-weight: bold;
        }

        .card-suit {
          font-size: 20px;
        }

        .card-pattern {
          font-size: 30px;
        }

        .card-placeholder {
          width: 200px;
          height: 90px;
          border: 2px dashed rgba(255,255,255,0.5);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.7);
        }

        .hand-rank {
          font-size: 14px;
          color: #FFD700;
          font-weight: bold;
        }

        .vs-divider {
          font-size: 24px;
          font-weight: bold;
          color: #FFD700;
          margin: 20px 0;
        }

        .game-controls {
          background: rgba(255,255,255,0.95);
          padding: 20px;
          color: black;
        }

        .bet-section {
          text-align: center;
          margin-bottom: 20px;
        }

        .bet-section label {
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
          background: #2C5364;
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

        .play-btn, .play-again-btn {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
        }

        .dealing-message {
          text-align: center;
          font-size: 18px;
          color: #FFD700;
          font-weight: bold;
        }

        .result-section {
          text-align: center;
        }

        .result-message {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .result-message.win {
          color: #4CAF50;
        }

        .result-message.lose {
          color: #f44336;
        }

        .win-amount {
          font-size: 20px;
          color: #4CAF50;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .play-again-btn {
          background: #2196F3;
        }
      `}</style>
    </div>
  );
};