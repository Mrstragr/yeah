import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DreamClubLayout } from "@/components/dreamclub-layout";
import { DreamClubHome } from "@/components/dreamclub-home";
import { DreamClubActivity } from "@/components/dreamclub-activity";
import { DreamClubPromotion } from "@/components/dreamclub-promotion";
import { DreamClubWallet } from "@/components/dreamclub-wallet";
import { DreamClubAccount } from "@/components/dreamclub-account";

interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  bonusBalance: string;
}

export default function DreamClubApp() {
  const [activeTab, setActiveTab] = useState("home");

  // Check authentication
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/login";
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Loading DreamClub...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <DreamClubHome />;
      case "activity":
        return <DreamClubActivity />;
      case "promotion":
        return <DreamClubPromotion />;
      case "wallet":
        return <DreamClubWallet />;
      case "account":
        return <DreamClubAccount />;
      default:
        return <DreamClubHome />;
    }
  };

  return (
    <DreamClubLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DreamClubLayout>
  );
}