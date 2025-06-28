import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, ArrowUpRight, ArrowDownLeft, 
  Plus, Minus, Clock, CheckCircle, XCircle,
  Smartphone, Building2, CreditCard as Card,
  User, Calendar, DollarSign, TrendingUp,
  AlertTriangle, RefreshCw, Eye, EyeOff
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win';
  amount: number;
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
  description: string;
  paymentMethod?: string;
  transactionId?: string;
}

interface WalletProps {
  user: any;
  onClose?: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayWalletSystem({ user, onClose }: WalletProps) {
  const [activeTab, setActiveTab] = useState<'balance' | 'deposit' | 'withdraw' | 'history'>('balance');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountHolder: ''
  });

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Load transaction history
    loadTransactionHistory();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const loadTransactionHistory = async () => {
    try {
      const response = await fetch('/api/wallet/transactions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      const data = await response.json();
      if (data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to load transaction history:', error);
    }
  };

  const initiateDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) < 10) {
      alert('Minimum deposit amount is ₹10');
      return;
    }

    setLoading(true);
    try {
      // Create order on backend
      const response = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(depositAmount),
          paymentMethod: selectedPaymentMethod
        })
      });

      const data = await response.json();
      
      if (data.success && data.order) {
        // Initialize Razorpay
        const options = {
          key: data.razorpayKeyId,
          amount: data.order.amount,
          currency: data.order.currency,
          name: 'Perfect91Club',
          description: 'Wallet Deposit',
          order_id: data.order.id,
          prefill: {
            name: user.username,
            email: user.email,
            contact: user.phone
          },
          theme: {
            color: '#10b981'
          },
          handler: async (response: any) => {
            // Verify payment on backend
            try {
              const verifyResponse = await fetch('/api/wallet/verify-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                  orderId: data.order.id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature
                })
              });

              const verifyData = await verifyResponse.json();
              
              if (verifyData.success) {
                alert('Deposit successful! Your wallet has been credited.');
                setDepositAmount('');
                loadTransactionHistory();
                // Refresh user balance
                window.location.reload();
              } else {
                alert('Payment verification failed. Please contact support.');
              }
            } catch (error) {
              alert('Payment verification failed. Please contact support.');
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert('Failed to create payment order: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Deposit initiation failed: ' + error);
    }
    setLoading(false);
  };

  const initiateWithdrawal = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < 50) {
      alert('Minimum withdrawal amount is ₹50');
      return;
    }

    if (parseFloat(withdrawAmount) > parseFloat(user.walletBalance)) {
      alert('Insufficient balance');
      return;
    }

    if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.bankName) {
      alert('Please fill all bank details');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          bankDetails
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Withdrawal request submitted successfully! It will be processed within 24 hours.');
        setWithdrawAmount('');
        setBankDetails({ accountNumber: '', ifscCode: '', bankName: '', accountHolder: '' });
        loadTransactionHistory();
      } else {
        alert('Withdrawal failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Withdrawal failed: ' + error);
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-emerald-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '📱', available: true },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦', available: true },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', available: true },
    { id: 'wallet', name: 'Digital Wallet', icon: '💰', available: true }
  ];

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Wallet</h1>
          {onClose && (
            <button onClick={onClose} className="text-white hover:text-gray-200">
              ✕
            </button>
          )}
        </div>
        
        {/* Balance Display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-100">Total Balance</span>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-emerald-100 hover:text-white"
            >
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          <div className="text-3xl font-bold">
            {showBalance ? `₹${user.walletBalance}` : '₹••••••'}
          </div>
          {user.bonusBalance && parseFloat(user.bonusBalance) > 0 && (
            <div className="text-emerald-200 text-sm mt-1">
              + ₹{user.bonusBalance} Bonus
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-slate-800 border-b border-slate-700">
        {[
          { id: 'balance', label: 'Balance', icon: DollarSign },
          { id: 'deposit', label: 'Deposit', icon: ArrowDownLeft },
          { id: 'withdraw', label: 'Withdraw', icon: ArrowUpRight },
          { id: 'history', label: 'History', icon: Calendar }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-4 ${
              activeTab === tab.id 
                ? 'text-emerald-400 border-b-2 border-emerald-400' 
                : 'text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'balance' && (
            <motion.div
              key="balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  onClick={() => setActiveTab('deposit')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-6 rounded-xl font-semibold flex items-center justify-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-6 h-6" />
                  <span>Add Money</span>
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('withdraw')}
                  className="bg-slate-700 hover:bg-slate-600 text-white p-6 rounded-xl font-semibold flex items-center justify-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Minus className="w-6 h-6" />
                  <span>Withdraw</span>
                </motion.button>
              </div>

              {/* Balance Breakdown */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-white font-semibold mb-4">Balance Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Main Balance</span>
                    <span className="text-white font-semibold">₹{user.walletBalance}</span>
                  </div>
                  {user.bonusBalance && parseFloat(user.bonusBalance) > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Bonus Balance</span>
                      <span className="text-emerald-400 font-semibold">₹{user.bonusBalance}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-600 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total Available</span>
                      <span className="text-emerald-400 font-bold text-lg">
                        ₹{(parseFloat(user.walletBalance) + parseFloat(user.bonusBalance || '0')).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'deposit' && (
            <motion.div
              key="deposit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Amount Input */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-white font-semibold mb-4">Enter Amount</h3>
                <div className="mb-4">
                  <input
                    type="number"
                    placeholder="₹ Enter amount (Min: ₹10)"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                    min="10"
                  />
                </div>
                
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  {quickAmounts.map((amount) => (
                    <motion.button
                      key={amount}
                      onClick={() => setDepositAmount(amount.toString())}
                      className="bg-slate-700 hover:bg-emerald-600 text-white py-3 rounded-lg font-medium transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      ₹{amount}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-white font-semibold mb-4">Payment Method</h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <motion.button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        selectedPaymentMethod === method.id
                          ? 'border-emerald-500 bg-emerald-900/30'
                          : 'border-slate-600 bg-slate-700 hover:bg-slate-600'
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{method.icon}</span>
                        <span className="text-white font-medium">{method.name}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedPaymentMethod === method.id
                          ? 'border-emerald-500 bg-emerald-500'
                          : 'border-gray-400'
                      }`} />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Deposit Button */}
              <motion.button
                onClick={initiateDeposit}
                disabled={loading || !depositAmount}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Add ₹{depositAmount || '0'} to Wallet</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {activeTab === 'withdraw' && (
            <motion.div
              key="withdraw"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Amount Input */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-white font-semibold mb-4">Withdrawal Amount</h3>
                <input
                  type="number"
                  placeholder="₹ Enter amount (Min: ₹50)"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                  min="50"
                  max={user.walletBalance}
                />
                <p className="text-gray-400 text-sm mt-2">
                  Available: ₹{user.walletBalance} • Min: ₹50 • Max: ₹{user.walletBalance}
                </p>
              </div>

              {/* Bank Details */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-white font-semibold mb-4">Bank Details</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Account Holder Name"
                    value={bankDetails.accountHolder}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, accountHolder: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="IFSC Code"
                    value={bankDetails.ifscCode}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Bank Name"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, bankName: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Withdrawal Info */}
              <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div className="text-yellow-200 text-sm">
                    <p className="font-medium mb-1">Withdrawal Information:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Processing time: 2-24 hours</li>
                      <li>Minimum withdrawal: ₹50</li>
                      <li>Processing fee: ₹5 for amounts below ₹1000</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Withdraw Button */}
              <motion.button
                onClick={initiateWithdrawal}
                disabled={loading || !withdrawAmount || !bankDetails.accountNumber}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-5 h-5" />
                    <span>Withdraw ₹{withdrawAmount || '0'}</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Transaction History</h3>
                <motion.button
                  onClick={loadTransactionHistory}
                  className="text-emerald-400 hover:text-emerald-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.button>
              </div>

              {transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      className="bg-slate-800 border border-slate-700 rounded-xl p-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'deposit' ? 'bg-emerald-600' :
                            transaction.type === 'withdrawal' ? 'bg-red-600' :
                            transaction.type === 'win' ? 'bg-green-600' : 'bg-blue-600'
                          }`}>
                            {transaction.type === 'deposit' ? <ArrowDownLeft className="w-5 h-5 text-white" /> :
                             transaction.type === 'withdrawal' ? <ArrowUpRight className="w-5 h-5 text-white" /> :
                             transaction.type === 'win' ? <TrendingUp className="w-5 h-5 text-white" /> :
                             <Minus className="w-5 h-5 text-white" />}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount}
                            </p>
                            <p className="text-gray-400 text-sm">{transaction.description}</p>
                            <p className="text-gray-500 text-xs">{transaction.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          <span className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">No Transactions Yet</h3>
                  <p className="text-gray-400">Your transaction history will appear here</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}