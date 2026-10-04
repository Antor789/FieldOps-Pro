/**
 * FieldOps Pro - Browser Push Notifications Service
 * Handles notification permissions, Service Worker registration, and OS native notification alerts.
 */

export class PushNotificationService {
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  }

  showBrowserNotification(
    title: string,
    options?: {
      body?: string;
      icon?: string;
      tag?: string;
      data?: any;
    }
  ) {
    if (!this.isSupported() || this.getPermission() !== 'granted') return;

    try {
      const notification = new Notification(title, {
        body: options?.body || '',
        icon: options?.icon || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=128&auto=format&fit=crop&q=80',
        tag: options?.tag || 'fieldops-alert',
        data: options?.data,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch {
      // Fallback
    }
  }
}

export const pushNotificationService = new PushNotificationService();
