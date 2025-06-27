import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, 
  Trophy, 
  Gift, 
  Bell, 
  Settings, 
  User, 
  TrendingUp, 
  Star,
  Crown,
  Zap,
  Shield,
  Award,
  Target,
  Gamepad2,
  Coins,
  IndianRupee,
  Smartphone,
  CreditCard,
  Building2,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Users
} from 'lucide-react';

// Enhanced Indian Gaming Platform Component
export function PremiumGamingPlatform() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [isVIP, setIsVIP] = useState(false);
  const [gameCategory, setGameCategory] = useState('trending');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // User Profile Query
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/auth/profile'],
    retry: false,
  });

  // Wallet Balance Query
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ['/api/wallet/balance'],
    enabled: !!userProfile?.user,
  });

  // Enhanced Game Categories with Indian Market Focus
  const gameCategories = [
    { 
      id: 'trending', 
      name: 'Trending', 
      icon: '🔥', 
      color: 'from-red-500 to-orange-500',
      description: 'Most popular games right now'
    },
    { 
      id: 'teen-patti', 
      name: 'Teen Patti', 
      icon: '🃏', 
      color: 'from-purple-500 to-pink-500',
      description: 'Traditional Indian card games'
    },
    { 
      id: 'crash', 
      name: 'Crash Games', 
      icon: '✈️', 
      color: 'from-blue-500 to-cyan-500',
      description: 'High-risk, high-reward games'
    },
    { 
      id: 'slots', 
      name: 'Slots', 
      icon: '🎰', 
      color: 'from-green-500 to-emerald-500',
      description: 'Lucky spinning machines'
    },
    { 
      id: 'lottery', 
      name: 'Lottery', 
      icon: '🎫', 
      color: 'from-yellow-500 to-amber-500',
      description: 'Win big with lucky numbers'
    },
    { 
      id: 'live', 
      name: 'Live Casino', 
      icon: '🎬', 
      color: 'from-indigo-500 to-purple-500',
      description: 'Real dealers, real excitement'
    }
  ];

  // Enhanced Games with Better Graphics and Descriptions
  const enhancedGames = [
    {
      id: 'aviator',
      name: 'Aviator',
      category: ['trending', 'crash'],
      description: 'Watch the plane soar and cash out before it crashes!',
      thumbnail: '✈️',
      gradient: 'from-blue-600 via-blue-500 to-sky-400',
      minBet: 10,
      maxBet: 100000,
      rtp: '97%',
      popularity: 98,
      isLive: true,
      players: 15847,
      jackpot: '₹2,50,000',
      features: ['Auto Cash Out', 'Live Chat', 'Statistics']
    },
    {
      id: 'teen-patti',
      name: 'Teen Patti',
      category: ['teen-patti', 'trending'],
      description: 'Classic Indian card game with modern twists',
      thumbnail: '🃏',
      gradient: 'from-purple-600 via-purple-500 to-pink-400',
      minBet: 50,
      maxBet: 50000,
      rtp: '96.5%',
      popularity: 95,
      isLive: true,
      players: 8965,
      jackpot: '₹5,00,000',
      features: ['Side Bets', 'Live Dealer', 'Tournaments']
    },
    {
      id: 'mines',
      name: 'Mines',
      category: ['trending'],
      description: 'Find gems while avoiding dangerous mines',
      thumbnail: '💎',
      gradient: 'from-emerald-600 via-green-500 to-teal-400',
      minBet: 10,
      maxBet: 10000,
      rtp: '98%',
      popularity: 87,
      isLive: false,
      players: 3254,
      jackpot: '₹1,25,000',
      features: ['Custom Risk', 'Auto Play', 'Quick Pick']
    },
    {
      id: 'dragon-tiger',
      name: 'Dragon Tiger',
      category: ['teen-patti', 'live'],
      description: 'Simple yet exciting card comparison game',
      thumbnail: '🐉',
      gradient: 'from-red-600 via-orange-500 to-yellow-400',
      minBet: 20,
      maxBet: 25000,
      rtp: '96.8%',
      popularity: 82,
      isLive: true,
      players: 5632,
      jackpot: '₹3,75,000',
      features: ['Side Bets', 'Road Maps', 'Statistics']
    },
    {
      id: 'wingo',
      name: 'WinGo',
      category: ['lottery', 'trending'],
      description: 'Predict colors and numbers to win big',
      thumbnail: '🎯',
      gradient: 'from-pink-600 via-rose-500 to-red-400',
      minBet: 10,
      maxBet: 50000,
      rtp: '95%',
      popularity: 79,
      isLive: true,
      players: 12845,
      jackpot: '₹10,00,000',
      features: ['Color Prediction', 'Number Guess', 'Quick Bet']
    },
    {
      id: 'limbo',
      name: 'Limbo',
      category: ['crash'],
      description: 'Set your target and watch the multiplier climb',
      thumbnail: '🚀',
      gradient: 'from-cyan-600 via-blue-500 to-indigo-400',
      minBet: 5,
      maxBet: 100000,
      rtp: '99%',
      popularity: 74,
      isLive: false,
      players: 2187,
      jackpot: '₹7,50,000',
      features: ['Custom Target', 'Auto Mode', 'Statistics']
    },
    {
      id: 'plinko',
      name: 'Plinko',
      category: ['slots'],
      description: 'Drop balls and watch them find their way to prizes',
      thumbnail: '⚪',
      gradient: 'from-violet-600 via-purple-500 to-fuchsia-400',
      minBet: 10,
      maxBet: 5000,
      rtp: '97.5%',
      popularity: 68,
      isLive: false,
      players: 1876,
      jackpot: '₹2,00,000',
      features: ['Risk Levels', 'Auto Drop', 'Sound Effects']
    }
  ];

  // Filter games by category
  const filteredGames = enhancedGames.filter(game => 
    gameCategory === 'trending' ? game.popularity > 75 : game.category.includes(gameCategory)
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const gameCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  // Enhanced Header Component
  const EnhancedHeader = () => (
    <motion.div 
      className="premium-header"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-content">
        <div className="header-left">
          <motion.div 
            className="logo-section"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="logo-icon">👑</div>
            <div className="logo-text">
              <span className="brand-name">Perfect91</span>
              <span className="brand-tagline">Club</span>
            </div>
          </motion.div>
        </div>

        <div className="header-center">
          {userProfile?.user && (
            <motion.div 
              className="user-status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="user-level">
                <Crown className="level-icon" />
                <span>VIP {isVIP ? 'Gold' : 'Silver'}</span>
              </div>
              <div className="user-balance">
                <IndianRupee className="currency-icon" />
                <span className="balance-amount">
                  {walletData?.walletBalance || '0'}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        <div className="header-right">
          <motion.button
            className="notification-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="notification-icon" />
            <span className="notification-badge">3</span>
          </motion.button>

          <motion.button
            className="profile-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <User className="profile-icon" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Enhanced Game Categories
  const GameCategoriesSection = () => (
    <motion.div 
      className="categories-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="categories-header">
        <h2>Game Categories</h2>
        <motion.button 
          className="view-all-btn"
          whileHover={{ x: 5 }}
        >
          View All <ChevronRight className="icon" />
        </motion.button>
      </div>
      
      <div className="categories-grid">
        {gameCategories.map((category) => (
          <motion.button
            key={category.id}
            className={`category-card ${gameCategory === category.id ? 'active' : ''}`}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGameCategory(category.id)}
          >
            <div className={`category-gradient bg-gradient-to-br ${category.color}`}>
              <div className="category-icon">{category.icon}</div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  // Enhanced Games Grid
  const EnhancedGamesGrid = () => (
    <motion.div 
      className="games-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="games-header">
        <h2>Featured Games</h2>
        <div className="games-controls">
          <motion.button
            className={`control-btn ${soundEnabled ? 'active' : ''}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="icon" /> : <VolumeX className="icon" />}
          </motion.button>
          <motion.button
            className={`control-btn ${autoPlayEnabled ? 'active' : ''}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setAutoPlayEnabled(!autoPlayEnabled)}
          >
            {autoPlayEnabled ? <Pause className="icon" /> : <Play className="icon" />}
          </motion.button>
        </div>
      </div>

      <div className="games-grid">
        <AnimatePresence>
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              className="game-card"
              variants={gameCardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              whileHover="hover"
              layout
              onClick={() => setSelectedGame(game.id)}
            >
              <div className={`game-background bg-gradient-to-br ${game.gradient}`}>
                <div className="game-overlay">
                  {game.isLive && (
                    <motion.div 
                      className="live-indicator"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <div className="live-dot"></div>
                      <span>LIVE</span>
                    </motion.div>
                  )}
                  
                  <div className="game-popularity">
                    <Star className="star-icon" />
                    <span>{game.popularity}%</span>
                  </div>
                </div>

                <div className="game-content">
                  <div className="game-icon">{game.thumbnail}</div>
                  <div className="game-info">
                    <h3 className="game-name">{game.name}</h3>
                    <p className="game-description">{game.description}</p>
                    
                    <div className="game-stats">
                      <div className="stat">
                        <Users className="stat-icon" />
                        <span>{game.players.toLocaleString()}</span>
                      </div>
                      <div className="stat">
                        <Target className="stat-icon" />
                        <span>RTP {game.rtp}</span>
                      </div>
                    </div>

                    <div className="game-jackpot">
                      <Trophy className="jackpot-icon" />
                      <span className="jackpot-amount">{game.jackpot}</span>
                    </div>
                  </div>
                </div>

                <div className="game-footer">
                  <div className="bet-range">
                    <span>₹{game.minBet} - ₹{game.maxBet.toLocaleString()}</span>
                  </div>
                  <motion.button 
                    className="play-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Gamepad2 className="play-icon" />
                    Play Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  // Enhanced Statistics Dashboard
  const StatsDashboard = () => (
    <motion.div 
      className="stats-dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2>Your Gaming Stats</h2>
      <div className="stats-grid">
        <motion.div className="stat-card" variants={itemVariants}>
          <div className="stat-icon games-played">
            <GameController2 />
          </div>
          <div className="stat-content">
            <h3>Games Played</h3>
            <p className="stat-number">1,247</p>
            <span className="stat-change positive">+12% this week</span>
          </div>
        </motion.div>

        <motion.div className="stat-card" variants={itemVariants}>
          <div className="stat-icon total-winnings">
            <Trophy />
          </div>
          <div className="stat-content">
            <h3>Total Winnings</h3>
            <p className="stat-number">₹45,680</p>
            <span className="stat-change positive">+₹2,340 today</span>
          </div>
        </motion.div>

        <motion.div className="stat-card" variants={itemVariants}>
          <div className="stat-icon win-rate">
            <Target />
          </div>
          <div className="stat-content">
            <h3>Win Rate</h3>
            <p className="stat-number">67%</p>
            <span className="stat-change positive">+3% this month</span>
          </div>
        </motion.div>

        <motion.div className="stat-card" variants={itemVariants}>
          <div className="stat-icon rank">
            <Award />
          </div>
          <div className="stat-content">
            <h3>Rank</h3>
            <p className="stat-number">#156</p>
            <span className="stat-change positive">+24 positions</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  if (profileLoading || walletLoading) {
    return (
      <div className="premium-loading">
        <motion.div 
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Crown className="loading-icon" />
        </motion.div>
        <p>Loading Premium Experience...</p>
      </div>
    );
  }

  return (
    <div className="premium-gaming-platform">
      <EnhancedHeader />
      
      <motion.main 
        className="premium-main"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GameCategoriesSection />
        <EnhancedGamesGrid />
        <StatsDashboard />
      </motion.main>

      {/* Enhanced Bottom Navigation */}
      <motion.nav 
        className="premium-bottom-nav"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('home')}
        >
          <GameController2 className="nav-icon" />
          <span>Games</span>
        </motion.button>

        <motion.button
          className={`nav-item ${activeTab === 'wallet' ? 'active' : ''}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('wallet')}
        >
          <Wallet className="nav-icon" />
          <span>Wallet</span>
        </motion.button>

        <motion.button
          className={`nav-item ${activeTab === 'promotions' ? 'active' : ''}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('promotions')}
        >
          <Gift className="nav-icon" />
          <span>Offers</span>
        </motion.button>

        <motion.button
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('profile')}
        >
          <User className="nav-icon" />
          <span>Profile</span>
        </motion.button>
      </motion.nav>
    </div>
  );
}