import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Toast } from './Toast';
import { AnimatePresence } from 'motion/react';

export function ToastContainer() {
  const { toasts, removeToast } = useNotifications();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
