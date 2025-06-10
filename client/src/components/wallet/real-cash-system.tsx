import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CreditCard, Gift, TrendingUp, DollarSign, Star, Zap, Shield, AlertCircle } from "lucide-react";

export function RealCashSystem() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const { data: promotions = [] } = useQuery({
    queryKey: ["/api/promotions"],
    retry: false,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/wallet/transactions"],
    retry: false,
  });

  const depositMutation = useMutation({
    mutationFn: async (data: { amount: string; paymentMethod: string; promoCode?: string }) => {
      return apiRequest("POST", "/api/wallet/deposit", data);
    },
    onSuccess: () => {
      toast({
        title: "Deposit Initiated",
        description: "Your deposit is being processed. Funds will be available shortly.",
      });
      setDepositAmount("");
      setPromoCode("");
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Deposit Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const claimBonusMutation = useMutation({
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
        title: "Bonus Unavailable",
        description: error.message || "Try again tomorrow",
        variant: "destructive",
      });
    },
  });

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) < 10) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit is ₹10",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPaymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    depositMutation.mutate({
      amount: depositAmount,
      paymentMethod: selectedPaymentMethod,
      promoCode: promoCode || undefined,
    });
  };

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: "📱", description: "Instant transfer via UPI" },
    { id: "netbanking", name: "Net Banking", icon: "🏦", description: "Direct bank transfer" },
    { id: "card", name: "Debit/Credit Card", icon: "💳", description: "Secure card payment" },
    { id: "wallet", name: "Digital Wallet", icon: "📲", description: "Paytm, PhonePe, Google Pay" },
  ];

  const bonusOffers = [
    { title: "First Deposit Bonus", bonus: "100%", minAmount: 100, maxBonus: 5000 },
    { title: "Weekend Special", bonus: "50%", minAmount: 500, maxBonus: 2500 },
    { title: "VIP Reload Bonus", bonus: "25%", minAmount: 1000, maxBonus: 10000 },
  ];

  return (
    <div className="space-y-6">
      {/* Cash Balance Overview */}
      <Card className="game-card bg-gradient-to-r from-green-600 to-emerald-600">
        <CardHeader>
          <CardTitle className="flex items-center font-gaming text-white">
            <DollarSign className="w-6 h-6 mr-2" />
            Real Cash Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-green-200 font-exo">Available Balance</p>
              <p className="text-3xl font-gaming font-bold text-white">
                ₹{(user as any)?.walletBalance || "0.00"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-green-200 font-exo">Bonus Balance</p>
              <p className="text-2xl font-gaming font-bold text-yellow-300">
                ₹{(user as any)?.bonusBalance || "0.00"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-green-200 font-exo">Today's Wins</p>
              <p className="text-2xl font-gaming font-bold text-blue-300">
                ₹{(user as any)?.todayWinnings || "0.00"}
              </p>
            </div>
            <div className="text-center">
              <Button
                onClick={() => claimBonusMutation.mutate()}
                disabled={claimBonusMutation.isPending}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold w-full"
              >
                <Star className="w-4 h-4 mr-1" />
                Daily Bonus
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Deposit */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="font-gaming text-gaming-gold flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Quick Deposit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDeposit} className="space-y-6">
            {/* Quick Amount Buttons */}
            <div>
              <Label className="font-gaming text-casino-text-secondary mb-3 block">Quick Amounts</Label>
              <div className="grid grid-cols-4 gap-3">
                {[100, 500, 1000, 2500].map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    onClick={() => setDepositAmount(amount.toString())}
                    variant={depositAmount === amount.toString() ? "default" : "outline"}
                    className="font-bold"
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <Label htmlFor="deposit-amount" className="font-gaming text-casino-text-secondary">
                Custom Amount (₹)
              </Label>
              <Input
                id="deposit-amount"
                type="number"
                placeholder="Enter amount (min ₹10)"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="bg-gaming-accent border-gaming-border-light text-white"
                min="10"
              />
            </div>

            {/* Payment Methods */}
            <div>
              <Label className="font-gaming text-casino-text-secondary mb-3 block">Payment Method</Label>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      selectedPaymentMethod === method.id
                        ? "border-gaming-gold bg-gaming-gold/10"
                        : "border-gaming-border-light bg-gaming-accent/30 hover:border-gaming-gold/50"
                    }`}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <div className="font-gaming font-bold text-white">{method.name}</div>
                    <div className="text-sm text-casino-text-muted">{method.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Code */}
            <div>
              <Label htmlFor="promo-code" className="font-gaming text-gray-300">
                Promo Code (Optional)
              </Label>
              <Input
                id="promo-code"
                type="text"
                placeholder="Enter promo code for bonus"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="bg-gaming-accent border-gaming-border-light text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={depositMutation.isPending || !depositAmount || !selectedPaymentMethod}
              className="w-full bg-gaming-gold hover:bg-gaming-gold/80 text-black font-gaming font-bold text-lg py-6"
            >
              {depositMutation.isPending ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Deposit ₹{depositAmount || "0"} Now
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Promotions */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="font-gaming text-gaming-gold flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            Active Promotions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bonusOffers.map((offer, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white"
              >
                <div className="text-xl font-bold mb-2">{offer.title}</div>
                <div className="text-3xl font-gaming font-bold text-yellow-300 mb-2">
                  +{offer.bonus}
                </div>
                <div className="text-sm space-y-1">
                  <div>Min: ₹{offer.minAmount}</div>
                  <div>Max Bonus: ₹{offer.maxBonus}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="game-card border-blue-500">
        <CardHeader>
          <CardTitle className="font-gaming text-blue-400 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-green-400" />
                <span>SSL Encrypted Transactions</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-green-400" />
                <span>RBI Compliant Gateway</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-green-400" />
                <span>KYC Verified Accounts</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400" />
                <span>24/7 Customer Support</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400" />
                <span>Instant Deposits</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400" />
                <span>Fast Withdrawals (1-3 days)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="font-gaming text-gaming-gold">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 font-exo">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction: any) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gaming-accent/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "deposit" ? "bg-green-600" : "bg-red-600"
                    }`}>
                      {transaction.type === "deposit" ? "↓" : "↑"}
                    </div>
                    <div>
                      <p className="font-exo font-medium text-white capitalize">
                        {transaction.type} - {transaction.description}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(transaction.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-gaming font-semibold ${
                      transaction.type === "deposit" ? "text-green-400" : "text-red-400"
                    }`}>
                      {transaction.type === "deposit" ? "+" : "-"}₹{transaction.amount}
                    </p>
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