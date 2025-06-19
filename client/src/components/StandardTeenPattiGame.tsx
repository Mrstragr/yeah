import { useState, useEffect } from 'react';

interface StandardTeenPattiGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const StandardTeenPattiGame = ({ onClose, refreshBalance }: StandardTeenPattiGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedBets, setSelectedBets] = useState<{[key: string]: number}>({});
  const [gameState, setGameState] = useState<'betting' | 'dealing' | 'result'>('betting');
  const [countdown, setCountdown] = useState(20);
  const [cards, setCards] = useState({ player: [], banker: [] });
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState([
    { round: 4521, player: ['A♠', 'K♥', 'Q♦'], banker: ['J♣', '10♠', '9♥'], winner: 'Player' },
    { round: 4520, player: ['7♣', '8♦', '9♠'], banker: ['A♥', 'A♣', 'A♦'], winner: 'Banker' },
    { round: 4519, player: ['K♠', 'K♥', 'K♦'], banker: ['Q♣', 'Q♠', 'Q♥'], winner: 'Player' }
  ]);
  const [statistics, setStatistics] = useState({
    player: 48,
    banker: 45,
    tie: 7,
    totalHands: 4521
  });
  const [players, setPlayers] = useState([
    { name: 'Player1', bet: 'Player', amount: 1000 },
    { name: 'VIP_User', bet: 'Banker', amount: 5000 },
    { name: 'Lucky777', bet: 'Tie', amount: 500 }
  ]);

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

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
    return rank + suit;
  };

  const generateHand = () => {
    return [generateCard(), generateCard(), generateCard()];
  };

  const getHandValue = (hand: string[]) => {
    let total = 0;
    hand.forEach(card => {
      const rank = card.slice(0, -1);
      if (rank === 'A') total += 1;
      else if (['J', 'Q', 'K'].includes(rank)) total += 10;
      else total += parseInt(rank);
    });
    return total % 10;
  };

  const getHandRank = (hand: string[]) => {
    const ranks = hand.map(card => card.slice(0, -1));
    const suits = hand.map(card => card.slice(-1));
    
    // Check for Three of a Kind
    if (ranks[0] === ranks[1] && ranks[1] === ranks[2]) {
      return { type: 'Trail', rank: 8 };
    }
    
    // Check for Straight Flush
    const isFlush = suits.every(suit => suit === suits[0]);
    const sortedRanks = ranks.map(r => {
      if (r === 'A') return 1;
      if (r === 'J') return 11;
      if (r === 'Q') return 12;
      if (r === 'K') return 13;
      return parseInt(r);
    }).sort((a, b) => a - b);
    
    const isStraight = (sortedRanks[1] === sortedRanks[0] + 1 && sortedRanks[2] === sortedRanks[1] + 1) ||
                     (sortedRanks[0] === 1 && sortedRanks[1] === 12 && sortedRanks[2] === 13);
    
    if (isFlush && isStraight) {
      return { type: 'Straight Flush', rank: 7 };
    }
    
    // Check for Straight
    if (isStraight) {
      return { type: 'Straight', rank: 6 };
    }
    
    // Check for Flush
    if (isFlush) {
      return { type: 'Flush', rank: 5 };
    }
    
    // Check for Pair
    if (ranks[0] === ranks[1] || ranks[1] === ranks[2] || ranks[0] === ranks[2]) {
      return { type: 'Pair', rank: 4 };
    }
    
    // High Card
    return { type: 'High Card', rank: getHandValue(hand) };
  };

  const startDealing = () => {
    setGameState('dealing');
    
    setTimeout(() => {
      const playerHand = generateHand();
      const bankerHand = generateHand();
      
      setCards({ player: playerHand, banker: bankerHand });
      
      setTimeout(() => {
        showResult(playerHand, bankerHand);
      }, 2000);
    }, 1000);
  };

  const showResult = async (playerHand: string[], bankerHand: string[]) => {
    setGameState('result');
    
    const playerRank = getHandRank(playerHand);
    const bankerRank = getHandRank(bankerHand);
    
    let winner;
    if (playerRank.rank > bankerRank.rank) {
      winner = 'Player';
    } else if (bankerRank.rank > playerRank.rank) {
      winner = 'Banker';
    } else {
      winner = 'Tie';
    }
    
    // Calculate winnings
    let totalWin = 0;
    let totalBet = 0;
    
    Object.entries(selectedBets).forEach(([bet, amount]) => {
      totalBet += amount;
      
      if (bet === winner) {
        const multiplier = bet === 'Tie' ? 5.5 : 1.98;
        totalWin += amount * multiplier;
      }
    });
    
    if (totalBet > 0) {
      try {
        const response = await fetch('/api/games/teen-patti/play', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer demo_token_' + Date.now()
          },
          body: JSON.stringify({
            betAmount: totalBet,
            betType: Object.keys(selectedBets)[0] || 'player'
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
      playerHand: { cards: playerHand, rank: playerRank },
      bankerHand: { cards: bankerHand, rank: bankerRank },
      totalWin,
      totalBet
    });
    
    // Update history
    const newRound = {
      round: history[0].round + 1,
      player: playerHand,
      banker: bankerHand,
      winner
    };
    
    setHistory(prev => [newRound, ...prev.slice(0, 19)]);
    
    setTimeout(() => {
      setGameState('betting');
      setCountdown(20);
      setSelectedBets({});
      setResult(null);
      setCards({ player: [], banker: [] });
    }, 8000);
  };

  const placeBet = (betType: string, amount: number) => {
    if (gameState !== 'betting' || countdown < 5) return;
    
    setSelectedBets(prev => ({
      ...prev,
      [betType]: (prev[betType] || 0) + amount
    }));
  };

  const getTotalBet = () => {
    return Object.values(selectedBets).reduce((sum, amount) => sum + amount, 0);
  };

  const getCardColor = (card: string) => {
    const suit = card.slice(-1);
    return suit === '♥' || suit === '♦' ? '#dc2626' : '#1f2937';
  };

  return (
    <div className="standard-teen-patti">
      <div className="game-header">
        <button onClick={onClose} className="back-btn">←</button>
        <div className="game-title">
          <span>Teen Patti</span>
          <span className="provider">Live Casino</span>
        </div>
        <div className="balance-display">₹8,807.50</div>
      </div>

      <div className="game-layout">
        <div className="main-game">
          <div className="table-area">
            <div className="hands-section">
              <div className="hand-area player-area">
                <div className="hand-label">PLAYER</div>
                <div className="cards-display">
                  {cards.player.length > 0 ? (
                    cards.player.map((card, idx) => (
                      <div key={idx} className="playing-card" style={{ color: getCardColor(card) }}>
                        <div className="card-rank">{card.slice(0, -1)}</div>
                        <div className="card-suit">{card.slice(-1)}</div>
                      </div>
                    ))
                  ) : (
                    Array(3).fill(0).map((_, idx) => (
                      <div key={idx} className="card-back"></div>
                    ))
                  )}
                </div>
                {result && (
                  <div className="hand-result">
                    <div className="hand-type">{result.playerHand.rank.type}</div>
                  </div>
                )}
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

              <div className="hand-area banker-area">
                <div className="hand-label">BANKER</div>
                <div className="cards-display">
                  {cards.banker.length > 0 ? (
                    cards.banker.map((card, idx) => (
                      <div key={idx} className="playing-card" style={{ color: getCardColor(card) }}>
                        <div className="card-rank">{card.slice(0, -1)}</div>
                        <div className="card-suit">{card.slice(-1)}</div>
                      </div>
                    ))
                  ) : (
                    Array(3).fill(0).map((_, idx) => (
                      <div key={idx} className="card-back"></div>
                    ))
                  )}
                </div>
                {result && (
                  <div className="hand-result">
                    <div className="hand-type">{result.bankerHand.rank.type}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="betting-table">
              <div 
                className={`bet-area player-bet ${selectedBets.Player ? 'has-bet' : ''}`}
                onClick={() => placeBet('Player', betAmount)}
              >
                <div className="bet-label">PLAYER</div>
                <div className="bet-odds">1:0.98</div>
                {selectedBets.Player && (
                  <div className="bet-chips">₹{selectedBets.Player}</div>
                )}
              </div>

              <div 
                className={`bet-area tie-bet ${selectedBets.Tie ? 'has-bet' : ''}`}
                onClick={() => placeBet('Tie', betAmount)}
              >
                <div className="bet-label">TIE</div>
                <div className="bet-odds">1:5.5</div>
                {selectedBets.Tie && (
                  <div className="bet-chips">₹{selectedBets.Tie}</div>
                )}
              </div>

              <div 
                className={`bet-area banker-bet ${selectedBets.Banker ? 'has-bet' : ''}`}
                onClick={() => placeBet('Banker', betAmount)}
              >
                <div className="bet-label">BANKER</div>
                <div className="bet-odds">1:0.98</div>
                {selectedBets.Banker && (
                  <div className="bet-chips">₹{selectedBets.Banker}</div>
                )}
              </div>
            </div>
          </div>

          <div className="control-panel">
            <div className="chip-selection">
              <div className="chips-label">Bet Amount</div>
              <div className="chips">
                {[50, 100, 500, 1000, 5000].map(amount => (
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
              <div className="total-bet">Total Bet: ₹{getTotalBet()}</div>
              {result && (
                <div className={`result-summary ${result.totalWin > result.totalBet ? 'win' : 'lose'}`}>
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
                onClick={() => setSelectedBets({})}
                disabled={Object.keys(selectedBets).length === 0}
              >
                Clear Bets
              </button>
              <button 
                className="double-btn"
                onClick={() => setSelectedBets(prev => {
                  const doubled = {};
                  Object.entries(prev).forEach(([key, value]) => {
                    doubled[key] = value * 2;
                  });
                  return doubled;
                })}
                disabled={Object.keys(selectedBets).length === 0}
              >
                Double Bet
              </button>
            </div>
          </div>
        </div>

        <div className="side-panel">
          <div className="tabs">
            <button className="tab active">Statistics</button>
            <button className="tab">Players</button>
            <button className="tab">Rules</button>
          </div>

          <div className="tab-content">
            <div className="statistics-panel">
              <div className="stats-header">Last {statistics.totalHands} Hands</div>
              <div className="stats-chart">
                <div className="stat-bar">
                  <div className="stat-label">Player</div>
                  <div className="stat-fill">
                    <div 
                      className="fill player-fill" 
                      style={{ width: `${statistics.player}%` }}
                    ></div>
                  </div>
                  <div className="stat-value">{statistics.player}%</div>
                </div>
                <div className="stat-bar">
                  <div className="stat-label">Banker</div>
                  <div className="stat-fill">
                    <div 
                      className="fill banker-fill" 
                      style={{ width: `${statistics.banker}%` }}
                    ></div>
                  </div>
                  <div className="stat-value">{statistics.banker}%</div>
                </div>
                <div className="stat-bar">
                  <div className="stat-label">Tie</div>
                  <div className="stat-fill">
                    <div 
                      className="fill tie-fill" 
                      style={{ width: `${statistics.tie}%` }}
                    ></div>
                  </div>
                  <div className="stat-value">{statistics.tie}%</div>
                </div>
              </div>
            </div>

            <div className="players-panel">
              <div className="players-header">Live Players</div>
              <div className="players-list">
                {players.map((player, idx) => (
                  <div key={idx} className="player-item">
                    <div className="player-avatar">{player.name.charAt(0)}</div>
                    <div className="player-info">
                      <div className="player-name">{player.name}</div>
                      <div className="player-bet">{player.bet} - ₹{player.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rules-panel">
              <div className="rules-header">How to Play</div>
              <div className="rules-list">
                <div className="rule-item">
                  <h4>Trail (Three of a Kind)</h4>
                  <p>Three cards of the same rank. Highest hand.</p>
                </div>
                <div className="rule-item">
                  <h4>Straight Flush</h4>
                  <p>Three consecutive cards of the same suit.</p>
                </div>
                <div className="rule-item">
                  <h4>Straight</h4>
                  <p>Three consecutive cards of different suits.</p>
                </div>
                <div className="rule-item">
                  <h4>Flush</h4>
                  <p>Three cards of the same suit, not in sequence.</p>
                </div>
                <div className="rule-item">
                  <h4>Pair</h4>
                  <p>Two cards of the same rank.</p>
                </div>
                <div className="rule-item">
                  <h4>High Card</h4>
                  <p>When no other hand is formed.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="history-section">
            <div className="history-header">Recent Results</div>
            <div className="history-list">
              {history.slice(0, 8).map((game, idx) => (
                <div key={idx} className="history-item">
                  <div className="round-number">#{game.round}</div>
                  <div className="round-details">
                    <div className="round-winner">{game.winner}</div>
                    <div className="round-cards">
                      P: {game.player.join(' ')}
                      <br />
                      B: {game.banker.join(' ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .standard-teen-patti {
          background: #0c1426;
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #1a2235;
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
          background: #d69e2e;
          padding: 8px 16px;
          border-radius: 6px;
          color: #1a202c;
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
          padding: 20px;
        }

        .table-area {
          flex: 1;
          background: #1a2235;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 20px;
          border: 2px solid #d69e2e;
        }

        .hands-section {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 40px;
          align-items: center;
          margin-bottom: 40px;
        }

        .hand-area {
          text-align: center;
        }

        .hand-label {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #d69e2e;
        }

        .cards-display {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 10px;
        }

        .playing-card {
          width: 70px;
          height: 100px;
          background: white;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          animation: dealCard 0.5s ease-out;
        }

        @keyframes dealCard {
          0% { transform: translateY(-50px) rotateY(180deg); opacity: 0; }
          100% { transform: translateY(0) rotateY(0deg); opacity: 1; }
        }

        .card-rank {
          font-size: 16px;
          font-weight: bold;
          align-self: flex-start;
        }

        .card-suit {
          font-size: 20px;
          align-self: center;
          margin-top: -10px;
        }

        .card-back {
          width: 70px;
          height: 100px;
          background: linear-gradient(45deg, #4299e1, #3182ce);
          border-radius: 8px;
          border: 2px solid #2d3748;
          position: relative;
          overflow: hidden;
        }

        .card-back::before {
          content: '';
          position: absolute;
          inset: 6px;
          border: 1px solid white;
          border-radius: 4px;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 3px,
            rgba(255,255,255,0.1) 3px,
            rgba(255,255,255,0.1) 6px
          );
        }

        .hand-result {
          margin-top: 10px;
        }

        .hand-type {
          background: #2d3748;
          color: #d69e2e;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: bold;
        }

        .vs-section {
          text-align: center;
        }

        .vs-text {
          font-size: 28px;
          font-weight: bold;
          color: #d69e2e;
          margin-bottom: 10px;
        }

        .countdown {
          font-size: 20px;
          color: #f56565;
          font-weight: bold;
          background: rgba(245,101,101,0.2);
          padding: 8px 16px;
          border-radius: 20px;
          border: 2px solid #f56565;
        }

        .winner-announcement {
          font-size: 18px;
          font-weight: bold;
          padding: 12px 20px;
          border-radius: 20px;
          animation: announce 0.5s ease-out;
        }

        .winner-announcement.player {
          background: #38a169;
          color: white;
        }

        .winner-announcement.banker {
          background: #3182ce;
          color: white;
        }

        .winner-announcement.tie {
          background: #9f7aea;
          color: white;
        }

        @keyframes announce {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .betting-table {
          display: grid;
          grid-template-columns: 1fr 150px 1fr;
          gap: 20px;
        }

        .bet-area {
          background: rgba(255,255,255,0.05);
          border: 3px solid transparent;
          border-radius: 15px;
          padding: 25px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          min-height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .bet-area:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-3px);
        }

        .bet-area.has-bet {
          border-color: #d69e2e;
          background: rgba(214,158,46,0.2);
        }

        .player-bet.has-bet {
          border-color: #38a169;
          background: rgba(56,161,105,0.2);
        }

        .banker-bet.has-bet {
          border-color: #3182ce;
          background: rgba(49,130,206,0.2);
        }

        .tie-bet.has-bet {
          border-color: #9f7aea;
          background: rgba(159,122,234,0.2);
        }

        .bet-label {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .bet-odds {
          font-size: 14px;
          color: #68d391;
          font-weight: bold;
        }

        .bet-chips {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #d69e2e;
          color: #1a202c;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }

        .control-panel {
          background: #2d3748;
          border-radius: 12px;
          padding: 20px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 30px;
          align-items: center;
        }

        .chips-label {
          margin-bottom: 10px;
          font-weight: bold;
          color: #a0aec0;
        }

        .chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .chip {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid;
          color: white;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-size: 10px;
        }

        .chip-50 { background: #9f7aea; border-color: #805ad5; }
        .chip-100 { background: #4299e1; border-color: #3182ce; }
        .chip-500 { background: #48bb78; border-color: #38a169; }
        .chip-1000 { background: #ed8936; border-color: #dd6b20; }
        .chip-5000 { background: #f56565; border-color: #e53e3e; }

        .chip.selected {
          transform: scale(1.15);
          box-shadow: 0 0 20px rgba(214,158,46,0.6);
        }

        .bet-info {
          text-align: center;
        }

        .total-bet {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #d69e2e;
        }

        .result-summary.win {
          color: #68d391;
          font-weight: bold;
        }

        .result-summary.lose {
          color: #f56565;
          font-weight: bold;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .clear-btn,
        .double-btn {
          background: #4a5568;
          border: 1px solid #718096;
          color: white;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
          font-size: 14px;
        }

        .clear-btn:hover:not(:disabled) {
          background: #e53e3e;
          border-color: #e53e3e;
        }

        .double-btn:hover:not(:disabled) {
          background: #38a169;
          border-color: #38a169;
        }

        .clear-btn:disabled,
        .double-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .side-panel {
          background: #1a2235;
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
          border-bottom-color: #d69e2e;
        }

        .tab-content {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
        }

        .stats-header {
          font-weight: bold;
          margin-bottom: 15px;
          color: #d69e2e;
          text-align: center;
        }

        .stats-chart {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .stat-bar {
          display: grid;
          grid-template-columns: 60px 1fr 40px;
          gap: 10px;
          align-items: center;
        }

        .stat-label {
          color: #a0aec0;
          font-size: 14px;
        }

        .stat-fill {
          background: #2d3748;
          height: 20px;
          border-radius: 10px;
          overflow: hidden;
        }

        .fill {
          height: 100%;
          transition: width 0.3s;
        }

        .player-fill { background: #38a169; }
        .banker-fill { background: #3182ce; }
        .tie-fill { background: #9f7aea; }

        .stat-value {
          color: white;
          font-weight: bold;
          font-size: 14px;
        }

        .players-header {
          font-weight: bold;
          margin-bottom: 15px;
          color: #d69e2e;
        }

        .players-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .player-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #2d3748;
          padding: 12px;
          border-radius: 8px;
        }

        .player-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #d69e2e;
          color: #1a202c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .player-info {
          flex: 1;
        }

        .player-name {
          font-weight: bold;
          color: white;
          margin-bottom: 2px;
        }

        .player-bet {
          color: #a0aec0;
          font-size: 12px;
        }

        .rules-header {
          font-weight: bold;
          margin-bottom: 15px;
          color: #d69e2e;
        }

        .rules-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .rule-item h4 {
          color: #68d391;
          margin-bottom: 5px;
          font-size: 14px;
        }

        .rule-item p {
          color: #a0aec0;
          font-size: 12px;
          line-height: 1.4;
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
          color: #d69e2e;
        }

        .history-item {
          background: #2d3748;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 8px;
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 10px;
        }

        .round-number {
          color: #718096;
          font-size: 12px;
          align-self: center;
        }

        .round-winner {
          font-weight: bold;
          color: #d69e2e;
          margin-bottom: 4px;
        }

        .round-cards {
          color: #a0aec0;
          font-size: 10px;
          line-height: 1.3;
        }

        @media (max-width: 768px) {
          .game-layout {
            grid-template-columns: 1fr;
          }
          
          .hands-section {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .betting-table {
            grid-template-columns: 1fr;
          }
          
          .control-panel {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .chips {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};