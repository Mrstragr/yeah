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
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-500 rounded"></div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={logout}
            className="px-4 py-1 bg-yellow-600 text-black rounded text-sm font-medium"
          >
            Log in
          </button>
          <button className="px-4 py-1 bg-yellow-500 text-black rounded text-sm font-medium">
            Register
          </button>
        </div>
      </div>

      {/* Detail Banner */}
      <div className="bg-yellow-500 text-black text-center py-2 flex items-center justify-center gap-2">
        <span className="bg-yellow-600 px-2 py-1 rounded text-xs">Detail</span>
      </div>

      {/* Winning Information Section */}
      {showWinningInfo && (
        <div className="bg-gradient-to-r from-yellow-700 to-yellow-600 p-4 m-4 rounded-lg relative">
          <button 
            onClick={() => setShowWinningInfo(false)}
            className="absolute top-2 right-2 text-white text-xl"
          >
            ×
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-yellow-800 text-lg">💰</span>
            </div>
            <span className="text-white font-medium">Winning information</span>
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-yellow-800 text-lg">💰</span>
            </div>
          </div>
        </div>
      )}

      {/* Game Categories Grid */}
      <div className="grid grid-cols-4 gap-4 p-4">
        <div 
          className={`flex flex-col items-center p-3 rounded-lg ${activeSection === 'lobby' ? 'bg-yellow-600' : 'bg-gray-800'}`}
          onClick={() => setActiveSection('lobby')}
        >
          <div className="w-8 h-8 mb-2 bg-yellow-500 rounded"></div>
          <span className="text-xs text-center">Lobby</span>
        </div>
        
        <div 
          className={`flex flex-col items-center p-3 rounded-lg ${activeSection === 'lottery' ? 'bg-yellow-600' : 'bg-gray-800'}`}
          onClick={() => setActiveSection('lottery')}
        >
          <div className="w-8 h-8 mb-2 bg-yellow-500 rounded"></div>
          <span className="text-xs text-center">Lottery</span>
        </div>

        <div 
          className={`flex flex-col items-center p-3 rounded-lg ${activeSection === 'popular' ? 'bg-yellow-600' : 'bg-gray-800'}`}
          onClick={() => setActiveSection('popular')}
        >
          <div className="w-8 h-8 mb-2 bg-yellow-500 rounded"></div>
          <span className="text-xs text-center">Popular</span>
        </div>

        <div 
          className={`flex flex-col items-center p-3 rounded-lg ${activeSection === 'minigame' ? 'bg-yellow-600' : 'bg-gray-800'}`}
          onClick={() => setActiveSection('minigame')}
        >
          <div className="w-8 h-8 mb-2 bg-yellow-500 rounded"></div>
          <span className="text-xs text-center">Mini Game</span>
        </div>

        <div 
          className={`flex flex-col items-center p-3 rounded-lg ${activeSection === 'casino' ? 'bg-yellow-600' : 'bg-gray-800'}`}
          onClick={() => setActiveSection('casino')}
        >
          <div className="w-8 h-8 mb-2 bg-yellow-500 rounded"></div>
          <span className="text-xs text-center">Casino</span>
        </div>

        <div 
          className={`flex flex-col items-center p-3 rounded-lg ${activeSection === 'slots' ? 'bg-yellow-600' : 'bg-gray-800'}`}
          onClick={() => setActiveSection('slots')}
        >
          <div className="w-8 h-8 mb-2 bg-yellow-500 rounded"></div>
          <span className="text-xs text-center">Slots</span>
        </div>

        <div 
          className={`flex flex-col items-center p-3 rounded-lg ${activeSection === 'sports' ? 'bg-yellow-600' : 'bg-gray-800'}`}
          onClick={() => setActiveSection('sports')}
        >
          <div className="w-8 h-8 mb-2 bg-yellow-500 rounded"></div>
          <span className="text-xs text-center">Sports</span>
        </div>

        <div 
          className={`flex flex-col items-center p-3 rounded-lg ${activeSection === 'fishing' ? 'bg-yellow-600' : 'bg-gray-800'}`}
          onClick={() => setActiveSection('fishing')}
        >
          <div className="w-8 h-8 mb-2 bg-yellow-500 rounded"></div>
          <span className="text-xs text-center">Fishing</span>
        </div>
      </div>

      {/* Game Sections */}
      <div className="p-4 space-y-4">
        {/* Lottery Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            <span className="font-medium">Lottery</span>
          </div>
        </div>

        {/* Recommended Games */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            <span className="font-medium">Recommended Games</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-sm">Detail</span>
            <span className="text-gray-400">{"<"}</span>
            <span className="text-gray-400">{">"}</span>
          </div>
        </div>

        {/* Mini games */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            <span className="font-medium">Mini games</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-sm">Detail</span>
            <span className="text-gray-400">{"<"}</span>
            <span className="text-gray-400">{">"}</span>
          </div>
        </div>

        {/* Casino */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            <span className="font-medium">Casino</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-sm">Detail</span>
            <span className="text-gray-400">{"<"}</span>
            <span className="text-gray-400">{">"}</span>
          </div>
        </div>

        {/* Slots */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            <span className="font-medium">Slots</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-sm">Detail</span>
            <span className="text-gray-400">{"<"}</span>
            <span className="text-gray-400">{">"}</span>
          </div>
        </div>

        {/* Sports */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            <span className="font-medium">Sports</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-sm">Detail</span>
            <span className="text-gray-400">{"<"}</span>
            <span className="text-gray-400">{">"}</span>
          </div>
        </div>

        {/* Rummy */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            <span className="font-medium">Rummy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-sm">Detail</span>
            <span className="text-gray-400">{"<"}</span>
            <span className="text-gray-400">{">"}</span>
          </div>
        </div>

        {/* Fishing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            <span className="font-medium">Fishing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-sm">Detail</span>
            <span className="text-gray-400">{"<"}</span>
            <span className="text-gray-400">{">"}</span>
          </div>
        </div>
      </div>

      {/* Today's Earnings Chart */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-yellow-500 rounded"></div>
          <span className="font-medium">Today's earnings chart</span>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-800 p-3 rounded">
              <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm">No ***ata</div>
                <div className="text-yellow-500 text-lg">0.00</div>
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

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-700">
        <div className="grid grid-cols-5 py-2">
          <div className="flex flex-col items-center py-2">
            <div className="w-6 h-6 bg-yellow-500 rounded mb-1"></div>
            <span className="text-xs text-yellow-500">Promotion</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <div className="w-6 h-6 bg-gray-500 rounded mb-1"></div>
            <span className="text-xs text-gray-400">Activity</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <div className="w-6 h-6 bg-gray-500 rounded mb-1"></div>
            <span className="text-xs text-gray-400">Home</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <div className="w-6 h-6 bg-gray-500 rounded mb-1"></div>
            <span className="text-xs text-gray-400">Wallet</span>
          </div>
          <div className="flex flex-col items-center py-2">
            <div className="w-6 h-6 bg-gray-500 rounded mb-1"></div>
            <span className="text-xs text-gray-400">Account</span>
          </div>
        </div>
      </div>

      {/* Super Jackpot Modal */}
      {showJackpotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-yellow-500 text-black p-6 rounded-lg text-center max-w-sm mx-4">
            <div className="w-16 h-16 bg-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🎰</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Congratulation</h2>
            <p className="mb-4">
              Get 【Super Jackpot】!<br />
              Visit the [Super Jackpot] page to claim your reward
            </p>
            <button 
              onClick={() => setShowJackpotModal(false)}
              className="bg-yellow-600 text-black px-8 py-2 rounded font-medium"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Loading overlay when needed */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 text-white text-sm">
        loading...
      </div>
    </div>
  );
}