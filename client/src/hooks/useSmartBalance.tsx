import { useState, useEffect, useRef, useCallback } from 'react';

interface BalanceCache {
  balance: string;
  timestamp: number;
  isLoading: boolean;
}

const CACHE_DURATION = 30000; // 30 seconds
const REQUEST_DEBOUNCE = 1000; // 1 second

export function useSmartBalance() {
  const [balance, setBalance] = useState('10000.00');
  const [isLoading, setIsLoading] = useState(false);
  
  const cacheRef = useRef<BalanceCache>({
    balance: '10000.00',
    timestamp: 0,
    isLoading: false
  });
  
  const requestTimerRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (requestTimerRef.current) {
        clearTimeout(requestTimerRef.current);
      }
    };
  }, []);
  
  const fetchBalance = useCallback(async () => {
    const now = Date.now();
    const cache = cacheRef.current;
    
    // Return cached balance if still valid
    if (cache.timestamp && (now - cache.timestamp) < CACHE_DURATION) {
      return cache.balance;
    }
    
    // Prevent multiple simultaneous requests
    if (cache.isLoading) {
      return cache.balance;
    }
    
    try {
      cache.isLoading = true;
      setIsLoading(true);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        return '10000.00'; // Demo balance
      }
      
      const response = await fetch('/api/wallet/balance', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok && mountedRef.current) {
        const data = await response.json();
        const newBalance = data.balance || data.walletBalance || '10000.00';
        
        // Update cache
        cache.balance = newBalance;
        cache.timestamp = now;
        
        setBalance(newBalance);
        return newBalance;
      }
    } catch (error) {
      console.error('Balance fetch error:', error);
    } finally {
      cache.isLoading = false;
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
    
    return cache.balance;
  }, []);
  
  // Debounced balance update with overloads
  const updateBalance = useCallback((amountOrBalance: number | string, type: 'add' | 'subtract' | 'set' = 'subtract') => {
    let newBalance: number;
    
    if (typeof amountOrBalance === 'string') {
      // If string is passed, treat as direct balance update
      newBalance = parseFloat(amountOrBalance) || 0;
    } else {
      // If number is passed, treat as amount to add/subtract
      const current = parseFloat(balance);
      newBalance = type === 'add' ? current + amountOrBalance : 
                   type === 'set' ? amountOrBalance :
                   Math.max(0, current - amountOrBalance);
    }
    
    const balanceStr = newBalance.toFixed(2);
    
    setBalance(balanceStr);
    
    // Update cache immediately for instant UI feedback
    cacheRef.current.balance = balanceStr;
    cacheRef.current.timestamp = Date.now();
    
    // Debounce server sync
    if (requestTimerRef.current) {
      clearTimeout(requestTimerRef.current);
    }
    
    requestTimerRef.current = setTimeout(() => {
      if (mountedRef.current) {
        fetchBalance();
      }
    }, REQUEST_DEBOUNCE);
  }, [balance, fetchBalance]);
  
  // Initial load
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);
  
  return {
    balance,
    isLoading,
    updateBalance,
    refreshBalance: fetchBalance
  };
}