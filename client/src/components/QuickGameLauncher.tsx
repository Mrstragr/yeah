import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Star, Users, Trophy, TrendingUp } from 'lucide-react';

// Game Components
import AuthenticWinGoGame from './AuthenticWinGoGame';
import AuthenticAviatorGame from './AuthenticAviatorGame';
import SimpleWorkingWinGo from './SimpleWorkingWinGo';
import SimpleWorkingAviator from './SimpleWorkingAviator';

interface Game {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  bgColor: string;
  icon: string;
  description: string;
  players: string;
  hot: boolean;
}

const games: Game[] = [
  {
    id: 'authentic-wingo',
    name: 'WIN GO',
    component: AuthenticWinGoGame,
    bgColor: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    icon: '🎯',
    description: '30 Second Rounds',
    players: '12.5K',
    hot: true
  },
  {
    id: 'authentic-aviator',
    name: 'AVIATOR',
    component: AuthenticAviatorGame,
    bgColor: 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)',
    icon: '✈️',
    description: 'Real-time Multipliers',
    players: '8.7K',
    hot: true
  },
  {
    id: 'simple-wingo',
    name: 'Simple WIN GO',
    component: SimpleWorkingWinGo,
    bgColor: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
    icon: '🎲',
    description: 'Easy Play',
    players: '5.2K',
    hot: false
  },
  {
    id: 'simple-aviator',
    name: 'Simple AVIATOR',
    component: SimpleWorkingAviator,
    bgColor: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    icon: '🚀',
    description: 'Beginner Friendly',
    players: '3.8K',
    hot: false
  }
];

export default function QuickGameLauncher() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [balance, setBalance] = useState(10000);

  // Mock user for games
  const mockUser = {
    id: 1,
    username: 'Player',
    phone: '9876543210',
    email: 'player@example.com',
    walletBalance: balance.toString(),
    isVerified: true
  };

  if (selectedGame) {
    const GameComponent = selectedGame.component;
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-md mx-auto bg-gray-900 min-h-screen">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 flex items-center">
            <button
              onClick={() => setSelectedGame(null)}
              className="mr-3 p-2 rounded-full bg-black bg-opacity-20 hover:bg-opacity-30 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-lg font-bold">{selectedGame.name}</h1>
          </div>
          
          <GameComponent
            user={mockUser}
            balance={balance}
            onUpdateBalance={(newBalance: number) => setBalance(newBalance)}
            onBack={() => setSelectedGame(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-md mx-auto bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">🎮 TashanWin Games</h1>
            <div className="bg-black bg-opacity-20 px-3 py-1 rounded-full">
              <span className="text-sm">Balance: ₹{balance.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="bg-black bg-opacity-20 px-3 py-1 rounded text-xs flex items-center">
            <span className="text-yellow-300 mr-2">🎉</span>
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                All games ready to play • Real money mechanics • Instant play
              </div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-white text-lg font-semibold mb-3 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Featured Games
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {games.map((game) => (
                <motion.div
                  key={game.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedGame(game)}
                  className="relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer shadow-lg border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <div 
                    className="h-32 flex items-center justify-center relative"
                    style={{ background: game.bgColor }}
                  >
                    {game.hot && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        HOT
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className="text-4xl mb-2">{game.icon}</div>
                      <h3 className="text-white text-xl font-bold">{game.name}</h3>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-sm">{game.description}</span>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        {game.players}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-400 text-sm">
                        <Trophy className="w-4 h-4 mr-1" />
                        Win Rate: {Math.floor(Math.random() * 30 + 40)}%
                      </div>
                      
                      <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all">
                        <Play className="w-4 h-4 mr-1" />
                        Play Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Game Stats */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h3 className="text-white text-lg font-semibold mb-3">Today's Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">₹{(Math.random() * 50000 + 25000).toLocaleString('en-IN', {maximumFractionDigits: 0})}</div>
                <div className="text-gray-400 text-sm">Total Wins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{Math.floor(Math.random() * 5000 + 15000)}</div>
                <div className="text-gray-400 text-sm">Games Played</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}