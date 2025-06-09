import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { User, WalletTransaction } from "@shared/schema";

export function WalletDashboard() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("upi");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  const { data: transactions = [] } = useQuery<WalletTransaction[]>({
    queryKey: ["/api/wallet/transactions"],
    enabled: !!user,
  });

  const depositMutation = useMutation({
    mutationFn: async (data: { amount: string; paymentMethod: string }) => {
      const response = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create deposit');
      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to Razorpay payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    },
    onError: (error) => {
      toast({
        title: "Deposit Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async (data: { amount: string }) => {
      const response = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to process withdrawal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/transactions"] });
      setWithdrawAmount("");
      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted for processing.",
      });
    },
    onError: (error) => {
      toast({
        title: "Withdrawal Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) < 10) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is ₹10",
        variant: "destructive",
      });
      return;
    }

    depositMutation.mutate({
      amount: depositAmount,
      paymentMethod: selectedPaymentMethod,
    });
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum withdrawal amount is ₹100",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(withdrawAmount) > parseFloat(user?.walletBalance || "0")) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    withdrawMutation.mutate({ amount: withdrawAmount });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(parseFloat(amount));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "outline" as const, text: "Pending" },
      completed: { variant: "default" as const, text: "Completed" },
      failed: { variant: "destructive" as const, text: "Failed" },
      cancelled: { variant: "secondary" as const, text: "Cancelled" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  if (!user) {
    return (
      <Card className="game-card">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">Please log in to access your wallet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="game-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-gaming text-gray-400">Main Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-gaming font-bold text-gaming-gold">
              {formatCurrency(user.walletBalance || "0")}
            </div>
            <p className="text-xs text-gray-400 mt-1">Available for games</p>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-gaming text-gray-400">Bonus Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-gaming font-bold text-gaming-blue">
              {formatCurrency(user.bonusBalance || "0")}
            </div>
            <p className="text-xs text-gray-400 mt-1">Promotional credits</p>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-gaming text-gray-400">KYC Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusBadge(user.kycStatus || "pending")}
              {user.kycStatus === "verified" && (
                <i className="fas fa-check-circle text-gaming-green"></i>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">Verification status</p>
          </CardContent>
        </Card>
      </div>

      {/* Deposit/Withdraw Tabs */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="font-gaming text-gaming-gold">Wallet Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gaming-accent">
              <TabsTrigger value="deposit" className="font-gaming">Add Money</TabsTrigger>
              <TabsTrigger value="withdraw" className="font-gaming">Withdraw</TabsTrigger>
            </TabsList>

            <TabsContent value="deposit" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deposit-amount" className="font-gaming text-gray-300">Amount (INR)</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="Enter amount (min ₹10)"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="bg-gaming-accent border-gaming-border-light text-white"
                  />
                </div>

                <div>
                  <Label className="font-gaming text-gray-300">Payment Method</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[
                      { id: "upi", name: "UPI", icon: "fas fa-mobile-alt" },
                      { id: "netbanking", name: "Net Banking", icon: "fas fa-university" },
                      { id: "card", name: "Debit/Credit Card", icon: "fas fa-credit-card" },
                      { id: "wallet", name: "Digital Wallet", icon: "fas fa-wallet" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedPaymentMethod === method.id
                            ? "border-gaming-gold bg-gaming-gold/10"
                            : "border-gaming-border bg-gaming-accent hover:border-gaming-border-light"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <i className={`${method.icon} text-gaming-gold`}></i>
                          <span className="text-sm font-exo text-white">{method.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleDeposit}
                  disabled={depositMutation.isPending}
                  className="btn-gaming-primary w-full font-gaming"
                >
                  {depositMutation.isPending ? (
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-plus mr-2"></i>
                  )}
                  Add Money
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="withdraw" className="space-y-4">
              {user.kycStatus !== "verified" ? (
                <div className="text-center p-6 bg-gaming-accent/50 rounded-lg">
                  <i className="fas fa-exclamation-triangle text-gaming-gold text-2xl mb-3"></i>
                  <p className="text-gray-300 font-exo">
                    Complete KYC verification to enable withdrawals
                  </p>
                  <Button className="btn-gaming-secondary mt-3 font-gaming">
                    Complete KYC
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="withdraw-amount" className="font-gaming text-gray-300">Amount (INR)</Label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="Enter amount (min ₹100)"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-gaming-accent border-gaming-border-light text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Available: {formatCurrency(user.walletBalance || "0")}
                    </p>
                  </div>

                  <div className="bg-gaming-accent/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 font-exo">
                      • Withdrawals are processed within 24-48 hours
                      • Minimum withdrawal: ₹100
                      • Bank details from KYC will be used
                    </p>
                  </div>

                  <Button
                    onClick={handleWithdraw}
                    disabled={withdrawMutation.isPending}
                    className="btn-gaming-primary w-full font-gaming"
                  >
                    {withdrawMutation.isPending ? (
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                    ) : (
                      <i className="fas fa-money-bill-wave mr-2"></i>
                    )}
                    Request Withdrawal
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="font-gaming text-gaming-gold">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-receipt text-gray-400 text-3xl mb-3"></i>
              <p className="text-gray-400 font-exo">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 10).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gaming-accent/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === "deposit" ? "bg-gaming-green/20" :
                      transaction.type === "withdrawal" ? "bg-gaming-red/20" :
                      transaction.type === "win" ? "bg-gaming-gold/20" :
                      "bg-gaming-blue/20"
                    }`}>
                      <i className={`fas ${
                        transaction.type === "deposit" ? "fa-arrow-down text-gaming-green" :
                        transaction.type === "withdrawal" ? "fa-arrow-up text-gaming-red" :
                        transaction.type === "win" ? "fa-trophy text-gaming-gold" :
                        "fa-gamepad text-gaming-blue"
                      } text-xs`}></i>
                    </div>
                    <div>
                      <p className="font-gaming text-white text-sm capitalize">
                        {transaction.type}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(transaction.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-gaming font-bold ${
                      transaction.type === "deposit" || transaction.type === "win" 
                        ? "text-gaming-green" 
                        : "text-gaming-red"
                    }`}>
                      {transaction.type === "deposit" || transaction.type === "win" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    {getStatusBadge(transaction.status)}
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