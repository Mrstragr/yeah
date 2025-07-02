import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Crown, Gift, Wallet, TrendingUp, Calendar, Users, Star, Award, Diamond, Zap } from 'lucide-react';

interface VIPMemberProfileProps {
  onBack: () => void;
  balance: string;
}

export default function VIPMemberProfile({ onBack, balance }: VIPMemberProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'benefits' | 'progress'>('overview');

  const vipData = {
    membershipLevel: 'VIP',
    memberNumber: 'MEMBERUNGURUIP',
    lastLogin: '2025-07-02 10:54:28',
    totalBalance: balance,
    vipLevel: 3,
    nextLevel: 4,
    progressPercentage: 65,
    pointsNeeded: 15000,
    currentPoints: 9750
  };

  const benefits = [
    { icon: <Crown className="w-5 h-5" />, title: 'VIP Exclusive Games', desc: 'Access to premium games' },
    { icon: <Gift className="w-5 h-5" />, title: 'Daily Bonuses', desc: '200% deposit bonus' },
    { icon: <Zap className="w-5 h-5" />, title: 'Fast Withdrawals', desc: 'Priority processing' },
    { icon: <Diamond className="w-5 h-5" />, title: 'Personal Manager', desc: '24/7 VIP support' },
    { icon: <Award className="w-5 h-5" />, title: 'Cashback Rewards', desc: '5% weekly cashback' },
    { icon: <Star className="w-5 h-5" />, title: 'Birthday Gifts', desc: 'Special celebration bonus' }
  ];

  const menuItems = [
    { icon: <Wallet className="w-6 h-6" />, title: 'Wallet', subtitle: 'My balance', value: `₹${balance}`, color: 'text-green-400' },
    { icon: <Gift className="w-6 h-6" />, title: 'Deposit', subtitle: 'Add funds', color: 'text-blue-400' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Withdraw', subtitle: 'Cash out', color: 'text-orange-400' },
    { icon: <Crown className="w-6 h-6" />, title: 'VIP', subtitle: 'Premium access', color: 'text-yellow-400' }
  ];

  const actionItems = [
    { icon: <Calendar className="w-6 h-6" />, title: 'Game History', subtitle: 'My game history', bg: 'from-blue-500 to-blue-600' },
    { icon: <Users className="w-6 h-6" />, title: 'Transaction History', subtitle: 'My transactions', bg: 'from-purple-500 to-purple-600' },
    { icon: <Gift className="w-6 h-6" />, title: 'Deposit', subtitle: 'My deposits', bg: 'from-green-500 to-green-600' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Withdraw', subtitle: 'Withdraw', bg: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="text-center">
            <h1 className="text-white text-lg font-semibold">Member Profile</h1>
            <p className="text-purple-200 text-sm">indiafata.net/main</p>
          </div>
          <div className="w-10 h-10"></div>
        </div>

        {/* Profile Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">{vipData.memberNumber}</h2>
              <p className="text-purple-200 text-sm">Last login: {vipData.lastLogin}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                  VIP LEVEL {vipData.vipLevel}
                </span>
                <span className="text-green-400 text-sm font-semibold">₹{vipData.totalBalance}</span>
              </div>
            </div>
          </div>

          {/* VIP Progress */}
          <div className="bg-black/20 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-sm">VIP Progress</span>
              <span className="text-yellow-400 text-sm font-semibold">{vipData.progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <motion.div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${vipData.progressPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-purple-200 text-xs">
              {vipData.pointsNeeded - vipData.currentPoints} points needed for VIP Level {vipData.nextLevel}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <div className="grid grid-cols-4 gap-3 mb-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/10"
            >
              <div className={`${item.color} mb-2 flex justify-center`}>
                {item.icon}
              </div>
              <h3 className="text-white text-sm font-medium">{item.title}</h3>
              <p className="text-white/60 text-xs mt-1">{item.subtitle}</p>
              {item.value && (
                <p className={`text-xs font-bold mt-1 ${item.color}`}>{item.value}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-black/20 rounded-xl p-1 mb-6">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'benefits', label: 'VIP Benefits' },
            { key: 'progress', label: 'Progress' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {actionItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-r ${item.bg} rounded-xl p-4 flex items-center justify-between`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <div className="text-white">
                        {item.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      <p className="text-white/80 text-sm">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-white">
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'benefits' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-2 gap-4"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                >
                  <div className="text-yellow-400 mb-3 flex justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="text-white text-sm font-semibold text-center">{benefit.title}</h3>
                  <p className="text-white/60 text-xs text-center mt-2">{benefit.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-white text-lg font-semibold mb-4">VIP Journey</h3>
                
                {/* Current Level */}
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <Crown className="w-8 h-8 text-black" />
                    <div>
                      <h4 className="text-black font-bold">VIP Level {vipData.vipLevel}</h4>
                      <p className="text-black/80 text-sm">Current Status</p>
                    </div>
                  </div>
                </div>

                {/* Progress Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Current Points</span>
                    <span className="text-white font-semibold">{vipData.currentPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Points Needed</span>
                    <span className="text-yellow-400 font-semibold">{(vipData.pointsNeeded - vipData.currentPoints).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Next Level</span>
                    <span className="text-green-400 font-semibold">VIP {vipData.nextLevel}</span>
                  </div>
                </div>

                {/* Next Level Preview */}
                <div className="mt-6 bg-black/20 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-2">VIP {vipData.nextLevel} Benefits</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="text-green-400">• 300% deposit bonus</li>
                    <li className="text-green-400">• Instant withdrawals</li>
                    <li className="text-green-400">• Dedicated support manager</li>
                    <li className="text-green-400">• 10% weekly cashback</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-4 text-center">
          <Crown className="w-8 h-8 text-white mx-auto mb-2" />
          <h3 className="text-white font-bold">VIP Member</h3>
          <p className="text-white/80 text-sm">Enjoy exclusive benefits and rewards</p>
        </div>
      </div>
    </div>
  );
}