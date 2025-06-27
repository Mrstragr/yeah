import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface StandardDragonTigerGameProps {
  onClose: () => void;
  refreshBalance: () => Promise<void>;
}

export const StandardDragonTigerGame = ({ onClose, refreshBalance }: StandardDragonTigerGameProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState<'dragon' | 'tiger' | 'tie' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);
  const [gameHistory, setGameHistory] = useState<string[]>(['D', 'T', 'D', 'T', 'D']);
  const [cards, setCards] = useState<{dragon: string, tiger: string} | null>(null);

  const { toast } = useToast();

  const cardSuits = ['♠', '♥', '♦', '♣'];
  const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const getRandomCard = () => {
    const suit = cardSuits[Math.floor(Math.random() * cardSuits.length)];
    const value = cardValues[Math.floor(Math.random() * cardValues.length)];
    return `${value}${suit}`;
  };

  const getCardValue = (card: string) => {
    const value = card.slice(0, -1);
    if (value === 'A') return 1;
    if (value === 'J') return 11;
    if (value === 'Q') return 12;
    if (value === 'K') return 13;
    return parseInt(value);
  };

  const getCardColor = (suit: string) => {
    return suit === '♥' || suit === '♦' ? '#dc2626' : '#000000';
  };

  const playGame = async () => {
    if (!selectedBet) {
      toast({
        title: 'Select a bet',
        description: 'Please choose Dragon, Tiger, or Tie',
        variant: 'destructive',
      });
      return;
    }

    if (betAmount < 1) {
      toast({
        title: 'Invalid Bet',
        description: 'Minimum bet amount is ₹1',
        variant: 'destructive',
      });
      return;
    }

    setIsPlaying(true);
    setCards(null);
    setGameResult(null);

    // Simulate card dealing
    setTimeout(() => {
      const dragonCard = getRandomCard();
      const tigerCard = getRandomCard();
      setCards({ dragon: dragonCard, tiger: tigerCard });

      // Determine winner
      const dragonValue = getCardValue(dragonCard);
      const tigerValue = getCardValue(tigerCard);
      
      let winner: 'dragon' | 'tiger' | 'tie';
      if (dragonValue > tigerValue) {
        winner = 'dragon';
      } else if (tigerValue > dragonValue) {
        winner = 'tiger';
      } else {
        winner = 'tie';
      }

      // Calculate result
      const isWin = selectedBet === winner;
      let multiplier = 1;
      if (isWin) {
        multiplier = selectedBet === 'tie' ? 11 : 2;
      }

      const winAmount = isWin ? betAmount * multiplier : 0;

      const result = {
        isWin,
        winAmount,
        multiplier: isWin ? multiplier : 0,
        cards: { dragon: dragonCard, tiger: tigerCard },
        winner
      };

      setGameResult(result);
      
      // Update history
      setGameHistory(prev => [winner.charAt(0).toUpperCase(), ...prev.slice(0, 9)]);

      if (isWin) {
        toast({
          title: 'Congratulations!',
          description: `You won ₹${winAmount}!`,
        });
      } else {
        toast({
          title: 'Better luck next time',
          description: `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins`,
          variant: 'destructive',
        });
      }

      // Call API
      apiRequest('POST', '/api/games/dragon-tiger/play', {
        betAmount,
        betType: selectedBet
      }).then(async (response) => {
        await refreshBalance();
      }).catch((error) => {
        console.error('API call failed:', error);
      });

    }, 2000);

    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const resetGame = () => {
    setSelectedBet(null);
    setGameResult(null);
    setCards(null);
  };

  const betOptions = [
    {
      id: 'dragon' as const,
      label: 'Dragon',
      color: '#dc2626',
      multiplier: '1:1',
      description: 'Dragon wins'
    },
    {
      id: 'tiger' as const,
      label: 'Tiger',
      color: '#ea580c',
      multiplier: '1:1',
      description: 'Tiger wins'
    },
    {
      id: 'tie' as const,
      label: 'Tie',
      color: '#7c3aed',
      multiplier: '11:1',
      description: 'Both cards equal'
    }
  ];

  return (
    <div className="dragon-tiger-game">
      <div className="game-header">
        <button onClick={onClose} className="back-button">
          ← Back
        </button>
        <h2>Dragon Tiger</h2>
        <div className="balance-display">
          Playing for ₹{betAmount}
        </div>
      </div>

      <div className="game-content">
        {/* Game History */}
        <div className="history-section">
          <h3>Recent Results</h3>
          <div className="history-track">
            {gameHistory.map((result, index) => (
              <div
                key={index}
                className={`history-item ${result === 'D' ? 'dragon' : result === 'T' ? 'tiger' : 'tie'}`}
              >
                {result}
              </div>
            ))}
          </div>
        </div>

        {/* Card Area */}
        <div className="cards-section">
          <div className="card-container dragon-side">
            <h3>🐉 Dragon</h3>
            <div className="card-slot">
              {cards ? (
                <div className="playing-card">
                  <span 
                    className="card-value"
                    style={{ color: getCardColor(cards.dragon.slice(-1)) }}
                  >
                    {cards.dragon}
                  </span>
                </div>
              ) : isPlaying ? (
                <div className="card-back dealing">
                  <div className="card-pattern"></div>
                </div>
              ) : (
                <div className="empty-card">?</div>
              )}
            </div>
          </div>

          <div className="vs-section">
            <div className="vs-text">VS</div>
            {gameResult && (
              <div className="winner-display">
                {gameResult.winner === 'tie' ? 'TIE!' : 
                 gameResult.winner === 'dragon' ? '🐉 WINS!' : '🐅 WINS!'}
              </div>
            )}
          </div>

          <div className="card-container tiger-side">
            <h3>🐅 Tiger</h3>
            <div className="card-slot">
              {cards ? (
                <div className="playing-card">
                  <span 
                    className="card-value"
                    style={{ color: getCardColor(cards.tiger.slice(-1)) }}
                  >
                    {cards.tiger}
                  </span>
                </div>
              ) : isPlaying ? (
                <div className="card-back dealing">
                  <div className="card-pattern"></div>
                </div>
              ) : (
                <div className="empty-card">?</div>
              )}
            </div>
          </div>
        </div>

        {/* Betting Section */}
        <div className="betting-section">
          <div className="bet-amount-controls">
            <label>Bet Amount</label>
            <div className="amount-controls">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min="1"
                max="100000"
                disabled={isPlaying}
                className="amount-input"
              />
              <div className="quick-amounts">
                {[10, 50, 100, 500, 1000].map(amount => (
                  <button
                    key={amount}
                    className={`amount-btn ${betAmount === amount ? 'active' : ''}`}
                    onClick={() => setBetAmount(amount)}
                    disabled={isPlaying}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bet-options">
            <h3>Choose Your Bet</h3>
            <div className="options-grid">
              {betOptions.map(option => (
                <button
                  key={option.id}
                  className={`bet-option ${selectedBet === option.id ? 'selected' : ''}`}
                  style={{ 
                    backgroundColor: option.color,
                    borderColor: selectedBet === option.id ? '#fbbf24' : 'transparent'
                  }}
                  onClick={() => setSelectedBet(option.id)}
                  disabled={isPlaying}
                >
                  <div className="option-label">{option.label}</div>
                  <div className="option-multiplier">{option.multiplier}</div>
                  <div className="option-description">{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="actions-section">
          {!isPlaying && !gameResult ? (
            <button onClick={playGame} className="play-button">
              Place Bet - ₹{betAmount}
            </button>
          ) : isPlaying ? (
            <div className="dealing-status">
              <div className="spinner"></div>
              <span>Dealing cards...</span>
            </div>
          ) : (
            <div className="game-complete">
              <button onClick={resetGame} className="play-again-button">
                Play Again
              </button>
            </div>
          )}
        </div>

        {/* Game Result */}
        {gameResult && (
          <div className="result-display">
            <h3>Game Result</h3>
            <div className="result-info">
              <p>Dragon: {cards?.dragon} (Value: {cards ? getCardValue(cards.dragon) : 0})</p>
              <p>Tiger: {cards?.tiger} (Value: {cards ? getCardValue(cards.tiger) : 0})</p>
              <p>Winner: {gameResult.winner.charAt(0).toUpperCase() + gameResult.winner.slice(1)}</p>
              <p className={gameResult.isWin ? 'win' : 'lose'}>
                {gameResult.isWin ? 
                  `Won ₹${gameResult.winAmount}` : 
                  `Lost ₹${betAmount}`
                }
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .dragon-tiger-game {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          z-index: 1000;
          overflow-y: auto;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.2);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .back-button {
          background: none;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          padding: 8px;
        }

        .balance-display {
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
        }

        .game-content {
          padding: 20px;
        }

        .history-section {
          margin-bottom: 30px;
        }

        .history-section h3 {
          margin-bottom: 15px;
          color: #fbbf24;
          text-align: center;
        }

        .history-track {
          display: flex;
          justify-content: center;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .history-item {
          min-width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        }

        .history-item.dragon {
          background: #dc2626;
        }

        .history-item.tiger {
          background: #ea580c;
        }

        .history-item.tie {
          background: #7c3aed;
        }

        .cards-section {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 20px;
          align-items: center;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .card-container {
          text-align: center;
        }

        .card-container h3 {
          margin-bottom: 15px;
          font-size: 18px;
        }

        .card-slot {
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .playing-card {
          width: 80px;
          height: 110px;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          animation: flipCard 0.5s ease-out;
        }

        @keyframes flipCard {
          0% { transform: rotateY(180deg); }
          100% { transform: rotateY(0deg); }
        }

        .card-back {
          width: 80px;
          height: 110px;
          background: linear-gradient(45deg, #1e40af, #3b82f6);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .card-back.dealing {
          animation: dealCard 1s ease-in-out;
        }

        @keyframes dealCard {
          0% { transform: translateX(-200px) rotate(-90deg); }
          100% { transform: translateX(0) rotate(0deg); }
        }

        .card-pattern {
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.1),
            rgba(255,255,255,0.1) 5px,
            transparent 5px,
            transparent 10px
          );
        }

        .empty-card {
          width: 80px;
          height: 110px;
          background: rgba(255,255,255,0.1);
          border: 2px dashed rgba(255,255,255,0.3);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: rgba(255,255,255,0.5);
        }

        .vs-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .vs-text {
          font-size: 24px;
          font-weight: bold;
          color: #fbbf24;
          text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
        }

        .winner-display {
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          animation: celebration 0.5s ease-out;
        }

        @keyframes celebration {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .betting-section {
          margin-bottom: 30px;
        }

        .bet-amount-controls {
          margin-bottom: 20px;
        }

        .bet-amount-controls label {
          display: block;
          margin-bottom: 10px;
          color: #fbbf24;
          font-weight: 500;
        }

        .amount-controls {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .amount-input {
          padding: 12px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: white;
          font-size: 16px;
          width: 150px;
        }

        .quick-amounts {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .amount-btn {
          padding: 8px 16px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .amount-btn.active {
          background: linear-gradient(45deg, #10b981, #059669);
          border-color: #10b981;
        }

        .bet-options h3 {
          margin-bottom: 15px;
          color: #fbbf24;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
        }

        .bet-option {
          padding: 20px 15px;
          border: 3px solid transparent;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          text-align: center;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .bet-option.selected {
          border-color: #fbbf24;
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
        }

        .option-label {
          font-size: 16px;
          font-weight: bold;
        }

        .option-multiplier {
          font-size: 14px;
          opacity: 0.9;
        }

        .option-description {
          font-size: 12px;
          opacity: 0.8;
        }

        .actions-section {
          margin-bottom: 20px;
        }

        .play-button, .play-again-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(45deg, #10b981, #059669);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .play-button:hover, .play-again-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        }

        .dealing-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          padding: 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          font-size: 16px;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255,255,255,0.3);
          border-left: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .result-display {
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .result-display h3 {
          margin-bottom: 15px;
          color: #fbbf24;
        }

        .result-info p {
          margin: 8px 0;
          font-size: 14px;
        }

        .result-info p.win {
          color: #10b981;
          font-weight: bold;
          font-size: 16px;
        }

        .result-info p.lose {
          color: #dc2626;
          font-weight: bold;
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .cards-section {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .vs-section {
            order: -1;
          }

          .options-grid {
            grid-template-columns: 1fr;
          }

          .amount-controls {
            align-items: center;
          }

          .quick-amounts {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};