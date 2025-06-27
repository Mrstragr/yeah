import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { LoadingScreen } from './LoadingScreen';

// Enhanced Game Components
import { StandardAviatorGame } from './StandardAviatorGame';
import { StandardMinesGame } from './StandardMinesGame';
import { StandardDragonTigerGame } from './StandardDragonTigerGame';
import { StandardWinGoGame } from './StandardWinGoGame';
import { StandardTeenPattiGame } from './StandardTeenPattiGame';
import { StandardLimboGame } from './StandardLimboGame';
import { StandardPlinkoGame } from './StandardPlinkoGame';

// Platform Components
import { EnhancedGameGrid } from './EnhancedGameGrid';
import { EnhancedBottomNav } from './EnhancedBottomNav';
import { WalletPage } from './WalletPage';
import { KYCPage } from './KYCPage';
import { AdvancedLoginSystem } from './AdvancedLoginSystem';
import { EnhancedWalletSystem } from './EnhancedWalletSystem';

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  walletBalance: string;
  bonusBalance: string;
  kycStatus: string;
  vipLevel: number;
}

export const ProductionReadyPlatform = () => {
  const [activeTab, setActiveTab] = useState('main');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('lobby');
  const [showKYC, setShowKYC] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: userProfile, isLoading: profileLoading } = useQuery<{user: User}>({
    queryKey: ['/api/auth/profile'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const refreshBalance = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ['/api/auth/profile'] });
      toast({
        title: 'Balance Updated',
        description: 'Your wallet balance has been refreshed',
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Could not refresh balance. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleGameSelect = (gameId: string) => {
    // Check if user is authenticated
    if (!userProfile?.user) {
      toast({
        title: 'Login Required',
        description: 'Please login to play games',
        variant: 'destructive',
      });
      return;
    }

    // Check minimum balance for games
    const currentBalance = parseFloat(userProfile.user.walletBalance);
    if (currentBalance < 10) {
      toast({
        title: 'Insufficient Balance',
        description: 'Minimum ₹10 required to play. Please add money to your wallet.',
        variant: 'destructive',
      });
      setActiveTab('wallet');
      return;
    }

    setSelectedGame(gameId);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedGame(null);
    
    // Handle special cases
    if (tab === 'wallet' && userProfile?.user?.kycStatus !== 'verified') {
      toast({
        title: 'KYC Required',
        description: 'Complete KYC verification for secure transactions',
        action: (
          <button 
            onClick={() => setShowKYC(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Verify Now
          </button>
        ),
      });
    }
  };

  const renderGameComponent = () => {
    const gameProps = {
      onClose: () => setSelectedGame(null),
      refreshBalance: refreshBalance
    };

    switch (selectedGame) {
      case 'aviator':
        return <StandardAviatorGame {...gameProps} />;
      case 'mines':
        return <StandardMinesGame {...gameProps} />;
      case 'dragon-tiger':
        return <StandardDragonTigerGame {...gameProps} />;
      case 'wingo':
      case 'k3':
      case '5d':
        return <StandardWinGoGame {...gameProps} />;
      case 'teen-patti':
        return <StandardTeenPattiGame {...gameProps} />;
      case 'limbo':
        return <StandardLimboGame {...gameProps} />;
      case 'plinko':
        return <StandardPlinkoGame {...gameProps} />;
      default:
        return null;
    }
  };

  const renderMainContent = () => {
    if (selectedGame) {
      return renderGameComponent();
    }

    switch (activeTab) {
      case 'main':
        return (
          <div className="main-content">
            {/* Header Section */}
            <div className="platform-header">
              <div className="header-content">
                <div className="brand-section">
                  <h1 className="brand-title">Perfect91Club</h1>
                  <p className="brand-subtitle">Premium Gaming Experience</p>
                </div>
                
                <div className="user-section">
                  {userProfile?.user ? (
                    <div className="user-info">
                      <div className="user-avatar">
                        {userProfile.user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <span className="username">{userProfile.user.username}</span>
                        <div className="vip-badge">VIP {userProfile.user.vipLevel}</div>
                      </div>
                    </div>
                  ) : (
                    <button 
                      className="login-button"
                      onClick={() => setShowLoginDialog(true)}
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>

              {/* Balance Cards */}
              {userProfile?.user && (
                <div className="balance-cards">
                  <div className="balance-card main-balance">
                    <div className="balance-icon">💰</div>
                    <div className="balance-info">
                      <span className="balance-label">Wallet Balance</span>
                      <span className="balance-amount">₹{userProfile.user.walletBalance}</span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('wallet')}
                      className="add-money-btn"
                    >
                      +
                    </button>
                  </div>

                  <div className="balance-card bonus-balance">
                    <div className="balance-icon">🎁</div>
                    <div className="balance-info">
                      <span className="balance-label">Bonus Balance</span>
                      <span className="balance-amount">₹{userProfile.user.bonusBalance}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Tabs */}
              <div className="category-tabs">
                {[
                  { id: 'lobby', name: 'Lobby', icon: '🏠' },
                  { id: 'popular', name: 'Popular', icon: '🔥' },
                  { id: 'crash', name: 'Crash', icon: '✈️' },
                  { id: 'casino', name: 'Casino', icon: '🎰' },
                  { id: 'lottery', name: 'Lottery', icon: '🎫' },
                  { id: 'sports', name: 'Sports', icon: '🏏' },
                ].map(category => (
                  <button
                    key={category.id}
                    className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Games Grid */}
            <EnhancedGameGrid 
              onGameSelect={handleGameSelect}
              selectedCategory={selectedCategory}
            />
          </div>
        );

      case 'wallet':
        return <EnhancedWalletSystem />;

      case 'promotion':
        return <PromotionPage onClose={() => setActiveTab('main')} />;

      case 'activity':
        return <ActivityPage onClose={() => setActiveTab('main')} />;

      case 'account':
        return <AccountPage onClose={() => setActiveTab('main')} />;

      default:
        return null;
    }
  };

  // Loading Screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="production-platform">
      {/* Main Content */}
      <div className="platform-content">
        {renderMainContent()}
      </div>

      {/* KYC Modal */}
      {showKYC && (
        <div className="modal-overlay">
          <KYCPage onClose={() => setShowKYC(false)} />
        </div>
      )}

      {/* Enhanced Bottom Navigation */}
      <EnhancedBottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userBalance={userProfile?.user?.walletBalance || '0.00'}
        bonusBalance={userProfile?.user?.bonusBalance || '0.00'}
      />

      <style>{`
        .production-platform {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          color: white;
          position: relative;
        }

        .platform-content {
          padding-bottom: 100px; /* Space for bottom nav */
          min-height: 100vh;
        }

        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loading-content {
          text-align: center;
          color: white;
        }

        .loading-logo {
          margin-bottom: 40px;
        }

        .logo-icon {
          font-size: 60px;
          margin-bottom: 20px;
          animation: logoFloat 3s ease-in-out infinite;
        }

        .loading-logo h2 {
          font-size: 28px;
          font-weight: bold;
          background: linear-gradient(45deg, #10b981, #3b82f6);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .loading-spinner {
          margin: 30px 0;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255,255,255,0.1);
          border-left: 4px solid #10b981;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        .loading-text {
          font-size: 16px;
          opacity: 0.8;
          margin: 20px 0;
        }

        .loading-progress {
          width: 200px;
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          margin: 0 auto;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #3b82f6);
          border-radius: 2px;
          animation: loadingProgress 2s ease-in-out infinite;
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes loadingProgress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 100%; transform: translateX(100%); }
        }

        .main-content {
          min-height: 100vh;
        }

        .platform-header {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          padding: 20px;
          margin-bottom: 0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .brand-section {
          flex: 1;
        }

        .brand-title {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
          background: linear-gradient(45deg, #fbbf24, #f59e0b);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-subtitle {
          font-size: 12px;
          opacity: 0.8;
          margin: 5px 0 0 0;
        }

        .user-section {
          display: flex;
          align-items: center;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, #10b981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .username {
          font-size: 14px;
          font-weight: 600;
        }

        .vip-badge {
          background: linear-gradient(45deg, #fbbf24, #f59e0b);
          color: black;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 8px;
          border-radius: 10px;
        }

        .login-button {
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
        }

        .balance-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }

        .balance-card {
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .balance-icon {
          font-size: 24px;
          width: 45px;
          height: 45px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .balance-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .balance-label {
          font-size: 11px;
          opacity: 0.8;
          margin-bottom: 4px;
        }

        .balance-amount {
          font-size: 16px;
          font-weight: bold;
        }

        .add-money-btn {
          width: 30px;
          height: 30px;
          background: linear-gradient(45deg, #10b981, #059669);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .category-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 5px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .category-tabs::-webkit-scrollbar {
          display: none;
        }

        .category-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 15px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 70px;
          backdrop-filter: blur(5px);
        }

        .category-tab.active {
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.4);
          transform: translateY(-2px);
        }

        .category-icon {
          font-size: 16px;
        }

        .category-name {
          font-size: 10px;
          font-weight: 500;
          white-space: nowrap;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(5px);
        }

        @media (max-width: 768px) {
          .platform-header {
            padding: 15px;
          }

          .header-content {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .brand-title {
            font-size: 20px;
          }

          .balance-cards {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .category-tabs {
            gap: 6px;
          }

          .category-tab {
            min-width: 60px;
            padding: 8px 12px;
          }
        }
      `}</style>
      
      {/* Advanced Login System */}
      <AdvancedLoginSystem
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onLoginSuccess={(token) => {
          localStorage.setItem('authToken', token);
          setShowLoginDialog(false);
          queryClient.invalidateQueries({ queryKey: ['/api/auth/profile'] });
          toast({
            title: "Welcome to Perfect91Club!",
            description: "You have successfully logged in"
          });
        }}
      />
    </div>
  );
};

// Placeholder components for missing pages
const PromotionPage = ({ onClose }: { onClose: () => void }) => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <button onClick={onClose}>← Back</button>
    <h2>🎁 Promotions</h2>
    <p>Exciting offers coming soon!</p>
  </div>
);

const ActivityPage = ({ onClose }: { onClose: () => void }) => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <button onClick={onClose}>← Back</button>
    <h2>📊 Activity</h2>
    <p>Your gaming activity will appear here.</p>
  </div>
);

const AccountPage = ({ onClose }: { onClose: () => void }) => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <button onClick={onClose}>← Back</button>
    <h2>👤 Account</h2>
    <p>Manage your account settings.</p>
  </div>
);