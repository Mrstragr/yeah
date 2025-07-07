import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, Star, Crown, Zap, Target, Trophy, 
  Clock, Users, ArrowRight, Check, X 
} from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  description: string;
  reward: string;
  type: 'daily' | 'weekly' | 'limited' | 'vip' | 'referral';
  timeLeft?: number;
  progress?: number;
  maxProgress?: number;
  status: 'available' | 'claimed' | 'expired' | 'locked';
  icon: React.ReactNode;
  color: string;
  condition: string;
}

interface ComprehensivePromotionSystemProps {
  onClaimReward: (promotionId: string) => void;
  onViewDetails: (promotionId: string) => void;
}

export default function ComprehensivePromotionSystem({ 
  onClaimReward, 
  onViewDetails 
}: ComprehensivePromotionSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    // Initialize promotions with realistic data
    const initialPromotions: Promotion[] = [
      {
        id: 'welcome_bonus',
        title: 'Welcome Bonus',
        description: 'Get ₹51 instantly on first deposit',
        reward: '₹51',
        type: 'daily',
        status: 'available',
        icon: <Gift className="w-6 h-6" />,
        color: 'from-yellow-500 to-orange-500',
        condition: 'Deposit ₹100+'
      },
      {
        id: 'daily_check_in',
        title: 'Daily Check-in',
        description: 'Login daily for 7 days to get rewards',
        reward: 'Up to ₹500',
        type: 'daily',
        progress: 3,
        maxProgress: 7,
        status: 'available',
        icon: <Star className="w-6 h-6" />,
        color: 'from-blue-500 to-purple-500',
        condition: 'Login daily'
      },
      {
        id: 'first_deposit',
        title: 'First Deposit Bonus',
        description: '100% bonus on your first deposit',
        reward: '100% Bonus',
        type: 'limited',
        timeLeft: 86400,
        status: 'available',
        icon: <Zap className="w-6 h-6" />,
        color: 'from-green-500 to-emerald-500',
        condition: 'First deposit only'
      },
      {
        id: 'vip_exclusive',
        title: 'VIP Exclusive',
        description: 'Special rewards for VIP members',
        reward: '₹1000',
        type: 'vip',
        status: 'locked',
        icon: <Crown className="w-6 h-6" />,
        color: 'from-purple-500 to-pink-500',
        condition: 'VIP Level 3+'
      },
      {
        id: 'referral_bonus',
        title: 'Refer & Earn',
        description: 'Invite friends and earn together',
        reward: '₹200 per friend',
        type: 'referral',
        progress: 2,
        maxProgress: 5,
        status: 'available',
        icon: <Users className="w-6 h-6" />,
        color: 'from-pink-500 to-red-500',
        condition: 'Refer active friends'
      },
      {
        id: 'weekend_special',
        title: 'Weekend Special',
        description: 'Extra rewards on weekend deposits',
        reward: '50% Extra',
        type: 'weekly',
        timeLeft: 172800,
        status: 'available',
        icon: <Target className="w-6 h-6" />,
        color: 'from-indigo-500 to-blue-500',
        condition: 'Weekend deposits'
      },
      {
        id: 'tournament_prize',
        title: 'Tournament Winner',
        description: 'Won the weekly tournament',
        reward: '₹2500',
        type: 'weekly',
        status: 'claimed',
        icon: <Trophy className="w-6 h-6" />,
        color: 'from-yellow-600 to-orange-600',
        condition: 'Tournament victory'
      }
    ];
    
    setPromotions(initialPromotions);
  }, []);

  const categories = [
    { id: 'all', label: 'All', icon: <Star className="w-4 h-4" /> },
    { id: 'daily', label: 'Daily', icon: <Clock className="w-4 h-4" /> },
    { id: 'weekly', label: 'Weekly', icon: <Target className="w-4 h-4" /> },
    { id: 'limited', label: 'Limited', icon: <Zap className="w-4 h-4" /> },
    { id: 'vip', label: 'VIP', icon: <Crown className="w-4 h-4" /> },
    { id: 'referral', label: 'Referral', icon: <Users className="w-4 h-4" /> }
  ];

  const filteredPromotions = selectedCategory === 'all' 
    ? promotions 
    : promotions.filter(p => p.type === selectedCategory);

  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-400';
      case 'claimed': return 'text-blue-400';
      case 'expired': return 'text-red-400';
      case 'locked': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <Gift className="w-4 h-4" />;
      case 'claimed': return <Check className="w-4 h-4" />;
      case 'expired': return <X className="w-4 h-4" />;
      case 'locked': return <Crown className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🎁 Promotions</h1>
        <p className="text-gray-400">Claim your rewards and bonuses</p>
      </div>

      {/* Category Filter */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category.icon}
            <span className="font-medium">{category.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Promotions Grid */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredPromotions.map((promotion, index) => (
            <motion.div
              key={promotion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-r ${promotion.color} p-1 rounded-2xl`}
            >
              <div className="bg-gray-900 rounded-2xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${promotion.color}`}>
                      {promotion.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{promotion.title}</h3>
                      <p className="text-gray-400 text-sm">{promotion.description}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-1 ${getStatusColor(promotion.status)}`}>
                    {getStatusIcon(promotion.status)}
                    <span className="text-xs font-medium capitalize">{promotion.status}</span>
                  </div>
                </div>

                {/* Progress Bar (if applicable) */}
                {promotion.progress !== undefined && promotion.maxProgress && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{promotion.progress}/{promotion.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(promotion.progress / promotion.maxProgress) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-2 rounded-full bg-gradient-to-r ${promotion.color}`}
                      />
                    </div>
                  </div>
                )}

                {/* Time Left (if applicable) */}
                {promotion.timeLeft && (
                  <div className="flex items-center space-x-2 mb-3 text-orange-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {formatTimeLeft(promotion.timeLeft)} remaining
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">{promotion.reward}</div>
                    <div className="text-xs text-gray-400">{promotion.condition}</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onViewDetails(promotion.id)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                    >
                      Details
                    </motion.button>
                    
                    {promotion.status === 'available' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onClaimReward(promotion.id)}
                        className={`px-4 py-2 bg-gradient-to-r ${promotion.color} rounded-lg text-sm font-bold text-white flex items-center space-x-1`}
                      >
                        <span>Claim</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredPromotions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No promotions available</h3>
          <p className="text-gray-500">Check back later for new offers!</p>
        </motion.div>
      )}
    </div>
  );
}