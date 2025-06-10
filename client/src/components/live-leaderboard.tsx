import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingUp, Users, Clock } from "lucide-react";

interface LeaderboardEntry {
  id: number;
  username: string;
  winnings: number;
  gamesPlayed: number;
  winRate: number;
  currentStreak: number;
  rank: number;
}

interface LiveLeaderboardProps {
  timeFrame: 'daily' | 'weekly' | 'monthly' | 'allTime';
  gameType?: string;
}

export default function LiveLeaderboard({ timeFrame = 'daily', gameType }: LiveLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchLeaderboard();
    
    // Update every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [timeFrame, gameType]);

  const fetchLeaderboard = async () => {
    try {
      const params = new URLSearchParams({
        timeFrame,
        ...(gameType && { gameType })
      });
      
      const response = await fetch(`/api/leaderboard?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gaming-gold font-bold">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 border-yellow-400/30";
      case 2:
        return "bg-gradient-to-r from-gray-600/20 to-gray-400/20 border-gray-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-amber-400/20 border-amber-400/30";
      default:
        return "bg-gaming-accent/10 border-gaming-accent/20";
    }
  };

  const getTimeFrameLabel = () => {
    switch (timeFrame) {
      case 'daily': return 'Today\'s Top Players';
      case 'weekly': return 'This Week\'s Champions';
      case 'monthly': return 'Monthly Leaders';
      case 'allTime': return 'All-Time Legends';
      default: return 'Leaderboard';
    }
  };

  if (isLoading) {
    return (
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="text-gaming-gold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            {getTimeFrameLabel()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="animate-pulse bg-gaming-accent/20 h-16 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="game-card">
      <CardHeader>
        <CardTitle className="text-gaming-gold flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            {getTimeFrameLabel()}
          </div>
          <div className="flex items-center space-x-2 text-sm text-casino-text-secondary">
            <Clock className="w-4 h-4" />
            <span>Updated {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-casino-text-muted mx-auto mb-2" />
              <p className="text-casino-text-muted">No players yet</p>
              <p className="text-sm text-casino-text-muted">Be the first to play and win!</p>
            </div>
          ) : (
            leaderboard.map((player) => (
              <div
                key={player.id}
                className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-lg ${getRankStyle(player.rank)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getRankIcon(player.rank)}
                    <div>
                      <div className="font-bold text-white">{player.username}</div>
                      <div className="text-sm text-casino-text-secondary">
                        {player.gamesPlayed} games • {player.winRate.toFixed(1)}% win rate
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gaming-gold">
                      ₹{player.winnings.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      {player.currentStreak > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          🔥 {player.currentStreak} streak
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {leaderboard.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gaming-accent/20">
            <div className="text-center text-sm text-casino-text-secondary">
              {timeFrame === 'daily' && "Resets at midnight"}
              {timeFrame === 'weekly' && "Resets every Monday"}
              {timeFrame === 'monthly' && "Resets on 1st of each month"}
              {timeFrame === 'allTime' && "All-time statistics"}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}