import { WalletDashboard } from "@/components/wallet/wallet-dashboard";

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-gaming-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-gaming font-bold text-3xl text-gaming-gold mb-2">
            Wallet
          </h1>
          <p className="text-gray-300 font-exo">
            Manage your funds, deposits, and withdrawals securely
          </p>
        </div>
        
        <WalletDashboard />
      </div>
    </div>
  );
}