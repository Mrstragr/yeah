import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, TrendingUp, TrendingDown, Trophy, 
  Star, Crown, Target, Zap, Calendar, Clock,
  Award, Gift, Users, Gamepad2, Medal
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  walletBalance: string;
}

interface Props {
  user: User;
  balance: string;
  onBack?: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: number;
  maxProgress: number;
  reward: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface GameActivity {
  id: string;
  game: string;
  action: 'win' | 'loss' | 'big_win' | 'jackpot';
  amount: number;
  multiplier?: number;
  timestamp: Date;
}

export default function EnhancedActivity({ user, balance, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'recent' | 'achievements' | 'leaderboard'>('recent');

  const achievements: Achievement[] = [
    {
      id: 'first_win',
      title: 'First Victory',
      description: 'Win your first game',
      icon: Trophy,
      progress: 1,
      maxProgress: 1,
      reward: '₹50 Bonus',
      unlocked: true,
      rarity: 'common'
    },
    {
      id: 'lucky_seven',
      title: 'Lucky Seven',
      description: 'Win 7 games in a row',
      icon: Star,
      progress: 3,
      maxProgress: 7,
      reward: '₹777 Bonus',
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: 'high_roller',
      title: 'High Roller',
      description: 'Place a single bet worth ₹1000+',
      icon: Crown,
      progress: 500,
      maxProgress: 1000,
      reward: 'VIP Status',
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: 'aviator_ace',
      title: 'Aviator Ace',
      description: 'Cash out at 10x multiplier in Aviator',
      icon: Zap,
      progress: 5.2,
      maxProgress: 10,
      reward: '₹500 Bonus',
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: 'prediction_master',
      title: 'Prediction Master',
      description: 'Win 50 Color Prediction games',
      icon: Target,
      progress: 23,
      maxProgress: 50,
      reward: '₹1000 Bonus',
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: 'daily_player',
      title: 'Daily Player',
      description: 'Play games for 30 consecutive days',
      icon: Calendar,
      progress: 12,
      maxProgress: 30,
      reward: '₹2000 Bonus',
      unlocked: false,
      rarity: 'legendary'
    }
  ];

  const recentActivity: GameActivity[] = [
    {
      id: 'act1',
      game: 'Aviator',
      action: 'big_win',
      amount: 2850,
      multiplier: 5.7,
      timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: 'act2',
      game: 'Color Prediction',
      action: 'win',
      amount: 500,
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: 'act3',
      game: 'Aviator',
      action: 'loss',
      amount: -200,
      timestamp: new Date(Date.now() - 1000 * 60 * 45)
    },
    {
      id: 'act4',
      game: 'Color Prediction',
      action: 'win',
      amount: 750,
      timestamp: new Date(Date.now() - 1000 * 60 * 60)
    },
    {
      id: 'act5',
      game: 'Aviator',
      action: 'jackpot',
      amount: 15000,
      multiplier: 25.6,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
    }
  ];

  const leaderboard = [
    { rank: 1, username: 'ProGamer91', winnings: 45680, games: 234 },
    { rank: 2, username: 'LuckyPlayer', winnings: 38920, games: 198 },
    { rank: 3, username: 'AviatorKing', winnings: 35450, games: 156 },
    { rank: 4, username: 'ColorMaster', winnings: 29870, games: 267 },
    { rank: 5, username: user.username, winnings: 25350, games: 142 },
    { rank: 6, username: 'WinnerX', winnings: 23100, games: 178 },
    { rank: 7, username: 'GameChamp', winnings: 21800, games: 145 }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-cyan-600';
      case 'epic': return 'from-purple-500 to-pink-600';
      case 'legendary': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'win': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'big_win': return <Trophy className="w-4 h-4 text-yellow-400" />;
      case 'jackpot': return <Crown className="w-4 h-4 text-purple-400" />;
      case 'loss': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Gamepad2 className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'win': return 'text-green-400';
      case 'big_win': return 'text-yellow-400';
      case 'jackpot': return 'text-purple-400';
      case 'loss': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <h1 className="text-xl font-bold">Activity</h1>
        </div>
        <div className="flex items-center gap-2">
          <Medal className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-semibold">Rank #5</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <TrendingUp className="w-8 h-8 mb-2 text-white" />
            <div className="text-2xl font-bold">₹25,350</div>
            <div className="text-green-100 text-sm">Total Winnings</div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Gamepad2 className="w-8 h-8 mb-2 text-white" />
            <div className="text-2xl font-bold">142</div>
            <div className="text-blue-100 text-sm">Games Played</div>
          </motion.div>
        </div>

        {/* Achievement Progress */}
        <motion.div 
          className="bg-gray-800 rounded-xl p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Next Achievement</h3>
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold">Aviator Ace</div>
              <div className="text-sm text-gray-400">Cash out at 10x multiplier</div>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-white">5.2x / 10x</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: '52%' }}
              ></div>
            </div>
          </div>
          
          <div className="text-xs text-green-400">Reward: ₹500 Bonus</div>
        </motion.div>

        {/* Tabs */}
        <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
          <button 
            onClick={() => setActiveTab('recent')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
              activeTab === 'recent' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Recent
          </button>
          <button 
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
              activeTab === 'achievements' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Achievements
          </button>
          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
              activeTab === 'leaderboard' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Leaderboard
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'recent' && (
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div 
                key={activity.id}
                className="bg-gray-800 rounded-lg p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getActionIcon(activity.action)}
                    <div>
                      <div className="font-semibold">{activity.game}</div>
                      <div className="text-xs text-gray-400">
                        {formatTime(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getActionColor(activity.action)}`}>
                      {activity.amount > 0 ? '+' : ''}₹{Math.abs(activity.amount)}
                    </div>
                    {activity.multiplier && (
                      <div className="text-xs text-gray-400">
                        {activity.multiplier}x multiplier
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <motion.div 
                key={achievement.id}
                className={`rounded-xl p-4 ${
                  achievement.unlocked 
                    ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}` 
                    : 'bg-gray-800'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    achievement.unlocked 
                      ? 'bg-white/20' 
                      : 'bg-gray-700'
                  }`}>
                    <achievement.icon className={`w-6 h-6 ${
                      achievement.unlocked ? 'text-white' : 'text-gray-400'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold ${
                        achievement.unlocked ? 'text-white' : 'text-gray-300'
                      }`}>
                        {achievement.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                        achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                        achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {achievement.rarity}
                      </span>
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      achievement.unlocked ? 'text-gray-200' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                    
                    {!achievement.unlocked && (
                      <>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">
                              {achievement.progress} / {achievement.maxProgress}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} h-2 rounded-full transition-all duration-300`}
                              style={{ 
                                width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-xs text-green-400">
                          Reward: {achievement.reward}
                        </div>
                      </>
                    )}
                    
                    {achievement.unlocked && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-300">✓ Unlocked</span>
                        <span className="text-sm text-green-400">{achievement.reward}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-3">
            {leaderboard.map((player, index) => (
              <motion.div 
                key={player.rank}
                className={`rounded-lg p-4 ${
                  player.username === user.username 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                    : 'bg-gray-800'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      player.rank === 1 ? 'bg-yellow-500 text-black' :
                      player.rank === 2 ? 'bg-gray-400 text-black' :
                      player.rank === 3 ? 'bg-orange-600 text-white' :
                      'bg-gray-700 text-white'
                    }`}>
                      {player.rank <= 3 ? (
                        player.rank === 1 ? '👑' :
                        player.rank === 2 ? '🥈' : '🥉'
                      ) : (
                        player.rank
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {player.username}
                        {player.username === user.username && (
                          <span className="text-xs text-blue-200 ml-2">(You)</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {player.games} games played
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">
                      ₹{player.winnings.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Total winnings</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom padding for navigation */}
      <div className="h-20"></div>
    </div>
  );
}