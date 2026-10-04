import { useNotifications } from '../context/NotificationContext';

export function useToast() {
  const { addToast, removeToast } = useNotifications();

  const success = (title: string, message?: string, duration = 4500) => {
    addToast({ type: 'success', title, message, duration });
  };

  const error = (title: string, message?: string, duration = 6000) => {
    addToast({ type: 'error', title, message, duration });
  };

  const warning = (title: string, message?: string, duration = 5000) => {
    addToast({ type: 'warning', title, message, duration });
  };

  const info = (title: string, message?: string, duration = 4000) => {
    addToast({ type: 'info', title, message, duration });
  };

  return { addToast, removeToast, success, error, warning, info };
}
