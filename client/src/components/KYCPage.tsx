import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface KYCPageProps {
  onClose: () => void;
}

export const KYCPage = ({ onClose }: KYCPageProps) => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadharNumber: '',
    panNumber: '',
  });
  const [documents, setDocuments] = useState({
    aadharFront: null as File | null,
    aadharBack: null as File | null,
    panCard: null as File | null,
    bankStatement: null as File | null,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitKYCMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      Object.keys(data.personal).forEach(key => {
        formData.append(key, data.personal[key]);
      });
      Object.keys(data.documents).forEach(key => {
        if (data.documents[key]) {
          formData.append(key, data.documents[key]);
        }
      });
      return await apiRequest('POST', '/api/kyc/submit', formData);
    },
    onSuccess: () => {
      toast({
        title: 'KYC Submitted Successfully',
        description: 'Your documents are being verified. You will be notified within 24-48 hours.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/profile'] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'KYC Submission Failed',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: keyof typeof documents) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [docType]: file
      }));
    }
  };

  const handleNext = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = () => {
    submitKYCMutation.mutate({
      personal: formData,
      documents: documents
    });
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.dateOfBirth && formData.phone;
      case 2:
        return formData.address && formData.city && formData.state && formData.pincode;
      case 3:
        return formData.aadharNumber && formData.panNumber && documents.aadharFront && documents.panCard;
      default:
        return false;
    }
  };

  return (
    <div className="kyc-page">
      <div className="kyc-header">
        <button onClick={onClose} className="close-btn">×</button>
        <h2>🛡️ KYC Verification</h2>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        <div className={`step ${activeStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Personal Info</div>
        </div>
        <div className={`step ${activeStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Address</div>
        </div>
        <div className={`step ${activeStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Documents</div>
        </div>
      </div>

      <div className="kyc-content">
        {activeStep === 1 && (
          <div className="step-content">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-input"
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-input"
              />
              <input
                name="dateOfBirth"
                type="date"
                placeholder="Date of Birth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="form-input"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
              />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="step-content">
            <h3>Address Information</h3>
            <div className="form-grid">
              <input
                name="address"
                placeholder="Full Address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-input full-width"
              />
              <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                className="form-input"
              />
              <input
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                className="form-input"
              />
              <input
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="step-content">
            <h3>Identity Documents</h3>
            <div className="form-grid">
              <input
                name="aadharNumber"
                placeholder="Aadhar Number"
                value={formData.aadharNumber}
                onChange={handleInputChange}
                className="form-input"
              />
              <input
                name="panNumber"
                placeholder="PAN Number"
                value={formData.panNumber}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="document-uploads">
              <div className="upload-section">
                <label>Aadhar Card Front</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'aadharFront')}
                  className="file-input"
                />
                {documents.aadharFront && (
                  <span className="file-name">✓ {documents.aadharFront.name}</span>
                )}
              </div>

              <div className="upload-section">
                <label>Aadhar Card Back</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'aadharBack')}
                  className="file-input"
                />
                {documents.aadharBack && (
                  <span className="file-name">✓ {documents.aadharBack.name}</span>
                )}
              </div>

              <div className="upload-section">
                <label>PAN Card</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'panCard')}
                  className="file-input"
                />
                {documents.panCard && (
                  <span className="file-name">✓ {documents.panCard.name}</span>
                )}
              </div>

              <div className="upload-section">
                <label>Bank Statement (Optional)</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, 'bankStatement')}
                  className="file-input"
                />
                {documents.bankStatement && (
                  <span className="file-name">✓ {documents.bankStatement.name}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        {activeStep > 1 && (
          <button onClick={handleBack} className="back-btn">
            ← Back
          </button>
        )}
        
        <div className="right-buttons">
          {activeStep < 3 ? (
            <button 
              onClick={handleNext} 
              disabled={!isStepValid()}
              className="next-btn"
            >
              Next →
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={!isStepValid() || submitKYCMutation.isPending}
              className="submit-btn"
            >
              {submitKYCMutation.isPending ? 'Submitting...' : 'Submit KYC'}
            </button>
          )}
        </div>
      </div>

      <style>{`
        .kyc-page {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: white;
          padding: 20px;
        }

        .kyc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .kyc-header h2 {
          font-size: 28px;
          font-weight: bold;
          margin: 0;
        }

        .close-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          font-size: 24px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
        }

        .progress-steps {
          display: flex;
          justify-content: center;
          margin-bottom: 40px;
          position: relative;
        }

        .progress-steps::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 25%;
          right: 25%;
          height: 2px;
          background: rgba(255,255,255,0.3);
          z-index: 1;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }

        .step.active .step-number {
          background: rgba(255,255,255,0.9);
          color: #667eea;
        }

        .step-label {
          font-size: 12px;
          opacity: 0.8;
        }

        .kyc-content {
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 30px;
          backdrop-filter: blur(10px);
        }

        .step-content h3 {
          margin-bottom: 25px;
          font-size: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
        }

        .form-input {
          padding: 15px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 16px;
        }

        .form-input.full-width {
          grid-column: 1 / -1;
        }

        .form-input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .document-uploads {
          margin-top: 25px;
        }

        .upload-section {
          margin-bottom: 20px;
        }

        .upload-section label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .file-input {
          width: 100%;
          padding: 10px;
          border: 2px dashed rgba(255,255,255,0.3);
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          color: white;
          cursor: pointer;
        }

        .file-name {
          display: block;
          margin-top: 5px;
          font-size: 14px;
          color: #4CAF50;
        }

        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .back-btn, .next-btn, .submit-btn {
          padding: 15px 30px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn {
          background: rgba(255,255,255,0.2);
          color: white;
        }

        .next-btn, .submit-btn {
          background: linear-gradient(45deg, #4CAF50, #45a049);
          color: white;
        }

        .next-btn:disabled, .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .right-buttons {
          margin-left: auto;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .progress-steps {
            margin-bottom: 20px;
          }
          
          .step-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};