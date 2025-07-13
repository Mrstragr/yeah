import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle, Clock, AlertCircle, Shield } from 'lucide-react';

interface KYCVerificationProps {
  onClose: () => void;
  onVerificationComplete: (status: string) => void;
}

interface VerificationStatus {
  personal: string;
  document: string;
  aadhar: string;
  pan: string;
  bank: string;
}

export default function KYCVerification({ onClose, onVerificationComplete }: KYCVerificationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [personalDetails, setPersonalDetails] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [documentUpload, setDocumentUpload] = useState({
    aadharNumber: '',
    panNumber: '',
    panName: '',
    panDob: '',
    bankAccount: '',
    confirmBankAccount: '',
    ifscCode: '',
    accountHolderName: '',
    accountType: ''
  });

  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    personal: 'pending',
    document: 'pending',
    aadhar: 'pending',
    pan: 'pending',
    bank: 'pending'
  });

  const steps = [
    { id: 1, title: 'Personal Details', icon: '👤' },
    { id: 2, title: 'Aadhar Verification', icon: '🆔' },
    { id: 3, title: 'PAN Verification', icon: '📄' },
    { id: 4, title: 'Bank Details', icon: '🏦' },
    { id: 5, title: 'Final Review', icon: '✅' }
  ];

  const handlePersonalDetailsSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/kyc/personal-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(personalDetails)
      });

      if (response.ok) {
        setVerificationStatus(prev => ({ ...prev, personal: 'completed' }));
        setCurrentStep(2);
      } else {
        setVerificationStatus(prev => ({ ...prev, personal: 'failed' }));
      }
    } catch (error) {
      console.error('Personal details submission error:', error);
      setVerificationStatus(prev => ({ ...prev, personal: 'failed' }));
    } finally {
      setLoading(false);
    }
  };

  const handleAadharVerification = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/kyc/aadhar-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          aadharNumber: documentUpload.aadharNumber
        })
      });

      if (response.ok) {
        setVerificationStatus(prev => ({ ...prev, aadhar: 'completed' }));
        setCurrentStep(3);
      } else {
        setVerificationStatus(prev => ({ ...prev, aadhar: 'failed' }));
      }
    } catch (error) {
      console.error('Aadhar verification error:', error);
      setVerificationStatus(prev => ({ ...prev, aadhar: 'failed' }));
    } finally {
      setLoading(false);
    }
  };

  const handlePANVerification = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/kyc/pan-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          panNumber: documentUpload.panNumber,
          panName: documentUpload.panName,
          panDob: documentUpload.panDob
        })
      });

      if (response.ok) {
        setVerificationStatus(prev => ({ ...prev, pan: 'completed' }));
        setCurrentStep(4);
      } else {
        setVerificationStatus(prev => ({ ...prev, pan: 'failed' }));
      }
    } catch (error) {
      console.error('PAN verification error:', error);
      setVerificationStatus(prev => ({ ...prev, pan: 'failed' }));
    } finally {
      setLoading(false);
    }
  };

  const handleBankVerification = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/kyc/bank-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bankAccount: documentUpload.bankAccount,
          ifscCode: documentUpload.ifscCode,
          accountHolderName: documentUpload.accountHolderName,
          accountType: documentUpload.accountType
        })
      });

      if (response.ok) {
        setVerificationStatus(prev => ({ ...prev, bank: 'completed' }));
        setCurrentStep(5);
      } else {
        setVerificationStatus(prev => ({ ...prev, bank: 'failed' }));
      }
    } catch (error) {
      console.error('Bank verification error:', error);
      setVerificationStatus(prev => ({ ...prev, bank: 'failed' }));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={onClose} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold">KYC Verification</h2>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= step.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step.icon}
              </div>
              <div className="text-xs mt-2 text-center max-w-20">
                {step.title}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mt-5 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="personal"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name *"
                  value={personalDetails.firstName}
                  onChange={(e) => setPersonalDetails({...personalDetails, firstName: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  value={personalDetails.lastName}
                  onChange={(e) => setPersonalDetails({...personalDetails, lastName: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="date"
                  placeholder="Date of Birth *"
                  value={personalDetails.dateOfBirth}
                  onChange={(e) => setPersonalDetails({...personalDetails, dateOfBirth: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3"
                />
                <select
                  value={personalDetails.gender}
                  onChange={(e) => setPersonalDetails({...personalDetails, gender: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3"
                >
                  <option value="">Select Gender *</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  placeholder="Address *"
                  value={personalDetails.address}
                  onChange={(e) => setPersonalDetails({...personalDetails, address: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 col-span-2"
                  rows={3}
                />
                <input
                  type="text"
                  placeholder="City *"
                  value={personalDetails.city}
                  onChange={(e) => setPersonalDetails({...personalDetails, city: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="text"
                  placeholder="State *"
                  value={personalDetails.state}
                  onChange={(e) => setPersonalDetails({...personalDetails, state: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="text"
                  placeholder="PIN Code *"
                  value={personalDetails.pincode}
                  onChange={(e) => setPersonalDetails({...personalDetails, pincode: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 col-span-2"
                />
              </div>
              <button
                onClick={handlePersonalDetailsSubmit}
                disabled={loading}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Continue'}
              </button>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="aadhar"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4">Aadhar Verification</h3>
              <input
                type="text"
                placeholder="Aadhar Number (12 digits) *"
                value={documentUpload.aadharNumber}
                onChange={(e) => setDocumentUpload({...documentUpload, aadharNumber: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-3 mb-4"
                maxLength={12}
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handleAadharVerification}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify Aadhar'}
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="pan"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4">PAN Verification</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="PAN Number *"
                  value={documentUpload.panNumber}
                  onChange={(e) => setDocumentUpload({...documentUpload, panNumber: e.target.value.toUpperCase()})}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  maxLength={10}
                />
                <input
                  type="text"
                  placeholder="Name as per PAN *"
                  value={documentUpload.panName}
                  onChange={(e) => setDocumentUpload({...documentUpload, panName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="date"
                  placeholder="Date of Birth *"
                  value={documentUpload.panDob}
                  onChange={(e) => setDocumentUpload({...documentUpload, panDob: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handlePANVerification}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify PAN'}
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="bank"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4">Bank Account Details</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Bank Account Number *"
                  value={documentUpload.bankAccount}
                  onChange={(e) => setDocumentUpload({...documentUpload, bankAccount: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="text"
                  placeholder="Confirm Account Number *"
                  value={documentUpload.confirmBankAccount}
                  onChange={(e) => setDocumentUpload({...documentUpload, confirmBankAccount: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="text"
                  placeholder="IFSC Code *"
                  value={documentUpload.ifscCode}
                  onChange={(e) => setDocumentUpload({...documentUpload, ifscCode: e.target.value.toUpperCase()})}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="text"
                  placeholder="Account Holder Name *"
                  value={documentUpload.accountHolderName}
                  onChange={(e) => setDocumentUpload({...documentUpload, accountHolderName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
                <select
                  value={documentUpload.accountType}
                  onChange={(e) => setDocumentUpload({...documentUpload, accountType: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3"
                >
                  <option value="">Account Type *</option>
                  <option value="savings">Savings</option>
                  <option value="current">Current</option>
                </select>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handleBankVerification}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify Bank'}
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="review"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4">Verification Complete!</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span>Personal Details</span>
                  {getStatusIcon(verificationStatus.personal)}
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span>Aadhar Verification</span>
                  {getStatusIcon(verificationStatus.aadhar)}
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span>PAN Verification</span>
                  {getStatusIcon(verificationStatus.pan)}
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span>Bank Verification</span>
                  {getStatusIcon(verificationStatus.bank)}
                </div>
              </div>
              <div className="text-center mt-6">
                <div className="text-green-600 text-6xl mb-4">✅</div>
                <h4 className="text-2xl font-bold text-green-600 mb-2">KYC Verification Complete!</h4>
                <p className="text-gray-600 mb-6">Your account is now fully verified. You can now make deposits and withdrawals.</p>
                <button
                  onClick={() => {
                    onVerificationComplete('verified');
                    onClose();
                  }}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700"
                >
                  Continue to Gaming
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}