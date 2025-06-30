import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Calendar, Trophy, Target, Zap, Gift, Medal } from 'lucide-react';

interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  isVerified: boolean;
}

interface ActivitySectionProps {
  user: User;
  balance: string;
}

interface Activity {
  id: string;
  type: 'game' | 'transaction' | 'bonus' | 'achievement';
  title: string;
  description: string;
  amount?: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  game?: string;
  icon: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: string;
  completed: boolean;
  icon: string;
}

export default function ActivitySection({ user, balance }: ActivitySectionProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'achievements' | 'stats'>('recent');

  const activities: Activity[] = [
    {
      id: '1',
      type: 'game',
      title: 'Aviator Game Win',
      description: 'Won in Aviator at 2.45x multiplier',
      amount: '+₹245',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      status: 'completed',
      game: 'Aviator',
      icon: '✈️'
    },
    {
      id: '2',
      type: 'transaction',
      title: 'Deposit Successful',
      description: 'Added money to wallet',
      amount: '+₹1000',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: 'completed',
      icon: '💰'
    },
    {
      id: '3',
      type: 'bonus',
      title: 'Daily Check-in Bonus',
      description: 'Daily attendance reward',
      amount: '+₹50',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      status: 'completed',
      icon: '🎁'
    },
    {
      id: '4',
      type: 'game',
      title: 'WinGo 1Min',
      description: 'Played WinGo - Red color',
      amount: '-₹100',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      status: 'completed',
      game: 'WinGo',
      icon: '🎯'
    },
    {
      id: '5',
      type: 'achievement',
      title: 'First Win Achievement',
      description: 'Congratulations on your first win!',
      amount: '+₹100',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      status: 'completed',
      icon: '🏆'
    },
    {
      id: '6',
      type: 'game',
      title: 'Color Prediction',
      description: 'Won Green prediction',
      amount: '+₹150',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
      status: 'completed',
      game: 'Color Prediction',
      icon: '🎨'
    }
  ];

  const achievements: Achievement[] = [
    {
      id: 'first-win',
      title: 'First Victory',
      description: 'Win your first game',
      progress: 1,
      total: 1,
      reward: '₹100',
      completed: true,
      icon: '🏆'
    },
    {
      id: 'daily-player',
      title: 'Daily Player',
      description: 'Play games for 7 consecutive days',
      progress: 3,
      total: 7,
      reward: '₹500',
      completed: false,
      icon: '📅'
    },
    {
      id: 'big-winner',
      title: 'Big Winner',
      description: 'Win ₹10,000 in total',
      progress: 2340,
      total: 10000,
      reward: '₹1000',
      completed: false,
      icon: '💎'
    },
    {
      id: 'aviator-expert',
      title: 'Aviator Expert',
      description: 'Win 50 times in Aviator',
      progress: 12,
      total: 50,
      reward: '₹750',
      completed: false,
      icon: '✈️'
    },
    {
      id: 'lucky-streak',
      title: 'Lucky Streak',
      description: 'Win 5 games in a row',
      progress: 2,
      total: 5,
      reward: '₹300',
      completed: false,
      icon: '🍀'
    },
    {
      id: 'vip-member',
      title: 'VIP Member',
      description: 'Reach VIP status',
      progress: 0,
      total: 1,
      reward: 'VIP Perks',
      completed: false,
      icon: '👑'
    }
  ];

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getActivityColor = (type: string, amount?: string) => {
    if (type === 'bonus' || type === 'achievement') return 'text-purple-600';
    if (amount?.startsWith('+')) return 'text-green-600';
    if (amount?.startsWith('-')) return 'text-red-600';
    return 'text-blue-600';
  };

  const getActivityBg = (type: string) => {
    switch (type) {
      case 'game': return 'bg-blue-100';
      case 'transaction': return 'bg-green-100';
      case 'bonus': return 'bg-purple-100';
      case 'achievement': return 'bg-yellow-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
        <div className="text-center">
          <h1 className="text-xl font-bold">Activity</h1>
          <div className="text-sm opacity-90">Your gaming journey</div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
          <div className="text-lg font-bold text-center mb-4">Today's Activity</div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-600">Games Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹340</div>
              <div className="text-sm text-gray-600">Total Won</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 mb-4">
        <div className="flex space-x-2 bg-gray-100 rounded-xl p-1">
          {[
            { key: 'recent', label: 'Recent', icon: Clock },
            { key: 'achievements', label: 'Achievements', icon: Trophy },
            { key: 'stats', label: 'Stats', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                activeTab === tab.key
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      {activeTab === 'recent' && (
        <div className="px-4 space-y-3">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl ${getActivityBg(activity.type)} flex items-center justify-center text-xl`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{activity.title}</div>
                  <div className="text-sm text-gray-600">{activity.description}</div>
                  <div className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</div>
                </div>
                {activity.amount && (
                  <div className={`font-bold ${getActivityColor(activity.type, activity.amount)}`}>
                    {activity.amount}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {activeTab === 'achievements' && (
        <div className="px-4 space-y-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl p-4 shadow-sm ${
                achievement.completed ? 'border-2 border-yellow-400' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl ${
                  achievement.completed ? 'bg-yellow-100' : 'bg-gray-100'
                } flex items-center justify-center text-xl`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="font-semibold text-gray-800">{achievement.title}</div>
                    {achievement.completed && <div className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full font-bold">COMPLETED</div>}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{achievement.description}</div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          achievement.completed ? 'bg-yellow-400' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600">
                      {achievement.progress}/{achievement.total}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-green-600">{achievement.reward}</div>
                  <div className="text-xs text-gray-500">Reward</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats */}
      {activeTab === 'stats' && (
        <div className="px-4 space-y-4">
          {/* Game Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-lg font-bold mb-4">Game Statistics</div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Games Played</span>
                <span className="font-bold">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Games Won</span>
                <span className="font-bold text-green-600">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Win Rate</span>
                <span className="font-bold text-blue-600">57%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Biggest Win</span>
                <span className="font-bold text-yellow-600">₹1,250</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Longest Streak</span>
                <span className="font-bold text-purple-600">7 wins</span>
              </div>
            </div>
          </div>

          {/* Favorite Games */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-lg font-bold mb-4">Favorite Games</div>
            <div className="space-y-3">
              {[
                { name: 'Aviator', plays: 45, icon: '✈️' },
                { name: 'Color Prediction', plays: 38, icon: '🎨' },
                { name: 'WinGo', plays: 29, icon: '🎯' },
                { name: 'Dice Game', plays: 22, icon: '🎲' }
              ].map(game => (
                <div key={game.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{game.icon}</span>
                    <span className="font-medium">{game.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">{game.plays} plays</div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-lg font-bold mb-4">This Month</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹2,340</div>
                <div className="text-sm text-gray-600">Total Winnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">67</div>
                <div className="text-sm text-gray-600">Games Played</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">5</div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}