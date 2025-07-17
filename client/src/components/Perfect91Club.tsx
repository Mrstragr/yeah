import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Gift, Wallet, Trophy, User, Gamepad2,
  Plus, Minus, Play
} from 'lucide-react';
import WinGoGame from './WinGoGame';

import BG678ColorPrediction from './BG678ColorPrediction';
import OfficialWinGo from './OfficialWinGo';
import OfficialDice from './OfficialDice';
import OfficialK3 from './OfficialK3';
import Official5D from './Official5D';
import FullyPlayableWinGo from './FullyPlayableWinGo';
import FullyPlayableMines from './FullyPlayableMines';
import FullyPlayableDragonTiger from './FullyPlayableDragonTiger';
import OfficialTRXWinGo from './OfficialTRXWinGo';
import EnhancedPromotion from './EnhancedPromotion';
import EnhancedWallet from './EnhancedWallet';
import EnhancedActivity from './EnhancedActivity';
import { ErrorBoundary } from './ErrorBoundary';
import ActivitySection from './ActivitySection';
import { useSmartBalance } from '../hooks/useSmartBalance';
import WalletSection from './WalletSection';
import AccountSection from './AccountSection';
import AdvancedWithdrawalHistory from './AdvancedWithdrawalHistory';
import VIPMemberProfile from './VIPMemberProfile';
import EnhancedBG678Interface from './EnhancedBG678Interface';
import { AuthenticBG678WinGo } from './AuthenticBG678WinGo';
import { MarketLevelWinGo } from './MarketLevelWinGo';
import CongratulationsPopup from './CongratulationsPopup';
import ComprehensiveTournamentSystem from './ComprehensiveTournamentSystem';
import GlobalLeaderboardSystem from './GlobalLeaderboardSystem';
import DailyBonusRewardsSystem from './DailyBonusRewardsSystem';
import ReferralCommissionSystem from './ReferralCommissionSystem';
import GameHistoryStatisticsSystem from './GameHistoryStatisticsSystem';
import ComprehensiveSliderSystem from './ComprehensiveSliderSystem';
import ComprehensiveAnimationSystem from './ComprehensiveAnimationSystem';
import ComprehensivePromotionSystem from './ComprehensivePromotionSystem';
import PremiumAnimatedWinGo from './PremiumAnimatedWinGo';
import SimpleWorkingWinGo from './SimpleWorkingWinGo';
import ExactBG678WinGo from './ExactBG678WinGo';
import SimpleLoginFlow from './SimpleLoginFlow';
import KYCVerification from './KYCVerification';
import { VerificationProcess } from './VerificationProcess';
import ProductionReadyWinGo from './ProductionReadyWinGo';
import ProductionReadyAviator from './ProductionReadyAviator';
import OfficialAviatorGame from './OfficialAviatorGame';

import EnhancedGameLobby from './EnhancedGameLobby';
import ComprehensiveFeatures from './ComprehensiveFeatures';
import GameContainer from './GameContainer';
import { AnimatedAchievementNotification, useAchievementNotifications } from './AnimatedAchievementNotification';
import { RewardPreviewModal } from './RewardPreviewModal';

// EXACT 91CLUB REPLICA - Same colors, same UI, same everything
interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  isVerified: boolean;
}

interface Game {
  id: string;
  name: string;
  bgColor: string;
  icon: string;
  description: string;
}

interface Perfect91ClubProps {
  user?: any;
  onLogout?: () => void;
}

export function Perfect91Club({ user: propUser, onLogout }: Perfect91ClubProps = {}) {
  const [user, setUser] = useState<User | null>(propUser || null);
  const [showVerificationProcess, setShowVerificationProcess] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showWallet, setShowWallet] = useState(false);
  const [walletAction, setWalletAction] = useState<'deposit' | 'withdraw' | null>(null);
  const [amount, setAmount] = useState(500);
  // Smart balance management with caching
  const { balance, isLoading: balanceLoading, updateBalance: updateLocalBalance } = useSmartBalance();
  const [showProfile, setShowProfile] = useState(false);
  const [currentGameView, setCurrentGameView] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'home' | 'promotion' | 'activity' | 'wallet' | 'account'>('home');
  const [showWithdrawalHistory, setShowWithdrawalHistory] = useState(false);
  const [showVIPProfile, setShowVIPProfile] = useState(false);
  const [showBG678, setShowBG678] = useState(false);
  const [showTournaments, setShowTournaments] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showDailyBonus, setShowDailyBonus] = useState(false);
  const [showReferrals, setShowReferrals] = useState(false);
  const [showGameHistory, setShowGameHistory] = useState(false);
  const [showAuthenticBG678, setShowAuthenticBG678] = useState(false);
  const [showMarketWinGo, setShowMarketWinGo] = useState(false);
  const [showPremiumWinGo, setShowPremiumWinGo] = useState(false);
  const [showPremiumAviator, setShowPremiumAviator] = useState(false);
  const [showSimpleWinGo, setShowSimpleWinGo] = useState(false);
  const [showSimpleAviator, setShowSimpleAviator] = useState(false);
  const [showExactBG678, setShowExactBG678] = useState(false);
  const [showExactAviator, setShowExactAviator] = useState(false);
  const [showPromotions, setShowPromotions] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showKYCVerification, setShowKYCVerification] = useState(false);
  const [showProductionWinGo, setShowProductionWinGo] = useState(false);
  const [showProductionAviator, setShowProductionAviator] = useState(false);
  const [showGameLobby, setShowGameLobby] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showGameContainer, setShowGameContainer] = useState(false);

  // Achievement Notification System
  const { currentNotification, showAchievement, closeNotification, hasNotifications } = useAchievementNotifications();
  const [showRewardPreview, setShowRewardPreview] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // Sample Achievements Data from your existing app samples
  const sampleAchievements = [
    {
      id: 'first_win',
      title: 'First Victory',
      description: 'Win your first game',
      reward: '₹100',
      icon: '🏆',
      rarity: 'common' as const,
      category: 'gaming',
      xpGained: 50
    },
    {
      id: 'daily_player',
      title: 'Daily Player',
      description: 'Play games for 7 consecutive days',
      reward: '₹500',
      icon: '📅',
      rarity: 'rare' as const,
      category: 'streak',
      xpGained: 200
    },
    {
      id: 'big_winner',
      title: 'Big Winner',
      description: 'Win ₹10,000 in total',
      reward: '₹1000',
      icon: '💎',
      rarity: 'epic' as const,
      category: 'milestone',
      xpGained: 500
    },
    {
      id: 'jackpot_hunter',
      title: 'Jackpot Hunter',
      description: 'Hit the jackpot in any game',
      reward: '₹2500',
      icon: '🎯',
      rarity: 'legendary' as const,
      category: 'jackpot',
      xpGained: 1000
    },
    {
      id: 'aviator_expert',
      title: 'Aviator Expert',
      description: 'Win 50 times in Aviator',
      reward: '₹750',
      icon: '✈️',
      rarity: 'epic' as const,
      category: 'gaming',
      xpGained: 300
    }
  ];

  // Achievement Functions
  const handleRewardPreview = (achievement) => {
    setSelectedAchievement(achievement);
    setShowRewardPreview(true);
  };

  const handleClaimReward = (achievement) => {
    // Update balance with reward
    const rewardAmount = parseInt(achievement.reward.replace('₹', ''));
    updateLocalBalance(balance + rewardAmount);
    
    console.log(`Claimed reward: ${achievement.reward} for ${achievement.title}`);
    setShowRewardPreview(false);
  };

  // Demo function to trigger achievement notifications
  const triggerRandomAchievement = () => {
    const randomAchievement = sampleAchievements[Math.floor(Math.random() * sampleAchievements.length)];
    showAchievement(randomAchievement);
  };

  // EXACT 91CLUB games with same colors and names
  const lotteryGames: Game[] = [
    {
      id: 'color-prediction',
      name: 'COLOR\nPREDICTION',
      bgColor: 'linear-gradient(135deg, #dc2626 0%, #f59e0b 50%, #16a34a 100%)',
      icon: '🎨',
      description: '3 Min'
    },
    {
      id: 'wingo',
      name: 'WIN GO',
      bgColor: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      icon: '🎯',
      description: '1 Min'
    },
    {
      id: 'k3',
      name: 'K3',
      bgColor: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      icon: '🎲',
      description: '1 Min'
    },
    {
      id: '5d',
      name: '5D',
      bgColor: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      icon: '🎪',
      description: '1 Min'
    },
    {
      id: 'trx-wingo',
      name: 'TRX WINGO',
      bgColor: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
      icon: '⚡',
      description: 'TRX'
    },
    {
      id: 'bg678',
      name: 'BG678',
      bgColor: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      icon: '🎯',
      description: '3 Min'
    }
  ];

  const miniGames: Game[] = [
    {
      id: 'space-dice',
      name: 'SPACE\nDICE',
      bgColor: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      icon: '🎲',
      description: 'TB GAME'
    },
    {
      id: 'goal-wave',
      name: 'GOAL\nWAVE',
      bgColor: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      icon: '⚽',
      description: 'TB GAME'
    },
    {
      id: 'mini-roulette',
      name: 'MINI\nROULETTE',
      bgColor: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
      icon: '🎡',
      description: 'TB GAME'
    }
  ];

  const recommendedGames: Game[] = [
    {
      id: 'aviator',
      name: 'AVIATOR',
      bgColor: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
      icon: '✈️',
      description: 'FULLY PLAYABLE'
    },
    {
      id: 'mines',
      name: 'MINES',
      bgColor: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
      icon: '💎',
      description: 'FULLY PLAYABLE'
    },
    {
      id: 'dragon-tiger',
      name: 'DRAGON\nTIGER',
      bgColor: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
      icon: '🐉',
      description: 'FULLY PLAYABLE'
    },
    {
      id: 'wingo',
      name: 'WIN GO',
      bgColor: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      icon: '🎯',
      description: 'FULLY PLAYABLE'
    }
  ];

  const slotGames: Game[] = [
    {
      id: 'slot1',
      name: 'SLOT',
      bgColor: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
      icon: '🎰',
      description: 'SLOT'
    },
    {
      id: 'slot2',
      name: 'SLOT',
      bgColor: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      icon: '🎰',
      description: 'SLOT'
    },
    {
      id: 'slot3',
      name: 'SLOT',
      bgColor: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      icon: '🎰',
      description: 'SLOT'
    }
  ];



  // Fetch real-time wallet balance
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/wallet/balance', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        updateLocalBalance(data.balance);
        setUser(prev => prev ? { ...prev, walletBalance: data.balance } : null);
      }
    } catch (error) {
      console.error('Balance fetch error:', error);
    }
  };

  // Handle deposit
  const handleDeposit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (response.ok) {
        // For demo mode, simulate Razorpay payment
        if (data.orderId) {
          alert(`Payment initiated for ₹${amount}. Order ID: ${data.orderId}`);
          
          // Simulate successful payment after 2 seconds
          setTimeout(async () => {
            const verifyResponse = await fetch('/api/wallet/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                orderId: data.orderId,
                paymentId: 'demo_payment_' + Date.now(),
                signature: 'demo_signature'
              }),
            });

            if (verifyResponse.ok) {
              alert('Deposit successful!');
              fetchBalance();
              setShowWallet(false);
              setWalletAction(null);
            }
          }, 2000);
        }
      } else {
        alert(data.message || 'Deposit failed');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Connection error during deposit');
    } finally {
      setLoading(false);
    }
  };

  // Handle withdrawal
  const handleWithdraw = async () => {
    // Check if user is KYC verified before allowing withdrawal
    if (!user?.isVerified) {
      alert('KYC verification required for withdrawals. Please complete your verification first.');
      setShowWallet(false);
      setShowKYCVerification(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          amount,
          accountDetails: {
            bankName: 'Demo Bank',
            accountNumber: '1234567890',
            ifsc: 'DEMO0001234'
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Withdrawal request submitted! It will be processed within 24 hours.');
        fetchBalance();
        setShowWallet(false);
        setWalletAction(null);
      } else {
        alert(data.message || 'Withdrawal failed');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Connection error during withdrawal');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setShowProfile(false);
    updateLocalBalance(0);
    setCurrentTab('home');
  };

  // Check for existing auth token on component mount
  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Try to fetch user profile with stored token
      fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(res => res.ok ? res.json() : null)
      .then(userData => {
        if (userData) {
          setUser(userData);
          updateLocalBalance(parseFloat(userData.walletBalance) || 10000);
        }
      })
      .catch(() => {
        // Token invalid, remove it
        localStorage.removeItem('authToken');
      });
    }
  }, []);

  // Load balance on component mount and user login
  React.useEffect(() => {
    if (user) {
      fetchBalance();
      updateLocalBalance(parseFloat(user.walletBalance) || 10000);
    }
  }, [user]);

  // Show WinGo game if selected
  if (currentGameView === 'wingo' && user) {
    return (
      <WinGoGame 
        onBack={() => setCurrentGameView(null)}
        user={user}
        onBalanceUpdate={fetchBalance}
      />
    );
  }

  // Show Advanced Aviator game if selected
  if (currentGameView === 'aviator' && user) {
    return (
      <div className="min-h-screen bg-gray-900 max-w-md mx-auto">
        <div className="flex items-center p-4 border-b border-gray-700">
          <button
            onClick={() => setCurrentGameView(null)}
            className="text-white mr-3"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">Advanced Aviator</h1>
        </div>
        <div className="p-4 text-white text-center">
          <div className="text-red-400 text-xl">Aviator Game Loading...</div>
        </div>
      </div>
    );
  }

  // Show BG678 Color Prediction game if selected
  if (currentGameView === 'color-prediction' && user) {
    return (
      <BG678ColorPrediction 
        onBack={() => setCurrentGameView(null)}
        user={user}
        onBalanceUpdate={fetchBalance}
      />
    );
  }

  // Show Fully Playable WinGo game if selected
  if (currentGameView === 'wingo' && user) {
    return (
      <FullyPlayableWinGo 
        onBack={() => setCurrentGameView(null)}
      />
    );
  }

  // Show Fully Playable Mines game if selected
  if (currentGameView === 'mines' && user) {
    return (
      <FullyPlayableMines 
        onBack={() => setCurrentGameView(null)}
      />
    );
  }

  // Show Fully Playable Dragon Tiger game if selected
  if (currentGameView === 'dragon-tiger' && user) {
    return (
      <FullyPlayableDragonTiger 
        onBack={() => setCurrentGameView(null)}
      />
    );
  }

  // Show Comprehensive Features
  if (showTournaments && user) {
    return (
      <ComprehensiveTournamentSystem 
        onBack={() => setShowTournaments(false)}
      />
    );
  }

  if (showLeaderboard && user) {
    return (
      <GlobalLeaderboardSystem 
        onBack={() => setShowLeaderboard(false)}
      />
    );
  }

  if (showDailyBonus && user) {
    return (
      <DailyBonusRewardsSystem 
        onBack={() => setShowDailyBonus(false)}
      />
    );
  }

  if (showReferrals && user) {
    return (
      <ReferralCommissionSystem 
        onBack={() => setShowReferrals(false)}
      />
    );
  }

  if (showGameHistory && user) {
    return (
      <GameHistoryStatisticsSystem 
        onBack={() => setShowGameHistory(false)}
      />
    );
  }

  if (showAuthenticBG678 && user) {
    return (
      <AuthenticBG678WinGo 
        onBack={() => setShowAuthenticBG678(false)}
      />
    );
  }

  if (showMarketWinGo && user) {
    return (
      <MarketLevelWinGo 
        onBack={() => setShowMarketWinGo(false)}
      />
    );
  }

  if (showPromotions) {
    return (
      <ComprehensivePromotionSystem
        onClaimReward={(id) => {
          console.log('Claiming reward:', id);
          setShowCelebration(true);
          // Add real reward logic here
        }}
        onViewDetails={(id) => {
          console.log('Viewing details:', id);
          // Add details modal logic here
        }}
      />
    );
  }

  // Show Official Dice game if selected
  if (currentGameView === 'dice-game' && user) {
    return (
      <OfficialDice 
        onBack={() => setCurrentGameView(null)}
        user={user}
        onBalanceUpdate={fetchBalance}
      />
    );
  }

  // Show Official K3 game if selected
  if (currentGameView === 'k3' && user) {
    return (
      <OfficialK3 
        onBack={() => setCurrentGameView(null)}
        user={user}
        onBalanceUpdate={fetchBalance}
      />
    );
  }

  // Show Official 5D game if selected
  if (currentGameView === '5d' && user) {
    return (
      <Official5D 
        onBack={() => setCurrentGameView(null)}
        user={user}
        onBalanceUpdate={fetchBalance}
      />
    );
  }

  // Show Official TRX WinGo game if selected
  if (currentGameView === 'trx-wingo' && user) {
    return (
      <OfficialTRXWinGo 
        onBack={() => setCurrentGameView(null)}
        user={user}
        onBalanceUpdate={fetchBalance}
      />
    );
  }

  // Show advanced features
  if (showWithdrawalHistory) {
    return <AdvancedWithdrawalHistory onBack={() => setShowWithdrawalHistory(false)} />;
  }

  if (showVIPProfile) {
    return <VIPMemberProfile onBack={() => setShowVIPProfile(false)} balance={balance} />;
  }

  if (showBG678) {
    return <EnhancedBG678Interface onBack={() => setShowBG678(false)} balance={balance} updateBalance={updateLocalBalance} />;
  }

  // Show enhanced components
  if (showProductionWinGo && user) {
    return (
      <ProductionReadyWinGo 
        onBack={() => setShowProductionWinGo(false)}
        user={user}
        onBalanceUpdate={fetchBalance}
      />
    );
  }



  if (showGameLobby && user) {
    return (
      <EnhancedGameLobby 
        onBack={() => setShowGameLobby(false)}
        user={user}
        onGameSelect={(gameId) => {
          setShowGameLobby(false);
          if (gameId === 'wingo') setShowProductionWinGo(true);

          // Add other game handlers here
        }}
      />
    );
  }

  if (showFeatures && user) {
    return (
      <ComprehensiveFeatures 
        onBack={() => setShowFeatures(false)}
        user={user}
      />
    );
  }

  if (showGameContainer && user) {
    return (
      <GameContainer />
    );
  }

  // Show different sections based on current tab
  if (user && currentTab === 'promotion') {
    return (
      <EnhancedPromotion 
        onBack={() => setCurrentTab('home')}
        user={user}
      />
    );
  }

  if (user && currentTab === 'activity') {
    return (
      <EnhancedActivity 
        user={user}
        balance={balance}
        onBack={() => setCurrentTab('home')}
      />
    );
  }

  if (user && currentTab === 'wallet') {
    return (
      <EnhancedWallet 
        onBack={() => setCurrentTab('home')}
        user={user}
        onBalanceUpdate={fetchBalance}
        onShowVerification={() => setShowVerificationProcess(true)}
      />
    );
  }

  if (user && currentTab === 'account') {
    return (
      <AccountSection 
        user={user}
        balance={balance}
        onLogout={handleLogout}
        onBack={() => setCurrentTab('home')}
        onShowVerification={() => setShowVerificationProcess(true)}
      />
    );
  }

  // Show simple login/register if not logged in
  if (!user) {
    return (
      <SimpleLoginFlow 
        onAuthSuccess={(authenticatedUser) => {
          setUser({
            id: authenticatedUser.id,
            username: authenticatedUser.username,
            phone: authenticatedUser.phone,
            email: authenticatedUser.email,
            walletBalance: authenticatedUser.balance,
            isVerified: authenticatedUser.isVerified
          });
        }}
        onAuthError={(error) => {
          console.error('Authentication error:', error);
          // Could show toast notification here
        }}
      />
    );
  }

  // Slider action handler
  const handleSliderAction = (actionType: string) => {
    switch (actionType) {
      case 'claim_bonus':
        setShowPromotions(true);
        break;
      case 'join_tournament':
        setShowTournaments(true);
        break;
      case 'upgrade_vip':
        setCurrentView('vip');
        break;
      case 'daily_bonus':
        setShowDailyBonus(true);
        break;
      case 'deposit_bonus':
        setCurrentView('wallet');
        break;
      default:
        console.log('Unknown action:', actionType);
    }
  };

  return (
    <ComprehensiveAnimationSystem 
      triggerCelebration={showCelebration}
      onCelebrationEnd={() => setShowCelebration(false)}
    >
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* EXACT FAMILIAR HEADER - Like existing apps */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-white">
        {/* Top notification bar exactly like other apps */}
        <div className="bg-black bg-opacity-20 px-3 py-1 mb-2 rounded text-xs flex items-center">
          <span className="text-yellow-300 mr-2">🎉</span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              Welcome bonus ₹51 • Daily check-in rewards • VIP benefits • Limited time offer
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          {/* App logo exactly like other apps */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-yellow-300">91</div>
            <div className="text-xl font-bold ml-1">CLUB</div>
          </div>
          
          {/* Right side icons exactly like other apps */}
          <div className="flex items-center space-x-3">
            <button className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-sm">🔍</span>
            </button>
            <button className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center relative">
              <span className="text-sm">🔔</span>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-black text-xs flex items-center justify-center font-bold">3</div>
            </button>
            <button onClick={() => setCurrentTab('account')} className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-lg">👤</span>
            </button>
          </div>
        </div>
        
        {/* User info exactly like other apps */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <div className="text-sm opacity-90">Good evening, {user.username}</div>
            <div className="text-xs opacity-70">ID: {user.id} | Online: 12,847 players</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-80">Main Wallet</div>
            <div className="font-bold text-yellow-300 text-lg">₹{balance || user.walletBalance}</div>
          </div>
        </div>
      </div>

      {/* LIVE STATS TICKER exactly like other apps */}
      <div className="bg-black px-4 py-2">
        <div className="flex items-center text-green-400 text-xs">
          <span className="mr-4">🔴 LIVE</span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              Yesterday Winners: ₹12,54,000 • Today's Top Win: ₹75,600 by user123 • 
              Online Players: 12,847 • Games Won Today: 45,234 • 
              Total Payout: ₹2.5 Crores • Happy Winners: 8,923
            </div>
          </div>
        </div>
      </div>

      {/* EXACT FAMILIAR BONUS BANNER like other apps */}
      <div className="px-4 pt-4">
        <div 
          className="rounded-2xl p-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-yellow-300 text-sm font-bold mb-1">
                🎁 FIRST DEPOSIT BONUS
              </div>
              <div className="text-white text-lg font-bold mb-1">
                Get 100% Bonus
              </div>
              <div className="text-white text-sm mb-2">
                Min deposit ₹100 • Max bonus ₹5,000
              </div>
              <button className="bg-yellow-400 text-black px-4 py-2 rounded-full text-xs font-bold">
                DEPOSIT NOW
              </button>
            </div>
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl">
              💰
            </div>
          </div>
        </div>
      </div>

      {/* ✨ PRODUCTION-READY ENHANCED GAMES - MARKET READY ✨ */}
      <div className="px-4 pt-4 mb-6">
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-green-600 mb-2">🚀 PRODUCTION-READY GAMES</div>
          <div className="text-sm text-gray-600">Professional quality games ready for market launch</div>
        </div>
        
        <div className="space-y-3 mb-6">
          {/* Production WinGo */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xl font-bold">🎯 PRODUCTION WINGO</div>
                <div className="text-sm opacity-90">Authentic BG678 style with production features</div>
              </div>
              <div className="text-xs bg-yellow-400 px-3 py-1 rounded-full text-black font-bold">
                MARKET READY
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProductionWinGo(true)}
              className="w-full bg-white text-green-600 py-4 rounded-lg font-bold text-lg"
            >
              🎯 PLAY PRODUCTION WINGO
            </motion.button>
          </div>

          {/* Production Aviator */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xl font-bold">✈️ PRODUCTION AVIATOR</div>
                <div className="text-sm opacity-90">Real flight mechanics with canvas animation</div>
              </div>
              <div className="text-xs bg-yellow-400 px-3 py-1 rounded-full text-black font-bold">
                MARKET READY
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowGameContainer(true)}
              className="w-full bg-white text-blue-600 py-4 rounded-lg font-bold text-lg"
            >
              ✈️ FLY PRODUCTION AVIATOR
            </motion.button>
          </div>

          {/* Enhanced Game Lobby */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xl font-bold">🎮 ENHANCED GAME LOBBY</div>
                <div className="text-sm opacity-90">Professional game selection interface</div>
              </div>
              <div className="text-xs bg-yellow-400 px-3 py-1 rounded-full text-black font-bold">
                PREMIUM
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowGameLobby(true)}
              className="w-full bg-white text-purple-600 py-4 rounded-lg font-bold text-lg"
            >
              🎮 ENTER GAME LOBBY
            </motion.button>
          </div>

          {/* Comprehensive Features */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xl font-bold">🏆 COMPREHENSIVE FEATURES</div>
                <div className="text-sm opacity-90">Tournaments, achievements, leaderboards</div>
              </div>
              <div className="text-xs bg-yellow-400 px-3 py-1 rounded-full text-black font-bold">
                FULL SUITE
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFeatures(true)}
              className="w-full bg-white text-indigo-600 py-4 rounded-lg font-bold text-lg"
            >
              🏆 EXPLORE FEATURES
            </motion.button>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="text-lg font-bold text-red-600 mb-2">🎯 EXACT REPLICAS</div>
          <div className="text-sm text-gray-600">Pixel-perfect copies from screenshots</div>
        </div>
        
        <div className="space-y-3">
          {/* Exact BG678 WinGo - TOP */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xl font-bold">🎯 EXACT BG678 WINGO</div>
                <div className="text-sm opacity-90">100% exact copy from your screenshots</div>
              </div>
              <div className="text-xs bg-yellow-500 px-3 py-1 rounded-full text-black font-bold animate-pulse">
                OFFICIAL
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowExactBG678(true)}
              className="w-full bg-white text-green-600 py-4 rounded-lg font-bold text-lg"
            >
              🎯 PLAY EXACT BG678 REPLICA
            </motion.button>
          </div>

          {/* Exact Aviator Game - TOP */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xl font-bold">✈️ EXACT AVIATOR</div>
                <div className="text-sm opacity-90">Red curves, dual betting, exact replica</div>
              </div>
              <div className="text-xs bg-yellow-500 px-3 py-1 rounded-full text-black font-bold animate-pulse">
                OFFICIAL
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowGameContainer(true)}
              className="w-full bg-white text-red-600 py-4 rounded-lg font-bold text-lg"
            >
              ✈️ FLY EXACT AVIATOR REPLICA
            </motion.button>
          </div>
        </div>
      </div>

      {/* EXACT Wallet Section */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-yellow-600 text-sm flex items-center">
              🟡 Wallet balance
            </div>
            <div className="text-2xl font-bold text-black flex items-center">
              ₹{balance || user.walletBalance}
              <button 
                onClick={fetchBalance}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                ↻
              </button>
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => {
                  setWalletAction('withdraw');
                  setShowWallet(true);
                }}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600"
              >
                Withdraw
              </button>
              <button 
                onClick={() => setShowWithdrawalHistory(true)}
                className="bg-blue-500 text-white px-6 py-1 rounded-lg text-sm hover:bg-blue-600"
              >
                History
              </button>
            </div>
            <button 
              onClick={() => {
                setWalletAction('deposit');
                setShowWallet(true);
              }}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600"
            >
              Deposit
            </button>
          </div>
        </div>

        {/* EXACT HOT GAMES SECTION like other apps */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="text-red-500 text-lg mr-2">🔥</span>
            <span className="font-bold text-lg">Hot Games</span>
          </div>
          <button 
            onClick={() => setShowGameContainer(true)}
            className="text-red-500 text-sm font-medium"
          >
            More →
          </button>
        </div>
        
        {/* Hot Games Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button 
            onClick={() => setShowGameContainer(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white text-left relative"
          >
            <div className="absolute top-2 right-2 bg-red-500 rounded-full px-2 py-1 text-xs font-bold">HOT</div>
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-bold text-sm">Win Go</div>
            <div className="text-xs opacity-90">Color prediction</div>
            <div className="text-xs bg-black bg-opacity-20 px-2 py-1 rounded mt-2 inline-block">
              12,847 playing
            </div>
          </button>
          
          <button 
            onClick={() => setShowGameContainer(true)}
            className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white text-left relative"
          >
            <div className="absolute top-2 right-2 bg-yellow-400 rounded-full px-2 py-1 text-xs font-bold text-black">NEW</div>
            <div className="text-2xl mb-2">✈️</div>
            <div className="font-bold text-sm">Aviator</div>
            <div className="text-xs opacity-90">Crash game</div>
            <div className="text-xs bg-black bg-opacity-20 px-2 py-1 rounded mt-2 inline-block">
              8,234 playing
            </div>
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <button 
            onClick={() => setShowFeatures(true)}
            className="bg-white border border-gray-200 rounded-lg p-3 text-center"
          >
            <div className="text-xl mb-1">🏆</div>
            <div className="text-xs font-medium text-gray-600">Events</div>
          </button>
          <button 
            onClick={() => setShowVIPProfile(true)}
            className="bg-white border border-gray-200 rounded-lg p-3 text-center"
          >
            <div className="text-xl mb-1">👑</div>
            <div className="text-xs font-medium text-gray-600">VIP</div>
          </button>
          <button 
            className="bg-white border border-gray-200 rounded-lg p-3 text-center"
          >
            <div className="text-xl mb-1">🎁</div>
            <div className="text-xs font-medium text-gray-600">Bonus</div>
          </button>
          <button 
            className="bg-white border border-gray-200 rounded-lg p-3 text-center"
          >
            <div className="text-xl mb-1">💬</div>
            <div className="text-xs font-medium text-gray-600">Support</div>
          </button>
        </div>
      </div>

      {/* EXACT Game Categories Tabs */}
      <div className="px-4">
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-4">
          <button className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-bold flex items-center justify-center">
            🔴 Lobby
          </button>
          <button className="flex-1 py-2 text-gray-600 text-sm font-bold flex items-center justify-center">
            🎮 Mini game
          </button>
          <button className="flex-1 py-2 text-gray-600 text-sm font-bold flex items-center justify-center">
            🎰 Slots
          </button>
          <button className="flex-1 py-2 text-gray-600 text-sm font-bold flex items-center justify-center">
            🃏 Card
          </button>
          <button className="flex-1 py-2 text-gray-600 text-sm font-bold flex items-center justify-center">
            🐟 Fishing
          </button>
        </div>
      </div>

      {/* EXACT Lottery Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center mb-3">
          <span className="text-red-500 text-lg mr-2">⭕</span>
          <span className="font-bold text-lg">Lottery</span>
        </div>
        <div className="text-gray-600 text-sm mb-4">
          The games are independently developed by our team, fun, fair, and safe
        </div>
        <div className="grid grid-cols-2 gap-3">
          {lotteryGames.map((game) => (
            <motion.div
              key={game.id}
              className="rounded-2xl p-6 text-white relative overflow-hidden cursor-pointer"
              style={{ background: game.bgColor }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (game.name === 'WIN GO') {
                  setCurrentGameView('wingo');
                } else if (game.name === 'AVIATOR') {
                  setCurrentGameView('aviator');
                } else if (game.name === 'COLOR\nPREDICTION') {
                  setCurrentGameView('color-prediction');
                } else if (game.name === 'K3') {
                  setCurrentGameView('k3');
                } else if (game.name === '5D') {
                  setCurrentGameView('5d');
                } else if (game.name === 'TRX WINGO') {
                  setCurrentGameView('trx-wingo');
                } else if (game.name === 'BG678') {
                  setShowBG678(true);
                } else {
                  setSelectedGame(game);
                }
              }}
            >
              <div className="text-3xl mb-2">{game.icon}</div>
              <div className="font-bold text-xl whitespace-pre-line">
                {game.name}
              </div>
              <div className="text-sm opacity-90 mt-1">
                {game.description}
              </div>
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">7</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* EXACT Recommended Games Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center mb-3">
          <span className="text-yellow-500 text-lg mr-2">👑</span>
          <span className="font-bold text-lg">Recommended</span>
        </div>
        <div className="text-gray-600 text-sm mb-4">
          Popular games trending now
        </div>
        <div className="grid grid-cols-2 gap-3">
          {recommendedGames.map((game) => (
            <motion.div
              key={game.id}
              className="rounded-2xl p-6 text-white relative overflow-hidden cursor-pointer"
              style={{ background: game.bgColor }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (game.name === 'WIN GO' || game.name === 'AVIATOR' || game.name === 'MINES' || game.name === 'DRAGON\nTIGER') {
                  setShowGameContainer(true);
                } else {
                  setSelectedGame(game);
                }
              }}
            >
              <div className="text-3xl mb-2">{game.icon}</div>
              <div className="font-bold text-xl whitespace-pre-line">
                {game.name}
              </div>
              <div className="text-sm opacity-90 mt-1">
                {game.description}
              </div>
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🔥</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* COMPREHENSIVE FEATURES Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center mb-3">
          <span className="text-purple-500 text-lg mr-2">🚀</span>
          <span className="font-bold text-lg">Premium Features</span>
        </div>
        <div className="text-gray-600 text-sm mb-4">
          Complete gaming ecosystem with tournaments, rewards, and social features
        </div>
        
        {/* Tournament & Competition Features */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowTournaments(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-4 text-white text-left"
          >
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-bold text-lg">Tournaments</div>
            <div className="text-sm opacity-90">Live competitions</div>
            <div className="text-xs bg-red-500 px-2 py-1 rounded-full mt-2 inline-block">
              12 LIVE
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLeaderboard(true)}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-4 text-white text-left"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="font-bold text-lg">Leaderboard</div>
            <div className="text-sm opacity-90">Global rankings</div>
            <div className="text-xs bg-green-500 px-2 py-1 rounded-full mt-2 inline-block">
              RANK #247
            </div>
          </motion.button>
        </div>

        {/* Rewards & Social Features */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDailyBonus(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-3 text-white text-center"
          >
            <div className="text-2xl mb-1">🎁</div>
            <div className="font-bold text-sm">Daily Bonus</div>
            <div className="text-xs opacity-90">Day 3</div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowReferrals(true)}
            className="bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl p-3 text-white text-center"
          >
            <div className="text-2xl mb-1">🤝</div>
            <div className="font-bold text-sm">Referrals</div>
            <div className="text-xs opacity-90">15% Rate</div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowGameHistory(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-3 text-white text-center"
          >
            <div className="text-2xl mb-1">📈</div>
            <div className="font-bold text-sm">Statistics</div>
            <div className="text-xs opacity-90">59.8% Win</div>
          </motion.button>
        </div>

        {/* Additional Quick Features */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowVIPProfile(true)}
            className="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-2xl p-4 text-white text-left relative"
          >
            <div className="text-3xl mb-2">👑</div>
            <div className="font-bold text-lg">VIP Status</div>
            <div className="text-sm opacity-90">Exclusive benefits</div>
            <div className="absolute top-2 right-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowWithdrawalHistory(true)}
            className="bg-gradient-to-r from-gray-600 to-gray-500 rounded-2xl p-4 text-white text-left"
          >
            <div className="text-3xl mb-2">📝</div>
            <div className="font-bold text-lg">History</div>
            <div className="text-sm opacity-90">Transactions</div>
          </motion.button>
        </div>

        {/* Authentic Gaming Experience */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-4 text-white mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xl font-bold">🎯 AUTHENTIC BG678</div>
              <div className="text-sm opacity-90">Exact replica from screenshots</div>
            </div>
            <div className="text-xs bg-red-500 px-2 py-1 rounded-full">
              NEW
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAuthenticBG678(true)}
            className="w-full bg-white text-green-600 py-3 rounded-lg font-bold"
          >
            Play WinGo 30s - Authentic Experience
          </motion.button>
        </div>

        {/* Working Games Section */}
        <div className="space-y-4 mb-4">

          {/* Simple Working WinGo */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xl font-bold">✅ SIMPLE WINGO</div>
                <div className="text-sm opacity-90">Fully functional, clean UI, real betting</div>
              </div>
              <div className="text-xs bg-green-500 px-2 py-1 rounded-full text-black font-bold">
                WORKING
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSimpleWinGo(true)}
              className="w-full bg-white text-green-600 py-3 rounded-lg font-bold"
            >
              Play Working WinGo
            </motion.button>
          </div>

          {/* Simple Working Aviator */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xl font-bold">✈️ SIMPLE AVIATOR</div>
                <div className="text-sm opacity-90">Functional flight, real cash out, working mechanics</div>
              </div>
              <div className="text-xs bg-blue-500 px-2 py-1 rounded-full text-white font-bold">
                STABLE
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSimpleAviator(true)}
              className="w-full bg-white text-blue-600 py-3 rounded-lg font-bold"
            >
              Fly Working Aviator
            </motion.button>
          </div>

          {/* Market Level Gaming */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xl font-bold">⚡ MARKET LEVEL WINGO</div>
                <div className="text-sm opacity-90">Real money, real multipliers, real market logic</div>
              </div>
              <div className="text-xs bg-yellow-500 px-2 py-1 rounded-full text-black font-bold">
                LIVE
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowMarketWinGo(true)}
              className="w-full bg-white text-red-600 py-3 rounded-lg font-bold"
            >
              Play Market WinGo - Real Stakes
            </motion.button>
          </div>
        </div>

        {/* Comprehensive Slider System */}
        <ComprehensiveSliderSystem onSliderAction={handleSliderAction} />

        {/* Comprehensive Promotions Access */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-4 text-white mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xl font-bold">🎁 COMPREHENSIVE PROMOTIONS</div>
              <div className="text-sm opacity-90">Daily rewards, VIP benefits, tournaments & more</div>
            </div>
            <div className="text-xs bg-green-500 px-2 py-1 rounded-full">
              ACTIVE
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPromotions(true)}
            className="w-full bg-white text-purple-600 py-3 rounded-lg font-bold"
          >
            View All Promotions & Rewards
          </motion.button>
        </div>
      </div>

      {/* Wallet Modal */}
      <AnimatePresence>
        {showWallet && walletAction && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {walletAction === 'deposit' ? 'Deposit Money' : 'Withdraw Money'}
                </h2>
                <button 
                  onClick={() => {
                    setShowWallet(false);
                    setWalletAction(null);
                  }}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setAmount(Math.max(100, amount - 100))}
                      className="bg-red-500 p-3 rounded-lg text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="text-xl font-bold">₹{amount}</div>
                    <button
                      onClick={() => setAmount(amount + 100)}
                      className="bg-green-500 p-3 rounded-lg text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[500, 1000, 2000, 5000].map(preset => (
                      <button
                        key={preset}
                        onClick={() => setAmount(preset)}
                        className={`py-2 rounded-lg font-medium ${
                          amount === preset 
                            ? 'bg-red-500 text-white' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        ₹{preset}
                      </button>
                    ))}
                  </div>
                </div>

                {walletAction === 'withdraw' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="text-sm text-yellow-800">
                      <strong>Note:</strong> Withdrawals are processed within 24 hours. 
                      Minimum withdrawal: ₹100
                    </div>
                  </div>
                )}

                {walletAction === 'deposit' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm text-blue-800">
                      <strong>Payment Methods:</strong> UPI, Credit/Debit Cards, Net Banking
                    </div>
                  </div>
                )}

                <button
                  onClick={walletAction === 'deposit' ? handleDeposit : handleWithdraw}
                  disabled={loading || (walletAction === 'withdraw' && amount > parseFloat(balance || user.walletBalance))}
                  className={`w-full py-3 rounded-lg font-bold ${
                    loading || (walletAction === 'withdraw' && amount > parseFloat(balance || user.walletBalance))
                      ? 'bg-gray-400 text-gray-600'
                      : walletAction === 'deposit'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {loading 
                    ? 'Processing...' 
                    : walletAction === 'withdraw' && amount > parseFloat(balance || user.walletBalance)
                    ? 'Insufficient Balance'
                    : walletAction === 'deposit' 
                    ? `Deposit ₹${amount}` 
                    : `Withdraw ₹${amount}`
                  }
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Account</h2>
                <button 
                  onClick={() => setShowProfile(false)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-bold text-lg">{user.username}</div>
                  <div className="text-gray-600">{user.phone}</div>
                  <div className="text-sm text-green-600 mt-1">
                    {user.isVerified ? '✓ Verified Account' : '⚠ Unverified'}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">₹{balance || user.walletBalance}</div>
                    <div className="text-gray-600 text-sm">Current Balance</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      setShowProfile(false);
                      setWalletAction('deposit');
                      setShowWallet(true);
                    }}
                    className="w-full py-3 bg-red-500 text-white font-bold rounded-lg flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Money
                  </button>

                  {!user.isVerified && (
                    <button 
                      onClick={() => {
                        setShowProfile(false);
                        setShowKYCVerification(true);
                      }}
                      className="w-full py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600"
                    >
                      🆔 Complete KYC Verification
                    </button>
                  )}

                  <button 
                    onClick={() => {
                      setShowProfile(false);
                      // Add transaction history functionality here
                      alert('Transaction history coming soon!');
                    }}
                    className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-lg"
                  >
                    Transaction History
                  </button>

                  <button 
                    onClick={() => {
                      setShowProfile(false);
                      // Add settings functionality here
                      alert('Settings coming soon!');
                    }}
                    className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-lg"
                  >
                    Settings
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="w-full py-3 bg-gray-100 text-red-600 font-bold rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{selectedGame.name}</h2>
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedGame.icon}</div>
                <div className="text-gray-600 mb-6">
                  Coming soon! This game is under development.
                </div>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="w-full py-3 bg-red-500 text-white font-bold rounded-lg"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXACT Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
        <div className="grid grid-cols-5 gap-1">
          <button 
            onClick={() => {
              setCurrentTab('promotion');
              setShowPromotions(true);
            }}
            className={`flex flex-col items-center py-3 ${currentTab === 'promotion' ? 'text-red-500' : 'text-gray-400'}`}
          >
            <Gift className="w-5 h-5 mb-1" />
            <span className="text-xs">Promotion</span>
          </button>
          <button 
            onClick={() => setCurrentTab('activity')}
            className={`flex flex-col items-center py-3 ${currentTab === 'activity' ? 'text-red-500' : 'text-gray-400'}`}
          >
            <Trophy className="w-5 h-5 mb-1" />
            <span className="text-xs">Activity</span>
          </button>
          <button 
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center py-3 ${currentTab === 'home' ? 'text-red-500' : 'text-gray-400'}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${currentTab === 'home' ? 'bg-red-500' : 'bg-gray-400'}`}>
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold">Game</span>
          </button>
          <button 
            onClick={() => setCurrentTab('wallet')}
            className={`flex flex-col items-center py-3 ${currentTab === 'wallet' ? 'text-red-500' : 'text-gray-400'}`}
          >
            <Wallet className="w-5 h-5 mb-1" />
            <span className="text-xs">Wallet</span>
          </button>
          <button 
            onClick={() => setCurrentTab('account')}
            className={`flex flex-col items-center py-3 ${currentTab === 'account' ? 'text-red-500' : 'text-gray-400'}`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Account</span>
          </button>
        </div>
      </div>

      {/* Exact Official Games Modals */}
      <AnimatePresence>
        {showExactBG678 && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ExactBG678WinGo onBack={() => setShowExactBG678(false)} />
          </motion.div>
        )}
        
        {showExactAviator && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OfficialAviatorGame onBack={() => setShowExactAviator(false)} />
          </motion.div>
        )}
        
        {showSimpleWinGo && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SimpleWorkingWinGo onBack={() => setShowSimpleWinGo(false)} />
          </motion.div>
        )}
        
        {showSimpleAviator && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OfficialAviatorGame onBack={() => setShowSimpleAviator(false)} />
          </motion.div>
        )}
        
        {showPremiumWinGo && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PremiumAnimatedWinGo onBack={() => setShowPremiumWinGo(false)} />
          </motion.div>
        )}
        
        {showPremiumAviator && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProductionReadyAviator onBack={() => setShowPremiumAviator(false)} />
          </motion.div>
        )}
        
        {showMarketWinGo && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MarketLevelWinGo onBack={() => setShowMarketWinGo(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom padding for navigation */}
      <div className="h-20"></div>

      {/* KYC Verification Modal */}
      {showKYCVerification && (
        <KYCVerification
          onClose={() => setShowKYCVerification(false)}
          onVerificationComplete={(status) => {
            if (status === 'verified' && user) {
              setUser({ ...user, isVerified: true });
            }
            setShowKYCVerification(false);
          }}
        />
      )}

      {/* Verification Process Modal */}
      {showVerificationProcess && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <VerificationProcess
              onClose={() => setShowVerificationProcess(false)}
              onComplete={(status) => {
                if (status === 'verified' && user) {
                  setUser({ ...user, isVerified: true });
                }
                setShowVerificationProcess(false);
              }}
            />
          </div>
        </div>
      )}
      </div>

      {/* EXACT BOTTOM NAVIGATION like other gambling apps */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto z-50">
        <div className="grid grid-cols-5 py-2">
          <button 
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center py-2 px-1 ${currentTab === 'home' ? 'text-red-600' : 'text-gray-500'}`}
          >
            <div className="text-lg mb-1">🏠</div>
            <div className="text-xs font-medium">Home</div>
          </button>
          
          <button 
            onClick={() => setShowGameLobby(true)}
            className="flex flex-col items-center py-2 px-1 text-gray-500 hover:text-red-600"
          >
            <div className="text-lg mb-1">🎮</div>
            <div className="text-xs font-medium">Games</div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">7</div>
          </button>
          
          <button 
            onClick={() => setCurrentTab('promotion')}
            className={`flex flex-col items-center py-2 px-1 ${currentTab === 'promotion' ? 'text-red-600' : 'text-gray-500'}`}
          >
            <div className="text-lg mb-1">🎁</div>
            <div className="text-xs font-medium">Promotion</div>
          </button>
          
          <button 
            onClick={() => setCurrentTab('wallet')}
            className={`flex flex-col items-center py-2 px-1 ${currentTab === 'wallet' ? 'text-red-600' : 'text-gray-500'}`}
          >
            <div className="text-lg mb-1">💰</div>
            <div className="text-xs font-medium">Wallet</div>
          </button>
          
          <button 
            onClick={() => setCurrentTab('account')}
            className={`flex flex-col items-center py-2 px-1 ${currentTab === 'account' ? 'text-red-600' : 'text-gray-500'}`}
          >
            <div className="text-lg mb-1">👤</div>
            <div className="text-xs font-medium">Account</div>
          </button>
        </div>
      </div>

      {/* Add bottom padding to account for fixed navigation */}
      <div className="h-16"></div>

      {/* Achievement Notification System */}
      <AnimatedAchievementNotification
        achievement={currentNotification}
        isVisible={!!currentNotification}
        onClose={closeNotification}
        onRewardPreview={handleRewardPreview}
      />

      {/* Reward Preview Modal */}
      <RewardPreviewModal
        achievement={selectedAchievement}
        isVisible={showRewardPreview}
        onClose={() => setShowRewardPreview(false)}
        onClaim={handleClaimReward}
      />

      {/* Demo Achievement Trigger Button (for testing) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={triggerRandomAchievement}
          className="fixed top-4 right-4 z-50 bg-yellow-500 text-black px-3 py-2 rounded-lg font-bold text-sm shadow-lg"
        >
          🏆 Test Achievement
        </button>
      )}
    </ComprehensiveAnimationSystem>
  );
}