import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUp, ArrowDown, Plus, Minus, Clock, CreditCard, 
  Smartphone, Bank, Gift, History, Eye, EyeOff,
  CheckCircle, XCircle, AlertCircle, Zap
} from 'lucide-react';
import { useSmartBalance } from '../hooks/useSmartBalance';
import { apiRequest } from '../lib/queryClient';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'win' | 'bet' | 'bonus';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: Date;
  description: string;
  orderId?: string;
}

interface ComprehensiveWalletSystemProps {
  onBack: () => void;
}

export default function ComprehensiveWalletSystem({ onBack }: ComprehensiveWalletSystemProps) {
  const { balance, refreshBalance } = useSmartBalance();
  const [currentView, setCurrentView] = useState<'main' | 'deposit' | 'withdraw' | 'history'>('main');
  const [showBalance, setShowBalance] = useState(true);
  const [amount, setAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Mock transaction data for demo
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'deposit',
        amount: 1000,
        status: 'completed',
        timestamp: new Date(Date.now() - 3600000),
        description: 'UPI Deposit',
        orderId: 'ORD001'
      },
      {
        id: '2',
        type: 'win',
        amount: 450,
        status: 'completed',
        timestamp: new Date(Date.now() - 7200000),
        description: 'WinGo Game Win'
      },
      {
        id: '3',
        type: 'bet',
        amount: -100,
        status: 'completed',
        timestamp: new Date(Date.now() - 10800000),
        description: 'Aviator Game Bet'
      },
      {
        id: '4',
        type: 'withdrawal',
        amount: -500,
        status: 'pending',
        timestamp: new Date(Date.now() - 14400000),
        description: 'Bank Transfer',
        orderId: 'WTH001'
      },
      {
        id: '5',
        type: 'bonus',
        amount: 51,
        status: 'completed',
        timestamp: new Date(Date.now() - 86400000),
        description: 'Welcome Bonus'
      }
    ];
    setTransactions(mockTransactions);
  }, []);

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: <Smartphone className="w-6 h-6" />, color: 'bg-green-500' },
    { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="w-6 h-6" />, color: 'bg-blue-500' },
    { id: 'bank', name: 'Bank Transfer', icon: <Bank className="w-6 h-6" />, color: 'bg-purple-500' },
    { id: 'wallet', name: 'E-Wallet', icon: <Zap className="w-6 h-6" />, color: 'bg-orange-500' }
  ];

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const handleDeposit = async () => {
    if (!amount || !selectedPayment) return;
    
    setLoading(true);
    try {
      // Mock deposit process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount: parseInt(amount),
        status: 'completed',
        timestamp: new Date(),
        description: `${paymentMethods.find(p => p.id === selectedPayment)?.name} Deposit`,
        orderId: `DEP${Date.now()}`
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      refreshBalance();
      setAmount('');
      setSelectedPayment('');
      setCurrentView('main');
    } catch (error) {
      console.error('Deposit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseInt(amount) > parseInt(balance)) return;
    
    setLoading(true);
    try {
      // Mock withdrawal process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: -parseInt(amount),
        status: 'pending',
        timestamp: new Date(),
        description: 'Bank Withdrawal',
        orderId: `WTH${Date.now()}`
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      refreshBalance();
      setAmount('');
      setCurrentView('main');
    } catch (error) {
      console.error('Withdrawal failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDown className="w-5 h-5 text-green-500" />;
      case 'withdrawal': return <ArrowUp className="w-5 h-5 text-red-500" />;
      case 'win': return <Gift className="w-5 h-5 text-yellow-500" />;
      case 'bet': return <Minus className="w-5 h-5 text-blue-500" />;
      case 'bonus': return <Plus className="w-5 h-5 text-purple-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  if (currentView === 'deposit') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-800 text-white p-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentView('main')}
            className="flex items-center text-white/80 hover:text-white"
          >
            <ArrowDown className="w-5 h-5 mr-2 rotate-90" />
            Back
          </button>
          <h1 className="text-xl font-bold">Deposit Money</h1>
          <div className="w-6" />
        </div>

        <div className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Enter Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <label className="block text-sm font-medium mb-2">Quick Select</label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amt) => (
                <motion.button
                  key={amt}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAmount(amt.toString())}
                  className="py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                >
                  ₹{amt}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <motion.button
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full flex items-center p-3 rounded-lg border-2 transition-colors ${
                    selectedPayment === method.id
                      ? 'border-white bg-white/20'
                      : 'border-white/20 bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${method.color} mr-3`}>
                    {method.icon}
                  </div>
                  <span className="font-medium">{method.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Deposit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDeposit}
            disabled={!amount || !selectedPayment || loading}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 disabled:from-gray-500 disabled:to-gray-600 rounded-lg font-bold text-lg transition-all"
          >
            {loading ? 'Processing...' : `Deposit ₹${amount || '0'}`}
          </motion.button>
        </div>
      </div>
    );
  }

  if (currentView === 'withdraw') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-800 text-white p-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentView('main')}
            className="flex items-center text-white/80 hover:text-white"
          >
            <ArrowDown className="w-5 h-5 mr-2 rotate-90" />
            Back
          </button>
          <h1 className="text-xl font-bold">Withdraw Money</h1>
          <div className="w-6" />
        </div>

        <div className="space-y-6">
          {/* Available Balance */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm opacity-80">Available Balance</div>
            <div className="text-2xl font-bold">₹{balance}</div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Withdraw Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              max={balance}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
            {parseInt(amount) > parseInt(balance) && (
              <div className="text-red-300 text-sm mt-1">Insufficient balance</div>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <label className="block text-sm font-medium mb-2">Quick Select</label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.filter(amt => amt <= parseInt(balance)).map((amt) => (
                <motion.button
                  key={amt}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAmount(amt.toString())}
                  className="py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                >
                  ₹{amt}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Withdraw Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWithdraw}
            disabled={!amount || parseInt(amount) > parseInt(balance) || loading}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 disabled:from-gray-500 disabled:to-gray-600 rounded-lg font-bold text-lg transition-all"
          >
            {loading ? 'Processing...' : `Withdraw ₹${amount || '0'}`}
          </motion.button>

          <div className="text-center text-sm opacity-80">
            Withdrawals are processed within 24 hours
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'history') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white p-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentView('main')}
            className="flex items-center text-white/80 hover:text-white"
          >
            <ArrowDown className="w-5 h-5 mr-2 rotate-90" />
            Back
          </button>
          <h1 className="text-xl font-bold">Transaction History</h1>
          <div className="w-6" />
        </div>

        <div className="space-y-3">
          {transactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm opacity-70">
                      {transaction.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${
                    transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
                  </div>
                  <div className="flex items-center justify-end space-x-1">
                    {getStatusIcon(transaction.status)}
                    <span className="text-xs capitalize">{transaction.status}</span>
                  </div>
                </div>
              </div>
              {transaction.orderId && (
                <div className="text-xs opacity-60">Order ID: {transaction.orderId}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white p-4">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-white/80 hover:text-white"
        >
          <ArrowDown className="w-5 h-5 mr-2 rotate-90" />
          Back
        </button>
        <h1 className="text-xl font-bold">My Wallet</h1>
        <div className="w-6" />
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm opacity-80">Total Balance</div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-white/80 hover:text-white"
          >
            {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>
        <div className="text-3xl font-bold mb-2">
          {showBalance ? `₹${balance}` : '₹***'}
        </div>
        <div className="text-sm opacity-80">Available for gaming</div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentView('deposit')}
          className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 flex flex-col items-center"
        >
          <ArrowDown className="w-8 h-8 mb-2" />
          <span className="font-bold">Deposit</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentView('withdraw')}
          className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-4 flex flex-col items-center"
        >
          <ArrowUp className="w-8 h-8 mb-2" />
          <span className="font-bold">Withdraw</span>
        </motion.button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/10 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">Recent Transactions</h2>
          <button
            onClick={() => setCurrentView('history')}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {transactions.slice(0, 3).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getTransactionIcon(transaction.type)}
                <div>
                  <div className="font-medium text-sm">{transaction.description}</div>
                  <div className="text-xs opacity-70">
                    {transaction.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold text-sm ${
                  transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
                </div>
                <div className="flex items-center justify-end space-x-1">
                  {getStatusIcon(transaction.status)}
                  <span className="text-xs capitalize">{transaction.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Features */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white/10 rounded-xl p-4 flex flex-col items-center"
        >
          <History className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">History</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white/10 rounded-xl p-4 flex flex-col items-center"
        >
          <Gift className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">Bonuses</span>
        </motion.button>
      </div>
    </div>
  );
}