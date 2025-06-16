import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from './lib/queryClient';
import { GameModal } from './components/GameModal';
import { WalletModal } from './components/WalletModal';

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  balance: string;
  walletBalance: string;
  bonusBalance: string;
  vipLevel: number;
  kycStatus: string;
}

interface AuthModalProps {
  onClose?: () => void;
}

function AuthModal({ onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    username: '',
    email: '',
    referralCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.reload();
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{isLogin ? 'Welcome Back' : 'Join 91CLUB'}</h2>
          <p className="modal-subtitle">
            {isLogin ? 'Sign in to your account' : 'Create your gaming account'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter your phone number"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email (Optional)</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Referral Code (Optional)</label>
              <input
                type="text"
                className="form-input"
                value={formData.referralCode}
                onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                placeholder="Enter referral code"
              />
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            className="auth-link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>

        <div style={{ marginTop: '16px', padding: '12px', background: '#f0f0f0', borderRadius: '8px', fontSize: '12px', color: '#666' }}>
          Demo Login: Phone: 9876543210, Password: demo123
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('lobby');
  const [bottomNavActive, setBottomNavActive] = useState('home');
  const queryClient = useQueryClient();

  // Initialize user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch wallet balance
  const { data: walletData, refetch: refetchBalance } = useQuery({
    queryKey: ['/api/wallet/balance'],
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const walletBalance = (walletData as any)?.walletBalance || user?.walletBalance || '0.00';

  const refreshBalance = () => {
    refetchBalance();
  };

  const openGame = (gameType: string) => {
    setSelectedGame(gameType);
    setShowGameModal(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <AuthModal />;
  }

  return (
    <div className="app-container">
      {/* Top Header */}
      <div className="top-header">
        <div className="header-top">
          <div className="logo">
            <div className="logo-icon">91</div>
            91CLUB
          </div>
          <div className="notification-icon">🔔</div>
        </div>
        
        <div className="wallet-section">
          <div className="wallet-header">
            <span className="wallet-label">Wallet balance</span>
            <div className="refresh-icon" onClick={refreshBalance}>↻</div>
          </div>
          <div className="balance-amount">₹{walletBalance}</div>
          <div className="action-buttons">
            <button className="action-btn withdraw-btn" onClick={() => setShowWalletModal(true)}>
              Withdraw
            </button>
            <button className="action-btn deposit-btn" onClick={() => setShowWalletModal(true)}>
              Deposit
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Promotional Banner */}
        <div className="promo-banner">
          <div className="promo-title">SPECIAL ATTENDANCE BONUS</div>
          <div className="promo-subtitle">PROVIDED BY 91CLUB</div>
          <div className="promo-amount">up to 558RS</div>
          <button className="claim-btn">CLAIM IT RIGHT AWAY</button>
        </div>

        {/* Quick Games */}
        <div className="quick-games">
          <div className="quick-game-card" onClick={() => openGame('wheel')}>
            <div className="quick-game-title">Wheel</div>
            <div className="quick-game-subtitle">of fortune</div>
          </div>
          <div className="quick-game-card" onClick={() => openGame('vip')}>
            <div className="quick-game-title">VIP</div>
            <div className="quick-game-subtitle">privileges</div>
          </div>
        </div>

        {/* Game Categories Navigation */}
        <div className="game-nav">
          <button className={`nav-item ${activeTab === 'lobby' ? 'active' : ''}`} onClick={() => setActiveTab('lobby')}>
            <div className="nav-icon">🏠</div>
            Lobby
          </button>
          <button className={`nav-item ${activeTab === 'mini' ? 'active' : ''}`} onClick={() => setActiveTab('mini')}>
            <div className="nav-icon">🎮</div>
            Mini game
          </button>
          <button className={`nav-item ${activeTab === 'slots' ? 'active' : ''}`} onClick={() => setActiveTab('slots')}>
            <div className="nav-icon">🎰</div>
            Slots
          </button>
          <button className={`nav-item ${activeTab === 'card' ? 'active' : ''}`} onClick={() => setActiveTab('card')}>
            <div className="nav-icon">🃏</div>
            Card
          </button>
          <button className={`nav-item ${activeTab === 'fishing' ? 'active' : ''}`} onClick={() => setActiveTab('fishing')}>
            <div className="nav-icon">🎣</div>
            Fishing
          </button>
        </div>

        {/* Lottery Section */}
        <div className="section-header">
          <div className="section-title">
            <div className="section-icon lottery-icon">8</div>
            Lottery
          </div>
          <div className="nav-arrows">
            <button className="nav-arrow">‹</button>
            <button className="nav-arrow">›</button>
          </div>
        </div>

        <div className="game-grid">
          <div className="game-card wingo-card" onClick={() => openGame('wingo')}>
            <div className="game-card-content">
              <div className="game-title">WIN GO</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card k3-card" onClick={() => openGame('k3')}>
            <div className="game-card-content">
              <div className="game-title">K3</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card 5d-card" onClick={() => openGame('5d')}>
            <div className="game-card-content">
              <div className="game-title">5D</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card trx-card" onClick={() => openGame('trx')}>
            <div className="game-card-content">
              <div className="game-title">TRX WINGO</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
        </div>

        {/* Mini Games Section */}
        <div className="section-header">
          <div className="section-title">
            <div className="section-icon minigame-icon">🎮</div>
            Mini game
          </div>
          <div className="nav-arrows">
            <button className="nav-arrow">‹</button>
            <button className="nav-arrow">›</button>
          </div>
        </div>

        <div className="game-grid">
          <div className="game-card dice-card" onClick={() => openGame('dice')}>
            <div className="game-card-content">
              <div className="game-title">SPACE</div>
              <div className="game-subtitle">DICE</div>
            </div>
          </div>
          <div className="game-card goal-card" onClick={() => openGame('goal')}>
            <div className="game-card-content">
              <div className="game-title">GOAL</div>
              <div className="game-subtitle">WAVE</div>
            </div>
          </div>
          <div className="game-card roulette-card" onClick={() => openGame('roulette')}>
            <div className="game-card-content">
              <div className="game-title">MINI</div>
              <div className="game-subtitle">ROULETTE</div>
            </div>
          </div>
          <div className="game-card aviator-card" onClick={() => openGame('aviator')}>
            <div className="game-card-content">
              <div className="game-title">AVIATOR</div>
              <div className="game-subtitle">FLY GAME</div>
            </div>
          </div>
          <div className="game-card plinko-card" onClick={() => openGame('plinko')}>
            <div className="game-card-content">
              <div className="game-title">PLINKO</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card hilo-card" onClick={() => openGame('hilo')}>
            <div className="game-card-content">
              <div className="game-title">HILO</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
        </div>

        {/* Slots Section */}
        <div className="section-header">
          <div className="section-title">
            <div className="section-icon slots-icon">🎰</div>
            Slots
          </div>
          <div className="nav-arrows">
            <button className="nav-arrow">‹</button>
            <button className="nav-arrow">›</button>
          </div>
        </div>

        <div className="game-grid">
          <div className="game-card slot-card" onClick={() => openGame('slots1')}>
            <div className="game-card-content">
              <div className="game-title">GOLDEN WEALTH</div>
              <div className="game-subtitle">SLOT GAME</div>
            </div>
          </div>
          <div className="game-card slot-card" onClick={() => openGame('slots2')}>
            <div className="game-card-content">
              <div className="game-title">TREASURE HUNT</div>
              <div className="game-subtitle">SLOT GAME</div>
            </div>
          </div>
          <div className="game-card slot-card" onClick={() => openGame('slots3')}>
            <div className="game-card-content">
              <div className="game-title">MAGIC REALM</div>
              <div className="game-subtitle">SLOT GAME</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button 
          className={`nav-item-bottom ${bottomNavActive === 'promotion' ? 'active' : ''}`}
          onClick={() => setBottomNavActive('promotion')}
        >
          <div className="nav-icon">🎁</div>
          <div className="nav-label">Promotion</div>
        </button>
        <button 
          className={`nav-item-bottom ${bottomNavActive === 'activity' ? 'active' : ''}`}
          onClick={() => setBottomNavActive('activity')}
        >
          <div className="nav-icon">📊</div>
          <div className="nav-label">Activity</div>
        </button>
        <button 
          className={`nav-item-bottom ${bottomNavActive === 'home' ? 'active' : ''}`}
          onClick={() => setBottomNavActive('home')}
        >
          <div className="nav-icon">🏠</div>
          <div className="nav-label">Home</div>
        </button>
        <button 
          className={`nav-item-bottom ${bottomNavActive === 'wallet' ? 'active' : ''}`}
          onClick={() => {
            setBottomNavActive('wallet');
            setShowWalletModal(true);
          }}
        >
          <div className="nav-icon">💰</div>
          <div className="nav-label">Wallet</div>
        </button>
        <button 
          className={`nav-item-bottom ${bottomNavActive === 'account' ? 'active' : ''}`}
          onClick={() => setBottomNavActive('account')}
        >
          <div className="nav-icon">👤</div>
          <div className="nav-label">Account</div>
        </button>
      </div>

      {/* Modals */}
      {showGameModal && selectedGame && (
        <GameModal
          gameType={selectedGame}
          onClose={() => {
            setShowGameModal(false);
            setSelectedGame(null);
          }}
          onBalanceUpdate={refreshBalance}
        />
      )}

      {showWalletModal && (
        <WalletModal
          onClose={() => setShowWalletModal(false)}
          onBalanceUpdate={refreshBalance}
        />
      )}
    </div>
  );
}