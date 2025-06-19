import { useState, useEffect } from 'react';

interface EnhancedDragonTigerGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const EnhancedDragonTigerGame = ({ onClose, refreshBalance }: EnhancedDragonTigerGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedBet, setSelectedBet] = useState<'dragon' | 'tiger' | 'tie' | null>(null);
  const [gameState, setGameState] = useState<'betting' | 'dealing' | 'revealing' | 'ended'>('betting');
  const [countdown, setCountdown] = useState(10);
  const [cards, setCards] = useState({ dragon: null, tiger: null });
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState(['D', 'T', 'D', 'D', 'T', 'Tie', 'T', 'D']);
  const [dealingAnimation, setDealingAnimation] = useState(false);

  const cardValues = {
    'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
  };

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  useEffect(() => {
    let interval: any;
    
    if (gameState === 'betting' && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === 1) {
            startGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameState, countdown]);

  const generateCard = () => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    return { suit, rank, value: cardValues[rank as keyof typeof cardValues] };
  };

  const startGame = () => {
    setGameState('dealing');
    setDealingAnimation(true);
    setCards({ dragon: null, tiger: null });
    
    // Simulate card dealing animation
    setTimeout(() => {
      const dragonCard = generateCard();
      setCards(prev => ({ ...prev, dragon: dragonCard }));
    }, 500);
    
    setTimeout(() => {
      const tigerCard = generateCard();
      setCards(prev => ({ ...prev, tiger: tigerCard }));
    }, 1000);
    
    setTimeout(() => {
      setDealingAnimation(false);
      setGameState('revealing');
      revealResult();
    }, 1500);
  };

  const revealResult = async () => {
    const { dragon, tiger } = cards;
    if (!dragon || !tiger) return;
    
    let winner;
    if (dragon.value > tiger.value) {
      winner = 'dragon';
    } else if (tiger.value > dragon.value) {
      winner = 'tiger';
    } else {
      winner = 'tie';
    }
    
    const isWin = selectedBet === winner;
    let multiplier = 1;
    if (winner === 'tie') multiplier = 8;
    else multiplier = 1.95;
    
    const winAmount = isWin ? betAmount * multiplier : 0;
    
    if (selectedBet) {
      try {
        const response = await fetch('/api/games/dragon-tiger/play', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer demo_token_' + Date.now()
          },
          body: JSON.stringify({
            betAmount,
            betType: selectedBet
          })
        });

        if (response.ok) {
          refreshBalance();
        }
      } catch (error) {
        console.error('Game error:', error);
      }
    }
    
    setResult({
      winner,
      isWin,
      winAmount,
      dragonCard: dragon,
      tigerCard: tiger
    });
    
    setHistory(prev => [winner === 'dragon' ? 'D' : winner === 'tiger' ? 'T' : 'Tie', ...prev.slice(0, 7)]);
    setGameState('ended');
    
    setTimeout(() => {
      setGameState('betting');
      setCountdown(10);
      setSelectedBet(null);
      setResult(null);
      setCards({ dragon: null, tiger: null });
    }, 4000);
  };

  const placeBet = (betType: 'dragon' | 'tiger' | 'tie') => {
    if (gameState !== 'betting') return;
    setSelectedBet(betType);
  };

  const getCardColor = (suit: string) => {
    return suit === '♥' || suit === '♦' ? '#ff4444' : '#333';
  };

  return (
    <div className="enhanced-dragon-tiger-game">
      <div className="game-header">
        <button onClick={onClose} className="close-btn">← Back</button>
        <h2>Dragon Tiger</h2>
        <div className="balance">₹8,807</div>
      </div>

      <div className="game-container">
        <div className="game-table">
          <div className="cards-area">
            <div className="card-section dragon-section">
              <div className="card-label">DRAGON</div>
              <div className={`card-slot ${dealingAnimation ? 'dealing' : ''}`}>
                {cards.dragon ? (
                  <div className="card" style={{ color: getCardColor(cards.dragon.suit) }}>
                    <div className="card-rank">{cards.dragon.rank}</div>
                    <div className="card-suit">{cards.dragon.suit}</div>
                  </div>
                ) : (
                  <div className="card-back">
                    <div className="card-pattern"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="vs-section">
              <div className="vs-text">VS</div>
              {gameState === 'betting' && (
                <div className="countdown-circle">
                  <div className="countdown-number">{countdown}</div>
                </div>
              )}
              {result && (
                <div className={`result-announcement ${result.winner}`}>
                  {result.winner === 'dragon' ? 'DRAGON WINS!' : 
                   result.winner === 'tiger' ? 'TIGER WINS!' : 'TIE!'}
                </div>
              )}
            </div>

            <div className="card-section tiger-section">
              <div className="card-label">TIGER</div>
              <div className={`card-slot ${dealingAnimation ? 'dealing' : ''}`}>
                {cards.tiger ? (
                  <div className="card" style={{ color: getCardColor(cards.tiger.suit) }}>
                    <div className="card-rank">{cards.tiger.rank}</div>
                    <div className="card-suit">{cards.tiger.suit}</div>
                  </div>
                ) : (
                  <div className="card-back">
                    <div className="card-pattern"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="betting-area">
            <div 
              className={`bet-option dragon-bet ${selectedBet === 'dragon' ? 'selected' : ''}`}
              onClick={() => placeBet('dragon')}
            >
              <div className="bet-icon">🐉</div>
              <div className="bet-label">DRAGON</div>
              <div className="bet-payout">1:0.95</div>
            </div>

            <div 
              className={`bet-option tie-bet ${selectedBet === 'tie' ? 'selected' : ''}`}
              onClick={() => placeBet('tie')}
            >
              <div className="bet-icon">🤝</div>
              <div className="bet-label">TIE</div>
              <div className="bet-payout">1:8</div>
            </div>

            <div 
              className={`bet-option tiger-bet ${selectedBet === 'tiger' ? 'selected' : ''}`}
              onClick={() => placeBet('tiger')}
            >
              <div className="bet-icon">🐅</div>
              <div className="bet-label">TIGER</div>
              <div className="bet-payout">1:0.95</div>
            </div>
          </div>
        </div>

        <div className="side-panel">
          <div className="bet-controls">
            <div className="bet-amount-section">
              <label>Bet Amount</label>
              <div className="amount-selector">
                <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))}>-</button>
                <input 
                  type="number" 
                  value={betAmount} 
                  onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 10))}
                />
                <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
              </div>
              <div className="quick-amounts">
                {[100, 500, 1000, 5000].map(amount => (
                  <button 
                    key={amount}
                    className={betAmount === amount ? 'active' : ''}
                    onClick={() => setBetAmount(amount)}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>

            {selectedBet && gameState === 'betting' && (
              <div className="bet-summary">
                <div className="selected-bet">
                  Selected: {selectedBet.toUpperCase()}
                </div>
                <div className="potential-win">
                  Potential Win: ₹{selectedBet === 'tie' ? betAmount * 8 : betAmount * 1.95}
                </div>
              </div>
            )}

            {result && (
              <div className={`game-result ${result.isWin ? 'win' : 'lose'}`}>
                <div className="result-text">
                  {result.isWin ? 'You Won!' : 'You Lost!'}
                </div>
                <div className="result-amount">
                  {result.isWin ? `₹${result.winAmount}` : `₹${betAmount}`}
                </div>
              </div>
            )}
          </div>

          <div className="history-section">
            <div className="history-title">Recent Results</div>
            <div className="history-list">
              {history.map((outcome, index) => (
                <div 
                  key={index} 
                  className={`history-item ${
                    outcome === 'D' ? 'dragon' : outcome === 'T' ? 'tiger' : 'tie'
                  }`}
                >
                  {outcome}
                </div>
              ))}
            </div>
          </div>

          <div className="statistics">
            <div className="stat-title">Statistics</div>
            <div className="stat-row">
              <span>Dragon Wins:</span>
              <span>42%</span>
            </div>
            <div className="stat-row">
              <span>Tiger Wins:</span>
              <span>45%</span>
            </div>
            <div className="stat-row">
              <span>Ties:</span>
              <span>13%</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .enhanced-dragon-tiger-game {
          background: linear-gradient(135deg, #1a5d1a 0%, #2d5016 50%, #8b4513 100%);
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(10px);
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 10px;
          border-radius: 8px;
          transition: background 0.3s;
        }

        .close-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        .balance {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          padding: 10px 20px;
          border-radius: 25px;
          color: #333;
          font-weight: bold;
          font-size: 18px;
        }

        .game-container {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 20px;
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .game-table {
          background: rgba(0,0,0,0.2);
          border-radius: 20px;
          padding: 30px;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255,215,0,0.3);
        }

        .cards-area {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 40px;
          align-items: center;
          margin-bottom: 40px;
        }

        .card-section {
          text-align: center;
        }

        .card-label {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #FFD700;
        }

        .card-slot {
          width: 120px;
          height: 180px;
          margin: 0 auto;
          perspective: 1000px;
        }

        .card-slot.dealing {
          animation: dealCard 0.5s ease-out;
        }

        @keyframes dealCard {
          0% { transform: translateY(-100px) rotateY(180deg); opacity: 0; }
          100% { transform: translateY(0) rotateY(0deg); opacity: 1; }
        }

        .card {
          width: 100%;
          height: 100%;
          background: white;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 10px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
          position: relative;
          animation: cardReveal 0.5s ease-out;
        }

        @keyframes cardReveal {
          0% { transform: rotateY(180deg); }
          100% { transform: rotateY(0deg); }
        }

        .card-rank {
          font-size: 28px;
          font-weight: bold;
          align-self: flex-start;
        }

        .card-suit {
          font-size: 40px;
          align-self: center;
          margin-top: -20px;
        }

        .card-back {
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #4a4a4a, #2a2a2a);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #666;
          position: relative;
          overflow: hidden;
        }

        .card-pattern {
          width: 80%;
          height: 80%;
          background: repeating-linear-gradient(
            45deg,
            #666,
            #666 2px,
            transparent 2px,
            transparent 8px
          );
          border-radius: 8px;
        }

        .vs-section {
          text-align: center;
          position: relative;
        }

        .vs-text {
          font-size: 32px;
          font-weight: bold;
          color: #FFD700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        }

        .countdown-circle {
          width: 80px;
          height: 80px;
          border: 4px solid #FFD700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 20px auto;
          animation: pulse 1s ease-in-out infinite;
        }

        .countdown-number {
          font-size: 32px;
          font-weight: bold;
          color: #FFD700;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .result-announcement {
          font-size: 24px;
          font-weight: bold;
          padding: 15px 25px;
          border-radius: 25px;
          margin: 20px 0;
          animation: announceResult 0.5s ease-out;
        }

        .result-announcement.dragon {
          background: linear-gradient(45deg, #ff6b6b, #ee5a24);
          color: white;
        }

        .result-announcement.tiger {
          background: linear-gradient(45deg, #ffa726, #ff9800);
          color: white;
        }

        .result-announcement.tie {
          background: linear-gradient(45deg, #9c27b0, #673ab7);
          color: white;
        }

        @keyframes announceResult {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .betting-area {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .bet-option {
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 15px;
          padding: 25px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .bet-option:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }

        .bet-option.selected {
          border-color: #FFD700;
          background: rgba(255,215,0,0.2);
          box-shadow: 0 0 30px rgba(255,215,0,0.5);
        }

        .dragon-bet.selected {
          border-color: #ff6b6b;
          background: rgba(255,107,107,0.2);
          box-shadow: 0 0 30px rgba(255,107,107,0.5);
        }

        .tiger-bet.selected {
          border-color: #ffa726;
          background: rgba(255,167,38,0.2);
          box-shadow: 0 0 30px rgba(255,167,38,0.5);
        }

        .tie-bet.selected {
          border-color: #9c27b0;
          background: rgba(156,39,176,0.2);
          box-shadow: 0 0 30px rgba(156,39,176,0.5);
        }

        .bet-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .bet-label {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .bet-payout {
          font-size: 16px;
          color: #4caf50;
          font-weight: bold;
        }

        .side-panel {
          background: rgba(0,0,0,0.2);
          border-radius: 15px;
          padding: 20px;
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .bet-controls {
          background: rgba(0,0,0,0.2);
          border-radius: 10px;
          padding: 20px;
        }

        .bet-amount-section label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .amount-selector {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .amount-selector button {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          padding: 15px 20px;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
        }

        .amount-selector input {
          flex: 1;
          background: none;
          border: none;
          color: white;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          padding: 15px;
        }

        .quick-amounts {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .quick-amounts button {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .quick-amounts button.active,
        .quick-amounts button:hover {
          background: #FFD700;
          color: #333;
          transform: scale(1.05);
        }

        .bet-summary {
          background: rgba(255,215,0,0.1);
          border: 1px solid rgba(255,215,0,0.3);
          border-radius: 10px;
          padding: 15px;
          margin-top: 15px;
        }

        .selected-bet {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .potential-win {
          color: #4caf50;
          font-weight: bold;
        }

        .game-result {
          text-align: center;
          padding: 20px;
          border-radius: 10px;
          margin-top: 15px;
        }

        .game-result.win {
          background: rgba(76,175,80,0.2);
          border: 1px solid #4caf50;
        }

        .game-result.lose {
          background: rgba(244,67,54,0.2);
          border: 1px solid #f44336;
        }

        .result-text {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .result-amount {
          font-size: 24px;
          font-weight: bold;
          color: #FFD700;
        }

        .history-section {
          background: rgba(0,0,0,0.2);
          border-radius: 10px;
          padding: 20px;
        }

        .history-title {
          font-weight: bold;
          margin-bottom: 15px;
          color: #FFD700;
        }

        .history-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .history-item {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
        }

        .history-item.dragon {
          background: #ff6b6b;
          color: white;
        }

        .history-item.tiger {
          background: #ffa726;
          color: white;
        }

        .history-item.tie {
          background: #9c27b0;
          color: white;
        }

        .statistics {
          background: rgba(0,0,0,0.2);
          border-radius: 10px;
          padding: 20px;
        }

        .stat-title {
          font-weight: bold;
          margin-bottom: 15px;
          color: #FFD700;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        @media (max-width: 768px) {
          .game-container {
            grid-template-columns: 1fr;
          }
          
          .cards-area {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .betting-area {
            grid-template-columns: 1fr;
          }
          
          .card-slot {
            width: 100px;
            height: 150px;
          }
        }
      `}</style>
    </div>
  );
};