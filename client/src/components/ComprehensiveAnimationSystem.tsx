import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Target, Trophy, Star, Gift } from 'lucide-react';

interface AnimationSystemProps {
  children: React.ReactNode;
  triggerCelebration?: boolean;
  onCelebrationEnd?: () => void;
}

export default function ComprehensiveAnimationSystem({ 
  children, 
  triggerCelebration = false,
  onCelebrationEnd 
}: AnimationSystemProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [floatingElements, setFloatingElements] = useState<Array<{ id: number; x: number; y: number; icon: React.ReactNode }>>([]);

  // Trigger celebration animation
  useEffect(() => {
    if (triggerCelebration) {
      setShowCelebration(true);
      generateFloatingElements();
      
      const timer = setTimeout(() => {
        setShowCelebration(false);
        setFloatingElements([]);
        onCelebrationEnd?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [triggerCelebration, onCelebrationEnd]);

  const generateFloatingElements = () => {
    const icons = [
      <Sparkles className="w-6 h-6 text-yellow-400" />,
      <Zap className="w-6 h-6 text-blue-400" />,
      <Target className="w-6 h-6 text-green-400" />,
      <Trophy className="w-6 h-6 text-purple-400" />,
      <Star className="w-6 h-6 text-pink-400" />,
      <Gift className="w-6 h-6 text-red-400" />
    ];

    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      icon: icons[Math.floor(Math.random() * icons.length)]
    }));

    setFloatingElements(elements);
  };

  // Background floating animation
  const backgroundVariants = {
    animate: {
      scale: [1, 1.02, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Stagger animation for content
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient Animation */}
      <motion.div
        variants={backgroundVariants}
        animate="animate"
        className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 pointer-events-none"
      />

      {/* Main Content with Stagger Animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <motion.div variants={itemVariants}>
          {children}
        </motion.div>
      </motion.div>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <>
            {/* Confetti Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none z-50"
            >
              {/* Confetti Rain */}
              {Array.from({ length: 50 }, (_, i) => (
                <motion.div
                  key={`confetti-${i}`}
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: -50,
                    rotation: 0,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{
                    y: window.innerHeight + 100,
                    rotation: 360,
                    transition: {
                      duration: Math.random() * 2 + 2,
                      ease: "linear"
                    }
                  }}
                  className={`absolute w-2 h-2 ${
                    ['bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400', 'bg-red-400'][
                      Math.floor(Math.random() * 6)
                    ]
                  }`}
                />
              ))}
            </motion.div>

            {/* Floating Icons */}
            {floatingElements.map((element) => (
              <motion.div
                key={`float-${element.id}`}
                initial={{ 
                  x: element.x,
                  y: element.y,
                  opacity: 0,
                  scale: 0
                }}
                animate={{
                  y: element.y - 200,
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.2, 1, 0.8],
                  rotate: [0, 180, 360],
                  transition: {
                    duration: 3,
                    ease: "easeOut"
                  }
                }}
                className="fixed pointer-events-none z-50"
              >
                {element.icon}
              </motion.div>
            ))}

            {/* Central Burst Effect */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.5, 1],
                opacity: [0, 1, 0],
                transition: { duration: 1.5 }
              }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: 360,
                    transition: { duration: 2, repeat: Infinity, ease: "linear" }
                  }}
                  className="w-32 h-32 border-4 border-yellow-400 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-16 h-16 text-yellow-400" />
                </motion.div>
                
                {/* Radiating Lines */}
                {Array.from({ length: 8 }, (_, i) => (
                  <motion.div
                    key={`ray-${i}`}
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: [0, 1, 0],
                      transition: { 
                        duration: 1, 
                        delay: i * 0.1,
                        repeat: 2
                      }
                    }}
                    className="absolute w-1 h-16 bg-yellow-400 origin-bottom"
                    style={{
                      transform: `rotate(${i * 45}deg)`,
                      top: '-60px',
                      left: '50%',
                      marginLeft: '-2px'
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Subtle Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={`particle-${i}`}
            initial={{ 
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              scale: 0,
              opacity: 0
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
              y: ['+0%', '-100%'],
              transition: {
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }
            }}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}