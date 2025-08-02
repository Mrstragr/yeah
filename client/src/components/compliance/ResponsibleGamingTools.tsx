import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, Shield, AlertTriangle, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ResponsibleGamingToolsProps {
  userId: number;
  currentBalance: number;
}

export function ResponsibleGamingTools({ userId, currentBalance }: ResponsibleGamingToolsProps) {
  const [settings, setSettings] = useState({
    dailyDepositLimit: 50000,
    weeklyDepositLimit: 200000,
    monthlyDepositLimit: 500000,
    sessionTimeLimit: 360, // minutes
    dailyTimeLimit: 720, // minutes
    spendingAlerts: true,
    timeAlerts: true,
    selfExclusionUntil: null as Date | null,
  });

  const [currentSession, setCurrentSession] = useState({
    startTime: new Date(),
    timeSpent: 0, // minutes
    challengesPlaced: 0,
    amountSpent: 0,
  });

  const [alerts, setAlerts] = useState<Array<{
    type: 'spending' | 'time' | 'limit';
    message: string;
    level: 'warning' | 'critical';
  }>>([]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeSpent = Math.floor((now.getTime() - currentSession.startTime.getTime()) / (1000 * 60));
      setCurrentSession(prev => ({ ...prev, timeSpent }));

      // Check time limits
      checkTimeLimits(timeSpent);
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, [currentSession.startTime, settings]);

  const checkTimeLimits = (timeSpent: number) => {
    if (settings.timeAlerts) {
      // Session time warning at 80% of limit
      if (timeSpent >= settings.sessionTimeLimit * 0.8 && timeSpent < settings.sessionTimeLimit) {
        addAlert('time', `You've been playing for ${timeSpent} minutes. Consider taking a break.`, 'warning');
      }
      
      // Session time limit reached
      if (timeSpent >= settings.sessionTimeLimit) {
        addAlert('time', `Session time limit of ${settings.sessionTimeLimit} minutes reached. Please take a break.`, 'critical');
      }
    }
  };

  const addAlert = (type: 'spending' | 'time' | 'limit', message: string, level: 'warning' | 'critical') => {
    setAlerts(prev => [...prev.filter(a => a.message !== message), { type, message, level }]);
  };

  const updateSettings = async (newSettings: typeof settings) => {
    try {
      // In production, this would call the API
      const response = await fetch('/api/responsible-gaming/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...newSettings }),
      });
      
      if (response.ok) {
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Active Alerts */}
      {alerts.map((alert, index) => (
        <Alert 
          key={index} 
          className={alert.level === 'critical' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'}
        >
          <AlertTriangle className={`h-4 w-4 ${alert.level === 'critical' ? 'text-red-600' : 'text-yellow-600'}`} />
          <AlertDescription className={alert.level === 'critical' ? 'text-red-800' : 'text-yellow-800'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      ))}

      {/* Current Session Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Current Session
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Time Played:</span>
            <div className="font-semibold">{formatTime(currentSession.timeSpent)}</div>
          </div>
          <div>
            <span className="text-gray-600">Session Limit:</span>
            <div className="font-semibold">{formatTime(settings.sessionTimeLimit)}</div>
          </div>
          <div>
            <span className="text-gray-600">Challenges Placed:</span>
            <div className="font-semibold">{currentSession.challengesPlaced}</div>
          </div>
          <div>
            <span className="text-gray-600">Amount Spent:</span>
            <div className="font-semibold">{formatCurrency(currentSession.amountSpent)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Responsible Gaming Settings */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Responsible Gaming Settings
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Responsible Gaming Tools
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="limits" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="limits">Limits</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="exclusion">Exclusion</TabsTrigger>
            </TabsList>

            <TabsContent value="limits" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dailyLimit">Daily Deposit Limit</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={settings.dailyDepositLimit}
                    onChange={(e) => setSettings(prev => ({ ...prev, dailyDepositLimit: Number(e.target.value) }))}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum: ₹50,000</p>
                </div>

                <div>
                  <Label htmlFor="weeklyLimit">Weekly Deposit Limit</Label>
                  <Input
                    id="weeklyLimit"
                    type="number"
                    value={settings.weeklyDepositLimit}
                    onChange={(e) => setSettings(prev => ({ ...prev, weeklyDepositLimit: Number(e.target.value) }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="monthlyLimit">Monthly Deposit Limit</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    value={settings.monthlyDepositLimit}
                    onChange={(e) => setSettings(prev => ({ ...prev, monthlyDepositLimit: Number(e.target.value) }))}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum: ₹5,00,000</p>
                </div>

                <div>
                  <Label htmlFor="sessionTime">Session Time Limit (minutes)</Label>
                  <Input
                    id="sessionTime"
                    type="number"
                    value={settings.sessionTimeLimit}
                    onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeLimit: Number(e.target.value) }))}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum: 6 hours (360 minutes)</p>
                </div>

                <div>
                  <Label htmlFor="dailyTime">Daily Time Limit (minutes)</Label>
                  <Input
                    id="dailyTime"
                    type="number"
                    value={settings.dailyTimeLimit}
                    onChange={(e) => setSettings(prev => ({ ...prev, dailyTimeLimit: Number(e.target.value) }))}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum: 12 hours (720 minutes)</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Spending Alerts</Label>
                    <p className="text-xs text-gray-500">Get notified when approaching limits</p>
                  </div>
                  <Switch
                    checked={settings.spendingAlerts}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, spendingAlerts: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Time Alerts</Label>
                    <p className="text-xs text-gray-500">Get notified about playing time</p>
                  </div>
                  <Switch
                    checked={settings.timeAlerts}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, timeAlerts: checked }))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="exclusion" className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  Self-exclusion will prevent you from accessing games for the selected period.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button variant="outline" className="w-full" onClick={() => {
                  const until = new Date();
                  until.setHours(until.getHours() + 24);
                  setSettings(prev => ({ ...prev, selfExclusionUntil: until }));
                }}>
                  Exclude for 24 Hours
                </Button>

                <Button variant="outline" className="w-full" onClick={() => {
                  const until = new Date();
                  until.setDate(until.getDate() + 7);
                  setSettings(prev => ({ ...prev, selfExclusionUntil: until }));
                }}>
                  Exclude for 1 Week
                </Button>

                <Button variant="outline" className="w-full" onClick={() => {
                  const until = new Date();
                  until.setMonth(until.getMonth() + 1);
                  setSettings(prev => ({ ...prev, selfExclusionUntil: until }));
                }}>
                  Exclude for 1 Month
                </Button>

                <Button variant="destructive" className="w-full" onClick={() => {
                  if (confirm('Are you sure? Permanent exclusion cannot be undone.')) {
                    // Handle permanent exclusion
                  }
                }}>
                  Permanent Exclusion
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={() => updateSettings(settings)}
            className="w-full mt-4"
          >
            Save Settings
          </Button>
        </DialogContent>
      </Dialog>

      {/* Legal Disclaimers */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4 text-sm text-amber-800">
          <div className="space-y-2">
            <p className="font-semibold">⚠️ Important Disclaimers:</p>
            <p>• This platform offers skill-based prediction contests involving financial risk</p>
            <p>• Available only in states where skill-based gaming is legally permitted</p>
            <p>• Must be 18+ years old to participate</p>
            <p>• Play responsibly and within your means</p>
            <p>• Seek help if gaming becomes problematic</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}