import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from './lib/utils';

export type NotificationType = 'info' | 'success' | 'warning' | 'price-drop';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((n: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newNotification = { ...n, id };
    setNotifications(prev => [...prev, newNotification]);

    if (n.duration !== null) {
      setTimeout(() => {
        removeNotification(id);
      }, n.duration || 5000);
    }
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      
      {/* Notification Toast Area */}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4 max-w-sm w-full">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className={cn(
                "p-4 rounded-3xl backdrop-blur-xl border shadow-2xl flex gap-4 overflow-hidden group relative",
                n.type === 'success' ? "bg-white/90 border-green-100" :
                n.type === 'warning' ? "bg-white/90 border-amber-100" :
                n.type === 'price-drop' ? "bg-brand-background/90 border-brand-accent/20" :
                "bg-white/90 border-neutral-100"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                n.type === 'success' ? "bg-green-50 text-green-600" :
                n.type === 'warning' ? "bg-amber-50 text-amber-600" :
                n.type === 'price-drop' ? "bg-brand-accent/10 text-brand-accent" :
                "bg-neutral-50 text-neutral-600"
              )}>
                {n.type === 'success' && <CheckCircle className="w-6 h-6" />}
                {n.type === 'warning' && <AlertTriangle className="w-6 h-6" />}
                {n.type === 'price-drop' && <Bell className="w-6 h-6 animate-bounce" />}
                {n.type === 'info' && <Info className="w-6 h-6" />}
              </div>
              
              <div className="flex-1 pt-1">
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900 mb-1">{n.title}</h4>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">{n.message}</p>
              </div>

              <button 
                onClick={() => removeNotification(n.id)}
                className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-50 rounded-full"
              >
                <X className="w-4 h-4 text-neutral-400" />
              </button>

              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-brand-accent/20"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: (n.duration || 5000) / 1000, ease: "linear" }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
