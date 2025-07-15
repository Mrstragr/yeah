import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, Check, AlertCircle, Camera, FileText, CreditCard, User, Phone, MapPin } from 'lucide-react';

interface VerificationProcessProps {
  onClose: () => void;
  onComplete: (status: 'verified' | 'pending' | 'rejected') => void;
}

export function VerificationProcess({ onClose, onComplete }: VerificationProcessProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [personalData, setPersonalData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    pincode: '',
    city: '',
    state: ''
  });
  const [documents, setDocuments] = useState({
    aadhaar: null as File | null,
    pan: null as File | null,
    bankStatement: null as File | null,
    selfie: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, title: 'Personal Details', icon: User },
    { number: 2, title: 'Document Upload', icon: FileText },
    { number: 3, title: 'Verification', icon: Check }
  ];

  const handleFileUpload = (type: keyof typeof documents, file: File) => {
    setDocuments(prev => ({ ...prev, [type]: file }));
  };

  const handlePersonalDataSubmit = () => {
    const required = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'address', 'pincode', 'city', 'state'];
    const missing = required.filter(field => !personalData[field as keyof typeof personalData]);
    
    if (missing.length > 0) {
      alert('Please fill all required fields');
      return;
    }
    
    setCurrentStep(2);
  };

  const handleDocumentSubmit = () => {
    if (!documents.aadhaar || !documents.pan) {
      alert('Please upload Aadhaar and PAN documents');
      return;
    }
    
    setCurrentStep(3);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete('pending'); // In real app, this would be determined by backend
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 text-white">
          <div className="flex items-center justify-between">
            <button onClick={onClose}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">KYC Verification</h1>
            <div className="w-6"></div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500' : isActive ? 'bg-white text-red-600' : 'bg-red-400'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-2 text-xs">
                    <div className="font-medium">{step.title}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-px mx-2 ${isCompleted ? 'bg-green-500' : 'bg-red-400'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                  <p className="text-gray-600 text-sm mt-2">
                    Please provide your personal details as per your government ID
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={personalData.firstName}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={personalData.lastName}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={personalData.dateOfBirth}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={personalData.gender}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    value={personalData.address}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter complete address"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={personalData.pincode}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter pincode"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={personalData.city}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={personalData.state}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter state"
                  />
                </div>

                <button
                  onClick={handlePersonalDataSubmit}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  Continue to Documents
                </button>
              </motion.div>
            )}

            {/* Step 2: Document Upload */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Upload Documents</h2>
                  <p className="text-gray-600 text-sm mt-2">
                    Please upload clear photos of your documents
                  </p>
                </div>

                {/* Aadhaar Card */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <CreditCard className="w-5 h-5 text-red-600 mr-2" />
                    <span className="font-medium">Aadhaar Card *</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('aadhaar', e.target.files[0])}
                    className="hidden"
                    id="aadhaar-upload"
                  />
                  <label
                    htmlFor="aadhaar-upload"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  >
                    {documents.aadhaar ? (
                      <div className="flex items-center text-green-600">
                        <Check className="w-5 h-5 mr-2" />
                        {documents.aadhaar.name}
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-600">
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Aadhaar Card
                      </div>
                    )}
                  </label>
                </div>

                {/* PAN Card */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <FileText className="w-5 h-5 text-red-600 mr-2" />
                    <span className="font-medium">PAN Card *</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('pan', e.target.files[0])}
                    className="hidden"
                    id="pan-upload"
                  />
                  <label
                    htmlFor="pan-upload"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  >
                    {documents.pan ? (
                      <div className="flex items-center text-green-600">
                        <Check className="w-5 h-5 mr-2" />
                        {documents.pan.name}
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-600">
                        <Upload className="w-5 h-5 mr-2" />
                        Upload PAN Card
                      </div>
                    )}
                  </label>
                </div>

                {/* Bank Statement */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <FileText className="w-5 h-5 text-red-600 mr-2" />
                    <span className="font-medium">Bank Statement (Optional)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('bankStatement', e.target.files[0])}
                    className="hidden"
                    id="bank-upload"
                  />
                  <label
                    htmlFor="bank-upload"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  >
                    {documents.bankStatement ? (
                      <div className="flex items-center text-green-600">
                        <Check className="w-5 h-5 mr-2" />
                        {documents.bankStatement.name}
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-600">
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Bank Statement
                      </div>
                    )}
                  </label>
                </div>

                {/* Selfie */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Camera className="w-5 h-5 text-red-600 mr-2" />
                    <span className="font-medium">Selfie with ID (Optional)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('selfie', e.target.files[0])}
                    className="hidden"
                    id="selfie-upload"
                  />
                  <label
                    htmlFor="selfie-upload"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  >
                    {documents.selfie ? (
                      <div className="flex items-center text-green-600">
                        <Check className="w-5 h-5 mr-2" />
                        {documents.selfie.name}
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-600">
                        <Camera className="w-5 h-5 mr-2" />
                        Take/Upload Selfie
                      </div>
                    )}
                  </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <strong>Important:</strong> Make sure all documents are clear and readable. 
                      Verification usually takes 24-48 hours.
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleDocumentSubmit}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Verification */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-green-600" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Ready for Verification</h2>
                  <p className="text-gray-600">
                    Your information and documents are ready to be submitted for verification.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-sm text-yellow-800">
                    <strong>What happens next?</strong>
                    <ul className="mt-2 text-left space-y-1">
                      <li>• Your documents will be reviewed by our team</li>
                      <li>• Verification usually takes 24-48 hours</li>
                      <li>• You'll receive an SMS/email with the status</li>
                      <li>• Once verified, you can withdraw your winnings</li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit for Verification'
                  )}
                </button>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                >
                  Back to Documents
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}