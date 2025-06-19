import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
}

interface AuthModalProps {
  onLogin: (user: User) => void;
}

const AuthModal = ({ onLogin }: AuthModalProps) => {
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
        alert('Login failed. Use demo credentials: 9876543210 / demo123');
      }
    } catch (error) {
      alert('Login error. Use demo credentials: 9876543210 / demo123');
    }

    setIsLoading(false);
  };

  const handleDemoLogin = () => {
    setPhone('9876543210');
    setPassword('demo123');
  };

  return (
    <div className="auth-modal">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-circle">91</span>
            <span className="logo-text">CLUB</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="login-btn">
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>

          <button type="button" onClick={handleDemoLogin} className="demo-btn">
            Use Demo Account
          </button>
        </form>
      </div>
    </div>
  );
};

export const AuthenticApp = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('lobby');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);

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

  const openGame = (gameType: string) => {
    setSelectedGame(gameType);
  };

  if (!user) {
    return <AuthModal onLogin={setUser} />;
  }

  return (
    <div className="authentic-app">
      {/* Top Header - Exact 91CLUB Design */}
      <div className="top-header">
        <div className="header-content">
          <div className="header-top">
            <div className="logo">
              <div className="logo-circle">91</div>
              <div className="logo-text">CLUB</div>
            </div>
            <div className="notification-icon">🔔</div>
          </div>

          {/* Attendance Banner */}
          <div className="attendance-banner">
            <div className="banner-bg"></div>
            <div className="banner-content">
              <div className="banner-text">
                <div className="banner-title">SPECIAL ATTENDANCE BONUS</div>
                <div className="banner-subtitle">PROVIDED BY 91CLUB</div>
                <div className="banner-amount">up to 558RS</div>
              </div>
              <button className="claim-button">CLAIM IT RIGHT AWAY</button>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="wallet-section">
            <div className="wallet-header">
              <span className="wallet-label">💰 Wallet balance</span>
              <div className="refresh-icon">↻</div>
            </div>
            <div className="balance-row">
              <div className="balance-amount">₹{walletBalance.toFixed(2)}</div>
              <div className="wallet-buttons">
                <button className="wallet-btn withdraw-btn">Withdraw</button>
                <button className="wallet-btn deposit-btn">Deposit</button>
              </div>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="quick-access">
            <div className="quick-card wheel-card">
              <div className="quick-icon">🎡</div>
              <div className="quick-text">
                <div>Wheel</div>
                <div>of fortune</div>
              </div>
            </div>
            <div className="quick-card vip-card">
              <div className="quick-icon">👑</div>
              <div className="quick-text">
                <div>VIP</div>
                <div>privileges</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'lobby' ? 'active' : ''}`}
          onClick={() => setActiveTab('lobby')}
        >
          <div className="nav-icon">🏠</div>
          <span>Lobby</span>
        </button>
        <button 
          className={`nav-tab ${activeTab === 'mini' ? 'active' : ''}`}
          onClick={() => setActiveTab('mini')}
        >
          <div className="nav-icon">🎮</div>
          <span>Mini game</span>
        </button>
        <button 
          className={`nav-tab ${activeTab === 'slots' ? 'active' : ''}`}
          onClick={() => setActiveTab('slots')}
        >
          <div className="nav-icon">🎰</div>
          <span>Slots</span>
        </button>
        <button 
          className={`nav-tab ${activeTab === 'card' ? 'active' : ''}`}
          onClick={() => setActiveTab('card')}
        >
          <div className="nav-icon">🃏</div>
          <span>Card</span>
        </button>
        <button 
          className={`nav-tab ${activeTab === 'fishing' ? 'active' : ''}`}
          onClick={() => setActiveTab('fishing')}
        >
          <div className="nav-icon">🎣</div>
          <span>Fishing</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'lobby' && (
          <div className="lottery-section">
            <div className="section-header">
              <div className="section-icon-bg">
                <span className="section-number">8</span>
              </div>
              <span className="section-title">Lottery</span>
            </div>
            <div className="section-subtitle">
              The games are independently developed by our team, fun, fair, and safe
            </div>

            <div className="lottery-games">
              <div className="lottery-game wingo" onClick={() => openGame('wingo')}>
                <div className="game-decoration"></div>
                <div className="game-icon">
                  <div className="number-circle">7</div>
                </div>
                <div className="game-title">WIN GO</div>
              </div>

              <div className="lottery-game k3" onClick={() => openGame('k3')}>
                <div className="game-decoration"></div>
                <div className="game-title">K3</div>
              </div>

              <div className="lottery-game fived" onClick={() => openGame('5d')}>
                <div className="game-decoration"></div>
                <div className="game-title">5D</div>
              </div>

              <div className="lottery-game trx" onClick={() => openGame('trx')}>
                <div className="game-decoration"></div>
                <div className="game-title">TRX WINGO</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'slots' && (
          <div className="slots-section">
            <div className="slots-grid">
              <div className="slot-game aviator-red" onClick={() => openGame('aviator')}>
                <div className="game-badge">+500%</div>
                <div className="game-title">AVIATOR</div>
                <div className="game-subtitle">TB GAME</div>
              </div>

              <div className="slot-game cricket" onClick={() => openGame('cricket')}>
                <div className="game-title">CRICKET</div>
                <div className="game-subtitle">TB GAME</div>
              </div>

              <div className="slot-game mines-purple" onClick={() => openGame('mines')}>
                <div className="game-title">MINES</div>
                <div className="game-subtitle">TB GAME</div>
              </div>

              <div className="slot-game aviator-blue" onClick={() => openGame('aviator')}>
                <div className="game-title">AVIATOR</div>
                <div className="game-subtitle">TB GAME</div>
              </div>

              <div className="slot-game limbo" onClick={() => openGame('limbo')}>
                <div className="game-badge">500X</div>
                <div className="game-title">LIMBO</div>
                <div className="game-subtitle">TB GAME</div>
              </div>

              <div className="slot-game mines-brown" onClick={() => openGame('mines')}>
                <div className="game-title">MINES PRO</div>
                <div className="game-subtitle">TB GAME</div>
              </div>

              <div className="slot-game dragon-tiger" onClick={() => openGame('dragon-tiger')}>
                <div className="game-title">DRAGON TIGER</div>
                <div className="game-subtitle">TB GAME</div>
              </div>

              <div className="slot-game goal" onClick={() => openGame('goal')}>
                <div className="game-title">GOAL</div>
                <div className="game-subtitle">TB GAME</div>
              </div>

              <div className="slot-game dice" onClick={() => openGame('dice')}>
                <div className="game-title">DICE</div>
                <div className="game-subtitle">TB GAME</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="nav-item">
          <div className="nav-icon">🎁</div>
          <span>Promotion</span>
        </div>
        <div className="nav-item">
          <div className="nav-icon">📊</div>
          <span>Activity</span>
        </div>
        <div className="nav-item active">
          <div className="nav-icon">🎮</div>
          <span>Main</span>
        </div>
        <div className="nav-item">
          <div className="nav-icon">💰</div>
          <span>Wallet</span>
        </div>
        <div className="nav-item">
          <div className="nav-icon">👤</div>
          <span>Account</span>
        </div>
      </div>
    </div>
  );
};