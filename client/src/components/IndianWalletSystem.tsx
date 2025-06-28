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
  Users,
  X,
  Eye,
  Download,
  Upload,
  Phone,
  Mail,
  Calendar,
  FileText
} from 'lucide-react';

interface WalletProps {
  onClose: () => void;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'game' | 'bonus';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  createdAt: string;
  orderId?: string;
  method?: string;
}

interface WalletData {
  walletBalance: string;
  bonusBalance: string;
  totalDeposits: string;
  totalWithdrawals: string;
  totalWinnings: string;
  transactions: Transaction[];
}

export function IndianWalletSystem({ onClose }: WalletProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'history'>('overview');
  const [depositMethod, setDepositMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'upi'>('upi');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    upiId: '',
    bankName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState<any>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Wallet Data Query
  const { data: walletData, isLoading: walletLoading, refetch } = useQuery<WalletData>({
    queryKey: ['/api/wallet/balance'],
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  // Quick deposit amounts (Indian gaming standard amounts)
  const quickAmounts = [100, 200, 500, 1000, 2000, 5000, 10000, 25000];

  // Popular Indian banks for withdrawal
  const indianBanks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
    'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda',
    'Canara Bank', 'Union Bank of India', 'Indian Bank', 'IDFC First Bank'
  ];

  // Razorpay Integration for Deposits
  const createRazorpayOrder = useMutation({
    mutationFn: async (amount: number) => {
      const response = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, method: depositMethod }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setPaymentOrder(data);
      if (depositMethod === 'upi') {
        setShowPaymentQR(true);
      } else {
        // Handle other payment methods (card, netbanking)
        handleRazorpayPayment(data);
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Payment Failed',
        description: error.message || 'Unable to process payment',
        variant: 'destructive',
      });
    },
  });

  // Handle Razorpay Payment
  const handleRazorpayPayment = (orderData: any) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo', // From environment
      amount: orderData.amount,
      currency: 'INR',
      name: 'Perfect91Club',
      description: 'Add Money to Wallet',
      order_id: orderData.orderId,
      handler: function(response: any) {
        verifyPayment.mutate({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
      },
      prefill: {
        name: 'User',
        email: 'user@perfect91club.com',
        contact: '9876543210'
      },
      theme: {
        color: '#10b981'
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
          toast({
            title: 'Payment Cancelled',
            description: 'You cancelled the payment process',
            variant: 'destructive',
          });
        }
      }
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  };

  // Verify Payment
  const verifyPayment = useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await fetch('/api/wallet/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        throw new Error('Payment verification failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Payment Successful!',
        description: `₹${depositAmount} has been added to your wallet`,
      });
      setDepositAmount('');
      setIsProcessing(false);
      setShowPaymentQR(false);
      setPaymentOrder(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Payment Verification Failed',
        description: error.message || 'Please contact support',
        variant: 'destructive',
      });
      setIsProcessing(false);
    },
  });

  // Withdrawal Request
  const withdrawMutation = useMutation({
    mutationFn: async (withdrawData: any) => {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(withdrawData),
      });
      
      if (!response.ok) {
        throw new Error('Withdrawal request failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Withdrawal Requested',
        description: 'Your withdrawal will be processed within 4-24 hours',
      });
      setWithdrawAmount('');
      setBankDetails({
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        upiId: '',
        bankName: ''
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Withdrawal Failed',
        description: error.message || 'Please check your details and try again',
        variant: 'destructive',
      });
    },
  });

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) < 100) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum deposit amount is ₹100',
        variant: 'destructive',
      });
      return;
    }

    if (parseFloat(depositAmount) > 100000) {
      toast({
        title: 'Amount Too High',
        description: 'Maximum deposit amount is ₹1,00,000',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    createRazorpayOrder.mutate(parseFloat(depositAmount));
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < 500) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum withdrawal amount is ₹500',
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

    // Validate bank details
    if (withdrawMethod === 'bank') {
      if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolderName || !bankDetails.bankName) {
        toast({
          title: 'Missing Bank Details',
          description: 'Please fill all bank account details',
          variant: 'destructive',
        });
        return;
      }
    } else if (withdrawMethod === 'upi' && !bankDetails.upiId) {
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

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
          <div className="card-header">
            <div className="balance-icon">
              <Wallet className="icon" />
            </div>
            <div className="balance-info">
              <h3>Main Balance</h3>
              <div className="balance-amount">
                <IndianRupee className="currency-icon" />
                <span>₹{walletData?.walletBalance || '0.00'}</span>
              </div>
            </div>
            <motion.button
              className="refresh-btn"
              onClick={() => refetch()}
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              <RefreshCw className="refresh-icon" />
            </motion.button>
          </div>
          <div className="card-actions">
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
          <div className="card-header">
            <div className="balance-icon bonus">
              <Gift className="icon" />
            </div>
            <div className="balance-info">
              <h3>Bonus Balance</h3>
              <div className="balance-amount">
                <IndianRupee className="currency-icon" />
                <span>₹{walletData?.bonusBalance || '0.00'}</span>
              </div>
            </div>
          </div>
          <p className="bonus-note">Use bonus funds to play games and tournaments</p>
        </motion.div>
      </div>

      {/* Quick Statistics */}
      <motion.div className="quick-stats" variants={itemVariants}>
        <h3>Transaction Summary</h3>
        <div className="stats-grid">
          <div className="stat-item deposits">
            <div className="stat-icon">
              <ArrowDownLeft className="icon" />
            </div>
            <div className="stat-content">
              <h4>Total Deposits</h4>
              <p>₹{walletData?.totalDeposits || '0.00'}</p>
            </div>
          </div>
          <div className="stat-item withdrawals">
            <div className="stat-icon">
              <ArrowUpRight className="icon" />
            </div>
            <div className="stat-content">
              <h4>Total Withdrawals</h4>
              <p>₹{walletData?.totalWithdrawals || '0.00'}</p>
            </div>
          </div>
          <div className="stat-item winnings">
            <div className="stat-icon">
              <Award className="icon" />
            </div>
            <div className="stat-content">
              <h4>Total Winnings</h4>
              <p>₹{walletData?.totalWinnings || '0.00'}</p>
            </div>
          </div>
          <div className="stat-item transactions">
            <div className="stat-icon">
              <History className="icon" />
            </div>
            <div className="stat-content">
              <h4>Transactions</h4>
              <p>{walletData?.transactions?.length || 0}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div className="recent-transactions" variants={itemVariants}>
        <div className="section-header">
          <h3>Recent Activity</h3>
          <motion.button
            className="view-all-btn"
            onClick={() => setActiveTab('history')}
            whileHover={{ x: 5 }}
          >
            View All <ExternalLink className="icon" />
          </motion.button>
        </div>
        <div className="transaction-list">
          {walletData?.transactions?.slice(0, 5).map((transaction, index) => (
            <motion.div
              key={transaction.id}
              className="transaction-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`transaction-icon ${transaction.type}`}>
                {transaction.type === 'deposit' && <ArrowDownLeft className="icon" />}
                {transaction.type === 'withdrawal' && <ArrowUpRight className="icon" />}
                {transaction.type === 'game' && <Target className="icon" />}
                {transaction.type === 'bonus' && <Gift className="icon" />}
              </div>
              <div className="transaction-details">
                <h4>{transaction.description}</h4>
                <p>{new Date(transaction.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="transaction-status">
                <span className={`status-badge ${transaction.status}`}>
                  {transaction.status}
                </span>
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
            <Plus className="icon" />
          </div>
          <div className="header-text">
            <h2>Add Money</h2>
            <p>Add funds to your wallet securely with Razorpay</p>
          </div>
        </div>
        <div className="security-badges">
          <div className="badge">
            <Shield className="badge-icon" />
            <span>256-bit SSL</span>
          </div>
          <div className="badge">
            <CheckCircle2 className="badge-icon" />
            <span>RBI Approved</span>
          </div>
        </div>
      </motion.div>

      {/* Payment Methods */}
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
              <QrCode className="icon" />
            </div>
            <div className="method-info">
              <h4>UPI Payment</h4>
              <p>Pay with any UPI app</p>
              <span className="method-features">• PhonePe • GPay • Paytm</span>
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
              <CreditCard className="icon" />
            </div>
            <div className="method-info">
              <h4>Debit/Credit Card</h4>
              <p>All major cards accepted</p>
              <span className="method-features">• Visa • MasterCard • RuPay</span>
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
              <Building2 className="icon" />
            </div>
            <div className="method-info">
              <h4>Net Banking</h4>
              <p>50+ banks supported</p>
              <span className="method-features">• SBI • HDFC • ICICI</span>
            </div>
            <div className="method-badge trusted">Trusted</div>
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
              ₹{amount.toLocaleString('en-IN')}
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
              min="100"
              max="100000"
            />
          </div>
          <p className="amount-note">Minimum: ₹100 | Maximum: ₹1,00,000 | No extra charges</p>
        </div>
      </motion.div>

      {/* Deposit Action */}
      <motion.div className="deposit-action" variants={itemVariants}>
        <motion.button
          className="deposit-btn"
          onClick={handleDeposit}
          disabled={!depositAmount || isProcessing || createRazorpayOrder.isPending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isProcessing || createRazorpayOrder.isPending ? (
            <div className="loading-state">
              <RefreshCw className="spin icon" />
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
          <div className="info-item">
            <CheckCircle2 className="info-icon" />
            <span>Instant credit to wallet</span>
          </div>
          <div className="info-item">
            <CheckCircle2 className="info-icon" />
            <span>Bank-grade security</span>
          </div>
          <div className="info-item">
            <CheckCircle2 className="info-icon" />
            <span>24/7 customer support</span>
          </div>
        </div>
      </motion.div>

      {/* UPI QR Code Modal */}
      <AnimatePresence>
        {showPaymentQR && paymentOrder && (
          <div className="payment-qr-overlay">
            <motion.div
              className="payment-qr-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="qr-header">
                <h3>Pay with UPI</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowPaymentQR(false)}
                >
                  <X className="icon" />
                </button>
              </div>
              <div className="qr-content">
                <div className="qr-code">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=perfect91club@razorpay&pn=Perfect91Club&am=${depositAmount}&cu=INR&tn=AddMoney`}
                    alt="UPI QR Code"
                  />
                </div>
                <div className="payment-details">
                  <h4>₹{depositAmount}</h4>
                  <p>Scan QR with any UPI app</p>
                  <div className="upi-apps">
                    <span>📱 PhonePe</span>
                    <span>📱 Google Pay</span>
                    <span>📱 Paytm</span>
                    <span>📱 BHIM</span>
                  </div>
                </div>
              </div>
              <div className="qr-footer">
                <p>Payment will be verified automatically</p>
                <div className="loading-indicator">
                  <RefreshCw className="spin icon" />
                  <span>Waiting for payment...</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
            <ArrowUpRight className="icon" />
          </div>
          <div className="header-text">
            <h2>Withdraw Money</h2>
            <p>Withdraw your winnings to bank account or UPI</p>
          </div>
        </div>
        <div className="available-balance">
          <span>Available: ₹{walletData?.walletBalance || '0.00'}</span>
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
              <Smartphone className="icon" />
            </div>
            <div className="method-info">
              <h4>UPI Transfer</h4>
              <p>Direct to UPI ID</p>
              <span className="method-features">• Instant • 24/7 • No charges</span>
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
              <Building2 className="icon" />
            </div>
            <div className="method-info">
              <h4>Bank Transfer</h4>
              <p>NEFT/IMPS to bank account</p>
              <span className="method-features">• Secure • All banks • Verified</span>
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
            min="500"
            max={walletData?.walletBalance || '0'}
          />
        </div>
        <p className="amount-note">
          Minimum: ₹500 | Maximum: ₹{walletData?.walletBalance || '0'} | Processing fee: ₹0
        </p>
      </motion.div>

      {/* Bank/UPI Details */}
      <motion.div className="payment-details" variants={itemVariants}>
        <h3>{withdrawMethod === 'upi' ? 'UPI Details' : 'Bank Account Details'}</h3>
        
        {withdrawMethod === 'upi' ? (
          <div className="form-group">
            <label>UPI ID *</label>
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
              <label>Account Holder Name *</label>
              <input
                type="text"
                placeholder="Enter name as per bank account"
                value={bankDetails.accountHolderName}
                onChange={(e) => setBankDetails(prev => ({
                  ...prev,
                  accountHolderName: e.target.value
                }))}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Account Number *</label>
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
              <label>IFSC Code *</label>
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
            
            <div className="form-group">
              <label>Bank Name *</label>
              <select
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails(prev => ({
                  ...prev,
                  bankName: e.target.value
                }))}
                required
              >
                <option value="">Select bank</option>
                {indianBanks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </motion.div>

      {/* Withdraw Action */}
      <motion.div className="withdraw-action" variants={itemVariants}>
        <motion.button
          className="withdraw-btn"
          onClick={handleWithdraw}
          disabled={!withdrawAmount || withdrawMutation.isPending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {withdrawMutation.isPending ? (
            <div className="loading-state">
              <RefreshCw className="spin icon" />
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
          <div className="info-item">
            <CheckCircle2 className="info-icon" />
            <span>No hidden charges or fees</span>
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
            <History className="icon" />
          </div>
          <div className="header-text">
            <h2>Transaction History</h2>
            <p>Complete record of all wallet activities</p>
          </div>
        </div>
        <motion.button
          className="download-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="icon" />
          Download
        </motion.button>
      </motion.div>

      <motion.div className="transaction-filters" variants={itemVariants}>
        <div className="filter-tabs">
          <button className="filter-tab active">All</button>
          <button className="filter-tab">Deposits</button>
          <button className="filter-tab">Withdrawals</button>
          <button className="filter-tab">Games</button>
          <button className="filter-tab">Bonus</button>
        </div>
      </motion.div>

      <motion.div className="transaction-history" variants={itemVariants}>
        {walletLoading ? (
          <div className="loading-state">
            <RefreshCw className="spin icon" />
            <p>Loading transactions...</p>
          </div>
        ) : walletData?.transactions?.length ? (
          <div className="transaction-list detailed">
            {walletData.transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                className="transaction-item detailed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={`transaction-icon ${transaction.type}`}>
                  {transaction.type === 'deposit' && <ArrowDownLeft className="icon" />}
                  {transaction.type === 'withdrawal' && <ArrowUpRight className="icon" />}
                  {transaction.type === 'game' && <Target className="icon" />}
                  {transaction.type === 'bonus' && <Gift className="icon" />}
                </div>
                <div className="transaction-details">
                  <h4>{transaction.description}</h4>
                  <p className="transaction-date">
                    {new Date(transaction.createdAt).toLocaleString('en-IN')}
                  </p>
                  {transaction.orderId && (
                    <p className="transaction-id">Order ID: {transaction.orderId}</p>
                  )}
                  {transaction.method && (
                    <p className="transaction-method">Method: {transaction.method}</p>
                  )}
                </div>
                <div className="transaction-status">
                  <span className={`status-badge ${transaction.status}`}>
                    {transaction.status}
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
            <motion.button
              className="start-btn"
              onClick={() => setActiveTab('deposit')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Money to Get Started
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  return (
    <div className="indian-wallet-overlay">
      <motion.div
        className="indian-wallet-modal"
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
              <p>Secure Indian payment gateway</p>
            </div>
          </div>
          <motion.button
            className="close-btn"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="icon" />
          </motion.button>
        </div>

        {/* Navigation Tabs */}
        <div className="wallet-nav">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'deposit', label: 'Add Money', icon: Plus },
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