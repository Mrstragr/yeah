import React from 'react';
import { AlertTriangle, Shield, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

interface LegalDisclaimersProps {
  userState?: string;
  className?: string;
}

export function LegalDisclaimers({ userState, className = "" }: LegalDisclaimersProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Primary Legal Disclaimer */}
      <Alert className="border-amber-500 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm">
          <strong>Legal Notice:</strong> This platform offers skill-based prediction contests involving financial risk. 
          Play responsibly and within your means.
        </AlertDescription>
      </Alert>

      {/* Age Restriction */}
      <Alert className="border-red-500 bg-red-50">
        <Shield className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 text-sm">
          <strong>Age Restriction:</strong> Must be 18+ years old to participate in skill challenges.
        </AlertDescription>
      </Alert>

      {/* State Compliance */}
      {userState && (
        <Alert className="border-blue-500 bg-blue-50">
          <AlertDescription className="text-blue-800 text-sm">
            <strong>State Compliance:</strong> Available in {userState}. Platform operates only in states where 
            skill-based gaming is legally permitted.
          </AlertDescription>
        </Alert>
      )}

      {/* Responsible Gaming */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-3">
          <div className="flex items-start gap-2 text-sm text-green-800">
            <Clock className="h-4 w-4 mt-0.5 text-green-600" />
            <div>
              <strong>Responsible Gaming:</strong> Set limits, take breaks, and seek help if gaming becomes problematic. 
              Visit our Responsible Gaming section for tools and resources.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* License Information */}
      <div className="text-xs text-gray-600 text-center p-2 bg-gray-100 rounded">
        License Application in Progress (Nagaland Gaming Commission) | 
        Legal Compliance: Kochhar & Co. | 
        Operated as Skill-Based Gaming Platform
      </div>
    </div>
  );
}