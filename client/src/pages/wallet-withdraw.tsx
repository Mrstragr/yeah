import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function WalletWithdraw() {
  const [amount, setAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const withdrawMutation = useMutation({
    mutationFn: async ({ amount, bankAccount }: { amount: number; bankAccount: string }) => {
      const response = await apiRequest("POST", "/api/wallet/withdraw", { amount, bankAccount });
      return response;
    },
    onSuccess: (data: any) => {
      toast({
        title: "Withdrawal Initiated",
        description: `₹${amount} withdrawal request submitted. Transaction ID: ${data.transactionId}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setAmount("");
      setBankAccount("");
    },
    onError: (error: any) => {
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Failed to process withdrawal",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    
    if (withdrawAmount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum withdrawal amount is ₹100",
        variant: "destructive",
      });
      return;
    }

    if (!user || parseFloat(user.walletBalance) < withdrawAmount) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    if (!bankAccount) {
      toast({
        title: "Bank Account Required",
        description: "Please enter your bank account details",
        variant: "destructive",
      });
      return;
    }

    withdrawMutation.mutate({ amount: withdrawAmount, bankAccount });
  };

  const availableBalance = user ? parseFloat(user.walletBalance) : 0;
  const isKycVerified = user?.kycStatus === "verified";

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/wallet">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#ffd700]">Withdraw Money</h1>
        </div>

        {!isKycVerified && (
          <Alert className="mb-6 bg-orange-900/20 border-orange-500">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-orange-200">
              KYC verification required for withdrawals. Complete your KYC to unlock withdrawals.
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-[#2a2a2a] border-[#444] text-white">
          <CardHeader>
            <CardTitle className="text-[#ffd700]">Withdraw from Wallet</CardTitle>
            <CardDescription className="text-gray-400">
              Available Balance: ₹{availableBalance.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="100"
                  max={availableBalance}
                  step="1"
                  className="bg-[#1a1a1a] border-[#444] text-white"
                  required
                  disabled={!isKycVerified}
                />
              </div>

              <div className="space-y-3">
                <Label>Quick Select</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 2000].map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      type="button"
                      variant="outline"
                      className="bg-[#1a1a1a] border-[#444] text-white hover:bg-[#ffd700] hover:text-black"
                      onClick={() => setAmount(quickAmount.toString())}
                      disabled={!isKycVerified || quickAmount > availableBalance}
                    >
                      ₹{quickAmount}
                    </Button>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-[#1a1a1a] border-[#444] text-white hover:bg-[#ffd700] hover:text-black"
                  onClick={() => setAmount(availableBalance.toFixed(2))}
                  disabled={!isKycVerified || availableBalance < 100}
                >
                  All Available (₹{availableBalance.toFixed(2)})
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccount">Bank Account Details</Label>
                <Input
                  id="bankAccount"
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="Account Number / UPI ID"
                  className="bg-[#1a1a1a] border-[#444] text-white"
                  required
                  disabled={!isKycVerified}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#ffd700] text-black hover:bg-[#e6c200] font-bold"
                disabled={withdrawMutation.isPending || !isKycVerified}
              >
                {withdrawMutation.isPending ? "Processing..." : `Withdraw ₹${amount || "0"}`}
              </Button>
            </form>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span>Secure bank transfer</span>
              </div>
              
              <div className="text-sm text-gray-400 space-y-1">
                <p>• Minimum withdrawal: ₹100</p>
                <p>• Processing time: 1-3 business days</p>
                <p>• No withdrawal charges</p>
                <p>• KYC verification required</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}