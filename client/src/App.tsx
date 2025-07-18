import { Perfect91Club } from './components/Perfect91Club';
import QuickGameLauncher from './components/QuickGameLauncher';
import ProductionLoginPage from './components/ProductionLoginPage';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { queryClient } from '@/lib/queryClient';
import { useState, useEffect } from 'react';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showGameLauncher, setShowGameLauncher] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('91club_user');
    const savedToken = localStorage.getItem('91club_token');
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error parsing saved user data:', err);
        localStorage.removeItem('91club_user');
        localStorage.removeItem('91club_token');
      }
    }

    // Test API connectivity
    fetch('/api/test', { method: 'GET' })
      .then(res => {
        console.log('API test response:', res.status);
        setIsReady(true);
      })
      .catch(err => {
        console.error('API connection failed:', err);
        setError(err.message);
        setIsReady(true); // Still show app even if API fails
      });
  }, []);

  const handleLogin = (userData: any) => {
    // Generate demo token for authentication
    const token = `demo_token_${Date.now()}`;
    
    // Save user data and token
    localStorage.setItem('91club_user', JSON.stringify(userData));
    localStorage.setItem('91club_token', token);
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('91club_user');
    localStorage.removeItem('91club_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isReady) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '20px', fontWeight: 'bold' }}>
            👑 Perfect91Club
          </div>
          <div>Loading premium gaming platform...</div>
          {error && <div style={{ color: '#ff6b6b', marginTop: '10px' }}>Connection issue: {error}</div>}
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* Quick Game Access Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowGameLauncher(!showGameLauncher)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-all text-sm font-semibold"
        >
          {showGameLauncher ? 'Back to App' : '🎮 Quick Games'}
        </button>
      </div>
      
      {showGameLauncher ? (
        <QuickGameLauncher />
      ) : isAuthenticated ? (
        <Perfect91Club user={user} onLogout={handleLogout} />
      ) : (
        <ProductionLoginPage onLoginSuccess={handleLogin} />
      )}
      <Toaster />
    </QueryClientProvider>
  );
}