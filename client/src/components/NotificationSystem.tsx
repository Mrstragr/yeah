import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, TrendingUp, Gift } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'achievement';
  title: string;
  message: string;
  duration?: number;
  icon?: React.ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    primary?: boolean;
  }>;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export const NotificationSystem = ({ notifications, onDismiss }: NotificationSystemProps) => {
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          onDismiss(notification.id);
        }, notification.duration);
        
        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onDismiss]);

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-emerald-600 border-green-500';
      case 'error':
        return 'bg-gradient-to-r from-red-600 to-pink-600 border-red-500';
      case 'achievement':
        return 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-500';
      default:
        return 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500';
    }
  };

  const getIcon = (notification: Notification) => {
    if (notification.icon) return notification.icon;
    
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={24} />;
      case 'error':
        return <AlertCircle size={24} />;
      case 'achievement':
        return <Gift size={24} />;
      default:
        return <TrendingUp size={24} />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border shadow-lg text-white transform transition-all duration-300 animate-slide-in ${getNotificationStyles(notification.type)}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white">{notification.title}</h4>
              <p className="text-sm text-white/90 mt-1">{notification.message}</p>
              
              {notification.actions && notification.actions.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {notification.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                        action.primary
                          ? 'bg-white text-gray-900 hover:bg-gray-100'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => onDismiss(notification.id)}
              className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ))}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
        `
      }} />
    </div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (title: string, message: string, actions?: Notification['actions']) => {
    return addNotification({ type: 'success', title, message, duration: 5000, actions });
  };

  const showError = (title: string, message: string, actions?: Notification['actions']) => {
    return addNotification({ type: 'error', title, message, duration: 7000, actions });
  };

  const showAchievement = (title: string, message: string, actions?: Notification['actions']) => {
    return addNotification({ type: 'achievement', title, message, duration: 8000, actions });
  };

  const showInfo = (title: string, message: string, actions?: Notification['actions']) => {
    return addNotification({ type: 'info', title, message, duration: 5000, actions });
  };

  return {
    notifications,
    addNotification,
    dismissNotification,
    showSuccess,
    showError,
    showAchievement,
    showInfo
  };
};