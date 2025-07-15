import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CreditCard, Smartphone, Building2, 
  Plus, TrendingUp, TrendingDown, Clock, CheckCircle,
  Copy, Gift, Percent, Users, Shield, AlertTriangle
} from 'lucide-react';
import KYCVerification from './KYCVerification';

interface User {
  id: number;
  username: string;
  walletBalance: string;
  isVerified?: boolean;
}

interface Props {
  onBack: () => void;
  user: User;
  onBalanceUpdate: () => void;
  onShowVerification?: () => void;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'win' | 'bet' | 'bonus';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: Date;
  method?: string;
  gameType?: string;
}

export default function EnhancedWallet({ onBack, user, onBalanceUpdate, onShowVerification }: Props) {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'bank'>('upi');
  const [upiId, setUpiId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);

  // Mock transaction history
  const transactions: Transaction[] = [
    {
      id: 'TXN001',
      type: 'deposit',
      amount: 1000,
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      method: 'UPI'
    },
    {
      id: 'TXN002', 
      type: 'win',
      amount: 2350,
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      gameType: 'Aviator'
    },
    {
      id: 'TXN003',
      type: 'withdraw',
      amount: 500,
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      method: 'UPI'
    },
    {
      id: 'TXN004',
      type: 'bonus',
      amount: 100,
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      method: 'Welcome Bonus'
    }
  ];

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const handleDeposit = () => {
    if (!depositAmount || !upiId) return;
    
    // Simulate payment processing
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setDepositAmount('');
      setUpiId('');
      onBalanceUpdate();
    }, 2000);
  };

  const handleWithdraw = () => {
    // Check KYC verification first
    if (!user.isVerified) {
      alert('KYC verification required for withdrawals. Please complete your verification first.');
      if (onShowVerification) {
        onShowVerification();
      } else {
        setShowKYCModal(true);
      }
      return;
    }

    if (!withdrawAmount || !upiId) return;
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setWithdrawAmount('');
      setUpiId('');
      onBalanceUpdate();
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Wallet</h1>
        <div className="w-6 h-6"></div>
      </div>

      {/* Balance Card */}
      <div className="p-4">
        <motion.div 
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <div className="text-green-100 text-sm mb-2">Available Balance</div>
            <div className="text-4xl font-bold text-white mb-4">
              ₹{parseFloat(user.walletBalance).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-green-100 text-xs">Today's Win</div>
                <div className="text-white font-semibold">₹2,350</div>
              </div>
              <div className="w-px h-8 bg-green-300"></div>
              <div className="text-center">
                <div className="text-green-100 text-xs">This Month</div>
                <div className="text-white font-semibold">₹15,680</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.button 
            className="bg-blue-600 rounded-lg p-4 text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('deposit')}
          >
            <Plus className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-semibold">Deposit</div>
          </motion.button>
          <motion.button 
            className="bg-orange-600 rounded-lg p-4 text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('withdraw')}
          >
            <TrendingDown className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-semibold">Withdraw</div>
          </motion.button>
          <motion.button 
            className="bg-purple-600 rounded-lg p-4 text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('history')}
          >
            <Clock className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-semibold">History</div>
          </motion.button>
        </div>

        {/* Tabs Content */}
        {activeTab === 'deposit' && (
          <motion.div 
            className="bg-gray-800 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-bold mb-4">Add Money</h3>
            
            {/* Payment Methods */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button 
                onClick={() => setSelectedMethod('upi')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  selectedMethod === 'upi' 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-gray-600 bg-gray-700'
                }`}
              >
                <Smartphone className="w-6 h-6 mx-auto mb-1" />
                <div className="text-xs">UPI</div>
              </button>
              <button 
                onClick={() => setSelectedMethod('card')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  selectedMethod === 'card' 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-gray-600 bg-gray-700'
                }`}
              >
                <CreditCard className="w-6 h-6 mx-auto mb-1" />
                <div className="text-xs">Card</div>
              </button>
              <button 
                onClick={() => setSelectedMethod('bank')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  selectedMethod === 'bank' 
                    ? 'border-blue-500 bg-blue-500/20' 
                    : 'border-gray-600 bg-gray-700'
                }`}
              >
                <Building2 className="w-6 h-6 mx-auto mb-1" />
                <div className="text-xs">Bank</div>
              </button>
            </div>

            {/* Quick Amount Selection */}
            <div className="mb-4">
              <div className="text-sm text-gray-300 mb-2">Quick Select</div>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setDepositAmount(amount.toString())}
                    className="bg-gray-700 p-2 rounded text-sm hover:bg-gray-600 transition-colors"
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Enter Amount</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Minimum ₹100"
                className="w-full bg-gray-700 rounded-lg p-3 text-white placeholder-gray-400"
              />
            </div>

            {/* UPI ID Input */}
            <div className="mb-6">
              <label className="block text-sm text-gray-300 mb-2">
                {selectedMethod === 'upi' ? 'UPI ID' : 
                 selectedMethod === 'card' ? 'Card Number' : 'Account Number'}
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder={
                  selectedMethod === 'upi' ? 'yourname@upi' :
                  selectedMethod === 'card' ? '1234 5678 9012 3456' : '1234567890'
                }
                className="w-full bg-gray-700 rounded-lg p-3 text-white placeholder-gray-400"
              />
            </div>

            <button
              onClick={handleDeposit}
              disabled={!depositAmount || !upiId}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 py-3 rounded-lg font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add ₹{depositAmount || '0'}
            </button>
          </motion.div>
        )}

        {activeTab === 'withdraw' && (
          <motion.div 
            className="bg-gray-800 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-bold mb-4">Withdraw Money</h3>
            
            {!user.isVerified && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>KYC verification required for withdrawals</span>
                </div>
                <button
                  onClick={() => onShowVerification ? onShowVerification() : setShowKYCModal(true)}
                  className="mt-2 text-yellow-400 text-sm underline hover:text-yellow-300"
                >
                  Complete KYC Verification →
                </button>
              </div>
            )}
            
            <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-3 mb-4">
              <div className="text-orange-300 text-sm">
                • Minimum withdrawal: ₹500
                • Processing time: 24-48 hours
                • Withdrawal fee: ₹10 per transaction
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Withdraw Amount</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Minimum ₹500"
                className="w-full bg-gray-700 rounded-lg p-3 text-white placeholder-gray-400"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-300 mb-2">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full bg-gray-700 rounded-lg p-3 text-white placeholder-gray-400"
              />
            </div>

            <button
              onClick={handleWithdraw}
              disabled={!withdrawAmount || !upiId || parseInt(withdrawAmount) < 500 || !user.isVerified}
              className={`w-full py-3 rounded-lg font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                user.isVerified 
                  ? 'bg-gradient-to-r from-orange-500 to-red-600' 
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              {!user.isVerified ? 'Complete KYC to Withdraw' : `Withdraw ₹${withdrawAmount || '0'}`}
            </button>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div 
            className="bg-gray-800 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-bold mb-4">Transaction History</h3>
            
            <div className="space-y-3">
              {transactions.map((txn) => (
                <div key={txn.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        txn.type === 'deposit' ? 'bg-green-500/20 text-green-400' :
                        txn.type === 'withdraw' ? 'bg-orange-500/20 text-orange-400' :
                        txn.type === 'win' ? 'bg-blue-500/20 text-blue-400' :
                        txn.type === 'bonus' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {txn.type === 'deposit' ? <TrendingUp className="w-5 h-5" /> :
                         txn.type === 'withdraw' ? <TrendingDown className="w-5 h-5" /> :
                         txn.type === 'win' ? <TrendingUp className="w-5 h-5" /> :
                         txn.type === 'bonus' ? <Gift className="w-5 h-5" /> :
                         <TrendingDown className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-semibold capitalize">
                          {txn.type === 'bet' ? `${txn.gameType} Bet` :
                           txn.type === 'win' ? `${txn.gameType} Win` :
                           txn.type}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(txn.timestamp)} • {formatTime(txn.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        txn.amount > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount)}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">Completed</span>
                      </div>
                    </div>
                  </div>
                  
                  {txn.id && (
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>ID: {txn.id}</span>
                      <button 
                        onClick={() => copyToClipboard(txn.id)}
                        className="flex items-center gap-1 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <motion.div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gray-800 rounded-xl p-8 text-center mx-4"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">
              {activeTab === 'deposit' ? 'Deposit Successful!' : 'Withdrawal Requested!'}
            </h3>
            <p className="text-gray-300">
              {activeTab === 'deposit' 
                ? `₹${depositAmount} has been added to your wallet`
                : `₹${withdrawAmount} withdrawal is being processed`
              }
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* KYC Verification Modal */}
      {showKYCModal && (
        <KYCVerification
          onClose={() => setShowKYCModal(false)}
          onVerificationComplete={(status) => {
            if (status === 'verified') {
              user.isVerified = true; // Update user verification status
            }
            setShowKYCModal(false);
          }}
        />
      )}
    </div>
  );
}