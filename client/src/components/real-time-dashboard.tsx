import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Zap,
  Target,
  DollarSign,
  Activity,
  Award
} from "lucide-react";

interface LiveStats {
  activePlayers: number;
  totalBets: number;
  totalWins: number;
  jackpotAmount: number;
  topGame: string;
  winRate: number;
}

interface RealTimeDashboardProps {
  user: any;
}

export function RealTimeDashboard({ user }: RealTimeDashboardProps) {
  const [liveStats, setLiveStats] = useState<LiveStats>({
    activePlayers: 1247,
    totalBets: 156789,
    totalWins: 89342,
    jackpotAmount: 250000,
    topGame: "Aviator",
    winRate: 57.2
  });

  const { data: recentWins = [] } = useQuery({
    queryKey: ["/api/recent-wins"],
  });

  const { data: gameMetrics = [] } = useQuery({
    queryKey: ["/api/game-metrics"],
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        activePlayers: prev.activePlayers + Math.floor(Math.random() * 10 - 5),
        totalBets: prev.totalBets + Math.floor(Math.random() * 50),
        totalWins: prev.totalWins + Math.floor(Math.random() * 30),
        jackpotAmount: prev.jackpotAmount + Math.floor(Math.random() * 1000 - 500),
        winRate: Math.max(45, Math.min(70, prev.winRate + (Math.random() * 2 - 1)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const mockRecentWins = [
    { username: "Player***", game: "Aviator", amount: 15420, multiplier: "12.3x" },
    { username: "Gamer***", game: "Dice Roll", amount: 8900, multiplier: "9x" },
    { username: "Lucky***", game: "Coin Flip", amount: 5600, multiplier: "1.95x" },
    { username: "Pro***", game: "Aviator", amount: 23100, multiplier: "18.7x" },
    { username: "Winner***", game: "Blackjack", amount: 7800, multiplier: "2.1x" }
  ];

  const mockGameMetrics = [
    { name: "Aviator", players: 342, popularity: 89 },
    { name: "Coin Flip", players: 198, popularity: 76 },
    { name: "Dice Roll", players: 156, popularity: 68 },
    { name: "Blackjack", players: 134, popularity: 62 },
    { name: "Plinko", players: 98, popularity: 45 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">📊 Live Gaming Dashboard</h1>
          <p className="text-gray-300">Real-time statistics and player activity</p>
        </motion.div>

        {/* Live Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300">Active Players</p>
                  <motion.p 
                    className="text-3xl font-bold text-white"
                    key={liveStats.activePlayers}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {liveStats.activePlayers.toLocaleString()}
                  </motion.p>
                  <p className="text-xs text-green-400">+12 in last minute</p>
                </div>
                <Users className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-300">Total Bets Today</p>
                  <motion.p 
                    className="text-3xl font-bold text-white"
                    key={liveStats.totalBets}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {liveStats.totalBets.toLocaleString()}
                  </motion.p>
                  <p className="text-xs text-green-400">+247 this hour</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-300">Current Jackpot</p>
                  <motion.p 
                    className="text-3xl font-bold text-white"
                    key={liveStats.jackpotAmount}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    ₹{liveStats.jackpotAmount.toLocaleString()}
                  </motion.p>
                  <p className="text-xs text-yellow-400">Growing every bet</p>
                </div>
                <Award className="w-12 h-12 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-300">Win Rate</p>
                  <motion.p 
                    className="text-3xl font-bold text-white"
                    key={Math.round(liveStats.winRate)}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {liveStats.winRate.toFixed(1)}%
                  </motion.p>
                  <p className="text-xs text-purple-400">Platform average</p>
                </div>
                <Target className="w-12 h-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Big Wins */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="w-6 h-6 mr-2 text-green-400" />
                  Recent Big Wins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecentWins.map((win, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Award className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{win.username}</p>
                          <p className="text-sm text-gray-400">{win.game}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">₹{win.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-400">{win.multiplier}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Game Popularity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-6 h-6 mr-2 text-blue-400" />
                  Game Popularity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockGameMetrics.map((game, index) => (
                    <motion.div
                      key={game.name}
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{game.name}</span>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">{game.players}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${game.popularity}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Your Performance */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-6 h-6 mr-2 text-yellow-400" />
                Your Gaming Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">₹{parseFloat(user?.walletBalance || '0').toLocaleString()}</p>
                  <p className="text-sm text-gray-300">Current Balance</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">12</p>
                  <p className="text-sm text-gray-300">Games Won Today</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400">67%</p>
                  <p className="text-sm text-gray-300">Personal Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">VIP 3</p>
                  <p className="text-sm text-gray-300">Current Level</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}