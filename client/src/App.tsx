import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileNav } from "@/components/mobile-nav";
import TashanWinHome from "@/pages/tashanwin-home";
import CategoryPage from "@/pages/category";
import WalletPage from "@/pages/wallet";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="pb-20">
      <Switch>
        <Route path="/" component={TashanWinHome} />
        <Route path="/category/:slug" component={CategoryPage} />
        <Route path="/wallet" component={WalletPage} />
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
        <Route path="/account" component={() => (
          <div className="min-h-screen bg-[#1a1a1a] p-4">
            <div className="max-w-md mx-auto pt-8">
              <div className="bg-[#2a2a2a] border border-[#444] rounded-lg p-8 text-center">
                <h1 className="text-2xl font-bold text-[#ffd700] mb-4">Account</h1>
                <p className="text-gray-400">Account settings coming soon!</p>
              </div>
            </div>
          </div>
        )} />
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
