import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Shield, AlertTriangle, LogOut, Smartphone, Monitor } from "lucide-react";

interface ActiveSession {
  id: string;
  deviceType: string;
  browser: string;
  location: string;
  ipAddress: string;
  loginTime: Date;
  lastActivity: Date;
  isCurrent: boolean;
}

interface SessionLimits {
  maxConcurrentSessions: number;
  sessionTimeoutMinutes: number;
  idleTimeoutMinutes: number;
}

export default function SessionManagement() {
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [sessionLimits, setSessionLimits] = useState<SessionLimits>({
    maxConcurrentSessions: 3,
    sessionTimeoutMinutes: 480, // 8 hours
    idleTimeoutMinutes: 30
  });
  const [sessionTime, setSessionTime] = useState(0);
  const [idleTime, setIdleTime] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveSessions();
    startSessionTimer();
    
    // Monitor user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const resetIdleTimer = () => setIdleTime(0);
    
    activityEvents.forEach(event => {
      document.addEventListener(event, resetIdleTimer);
    });

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetIdleTimer);
      });
    };
  }, []);

  const fetchActiveSessions = async () => {
    try {
      const response = await fetch('/api/auth/sessions', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });

      if (response.ok) {
        const sessions = await response.json();
        setActiveSessions(sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const startSessionTimer = () => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
      setIdleTime(prev => prev + 1);
      
      // Auto-logout on idle timeout
      if (idleTime >= sessionLimits.idleTimeoutMinutes * 60) {
        handleLogout();
      }
      
      // Session timeout warning
      if (sessionTime >= (sessionLimits.sessionTimeoutMinutes - 15) * 60) {
        showSessionWarning();
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const handleLogout = async (sessionId?: string) => {
    try {
      const endpoint = sessionId ? `/api/auth/sessions/${sessionId}` : '/api/auth/logout';
      await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });

      if (!sessionId) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      } else {
        fetchActiveSessions();
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const showSessionWarning = () => {
    if (confirm('Your session will expire in 15 minutes. Would you like to extend it?')) {
      extendSession();
    }
  };

  const extendSession = async () => {
    try {
      await fetch('/api/auth/extend-session', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      setSessionTime(0);
    } catch (error) {
      console.error('Error extending session:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="game-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gaming-accent/20 rounded w-3/4"></div>
            <div className="h-20 bg-gaming-accent/20 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Status */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="text-gaming-gold flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Current Session Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gaming-accent/10 p-4 rounded-lg">
              <div className="text-sm text-casino-text-secondary mb-1">Session Time</div>
              <div className="text-xl font-bold text-white">{formatTime(sessionTime)}</div>
              <div className="text-xs text-casino-text-muted">
                Max: {sessionLimits.sessionTimeoutMinutes} minutes
              </div>
            </div>

            <div className="bg-gaming-accent/10 p-4 rounded-lg">
              <div className="text-sm text-casino-text-secondary mb-1">Idle Time</div>
              <div className="text-xl font-bold text-yellow-400">{formatTime(idleTime)}</div>
              <div className="text-xs text-casino-text-muted">
                Timeout: {sessionLimits.idleTimeoutMinutes} minutes
              </div>
            </div>

            <div className="bg-gaming-accent/10 p-4 rounded-lg">
              <div className="text-sm text-casino-text-secondary mb-1">Active Sessions</div>
              <div className="text-xl font-bold text-green-400">{activeSessions.length}</div>
              <div className="text-xs text-casino-text-muted">
                Max: {sessionLimits.maxConcurrentSessions}
              </div>
            </div>
          </div>

          {idleTime > sessionLimits.idleTimeoutMinutes * 60 * 0.8 && (
            <Alert className="mt-4 border-yellow-500/50 bg-yellow-900/20">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-400">
                You will be automatically logged out due to inactivity in {Math.ceil((sessionLimits.idleTimeoutMinutes * 60 - idleTime) / 60)} minutes.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="text-gaming-gold flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Active Sessions
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchActiveSessions()}
            >
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  session.isCurrent 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : 'bg-gaming-accent/5 border-gaming-accent/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getDeviceIcon(session.deviceType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">
                        {session.browser} on {session.deviceType}
                      </span>
                      {session.isCurrent && (
                        <Badge className="bg-green-500 text-white text-xs">Current</Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-casino-text-secondary mt-1">
                      📍 {session.location} • 🌐 {session.ipAddress}
                    </div>
                    
                    <div className="text-xs text-casino-text-muted mt-1">
                      Login: {new Date(session.loginTime).toLocaleString()} • 
                      Last activity: {new Date(session.lastActivity).toLocaleString()}
                    </div>
                  </div>
                </div>

                {!session.isCurrent && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleLogout(session.id)}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>End</span>
                  </Button>
                )}
              </div>
            ))}

            {activeSessions.length === 0 && (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-casino-text-muted mx-auto mb-2" />
                <p className="text-casino-text-muted">No active sessions found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session Controls */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="text-gaming-gold">Session Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Extend Current Session</div>
                <div className="text-sm text-casino-text-secondary">
                  Reset session timeout to maximum duration
                </div>
              </div>
              <Button onClick={extendSession} variant="outline">
                Extend Session
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Logout All Devices</div>
                <div className="text-sm text-casino-text-secondary">
                  End all active sessions on all devices
                </div>
              </div>
              <Button
                onClick={() => {
                  if (confirm('This will log you out from all devices. Continue?')) {
                    activeSessions.forEach(session => {
                      if (!session.isCurrent) handleLogout(session.id);
                    });
                  }
                }}
                variant="destructive"
              >
                Logout All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}