import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Plus, Minus, Eye, EyeOff } from 'lucide-react';

interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  isVerified: boolean;
}

interface WalletSectionProps {
  user: User;
  balance: string;
  onBalanceUpdate: () => void;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'game_win' | 'game_loss' | 'bonus';
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: Date;
  description: string;
  orderId?: string;
}

export default function WalletSection({ user, balance, onBalanceUpdate }: WalletSectionProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'history'>('overview');
  const [showBalance, setShowBalance] = useState(true);
  const [amount, setAmount] = useState(500);
  const [withdrawAmount, setWithdrawAmount] = useState(100);
  const [loading, setLoading] = useState(false);

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'deposit',
      amount: '+₹1000',
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      description: 'UPI Payment',
      orderId: 'TXN001234567'
    },
    {
      id: '2',
      type: 'game_win',
      amount: '+₹245',
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      description: 'Aviator Game Win'
    },
    {
      id: '3',
      type: 'withdrawal',
      amount: '-₹500',
      status: 'pending',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      description: 'Bank Transfer',
      orderId: 'WTH001234567'
    },
    {
      id: '4',
      type: 'bonus',
      amount: '+₹50',
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      description: 'Daily Check-in Bonus'
    },
    {
      id: '5',
      type: 'game_loss',
      amount: '-₹100',
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      description: 'WinGo 1Min Game'
    }
  ];

  const handleDeposit = async () => {
    setLoading(true);
    try {
      // Simulate deposit process
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Deposit of ₹${amount} initiated successfully!`);
      onBalanceUpdate();
    } catch (error) {
      alert('Deposit failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      // Simulate withdrawal process
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Withdrawal of ₹${withdrawAmount} initiated successfully!`);
      onBalanceUpdate();
    } catch (error) {
      alert('Withdrawal failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return '💰';
      case 'withdrawal': return '🏦';
      case 'game_win': return '🎉';
      case 'game_loss': return '🎮';
      case 'bonus': return '🎁';
      default: return '💳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 text-white">
        <div className="text-center">
          <h1 className="text-xl font-bold">Wallet</h1>
          <div className="text-sm opacity-90">Manage your money</div>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-gray-600">Total Balance</div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          <div className="text-4xl font-bold text-green-600 mb-6">
            {showBalance ? `₹${balance}` : '₹ ****'}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('deposit')}
              className="bg-green-500 text-white p-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
            >
              <ArrowDownLeft className="w-5 h-5" />
              <span>Deposit</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('withdraw')}
              className="bg-blue-500 text-white p-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
            >
              <ArrowUpRight className="w-5 h-5" />
              <span>Withdraw</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 mb-4">
        <div className="flex space-x-2 bg-gray-100 rounded-xl p-1">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'deposit', label: 'Deposit' },
            { key: 'withdraw', label: 'Withdraw' },
            { key: 'history', label: 'History' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                activeTab === tab.key
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="px-4 space-y-4">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-lg font-bold mb-4">This Month</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹5,670</div>
                <div className="text-sm text-gray-600">Total Deposited</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">₹2,340</div>
                <div className="text-sm text-gray-600">Total Won</div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-lg font-bold mb-4">Payment Methods</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-xl">💳</span>
                  </div>
                  <div>
                    <div className="font-semibold">UPI</div>
                    <div className="text-sm text-gray-600">Instant transfer</div>
                  </div>
                </div>
                <div className="text-green-600 font-semibold">✓ Active</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">🏦</span>
                  </div>
                  <div>
                    <div className="font-semibold">Bank Transfer</div>
                    <div className="text-sm text-gray-600">1-2 business days</div>
                  </div>
                </div>
                <div className="text-green-600 font-semibold">✓ Active</div>
              </div>
            </div>
          </div>

          {/* Recent Transactions Preview */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold">Recent Transactions</div>
              <button 
                onClick={() => setActiveTab('history')}
                className="text-blue-500 text-sm font-semibold"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 3).map(transaction => (
                <div key={transaction.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{getTransactionIcon(transaction.type)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{transaction.description}</div>
                    <div className="text-xs text-gray-600">{formatTime(transaction.timestamp)}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount}
                    </div>
                    <div className="flex items-center justify-end">
                      {getStatusIcon(transaction.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Deposit Tab */}
      {activeTab === 'deposit' && (
        <div className="px-4 space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-lg font-bold mb-4">Add Money</div>
            
            {/* Amount Selection */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-gray-600 mb-3">Amount</div>
              <div className="flex items-center justify-between mb-4 bg-gray-100 rounded-xl p-4">
                <button
                  onClick={() => setAmount(Math.max(100, amount - 100))}
                  className="w-10 h-10 bg-red-500 rounded-full text-white font-bold flex items-center justify-center"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="text-3xl font-bold">₹{amount}</div>
                <button
                  onClick={() => setAmount(amount + 100)}
                  className="w-10 h-10 bg-green-500 rounded-full text-white font-bold flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {[500, 1000, 2000, 5000].map(preset => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className={`py-3 px-2 rounded-lg font-medium text-sm ${
                      amount === preset 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-gray-600 mb-3">Payment Method</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-4 border-2 border-green-500 rounded-xl bg-green-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <div className="font-semibold">UPI Payment</div>
                      <div className="text-sm text-gray-600">Instant • Recommended</div>
                    </div>
                  </div>
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🏦</span>
                    <div>
                      <div className="font-semibold">Net Banking</div>
                      <div className="text-sm text-gray-600">Secure • 1-2 minutes</div>
                    </div>
                  </div>
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Deposit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDeposit}
              disabled={loading}
              className="w-full py-4 bg-green-500 text-white font-bold rounded-xl shadow-lg disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Deposit ₹${amount}`}
            </motion.button>

            {/* Security Note */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                🔒 Your transactions are secured with 256-bit SSL encryption
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Tab */}
      {activeTab === 'withdraw' && (
        <div className="px-4 space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-lg font-bold mb-4">Withdraw Money</div>
            
            {/* Available Balance */}
            <div className="mb-6 p-4 bg-green-50 rounded-xl">
              <div className="text-sm text-green-700">Available Balance</div>
              <div className="text-2xl font-bold text-green-600">₹{balance}</div>
            </div>

            {/* Withdrawal Amount */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-gray-600 mb-3">Withdrawal Amount</div>
              <div className="flex items-center justify-between mb-4 bg-gray-100 rounded-xl p-4">
                <button
                  onClick={() => setWithdrawAmount(Math.max(100, withdrawAmount - 100))}
                  className="w-10 h-10 bg-red-500 rounded-full text-white font-bold flex items-center justify-center"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="text-3xl font-bold">₹{withdrawAmount}</div>
                <button
                  onClick={() => setWithdrawAmount(Math.min(parseFloat(balance), withdrawAmount + 100))}
                  className="w-10 h-10 bg-green-500 rounded-full text-white font-bold flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {[100, 500, 1000, 2000].map(preset => (
                  <button
                    key={preset}
                    onClick={() => setWithdrawAmount(Math.min(parseFloat(balance), preset))}
                    className={`py-3 px-2 rounded-lg font-medium text-sm ${
                      withdrawAmount === preset 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Bank Details */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-gray-600 mb-3">Bank Account</div>
              <div className="p-4 border-2 border-blue-500 rounded-xl bg-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">HDFC Bank</div>
                    <div className="text-sm text-gray-600">****1234</div>
                    <div className="text-sm text-gray-600">{user.username}</div>
                  </div>
                  <div className="text-2xl">🏦</div>
                </div>
              </div>
            </div>

            {/* Withdraw Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWithdraw}
              disabled={loading || withdrawAmount > parseFloat(balance)}
              className="w-full py-4 bg-blue-500 text-white font-bold rounded-xl shadow-lg disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Withdraw ₹${withdrawAmount}`}
            </motion.button>

            {/* Withdrawal Info */}
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="text-sm text-yellow-800">
                ⏱️ Withdrawals are processed within 24 hours on business days
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="px-4 space-y-3">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{transaction.description}</div>
                  <div className="text-sm text-gray-600">{formatTime(transaction.timestamp)}</div>
                  {transaction.orderId && (
                    <div className="text-xs text-gray-500 font-mono">ID: {transaction.orderId}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className={`font-bold ${transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount}
                  </div>
                  <div className="flex items-center justify-end space-x-1">
                    {getStatusIcon(transaction.status)}
                    <span className={`text-xs ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}