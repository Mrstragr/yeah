import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trophy, Users, Timer, Star, Crown, Gift } from 'lucide-react';

interface Tournament {
  id: string;
  name: string;
  game: string;
  prizePool: string;
  participants: number;
  maxParticipants: number;
  entryFee: string;
  status: 'upcoming' | 'live' | 'ended';
  startTime: string;
  endTime: string;
  description: string;
  icon: string;
  bgColor: string;
  vipOnly: boolean;
  currentRound?: number;
  totalRounds?: number;
}

interface TournamentProps {
  onBack: () => void;
}

export default function ComprehensiveTournamentSystem({ onBack }: TournamentProps) {
  const [selectedTab, setSelectedTab] = useState<'all' | 'live' | 'upcoming' | 'my-tournaments'>('all');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [userTournaments, setUserTournaments] = useState<string[]>([]);

  const tournaments: Tournament[] = [
    {
      id: 'mega-wingo-championship',
      name: 'Mega WinGo Championship',
      game: 'WinGo 3Min',
      prizePool: '₹50,000',
      participants: 1247,
      maxParticipants: 2000,
      entryFee: '₹100',
      status: 'live',
      startTime: '2025-07-03T14:00:00Z',
      endTime: '2025-07-03T18:00:00Z',
      description: 'Ultimate color prediction tournament with massive prizes',
      icon: '🎯',
      bgColor: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
      vipOnly: false,
      currentRound: 3,
      totalRounds: 10
    },
    {
      id: 'aviator-masters',
      name: 'Aviator Masters Cup',
      game: 'Aviator',
      prizePool: '₹75,000',
      participants: 892,
      maxParticipants: 1500,
      entryFee: '₹150',
      status: 'upcoming',
      startTime: '2025-07-03T20:00:00Z',
      endTime: '2025-07-03T23:59:00Z',
      description: 'High-stakes crash game tournament for skilled players',
      icon: '✈️',
      bgColor: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
      vipOnly: false
    },
    {
      id: 'vip-diamond-series',
      name: 'VIP Diamond Series',
      game: 'Dragon Tiger',
      prizePool: '₹1,00,000',
      participants: 234,
      maxParticipants: 500,
      entryFee: '₹500',
      status: 'upcoming',
      startTime: '2025-07-04T10:00:00Z',
      endTime: '2025-07-04T22:00:00Z',
      description: 'Exclusive VIP tournament with premium rewards',
      icon: '👑',
      bgColor: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      vipOnly: true
    },
    {
      id: 'mines-mayhem',
      name: 'Mines Mayhem Challenge',
      game: 'Mines',
      prizePool: '₹25,000',
      participants: 567,
      maxParticipants: 1000,
      entryFee: '₹50',
      status: 'live',
      startTime: '2025-07-03T12:00:00Z',
      endTime: '2025-07-03T16:00:00Z',
      description: 'Strategic minefield tournament for tacticians',
      icon: '💎',
      bgColor: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
      vipOnly: false,
      currentRound: 7,
      totalRounds: 12
    },
    {
      id: 'daily-quick-draw',
      name: 'Daily Quick Draw',
      game: 'Multiple Games',
      prizePool: '₹5,000',
      participants: 1834,
      maxParticipants: 3000,
      entryFee: '₹10',
      status: 'live',
      startTime: '2025-07-03T00:00:00Z',
      endTime: '2025-07-03T23:59:00Z',
      description: '24-hour open tournament for all skill levels',
      icon: '⚡',
      bgColor: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
      vipOnly: false,
      currentRound: 1,
      totalRounds: 1
    }
  ];

  const filteredTournaments = tournaments.filter(tournament => {
    switch (selectedTab) {
      case 'live':
        return tournament.status === 'live';
      case 'upcoming':
        return tournament.status === 'upcoming';
      case 'my-tournaments':
        return userTournaments.includes(tournament.id);
      default:
        return true;
    }
  });

  const joinTournament = (tournamentId: string) => {
    if (!userTournaments.includes(tournamentId)) {
      setUserTournaments(prev => [...prev, tournamentId]);
    }
  };

  const formatTimeLeft = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;
    
    if (diff <= 0) return "Ended";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (selectedTournament) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Tournament Detail Header */}
        <div 
          className="relative pt-12 pb-6 px-4 text-white"
          style={{ background: selectedTournament.bgColor }}
        >
          <button
            onClick={() => setSelectedTournament(null)}
            className="absolute top-4 left-4 p-2 rounded-full bg-black bg-opacity-20"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center">
            <div className="text-6xl mb-4">{selectedTournament.icon}</div>
            <h1 className="text-2xl font-bold mb-2">{selectedTournament.name}</h1>
            <p className="text-lg opacity-90">{selectedTournament.game}</p>
            
            {selectedTournament.vipOnly && (
              <div className="mt-2 inline-flex items-center bg-yellow-500 bg-opacity-20 px-3 py-1 rounded-full">
                <Crown className="w-4 h-4 mr-1" />
                <span className="text-sm font-bold">VIP ONLY</span>
              </div>
            )}
          </div>
        </div>

        {/* Tournament Stats */}
        <div className="px-4 py-6 bg-white">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{selectedTournament.prizePool}</div>
              <div className="text-sm text-gray-600">Prize Pool</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{selectedTournament.participants}</div>
              <div className="text-sm text-gray-600">Participants</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{selectedTournament.entryFee}</div>
              <div className="text-sm text-gray-600">Entry Fee</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {selectedTournament.status === 'live' ? formatTimeLeft(selectedTournament.endTime) : 'Upcoming'}
              </div>
              <div className="text-sm text-gray-600">Time Left</div>
            </div>
          </div>

          {selectedTournament.status === 'live' && selectedTournament.currentRound && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Tournament Progress</span>
                <span className="text-sm text-gray-600">
                  Round {selectedTournament.currentRound}/{selectedTournament.totalRounds}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((selectedTournament.currentRound || 1) / (selectedTournament.totalRounds || 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-bold mb-2">Tournament Description</h3>
            <p className="text-gray-600">{selectedTournament.description}</p>
          </div>

          {/* Join Tournament Button */}
          <div className="space-y-3">
            {userTournaments.includes(selectedTournament.id) ? (
              <div className="w-full bg-green-100 text-green-800 py-4 rounded-xl text-center font-bold">
                ✅ Already Joined
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => joinTournament(selectedTournament.id)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg"
              >
                Join Tournament - {selectedTournament.entryFee}
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-medium"
            >
              View Leaderboard
            </motion.button>
          </div>
        </div>

        {/* Prize Distribution */}
        <div className="px-4 py-6 bg-white mt-2">
          <h3 className="font-bold mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Prize Distribution
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <span className="ml-3 font-medium">1st Place</span>
              </div>
              <span className="font-bold text-yellow-600">₹25,000</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <span className="ml-3 font-medium">2nd Place</span>
              </div>
              <span className="font-bold text-gray-600">₹15,000</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <span className="ml-3 font-medium">3rd Place</span>
              </div>
              <span className="font-bold text-orange-600">₹10,000</span>
            </div>
            <div className="text-center text-sm text-gray-600 mt-2">
              + Prizes for top 50 players
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tournament Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 pt-12 pb-6 px-4 text-white">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-black bg-opacity-20"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h1 className="text-2xl font-bold mb-2">Tournaments</h1>
          <p className="text-lg opacity-90">Compete for massive prizes</p>
        </div>
      </div>

      {/* Tournament Stats Banner */}
      <div className="bg-white mx-4 -mt-4 rounded-2xl p-4 shadow-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-green-600">₹2.5L+</div>
            <div className="text-xs text-gray-600">Total Prizes</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600">4,572</div>
            <div className="text-xs text-gray-600">Active Players</div>
          </div>
          <div>
            <div className="text-xl font-bold text-purple-600">12</div>
            <div className="text-xs text-gray-600">Live Events</div>
          </div>
        </div>
      </div>

      {/* Tournament Tabs */}
      <div className="px-4 py-4">
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
          {[
            { key: 'all', label: 'All', icon: '🎮' },
            { key: 'live', label: 'Live', icon: '🔴' },
            { key: 'upcoming', label: 'Upcoming', icon: '⏰' },
            { key: 'my-tournaments', label: 'Joined', icon: '⭐' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                selectedTab === tab.key
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tournament List */}
      <div className="px-4 pb-6 space-y-3">
        <AnimatePresence>
          {filteredTournaments.map((tournament) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTournament(tournament)}
              className="bg-white rounded-2xl p-4 cursor-pointer shadow-sm"
            >
              <div className="flex items-start space-x-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl text-white"
                  style={{ background: tournament.bgColor }}
                >
                  {tournament.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{tournament.name}</h3>
                      <p className="text-sm text-gray-600">{tournament.game}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{tournament.prizePool}</div>
                      <div className="text-xs text-gray-600">Prize Pool</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-xs text-gray-600">
                        <Users className="w-3 h-3 mr-1" />
                        {tournament.participants}/{tournament.maxParticipants}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Timer className="w-3 h-3 mr-1" />
                        {tournament.status === 'live' ? formatTimeLeft(tournament.endTime) : 'Upcoming'}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {tournament.vipOnly && (
                        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                          VIP
                        </div>
                      )}
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                        tournament.status === 'live' ? 'bg-red-100 text-red-800' :
                        tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {tournament.status.toUpperCase()}
                      </div>
                      {userTournaments.includes(tournament.id) && (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                          JOINED
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}