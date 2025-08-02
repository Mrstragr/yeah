import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function LegalComplianceDashboard() {
  const [complianceScore, setComplianceScore] = useState(87);
  
  const complianceItems = [
    { name: 'Terminology Compliance', status: 'completed', description: 'Updated to skill-based language' },
    { name: 'State Restrictions', status: 'in-progress', description: 'Implementing geo-blocking' },
    { name: 'KYC Enhancement', status: 'completed', description: 'Aadhaar/PAN verification ready' },
    { name: 'Responsible Gaming', status: 'in-progress', description: 'Adding advanced controls' },
    { name: 'Legal Documentation', status: 'pending', description: 'Terms & conditions update' },
    { name: 'License Application', status: 'pending', description: 'Nagaland license submission' },
  ];

  const legalRequirements = [
    { category: 'Gaming License', requirement: 'Nagaland License', status: 'pending', deadline: '2025-09-15' },
    { category: 'State Compliance', requirement: 'Geo-blocking', status: 'in-progress', deadline: '2025-08-10' },
    { category: 'Documentation', requirement: 'Updated T&C', status: 'pending', deadline: '2025-08-15' },
    { category: 'Financial', requirement: 'Bank Guarantee', status: 'pending', deadline: '2025-09-01' },
  ];

  const recentActions = [
    { action: 'Updated database schema terminology', timestamp: '2 hours ago', type: 'compliance' },
    { action: 'Created state restriction checker', timestamp: '1 hour ago', type: 'feature' },
    { action: 'Implemented responsible gaming tools', timestamp: '45 minutes ago', type: 'feature' },
    { action: 'Generated legal action plan', timestamp: '30 minutes ago', type: 'documentation' },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Legal Compliance Dashboard</h1>
          <p className="text-gray-600">Monitor and manage regulatory compliance for TashanWin platform</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{complianceScore}%</div>
            <div className="text-sm text-gray-500">Compliance Score</div>
          </div>
          <Badge variant={complianceScore >= 80 ? 'default' : 'destructive'}>
            {complianceScore >= 80 ? 'Good Standing' : 'Needs Attention'}
          </Badge>
        </div>
      </div>

      {/* Critical Alerts */}
      <Alert className="border-amber-500 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Action Required:</strong> Legal review from Kochhar & Co. requires immediate terminology changes and license application.
          Target completion: 4 weeks.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Compliance Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Items</CardTitle>
                <Shield className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {complianceItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <Badge variant={
                        item.status === 'completed' ? 'default' : 
                        item.status === 'in-progress' ? 'secondary' : 'outline'
                      }>
                        {item.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {item.status === 'in-progress' && <Clock className="h-3 w-3 mr-1" />}
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* License Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">License Progress</CardTitle>
                <FileText className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">Nagaland</div>
                  <div className="text-sm text-gray-600">Recommended jurisdiction</div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Timeline: 30-45 days</div>
                    <div className="text-xs text-gray-500">Cost: ₹5-10 lakhs</div>
                    <div className="text-xs text-gray-500">Guarantee: ₹25 lakhs</div>
                  </div>
                  <Button size="sm" className="w-full mt-2">Begin Application</Button>
                </div>
              </CardContent>
            </Card>

            {/* Financial Impact */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Costs</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>License Fee:</span>
                    <span>₹5-10L</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Bank Guarantee:</span>
                    <span>₹25L</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Legal Consultation:</span>
                    <span>₹75K + GST</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Total Initial:</span>
                    <span>₹30-35L</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Compliance Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between border-l-4 border-blue-500 pl-4">
                    <div>
                      <div className="font-medium">{action.action}</div>
                      <div className="text-sm text-gray-500">{action.timestamp}</div>
                    </div>
                    <Badge variant="outline">{action.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requirements Tab */}
        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Legal Requirements Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {legalRequirements.map((req, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{req.requirement}</div>
                      <Badge variant={
                        req.status === 'completed' ? 'default' : 
                        req.status === 'in-progress' ? 'secondary' : 'outline'
                      }>
                        {req.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{req.category}</div>
                    <div className="text-sm">
                      <span className="text-gray-500">Deadline: </span>
                      <span className={new Date(req.deadline) < new Date() ? 'text-red-600' : 'text-gray-700'}>
                        {req.deadline}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="documentation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Required Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Terms of Service</span>
                    <Badge variant="outline">Needs Update</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Privacy Policy</span>
                    <Badge variant="default">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Responsible Gaming Policy</span>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Legal Disclaimers</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Legal Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-semibold">Anirudh Sharma</div>
                    <div className="text-sm text-gray-600">Partner, Gaming & Technology Practice</div>
                    <div className="text-sm text-gray-600">Kochhar & Co.</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm">📧 anirudh.sharma@kochhar.com</div>
                    <div className="text-sm">📞 +91-11-4866-0000</div>
                  </div>
                  <Button variant="outline" className="w-full">Contact Legal Team</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    Platform terminology successfully updated to comply with skill-based gaming requirements.
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-blue-500 bg-blue-50">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    State restriction system is being implemented. Expected completion: 3 days.
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-amber-500 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    License application preparation required. Contact legal team to proceed.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}