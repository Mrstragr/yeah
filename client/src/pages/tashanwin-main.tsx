import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

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
  const [showWinningInfo, setShowWinningInfo] = useState(true);
  const [showJackpotModal, setShowJackpotModal] = useState(false);
  const [activeSection, setActiveSection] = useState("lobby");

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  const { data: games = [] } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const { data: categories = [] } = useQuery<GameCategory[]>({
    queryKey: ["/api/categories"],
  });

  const { data: leaderboard = [] } = useQuery({
    queryKey: ["/api/leaderboard"],
  });

  useEffect(() => {
    // Show jackpot modal after 3 seconds like original
    const timer = setTimeout(() => {
      setShowJackpotModal(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative">
      {/* Header - exactly like original */}
      <div className="flex justify-end items-center p-3 bg-[#1e1e1e]">
        <div className="flex gap-1">
          <button 
            onClick={logout}
            className="px-3 py-1 bg-[#8B5A2B] text-white rounded-sm text-xs"
          >
            Log in
          </button>
          <button className="px-3 py-1 bg-[#D4AF37] text-black rounded-sm text-xs">
            Register
          </button>
        </div>
      </div>

      {/* Detail Banner - exact match */}
      <div className="bg-[#D4AF37] text-black py-1 px-3">
        <div className="flex items-center justify-center">
          <span className="bg-[#8B5A2B] text-white px-2 py-1 rounded-sm text-xs mr-2">🔊</span>
          <span className="bg-[#8B5A2B] text-white px-3 py-1 rounded-sm text-xs">Detail</span>
        </div>
      </div>

      {/* Winning Information Section - exact replica */}
      {showWinningInfo && (
        <div className="bg-gradient-to-r from-[#8B5A2B] to-[#B8860B] p-3 m-3 rounded-lg relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <span className="text-[#8B5A2B] text-sm">💰</span>
              </div>
              <span className="text-white text-sm font-medium">Winning information</span>
              <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <span className="text-[#8B5A2B] text-sm">💰</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Categories Grid - exact 4x2 layout */}
      <div className="grid grid-cols-4 gap-2 p-3">
        <div 
          className={`flex flex-col items-center p-2 rounded ${activeSection === 'lobby' ? 'bg-[#D4AF37]' : 'bg-[#2a2a2a]'}`}
          onClick={() => setActiveSection('lobby')}
        >
          <div className="w-8 h-8 mb-1 flex items-center justify-center">
            <span className="text-[#D4AF37] text-lg">🏠</span>
          </div>
          <span className="text-xs text-center text-white">Lobby</span>
        </div>
        
        <div 
          className={`flex flex-col items-center p-2 rounded ${activeSection === 'lottery' ? 'bg-[#D4AF37]' : 'bg-[#2a2a2a]'}`}
          onClick={() => setActiveSection('lottery')}
        >
          <div className="w-8 h-8 mb-1 flex items-center justify-center">
            <span className="text-[#D4AF37] text-lg">🎲</span>
          </div>
          <span className="text-xs text-center text-white">Lottery</span>
        </div>

        <div 
          className={`flex flex-col items-center p-2 rounded ${activeSection === 'popular' ? 'bg-[#D4AF37]' : 'bg-[#2a2a2a]'}`}
          onClick={() => setActiveSection('popular')}
        >
          <div className="w-8 h-8 mb-1 flex items-center justify-center">
            <span className="text-[#D4AF37] text-lg">⭐</span>
          </div>
          <span className="text-xs text-center text-white">Popular</span>
        </div>

        <div 
          className={`flex flex-col items-center p-2 rounded ${activeSection === 'minigame' ? 'bg-[#D4AF37]' : 'bg-[#2a2a2a]'}`}
          onClick={() => setActiveSection('minigame')}
        >
          <div className="w-8 h-8 mb-1 flex items-center justify-center">
            <span className="text-[#D4AF37] text-lg">🎮</span>
          </div>
          <span className="text-xs text-center text-white">Mini Game</span>
        </div>

        <div 
          className={`flex flex-col items-center p-2 rounded ${activeSection === 'casino' ? 'bg-[#D4AF37]' : 'bg-[#2a2a2a]'}`}
          onClick={() => setActiveSection('casino')}
        >
          <div className="w-8 h-8 mb-1 flex items-center justify-center">
            <span className="text-[#D4AF37] text-lg">♠️</span>
          </div>
          <span className="text-xs text-center text-white">Casino</span>
        </div>

        <div 
          className={`flex flex-col items-center p-2 rounded ${activeSection === 'slots' ? 'bg-[#D4AF37]' : 'bg-[#2a2a2a]'}`}
          onClick={() => setActiveSection('slots')}
        >
          <div className="w-8 h-8 mb-1 flex items-center justify-center">
            <span className="text-[#D4AF37] text-lg">🎰</span>
          </div>
          <span className="text-xs text-center text-white">Slots</span>
        </div>

        <div 
          className={`flex flex-col items-center p-2 rounded ${activeSection === 'sports' ? 'bg-[#D4AF37]' : 'bg-[#2a2a2a]'}`}
          onClick={() => setActiveSection('sports')}
        >
          <div className="w-8 h-8 mb-1 flex items-center justify-center">
            <span className="text-[#D4AF37] text-lg">⚽</span>
          </div>
          <span className="text-xs text-center text-white">Sports</span>
        </div>

        <div 
          className={`flex flex-col items-center p-2 rounded ${activeSection === 'fishing' ? 'bg-[#D4AF37]' : 'bg-[#2a2a2a]'}`}
          onClick={() => setActiveSection('fishing')}
        >
          <div className="w-8 h-8 mb-1 flex items-center justify-center">
            <span className="text-[#D4AF37] text-lg">🎣</span>
          </div>
          <span className="text-xs text-center text-white">Fishing</span>
        </div>
      </div>

      {/* Game Sections - exact match to original */}
      <div className="px-3 space-y-3">
        {/* Lottery Section */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="text-[#D4AF37] text-sm">🎲</span>
          </div>
          <span className="text-white text-sm font-medium">Lottery</span>
        </div>

        {/* Recommended Games */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <span className="text-[#D4AF37] text-sm">👑</span>
            </div>
            <span className="text-white text-sm font-medium">Recommended Games</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#D4AF37] text-xs bg-[#2a2a2a] px-2 py-1 rounded">Detail</span>
            <span className="text-gray-500 text-xs">{"<"}</span>
            <span className="text-gray-500 text-xs">{">"}</span>
          </div>
        </div>

        {/* Mini games */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <span className="text-[#D4AF37] text-sm">🎯</span>
            </div>
            <span className="text-white text-sm font-medium">Mini games</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#D4AF37] text-xs bg-[#2a2a2a] px-2 py-1 rounded">Detail</span>
            <span className="text-gray-500 text-xs">{"<"}</span>
            <span className="text-gray-500 text-xs">{">"}</span>
          </div>
        </div>

        {/* Casino */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <span className="text-[#D4AF37] text-sm">♠️</span>
            </div>
            <span className="text-white text-sm font-medium">Casino</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#D4AF37] text-xs bg-[#2a2a2a] px-2 py-1 rounded">Detail</span>
            <span className="text-gray-500 text-xs">{"<"}</span>
            <span className="text-gray-500 text-xs">{">"}</span>
          </div>
        </div>

        {/* Slots */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <span className="text-[#D4AF37] text-sm">🎰</span>
            </div>
            <span className="text-white text-sm font-medium">Slots</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#D4AF37] text-xs bg-[#2a2a2a] px-2 py-1 rounded">Detail</span>
            <span className="text-gray-500 text-xs">{"<"}</span>
            <span className="text-gray-500 text-xs">{">"}</span>
          </div>
        </div>

        {/* Sports */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <span className="text-[#D4AF37] text-sm">⚽</span>
            </div>
            <span className="text-white text-sm font-medium">Sports</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#D4AF37] text-xs bg-[#2a2a2a] px-2 py-1 rounded">Detail</span>
            <span className="text-gray-500 text-xs">{"<"}</span>
            <span className="text-gray-500 text-xs">{">"}</span>
          </div>
        </div>

        {/* Rummy */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <span className="text-[#D4AF37] text-sm">🃏</span>
            </div>
            <span className="text-white text-sm font-medium">Rummy</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#D4AF37] text-xs bg-[#2a2a2a] px-2 py-1 rounded">Detail</span>
            <span className="text-gray-500 text-xs">{"<"}</span>
            <span className="text-gray-500 text-xs">{">"}</span>
          </div>
        </div>

        {/* Fishing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <span className="text-[#D4AF37] text-sm">🎣</span>
            </div>
            <span className="text-white text-sm font-medium">Fishing</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#D4AF37] text-xs bg-[#2a2a2a] px-2 py-1 rounded">Detail</span>
            <span className="text-gray-500 text-xs">{"<"}</span>
            <span className="text-gray-500 text-xs">{">"}</span>
          </div>
        </div>
      </div>

      {/* Today's Earnings Chart - exact match */}
      <div className="p-3 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="text-[#D4AF37] text-sm">📊</span>
          </div>
          <span className="text-white text-sm font-medium">Today's earnings chart</span>
        </div>
        
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 bg-[#2a2a2a] p-2 rounded">
              <div className="w-8 h-8 bg-[#444] rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-xs">👤</span>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-400">No ***ata</div>
                <div className="text-[#D4AF37] text-sm">0.00</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Description */}
      <div className="p-4 text-sm text-gray-400 leading-relaxed">
        <p className="mb-3">
          The platform advocates fairness, justice, and openness. We mainly operate fair lottery, 
          blockchain games, live casinos, and slot machine games.
        </p>
        <p className="mb-3">
          ar079 works with more than 10,000 online live game dealers and slot games, 
          all of which are verified fair games.
        </p>
        <p className="mb-3">
          ar079 supports fast deposit and withdrawal, and looks forward to your visit.
        </p>
        <p className="mb-3 text-red-400">
          Gambling can be addictive, please play rationally.
        </p>
        <p className="text-yellow-500">
          ar079 only accepts customers above the age of 18.
        </p>
      </div>

      {/* Bottom Navigation - exact TashanWin layout */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-[#333]">
        <div className="grid grid-cols-5 py-1">
          <div className="flex flex-col items-center py-2">
            <div className="w-5 h-5 flex items-center justify-center mb-1">
              <span className="text-[#D4AF37] text-sm">🎁</span>
            </div>
            <span className="text-[#D4AF37] text-xs">Promotion</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <div className="w-5 h-5 flex items-center justify-center mb-1">
              <span className="text-gray-500 text-sm">📅</span>
            </div>
            <span className="text-gray-500 text-xs">Activity</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <div className="w-5 h-5 flex items-center justify-center mb-1">
              <span className="text-gray-500 text-sm">🏠</span>
            </div>
            <span className="text-gray-500 text-xs">Home</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <div className="w-5 h-5 flex items-center justify-center mb-1">
              <span className="text-gray-500 text-sm">💰</span>
            </div>
            <span className="text-gray-500 text-xs">Wallet</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <div className="w-5 h-5 flex items-center justify-center mb-1">
              <span className="text-gray-500 text-sm">👤</span>
            </div>
            <span className="text-gray-500 text-xs">Account</span>
          </div>
        </div>
      </div>

      {/* Super Jackpot Modal - exact TashanWin style */}
      {showJackpotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#D4AF37] text-black p-4 rounded-lg text-center max-w-xs mx-4">
            <div className="w-12 h-12 bg-[#8B5A2B] rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-[#D4AF37] text-lg">🎰</span>
            </div>
            <h2 className="text-lg font-bold mb-2">Congratulation</h2>
            <p className="text-sm mb-4">
              Get 【Super Jackpot】!<br />
              Visit the [Super Jackpot] page to claim your reward
            </p>
            <button 
              onClick={() => setShowJackpotModal(false)}
              className="bg-[#8B5A2B] text-white px-6 py-2 rounded text-sm font-medium"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Loading text - exact position */}
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs">
        loading...
      </div>
    </div>
  );
}