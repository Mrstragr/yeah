import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Gift, Calendar, Star, Coins, Crown, Trophy, Zap, CheckCircle } from 'lucide-react';

interface DailyReward {
  day: number;
  reward: string;
  type: 'coins' | 'bonus' | 'vip' | 'special';
  claimed: boolean;
  amount: number;
  icon: string;
  multiplier?: number;
}

interface BonusTask {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  target: number;
  completed: boolean;
  icon: string;
  category: 'daily' | 'weekly' | 'achievement';
}

interface DailyBonusProps {
  onBack: () => void;
}

export default function DailyBonusRewardsSystem({ onBack }: DailyBonusProps) {
  const [currentDay, setCurrentDay] = useState(3);
  const [selectedTab, setSelectedTab] = useState<'daily' | 'tasks' | 'achievements' | 'vip'>('daily');
  const [showClaimAnimation, setShowClaimAnimation] = useState(false);
  const [totalLoginDays, setTotalLoginDays] = useState(47);

  const dailyRewards: DailyReward[] = [
    { day: 1, reward: '₹50', type: 'coins', claimed: true, amount: 50, icon: '💰' },
    { day: 2, reward: '₹75', type: 'coins', claimed: true, amount: 75, icon: '💰' },
    { day: 3, reward: '₹100', type: 'coins', claimed: false, amount: 100, icon: '💰' },
    { day: 4, reward: '150%', type: 'bonus', claimed: false, amount: 150, icon: '🔥', multiplier: 1.5 },
    { day: 5, reward: '₹200', type: 'coins', claimed: false, amount: 200, icon: '💎' },
    { day: 6, reward: '300%', type: 'bonus', claimed: false, amount: 300, icon: '⚡', multiplier: 3.0 },
    { day: 7, reward: 'VIP Day', type: 'vip', claimed: false, amount: 0, icon: '👑' },
    { day: 8, reward: '₹500', type: 'special', claimed: false, amount: 500, icon: '🎁' },
    { day: 9, reward: '₹300', type: 'coins', claimed: false, amount: 300, icon: '💰' },
    { day: 10, reward: '500%', type: 'bonus', claimed: false, amount: 500, icon: '🌟', multiplier: 5.0 },
  ];

  const bonusTasks: BonusTask[] = [
    {
      id: 'daily_login',
      title: 'Daily Login',
      description: 'Log in to the app today',
      reward: '₹25',
      progress: 1,
      target: 1,
      completed: true,
      icon: '📱',
      category: 'daily'
    },
    {
      id: 'play_3_games',
      title: 'Play 3 Games',
      description: 'Complete 3 games today',
      reward: '₹75',
      progress: 2,
      target: 3,
      completed: false,
      icon: '🎮',
      category: 'daily'
    },
    {
      id: 'win_5_rounds',
      title: 'Win 5 Rounds',
      description: 'Win 5 game rounds today',
      reward: '₹150',
      progress: 3,
      target: 5,
      completed: false,
      icon: '🏆',
      category: 'daily'
    },
    {
      id: 'deposit_bonus',
      title: 'Make a Deposit',
      description: 'Deposit any amount to get bonus',
      reward: '100% Bonus',
      progress: 0,
      target: 1,
      completed: false,
      icon: '💳',
      category: 'daily'
    },
    {
      id: 'weekly_winner',
      title: 'Weekly Champion',
      description: 'Be in top 100 this week',
      reward: '₹1,000',
      progress: 247,
      target: 100,
      completed: false,
      icon: '👑',
      category: 'weekly'
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Maintain 10-day login streak',
      reward: '₹500',
      progress: 7,
      target: 10,
      completed: false,
      icon: '🔥',
      category: 'weekly'
    },
    {
      id: 'first_win',
      title: 'First Victory',
      description: 'Win your first game',
      reward: '₹100',
      progress: 1,
      target: 1,
      completed: true,
      icon: '🥇',
      category: 'achievement'
    },
    {
      id: 'big_winner',
      title: 'Big Winner',
      description: 'Win ₹1,000 in a single game',
      reward: '₹250',
      progress: 0,
      target: 1,
      completed: false,
      icon: '💎',
      category: 'achievement'
    }
  ];

  const claimDailyReward = (day: number) => {
    if (day === currentDay) {
      setShowClaimAnimation(true);
      setTimeout(() => {
        setShowClaimAnimation(false);
        setCurrentDay(currentDay + 1);
      }, 2000);
    }
  };

  const getRewardCardColor = (type: string, claimed: boolean) => {
    if (claimed) return 'bg-gray-100 border-gray-200';
    
    switch (type) {
      case 'coins':
        return 'bg-gradient-to-br from-green-100 to-green-200 border-green-300';
      case 'bonus':
        return 'bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300';
      case 'vip':
        return 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300';
      case 'special':
        return 'bg-gradient-to-br from-pink-100 to-pink-200 border-pink-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Claim Animation Overlay */}
      <AnimatePresence>
        {showClaimAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="bg-white rounded-3xl p-8 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-4"
              >
                🎁
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Reward Claimed!</h2>
              <p className="text-lg text-green-600 font-bold">₹{dailyRewards[currentDay - 1]?.amount}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 pt-12 pb-6 px-4 text-white">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-black bg-opacity-20"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="text-center">
          <div className="text-5xl mb-4">🎁</div>
          <h1 className="text-2xl font-bold mb-2">Daily Rewards</h1>
          <p className="text-lg opacity-90">Claim your daily bonuses</p>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-white mx-4 -mt-4 rounded-2xl p-4 shadow-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-green-600">{totalLoginDays}</div>
            <div className="text-xs text-gray-600">Login Days</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600">{currentDay}</div>
            <div className="text-xs text-gray-600">Current Streak</div>
          </div>
          <div>
            <div className="text-xl font-bold text-purple-600">₹3,420</div>
            <div className="text-xs text-gray-600">Total Earned</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-4">
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
          {[
            { key: 'daily', label: 'Daily', icon: '📅' },
            { key: 'tasks', label: 'Tasks', icon: '✅' },
            { key: 'achievements', label: 'Achievements', icon: '🏆' },
            { key: 'vip', label: 'VIP', icon: '👑' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex-1 py-2 px-2 rounded-lg text-sm font-bold transition-all ${
                selectedTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Rewards Tab */}
      {selectedTab === 'daily' && (
        <div className="px-4 pb-6">
          <div className="mb-4">
            <h3 className="font-bold mb-2 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-500" />
              Daily Login Rewards
            </h3>
            <p className="text-sm text-gray-600">
              Login daily to claim increasing rewards. Don't break your streak!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {dailyRewards.map((reward) => (
              <motion.div
                key={reward.day}
                whileHover={{ scale: reward.day === currentDay ? 1.05 : 1 }}
                whileTap={{ scale: reward.day === currentDay ? 0.95 : 1 }}
                onClick={() => claimDailyReward(reward.day)}
                className={`
                  relative p-4 rounded-2xl border-2 transition-all cursor-pointer
                  ${getRewardCardColor(reward.type, reward.claimed)}
                  ${reward.day === currentDay ? 'ring-2 ring-green-400 ring-offset-2' : ''}
                  ${reward.day > currentDay ? 'opacity-60' : ''}
                `}
              >
                {reward.claimed && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-3xl mb-2">{reward.icon}</div>
                  <div className="font-bold text-lg">{reward.reward}</div>
                  <div className="text-sm text-gray-600">Day {reward.day}</div>
                  
                  {reward.day === currentDay && !reward.claimed && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="mt-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                    >
                      CLAIM NOW!
                    </motion.div>
                  )}
                  
                  {reward.claimed && (
                    <div className="mt-2 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      CLAIMED
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {selectedTab === 'tasks' && (
        <div className="px-4 pb-6">
          <div className="mb-4">
            <h3 className="font-bold mb-2 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Daily & Weekly Tasks
            </h3>
            <p className="text-sm text-gray-600">
              Complete tasks to earn extra rewards and bonuses
            </p>
          </div>

          <div className="space-y-3">
            {bonusTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  bg-white rounded-2xl p-4 border-2 transition-all
                  ${task.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'}
                `}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{task.icon}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold">{task.title}</h4>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{task.reward}</div>
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                          task.category === 'daily' ? 'bg-blue-100 text-blue-800' :
                          task.category === 'weekly' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.category.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progress: {task.progress}/{task.target}</span>
                        <span>{Math.min(Math.round((task.progress / task.target) * 100), 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${getProgressColor(task.progress, task.target)}`}
                          style={{ width: `${Math.min((task.progress / task.target) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    {task.completed && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg font-bold"
                      >
                        CLAIM REWARD
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {selectedTab === 'achievements' && (
        <div className="px-4 pb-6">
          <div className="mb-4">
            <h3 className="font-bold mb-2 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Achievements & Milestones
            </h3>
            <p className="text-sm text-gray-600">
              Unlock special achievements and earn exclusive rewards
            </p>
          </div>

          <div className="space-y-3">
            {bonusTasks.filter(task => task.category === 'achievement').map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`
                  bg-white rounded-2xl p-4 border-2 transition-all
                  ${achievement.completed ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'}
                `}
              >
                <div className="flex items-center space-x-4">
                  <div className={`text-4xl ${achievement.completed ? 'grayscale-0' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-lg">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-yellow-600">{achievement.reward}</div>
                        {achievement.completed && (
                          <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold mt-1">
                            UNLOCKED
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* VIP Tab */}
      {selectedTab === 'vip' && (
        <div className="px-4 pb-6">
          <div className="mb-4">
            <h3 className="font-bold mb-2 flex items-center">
              <Crown className="w-5 h-5 mr-2 text-purple-500" />
              VIP Exclusive Rewards
            </h3>
            <p className="text-sm text-gray-600">
              Premium rewards for VIP members only
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 border-2 border-purple-200 mb-4">
            <div className="text-center">
              <div className="text-5xl mb-4">👑</div>
              <h3 className="text-xl font-bold mb-2">Upgrade to VIP</h3>
              <p className="text-gray-600 mb-4">Unlock exclusive benefits and higher rewards</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold"
              >
                Become VIP Member
              </motion.button>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Daily VIP Bonus', reward: '₹500', icon: '💎' },
              { title: 'Exclusive Tournaments', reward: '₹10,000', icon: '🏆' },
              { title: 'Priority Support', reward: 'Premium', icon: '🎯' },
              { title: 'Higher Withdrawal Limits', reward: '₹50,000', icon: '💰' }
            ].map((vipReward, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 border-2 border-purple-200 opacity-60">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{vipReward.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold">{vipReward.title}</h4>
                    <p className="text-green-600 font-bold">{vipReward.reward}</p>
                  </div>
                  <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
                    VIP ONLY
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}