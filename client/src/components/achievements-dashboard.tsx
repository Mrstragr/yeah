import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Gift, Clock, CheckCircle, Lock } from "lucide-react";

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: string;
  reward: string;
  isActive: boolean;
  unlocked?: boolean;
  progress?: number;
  maxProgress?: number;
}

interface AchievementsDashboardProps {
  user: any;
}

export function AchievementsDashboard({ user }: AchievementsDashboardProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const { data: userAchievements = [] } = useQuery({
    queryKey: ["/api/user/achievements"],
    enabled: !!user,
  });

  const { data: leaderboard = [] } = useQuery({
    queryKey: ["/api/leaderboard"],
    enabled: !!user,
  });

  const categories = [
    { id: 'all', name: 'All', icon: Trophy, color: 'from-yellow-500 to-orange-500' },
    { id: 'gaming', name: 'Gaming', icon: Star, color: 'from-blue-500 to-purple-500' },
    { id: 'financial', name: 'Financial', icon: Gift, color: 'from-green-500 to-emerald-500' },
    { id: 'social', name: 'Social', icon: Clock, color: 'from-pink-500 to-rose-500' },
    { id: 'special', name: 'Special', icon: CheckCircle, color: 'from-purple-500 to-indigo-500' }
  ];

  const filteredAchievements = activeCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === activeCategory);

  const unlockedCount = userAchievements.length;
  const totalRewards = userAchievements.reduce((sum: number, ua: any) => sum + parseFloat(ua.achievement?.reward || '0'), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">🏆 Achievements & Leaderboard</h1>
          <p className="text-gray-300">Unlock rewards and compete with other players</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white">{unlockedCount}</p>
              <p className="text-sm text-yellow-300">Achievements Unlocked</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-6 text-center">
              <Gift className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white">₹{totalRewards.toLocaleString()}</p>
              <p className="text-sm text-green-300">Total Rewards</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <Star className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white">#{leaderboard.findIndex((p: any) => p.userId === user?.id) + 1 || 'N/A'}</p>
              <p className="text-sm text-blue-300">Leaderboard Rank</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white">{Math.round((unlockedCount / achievements.length) * 100) || 0}%</p>
              <p className="text-sm text-purple-300">Completion Rate</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Achievements Section */}
          <div className="lg:col-span-2">
            {/* Category Filter */}
            <motion.div 
              className="flex flex-wrap gap-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    className={`px-4 py-2 ${
                      activeCategory === category.id
                        ? `bg-gradient-to-r ${category.color} text-white`
                        : 'border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {category.name}
                  </Button>
                );
              })}
            </motion.div>

            {/* Achievements Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <AnimatePresence>
                {filteredAchievements.map((achievement, index) => {
                  const isUnlocked = userAchievements.some((ua: any) => ua.achievementId === achievement.id);
                  const requirement = JSON.parse(achievement.requirement);
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                        isUnlocked 
                          ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50' 
                          : 'bg-gray-800/50 border-gray-700'
                      }`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                                isUnlocked ? 'bg-green-500/20' : 'bg-gray-700/50'
                              }`}>
                                {isUnlocked ? '✅' : achievement.icon}
                              </div>
                              <div>
                                <h3 className={`font-bold ${isUnlocked ? 'text-green-300' : 'text-white'}`}>
                                  {achievement.name}
                                </h3>
                                <p className="text-sm text-gray-400">{achievement.description}</p>
                              </div>
                            </div>
                            {isUnlocked ? (
                              <CheckCircle className="w-6 h-6 text-green-400" />
                            ) : (
                              <Lock className="w-6 h-6 text-gray-500" />
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Reward:</span>
                              <span className="text-yellow-400 font-bold">₹{achievement.reward}</span>
                            </div>
                            
                            {!isUnlocked && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-400">Progress:</span>
                                  <span className="text-blue-400">
                                    {achievement.progress || 0} / {requirement.value}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                    style={{ 
                                      width: `${Math.min(((achievement.progress || 0) / requirement.value) * 100, 100)}%` 
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {isUnlocked && (
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                              <Trophy className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Leaderboard Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
                    Top Players
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard.slice(0, 10).map((player: any, index: number) => (
                      <div 
                        key={player.userId}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                          player.userId === user?.id 
                            ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30' 
                            : 'bg-gray-700/30 hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-gray-400 text-black' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className={`font-medium ${player.userId === user?.id ? 'text-purple-300' : 'text-white'}`}>
                              {player.username}
                            </p>
                            <p className="text-xs text-gray-400">
                              ₹{parseFloat(player.score || '0').toLocaleString()} total winnings
                            </p>
                          </div>
                        </div>
                        {index < 3 && (
                          <div className="text-xl">
                            {index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}