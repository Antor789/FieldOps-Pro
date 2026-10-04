import React from 'react';
import { ThemeProvider } from '../../context/ThemeContext';
import { ToastProvider } from '../../context/ToastContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { ToastContainer } from '../notifications/ToastContainer';
import { FSMLayout } from './layout/FSMLayout';

export const FSMFrontendDashboard: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <ToastProvider>
          <FSMLayout />
          <ToastContainer />
        </ToastProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};
