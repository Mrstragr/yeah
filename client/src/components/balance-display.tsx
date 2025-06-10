import { useState, useEffect } from "react";

interface BalanceDisplayProps {
  balance: string;
  onRefresh?: () => void;
}

export function BalanceDisplay({ balance, onRefresh }: BalanceDisplayProps) {
  const [animatedBalance, setAnimatedBalance] = useState(balance);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (balance !== animatedBalance) {
      setIsUpdating(true);
      
      // Animate balance change
      const start = parseFloat(animatedBalance);
      const end = parseFloat(balance);
      const duration = 1000; // 1 second
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOut;
        
        setAnimatedBalance(current.toFixed(2));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsUpdating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [balance, animatedBalance]);

  return (
    <div className="text-right">
      <div className="text-[#D4AF37] text-xs flex items-center gap-1">
        Main Wallet
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className="text-[#D4AF37] hover:text-white text-xs"
            disabled={isUpdating}
          >
            ↻
          </button>
        )}
      </div>
      <div className={`text-white text-sm font-medium transition-all duration-300 ${
        isUpdating ? 'text-[#D4AF37] scale-110' : ''
      }`}>
        ₹{animatedBalance}
      </div>
    </div>
  );
}