import React, { useEffect, useState } from 'react';
import { AlertTriangle, Shield, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Restricted states as per legal review
const RESTRICTED_STATES = [
  'Tamil Nadu',
  'Andhra Pradesh', 
  'Odisha',
  'Assam'
];

const GRAY_ZONE_STATES = [
  'Delhi',
  'Maharashtra', 
  'Gujarat',
  'Uttar Pradesh'
];

interface StateRestrictionCheckerProps {
  onStateVerified: (isAllowed: boolean, state: string) => void;
}

export function StateRestrictionChecker({ onStateVerified }: StateRestrictionCheckerProps) {
  const [userState, setUserState] = useState<string>('');
  const [showRestrictionDialog, setShowRestrictionDialog] = useState(false);
  const [showGrayZoneWarning, setShowGrayZoneWarning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Get user's state through geolocation or IP
    checkUserState();
  }, []);

  const checkUserState = async () => {
    try {
      // In production, this would use IP geolocation service
      // For now, we'll ask user to declare their state
      setIsVerifying(false);
      // Simulate state detection
      const detectedState = await detectUserState();
      handleStateDetection(detectedState);
    } catch (error) {
      setIsVerifying(false);
      // Fallback to manual state selection
    }
  };

  const detectUserState = async (): Promise<string> => {
    // This would integrate with IP geolocation service in production
    // For demo, return empty string to trigger manual selection
    return '';
  };

  const handleStateDetection = (state: string) => {
    setUserState(state);
    
    if (RESTRICTED_STATES.includes(state)) {
      setShowRestrictionDialog(true);
      onStateVerified(false, state);
    } else if (GRAY_ZONE_STATES.includes(state)) {
      setShowGrayZoneWarning(true);
      onStateVerified(true, state);
    } else {
      onStateVerified(true, state);
    }
  };

  const handleManualStateSelection = (selectedState: string) => {
    handleStateDetection(selectedState);
  };

  if (isVerifying) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg text-center">
          <Shield className="h-8 w-8 mx-auto mb-4 text-blue-600" />
          <h3 className="text-lg font-semibold mb-2">Verifying Location</h3>
          <p className="text-gray-600">Checking state compliance requirements...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Restricted State Dialog */}
      <Dialog open={showRestrictionDialog} onOpenChange={setShowRestrictionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <X className="h-5 w-5" />
              Access Restricted
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Service Not Available</AlertTitle>
              <AlertDescription className="text-red-700">
                Real money gaming is not permitted in {userState} as per state regulations.
              </AlertDescription>
            </Alert>
            
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Legal Notice:</strong> This platform operates skill-based prediction contests
                which are currently not available in your state due to local gaming regulations.
              </p>
              <p>
                We comply with all state laws and cannot provide services in restricted jurisdictions.
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = 'https://www.rummy.com'}
                className="flex-1"
              >
                Try Legal Games
              </Button>
              <Button 
                variant="destructive"
                onClick={() => window.close()}
                className="flex-1"
              >
                Exit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gray Zone Warning */}
      <Dialog open={showGrayZoneWarning} onOpenChange={setShowGrayZoneWarning}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              Important Legal Notice
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Proceed with Caution</AlertTitle>
              <AlertDescription className="text-yellow-700">
                Gaming laws in {userState} are under review. Please ensure compliance with local regulations.
              </AlertDescription>
            </Alert>
            
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Player Responsibility:</strong> You confirm that participating in skill-based 
                prediction contests is legal in your jurisdiction and you assume full responsibility 
                for compliance with local laws.
              </p>
              <p>
                <strong>Age Verification:</strong> You must be 18 years or older to participate.
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" required />
                I confirm I am 18+ years old and legally allowed to participate
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" required />
                I understand this involves financial risk and will play responsibly
              </label>
            </div>

            <Button 
              onClick={() => setShowGrayZoneWarning(false)}
              className="w-full"
            >
              I Understand - Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* State Selection Fallback */}
      {!userState && !isVerifying && (
        <Dialog open={true}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Select Your State</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Please select your state to verify compliance with local gaming laws:
              </p>
              
              <select 
                className="w-full p-2 border rounded-lg"
                onChange={(e) => handleManualStateSelection(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Select your state</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Delhi">Delhi</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}