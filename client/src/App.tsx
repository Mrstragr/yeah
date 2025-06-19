import { AuthenticApp } from './components/AuthenticApp';
import './authentic.css';

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
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [mineCount, setMineCount] = useState(3);

  const playGame = async () => {
    setIsPlaying(true);
    setGameResult(null);
    
    try {
      const body: any = { betAmount };
      
      // Add game-specific parameters
      if (gameType === 'wingo') {
        if (selectedNumber !== null) {
          body.betType = 'number';
          body.betValue = selectedNumber;
        } else if (selectedColor) {
          body.betType = 'color';
          body.betValue = selectedColor;
        } else {
          alert('Please select a number or color to bet on');
          setIsPlaying(false);
          return;
        }
      } else if (gameType === 'dragon-tiger') {
        if (!selectedBet) {
          alert('Please select Dragon, Tiger, or Tie');
          setIsPlaying(false);
          return;
        }
        body.betType = selectedBet;
      } else if (gameType === 'aviator') {
        body.cashOutMultiplier = 2.0; // Default cash out
      } else if (gameType === 'mines') {
        body.mineCount = mineCount;
        body.revealedTiles = [1, 2, 3]; // Default revealed tiles
      }

      const response = await fetch(`/api/games/${gameType}/play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const result = await response.json();
        setGameResult(result);
        
        // Show result notification
        setTimeout(() => {
          if (result.isWin) {
            alert(`You won ₹${result.winAmount}! (${result.multiplier}x multiplier)`);
          } else {
            alert(`You lost ₹${betAmount}. Better luck next time!`);
          }
        }, 500);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Game failed. Please try again.');
      }
    } catch (error) {
      alert('Game error. Please try again.');
    } finally {
      setIsPlaying(false);
    }
  };

  const renderGameControls = () => {
    switch (gameType) {
      case 'wingo':
        return (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <h4>Select Number (9x payout):</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', maxWidth: '300px', margin: '0 auto' }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    onClick={() => { setSelectedNumber(num); setSelectedColor(null); }}
                    style={{
                      padding: '10px',
                      border: '2px solid',
                      borderColor: selectedNumber === num ? '#FF4757' : '#ddd',
                      background: selectedNumber === num ? '#FF4757' : 'white',
                      color: selectedNumber === num ? 'white' : 'black',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4>Or Select Color (2x payout):</h4>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {['red', 'green', 'violet'].map(color => (
                  <button
                    key={color}
                    onClick={() => { setSelectedColor(color); setSelectedNumber(null); }}
                    style={{
                      padding: '10px 20px',
                      border: '2px solid',
                      borderColor: selectedColor === color ? '#FF4757' : '#ddd',
                      background: selectedColor === color ? color : 'white',
                      color: selectedColor === color ? 'white' : 'black',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'dragon-tiger':
        return (
          <div style={{ marginBottom: '20px' }}>
            <h4>Choose your bet:</h4>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {['dragon', 'tiger', 'tie'].map(bet => (
                <button
                  key={bet}
                  onClick={() => setSelectedBet(bet)}
                  style={{
                    padding: '15px 25px',
                    border: '2px solid',
                    borderColor: selectedBet === bet ? '#FF4757' : '#ddd',
                    background: selectedBet === bet ? '#FF4757' : 'white',
                    color: selectedBet === bet ? 'white' : 'black',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  {bet}
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'mines':
        return (
          <div style={{ marginBottom: '20px' }}>
            <h4>Number of Mines:</h4>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {[1, 3, 5, 10].map(count => (
                <button
                  key={count}
                  onClick={() => setMineCount(count)}
                  style={{
                    padding: '10px 15px',
                    border: '2px solid',
                    borderColor: mineCount === count ? '#FF4757' : '#ddd',
                    background: mineCount === count ? '#FF4757' : 'white',
                    color: mineCount === count ? 'white' : 'black',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
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
            {renderGameControls()}
            
            <div style={{ marginBottom: '20px' }}>
              <label>Bet Amount:</label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                style={{ margin: '0 10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                min="10"
                max="10000"
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
                fontSize: '16px',
                opacity: isPlaying ? 0.6 : 1
              }}
            >
              {isPlaying ? 'Playing...' : 'Play Game'}
            </button>

            {gameResult && (
              <div style={{ 
                marginTop: '20px', 
                padding: '16px', 
                background: gameResult.isWin ? '#d4edda' : '#f8d7da',
                border: `1px solid ${gameResult.isWin ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '8px',
                color: gameResult.isWin ? '#155724' : '#721c24'
              }}>
                <p><strong>Result: {gameResult.isWin ? 'WIN!' : 'LOSE'}</strong></p>
                <p>Amount: ₹{gameResult.winAmount || 0}</p>
                {gameResult.multiplier && <p>Multiplier: {gameResult.multiplier}x</p>}
                {gameResult.result && (
                  <div style={{ marginTop: '10px', fontSize: '14px' }}>
                    <p>Game Details:</p>
                    <pre style={{ background: '#f8f9fa', padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
                      {JSON.stringify(gameResult.result, null, 2)}
                    </pre>
                  </div>
                )}
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
  const [useEnhancedInterface, setUseEnhancedInterface] = useState(true);
  const [activeTab, setActiveTab] = useState('lobby');
  const [bottomNavActive, setBottomNavActive] = useState('home');
  const [showDashboard, setShowDashboard] = useState(false);
  const [showLobby, setShowLobby] = useState(false);

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

  const closeGameModal = () => {
    setShowGameModal(false);
    setSelectedGame(null);
  };

  if (!user) {
    return <AuthModal />;
  }

  return (
    <div className="app-container">
      {/* Top Header - Exact 91CLUB Design */}
      <div className="top-header">
        <div className="header-top">
          <div className="logo">
            <span className="logo-circle">91</span>
            <span className="logo-text">CLUB</span>
          </div>
          <div className="header-icons">
            <div className="notification-icon">🔔</div>
          </div>
        </div>
        
        {/* Special Attendance Banner */}
        <div className="attendance-banner">
          <div className="banner-content">
            <div className="banner-left">
              <div className="banner-title">SPECIAL ATTENDANCE BONUS</div>
              <div className="banner-subtitle">PROVIDED BY 91CLUB</div>
              <div className="banner-amount">up to 558RS</div>
            </div>
            <div className="banner-right">
              <button className="claim-btn">CLAIM IT RIGHT AWAY</button>
            </div>
          </div>
        </div>

        {/* Wallet Section */}
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

        {/* Quick Action Cards */}
        <div className="quick-actions">
          <div className="quick-card wheel-card" onClick={() => openGame('wheel')}>
            <div className="quick-icon">🎡</div>
            <div className="quick-text">
              <div className="quick-title">Wheel</div>
              <div className="quick-subtitle">of fortune</div>
            </div>
          </div>
          <div className="quick-card vip-card" onClick={() => openGame('vip')}>
            <div className="quick-icon">👑</div>
            <div className="quick-text">
              <div className="quick-title">VIP</div>
              <div className="quick-subtitle">privileges</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">

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

        {/* Content based on active tab */}
        {activeTab === 'lobby' && (
          <>
            {/* Lottery Section */}
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon lottery-icon">🎯</div>
                Lottery
              </div>
              <div className="section-subtitle">The games are independently developed by our team, fun, fair, and safe</div>
            </div>
          </>
        )}

        {activeTab === 'mini' && (
          <>
            {/* Featured Game */}
            <div className="featured-game">
              <div className="featured-content">
                <div className="featured-bike">🏍️</div>
                <div className="featured-number">7</div>
              </div>
            </div>

            {/* Mini Games */}
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon mini-icon">🎮</div>
                Mini game
              </div>
              <div className="nav-arrows">
                <span>Detail</span>
                <button className="nav-arrow">‹</button>
                <button className="nav-arrow">›</button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'slots' && (
          <>
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon slots-icon">🎰</div>
                Slots
              </div>
              <div className="nav-arrows">
                <span>Detail</span>
                <button className="nav-arrow">‹</button>
                <button className="nav-arrow">›</button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'card' && (
          <>
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon card-icon">🃏</div>
                Card
              </div>
            </div>
          </>
        )}

        {activeTab === 'fishing' && (
          <>
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon fishing-icon">🎣</div>
                Fishing
              </div>
            </div>
          </>
        )}

        {/* Lottery Section - Always Visible on Lobby */}
        {activeTab === 'lobby' && (
          <>
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">🎯</div>
                <span>Lottery</span>
              </div>
            </div>
            <div className="section-subtitle">The games are independently developed by our team, fun, fair, and safe</div>
            
            <div className="lottery-grid">
              <div className="lottery-card wingo-card" onClick={() => openGame('wingo')}>
                <div className="card-icon">7</div>
                <div className="card-content">
                  <div className="card-title">WIN GO</div>
                </div>
              </div>
              <div className="lottery-card k3-card" onClick={() => openGame('k3')}>
                <div className="card-icon">🎲</div>
                <div className="card-content">
                  <div className="card-title">K3</div>
                </div>
              </div>
              <div className="lottery-card fived-card" onClick={() => openGame('5d')}>
                <div className="card-content">
                  <div className="card-title">5D</div>
                </div>
              </div>
              <div className="lottery-card trx-card" onClick={() => openGame('trx')}>
                <div className="card-content">
                  <div className="card-title">TRX WINGO</div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'mini' && (
          <>
            <div className="game-grid mini-grid">
              <div className="game-card space-dice" onClick={() => openGame('dice')}>
                <div className="game-content">
                  <div className="game-title">SPACE DICE</div>
                  <div className="game-subtitle">TB GAME</div>
                </div>
              </div>
              <div className="game-card goal-wave" onClick={() => openGame('goal')}>
                <div className="game-content">
                  <div className="game-title">GOAL WAVE</div>
                  <div className="game-subtitle">TB GAME</div>
                </div>
              </div>
              <div className="game-card mini-roulette" onClick={() => openGame('roulette')}>
                <div className="game-content">
                  <div className="game-title">MINI ROULETTE</div>
                  <div className="game-subtitle">TB GAME</div>
                </div>
              </div>
            </div>

            <div className="section-header">
              <div className="section-title">
                <div className="section-icon star-icon">⭐</div>
                Recommended Games
              </div>
              <div className="nav-arrows">
                <button className="nav-arrow">‹</button>
                <button className="nav-arrow">›</button>
              </div>
            </div>

            <div className="game-grid recommended-grid">
              <div className="game-card dice-rec" onClick={() => openGame('dice')}>
                <div className="game-content">
                  <div className="game-title">DICE</div>
                  <div className="game-subtitle">TB GAME</div>
                </div>
              </div>
              <div className="game-card plinko" onClick={() => openGame('plinko')}>
                <div className="game-content">
                  <div className="multiplier-badge">20x</div>
                  <div className="game-title">PLINKO</div>
                  <div className="game-subtitle">TB GAME</div>
                </div>
              </div>
              <div className="game-card hilo" onClick={() => openGame('hilo')}>
                <div className="game-content">
                  <div className="game-title">HILO</div>
                  <div className="game-subtitle">TB GAME</div>
                </div>
              </div>
            </div>

            <div className="section-header">
              <div className="section-title">
                <div className="section-icon slots-icon">🎰</div>
                Slots
              </div>
              <div className="nav-arrows">
                <span>Detail</span>
                <button className="nav-arrow">‹</button>
                <button className="nav-arrow">›</button>
              </div>
            </div>

            <div className="game-grid slots-grid">
              <div className="game-card aviator-slot" onClick={() => openGame('aviator')}>
                <div className="game-content">
                  <div className="bonus-badge">+500%</div>
                  <div className="game-title">AVIATOR</div>
                  <div className="game-subtitle">TB GAME</div>
                </div>
              </div>
              <div className="game-card cricket-slot" onClick={() => openGame('cricket')}>
                <div className="game-content">
                  <div className="game-title">CRICKET</div>
                  <div className="game-subtitle">TB GAME</div>
                </div>
              </div>
              <div className="game-card mines-slot" onClick={() => openGame('mines')}>
                <div className="game-content">
                  <div className="game-title">MINES</div>
                  <div className="game-subtitle">TB GAME</div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'slots' && (
          <div className="game-grid slots-main-grid">
            <div className="game-card aviator-main" onClick={() => openGame('aviator')}>
              <div className="game-content">
                <div className="bonus-badge">+500%</div>
                <div className="game-title">AVIATOR</div>
                <div className="game-subtitle">TB GAME</div>
              </div>
            </div>
            <div className="game-card cricket-main" onClick={() => openGame('cricket')}>
              <div className="game-content">
                <div className="game-title">CRICKET</div>
                <div className="game-subtitle">TB GAME</div>
              </div>
            </div>
            <div className="game-card mines-main" onClick={() => openGame('mines')}>
              <div className="game-content">
                <div className="game-title">MINES</div>
                <div className="game-subtitle">TB GAME</div>
              </div>
            </div>
            <div className="game-card aviator-blue" onClick={() => openGame('aviator')}>
              <div className="game-content">
                <div className="game-title">AVIATOR</div>
                <div className="game-subtitle">TB GAME</div>
              </div>
            </div>
            <div className="game-card limbo-main" onClick={() => openGame('limbo')}>
              <div className="game-content">
                <div className="multiplier-badge">500x</div>
                <div className="game-title">LIMBO</div>
                <div className="game-subtitle">TB GAME</div>
              </div>
            </div>
            <div className="game-card mines-pro" onClick={() => openGame('mines')}>
              <div className="game-content">
                <div className="game-title">MINES PRO</div>
                <div className="game-subtitle">TB GAME</div>
              </div>
            </div>
            <div className="game-card dragon-tiger-main" onClick={() => openGame('dragon-tiger')}>
              <div className="game-content">
                <div className="game-title">DRAGON TIGER</div>
                <div className="game-subtitle">TB GAME</div>
              </div>
            </div>
            <div className="game-card goal-main" onClick={() => openGame('goal')}>
              <div className="game-content">
                <div className="game-title">GOAL</div>
                <div className="game-subtitle">TB GAME</div>
              </div>
            </div>
            <div className="game-card dice-main" onClick={() => openGame('dice')}>
              <div className="game-content">
                <div className="game-title">DICE</div>
                <div className="game-subtitle">TB GAME</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'card' && (
          <div className="game-grid card-grid">
            <div className="game-card dragon-tiger-card" onClick={() => openGame('dragon-tiger')}>
              <div className="game-content">
                <div className="game-title">DRAGON TIGER</div>
                <div className="game-subtitle">TB GAME</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fishing' && (
          <div className="coming-soon-section">
            <div className="coming-soon-text">Fishing Games Coming Soon</div>
          </div>
        )}

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
          <GameCardWithImages 
            gameType="aviator"
            title="AVIATOR"
            subtitle="TB GAME"
            onClick={() => openGame('aviator')}
            className="aviator-card"
          />
          <GameCardWithImages 
            gameType="cricket"
            title="CRICKET"
            subtitle="TB GAME"
            onClick={() => openGame('cricket')}
            className="cricket-card"
          />
          <GameCardWithImages 
            gameType="mines"
            title="MINES"
            subtitle="TB GAME"
            onClick={() => openGame('mines')}
            className="mines-card"
          />
          <GameCardWithImages 
            gameType="aviator"
            title="AVIATOR"
            subtitle="TB GAME"
            onClick={() => openGame('aviator2')}
            className="aviator2-card"
          />
          <GameCardWithImages 
            gameType="dice"
            title="LIMBO"
            subtitle="TB GAME"
            onClick={() => openGame('limbo')}
            className="limbo-card"
          />
          <GameCardWithImages 
            gameType="mines"
            title="MINES PRO"
            subtitle="TB GAME"
            onClick={() => openGame('mines-pro')}
            className="mines-pro-card"
          />
          <GameCardWithImages 
            gameType="dragon-tiger"
            title="DRAGON"
            subtitle="TIGER"
            onClick={() => openGame('dragon-tiger')}
            className="dragon-tiger-card"
          />
          <GameCardWithImages 
            gameType="cricket"
            title="GOAL"
            subtitle="TB GAME"
            onClick={() => openGame('goal')}
            className="goal-card"
          />
          <GameCardWithImages 
            gameType="dice"
            title="DICE"
            subtitle="TB GAME"
            onClick={() => openGame('dice')}
            className="dice-card"
          />
          <GameCardWithImages 
            gameType="dragon-tiger"
            title="KING AND"
            subtitle="PAUPER"
            onClick={() => openGame('king-pauper')}
            className="king-pauper-card"
          />
          <GameCardWithImages 
            gameType="dice"
            title="HILO WAVE"
            subtitle="TB GAME"
            onClick={() => openGame('hilo-wave')}
            className="hilo-wave-card"
          />
          <GameCardWithImages 
            gameType="dragon-tiger"
            title="CLASH OF"
            subtitle="HANDS"
            onClick={() => openGame('clash-hands')}
            className="clash-hands-card"
          />
          <GameCardWithImages 
            gameType="dice"
            title="PLINKO"
            subtitle="TB GAME"
            onClick={() => openGame('plinko')}
            className="plinko-card"
          />
          <GameCardWithImages 
            gameType="mines"
            title="BOMB"
            subtitle="WAVE"
            onClick={() => openGame('bomb-wave')}
            className="bomb-wave-card"
          />
          <GameCardWithImages 
            gameType="dice"
            title="HILO"
            subtitle="TB GAME"
            onClick={() => openGame('hilo')}
            className="hilo-card"
          />
          <GameCardWithImages 
            gameType="mines"
            title="TREASURE"
            subtitle="WAVE"
            onClick={() => openGame('treasure-wave')}
            className="treasure-wave-card"
          />
          <GameCardWithImages 
            gameType="aviator"
            title="HOTLINE"
            subtitle="TB GAME"
            onClick={() => openGame('hotline')}
            className="hotline-card"
          />
          <GameCardWithImages 
            gameType="dice"
            title="CRYPTOS"
            subtitle="TB GAME"
            onClick={() => openGame('cryptos')}
            className="cryptos-card"
          />
          <GameCardWithImages 
            gameType="dice"
            title="SPACE"
            subtitle="DICE"
            onClick={() => openGame('space-dice')}
            className="space-dice-card"
          />
          <GameCardWithImages 
            gameType="cricket"
            title="GOAL"
            subtitle="WAVE"
            onClick={() => openGame('goal-wave')}
            className="goal-wave-card"
          />
          <GameCardWithImages 
            gameType="wingo"
            title="MINI"
            subtitle="ROULETTE"
            onClick={() => openGame('mini-roulette')}
            className="mini-roulette-card"
          />
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
          className={`nav-item-bottom ${bottomNavActive === 'home' ? 'active' : ''}`}
          onClick={() => {
            setBottomNavActive('home');
          }}
        >
          <div className="nav-icon">🏠</div>
          <div className="nav-label">Home</div>
        </button>
        <button 
          className={`nav-item-bottom ${bottomNavActive === 'dashboard' ? 'active' : ''}`}
          onClick={() => {
            setBottomNavActive('lobby');
            setShowLobby(true);
            setShowDashboard(false);
          }}
        >
          <div className="nav-icon">🎮</div>
          <div className="nav-label">Lobby</div>
        </button>
        <button 
          className={`nav-item-bottom ${bottomNavActive === 'activity' ? 'active' : ''}`}
          onClick={() => {
            setBottomNavActive('activity');
          }}
        >
          <div className="nav-icon">📊</div>
          <div className="nav-label">Activity</div>
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
          onClick={() => {
            setBottomNavActive('account');
          }}
        >
          <div className="nav-icon">👤</div>
          <div className="nav-label">Account</div>
        </button>
      </div>

      {/* Enhanced Game Interface */}
      {showGameModal && selectedGame && (
        <EnhancedGameInterface
          gameType={selectedGame}
          onClose={() => {
            setShowGameModal(false);
            setSelectedGame(null);
            refreshBalance();
          }}
          refreshBalance={refreshBalance}
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