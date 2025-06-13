import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Eye, 
  Ban, 
  Check, 
  X,
  Search,
  FileText,
  Settings
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  balance: string;
  isActive: boolean;
  createdAt: string;
}

interface Transaction {
  id: number;
  userId: number;
  type: string;
  amount: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Fetch transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/wallet/transactions"],
  });

  // Demo stats calculation
  const stats = {
    totalUsers: users.length,
    totalRevenue: transactions
      .filter(t => t.type === 'deposit' && t.status === 'approved')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0),
    activeUsers: users.filter(u => u.isActive).length,
    pendingTransactions: transactions.filter(t => t.status === 'pending').length,
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && user.isActive) ||
                         (statusFilter === "inactive" && !user.isActive);
    return matchesSearch && matchesStatus;
  });

  // Mock admin functions (in real app, these would be actual API calls)
  const toggleUserStatus = (userId: number) => {
    console.log(`Toggle user ${userId} status`);
    // In real implementation, this would call an admin API
  };

  const approveTransaction = (transactionId: number) => {
    console.log(`Approve transaction ${transactionId}`);
    // In real implementation, this would call an admin API
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage users, transactions, and platform operations</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending Actions</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingTransactions}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-600">
              Transactions ({stats.pendingTransactions} pending)
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <CardTitle className="text-white">User Management</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading users...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-4 text-gray-300">User</th>
                          <th className="text-left p-4 text-gray-300">Contact</th>
                          <th className="text-left p-4 text-gray-300">Balance</th>
                          <th className="text-left p-4 text-gray-300">Status</th>
                          <th className="text-left p-4 text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                            <td className="p-4">
                              <div>
                                <p className="text-white font-medium">{user.username}</p>
                                <p className="text-gray-400 text-sm">ID: {user.id}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="text-gray-300 text-sm">{user.email}</p>
                                <p className="text-gray-400 text-sm">{user.phone}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="text-green-400 font-medium">₹{parseFloat(user.balance).toLocaleString()}</p>
                            </td>
                            <td className="p-4">
                              <Badge className={user.isActive ? 'bg-green-600' : 'bg-red-600'}>
                                {user.isActive ? 'Active' : 'Banned'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedUser(user)}
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant={user.isActive ? "destructive" : "default"}
                                  onClick={() => toggleUserStatus(user.id)}
                                  className={user.isActive ? "" : "bg-green-600 hover:bg-green-700"}
                                >
                                  {user.isActive ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Transaction Management</CardTitle>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading transactions...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-4 text-gray-300">Transaction ID</th>
                          <th className="text-left p-4 text-gray-300">User ID</th>
                          <th className="text-left p-4 text-gray-300">Type</th>
                          <th className="text-left p-4 text-gray-300">Amount</th>
                          <th className="text-left p-4 text-gray-300">Status</th>
                          <th className="text-left p-4 text-gray-300">Date</th>
                          <th className="text-left p-4 text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.slice(0, 20).map((transaction) => (
                          <tr key={transaction.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                            <td className="p-4 text-gray-300">#{transaction.id}</td>
                            <td className="p-4 text-white">{transaction.userId}</td>
                            <td className="p-4">
                              <Badge className={transaction.type === 'deposit' ? 'bg-green-600' : 'bg-red-600'}>
                                {transaction.type}
                              </Badge>
                            </td>
                            <td className="p-4 text-white font-medium">₹{parseFloat(transaction.amount).toLocaleString()}</td>
                            <td className="p-4">
                              <Badge 
                                className={`${
                                  transaction.status === 'approved' ? 'bg-green-600' :
                                  transaction.status === 'pending' ? 'bg-yellow-600' :
                                  'bg-red-600'
                                }`}
                              >
                                {transaction.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-gray-300 text-sm">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              {transaction.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => approveTransaction(transaction.id)}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Revenue</span>
                      <span className="text-green-400 font-medium">₹{stats.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Avg. per User</span>
                      <span className="text-green-400 font-medium">
                        ₹{stats.totalUsers > 0 ? (stats.totalRevenue / stats.totalUsers).toFixed(0) : '0'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Transactions</span>
                      <span className="text-blue-400 font-medium">{transactions.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">User Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Users</span>
                      <span className="text-blue-400 font-medium">{stats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Users</span>
                      <span className="text-green-400 font-medium">{stats.activeUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Inactive Users</span>
                      <span className="text-red-400 font-medium">{stats.totalUsers - stats.activeUsers}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">User Details</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Username</label>
                    <p className="text-white">{selectedUser.username}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Email</label>
                    <p className="text-white">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Phone</label>
                    <p className="text-white">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Status</label>
                    <p className="text-white">{selectedUser.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Balance</label>
                    <p className="text-green-400 font-medium">₹{parseFloat(selectedUser.balance).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Joined</label>
                    <p className="text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}