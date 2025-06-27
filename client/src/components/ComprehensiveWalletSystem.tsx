import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Smartphone,
  Building2,
  Globe
} from 'lucide-react';

interface WalletData {
  mainBalance: string;
  bonusBalance: string;
  totalBalance: string;
  todayEarnings: string;
  weeklyEarnings: string;
  monthlyEarnings: string;
  transactions: Transaction[];
  kycStatus: 'pending' | 'verified' | 'rejected';
  depositLimits: {
    daily: string;
    monthly: string;
    remaining: string;
  };
}

interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'game_win' | 'game_loss' | 'bonus' | 'referral';
  amount: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  createdAt: string;
  paymentMethod?: string;
  razorpayPaymentId?: string;
  gameType?: string;
  balanceAfter?: string;
}

export const ComprehensiveWalletSystem = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    mainBalance: '0',
    bonusBalance: '0',
    totalBalance: '0',
    todayEarnings: '0',
    weeklyEarnings: '0',
    monthlyEarnings: '0',
    transactions: [],
    kycStatus: 'pending',
    depositLimits: {
      daily: '50000',
      monthly: '200000',
      remaining: '50000'
    }
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const { toast } = useToast();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Fetch wallet data
  useEffect(() => {
    fetchWalletData();
    const interval = setInterval(fetchWalletData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchWalletData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        apiRequest('GET', '/api/wallet/balance'),
        apiRequest('GET', '/api/wallet/transactions')
      ]);

      const balanceData = await balanceRes.json();
      const transactionsData = await transactionsRes.json();

      // Calculate earnings
      const today = new Date().toDateString();
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const todayEarnings = transactionsData.transactions
        .filter((t: Transaction) => 
          new Date(t.createdAt).toDateString() === today && 
          ['game_win', 'bonus', 'referral'].includes(t.type)
        )
        .reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount), 0);

      const weeklyEarnings = transactionsData.transactions
        .filter((t: Transaction) => 
          new Date(t.createdAt) >= weekAgo && 
          ['game_win', 'bonus', 'referral'].includes(t.type)
        )
        .reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount), 0);

      const monthlyEarnings = transactionsData.transactions
        .filter((t: Transaction) => 
          new Date(t.createdAt) >= monthAgo && 
          ['game_win', 'bonus', 'referral'].includes(t.type)
        )
        .reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount), 0);

      setWalletData({
        mainBalance: balanceData.walletBalance || '0',
        bonusBalance: balanceData.bonusBalance || '0',
        totalBalance: (parseFloat(balanceData.walletBalance || '0') + parseFloat(balanceData.bonusBalance || '0')).toString(),
        todayEarnings: todayEarnings.toString(),
        weeklyEarnings: weeklyEarnings.toString(),
        monthlyEarnings: monthlyEarnings.toString(),
        transactions: transactionsData.transactions || [],
        kycStatus: balanceData.kycStatus || 'pending',
        depositLimits: {
          daily: '50000',
          monthly: '200000',
          remaining: (50000 - parseFloat(balanceData.todayDeposits || '0')).toString()
        }
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet data",
        variant: "destructive"
      });
    }
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount < 10) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is ₹10",
        variant: "destructive"
      });
      return;
    }

    if (amount > parseFloat(walletData.depositLimits.remaining)) {
      toast({
        title: "Limit Exceeded",
        description: `Daily deposit limit: ₹${walletData.depositLimits.daily}`,
        variant: "destructive"
      });
      return;
    }

    if (!razorpayLoaded) {
      toast({
        title: "Payment Gateway Loading",
        description: "Please wait for payment gateway to load",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/wallet/deposit', {
        amount,
        paymentMethod: selectedPaymentMethod
      });

      const data = await response.json();
      if (data.success && data.razorpayOrderId) {
        // Initialize Razorpay payment
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
          amount: amount * 100, // Amount in paise
          currency: 'INR',
          name: 'Perfect91Club',
          description: 'Wallet Deposit',
          order_id: data.razorpayOrderId,
          prefill: {
            name: data.userInfo?.name || '',
            email: data.userInfo?.email || '',
            contact: data.userInfo?.phone || ''
          },
          theme: {
            color: '#2563eb'
          },
          handler: async (paymentResponse: any) => {
            try {
              await apiRequest('POST', '/api/wallet/verify-payment', {
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature
              });

              toast({
                title: "Deposit Successful",
                description: `₹${amount} has been added to your wallet`
              });

              setDepositAmount('');
              fetchWalletData();
            } catch (error) {
              toast({
                title: "Payment Verification Failed",
                description: "Please contact support",
                variant: "destructive"
              });
            }
          },
          modal: {
            ondismiss: () => {
              toast({
                title: "Payment Cancelled",
                description: "Your deposit was cancelled",
                variant: "destructive"
              });
            }
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "Unable to process deposit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum withdrawal amount is ₹100",
        variant: "destructive"
      });
      return;
    }

    if (amount > parseFloat(walletData.mainBalance)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance to withdraw",
        variant: "destructive"
      });
      return;
    }

    if (walletData.kycStatus !== 'verified') {
      toast({
        title: "KYC Required",
        description: "Please complete KYC verification to withdraw",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/wallet/withdraw', {
        amount,
        paymentMethod: selectedPaymentMethod
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Withdrawal Initiated",
          description: `₹${amount} withdrawal request submitted. Processing time: 1-2 hours.`
        });
        setWithdrawAmount('');
        fetchWalletData();
      }
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "Unable to process withdrawal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'game_win': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'game_loss': return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'bonus': return <DollarSign className="w-4 h-4 text-blue-500" />;
      case 'referral': return <Globe className="w-4 h-4 text-purple-500" />;
      default: return <History className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
          <p className="text-gray-300">Manage your gaming funds securely</p>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Main Balance</p>
                  <p className="text-2xl font-bold text-white">₹{parseFloat(walletData.mainBalance).toLocaleString()}</p>
                </div>
                <Wallet className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600 to-purple-700 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Bonus Balance</p>
                  <p className="text-2xl font-bold text-white">₹{parseFloat(walletData.bonusBalance).toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-green-700 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Today's Earnings</p>
                  <p className="text-2xl font-bold text-white">₹{parseFloat(walletData.todayEarnings).toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-600 to-amber-700 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Monthly Earnings</p>
                  <p className="text-2xl font-bold text-white">₹{parseFloat(walletData.monthlyEarnings).toLocaleString()}</p>
                </div>
                <Building2 className="h-8 w-8 text-amber-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Wallet Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 backdrop-blur">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">Overview</TabsTrigger>
            <TabsTrigger value="deposit" className="data-[state=active]:bg-blue-600">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw" className="data-[state=active]:bg-blue-600">Withdraw</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-blue-600">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">KYC Status</span>
                    {getStatusBadge(walletData.kycStatus)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Daily Deposit Limit</span>
                    <span className="text-white">₹{parseFloat(walletData.depositLimits.daily).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Remaining Today</span>
                    <span className="text-green-400">₹{parseFloat(walletData.depositLimits.remaining).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {walletData.transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <p className="text-white text-sm font-medium">{transaction.description}</p>
                            <p className="text-gray-400 text-xs">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            ['deposit', 'game_win', 'bonus', 'referral'].includes(transaction.type) 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            {['deposit', 'game_win', 'bonus', 'referral'].includes(transaction.type) ? '+' : '-'}₹{parseFloat(transaction.amount).toLocaleString()}
                          </p>
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="deposit">
            <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ArrowDownLeft className="w-5 h-5 mr-2" />
                  Add Money to Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 text-sm font-medium mb-2 block">Amount (₹)</label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        min="10"
                        max={walletData.depositLimits.remaining}
                      />
                      <p className="text-gray-400 text-xs mt-1">Minimum: ₹10 | Maximum: ₹{parseFloat(walletData.depositLimits.remaining).toLocaleString()}</p>
                    </div>

                    <div>
                      <label className="text-gray-300 text-sm font-medium mb-2 block">Payment Method</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={selectedPaymentMethod === 'upi' ? 'default' : 'outline'}
                          onClick={() => setSelectedPaymentMethod('upi')}
                          className="flex items-center justify-center space-x-2"
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>UPI</span>
                        </Button>
                        <Button
                          variant={selectedPaymentMethod === 'card' ? 'default' : 'outline'}
                          onClick={() => setSelectedPaymentMethod('card')}
                          className="flex items-center justify-center space-x-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Card</span>
                        </Button>
                      </div>
                    </div>

                    <Button 
                      onClick={handleDeposit} 
                      disabled={isLoading || !depositAmount}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoading ? 'Processing...' : 'Add Money'}
                    </Button>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3">Quick Deposit</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['100', '500', '1000', '5000'].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          onClick={() => setDepositAmount(amount)}
                          className="border-slate-600 text-gray-300 hover:bg-slate-600"
                        >
                          ₹{amount}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw">
            <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ArrowUpRight className="w-5 h-5 mr-2" />
                  Withdraw Money
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {walletData.kycStatus !== 'verified' && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      <p className="text-amber-300">KYC verification required for withdrawals</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 text-sm font-medium mb-2 block">Amount (₹)</label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        min="100"
                        max={walletData.mainBalance}
                        disabled={walletData.kycStatus !== 'verified'}
                      />
                      <p className="text-gray-400 text-xs mt-1">Minimum: ₹100 | Available: ₹{parseFloat(walletData.mainBalance).toLocaleString()}</p>
                    </div>

                    <Button 
                      onClick={handleWithdrawal} 
                      disabled={isLoading || !withdrawAmount || walletData.kycStatus !== 'verified'}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      {isLoading ? 'Processing...' : 'Withdraw Money'}
                    </Button>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3">Withdrawal Info</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>• Processing time: 1-2 hours</p>
                      <p>• Minimum amount: ₹100</p>
                      <p>• KYC verification required</p>
                      <p>• No processing fees</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <History className="w-5 h-5 mr-2" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {walletData.transactions.length > 0 ? (
                    walletData.transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center space-x-4">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <p className="text-white font-medium">{transaction.description}</p>
                            <p className="text-gray-400 text-sm">{new Date(transaction.createdAt).toLocaleString()}</p>
                            {transaction.razorpayPaymentId && (
                              <p className="text-gray-500 text-xs">ID: {transaction.razorpayPaymentId}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            ['deposit', 'game_win', 'bonus', 'referral'].includes(transaction.type) 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            {['deposit', 'game_win', 'bonus', 'referral'].includes(transaction.type) ? '+' : '-'}₹{parseFloat(transaction.amount).toLocaleString()}
                          </p>
                          {getStatusBadge(transaction.status)}
                          {transaction.balanceAfter && (
                            <p className="text-gray-400 text-xs">Balance: ₹{parseFloat(transaction.balanceAfter).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <History className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No transactions yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};