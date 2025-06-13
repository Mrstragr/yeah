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
  Filter,
  Download,
  AlertCircle,
  FileText,
  Settings
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  walletBalance: string;
  bonusBalance: string;
  kycStatus: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

interface Transaction {
  id: number;
  userId: number;
  type: string;
  amount: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  username: string;
}

interface KycDocument {
  id: number;
  userId: number;
  documentType: string;
  documentUrl: string;
  status: string;
  submittedAt: string;
  username: string;
}

export function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  // Fetch users
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  // Fetch transactions
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/admin/transactions"],
  });

  // Fetch KYC documents
  const { data: kycDocuments = [] } = useQuery<KycDocument[]>({
    queryKey: ["/api/admin/kyc-documents"],
  });

  // User status mutation
  const updateUserStatus = useMutation({
    mutationFn: ({ userId, isActive }: { userId: number; isActive: boolean }) =>
      apiRequest("PATCH", `/api/admin/users/${userId}/status`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });

  // Transaction approval mutation
  const updateTransactionStatus = useMutation({
    mutationFn: ({ transactionId, status }: { transactionId: number; status: string }) =>
      apiRequest("PATCH", `/api/admin/transactions/${transactionId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
    },
  });

  // KYC approval mutation
  const updateKycStatus = useMutation({
    mutationFn: ({ documentId, status }: { documentId: number; status: string }) =>
      apiRequest("PATCH", `/api/admin/kyc/${documentId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/kyc-documents"] });
    },
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && user.isActive) ||
                         (statusFilter === "inactive" && !user.isActive) ||
                         (statusFilter === "kyc-pending" && user.kycStatus === "pending");
    return matchesSearch && matchesStatus;
  });

  const pendingTransactions = transactions.filter(t => t.status === "pending");
  const pendingKyc = kycDocuments.filter(doc => doc.status === "pending");

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
                  <p className="text-2xl font-bold text-white">{stats?.totalUsers || users.length}</p>
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
                  <p className="text-2xl font-bold text-white">₹{stats?.totalRevenue || "0"}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending Withdrawals</p>
                  <p className="text-2xl font-bold text-white">{pendingTransactions.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending KYC</p>
                  <p className="text-2xl font-bold text-white">{pendingKyc.length}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-600">
              Transactions ({pendingTransactions.length} pending)
            </TabsTrigger>
            <TabsTrigger value="kyc" className="data-[state=active]:bg-purple-600">
              KYC Documents ({pendingKyc.length} pending)
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
                        <SelectItem value="kyc-pending">KYC Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-4 text-gray-300">User</th>
                        <th className="text-left p-4 text-gray-300">Contact</th>
                        <th className="text-left p-4 text-gray-300">Balance</th>
                        <th className="text-left p-4 text-gray-300">KYC Status</th>
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
                            <div>
                              <p className="text-green-400 font-medium">₹{parseFloat(user.walletBalance).toLocaleString()}</p>
                              <p className="text-yellow-400 text-sm">Bonus: ₹{parseFloat(user.bonusBalance).toLocaleString()}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge 
                              className={`${
                                user.kycStatus === 'verified' ? 'bg-green-600' :
                                user.kycStatus === 'pending' ? 'bg-yellow-600' :
                                'bg-red-600'
                              }`}
                            >
                              {user.kycStatus}
                            </Badge>
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
                                onClick={() => updateUserStatus.mutate({ 
                                  userId: user.id, 
                                  isActive: !user.isActive 
                                })}
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
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-4 text-gray-300">Transaction ID</th>
                        <th className="text-left p-4 text-gray-300">User</th>
                        <th className="text-left p-4 text-gray-300">Type</th>
                        <th className="text-left p-4 text-gray-300">Amount</th>
                        <th className="text-left p-4 text-gray-300">Status</th>
                        <th className="text-left p-4 text-gray-300">Date</th>
                        <th className="text-left p-4 text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                          <td className="p-4 text-gray-300">#{transaction.id}</td>
                          <td className="p-4 text-white">{transaction.username}</td>
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
                                  onClick={() => updateTransactionStatus.mutate({ 
                                    transactionId: transaction.id, 
                                    status: 'approved' 
                                  })}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateTransactionStatus.mutate({ 
                                    transactionId: transaction.id, 
                                    status: 'rejected' 
                                  })}
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* KYC Tab */}
          <TabsContent value="kyc" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">KYC Document Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {kycDocuments.map((doc) => (
                    <div key={doc.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">{doc.username}</h4>
                          <p className="text-gray-400 text-sm">{doc.documentType}</p>
                          <p className="text-gray-400 text-sm">Submitted: {new Date(doc.submittedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge 
                            className={`${
                              doc.status === 'approved' ? 'bg-green-600' :
                              doc.status === 'pending' ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`}
                          >
                            {doc.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Document
                          </Button>
                          {doc.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => updateKycStatus.mutate({ 
                                  documentId: doc.id, 
                                  status: 'approved' 
                                })}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateKycStatus.mutate({ 
                                  documentId: doc.id, 
                                  status: 'rejected' 
                                })}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                      <span className="text-gray-400">Today's Revenue</span>
                      <span className="text-green-400 font-medium">₹{stats?.todayRevenue || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">This Week</span>
                      <span className="text-green-400 font-medium">₹{stats?.weekRevenue || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">This Month</span>
                      <span className="text-green-400 font-medium">₹{stats?.monthRevenue || "0"}</span>
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
                      <span className="text-gray-400">Active Users</span>
                      <span className="text-blue-400 font-medium">{users.filter(u => u.isActive).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">New Users Today</span>
                      <span className="text-blue-400 font-medium">{stats?.newUsersToday || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">KYC Verified</span>
                      <span className="text-green-400 font-medium">{users.filter(u => u.kycStatus === 'verified').length}</span>
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
                    <label className="text-gray-400 text-sm">KYC Status</label>
                    <p className="text-white">{selectedUser.kycStatus}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Wallet Balance</label>
                    <p className="text-green-400 font-medium">₹{parseFloat(selectedUser.walletBalance).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Bonus Balance</label>
                    <p className="text-yellow-400 font-medium">₹{parseFloat(selectedUser.bonusBalance).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Joined</label>
                    <p className="text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Last Login</label>
                    <p className="text-white">{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}</p>
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