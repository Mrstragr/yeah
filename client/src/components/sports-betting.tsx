import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Trophy, 
  Clock, 
  TrendingUp, 
  Users, 
  Star,
  Target,
  Play,
  Calendar
} from "lucide-react";

interface Match {
  id: number;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeOdds: number;
  awayOdds: number;
  drawOdds?: number;
  startTime: string;
  status: "upcoming" | "live" | "ended";
  totalBets: number;
  featured: boolean;
}

interface BetSlip {
  matchId: number;
  selection: string;
  odds: number;
  stake: string;
}

const matches: Match[] = [
  {
    id: 1,
    sport: "Cricket",
    league: "IPL 2024",
    homeTeam: "Mumbai Indians",
    awayTeam: "Chennai Super Kings",
    homeOdds: 1.85,
    awayOdds: 1.95,
    startTime: "Today 7:30 PM",
    status: "upcoming",
    totalBets: 15420,
    featured: true
  },
  {
    id: 2,
    sport: "Football",
    league: "Premier League",
    homeTeam: "Manchester City",
    awayTeam: "Liverpool",
    homeOdds: 2.1,
    awayOdds: 3.2,
    drawOdds: 3.8,
    startTime: "Tomorrow 12:30 AM",
    status: "upcoming",
    totalBets: 8932,
    featured: true
  },
  {
    id: 3,
    sport: "Cricket",
    league: "T20 World Cup",
    homeTeam: "India",
    awayTeam: "Australia",
    homeOdds: 1.75,
    awayOdds: 2.05,
    startTime: "Live Now",
    status: "live",
    totalBets: 25680,
    featured: false
  },
  {
    id: 4,
    sport: "Kabaddi",
    league: "Pro Kabaddi",
    homeTeam: "Patna Pirates",
    awayTeam: "Bengaluru Bulls",
    homeOdds: 1.9,
    awayOdds: 1.9,
    startTime: "Today 9:00 PM",
    status: "upcoming",
    totalBets: 3456,
    featured: false
  }
];

export function SportsBetting() {
  const [betSlip, setBetSlip] = useState<BetSlip[]>([]);
  const [activeTab, setActiveTab] = useState("featured");

  const addToBetSlip = (match: Match, selection: string, odds: number) => {
    const newBet: BetSlip = {
      matchId: match.id,
      selection: `${match.homeTeam} vs ${match.awayTeam} - ${selection}`,
      odds,
      stake: ""
    };

    setBetSlip(prev => {
      const existing = prev.findIndex(bet => bet.matchId === match.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newBet;
        return updated;
      }
      return [...prev, newBet];
    });
  };

  const removeBet = (matchId: number) => {
    setBetSlip(prev => prev.filter(bet => bet.matchId !== matchId));
  };

  const updateStake = (matchId: number, stake: string) => {
    setBetSlip(prev => prev.map(bet => 
      bet.matchId === matchId ? { ...bet, stake } : bet
    ));
  };

  const calculatePayout = () => {
    return betSlip.reduce((total, bet) => {
      const stake = parseFloat(bet.stake) || 0;
      return total + (stake * bet.odds);
    }, 0);
  };

  const getTotalStake = () => {
    return betSlip.reduce((total, bet) => {
      return total + (parseFloat(bet.stake) || 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-casino font-bold text-casino-gold">
            ⚽ Sports Betting
          </h2>
          <p className="text-sm text-casino-text-muted">
            Bet on live sports events with real-time odds
          </p>
        </div>
        <Badge className="bg-casino-green text-white">
          {matches.filter(m => m.status === "live").length} Live Now
        </Badge>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-casino-border">
        {["featured", "cricket", "football", "kabaddi"].map((tab) => (
          <button
            key={tab}
            className={`pb-2 px-1 text-sm font-medium capitalize ${
              activeTab === tab 
                ? "text-casino-gold border-b-2 border-casino-gold" 
                : "text-casino-text-muted hover:text-casino-gold"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matches List */}
        <div className="lg:col-span-2 space-y-4">
          {matches
            .filter(match => 
              activeTab === "featured" ? match.featured : 
              match.sport.toLowerCase() === activeTab
            )
            .map((match) => (
            <Card key={match.id} className="game-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {match.sport}
                    </Badge>
                    <span className="text-xs text-casino-text-muted">
                      {match.league}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {match.status === "live" && (
                      <Badge className="bg-casino-red text-white text-xs animate-pulse">
                        🔴 LIVE
                      </Badge>
                    )}
                    <div className="flex items-center text-xs text-casino-text-muted">
                      <Users className="w-3 h-3 mr-1" />
                      {match.totalBets.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <div className="font-casino font-bold text-white text-sm">
                        {match.homeTeam}
                      </div>
                    </div>
                    <div className="text-casino-text-muted text-xs px-4">VS</div>
                    <div className="text-center flex-1">
                      <div className="font-casino font-bold text-white text-sm">
                        {match.awayTeam}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-casino-text-muted mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {match.startTime}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-casino-border hover:bg-casino-gold hover:text-casino-primary"
                    onClick={() => addToBetSlip(match, match.homeTeam, match.homeOdds)}
                  >
                    <div className="text-center w-full">
                      <div className="font-semibold">{match.homeTeam}</div>
                      <div className="text-casino-gold">{match.homeOdds}</div>
                    </div>
                  </Button>
                  
                  {match.drawOdds && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-casino-border hover:bg-casino-gold hover:text-casino-primary"
                      onClick={() => addToBetSlip(match, "Draw", match.drawOdds!)}
                    >
                      <div className="text-center w-full">
                        <div className="font-semibold">Draw</div>
                        <div className="text-casino-gold">{match.drawOdds}</div>
                      </div>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-casino-border hover:bg-casino-gold hover:text-casino-primary"
                    onClick={() => addToBetSlip(match, match.awayTeam, match.awayOdds)}
                  >
                    <div className="text-center w-full">
                      <div className="font-semibold">{match.awayTeam}</div>
                      <div className="text-casino-gold">{match.awayOdds}</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bet Slip */}
        <div className="lg:col-span-1">
          <Card className="casino-card sticky top-4">
            <CardContent className="p-4">
              <h3 className="font-casino font-bold text-casino-gold mb-4 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Bet Slip ({betSlip.length})
              </h3>

              {betSlip.length === 0 ? (
                <div className="text-center py-8 text-casino-text-muted">
                  <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Click on odds to add bets</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {betSlip.map((bet) => (
                    <div key={bet.matchId} className="bg-casino-accent/50 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-casino-text-muted truncate">
                            {bet.selection}
                          </div>
                          <div className="text-sm font-semibold text-casino-gold">
                            Odds: {bet.odds}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBet(bet.matchId)}
                          className="text-casino-red hover:text-casino-red"
                        >
                          ×
                        </Button>
                      </div>
                      <Input
                        type="number"
                        placeholder="Enter stake (₹)"
                        value={bet.stake}
                        onChange={(e) => updateStake(bet.matchId, e.target.value)}
                        className="text-sm"
                      />
                      {bet.stake && (
                        <div className="text-xs text-casino-green mt-1">
                          Payout: ₹{(parseFloat(bet.stake) * bet.odds).toFixed(2)}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="border-t border-casino-border pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-casino-text-muted">Total Stake:</span>
                      <span className="text-white">₹{getTotalStake().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-casino-text-muted">Potential Payout:</span>
                      <span className="text-casino-gold font-semibold">
                        ₹{calculatePayout().toFixed(2)}
                      </span>
                    </div>
                    <Button 
                      className="btn-casino-primary w-full"
                      disabled={getTotalStake() === 0}
                    >
                      Place Bet
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Updates Banner */}
      <Card className="casino-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-casino-red rounded-full animate-pulse"></div>
              <div>
                <div className="font-semibold text-white text-sm">Live Updates</div>
                <div className="text-xs text-casino-text-muted">
                  India 145/3 (18.2 overs) vs Australia - Match in progress
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-casino-gold">
              <Play className="w-4 h-4 mr-1" />
              Watch Live
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}