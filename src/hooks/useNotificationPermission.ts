import { useState, useEffect, useCallback } from 'react';
import { pushNotificationService } from '../services/pushNotifications';

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    pushNotificationService.getPermission()
  );
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  useEffect(() => {
    setPermission(pushNotificationService.getPermission());
  }, []);

  const requestPermission = useCallback(async () => {
    const res = await pushNotificationService.requestPermission();
    setPermission(res);
    return res;
  }, []);

  return {
    permission,
    requestPermission,
    isGranted: permission === 'granted',
    isDenied: permission === 'denied',
    isPromptOpen,
    setIsPromptOpen,
  };
}
