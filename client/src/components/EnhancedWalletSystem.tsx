import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Wallet, CreditCard, Smartphone, QrCode, TrendingUp, 
  DollarSign, Shield, Clock, Award, User, Settings, Crown, Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onBack: () => void;
}

export default function EnhancedWalletSystem({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'balance' | 'deposit' | 'withdraw' | 'history' | 'limits'>('balance');
  const [balance, setBalance] = useState(12580.45);
  const [todayProfit, setTodayProfit] = useState(2340.75);
  const [weeklyProfit, setWeeklyProfit] = useState(8950.25);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'bank' | 'crypto'>('upi');
  const [dailyLimit, setDailyLimit] = useState(50000);
  const [weeklyLimit, setWeeklyLimit] = useState(200000);
  const [usedDaily, setUsedDaily] = useState(12000);
  const [usedWeekly, setUsedWeekly] = useState(45000);
  const { toast } = useToast();

  const transactions = [
    { id: 1, type: 'deposit', amount: 5000, method: 'UPI', status: 'completed', time: '10:30 AM', date: '2025-07-24' },
    { id: 2, type: 'win', amount: 2340, game: 'WinGo', status: 'completed', time: '09:45 AM', date: '2025-07-24' },
    { id: 3, type: 'withdraw', amount: 10000, method: 'Bank', status: 'processing', time: '08:20 AM', date: '2025-07-24' },
    { id: 4, type: 'deposit', amount: 3000, method: 'Card', status: 'completed', time: '07:15 AM', date: '2025-07-24' },
    { id: 5, type: 'loss', amount: -500, game: 'Aviator', status: 'completed', time: '06:30 AM', date: '2025-07-24' }
  ];

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit is ₹100",
        variant: "destructive",
      });
      return;
    }

    if (amount > 100000) {
      toast({
        title: "Limit Exceeded",
        description: "Maximum single deposit is ₹1,00,000",
        variant: "destructive",
      });
      return;
    }

    setBalance(prev => prev + amount);
    setDepositAmount('');
    toast({
      title: "Deposit Successful",
      description: `₹${amount} added to your wallet`,
    });
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 500) {
      toast({
        title: "Invalid Amount",
        description: "Minimum withdrawal is ₹500",
        variant: "destructive",
      });
      return;
    }

    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough funds for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    if (amount > (dailyLimit - usedDaily)) {
      toast({
        title: "Daily Limit Exceeded",
        description: `Daily withdrawal limit: ₹${dailyLimit - usedDaily} remaining`,
        variant: "destructive",
      });
      return;
    }

    setBalance(prev => prev - amount);
    setUsedDaily(prev => prev + amount);
    setWithdrawAmount('');
    toast({
      title: "Withdrawal Initiated",
      description: `₹${amount} will be processed within 24 hours`,
    });
  };

  const PaymentMethodCard = ({ method, icon: Icon, label, bonus }: { 
    method: string; 
    icon: any; 
    label: string; 
    bonus?: string;
  }) => (
    <button
      onClick={() => setPaymentMethod(method as any)}
      className={`p-4 rounded-xl border-2 transition-all ${
        paymentMethod === method 
          ? 'border-yellow-500 bg-yellow-50 text-yellow-800' 
          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
      }`}
    >
      <Icon className="w-8 h-8 mx-auto mb-2" />
      <div className="font-bold text-sm">{label}</div>
      {bonus && (
        <div className="text-xs text-green-600 font-medium">{bonus}</div>
      )}
    </button>
  );

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 flex items-center justify-between">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">Enhanced Wallet</h1>
          <div className="text-sm opacity-90">VIP Banking System</div>
        </div>
        <div className="w-6 h-6" />
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-black/30 overflow-x-auto">
        {[
          { key: 'balance', label: 'Balance', icon: Wallet },
          { key: 'deposit', label: 'Deposit', icon: CreditCard },
          { key: 'withdraw', label: 'Withdraw', icon: TrendingUp },
          { key: 'history', label: 'History', icon: Clock },
          { key: 'limits', label: 'Limits', icon: Shield }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-3 px-2 text-center transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-yellow-500 text-black'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="w-4 h-4 mx-auto mb-1" />
            <div className="text-xs font-bold">{tab.label}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'balance' && (
            <motion.div
              key="balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Main Balance Card */}
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-black">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm opacity-75">Total Balance</div>
                    <div className="text-3xl font-bold">₹{balance.toLocaleString()}</div>
                  </div>
                  <div className="bg-black/20 p-3 rounded-full">
                    <Crown className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/10 rounded-xl p-3">
                    <div className="text-xs opacity-75">Today's Profit</div>
                    <div className="font-bold text-lg text-green-800">+₹{todayProfit.toLocaleString()}</div>
                  </div>
                  <div className="bg-black/10 rounded-xl p-3">
                    <div className="text-xs opacity-75">Weekly Profit</div>
                    <div className="font-bold text-lg text-green-800">+₹{weeklyProfit.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('deposit')}
                  className="bg-green-600 hover:bg-green-700 p-4 rounded-xl font-bold transition-colors"
                >
                  <CreditCard className="w-6 h-6 mx-auto mb-2" />
                  Add Money
                </button>
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-bold transition-colors"
                >
                  <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                  Withdraw
                </button>
              </div>

              {/* Account Status */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg">VIP Gold Member</div>
                    <div className="text-sm opacity-90">Level 4 • Next: ₹50,000</div>
                  </div>
                  <div className="bg-yellow-400 text-black p-2 rounded-full">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-3 bg-black/20 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-black/30 rounded-xl p-4">
                <h3 className="font-bold mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  {transactions.slice(0, 3).map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          transaction.type === 'deposit' ? 'bg-green-500' :
                          transaction.type === 'withdraw' ? 'bg-blue-500' :
                          transaction.type === 'win' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}>
                          {transaction.type === 'deposit' && <CreditCard className="w-4 h-4" />}
                          {transaction.type === 'withdraw' && <TrendingUp className="w-4 h-4" />}
                          {transaction.type === 'win' && <Award className="w-4 h-4" />}
                          {transaction.type === 'loss' && <DollarSign className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-medium text-sm capitalize">{transaction.type}</div>
                          <div className="text-xs text-gray-300">{transaction.time}</div>
                        </div>
                      </div>
                      <div className={`font-bold ${
                        transaction.type === 'win' || transaction.type === 'deposit' 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {transaction.type === 'loss' ? '' : '+'}₹{Math.abs(transaction.amount).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'deposit' && (
            <motion.div
              key="deposit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Add Money</h2>
                <div className="text-gray-300">Choose your preferred payment method</div>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-2 gap-4">
                <PaymentMethodCard
                  method="upi"
                  icon={Smartphone}
                  label="UPI Payment"
                  bonus="+2% Bonus"
                />
                <PaymentMethodCard
                  method="card"
                  icon={CreditCard}
                  label="Debit/Credit Card"
                />
                <PaymentMethodCard
                  method="bank"
                  icon={QrCode}
                  label="Net Banking"
                  bonus="Instant"
                />
                <PaymentMethodCard
                  method="crypto"
                  icon={Shield}
                  label="Cryptocurrency"
                  bonus="+5% Bonus"
                />
              </div>

              {/* Amount Input */}
              <div className="bg-black/30 rounded-xl p-4">
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">Amount to Deposit</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="bg-white text-black border-0 h-12 text-lg font-bold"
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[1000, 5000, 10000, 25000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setDepositAmount(amount.toString())}
                      className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-bold text-sm transition-colors"
                    >
                      ₹{amount.toLocaleString()}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleDeposit}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 font-bold py-4"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Deposit Now
                </Button>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-4">
                <h3 className="font-bold mb-3 flex items-center">
                  <Gift className="w-5 h-5 mr-2" />
                  Deposit Benefits
                </h3>
                <div className="space-y-2 text-sm">
                  <div>• Instant deposits with UPI and Cards</div>
                  <div>• Up to 5% bonus on crypto deposits</div>
                  <div>• VIP points for every deposit</div>
                  <div>• 24/7 customer support</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'withdraw' && (
            <motion.div
              key="withdraw"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Withdraw Money</h2>
                <div className="text-gray-300">Fast and secure withdrawals</div>
              </div>

              {/* Available Balance */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-center">
                <div className="text-sm opacity-75">Available Balance</div>
                <div className="text-3xl font-bold">₹{balance.toLocaleString()}</div>
              </div>

              {/* Withdrawal Form */}
              <div className="bg-black/30 rounded-xl p-4">
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">Withdrawal Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="bg-white text-black border-0 h-12 text-lg font-bold"
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[500, 2000, 5000, 10000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setWithdrawAmount(amount.toString())}
                      className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-bold text-sm transition-colors"
                    >
                      ₹{amount.toLocaleString()}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleWithdraw}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 font-bold py-4"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Withdraw Now
                </Button>
              </div>

              {/* Withdrawal Info */}
              <div className="bg-yellow-600 text-black rounded-xl p-4">
                <h3 className="font-bold mb-2">Withdrawal Info</h3>
                <div className="space-y-1 text-sm">
                  <div>• Processing time: 24-48 hours</div>
                  <div>• Minimum withdrawal: ₹500</div>
                  <div>• VIP members: Instant withdrawals</div>
                  <div>• Zero processing fees</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'limits' && (
            <motion.div
              key="limits"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Spending Limits</h2>
                <div className="text-gray-300">Manage your responsible gaming limits</div>
              </div>

              {/* Daily Limit */}
              <div className="bg-black/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">Daily Withdrawal Limit</h3>
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Used: ₹{usedDaily.toLocaleString()}</span>
                    <span>Limit: ₹{dailyLimit.toLocaleString()}</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                      style={{ width: `${(usedDaily / dailyLimit) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  Remaining: ₹{(dailyLimit - usedDaily).toLocaleString()}
                </div>
              </div>

              {/* Weekly Limit */}
              <div className="bg-black/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">Weekly Spending Limit</h3>
                  <Settings className="w-5 h-5 text-blue-400" />
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Used: ₹{usedWeekly.toLocaleString()}</span>
                    <span>Limit: ₹{weeklyLimit.toLocaleString()}</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                      style={{ width: `${(usedWeekly / weeklyLimit) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  Remaining: ₹{(weeklyLimit - usedWeekly).toLocaleString()}
                </div>
              </div>

              {/* Responsible Gaming Tools */}
              <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-4">
                <h3 className="font-bold mb-3">Responsible Gaming</h3>
                <div className="space-y-3">
                  <button className="w-full bg-black/20 hover:bg-black/30 p-3 rounded-lg font-bold transition-colors">
                    Set Time Limits
                  </button>
                  <button className="w-full bg-black/20 hover:bg-black/30 p-3 rounded-lg font-bold transition-colors">
                    Self Exclusion
                  </button>
                  <button className="w-full bg-black/20 hover:bg-black/30 p-3 rounded-lg font-bold transition-colors">
                    Reality Check
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}