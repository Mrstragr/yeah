import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { IndianWalletSystem } from './IndianWalletSystem';
import { 
  Home, 
  Gamepad2, 
  Trophy, 
  Wallet, 
  User, 
  Gift,
  Settings,
  Bell,
  Search,
  Star,
  Crown,
  IndianRupee,
  Plus,
  Minus,
  History,
  CreditCard,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Play,
  TrendingUp,
  Target,
  Zap,
  Award,
  Users,
  Clock,
  Shield
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  walletBalance: string;
  bonusBalance: string;
  kycStatus: string;
  vipLevel: number;
  profileImage?: string;
}

interface GameData {
  id: string;
  name: string;
  category: string;
  icon: string;
  isLive?: boolean;
  players?: number;
  minBet?: number;
  maxWin?: string;
}

export function Perfect91ClubMain() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showWallet, setShowWallet] = useState(false);
  const [authData, setAuthData] = useState({
    phone: '',
    password: '',
    email: '',
    confirmPassword: '',
    otp: ''
  });
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // User Profile Query
  const { data: userProfile, isLoading: profileLoading } = useQuery<{user: User}>({
    queryKey: ['/api/auth/profile'],
    enabled: isAuthenticated,
    retry: false,
  });

  // Wallet Balance Query
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ['/api/wallet/balance'],
    enabled: isAuthenticated,
  });

  // Games Data
  const gamesData: GameData[] = [
    { id: 'wingo', name: 'Win Go', category: 'lottery', icon: '🎯', isLive: true, players: 1247, minBet: 10, maxWin: '10,000x' },
    { id: 'k3', name: 'K3 Lotre', category: 'lottery', icon: '🎲', isLive: true, players: 892, minBet: 10, maxWin: '1000x' },
    { id: 'aviator', name: 'Aviator', category: 'crash', icon: '✈️', isLive: true, players: 2156, minBet: 10, maxWin: '100x' },
    { id: 'mines', name: 'Mines', category: 'skill', icon: '💎', isLive: false, players: 567, minBet: 10, maxWin: '24x' },
    { id: 'dragon-tiger', name: 'Dragon Tiger', category: 'cards', icon: '🐉', isLive: true, players: 743, minBet: 10, maxWin: '11x' },
    { id: 'teen-patti', name: 'Teen Patti', category: 'cards', icon: '🃏', isLive: false, players: 334, minBet: 10, maxWin: '40x' },
    { id: 'limbo', name: 'Limbo', category: 'crash', icon: '🚀', isLive: false, players: 198, minBet: 10, maxWin: '1000x' },
    { id: 'plinko', name: 'Plinko', category: 'skill', icon: '⚡', isLive: false, players: 445, minBet: 10, maxWin: '1000x' }
  ];

  // Promotional Data
  const promotions = [
    {
      id: 1,
      title: 'Welcome Bonus',
      description: 'Get 100% bonus on first deposit',
      bonus: '₹500',
      validity: '7 days',
      type: 'deposit'
    },
    {
      id: 2,
      title: 'Daily Check-in',
      description: 'Login daily to get rewards',
      bonus: '₹50',
      validity: '24 hours',
      type: 'daily'
    },
    {
      id: 3,
      title: 'Referral Bonus',
      description: 'Invite friends and earn',
      bonus: '₹200',
      validity: 'Lifetime',
      type: 'referral'
    }
  ];

  // Authentication Mutations
  const loginMutation = useMutation({
    mutationFn: async (credentials: { phone: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token);
        setIsAuthenticated(true);
        setShowAuth(false);
        toast({
          title: 'Login Successful',
          description: 'Welcome back to Perfect91Club!',
        });
        queryClient.invalidateQueries({ queryKey: ['/api/auth/profile'] });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Login Failed',
        description: error.message || 'Please check your credentials',
        variant: 'destructive',
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setShowOtpVerification(true);
      toast({
        title: 'Registration Successful',
        description: 'Please verify your phone number with OTP',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  // Check for existing auth token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only proceed if this is actually a form submission (not a keystroke)
    if (e.type !== 'submit') {
      return;
    }
    
    if (authMode === 'login') {
      if (!authData.phone || !authData.password) {
        toast({
          title: 'Missing Information',
          description: 'Please enter phone and password',
          variant: 'destructive',
        });
        return;
      }
      loginMutation.mutate({
        phone: authData.phone,
        password: authData.password
      });
    } else {
      if (!authData.phone || !authData.email || !authData.password || !authData.confirmPassword) {
        toast({
          title: 'Missing Information',
          description: 'Please fill all required fields',
          variant: 'destructive',
        });
        return;
      }
      if (authData.password !== authData.confirmPassword) {
        toast({
          title: 'Password Mismatch',
          description: 'Passwords do not match',
          variant: 'destructive',
        });
        return;
      }
      registerMutation.mutate({
        phone: authData.phone,
        email: authData.email,
        password: authData.password
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setActiveTab('home');
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
    });
  };

  // Header Component
  const Header = () => (
    <div className="app-header">
      <div className="header-top">
        <div className="brand-section">
          <div className="brand-logo">
            <Crown className="logo-icon" />
            <span className="brand-name">Perfect91Club</span>
          </div>
          <div className="live-indicator">
            <div className="live-dot"></div>
            <span>LIVE</span>
          </div>
        </div>
        
        <div className="header-actions">
          {isAuthenticated && userProfile ? (
            <>
              <div className="balance-display">
                <div className="balance-item">
                  <IndianRupee className="currency-icon" />
                  <span>₹{userProfile.user?.walletBalance || '0'}</span>
                </div>
                <motion.button
                  className="balance-refresh"
                  whileHover={{ rotate: 180 }}
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/auth/profile'] })}
                >
                  <RefreshCw className="refresh-icon" />
                </motion.button>
              </div>
              <motion.button
                className="wallet-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWallet(true)}
              >
                <Wallet className="btn-icon" />
                Wallet
              </motion.button>
            </>
          ) : (
            <motion.button
              className="login-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuth(true)}
            >
              <User className="btn-icon" />
              Login
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );

  // Home Tab Content
  const HomeContent = () => (
    <div className="home-content">
      {/* Promotional Banner */}
      <div className="promotional-banner">
        <motion.div
          className="banner-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="banner-text">
            <h2>🎉 Welcome Bonus</h2>
            <p>Get 100% bonus on your first deposit up to ₹10,000</p>
          </div>
          <motion.button
            className="claim-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('promotion')}
          >
            <Gift className="btn-icon" />
            Claim Now
          </motion.button>
        </motion.div>
      </div>

      {/* Games Grid */}
      <div className="games-section">
        <div className="section-header">
          <h3>Popular Games</h3>
          <motion.button
            className="view-all"
            onClick={() => setActiveTab('games')}
            whileHover={{ x: 5 }}
          >
            View All <ArrowRight className="icon" />
          </motion.button>
        </div>
        
        <div className="games-grid">
          {gamesData.slice(0, 6).map((game, index) => (
            <motion.div
              key={game.id}
              className="game-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => setSelectedGame(game.id)}
            >
              <div className="game-icon">{game.icon}</div>
              <div className="game-info">
                <h4>{game.name}</h4>
                <div className="game-stats">
                  {game.isLive && <span className="live-badge">LIVE</span>}
                  <span className="players">{game.players} playing</span>
                </div>
                <div className="game-details">
                  <span>Min: ₹{game.minBet}</span>
                  <span className="max-win">Max: {game.maxWin}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live Stats */}
      <div className="live-stats">
        <h3>Live Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h4>8,247</h4>
              <p>Players Online</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h4>₹24.5L</h4>
              <p>Today's Winnings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h4>12,450</h4>
              <p>Games Played</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <h4>₹89.2K</h4>
              <p>Biggest Win</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Games Tab Content
  const GamesContent = () => (
    <div className="games-content">
      <div className="games-categories">
        <motion.button className="category-btn active" whileHover={{ scale: 1.05 }}>
          <Gamepad2 className="icon" /> All Games
        </motion.button>
        <motion.button className="category-btn" whileHover={{ scale: 1.05 }}>
          🎯 Lottery
        </motion.button>
        <motion.button className="category-btn" whileHover={{ scale: 1.05 }}>
          🃏 Cards
        </motion.button>
        <motion.button className="category-btn" whileHover={{ scale: 1.05 }}>
          ✈️ Crash
        </motion.button>
        <motion.button className="category-btn" whileHover={{ scale: 1.05 }}>
          💎 Skill
        </motion.button>
      </div>

      <div className="games-grid full">
        {gamesData.map((game, index) => (
          <motion.div
            key={game.id}
            className="game-card detailed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedGame(game.id)}
          >
            <div className="game-header">
              <div className="game-icon large">{game.icon}</div>
              {game.isLive && <div className="live-indicator">LIVE</div>}
            </div>
            <div className="game-content">
              <h4>{game.name}</h4>
              <p className="game-category">{game.category}</p>
              <div className="game-metrics">
                <div className="metric">
                  <Users className="metric-icon" />
                  <span>{game.players}</span>
                </div>
                <div className="metric">
                  <Target className="metric-icon" />
                  <span>₹{game.minBet} min</span>
                </div>
                <div className="metric">
                  <Trophy className="metric-icon" />
                  <span>{game.maxWin}</span>
                </div>
              </div>
            </div>
            <motion.button
              className="play-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="btn-icon" />
              Play Now
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Promotion Tab Content
  const PromotionContent = () => (
    <div className="promotion-content">
      <div className="promotion-header">
        <div className="header-content">
          <Gift className="header-icon" />
          <div className="header-text">
            <h2>Promotions & Bonuses</h2>
            <p>Exclusive offers just for you</p>
          </div>
        </div>
      </div>

      <div className="promotions-grid">
        {promotions.map((promo, index) => (
          <motion.div
            key={promo.id}
            className="promotion-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="promo-header">
              <div className={`promo-icon ${promo.type}`}>
                {promo.type === 'deposit' && <Wallet />}
                {promo.type === 'daily' && <Clock />}
                {promo.type === 'referral' && <Users />}
              </div>
              <div className="promo-badge">{promo.bonus}</div>
            </div>
            <div className="promo-content">
              <h3>{promo.title}</h3>
              <p>{promo.description}</p>
              <div className="promo-validity">
                <Clock className="validity-icon" />
                <span>Valid for {promo.validity}</span>
              </div>
            </div>
            <motion.button
              className="claim-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Claim Bonus
            </motion.button>
          </motion.div>
        ))}
      </div>

      <div className="vip-section">
        <div className="vip-header">
          <Crown className="vip-icon" />
          <div className="vip-text">
            <h3>VIP Program</h3>
            <p>Unlock exclusive benefits and higher limits</p>
          </div>
        </div>
        <div className="vip-levels">
          {[1, 2, 3, 4, 5].map(level => (
            <div key={level} className={`vip-level ${level <= 2 ? 'unlocked' : ''}`}>
              <div className="level-icon">
                <Crown className="crown" />
                <span>{level}</span>
              </div>
              <div className="level-benefits">
                <h4>VIP Level {level}</h4>
                <p>Weekly bonus: ₹{level * 1000}</p>
                <p>Cashback: {level * 2}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Account Tab Content
  const AccountContent = () => (
    <div className="account-content">
      {isAuthenticated && userProfile ? (
        <>
          <div className="profile-section">
            <div className="profile-header">
              <div className="profile-avatar">
                <User className="avatar-icon" />
              </div>
              <div className="profile-info">
                <h3>{userProfile.user?.username || 'User'}</h3>
                <p>{userProfile.user?.phone}</p>
                <div className="profile-status">
                  <div className={`status-badge ${userProfile.user?.kycStatus || 'pending'}`}>
                    {userProfile.user?.kycStatus === 'verified' ? (
                      <>
                        <CheckCircle2 className="status-icon" />
                        Verified
                      </>
                    ) : (
                      <>
                        <AlertCircle className="status-icon" />
                        Pending
                      </>
                    )}
                  </div>
                  <div className="vip-badge">
                    <Crown className="vip-icon" />
                    VIP {userProfile.user?.vipLevel || 1}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="account-menu">
            <div className="menu-section">
              <h4>Wallet & Transactions</h4>
              <div className="menu-items">
                <motion.button
                  className="menu-item"
                  whileHover={{ x: 5 }}
                  onClick={() => setShowWallet(true)}
                >
                  <Wallet className="menu-icon" />
                  <span>My Wallet</span>
                  <ArrowRight className="arrow" />
                </motion.button>
                <motion.button className="menu-item" whileHover={{ x: 5 }}>
                  <History className="menu-icon" />
                  <span>Transaction History</span>
                  <ArrowRight className="arrow" />
                </motion.button>
                <motion.button className="menu-item" whileHover={{ x: 5 }}>
                  <Trophy className="menu-icon" />
                  <span>Game History</span>
                  <ArrowRight className="arrow" />
                </motion.button>
              </div>
            </div>

            <div className="menu-section">
              <h4>Account Settings</h4>
              <div className="menu-items">
                <motion.button className="menu-item" whileHover={{ x: 5 }}>
                  <Shield className="menu-icon" />
                  <span>KYC Verification</span>
                  <ArrowRight className="arrow" />
                </motion.button>
                <motion.button className="menu-item" whileHover={{ x: 5 }}>
                  <Lock className="menu-icon" />
                  <span>Change Password</span>
                  <ArrowRight className="arrow" />
                </motion.button>
                <motion.button className="menu-item" whileHover={{ x: 5 }}>
                  <Bell className="menu-icon" />
                  <span>Notifications</span>
                  <ArrowRight className="arrow" />
                </motion.button>
              </div>
            </div>

            <div className="menu-section">
              <h4>Support & Information</h4>
              <div className="menu-items">
                <motion.button className="menu-item" whileHover={{ x: 5 }}>
                  <Settings className="menu-icon" />
                  <span>Settings</span>
                  <ArrowRight className="arrow" />
                </motion.button>
                <motion.button className="menu-item" whileHover={{ x: 5 }}>
                  <Phone className="menu-icon" />
                  <span>Customer Support</span>
                  <ArrowRight className="arrow" />
                </motion.button>
              </div>
            </div>

            <motion.button
              className="logout-btn"
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Logout
            </motion.button>
          </div>
        </>
      ) : (
        <div className="login-prompt">
          <div className="prompt-content">
            <User className="prompt-icon" />
            <h3>Please Login</h3>
            <p>Login to access your account and manage your profile</p>
            <motion.button
              className="login-btn"
              onClick={() => setShowAuth(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login Now
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );

  // Bottom Navigation
  const BottomNav = () => (
    <div className="bottom-nav">
      {[
        { id: 'home', label: 'Home', icon: Home },
        { id: 'games', label: 'Games', icon: Gamepad2 },
        { id: 'promotion', label: 'Promotion', icon: Gift },
        { id: 'account', label: 'Account', icon: User }
      ].map(tab => (
        <motion.button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <tab.icon className="tab-icon" />
          <span>{tab.label}</span>
        </motion.button>
      ))}
    </div>
  );

  // Authentication Modal
  const AuthModal = () => (
    <AnimatePresence>
      {showAuth && (
        <div className="auth-overlay">
          <motion.div
            className="auth-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="auth-header">
              <h2>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <button className="close-btn" onClick={() => setShowAuth(false)}>×</button>
            </div>

            <form onSubmit={handleAuthSubmit} className="auth-form">
              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-group">
                  <Phone className="input-icon" />
                  <input
                    type="tel"
                    placeholder="9876543210 (Demo)"
                    value={authData.phone}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setAuthData(prev => ({ ...prev, phone: newValue }));
                    }}
                    onKeyDown={(e) => {
                      // Allow all normal typing
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAuthSubmit(e as any);
                      }
                    }}
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-group">
                    <Mail className="input-icon" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={authData.email}
                      onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Password</label>
                <div className="input-group">
                  <Lock className="input-icon" />
                  <input
                    type="password"
                    placeholder="demo123 (Demo Password)"
                    value={authData.password}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setAuthData(prev => ({ ...prev, password: newValue }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAuthSubmit(e as any);
                      }
                    }}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-group">
                    <Lock className="input-icon" />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={authData.confirmPassword}
                      onChange={(e) => setAuthData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>
              )}

              <motion.button
                type="submit"
                className="auth-submit"
                disabled={loginMutation.isPending || registerMutation.isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {(loginMutation.isPending || registerMutation.isPending) ? (
                  <RefreshCw className="loading-icon spin" />
                ) : (
                  authMode === 'login' ? 'Login' : 'Register'
                )}
              </motion.button>

              {authMode === 'login' && (
                <div className="demo-info">
                  <div className="demo-card">
                    <h4>Demo Account</h4>
                    <p>Phone: 9876543210</p>
                    <p>Password: demo123</p>
                    <motion.button
                      type="button"
                      className="demo-login-btn"
                      onClick={() => {
                        setAuthData(prev => ({
                          ...prev,
                          phone: '9876543210',
                          password: 'demo123'
                        }));
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Fill Demo Details
                    </motion.button>
                  </div>
                </div>
              )}

              <div className="auth-switch">
                <p>
                  {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  >
                    {authMode === 'login' ? 'Register' : 'Login'}
                  </button>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="perfect91club-app">
      <Header />
      
      <div className="app-content">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <HomeContent />
            </motion.div>
          )}
          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <GamesContent />
            </motion.div>
          )}
          {activeTab === 'promotion' && (
            <motion.div
              key="promotion"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <PromotionContent />
            </motion.div>
          )}
          {activeTab === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AccountContent />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
      <AuthModal />
    </div>
  );
}