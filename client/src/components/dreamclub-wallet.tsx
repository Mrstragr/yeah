import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, ArrowUpRight, ArrowDownLeft, History, Plus, Minus, Eye, EyeOff, Wallet, Shield } from "lucide-react";

interface User {
  id: number;
  username: string;
  walletBalance: string;
  bonusBalance: string;
}

export function DreamClubWallet() {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  const balance = user ? parseFloat(user.walletBalance || "0") : 0;
  const bonusBalance = user ? parseFloat(user.bonusBalance || "0") : 0;
  const totalBalance = balance + bonusBalance;

  const tabs = [
    { id: "overview", name: "Overview" },
    { id: "deposit", name: "Deposit" },
    { id: "withdraw", name: "Withdraw" },
    { id: "history", name: "History" },
  ];

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const transactions = [
    {
      id: 1,
      type: "deposit",
      amount: "+₹1,000",
      method: "UPI",
      status: "completed",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "withdraw",
      amount: "-₹500",
      method: "Bank Transfer",
      status: "pending",
      time: "1 day ago",
    },
    {
      id: 3,
      type: "deposit",
      amount: "+₹2,000",
      method: "Credit Card",
      status: "completed",
      time: "3 days ago",
    },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Wallet className="w-6 h-6 text-white" />
              <span className="text-white text-lg font-semibold">Total Balance</span>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
            >
              {showBalance ? (
                <Eye className="w-4 h-4 text-white" />
              ) : (
                <EyeOff className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-white text-4xl font-bold">
              {showBalance ? `₹${totalBalance.toFixed(2)}` : "****"}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-white/80 text-sm">Main Wallet</p>
              <p className="text-white text-xl font-bold">
                {showBalance ? `₹${balance.toFixed(2)}` : "****"}
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-white/80 text-sm">Bonus Wallet</p>
              <p className="text-pink-300 text-xl font-bold">
                {showBalance ? `₹${bonusBalance.toFixed(2)}` : "****"}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full"></div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab("deposit")}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 flex items-center justify-center space-x-3"
        >
          <ArrowDownLeft className="w-6 h-6 text-white" />
          <span className="text-white font-semibold">Deposit</span>
        </button>
        
        <button
          onClick={() => setActiveTab("withdraw")}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 flex items-center justify-center space-x-3"
        >
          <ArrowUpRight className="w-6 h-6 text-white" />
          <span className="text-white font-semibold">Withdraw</span>
        </button>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Recent Transactions</h3>
          <button
            onClick={() => setActiveTab("history")}
            className="text-pink-400 text-sm font-medium"
          >
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {transactions.slice(0, 3).map((transaction) => (
            <div key={transaction.id} className="bg-slate-800/50 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  transaction.type === "deposit" 
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                }`}>
                  {transaction.type === "deposit" ? (
                    <ArrowDownLeft className="w-6 h-6 text-white" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6 text-white" />
                  )}
                </div>
                
                <div>
                  <p className="text-white font-medium capitalize">{transaction.type}</p>
                  <p className="text-gray-400 text-sm">{transaction.method} • {transaction.time}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-bold ${
                  transaction.type === "deposit" ? "text-green-400" : "text-blue-400"
                }`}>
                  {transaction.amount}
                </p>
                <p className={`text-xs capitalize ${
                  transaction.status === "completed" ? "text-green-400" : "text-yellow-400"
                }`}>
                  {transaction.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDeposit = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-2xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Deposit Amount</h3>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              className="bg-slate-700/50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-xl font-medium transition-all"
            >
              ₹{amount}
            </button>
          ))}
        </div>
        
        <div className="mb-6">
          <input
            type="number"
            placeholder="Enter custom amount"
            className="w-full bg-slate-700/50 text-white p-4 rounded-xl border border-slate-600 focus:border-purple-500 focus:outline-none"
          />
        </div>
        
        <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold">
          Proceed to Payment
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Payment Methods</h3>
        <div className="space-y-3">
          {["UPI", "Credit Card", "Debit Card", "Net Banking"].map((method) => (
            <button
              key={method}
              className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-white p-4 rounded-xl text-left flex items-center justify-between"
            >
              <span>{method}</span>
              <CreditCard className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWithdraw = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-green-400" />
          <span className="text-green-400 text-sm font-medium">Secure Withdrawal</span>
        </div>
        
        <h3 className="text-white text-lg font-semibold mb-4">Withdraw Amount</h3>
        
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">Available Balance: ₹{balance.toFixed(2)}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          {quickAmounts.filter(amount => amount <= balance).map((amount) => (
            <button
              key={amount}
              className="bg-slate-700/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 text-white py-3 rounded-xl font-medium transition-all"
            >
              ₹{amount}
            </button>
          ))}
        </div>
        
        <div className="mb-6">
          <input
            type="number"
            placeholder="Enter withdraw amount"
            max={balance}
            className="w-full bg-slate-700/50 text-white p-4 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold">
          Request Withdrawal
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Bank Details</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Account Number"
            className="w-full bg-slate-700/50 text-white p-4 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="IFSC Code"
            className="w-full bg-slate-700/50 text-white p-4 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Account Holder Name"
            className="w-full bg-slate-700/50 text-white p-4 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-lg font-semibold">Transaction History</h3>
        <select className="bg-slate-700/50 text-white p-2 rounded-xl border border-slate-600">
          <option>All Types</option>
          <option>Deposits</option>
          <option>Withdrawals</option>
        </select>
      </div>
      
      {transactions.map((transaction) => (
        <div key={transaction.id} className="bg-slate-800/50 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              transaction.type === "deposit" 
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : "bg-gradient-to-r from-blue-500 to-blue-600"
            }`}>
              {transaction.type === "deposit" ? (
                <ArrowDownLeft className="w-6 h-6 text-white" />
              ) : (
                <ArrowUpRight className="w-6 h-6 text-white" />
              )}
            </div>
            
            <div>
              <p className="text-white font-medium capitalize">{transaction.type}</p>
              <p className="text-gray-400 text-sm">{transaction.method}</p>
              <p className="text-gray-400 text-xs">{transaction.time}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className={`font-bold ${
              transaction.type === "deposit" ? "text-green-400" : "text-blue-400"
            }`}>
              {transaction.amount}
            </p>
            <p className={`text-xs capitalize ${
              transaction.status === "completed" ? "text-green-400" : "text-yellow-400"
            }`}>
              {transaction.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold mb-2">Wallet</h1>
        <p className="text-gray-400 text-sm">Manage your deposits and withdrawals</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800/50 rounded-2xl p-2 mb-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "deposit" && renderDeposit()}
      {activeTab === "withdraw" && renderWithdraw()}
      {activeTab === "history" && renderHistory()}
    </div>
  );
}