import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle, Eye, Clock, MapPin } from "lucide-react";

interface SecurityEvent {
  id: number;
  type: 'login' | 'transaction' | 'game_play' | 'suspicious_activity';
  timestamp: Date;
  location: string;
  ipAddress: string;
  device: string;
  riskLevel: 'low' | 'medium' | 'high';
  details: string;
  status: 'resolved' | 'pending' | 'investigating';
}

interface FraudDetectionProps {
  userId: number;
}

export default function FraudDetection({ userId }: FraudDetectionProps) {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [riskScore, setRiskScore] = useState(0);
  const [accountStatus, setAccountStatus] = useState<'secure' | 'warning' | 'locked'>('secure');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [userId]);

  const fetchSecurityData = async () => {
    try {
      const [eventsResponse, riskResponse] = await Promise.all([
        fetch('/api/security/events', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        }),
        fetch('/api/security/risk-score', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        })
      ]);

      if (eventsResponse.ok) {
        const events = await eventsResponse.json();
        setSecurityEvents(events);
      }

      if (riskResponse.ok) {
        const riskData = await riskResponse.json();
        setRiskScore(riskData.score);
        setAccountStatus(riskData.status);
      }
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge className="bg-red-500 text-white">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 text-white">Medium Risk</Badge>;
      case 'low':
        return <Badge className="bg-green-500 text-white">Low Risk</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'investigating':
        return <Eye className="w-4 h-4 text-yellow-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'transaction':
        return <MapPin className="w-4 h-4 text-green-400" />;
      case 'game_play':
        return <Eye className="w-4 h-4 text-purple-400" />;
      case 'suspicious_activity':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <Card className="game-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gaming-accent/20 rounded w-3/4"></div>
            <div className="h-20 bg-gaming-accent/20 rounded"></div>
            <div className="h-32 bg-gaming-accent/20 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Security Overview */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="text-gaming-gold flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Account Security Status
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-casino-text-secondary">Risk Score:</span>
              <Badge className={`${riskScore > 70 ? 'bg-red-500' : riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'} text-white`}>
                {riskScore}/100
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {accountStatus === 'secure' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your account is secure. No suspicious activities detected.
              </AlertDescription>
            </Alert>
          )}

          {accountStatus === 'warning' && (
            <Alert className="border-yellow-500/50 bg-yellow-900/20">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-400">
                Some unusual activity detected. Please review recent transactions and update your password.
              </AlertDescription>
            </Alert>
          )}

          {accountStatus === 'locked' && (
            <Alert className="border-red-500/50 bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-400">
                Account temporarily locked due to suspicious activity. Contact support for assistance.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gaming-accent/10 p-4 rounded-lg">
              <div className="text-sm text-casino-text-secondary mb-1">Device Security</div>
              <div className="text-lg font-bold text-green-400">Verified</div>
              <div className="text-xs text-casino-text-secondary">Current device recognized</div>
            </div>

            <div className="bg-gaming-accent/10 p-4 rounded-lg">
              <div className="text-sm text-casino-text-secondary mb-1">Location</div>
              <div className="text-lg font-bold text-white">Mumbai, India</div>
              <div className="text-xs text-casino-text-secondary">Last login location</div>
            </div>

            <div className="bg-gaming-accent/10 p-4 rounded-lg">
              <div className="text-sm text-casino-text-secondary mb-1">2FA Status</div>
              <div className="text-lg font-bold text-green-400">Enabled</div>
              <div className="text-xs text-casino-text-secondary">SMS verification active</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Events */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="text-gaming-gold">Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityEvents.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-casino-text-muted mx-auto mb-2" />
                <p className="text-casino-text-muted">No security events recorded</p>
              </div>
            ) : (
              securityEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gaming-accent/5 border border-gaming-accent/20"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getEventTypeIcon(event.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white capitalize">
                          {event.type.replace('_', ' ')}
                        </span>
                        {getRiskBadge(event.riskLevel)}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(event.status)}
                        <span className="text-xs text-casino-text-secondary">
                          {new Date(event.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-casino-text-secondary mt-1">
                      {event.details}
                    </p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-casino-text-muted">
                      <span>📍 {event.location}</span>
                      <span>🌐 {event.ipAddress}</span>
                      <span>📱 {event.device}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="text-gaming-gold">Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-900/20 border border-blue-500/30">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              <div>
                <div className="font-medium text-blue-400">Enable Two-Factor Authentication</div>
                <div className="text-sm text-casino-text-secondary">
                  Add an extra layer of security to your account
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-900/20 border border-green-500/30">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-medium text-green-400">Regular Password Updates</div>
                <div className="text-sm text-casino-text-secondary">
                  Change your password every 90 days for optimal security
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="font-medium text-yellow-400">Review Login Activity</div>
                <div className="text-sm text-casino-text-secondary">
                  Regularly check for unauthorized access attempts
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}