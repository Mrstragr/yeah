import { useState } from 'react';

interface WalletPageProps {
  balance: number;
  onClose: () => void;
}

export const WalletPage = ({ balance, onClose }: WalletPageProps) => {
  const [activeTab, setActiveTab] = useState('recharge');
  const [amount, setAmount] = useState(100);

  const rechargeAmounts = [100, 500, 1000, 2000, 5000, 10000];
  const withdrawAmounts = [100, 500, 1000, 2000, 5000];

  const transactions = [
    { id: 1, type: 'deposit', amount: 1000, status: 'success', time: '2025-06-19 14:30', method: 'UPI' },
    { id: 2, type: 'withdraw', amount: 500, status: 'pending', time: '2025-06-19 13:15', method: 'Bank' },
    { id: 3, type: 'win', amount: 250, status: 'success', time: '2025-06-19 12:45', method: 'WinGo' },
    { id: 4, type: 'deposit', amount: 2000, status: 'success', time: '2025-06-19 11:20', method: 'PhonePe' },
    { id: 5, type: 'bet', amount: -100, status: 'success', time: '2025-06-19 10:30', method: 'Aviator' }
  ];

  return (
    <div className="wallet-page">
      <div className="wallet-header">
        <button onClick={onClose} className="back-btn">←</button>
        <h2>Wallet</h2>
        <div></div>
      </div>

      <div className="balance-card">
        <div className="balance-info">
          <div className="balance-label">Total Balance</div>
          <div className="balance-amount">₹{balance.toFixed(2)}</div>
        </div>
        <div className="balance-actions">
          <button className="quick-action">
            <span>📊</span>
            <span>Statistics</span>
          </button>
          <button className="quick-action">
            <span>🎁</span>
            <span>Bonus</span>
          </button>
        </div>
      </div>

      <div className="wallet-tabs">
        <button 
          className={`wallet-tab ${activeTab === 'recharge' ? 'active' : ''}`}
          onClick={() => setActiveTab('recharge')}
        >
          Recharge
        </button>
        <button 
          className={`wallet-tab ${activeTab === 'withdraw' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdraw')}
        >
          Withdraw
        </button>
        <button 
          className={`wallet-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      <div className="wallet-content">
        {activeTab === 'recharge' && (
          <div className="recharge-section">
            <div className="amount-selection">
              <h3>Select Amount</h3>
              <div className="amount-grid">
                {rechargeAmounts.map(amt => (
                  <button 
                    key={amt}
                    className={`amount-btn ${amount === amt ? 'selected' : ''}`}
                    onClick={() => setAmount(amt)}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <div className="custom-amount">
                <input 
                  type="number" 
                  placeholder="Enter custom amount"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="payment-methods">
              <h3>Payment Methods</h3>
              <div className="method-list">
                <div className="payment-method">
                  <span className="method-icon">📱</span>
                  <span className="method-name">UPI</span>
                  <span className="method-bonus">+2% Bonus</span>
                </div>
                <div className="payment-method">
                  <span className="method-icon">💳</span>
                  <span className="method-name">Bank Card</span>
                  <span className="method-bonus">+1% Bonus</span>
                </div>
                <div className="payment-method">
                  <span className="method-icon">📲</span>
                  <span className="method-name">PhonePe</span>
                  <span className="method-bonus">+3% Bonus</span>
                </div>
              </div>
            </div>

            <button className="action-btn recharge-btn">
              Recharge ₹{amount}
            </button>
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div className="withdraw-section">
            <div className="withdraw-info">
              <div className="info-card">
                <span>💰</span>
                <div>
                  <div>Available</div>
                  <div>₹{balance.toFixed(2)}</div>
                </div>
              </div>
              <div className="info-card">
                <span>⏰</span>
                <div>
                  <div>Processing Time</div>
                  <div>5-30 minutes</div>
                </div>
              </div>
            </div>

            <div className="amount-selection">
              <h3>Withdraw Amount</h3>
              <div className="amount-grid">
                {withdrawAmounts.map(amt => (
                  <button 
                    key={amt}
                    className={`amount-btn ${amount === amt ? 'selected' : ''}`}
                    onClick={() => setAmount(amt)}
                    disabled={amt > balance}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <div className="custom-amount">
                <input 
                  type="number" 
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  max={balance}
                />
              </div>
            </div>

            <div className="bank-details">
              <h3>Bank Details</h3>
              <div className="form-group">
                <input type="text" placeholder="Account Number" />
              </div>
              <div className="form-group">
                <input type="text" placeholder="IFSC Code" />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Account Holder Name" />
              </div>
            </div>

            <button className="action-btn withdraw-btn">
              Withdraw ₹{amount}
            </button>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <div className="transaction-list">
              {transactions.map(txn => (
                <div key={txn.id} className="transaction-item">
                  <div className="txn-icon">
                    {txn.type === 'deposit' && '💰'}
                    {txn.type === 'withdraw' && '📤'}
                    {txn.type === 'win' && '🎉'}
                    {txn.type === 'bet' && '🎮'}
                  </div>
                  <div className="txn-details">
                    <div className="txn-title">
                      {txn.type === 'deposit' && 'Deposit'}
                      {txn.type === 'withdraw' && 'Withdrawal'}
                      {txn.type === 'win' && 'Game Win'}
                      {txn.type === 'bet' && 'Game Bet'}
                    </div>
                    <div className="txn-method">{txn.method}</div>
                    <div className="txn-time">{txn.time}</div>
                  </div>
                  <div className="txn-amount">
                    <div className={`amount ${txn.amount > 0 ? 'positive' : 'negative'}`}>
                      {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount)}
                    </div>
                    <div className={`status ${txn.status}`}>
                      {txn.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .wallet-page {
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .wallet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: rgba(255,255,255,0.05);
        }

        .back-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }

        .wallet-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .balance-card {
          background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
          margin: 20px;
          border-radius: 15px;
          padding: 25px;
        }

        .balance-info {
          text-align: center;
          margin-bottom: 20px;
        }

        .balance-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 8px;
        }

        .balance-amount {
          font-size: 32px;
          font-weight: bold;
        }

        .balance-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .quick-action {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          padding: 12px 20px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 12px;
        }

        .wallet-tabs {
          display: flex;
          padding: 0 20px;
          margin-bottom: 20px;
        }

        .wallet-tab {
          flex: 1;
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          padding: 12px;
          border-radius: 8px;
          margin: 0 5px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .wallet-tab.active {
          background: #FF6B6B;
        }

        .wallet-content {
          padding: 0 20px;
        }

        .amount-selection h3, .payment-methods h3, .bank-details h3 {
          margin: 0 0 15px 0;
          font-size: 18px;
        }

        .amount-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 15px;
        }

        .amount-btn {
          background: rgba(255,255,255,0.1);
          border: 2px solid transparent;
          color: white;
          padding: 15px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .amount-btn.selected {
          border-color: #4CAF50;
          background: rgba(76,175,80,0.2);
        }

        .amount-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .custom-amount {
          margin-bottom: 20px;
        }

        .custom-amount input {
          width: 100%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 15px;
          border-radius: 10px;
          font-size: 16px;
        }

        .custom-amount input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .method-list {
          margin-bottom: 30px;
        }

        .payment-method {
          background: rgba(255,255,255,0.05);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 15px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .payment-method:hover {
          background: rgba(255,255,255,0.1);
        }

        .method-icon {
          font-size: 24px;
        }

        .method-name {
          flex: 1;
          font-weight: bold;
        }

        .method-bonus {
          color: #4CAF50;
          font-size: 12px;
        }

        .action-btn {
          width: 100%;
          padding: 18px;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .recharge-btn {
          background: linear-gradient(45deg, #4CAF50, #45a049);
          color: white;
        }

        .withdraw-btn {
          background: linear-gradient(45deg, #FF6B6B, #ff5252);
          color: white;
        }

        .withdraw-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 25px;
        }

        .info-card {
          background: rgba(255,255,255,0.05);
          padding: 15px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .info-card span {
          font-size: 24px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group input {
          width: 100%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 15px;
          border-radius: 10px;
          font-size: 16px;
        }

        .form-group input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .transaction-item {
          background: rgba(255,255,255,0.05);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .txn-icon {
          font-size: 24px;
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .txn-details {
          flex: 1;
        }

        .txn-title {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .txn-method {
          font-size: 12px;
          opacity: 0.8;
          margin-bottom: 2px;
        }

        .txn-time {
          font-size: 11px;
          opacity: 0.6;
        }

        .txn-amount {
          text-align: right;
        }

        .amount.positive {
          color: #4CAF50;
        }

        .amount.negative {
          color: #FF6B6B;
        }

        .status {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 10px;
          margin-top: 4px;
        }

        .status.success {
          background: #4CAF50;
          color: white;
        }

        .status.pending {
          background: #FF9800;
          color: white;
        }

        .status.failed {
          background: #f44336;
          color: white;
        }
      `}</style>
    </div>
  );
};