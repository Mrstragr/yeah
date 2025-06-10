import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  Settings,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  todayRevenue: number;
  totalTransactions: number;
  pendingWithdrawals: number;
  suspiciousActivities: number;
  kycPending: number;
}

interface Transaction {
  id: number;
  userId: number;
  username: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  paymentMethod: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  walletBalance: number;
  status: 'active' | 'suspended' | 'kyc_pending';
  lastLogin: Date;
  registrationDate: Date;
  totalDeposits: number;
  totalWithdrawals: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    totalTransactions: 0,
    pendingWithdrawals: 0,
    suspiciousActivities: 0,
    kycPending: 0
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, transactionsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        }),
        fetch('/api/admin/transactions', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        }),
        fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchDashboardData();
        alert('User status updated successfully');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const approveTransaction = async (transactionId: number) => {
    try {
      const response = await fetch(`/api/admin/transactions/${transactionId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        fetchDashboardData();
        alert('Transaction approved successfully');
      }
    } catch (error) {
      console.error('Error approving transaction:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return <Badge className="bg-green-500 text-white">{status}</Badge>;
      case 'pending':
      case 'kyc_pending':
        return <Badge className="bg-yellow-500 text-white">{status}</Badge>;
      case 'suspended':
      case 'failed':
        return <Badge className="bg-red-500 text-white">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gaming-accent/20 h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gaming-accent/20 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gaming-gold">Admin Dashboard</h1>
        <Button onClick={fetchDashboardData} variant="outline">
          Refresh Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="game-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-casino-text-secondary">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-400">{stats.activeUsers} active</p>
              </div>
              <Users className="w-8 h-8 text-gaming-gold" />
            </div>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-casino-text-secondary">Total Revenue</p>
                <p className="text-2xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-400">₹{stats.todayRevenue} today</p>
              </div>
              <DollarSign className="w-8 h-8 text-gaming-gold" />
            </div>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-casino-text-secondary">Transactions</p>
                <p className="text-2xl font-bold text-white">{stats.totalTransactions.toLocaleString()}</p>
                <p className="text-xs text-yellow-400">{stats.pendingWithdrawals} pending</p>
              </div>
              <TrendingUp className="w-8 h-8 text-gaming-gold" />
            </div>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-casino-text-secondary">Security Alerts</p>
                <p className="text-2xl font-bold text-white">{stats.suspiciousActivities}</p>
                <p className="text-xs text-blue-400">{stats.kycPending} KYC pending</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-gaming-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-gaming-accent/20">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'transactions', label: 'Transactions', icon: DollarSign },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'security', label: 'Security', icon: Shield }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
              selectedTab === tab.id 
                ? 'border-gaming-gold text-gaming-gold' 
                : 'border-transparent text-casino-text-secondary hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'transactions' && (
        <Card className="game-card">
          <CardHeader>
            <CardTitle className="text-gaming-gold">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gaming-accent/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-white">{transaction.username}</p>
                      <p className="text-sm text-casino-text-secondary">
                        {transaction.type} • ₹{transaction.amount.toLocaleString()} • {transaction.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(transaction.status)}
                    {transaction.status === 'pending' && transaction.type === 'withdrawal' && (
                      <Button
                        size="sm"
                        onClick={() => approveTransaction(transaction.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTab === 'users' && (
        <Card className="game-card">
          <CardHeader>
            <CardTitle className="text-gaming-gold">User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gaming-accent/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-white">{user.username}</p>
                      <p className="text-sm text-casino-text-secondary">
                        {user.email} • Balance: ₹{user.walletBalance.toLocaleString()}
                      </p>
                      <p className="text-xs text-casino-text-muted">
                        Deposits: ₹{user.totalDeposits.toLocaleString()} • Withdrawals: ₹{user.totalWithdrawals.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(user.status)}
                    <Select onValueChange={(value) => updateUserStatus(user.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activate</SelectItem>
                        <SelectItem value="suspended">Suspend</SelectItem>
                        <SelectItem value="kyc_pending">KYC Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTab === 'security' && (
        <div className="space-y-6">
          <Card className="game-card">
            <CardHeader>
              <CardTitle className="text-gaming-gold">Security Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="font-semibold text-red-400">High Risk Activities</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{stats.suspiciousActivities}</div>
                  <div className="text-sm text-casino-text-secondary">Requires immediate attention</div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold text-yellow-400">KYC Pending</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{stats.kycPending}</div>
                  <div className="text-sm text-casino-text-secondary">Awaiting verification</div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-semibold text-green-400">System Status</span>
                  </div>
                  <div className="text-2xl font-bold text-white">All Clear</div>
                  <div className="text-sm text-casino-text-secondary">No critical issues</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="game-card">
            <CardHeader>
              <CardTitle className="text-gaming-gold">Compliance Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gaming-accent/5 rounded-lg">
                  <div>
                    <div className="font-medium text-white">RBI Gaming License</div>
                    <div className="text-sm text-casino-text-secondary">Valid until December 2024</div>
                  </div>
                  <Badge className="bg-green-500 text-white">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gaming-accent/5 rounded-lg">
                  <div>
                    <div className="font-medium text-white">Anti-Money Laundering</div>
                    <div className="text-sm text-casino-text-secondary">Last audit: September 2024</div>
                  </div>
                  <Badge className="bg-green-500 text-white">Compliant</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gaming-accent/5 rounded-lg">
                  <div>
                    <div className="font-medium text-white">Data Protection</div>
                    <div className="text-sm text-casino-text-secondary">GDPR & Indian IT Act compliant</div>
                  </div>
                  <Badge className="bg-green-500 text-white">Verified</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}