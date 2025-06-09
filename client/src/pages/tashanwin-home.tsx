import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Volume2 } from "lucide-react";

// Exact TashanWin Categories
const tashanwinCategories = [
  { 
    name: "Lobby", 
    icon: "🏠", 
    slug: "lobby",
    color: "#ffd700"
  },
  { 
    name: "Lottery", 
    icon: "🎲", 
    slug: "lottery",
    color: "#ff8c00"
  },
  { 
    name: "Popular", 
    icon: "👑", 
    slug: "popular",
    color: "#ff6b6b"
  },
  { 
    name: "Mini Game", 
    icon: "🎮", 
    slug: "minigames",
    color: "#4ecdc4"
  },
  { 
    name: "Casino", 
    icon: "🎰", 
    slug: "casino",
    color: "#45b7d1"
  },
  { 
    name: "Slots", 
    icon: "🎰", 
    slug: "slots",
    color: "#96ceb4"
  },
  { 
    name: "Sports", 
    icon: "⚽", 
    slug: "sports",
    color: "#feca57"
  },
  { 
    name: "PVC", 
    icon: "📺", 
    slug: "pvc",
    color: "#ff9ff3"
  },
  { 
    name: "Fishing", 
    icon: "🎣", 
    slug: "fishing",
    color: "#54a0ff"
  }
];

export default function TashanWinHome() {
  const [mutedSound, setMutedSound] = useState(false);

  const { data: leaderboard } = useQuery({
    queryKey: ["/api/leaderboard"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setMutedSound(!mutedSound)}
          className="text-white hover:bg-white/10"
        >
          <Volume2 className={`w-4 h-4 ${mutedSound ? 'opacity-50' : ''}`} />
        </Button>
        
        <div className="flex gap-2">
          <Button size="sm" className="bg-[#333] text-white border border-[#555] hover:bg-[#444]">
            Log In
          </Button>
          <Button size="sm" className="bg-[#ffd700] text-black hover:bg-[#ffed4e]">
            Register
          </Button>
        </div>
      </div>

      {/* Winning Information Banner */}
      <div className="mx-4 mb-6">
        <Card className="bg-gradient-to-r from-[#8b4513] to-[#a0522d] border-[#ffd700] border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#ffd700] rounded-full flex items-center justify-center">
                <span className="text-[#8b4513] font-bold text-sm">🏆</span>
              </div>
              <div>
                <h3 className="text-[#ffd700] font-bold text-lg">Winning Information</h3>
                <p className="text-white/90 text-sm">Check today's winners and earnings</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#ffd700] ml-auto" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Icons Grid */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          {tashanwinCategories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              <Card className="bg-[#2a2a2a] border-[#444] hover:bg-[#333] transition-colors cursor-pointer">
                <CardContent className="p-3 text-center">
                  <div 
                    className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center text-2xl"
                    style={{ backgroundColor: category.color + '20', border: `2px solid ${category.color}` }}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-white text-sm font-medium">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Game Sections */}
      <div className="px-4 space-y-4">
        {/* Lottery Section */}
        <Card className="bg-[#2a2a2a] border-[#444]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#ff8c00] rounded-lg flex items-center justify-center">
                  🎲
                </div>
                <h3 className="text-white font-bold">Lottery</h3>
              </div>
              <Link href="/category/lottery">
                <Button size="sm" className="bg-[#8b4513] text-[#ffd700] hover:bg-[#a0522d]">
                  Detail
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Games Section */}
        <Card className="bg-[#2a2a2a] border-[#444]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#ff6b6b] rounded-lg flex items-center justify-center">
                  👑
                </div>
                <h3 className="text-white font-bold">Recommended Games</h3>
              </div>
              <Link href="/category/popular">
                <Button size="sm" className="bg-[#8b4513] text-[#ffd700] hover:bg-[#a0522d]">
                  Detail
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Mini Games Section */}
        <Card className="bg-[#2a2a2a] border-[#444]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#4ecdc4] rounded-lg flex items-center justify-center">
                  🎮
                </div>
                <h3 className="text-white font-bold">Mini games</h3>
              </div>
              <Link href="/category/minigames">
                <Button size="sm" className="bg-[#8b4513] text-[#ffd700] hover:bg-[#a0522d]">
                  Detail
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Casino Section */}
        <Card className="bg-[#2a2a2a] border-[#444]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#45b7d1] rounded-lg flex items-center justify-center">
                  🎰
                </div>
                <h3 className="text-white font-bold">Casino</h3>
              </div>
              <Link href="/category/casino">
                <Button size="sm" className="bg-[#8b4513] text-[#ffd700] hover:bg-[#a0522d]">
                  Detail
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Slots Section */}
        <Card className="bg-[#2a2a2a] border-[#444]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#96ceb4] rounded-lg flex items-center justify-center">
                  🎰
                </div>
                <h3 className="text-white font-bold">Slots</h3>
              </div>
              <Link href="/category/slots">
                <Button size="sm" className="bg-[#8b4513] text-[#ffd700] hover:bg-[#a0522d]">
                  Detail
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Sports Section */}
        <Card className="bg-[#2a2a2a] border-[#444]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#feca57] rounded-lg flex items-center justify-center">
                  ⚽
                </div>
                <h3 className="text-white font-bold">Sports</h3>
              </div>
              <Link href="/category/sports">
                <Button size="sm" className="bg-[#8b4513] text-[#ffd700] hover:bg-[#a0522d]">
                  Detail
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Rummy Section */}
        <Card className="bg-[#2a2a2a] border-[#444]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#ff9ff3] rounded-lg flex items-center justify-center">
                  🃏
                </div>
                <h3 className="text-white font-bold">Rummy</h3>
              </div>
              <Link href="/category/rummy">
                <Button size="sm" className="bg-[#8b4513] text-[#ffd700] hover:bg-[#a0522d]">
                  Detail
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Fishing Section */}
        <Card className="bg-[#2a2a2a] border-[#444]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#54a0ff] rounded-lg flex items-center justify-center">
                  🎣
                </div>
                <h3 className="text-white font-bold">Fishing</h3>
              </div>
              <Link href="/category/fishing">
                <Button size="sm" className="bg-[#8b4513] text-[#ffd700] hover:bg-[#a0522d]">
                  Detail
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Earnings Chart */}
      <div className="px-4 mt-8 mb-6">
        <Card className="bg-[#2a2a2a] border-[#444]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#ffd700] rounded-lg flex items-center justify-center">
                📊
              </div>
              <h3 className="text-white font-bold">Today's earnings chart</h3>
            </div>
            
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-[#333] rounded-lg">
                  <div className="w-8 h-8 bg-[#555] rounded-full flex items-center justify-center">
                    👤
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">No ***ata</p>
                    <p className="text-[#ffd700] font-bold">0.00</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Text */}
      <div className="px-4 pb-24 text-center space-y-4 text-sm text-gray-400">
        <p>The platform advocates fairness, justice, and openness. We mainly operate fair lottery, blockchain games, live casinos, and slot machine games.</p>
        <p>ar079 works with more than 10,000 online live game dealers and slot games, all of which are verified fair games.</p>
        <p>ar079 supports fast deposit and withdrawal, and looks forward to your visit.</p>
        <p className="text-red-400">Gambling can be addictive, please play rationally.</p>
        <p className="text-yellow-400">ar079 only accepts customers above the age of 18.</p>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#444]">
        <div className="flex items-center justify-around py-2">
          <Link href="/promotion" className="flex flex-col items-center p-2">
            <div className="w-6 h-6 mb-1">🎁</div>
            <span className="text-xs text-gray-400">Promotion</span>
          </Link>
          
          <Link href="/activity" className="flex flex-col items-center p-2">
            <div className="w-6 h-6 mb-1">🎪</div>
            <span className="text-xs text-gray-400">Activity</span>
          </Link>
          
          <Link href="/" className="flex flex-col items-center p-2">
            <div className="w-6 h-6 mb-1">🏠</div>
            <span className="text-xs text-[#ffd700]">Home</span>
          </Link>
          
          <Link href="/wallet" className="flex flex-col items-center p-2">
            <div className="w-6 h-6 mb-1">💰</div>
            <span className="text-xs text-gray-400">Wallet</span>
          </Link>
          
          <Link href="/account" className="flex flex-col items-center p-2">
            <div className="w-6 h-6 mb-1">👤</div>
            <span className="text-xs text-gray-400">Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}