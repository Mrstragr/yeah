import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Trophy, Crown, Star, Gift, Coins } from 'lucide-react';

interface CongratulationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  winAmount: number;
  gameType: string;
  multiplier?: number;
}

export default function CongratulationsPopup({ 
  isOpen, 
  onClose, 
  winAmount, 
  gameType, 
  multiplier 
}: CongratulationsPopupProps) {
  const [showFireworks, setShowFireworks] = useState(false);
  const [autoCloseTimer, setAutoCloseTimer] = useState(3);

  useEffect(() => {
    if (isOpen) {
      setShowFireworks(true);
      const timer = setInterval(() => {
        setAutoCloseTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, onClose]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getWinLevel = (amount: number) => {
    if (amount >= 10000) return { level: 'MEGA WIN', color: 'from-yellow-400 to-orange-500', icon: Crown };
    if (amount >= 5000) return { level: 'BIG WIN', color: 'from-purple-400 to-pink-500', icon: Trophy };
    if (amount >= 1000) return { level: 'SUPER WIN', color: 'from-blue-400 to-cyan-500', icon: Star };
    return { level: 'WIN', color: 'from-green-400 to-emerald-500', icon: Gift };
  };

  const winLevel = getWinLevel(winAmount);
  const WinIcon = winLevel.icon;

  const confettiColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          {/* Confetti/Fireworks Background */}
          {showFireworks && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: confettiColors[i % confettiColors.length],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ 
                    scale: 0, 
                    opacity: 1,
                    x: 0,
                    y: 0
                  }}
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                    x: [0, (Math.random() - 0.5) * 200],
                    y: [0, (Math.random() - 0.5) * 200],
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 0.5,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          )}

          {/* Main Popup */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="relative bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 rounded-3xl p-8 mx-4 max-w-sm w-full text-center shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Auto Close Timer */}
            <div className="absolute top-4 left-4 bg-black/20 rounded-full px-3 py-1">
              <span className="text-white text-sm font-medium">{autoCloseTimer}s auto close</span>
            </div>

            {/* Celebration Elements */}
            <div className="relative mb-6">
              {/* Floating Sparkles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${20 + (i * 12)}%`,
                    top: `${10 + ((i % 2) * 20)}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 180, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
              ))}

              {/* Main Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 10, stiffness: 200 }}
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${winLevel.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
              >
                <WinIcon className="w-10 h-10 text-white" />
              </motion.div>

              {/* Congratulations Text */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white text-2xl font-bold mb-2"
              >
                Congratulations
              </motion.h1>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={`inline-block bg-gradient-to-r ${winLevel.color} text-white px-4 py-2 rounded-full text-sm font-bold mb-4`}
              >
                {winLevel.level}!
              </motion.div>
            </div>

            {/* Win Amount */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", damping: 8, stiffness: 150 }}
              className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30"
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Coins className="w-6 h-6 text-yellow-300" />
                <span className="text-white/80 text-sm">You won</span>
              </div>
              
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", damping: 5, stiffness: 100 }}
                className="text-white text-3xl font-bold mb-2"
              >
                {formatAmount(winAmount)}
              </motion.div>

              {multiplier && (
                <div className="text-yellow-300 text-sm font-semibold">
                  {multiplier}x Multiplier • {gameType}
                </div>
              )}
            </motion.div>

            {/* Game Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-white/90 text-sm"
            >
              <p className="mb-2">Winning from <span className="font-semibold">{gameType}</span></p>
              <p className="text-white/70 text-xs">
                Your balance has been updated automatically
              </p>
            </motion.div>

            {/* Lottery Balls Animation */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {[1, 6, 9, 3, 0].map((number, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 0, scale: 0 }}
                  animate={{ 
                    y: [0, -20, 0],
                    scale: [0, 1, 1],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.8 + (index * 0.1),
                    ease: "easeOut"
                  }}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-white to-gray-200 flex items-center justify-center text-gray-800 text-sm font-bold shadow-lg"
                >
                  {number}
                </motion.div>
              ))}
            </div>

            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(255, 255, 255, 0.3)',
                  '0 0 40px rgba(255, 255, 255, 0.5)',
                  '0 0 20px rgba(255, 255, 255, 0.3)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}