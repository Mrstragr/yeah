import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Clock, DollarSign, Star, Crown, ArrowLeft, Target, Medal, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onBack: () => void;
}

interface Tournament {
  id: string;
  name: string;
  game: string;
  prizePool: number;
  entryFee: number;
  participants: number;
  maxParticipants: number;
  startTime: string;
  duration: number;
  status: 'upcoming' | 'live' | 'completed';
  prizes: { position: string; amount: number }[];
  isVip: boolean;
}

export default function ComprehensiveTournamentSystem({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'history' | 'leaderboard'>('live');
  const [balance, setBalance] = useState(12580.45);
  const [userTournaments, setUserTournaments] = useState<string[]>([]);
  const { toast } = useToast();

  const tournaments: Tournament[] = [
    {
      id: 'wingo-mega',
      name: 'WinGo Mega Championship',
      game: 'WinGo',
      prizePool: 250000,
      entryFee: 500,
      participants: 1247,
      maxParticipants: 2000,
      startTime: '2025-07-24T15:00:00',
      duration: 120,
      status: 'live',
      prizes: [
        { position: '1st', amount: 100000 },
        { position: '2nd', amount: 50000 },
        { position: '3rd', amount: 25000 },
        { position: '4th-10th', amount: 5000 },
        { position: '11th-50th', amount: 1000 }
      ],
      isVip: false
    },
    {
      id: 'aviator-elite',
      name: 'Aviator Elite Cup',
      game: 'Aviator',
      prizePool: 150000,
      entryFee: 1000,
      participants: 456,
      maxParticipants: 500,
      startTime: '2025-07-24T18:00:00',
      duration: 90,
      status: 'upcoming',
      prizes: [
        { position: '1st', amount: 60000 },
        { position: '2nd', amount: 30000 },
        { position: '3rd', amount: 15000 },
        { position: '4th-20th', amount: 2500 }
      ],
      isVip: true
    },
    {
      id: 'roulette-royal',
      name: 'Royal Roulette Tournament',
      game: 'Roulette',
      prizePool: 300000,
      entryFee: 750,
      participants: 892,
      maxParticipants: 1500,
      startTime: '2025-07-24T20:00:00',
      duration: 180,
      status: 'upcoming',
      prizes: [
        { position: '1st', amount: 120000 },
        { position: '2nd', amount: 60000 },
        { position: '3rd', amount: 30000 },
        { position: '4th-25th', amount: 4000 }
      ],
      isVip: false
    }
  ];

  const leaderboard = [
    { rank: 1, username: 'ProGamer91', score: 125500, avatar: '👑' },
    { rank: 2, username: 'LuckyWinner', score: 118200, avatar: '🎯' },
    { rank: 3, username: 'ChampionX', score: 112800, avatar: '⭐' },
    { rank: 4, username: 'MegaPlayer', score: 108400, avatar: '🔥' },
    { rank: 5, username: 'EliteGamer', score: 104500, avatar: '💎' },
    { rank: 6, username: 'YOU', score: 98750, avatar: '🎮' }
  ];

  const joinTournament = (tournamentId: string, entryFee: number) => {
    if (entryFee > balance) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough funds to join this tournament",
        variant: "destructive",
      });
      return;
    }

    if (userTournaments.includes(tournamentId)) {
      toast({
        title: "Already Joined",
        description: "You're already registered for this tournament",
        variant: "destructive",
      });
      return;
    }

    setBalance(prev => prev - entryFee);
    setUserTournaments(prev => [...prev, tournamentId]);
    
    toast({
      title: "Tournament Joined!",
      description: `Successfully registered for tournament`,
    });
  };

  const getTimeRemaining = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start.getTime() - now.getTime();
    
    if (diff <= 0) return 'Started';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const TournamentCard = ({ tournament }: { tournament: Tournament }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${
        tournament.isVip 
          ? 'from-yellow-600 to-orange-600' 
          : 'from-purple-600 to-blue-600'
      } rounded-xl p-4 mb-4 text-white relative overflow-hidden`}
    >
      {tournament.isVip && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
          VIP
        </div>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg">{tournament.name}</h3>
          <div className="text-sm opacity-90">{tournament.game}</div>
        </div>
        <div className="text-right">
          <div className="text-xs opacity-75">Prize Pool</div>
          <div className="font-bold text-xl">₹{tournament.prizePool.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center text-green-300 mb-1">
            <DollarSign className="w-4 h-4 mr-1" />
          </div>
          <div className="text-xs opacity-75">Entry Fee</div>
          <div className="font-bold">₹{tournament.entryFee}</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center text-blue-300 mb-1">
            <Users className="w-4 h-4 mr-1" />
          </div>
          <div className="text-xs opacity-75">Players</div>
          <div className="font-bold">{tournament.participants}/{tournament.maxParticipants}</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center text-orange-300 mb-1">
            <Clock className="w-4 h-4 mr-1" />
          </div>
          <div className="text-xs opacity-75">Starts In</div>
          <div className="font-bold text-sm">{getTimeRemaining(tournament.startTime)}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm font-bold mb-2">Prize Distribution:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {tournament.prizes.slice(0, 4).map((prize, index) => (
            <div key={index} className="bg-black/20 rounded-lg p-2">
              <div className="font-bold">{prize.position}</div>
              <div className="text-yellow-300">₹{prize.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      {tournament.status === 'upcoming' && (
        <Button
          onClick={() => joinTournament(tournament.id, tournament.entryFee)}
          disabled={userTournaments.includes(tournament.id)}
          className={`w-full ${
            userTournaments.includes(tournament.id)
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-900 hover:bg-gray-100'
          } font-bold`}
        >
          {userTournaments.includes(tournament.id) ? (
            <>
              <Trophy className="w-4 h-4 mr-2" />
              JOINED
            </>
          ) : (
            'JOIN TOURNAMENT'
          )}
        </Button>
      )}
      
      {tournament.status === 'live' && (
        <div className="bg-red-500 text-white text-center py-2 rounded-lg font-bold">
          <div className="flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
            LIVE NOW
          </div>
        </div>
      )}
    </motion.div>
  );

  const LeaderboardRow = ({ player, index }: { player: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-center justify-between p-4 rounded-xl mb-3 ${
        player.username === 'YOU' 
          ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white' 
          : 'bg-gray-800 text-white'
      }`}
    >
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 ${
          player.rank === 1 ? 'bg-yellow-500 text-black' :
          player.rank === 2 ? 'bg-gray-300 text-black' :
          player.rank === 3 ? 'bg-orange-600 text-white' :
          'bg-gray-600 text-white'
        }`}>
          {player.rank <= 3 ? (
            player.rank === 1 ? <Crown className="w-5 h-5" /> :
            player.rank === 2 ? <Medal className="w-5 h-5" /> :
            <Award className="w-5 h-5" />
          ) : (
            player.rank
          )}
        </div>
        <div>
          <div className="font-bold">{player.username}</div>
          <div className="text-sm opacity-75">Rank #{player.rank}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-lg">₹{player.score.toLocaleString()}</div>
        <div className="text-sm opacity-75">Total Winnings</div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 flex items-center justify-between">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">Tournaments</h1>
          <div className="text-sm opacity-90">Balance: ₹{balance.toFixed(2)}</div>
        </div>
        <div className="w-6 h-6" />
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-black/30">
        {[
          { key: 'live', label: 'Live', icon: Target },
          { key: 'upcoming', label: 'Upcoming', icon: Clock },
          { key: 'leaderboard', label: 'Rankings', icon: Trophy },
          { key: 'history', label: 'History', icon: Award }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-3 px-2 text-center transition-colors ${
              activeTab === tab.key
                ? 'bg-yellow-500 text-black'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="w-4 h-4 mx-auto mb-1" />
            <div className="text-xs font-bold">{tab.label}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'live' && (
            <motion.div
              key="live"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Live Tournaments</h2>
                <div className="text-sm text-gray-300">Currently running competitions</div>
              </div>
              {tournaments.filter(t => t.status === 'live').map(tournament => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </motion.div>
          )}

          {activeTab === 'upcoming' && (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Upcoming Tournaments</h2>
                <div className="text-sm text-gray-300">Register now to compete</div>
              </div>
              {tournaments.filter(t => t.status === 'upcoming').map(tournament => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Global Rankings</h2>
                <div className="text-sm text-gray-300">Top players this week</div>
              </div>
              
              {/* Top 3 Podium */}
              <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-4 mb-6">
                <div className="flex justify-center items-end space-x-4">
                  {/* 2nd Place */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-black font-bold text-2xl mb-2">
                      🥈
                    </div>
                    <div className="font-bold text-sm">{leaderboard[1].username}</div>
                    <div className="text-xs">₹{leaderboard[1].score.toLocaleString()}</div>
                  </div>
                  
                  {/* 1st Place */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-3xl mb-2">
                      👑
                    </div>
                    <div className="font-bold">{leaderboard[0].username}</div>
                    <div className="text-sm">₹{leaderboard[0].score.toLocaleString()}</div>
                  </div>
                  
                  {/* 3rd Place */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-2">
                      🥉
                    </div>
                    <div className="font-bold text-sm">{leaderboard[2].username}</div>
                    <div className="text-xs">₹{leaderboard[2].score.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Full Leaderboard */}
              {leaderboard.map((player, index) => (
                <LeaderboardRow key={index} player={player} index={index} />
              ))}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Tournament History</h2>
                <div className="text-sm text-gray-300">Your past tournament results</div>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'WinGo Championship', position: '12th', prize: 2500, date: '2025-07-20' },
                  { name: 'Aviator Elite Cup', position: '8th', prize: 5000, date: '2025-07-18' },
                  { name: 'Mines Tournament', position: '3rd', prize: 15000, date: '2025-07-15' }
                ].map((result, index) => (
                  <div key={index} className="bg-gray-800 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold">{result.name}</div>
                        <div className="text-sm text-gray-300">{result.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-yellow-400">{result.position}</div>
                        <div className="text-green-400">+₹{result.prize.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}