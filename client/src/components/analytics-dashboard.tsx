import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Users, Clock, Target, Award, Gamepad2, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface GameAnalytics {
  gameId: number;
  gameTitle: string;
  totalPlays: number;
  totalBets: string;
  totalWins: string;
  winRate: number;
  averageBet: string;
  popularityScore: number;
  lastPlayed: Date;
}

interface PlayerPerformance {
  userId: number;
  totalGames: number;
  totalBets: string;
  totalWins: string;
  winRate: number;
  favoriteGame: string;
  longestStreak: number;
  averageSessionTime: number;
  lastActivity: Date;
}

interface RealTimeStats {
  activePlayers?: number;
  gamesInProgress?: number;
  totalBetsToday?: string;
  totalWinsToday?: string;
  popularGame?: string;
  peakHour?: string;
}

export function AnalyticsDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");

  const { data: gameAnalytics = [], isLoading: loadingGames } = useQuery({
    queryKey: ["/api/analytics/games"],
    refetchInterval: 30000, // Update every 30 seconds
  });

  const { data: realTimeStats = {}, isLoading: loadingRealTime } = useQuery<RealTimeStats>({
    queryKey: ["/api/analytics/realtime"],
    refetchInterval: 5000, // Update every 5 seconds
  });

  const { data: playerPerformance = {}, isLoading: loadingPlayer } = useQuery<PlayerPerformance>({
    queryKey: ["/api/analytics/player/1"], // Demo user
    refetchInterval: 60000, // Update every minute
  });

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loadingGames || loadingRealTime || loadingPlayer) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Active Players</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {realTimeStats?.activePlayers || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Games Active</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {realTimeStats?.gamesInProgress || 0}
                  </p>
                </div>
                <Gamepad2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Today's Bets</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {realTimeStats?.totalBetsToday ? formatCurrency(realTimeStats.totalBetsToday) : '₹0'}
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Today's Wins</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {realTimeStats?.totalWinsToday ? formatCurrency(realTimeStats.totalWinsToday) : '₹0'}
                  </p>
                </div>
                <Award className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="games" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="games">Game Performance</TabsTrigger>
          <TabsTrigger value="player">Player Stats</TabsTrigger>
          <TabsTrigger value="trends">Live Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="games">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Game Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(gameAnalytics) && gameAnalytics.slice(0, 8).map((game: GameAnalytics, index: number) => (
                  <motion.div
                    key={game.gameId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{game.gameTitle}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Plays</p>
                            <p className="font-bold">{game.totalPlays.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Bets</p>
                            <p className="font-bold">{formatCurrency(game.totalBets)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
                            <p className="font-bold text-green-600">{formatPercentage(game.winRate)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Bet</p>
                            <p className="font-bold">{formatCurrency(game.averageBet)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Badge 
                          variant={game.popularityScore > 80 ? "default" : game.popularityScore > 60 ? "secondary" : "outline"}
                          className="mb-2"
                        >
                          {game.popularityScore > 80 ? "Hot" : game.popularityScore > 60 ? "Popular" : "Normal"}
                        </Badge>
                        <Progress value={game.popularityScore} className="w-24" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="player">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Player Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {playerPerformance && Object.keys(playerPerformance).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{(playerPerformance as any).totalGames || 0}</p>
                      <p className="text-sm text-blue-500">Total Games Played</p>
                    </div>
                  </div>
                  
                  <div className="p-6 border rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{formatPercentage((playerPerformance as any).winRate || 0)}</p>
                      <p className="text-sm text-green-500">Overall Win Rate</p>
                    </div>
                  </div>
                  
                  <div className="p-6 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">{(playerPerformance as any).longestStreak || 0}</p>
                      <p className="text-sm text-purple-500">Longest Win Streak</p>
                    </div>
                  </div>
                  
                  <div className="p-6 border rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                    <div className="text-center">
                      <p className="text-xl font-bold text-orange-600">{formatCurrency((playerPerformance as any).totalBets || "0")}</p>
                      <p className="text-sm text-orange-500">Total Wagered</p>
                    </div>
                  </div>
                  
                  <div className="p-6 border rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                    <div className="text-center">
                      <p className="text-xl font-bold text-red-600">{formatCurrency((playerPerformance as any).totalWins || "0")}</p>
                      <p className="text-sm text-red-500">Total Winnings</p>
                    </div>
                  </div>
                  
                  <div className="p-6 border rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
                    <div className="text-center">
                      <p className="text-xl font-bold text-indigo-600">{(playerPerformance as any).favoriteGame || "No Data"}</p>
                      <p className="text-sm text-indigo-500">Favorite Game</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Gaming Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-3">Most Popular Game Right Now</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">
                        {realTimeStats?.popularGame || "Aviator Crash"}
                      </span>
                      <Badge variant="default">TRENDING</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-3">Peak Gaming Hour</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        {realTimeStats?.peakHour || "8:00 PM - 9:00 PM"}
                      </span>
                      <Badge variant="secondary">PEAK TIME</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Live Activity Feed
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Player "Winner123" just won ₹15,000 on Aviator!</span>
                      <span className="text-gray-500">2 min ago</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Big win alert: ₹25,000 jackpot hit on Mega Slots!</span>
                      <span className="text-gray-500">5 min ago</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>New record: 47x multiplier achieved in Crash Game!</span>
                      <span className="text-gray-500">8 min ago</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Player "LuckyGamer" completed 10-game winning streak!</span>
                      <span className="text-gray-500">12 min ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}