import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Star, Coins, Trophy, Crown, Zap, CheckCircle } from 'lucide-react';

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

interface RewardPreviewModalProps {
  achievement: Achievement | null;
  isVisible: boolean;
  onClose: () => void;
  onClaim: (achievement: Achievement) => void;
}

const rarityConfig = {
  common: {
    bg: 'from-gray-600 to-gray-800',
    text: 'text-gray-200',
    border: 'border-gray-500',
    accent: 'text-white'
  },
  rare: {
    bg: 'from-blue-600 to-blue-800',
    text: 'text-blue-200',
    border: 'border-blue-500',
    accent: 'text-blue-100'
  },
  epic: {
    bg: 'from-purple-600 to-purple-800',
    text: 'text-purple-200',
    border: 'border-purple-500',
    accent: 'text-purple-100'
  },
  legendary: {
    bg: 'from-yellow-600 to-orange-700',
    text: 'text-yellow-200',
    border: 'border-yellow-500',
    accent: 'text-yellow-100'
  }
};

export const RewardPreviewModal: React.FC<RewardPreviewModalProps> = ({
  achievement,
  isVisible,
  onClose,
  onClaim
}) => {
  if (!achievement) return null;

  const config = rarityConfig[achievement.rarity];

  const handleClaim = () => {
    onClaim(achievement);
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`
              relative max-w-lg w-full mx-4 p-6 
              bg-gradient-to-br ${config.bg}
              rounded-3xl border-2 ${config.border}
              shadow-2xl overflow-hidden
            `}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                  className="absolute w-32 h-32 bg-white/5 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  className="inline-block p-4 rounded-full bg-white/20 mb-4"
                >
                  <Gift className="w-8 h-8 text-yellow-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">Reward Preview</h2>
                <p className={`${config.text} text-sm`}>Here's what you'll receive for your achievement</p>
              </div>

              {/* Achievement Info */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 rounded-2xl p-4 mb-6"
              >
                <div className="flex items-center mb-3">
                  <span className="text-4xl mr-3">{achievement.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{achievement.title}</h3>
                    <p className={`${config.text} text-sm`}>{achievement.description}</p>
                  </div>
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${config.border} ${config.text}`}>
                  {achievement.rarity}
                </div>
              </motion.div>

              {/* Reward Breakdown */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 mb-6"
              >
                <h4 className="text-lg font-bold text-white mb-3">Reward Breakdown:</h4>
                
                {/* Cash Reward */}
                <div className="flex items-center justify-between bg-green-500/20 rounded-xl p-4">
                  <div className="flex items-center">
                    <Coins className="w-6 h-6 text-green-400 mr-3" />
                    <span className="text-white font-medium">Cash Reward</span>
                  </div>
                  <span className="text-2xl font-bold text-green-400">{achievement.reward}</span>
                </div>

                {/* XP Reward */}
                {achievement.xpGained && (
                  <div className="flex items-center justify-between bg-blue-500/20 rounded-xl p-4">
                    <div className="flex items-center">
                      <Star className="w-6 h-6 text-blue-400 mr-3" />
                      <span className="text-white font-medium">Experience Points</span>
                    </div>
                    <span className="text-xl font-bold text-blue-400">+{achievement.xpGained} XP</span>
                  </div>
                )}

                {/* Badge Unlock */}
                <div className="flex items-center justify-between bg-purple-500/20 rounded-xl p-4">
                  <div className="flex items-center">
                    <Trophy className="w-6 h-6 text-purple-400 mr-3" />
                    <span className="text-white font-medium">Achievement Badge</span>
                  </div>
                  <span className="text-sm font-bold text-purple-400 uppercase">{achievement.rarity}</span>
                </div>

                {/* Special Perks */}
                {achievement.rarity === 'legendary' && (
                  <div className="flex items-center justify-between bg-yellow-500/20 rounded-xl p-4">
                    <div className="flex items-center">
                      <Crown className="w-6 h-6 text-yellow-400 mr-3" />
                      <span className="text-white font-medium">VIP Benefits</span>
                    </div>
                    <span className="text-sm font-bold text-yellow-400">UNLOCKED</span>
                  </div>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-4"
              >
                <button
                  onClick={onClose}
                  className="flex items-center justify-center px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-white font-bold rounded-xl transition-all"
                >
                  Later
                </button>
                <button
                  onClick={handleClaim}
                  className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all transform hover:scale-105"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Claim Now
                </button>
              </motion.div>

              {/* Footer Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 text-center"
              >
                <p className={`${config.text} text-xs`}>
                  Rewards will be added to your account immediately upon claiming
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RewardPreviewModal;