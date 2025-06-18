import { useState, useEffect } from 'react';
import { Gift, Star, Trophy, Zap } from 'lucide-react';

interface Reward {
  id: string;
  type: 'daily' | 'achievement' | 'level' | 'streak';
  title: string;
  amount: number;
  claimed: boolean;
  requirement?: string;
}

export const useRewardSystem = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [totalRewards, setTotalRewards] = useState(0);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = () => {
    const savedRewards = localStorage.getItem('userRewards');
    if (savedRewards) {
      const parsed = JSON.parse(savedRewards);
      setRewards(parsed.rewards || []);
      setTotalRewards(parsed.total || 0);
    } else {
      // Initialize default rewards
      const defaultRewards: Reward[] = [
        {
          id: 'daily_login',
          type: 'daily',
          title: 'Daily Login Bonus',
          amount: 100,
          claimed: false
        },
        {
          id: 'first_win',
          type: 'achievement',
          title: 'First Win',
          amount: 250,
          claimed: false,
          requirement: 'Win your first game'
        },
        {
          id: 'win_streak_5',
          type: 'streak',
          title: '5 Win Streak',
          amount: 500,
          claimed: false,
          requirement: 'Win 5 games in a row'
        },
        {
          id: 'level_5',
          type: 'level',
          title: 'Reach Level 5',
          amount: 1000,
          claimed: false,
          requirement: 'Reach player level 5'
        }
      ];
      setRewards(defaultRewards);
      saveRewards(defaultRewards, 0);
    }
  };

  const saveRewards = (newRewards: Reward[], newTotal: number) => {
    localStorage.setItem('userRewards', JSON.stringify({
      rewards: newRewards,
      total: newTotal
    }));
  };

  const claimReward = (rewardId: string) => {
    setRewards(prev => {
      const newRewards = prev.map(reward => 
        reward.id === rewardId 
          ? { ...reward, claimed: true }
          : reward
      );
      
      const claimedReward = prev.find(r => r.id === rewardId);
      const newTotal = totalRewards + (claimedReward?.amount || 0);
      setTotalRewards(newTotal);
      
      saveRewards(newRewards, newTotal);
      return newRewards;
    });
  };

  const addReward = (reward: Omit<Reward, 'id'>) => {
    const newReward: Reward = {
      ...reward,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    setRewards(prev => {
      const newRewards = [...prev, newReward];
      saveRewards(newRewards, totalRewards);
      return newRewards;
    });
  };

  const getUnclaimedRewards = () => rewards.filter(r => !r.claimed);
  const getClaimedRewards = () => rewards.filter(r => r.claimed);

  return {
    rewards,
    totalRewards,
    claimReward,
    addReward,
    getUnclaimedRewards,
    getClaimedRewards
  };
};

interface RewardNotificationProps {
  reward: Reward;
  onClaim: () => void;
  onDismiss: () => void;
}

export const RewardNotification = ({ reward, onClaim, onDismiss }: RewardNotificationProps) => {
  const getIcon = () => {
    switch (reward.type) {
      case 'daily': return <Gift className="text-blue-400" size={24} />;
      case 'achievement': return <Trophy className="text-yellow-400" size={24} />;
      case 'level': return <Star className="text-purple-400" size={24} />;
      case 'streak': return <Zap className="text-orange-400" size={24} />;
      default: return <Gift className="text-blue-400" size={24} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl p-6 max-w-sm w-full text-center border border-purple-500/50">
        <div className="mb-4">
          {getIcon()}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{reward.title}</h3>
        
        <div className="text-3xl font-bold text-yellow-400 mb-4">
          +₹{reward.amount}
        </div>
        
        {reward.requirement && (
          <p className="text-gray-300 text-sm mb-6">{reward.requirement}</p>
        )}
        
        <div className="flex gap-3">
          <button
            onClick={onClaim}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-bold hover:scale-105 transition-all"
          >
            Claim Reward
          </button>
          <button
            onClick={onDismiss}
            className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};