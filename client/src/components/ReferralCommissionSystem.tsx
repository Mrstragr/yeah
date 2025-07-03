import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Users, Share2, Copy, DollarSign, TrendingUp, Award, Gift, CheckCircle } from 'lucide-react';

interface ReferralData {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: string;
  monthlyEarnings: string;
  commissionRate: number;
  nextLevelRate: number;
  referralCode: string;
  level: number;
  levelName: string;
}

interface ReferralHistory {
  id: string;
  username: string;
  joinDate: string;
  status: 'active' | 'inactive';
  totalPlayed: string;
  earnings: string;
  level: number;
}

interface CommissionTier {
  level: number;
  name: string;
  rate: number;
  requirement: number;
  color: string;
  icon: string;
  benefits: string[];
}

interface ReferralProps {
  onBack: () => void;
}

export default function ReferralCommissionSystem({ onBack }: ReferralProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'history' | 'tiers' | 'invite'>('overview');
  const [copied, setCopied] = useState(false);

  const referralData: ReferralData = {
    totalReferrals: 47,
    activeReferrals: 32,
    totalEarnings: '₹15,420',
    monthlyEarnings: '₹3,250',
    commissionRate: 15,
    nextLevelRate: 20,
    referralCode: 'DEMO91CLUB',
    level: 2,
    levelName: 'Silver Partner'
  };

  const referralHistory: ReferralHistory[] = [
    {
      id: 'ref_001',
      username: 'GameMaster23',
      joinDate: '2025-07-01',
      status: 'active',
      totalPlayed: '₹12,500',
      earnings: '₹1,875',
      level: 15
    },
    {
      id: 'ref_002',
      username: 'WinnerPro',
      joinDate: '2025-06-28',
      status: 'active',
      totalPlayed: '₹8,750',
      earnings: '₹1,312',
      level: 12
    },
    {
      id: 'ref_003',
      username: 'LuckyPlayer',
      joinDate: '2025-06-25',
      status: 'inactive',
      totalPlayed: '₹5,200',
      earnings: '₹780',
      level: 8
    },
    {
      id: 'ref_004',
      username: 'CrashExpert',
      joinDate: '2025-06-20',
      status: 'active',
      totalPlayed: '₹15,800',
      earnings: '₹2,370',
      level: 18
    },
    {
      id: 'ref_005',
      username: 'ColorKing',
      joinDate: '2025-06-18',
      status: 'active',
      totalPlayed: '₹9,450',
      earnings: '₹1,417',
      level: 13
    }
  ];

  const commissionTiers: CommissionTier[] = [
    {
      level: 1,
      name: 'Bronze Partner',
      rate: 10,
      requirement: 0,
      color: 'from-orange-400 to-orange-600',
      icon: '🥉',
      benefits: ['10% commission on referrals', 'Basic support', 'Monthly reports']
    },
    {
      level: 2,
      name: 'Silver Partner',
      rate: 15,
      requirement: 20,
      color: 'from-gray-400 to-gray-600',
      icon: '🥈',
      benefits: ['15% commission on referrals', 'Priority support', 'Weekly reports', 'Bonus rewards']
    },
    {
      level: 3,
      name: 'Gold Partner',
      rate: 20,
      requirement: 50,
      color: 'from-yellow-400 to-yellow-600',
      icon: '🥇',
      benefits: ['20% commission on referrals', 'VIP support', 'Daily reports', 'Exclusive bonuses', 'Special events']
    },
    {
      level: 4,
      name: 'Diamond Partner',
      rate: 25,
      requirement: 100,
      color: 'from-purple-400 to-purple-600',
      icon: '💎',
      benefits: ['25% commission on referrals', 'Dedicated manager', 'Real-time analytics', 'Premium rewards', 'Early access']
    },
    {
      level: 5,
      name: 'Elite Partner',
      rate: 30,
      requirement: 200,
      color: 'from-pink-400 to-pink-600',
      icon: '👑',
      benefits: ['30% commission on referrals', 'Personal consultant', 'Custom features', 'Maximum benefits', 'Elite status']
    }
  ];

  const copyReferralCode = () => {
    navigator.clipboard.writeText(`https://perfect91club.com/ref/${referralData.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferralLink = (platform: string) => {
    const referralLink = `https://perfect91club.com/ref/${referralData.referralCode}`;
    const message = `Join Perfect91Club and start earning! Use my referral code: ${referralData.referralCode}`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message + ' ' + referralLink)}`);
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 pt-12 pb-6 px-4 text-white">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-black bg-opacity-20"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="text-center">
          <div className="text-5xl mb-4">🤝</div>
          <h1 className="text-2xl font-bold mb-2">Referral Program</h1>
          <p className="text-lg opacity-90">Earn by inviting friends</p>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-white mx-4 -mt-4 rounded-2xl p-4 shadow-lg">
        <div className="grid grid-cols-2 gap-4 text-center mb-4">
          <div>
            <div className="text-xl font-bold text-green-600">{referralData.totalEarnings}</div>
            <div className="text-xs text-gray-600">Total Earnings</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-600">{referralData.totalReferrals}</div>
            <div className="text-xs text-gray-600">Total Referrals</div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">{referralData.commissionRate}%</div>
          <div className="text-xs text-gray-600">Current Commission Rate</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-4">
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
          {[
            { key: 'overview', label: 'Overview', icon: '📊' },
            { key: 'history', label: 'History', icon: '📝' },
            { key: 'tiers', label: 'Tiers', icon: '🏆' },
            { key: 'invite', label: 'Invite', icon: '📢' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex-1 py-2 px-2 rounded-lg text-sm font-bold transition-all ${
                selectedTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="px-4 pb-6 space-y-4">
          {/* Current Level */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold mb-3 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Current Level
            </h3>
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{commissionTiers[referralData.level - 1].icon}</div>
              <div className="flex-1">
                <div className="font-bold text-lg">{referralData.levelName}</div>
                <div className="text-sm text-gray-600">{referralData.commissionRate}% Commission Rate</div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress to next level</span>
                    <span>{referralData.totalReferrals}/{commissionTiers[referralData.level]?.requirement || 'Max'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min((referralData.totalReferrals / (commissionTiers[referralData.level]?.requirement || 100)) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings Summary */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold mb-3 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-500" />
              Earnings Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{referralData.monthlyEarnings}</div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">₹2,180</div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
            </div>
          </div>

          {/* Active Referrals */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Active Referrals
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xl font-bold text-green-600">{referralData.activeReferrals}</div>
                <div className="text-xs text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-xl font-bold text-orange-600">{referralData.totalReferrals - referralData.activeReferrals}</div>
                <div className="text-xs text-gray-600">Inactive</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-600">68%</div>
                <div className="text-xs text-gray-600">Retention</div>
              </div>
            </div>
          </div>

          {/* Quick Invite */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border-2 border-purple-200">
            <h3 className="font-bold mb-2">Quick Invite</h3>
            <p className="text-sm text-gray-600 mb-3">Share your referral code and start earning</p>
            <div className="flex space-x-2">
              <div className="flex-1 bg-white rounded-lg px-3 py-2 border text-sm font-mono">
                {referralData.referralCode}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyReferralCode}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {selectedTab === 'history' && (
        <div className="px-4 pb-6">
          <div className="mb-4">
            <h3 className="font-bold mb-2 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              Referral History
            </h3>
            <p className="text-sm text-gray-600">
              Track your referred users and earnings
            </p>
          </div>

          <div className="space-y-3">
            {referralHistory.map((referral) => (
              <motion.div
                key={referral.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {referral.username.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{referral.username}</div>
                      <div className="text-sm text-gray-600">Joined {referral.joinDate}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{referral.earnings}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                      referral.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {referral.status.toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Played: {referral.totalPlayed}</span>
                    <span className="text-gray-600">Level {referral.level}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tiers Tab */}
      {selectedTab === 'tiers' && (
        <div className="px-4 pb-6">
          <div className="mb-4">
            <h3 className="font-bold mb-2 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Commission Tiers
            </h3>
            <p className="text-sm text-gray-600">
              Higher tiers unlock better commission rates and benefits
            </p>
          </div>

          <div className="space-y-3">
            {commissionTiers.map((tier) => (
              <motion.div
                key={tier.level}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`
                  bg-white rounded-2xl p-4 border-2 transition-all
                  ${tier.level === referralData.level ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-200'}
                  ${tier.level < referralData.level ? 'bg-green-50 border-green-200' : ''}
                  ${tier.level > referralData.level ? 'opacity-75' : ''}
                `}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{tier.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-lg">{tier.name}</h4>
                        <p className="text-sm text-gray-600">
                          {tier.requirement === 0 ? 'Starting tier' : `${tier.requirement} referrals required`}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{tier.rate}%</div>
                        <div className="text-sm text-gray-600">Commission</div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h5 className="font-medium mb-2">Benefits:</h5>
                      <div className="space-y-1">
                        {tier.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {tier.level === referralData.level && (
                      <div className="mt-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold text-center">
                        CURRENT TIER
                      </div>
                    )}
                    
                    {tier.level < referralData.level && (
                      <div className="mt-3 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold text-center">
                        UNLOCKED
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Tab */}
      {selectedTab === 'invite' && (
        <div className="px-4 pb-6">
          <div className="mb-4">
            <h3 className="font-bold mb-2 flex items-center">
              <Share2 className="w-5 h-5 mr-2 text-blue-500" />
              Invite Friends
            </h3>
            <p className="text-sm text-gray-600">
              Share your referral link and earn {referralData.commissionRate}% commission
            </p>
          </div>

          {/* Referral Code */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <h4 className="font-bold mb-3">Your Referral Code</h4>
            <div className="flex space-x-2 mb-3">
              <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 font-mono text-lg font-bold text-center">
                {referralData.referralCode}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyReferralCode}
                className="bg-blue-500 text-white px-4 py-3 rounded-lg"
              >
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </motion.button>
            </div>
            <div className="text-xs text-gray-600 text-center">
              https://perfect91club.com/ref/{referralData.referralCode}
            </div>
          </div>

          {/* Share Buttons */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <h4 className="font-bold mb-3">Share on Social Media</h4>
            <div className="grid grid-cols-3 gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => shareReferralLink('whatsapp')}
                className="bg-green-500 text-white p-3 rounded-xl text-center"
              >
                <div className="text-2xl mb-1">💬</div>
                <div className="text-sm font-bold">WhatsApp</div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => shareReferralLink('telegram')}
                className="bg-blue-500 text-white p-3 rounded-xl text-center"
              >
                <div className="text-2xl mb-1">✈️</div>
                <div className="text-sm font-bold">Telegram</div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => shareReferralLink('twitter')}
                className="bg-sky-500 text-white p-3 rounded-xl text-center"
              >
                <div className="text-2xl mb-1">🐦</div>
                <div className="text-sm font-bold">Twitter</div>
              </motion.button>
            </div>
          </div>

          {/* Earnings Potential */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-4 border-2 border-green-200">
            <h4 className="font-bold mb-3 flex items-center">
              <Gift className="w-5 h-5 mr-2 text-green-500" />
              Earnings Potential
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>1 friend plays ₹1,000:</span>
                <span className="font-bold text-green-600">₹{(1000 * referralData.commissionRate / 100).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>10 friends play ₹1,000 each:</span>
                <span className="font-bold text-green-600">₹{(10000 * referralData.commissionRate / 100).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>50 friends play ₹1,000 each:</span>
                <span className="font-bold text-green-600">₹{(50000 * referralData.commissionRate / 100).toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}