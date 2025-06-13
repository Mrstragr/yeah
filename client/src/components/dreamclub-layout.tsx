import { useState } from "react";
import { Home, Activity, Gift, Wallet, User } from "lucide-react";

interface DreamClubLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DreamClubLayout({ children, activeTab, onTabChange }: DreamClubLayoutProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "promotion", label: "Promotion", icon: Gift },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "account", label: "Account", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Main Content */}
      <div className="pb-20">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center py-2 px-3 transition-all ${
                  isActive 
                    ? "text-pink-400" 
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Icon 
                  size={20} 
                  className={isActive ? "text-pink-400" : ""}
                />
                <span className="text-xs mt-1 font-medium">
                  {tab.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 bg-pink-400 rounded-full mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}