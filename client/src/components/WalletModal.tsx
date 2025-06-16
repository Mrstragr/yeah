import { useState } from 'react';
import { X, CreditCard, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

interface WalletModalProps {
  onClose: () => void;
  balance: number;
  onBalanceUpdate: (newBalance: number) => void;
}

export const WalletModal = ({ onClose, balance, onBalanceUpdate }: WalletModalProps) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) < 100) return;
    
    setIsProcessing(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          method: paymentMethod,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        onBalanceUpdate(Number(balance || 0) + parseFloat(amount));
        setAmount('');
        alert('Deposit successful!');
      }
    } catch (error) {
      console.error('Deposit error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    const currentBalance = Number(balance || 0);
    if (!amount || parseFloat(amount) < 500 || parseFloat(amount) > currentBalance) return;
    
    setIsProcessing(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          method: paymentMethod,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        onBalanceUpdate(Number(balance || 0) - parseFloat(amount));
        setAmount('');
        alert('Withdrawal request submitted!');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const recentTransactions = [
    { id: 1, type: 'deposit', amount: 1000, status: 'completed', time: '2 hours ago' },
    { id: 2, type: 'withdraw', amount: 500, status: 'pending', time: '5 hours ago' },
    { id: 3, type: 'game_win', amount: 750, status: 'completed', time: '1 day ago' },
    { id: 4, type: 'deposit', amount: 2000, status: 'completed', time: '2 days ago' },
  ];

  return (
    <div className="modal-overlay">
      <div className="wallet-modal">
        <div className="modal-header">
          <h2>Wallet</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="wallet-balance">
          <div className="balance-card">
            <div className="balance-label">Available Balance</div>
            <div className="balance-amount">₹{Number(balance || 0).toFixed(2)}</div>
          </div>
        </div>

        <div className="wallet-tabs">
          <button 
            className={`tab ${activeTab === 'deposit' ? 'active' : ''}`}
            onClick={() => setActiveTab('deposit')}
          >
            <ArrowUpRight size={16} />
            Deposit
          </button>
          <button 
            className={`tab ${activeTab === 'withdraw' ? 'active' : ''}`}
            onClick={() => setActiveTab('withdraw')}
          >
            <ArrowDownLeft size={16} />
            Withdraw
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Clock size={16} />
            History
          </button>
        </div>

        <div className="wallet-content">
          {activeTab === 'deposit' && (
            <div className="deposit-section">
              <div className="amount-input">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="100"
                />
              </div>

              <div className="quick-amounts">
                {quickAmounts.map(amt => (
                  <button
                    key={amt}
                    className={`quick-amount ${amount === amt.toString() ? 'active' : ''}`}
                    onClick={() => setAmount(amt.toString())}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              <div className="payment-methods">
                <label>Payment Method</label>
                <div className="method-options">
                  <button
                    className={`method ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    UPI
                  </button>
                  <button
                    className={`method ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard size={16} />
                    Card
                  </button>
                </div>
              </div>

              <button
                className="action-btn deposit"
                onClick={handleDeposit}
                disabled={isProcessing || !amount || parseFloat(amount) < 100}
              >
                {isProcessing ? 'Processing...' : `Deposit ₹${amount || '0'}`}
              </button>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div className="withdraw-section">
              <div className="amount-input">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="500"
                  max={Number(balance || 0)}
                />
              </div>

              <div className="withdraw-limits">
                <div className="limit-info">
                  <span>Min: ₹500</span>
                  <span>Max: ₹{Number(balance || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="payment-methods">
                <label>Withdrawal Method</label>
                <div className="method-options">
                  <button
                    className={`method ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    UPI
                  </button>
                  <button
                    className={`method ${paymentMethod === 'bank' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('bank')}
                  >
                    Bank Transfer
                  </button>
                </div>
              </div>

              <button
                className="action-btn withdraw"
                onClick={handleWithdraw}
                disabled={isProcessing || !amount || parseFloat(amount) < 500 || parseFloat(amount) > Number(balance || 0)}
              >
                {isProcessing ? 'Processing...' : `Withdraw ₹${amount || '0'}`}
              </button>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-section">
              <div className="transaction-list">
                {recentTransactions.map(tx => (
                  <div key={tx.id} className="transaction-item">
                    <div className="tx-icon">
                      {tx.type === 'deposit' && <ArrowUpRight className="deposit-icon" />}
                      {tx.type === 'withdraw' && <ArrowDownLeft className="withdraw-icon" />}
                      {tx.type === 'game_win' && <span className="win-icon">🎯</span>}
                    </div>
                    <div className="tx-details">
                      <div className="tx-type">
                        {tx.type === 'deposit' && 'Deposit'}
                        {tx.type === 'withdraw' && 'Withdrawal'}
                        {tx.type === 'game_win' && 'Game Win'}
                      </div>
                      <div className="tx-time">{tx.time}</div>
                    </div>
                    <div className="tx-amount">
                      <span className={`amount ${tx.type === 'withdraw' ? 'negative' : 'positive'}`}>
                        {tx.type === 'withdraw' ? '-' : '+'}₹{tx.amount}
                      </span>
                      <div className={`status ${tx.status}`}>
                        {tx.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};