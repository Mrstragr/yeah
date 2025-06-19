import { useState, useEffect } from 'react';

interface ActivityPageProps {
  onClose: () => void;
}

export const ActivityPage = ({ onClose }: ActivityPageProps) => {
  const [activeTab, setActiveTab] = useState('today');
  const [liveEvents, setLiveEvents] = useState([
    { id: 1, user: 'Player***123', game: 'WinGo', amount: 1500, type: 'win', time: '2 min ago' },
    { id: 2, user: 'Lucky***456', game: 'Aviator', amount: 3200, type: 'win', time: '5 min ago' },
    { id: 3, user: 'Winner***789', game: 'Mines', amount: 850, type: 'win', time: '7 min ago' },
    { id: 4, user: 'Player***321', game: 'K3', amount: 2100, type: 'win', time: '12 min ago' },
    { id: 5, user: 'Lucky***654', game: 'Dragon Tiger', amount: 750, type: 'win', time: '15 min ago' }
  ]);

  const gameStats = {
    today: {
      totalPlayers: 15420,
      totalBets: 89340,
      totalWinnings: 2847500,
      biggestWin: 125000,
      activeGames: 11
    },
    week: {
      totalPlayers: 89650,
      totalBets: 542100,
      totalWinnings: 18950000,
      biggestWin: 580000,
      activeGames: 11
    },
    month: {
      totalPlayers: 324800,
      totalBets: 1950000,
      totalWinnings: 89500000,
      biggestWin: 2500000,
      activeGames: 11
    }
  };

  const tournaments = [
    {
      id: 1,
      name: 'Weekly WinGo Championship',
      prize: '₹50,000',
      participants: 1247,
      timeLeft: '2d 14h',
      status: 'active'
    },
    {
      id: 2,
      name: 'Aviator High Flyers',
      prize: '₹25,000',
      participants: 892,
      timeLeft: '4d 8h',
      status: 'active'
    },
    {
      id: 3,
      name: 'Lucky Mines Explorer',
      prize: '₹15,000',
      participants: 634,
      timeLeft: '1d 22h',
      status: 'ending'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new live events
      const newEvent = {
        id: Date.now(),
        user: `Player***${Math.floor(Math.random() * 999)}`,
        game: ['WinGo', 'Aviator', 'Mines', 'K3', 'Dragon Tiger'][Math.floor(Math.random() * 5)],
        amount: Math.floor(Math.random() * 5000) + 100,
        type: 'win',
        time: 'Just now'
      };
      
      setLiveEvents(prev => [newEvent, ...prev.slice(0, 9)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const currentStats = gameStats[activeTab as keyof typeof gameStats];

  return (
    <div className="activity-page">
      <div className="activity-header">
        <button onClick={onClose} className="back-btn">←</button>
        <h2>Activity</h2>
        <div className="live-indicator">🔴 LIVE</div>
      </div>

      <div className="stats-tabs">
        <button 
          className={`stats-tab ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => setActiveTab('today')}
        >
          Today
        </button>
        <button 
          className={`stats-tab ${activeTab === 'week' ? 'active' : ''}`}
          onClick={() => setActiveTab('week')}
        >
          This Week
        </button>
        <button 
          className={`stats-tab ${activeTab === 'month' ? 'active' : ''}`}
          onClick={() => setActiveTab('month')}
        >
          This Month
        </button>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{currentStats.totalPlayers.toLocaleString()}</div>
            <div className="stat-label">Total Players</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-info">
            <div className="stat-value">{currentStats.totalBets.toLocaleString()}</div>
            <div className="stat-label">Total Bets</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-value">₹{(currentStats.totalWinnings / 1000).toFixed(0)}K</div>
            <div className="stat-label">Total Winnings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <div className="stat-value">₹{(currentStats.biggestWin / 1000).toFixed(0)}K</div>
            <div className="stat-label">Biggest Win</div>
          </div>
        </div>
      </div>

      <div className="live-events">
        <h3>🔥 Live Big Wins</h3>
        <div className="events-list">
          {liveEvents.map(event => (
            <div key={event.id} className="event-item">
              <div className="event-icon">🎉</div>
              <div className="event-info">
                <div className="event-user">{event.user}</div>
                <div className="event-details">won ₹{event.amount.toLocaleString()} in {event.game}</div>
                <div className="event-time">{event.time}</div>
              </div>
              <div className="event-amount">₹{event.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tournaments">
        <h3>🏆 Active Tournaments</h3>
        <div className="tournament-list">
          {tournaments.map(tournament => (
            <div key={tournament.id} className={`tournament-card ${tournament.status}`}>
              <div className="tournament-header">
                <div className="tournament-name">{tournament.name}</div>
                <div className={`tournament-status ${tournament.status}`}>
                  {tournament.status === 'active' ? '🟢 Active' : '🟡 Ending Soon'}
                </div>
              </div>
              
              <div className="tournament-details">
                <div className="tournament-prize">Prize Pool: {tournament.prize}</div>
                <div className="tournament-participants">{tournament.participants.toLocaleString()} participants</div>
                <div className="tournament-time">Time left: {tournament.timeLeft}</div>
              </div>
              
              <button className="join-tournament-btn">
                {tournament.status === 'active' ? 'Join Tournament' : 'View Results'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="leaderboard">
        <h3>🎯 Today's Top Winners</h3>
        <div className="leaderboard-list">
          {[
            { rank: 1, user: 'Champion***888', winnings: 125000, games: 47 },
            { rank: 2, user: 'Winner***777', winnings: 89500, games: 38 },
            { rank: 3, user: 'Lucky***666', winnings: 67300, games: 52 },
            { rank: 4, user: 'Pro***555', winnings: 54200, games: 29 },
            { rank: 5, user: 'Master***444', winnings: 43800, games: 41 }
          ].map(player => (
            <div key={player.rank} className="leaderboard-item">
              <div className="rank-badge">#{player.rank}</div>
              <div className="player-info">
                <div className="player-name">{player.user}</div>
                <div className="player-games">{player.games} games played</div>
              </div>
              <div className="player-winnings">₹{player.winnings.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .activity-page {
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: rgba(255,255,255,0.05);
        }

        .back-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }

        .activity-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .live-indicator {
          background: #ff4444;
          padding: 4px 8px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: bold;
        }

        .stats-tabs {
          display: flex;
          padding: 0 20px;
          margin: 20px 0;
        }

        .stats-tab {
          flex: 1;
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          padding: 12px;
          border-radius: 8px;
          margin: 0 5px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .stats-tab.active {
          background: #FF6B6B;
        }

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          padding: 0 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: rgba(255,255,255,0.05);
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .stat-icon {
          font-size: 32px;
          width: 60px;
          height: 60px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-value {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.8;
        }

        .live-events, .tournaments, .leaderboard {
          padding: 0 20px;
          margin-bottom: 30px;
        }

        .live-events h3, .tournaments h3, .leaderboard h3 {
          margin: 0 0 15px 0;
          font-size: 18px;
        }

        .events-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .event-item {
          background: rgba(255,255,255,0.05);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 15px;
          animation: slideIn 0.5s ease;
        }

        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .event-icon {
          font-size: 24px;
        }

        .event-info {
          flex: 1;
        }

        .event-user {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .event-details {
          font-size: 13px;
          opacity: 0.8;
          margin-bottom: 2px;
        }

        .event-time {
          font-size: 11px;
          opacity: 0.6;
        }

        .event-amount {
          color: #4CAF50;
          font-weight: bold;
        }

        .tournament-card {
          background: rgba(255,255,255,0.05);
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 15px;
          border-left: 4px solid #4CAF50;
        }

        .tournament-card.ending {
          border-left-color: #FF9800;
        }

        .tournament-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .tournament-name {
          font-weight: bold;
          font-size: 16px;
        }

        .tournament-status {
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
        }

        .tournament-details {
          margin-bottom: 15px;
        }

        .tournament-details div {
          font-size: 13px;
          margin-bottom: 4px;
          opacity: 0.9;
        }

        .tournament-prize {
          color: #FFD700;
          font-weight: bold;
        }

        .join-tournament-btn {
          width: 100%;
          background: #4CAF50;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .leaderboard-item {
          background: rgba(255,255,255,0.05);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .rank-badge {
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #333;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }

        .player-info {
          flex: 1;
        }

        .player-name {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .player-games {
          font-size: 12px;
          opacity: 0.7;
        }

        .player-winnings {
          color: #4CAF50;
          font-weight: bold;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};