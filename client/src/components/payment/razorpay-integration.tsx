import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Shield, Zap } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayIntegrationProps {
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: any) => void;
}

export default function RazorpayIntegration({ onPaymentSuccess, onPaymentError }: RazorpayIntegrationProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) < 10) {
      alert("Minimum deposit amount is ₹10");
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Payment gateway failed to load. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // Create order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100, // Convert to paise
          currency: "INR"
        })
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || "Failed to create order");
      }

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TashanWin",
        description: "Wallet Deposit",
        image: "/logo.png",
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              onPaymentSuccess(verifyData);
            } else {
              onPaymentError(verifyData);
            }
          } catch (error) {
            onPaymentError(error);
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        notes: {
          address: "TashanWin Gaming Platform"
        },
        theme: {
          color: "#F39C12"
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Payment error:", error);
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  return (
    <Card className="game-card">
      <CardHeader>
        <CardTitle className="text-gaming-gold flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Add Money to Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Enter Amount (₹)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Minimum ₹10"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="10"
            max="100000"
          />
        </div>

        <div className="space-y-2">
          <Label>Quick Select</Label>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((amt) => (
              <Button
                key={amt}
                variant="outline"
                size="sm"
                onClick={() => setAmount(amt.toString())}
                className="text-gaming-gold border-gaming-gold hover:bg-gaming-gold hover:text-black"
              >
                ₹{amt}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-green-400">Secure Payment</span>
          </div>
          <ul className="text-sm text-casino-text-secondary space-y-1">
            <li>• 256-bit SSL encryption</li>
            <li>• PCI DSS compliant</li>
            <li>• Instant wallet credit</li>
            <li>• No hidden charges</li>
          </ul>
        </div>

        <Button
          onClick={handlePayment}
          disabled={loading || !amount || parseFloat(amount) < 10}
          className="w-full bg-gaming-gold text-black hover:bg-gaming-gold/90"
        >
          {loading ? (
            "Processing..."
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Pay ₹{amount || "0"} via Razorpay
            </>
          )}
        </Button>

        <div className="text-xs text-casino-text-muted text-center">
          By proceeding, you agree to our Terms & Conditions and Privacy Policy.
          Only for users 18+ years. Gambling can be addictive. Play responsibly.
        </div>
      </CardContent>
    </Card>
  );
}