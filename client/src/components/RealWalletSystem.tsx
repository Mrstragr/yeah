import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Wallet, Plus, Minus, History, TrendingUp, TrendingDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Transaction {
  id: number;
  type: string;
  amount: string;
  status: string;
  description: string;
  createdAt: string;
  paymentMethod?: string;
}

interface WalletBalance {
  balance: string;
  totalWagered: string;
  totalWon: string;
  winRate: string;
  gamesPlayed: number;
}

export default function RealWalletSystem() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("upi");
  const queryClient = useQueryClient();

  // Fetch wallet balance
  const { data: walletData, isLoading: balanceLoading } = useQuery({
    queryKey: ['/api/wallet/balance'],
    refetchInterval: 10000, // Refresh balance every 10 seconds
  });

  // Fetch transaction history
  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/wallet/transactions'],
  });

  // Deposit mutation
  const depositMutation = useMutation({
    mutationFn: async ({ amount, paymentMethod }: { amount: number; paymentMethod: string }) => {
      const response = await apiRequest("POST", "/api/wallet/deposit", {
        amount,
        paymentMethod,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Deposit Successful",
          description: `₹${depositAmount} has been added to your wallet`,
        });
        setDepositAmount("");
        queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
        queryClient.invalidateQueries({ queryKey: ['/api/wallet/transactions'] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Deposit Failed",
        description: error.message || "Failed to process deposit",
        variant: "destructive",
      });
    },
  });

  // Withdrawal mutation
  const withdrawMutation = useMutation({
    mutationFn: async ({ amount }: { amount: number }) => {
      const response = await apiRequest("POST", "/api/wallet/withdraw", { amount });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Withdrawal Initiated",
          description: `₹${withdrawAmount} withdrawal request submitted`,
        });
        setWithdrawAmount("");
        queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
        queryClient.invalidateQueries({ queryKey: ['/api/wallet/transactions'] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Failed to process withdrawal",
        variant: "destructive",
      });
    },
  });

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount < 10) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is ₹10",
        variant: "destructive",
      });
      return;
    }

    depositMutation.mutate({ amount, paymentMethod: selectedPaymentMethod });
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum withdrawal amount is ₹100",
        variant: "destructive",
      });
      return;
    }

    withdrawMutation.mutate({ amount });
  };

  const walletBalance: WalletBalance = walletData || {
    balance: "0.00",
    totalWagered: "0.00",
    totalWon: "0.00",
    winRate: "0.00",
    gamesPlayed: 0,
  };

  const transactions: Transaction[] = transactionsData?.transactions || [];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Balance Overview */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-6 h-6" />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4">
            ₹{parseFloat(walletBalance.balance).toFixed(2)}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="opacity-80">Total Wagered</div>
              <div className="font-semibold">₹{parseFloat(walletBalance.totalWagered).toFixed(2)}</div>
            </div>
            <div>
              <div className="opacity-80">Total Won</div>
              <div className="font-semibold">₹{parseFloat(walletBalance.totalWon).toFixed(2)}</div>
            </div>
            <div>
              <div className="opacity-80">Win Rate</div>
              <div className="font-semibold">{parseFloat(walletBalance.winRate).toFixed(1)}%</div>
            </div>
            <div>
              <div className="opacity-80">Games Played</div>
              <div className="font-semibold">{walletBalance.gamesPlayed}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Operations */}
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Deposit Tab */}
        <TabsContent value="deposit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-600" />
                Add Money to Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Deposit Amount (Min: ₹10)
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: "upi", name: "UPI", icon: "📱" },
                    { id: "paytm", name: "Paytm", icon: "💙" },
                    { id: "phonepe", name: "PhonePe", icon: "💜" },
                    { id: "card", name: "Card", icon: "💳" },
                  ].map((method) => (
                    <Button
                      key={method.id}
                      variant={selectedPaymentMethod === method.id ? "default" : "outline"}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className="flex items-center gap-2"
                    >
                      <span>{method.icon}</span>
                      {method.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleDeposit}
                disabled={depositMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {depositMutation.isPending ? "Processing..." : `Deposit ₹${depositAmount || "0"}`}
              </Button>

              <div className="text-xs text-gray-500 text-center">
                Instant deposit • Secure payment • 100% safe
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Withdraw Tab */}
        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Minus className="w-5 h-5 text-red-600" />
                Withdraw Money
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Withdrawal Amount (Min: ₹100)
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="text-sm text-yellow-800">
                  <strong>Note:</strong> KYC verification required for withdrawals.
                  Processing time: 24-48 hours.
                </div>
              </div>

              <Button
                onClick={handleWithdraw}
                disabled={withdrawMutation.isPending}
                className="w-full bg-red-600 hover:bg-red-700"
                size="lg"
              >
                {withdrawMutation.isPending ? "Processing..." : `Withdraw ₹${withdrawAmount || "0"}`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transaction History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="text-center py-8">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No transactions yet. Start playing to see your history!
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'deposit' ? 'bg-green-100 text-green-600' :
                          transaction.type === 'withdrawal' ? 'bg-red-100 text-red-600' :
                          transaction.type === 'game_win' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {transaction.type === 'deposit' && <TrendingUp className="w-4 h-4" />}
                          {transaction.type === 'withdrawal' && <TrendingDown className="w-4 h-4" />}
                          {transaction.type === 'game_win' && <TrendingUp className="w-4 h-4" />}
                          {transaction.type === 'game_loss' && <TrendingDown className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.description || transaction.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          transaction.type === 'deposit' || transaction.type === 'game_win' 
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'game_win' ? '+' : '-'}
                          ₹{parseFloat(transaction.amount).toFixed(2)}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          transaction.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}