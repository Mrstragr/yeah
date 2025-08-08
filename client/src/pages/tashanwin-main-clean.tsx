import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Trophy, Wallet, Users, User, Play, Bell, Gift } from 'lucide-react';

// Simple component interfaces
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  level?: string;
}

interface TashanWinMainProps {
  user: User;
  onLogout: () => void;
}

// Toast Manager Component
const ToastManager: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    <AnimatePresence>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className={`p-4 rounded-lg shadow-lg max-w-sm ${
            toast.type === 'success' ? 'bg-green-600 text-white' :
            toast.type === 'error' ? 'bg-red-600 text-white' :
            'bg-blue-600 text-white'
          }`}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// Main Component
export default function TashanWinMain({ user, onLogout }: TashanWinMainProps) {
  const [activeSection, setActiveSection] = useState('home');
  const [userBalance, setUserBalance] = useState('12,580.45');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast['type']) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const games = [
    { id: 'wingo', name: 'WIN GO', icon: '🎯', color: 'from-red-600 to-pink-600' },
    { id: 'aviator', name: 'AVIATOR', icon: '✈️', color: 'from-blue-600 to-purple-600' },
    { id: 'mines', name: 'MINES', icon: '💎', color: 'from-green-600 to-teal-600' },
    { id: 'dice', name: 'DICE', icon: '🎲', color: 'from-yellow-600 to-orange-600' },
  ];

  const handleGameClick = (gameId: string) => {
    addToast(`Opening ${gameId.toUpperCase()}...`, 'info');
  };

  const quickActions = [
    { 
      title: 'Add Money', 
      icon: '💳', 
      action: () => {
        const amount = Math.floor(Math.random() * 1000) + 100;
        addToast(`Added ₹${amount} to wallet`, 'success');
      }
    },
    { 
      title: 'Withdraw', 
      icon: '💰', 
      action: () => addToast('Withdrawal feature coming soon!', 'info') 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold">T</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">TashanWin</h1>
              <p className="text-gray-300 text-sm">Premium Gaming</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="w-6 h-6 text-gray-300" />
            <button 
              onClick={onLogout}
              className="text-gray-300 hover:text-white"
            >
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Total Balance</p>
              <p className="text-2xl font-bold">₹{userBalance}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{action.icon}</span>
                  <span className="font-medium">{action.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Games Section */}
      {activeSection === 'home' && (
        <div className="p-4">
          <h2 className="text-white text-xl font-bold mb-4">Popular Games</h2>
          <div className="grid grid-cols-2 gap-4">
            {games.map((game) => (
              <motion.div
                key={game.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGameClick(game.id)}
                className={`bg-gradient-to-br ${game.color} rounded-xl p-6 cursor-pointer`}
              >
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">{game.icon}</div>
                  <h3 className="font-bold text-lg">{game.name}</h3>
                  <p className="text-sm opacity-90 mt-1">Tap to play</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* User Stats */}
      {activeSection === 'home' && (
        <div className="p-4">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-white text-lg font-bold mb-4">Your Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-gray-300 text-sm">Games Played</p>
                <p className="text-white text-2xl font-bold">47</p>
              </div>
              <div className="text-center">
                <p className="text-gray-300 text-sm">Win Rate</p>
                <p className="text-white text-2xl font-bold">68%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Sections */}
      {(activeSection === 'wallet' || activeSection === 'promotions' || activeSection === 'tournaments') && (
        <div className="p-4">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 text-center border border-white/10">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-white text-2xl font-bold mb-2">
              {activeSection === 'wallet' ? 'Wallet' : 
               activeSection === 'promotions' ? 'Promotions' : 'Tournaments'}
            </h2>
            <p className="text-gray-300 mb-6">
              {activeSection === 'wallet' ? 'Advanced wallet features coming soon' : 
               activeSection === 'promotions' ? 'Exciting bonuses and rewards coming soon' : 
               'Competitive tournaments launching soon'}
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold">
              Coming Soon
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/10">
        <div className="grid grid-cols-5 py-2">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'promotions', icon: Gift, label: 'Promotion' },
            { id: 'tournaments', icon: Trophy, label: 'Activity' },
            { id: 'wallet', icon: Wallet, label: 'Wallet' },
            { id: 'profile', icon: User, label: 'Account' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center py-2 px-1 ${
                activeSection === item.id ? 'text-yellow-400' : 'text-gray-400'
              }`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastManager toasts={toasts} removeToast={removeToast} />
    </div>
  );
}