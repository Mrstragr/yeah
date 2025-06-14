import { useState } from 'react';
import { X, CreditCard, Banknote, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface WalletModalProps {
  type: 'deposit' | 'withdraw';
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onTransaction: (amount: number, type: 'deposit' | 'withdraw') => void;
}

export function WalletModal({ type, isOpen, onClose, currentBalance, onTransaction }: WalletModalProps) {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const quickAmounts = type === 'deposit' 
    ? [100, 500, 1000, 2000, 5000, 10000]
    : [50, 100, 500, 1000, Math.floor(currentBalance)];

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '📱' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
    { id: 'wallet', name: 'E-Wallet', icon: '💰' }
  ];

  const handleTransaction = async () => {
    const transactionAmount = parseFloat(amount);
    
    if (!transactionAmount || transactionAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (type === 'withdraw' && transactionAmount > currentBalance) {
      alert('Insufficient balance');
      return;
    }

    if (type === 'deposit' && transactionAmount < 10) {
      alert('Minimum deposit amount is ₹10');
      return;
    }

    if (type === 'withdraw' && transactionAmount < 50) {
      alert('Minimum withdrawal amount is ₹50');
      return;
    }

    setIsProcessing(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      onTransaction(transactionAmount, type);
      setIsProcessing(false);
      setAmount('');
      onClose();
      alert(`${type === 'deposit' ? 'Deposit' : 'Withdrawal'} of ₹${transactionAmount} successful!`);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`p-4 rounded-t-2xl text-white ${
          type === 'deposit' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
            : 'bg-gradient-to-r from-orange-500 to-red-500'
        }`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {type === 'deposit' ? <ArrowDownCircle className="w-6 h-6" /> : <ArrowUpCircle className="w-6 h-6" />}
              <h2 className="text-xl font-bold">
                {type === 'deposit' ? 'Deposit Money' : 'Withdraw Money'}
              </h2>
            </div>
            <button onClick={onClose} className="p-1">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-2 text-sm opacity-90">
            Current Balance: ₹{currentBalance.toFixed(2)}
          </div>
        </div>

        <div className="p-4">
          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Select
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  ₹{quickAmount}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === 'deposit' ? 'Payment Method' : 'Withdrawal Method'}
            </label>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    selectedMethod === method.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{method.icon}</span>
                  <span className="font-medium">{method.name}</span>
                  <div className={`ml-auto w-4 h-4 rounded-full border-2 ${
                    selectedMethod === method.id
                      ? 'border-red-500 bg-red-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedMethod === method.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Limits */}
          <div className="mb-6 p-3 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-1">Transaction Limits</h4>
            <div className="text-sm text-blue-700">
              {type === 'deposit' ? (
                <>
                  <div>Minimum: ₹10</div>
                  <div>Maximum: ₹1,00,000 per day</div>
                </>
              ) : (
                <>
                  <div>Minimum: ₹50</div>
                  <div>Maximum: ₹50,000 per day</div>
                  <div>Processing time: 24-48 hours</div>
                </>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleTransaction}
            disabled={isProcessing || !amount || parseFloat(amount) <= 0}
            className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all ${
              isProcessing || !amount || parseFloat(amount) <= 0
                ? 'bg-gray-400 cursor-not-allowed'
                : type === 'deposit'
                  ? 'bg-green-500 hover:bg-green-600 active:scale-95'
                  : 'bg-orange-500 hover:bg-orange-600 active:scale-95'
            }`}
          >
            {isProcessing 
              ? 'Processing...' 
              : `${type === 'deposit' ? 'Deposit' : 'Withdraw'} ₹${amount || '0'}`
            }
          </button>

          {/* Security Notice */}
          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <div className="text-xs text-gray-600 text-center">
              🔒 All transactions are secured with 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}