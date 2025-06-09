import { useState } from "react";
import { WalletDashboard } from "@/components/wallet/wallet-dashboard";
import { KycVerification } from "@/components/wallet/kyc-verification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Shield } from "lucide-react";

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("wallet");

  return (
    <div className="min-h-screen bg-gaming-dark text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-gaming font-bold text-gaming-gold mb-2">
            Wallet & Banking
          </h1>
          <p className="text-gray-400 font-exo">
            Manage your funds securely with real Indian currency transactions
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="wallet" className="font-gaming">
              <Wallet className="w-4 h-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="kyc" className="font-gaming">
              <Shield className="w-4 h-4 mr-2" />
              KYC Verification
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet">
            <WalletDashboard />
          </TabsContent>

          <TabsContent value="kyc">
            <KycVerification />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}