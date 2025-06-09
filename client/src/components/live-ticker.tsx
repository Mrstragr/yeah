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
    <div className="bg-gradient-to-r from-gaming-gold/20 to-gaming-amber/20 border border-gaming-gold/50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="animate-pulse">
            <i className="fas fa-trophy text-gaming-gold text-xl"></i>
          </div>
          <div>
            <p className="text-gaming-gold font-semibold text-sm">LATEST WINNER</p>
            <p className="text-white font-bold">
              {currentWinner.username} won ${parseFloat(currentWinner.winAmount).toLocaleString()} 
              <span className="text-gray-400 ml-2 font-normal">playing {currentWinner.gameTitle}</span>
            </p>
          </div>
        </div>
        <div className="bg-gaming-gold text-black px-3 py-1 rounded-full text-sm font-bold animate-pulse">
          LIVE
        </div>
      </div>
    </div>
  );
}