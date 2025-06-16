import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

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

function SimpleGameModal({ gameType, onClose }: { gameType: string; onClose: () => void }) {
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);

  const playGame = async () => {
    setIsPlaying(true);
    try {
      const response = await fetch(`/api/games/${gameType}/play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ betAmount }),
      });

      const result = await response.json();
      setGameResult(result);
    } catch (error) {
      alert('Game error. Please try again.');
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="game-modal">
      <div className="game-modal-content">
        <div className="game-modal-header">
          <h3 className="game-modal-title">{gameType.toUpperCase()}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="game-modal-body">
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
              <label>Bet Amount:</label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                style={{ margin: '0 10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            
            <button
              onClick={playGame}
              disabled={isPlaying}
              style={{
                background: '#FF4757',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {isPlaying ? 'Playing...' : 'Play Game'}
            </button>

            {gameResult && (
              <div style={{ marginTop: '20px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
                <p>Result: {gameResult.isWin ? 'WIN!' : 'LOSE'}</p>
                <p>Amount: ₹{gameResult.winAmount}</p>
                {gameResult.multiplier && <p>Multiplier: {gameResult.multiplier}x</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleWalletModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="wallet-modal">
      <div className="wallet-modal-content">
        <div className="wallet-modal-header">
          <h3>Wallet</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="wallet-modal-body">
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Wallet operations coming soon!</p>
            <button
              onClick={onClose}
              style={{
                background: '#FF4757',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
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
    refetchInterval: 30000,
  });

  const walletBalance = (walletData as any)?.walletBalance || user?.walletBalance || '0.00';

  const refreshBalance = () => {
    refetchBalance();
  };

  const openGame = (gameType: string) => {
    setSelectedGame(gameType);
    setShowGameModal(true);
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
          <div className="game-card fived-card" onClick={() => openGame('5d')}>
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
          <div className="game-card aviator-card" onClick={() => openGame('aviator')}>
            <div className="game-card-content">
              <div className="game-title">AVIATOR</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card cricket-card" onClick={() => openGame('cricket')}>
            <div className="game-card-content">
              <div className="game-title">CRICKET</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card mines-card" onClick={() => openGame('mines')}>
            <div className="game-card-content">
              <div className="game-title">MINES</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card aviator2-card" onClick={() => openGame('aviator2')}>
            <div className="game-card-content">
              <div className="game-title">AVIATOR</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card limbo-card" onClick={() => openGame('limbo')}>
            <div className="game-card-content">
              <div className="game-title">LIMBO</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card mines-pro-card" onClick={() => openGame('mines-pro')}>
            <div className="game-card-content">
              <div className="game-title">MINES PRO</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card dragon-tiger-card" onClick={() => openGame('dragon-tiger')}>
            <div className="game-card-content">
              <div className="game-title">DRAGON</div>
              <div className="game-subtitle">TIGER</div>
            </div>
          </div>
          <div className="game-card goal-card" onClick={() => openGame('goal')}>
            <div className="game-card-content">
              <div className="game-title">GOAL</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card dice-card" onClick={() => openGame('dice')}>
            <div className="game-card-content">
              <div className="game-title">DICE</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card king-pauper-card" onClick={() => openGame('king-pauper')}>
            <div className="game-card-content">
              <div className="game-title">KING AND</div>
              <div className="game-subtitle">PAUPER</div>
            </div>
          </div>
          <div className="game-card hilo-wave-card" onClick={() => openGame('hilo-wave')}>
            <div className="game-card-content">
              <div className="game-title">HILO WAVE</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card clash-hands-card" onClick={() => openGame('clash-hands')}>
            <div className="game-card-content">
              <div className="game-title">CLASH OF</div>
              <div className="game-subtitle">HANDS</div>
            </div>
          </div>
          <div className="game-card plinko-card" onClick={() => openGame('plinko')}>
            <div className="game-card-content">
              <div className="game-title">PLINKO</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card bomb-wave-card" onClick={() => openGame('bomb-wave')}>
            <div className="game-card-content">
              <div className="game-title">BOMB</div>
              <div className="game-subtitle">WAVE</div>
            </div>
          </div>
          <div className="game-card hilo-card" onClick={() => openGame('hilo')}>
            <div className="game-card-content">
              <div className="game-title">HILO</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card treasure-wave-card" onClick={() => openGame('treasure-wave')}>
            <div className="game-card-content">
              <div className="game-title">TREASURE</div>
              <div className="game-subtitle">WAVE</div>
            </div>
          </div>
          <div className="game-card hotline-card" onClick={() => openGame('hotline')}>
            <div className="game-card-content">
              <div className="game-title">HOTLINE</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card cryptos-card" onClick={() => openGame('cryptos')}>
            <div className="game-card-content">
              <div className="game-title">CRYPTOS</div>
              <div className="game-subtitle">TB GAME</div>
            </div>
          </div>
          <div className="game-card space-dice-card" onClick={() => openGame('space-dice')}>
            <div className="game-card-content">
              <div className="game-title">SPACE</div>
              <div className="game-subtitle">DICE</div>
            </div>
          </div>
          <div className="game-card goal-wave-card" onClick={() => openGame('goal-wave')}>
            <div className="game-card-content">
              <div className="game-title">GOAL</div>
              <div className="game-subtitle">WAVE</div>
            </div>
          </div>
          <div className="game-card mini-roulette-card" onClick={() => openGame('mini-roulette')}>
            <div className="game-card-content">
              <div className="game-title">MINI</div>
              <div className="game-subtitle">ROULETTE</div>
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
        <SimpleGameModal
          gameType={selectedGame}
          onClose={() => {
            setShowGameModal(false);
            setSelectedGame(null);
            refreshBalance();
          }}
        />
      )}

      {showWalletModal && (
        <SimpleWalletModal
          onClose={() => setShowWalletModal(false)}
        />
      )}
    </div>
  );
}