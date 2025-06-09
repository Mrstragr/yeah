import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function KycVerification() {
  const [formData, setFormData] = useState({
    panNumber: "",
    aadharNumber: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    bankAccountHolderName: "",
    documentType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit KYC");

      toast({
        title: "KYC Submitted",
        description: "Your documents are under review. You'll be notified within 24-48 hours.",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="game-card max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-gaming text-gaming-gold">Complete KYC Verification</CardTitle>
        <p className="text-gray-400 font-exo">Required for withdrawals and compliance with Indian gaming regulations</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pan" className="font-gaming text-gray-300">PAN Number *</Label>
              <Input
                id="pan"
                placeholder="ABCDE1234F"
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                className="bg-gaming-accent border-gaming-border-light text-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="aadhar" className="font-gaming text-gray-300">Aadhar Number *</Label>
              <Input
                id="aadhar"
                placeholder="1234 5678 9012"
                value={formData.aadharNumber}
                onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                className="bg-gaming-accent border-gaming-border-light text-white"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="accountHolder" className="font-gaming text-gray-300">Bank Account Holder Name *</Label>
            <Input
              id="accountHolder"
              placeholder="As per bank records"
              value={formData.bankAccountHolderName}
              onChange={(e) => setFormData({ ...formData, bankAccountHolderName: e.target.value })}
              className="bg-gaming-accent border-gaming-border-light text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="account" className="font-gaming text-gray-300">Bank Account Number *</Label>
              <Input
                id="account"
                placeholder="1234567890123456"
                value={formData.bankAccountNumber}
                onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                className="bg-gaming-accent border-gaming-border-light text-white"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="ifsc" className="font-gaming text-gray-300">IFSC Code *</Label>
              <Input
                id="ifsc"
                placeholder="SBIN0001234"
                value={formData.bankIfscCode}
                onChange={(e) => setFormData({ ...formData, bankIfscCode: e.target.value.toUpperCase() })}
                className="bg-gaming-accent border-gaming-border-light text-white"
                required
              />
            </div>
          </div>

          <div>
            <Label className="font-gaming text-gray-300">Document Type *</Label>
            <Select value={formData.documentType} onValueChange={(value) => setFormData({ ...formData, documentType: value })}>
              <SelectTrigger className="bg-gaming-accent border-gaming-border-light text-white">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pan_card">PAN Card</SelectItem>
                <SelectItem value="aadhar_card">Aadhar Card</SelectItem>
                <SelectItem value="bank_statement">Bank Statement</SelectItem>
                <SelectItem value="driving_license">Driving License</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-gaming-accent/30 p-4 rounded-lg">
            <h4 className="font-gaming font-semibold text-gaming-gold mb-2">Important Notes:</h4>
            <ul className="text-sm text-gray-400 space-y-1 font-exo">
              <li>• All information must match your official documents</li>
              <li>• KYC is mandatory as per Indian gaming regulations</li>
              <li>• Verification typically takes 24-48 hours</li>
              <li>• Bank account will be used for withdrawals</li>
              <li>• Your data is encrypted and secure</li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="btn-gaming-primary w-full font-gaming"
          >
            {isSubmitting ? (
              <i className="fas fa-spinner fa-spin mr-2"></i>
            ) : (
              <i className="fas fa-shield-alt mr-2"></i>
            )}
            Submit for Verification
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}