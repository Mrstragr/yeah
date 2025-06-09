import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function Header() {
  const [location] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/users/1"],
    enabled: isLoggedIn,
  });

  return (
    <header className="bg-gaming-charcoal border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center">
              <i className="fas fa-gamepad text-gaming-gold text-2xl mr-3"></i>
              <h1 className="font-orbitron font-bold text-xl text-gaming-gold animate-glow">
                GameHub Pro
              </h1>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              href="/" 
              className={`text-gray-300 hover:text-gaming-gold transition-colors duration-200 ${
                location === "/" ? "text-gaming-gold" : ""
              }`}
            >
              Home
            </Link>
            <Link 
              href="/category/popular" 
              className={`text-gray-300 hover:text-gaming-gold transition-colors duration-200 ${
                location.startsWith("/category") ? "text-gaming-gold" : ""
              }`}
            >
              Games
            </Link>
            <Link 
              href="/wallet" 
              className={`text-gray-300 hover:text-gaming-gold transition-colors duration-200 ${
                location === "/wallet" ? "text-gaming-gold" : ""
              }`}
            >
              Wallet
            </Link>
            <a href="#promotions" className="text-gray-300 hover:text-gaming-gold transition-colors duration-200">
              Promotions
            </a>
            <a href="#tournaments" className="text-gray-300 hover:text-gaming-gold transition-colors duration-200">
              Tournaments
            </a>
          </nav>
          
          <div className="flex items-center space-x-3">
            {user && (
              <div className="hidden sm:flex items-center bg-gray-800 rounded-lg px-3 py-2">
                <i className="fas fa-wallet text-gaming-gold mr-2"></i>
                <span className="text-gaming-gold font-semibold">
                  ${parseFloat(user.balance).toLocaleString()}
                </span>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsLoggedIn(!isLoggedIn)}
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              {isLoggedIn ? "Logout" : "Login"}
            </Button>
            <Button 
              className="bg-gaming-gold hover:bg-gaming-amber text-black font-semibold"
              size="sm"
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
