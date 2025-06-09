import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, Smartphone, Building } from "lucide-react";
import { Link } from "wouter";

export default function WalletDeposit() {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const depositMutation = useMutation({
    mutationFn: async ({ amount, paymentMethod }: { amount: number; paymentMethod: string }) => {
      const response = await apiRequest("POST", "/api/wallet/deposit", { amount, paymentMethod });
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "Deposit Initiated",
        description: `₹${amount} deposit is being processed. Transaction ID: ${data.transactionId}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setAmount("");
    },
    onError: (error: any) => {
      toast({
        title: "Deposit Failed",
        description: error.message || "Failed to process deposit",
        variant: "destructive",
      });
    },
  });

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);
    if (depositAmount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is ₹100",
        variant: "destructive",
      });
      return;
    }
    depositMutation.mutate({ amount: depositAmount, paymentMethod });
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/wallet">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[#ffd700]">Deposit Money</h1>
        </div>

        <Card className="bg-[#2a2a2a] border-[#444] text-white">
          <CardHeader>
            <CardTitle className="text-[#ffd700]">Add Money to Wallet</CardTitle>
            <CardDescription className="text-gray-400">
              Secure and instant deposits with multiple payment options
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
                  step="1"
                  className="bg-[#1a1a1a] border-[#444] text-white"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Quick Select</Label>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      type="button"
                      variant="outline"
                      className="bg-[#1a1a1a] border-[#444] text-white hover:bg-[#ffd700] hover:text-black"
                      onClick={() => setAmount(quickAmount.toString())}
                    >
                      ₹{quickAmount}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border border-[#444] rounded-lg">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                      <Smartphone className="h-4 w-4" />
                      UPI (PhonePe, GPay, Paytm)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-[#444] rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      Debit/Credit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-[#444] rounded-lg">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer">
                      <Building className="h-4 w-4" />
                      Net Banking
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#ffd700] text-black hover:bg-[#e6c200] font-bold"
                disabled={depositMutation.isPending}
              >
                {depositMutation.isPending ? "Processing..." : `Deposit ₹${amount || "0"}`}
              </Button>
            </form>

            <div className="text-sm text-gray-400 space-y-1">
              <p>• Minimum deposit: ₹100</p>
              <p>• Maximum deposit: ₹50,000 per transaction</p>
              <p>• Processing time: 2-5 minutes</p>
              <p>• No additional charges</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}