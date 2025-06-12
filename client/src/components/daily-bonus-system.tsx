import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Gift,
  Calendar,
  Star,
  Clock,
  CheckCircle,
  Crown,
  Coins,
  Flame
} from "lucide-react";

interface DailyBonusSystemProps {
  user: any;
}

export function DailyBonusSystem({ user }: DailyBonusSystemProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bonusStatus } = useQuery({
    queryKey: ["/api/daily-bonus/status"],
  });

  const claimBonusMutation = useMutation({
    mutationFn: async (day: number) => {
      const response = await apiRequest("POST", "/api/daily-bonus/claim", { day });
      return response.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: "Bonus Claimed!", 
        description: `You received ₹${data.amount}! Come back tomorrow for more.` 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/daily-bonus/status"] });
    },
    onError: () => {
      toast({ 
        title: "Already Claimed", 
        description: "You've already claimed today's bonus. Come back tomorrow!", 
        variant: "destructive" 
      });
    }
  });

  const weeklyBonuses = [
    { day: 1, amount: 500, type: "Cash", icon: "💰", claimed: true },
    { day: 2, amount: 750, type: "Cash", icon: "💵", claimed: true },
    { day: 3, amount: 1000, type: "Cash", icon: "💸", claimed: false },
    { day: 4, amount: 1250, type: "Cash + Bonus", icon: "🎁", claimed: false },
    { day: 5, amount: 1500, type: "Cash", icon: "💎", claimed: false },
    { day: 6, amount: 2000, type: "Mega Bonus", icon: "🏆", claimed: false },
    { day: 7, amount: 5000, type: "Weekly Jackpot", icon: "👑", claimed: false }
  ];

  const currentStreak = 2;
  const canClaim = !weeklyBonuses[currentStreak]?.claimed;
  const nextBonusHours = 18;

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6">
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Gift className="w-12 h-12 text-yellow-400" />
          <h1 className="text-4xl font-bold text-white">Daily Rewards</h1>
          <Gift className="w-12 h-12 text-yellow-400" />
        </div>
        <p className="text-gray-300">Claim your daily bonus and build your streak for bigger rewards!</p>
      </motion.div>

      {/* Current Streak Status */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Flame className="w-16 h-16 text-orange-400" />
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {currentStreak}
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Current Streak</h3>
                  <p className="text-gray-300">You're on fire! Keep it going!</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-400">{currentStreak} Days</div>
                <div className="text-sm text-gray-400">
                  {canClaim ? "Ready to claim!" : `Next bonus in ${nextBonusHours}h`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Calendar */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {weeklyBonuses.map((bonus, index) => {
          const isToday = index === currentStreak;
          const isAvailable = index <= currentStreak && !bonus.claimed;
          const isPast = index < currentStreak;
          
          return (
            <motion.div
              key={bonus.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card 
                className={`relative cursor-pointer transition-all duration-300 ${
                  bonus.claimed 
                    ? 'bg-green-500/20 border-green-500/50'
                    : isToday 
                    ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-yellow-500/50 shadow-lg shadow-yellow-500/25'
                    : isPast
                    ? 'bg-gray-700/30 border-gray-600'
                    : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
                }`}
                onClick={() => setSelectedDay(bonus.day)}
              >
                <CardContent className="p-4 text-center">
                  {/* Day Number */}
                  <div className={`w-8 h-8 rounded-full mx-auto mb-3 flex items-center justify-center text-sm font-bold ${
                    bonus.claimed 
                      ? 'bg-green-500 text-white'
                      : isToday 
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {bonus.claimed ? <CheckCircle className="w-4 h-4" /> : bonus.day}
                  </div>

                  {/* Bonus Icon */}
                  <div className="text-4xl mb-2">{bonus.icon}</div>

                  {/* Amount */}
                  <div className={`font-bold mb-1 ${
                    bonus.claimed ? 'text-green-400' : isToday ? 'text-yellow-400' : 'text-white'
                  }`}>
                    ₹{bonus.amount.toLocaleString()}
                  </div>

                  {/* Type */}
                  <div className="text-xs text-gray-400">{bonus.type}</div>

                  {/* Status Indicator */}
                  {bonus.claimed && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {isToday && !bonus.claimed && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Star className="w-4 h-4 text-black" />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Claim Button */}
      {canClaim && (
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={() => claimBonusMutation.mutate(currentStreak + 1)}
            disabled={claimBonusMutation.isPending}
            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-8 py-4 text-xl font-bold rounded-2xl shadow-lg"
          >
            {claimBonusMutation.isPending ? (
              <>
                <Clock className="w-6 h-6 mr-2 animate-spin" />
                Claiming...
              </>
            ) : (
              <>
                <Gift className="w-6 h-6 mr-2" />
                Claim Today's Bonus
              </>
            )}
          </Button>
        </motion.div>
      )}

      {/* Bonus Information */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-blue-400" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p className="text-gray-300">Login daily to claim your bonus</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p className="text-gray-300">Bonuses increase each consecutive day</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p className="text-gray-300">Miss a day and your streak resets</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p className="text-gray-300">Complete the week for a massive jackpot</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Crown className="w-6 h-6 mr-2 text-yellow-400" />
              VIP Benefits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <p className="text-gray-300">VIP members get 50% bonus rewards</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <p className="text-gray-300">Exclusive weekend mega bonuses</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <p className="text-gray-300">Special holiday rewards</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <p className="text-gray-300">Birthday surprise bonuses</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Selected Day Modal */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDay(null)}
          >
            <motion.div
              className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{weeklyBonuses[selectedDay - 1]?.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">Day {selectedDay} Bonus</h3>
                <p className="text-3xl font-bold text-yellow-400 mb-2">
                  ₹{weeklyBonuses[selectedDay - 1]?.amount.toLocaleString()}
                </p>
                <p className="text-gray-300 mb-6">{weeklyBonuses[selectedDay - 1]?.type}</p>
                
                <Button
                  onClick={() => setSelectedDay(null)}
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}