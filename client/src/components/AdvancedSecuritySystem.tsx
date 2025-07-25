import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, EyeOff, Smartphone, Key, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onBack: () => void;
}

export default function AdvancedSecuritySystem({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'password' | '2fa' | 'sessions' | 'alerts'>('overview');
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [withdrawalAlerts, setWithdrawalAlerts] = useState(true);
  const { toast } = useToast();

  const securityScore = 85;
  
  const recentActivities = [
    { id: 1, action: 'Login from Mobile', location: 'Mumbai, India', time: '2 minutes ago', status: 'success' },
    { id: 2, action: 'Password Changed', location: 'Mumbai, India', time: '1 day ago', status: 'success' },
    { id: 3, action: 'Failed Login Attempt', location: 'Unknown Location', time: '3 days ago', status: 'warning' },
    { id: 4, action: 'Withdrawal Request', location: 'Mumbai, India', time: '5 days ago', status: 'success' }
  ];

  const activeSessions = [
    { id: 1, device: 'iPhone 14 Pro', location: 'Mumbai, India', lastActive: 'Active now', current: true },
    { id: 2, device: 'Chrome Browser', location: 'Mumbai, India', lastActive: '2 hours ago', current: false },
    { id: 3, device: 'Android App', location: 'Delhi, India', lastActive: '1 day ago', current: false }
  ];

  const changePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password Updated",
      description: "Your password has been successfully changed",
    });

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const enable2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
    toast({
      title: is2FAEnabled ? "2FA Disabled" : "2FA Enabled",
      description: is2FAEnabled 
        ? "Two-factor authentication has been disabled" 
        : "Two-factor authentication has been enabled for enhanced security",
    });
  };

  const terminateSession = (sessionId: number) => {
    toast({
      title: "Session Terminated",
      description: "The selected session has been terminated",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 flex items-center justify-between">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">Security Center</h1>
          <div className="text-sm opacity-90">Account Protection</div>
        </div>
        <div className="w-6 h-6" />
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-black/30 overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview', icon: Shield },
          { key: 'password', label: 'Password', icon: Lock },
          { key: '2fa', label: '2FA', icon: Smartphone },
          { key: 'sessions', label: 'Sessions', icon: Eye },
          { key: 'alerts', label: 'Alerts', icon: AlertTriangle }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-shrink-0 py-3 px-4 text-center transition-colors ${
              activeTab === tab.key
                ? 'bg-red-500 text-white'
                : 'text-gray-300 hover:bg-white/10'
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
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Security Score */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-white" />
                <div className="text-3xl font-bold mb-2">{securityScore}%</div>
                <div className="text-green-200 mb-4">Security Score</div>
                <div className="bg-white/20 rounded-full h-2 mb-4">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-1000"
                    style={{ width: `${securityScore}%` }}
                  ></div>
                </div>
                <div className="text-sm text-green-100">Excellent Security</div>
              </div>

              {/* Security Features Status */}
              <div className="bg-black/30 rounded-xl p-4">
                <h3 className="font-bold mb-4">Security Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Lock className="w-5 h-5 mr-3 text-green-400" />
                      <span>Strong Password</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Smartphone className="w-5 h-5 mr-3 text-blue-400" />
                      <span>Two-Factor Authentication</span>
                    </div>
                    {is2FAEnabled ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-3 text-green-400" />
                      <span>Login Alerts</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Eye className="w-5 h-5 mr-3 text-green-400" />
                      <span>Session Monitoring</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              </div>

              {/* Recent Security Activity */}
              <div className="bg-black/30 rounded-xl p-4">
                <h3 className="font-bold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivities.slice(0, 3).map(activity => (
                    <div key={activity.id} className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className={`mt-1 mr-3 ${getStatusColor(activity.status)}`}>
                          {getStatusIcon(activity.status)}
                        </div>
                        <div>
                          <div className="font-semibold">{activity.action}</div>
                          <div className="text-xs text-gray-300">{activity.location}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => setActiveTab('password')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button 
                  onClick={() => setActiveTab('2fa')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Setup 2FA
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'password' && (
            <motion.div
              key="password"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Change Password</h2>
                <div className="text-gray-300">Update your account password for better security</div>
              </div>

              <div className="bg-black/30 rounded-xl p-4 space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Current Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">New Password</label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Confirm New Password</label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Confirm new password"
                  />
                </div>

                <Button onClick={changePassword} className="w-full bg-red-600 hover:bg-red-700">
                  Update Password
                </Button>
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-600/20 rounded-xl p-4">
                <h3 className="font-bold mb-3">Password Requirements:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    <span>At least 8 characters long</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    <span>Contains uppercase and lowercase letters</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    <span>Contains numbers</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    <span>Contains special characters</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === '2fa' && (
            <motion.div
              key="2fa"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Two-Factor Authentication</h2>
                <div className="text-gray-300">Add an extra layer of security to your account</div>
              </div>

              <div className="bg-black/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Smartphone className="w-8 h-8 mr-3 text-blue-400" />
                    <div>
                      <div className="font-bold">SMS Authentication</div>
                      <div className="text-sm text-gray-300">Receive codes via SMS</div>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full ${is2FAEnabled ? 'bg-green-500' : 'bg-gray-600'} relative transition-colors`}>
                    <button
                      onClick={enable2FA}
                      className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                        is2FAEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </div>

                {is2FAEnabled && (
                  <div className="bg-green-600/20 rounded-lg p-3 border border-green-500/30">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                      <span className="text-green-300">2FA is currently enabled</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 2FA Setup Guide */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4">
                <h3 className="font-bold mb-3">How 2FA Works:</h3>
                <div className="space-y-2 text-sm">
                  <div>1. Enter your username and password</div>
                  <div>2. Receive a verification code on your phone</div>
                  <div>3. Enter the code to complete login</div>
                  <div>4. Your account is now secure!</div>
                </div>
              </div>

              {/* Backup Codes */}
              {is2FAEnabled && (
                <div className="bg-yellow-600/20 rounded-xl p-4 border border-yellow-500/30">
                  <h3 className="font-bold mb-3 text-yellow-300">Backup Codes</h3>
                  <div className="text-sm text-yellow-200 mb-3">
                    Save these codes in a safe place. Each can only be used once.
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-sm">
                    <div>1A2B-3C4D-5E6F</div>
                    <div>7G8H-9I0J-1K2L</div>
                    <div>3M4N-5O6P-7Q8R</div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'sessions' && (
            <motion.div
              key="sessions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Active Sessions</h2>
                <div className="text-gray-300">Monitor and manage your login sessions</div>
              </div>

              {activeSessions.map(session => (
                <div key={session.id} className="bg-black/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold">{session.device}</div>
                        <div className="text-sm text-gray-300">{session.location}</div>
                      </div>
                    </div>
                    {session.current && (
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Current
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Last active: {session.lastActive}
                    </div>
                    {!session.current && (
                      <Button
                        onClick={() => terminateSession(session.id)}
                        size="sm"
                        variant="destructive"
                        className="text-xs"
                      >
                        Terminate
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <Button className="w-full bg-red-600 hover:bg-red-700">
                Terminate All Other Sessions
              </Button>
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Security Alerts</h2>
                <div className="text-gray-300">Configure your notification preferences</div>
              </div>

              <div className="space-y-4">
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">Login Alerts</div>
                      <div className="text-sm text-gray-300">Get notified of new logins</div>
                    </div>
                    <div className={`w-12 h-6 rounded-full ${loginAlerts ? 'bg-green-500' : 'bg-gray-600'} relative transition-colors`}>
                      <button
                        onClick={() => setLoginAlerts(!loginAlerts)}
                        className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                          loginAlerts ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">Withdrawal Alerts</div>
                      <div className="text-sm text-gray-300">Get notified of withdrawal requests</div>
                    </div>
                    <div className={`w-12 h-6 rounded-full ${withdrawalAlerts ? 'bg-green-500' : 'bg-gray-600'} relative transition-colors`}>
                      <button
                        onClick={() => setWithdrawalAlerts(!withdrawalAlerts)}
                        className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                          withdrawalAlerts ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="bg-black/30 rounded-xl p-4">
                <h3 className="font-bold mb-4">Recent Security Alerts</h3>
                <div className="space-y-3">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className={`mt-1 mr-3 ${getStatusColor(activity.status)}`}>
                          {getStatusIcon(activity.status)}
                        </div>
                        <div>
                          <div className="font-semibold">{activity.action}</div>
                          <div className="text-xs text-gray-300">{activity.location}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}