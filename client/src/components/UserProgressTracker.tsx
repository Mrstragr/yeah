import { useState, useEffect } from 'react';

interface GameProgress {
  gamesPlayed: number;
  totalWinnings: number;
  winStreak: number;
  level: number;
  experience: number;
}

export const useUserProgress = () => {
  const [progress, setProgress] = useState<GameProgress>({
    gamesPlayed: 0,
    totalWinnings: 0,
    winStreak: 0,
    level: 1,
    experience: 0
  });

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('userProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const updateProgress = (gameResult: any) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        totalWinnings: prev.totalWinnings + (gameResult.winAmount || 0),
        winStreak: gameResult.isWin ? prev.winStreak + 1 : 0,
        experience: prev.experience + (gameResult.isWin ? 100 : 25)
      };

      // Level up logic
      const newLevel = Math.floor(newProgress.experience / 1000) + 1;
      if (newLevel > prev.level) {
        newProgress.level = newLevel;
        // Show level up notification
        setTimeout(() => {
          alert(`Congratulations! You reached Level ${newLevel}!`);
        }, 1000);
      }

      // Save to localStorage
      localStorage.setItem('userProgress', JSON.stringify(newProgress));
      return newProgress;
    });
  };

  return { progress, updateProgress };
};