import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, CheckCircle, AlertTriangle, Clock } from "lucide-react";

interface KYCVerificationProps {
  userId: number;
  currentStatus?: 'pending' | 'verified' | 'rejected' | 'not_started';
}

export default function KYCVerification({ userId, currentStatus = 'not_started' }: KYCVerificationProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    address: "",
    pincode: "",
    aadharNumber: "",
    panNumber: "",
    documentType: "",
    bankAccountNumber: "",
    ifscCode: ""
  });
  const [files, setFiles] = useState<{ [key: string]: File }>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (documentType: string, file: File) => {
    setFiles(prev => ({ ...prev, [documentType]: file }));
  };

  const submitKYC = async () => {
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Add files
      Object.entries(files).forEach(([key, file]) => {
        formDataToSend.append(key, file);
      });
      
      const response = await fetch('/api/kyc/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formDataToSend
      });
      
      if (response.ok) {
        alert('KYC documents submitted successfully! Verification usually takes 24-48 hours.');
      } else {
        alert('Failed to submit KYC documents. Please try again.');
      }
    } catch (error) {
      console.error('KYC submission error:', error);
      alert('Error submitting KYC documents.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (currentStatus) {
      case 'verified':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white"><AlertTriangle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  if (currentStatus === 'verified') {
    return (
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="text-gaming-gold flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              KYC Verification
            </div>
            {getStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-green-400 mb-2">Verification Complete</h3>
            <p className="text-casino-text-secondary">
              Your identity has been verified. You can now enjoy full access to all features.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="game-card">
      <CardHeader>
        <CardTitle className="text-gaming-gold flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            KYC Verification
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentStatus === 'pending' && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-400 font-semibold mb-2">Documents Under Review</p>
            <p className="text-sm text-casino-text-secondary">
              Your KYC documents are being reviewed. This usually takes 24-48 hours.
              We'll notify you once the verification is complete.
            </p>
          </div>
        )}

        {currentStatus === 'rejected' && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 font-semibold mb-2">Verification Rejected</p>
            <p className="text-sm text-casino-text-secondary">
              Please resubmit your documents with correct information.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name (as per Aadhar)</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aadharNumber">Aadhar Number</Label>
            <Input
              id="aadharNumber"
              value={formData.aadharNumber}
              onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
              placeholder="XXXX XXXX XXXX"
              maxLength={12}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="panNumber">PAN Number</Label>
            <Input
              id="panNumber"
              value={formData.panNumber}
              onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
              maxLength={10}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Complete address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              placeholder="XXXXXX"
              maxLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentType">Document Type</Label>
            <Select onValueChange={(value) => handleInputChange('documentType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aadhar">Aadhar Card</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="driving_license">Driving License</SelectItem>
                <SelectItem value="voter_id">Voter ID</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankAccount">Bank Account Number</Label>
            <Input
              id="bankAccount"
              value={formData.bankAccountNumber}
              onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
              placeholder="Account number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input
              id="ifscCode"
              value={formData.ifscCode}
              onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
              placeholder="ABCD0123456"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Upload Documents</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frontDoc">Document Front Side</Label>
              <Input
                id="frontDoc"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('front', e.target.files[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backDoc">Document Back Side</Label>
              <Input
                id="backDoc"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('back', e.target.files[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="panCard">PAN Card</Label>
              <Input
                id="panCard"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('pan', e.target.files[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankProof">Bank Proof</Label>
              <Input
                id="bankProof"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('bank', e.target.files[0])}
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h4 className="font-semibold text-blue-400 mb-2">Important Information</h4>
          <ul className="text-sm text-casino-text-secondary space-y-1">
            <li>• All documents must be clear and readable</li>
            <li>• File size should not exceed 5MB per document</li>
            <li>• Supported formats: JPG, PNG, PDF</li>
            <li>• Verification usually takes 24-48 hours</li>
            <li>• Ensure all information matches your bank account</li>
          </ul>
        </div>

        <Button
          onClick={submitKYC}
          disabled={loading || currentStatus === 'pending'}
          className="w-full bg-gaming-gold text-black hover:bg-gaming-gold/90"
        >
          {loading ? (
            "Submitting..."
          ) : currentStatus === 'pending' ? (
            "Documents Under Review"
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Submit KYC Documents
            </>
          )}
        </Button>

        <div className="text-xs text-casino-text-muted text-center">
          By submitting, you agree that the information provided is accurate and true.
          False information may result in account suspension.
        </div>
      </CardContent>
    </Card>
  );
}