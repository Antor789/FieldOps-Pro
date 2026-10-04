import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';

export function useNotificationListener(enableSimulation = true) {
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!enableSimulation) return;

    // Simulate occasional incoming real-time Bangladesh FSM events
    const timeout = setTimeout(() => {
      addNotification({
        type: 'sla_warning',
        priority: 'high',
        title: 'SLA Alert: WO-9004 Approaching Limit',
        titleBn: 'এসএলএ সময়সীমা সতর্কতা: WO-9004',
        message: 'Banani Road 11 Fiber Line repair has 15 minutes left.',
        messageBn: 'বনানী রোড ১১ ফাইবার লাইনের এসএলএ আর মাত্র ১৫ মিনিট বাকি।',
        workOrderId: 'WO-9004',
        soundType: 'warning',
      });
    }, 45000);

    return () => clearTimeout(timeout);
  }, [enableSimulation, addNotification]);
}
