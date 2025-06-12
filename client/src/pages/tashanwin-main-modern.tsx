import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { UniversalGame } from "@/components/games/universal-game";
import { MobileOptimizedNavigation } from "@/components/mobile-optimized-navigation";
import { PremiumGameInterface } from "@/components/premium-game-interface";
import { TashanWinGameLobby } from "@/components/tashanwin-game-lobby";
import { WalletManagement } from "@/components/wallet-management";
import { AchievementsDashboard } from "@/components/achievements-dashboard";
import { RealTimeDashboard } from "@/components/real-time-dashboard";
import { DailyBonusSystem } from "@/components/daily-bonus-system";
import { ToastManager } from "@/components/toast-notification";

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

export default function TashanWinMainModern() {
  const [activeSection, setActiveSection] = useState("home");
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Array<{id: string, message: string, type: "success" | "error" | "info"}>>([]);

  // User authentication
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  // Games data
  const { data: games = [], isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  // Categories data
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<GameCategory[]>({
    queryKey: ["/api/categories"],
  });

  const addToast = (message: string, type: "success" | "error" | "info") => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleGameSelect = (game: Game) => {
    if (!user) {
      addToast("Please log in to play games", "error");
      return;
    }
    setCurrentGame(game.title);
  };



  const closeGame = () => {
    setCurrentGame(null);
  };

  // Loading state
  if (userLoading || gamesLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading TashanWin...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Optimized Navigation */}
      <MobileOptimizedNavigation 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        user={user}
      />

      {/* Main Content */}
      <div className="pb-20 md:pb-4">
        {/* Home Section - Featured Games and Premium Interface */}
        {activeSection === 'home' && (
          <PremiumGameInterface
            games={games}
            onGameSelect={handleGameSelect}
            user={user}
          />
        )}

        {/* Games Section - Full Game Lobby */}
        {activeSection === 'games' && (
          <div className="px-4">
            <TashanWinGameLobby 
              onGameSelect={(gameId: number, gameTitle: string) => {
                const game = games.find(g => g.id === gameId);
                if (game) handleGameSelect(game);
              }}

            />
          </div>
        )}

        {/* Wallet Section */}
        {activeSection === 'wallet' && (
          <WalletManagement user={user} />
        )}

        {/* Real-Time Dashboard Section */}
        {activeSection === 'analytics' && (
          <RealTimeDashboard user={user} />
        )}

        {/* Promotions Section - Daily Bonus */}
        {activeSection === 'promotions' && (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-8">
            <DailyBonusSystem user={user} />
          </div>
        )}

        {/* Tournaments Section - Achievements */}
        {activeSection === 'tournaments' && (
          <AchievementsDashboard user={user} />
        )}

        {/* Other Sections - Coming Soon */}
        {false && (
          <div className="px-4 pt-8 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="max-w-md mx-auto text-center">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">
                    {activeSection === 'promotions' ? '🎁' : '🏆'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 capitalize">
                  {activeSection}
                </h2>
                <p className="text-gray-400 mb-6">
                  {activeSection === 'promotions' ? 'Exciting bonuses, cashback offers, and exclusive rewards' : 
                   'Competitive tournaments with massive prize pools'}
                </p>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium">
                    Coming Soon
                  </button>
                  <p className="text-xs text-gray-500">
                    Feature launching in next update
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Game Modal */}
      {currentGame && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <UniversalGame 
              game={games.find(g => g.title === currentGame) || games[0]} 
              user={user}
              onBack={closeGame}
            />
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastManager toasts={toasts} removeToast={removeToast} />
    </>
  );
}