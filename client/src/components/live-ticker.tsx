import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TopEarner } from "@/lib/types";

export function LiveTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { data: topEarners } = useQuery<TopEarner[]>({
    queryKey: ["/api/leaderboard"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    if (!topEarners || topEarners.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topEarners.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [topEarners]);

  if (!topEarners || topEarners.length === 0) return null;

  const currentWinner = topEarners[currentIndex];

  return (
    <div className="bg-gaming-secondary/80 backdrop-blur-sm border border-gaming-border-light rounded-lg p-4 mb-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-gaming-gold">
            <i className="fas fa-trophy text-xl animate-pulse"></i>
          </div>
          <div>
            <p className="text-gaming-gold font-gaming font-bold text-sm tracking-widest uppercase">Latest Winner</p>
            <p className="text-white font-gaming font-bold text-lg">
              {currentWinner.username}
              <span className="text-gaming-gold mx-2">won</span>
              ${parseFloat(currentWinner.winAmount).toLocaleString()}
            </p>
            <p className="text-gray-400 font-exo text-sm">
              {currentWinner.gameTitle}
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-gaming-red to-red-500 text-white px-4 py-2 rounded-full text-xs font-gaming font-bold tracking-wide shadow-lg animate-pulse">
          <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
          LIVE
        </div>
      </div>
    </div>
  );
}