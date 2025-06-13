import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mail, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
}

export function EmailVerification({ email, onVerified }: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");

  const sendVerificationEmail = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/send-verification", { email }),
    onSuccess: () => {
      setError("");
    },
    onError: (error: any) => {
      setError(error.message || "Failed to send verification email");
    },
  });

  const verifyEmail = useMutation({
    mutationFn: (code: string) => apiRequest("POST", "/api/auth/verify-email", { email, code }),
    onSuccess: () => {
      onVerified();
    },
    onError: (error: any) => {
      setError(error.message || "Invalid verification code");
    },
  });

  const handleVerify = () => {
    if (!verificationCode.trim()) {
      setError("Please enter verification code");
      return;
    }
    verifyEmail.mutate(verificationCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/80 border-gray-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">Verify Your Email</CardTitle>
          <p className="text-gray-400 mt-2">We've sent a verification code to</p>
          <p className="text-blue-400 font-medium">{email}</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-900/50 border border-red-600 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Enter 6-digit verification code
              </label>
              <Input
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setVerificationCode(value);
                  setError("");
                }}
                className="bg-gray-700 border-gray-600 text-white text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>

            <Button
              onClick={handleVerify}
              disabled={verifyEmail.isPending || verificationCode.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {verifyEmail.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Verify Email
                </div>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={() => sendVerificationEmail.mutate()}
              disabled={sendVerificationEmail.isPending}
              className="w-full text-blue-400 hover:text-blue-300"
            >
              {sendVerificationEmail.isPending ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </div>
              ) : (
                "Resend Code"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}