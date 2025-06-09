import { Link, useLocation } from "wouter";
import { 
  Home, 
  Wallet, 
  User, 
  Gift, 
  Gamepad2,
  Crown
} from "lucide-react";

const navItems = [
  { 
    icon: Home, 
    label: "Home", 
    path: "/",
    color: "text-casino-gold"
  },
  { 
    icon: Gamepad2, 
    label: "Games", 
    path: "/category/lobby",
    color: "text-casino-blue"
  },
  { 
    icon: Crown, 
    label: "Promotion", 
    path: "/promotions",
    color: "text-casino-purple"
  },
  { 
    icon: Wallet, 
    label: "Wallet", 
    path: "/wallet",
    color: "text-casino-green"
  },
  { 
    icon: User, 
    label: "Account", 
    path: "/account",
    color: "text-casino-orange"
  }
];

export function MobileNav() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-casino-secondary border-t border-casino-border">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const IconComponent = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <div className={`nav-item ${isActive ? 'active' : ''} min-w-0 flex-1`}>
                <IconComponent className={`w-6 h-6 mx-auto ${isActive ? item.color : 'text-casino-text-muted'}`} />
                <span className={`text-xs mt-1 truncate ${isActive ? item.color : 'text-casino-text-muted'}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}