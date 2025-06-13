import { useState } from "react";
import { Gift, Star, Clock, Users, Zap, Crown, Trophy, Calendar } from "lucide-react";

export function DreamClubPromotion() {
  const [activeTab, setActiveTab] = useState("ongoing");

  const tabs = [
    { id: "ongoing", name: "Ongoing" },
    { id: "upcoming", name: "Upcoming" },
    { id: "completed", name: "Completed" },
  ];

  const promotions = [
    {
      id: 1,
      title: "Welcome Bonus",
      description: "Get 100% bonus on your first deposit up to ₹10,000",
      reward: "₹10,000",
      type: "deposit",
      status: "ongoing",
      timeLeft: "No Expiry",
      participants: "15,234",
      icon: Gift,
      gradient: "from-purple-500 to-pink-500",
      claimed: false,
    },
    {
      id: 2,
      title: "Daily Check-in",
      description: "Login daily to claim amazing rewards and bonuses",
      reward: "₹100-₹1,000",
      type: "daily",
      status: "ongoing",
      timeLeft: "Resets in 4h",
      participants: "8,521",
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
      claimed: true,
    },
    {
      id: 3,
      title: "VIP Weekend",
      description: "Exclusive weekend bonuses for VIP members only",
      reward: "₹5,000",
      type: "vip",
      status: "ongoing",
      timeLeft: "2 days left",
      participants: "1,205",
      icon: Crown,
      gradient: "from-yellow-500 to-orange-500",
      claimed: false,
    },
    {
      id: 4,
      title: "Lucky Spin",
      description: "Spin the wheel and win up to ₹50,000 in prizes",
      reward: "₹50,000",
      type: "game",
      status: "ongoing",
      timeLeft: "5 days left",
      participants: "12,847",
      icon: Zap,
      gradient: "from-green-500 to-emerald-500",
      claimed: false,
    },
    {
      id: 5,
      title: "Tournament",
      description: "Compete with other players in our weekly tournament",
      reward: "₹25,000",
      type: "tournament",
      status: "upcoming",
      timeLeft: "Starts in 2 days",
      participants: "2,156",
      icon: Trophy,
      gradient: "from-red-500 to-pink-500",
      claimed: false,
    },
  ];

  const filteredPromotions = promotions.filter(promo => promo.status === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold mb-2">Promotions</h1>
        <p className="text-gray-400 text-sm">Claim amazing bonuses and rewards</p>
      </div>

      {/* Featured Promotion */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-3">
            <Star className="w-5 h-5 text-yellow-300" />
            <span className="text-yellow-300 text-sm font-medium">FEATURED</span>
          </div>
          <h3 className="text-white text-xl font-bold mb-2">Mega Jackpot Week</h3>
          <p className="text-white/90 text-sm mb-4">
            Win big this week! Increased jackpots on all games up to ₹1,00,000
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-white/70 text-xs">Prize Pool</p>
                <p className="text-white font-bold text-lg">₹1,00,000</p>
              </div>
              <div>
                <p className="text-white/70 text-xs">Time Left</p>
                <p className="text-white font-bold text-lg">5d 12h</p>
              </div>
            </div>
            <button className="bg-white text-purple-600 px-6 py-3 rounded-2xl font-bold text-sm">
              Join Now
            </button>
          </div>
        </div>
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full"></div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800/50 rounded-2xl p-2 mb-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Promotions List */}
      <div className="space-y-4">
        {filteredPromotions.map((promo) => {
          const Icon = promo.icon;
          
          return (
            <div key={promo.id} className="bg-slate-800/50 rounded-2xl p-4 relative overflow-hidden">
              {promo.claimed && (
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  CLAIMED
                </div>
              )}
              
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${promo.gradient} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-1">{promo.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{promo.description}</p>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Gift className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm font-bold">{promo.reward}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">{promo.timeLeft}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">{promo.participants}</span>
                    </div>
                  </div>
                  
                  <button 
                    disabled={promo.claimed}
                    className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
                      promo.claimed
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : `bg-gradient-to-r ${promo.gradient} text-white hover:scale-105`
                    }`}
                  >
                    {promo.claimed ? "Already Claimed" : 
                     promo.status === "upcoming" ? "Set Reminder" : "Claim Now"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* My Rewards Section */}
      <div className="mt-8">
        <h3 className="text-white text-lg font-semibold mb-4">My Rewards</h3>
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Rewards Claimed</p>
              <p className="text-white text-2xl font-bold">₹15,750</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Available Balance</p>
              <p className="text-green-400 text-xl font-bold">₹2,500</p>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium mt-4">
            View Reward History
          </button>
        </div>
      </div>
    </div>
  );
}