import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import WinGoGame from "@/components/games/win-go-game";
import CrashGame from "@/components/games/crash-game";
import DiceGame from "@/components/games/dice-game";
import { ToastManager } from "@/components/toast-notification";
import { EnhancedHeader } from "@/components/enhanced-header";
import { ModernDashboard } from "@/components/modern-dashboard";
import { FloatingNavigation } from "@/components/floating-navigation";
import { TashanWinGameLobby } from "@/components/tashanwin-game-lobby";

interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  bonusBalance: string;
}

interface Game {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  rating: string;
  jackpot: string;
  isActive: boolean;
}

interface GameCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export default function TashanWinMain() {
  const [activeSection, setActiveSection] = useState("home");
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Array<{id: string, message: string, type: "success" | "error" | "info"}>>([]);
  const [userBalance, setUserBalance] = useState<string>("0.00");

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  const { data: games = [] } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const { data: categories = [] } = useQuery<GameCategory[]>({
    queryKey: ["/api/categories"],
  });

  // Update local balance when user data changes
  useEffect(() => {
    if (user) {
      setUserBalance(user.walletBalance);
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem('authToken');
    window.location.href = "/login";
  };

  const openGame = (gameName: string) => {
    setCurrentGame(gameName);
  };

  const closeGame = () => {
    setCurrentGame(null);
  };

  const addToast = (message: string, type: "success" | "error" | "info") => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleGameBet = async (amount: number, gameData?: any) => {
    if (!user) {
      addToast("Please login to place bets", "error");
      return;
    }

    try {
      const response = await fetch('/api/game/bet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          gameId: currentGame,
          betAmount: Math.abs(amount),
          gameData: gameData
        })
      });

      if (response.ok) {
        const result = await response.json();
        setUserBalance(result.newBalance);
        
        if (amount > 0) {
          addToast(`Won ₹${amount}!`, "success");
        } else {
          addToast(`Bet placed: ₹${Math.abs(amount)}`, "info");
        }
      } else {
        const error = await response.json();
        addToast(error.message || "Bet failed", "error");
      }
    } catch (error) {
      addToast("Network error occurred", "error");
    }
  };



  const refreshBalance = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUserBalance(userData.walletBalance);
      }
    } catch (error) {
      console.error("Error refreshing balance:", error);
    }
  };

  const handleGamePlay = async (betAmount: number) => {
    if (!user) return;
    
    const currentBalance = parseFloat(userBalance);
    if (currentBalance < betAmount) {
      addToast("Insufficient balance! Please deposit money to continue.", "error");
      return;
    }

    try {
      const response = await fetch('/api/wallet/deduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ amount: betAmount })
      });

      const data = await response.json();
      
      if (response.ok) {
        setUserBalance(data.newBalance);
        addToast(`Bet placed: ₹${betAmount}`, "info");
      } else {
        addToast(data.message || "Failed to place bet", "error");
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      addToast("Network error. Please check your connection.", "error");
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#D4AF37] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-blue-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-green-500 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-pink-500 rounded-full blur-xl animate-ping"></div>
      </div>

      {/* Enhanced Header */}
      <EnhancedHeader 
        user={user} 
        userBalance={userBalance} 
        onLogout={logout} 
        refreshBalance={refreshBalance}
      />

      {/* Content Based on Active Section */}
      <div className="pb-20">
        {activeSection === 'home' && (
          <TashanWinGameLobby 
            onGameSelect={(gameId, gameTitle) => openGame(gameTitle)}
          />
        )}
        
        {activeSection === 'games' && (
          <TashanWinGameLobby 
            onGameSelect={(gameId, gameTitle) => openGame(gameTitle)}
          />
        )}
        
        {activeSection === 'promotions' && (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-gaming font-bold text-gaming-gold mb-2">
                Promotions & Bonuses
              </h1>
              <p className="text-casino-text-secondary font-exo">
                Claim your daily bonuses and special offers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="game-card p-6 bg-gradient-to-r from-green-600 to-emerald-600">
                <h3 className="text-xl font-gaming font-bold text-white mb-2">Welcome Bonus</h3>
                <p className="text-green-100 mb-4">Get 100% match on your first deposit up to ₹5,000</p>
                <button 
                  onClick={() => addToast("Welcome bonus activated! Check your wallet.", "success")}
                  className="w-full bg-white text-green-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Claim Now
                </button>
              </div>
              <div className="game-card p-6 bg-gradient-to-r from-purple-600 to-pink-600">
                <h3 className="text-xl font-gaming font-bold text-white mb-2">Daily Bonus</h3>
                <p className="text-purple-100 mb-4">Login daily to earn ₹50 bonus credits</p>
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/wallet/daily-bonus', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
                      });
                      const data = await response.json();
                      if (response.ok) {
                        addToast(`Daily bonus claimed! ₹${data.amount} added to your account.`, "success");
                        refreshBalance();
                      } else {
                        addToast(data.message || "Daily bonus already claimed today", "error");
                      }
                    } catch (error) {
                      addToast("Failed to claim daily bonus", "error");
                    }
                  }}
                  className="w-full bg-white text-purple-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Claim Daily
                </button>
              </div>
              <div className="game-card p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h3 className="text-xl font-gaming font-bold text-white mb-2">Referral Bonus</h3>
                <p className="text-blue-100 mb-4">Invite friends and earn ₹100 for each referral</p>
                <button 
                  onClick={() => {
                    const referralLink = `https://tashanwin.ink/ref/${user?.username || 'user'}`;
                    navigator.clipboard.writeText(referralLink);
                    addToast("Referral link copied to clipboard!", "success");
                  }}
                  className="w-full bg-white text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Share Link
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'wallet' && (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-gaming font-bold text-gaming-gold mb-2">
                Wallet & Banking
              </h1>
              <p className="text-casino-text-secondary font-exo">
                Manage your funds securely with real Indian currency transactions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="game-card p-6 bg-gradient-to-r from-green-600 to-emerald-600">
                <h3 className="text-lg font-gaming text-white mb-2">Available Balance</h3>
                <p className="text-3xl font-bold text-white">₹{userBalance}</p>
              </div>
              <div className="game-card p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h3 className="text-lg font-gaming text-white mb-2">Bonus Balance</h3>
                <p className="text-3xl font-bold text-white">₹{user?.bonusBalance || "0.00"}</p>
              </div>
              <div className="game-card p-6 bg-gradient-to-r from-purple-600 to-pink-600">
                <h3 className="text-lg font-gaming text-white mb-2">Total Winnings</h3>
                <p className="text-3xl font-bold text-white">₹{(parseFloat(userBalance) + parseFloat(user?.bonusBalance || "0")).toFixed(2)}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="game-card p-6">
                <h3 className="text-xl font-gaming text-gaming-gold mb-4">Quick Deposit</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[100, 500, 1000, 2500].map((amount) => (
                    <button
                      key={amount}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => window.location.href = '/wallet'}
                  className="w-full bg-gaming-gold text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Deposit Money
                </button>
              </div>
              <div className="game-card p-6">
                <h3 className="text-xl font-gaming text-gaming-gold mb-4">Quick Withdrawal</h3>
                <div className="space-y-3 mb-4">
                  <p className="text-casino-text-secondary">Minimum withdrawal: ₹100</p>
                  <p className="text-casino-text-secondary">Processing time: 1-3 business days</p>
                </div>
                <button 
                  onClick={() => window.location.href = '/wallet'}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Withdraw Money
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'vip' && (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-gaming font-bold text-gaming-gold mb-2">
                VIP Program
              </h1>
              <p className="text-casino-text-secondary font-exo">
                Unlock exclusive benefits and rewards
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="game-card p-8 bg-gradient-to-r from-yellow-600 to-amber-600">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">👑</span>
                  <div>
                    <h3 className="text-2xl font-gaming font-bold text-white">VIP Status</h3>
                    <p className="text-yellow-100">Current Level: Bronze</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-white">
                    <span>Progress to Silver</span>
                    <span>₹2,500 / ₹10,000</span>
                  </div>
                  <div className="w-full bg-yellow-800 rounded-full h-3">
                    <div className="bg-white h-3 rounded-full" style={{width: '25%'}}></div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="game-card p-4">
                  <h4 className="font-gaming text-gaming-gold mb-2">VIP Benefits</h4>
                  <ul className="space-y-2 text-casino-text-secondary">
                    <li>• Higher withdrawal limits</li>
                    <li>• Exclusive bonuses</li>
                    <li>• Priority customer support</li>
                    <li>• Special tournaments</li>
                  </ul>
                </div>
                <div className="game-card p-4">
                  <h4 className="font-gaming text-gaming-gold mb-2">Next Level Rewards</h4>
                  <ul className="space-y-2 text-casino-text-secondary">
                    <li>• 5% cashback on losses</li>
                    <li>• Weekly bonus of ₹500</li>
                    <li>• Dedicated VIP manager</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <ToastManager toasts={toasts} removeToast={removeToast} />

      {/* Floating Navigation */}
      <FloatingNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
      />

      {/* Game Renderers */}
      {(currentGame === 'wingo1' || currentGame === 'wingo3' || currentGame === '5d' || currentGame === 'k3' || currentGame === 'wingo5' || currentGame === 'trx') && (
        <WinGoGame 
          gameId={1} 
          gameTitle={
            currentGame === 'wingo1' ? "Win Go 1Min" :
            currentGame === 'wingo3' ? "Win Go 3Min" :
            currentGame === '5d' ? "5D Lottery" :
            currentGame === 'k3' ? "K3 Lottery" :
            currentGame === 'wingo5' ? "Win Go 5Min" : "Trx Win Go"
          }
          onBet={handleGameBet} 
          onClose={closeGame} 
        />
      )}
      {(currentGame === 'aviator' || currentGame === 'jetx') && (
        <CrashGame 
          gameId={2} 
          gameTitle={currentGame === 'aviator' ? "Aviator" : "JetX"}
          onBet={handleGameBet} 
          onClose={closeGame} 
        />
      )}
      {(currentGame === 'diceroll' || currentGame === 'bigsmall') && (
        <DiceGame 
          gameId={3} 
          gameTitle={currentGame === 'diceroll' ? "Dice Roll" : "Big Small"}
          onBet={handleGameBet} 
          onClose={closeGame} 
        />
      )}
    </div>
  );
}