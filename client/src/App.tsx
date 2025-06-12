import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileNav } from "@/components/mobile-nav";
import TashanWinMain from "@/pages/tashanwin-main";
import CategoryPage from "@/pages/category";
import WalletPage from "@/pages/wallet";
import WalletDeposit from "@/pages/wallet-deposit";
import WalletWithdraw from "@/pages/wallet-withdraw";
import AccountPage from "@/pages/account";
import AnalyticsPage from "@/pages/analytics";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import NotFound from "@/pages/not-found";
import { useQuery } from "@tanstack/react-query";

function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return null;
      
      try {
        const response = await fetch('/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('authToken');
            return null;
          }
          throw new Error('Failed to fetch user');
        }
        
        return response.json();
      } catch (error) {
        localStorage.removeItem('token');
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#ffd700] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/register" component={Register} />
        <Route component={Login} />
      </Switch>
    );
  }

  return (
    <div className="pb-20">
      <Switch>
        <Route path="/" component={TashanWinMain} />
        <Route path="/category/:slug" component={CategoryPage} />
        <Route path="/wallet" component={WalletPage} />
        <Route path="/wallet/deposit" component={WalletDeposit} />
        <Route path="/wallet/withdraw" component={WalletWithdraw} />
        <Route path="/promotion" component={() => (
          <div className="min-h-screen bg-[#1a1a1a] p-4">
            <div className="max-w-md mx-auto pt-8">
              <div className="bg-[#2a2a2a] border border-[#444] rounded-lg p-8 text-center">
                <h1 className="text-2xl font-bold text-[#ffd700] mb-4">Promotion</h1>
                <p className="text-gray-400">Exciting promotions coming soon!</p>
              </div>
            </div>
          </div>
        )} />
        <Route path="/activity" component={() => (
          <div className="min-h-screen bg-[#1a1a1a] p-4">
            <div className="max-w-md mx-auto pt-8">
              <div className="bg-[#2a2a2a] border border-[#444] rounded-lg p-8 text-center">
                <h1 className="text-2xl font-bold text-[#ffd700] mb-4">Activity</h1>
                <p className="text-gray-400">Activities coming soon!</p>
              </div>
            </div>
          </div>
        )} />
        <Route path="/account" component={AccountPage} />
        <Route path="/analytics" component={AnalyticsPage} />
        <Route component={NotFound} />
      </Switch>
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-casino-primary">
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
