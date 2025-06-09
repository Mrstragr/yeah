import { useLocation } from "wouter";

export function MobileNav() {
  const [location, navigate] = useLocation();

  const navItems = [
    { icon: "fas fa-home", label: "Home", path: "/" },
    { icon: "fas fa-gift", label: "Promotion", path: "/promotions" },
    { icon: "fas fa-calendar-alt", label: "Activity", path: "/activity" },
    { icon: "fas fa-wallet", label: "Wallet", path: "/wallet" },
    { icon: "fas fa-user", label: "Account", path: "/account" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gaming-charcoal border-t border-gray-800 z-40">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center p-2 transition-colors duration-200 ${
              location === item.path
                ? "text-gaming-gold"
                : "text-gray-400 hover:text-gaming-gold"
            }`}
          >
            <i className={`${item.icon} text-xl mb-1`}></i>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
