import { useState, useEffect } from 'react';

interface StandardDragonTigerGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const StandardDragonTigerGame = ({ onClose, refreshBalance }: StandardDragonTigerGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedBets, setSelectedBets] = useState<{[key: string]: number}>({});
  const [gameState, setGameState] = useState<'betting' | 'dealing' | 'result'>('betting');
  const [countdown, setCountdown] = useState(15);
  const [cards, setCards] = useState({ dragon: null, tiger: null });
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState([
    { round: 8745, dragon: 'K♠', tiger: '9♥', winner: 'Dragon', players: 156 },
    { round: 8744, dragon: '7♣', tiger: '7♦', winner: 'Tie', players: 143 },
    { round: 8743, dragon: '3♥', tiger: 'Q♠', winner: 'Tiger', players: 167 }
  ]);
  const [statistics, setStatistics] = useState({
    dragon: 42,
    tiger: 45,
    tie: 13,
    totalHands: 8745
  });
  const [roadMap, setRoadMap] = useState([
    'D', 'T', 'D', 'D', 'T', 'Tie', 'T', 'D', 'T', 'D', 'D', 'T', 'T', 'D', 'Tie'
  ]);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [players, setPlayers] = useState([
    { name: 'Player1', bet: 'Dragon', amount: 500 },
    { name: 'VIP_User', bet: 'Tiger', amount: 2000 },
    { name: 'Lucky777', bet: 'Tie', amount: 100 }
  ]);

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const cardValues = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };

  useEffect(() => {
    let interval: any;
    
    if (gameState === 'betting' && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === 1) {
            startDealing();
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
    return { suit, rank, value: cardValues[rank as keyof typeof cardValues], display: rank + suit };
  };

  const startDealing = () => {
    setGameState('dealing');
    
    setTimeout(() => {
      const dragonCard = generateCard();
      const tigerCard = generateCard();
      
      setCards({ dragon: dragonCard, tiger: tigerCard });
      
      setTimeout(() => {
        showResult(dragonCard, tigerCard);
      }, 1000);
    }, 500);
  };

  const showResult = async (dragon: any, tiger: any) => {
    setGameState('result');
    
    let winner;
    if (dragon.value > tiger.value) winner = 'Dragon';
    else if (tiger.value > dragon.value) winner = 'Tiger';
    else winner = 'Tie';
    
    // Calculate winnings
    let totalWin = 0;
    Object.entries(selectedBets).forEach(([bet, amount]) => {
      if (bet === winner) {
        const multiplier = bet === 'Tie' ? 8 : 1.95;
        totalWin += amount * multiplier;
      }
    });
    
    const totalBet = Object.values(selectedBets).reduce((sum, amount) => sum + amount, 0);
    
    if (totalBet > 0) {
      try {
        const response = await fetch('/api/games/dragon-tiger/play', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer demo_token_' + Date.now()
          },
          body: JSON.stringify({
            betAmount: totalBet,
            betType: Object.keys(selectedBets)[0] || 'dragon'
          })
        });

        if (response.ok) {
          refreshBalance();
        }
      } catch (error) {
        console.error('Game error:', error);
      }
    }
    
    setResult({ winner, totalWin, totalBet });
    
    // Update history and statistics
    const newRound = {
      round: history[0].round + 1,
      dragon: dragon.display,
      tiger: tiger.display,
      winner,
      players: 150 + Math.floor(Math.random() * 50)
    };
    
    setHistory(prev => [newRound, ...prev.slice(0, 19)]);
    setRoadMap(prev => [winner === 'Dragon' ? 'D' : winner === 'Tiger' ? 'T' : 'Tie', ...prev.slice(0, 14)]);
    
    setTimeout(() => {
      setGameState('betting');
      setCountdown(15);
      setSelectedBets({});
      setResult(null);
      setCards({ dragon: null, tiger: null });
    }, 5000);
  };

  const placeBet = (betType: string, amount: number) => {
    if (gameState !== 'betting' || countdown < 3) return;
    
    setSelectedBets(prev => ({
      ...prev,
      [betType]: (prev[betType] || 0) + amount
    }));
  };

  const clearBets = () => {
    setSelectedBets({});
  };

  const getTotalBetAmount = () => {
    return Object.values(selectedBets).reduce((sum, amount) => sum + amount, 0);
  };

  return (
    <div className="standard-dragon-tiger">
      <div className="game-header">
        <button onClick={onClose} className="back-btn">←</button>
        <div className="game-title">
          <span>Dragon Tiger</span>
          <span className="provider">Evolution Gaming</span>
        </div>
        <div className="balance-display">₹8,807.50</div>
      </div>

      <div className="game-layout">
        <div className="main-game">
          <div className="table-area">
            <div className="cards-section">
              <div className="card-area dragon-area">
                <div className="card-label">DRAGON</div>
                <div className="card-display">
                  {cards.dragon ? (
                    <div className={`playing-card ${cards.dragon.suit === '♥' || cards.dragon.suit === '♦' ? 'red' : 'black'}`}>
                      <div className="card-rank">{cards.dragon.rank}</div>
                      <div className="card-suit">{cards.dragon.suit}</div>
                    </div>
                  ) : (
                    <div className="card-back"></div>
                  )}
                </div>
              </div>

              <div className="vs-section">
                <div className="vs-text">VS</div>
                {gameState === 'betting' && (
                  <div className="countdown">{countdown}s</div>
                )}
                {result && (
                  <div className={`winner-announcement ${result.winner.toLowerCase()}`}>
                    {result.winner} WINS!
                  </div>
                )}
              </div>

              <div className="card-area tiger-area">
                <div className="card-label">TIGER</div>
                <div className="card-display">
                  {cards.tiger ? (
                    <div className={`playing-card ${cards.tiger.suit === '♥' || cards.tiger.suit === '♦' ? 'red' : 'black'}`}>
                      <div className="card-rank">{cards.tiger.rank}</div>
                      <div className="card-suit">{cards.tiger.suit}</div>
                    </div>
                  ) : (
                    <div className="card-back"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="betting-area">
              <div 
                className={`bet-zone dragon-zone ${selectedBets.Dragon ? 'has-bet' : ''}`}
                onClick={() => placeBet('Dragon', betAmount)}
              >
                <div className="bet-label">DRAGON</div>
                <div className="bet-odds">1:0.95</div>
                {selectedBets.Dragon && (
                  <div className="bet-chips">₹{selectedBets.Dragon}</div>
                )}
              </div>

              <div 
                className={`bet-zone tie-zone ${selectedBets.Tie ? 'has-bet' : ''}`}
                onClick={() => placeBet('Tie', betAmount)}
              >
                <div className="bet-label">TIE</div>
                <div className="bet-odds">1:8</div>
                {selectedBets.Tie && (
                  <div className="bet-chips">₹{selectedBets.Tie}</div>
                )}
              </div>

              <div 
                className={`bet-zone tiger-zone ${selectedBets.Tiger ? 'has-bet' : ''}`}
                onClick={() => placeBet('Tiger', betAmount)}
              >
                <div className="bet-label">TIGER</div>
                <div className="bet-odds">1:0.95</div>
                {selectedBets.Tiger && (
                  <div className="bet-chips">₹{selectedBets.Tiger}</div>
                )}
              </div>
            </div>
          </div>

          <div className="control-panel">
            <div className="bet-controls">
              <div className="chip-selection">
                <div className="chips">
                  {[10, 50, 100, 500, 1000].map(amount => (
                    <button
                      key={amount}
                      className={`chip chip-${amount} ${betAmount === amount ? 'selected' : ''}`}
                      onClick={() => setBetAmount(amount)}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bet-info">
                <div className="total-bet">
                  Total Bet: ₹{getTotalBetAmount()}
                </div>
                {result && (
                  <div className={`result-info ${result.totalWin > result.totalBet ? 'win' : 'lose'}`}>
                    {result.totalWin > result.totalBet ? 
                      `Won: ₹${result.totalWin - result.totalBet}` : 
                      `Lost: ₹${result.totalBet}`
                    }
                  </div>
                )}
              </div>

              <div className="action-buttons">
                <button 
                  className="clear-btn" 
                  onClick={clearBets}
                  disabled={Object.keys(selectedBets).length === 0}
                >
                  Clear Bets
                </button>
                <button 
                  className="repeat-btn"
                  disabled={gameState !== 'betting'}
                >
                  Repeat Bet
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="side-panel">
          <div className="tabs">
            <button className="tab active">Statistics</button>
            <button className="tab">Roadmap</button>
            <button className="tab">Players</button>
          </div>

          <div className="tab-content">
            <div className="statistics-panel">
              <div className="stats-header">Last {statistics.totalHands} Hands</div>
              <div className="stats-grid">
                <div className="stat-item dragon">
                  <div className="stat-icon">🐉</div>
                  <div className="stat-info">
                    <div className="stat-label">Dragon</div>
                    <div className="stat-value">{statistics.dragon}%</div>
                  </div>
                </div>
                <div className="stat-item tiger">
                  <div className="stat-icon">🐅</div>
                  <div className="stat-info">
                    <div className="stat-label">Tiger</div>
                    <div className="stat-value">{statistics.tiger}%</div>
                  </div>
                </div>
                <div className="stat-item tie">
                  <div className="stat-icon">🤝</div>
                  <div className="stat-info">
                    <div className="stat-label">Tie</div>
                    <div className="stat-value">{statistics.tie}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="roadmap-panel">
              <div className="roadmap-header">Road Map</div>
              <div className="roadmap-grid">
                {roadMap.map((outcome, idx) => (
                  <div key={idx} className={`roadmap-cell ${outcome.toLowerCase()}`}>
                    {outcome === 'Dragon' ? 'D' : outcome === 'Tiger' ? 'T' : 'Tie'}
                  </div>
                ))}
              </div>
            </div>

            <div className="players-panel">
              <div className="players-header">Live Players</div>
              <div className="players-list">
                {players.map((player, idx) => (
                  <div key={idx} className="player-item">
                    <div className="player-name">{player.name}</div>
                    <div className="player-bet">{player.bet} - ₹{player.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="history-section">
            <div className="history-header">Recent Results</div>
            <div className="history-list">
              {history.slice(0, 8).map((game, idx) => (
                <div key={idx} className="history-item">
                  <div className="round-number">#{game.round}</div>
                  <div className="cards-result">
                    <span className="dragon-card">{game.dragon}</span>
                    <span className="vs">vs</span>
                    <span className="tiger-card">{game.tiger}</span>
                  </div>
                  <div className={`winner ${game.winner.toLowerCase()}`}>
                    {game.winner}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .standard-dragon-tiger {
          background: #0d1421;
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #1a2332;
          border-bottom: 1px solid #2d3748;
        }

        .back-btn {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
        }

        .game-title {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .game-title span:first-child {
          font-size: 18px;
          font-weight: bold;
        }

        .provider {
          font-size: 12px;
          color: #718096;
        }

        .balance-display {
          background: #38a169;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: bold;
        }

        .game-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          height: calc(100vh - 70px);
        }

        .main-game {
          display: flex;
          flex-direction: column;
        }

        .table-area {
          flex: 1;
          background: #1a2332;
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .cards-section {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 60px;
          align-items: center;
          margin-bottom: 40px;
        }

        .card-area {
          text-align: center;
        }

        .card-label {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #ffd700;
        }

        .card-display {
          display: flex;
          justify-content: center;
        }

        .playing-card {
          width: 120px;
          height: 180px;
          background: white;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 12px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
          position: relative;
        }

        .playing-card.red {
          color: #dc2626;
        }

        .playing-card.black {
          color: #1f2937;
        }

        .card-rank {
          font-size: 24px;
          font-weight: bold;
          align-self: flex-start;
        }

        .card-suit {
          font-size: 36px;
          align-self: center;
          margin-top: -30px;
        }

        .card-back {
          width: 120px;
          height: 180px;
          background: linear-gradient(45deg, #4299e1, #3182ce);
          border-radius: 12px;
          border: 2px solid #2d3748;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .card-back::before {
          content: '';
          position: absolute;
          inset: 10px;
          border: 2px solid white;
          border-radius: 8px;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 4px,
            rgba(255,255,255,0.1) 4px,
            rgba(255,255,255,0.1) 8px
          );
        }

        .vs-section {
          text-align: center;
        }

        .vs-text {
          font-size: 32px;
          font-weight: bold;
          color: #ffd700;
          margin-bottom: 10px;
        }

        .countdown {
          font-size: 24px;
          color: #f56565;
          font-weight: bold;
          background: rgba(245,101,101,0.2);
          padding: 10px 20px;
          border-radius: 25px;
          border: 2px solid #f56565;
        }

        .winner-announcement {
          font-size: 20px;
          font-weight: bold;
          padding: 15px 25px;
          border-radius: 25px;
          animation: announce 0.5s ease-out;
        }

        .winner-announcement.dragon {
          background: #dc2626;
          color: white;
        }

        .winner-announcement.tiger {
          background: #f59e0b;
          color: white;
        }

        .winner-announcement.tie {
          background: #8b5cf6;
          color: white;
        }

        @keyframes announce {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .betting-area {
          display: grid;
          grid-template-columns: 1fr 200px 1fr;
          gap: 20px;
        }

        .bet-zone {
          background: rgba(255,255,255,0.1);
          border: 3px solid transparent;
          border-radius: 15px;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .bet-zone:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-5px);
        }

        .bet-zone.has-bet {
          border-color: #ffd700;
          background: rgba(255,215,0,0.2);
        }

        .dragon-zone.has-bet {
          border-color: #dc2626;
          background: rgba(220,38,38,0.2);
        }

        .tiger-zone.has-bet {
          border-color: #f59e0b;
          background: rgba(245,158,11,0.2);
        }

        .tie-zone.has-bet {
          border-color: #8b5cf6;
          background: rgba(139,92,246,0.2);
        }

        .bet-label {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .bet-odds {
          font-size: 16px;
          color: #68d391;
          font-weight: bold;
        }

        .bet-chips {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ffd700;
          color: #1a202c;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 14px;
          font-weight: bold;
        }

        .control-panel {
          background: #2d3748;
          padding: 20px;
          border-top: 1px solid #4a5568;
        }

        .bet-controls {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 30px;
          align-items: center;
        }

        .chips {
          display: flex;
          gap: 10px;
        }

        .chip {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 3px solid;
          color: white;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-size: 12px;
        }

        .chip-10 { background: #9f7aea; border-color: #805ad5; }
        .chip-50 { background: #4299e1; border-color: #3182ce; }
        .chip-100 { background: #48bb78; border-color: #38a169; }
        .chip-500 { background: #ed8936; border-color: #dd6b20; }
        .chip-1000 { background: #f56565; border-color: #e53e3e; }

        .chip.selected {
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(255,215,0,0.5);
        }

        .bet-info {
          text-align: center;
        }

        .total-bet {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .result-info.win {
          color: #68d391;
          font-weight: bold;
        }

        .result-info.lose {
          color: #f56565;
          font-weight: bold;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
        }

        .clear-btn,
        .repeat-btn {
          background: #4a5568;
          border: 1px solid #718096;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
        }

        .clear-btn:hover:not(:disabled) {
          background: #e53e3e;
          border-color: #e53e3e;
        }

        .repeat-btn:hover:not(:disabled) {
          background: #38a169;
          border-color: #38a169;
        }

        .clear-btn:disabled,
        .repeat-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .side-panel {
          background: #1a2332;
          border-left: 1px solid #2d3748;
          display: flex;
          flex-direction: column;
        }

        .tabs {
          display: flex;
          background: #2d3748;
        }

        .tab {
          flex: 1;
          background: none;
          border: none;
          color: #a0aec0;
          padding: 15px 8px;
          cursor: pointer;
          font-size: 13px;
          border-bottom: 2px solid transparent;
        }

        .tab.active {
          color: white;
          border-bottom-color: #38a169;
        }

        .tab-content {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
        }

        .stats-header {
          font-weight: bold;
          margin-bottom: 15px;
          color: #a0aec0;
          text-align: center;
        }

        .stats-grid {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #2d3748;
          padding: 15px;
          border-radius: 8px;
        }

        .stat-icon {
          font-size: 24px;
        }

        .stat-info {
          flex: 1;
        }

        .stat-label {
          color: #a0aec0;
          font-size: 14px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: bold;
          color: white;
        }

        .roadmap-header {
          font-weight: bold;
          margin-bottom: 15px;
          color: #a0aec0;
        }

        .roadmap-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 5px;
        }

        .roadmap-cell {
          aspect-ratio: 1;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
        }

        .roadmap-cell.d {
          background: #dc2626;
          color: white;
        }

        .roadmap-cell.t {
          background: #f59e0b;
          color: white;
        }

        .roadmap-cell.tie {
          background: #8b5cf6;
          color: white;
        }

        .players-header {
          font-weight: bold;
          margin-bottom: 15px;
          color: #a0aec0;
        }

        .players-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .player-item {
          background: #2d3748;
          padding: 12px;
          border-radius: 8px;
        }

        .player-name {
          font-weight: bold;
          color: white;
          margin-bottom: 5px;
        }

        .player-bet {
          color: #a0aec0;
          font-size: 14px;
        }

        .history-section {
          border-top: 1px solid #2d3748;
          padding: 15px;
          max-height: 300px;
          overflow-y: auto;
        }

        .history-header {
          font-weight: bold;
          margin-bottom: 15px;
          color: #a0aec0;
        }

        .history-item {
          background: #2d3748;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .round-number {
          color: #718096;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .cards-result {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 14px;
        }

        .vs {
          color: #a0aec0;
          font-size: 12px;
        }

        .winner.dragon {
          color: #dc2626;
          font-weight: bold;
        }

        .winner.tiger {
          color: #f59e0b;
          font-weight: bold;
        }

        .winner.tie {
          color: #8b5cf6;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .game-layout {
            grid-template-columns: 1fr;
          }
          
          .cards-section {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .betting-area {
            grid-template-columns: 1fr;
          }
          
          .bet-controls {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .chips {
            justify-content: center;
          }
          
          .chip {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </div>
  );
};