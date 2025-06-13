import { useState } from "react";
import { Calendar, TrendingUp, TrendingDown, Clock, Filter } from "lucide-react";

export function DreamClubActivity() {
  const [activeFilter, setActiveFilter] = useState("all");
  
  const filters = [
    { id: "all", name: "All" },
    { id: "bets", name: "Bets" },
    { id: "wins", name: "Wins" },
    { id: "deposits", name: "Deposits" },
    { id: "withdrawals", name: "Withdrawals" },
  ];

  const activities = [
    {
      id: 1,
      type: "win",
      game: "Aviator",
      amount: "+₹2,500",
      time: "2 minutes ago",
      multiplier: "2.5x",
    },
    {
      id: 2,
      type: "bet",
      game: "Coin Flip",
      amount: "-₹100",
      time: "5 minutes ago",
    },
    {
      id: 3,
      type: "win",
      game: "Lucky Numbers",
      amount: "+₹5,000",
      time: "10 minutes ago",
      multiplier: "5.0x",
    },
    {
      id: 4,
      type: "deposit",
      game: "Wallet",
      amount: "+₹1,000",
      time: "1 hour ago",
    },
    {
      id: 5,
      type: "bet",
      game: "Blackjack",
      amount: "-₹200",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold mb-2">Activity</h1>
        <p className="text-gray-400 text-sm">Track your gaming history and transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Wins</p>
              <p className="text-white text-xl font-bold">₹12,500</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Total Bets</p>
              <p className="text-white text-xl font-bold">₹8,300</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-200" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-800/50 rounded-2xl p-2 mb-6">
        <div className="flex space-x-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="text-white font-medium">Today</span>
        </div>
        <button className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-xl">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-sm">Filter</span>
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-slate-800/50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  activity.type === "win" 
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : activity.type === "deposit"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600"
                    : "bg-gradient-to-r from-red-500 to-red-600"
                }`}>
                  {activity.type === "win" ? (
                    <TrendingUp className="w-6 h-6 text-white" />
                  ) : activity.type === "deposit" ? (
                    <TrendingUp className="w-6 h-6 text-white" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-white" />
                  )}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-medium">{activity.game}</p>
                    {activity.multiplier && (
                      <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                        {activity.multiplier}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-bold ${
                  activity.amount.startsWith("+") 
                    ? "text-green-400" 
                    : "text-red-400"
                }`}>
                  {activity.amount}
                </p>
                <p className="text-gray-400 text-xs capitalize">{activity.type}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-8 text-center">
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-medium">
          Load More Activity
        </button>
      </div>
    </div>
  );
}