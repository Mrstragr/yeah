import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trophy, TrendingUp, Star, Crown, Award, Medal, Target } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  winnings: string;
  gamesPlayed: number;
  winRate: number;
  level: number;
  badges: string[];
  isVip: boolean;
  country: string;
  streak: number;
}

interface LeaderboardProps {
  onBack: () => void;
}

export default function GlobalLeaderboardSystem({ onBack }: LeaderboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('weekly');
  const [selectedGame, setSelectedGame] = useState<'all' | 'wingo' | 'aviator' | 'mines' | 'dragon-tiger'>('all');
  const [currentUserRank, setCurrentUserRank] = useState(247);

  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      userId: 'user_001',
      username: 'WinMaster91',
      avatar: '👑',
      winnings: '₹1,24,500',
      gamesPlayed: 2847,
      winRate: 87.3,
      level: 45,
      badges: ['🏆', '💎', '🔥', '⚡'],
      isVip: true,
      country: '🇮🇳',
      streak: 23
    },
    {
      rank: 2,
      userId: 'user_002',
      username: 'LuckyAce99',
      avatar: '🎯',
      winnings: '₹98,750',
      gamesPlayed: 2156,
      winRate: 82.1,
      level: 38,
      badges: ['🏆', '💎', '🔥'],
      isVip: true,
      country: '🇮🇳',
      streak: 15
    },
    {
      rank: 3,
      userId: 'user_003',
      username: 'GameChamp',
      avatar: '💎',
      winnings: '₹87,230',
      gamesPlayed: 1923,
      winRate: 79.8,
      level: 34,
      badges: ['🏆', '💎'],
      isVip: true,
      country: '🇮🇳',
      streak: 12
    },
    {
      rank: 4,
      userId: 'user_004',
      username: 'ProPlayer21',
      avatar: '🎮',
      winnings: '₹72,890',
      gamesPlayed: 1745,
      winRate: 76.4,
      level: 29,
      badges: ['🏆', '🔥'],
      isVip: false,
      country: '🇮🇳',
      streak: 8
    },
    {
      rank: 5,
      userId: 'user_005',
      username: 'WinStreak',
      avatar: '⚡',
      winnings: '₹68,450',
      gamesPlayed: 1654,
      winRate: 74.2,
      level: 27,
      badges: ['🏆', '⚡'],
      isVip: false,
      country: '🇮🇳',
      streak: 19
    },
    {
      rank: 6,
      userId: 'user_006',
      username: 'CrashKing',
      avatar: '✈️',
      winnings: '₹59,780',
      gamesPlayed: 1432,
      winRate: 71.5,
      level: 24,
      badges: ['🏆'],
      isVip: false,
      country: '🇮🇳',
      streak: 5
    },
    {
      rank: 7,
      userId: 'user_007',
      username: 'MinesExpert',
      avatar: '💣',
      winnings: '₹54,320',
      gamesPlayed: 1289,
      winRate: 69.8,
      level: 22,
      badges: ['🏆'],
      isVip: false,
      country: '🇮🇳',
      streak: 7
    },
    {
      rank: 8,
      userId: 'user_008',
      username: 'DragonSlayer',
      avatar: '🐉',
      winnings: '₹48,950',
      gamesPlayed: 1156,
      winRate: 67.3,
      level: 20,
      badges: ['🔥'],
      isVip: false,
      country: '🇮🇳',
      streak: 3
    },
    {
      rank: 9,
      userId: 'user_009',
      username: 'ColorPro123',
      avatar: '🌈',
      winnings: '₹43,670',
      gamesPlayed: 1034,
      winRate: 65.1,
      level: 18,
      badges: ['🔥'],
      isVip: false,
      country: '🇮🇳',
      streak: 11
    },
    {
      rank: 10,
      userId: 'user_010',
      username: 'LuckyStar88',
      avatar: '⭐',
      winnings: '₹39,850',
      gamesPlayed: 945,
      winRate: 63.7,
      level: 16,
      badges: ['⚡'],
      isVip: false,
      country: '🇮🇳',
      streak: 2
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold">1</div>;
      case 2:
        return <div className="w-8 h-8 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white font-bold">2</div>;
      case 3:
        return <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">3</div>;
      default:
        return <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">{rank}</div>;
    }
  };

  const getPodiumGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-orange-400 to-orange-600';
      default:
        return 'from-gray-200 to-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Leaderboard Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 pt-12 pb-6 px-4 text-white">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-black bg-opacity-20"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h1 className="text-2xl font-bold mb-2">Global Leaderboard</h1>
          <p className="text-lg opacity-90">Top players worldwide</p>
        </div>
      </div>

      {/* User Rank Banner */}
      <div className="bg-white mx-4 -mt-4 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              DU
            </div>
            <div>
              <div className="font-bold">DemoUser91</div>
              <div className="text-sm text-gray-600">Your Global Rank: #{currentUserRank}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">₹15,420</div>
            <div className="text-sm text-gray-600">Total Winnings</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-4">
        <div className="mb-3">
          <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
            {[
              { key: 'daily', label: 'Daily' },
              { key: 'weekly', label: 'Weekly' },
              { key: 'monthly', label: 'Monthly' },
              { key: 'all-time', label: 'All Time' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={`flex-1 py-2 px-2 rounded-lg text-sm font-bold transition-all ${
                  selectedPeriod === period.key
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
          {[
            { key: 'all', label: 'All Games', icon: '🎮' },
            { key: 'wingo', label: 'WinGo', icon: '🎯' },
            { key: 'aviator', label: 'Aviator', icon: '✈️' },
            { key: 'mines', label: 'Mines', icon: '💎' }
          ].map((game) => (
            <button
              key={game.key}
              onClick={() => setSelectedGame(game.key as any)}
              className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                selectedGame === game.key
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              {game.icon}
              <div className="mt-1">{game.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold mb-4 text-center">🏆 Top Performers</h3>
          <div className="flex justify-center items-end space-x-4">
            {/* 2nd Place */}
            <div className="text-center">
              <div className={`w-16 h-12 bg-gradient-to-t ${getPodiumGradient(2)} rounded-t-lg mb-2`}></div>
              <div className="text-3xl mb-1">{leaderboardData[1].avatar}</div>
              <div className="font-bold text-sm">{leaderboardData[1].username}</div>
              <div className="text-xs text-gray-600">{leaderboardData[1].winnings}</div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-t ${getPodiumGradient(1)} rounded-t-lg mb-2 relative`}>
                <Crown className="w-6 h-6 text-yellow-300 absolute -top-3 left-1/2 transform -translate-x-1/2" />
              </div>
              <div className="text-4xl mb-1">{leaderboardData[0].avatar}</div>
              <div className="font-bold">{leaderboardData[0].username}</div>
              <div className="text-sm text-gray-600">{leaderboardData[0].winnings}</div>
              {leaderboardData[0].isVip && (
                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs mt-1 font-bold">
                  VIP
                </div>
              )}
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className={`w-16 h-8 bg-gradient-to-t ${getPodiumGradient(3)} rounded-t-lg mb-2`}></div>
              <div className="text-3xl mb-1">{leaderboardData[2].avatar}</div>
              <div className="font-bold text-sm">{leaderboardData[2].username}</div>
              <div className="text-xs text-gray-600">{leaderboardData[2].winnings}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="px-4 pb-6">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              Rankings
            </h3>
          </div>
          
          <div className="space-y-0">
            {leaderboardData.map((player, index) => (
              <motion.div
                key={player.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 border-b border-gray-50 last:border-b-0 ${
                  player.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    {getRankIcon(player.rank)}
                    <div className="text-2xl">{player.avatar}</div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">{player.username}</span>
                          {player.isVip && <Crown className="w-4 h-4 text-yellow-500" />}
                          <span className="text-sm">{player.country}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>Level {player.level}</span>
                          <span>{player.winRate}% Win Rate</span>
                          <span>🔥 {player.streak}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{player.winnings}</div>
                        <div className="text-sm text-gray-600">{player.gamesPlayed} games</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex space-x-1">
                        {player.badges.map((badge, idx) => (
                          <span key={idx} className="text-lg">{badge}</span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        {player.rank <= 10 && (
                          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                            TOP 10
                          </div>
                        )}
                        {player.streak >= 10 && (
                          <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">
                            HOT STREAK
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

        {/* Leaderboard Stats */}
        <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold mb-3 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Leaderboard Rewards
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">🥇 1st Place Bonus:</span>
              <span className="font-bold text-yellow-600">₹10,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">🥈 2nd Place Bonus:</span>
              <span className="font-bold text-gray-600">₹5,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">🥉 3rd Place Bonus:</span>
              <span className="font-bold text-orange-600">₹2,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">🏆 Top 10 Bonus:</span>
              <span className="font-bold text-purple-600">₹500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}