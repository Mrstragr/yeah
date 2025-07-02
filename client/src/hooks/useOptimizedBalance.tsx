import { useState, useEffect, useRef, useCallback } from 'react';

interface BalanceHookConfig {
  pollingInterval?: number; // milliseconds
  enabled?: boolean;
  onError?: (error: Error) => void;
}

export function useOptimizedBalance(config: BalanceHookConfig = {}) {
  const { pollingInterval = 30000, enabled = true, onError } = config; // Default 30 seconds
  
  const [balance, setBalance] = useState<string>('0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout>();
  const isUnmountedRef = useRef(false);

  const fetchBalance = useCallback(async () => {
    if (isUnmountedRef.current) return;
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token || !enabled) return;

      setIsLoading(true);
      const response = await fetch('/api/wallet/balance', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok && !isUnmountedRef.current) {
        const data = await response.json();
        setBalance(data.balance);
        setLastUpdated(new Date());
      }
    } catch (error) {
      if (!isUnmountedRef.current && onError) {
        onError(error as Error);
      }
    } finally {
      if (!isUnmountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [enabled, onError]);

  const forceRefresh = useCallback(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Update balance locally without API call (for immediate UI updates)
  const updateBalanceLocally = useCallback((newBalance: string) => {
    setBalance(newBalance);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetchBalance();

    // Set up polling
    intervalRef.current = setInterval(fetchBalance, pollingInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchBalance, pollingInterval, enabled]);

  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    balance,
    isLoading,
    lastUpdated,
    forceRefresh,
    updateBalanceLocally,
  };
}