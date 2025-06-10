import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { WinGoGame } from "@/components/games/lottery-games";
import { AviatorGame, JetXGame } from "@/components/games/crash-games";
import { AndarBaharGame, TeenPattiGame, DragonTigerGame } from "@/components/games/casino-games";
import { SlotMachineGame, MegaJackpotSlot } from "@/components/games/slot-games";
import { ToastManager } from "@/components/toast-notification";
import { CoinFlipGame } from "@/components/games/coin-flip";
import { DiceRollGame } from "@/components/games/dice-roll";
import { HighLowCardGame } from "@/components/games/card-games";
import { EnhancedHeader } from "@/components/enhanced-header";
import { ModernDashboard } from "@/components/modern-dashboard";
import { FloatingNavigation } from "@/components/floating-navigation";

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

  const handleGameWin = async (winAmount: number) => {
    if (!user || winAmount <= 0) return;

    try {
      const response = await fetch('/api/wallet/credit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
          amount: winAmount,
          description: "Game winnings"
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setUserBalance(data.newBalance);
        addToast(`🎉 You won ₹${winAmount}!`, "success");
      }
    } catch (error) {
      console.error("Error crediting winnings:", error);
      addToast("Failed to credit winnings", "error");
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

      {/* Modern Dashboard */}
      <div className="pb-20">
        <ModernDashboard 
          games={games} 
          categories={categories} 
          onGameSelect={openGame}
        />
      </div>

      {/* Toast Notifications */}
      <ToastManager toasts={toasts} removeToast={removeToast} />

      {/* Floating Navigation */}
      <FloatingNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
      />

      {/* Game Renderers */}
      {currentGame === 'wingo1' && (
        <WinGoGame title="Win Go 1Min" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'wingo3' && (
        <WinGoGame title="Win Go 3Min" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === '5d' && (
        <WinGoGame title="5D Lottery" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'k3' && (
        <WinGoGame title="K3 Lottery" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'aviator' && (
        <AviatorGame title="Aviator" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'jetx' && (
        <JetXGame title="JetX" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'andarbahar' && (
        <AndarBaharGame title="Andar Bahar" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'teenpatti' && (
        <TeenPattiGame title="Teen Patti" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'dragontiger' && (
        <DragonTigerGame title="Dragon Tiger" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'baccarat' && (
        <DragonTigerGame title="Baccarat" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'slots' && (
        <SlotMachineGame title="Classic Slots" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'megajackpot' && (
        <MegaJackpotSlot title="Mega Jackpot" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'coinflip' && (
        <CoinFlipGame title="Coin Flip" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'diceroll' && (
        <DiceRollGame title="Dice Roll" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'highlow' && (
        <HighLowCardGame title="High Low Cards" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'bigsmall' && (
        <DiceRollGame title="Big Small" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'wingo5' && (
        <WinGoGame title="Win Go 5Min" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'k3' && (
        <WinGoGame title="K3 Lottery" onPlay={handleGameWin} onClose={closeGame} />
      )}
      {currentGame === 'trx' && (
        <WinGoGame title="Trx Win Go" onPlay={handleGameWin} onClose={closeGame} />
      )}
    </div>
  );
}