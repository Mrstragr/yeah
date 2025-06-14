import React, { useState, useEffect } from 'react';
import { Crown, Trophy, MessageCircle, Gift, TrendingUp, Star, Users, Zap } from 'lucide-react';

interface LiveFeaturesProps {
  walletBalance: number;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  winnings: number;
  avatar: string;
  isOnline: boolean;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  type: 'user' | 'system' | 'win';
  amount?: number;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  reward: string;
  type: 'deposit' | 'cashback' | 'bonus';
  expiresIn: string;
  progress: number;
}

export function LiveFeatures({ walletBalance }: LiveFeaturesProps) {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, username: 'ProGamer98', winnings: 45680, avatar: '🎮', isOnline: true },
    { rank: 2, username: 'LuckyWinner', winnings: 38920, avatar: '🍀', isOnline: true },
    { rank: 3, username: 'DragonMaster', winnings: 32150, avatar: '🐉', isOnline: false },
    { rank: 4, username: 'GoldRush', winnings: 28730, avatar: '💰', isOnline: true },
    { rank: 5, username: 'DiamondKing', winnings: 25890, avatar: '💎', isOnline: true },
    { rank: 6, username: 'CasinoQueen', winnings: 22450, avatar: '👑', isOnline: false },
    { rank: 7, username: 'FastWin', winnings: 19680, avatar: '⚡', isOnline: true },
    { rank: 8, username: 'BigBettor', winnings: 17320, avatar: '🎯', isOnline: true }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', username: 'System', message: 'Welcome to 91DREAMCLUB live chat!', timestamp: '14:30', type: 'system' },
    { id: '2', username: 'ProGamer98', message: 'Just won big on WIN GO! 🎉', timestamp: '14:32', type: 'user' },
    { id: '3', username: 'System', message: 'LuckyWinner won ₹8,550 on Aviator!', timestamp: '14:33', type: 'win', amount: 8550 },
    { id: '4', username: 'DragonMaster', message: 'Anyone playing Dragon Tiger?', timestamp: '14:35', type: 'user' },
    { id: '5', username: 'System', message: 'DiamondKing won ₹12,200 on Mines!', timestamp: '14:36', type: 'win', amount: 12200 },
    { id: '6', username: 'GoldRush', message: 'K3 is hot today! 🔥', timestamp: '14:38', type: 'user' }
  ]);

  const [promotions, setPromotions] = useState<Promotion[]>([
    { id: '1', title: 'First Deposit Bonus', description: 'Get 100% bonus on your first deposit', reward: '₹5,000', type: 'deposit', expiresIn: '2h 15m', progress: 0 },
    { id: '2', title: 'Daily Cashback', description: 'Get 10% cashback on daily losses', reward: '10%', type: 'cashback', expiresIn: '18h 45m', progress: 65 },
    { id: '3', title: 'Lucky Spin Bonus', description: 'Play 50 games to unlock lucky spin', reward: 'Free Spins', type: 'bonus', expiresIn: '5d 12h', progress: 32 }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers] = useState(1247);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update online status randomly
      setLeaderboard(prev => prev.map(entry => ({
        ...entry,
        isOnline: Math.random() > 0.3
      })));

      // Add random win messages
      if (Math.random() > 0.7) {
        const winners = ['ProGamer98', 'LuckyWinner', 'DragonMaster', 'GoldRush', 'DiamondKing'];
        const games = ['WIN GO', 'Aviator', 'Mines', 'Dragon Tiger', 'K3 Lotre'];
        const winner = winners[Math.floor(Math.random() * winners.length)];
        const game = games[Math.floor(Math.random() * games.length)];
        const amount = Math.floor(Math.random() * 50000) + 1000;

        const newWinMessage: ChatMessage = {
          id: Date.now().toString(),
          username: 'System',
          message: `${winner} won ₹${amount.toLocaleString()} on ${game}!`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          type: 'win',
          amount
        };

        setChatMessages(prev => [newWinMessage, ...prev.slice(0, 19)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      username: 'You',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      type: 'user'
    };

    setChatMessages(prev => [message, ...prev.slice(0, 19)]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3: return <Trophy className="w-5 h-5 text-amber-600" />;
      default: return <Star className="w-5 h-5 text-gray-300" />;
    }
  };

  const getPromotionIcon = (type: string) => {
    switch(type) {
      case 'deposit': return <Gift className="w-5 h-5 text-green-500" />;
      case 'cashback': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'bonus': return <Zap className="w-5 h-5 text-purple-500" />;
      default: return <Star className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {[
            { id: 'leaderboard', label: 'Top Winners', icon: Trophy },
            { id: 'chat', label: 'Live Chat', icon: MessageCircle },
            { id: 'promotions', label: 'Promotions', icon: Gift }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 h-80 overflow-y-auto">
        {activeTab === 'leaderboard' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Today's Top Winners</h3>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{onlineUsers} online</span>
              </div>
            </div>
            
            {leaderboard.map((entry) => (
              <div key={entry.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(entry.rank)}
                    <span className="font-bold text-lg text-gray-600">#{entry.rank}</span>
                  </div>
                  <div className="text-2xl">{entry.avatar}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-800">{entry.username}</span>
                      {entry.isOnline && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">Total Winnings</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-green-600">₹{entry.winnings.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Live Chat</h3>
              <div className="flex items-center space-x-1 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>

            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`p-2 rounded-lg ${
                  msg.type === 'system' ? 'bg-blue-50 border border-blue-200' :
                  msg.type === 'win' ? 'bg-green-50 border border-green-200' :
                  msg.username === 'You' ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-sm font-medium ${
                          msg.type === 'system' ? 'text-blue-600' :
                          msg.type === 'win' ? 'text-green-600' :
                          msg.username === 'You' ? 'text-red-600' : 'text-gray-700'
                        }`}>
                          {msg.username}
                        </span>
                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-800">{msg.message}</p>
                      {msg.amount && (
                        <div className="text-lg font-bold text-green-600 mt-1">
                          +₹{msg.amount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {activeTab === 'promotions' && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 mb-4">Active Promotions</h3>
            
            {promotions.map((promo) => (
              <div key={promo.id} className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getPromotionIcon(promo.type)}
                    <div>
                      <h4 className="font-bold text-gray-800">{promo.title}</h4>
                      <p className="text-sm text-gray-600">{promo.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-red-600">{promo.reward}</div>
                    <div className="text-xs text-gray-500">Expires in {promo.expiresIn}</div>
                  </div>
                </div>
                
                {promo.progress > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{promo.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${promo.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <button className="w-full mt-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
                  {promo.progress === 0 ? 'Claim Now' : 'View Details'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}