import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Gift, Trophy, Star, Users, Clock,
  TrendingUp, Target, Crown, Zap, BarChart3,
  Award, Calendar, Coins, Share2, Settings,
  Heart
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  walletBalance: string;
}

interface Props {
  onBack: () => void;
  user: User;
}

interface Tournament {
  id: string;
  name: string;
  prize: string;
  participants: number;
  maxParticipants: number;
  startTime: string;
  status: 'upcoming' | 'live' | 'finished';
  entry: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: string;
  unlocked: boolean;
  icon: React.ElementType;
}

export default function ComprehensiveFeatures({ onBack, user }: Props) {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'achievements' | 'leaderboard' | 'daily'>('tournaments');

  const tournaments: Tournament[] = [
    {
      id: '1',
      name: 'WinGo Championship',
      prize: '₹50,000',
      participants: 247,
      maxParticipants: 500,
      startTime: '2h 30m',
      status: 'upcoming',
      entry: 100
    },
    {
      id: '2',
      name: 'Aviator Masters',
      prize: '₹75,000',
      participants: 189,
      maxParticipants: 300,
      startTime: 'LIVE',
      status: 'live',
      entry: 200
    },
    {
      id: '3',
      name: 'Daily Jackpot',
      prize: '₹25,000',
      participants: 456,
      maxParticipants: 1000,
      startTime: '6h 15m',
      status: 'upcoming',
      entry: 50
    }
  ];

  const achievements: Achievement[] = [
    {
      id: 'first_win',
      title: 'First Victory',
      description: 'Win your first game',
      progress: 1,
      maxProgress: 1,
      reward: '₹50 Bonus',
      unlocked: true,
      icon: Trophy
    },
    {
      id: 'high_roller',
      title: 'High Roller',
      description: 'Place a bet worth ₹1000 or more',
      progress: 750,
      maxProgress: 1000,
      reward: 'VIP Status',
      unlocked: false,
      icon: Crown
    },
    {
      id: 'win_streak',
      title: 'Win Streak',
      description: 'Win 5 games in a row',
      progress: 2,
      maxProgress: 5,
      reward: '₹200 Bonus',
      unlocked: false,
      icon: Zap
    },
    {
      id: 'aviator_ace',
      title: 'Aviator Ace',
      description: 'Cash out at 10x multiplier',
      progress: 0,
      maxProgress: 1,
      reward: '₹500 Bonus',
      unlocked: false,
      icon: Target
    }
  ];

  const leaderboard = [
    { rank: 1, username: 'CrashKing91', winnings: 125000, avatar: '👑' },
    { rank: 2, username: 'LuckyPlayer', winnings: 98500, avatar: '🍀' },
    { rank: 3, username: 'AviatorPro', winnings: 87200, avatar: '✈️' },
    { rank: 4, username: 'WinGoMaster', winnings: 76800, avatar: '🎯' },
    { rank: 5, username: 'GameChamp', winnings: 65400, avatar: '🏆' },
    { rank: 12, username: user.username, winnings: 34500, avatar: '🎮' }
  ];

  const dailyTasks = [
    { id: '1', title: 'Play 5 games', progress: 3, max: 5, reward: '₹25', completed: false },
    { id: '2', title: 'Win 2 games', progress: 1, max: 2, reward: '₹50', completed: false },
    { id: '3', title: 'Bet ₹500 total', progress: 320, max: 500, reward: '₹75', completed: false },
    { id: '4', title: 'Login daily', progress: 1, max: 1, reward: '₹10', completed: true }
  ];

  const tabs = [
    { id: 'tournaments', name: 'Tournaments', icon: Trophy },
    { id: 'achievements', name: 'Achievements', icon: Award },
    { id: 'leaderboard', name: 'Leaderboard', icon: BarChart3 },
    { id: 'daily', name: 'Daily Tasks', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-lg">
              <ArrowLeft size={24} />
            </button>
            <div>
              <div className="text-xl font-bold">Features</div>
              <div className="text-sm opacity-70">Tournaments & Rewards</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm opacity-70">Balance</div>
            <div className="text-lg font-bold text-green-400">₹{user.walletBalance}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <tab.icon size={16} />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-20">
        {/* Tournaments */}
        {activeTab === 'tournaments' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-bold">Active Tournaments</span>
            </div>
            
            {tournaments.map(tournament => (
              <motion.div
                key={tournament.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-lg font-bold">{tournament.name}</div>
                    <div className="text-yellow-400 font-bold text-xl">{tournament.prize}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    tournament.status === 'live' ? 'bg-red-500 animate-pulse' :
                    tournament.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    {tournament.status === 'live' ? '🔴 LIVE' : 
                     tournament.status === 'upcoming' ? '⏰ UPCOMING' : '✅ FINISHED'}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Participants:</span>
                    <span>{tournament.participants}/{tournament.maxParticipants}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Entry Fee:</span>
                    <span className="text-green-400">₹{tournament.entry}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">
                      {tournament.status === 'live' ? 'Live Now' : 'Starts in:'}
                    </span>
                    <span className="text-yellow-400">{tournament.startTime}</span>
                  </div>
                </div>
                
                <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                  ></div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 py-3 rounded-lg font-bold transition-all hover:shadow-lg">
                  {tournament.status === 'live' ? 'Join Now' : 'Register'}
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-purple-400" />
              <span className="text-lg font-bold">Achievements</span>
            </div>
            
            {achievements.map(achievement => (
              <motion.div
                key={achievement.id}
                className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border ${
                  achievement.unlocked ? 'border-green-400/50 bg-green-400/10' : 'border-white/20'
                }`}
                whileHover={{ backgroundColor: achievement.unlocked ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.15)' }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    achievement.unlocked ? 'bg-green-500' : 'bg-white/20'
                  }`}>
                    <achievement.icon size={20} className="text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{achievement.title}</span>
                      {achievement.unlocked && <span className="text-green-400">✅</span>}
                    </div>
                    <div className="text-sm text-white/70 mb-2">{achievement.description}</div>
                    
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/70">Progress:</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    
                    <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${
                          achievement.unlocked ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="text-yellow-400 font-bold text-sm">
                      Reward: {achievement.reward}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span className="text-lg font-bold">Weekly Leaderboard</span>
            </div>
            
            <div className="space-y-3">
              {leaderboard.map((player, index) => (
                <motion.div
                  key={player.rank}
                  className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border flex items-center gap-3 ${
                    player.username === user.username ? 'border-green-400/50 bg-green-400/10' : 'border-white/20'
                  }`}
                  whileHover={{ backgroundColor: player.username === user.username ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.15)' }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    player.rank === 1 ? 'bg-yellow-500' :
                    player.rank === 2 ? 'bg-gray-400' :
                    player.rank === 3 ? 'bg-orange-600' : 'bg-white/20'
                  }`}>
                    #{player.rank}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{player.avatar}</span>
                      <span className="font-bold">{player.username}</span>
                      {player.username === user.username && <span className="text-green-400">(You)</span>}
                    </div>
                    <div className="text-green-400 font-bold">₹{player.winnings.toLocaleString()}</div>
                  </div>
                  
                  {player.rank <= 3 && (
                    <div className="text-yellow-400">
                      {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Tasks */}
        {activeTab === 'daily' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-green-400" />
              <span className="text-lg font-bold">Daily Tasks</span>
            </div>
            
            {dailyTasks.map(task => (
              <motion.div
                key={task.id}
                className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border ${
                  task.completed ? 'border-green-400/50 bg-green-400/10' : 'border-white/20'
                }`}
                whileHover={{ backgroundColor: task.completed ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.15)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      task.completed ? 'bg-green-500' : 'bg-white/20'
                    }`}>
                      {task.completed ? '✅' : '📋'}
                    </div>
                    <div>
                      <div className="font-bold">{task.title}</div>
                      <div className="text-yellow-400 font-bold">Reward: {task.reward}</div>
                    </div>
                  </div>
                  
                  {task.completed && (
                    <div className="text-green-400 font-bold">COMPLETED</div>
                  )}
                </div>
                
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">Progress:</span>
                  <span>{task.progress}/{task.max}</span>
                </div>
                
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      task.completed ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    }`}
                    style={{ width: `${(task.progress / task.max) * 100}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}