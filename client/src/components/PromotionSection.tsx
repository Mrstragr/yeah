import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, Clock, Users, ArrowRight, Copy, CheckCircle } from 'lucide-react';

interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  isVerified: boolean;
}

interface PromotionSectionProps {
  user: User;
  balance: string;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  reward: string;
  bgColor: string;
  icon: string;
  type: 'daily' | 'recharge' | 'refer' | 'vip' | 'special';
  status: 'available' | 'claimed' | 'expired';
}

export default function PromotionSection({ user, balance }: PromotionSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'recharge' | 'refer'>('all');
  const [copied, setCopied] = useState(false);

  const referralCode = `91CLUB${user.id}`;

  const promotions: Promotion[] = [
    {
      id: 'daily-bonus',
      title: 'Daily Check-in Bonus',
      description: 'Sign in daily to receive up to ₹558',
      reward: '₹558',
      bgColor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      icon: '🎁',
      type: 'daily',
      status: 'available'
    },
    {
      id: 'first-recharge',
      title: 'First Recharge Bonus',
      description: 'Get 100% bonus on your first deposit',
      reward: '100%',
      bgColor: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      icon: '💎',
      type: 'recharge',
      status: 'available'
    },
    {
      id: 'refer-friend',
      title: 'Refer & Earn',
      description: 'Invite friends and earn ₹100 per referral',
      reward: '₹100',
      bgColor: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
      icon: '👥',
      type: 'refer',
      status: 'available'
    },
    {
      id: 'weekend-special',
      title: 'Weekend Special',
      description: 'Extra 50% bonus on weekend deposits',
      reward: '50%',
      bgColor: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      icon: '🌟',
      type: 'special',
      status: 'available'
    },
    {
      id: 'vip-rewards',
      title: 'VIP Membership',
      description: 'Exclusive rewards for VIP members',
      reward: 'VIP',
      bgColor: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
      icon: '👑',
      type: 'vip',
      status: 'available'
    },
    {
      id: 'cashback',
      title: 'Loss Cashback',
      description: 'Get 10% cashback on losses',
      reward: '10%',
      bgColor: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
      icon: '🔄',
      type: 'special',
      status: 'available'
    }
  ];

  const filteredPromotions = activeTab === 'all' 
    ? promotions 
    : promotions.filter(p => p.type === activeTab);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white">
        <div className="text-center">
          <h1 className="text-xl font-bold">Promotions</h1>
          <div className="text-sm opacity-90">Earn more rewards</div>
        </div>
      </div>

      {/* Referral Code Section */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">Your Referral Code</div>
              <div className="text-sm opacity-90">Share and earn ₹100 per friend</div>
            </div>
            <div className="text-3xl">👥</div>
          </div>
          <div className="mt-4 flex items-center justify-between bg-white/20 rounded-lg p-3">
            <div className="font-mono text-lg font-bold">{referralCode}</div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyReferralCode}
              className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 mb-4">
        <div className="flex space-x-2 bg-gray-100 rounded-xl p-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'daily', label: 'Daily' },
            { key: 'recharge', label: 'Recharge' },
            { key: 'refer', label: 'Refer' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Promotions List */}
      <div className="px-4 space-y-3">
        {filteredPromotions.map((promotion, index) => (
          <motion.div
            key={promotion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg"
          >
            <div 
              className="p-6 text-white relative"
              style={{ background: promotion.bgColor }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-xl font-bold mb-2">{promotion.title}</div>
                  <div className="text-sm opacity-90 mb-3">{promotion.description}</div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 rounded-lg px-3 py-1">
                      <span className="font-bold">Reward: {promotion.reward}</span>
                    </div>
                    {promotion.status === 'available' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 shadow-lg"
                      >
                        <span>Claim Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    )}
                    {promotion.status === 'claimed' && (
                      <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">
                        ✓ Claimed
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-4xl ml-4">{promotion.icon}</div>
              </div>
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {promotion.status === 'available' && (
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    AVAILABLE
                  </div>
                )}
                {promotion.status === 'claimed' && (
                  <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    CLAIMED
                  </div>
                )}
              </div>
            </div>
            
            {/* Terms & Conditions */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="text-xs text-gray-600">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-3 h-3" />
                  <span>Valid for 7 days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-3 h-3" />
                  <span>Terms & conditions apply</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Promotion Stats */}
      <div className="p-4 mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-lg font-bold text-center mb-4">Your Promotion Stats</div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Claimed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">₹2,340</div>
              <div className="text-sm text-gray-600">Total Earned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}