import React from 'react';
import { ThemeProvider } from '../../context/ThemeContext';
import { ToastProvider } from '../../context/ToastContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { AuthProvider } from '../../contexts/AuthContext';
import { SocketProvider } from '../../context/SocketContext';
import { ToastContainer } from '../notifications/ToastContainer';
import { AuthGate } from './AuthGate';

export const FSMFrontendDashboard: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <NotificationProvider>
          <AuthProvider>
            <SocketProvider>
              <AuthGate />
              <ToastContainer />
            </SocketProvider>
          </AuthProvider>
        </NotificationProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};
