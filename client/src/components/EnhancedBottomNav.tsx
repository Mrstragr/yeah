import { useState, useEffect } from 'react';

interface EnhancedBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userBalance: string;
  bonusBalance: string;
}

export const EnhancedBottomNav = ({ 
  activeTab, 
  onTabChange, 
  userBalance, 
  bonusBalance 
}: EnhancedBottomNavProps) => {
  const [notifications, setNotifications] = useState(3);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const navItems = [
    {
      id: 'main',
      icon: '🏠',
      label: 'Home',
      notification: 0,
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'promotion',
      icon: '🎁',
      label: 'Promotion',
      notification: 2,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'wallet',
      icon: '💰',
      label: 'Wallet',
      notification: 0,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 'activity',
      icon: '📊',
      label: 'Activity',
      notification: 1,
      gradient: 'from-orange-500 to-red-600'
    },
    {
      id: 'account',
      icon: '👤',
      label: 'Account',
      notification: 0,
      gradient: 'from-gray-500 to-slate-600'
    }
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    
    // Add haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="enhanced-bottom-nav">
      {/* Balance Bar (appears when wallet is active) */}
      {activeTab === 'wallet' && (
        <div className="balance-bar">
          <div className="balance-container">
            <div className="balance-item main-balance">
              <div className="balance-icon">💳</div>
              <div className="balance-details">
                <span className="balance-label">Main</span>
                <span className="balance-value">
                  {isBalanceVisible ? `₹${userBalance}` : '₹****'}
                </span>
              </div>
            </div>
            
            <div className="balance-item bonus-balance">
              <div className="balance-icon">🎁</div>
              <div className="balance-details">
                <span className="balance-label">Bonus</span>
                <span className="balance-value">
                  {isBalanceVisible ? `₹${bonusBalance}` : '₹****'}
                </span>
              </div>
            </div>

            <button 
              className="visibility-toggle"
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            >
              {isBalanceVisible ? '👁️' : '🙈'}
            </button>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="nav-container">
        <div className="nav-background"></div>
        
        <div className="nav-items">
          {navItems.map((item, index) => (
            <div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleTabClick(item.id)}
              style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
            >
              <div className="nav-item-content">
                <div className="icon-container">
                  <span className="nav-icon">{item.icon}</span>
                  
                  {/* Active Indicator */}
                  {activeTab === item.id && (
                    <div className={`active-indicator bg-gradient-to-r ${item.gradient}`}></div>
                  )}
                  
                  {/* Notification Badge */}
                  {item.notification > 0 && (
                    <div className="notification-badge">
                      <span>{item.notification > 9 ? '9+' : item.notification}</span>
                      <div className="notification-ping"></div>
                    </div>
                  )}
                </div>
                
                <span className="nav-label">{item.label}</span>
                
                {/* Ripple Effect */}
                <div className="ripple-effect"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Center Action Button */}
        <div className="center-action">
          <button 
            className="center-button"
            onClick={() => handleTabClick('games')}
          >
            <div className="center-icon">🎮</div>
            <div className="center-pulse"></div>
          </button>
        </div>
      </div>

      <style>{`
        .enhanced-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        .balance-bar {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          padding: 12px 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
        }

        .balance-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 400px;
          margin: 0 auto;
        }

        .balance-item {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .balance-icon {
          font-size: 18px;
          width: 35px;
          height: 35px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .balance-details {
          display: flex;
          flex-direction: column;
        }

        .balance-label {
          font-size: 11px;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
        }

        .balance-value {
          font-size: 14px;
          color: white;
          font-weight: bold;
        }

        .visibility-toggle {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .visibility-toggle:hover {
          background: rgba(255,255,255,0.2);
          transform: scale(1.1);
        }

        .nav-container {
          position: relative;
          height: 80px;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .nav-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(15, 23, 42, 0.95) 0%, 
            rgba(30, 41, 59, 0.95) 50%, 
            rgba(15, 23, 42, 0.95) 100%);
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .nav-items {
          position: relative;
          display: flex;
          height: 100%;
          align-items: center;
          justify-content: space-around;
          padding: 0 20px;
        }

        .nav-item {
          position: relative;
          flex: 1;
          max-width: 80px;
          cursor: pointer;
          animation: navItemSlideIn 0.6s ease-out forwards;
          animation-delay: var(--delay);
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes navItemSlideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav-item-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .nav-item:hover .nav-item-content {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        .icon-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
        }

        .nav-icon {
          font-size: 18px;
          transition: all 0.3s ease;
          z-index: 2;
        }

        .nav-item.active .nav-icon {
          transform: scale(1.2);
          filter: drop-shadow(0 0 8px rgba(255,255,255,0.5));
        }

        .active-indicator {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 12px;
          opacity: 0.8;
          z-index: 1;
          animation: activeIndicatorPulse 2s ease-in-out infinite;
        }

        @keyframes activeIndicatorPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: linear-gradient(45deg, #dc2626, #ef4444);
          color: white;
          font-size: 10px;
          font-weight: bold;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(15, 23, 42, 0.95);
          z-index: 3;
        }

        .notification-ping {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: #dc2626;
          border-radius: 50%;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          z-index: -1;
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .nav-label {
          font-size: 10px;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
          text-align: center;
          transition: all 0.3s ease;
          z-index: 2;
        }

        .nav-item.active .nav-label {
          color: white;
          font-weight: 600;
        }

        .ripple-effect {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.6s ease;
          z-index: 1;
        }

        .nav-item:active .ripple-effect {
          width: 60px;
          height: 60px;
        }

        .center-action {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
        }

        .center-button {
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #10b981, #059669);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
          border: 3px solid rgba(15, 23, 42, 0.95);
          transition: all 0.3s ease;
        }

        .center-button:hover {
          transform: scale(1.1);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.6);
        }

        .center-button:active {
          transform: scale(0.95);
        }

        .center-icon {
          font-size: 24px;
          z-index: 2;
        }

        .center-pulse {
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: linear-gradient(45deg, #10b981, #059669);
          border-radius: 50%;
          animation: centerPulse 2s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes centerPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        /* Safe area padding for devices with notches */
        @supports(padding: env(safe-area-inset-bottom)) {
          .nav-container {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .nav-items {
            padding: 0 10px;
          }

          .nav-item {
            max-width: 60px;
          }

          .nav-item-content {
            padding: 6px;
          }

          .icon-container {
            width: 28px;
            height: 28px;
          }

          .nav-icon {
            font-size: 16px;
          }

          .nav-label {
            font-size: 9px;
          }

          .center-button {
            width: 55px;
            height: 55px;
          }

          .center-icon {
            font-size: 22px;
          }
        }

        /* Landscape orientation adjustments */
        @media (orientation: landscape) and (max-height: 500px) {
          .nav-container {
            height: 65px;
          }

          .center-action {
            top: -20px;
          }

          .center-button {
            width: 50px;
            height: 50px;
          }

          .center-icon {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};