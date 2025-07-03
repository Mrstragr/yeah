import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, BarChart3, TrendingUp, Calendar, Filter, Target, Award, Clock, DollarSign } from 'lucide-react';

interface GameRecord {
  id: string;
  game: string;
  gameIcon: string;
  betAmount: string;
  result: 'win' | 'loss';
  winAmount: string;
  multiplier: number;
  timestamp: string;
  gameDetails: any;
}

interface GameStats {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  totalBet: string;
  totalWon: string;
  netProfit: string;
  biggestWin: string;
  longestStreak: number;
  currentStreak: number;
  favoriteGame: string;
  avgBetSize: string;
}

interface HistoryProps {
  onBack: () => void;
}

export default function GameHistoryStatisticsSystem({ onBack }: HistoryProps) {
  const [selectedTab, setSelectedTab] = useState<'history' | 'statistics' | 'analytics' | 'achievements'>('history');
  const [selectedGame, setSelectedGame] = useState<'all' | 'wingo' | 'aviator' | 'mines' | 'dragon-tiger'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'all'>('week');

  const gameHistory: GameRecord[] = [
    {
      id: 'game_001',
      game: 'WinGo 3Min',
      gameIcon: '🎯',
      betAmount: '₹100',
      result: 'win',
      winAmount: '₹180',
      multiplier: 1.8,
      timestamp: '2025-07-03T14:32:15Z',
      gameDetails: { period: '20250703001', prediction: 'Green', result: 'Green' }
    },
    {
      id: 'game_002',
      game: 'Aviator',
      gameIcon: '✈️',
      betAmount: '₹200',
      result: 'win',
      winAmount: '₹520',
      multiplier: 2.6,
      timestamp: '2025-07-03T14:15:42Z',
      gameDetails: { cashOut: '2.60x', crashed: '3.45x' }
    },
    {
      id: 'game_003',
      game: 'Mines',
      gameIcon: '💎',
      betAmount: '₹150',
      result: 'loss',
      winAmount: '₹0',
      multiplier: 0,
      timestamp: '2025-07-03T13:58:23Z',
      gameDetails: { mines: 3, revealed: 4, hitMine: true }
    },
    {
      id: 'game_004',
      game: 'Dragon Tiger',
      gameIcon: '🐉',
      betAmount: '₹300',
      result: 'win',
      winAmount: '₹600',
      multiplier: 2.0,
      timestamp: '2025-07-03T13:45:12Z',
      gameDetails: { bet: 'Dragon', dragon: 'K♠', tiger: '7♦', result: 'Dragon' }
    },
    {
      id: 'game_005',
      game: 'WinGo 3Min',
      gameIcon: '🎯',
      betAmount: '₹75',
      result: 'loss',
      winAmount: '₹0',
      multiplier: 0,
      timestamp: '2025-07-03T13:20:45Z',
      gameDetails: { period: '20250703008', prediction: 'Red', result: 'Green' }
    },
    {
      id: 'game_006',
      game: 'Aviator',
      gameIcon: '✈️',
      betAmount: '₹250',
      result: 'win',
      winAmount: '₹437',
      multiplier: 1.75,
      timestamp: '2025-07-03T12:58:33Z',
      gameDetails: { cashOut: '1.75x', crashed: '8.92x' }
    },
    {
      id: 'game_007',
      game: 'Mines',
      gameIcon: '💎',
      betAmount: '₹120',
      result: 'win',
      winAmount: '₹288',
      multiplier: 2.4,
      timestamp: '2025-07-03T12:35:18Z',
      gameDetails: { mines: 3, revealed: 6, cashedOut: true }
    },
    {
      id: 'game_008',
      game: 'Dragon Tiger',
      gameIcon: '🐉',
      betAmount: '₹180',
      result: 'loss',
      winAmount: '₹0',
      multiplier: 0,
      timestamp: '2025-07-03T12:12:56Z',
      gameDetails: { bet: 'Tiger', dragon: 'A♥', tiger: '9♣', result: 'Dragon' }
    }
  ];

  const gameStats: GameStats = {
    totalGames: 127,
    totalWins: 76,
    totalLosses: 51,
    winRate: 59.8,
    totalBet: '₹23,450',
    totalWon: '₹31,280',
    netProfit: '₹7,830',
    biggestWin: '₹2,450',
    longestStreak: 8,
    currentStreak: 3,
    favoriteGame: 'Aviator',
    avgBetSize: '₹185'
  };

  const filteredHistory = gameHistory.filter(record => {
    if (selectedGame !== 'all') {
      const gameMap = {
        'wingo': 'WinGo 3Min',
        'aviator': 'Aviator',
        'mines': 'Mines',
        'dragon-tiger': 'Dragon Tiger'
      };
      return record.game === gameMap[selectedGame];
    }
    return true;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getResultColor = (result: string) => {
    return result === 'win' ? 'text-green-600' : 'text-red-600';
  };

  const getResultBadge = (result: string) => {
    return result === 'win' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 pt-12 pb-6 px-4 text-white">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-black bg-opacity-20"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="text-center">
          <div className="text-5xl mb-4">📊</div>
          <h1 className="text-2xl font-bold mb-2">Game History</h1>
          <p className="text-lg opacity-90">Track your gaming performance</p>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="bg-white mx-4 -mt-4 rounded-2xl p-4 shadow-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-green-600">{gameStats.netProfit}</div>
            <div className="text-xs text-gray-600">Net Profit</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600">{gameStats.winRate}%</div>
            <div className="text-xs text-gray-600">Win Rate</div>
          </div>
          <div>
            <div className="text-xl font-bold text-purple-600">{gameStats.totalGames}</div>
            <div className="text-xs text-gray-600">Games Played</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-4">
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
          {[
            { key: 'history', label: 'History', icon: '📝' },
            { key: 'statistics', label: 'Stats', icon: '📊' },
            { key: 'analytics', label: 'Analytics', icon: '📈' },
            { key: 'achievements', label: 'Badges', icon: '🏆' }
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

      {/* History Tab */}
      {selectedTab === 'history' && (
        <div className="px-4 pb-6">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <div className="flex items-center mb-3">
              <Filter className="w-5 h-5 mr-2 text-gray-500" />
              <span className="font-bold">Filters</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Game</label>
                <select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value as any)}
                  className="w-full p-2 border rounded-lg text-sm"
                >
                  <option value="all">All Games</option>
                  <option value="wingo">WinGo</option>
                  <option value="aviator">Aviator</option>
                  <option value="mines">Mines</option>
                  <option value="dragon-tiger">Dragon Tiger</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Period</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="w-full p-2 border rounded-lg text-sm"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Game History List */}
          <div className="space-y-3">
            {filteredHistory.map((record) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{record.gameIcon}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold">{record.game}</h4>
                        <p className="text-sm text-gray-600">{formatTimestamp(record.timestamp)}</p>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${getResultBadge(record.result)}`}>
                          {record.result.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Bet Amount</div>
                        <div className="font-bold">{record.betAmount}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Win Amount</div>
                        <div className={`font-bold ${getResultColor(record.result)}`}>
                          {record.winAmount || '₹0'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Multiplier</div>
                        <div className="font-bold">
                          {record.multiplier > 0 ? `${record.multiplier}x` : '-'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Game Details */}
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg text-xs">
                      {record.game === 'WinGo 3Min' && (
                        <div>
                          Period: {record.gameDetails.period} | 
                          Predicted: {record.gameDetails.prediction} | 
                          Result: {record.gameDetails.result}
                        </div>
                      )}
                      {record.game === 'Aviator' && (
                        <div>
                          Cash Out: {record.gameDetails.cashOut} | 
                          Crashed At: {record.gameDetails.crashed}
                        </div>
                      )}
                      {record.game === 'Mines' && (
                        <div>
                          Mines: {record.gameDetails.mines} | 
                          Revealed: {record.gameDetails.revealed} | 
                          {record.gameDetails.hitMine ? 'Hit Mine' : 'Cashed Out'}
                        </div>
                      )}
                      {record.game === 'Dragon Tiger' && (
                        <div>
                          Bet: {record.gameDetails.bet} | 
                          Dragon: {record.gameDetails.dragon} | 
                          Tiger: {record.gameDetails.tiger} | 
                          Winner: {record.gameDetails.result}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Tab */}
      {selectedTab === 'statistics' && (
        <div className="px-4 pb-6 space-y-4">
          {/* Overall Performance */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold mb-3 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              Overall Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{gameStats.totalWins}</div>
                <div className="text-sm text-gray-600">Total Wins</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-xl">
                <div className="text-2xl font-bold text-red-600">{gameStats.totalLosses}</div>
                <div className="text-sm text-gray-600">Total Losses</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Win Rate</span>
                <span>{gameStats.winRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                  style={{ width: `${gameStats.winRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold mb-3 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-500" />
              Financial Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Bet:</span>
                <span className="font-bold">{gameStats.totalBet}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Won:</span>
                <span className="font-bold text-green-600">{gameStats.totalWon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Net Profit:</span>
                <span className="font-bold text-green-600">{gameStats.netProfit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Biggest Win:</span>
                <span className="font-bold text-yellow-600">{gameStats.biggestWin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Bet Size:</span>
                <span className="font-bold">{gameStats.avgBetSize}</span>
              </div>
            </div>
          </div>

          {/* Streak Information */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-500" />
              Streak Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">{gameStats.currentStreak}</div>
                <div className="text-sm text-gray-600">Current Streak</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{gameStats.longestStreak}</div>
                <div className="text-sm text-gray-600">Longest Streak</div>
              </div>
            </div>
          </div>

          {/* Game Preferences */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold mb-3 flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-500" />
              Game Preferences
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Favorite Game:</span>
                <span className="font-bold">{gameStats.favoriteGame}</span>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Game Distribution</span>
                </div>
                <div className="space-y-2">
                  {[
                    { game: 'Aviator', percentage: 35, color: 'bg-blue-500' },
                    { game: 'WinGo', percentage: 28, color: 'bg-red-500' },
                    { game: 'Mines', percentage: 22, color: 'bg-yellow-500' },
                    { game: 'Dragon Tiger', percentage: 15, color: 'bg-green-500' }
                  ].map((item) => (
                    <div key={item.game} className="flex items-center space-x-3">
                      <div className="w-20 text-sm">{item.game}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <div className="text-sm font-bold">{item.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {selectedTab === 'analytics' && (
        <div className="px-4 pb-6 space-y-4">
          {/* Performance Trends */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Performance Trends
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Weekly Win Rate Trend</span>
                  <span className="text-green-600">📈 +12%</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[65, 58, 72, 45, 68, 59, 73].map((rate, index) => (
                    <div key={index} className="text-center">
                      <div 
                        className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-sm mx-auto"
                        style={{ height: `${rate}px`, width: '20px' }}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Profit Distribution</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { period: 'Week 1', profit: '+₹1,200', color: 'text-green-600' },
                    { period: 'Week 2', profit: '+₹850', color: 'text-green-600' },
                    { period: 'Week 3', profit: '-₹320', color: 'text-red-600' },
                    { period: 'Week 4', profit: '+₹2,100', color: 'text-green-600' }
                  ].map((item, index) => (
                    <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600">{item.period}</div>
                      <div className={`font-bold ${item.color}`}>{item.profit}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Time Analysis */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Time Analysis
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Most Active Hour:</span>
                <span className="font-bold">8:00 PM - 9:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Best Performance Day:</span>
                <span className="font-bold text-green-600">Thursday</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Session Duration:</span>
                <span className="font-bold">24 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Playing Time:</span>
                <span className="font-bold">18 hours 32 minutes</span>
              </div>
            </div>
          </div>

          {/* Risk Analysis */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold mb-3">Risk Profile</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Risk Level</span>
                  <span>Moderate</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Avg Risk per Game:</div>
                  <div className="font-bold">Medium</div>
                </div>
                <div>
                  <div className="text-gray-600">Max Single Bet:</div>
                  <div className="font-bold">₹500</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {selectedTab === 'achievements' && (
        <div className="px-4 pb-6 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold mb-3 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Gaming Achievements
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'First Win', icon: '🥇', unlocked: true, description: 'Win your first game' },
                { title: 'Win Streak', icon: '🔥', unlocked: true, description: '5 wins in a row' },
                { title: 'Big Winner', icon: '💎', unlocked: true, description: 'Win ₹1000+ in one game' },
                { title: 'Game Master', icon: '🎮', unlocked: false, description: 'Play 500 games' },
                { title: 'Profit King', icon: '👑', unlocked: false, description: 'Earn ₹50,000 profit' },
                { title: 'Lucky Seven', icon: '🍀', unlocked: false, description: '7x multiplier win' }
              ].map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-3 rounded-xl border-2 text-center ${
                    achievement.unlocked 
                      ? 'border-yellow-200 bg-yellow-50' 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className={`text-3xl mb-2 ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="font-bold text-sm">{achievement.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{achievement.description}</div>
                  {achievement.unlocked && (
                    <div className="mt-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                      UNLOCKED
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}