import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building, CreditCard, AlertCircle, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onBack: () => void;
  userBalance: number;
}

interface BankDetails {
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
}

export default function RealMoneyWithdrawal({ onBack, userBalance }: Props) {
  const [currentStep, setCurrentStep] = useState<'amount' | 'bank' | 'processing' | 'success'>('amount');
  const [amount, setAmount] = useState<string>('');
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    bankName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Validate withdrawal amount
  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    return numValue >= 500 && numValue <= 50000 && numValue <= userBalance;
  };

  // Validate bank details
  const validateBankDetails = (): boolean => {
    return (
      bankDetails.accountNumber.length >= 9 &&
      bankDetails.accountNumber === bankDetails.confirmAccountNumber &&
      bankDetails.ifscCode.length === 11 &&
      bankDetails.accountHolderName.length >= 3 &&
      bankDetails.bankName.length >= 3
    );
  };

  // Process withdrawal
  const processWithdrawal = async () => {
    if (!validateAmount(amount) || !validateBankDetails()) {
      toast({
        title: "Invalid Details",
        description: "Please check all details and try again",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setCurrentStep('processing');

    try {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('91club_token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          accountDetails: bankDetails
        })
      });

      if (response.ok) {
        setTimeout(() => {
          setCurrentStep('success');
          toast({
            title: "Withdrawal Submitted",
            description: "Your withdrawal request has been processed",
          });
        }, 2000);
      } else {
        throw new Error('Withdrawal failed');
      }

    } catch (error) {
      console.error('Withdrawal error:', error);
      toast({
        title: "Withdrawal Failed",
        description: "Unable to process withdrawal. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      setCurrentStep('amount');
    }
  };

  // Quick amount options
  const quickAmounts = [500, 1000, 2500, 5000, 10000, Math.min(25000, userBalance)].filter(amt => amt <= userBalance);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Withdraw Money</h1>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-green-100 mb-1">Available Balance</div>
          <div className="text-2xl font-bold">₹{userBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      <div className="p-6">
        {/* Amount Selection */}
        {currentStep === 'amount' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Enter Withdrawal Amount</h2>
              <p className="text-gray-600">Minimum: ₹500 | Maximum: ₹50,000</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className={`p-3 rounded-xl border-2 font-bold transition-all ${
                    amount === quickAmount.toString()
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-green-300'
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
                placeholder="Enter amount"
                className="w-full pl-8 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg font-bold focus:border-green-500 focus:outline-none"
                min="500"
                max={Math.min(50000, userBalance)}
              />
            </div>

            {amount && !validateAmount(amount) && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>
                  {parseFloat(amount) > userBalance 
                    ? 'Insufficient balance' 
                    : 'Amount must be between ₹500 and ₹50,000'
                  }
                </span>
              </div>
            )}

            <Button
              onClick={() => validateAmount(amount) && setCurrentStep('bank')}
              disabled={!validateAmount(amount)}
              className="w-full py-4 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600"
            >
              Continue to Bank Details
            </Button>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-yellow-800">Processing Time</div>
                  <div className="text-sm text-yellow-700">Withdrawals are processed within 24-48 hours on working days</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bank Details */}
        {currentStep === 'bank' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Bank Account Details</h2>
              <p className="text-gray-600">Amount: ₹{amount}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Holder Name</label>
                <input
                  type="text"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => setBankDetails({...bankDetails, accountHolderName: e.target.value.toUpperCase()})}
                  placeholder="As per bank records"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                <input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                  placeholder="e.g., State Bank of India"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                  placeholder="Enter account number"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Account Number</label>
                <input
                  type="text"
                  value={bankDetails.confirmAccountNumber}
                  onChange={(e) => setBankDetails({...bankDetails, confirmAccountNumber: e.target.value})}
                  placeholder="Re-enter account number"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
                {bankDetails.confirmAccountNumber && bankDetails.accountNumber !== bankDetails.confirmAccountNumber && (
                  <div className="text-red-600 text-sm mt-1">Account numbers don't match</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">IFSC Code</label>
                <input
                  type="text"
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value.toUpperCase()})}
                  placeholder="e.g., SBIN0001234"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                  maxLength={11}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => setCurrentStep('amount')}
                variant="outline"
                className="flex-1 py-3"
              >
                Back
              </Button>
              <Button
                onClick={processWithdrawal}
                disabled={!validateBankDetails()}
                className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600"
              >
                Withdraw ₹{amount}
              </Button>
            </div>
          </div>
        )}

        {/* Processing */}
        {currentStep === 'processing' && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Withdrawal</h2>
            <p className="text-gray-600 mb-6">Please wait while we process your withdrawal request</p>
            <div className="flex justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
            </div>
          </div>
        )}

        {/* Success */}
        {currentStep === 'success' && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Withdrawal Submitted!</h2>
            <p className="text-gray-600 mb-2">Your withdrawal of ₹{amount} has been submitted</p>
            <p className="text-sm text-gray-500 mb-8">It will be processed within 24-48 hours</p>
            
            <Button
              onClick={onBack}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600"
            >
              Back to Wallet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}