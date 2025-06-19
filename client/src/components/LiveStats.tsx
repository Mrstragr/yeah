import { useState, useEffect } from 'react';

interface LiveStatsProps {
  onClose: () => void;
}

export const LiveStats = ({ onClose }: LiveStatsProps) => {
  const [stats, setStats] = useState({
    totalPlayers: 1247,
    totalBets: 8934,
    bigWinners: [
      { name: 'User***123', amount: 15430, game: 'WinGo' },
      { name: 'Player***789', amount: 12200, game: 'Aviator' },
      { name: 'Lucky***456', amount: 9850, game: 'Mines' }
    ],
    recentWins: [
      { period: '20250619125', result: 7, winners: 23 },
      { period: '20250619124', result: 3, winners: 18 },
      { period: '20250619123', result: 9, winners: 31 },
      { period: '20250619122', result: 0, winners: 12 },
      { period: '20250619121', result: 5, winners: 15 }
    ]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalPlayers: prev.totalPlayers + Math.floor(Math.random() * 5),
        totalBets: prev.totalBets + Math.floor(Math.random() * 10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live-stats">
      <div className="stats-header">
        <h2>🔴 Live Statistics</h2>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card players">
          <div className="stat-number">{stats.totalPlayers.toLocaleString()}</div>
          <div className="stat-label">Online Players</div>
        </div>
        
        <div className="stat-card bets">
          <div className="stat-number">{stats.totalBets.toLocaleString()}</div>
          <div className="stat-label">Total Bets Today</div>
        </div>
      </div>

      <div className="big-winners">
        <h3>🏆 Today's Big Winners</h3>
        {stats.bigWinners.map((winner, idx) => (
          <div key={idx} className="winner-item">
            <div className="winner-info">
              <span className="winner-name">{winner.name}</span>
              <span className="winner-game">{winner.game}</span>
            </div>
            <div className="winner-amount">₹{winner.amount.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="recent-results">
        <h3>📊 Recent WinGo Results</h3>
        {stats.recentWins.map((win, idx) => (
          <div key={idx} className="result-item">
            <div className="result-period">{win.period}</div>
            <div className={`result-number ${win.result === 0 || win.result === 5 ? 'violet-red' : win.result % 2 === 0 ? 'red' : 'green'}`}>
              {win.result}
            </div>
            <div className="result-winners">{win.winners} winners</div>
          </div>
        ))}
      </div>

      <style>{`
        .live-stats {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          min-height: 100vh;
          padding: 20px;
          overflow-y: auto;
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .stats-header h2 {
          margin: 0;
          font-size: 22px;
        }

        .close-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          font-size: 24px;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 25px;
        }

        .stat-card {
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          border: 2px solid transparent;
        }

        .players {
          border-color: #4CAF50;
        }

        .bets {
          border-color: #FF9800;
        }

        .stat-number {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 8px;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.9;
        }

        .big-winners, .recent-results {
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .big-winners h3, .recent-results h3 {
          margin: 0 0 15px 0;
          font-size: 18px;
          color: #FFD700;
        }

        .winner-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .winner-info {
          display: flex;
          flex-direction: column;
        }

        .winner-name {
          font-weight: bold;
          font-size: 14px;
        }

        .winner-game {
          font-size: 12px;
          opacity: 0.7;
        }

        .winner-amount {
          font-size: 16px;
          font-weight: bold;
          color: #4CAF50;
        }

        .result-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          margin-bottom: 6px;
        }

        .result-period {
          font-size: 12px;
          opacity: 0.8;
        }

        .result-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
        }

        .result-number.green { background: #4CAF50; }
        .result-number.red { background: #f44336; }
        .result-number.violet-red { 
          background: linear-gradient(45deg, #9C27B0 50%, #f44336 50%);
        }

        .result-winners {
          font-size: 12px;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};