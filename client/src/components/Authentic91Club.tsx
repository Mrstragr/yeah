import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LiveStats } from './LiveStats';

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
}

interface GameModalProps {
  game: string;
  onClose: () => void;
  refreshBalance: () => void;
}

const WinGoGame = ({ onClose, refreshBalance }: GameModalProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentPeriod, setCurrentPeriod] = useState('20250619001');
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [recentResults, setRecentResults] = useState([3, 7, 1, 9, 5]);
  const [betHistory, setBetHistory] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 5 && prev > 0) {
          setIsCountingDown(true);
        } else if (prev === 0) {
          setIsCountingDown(false);
          // Simulate new period
          const newPeriodNum = parseInt(currentPeriod.slice(-3)) + 1;
          setCurrentPeriod(`20250619${String(newPeriodNum).padStart(3, '0')}`);
          return 30;
        } else {
          setIsCountingDown(false);
        }
        return prev > 0 ? prev - 1 : 30;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentPeriod]);

  const placeBet = async () => {
    if (!selectedColor && selectedNumber === null && !selectedSize) {
      alert('Please select a color, number, or size');
      return;
    }

    if (timeLeft < 5) {
      alert('Betting closed! Please wait for next round.');
      return;
    }

    setIsPlaying(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/games/wingo/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          betAmount,
          betType: selectedColor ? 'color' : selectedSize ? 'size' : 'number',
          betValue: selectedColor || selectedSize || selectedNumber
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        refreshBalance();
        
        setTimeout(() => {
          setResult(null);
          setSelectedColor(null);
          setSelectedNumber(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Game error:', error);
    }
    setIsPlaying(false);
  };

  return (
    <div className="wingo-game">
      <div className="game-header">
        <div className="header-left">
          <h2>Win Go 1 Min</h2>
          <button onClick={() => setShowRules(!showRules)} className="rules-btn">📋</button>
        </div>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      {showRules && (
        <div className="rules-panel">
          <h3>Game Rules</h3>
          <ul>
            <li>Green: 1,3,7,9 pays 1:2</li>
            <li>Red: 2,4,6,8 pays 1:2</li>
            <li>Violet: 0,5 pays 1:4.5</li>
            <li>Big: 5,6,7,8,9 pays 1:2</li>
            <li>Small: 0,1,2,3,4 pays 1:2</li>
            <li>Number: Direct hit pays 1:9</li>
          </ul>
          <p>Betting closes 5 seconds before result.</p>
        </div>
      )}

      <div className="game-info">
        <div className="period-info">
          <div className="period-details">
            <span>Period</span>
            <span className="period-number">{currentPeriod}</span>
          </div>
          <div className="countdown">
            <span>Count Down</span>
            <span className={`time-left ${isCountingDown ? 'countdown-warning' : ''}`}>
              {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>
        </div>
        
        <div className="recent-results">
          <span className="results-label">Recent Results:</span>
          <div className="results-numbers">
            {recentResults.map((num, idx) => (
              <div key={idx} className={`result-number ${num === 0 || num === 5 ? 'violet-red' : num % 2 === 0 ? 'red' : 'green'}`}>
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="game-board">
        <div className="color-section">
          <div className="color-options">
            <button 
              className={`color-btn green ${selectedColor === 'green' ? 'selected' : ''}`}
              onClick={() => setSelectedColor('green')}
            >
              <span>Green</span>
              <span>1:2</span>
            </button>
            <button 
              className={`color-btn red ${selectedColor === 'red' ? 'selected' : ''}`}
              onClick={() => setSelectedColor('red')}
            >
              <span>Red</span>
              <span>1:2</span>
            </button>
            <button 
              className={`color-btn violet ${selectedColor === 'violet' ? 'selected' : ''}`}
              onClick={() => setSelectedColor('violet')}
            >
              <span>Violet</span>
              <span>1:4.5</span>
            </button>
          </div>
        </div>

        <div className="number-section">
          <div className="number-grid">
            {[0,1,2,3,4,5,6,7,8,9].map(num => (
              <button
                key={num}
                className={`number-btn ${selectedNumber === num ? 'selected' : ''} ${
                  num === 0 || num === 5 ? 'violet-red' : 
                  num % 2 === 0 ? 'red' : 'green'
                }`}
                onClick={() => setSelectedNumber(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="size-section">
          <button 
            className={`size-btn big ${selectedSize === 'big' ? 'selected' : ''}`}
            onClick={() => setSelectedSize('big')}
          >
            <span>Big</span>
            <span>5,6,7,8,9</span>
            <span>1:2</span>
          </button>
          <button 
            className={`size-btn small ${selectedSize === 'small' ? 'selected' : ''}`}
            onClick={() => setSelectedSize('small')}
          >
            <span>Small</span>
            <span>0,1,2,3,4</span>
            <span>1:2</span>
          </button>
        </div>
      </div>

      <div className="bet-section">
        <div className="bet-amount">
          <label>Amount</label>
          <div className="amount-buttons">
            {[10, 100, 1000, 10000].map(amount => (
              <button 
                key={amount}
                className={`amount-btn ${betAmount === amount ? 'selected' : ''}`}
                onClick={() => setBetAmount(amount)}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        <button 
          className="confirm-btn"
          onClick={placeBet}
          disabled={isPlaying || (!selectedColor && selectedNumber === null)}
        >
          {isPlaying ? 'Playing...' : 'Confirm'}
        </button>
      </div>

      {/* Bet History */}
      <div className="bet-history">
        <h3>My History</h3>
        <div className="history-list">
          {betHistory.length === 0 ? (
            <div className="no-history">No betting history</div>
          ) : (
            betHistory.map((bet, idx) => (
              <div key={idx} className="history-item">
                <div className="history-period">{bet.period}</div>
                <div className="history-bet">Bet: {bet.bet}</div>
                <div className="history-amount">₹{bet.amount}</div>
                <div className={`history-result ${bet.win ? 'win' : 'lose'}`}>
                  Result: {bet.result} | {bet.win ? `+₹${bet.winAmount}` : `-₹${bet.amount}`}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {result && (
        <div className="result-popup">
          <div className={`result-card ${result.isWin ? 'win' : 'lose'}`}>
            <div className="result-icon">
              {result.isWin ? '🎉' : '😔'}
            </div>
            <h3>{result.isWin ? 'Congratulations!' : 'Better luck next time'}</h3>
            <div className="result-details">
              <p>Period: {currentPeriod}</p>
              <p>Result: <span className={`result-num ${result.result.number === 0 || result.result.number === 5 ? 'violet-red' : result.result.number % 2 === 0 ? 'red' : 'green'}`}>{result.result.number}</span></p>
              <p>Your bet: {selectedColor || selectedSize || selectedNumber}</p>
              {result.isWin ? (
                <p className="win-amount">You won: ₹{result.winAmount}</p>
              ) : (
                <p className="lose-amount">You lost: ₹{betAmount}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .wingo-game {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          padding: 20px;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rules-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          font-size: 16px;
          padding: 5px 8px;
          border-radius: 5px;
          cursor: pointer;
        }

        .rules-panel {
          background: rgba(0,0,0,0.9);
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .rules-panel h3 {
          margin: 0 0 15px 0;
          color: #FFD700;
        }

        .rules-panel ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .rules-panel li {
          margin-bottom: 5px;
        }

        .close-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          font-size: 24px;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
        }

        .game-info {
          background: rgba(255,255,255,0.1);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .period-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .period-details, .countdown {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .period-number {
          font-size: 14px;
          font-weight: bold;
          color: #FFD700;
        }

        .recent-results {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .results-label {
          font-size: 12px;
          opacity: 0.9;
        }

        .results-numbers {
          display: flex;
          gap: 5px;
        }

        .result-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          color: white;
        }

        .result-number.green { background: #4CAF50; }
        .result-number.red { background: #f44336; }
        .result-number.violet-red { 
          background: linear-gradient(45deg, #9C27B0 50%, #f44336 50%);
        }

        .time-left {
          font-size: 18px;
          font-weight: bold;
          background: #ff4444;
          padding: 5px 10px;
          border-radius: 5px;
          transition: all 0.3s;
        }

        .countdown-warning {
          background: #ff0000 !important;
          animation: pulse 1s infinite;
          color: white;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .color-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        .color-btn {
          padding: 15px;
          border: none;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-weight: bold;
          transition: transform 0.2s;
        }

        .color-btn:hover, .color-btn.selected {
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(255,255,255,0.5);
        }

        .green { background: #4CAF50; }
        .red { background: #f44336; }
        .violet { background: #9C27B0; }

        .number-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin: 20px 0;
        }

        .number-btn {
          aspect-ratio: 1;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: bold;
          font-size: 18px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .number-btn:hover, .number-btn.selected {
          transform: scale(1.1);
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
        }

        .number-btn.green { background: #4CAF50; }
        .number-btn.red { background: #f44336; }
        .number-btn.violet-red { 
          background: linear-gradient(45deg, #9C27B0 50%, #f44336 50%);
        }

        .size-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin: 20px 0;
        }

        .size-btn {
          padding: 15px;
          border: 2px solid white;
          background: rgba(255,255,255,0.1);
          color: white;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .size-btn span:first-child {
          font-size: 16px;
        }

        .size-btn span:nth-child(2) {
          font-size: 10px;
          opacity: 0.8;
        }

        .size-btn span:last-child {
          font-size: 12px;
          color: #FFD700;
        }

        .size-btn.selected {
          border-color: #FFD700;
          background: rgba(255,215,0,0.2);
          transform: scale(1.02);
        }

        .bet-section {
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 10px;
        }

        .amount-buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin: 10px 0;
        }

        .amount-btn {
          padding: 10px;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }

        .amount-btn.selected {
          background: #FFD700;
          color: #333;
        }

        .confirm-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          border: none;
          border-radius: 10px;
          font-size: 18px;
          font-weight: bold;
          color: #333;
          cursor: pointer;
          margin-top: 15px;
        }

        .confirm-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .confirm-btn.disabled {
          background: #666;
          color: #ccc;
        }

        .result-popup {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .result-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          text-align: center;
          max-width: 300px;
        }

        .result-card.win {
          border: 3px solid #4CAF50;
          color: #4CAF50;
        }

        .result-card.lose {
          border: 3px solid #f44336;
          color: #f44336;
        }

        .bet-history {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 15px;
          margin: 20px 0;
        }

        .bet-history h3 {
          margin: 0 0 15px 0;
          font-size: 16px;
        }

        .no-history {
          text-align: center;
          opacity: 0.7;
          padding: 20px;
        }

        .history-item {
          background: rgba(255,255,255,0.05);
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 8px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          font-size: 12px;
        }

        .history-period {
          font-weight: bold;
          color: #FFD700;
        }

        .history-result.win {
          color: #4CAF50;
        }

        .history-result.lose {
          color: #f44336;
        }

        .result-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .result-details {
          text-align: left;
        }

        .result-num {
          font-weight: bold;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .result-num.green { background: #4CAF50; color: white; }
        .result-num.red { background: #f44336; color: white; }
        .result-num.violet-red { 
          background: linear-gradient(45deg, #9C27B0 50%, #f44336 50%);
          color: white;
        }

        .win-amount {
          color: #4CAF50;
          font-weight: bold;
          font-size: 18px;
        }

        .lose-amount {
          color: #f44336;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

const LoginModal = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        alert('Login failed');
      }
    } catch (error) {
      alert('Network error');
    }

    setIsLoading(false);
  };

  return (
    <div className="login-modal">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <span className="logo-number">91</span>
            <span className="logo-text">CLUB</span>
          </div>
          <h2>Welcome Back</h2>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="login-btn">
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>

          <button 
            type="button" 
            onClick={() => { setPhone('9876543210'); setPassword('demo123'); }}
            className="demo-btn"
          >
            Use Demo Account
          </button>
        </form>
      </div>

      <style>{`
        .login-modal {
          position: fixed;
          inset: 0;
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .login-container {
          background: white;
          border-radius: 20px;
          padding: 40px 30px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .logo-number {
          background: #ff6b6b;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
        }

        .logo-text {
          font-weight: bold;
          font-size: 24px;
          color: #333;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group input {
          width: 100%;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s;
        }

        .input-group input:focus {
          border-color: #ff6b6b;
        }

        .login-btn, .demo-btn {
          padding: 15px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }

        .login-btn {
          background: #ff6b6b;
          color: white;
        }

        .login-btn:hover {
          background: #ff5252;
        }

        .demo-btn {
          background: #f0f0f0;
          color: #666;
        }

        .demo-btn:hover {
          background: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export const Authentic91Club = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('lobby');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [notifications, setNotifications] = useState([
    'User***123 won ₹15,430 in WinGo!',
    'Lucky***789 hit 25.66x in Aviator!',
    'Player***456 found treasure in Mines!'
  ]);
  const [currentNotification, setCurrentNotification] = useState(0);

  const { data: balanceData } = useQuery({
    queryKey: ['/api/wallet/balance'],
    enabled: !!user,
    refetchInterval: 30000,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (balanceData) {
      setWalletBalance(parseFloat(balanceData.walletBalance || '0'));
    }
  }, [balanceData]);

  useEffect(() => {
    const notificationTimer = setInterval(() => {
      setCurrentNotification(prev => (prev + 1) % notifications.length);
    }, 4000);
    return () => clearInterval(notificationTimer);
  }, [notifications]);

  const refreshBalance = () => {
    window.location.reload();
  };

  if (!user) {
    return <LoginModal onLogin={setUser} />;
  }

  return (
    <div className="authentic-91club">
      {/* Exact Header from Reference */}
      <div className="header">
        <div className="header-content">
          <div className="top-bar">
            <div className="logo">
              <div className="logo-circle">91</div>
              <span>CLUB</span>
            </div>
            <div className="header-actions">
              <button onClick={() => setShowStats(true)} className="stats-btn">📊</button>
              <div className="notification">🔔</div>
            </div>
          </div>

          {/* Live Notification Banner */}
          <div className="live-notification">
            <span className="live-indicator">🔴 LIVE</span>
            <div className="notification-text">
              {notifications[currentNotification]}
            </div>
          </div>

          {/* Attendance Banner - Exact Design */}
          <div className="attendance-banner">
            <div className="banner-image"></div>
            <div className="banner-content">
              <div className="banner-text">
                <div className="banner-title">SPECIAL ATTENDANCE BONUS</div>
                <div className="banner-subtitle">PROVIDED BY 91CLUB</div>
                <div className="banner-amount">up to 558RS</div>
              </div>
              <button className="claim-btn">CLAIM IT RIGHT AWAY</button>
            </div>
          </div>

          {/* Wallet */}
          <div className="wallet">
            <div className="wallet-header">
              <span>💰 Wallet balance</span>
              <span>↻</span>
            </div>
            <div className="wallet-content">
              <span className="balance">₹{walletBalance.toFixed(2)}</span>
              <div className="wallet-buttons">
                <button className="withdraw-btn">Withdraw</button>
                <button className="deposit-btn">Deposit</button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <div className="quick-card wheel">
              <span className="wheel-icon">🎡</span>
              <div>
                <div>Wheel</div>
                <div>of fortune</div>
              </div>
            </div>
            <div className="quick-card vip">
              <span className="vip-icon">👑</span>
              <div>
                <div>VIP</div>
                <div>privileges</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="navigation">
        <button 
          className={`nav-btn ${activeTab === 'lobby' ? 'active' : ''}`}
          onClick={() => setActiveTab('lobby')}
        >
          <span>🏠</span>
          <span>Lobby</span>
        </button>
        <button 
          className={`nav-btn ${activeTab === 'mini' ? 'active' : ''}`}
          onClick={() => setActiveTab('mini')}
        >
          <span>🎮</span>
          <span>Mini game</span>
        </button>
        <button 
          className={`nav-btn ${activeTab === 'slots' ? 'active' : ''}`}
          onClick={() => setActiveTab('slots')}
        >
          <span>🎰</span>
          <span>Slots</span>
        </button>
        <button 
          className={`nav-btn ${activeTab === 'card' ? 'active' : ''}`}
          onClick={() => setActiveTab('card')}
        >
          <span>🃏</span>
          <span>Card</span>
        </button>
        <button 
          className={`nav-btn ${activeTab === 'fishing' ? 'active' : ''}`}
          onClick={() => setActiveTab('fishing')}
        >
          <span>🎣</span>
          <span>Fishing</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'lobby' && (
          <div className="lobby">
            <div className="section-header">
              <div className="section-icon">8</div>
              <span>Lottery</span>
            </div>
            <div className="section-desc">
              The games are independently developed by our team, fun, fair, and safe
            </div>
            
            <div className="lottery-games">
              <div className="game-card wingo" onClick={() => setSelectedGame('wingo')}>
                <div className="game-decoration">
                  <div className="sparkle">✨</div>
                  <div className="sparkle">⭐</div>
                </div>
                <div className="game-number">7</div>
                <div className="game-name">WIN GO</div>
                <div className="game-timing">1 Min</div>
              </div>
              <div className="game-card k3" onClick={() => setSelectedGame('k3')}>
                <div className="game-decoration">
                  <div className="dice">🎲</div>
                </div>
                <div className="game-name">K3</div>
                <div className="game-timing">3 Min</div>
              </div>
              <div className="game-card fived" onClick={() => setSelectedGame('5d')}>
                <div className="game-decoration">
                  <div className="numbers">01234</div>
                </div>
                <div className="game-name">5D</div>
                <div className="game-timing">5 Min</div>
              </div>
              <div className="game-card trx" onClick={() => setSelectedGame('trx')}>
                <div className="game-decoration">
                  <div className="crypto">₿</div>
                </div>
                <div className="game-name">TRX WINGO</div>
                <div className="game-timing">1 Min</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="nav-item">
          <span>🎁</span>
          <span>Promotion</span>
        </div>
        <div className="nav-item">
          <span>📊</span>
          <span>Activity</span>
        </div>
        <div className="nav-item active">
          <span>🎮</span>
          <span>Main</span>
        </div>
        <div className="nav-item">
          <span>💰</span>
          <span>Wallet</span>
        </div>
        <div className="nav-item">
          <span>👤</span>
          <span>Account</span>
        </div>
      </div>

      {/* Game Modal */}
      {selectedGame && (
        <WinGoGame
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          refreshBalance={refreshBalance}
        />
      )}

      {/* Live Stats Modal */}
      {showStats && (
        <LiveStats onClose={() => setShowStats(false)} />
      )}

      <style>{`
        .authentic-91club {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f5f5f5;
          min-height: 100vh;
        }

        .header {
          background: linear-gradient(180deg, #ff6b6b 0%, #ff8e8e 100%);
          color: white;
          padding: 12px 16px;
        }

        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stats-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          font-size: 16px;
          padding: 6px 8px;
          border-radius: 6px;
          cursor: pointer;
        }

        .live-notification {
          background: rgba(0,0,0,0.4);
          padding: 8px 12px;
          border-radius: 8px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          overflow: hidden;
        }

        .live-indicator {
          font-size: 10px;
          background: #ff4444;
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: bold;
          white-space: nowrap;
        }

        .notification-text {
          font-size: 12px;
          animation: slideText 15s linear infinite;
          white-space: nowrap;
        }

        @keyframes slideText {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: bold;
        }

        .logo-circle {
          background: white;
          color: #ff6b6b;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
        }

        .attendance-banner {
          background: linear-gradient(135deg, #8B4513 0%, #CD853F 100%);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
        }

        .banner-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .banner-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 2px;
        }

        .banner-subtitle {
          font-size: 11px;
          opacity: 0.9;
          margin-bottom: 4px;
        }

        .banner-amount {
          font-size: 20px;
          font-weight: bold;
          color: #FFD700;
        }

        .claim-btn {
          background: #FF4444;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
        }

        .wallet {
          margin-bottom: 16px;
        }

        .wallet-header {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .wallet-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .balance {
          font-size: 20px;
          font-weight: bold;
        }

        .wallet-buttons {
          display: flex;
          gap: 8px;
        }

        .withdraw-btn, .deposit-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
        }

        .withdraw-btn {
          background: #FFA726;
          color: white;
        }

        .deposit-btn {
          background: #EF5350;
          color: white;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .quick-card {
          padding: 12px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 12px;
          font-weight: bold;
          color: white;
        }

        .wheel {
          background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
        }

        .vip {
          background: linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%);
        }

        .navigation {
          background: white;
          display: flex;
          padding: 0 16px;
          border-bottom: 1px solid #e0e0e0;
          overflow-x: auto;
        }

        .nav-btn {
          background: none;
          border: none;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 60px;
          cursor: pointer;
          color: #666;
          font-size: 11px;
          border-bottom: 2px solid transparent;
        }

        .nav-btn.active {
          color: #ff6b6b;
          border-bottom-color: #ff6b6b;
        }

        .main-content {
          background: white;
          padding: 16px;
          min-height: 60vh;
        }

        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .section-icon {
          background: #ff6b6b;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
          font-size: 12px;
          font-weight: bold;
        }

        .section-desc {
          color: #666;
          font-size: 11px;
          margin-bottom: 16px;
          line-height: 1.3;
        }

        .lottery-games {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .game-card {
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          color: white;
          cursor: pointer;
          min-height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          transition: transform 0.2s;
        }

        .game-card:hover {
          transform: scale(1.02);
        }

        .wingo {
          background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
        }

        .k3 {
          background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%);
        }

        .fived {
          background: linear-gradient(135deg, #27AE60 0%, #229954 100%);
        }

        .trx {
          background: linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%);
        }

        .game-number {
          background: rgba(255,255,255,0.2);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .game-decoration {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          gap: 4px;
        }

        .sparkle {
          font-size: 12px;
          animation: sparkle 2s infinite;
        }

        .dice, .crypto {
          font-size: 16px;
          opacity: 0.8;
        }

        .numbers {
          font-size: 10px;
          opacity: 0.7;
          font-weight: bold;
        }

        .game-name {
          font-size: 13px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .game-timing {
          font-size: 10px;
          opacity: 0.8;
          background: rgba(255,255,255,0.2);
          padding: 2px 6px;
          border-radius: 8px;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          display: flex;
          padding: 8px 0;
          border-top: 1px solid #e0e0e0;
        }

        .nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 4px;
          color: #666;
          font-size: 11px;
          cursor: pointer;
        }

        .nav-item.active {
          color: #ff6b6b;
        }
      `}</style>
    </div>
  );
};