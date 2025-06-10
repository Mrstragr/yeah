import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Gift, TrendingUp, Clock, Star, Award, Zap } from "lucide-react";

export function PromotionWallet() {
  const [selectedPromotion, setSelectedPromotion] = useState<number | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const { data: promotions = [], isLoading: promotionsLoading } = useQuery({
    queryKey: ["/api/promotions/active"],
    retry: false,
  });

  const { data: promoTransactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/wallet/promo-transactions"],
    retry: false,
  });

  const promoDepositMutation = useMutation({
    mutationFn: async (data: { amount: string; promotionId?: number; promoCode?: string }) => {
      return apiRequest("POST", "/api/wallet/promo-deposit", data);
    },
    onSuccess: (response: any) => {
      toast({
        title: "Promotional Deposit Success!",
        description: `Deposited ₹${depositAmount} + ₹${response.bonusAmount} bonus!`,
      });
      setDepositAmount("");
      setSelectedPromotion(null);
      setPromoCode("");
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/promo-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Promotion Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const claimDailyBonusMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/wallet/daily-bonus", {});
    },
    onSuccess: (response: any) => {
      toast({
        title: "Daily Bonus Claimed!",
        description: `You received ₹${response.amount} daily bonus!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Daily Bonus Unavailable",
        description: error.message || "Try again tomorrow",
        variant: "destructive",
      });
    },
  });

  const handlePromoDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) < 10) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit is ₹10",
        variant: "destructive",
      });
      return;
    }

    promoDepositMutation.mutate({
      amount: depositAmount,
      promotionId: selectedPromotion || undefined,
      promoCode: promoCode || undefined,
    });
  };

  const calculateBonus = (amount: number, promotion: Promotion) => {
    const bonus = (amount * promotion.bonusPercentage) / 100;
    return Math.min(bonus, promotion.maxAmount - promotion.minAmount);
  };

  return (
    <div className="space-y-6">
      {/* Promotion Wallet Balance */}
      <Card className="game-card bg-gradient-to-r from-purple-600 to-pink-600">
        <CardHeader>
          <CardTitle className="flex items-center font-gaming text-white">
            <Gift className="w-6 h-6 mr-2" />
            Promotion Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-purple-200 font-exo">Main Balance</p>
              <p className="text-2xl font-gaming font-bold text-white">
                ₹{user?.walletBalance || "0.00"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-purple-200 font-exo">Bonus Balance</p>
              <p className="text-2xl font-gaming font-bold text-yellow-300">
                ₹{user?.bonusBalance || "0.00"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-purple-200 font-exo">Today's Winnings</p>
              <p className="text-2xl font-gaming font-bold text-green-300">
                ₹{user?.todayWinnings || "0.00"}
              </p>
            </div>
            <div className="text-center">
              <Button
                onClick={() => claimDailyBonusMutation.mutate()}
                disabled={claimDailyBonusMutation.isPending || user?.dailyBonusClaimed}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              >
                <Star className="w-4 h-4 mr-1" />
                {user?.dailyBonusClaimed ? "Claimed" : "Daily Bonus"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Promotions */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="font-gaming text-gaming-gold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Active Promotions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {promotionsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-gaming-gold border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-400 mt-2 font-exo">Loading promotions...</p>
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 font-exo">No active promotions</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promotions.map((promotion: Promotion) => (
                <div
                  key={promotion.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    selectedPromotion === promotion.id
                      ? "border-gaming-gold bg-gaming-gold/10"
                      : "border-gaming-border-light bg-gaming-accent/30 hover:border-gaming-gold/50"
                  }`}
                  onClick={() => setSelectedPromotion(promotion.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-gaming font-bold text-white">{promotion.title}</h3>
                      <p className="text-sm text-gray-400 font-exo">{promotion.description}</p>
                    </div>
                    <Badge className="bg-gaming-gold text-black font-bold">
                      +{promotion.bonusPercentage}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>Min Amount:</span>
                      <span className="text-gaming-gold">₹{promotion.minAmount}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Max Bonus:</span>
                      <span className="text-gaming-gold">₹{promotion.maxAmount}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Remaining Uses:</span>
                      <span className="text-green-400">{promotion.remainingUses}/{promotion.totalUses}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Valid Until:</span>
                      <span className="text-red-400">{new Date(promotion.validUntil).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Promotional Deposit Form */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="font-gaming text-gaming-gold flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Promotional Deposit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePromoDeposit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="promo-amount" className="font-gaming text-gray-300">
                  Deposit Amount (₹)
                </Label>
                <Input
                  id="promo-amount"
                  type="number"
                  placeholder="Enter amount (min ₹10)"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-gaming-accent border-gaming-border-light text-white"
                  min="10"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="promo-code" className="font-gaming text-gray-300">
                  Promo Code (Optional)
                </Label>
                <Input
                  id="promo-code"
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="bg-gaming-accent border-gaming-border-light text-white"
                />
              </div>
            </div>

            {/* Bonus Calculation Preview */}
            {depositAmount && selectedPromotion && (
              <div className="bg-gaming-accent/50 p-4 rounded-lg border border-gaming-gold/30">
                <h4 className="font-gaming font-bold text-gaming-gold mb-2">Bonus Preview</h4>
                {(() => {
                  const promotion = promotions.find((p: Promotion) => p.id === selectedPromotion);
                  const amount = parseFloat(depositAmount) || 0;
                  const bonus = promotion ? calculateBonus(amount, promotion) : 0;
                  const total = amount + bonus;
                  
                  return (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Deposit Amount:</span>
                        <span className="text-white font-bold">₹{amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Bonus Amount:</span>
                        <span className="text-gaming-gold font-bold">₹{bonus.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gaming-border-light pt-2">
                        <div className="flex justify-between">
                          <span className="text-white font-bold">Total Credit:</span>
                          <span className="text-green-400 font-bold text-lg">₹{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <Button
              type="submit"
              disabled={promoDepositMutation.isPending || !depositAmount}
              className="w-full bg-gaming-gold hover:bg-gaming-gold/80 text-black font-gaming font-bold"
            >
              {promoDepositMutation.isPending ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 mr-2" />
                  Deposit with Bonus
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Promotional Transaction History */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="font-gaming text-gaming-gold flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Promotional Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-gaming-gold border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-400 mt-2 font-exo">Loading transactions...</p>
            </div>
          ) : promoTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 font-exo">No promotional transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {promoTransactions.map((transaction: PromoTransaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gaming-accent/30 rounded-lg border border-gaming-border-light"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gaming-gold rounded-full flex items-center justify-center">
                      <Gift className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-exo font-medium text-white">
                        {transaction.promotion.title}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(transaction.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-gaming font-semibold">
                      ₹{transaction.amount} + ₹{transaction.bonusAmount}
                    </div>
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}