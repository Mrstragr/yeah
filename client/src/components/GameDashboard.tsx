import { useState, useEffect } from 'react';
import { TrendingUp, Users, Star, Trophy, Zap, Target } from 'lucide-react';
import { ImprovedGameCards } from './ImprovedGameCards';
import { useNotifications, NotificationSystem } from './NotificationSystem';

interface GameStats {
  totalGames: number;
  totalWinnings: number;
  winRate: number;
  currentStreak: number;
  favoriteGame: string;
  level: number;
  experience: number;
  nextLevelExp: number;
}

interface GameDashboardProps {
  onGameSelect: (gameType: string) => void;
  userBalance: string;
}

export const GameDashboard = ({ onGameSelect, userBalance }: GameDashboardProps) => {
  const [stats, setStats] = useState<GameStats>({
    totalGames: 0,
    totalWinnings: 0,
    winRate: 0,
    currentStreak: 0,
    favoriteGame: 'wingo',
    level: 1,
    experience: 0,
    nextLevelExp: 1000
  });
  
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [dailyBonus, setDailyBonus] = useState(false);
  const { notifications, dismissNotification, showSuccess, showAchievement } = useNotifications();

  useEffect(() => {
    // Load user stats from localStorage
    const savedStats = localStorage.getItem('userGameStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    // Check daily bonus
    const lastBonus = localStorage.getItem('lastDailyBonus');
    const today = new Date().toDateString();
    if (lastBonus !== today) {
      setDailyBonus(true);
    }
  }, []);

  const claimDailyBonus = () => {
    const bonus = 100 + Math.floor(Math.random() * 400); // 100-500 bonus
    showSuccess(
      'Daily Bonus Claimed!',
      `You received ₹${bonus} daily bonus`,
      [
        {
          label: 'Awesome!',
          onClick: () => {},
          primary: true
        }
      ]
    );
    
    setDailyBonus(false);
    localStorage.setItem('lastDailyBonus', new Date().toDateString());
  };

  const achievements = [
    { id: 'first_win', name: 'First Victory', icon: '🎯', completed: stats.totalGames > 0 },
    { id: 'streak_3', name: '3 Win Streak', icon: '🔥', completed: stats.currentStreak >= 3 },
    { id: 'games_10', name: '10 Games Played', icon: '🎮', completed: stats.totalGames >= 10 },
    { id: 'level_5', name: 'Level 5 Player', icon: '⭐', completed: stats.level >= 5 },
    { id: 'big_win', name: 'Big Winner', icon: '💰', completed: stats.totalWinnings >= 5000 },
    { id: 'lucky_seven', name: 'Lucky Seven', icon: '🍀', completed: stats.currentStreak >= 7 }
  ];

  const leaderboard = [
    { rank: 1, name: 'CryptoKing', winnings: 25420, level: 12 },
    { rank: 2, name: 'LuckyPlayer', winnings: 18950, level: 10 },
    { rank: 3, name: 'GameMaster', winnings: 15680, level: 9 },
    { rank: 4, name: 'WinStreak', winnings: 12340, level: 8 },
    { rank: 5, name: 'You', winnings: stats.totalWinnings, level: stats.level }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <NotificationSystem 
        notifications={notifications} 
        onDismiss={dismissNotification} 
      />
      
      {/* Header Dashboard */}
      <div className="mb-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Gaming Dashboard</h1>
          <p className="text-gray-300">Track your progress and climb the leaderboard</p>
        </div>

        {/* Daily Bonus Banner */}
        {dailyBonus && (
          <div className="mb-6 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-xl p-4 text-center">
            <div className="text-white">
              <h3 className="text-xl font-bold mb-2">🎁 Daily Bonus Available!</h3>
              <p className="mb-3">Claim your daily bonus and boost your gaming experience</p>
              <button
                onClick={claimDailyBonus}
                className="bg-white text-orange-600 px-6 py-2 rounded-lg font-bold hover:scale-105 transition-all"
              >
                Claim Now
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{stats.level}</div>
            <div className="text-blue-100 text-sm">Player Level</div>
            <div className="w-full bg-blue-800 rounded-full h-2 mt-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${(stats.experience / stats.nextLevelExp) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">₹{stats.totalWinnings}</div>
            <div className="text-green-100 text-sm">Total Winnings</div>
            <div className="text-green-200 text-xs mt-1">
              <TrendingUp size={12} className="inline mr-1" />
              All Time
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{stats.winRate}%</div>
            <div className="text-purple-100 text-sm">Win Rate</div>
            <div className="text-purple-200 text-xs mt-1">
              <Target size={12} className="inline mr-1" />
              Last 30 days
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{stats.currentStreak}</div>
            <div className="text-yellow-100 text-sm">Win Streak</div>
            <div className="text-yellow-200 text-xs mt-1">
              <Zap size={12} className="inline mr-1" />
              Current
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-bold whitespace-nowrap hover:scale-105 transition-all"
          >
            <Trophy size={18} />
            Leaderboard
          </button>
          
          <button
            onClick={() => showAchievement('Coming Soon', 'Friends feature will be available soon!')}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-bold whitespace-nowrap hover:scale-105 transition-all"
          >
            <Users size={18} />
            Friends
          </button>
          
          <button
            onClick={() => showAchievement('Achievements', `You have completed ${achievements.filter(a => a.completed).length}/${achievements.length} achievements`)}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 rounded-lg font-bold whitespace-nowrap hover:scale-105 transition-all"
          >
            <Star size={18} />
            Achievements
          </button>
        </div>

        {/* Leaderboard */}
        {showLeaderboard && (
          <div className="mb-6 bg-gray-800/80 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="text-yellow-400" />
              Weekly Leaderboard
            </h3>
            <div className="space-y-3">
              {leaderboard.map((player, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    player.name === 'You' 
                      ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50' 
                      : 'bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {player.rank}
                    </div>
                    <div>
                      <div className="text-white font-medium">{player.name}</div>
                      <div className="text-gray-400 text-sm">Level {player.level}</div>
                    </div>
                  </div>
                  <div className="text-green-400 font-bold">₹{player.winnings.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Grid */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Achievements</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg text-center transition-all ${
                  achievement.completed
                    ? 'bg-gradient-to-br from-yellow-600 to-orange-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <div className="text-xs font-medium">{achievement.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Games Section */}
      <ImprovedGameCards onGameSelect={onGameSelect} />
    </div>
  );
};