import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, Settings, Shield, Gift, Crown, Phone, Mail, Calendar, Edit3 } from "lucide-react";

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: ""
  });
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const { data: userHistory = [] } = useQuery({
    queryKey: ["/api/user/history"],
    retry: false,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PUT", "/api/user/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleEditToggle = () => {
    if (user && !isEditing) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        email: user.email || ""
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const getVipLevel = (totalSpent: number) => {
    if (totalSpent >= 100000) return { level: "Diamond", color: "text-purple-400", benefits: "15% cashback, dedicated manager" };
    if (totalSpent >= 50000) return { level: "Platinum", color: "text-gray-300", benefits: "10% cashback, priority support" };
    if (totalSpent >= 20000) return { level: "Gold", color: "text-yellow-400", benefits: "7% cashback, weekly bonuses" };
    if (totalSpent >= 10000) return { level: "Silver", color: "text-gray-400", benefits: "5% cashback, special tournaments" };
    return { level: "Bronze", color: "text-amber-600", benefits: "3% cashback, monthly bonuses" };
  };

  const vipInfo = getVipLevel(parseFloat(user?.walletBalance || "0") * 10);

  return (
    <div className="min-h-screen bg-gaming-dark text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-gaming font-bold text-gaming-gold mb-2">
            Account Management
          </h1>
          <p className="text-casino-text-secondary font-exo">
            Manage your profile, security settings, and gaming preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="profile" className="font-gaming">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="font-gaming">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="vip" className="font-gaming">
              <Crown className="w-4 h-4 mr-2" />
              VIP Status
            </TabsTrigger>
            <TabsTrigger value="history" className="font-gaming">
              <Calendar className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="game-card">
                <CardHeader>
                  <CardTitle className="font-gaming text-gaming-gold flex items-center justify-between">
                    Personal Information
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditToggle}
                      className="text-gaming-gold border-gaming-gold hover:bg-gaming-gold hover:text-black"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-casino-text-secondary">First Name</Label>
                          <Input
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            placeholder="Enter first name"
                          />
                        </div>
                        <div>
                          <Label className="text-casino-text-secondary">Last Name</Label>
                          <Input
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-casino-text-secondary">Phone Number</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <Label className="text-casino-text-secondary">Email Address</Label>
                        <Input
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="Enter email address"
                        />
                      </div>
                      <Button
                        onClick={handleSave}
                        disabled={updateProfileMutation.isPending}
                        className="w-full bg-gaming-gold text-black hover:bg-yellow-500"
                      >
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-gaming-accent/20 rounded-lg">
                        <User className="w-5 h-5 text-gaming-gold" />
                        <div>
                          <p className="font-medium text-white">
                            {user?.firstName || user?.lastName 
                              ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
                              : "Name not set"
                            }
                          </p>
                          <p className="text-sm text-casino-text-muted">@{user?.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gaming-accent/20 rounded-lg">
                        <Phone className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="font-medium text-white">{user?.phone || "Not provided"}</p>
                          <p className="text-sm text-casino-text-muted">Phone Number</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gaming-accent/20 rounded-lg">
                        <Mail className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="font-medium text-white">{user?.email || "Not provided"}</p>
                          <p className="text-sm text-casino-text-muted">Email Address</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="game-card">
                <CardHeader>
                  <CardTitle className="font-gaming text-gaming-gold">Account Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
                      <p className="text-2xl font-bold text-white">₹{user?.walletBalance || "0.00"}</p>
                      <p className="text-sm text-green-100">Current Balance</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                      <p className="text-2xl font-bold text-white">₹{user?.bonusBalance || "0.00"}</p>
                      <p className="text-sm text-purple-100">Bonus Balance</p>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                    <p className="text-2xl font-bold text-white">{userHistory.length}</p>
                    <p className="text-sm text-blue-100">Games Played</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gaming-accent/20 rounded-lg">
                    <span className="text-casino-text-secondary">Account Status</span>
                    <Badge variant={user?.isActive ? "default" : "secondary"}>
                      {user?.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="game-card">
                <CardHeader>
                  <CardTitle className="font-gaming text-gaming-gold">Password & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Change Password
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Enable 2FA
                  </Button>
                  <div className="p-3 bg-gaming-accent/20 rounded-lg">
                    <p className="text-sm text-casino-text-secondary">
                      Last login: {new Date(user?.lastLoginAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="game-card">
                <CardHeader>
                  <CardTitle className="font-gaming text-gaming-gold">Responsible Gaming</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    Set Deposit Limits
                  </Button>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Self-Exclusion Options
                  </Button>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Reality Check Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vip">
            <Card className="game-card">
              <CardHeader>
                <CardTitle className="font-gaming text-gaming-gold flex items-center">
                  <Crown className="w-6 h-6 mr-2" />
                  VIP Program Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-lg">
                      <Crown className="w-12 h-12 mx-auto mb-4 text-white" />
                      <h3 className={`text-2xl font-bold ${vipInfo.color}`}>{vipInfo.level}</h3>
                      <p className="text-yellow-100">Current VIP Level</p>
                    </div>
                    <div className="p-4 bg-gaming-accent/20 rounded-lg">
                      <h4 className="font-gaming text-gaming-gold mb-2">Current Benefits</h4>
                      <p className="text-casino-text-secondary">{vipInfo.benefits}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gaming-accent/20 rounded-lg">
                      <h4 className="font-gaming text-gaming-gold mb-3">VIP Rewards</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-casino-text-secondary">Cashback Rate</span>
                          <span className="text-white">{vipInfo.level === 'Diamond' ? '15%' : vipInfo.level === 'Platinum' ? '10%' : vipInfo.level === 'Gold' ? '7%' : vipInfo.level === 'Silver' ? '5%' : '3%'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-casino-text-secondary">Monthly Bonus</span>
                          <span className="text-white">₹{vipInfo.level === 'Diamond' ? '2500' : vipInfo.level === 'Platinum' ? '1500' : vipInfo.level === 'Gold' ? '1000' : vipInfo.level === 'Silver' ? '500' : '200'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-casino-text-secondary">Withdrawal Limit</span>
                          <span className="text-white">₹{vipInfo.level === 'Diamond' ? '1,00,000' : vipInfo.level === 'Platinum' ? '75,000' : vipInfo.level === 'Gold' ? '50,000' : vipInfo.level === 'Silver' ? '25,000' : '10,000'}</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full bg-gaming-gold text-black hover:bg-yellow-500">
                      View VIP Progress
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="game-card">
              <CardHeader>
                <CardTitle className="font-gaming text-gaming-gold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {userHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-casino-text-muted mx-auto mb-2" />
                    <p className="text-casino-text-muted font-exo">No activity history yet</p>
                    <p className="text-sm text-casino-text-muted">Start playing games to see your activity here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userHistory.slice(0, 10).map((activity: any) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 bg-gaming-accent/20 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gaming-gold rounded-full flex items-center justify-center">
                            <Gift className="w-5 h-5 text-black" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{activity.gameTitle || "Game Activity"}</p>
                            <p className="text-sm text-casino-text-muted">
                              {new Date(activity.playedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gaming-gold">₹{activity.winAmount || activity.betAmount}</p>
                          <Badge variant={parseFloat(activity.winAmount || "0") > 0 ? "default" : "secondary"}>
                            {parseFloat(activity.winAmount || "0") > 0 ? "Win" : "Bet"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}