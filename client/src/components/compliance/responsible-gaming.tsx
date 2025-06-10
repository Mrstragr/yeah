import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Clock, DollarSign, AlertTriangle, Info } from "lucide-react";

interface ResponsibleGamingProps {
  userId: number;
}

export default function ResponsibleGaming({ userId }: ResponsibleGamingProps) {
  const [settings, setSettings] = useState({
    dailyLimit: "",
    weeklyLimit: "",
    monthlyLimit: "",
    sessionTimeLimit: "",
    coolingOffPeriod: "",
    selfExclusionPeriod: "",
    depositLimitEnabled: true,
    sessionReminderEnabled: true,
    realityCheckInterval: "30",
    lossLimitEnabled: true,
    dailyLossLimit: ""
  });
  const [loading, setLoading] = useState(false);
  const [currentUsage, setCurrentUsage] = useState({
    todaySpent: 0,
    weekSpent: 0,
    monthSpent: 0,
    sessionTime: 0,
    todayLoss: 0
  });

  useEffect(() => {
    fetchSettings();
    fetchCurrentUsage();
  }, [userId]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/responsible-gaming/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchCurrentUsage = async () => {
    try {
      const response = await fetch('/api/responsible-gaming/usage', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUsage(data);
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  const updateSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/responsible-gaming/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert('Settings updated successfully');
      } else {
        alert('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  const requestSelfExclusion = async (period: string) => {
    if (!confirm(`Are you sure you want to self-exclude for ${period}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch('/api/responsible-gaming/self-exclude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ period })
      });

      if (response.ok) {
        alert('Self-exclusion activated. You will be logged out shortly.');
        setTimeout(() => window.location.href = '/logout', 3000);
      } else {
        alert('Failed to activate self-exclusion');
      }
    } catch (error) {
      console.error('Error requesting self-exclusion:', error);
    }
  };

  const calculateProgress = (spent: number, limit: string) => {
    if (!limit || limit === "0") return 0;
    return Math.min((spent / parseFloat(limit)) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="text-gaming-gold flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Responsible Gaming Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              These tools help you maintain control over your gaming activities. 
              Set limits to ensure gaming remains fun and within your budget.
            </AlertDescription>
          </Alert>

          {/* Current Usage Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gaming-accent/10 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-casino-text-secondary">Today's Spending</span>
                <DollarSign className="w-4 h-4 text-gaming-gold" />
              </div>
              <div className="text-lg font-bold text-white">₹{currentUsage.todaySpent}</div>
              {settings.dailyLimit && (
                <div className="mt-2">
                  <div className="bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gaming-gold rounded-full h-2 transition-all"
                      style={{ width: `${calculateProgress(currentUsage.todaySpent, settings.dailyLimit)}%` }}
                    />
                  </div>
                  <div className="text-xs text-casino-text-secondary mt-1">
                    Limit: ₹{settings.dailyLimit}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gaming-accent/10 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-casino-text-secondary">Session Time</span>
                <Clock className="w-4 h-4 text-gaming-gold" />
              </div>
              <div className="text-lg font-bold text-white">{Math.floor(currentUsage.sessionTime / 60)}h {currentUsage.sessionTime % 60}m</div>
              {settings.sessionTimeLimit && (
                <div className="mt-2">
                  <div className="bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gaming-gold rounded-full h-2 transition-all"
                      style={{ width: `${calculateProgress(currentUsage.sessionTime, settings.sessionTimeLimit)}%` }}
                    />
                  </div>
                  <div className="text-xs text-casino-text-secondary mt-1">
                    Limit: {settings.sessionTimeLimit} minutes
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gaming-accent/10 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-casino-text-secondary">Today's Losses</span>
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-lg font-bold text-red-400">₹{currentUsage.todayLoss}</div>
              {settings.dailyLossLimit && (
                <div className="mt-2">
                  <div className="bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-400 rounded-full h-2 transition-all"
                      style={{ width: `${calculateProgress(currentUsage.todayLoss, settings.dailyLossLimit)}%` }}
                    />
                  </div>
                  <div className="text-xs text-casino-text-secondary mt-1">
                    Limit: ₹{settings.dailyLossLimit}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Spending Limits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gaming-gold">Spending Limits</h3>
            
            <div className="flex items-center space-x-2">
              <Switch 
                checked={settings.depositLimitEnabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, depositLimitEnabled: checked }))}
              />
              <Label>Enable deposit limits</Label>
            </div>

            {settings.depositLimitEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyLimit">Daily Limit (₹)</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    placeholder="0"
                    value={settings.dailyLimit}
                    onChange={(e) => setSettings(prev => ({ ...prev, dailyLimit: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weeklyLimit">Weekly Limit (₹)</Label>
                  <Input
                    id="weeklyLimit"
                    type="number"
                    placeholder="0"
                    value={settings.weeklyLimit}
                    onChange={(e) => setSettings(prev => ({ ...prev, weeklyLimit: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyLimit">Monthly Limit (₹)</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    placeholder="0"
                    value={settings.monthlyLimit}
                    onChange={(e) => setSettings(prev => ({ ...prev, monthlyLimit: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Loss Limits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gaming-gold">Loss Limits</h3>
            
            <div className="flex items-center space-x-2">
              <Switch 
                checked={settings.lossLimitEnabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, lossLimitEnabled: checked }))}
              />
              <Label>Enable daily loss limit</Label>
            </div>

            {settings.lossLimitEnabled && (
              <div className="space-y-2">
                <Label htmlFor="dailyLossLimit">Daily Loss Limit (₹)</Label>
                <Input
                  id="dailyLossLimit"
                  type="number"
                  placeholder="0"
                  value={settings.dailyLossLimit}
                  onChange={(e) => setSettings(prev => ({ ...prev, dailyLossLimit: e.target.value }))}
                />
              </div>
            )}
          </div>

          {/* Time Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gaming-gold">Time Controls</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeLimit">Session Time Limit (minutes)</Label>
                <Input
                  id="sessionTimeLimit"
                  type="number"
                  placeholder="0 = No limit"
                  value={settings.sessionTimeLimit}
                  onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeLimit: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="realityCheck">Reality Check Interval</Label>
                <Select 
                  value={settings.realityCheckInterval}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, realityCheckInterval: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Disabled</SelectItem>
                    <SelectItem value="15">Every 15 minutes</SelectItem>
                    <SelectItem value="30">Every 30 minutes</SelectItem>
                    <SelectItem value="60">Every hour</SelectItem>
                    <SelectItem value="120">Every 2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                checked={settings.sessionReminderEnabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sessionReminderEnabled: checked }))}
              />
              <Label>Enable session time reminders</Label>
            </div>
          </div>

          {/* Self-Exclusion */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-400">Self-Exclusion</h3>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Self-exclusion will prevent you from accessing your account for the selected period. 
                This action cannot be reversed once activated.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button 
                variant="outline" 
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                onClick={() => requestSelfExclusion('24h')}
              >
                24 Hours
              </Button>
              <Button 
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black"
                onClick={() => requestSelfExclusion('7d')}
              >
                7 Days
              </Button>
              <Button 
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => requestSelfExclusion('30d')}
              >
                30 Days
              </Button>
              <Button 
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                onClick={() => requestSelfExclusion('6m')}
              >
                6 Months
              </Button>
            </div>
          </div>

          <Button
            onClick={updateSettings}
            disabled={loading}
            className="w-full bg-gaming-gold text-black hover:bg-gaming-gold/90"
          >
            {loading ? "Saving..." : "Save Settings"}
          </Button>

          {/* Help Resources */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-400 mb-3">Need Help?</h4>
            <div className="space-y-2 text-sm text-casino-text-secondary">
              <p>• <strong>Gambling Helpline:</strong> 1800-GAMBLING (1800-426-2546)</p>
              <p>• <strong>National Council on Problem Gambling:</strong> ncpgambling.org</p>
              <p>• <strong>Gamblers Anonymous:</strong> gamblersanonymous.org</p>
              <p>• <strong>24/7 Chat Support:</strong> Available in your account dashboard</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}