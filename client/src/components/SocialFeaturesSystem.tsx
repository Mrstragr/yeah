import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, MessageCircle, Heart, Share, Gift, Crown, Star, Trophy, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onBack: () => void;
}

export default function SocialFeaturesSystem({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'friends' | 'chat' | 'achievements' | 'share'>('friends');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const friends = [
    { id: 1, name: 'Lucky Player', avatar: '🎯', status: 'online', lastWin: '₹5,000' },
    { id: 2, name: 'Gaming Pro', avatar: '👑', status: 'playing', lastWin: '₹12,500' },
    { id: 3, name: 'Winner123', avatar: '🔥', status: 'offline', lastWin: '₹3,200' },
    { id: 4, name: 'Elite Gamer', avatar: '⭐', status: 'online', lastWin: '₹8,750' }
  ];

  const chatMessages = [
    { id: 1, user: 'Lucky Player', message: 'Just won big on WinGo! 🎉', time: '2 min ago', wins: 5 },
    { id: 2, user: 'Gaming Pro', message: 'Anyone up for Aviator? Room 1234', time: '5 min ago', wins: 12 },
    { id: 3, user: 'Winner123', message: 'New tournament starting at 8 PM! 💪', time: '8 min ago', wins: 8 },
    { id: 4, user: 'Elite Gamer', message: 'Best strategy for Roulette? Share tips!', time: '15 min ago', wins: 15 }
  ];

  const achievements = [
    { id: 1, title: 'First Win', description: 'Win your first game', progress: 100, reward: '₹500', unlocked: true },
    { id: 2, title: 'Win Streak', description: 'Win 5 games in a row', progress: 80, reward: '₹2,000', unlocked: false },
    { id: 3, title: 'High Roller', description: 'Place bets worth ₹50,000', progress: 65, reward: '₹5,000', unlocked: false },
    { id: 4, title: 'Social Butterfly', description: 'Add 10 friends', progress: 40, reward: '₹1,000', unlocked: false },
    { id: 5, title: 'Tournament Winner', description: 'Win any tournament', progress: 0, reward: '₹10,000', unlocked: false }
  ];

  const sendMessage = () => {
    if (!message.trim()) return;
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the community chat",
    });
    setMessage('');
  };

  const shareWin = (platform: string) => {
    toast({
      title: "Shared Successfully",
      description: `Your win has been shared on ${platform}`,
    });
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-4 flex items-center justify-between">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">Social Hub</h1>
          <div className="text-sm opacity-90">Connect & Share</div>
        </div>
        <div className="w-6 h-6" />
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-black/30">
        {[
          { key: 'friends', label: 'Friends', icon: Users },
          { key: 'chat', label: 'Chat', icon: MessageCircle },
          { key: 'achievements', label: 'Rewards', icon: Trophy },
          { key: 'share', label: 'Share', icon: Share }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-3 px-2 text-center transition-colors ${
              activeTab === tab.key
                ? 'bg-pink-500 text-white'
                : 'text-gray-300 hover:bg-white/10'
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
          {activeTab === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Your Gaming Friends</h2>
                <div className="text-gray-300">Connect with fellow players</div>
              </div>

              {/* Add Friend Button */}
              <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 font-bold py-3">
                <Users className="w-5 h-5 mr-2" />
                Add New Friend
              </Button>

              {/* Friends List */}
              <div className="space-y-3">
                {friends.map(friend => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-black/30 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl">
                          {friend.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          friend.status === 'online' ? 'bg-green-500' :
                          friend.status === 'playing' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}></div>
                      </div>
                      <div className="ml-3">
                        <div className="font-bold">{friend.name}</div>
                        <div className="text-sm text-gray-300 capitalize">{friend.status}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">{friend.lastWin}</div>
                      <div className="text-xs text-gray-300">Last Win</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold mb-2">Community Chat</h2>
                <div className="text-gray-300">Share wins and strategies</div>
              </div>

              {/* Chat Messages */}
              <div className="bg-black/30 rounded-xl p-4 h-80 overflow-y-auto">
                <div className="space-y-3">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-pink-300">{msg.user}</div>
                        <div className="text-xs text-gray-400">{msg.time}</div>
                      </div>
                      <div className="text-white">{msg.message}</div>
                      <div className="flex items-center mt-2 space-x-2">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-gray-300">{msg.wins} wins</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-black/30 border-gray-600 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button
                  onClick={sendMessage}
                  className="bg-pink-500 hover:bg-pink-600 px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Achievements</h2>
                <div className="text-gray-300">Unlock rewards by completing challenges</div>
              </div>

              {achievements.map(achievement => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-4 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-green-600 to-blue-600' 
                      : 'bg-black/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        achievement.unlocked ? 'bg-yellow-400 text-black' : 'bg-gray-600 text-white'
                      }`}>
                        {achievement.unlocked ? <Crown className="w-6 h-6" /> : <Star className="w-6 h-6" />}
                      </div>
                      <div className="ml-3">
                        <div className="font-bold">{achievement.title}</div>
                        <div className="text-sm text-gray-300">{achievement.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-400">{achievement.reward}</div>
                      <div className="text-xs text-gray-300">Reward</div>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          achievement.unlocked ? 'bg-yellow-400' : 'bg-purple-500'
                        }`}
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {achievement.unlocked && (
                    <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
                      <Gift className="w-4 h-4 mr-2" />
                      Claim Reward
                    </Button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'share' && (
            <motion.div
              key="share"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Share Your Wins</h2>
                <div className="text-gray-300">Show off your gaming achievements</div>
              </div>

              {/* Recent Win to Share */}
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-6 text-black">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <div className="text-2xl font-bold mb-1">Big Win!</div>
                  <div className="text-3xl font-black mb-2">₹15,750</div>
                  <div className="text-sm opacity-75">Won in Aviator Game</div>
                </div>
              </div>

              {/* Social Media Sharing */}
              <div className="space-y-3">
                <button
                  onClick={() => shareWin('WhatsApp')}
                  className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-xl font-bold transition-colors flex items-center justify-center"
                >
                  <span className="text-2xl mr-3">📱</span>
                  Share on WhatsApp
                </button>
                
                <button
                  onClick={() => shareWin('Telegram')}
                  className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-bold transition-colors flex items-center justify-center"
                >
                  <span className="text-2xl mr-3">✈️</span>
                  Share on Telegram
                </button>
                
                <button
                  onClick={() => shareWin('Instagram')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-4 rounded-xl font-bold transition-colors flex items-center justify-center"
                >
                  <span className="text-2xl mr-3">📸</span>
                  Share on Instagram Story
                </button>
                
                <button
                  onClick={() => shareWin('Twitter')}
                  className="w-full bg-black hover:bg-gray-800 p-4 rounded-xl font-bold transition-colors flex items-center justify-center"
                >
                  <span className="text-2xl mr-3">🐦</span>
                  Share on Twitter
                </button>
              </div>

              {/* Referral Code */}
              <div className="bg-black/30 rounded-xl p-4">
                <h3 className="font-bold mb-3">Invite Friends & Earn</h3>
                <div className="bg-gray-700 rounded-lg p-3 mb-3">
                  <div className="text-center">
                    <div className="text-sm text-gray-300">Your Referral Code</div>
                    <div className="text-2xl font-bold text-yellow-400">91CLUB2024</div>
                  </div>
                </div>
                <div className="text-sm text-gray-300 text-center">
                  Share this code and earn ₹1,000 for each friend who joins!
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}