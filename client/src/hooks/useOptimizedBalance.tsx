import { useState, useEffect, useRef, useCallback } from 'react';

interface BalanceData {
  balance: string;
  walletBalance: string;
}

export function useOptimizedBalance() {
  const [balance, setBalance] = useState<BalanceData>({ balance: '0.00', walletBalance: '0.00' });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const requestInProgressRef = useRef(false);
  const mountedRef = useRef(true);
  const cacheRef = useRef<BalanceData | null>(null);

  // Optimized fetch with caching and request deduplication
  const fetchBalance = useCallback(async (force = false) => {
    // Prevent multiple simultaneous requests
    if (requestInProgressRef.current && !force) {
      return cacheRef.current;
    }

    // Use cache if recent (within 30 seconds)
    const now = Date.now();
    if (!force && cacheRef.current && (now - lastUpdated) < 30000) {
      return cacheRef.current;
    }

    requestInProgressRef.current = true;
    
    try {
      const response = await fetch('/api/wallet/balance');
      if (response.ok && mountedRef.current) {
        const data = await response.json();
        const balanceData = {
          balance: data.balance || '0.00',
          walletBalance: data.walletBalance || '0.00'
        };

        // Update cache and state
        cacheRef.current = balanceData;
        setBalance(balanceData);
        setLastUpdated(now);
        setIsLoading(false);
        
        return balanceData;
      }
    } catch (error) {
      console.error('Balance fetch error:', error);
      // Keep using cached data on error
      if (cacheRef.current) {
        return cacheRef.current;
      }
    } finally {
      requestInProgressRef.current = false;
    }

    return null;
  }, [lastUpdated]);

  // Local balance update for immediate UI feedback
  const updateLocalBalance = useCallback((amount: number, type: 'add' | 'subtract' = 'add') => {
    setBalance(prev => {
      const currentBalance = parseFloat(prev.walletBalance);
      const newBalance = type === 'add' 
        ? currentBalance + amount 
        : Math.max(0, currentBalance - amount);
      
      const updatedBalance = {
        balance: newBalance.toFixed(2),
        walletBalance: newBalance.toFixed(2)
      };

      // Update cache
      cacheRef.current = updatedBalance;
      setLastUpdated(Date.now());
      
      return updatedBalance;
    });
  }, []);

  // Initialize and set up polling
  useEffect(() => {
    // Initial fetch
    fetchBalance(true);

    // Set up optimized polling - only every 60 seconds
    intervalRef.current = setInterval(() => {
      if (!requestInProgressRef.current) {
        fetchBalance();
      }
    }, 60000); // Reduced to 60 seconds

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchBalance]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    balance: balance.walletBalance,
    isLoading,
    updateLocalBalance,
    forceRefresh: () => fetchBalance(true),
    lastUpdated: new Date(lastUpdated).toLocaleTimeString()
  };
}