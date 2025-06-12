import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  History, 
  Wallet,
  TrendingUp,
  Shield,
  Clock
} from "lucide-react";

interface WalletManagementProps {
  user: any;
}

export function WalletManagement({ user }: WalletManagementProps) {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'history'>('overview');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/wallet/transactions"],
  });

  const { data: walletStats } = useQuery({
    queryKey: ["/api/wallet/stats"],
  });

  const depositMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest("POST", "/api/wallet/deposit", { amount });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Deposit Successful", description: "Funds added to your wallet" });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/transactions"] });
      setDepositAmount("");
    },
    onError: () => {
      toast({ title: "Deposit Failed", description: "Please try again", variant: "destructive" });
    }
  });

  const withdrawMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest("POST", "/api/wallet/withdraw", { amount });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Withdrawal Requested", description: "Your request is being processed" });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/transactions"] });
      setWithdrawAmount("");
    },
    onError: () => {
      toast({ title: "Withdrawal Failed", description: "Please check your balance", variant: "destructive" });
    }
  });

  const quickAmounts = [1000, 5000, 10000, 25000, 50000];

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount >= 100 && amount <= 100000) {
      depositMutation.mutate(amount);
    } else {
      toast({ 
        title: "Invalid Amount", 
        description: "Amount must be between ₹100 and ₹100,000", 
        variant: "destructive" 
      });
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    const availableBalance = parseFloat(user?.walletBalance || '0');
    
    if (amount >= 500 && amount <= availableBalance) {
      withdrawMutation.mutate(amount);
    } else {
      toast({ 
        title: "Invalid Amount", 
        description: "Minimum withdrawal ₹500, maximum is your balance", 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">💰 Wallet Management</h1>
          <p className="text-gray-300">Secure deposits, instant withdrawals, complete control</p>
        </motion.div>

        {/* Balance Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-300">Main Balance</p>
                  <p className="text-3xl font-bold text-white">
                    ₹{parseFloat(user?.walletBalance || '0').toLocaleString()}
                  </p>
                </div>
                <Wallet className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300">Bonus Balance</p>
                  <p className="text-3xl font-bold text-white">
                    ₹{parseFloat(user?.bonusBalance || '0').toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-300">Total Value</p>
                  <p className="text-3xl font-bold text-white">
                    ₹{(parseFloat(user?.walletBalance || '0') + parseFloat(user?.bonusBalance || '0')).toLocaleString()}
                  </p>
                </div>
                <Shield className="w-12 h-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          className="flex flex-wrap gap-2 mb-6 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { id: 'overview', label: 'Overview', icon: Wallet },
            { id: 'deposit', label: 'Deposit', icon: ArrowUpCircle },
            { id: 'withdraw', label: 'Withdraw', icon: ArrowDownCircle },
            { id: 'history', label: 'History', icon: History }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={`px-6 py-3 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Deposit Tab */}
          {activeTab === 'deposit' && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ArrowUpCircle className="w-6 h-6 mr-2 text-green-400" />
                  Deposit Funds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Deposit Amount (₹100 - ₹100,000)
                  </label>
                  <Input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <p className="text-gray-300 text-sm mb-3">Quick amounts:</p>
                  <div className="grid grid-cols-5 gap-2">
                    {quickAmounts.map((amount) => (
                      <Button
                        key={amount}
                        onClick={() => setDepositAmount(amount.toString())}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        ₹{amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="text-blue-300 font-medium mb-2">Payment Methods</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['UPI', 'Card', 'Net Banking', 'Wallet'].map((method) => (
                        <div key={method} className="flex items-center space-x-2 p-3 bg-gray-700/50 rounded-lg">
                          <CreditCard className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-gray-300">{method}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleDeposit}
                    disabled={!depositAmount || depositMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                  >
                    {depositMutation.isPending ? "Processing..." : "Deposit Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Withdraw Tab */}
          {activeTab === 'withdraw' && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ArrowDownCircle className="w-6 h-6 mr-2 text-red-400" />
                  Withdraw Funds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Withdrawal Amount (Min: ₹500)
                  </label>
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <h4 className="text-yellow-300 font-medium">Processing Time</h4>
                  </div>
                  <p className="text-sm text-gray-300">
                    Withdrawals are processed within 24 hours. You'll receive a confirmation email once completed.
                  </p>
                </div>

                <Button
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || withdrawMutation.isPending}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                >
                  {withdrawMutation.isPending ? "Processing..." : "Request Withdrawal"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Transaction History */}
          {activeTab === 'history' && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <History className="w-6 h-6 mr-2 text-blue-400" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.length > 0 ? (
                    transactions.map((transaction: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'deposit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {transaction.type === 'deposit' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="text-white font-medium capitalize">{transaction.type}</p>
                            <p className="text-sm text-gray-400">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                            {transaction.type === 'deposit' ? '+' : '-'}₹{parseFloat(transaction.amount).toLocaleString()}
                          </p>
                          <p className={`text-sm px-2 py-1 rounded ${
                            transaction.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                            transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No transactions yet</p>
                      <p className="text-sm text-gray-500">Your transaction history will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}