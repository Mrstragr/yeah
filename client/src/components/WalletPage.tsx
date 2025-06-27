import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface WalletPageProps {
  onClose: () => void;
  refreshBalance: () => void;
}

interface Transaction {
  id: number;
  type: string;
  amount: string;
  status: string;
  paymentMethod: string;
  description: string;
  createdAt: string;
}

interface User {
  id: number;
  username: string;
  walletBalance: string;
  bonusBalance: string;
  kycStatus: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const WalletPage = ({ onClose, refreshBalance }: WalletPageProps) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Fetch user data
  const { data: user, isLoading: userLoading } = useQuery<{ user: User }>({
    queryKey: ['/api/auth/profile'],
  });

  // Fetch transaction history
  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/wallet/transactions'],
  });

  // Create deposit order mutation
  const createDepositMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest('POST', '/api/wallet/create-deposit-order', { amount });
      return response;
    },
    onSuccess: (data) => {
      handleRazorpayPayment(data);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create deposit order',
        variant: 'destructive',
      });
    },
  });

  // Process withdrawal mutation
  const withdrawMutation = useMutation({
    mutationFn: async (data: { amount: number; upiId?: string }) => {
      return await apiRequest('POST', '/api/wallet/withdraw', data);
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: data.message,
      });
      setWithdrawAmount('');
      setUpiId('');
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/profile'] });
      refreshBalance();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Withdrawal failed',
        variant: 'destructive',
      });
    },
  });

  const handleRazorpayPayment = (orderData: any) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Perfect91Club',
      description: 'Wallet Deposit',
      order_id: orderData.id,
      handler: async (response: any) => {
        try {
          const verification = await apiRequest('POST', '/api/wallet/verify-deposit', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verification.success) {
            toast({
              title: 'Success',
              description: verification.message,
            });
            setDepositAmount('');
            queryClient.invalidateQueries({ queryKey: ['/api/wallet/transactions'] });
            queryClient.invalidateQueries({ queryKey: ['/api/auth/profile'] });
            refreshBalance();
          } else {
            throw new Error(verification.message);
          }
        } catch (error: any) {
          toast({
            title: 'Payment Verification Failed',
            description: error.message || 'Please contact support',
            variant: 'destructive',
          });
        }
      },
      prefill: {
        name: user?.user.username,
      },
      theme: {
        color: '#1e40af',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleDeposit = () => {
    const amount = parseInt(depositAmount);
    if (!amount || amount < 100) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum deposit amount is ₹100',
        variant: 'destructive',
      });
      return;
    }

    createDepositMutation.mutate(amount);
  };

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    if (!amount || amount < 100) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum withdrawal amount is ₹100',
        variant: 'destructive',
      });
      return;
    }

    if (!upiId) {
      toast({
        title: 'UPI ID Required',
        description: 'Please enter your UPI ID for withdrawal',
        variant: 'destructive',
      });
      return;
    }

    withdrawMutation.mutate({ amount, upiId });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="wallet-page">
      <div className="wallet-header">
        <button onClick={onClose} className="close-btn">×</button>
        <h2>💰 Wallet</h2>
      </div>

      {/* Balance Display */}
      <div className="balance-section">
        <div className="balance-card main-balance">
          <div className="balance-label">Main Balance</div>
          <div className="balance-amount">
            ₹{userLoading ? '---' : user?.user?.walletBalance || '0.00'}
          </div>
        </div>
        <div className="balance-card bonus-balance">
          <div className="balance-label">Bonus Balance</div>
          <div className="balance-amount">
            ₹{userLoading ? '---' : user?.user?.bonusBalance || '0.00'}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'deposit' ? 'active' : ''}`}
          onClick={() => setActiveTab('deposit')}
        >
          💳 Deposit
        </button>
        <button 
          className={`tab-btn ${activeTab === 'withdraw' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdraw')}
        >
          💸 Withdraw
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📊 History
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'deposit' && (
          <div className="deposit-section">
            <h3>💳 Deposit Money</h3>
            <p className="section-desc">Add money to your wallet using UPI, Cards, or Net Banking</p>
            
            <div className="quick-amounts">
              {[500, 1000, 2000, 5000].map(amount => (
                <button
                  key={amount}
                  className="quick-amount-btn"
                  onClick={() => setDepositAmount(amount.toString())}
                >
                  ₹{amount}
                </button>
              ))}
            </div>

            <div className="input-group">
              <label>Enter Amount</label>
              <input
                type="number"
                placeholder="Minimum ₹100"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="amount-input"
              />
            </div>

            <button 
              onClick={handleDeposit}
              disabled={createDepositMutation.isPending}
              className="deposit-btn"
            >
              {createDepositMutation.isPending ? 'Processing...' : 'Deposit Now'}
            </button>

            <div className="payment-methods">
              <h4>Accepted Payment Methods</h4>
              <div className="methods-grid">
                <div className="method">🏦 UPI</div>
                <div className="method">💳 Cards</div>
                <div className="method">🏛️ Net Banking</div>
                <div className="method">📱 Wallets</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div className="withdraw-section">
            <h3>💸 Withdraw Money</h3>
            <p className="section-desc">Withdraw money directly to your UPI ID</p>

            {user?.user?.kycStatus !== 'verified' && (
              <div className="kyc-warning">
                ⚠️ KYC verification required for withdrawals
              </div>
            )}

            <div className="input-group">
              <label>Withdrawal Amount</label>
              <input
                type="number"
                placeholder="Minimum ₹100"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="amount-input"
              />
            </div>

            <div className="input-group">
              <label>UPI ID</label>
              <input
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="upi-input"
              />
            </div>

            <button 
              onClick={handleWithdraw}
              disabled={withdrawMutation.isPending || user?.user?.kycStatus !== 'verified'}
              className="withdraw-btn"
            >
              {withdrawMutation.isPending ? 'Processing...' : 'Withdraw Now'}
            </button>

            <div className="withdraw-info">
              <h4>Withdrawal Information</h4>
              <ul>
                <li>• Minimum withdrawal: ₹100</li>
                <li>• Processing time: 5-10 minutes</li>
                <li>• No withdrawal charges</li>
                <li>• UPI transfers are instant</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <h3>📊 Transaction History</h3>
            
            {transactionsLoading ? (
              <div className="loading">Loading transactions...</div>
            ) : transactions && transactions.length > 0 ? (
              <div className="transactions-list">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-icon">
                      {transaction.type === 'deposit' ? '💳' : '💸'}
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-desc">{transaction.description}</div>
                      <div className="transaction-date">{formatDate(transaction.createdAt)}</div>
                    </div>
                    <div className="transaction-amount">
                      <span className={transaction.type === 'deposit' ? 'positive' : 'negative'}>
                        {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount}
                      </span>
                      <span className={`status ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-transactions">
                <div className="empty-icon">📋</div>
                <p>No transactions yet</p>
                <p>Start by making your first deposit!</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .wallet-page {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: white;
          padding: 20px;
          position: relative;
        }

        .wallet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 0 10px;
        }

        .wallet-header h2 {
          font-size: 28px;
          font-weight: bold;
          margin: 0;
        }

        .close-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          font-size: 24px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .balance-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .balance-card {
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
          padding: 20px;
          text-align: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .balance-label {
          font-size: 14px;
          opacity: 0.8;
          margin-bottom: 10px;
        }

        .balance-amount {
          font-size: 24px;
          font-weight: bold;
        }

        .tab-navigation {
          display: flex;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 5px;
          margin-bottom: 30px;
        }

        .tab-btn {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .tab-btn.active {
          background: rgba(255,255,255,0.2);
        }

        .tab-content {
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
          padding: 25px;
          backdrop-filter: blur(10px);
        }

        .section-desc {
          opacity: 0.8;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .quick-amounts {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        .quick-amount-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .quick-amount-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .amount-input, .upi-input {
          width: 100%;
          padding: 15px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 16px;
        }

        .amount-input::placeholder, .upi-input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .deposit-btn, .withdraw-btn {
          width: 100%;
          background: linear-gradient(45deg, #4CAF50, #45a049);
          border: none;
          color: white;
          padding: 15px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-bottom: 20px;
        }

        .withdraw-btn {
          background: linear-gradient(45deg, #ff6b6b, #ee5a52);
        }

        .deposit-btn:disabled, .withdraw-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .payment-methods, .withdraw-info {
          margin-top: 20px;
        }

        .payment-methods h4, .withdraw-info h4 {
          margin-bottom: 15px;
          font-size: 16px;
        }

        .methods-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .method {
          background: rgba(255,255,255,0.1);
          padding: 10px;
          border-radius: 8px;
          text-align: center;
          font-size: 14px;
        }

        .withdraw-info ul {
          list-style: none;
          padding: 0;
        }

        .withdraw-info li {
          padding: 5px 0;
          font-size: 14px;
          opacity: 0.8;
        }

        .kyc-warning {
          background: rgba(255, 165, 0, 0.2);
          border: 1px solid rgba(255, 165, 0, 0.5);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
          text-align: center;
          font-size: 14px;
        }

        .transactions-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .transaction-item {
          display: flex;
          align-items: center;
          padding: 15px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          margin-bottom: 10px;
        }

        .transaction-icon {
          font-size: 24px;
          margin-right: 15px;
        }

        .transaction-details {
          flex: 1;
        }

        .transaction-desc {
          font-weight: 500;
          margin-bottom: 5px;
        }

        .transaction-date {
          font-size: 12px;
          opacity: 0.7;
        }

        .transaction-amount {
          text-align: right;
        }

        .positive {
          color: #4CAF50;
        }

        .negative {
          color: #ff6b6b;
        }

        .status {
          display: block;
          font-size: 11px;
          margin-top: 3px;
          text-transform: uppercase;
        }

        .no-transactions {
          text-align: center;
          padding: 40px 20px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .loading {
          text-align: center;
          padding: 40px;
        }
      `}</style>
    </div>
  );
};