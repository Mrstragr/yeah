import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Gift, Users, Clock, Star, Crown, 
  Zap, Target, Trophy, Copy, CheckCircle, Percent
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  walletBalance: string;
}

interface Props {
  onBack: () => void;
  user: User;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  reward: string;
  type: 'welcome' | 'daily' | 'referral' | 'vip' | 'special';
  requirements: string;
  progress?: number;
  maxProgress?: number;
  timeLeft?: string;
  claimed?: boolean;
  active: boolean;
}

export default function EnhancedPromotion({ onBack, user }: Props) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'vip'>('active');
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const referralCode = `PERFECT91${user.id}`;

  const promotions: Promotion[] = [
    {
      id: 'welcome',
      title: 'Welcome Bonus',
      description: 'Get ₹100 bonus on your first deposit of ₹500+',
      reward: '₹100',
      type: 'welcome',
      requirements: 'Deposit ₹500 minimum',
      progress: 0,
      maxProgress: 500,
      active: true
    },
    {
      id: 'daily_check',
      title: 'Daily Check-in',
      description: 'Login daily for 7 days to get increasing rewards',
      reward: 'Up to ₹777',
      type: 'daily',
      requirements: 'Login daily',
      progress: 3,
      maxProgress: 7,
      timeLeft: '18h 42m',
      active: true
    },
    {
      id: 'referral',
      title: 'Invite Friends',
      description: 'Get ₹50 for every friend who joins and deposits',
      reward: '₹50 per friend',
      type: 'referral',
      requirements: 'Friend must deposit ₹500+',
      progress: 2,
      maxProgress: 10,
      active: true
    },
    {
      id: 'first_bet',
      title: 'First Bet Bonus',
      description: 'Get 50% cashback on your first bet (max ₹500)',
      reward: '50% Cashback',
      type: 'special',
      requirements: 'Place your first bet',
      active: true
    },
    {
      id: 'weekend',
      title: 'Weekend Special',
      description: 'Double your deposit bonus on weekends',
      reward: '100% Bonus',
      type: 'special',
      requirements: 'Deposit on Sat/Sun',
      timeLeft: '2d 14h',
      active: true
    },
    {
      id: 'high_roller',
      title: 'High Roller Reward',
      description: 'Bet ₹10,000 total to unlock VIP status',
      reward: 'VIP Status',
      type: 'vip',
      requirements: 'Total bets ₹10,000',
      progress: 2500,
      maxProgress: 10000,
      active: true
    }
  ];

  const vipBenefits = [
    {
      icon: Crown,
      title: 'VIP Customer Support',
      description: 'Priority 24/7 support with dedicated manager'
    },
    {
      icon: Zap,
      title: 'Instant Withdrawals',
      description: 'Skip withdrawal queues with instant processing'
    },
    {
      icon: Percent,
      title: 'Higher Cashback',
      description: 'Up to 5% cashback on all games and bets'
    },
    {
      icon: Gift,
      title: 'Exclusive Bonuses',
      description: 'Special VIP-only promotions and rewards'
    },
    {
      icon: Target,
      title: 'Higher Limits',
      description: 'Increased betting and withdrawal limits'
    },
    {
      icon: Trophy,
      title: 'VIP Events',
      description: 'Access to exclusive tournaments and events'
    }
  ];

  const dailyRewards = [
    { day: 1, reward: '₹10', claimed: true },
    { day: 2, reward: '₹25', claimed: true },
    { day: 3, reward: '₹50', claimed: true },
    { day: 4, reward: '₹75', claimed: false, current: true },
    { day: 5, reward: '₹100', claimed: false },
    { day: 6, reward: '₹200', claimed: false },
    { day: 7, reward: '₹777', claimed: false }
  ];

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  const claimReward = (promoId: string) => {
    // Handle reward claiming logic
    console.log(`Claiming reward for ${promoId}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'welcome': return Gift;
      case 'daily': return Clock;
      case 'referral': return Users;
      case 'vip': return Crown;
      case 'special': return Star;
      default: return Gift;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'welcome': return 'from-green-500 to-emerald-600';
      case 'daily': return 'from-blue-500 to-cyan-600';
      case 'referral': return 'from-purple-500 to-pink-600';
      case 'vip': return 'from-yellow-500 to-orange-600';
      case 'special': return 'from-red-500 to-rose-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const activePromotions = promotions.filter(p => p.active && !p.claimed);
  const completedPromotions = promotions.filter(p => p.claimed);

  return (
    <div className="min-h-screen bg-gray-900 text-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Promotions</h1>
        <div className="w-6 h-6"></div>
      </div>

      {/* Total Earnings Card */}
      <div className="p-4">
        <motion.div 
          className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-6 mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-center">
            <Trophy className="w-12 h-12 mx-auto mb-2 text-white" />
            <div className="text-orange-100 text-sm mb-1">Total Rewards Earned</div>
            <div className="text-3xl font-bold text-white mb-2">₹2,350</div>
            <div className="text-orange-100 text-sm">Keep playing to earn more!</div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
          <button 
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
              activeTab === 'active' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Active ({activePromotions.length})
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
              activeTab === 'completed' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Completed ({completedPromotions.length})
          </button>
          <button 
            onClick={() => setActiveTab('vip')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
              activeTab === 'vip' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            VIP
          </button>
        </div>

        {/* Active Promotions */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {/* Daily Check-in Special */}
            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Daily Check-in</h3>
                <Clock className="w-6 h-6" />
              </div>
              
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dailyRewards.map((reward, index) => (
                  <div 
                    key={reward.day}
                    className={`text-center p-2 rounded-lg border-2 ${
                      reward.claimed 
                        ? 'border-green-400 bg-green-400/20' 
                        : reward.current
                        ? 'border-yellow-400 bg-yellow-400/20'
                        : 'border-gray-600 bg-gray-700/50'
                    }`}
                  >
                    <div className="text-xs mb-1">Day {reward.day}</div>
                    <div className="text-xs font-bold">{reward.reward}</div>
                    {reward.claimed && <CheckCircle className="w-3 h-3 mx-auto mt-1 text-green-400" />}
                  </div>
                ))}
              </div>
              
              <button 
                className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg font-semibold transition-colors"
                onClick={() => claimReward('daily_check')}
              >
                Claim Today's Reward (₹75)
              </button>
            </motion.div>

            {/* Referral Program */}
            <motion.div 
              className="bg-gray-800 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Invite Friends</h3>
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              
              <div className="text-gray-300 text-sm mb-4">
                Share your referral code and earn ₹50 for every friend who joins!
              </div>
              
              <div className="bg-gray-700 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Your Referral Code</div>
                    <div className="font-bold text-lg">{referralCode}</div>
                  </div>
                  <button 
                    onClick={copyReferralCode}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Friends Referred: 2</span>
                <span className="text-green-400 font-semibold">Earned: ₹100</span>
              </div>
            </motion.div>

            {/* Other Active Promotions */}
            {activePromotions.map((promo, index) => {
              if (promo.id === 'daily_check' || promo.id === 'referral') return null;
              
              const IconComponent = getTypeIcon(promo.type);
              
              return (
                <motion.div 
                  key={promo.id}
                  className="bg-gray-800 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 2) * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getTypeColor(promo.type)} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold">{promo.title}</h3>
                        <div className="text-sm text-gray-400">{promo.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">{promo.reward}</div>
                      {promo.timeLeft && (
                        <div className="text-xs text-orange-400">{promo.timeLeft}</div>
                      )}
                    </div>
                  </div>
                  
                  {promo.progress !== undefined && promo.maxProgress && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{promo.progress}/{promo.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(promo.progress / promo.maxProgress) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400 mb-3">{promo.requirements}</div>
                  
                  <button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    onClick={() => claimReward(promo.id)}
                  >
                    {promo.progress === promo.maxProgress ? 'Claim Reward' : 'View Details'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* VIP Benefits */}
        {activeTab === 'vip' && (
          <div className="space-y-6">
            <motion.div 
              className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Crown className="w-16 h-16 mx-auto mb-4 text-white" />
              <h2 className="text-2xl font-bold mb-2">Become VIP</h2>
              <p className="text-orange-100 mb-4">Unlock exclusive benefits and premium features</p>
              
              <div className="bg-white/20 rounded-lg p-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to VIP</span>
                  <span>₹2,500 / ₹10,000</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-white h-3 rounded-full transition-all duration-300"
                    style={{ width: '25%' }}
                  ></div>
                </div>
                <div className="text-xs text-orange-100 mt-2">₹7,500 more to unlock VIP status</div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-4">
              {vipBenefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-800 rounded-xl p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">{benefit.title}</h3>
                      <p className="text-sm text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Copy Success Toast */}
      {showCopySuccess && (
        <motion.div 
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Referral code copied!</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}