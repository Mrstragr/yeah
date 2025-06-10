// Environment configuration and validation
export const Environment = {
  // Server configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  
  // Payment gateways
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  
  // Analytics
  GA_MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  
  // Feature flags
  ENABLE_REAL_PAYMENTS: import.meta.env.VITE_ENABLE_REAL_PAYMENTS === 'true',
  ENABLE_KYC: import.meta.env.VITE_ENABLE_KYC !== 'false',
  ENABLE_RESPONSIBLE_GAMING: import.meta.env.VITE_ENABLE_RESPONSIBLE_GAMING !== 'false',
  
  // App configuration
  APP_NAME: 'TashanWin',
  APP_VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@tashanwin.com',
  
  // Game settings
  MIN_BET_AMOUNT: 10,
  MAX_BET_AMOUNT: 100000,
  DEFAULT_CURRENCY: 'INR',
  
  // Security settings
  SESSION_TIMEOUT_MINUTES: 480, // 8 hours
  IDLE_TIMEOUT_MINUTES: 30,
  MAX_LOGIN_ATTEMPTS: 5,
  
  // Validation helpers
  isProduction: () => Environment.NODE_ENV === 'production',
  isDevelopment: () => Environment.NODE_ENV === 'development',
  
  // Required environment variables check
  validateEnvironment: () => {
    const required = [];
    
    if (Environment.isProduction()) {
      if (!Environment.RAZORPAY_KEY_ID) required.push('VITE_RAZORPAY_KEY_ID');
      if (!Environment.GA_MEASUREMENT_ID) required.push('VITE_GA_MEASUREMENT_ID');
    }
    
    if (required.length > 0) {
      console.warn('Missing required environment variables:', required);
      return false;
    }
    
    return true;
  },
  
  // Get display currency symbol
  getCurrencySymbol: (currency: string = Environment.DEFAULT_CURRENCY) => {
    const symbols: Record<string, string> = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€'
    };
    return symbols[currency] || currency;
  },
  
  // Format amount with currency
  formatCurrency: (amount: number, currency: string = Environment.DEFAULT_CURRENCY) => {
    const symbol = Environment.getCurrencySymbol(currency);
    return `${symbol}${amount.toLocaleString('en-IN')}`;
  }
};

// Initialize environment validation
Environment.validateEnvironment();