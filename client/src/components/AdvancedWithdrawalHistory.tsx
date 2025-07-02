import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Filter, Calendar, CreditCard, Banknote, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'withdraw' | 'deposit';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  time: string;
  orderNumber: string;
  method: 'bank' | 'upi' | 'card';
}

interface AdvancedWithdrawalHistoryProps {
  onBack: () => void;
}

export default function AdvancedWithdrawalHistory({ onBack }: AdvancedWithdrawalHistoryProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'withdraw' | 'deposit'>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'withdraw',
      amount: 9500.00,
      status: 'completed',
      date: '2025-06-14',
      time: '17:07:55',
      orderNumber: 'WD202506141707554231',
      method: 'bank'
    },
    {
      id: '2',
      type: 'withdraw',
      amount: 1250.00,
      status: 'pending',
      date: '2025-06-14',
      time: '16:45:23',
      orderNumber: 'WD202506141645234892',
      method: 'upi'
    },
    {
      id: '3',
      type: 'deposit',
      amount: 2000.00,
      status: 'completed',
      date: '2025-06-13',
      time: '14:30:12',
      orderNumber: 'DP202506131430124563',
      method: 'upi'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'bank':
        return <Banknote className="w-4 h-4" />;
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'upi':
        return <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">₹</div>;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    return transaction.type === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-white text-lg font-semibold">Withdrawal History</h1>
            <p className="text-green-100 text-sm">indiafata.net/user/home/</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-white" />
          <Filter className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white/10 p-4">
        <div className="flex space-x-1 bg-black/20 rounded-lg p-1">
          {[
            { key: 'all', label: 'All', color: 'bg-gray-600' },
            { key: 'withdraw', label: 'Withdraw', color: 'bg-green-600' },
            { key: 'deposit', label: 'Deposit', color: 'bg-blue-600' }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                selectedFilter === filter.key
                  ? `${filter.color} text-white`
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Date Filter */}
        <div className="mt-3 flex items-center justify-between">
          <button className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg">
            <Calendar className="w-4 h-4 text-white" />
            <span className="text-white text-sm">Choose a date</span>
          </button>
          <select className="bg-white/10 text-white px-3 py-2 rounded-lg text-sm border border-white/20">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="p-4 space-y-3">
        <AnimatePresence>
          {filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'withdraw' ? 'bg-green-600/20' : 'bg-blue-600/20'
                  }`}>
                    {getMethodIcon(transaction.method)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        transaction.type === 'withdraw' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        {transaction.type === 'withdraw' ? 'Withdraw' : 'Deposit'}
                      </span>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(transaction.status)}
                        <span className={`text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-white/70 text-xs mt-1">
                      {transaction.method.toUpperCase()} • {transaction.date} {transaction.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    transaction.type === 'withdraw' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {transaction.type === 'withdraw' ? '-' : '+'}₹{transaction.amount.toFixed(2)}
                  </div>
                  <p className="text-white/50 text-xs">
                    Balance: ₹{(10000 + (transaction.type === 'deposit' ? transaction.amount : -transaction.amount)).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Order Number:</span>
                  <span className="text-white font-mono text-xs">{transaction.orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-white/70">Processing Time:</span>
                  <span className="text-white text-xs">
                    {transaction.status === 'completed' ? '3 seconds auto close' : 'Processing...'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-white/50" />
            </div>
            <p className="text-white/70">No transactions found</p>
            <p className="text-white/50 text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}