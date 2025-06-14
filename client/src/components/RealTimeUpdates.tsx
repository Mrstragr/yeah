import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Zap, Trophy } from 'lucide-react';

interface RealTimeUpdatesProps {
  onWalletUpdate: (amount: number) => void;
}

interface LiveStat {
  id: string;
  icon: string;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface WinNotification {
  id: string;
  username: string;
  game: string;
  amount: number;
  timestamp: Date;
}

export function RealTimeUpdates({ onWalletUpdate }: RealTimeUpdatesProps) {
  const [liveStats, setLiveStats] = useState<LiveStat[]>([
    { id: '1', icon: '🎯', label: 'Playing Now', value: '2,847', trend: 'up', color: '#3b82f6' },
    { id: '2', icon: '💰', label: 'Today\'s Wins', value: '₹1.2M', trend: 'up', color: '#10b981' },
    { id: '3', icon: '⚡', label: 'Win Rate', value: '98.7%', trend: 'stable', color: '#f59e0b' },
    { id: '4', icon: '🏆', label: 'Jackpot', value: '₹2.4M', trend: 'up', color: '#ef4444' }
  ]);

  const [winNotifications, setWinNotifications] = useState<WinNotification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<WinNotification | null>(null);

  useEffect(() => {
    // Simulate real-time stat updates
    const statsInterval = setInterval(() => {
      setLiveStats(prev => prev.map(stat => {
        let newValue = stat.value;
        let newTrend = stat.trend;

        switch(stat.id) {
          case '1': // Playing Now
            const current = parseInt(stat.value.replace(',', ''));
            const change = Math.floor(Math.random() * 20) - 10;
            const newPlayers = Math.max(2000, current + change);
            newValue = newPlayers.toLocaleString();
            newTrend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
            break;
          
          case '2': // Today's Wins
            const currentWins = parseFloat(stat.value.replace('₹', '').replace('M', ''));
            const winChange = (Math.random() * 0.1) + 0.05;
            const newWins = currentWins + winChange;
            newValue = `₹${newWins.toFixed(1)}M`;
            newTrend = 'up';
            break;
          
          case '3': // Win Rate
            const currentRate = parseFloat(stat.value.replace('%', ''));
            const rateChange = (Math.random() * 0.4) - 0.2;
            const newRate = Math.max(95, Math.min(99.9, currentRate + rateChange));
            newValue = `${newRate.toFixed(1)}%`;
            newTrend = rateChange > 0 ? 'up' : rateChange < 0 ? 'down' : 'stable';
            break;
          
          case '4': // Jackpot
            const currentJackpot = parseFloat(stat.value.replace('₹', '').replace('M', ''));
            const jackpotChange = (Math.random() * 0.05) + 0.01;
            const newJackpot = currentJackpot + jackpotChange;
            newValue = `₹${newJackpot.toFixed(1)}M`;
            newTrend = 'up';
            break;
        }

        return { ...stat, value: newValue, trend: newTrend };
      }));
    }, 3000);

    // Simulate win notifications
    const winInterval = setInterval(() => {
      const winners = ['ProGamer98', 'LuckyWinner', 'DragonMaster', 'GoldRush', 'DiamondKing', 'CasinoQueen', 'FastWin', 'BigBettor'];
      const games = ['WIN GO', 'Aviator', 'Mines', 'Dragon Tiger', 'K3 Lotre', 'Dice Game'];
      
      const newWin: WinNotification = {
        id: Date.now().toString(),
        username: winners[Math.floor(Math.random() * winners.length)],
        game: games[Math.floor(Math.random() * games.length)],
        amount: Math.floor(Math.random() * 100000) + 5000,
        timestamp: new Date()
      };

      setWinNotifications(prev => [newWin, ...prev.slice(0, 4)]);
      setCurrentNotification(newWin);

      // Clear notification after 4 seconds
      setTimeout(() => {
        setCurrentNotification(null);
      }, 4000);

      // Simulate small wallet update for user
      if (Math.random() > 0.7) {
        const bonus = (Math.random() * 10) + 1;
        onWalletUpdate(bonus);
      }
    }, 8000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(winInterval);
    };
  }, [onWalletUpdate]);

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />;
      default: return <div className="w-3 h-3 rounded-full bg-gray-400"></div>;
    }
  };

  return (
    <>
      {/* Real-time Stats Display */}
      <div className="live-stats-container">
        {liveStats.map((stat, index) => (
          <div 
            key={stat.id} 
            className="live-stat-item"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              borderColor: stat.color + '40'
            }}
          >
            <div className="live-stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="live-stat-content">
              <div className="live-stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="live-stat-label">
                {stat.label}
                {getTrendIcon(stat.trend)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Win Notification Popup */}
      {currentNotification && (
        <div className="win-notification-popup">
          <div className="win-popup-content">
            <div className="win-popup-icon">🎉</div>
            <div className="win-popup-text">
              <div className="win-popup-title">
                {currentNotification.username} won!
              </div>
              <div className="win-popup-details">
                ₹{currentNotification.amount.toLocaleString()} on {currentNotification.game}
              </div>
            </div>
            <div className="win-popup-amount">
              +₹{currentNotification.amount.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Recent Wins Ticker */}
      {winNotifications.length > 0 && (
        <div className="recent-wins-ticker">
          <div className="ticker-header">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>Recent Winners</span>
          </div>
          <div className="ticker-content">
            {winNotifications.map((win) => (
              <div key={win.id} className="ticker-item">
                <span className="ticker-username">{win.username}</span>
                <span className="ticker-amount">₹{win.amount.toLocaleString()}</span>
                <span className="ticker-game">{win.game}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}