import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Gift, 
  Users, 
  Share2, 
  Copy, 
  Check, 
  Trophy, 
  Star,
  Calendar,
  Clock,
  DollarSign
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  walletBalance: string;
  bonusBalance: string;
  referralCode?: string;
}

interface Promotion {
  id: number;
  title: string;
  description: string;
  type: string;
  value: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  remainingUses?: number;
  maxUses?: number;
}

interface Referral {
  id: number;
  referredUsername: string;
  bonus: string;
  status: string;
  createdAt: string;
}

interface PromotionalSystemProps {
  user: User;
}

export function PromotionalSystem({ user }: PromotionalSystemProps) {
  const [promoCode, setPromoCode] = useState("");
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  // Fetch active promotions
  const { data: promotions = [] } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions/active"],
  });

  // Fetch user referrals
  const { data: referrals = [] } = useQuery<Referral[]>({
    queryKey: ["/api/referrals", user.id],
  });

  // Apply promo code mutation
  const applyPromoCode = useMutation({
    mutationFn: (code: string) => apiRequest("POST", "/api/promotions/apply", { code }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setPromoCode("");
    },
  });

  // Copy referral code
  const copyReferralCode = () => {
    if (user.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAmount = (amount: string) => {
    return `₹${parseFloat(amount).toLocaleString()}`;
  };

  const getPromotionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'welcome': return <Gift className="w-5 h-5" />;
      case 'deposit': return <DollarSign className="w-5 h-5" />;
      case 'referral': return <Users className="w-5 h-5" />;
      case 'loyalty': return <Star className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  const getPromotionColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'welcome': return 'from-green-500 to-emerald-500';
      case 'deposit': return 'from-blue-500 to-cyan-500';
      case 'referral': return 'from-purple-500 to-pink-500';
      case 'loyalty': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const isPromotionActive = (promotion: Promotion) => {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    return promotion.isActive && now >= start && now <= end;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
            Promotions & Rewards
          </h1>
          <p className="text-gray-300">Unlock exclusive bonuses and earn with referrals</p>
        </div>

        <Tabs defaultValue="promotions" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="promotions" className="data-[state=active]:bg-purple-600">
              Active Promotions
            </TabsTrigger>
            <TabsTrigger value="referrals" className="data-[state=active]:bg-purple-600">
              Referral Program
            </TabsTrigger>
            <TabsTrigger value="bonuses" className="data-[state=active]:bg-purple-600">
              My Bonuses
            </TabsTrigger>
          </TabsList>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-6">
            {/* Promo Code Input */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-yellow-400" />
                  Enter Promo Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter promotional code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button
                    onClick={() => applyPromoCode.mutate(promoCode)}
                    disabled={!promoCode.trim() || applyPromoCode.isPending}
                    className="bg-green-600 hover:bg-green-700 px-8"
                  >
                    {applyPromoCode.isPending ? "Applying..." : "Apply"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Promotions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promotion) => (
                <Card key={promotion.id} className="bg-gray-800/50 border-gray-700 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Promotion Header */}
                    <div className={`bg-gradient-to-r ${getPromotionColor(promotion.type)} p-4`}>
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          {getPromotionIcon(promotion.type)}
                          <Badge className="bg-white/20 text-white">
                            {promotion.type.toUpperCase()}
                          </Badge>
                        </div>
                        {isPromotionActive(promotion) ? (
                          <Badge className="bg-green-600 text-white">ACTIVE</Badge>
                        ) : (
                          <Badge className="bg-red-600 text-white">EXPIRED</Badge>
                        )}
                      </div>
                    </div>

                    {/* Promotion Content */}
                    <div className="p-4">
                      <h3 className="text-white font-bold text-lg mb-2">{promotion.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{promotion.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Bonus Value</span>
                          <span className="text-green-400 font-semibold">{promotion.value}</span>
                        </div>
                        
                        {promotion.remainingUses !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Uses Remaining</span>
                            <span className="text-yellow-400 font-semibold">
                              {promotion.remainingUses}/{promotion.maxUses}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Valid Until</span>
                          <span className="text-blue-400 text-sm">
                            {new Date(promotion.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {isPromotionActive(promotion) && (
                        <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                          Claim Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            {/* Referral Code Card */}
            <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-purple-400" />
                  Your Referral Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Share this code and earn bonuses</p>
                      <p className="text-2xl font-bold text-white tracking-wider">
                        {user.referralCode || "LOADING..."}
                      </p>
                    </div>
                    <Button
                      onClick={copyReferralCode}
                      variant="outline"
                      className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{referrals.length}</p>
                    <p className="text-gray-400 text-sm">Successful Referrals</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">
                      {formatAmount(referrals.reduce((sum, ref) => sum + parseFloat(ref.bonus), 0).toString())}
                    </p>
                    <p className="text-gray-400 text-sm">Total Earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral Rules */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">How Referrals Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <div>
                      <h4 className="text-white font-medium">Share Your Code</h4>
                      <p className="text-gray-400 text-sm">Send your unique referral code to friends</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <div>
                      <h4 className="text-white font-medium">Friend Joins & Deposits</h4>
                      <p className="text-gray-400 text-sm">They register with your code and make their first deposit</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <div>
                      <h4 className="text-white font-medium">Both Get Rewards</h4>
                      <p className="text-gray-400 text-sm">You get ₹100 bonus, they get ₹50 welcome bonus</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral History */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Referral History</CardTitle>
              </CardHeader>
              <CardContent>
                {referrals.length > 0 ? (
                  <div className="space-y-3">
                    {referrals.map((referral) => (
                      <div key={referral.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{referral.referredUsername}</p>
                          <p className="text-gray-400 text-sm">
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-semibold">{formatAmount(referral.bonus)}</p>
                          <Badge className={referral.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'}>
                            {referral.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No referrals yet</p>
                    <p className="text-gray-500 text-sm">Start sharing your code to earn bonuses!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bonuses Tab */}
          <TabsContent value="bonuses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Wallet Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Main Balance</p>
                      <p className="text-3xl font-bold text-white">{formatAmount(user.walletBalance)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Bonus Balance</p>
                      <p className="text-2xl font-bold text-yellow-400">{formatAmount(user.bonusBalance)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Daily Bonus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Available in</p>
                    <p className="text-2xl font-bold text-blue-400 mb-4">2h 34m</p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
                      Claim Tomorrow
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}