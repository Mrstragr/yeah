import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building, ArrowLeft, Check, AlertCircle, Wallet, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  processingTime: string;
  fees: string;
}

interface Props {
  onBack: () => void;
  onPaymentSuccess?: (amount: number, method: string) => void;
}

export default function RealMoneyPaymentSystem({ onBack, onPaymentSuccess }: Props) {
  const [currentStep, setCurrentStep] = useState<'method' | 'amount' | 'processing' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [userBalance, setUserBalance] = useState(12580.45);
  const { toast } = useToast();

  // Payment methods for Indian market
  const paymentMethods: PaymentOption[] = [
    {
      id: 'upi',
      name: 'UPI',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Pay with PhonePe, GPay, Paytm',
      processingTime: 'Instant',
      fees: 'Free'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Building className="w-6 h-6" />,
      description: 'All major Indian banks',
      processingTime: '2-5 minutes',
      fees: 'Free'
    },
    {
      id: 'cards',
      name: 'Debit/Credit Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard, RuPay',
      processingTime: 'Instant',
      fees: '2.5% + GST'
    }
  ];

  // Predefined amounts for quick selection
  const quickAmounts = [500, 1000, 2000, 5000, 10000, 25000];

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Validate amount
  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    return numValue >= 100 && numValue <= 100000;
  };

  // Process payment with Razorpay
  const processPayment = async () => {
    if (!selectedMethod || !amount || !validateAmount(amount)) {
      toast({
        title: "Invalid Details",
        description: "Please select payment method and valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setCurrentStep('processing');

    try {
      // Create order on backend
      const response = await fetch('/api/wallet/create-deposit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('91club_token')}`
        },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const orderData = await response.json();

      // Razorpay configuration
      const options = {
        key: orderData.key || 'rzp_test_demo', // Use demo key for testing
        amount: orderData.amount * 100, // Amount in paise
        currency: 'INR',
        name: '91CLUB Gaming',
        description: 'Add money to wallet',
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/wallet/verify-deposit', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('91club_token')}`
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                amount: parseFloat(amount)
              })
            });

            if (verifyResponse.ok) {
              const verifyData = await verifyResponse.json();
              setUserBalance(verifyData.balance);
              setCurrentStep('success');
              
              toast({
                title: "Payment Successful!",
                description: `₹${amount} added to your wallet`,
              });

              if (onPaymentSuccess) {
                onPaymentSuccess(parseFloat(amount), selectedMethod);
              }
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            toast({
              title: "Verification Failed",
              description: "Payment was made but verification failed. Contact support.",
              variant: "destructive",
            });
            setCurrentStep('method');
          }
        },
        prefill: {
          name: 'Gaming User',
          email: 'user@91club.com',
          contact: '9999999999'
        },
        notes: {
          type: 'wallet_deposit'
        },
        theme: {
          color: '#ef4444'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setCurrentStep('method');
          }
        }
      };

      // Open Razorpay checkout
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        throw new Error('Razorpay SDK not loaded');
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      setCurrentStep('method');
    }
  };

  // Render payment method selection
  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add Money to Wallet</h2>
        <div className="text-lg text-gray-600">
          Current Balance: <span className="font-bold text-green-600">₹{userBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</div>
        {paymentMethods.map((method) => (
          <motion.button
            key={method.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedMethod(method.id)}
            className={`w-full p-4 rounded-2xl border-2 transition-all ${
              selectedMethod === method.id
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 bg-white hover:border-red-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${
                  selectedMethod === method.id ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {method.icon}
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-800">{method.name}</div>
                  <div className="text-sm text-gray-600">{method.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-green-600">{method.processingTime}</div>
                <div className="text-xs text-gray-500">{method.fees}</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {selectedMethod && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="text-lg font-semibold text-gray-800">Enter Amount</div>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className={`p-3 rounded-xl border-2 font-bold transition-all ${
                  amount === quickAmount.toString()
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-red-300'
                }`}
              >
                ₹{quickAmount.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (₹100 - ₹1,00,000)"
              className="w-full pl-8 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg font-bold focus:border-red-500 focus:outline-none"
              min="100"
              max="100000"
            />
          </div>

          {amount && !validateAmount(amount) && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Amount must be between ₹100 and ₹1,00,000</span>
            </div>
          )}

          <Button
            onClick={processPayment}
            disabled={!validateAmount(amount) || isProcessing}
            className="w-full py-4 text-lg font-bold bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
          >
            {isProcessing ? 'Processing...' : `Pay ₹${amount || '0'}`}
          </Button>
        </motion.div>
      )}
    </div>
  );

  // Render processing state
  const renderProcessing = () => (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CreditCard className="w-10 h-10 text-white animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Payment</h2>
      <p className="text-gray-600 mb-6">Please complete the payment in the popup window</p>
      <div className="flex justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
      </div>
    </div>
  );

  // Render success state
  const renderSuccess = () => (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
      <p className="text-gray-600 mb-2">₹{amount} has been added to your wallet</p>
      <p className="text-lg font-bold text-green-600 mb-8">
        New Balance: ₹{userBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </p>
      
      <div className="space-y-4">
        <Button
          onClick={() => {
            setCurrentStep('method');
            setAmount('');
            setSelectedMethod(null);
          }}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600"
        >
          Add More Money
        </Button>
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full py-3"
        >
          Start Playing Games
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Add Money</h1>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center space-x-2">
          {['method', 'processing', 'success'].map((step, index) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full ${
                currentStep === step ? 'bg-white' : 
                ['method', 'processing', 'success'].indexOf(currentStep) > index ? 'bg-white/60' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {currentStep === 'method' && renderMethodSelection()}
        {currentStep === 'processing' && renderProcessing()}
        {currentStep === 'success' && renderSuccess()}
      </div>
    </div>
  );
}