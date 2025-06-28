import { Perfect91Club } from './components/Perfect91Club';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { queryClient } from '@/lib/queryClient';
import { useState, useEffect } from 'react';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      <Perfect91Club />
      <Toaster />
    </QueryClientProvider>
  );
}