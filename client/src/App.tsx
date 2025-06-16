import { useState } from 'react';
import { 
  Home, 
  Activity, 
  Gift, 
  Wallet, 
  User, 
  Bell, 
  ChevronRight,
  ArrowLeft,
  Gamepad2,
  Zap,
  CreditCard,
  Fish,
  Trophy,
  ArrowRight,
  Copy,
  MoreHorizontal
} from 'lucide-react';

import { LoginInterface } from './components/LoginInterface';
import { GameModal } from './components/GameModal';
import { WalletModal } from './components/WalletModal';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState(10000);
  const [activeTab, setActiveTab] = useState('lobby');
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [liveStats, setLiveStats] = useState<any>({});

  const handleLogin = async (credentials: any) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsLoggedIn(true);
        setShowLogin(false);
        localStorage.setItem('authToken', data.token);
        await fetchWalletBalance();
        startLiveUpdates();
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/wallet/balance', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const startLiveUpdates = () => {
    const ws = new WebSocket(`ws://${window.location.host}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'stats_update') {
        setLiveStats(data.data);
      } else if (data.type === 'balance_update') {
        setWalletBalance(data.balance);
      }
    };
  };

  const handleGameSelect = (game: any) => {
    setSelectedGame(game);
    setShowGameModal(true);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (!isLoggedIn) {
    return (
      <>
        <div className="welcome-screen">
          <div className="welcome-content">
            <div className="logo-section">
              <div className="logo-circle">
                <span className="logo-text">91</span>
              </div>
              <h1 className="welcome-title">91CLUB</h1>
              <p className="welcome-subtitle">Premium Gaming Experience</p>
            </div>
            <div className="action-section">
              <button 
                className="login-btn"
                onClick={() => setShowLogin(true)}
              >
                Login to Continue
              </button>
            </div>
          </div>
        </div>
        <LoginInterface
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      </>
    );
  }

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <div className={`nav-item ${activeTab === 'lobby' ? 'active' : ''}`} onClick={() => handleTabChange('lobby')}>
          <Home className="nav-icon" />
          <span>Lobby</span>
        </div>
        <div className={`nav-item ${activeTab === 'mini' ? 'active' : ''}`} onClick={() => handleTabChange('mini')}>
          <Gamepad2 className="nav-icon" />
          <span>Mini game</span>
        </div>
        <div className={`nav-item ${activeTab === 'slots' ? 'active' : ''}`} onClick={() => handleTabChange('slots')}>
          <Zap className="nav-icon" />
          <span>Slots</span>
        </div>
        <div className={`nav-item ${activeTab === 'card' ? 'active' : ''}`} onClick={() => handleTabChange('card')}>
          <CreditCard className="nav-icon" />
          <span>Card</span>
        </div>
        <div className={`nav-item ${activeTab === 'fishing' ? 'active' : ''}`} onClick={() => handleTabChange('fishing')}>
          <Fish className="nav-icon" />
          <span>Fishing</span>
        </div>
        <div className={`nav-item ${activeTab === 'sports' ? 'active' : ''}`} onClick={() => handleTabChange('sports')}>
          <Trophy className="nav-icon" />
          <span>Sports</span>
        </div>
      </div>

      {/* Featured Promotion Banner */}
      <div className="promo-banner">
        <div className="promo-content">
          <div className="promo-badge">🎯</div>
          <div className="promo-title">PENALTY KICKS</div>
          <div className="promo-subtitle">JiLi Game</div>
        </div>
      </div>

      {/* Mini Game Section */}
      <div className="game-section">
        <div className="section-header">
          <div className="section-icon">🎮</div>
          <h3 className="section-title">Mini game</h3>
          <button className="detail-btn">Detail</button>
        </div>
        <div className="game-grid">
          <div className="game-card purple-gradient" onClick={() => handleGameSelect({name: 'SPACE DICE', type: 'dice', icon: '🎲'})}>
            <div className="game-icon">🎲</div>
            <div className="game-name">SPACE DICE</div>
            <div className="game-provider">TB GAME</div>
          </div>
          <div className="game-card blue-gradient" onClick={() => handleGameSelect({name: 'GOAL WAVE', type: 'sports', icon: '⚽'})}>
            <div className="game-icon">⚽</div>
            <div className="game-name">GOAL WAVE</div>
            <div className="game-provider">TB GAME</div>
          </div>
          <div className="game-card orange-gradient" onClick={() => handleGameSelect({name: 'MINI ROULETTE', type: 'casino', icon: '🎰'})}>
            <div className="game-icon">🎰</div>
            <div className="game-name">MINI ROULETTE</div>
            <div className="game-provider">TB GAME</div>
          </div>
        </div>
      </div>

      {/* Recommended Games Section */}
      <div className="game-section">
        <div className="section-header">
          <div className="section-icon">⭐</div>
          <h3 className="section-title">Recommended Games</h3>
        </div>
        <div className="game-grid">
          <div className="game-card red-gradient" onClick={() => handleGameSelect({name: 'DICE', type: 'dice', icon: '🎯'})}>
            <div className="game-icon">🎯</div>
            <div className="game-name">DICE</div>
            <div className="game-provider">TB GAME</div>
          </div>
          <div className="game-card purple-gradient" onClick={() => handleGameSelect({name: 'PLINKO', type: 'plinko', icon: '🌪️'})}>
            <div className="game-icon">🌪️</div>
            <div className="game-name">PLINKO</div>
            <div className="game-provider">TB GAME</div>
          </div>
          <div className="game-card blue-gradient" onClick={() => handleGameSelect({name: 'HILO', type: 'hilo', icon: '🎲'})}>
            <div className="game-icon">🎲</div>
            <div className="game-name">HILO</div>
            <div className="game-provider">TB GAME</div>
          </div>
        </div>
      </div>

      {/* Slots Section */}
      <div className="game-section">
        <div className="section-header">
          <div className="section-icon">🎰</div>
          <h3 className="section-title">Slots</h3>
          <button className="detail-btn">Detail</button>
        </div>
        <div className="game-grid">
          <div className="game-card purple-gradient">
            <div className="game-artwork">👑</div>
            <div className="game-name">JILI GAME</div>
          </div>
          <div className="game-card blue-gradient">
            <div className="game-artwork">🎯</div>
            <div className="game-name">JDB</div>
          </div>
          <div className="game-card green-gradient">
            <div className="game-artwork">💎</div>
            <div className="game-name">M GAME</div>
          </div>
        </div>
      </div>

      {/* Popular Aviator/Crash Games */}
      <div className="game-section">
        <div className="section-header">
          <h3 className="section-title">Popular Games</h3>
        </div>
        <div className="game-grid">
          <div className="game-card aviator-red" onClick={() => handleGameSelect({name: 'AVIATOR', type: 'aviator', icon: '✈️', multiplier: '500%'})}>
            <div className="multiplier-badge">+500%</div>
            <div className="game-name">AVIATOR</div>
            <div className="game-provider">TB GAME</div>
            <div className="time-badge">10 SEC</div>
          </div>
          <div className="game-card cricket-green" onClick={() => handleGameSelect({name: 'CRICKET', type: 'sports', icon: '🏏'})}>
            <div className="game-name">CRICKET</div>
            <div className="game-provider">TB GAME</div>
          </div>
          <div className="game-card mines-purple" onClick={() => handleGameSelect({name: 'MINES', type: 'mines', icon: '💣'})}>
            <div className="game-name">MINES</div>
            <div className="game-provider">TB GAME</div>
          </div>
        </div>
      </div>

      {/* Today's Earnings Chart */}
      <div className="earnings-section">
        <div className="section-header">
          <div className="section-icon">📊</div>
          <h3 className="section-title">Today's earnings chart</h3>
        </div>
        <div className="podium-chart">
          <div className="podium-item second">
            <div className="avatar">👨</div>
            <div className="position">2</div>
            <div className="username">Mem***QQ8</div>
            <div className="amount">₹1,647,800.40</div>
          </div>
          <div className="podium-item first">
            <div className="avatar">👩</div>
            <div className="position">1</div>
            <div className="username">Mem***IHA</div>
            <div className="amount">₹1,990,770.00</div>
          </div>
          <div className="podium-item third">
            <div className="avatar">👨</div>
            <div className="position">3</div>
            <div className="username">Mem***S5W</div>
            <div className="amount">₹1,363,620.00</div>
          </div>
        </div>
      </div>

      {/* Winning Information */}
      <div className="winning-section">
        <div className="section-header">
          <div className="section-icon">🎯</div>
          <h3 className="section-title">Winning information</h3>
        </div>
        <div className="winning-table">
          <div className="table-header">
            <span>Game</span>
            <span>User</span>
            <span>Winning amount</span>
          </div>
          <div className="winning-row">
            <div className="game-info">
              <div className="game-icon">🎯</div>
              <span>Wickets9</span>
            </div>
            <span>Mem***CND</span>
            <span className="amount">₹600.00</span>
          </div>
          <div className="winning-row">
            <div className="game-info">
              <div className="game-icon">🎯</div>
              <span>Wickets9</span>
            </div>
            <span>Mem***SEL</span>
            <span className="amount">₹10,000.00</span>
          </div>
          <div className="winning-row">
            <div className="game-info">
              <div className="game-icon">🎯</div>
              <span>Wickets9</span>
            </div>
            <span>Mem***WVS</span>
            <span className="amount">₹109.00</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="nav-tab" onClick={() => handleTabChange('promotion')}>
          <Gift className="tab-icon" />
          <span>Promotion</span>
        </div>
        <div className="nav-tab" onClick={() => handleTabChange('activity')}>
          <Activity className="tab-icon" />
          <span>Activity</span>
        </div>
        <div className="nav-tab main active" onClick={() => handleTabChange('lobby')}>
          <Gamepad2 className="tab-icon" />
        </div>
        <div className="nav-tab" onClick={() => setShowWalletModal(true)}>
          <Wallet className="tab-icon" />
          <span>Wallet</span>
        </div>
        <div className="nav-tab" onClick={() => handleTabChange('account')}>
          <User className="tab-icon" />
          <span>Account</span>
        </div>
      </div>

      {/* Game Modal */}
      {showGameModal && selectedGame && (
        <GameModal 
          game={selectedGame}
          onClose={() => setShowGameModal(false)}
          walletBalance={walletBalance}
          onBalanceUpdate={setWalletBalance}
        />
      )}

      {/* Wallet Modal */}
      {showWalletModal && (
        <WalletModal 
          onClose={() => setShowWalletModal(false)}
          balance={walletBalance}
          onBalanceUpdate={setWalletBalance}
        />
      )}
    </div>
  );
}