import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginPage } from '../../pages/auth/Login';
import { ForgotPasswordPage } from '../../pages/auth/ForgotPassword';
import { ResetPasswordPage } from '../../pages/auth/ResetPassword';
import { TwoFactorAuthPage } from '../../pages/auth/TwoFactorAuth';
import { RegisterPage } from '../../pages/auth/Register';
import { RegisterNoticePage } from '../../pages/auth/RegisterNotice';
import { FSMLayout } from './layout/FSMLayout';

export const AuthGate: React.FC = () => {
  const { isAuthenticated, authMode, setAuthMode, user } = useAuth();
  const [resetIdentifier, setResetIdentifier] = useState('01712345678');
  const [locale, setLocale] = useState<'en' | 'bn'>('en');

  // If not authenticated, render split-screen auth flows
  if (!isAuthenticated) {
    if (authMode === 'forgot_password') {
      return (
        <ForgotPasswordPage
          onBackToLogin={() => setAuthMode('login')}
          onNavigateResetPassword={(id) => {
            setResetIdentifier(id);
            setAuthMode('reset_password');
          }}
          locale={locale}
          onLocaleChange={setLocale}
        />
      );
    }

    if (authMode === 'reset_password') {
      return (
        <ResetPasswordPage
          identifier={resetIdentifier}
          onBackToLogin={() => setAuthMode('login')}
          locale={locale}
          onLocaleChange={setLocale}
        />
      );
    }

    if (authMode === 'two_factor') {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <TwoFactorAuthPage
            onSuccess={() => {}}
            onCancel={() => setAuthMode('login')}
            locale={locale}
          />
        </div>
      );
    }

    if (authMode === 'register') {
      return (
        <RegisterPage
          onBackToLogin={() => setAuthMode('login')}
          onSuccess={() => {}}
          locale={locale}
          onLocaleChange={setLocale}
        />
      );
    }

    if (authMode === 'register_admin_notice') {
      return (
        <RegisterNoticePage
          onBackToLogin={() => setAuthMode('login')}
          locale={locale}
          onLocaleChange={setLocale}
        />
      );
    }

    // Default: Login Page (Email/password + Phone OTP tabs)
    return (
      <LoginPage
        onSuccess={() => {}}
        onNavigateForgotPassword={() => setAuthMode('forgot_password')}
        onNavigateRegister={() => setAuthMode('register')}
        locale={locale}
        onLocaleChange={setLocale}
      />
    );
  }

  // When authenticated, render full FSM suite
  return <FSMLayout />;
};
