import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: number;
  type: string;
  amount: string;
  status: string;
  createdAt: string;
  description: string;
  paymentMethod?: string;
  razorpayPaymentId?: string;
}

interface WalletData {
  balance: string;
  transactions: Transaction[];
  kycStatus: string;
  depositLimits: {
    daily: string;
    monthly: string;
  };
}

export const EnhancedWalletSystem = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'history' | 'kyc'>('overview');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const { toast } = useToast();

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      const balanceResponse = await apiRequest('GET', '/api/wallet/balance');
      const transactionsResponse = await apiRequest('GET', '/api/wallet/transactions');
      
      const balanceData = await balanceResponse.json();
      const transactionsData = await transactionsResponse.json();
      
      setWalletData({
        balance: balanceData.balance || '0',
        transactions: transactionsData.transactions || [],
        kycStatus: balanceData.kycStatus || 'pending',
        depositLimits: {
          daily: '50000',
          monthly: '200000'
        }
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  // Handle deposit
  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is ₹100",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/wallet/deposit', {
        amount: parseFloat(depositAmount),
        paymentMethod: selectedPaymentMethod
      });

      const data = await response.json();
      if (data.razorpayOrderId) {
        // Initialize Razorpay payment
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.amount,
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
                description: `₹${depositAmount} added to your wallet`
              });
              
              setDepositAmount('');
              await fetchWalletData();
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
                description: "Deposit was cancelled",
                variant: "destructive"
              });
            }
          }
        };

        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "Unable to initiate payment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle withdrawal
  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < 500) {
      toast({
        title: "Invalid Amount",
        description: "Minimum withdrawal amount is ₹500",
        variant: "destructive"
      });
      return;
    }

    if (walletData && parseFloat(withdrawAmount) > parseFloat(walletData.balance)) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough balance for withdrawal",
        variant: "destructive"
      });
      return;
    }

    if (walletData?.kycStatus !== 'verified') {
      toast({
        title: "KYC Required",
        description: "Complete KYC verification to withdraw funds",
        variant: "destructive"
      });
      setActiveTab('kyc');
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/wallet/withdraw', {
        amount: parseFloat(withdrawAmount)
      });

      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal will be processed within 24 hours"
      });
      
      setWithdrawAmount('');
      await fetchWalletData();
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "Unable to process withdrawal",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Quick deposit amounts
  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  useEffect(() => {
    fetchWalletData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
        <h1 className="text-2xl font-bold">Wallet Management</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-lg p-4">
            <p className="text-blue-100 text-sm">Current Balance</p>
            <p className="text-2xl font-bold">₹{walletData?.balance || '0'}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <p className="text-blue-100 text-sm">KYC Status</p>
            <p className="text-lg font-semibold capitalize">
              {walletData?.kycStatus || 'Pending'}
            </p>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <p className="text-blue-100 text-sm">Daily Limit</p>
            <p className="text-lg font-semibold">₹{walletData?.depositLimits.daily || '50,000'}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="flex overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'deposit', label: 'Deposit', icon: '💰' },
            { id: 'withdraw', label: 'Withdraw', icon: '🏦' },
            { id: 'history', label: 'History', icon: '📋' },
            { id: 'kyc', label: 'KYC', icon: '🛡️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-b-xl shadow-lg">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Quick Deposit</h3>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setDepositAmount(amount.toString());
                        setActiveTab('deposit');
                      }}
                      className="bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700"
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Recent Activity</h3>
                <div className="space-y-2">
                  {walletData?.transactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between text-sm">
                      <span className={transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount}
                      </span>
                      <span className="text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Safety Features */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">🔒 Safety Features</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• All transactions are encrypted and secure</li>
                <li>• Instant deposits with UPI, cards, and net banking</li>
                <li>• 24/7 customer support for any issues</li>
                <li>• Responsible gaming limits available</li>
              </ul>
            </div>
          </div>
        )}

        {/* Deposit Tab */}
        {activeTab === 'deposit' && (
          <div className="space-y-6">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-4">Add Money to Wallet</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deposit Amount
                  </label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount (Min: ₹100)"
                    min="100"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDepositAmount(amount.toString())}
                      className="bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded text-sm"
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'upi', label: 'UPI / QR Code', icon: '📱' },
                      { id: 'cards', label: 'Credit/Debit Cards', icon: '💳' },
                      { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
                      { id: 'wallet', label: 'Digital Wallets', icon: '📲' }
                    ].map((method) => (
                      <label key={method.id} className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="mr-2"
                        />
                        <span className="mr-2">{method.icon}</span>
                        {method.label}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleDeposit}
                  disabled={isLoading || !depositAmount}
                  className={`w-full py-3 rounded-lg font-medium text-white ${
                    isLoading || !depositAmount
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                  }`}
                >
                  {isLoading ? 'Processing...' : `Deposit ₹${depositAmount || '0'}`}
                </button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                <p>💡 <strong>Instant Deposits:</strong> Money will be added to your wallet immediately after successful payment</p>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Tab */}
        {activeTab === 'withdraw' && (
          <div className="space-y-6">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-4">Withdraw Money</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Withdrawal Amount
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount (Min: ₹500)"
                    min="500"
                    max={walletData?.balance}
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  <p><strong>Available Balance:</strong> ₹{walletData?.balance || '0'}</p>
                  <p><strong>Processing Time:</strong> 2-24 hours</p>
                  <p><strong>Minimum Amount:</strong> ₹500</p>
                </div>

                <button
                  onClick={handleWithdraw}
                  disabled={isLoading || !withdrawAmount || walletData?.kycStatus !== 'verified'}
                  className={`w-full py-3 rounded-lg font-medium text-white ${
                    isLoading || !withdrawAmount || walletData?.kycStatus !== 'verified'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                  }`}
                >
                  {isLoading ? 'Processing...' : `Withdraw ₹${withdrawAmount || '0'}`}
                </button>

                {walletData?.kycStatus !== 'verified' && (
                  <div className="p-3 bg-yellow-50 rounded-lg text-sm text-yellow-700">
                    <p>⚠️ <strong>KYC Required:</strong> Complete KYC verification to enable withdrawals</p>
                    <button
                      onClick={() => setActiveTab('kyc')}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Complete KYC Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Transaction History</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Date</th>
                    <th className="border p-2 text-left">Type</th>
                    <th className="border p-2 text-right">Amount</th>
                    <th className="border p-2 text-center">Status</th>
                    <th className="border p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {walletData?.transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="border p-2 text-sm">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border p-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          transaction.type === 'deposit' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="border p-2 text-right font-medium">
                        {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount}
                      </td>
                      <td className="border p-2 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="border p-2 text-sm">{transaction.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {!walletData?.transactions.length && (
                <div className="text-center py-8 text-gray-500">
                  No transactions found
                </div>
              )}
            </div>
          </div>
        )}

        {/* KYC Tab */}
        {activeTab === 'kyc' && (
          <div className="space-y-6">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-4">KYC Verification</h3>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  walletData?.kycStatus === 'verified' 
                    ? 'bg-green-50 text-green-800' 
                    : walletData?.kycStatus === 'pending'
                    ? 'bg-yellow-50 text-yellow-800'
                    : 'bg-red-50 text-red-800'
                }`}>
                  <p className="font-medium">
                    Status: {walletData?.kycStatus === 'verified' ? '✅ Verified' : 
                            walletData?.kycStatus === 'pending' ? '⏳ Under Review' : 
                            '❌ Not Completed'}
                  </p>
                </div>

                {walletData?.kycStatus !== 'verified' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Required Documents:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Valid Government ID (Aadhaar/PAN/Passport)</li>
                        <li>• Bank account details</li>
                        <li>• Address proof</li>
                        <li>• Selfie verification</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        toast({
                          title: "KYC Portal",
                          description: "Redirecting to KYC verification portal"
                        });
                      }}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
                    >
                      Start KYC Verification
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};