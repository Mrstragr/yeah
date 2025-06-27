import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, 
  CreditCard, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownLeft, 
  QrCode,
  Smartphone,
  Building2,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Gift,
  Star,
  Crown,
  History,
  Plus,
  Minus,
  RefreshCw,
  Copy,
  ExternalLink,
  Zap,
  Award,
  Target,
  Users
} from 'lucide-react';

interface WalletSystemProps {
  onClose: () => void;
}

export function EnhancedWalletSystem({ onClose }: WalletSystemProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'history'>('overview');
  const [depositMethod, setDepositMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'upi'>('upi');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    upiId: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Wallet Balance Query
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ['/api/wallet/balance'],
  });

  // Transaction History Query
  const { data: transactionHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['/api/wallet/transactions'],
  });

  // Deposit Mutation
  const depositMutation = useMutation({
    mutationFn: async (depositData: { amount: number; method: string }) => {
      const response = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(depositData),
      });
      
      if (!response.ok) {
        throw new Error('Deposit failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Deposit Initiated',
        description: 'Your deposit request has been processed successfully',
      });
      setDepositAmount('');
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/transactions'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Deposit Failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  // Withdraw Mutation
  const withdrawMutation = useMutation({
    mutationFn: async (withdrawData: any) => {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(withdrawData),
      });
      
      if (!response.ok) {
        throw new Error('Withdrawal failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Withdrawal Initiated',
        description: 'Your withdrawal request will be processed within 24 hours',
      });
      setWithdrawAmount('');
      setBankDetails({
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        upiId: ''
      });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/transactions'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Withdrawal Failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  // Quick deposit amounts
  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) < 10) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum deposit amount is ₹10',
        variant: 'destructive',
      });
      return;
    }

    depositMutation.mutate({
      amount: parseFloat(depositAmount),
      method: depositMethod
    });
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < 100) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum withdrawal amount is ₹100',
        variant: 'destructive',
      });
      return;
    }

    const currentBalance = parseFloat(walletData?.walletBalance || '0');
    if (parseFloat(withdrawAmount) > currentBalance) {
      toast({
        title: 'Insufficient Balance',
        description: 'You cannot withdraw more than your available balance',
        variant: 'destructive',
      });
      return;
    }

    if (withdrawMethod === 'bank' && (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolderName)) {
      toast({
        title: 'Missing Bank Details',
        description: 'Please fill all bank details',
        variant: 'destructive',
      });
      return;
    }

    if (withdrawMethod === 'upi' && !bankDetails.upiId) {
      toast({
        title: 'Missing UPI ID',
        description: 'Please enter your UPI ID',
        variant: 'destructive',
      });
      return;
    }

    withdrawMutation.mutate({
      amount: parseFloat(withdrawAmount),
      method: withdrawMethod,
      ...bankDetails
    });
  };

  // Wallet Overview Tab
  const renderOverview = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="wallet-overview"
    >
      {/* Balance Cards */}
      <div className="balance-cards">
        <motion.div className="balance-card main" variants={itemVariants}>
          <div className="balance-header">
            <div className="balance-icon">
              <Wallet />
            </div>
            <div className="balance-info">
              <h3>Total Balance</h3>
              <div className="balance-amount">
                <IndianRupee className="currency-icon" />
                <span>₹{walletData?.walletBalance || '0'}</span>
              </div>
            </div>
          </div>
          <div className="balance-actions">
            <motion.button
              className="action-btn deposit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('deposit')}
            >
              <Plus className="btn-icon" />
              Add Money
            </motion.button>
            <motion.button
              className="action-btn withdraw"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('withdraw')}
            >
              <Minus className="btn-icon" />
              Withdraw
            </motion.button>
          </div>
        </motion.div>

        <motion.div className="balance-card bonus" variants={itemVariants}>
          <div className="balance-header">
            <div className="balance-icon bonus">
              <Gift />
            </div>
            <div className="balance-info">
              <h3>Bonus Balance</h3>
              <div className="balance-amount">
                <IndianRupee className="currency-icon" />
                <span>₹{walletData?.bonusBalance || '0'}</span>
              </div>
            </div>
          </div>
          <p className="bonus-note">Bonus funds from promotions and rewards</p>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div className="quick-stats" variants={itemVariants}>
        <h3>Quick Stats</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon deposits">
              <ArrowDownLeft />
            </div>
            <div className="stat-content">
              <h4>Total Deposits</h4>
              <p>₹{walletData?.totalDeposits || '0'}</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon withdrawals">
              <ArrowUpRight />
            </div>
            <div className="stat-content">
              <h4>Total Withdrawals</h4>
              <p>₹{walletData?.totalWithdrawals || '0'}</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon winnings">
              <Trophy />
            </div>
            <div className="stat-content">
              <h4>Total Winnings</h4>
              <p>₹{walletData?.totalWinnings || '0'}</p>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon transactions">
              <History />
            </div>
            <div className="stat-content">
              <h4>Transactions</h4>
              <p>{transactionHistory?.transactions?.length || 0}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div className="recent-transactions" variants={itemVariants}>
        <div className="section-header">
          <h3>Recent Transactions</h3>
          <motion.button
            className="view-all-btn"
            onClick={() => setActiveTab('history')}
            whileHover={{ x: 5 }}
          >
            View All <ExternalLink className="icon" />
          </motion.button>
        </div>
        <div className="transaction-list">
          {transactionHistory?.transactions?.slice(0, 5).map((transaction: any, index: number) => (
            <motion.div
              key={transaction.id}
              className="transaction-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="transaction-icon">
                {transaction.type === 'deposit' ? (
                  <ArrowDownLeft className="deposit-icon" />
                ) : transaction.type === 'withdrawal' ? (
                  <ArrowUpRight className="withdrawal-icon" />
                ) : (
                  <Target className="game-icon" />
                )}
              </div>
              <div className="transaction-details">
                <h4>{transaction.description || transaction.type}</h4>
                <p>{new Date(transaction.createdAt).toLocaleDateString()}</p>
              </div>
              <div className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'withdrawal' ? '-' : '+'}₹{transaction.amount}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  // Deposit Tab
  const renderDeposit = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="wallet-deposit"
    >
      <motion.div className="section-header" variants={itemVariants}>
        <div className="header-content">
          <div className="header-icon">
            <Plus />
          </div>
          <div className="header-text">
            <h2>Add Money</h2>
            <p>Add funds to your wallet securely</p>
          </div>
        </div>
      </motion.div>

      {/* Deposit Methods */}
      <motion.div className="payment-methods" variants={itemVariants}>
        <h3>Select Payment Method</h3>
        <div className="method-grid">
          <motion.button
            className={`method-card ${depositMethod === 'upi' ? 'active' : ''}`}
            onClick={() => setDepositMethod('upi')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="method-icon upi">
              <QrCode />
            </div>
            <div className="method-info">
              <h4>UPI</h4>
              <p>Pay with any UPI app</p>
            </div>
            <div className="method-badge instant">Instant</div>
          </motion.button>

          <motion.button
            className={`method-card ${depositMethod === 'card' ? 'active' : ''}`}
            onClick={() => setDepositMethod('card')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="method-icon card">
              <CreditCard />
            </div>
            <div className="method-info">
              <h4>Debit/Credit Card</h4>
              <p>Visa, MasterCard, RuPay</p>
            </div>
            <div className="method-badge secure">Secure</div>
          </motion.button>

          <motion.button
            className={`method-card ${depositMethod === 'netbanking' ? 'active' : ''}`}
            onClick={() => setDepositMethod('netbanking')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="method-icon bank">
              <Building2 />
            </div>
            <div className="method-info">
              <h4>Net Banking</h4>
              <p>All major banks supported</p>
            </div>
            <div className="method-badge reliable">Reliable</div>
          </motion.button>
        </div>
      </motion.div>

      {/* Amount Selection */}
      <motion.div className="amount-selection" variants={itemVariants}>
        <h3>Select Amount</h3>
        <div className="quick-amounts">
          {quickAmounts.map(amount => (
            <motion.button
              key={amount}
              className={`quick-amount ${depositAmount === amount.toString() ? 'active' : ''}`}
              onClick={() => setDepositAmount(amount.toString())}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ₹{amount}
            </motion.button>
          ))}
        </div>
        
        <div className="custom-amount">
          <label>Custom Amount</label>
          <div className="amount-input">
            <IndianRupee className="currency-icon" />
            <input
              type="number"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="10"
              max="100000"
            />
          </div>
          <p className="amount-note">Minimum: ₹10 | Maximum: ₹1,00,000</p>
        </div>
      </motion.div>

      {/* Deposit Button */}
      <motion.div className="deposit-action" variants={itemVariants}>
        <motion.button
          className="deposit-btn"
          onClick={handleDeposit}
          disabled={!depositAmount || depositMutation.isPending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {depositMutation.isPending ? (
            <div className="loading-spinner">
              <RefreshCw className="spin" />
              Processing...
            </div>
          ) : (
            <>
              <Shield className="btn-icon" />
              Add ₹{depositAmount || '0'} Securely
            </>
          )}
        </motion.button>
        
        <div className="security-info">
          <div className="security-item">
            <CheckCircle2 className="check-icon" />
            <span>256-bit SSL Encryption</span>
          </div>
          <div className="security-item">
            <CheckCircle2 className="check-icon" />
            <span>PCI DSS Compliant</span>
          </div>
          <div className="security-item">
            <CheckCircle2 className="check-icon" />
            <span>Instant Credit</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Withdraw Tab
  const renderWithdraw = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="wallet-withdraw"
    >
      <motion.div className="section-header" variants={itemVariants}>
        <div className="header-content">
          <div className="header-icon">
            <ArrowUpRight />
          </div>
          <div className="header-text">
            <h2>Withdraw Money</h2>
            <p>Withdraw your winnings safely</p>
          </div>
        </div>
        <div className="available-balance">
          <span>Available: ₹{walletData?.walletBalance || '0'}</span>
        </div>
      </motion.div>

      {/* Withdrawal Methods */}
      <motion.div className="withdrawal-methods" variants={itemVariants}>
        <h3>Select Withdrawal Method</h3>
        <div className="method-grid">
          <motion.button
            className={`method-card ${withdrawMethod === 'upi' ? 'active' : ''}`}
            onClick={() => setWithdrawMethod('upi')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="method-icon upi">
              <Smartphone />
            </div>
            <div className="method-info">
              <h4>UPI Transfer</h4>
              <p>Direct to UPI ID</p>
            </div>
            <div className="method-badge fast">2-4 Hours</div>
          </motion.button>

          <motion.button
            className={`method-card ${withdrawMethod === 'bank' ? 'active' : ''}`}
            onClick={() => setWithdrawMethod('bank')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="method-icon bank">
              <Building2 />
            </div>
            <div className="method-info">
              <h4>Bank Transfer</h4>
              <p>NEFT/IMPS to bank account</p>
            </div>
            <div className="method-badge standard">4-24 Hours</div>
          </motion.button>
        </div>
      </motion.div>

      {/* Amount Input */}
      <motion.div className="withdraw-amount" variants={itemVariants}>
        <h3>Withdrawal Amount</h3>
        <div className="amount-input">
          <IndianRupee className="currency-icon" />
          <input
            type="number"
            placeholder="Enter withdrawal amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            min="100"
            max={walletData?.walletBalance || '0'}
          />
        </div>
        <p className="amount-note">
          Minimum: ₹100 | Maximum: ₹{walletData?.walletBalance || '0'}
        </p>
      </motion.div>

      {/* Bank Details */}
      <motion.div className="bank-details" variants={itemVariants}>
        <h3>{withdrawMethod === 'upi' ? 'UPI Details' : 'Bank Account Details'}</h3>
        
        {withdrawMethod === 'upi' ? (
          <div className="form-group">
            <label>UPI ID</label>
            <input
              type="text"
              placeholder="yourname@paytm"
              value={bankDetails.upiId}
              onChange={(e) => setBankDetails(prev => ({
                ...prev,
                upiId: e.target.value
              }))}
              required
            />
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Account Holder Name</label>
              <input
                type="text"
                placeholder="Enter account holder name"
                value={bankDetails.accountHolderName}
                onChange={(e) => setBankDetails(prev => ({
                  ...prev,
                  accountHolderName: e.target.value
                }))}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                placeholder="Enter account number"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails(prev => ({
                  ...prev,
                  accountNumber: e.target.value
                }))}
                required
              />
            </div>
            
            <div className="form-group">
              <label>IFSC Code</label>
              <input
                type="text"
                placeholder="Enter IFSC code"
                value={bankDetails.ifscCode}
                onChange={(e) => setBankDetails(prev => ({
                  ...prev,
                  ifscCode: e.target.value.toUpperCase()
                }))}
                required
              />
            </div>
          </>
        )}
      </motion.div>

      {/* Withdraw Button */}
      <motion.div className="withdraw-action" variants={itemVariants}>
        <motion.button
          className="withdraw-btn"
          onClick={handleWithdraw}
          disabled={!withdrawAmount || withdrawMutation.isPending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {withdrawMutation.isPending ? (
            <div className="loading-spinner">
              <RefreshCw className="spin" />
              Processing...
            </div>
          ) : (
            <>
              <ArrowUpRight className="btn-icon" />
              Withdraw ₹{withdrawAmount || '0'}
            </>
          )}
        </motion.button>
        
        <div className="withdrawal-info">
          <div className="info-item">
            <Clock className="info-icon" />
            <span>Processing time: {withdrawMethod === 'upi' ? '2-4 hours' : '4-24 hours'}</span>
          </div>
          <div className="info-item">
            <Shield className="info-icon" />
            <span>Secure & encrypted transactions</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Transaction History Tab
  const renderHistory = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="wallet-history"
    >
      <motion.div className="section-header" variants={itemVariants}>
        <div className="header-content">
          <div className="header-icon">
            <History />
          </div>
          <div className="header-text">
            <h2>Transaction History</h2>
            <p>Track all your wallet activities</p>
          </div>
        </div>
      </motion.div>

      <motion.div className="transaction-filters" variants={itemVariants}>
        <div className="filter-tabs">
          <button className="filter-tab active">All</button>
          <button className="filter-tab">Deposits</button>
          <button className="filter-tab">Withdrawals</button>
          <button className="filter-tab">Games</button>
        </div>
      </motion.div>

      <motion.div className="transaction-history" variants={itemVariants}>
        {historyLoading ? (
          <div className="loading-state">
            <RefreshCw className="spin" />
            <p>Loading transactions...</p>
          </div>
        ) : transactionHistory?.transactions?.length > 0 ? (
          <div className="transaction-list">
            {transactionHistory.transactions.map((transaction: any, index: number) => (
              <motion.div
                key={transaction.id}
                className="transaction-item detailed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="transaction-icon">
                  {transaction.type === 'deposit' ? (
                    <ArrowDownLeft className="deposit-icon" />
                  ) : transaction.type === 'withdrawal' ? (
                    <ArrowUpRight className="withdrawal-icon" />
                  ) : (
                    <Target className="game-icon" />
                  )}
                </div>
                <div className="transaction-details">
                  <h4>{transaction.description || transaction.type}</h4>
                  <p className="transaction-date">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                  <p className="transaction-id">ID: {transaction.id}</p>
                </div>
                <div className="transaction-status">
                  <span className={`status-badge ${transaction.status || 'completed'}`}>
                    {transaction.status || 'Completed'}
                  </span>
                </div>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'withdrawal' ? '-' : '+'}₹{transaction.amount}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <History className="empty-icon" />
            <h3>No Transactions Yet</h3>
            <p>Your transaction history will appear here</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  return (
    <div className="enhanced-wallet-overlay">
      <motion.div
        className="enhanced-wallet-modal"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="wallet-header">
          <div className="header-left">
            <Wallet className="wallet-icon" />
            <div className="header-info">
              <h1>My Wallet</h1>
              <p>Manage your funds securely</p>
            </div>
          </div>
          <motion.button
            className="close-btn"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        </div>

        {/* Navigation Tabs */}
        <div className="wallet-nav">
          {[
            { id: 'overview', label: 'Overview', icon: Wallet },
            { id: 'deposit', label: 'Deposit', icon: Plus },
            { id: 'withdraw', label: 'Withdraw', icon: Minus },
            { id: 'history', label: 'History', icon: History }
          ].map(tab => (
            <motion.button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon className="tab-icon" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <div className="wallet-content">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'deposit' && renderDeposit()}
            {activeTab === 'withdraw' && renderWithdraw()}
            {activeTab === 'history' && renderHistory()}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}