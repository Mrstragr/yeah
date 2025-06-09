import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from "lucide-react";

interface WalletTransaction {
  id: number;
  type: string;
  amount: string;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
  paymentMethod?: string;
}

export function WalletDashboard() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/wallet/transactions"],
    retry: false,
  });

  const depositMutation = useMutation({
    mutationFn: async (data: { amount: string; paymentMethod: string }) => {
      return apiRequest("POST", "/api/wallet/deposit", data);
    },
    onSuccess: () => {
      toast({
        title: "Deposit Initiated",
        description: "Your deposit is being processed. Funds will be available shortly.",
      });
      setDepositAmount("");
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

  const withdrawMutation = useMutation({
    mutationFn: async (data: { amount: string }) => {
      return apiRequest("POST", "/api/wallet/withdraw", data);
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request is being processed. Funds will be transferred to your bank account.",
      });
      setWithdrawAmount("");
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || !paymentMethod) return;
    
    const amount = parseFloat(depositAmount);
    if (amount < 10) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is ₹10",
        variant: "destructive",
      });
      return;
    }

    depositMutation.mutate({ amount: depositAmount, paymentMethod });
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount) return;
    
    const amount = parseFloat(withdrawAmount);
    if (amount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum withdrawal amount is ₹100",
        variant: "destructive",
      });
      return;
    }

    if (user && parseFloat(user.walletBalance) < amount) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    withdrawMutation.mutate({ amount: withdrawAmount });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <Card className="game-card bg-gradient-to-r from-gaming-accent to-gaming-accent/80">
        <CardHeader>
          <CardTitle className="flex items-center font-gaming text-gaming-gold">
            <Wallet className="w-6 h-6 mr-2" />
            My Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-400 font-exo">Main Balance</p>
              <p className="text-3xl font-gaming font-bold text-gaming-gold">
                ₹{user?.walletBalance || "0.00"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 font-exo">Bonus Balance</p>
              <p className="text-2xl font-gaming font-semibold text-green-400">
                ₹{user?.bonusBalance || "0.00"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 font-exo">KYC Status</p>
              <Badge variant={user?.kycStatus === "verified" ? "default" : "secondary"} className="mt-1">
                {user?.kycStatus || "pending"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Actions */}
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposit" className="font-gaming">
            <ArrowDownLeft className="w-4 h-4 mr-2" />
            Deposit
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="font-gaming">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Withdraw
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit">
          <Card className="game-card">
            <CardHeader>
              <CardTitle className="font-gaming text-gaming-gold">Add Money to Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                  <Label htmlFor="deposit-amount" className="font-gaming text-gray-300">
                    Amount (₹)
                  </Label>
                  <Input
                    id="deposit-amount"
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
                  <Label className="font-gaming text-gray-300">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="bg-gaming-accent border-gaming-border-light text-white">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="paytm">Paytm Wallet</SelectItem>
                      <SelectItem value="phonepe">PhonePe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {["100", "500", "1000", "2000", "5000"].map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDepositAmount(amount)}
                      className="border-gaming-border-light text-gaming-gold hover:bg-gaming-accent"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={depositMutation.isPending || !depositAmount || !paymentMethod}
                  className="btn-gaming-primary w-full font-gaming"
                >
                  {depositMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Add Money
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw">
          <Card className="game-card">
            <CardHeader>
              <CardTitle className="font-gaming text-gaming-gold">Withdraw Money</CardTitle>
            </CardHeader>
            <CardContent>
              {user?.kycStatus !== "verified" ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                  <p className="text-yellow-400 font-exo">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    KYC verification required for withdrawals. Complete your verification in the profile section.
                  </p>
                </div>
              ) : null}

              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <Label htmlFor="withdraw-amount" className="font-gaming text-gray-300">
                    Amount (₹)
                  </Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="Enter amount (min ₹100)"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="bg-gaming-accent border-gaming-border-light text-white"
                    min="100"
                    max={user?.walletBalance || "0"}
                    required
                  />
                  <p className="text-sm text-gray-400 mt-1 font-exo">
                    Available: ₹{user?.walletBalance || "0.00"}
                  </p>
                </div>

                <div className="bg-gaming-accent/30 p-3 rounded-lg">
                  <p className="text-sm text-gray-400 font-exo">
                    <i className="fas fa-info-circle mr-2"></i>
                    Withdrawals are processed within 24-48 hours to your verified bank account.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={
                    withdrawMutation.isPending || 
                    !withdrawAmount || 
                    user?.kycStatus !== "verified"
                  }
                  className="btn-gaming-primary w-full font-gaming"
                >
                  {withdrawMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Withdraw Money
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction History */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="font-gaming text-gaming-gold">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="text-center py-8">
              <i className="fas fa-spinner fa-spin text-gaming-gold text-2xl"></i>
              <p className="text-gray-400 mt-2 font-exo">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 font-exo">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction: WalletTransaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gaming-accent/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(transaction.status)}
                    <div>
                      <p className="font-exo font-medium text-white capitalize">
                        {transaction.type} - {transaction.description}
                      </p>
                      <p className="text-sm text-gray-400 font-exo">
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
                    <p className={`font-gaming font-semibold ${
                      transaction.type === "deposit" || transaction.type === "win" 
                        ? "text-green-400" 
                        : "text-red-400"
                    }`}>
                      {transaction.type === "deposit" || transaction.type === "win" ? "+" : "-"}
                      ₹{transaction.amount}
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