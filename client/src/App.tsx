import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileNav } from "@/components/mobile-nav";
import Home from "@/pages/home";
import CategoryPage from "@/pages/category";
import WalletPage from "@/pages/wallet";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="pb-20">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/category/:slug" component={CategoryPage} />
        <Route path="/wallet" component={WalletPage} />
        <Route path="/promotions" component={() => (
          <div className="min-h-screen bg-casino-primary p-4">
            <div className="max-w-md mx-auto pt-8">
              <div className="casino-card p-8 text-center">
                <h1 className="text-2xl font-casino font-bold text-casino-gold mb-4">Promotions</h1>
                <p className="text-casino-text-muted">Exciting promotions coming soon!</p>
              </div>
            </div>
          </div>
        )} />
        <Route path="/account" component={() => (
          <div className="min-h-screen bg-casino-primary p-4">
            <div className="max-w-md mx-auto pt-8">
              <div className="casino-card p-8 text-center">
                <h1 className="text-2xl font-casino font-bold text-casino-gold mb-4">Account</h1>
                <p className="text-casino-text-muted">Account settings coming soon!</p>
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
