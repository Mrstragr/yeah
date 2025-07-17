import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Gift, X, Sparkles, Crown, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  xpGained?: number;
}

interface AchievementNotificationProps {
  achievement: Achievement;
  isVisible: boolean;
  onClose: () => void;
  onRewardPreview?: (achievement: Achievement) => void;
}

const rarityColors = {
  common: {
    bg: 'from-gray-600 to-gray-700',
    border: 'border-gray-500',
    glow: 'shadow-gray-500/50',
    text: 'text-gray-200',
    accent: 'text-white'
  },
  rare: {
    bg: 'from-blue-600 to-blue-700',
    border: 'border-blue-500',
    glow: 'shadow-blue-500/50',
    text: 'text-blue-200',
    accent: 'text-blue-100'
  },
  epic: {
    bg: 'from-purple-600 to-purple-700',
    border: 'border-purple-500',
    glow: 'shadow-purple-500/50',
    text: 'text-purple-200',
    accent: 'text-purple-100'
  },
  legendary: {
    bg: 'from-yellow-600 to-orange-600',
    border: 'border-yellow-500',
    glow: 'shadow-yellow-500/50',
    text: 'text-yellow-200',
    accent: 'text-yellow-100'
  }
};

export const AnimatedAchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  isVisible,
  onClose,
  onRewardPreview
}) => {
  const [showFireworks, setShowFireworks] = useState(false);
  const colors = rarityColors[achievement.rarity];

  useEffect(() => {
    if (isVisible) {
      setShowFireworks(true);
      const timer = setTimeout(() => setShowFireworks(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleRewardPreview = () => {
    if (onRewardPreview) {
      onRewardPreview(achievement);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          {/* Fireworks Effect */}
          {showFireworks && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    scale: 0, 
                    opacity: 1,
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2
                  }}
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                    x: window.innerWidth / 2 + Math.cos(i * 30 * Math.PI / 180) * 200,
                    y: window.innerHeight / 2 + Math.sin(i * 30 * Math.PI / 180) * 200
                  }}
                  transition={{ 
                    duration: 1.5, 
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className={`absolute w-3 h-3 ${colors.bg.replace('from-', 'bg-').replace(' to-' + colors.bg.split(' to-')[1], '')} rounded-full`}
                />
              ))}
            </div>
          )}

          {/* Main Achievement Card */}
          <motion.div
            initial={{ scale: 0, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, y: -100, opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 15, 
              stiffness: 300,
              delay: 0.2
            }}
            className={`
              relative max-w-md w-full mx-4 p-6 
              bg-gradient-to-r ${colors.bg} 
              rounded-2xl border-2 ${colors.border}
              shadow-2xl ${colors.glow}
              overflow-hidden
            `}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Sparkle Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
              ))}
            </div>

            {/* Achievement Content */}
            <div className="relative z-10">
              {/* Header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-6"
              >
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
                  <span className="text-xl font-bold text-white">Achievement Unlocked!</span>
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors.border} ${colors.text}`}>
                  {achievement.rarity}
                </div>
              </motion.div>

              {/* Achievement Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  damping: 12, 
                  stiffness: 200,
                  delay: 0.7
                }}
                className="text-center mb-4"
              >
                <div className="inline-block p-4 rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="text-6xl">{achievement.icon}</span>
                </div>
              </motion.div>

              {/* Achievement Details */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center mb-6"
              >
                <h3 className="text-2xl font-bold text-white mb-2">{achievement.title}</h3>
                <p className={`text-sm ${colors.text} mb-4`}>{achievement.description}</p>
                
                {/* XP Gained */}
                {achievement.xpGained && (
                  <div className="flex items-center justify-center mb-4">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-yellow-400 font-bold">+{achievement.xpGained} XP</span>
                  </div>
                )}
              </motion.div>

              {/* Reward Section */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Gift className="w-5 h-5 text-yellow-400 mr-2" />
                    <span className="text-white font-medium">Reward</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-400">{achievement.reward}</span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="grid grid-cols-2 gap-3"
              >
                <button
                  onClick={handleRewardPreview}
                  className="flex items-center justify-center px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-bold rounded-xl transition-all transform hover:scale-105"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Preview
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all transform hover:scale-105"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Claim
                </button>
              </motion.div>
            </div>

            {/* Animated Border Glow */}
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute inset-0 rounded-2xl border-2 ${colors.border} pointer-events-none`}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Achievement Notification Manager Hook
export const useAchievementNotifications = () => {
  const [notifications, setNotifications] = useState<Achievement[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null);

  const showAchievement = (achievement: Achievement) => {
    setNotifications(prev => [...prev, achievement]);
  };

  const showNextNotification = () => {
    if (notifications.length > 0 && !currentNotification) {
      const [next, ...rest] = notifications;
      setCurrentNotification(next);
      setNotifications(rest);
    }
  };

  const closeCurrentNotification = () => {
    setCurrentNotification(null);
    // Auto-show next notification after a delay
    setTimeout(showNextNotification, 500);
  };

  useEffect(() => {
    showNextNotification();
  }, [notifications]);

  return {
    currentNotification,
    showAchievement,
    closeNotification: closeCurrentNotification,
    hasNotifications: notifications.length > 0 || !!currentNotification
  };
};

export default AnimatedAchievementNotification;