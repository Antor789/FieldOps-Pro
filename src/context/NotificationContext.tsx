import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  NotificationItemData,
  NotificationPreferences,
  defaultNotificationPreferences,
  notificationTypeConfigs,
  NotificationType,
  NotificationPriority,
} from '../types/notifications';
import { soundService } from '../services/soundService';
import { pushNotificationService } from '../services/pushNotifications';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: NotificationItemData[];
  unreadCount: number;
  addNotification: (item: Omit<NotificationItemData, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  
  // Toast notifications
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;

  // Preferences
  preferences: NotificationPreferences;
  updatePreferences: (updater: (prev: NotificationPreferences) => NotificationPreferences) => void;

  // Permission
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  playSound: (type?: 'default' | 'urgent' | 'success' | 'warning') => void;
}

const INITIAL_NOTIFICATIONS: NotificationItemData[] = [
  {
    id: 'notif-1',
    type: 'sla_warning',
    priority: 'high',
    title: 'SLA Breach Warning (WO-9003)',
    titleBn: 'এসএলএ সময়সীমা সতর্কতা (WO-9003)',
    message: 'Gulshan 2 Substation Transformer repair has 15 minutes remaining before deadline.',
    messageBn: 'গুলশান ২ সাবস্টেশন ট্রান্সফরমার মেরামতের আর মাত্র ১৫ মিনিট বাকি।',
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    isRead: false,
    workOrderId: 'WO-9003',
    actionLabel: 'Dispatch Priority',
    actionLabelBn: 'অগ্রাধিকার নির্ধারণ',
    soundType: 'warning',
  },
  {
    id: 'notif-2',
    type: 'payment_received',
    priority: 'normal',
    title: 'bKash MFS Payment Received',
    titleBn: 'বিকাশ পেমেন্ট গ্রহণ সম্পন্ন',
    message: '৳14,500 collected from Grameenphone NOC for WO-9001 (TRX: 8NX891298)',
    messageBn: 'গ্রামীণফোন থেকে WO-9001 এর জন্য ৳১৪,৫০০ বিকাশ পেমেন্ট জমা হয়েছে',
    timestamp: new Date(Date.now() - 28 * 60 * 1000),
    isRead: false,
    workOrderId: 'WO-9001',
    amountBDT: 14500,
    actionLabel: 'View NBR Invoice',
    actionLabelBn: 'চালান দেখুন',
    soundType: 'success',
  },
  {
    id: 'notif-3',
    type: 'job_assigned',
    priority: 'high',
    title: 'AI Auto-Dispatched Unit #104',
    titleBn: 'AI স্বয়ংক্রিয় টেকনিশিয়ান বরাদ্দ',
    message: 'Rahim Ahmed assigned to Banani Road 11 Fiber Outage based on proximity score (94/100).',
    messageBn: 'রহিম আহমেদকে বনানী রোড ১১ ফাইবার কাটে নিকটতম দূরত্ব অনুযায়ী বরাদ্দ করা হয়েছে।',
    timestamp: new Date(Date.now() - 65 * 60 * 1000),
    isRead: true,
    workOrderId: 'WO-9002',
    technicianId: 'tech-1',
    soundType: 'default',
  },
  {
    id: 'notif-4',
    type: 'tech_arrived',
    priority: 'normal',
    title: 'Geofence Entry: Arrived at Site',
    titleBn: 'জিউফেন্সে প্রবেশ: সাইটে উপস্থিত',
    message: 'Tanvir Hossain entered geofence boundary at Uttara Sector 4 Site.',
    messageBn: 'তানভীর হোসেন উত্তরা সেক্টর ৪ সাইটের জিউফেন্সে প্রবেশ করেছেন।',
    timestamp: new Date(Date.now() - 120 * 60 * 1000),
    isRead: true,
    soundType: 'default',
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItemData[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fieldops_notifications');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) }));
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fieldops_notif_prefs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return defaultNotificationPreferences;
  });

  const [permission, setPermission] = useState<NotificationPermission>(() =>
    pushNotificationService.getPermission()
  );

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('fieldops_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('fieldops_notif_prefs', JSON.stringify(preferences));
    soundService.setEnabled(preferences.sound.enabled);
    soundService.setVolume(preferences.sound.volume);
  }, [preferences]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastItem = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);

      const duration = toast.duration ?? 4500;
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const addNotification = useCallback(
    (item: Omit<NotificationItemData, 'id' | 'timestamp' | 'isRead'>) => {
      const config = notificationTypeConfigs[item.type];
      const newNotif: NotificationItemData = {
        ...item,
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date(),
        isRead: false,
      };

      setNotifications((prev) => [newNotif, ...prev]);

      // Play sound
      if (preferences.sound.enabled) {
        soundService.play(item.soundType || config.sound);
      }

      // Show in-app Toast
      if (preferences.channels.inApp) {
        const toastTypeMap: Record<NotificationPriority, ToastItem['type']> = {
          critical: 'error',
          high: 'warning',
          normal: 'success',
          low: 'info',
        };
        addToast({
          type: toastTypeMap[item.priority] || 'info',
          title: item.title,
          message: item.message,
          duration: config.dismissAfterMs || 5000,
        });
      }

      // Show native OS push notification
      if (preferences.channels.push && permission === 'granted') {
        pushNotificationService.showBrowserNotification(item.title, {
          body: item.message,
          tag: item.type,
        });
      }
    },
    [preferences, permission, addToast]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const requestPermission = useCallback(async () => {
    const res = await pushNotificationService.requestPermission();
    setPermission(res);
    return res;
  }, []);

  const updatePreferences = useCallback(
    (updater: (prev: NotificationPreferences) => NotificationPreferences) => {
      setPreferences(updater);
    },
    []
  );

  const playSound = useCallback(
    (type: 'default' | 'urgent' | 'success' | 'warning' = 'default') => {
      soundService.play(type);
    },
    []
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        toasts,
        addToast,
        removeToast,
        preferences,
        updatePreferences,
        permission,
        requestPermission,
        playSound,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
