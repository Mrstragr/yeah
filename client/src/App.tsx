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
  Copy,
  MoreHorizontal
} from 'lucide-react';
import { GameModal } from './components/GameModal';
import { WalletModal } from './components/WalletModal';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [walletBalance, setWalletBalance] = useState(0.39);
  const [selectedGame, setSelectedGame] = useState<{id: string, name: string, type: 'lottery' | 'mini' | 'recommended' | 'slot'} | null>(null);
  const [walletModal, setWalletModal] = useState<{type: 'deposit' | 'withdraw', isOpen: boolean}>({type: 'deposit', isOpen: false});

  const handleTransaction = (amount: number, type: 'deposit' | 'withdraw') => {
    if (type === 'deposit') {
      setWalletBalance(prev => prev + amount);
    } else {
      setWalletBalance(prev => prev - amount);
    }
  };

  const HomeScreen = () => (
    <div className="app-container">
      {/* Exact Header Match */}
      <div className="header-section">
        <div className="header-top">
          <div className="logo-text">91CLUB</div>
          <Bell className="notification-icon" />
        </div>
        
        {/* Info Banner - Exact Match */}
        <div className="info-banner">
          <div className="info-content">
            <div className="info-text-line">Only deposit funds through the official 91CLUB website and you can</div>
            <div className="info-text-line">check from our alternative link at 91club.com the page are similar in look</div>
          </div>
          <div className="info-logo">91</div>
        </div>

        {/* Balance Card - Exact Match */}
        <div className="balance-card">
          <div className="balance-label">Wallet balance</div>
          <div className="balance-amount">₹{walletBalance.toFixed(2)}</div>
        </div>

        {/* Action Buttons - Exact Match */}
        <div className="action-buttons">
          <button 
            className="withdraw-btn"
            onClick={() => setWalletModal({type: 'withdraw', isOpen: true})}
          >
            Withdraw
          </button>
          <button 
            className="deposit-btn"
            onClick={() => setWalletModal({type: 'deposit', isOpen: true})}
          >
            Deposits
          </button>
        </div>

        {/* Feature Cards - Exact Match */}
        <div className="feature-cards">
          <div className="wheel-card">
            <div className="feature-title">Wheel</div>
            <div className="feature-subtitle">of fortune</div>
          </div>
          <div className="vip-card">
            <div className="feature-title">VIP</div>
            <div className="feature-subtitle">privileges</div>
          </div>
        </div>
      </div>

      {/* Category Navigation - Exact Match */}
      <div className="category-section">
        <div className="category-list">
          {[
            { name: 'Lobby', active: true },
            { name: 'PK', active: false },
            { name: 'Mines', active: false },
            { name: 'Original', active: false },
            { name: 'Fishing', active: false },
            { name: 'Lottery', active: false }
          ].map((cat) => (
            <div key={cat.name} className="category-item">
              <div className={`category-circle ${cat.active ? 'active' : ''}`}>
                {cat.name === 'Lobby' && '🏠'}
                {cat.name === 'PK' && '⚔️'}
                {cat.name === 'Mines' && '💎'}
                {cat.name === 'Original' && '🎯'}
                {cat.name === 'Fishing' && '🎣'}
                {cat.name === 'Lottery' && '🎰'}
              </div>
              <div className={`category-name ${cat.active ? 'active' : ''}`}>{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Content - Exact Match */}
      <div className="content-section">
        {/* Lottery Section */}
        <div className="game-section">
          <div className="section-header">
            <div className="section-left">
              <div className="red-dot"></div>
              <span className="section-title">Lottery</span>
            </div>
            <div className="section-right">
              <span className="detail-text">Detail</span>
              <ChevronRight className="chevron" />
            </div>
          </div>
          
          <div className="lottery-games">
            <div 
              className="lottery-item blue-lottery"
              onClick={() => setSelectedGame({id: 'wingo', name: 'WIN GO', type: 'lottery'})}
            >
              <div className="lottery-title">WIN GO</div>
              <div className="lottery-number">1</div>
            </div>
            <div 
              className="lottery-item pink-lottery"
              onClick={() => setSelectedGame({id: 'k3', name: 'K3 Lotre', type: 'lottery'})}
            >
              <div className="lottery-title">K3</div>
              <div className="lottery-subtitle">Lotre</div>
            </div>
            <div 
              className="lottery-item green-lottery"
              onClick={() => setSelectedGame({id: '5d', name: '5D Lotre', type: 'lottery'})}
            >
              <div className="lottery-title">5D</div>
              <div className="lottery-subtitle">Lotre</div>
            </div>
            <div 
              className="lottery-item purple-lottery"
              onClick={() => setSelectedGame({id: 'trx', name: 'TRX WINGO', type: 'lottery'})}
            >
              <div className="lottery-title-small">TRX WINGO</div>
              <div className="lottery-subtitle-small">Win</div>
            </div>
          </div>
        </div>

        {/* MOTO RACING Banner */}
        <div className="moto-banner">
          <div className="moto-text">MOTO RACING</div>
        </div>

        {/* Mini Games */}
        <div className="game-section">
          <div className="section-header">
            <div className="section-left">
              <div className="purple-dot"></div>
              <span className="section-title">Mini game</span>
            </div>
            <div className="section-right">
              <span className="detail-text">Detail</span>
              <ChevronRight className="chevron" />
            </div>
          </div>
          
          <div className="mini-games">
            <div 
              className="mini-item blue-mini"
              onClick={() => setSelectedGame({id: 'dragontiger', name: 'DRAGON TIGER', type: 'mini'})}
            >
              <div className="mini-title-two">DRAGON</div>
              <div className="mini-title-two">TIGER</div>
            </div>
            <div 
              className="mini-item green-mini"
              onClick={() => setSelectedGame({id: 'goal', name: 'GOAL', type: 'mini'})}
            >
              <div className="mini-title">GOAL</div>
            </div>
            <div 
              className="mini-item purple-mini"
              onClick={() => setSelectedGame({id: 'dice', name: 'DICE', type: 'mini'})}
            >
              <div className="mini-title">DICE</div>
            </div>
          </div>
        </div>

        {/* Recommended Games */}
        <div className="game-section">
          <div className="section-header">
            <div className="section-left">
              <div className="yellow-dot"></div>
              <span className="section-title">Recommended Games</span>
            </div>
            <div className="section-right">
              <ChevronRight className="chevron" />
            </div>
          </div>
          
          <div className="recommended-games">
            <div 
              className="rec-item red-rec"
              onClick={() => setSelectedGame({id: 'aviator', name: 'AVIATOR', type: 'recommended'})}
            >
              <div className="rec-title">AVIATOR</div>
              <div className="rec-subtitle">x500+</div>
            </div>
            <div 
              className="rec-item purple-rec"
              onClick={() => setSelectedGame({id: 'mines', name: 'MINES', type: 'recommended'})}
            >
              <div className="rec-title">MINES</div>
            </div>
            <div 
              className="rec-item green-rec"
              onClick={() => setSelectedGame({id: 'goal2', name: 'GOAL', type: 'recommended'})}
            >
              <div className="rec-title">GOAL</div>
            </div>
          </div>
        </div>

        {/* Slots */}
        <div className="game-section">
          <div className="section-header">
            <div className="section-left">
              <div className="orange-dot"></div>
              <span className="section-title">Slots</span>
            </div>
            <div className="section-right">
              <span className="detail-text">Detail</span>
              <ChevronRight className="chevron" />
            </div>
          </div>
          
          <div className="slots-games">
            <div 
              className="slot-item"
              onClick={() => setSelectedGame({id: 'jili', name: 'JILI SLOTS', type: 'slot'})}
            >
              <div className="slot-preview purple-slot">JILI</div>
            </div>
            <div 
              className="slot-item"
              onClick={() => setSelectedGame({id: 'jdb', name: 'JDB SLOTS', type: 'slot'})}
            >
              <div className="slot-preview blue-slot">JDB</div>
            </div>
            <div 
              className="slot-item"
              onClick={() => setSelectedGame({id: 'cq9', name: 'CQ9 SLOTS', type: 'slot'})}
            >
              <div className="slot-preview orange-slot">CQ9</div>
            </div>
          </div>
        </div>

        {/* Rummy */}
        <div className="game-section">
          <div className="section-header">
            <div className="section-left">
              <div className="red-dot"></div>
              <span className="section-title">Rummy</span>
            </div>
            <div className="section-right">
              <span className="detail-text">Detail</span>
              <ChevronRight className="chevron" />
            </div>
          </div>
          
          <div className="rummy-game">
            <div 
              className="rummy-card"
              onClick={() => setSelectedGame({id: 'rummy', name: 'RUMMY 505', type: 'slot'})}
            >
              505
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ActivityScreen = () => (
    <div className="app-container">
      <div className="header-section">
        <div className="header-top">
          <div className="logo-text">91CLUB</div>
        </div>
        <div className="page-title">Activity</div>
        <div className="page-description">
          <div>Please remember to follow the event page</div>
          <div>We will launch new feedback activities from time to time!</div>
        </div>
      </div>

      <div className="content-section">
        <div className="activity-grid-top">
          {[
            { name: 'Activity Award', icon: '🏆', bg: 'orange-bg' },
            { name: 'Invitation bonus', icon: '👥', bg: 'blue-bg' },
            { name: 'Betting mobile', icon: '📱', bg: 'yellow-bg' },
            { name: 'Super Jackpot', icon: '💰', bg: 'green-bg' }
          ].map((item) => (
            <div key={item.name} className="activity-item">
              <div className={`activity-icon ${item.bg}`}>{item.icon}</div>
              <div className="activity-label">{item.name}</div>
            </div>
          ))}
        </div>

        <div className="activity-center">
          <div className="activity-icon purple-bg">🎁</div>
          <div className="activity-label">First gift</div>
        </div>

        <div className="activity-banners">
          <div className="banner red-banner">
            <div className="banner-title">Gifts</div>
            <div className="banner-desc">Enter the redemption code to receive gift rewards</div>
          </div>
          <div className="banner orange-banner">
            <div className="banner-title">Attendance bonus</div>
            <div className="banner-desc">The more consecutive days you sign in, the higher the reward will be</div>
          </div>
          <div className="banner white-banner">
            <div className="banner-title red-text">Benefits of Using ARWALLET</div>
          </div>
          <div className="banner yellow-banner">
            <div className="banner-title">New Member First Deposit Bonus</div>
          </div>
        </div>
      </div>
    </div>
  );

  const WalletScreen = () => (
    <div className="app-container">
      <div className="header-section">
        <div className="header-top">
          <ArrowLeft className="back-icon" />
          <div className="page-title">Wallet</div>
        </div>
        
        <div className="wallet-info">
          <div className="wallet-icon-container">
            <Wallet className="wallet-icon" />
          </div>
          <div className="wallet-balance">₹{walletBalance.toFixed(2)}</div>
          <div className="wallet-label">Total balance</div>
          
          <div className="wallet-stats">
            <div className="stat-item">
              <div className="stat-number">156816</div>
              <div className="stat-label">Total deposit</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">167805</div>
              <div className="stat-label">Total withdrawal</div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="wallet-transfer-card">
          <div className="transfer-info">
            <div className="main-wallet">
              <div className="transfer-percent">0%</div>
              <div className="transfer-amount">₹0.00</div>
              <div className="transfer-label">Main wallet</div>
            </div>
            <div className="circle-progress">
              <div className="progress-circle">100%</div>
            </div>
            <div className="third-party-wallet">
              <div className="transfer-amount red">₹0.39</div>
              <div className="transfer-label">3rd party wallet</div>
            </div>
          </div>
          <button className="transfer-btn">Main wallet transfer</button>
        </div>

        <div className="wallet-actions">
          {[
            { name: 'Deposit', icon: '💳' },
            { name: 'Withdraw', icon: '💰' },
            { name: 'Deposit history', icon: '📊' },
            { name: 'Withdrawal history', icon: '📈' }
          ].map((action) => (
            <div key={action.name} className="wallet-action">
              <div className="action-icon">{action.icon}</div>
              <div className="action-name">{action.name}</div>
            </div>
          ))}
        </div>

        <div className="wallet-games">
          <button className="game-btn active">
            <div className="game-number">6.49</div>
            <div className="game-name">All Game</div>
          </button>
          <button className="game-btn">
            <div className="game-number">6.38</div>
            <div className="game-name">Evolution</div>
          </button>
        </div>
      </div>
    </div>
  );

  const AccountScreen = () => (
    <div className="app-container">
      <div className="header-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <User className="avatar-icon" />
          </div>
          <div className="profile-info">
            <div className="profile-name">ANURAG KUMAR</div>
            <div className="profile-copy">🎯 Copy</div>
            <div className="profile-uid">UID: 396313</div>
            <div className="profile-login">Last login: 2025-06-13 19:34:40</div>
          </div>
        </div>

        <div className="balance-card">
          <div className="balance-label">Total balance</div>
          <div className="balance-amount">₹{walletBalance.toFixed(2)}</div>
        </div>
      </div>

      <div className="content-section">
        <div className="account-actions">
          {[
            { name: 'ARWallet', icon: '💳' },
            { name: 'Deposit', icon: '💰' },
            { name: 'Withdraw', icon: '📤' },
            { name: 'VIP', icon: '👑' }
          ].map((action) => (
            <div key={action.name} className="account-action">
              <div className="action-icon">{action.icon}</div>
              <div className="action-name">{action.name}</div>
            </div>
          ))}
        </div>

        <div className="menu-list">
          {[
            { icon: '📊', title: 'Game History', subtitle: 'My game history' },
            { icon: '💳', title: 'Transaction', subtitle: 'My transaction history' },
            { icon: '💰', title: 'Deposit', subtitle: 'My deposit history' },
            { icon: '📤', title: 'Withdraw', subtitle: 'My withdraw history' },
            { icon: '🔔', title: 'Notification', badge: '33' },
            { icon: '🎁', title: 'Gifts' },
            { icon: '📈', title: 'Game statistics' },
            { icon: '🌐', title: 'Language', value: 'English' }
          ].map((item, index) => (
            <div key={index} className="menu-item">
              <div className="menu-left">
                <div className="menu-icon">{item.icon}</div>
                <div className="menu-text">
                  <div className="menu-title">{item.title}</div>
                  {item.subtitle && <div className="menu-subtitle">{item.subtitle}</div>}
                </div>
              </div>
              <div className="menu-right">
                {item.badge && <div className="menu-badge">{item.badge}</div>}
                {item.value && <div className="menu-value">{item.value}</div>}
                <ChevronRight className="menu-chevron" />
              </div>
            </div>
          ))}
        </div>

        <div className="service-section">
          <div className="service-title">Service center</div>
          <div className="service-grid">
            {[
              { name: 'Settings', icon: '⚙️' },
              { name: 'Feedback', icon: '💬' },
              { name: 'Announcement', icon: '📢' },
              { name: 'Customer Service', icon: '🎧' },
              { name: "Beginner's Guide", icon: '📖' },
              { name: 'About us', icon: '👥' }
            ].map((service) => (
              <div key={service.name} className="service-item">
                <div className="service-icon">{service.icon}</div>
                <div className="service-name">{service.name}</div>
              </div>
            ))}
          </div>
        </div>

        <button className="logout-btn">
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  const PromotionScreen = () => (
    <div className="app-container">
      <div className="header-section">
        <div className="header-top">
          <div className="logo-text">Agency</div>
          <div className="agency-icon">🎯</div>
        </div>
      </div>

      <div className="content-section">
        <div className="commission-card">
          <div className="commission-amount">0</div>
          <div className="commission-label">Yesterday's total commission</div>
          <div className="commission-subtitle">Upgrade the level to increase commission percentage</div>
          
          <div className="commission-actions">
            <div className="commission-item">Direct subordinates</div>
            <div className="commission-item">Team subordinates</div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">number of register</div>
            <div className="stat-number">0</div>
            <div className="stat-label">Deposit Number</div>
            <div className="stat-title">Deposit amount</div>
            <div className="stat-number">0</div>
            <div className="stat-label">Number of people making first deposit</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">number of register</div>
            <div className="stat-number">0</div>
            <div className="stat-label">Deposit Number</div>
            <div className="stat-title">Deposit amount</div>
            <div className="stat-number">0</div>
            <div className="stat-label">Number of people making first deposit</div>
          </div>
        </div>

        <button className="invitation-link-btn">INVITATION LINK</button>

        <div className="promotion-menu">
          {[
            { icon: '🏆', title: 'Partner rewards' },
            { icon: '📋', title: 'Copy invitation code', code: '3654752684217' },
            { icon: '👥', title: 'Subordinate data' },
            { icon: '💰', title: 'Commission detail' },
            { icon: '📋', title: 'Invitation rules' },
            { icon: '🎧', title: 'Agent line customer service' }
          ].map((item, index) => (
            <div key={index} className="promotion-item">
              <div className="promotion-left">
                <div className="promotion-icon">{item.icon}</div>
                <div className="promotion-title">{item.title}</div>
              </div>
              <div className="promotion-right">
                {item.code && (
                  <>
                    <div className="invitation-code">{item.code}</div>
                    <Copy className="copy-icon" />
                  </>
                )}
                <ChevronRight className="promotion-chevron" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'activity': return <ActivityScreen />;
      case 'promotion': return <PromotionScreen />;
      case 'wallet': return <WalletScreen />;
      case 'account': return <AccountScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="app-wrapper">
      {renderScreen()}

      {/* Bottom Navigation - Exact Match */}
      <div className="bottom-navigation">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'activity', icon: Activity, label: 'Activity' },
          { id: 'promotion', icon: Gift, label: 'Promotion' },
          { id: 'wallet', icon: Wallet, label: 'Wallet' },
          { id: 'account', icon: User, label: 'Account' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <div className="nav-icon-wrapper">
              <tab.icon className="nav-icon" />
            </div>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Game Modal */}
      {selectedGame && (
        <GameModal
          game={selectedGame}
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}

      {/* Wallet Modal */}
      <WalletModal
        type={walletModal.type}
        isOpen={walletModal.isOpen}
        onClose={() => setWalletModal({...walletModal, isOpen: false})}
        currentBalance={walletBalance}
        onTransaction={handleTransaction}
      />
    </div>
  );
}

export default App;