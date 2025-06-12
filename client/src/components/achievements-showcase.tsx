import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Star, Target, Flame, Crown, Calendar } from "lucide-react";

interface Achievement {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  condition: string;
  reward: string;
  xpValue: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  isActive: boolean;
  createdAt: string;
}

interface UserAchievement {
  id: number;
  userId: number;
  achievementId: number;
  unlockedAt: string;
  progress: number;
  isCompleted: boolean;
  achievement: Achievement;
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common": return "bg-gray-500";
    case "rare": return "bg-blue-500";
    case "epic": return "bg-purple-500";
    case "legendary": return "bg-orange-500";
    default: return "bg-gray-500";
  }
};

const getRarityIcon = (rarity: string) => {
  switch (rarity) {
    case "common": return <Star className="w-4 h-4" />;
    case "rare": return <Target className="w-4 h-4" />;
    case "epic": return <Flame className="w-4 h-4" />;
    case "legendary": return <Crown className="w-4 h-4" />;
    default: return <Star className="w-4 h-4" />;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "milestone": return <Trophy className="w-5 h-5" />;
    case "streak": return <Flame className="w-5 h-5" />;
    case "gameplay": return <Target className="w-5 h-5" />;
    case "jackpot": return <Crown className="w-5 h-5" />;
    case "special": return <Star className="w-5 h-5" />;
    default: return <Trophy className="w-5 h-5" />;
  }
};

export function AchievementsShowcase() {
  const { data: allAchievements = [] } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const { data: userAchievements = [] } = useQuery<UserAchievement[]>({
    queryKey: ["/api/achievements/me"],
  });

  const completedAchievements = userAchievements.filter(ua => ua.isCompleted);
  const inProgressAchievements = userAchievements.filter(ua => !ua.isCompleted && ua.progress > 0);
  const lockedAchievements = allAchievements.filter(a => 
    !userAchievements.some(ua => ua.achievementId === a.id)
  );

  const totalXP = completedAchievements.reduce((sum, ua) => sum + (ua.achievement?.xpValue || 0), 0);
  const totalRewards = completedAchievements.reduce((sum, ua) => sum + parseFloat(ua.achievement?.reward || "0"), 0);

  return (
    <div className="space-y-4">
      {/* Achievement Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold text-white">{completedAchievements.length}</div>
            <div className="text-sm text-gray-400">Unlocked</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-white">{totalXP}</div>
            <div className="text-sm text-gray-400">Total XP</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-white">{inProgressAchievements.length}</div>
            <div className="text-sm text-gray-400">In Progress</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Crown className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold text-white">₹{totalRewards.toFixed(0)}</div>
            <div className="text-sm text-gray-400">Rewards Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Tabs */}
      <Tabs defaultValue="completed" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="completed">Completed ({completedAchievements.length})</TabsTrigger>
          <TabsTrigger value="progress">In Progress ({inProgressAchievements.length})</TabsTrigger>
          <TabsTrigger value="locked">Locked ({lockedAchievements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedAchievements.map((userAchievement) => (
              <Card key={userAchievement.id} className="relative overflow-hidden border-2 border-green-500/20 bg-green-900/10">
                <div className="absolute top-2 right-2">
                  <Badge className={`${getRarityColor(userAchievement.achievement.rarity)} text-white`}>
                    {getRarityIcon(userAchievement.achievement.rarity)}
                    <span className="ml-1 capitalize">{userAchievement.achievement.rarity}</span>
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(userAchievement.achievement.category)}
                    <CardTitle className="text-lg text-white">{userAchievement.achievement.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{userAchievement.achievement.icon}</div>
                    <p className="text-sm text-gray-300">{userAchievement.achievement.description}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-yellow-400">+{userAchievement.achievement.xpValue} XP</span>
                    <span className="text-green-400">₹{userAchievement.achievement.reward}</span>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    Unlocked: {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressAchievements.map((userAchievement) => (
              <Card key={userAchievement.id} className="relative overflow-hidden border-2 border-blue-500/20 bg-blue-900/10">
                <div className="absolute top-2 right-2">
                  <Badge className={`${getRarityColor(userAchievement.achievement.rarity)} text-white`}>
                    {getRarityIcon(userAchievement.achievement.rarity)}
                    <span className="ml-1 capitalize">{userAchievement.achievement.rarity}</span>
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(userAchievement.achievement.category)}
                    <CardTitle className="text-lg text-white">{userAchievement.achievement.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{userAchievement.achievement.icon}</div>
                    <p className="text-sm text-gray-300">{userAchievement.achievement.description}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">{userAchievement.progress}%</span>
                    </div>
                    <Progress value={userAchievement.progress} className="h-2" />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-yellow-400">+{userAchievement.achievement.xpValue} XP</span>
                    <span className="text-green-400">₹{userAchievement.achievement.reward}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locked" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="relative overflow-hidden border-2 border-gray-500/20 bg-gray-900/10">
                <div className="absolute top-2 right-2">
                  <Badge className="bg-gray-500 text-white">
                    {getRarityIcon(achievement.rarity)}
                    <span className="ml-1 capitalize">{achievement.rarity}</span>
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(achievement.category)}
                    <CardTitle className="text-lg text-gray-400">{achievement.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-4xl mb-2 grayscale">{achievement.icon}</div>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">+{achievement.xpValue} XP</span>
                    <span className="text-gray-500">₹{achievement.reward}</span>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="text-gray-500 border-gray-500">
                      🔒 Locked
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}