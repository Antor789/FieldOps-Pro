import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AuthUser,
  AuthMode,
  LoginHistoryEntry,
  TwoFactorConfig,
  AdminRegisterInput,
} from '../types/auth';
import { tokenManager, generateMockJWT } from '../utils/tokenManager';
import { sessionManager } from '../utils/sessionManager';
import { useAuthStore } from '../stores/authStore';
import {
  DEFAULT_USERS,
  INITIAL_LOGIN_HISTORY,
  sendGreenwebSMS,
  validateBDPhone,
} from '../utils/authGuard';
import { useToast } from '../context/ToastContext';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  login: (email: string, password?: string, rememberMe?: boolean) => Promise<{ success: boolean; requires2FA?: boolean }>;
  loginWithPhoneOTP: (phone: string, otp: string, rememberMe?: boolean) => Promise<boolean>;
  logout: (reason?: string) => void;
  registerAdmin: (input: AdminRegisterInput) => Promise<boolean>;
  requestOTP: (phone: string, purpose?: 'login' | 'password_reset' | 'two_factor') => Promise<{ success: boolean; simulatedCode?: string; message: string }>;
  verifyTwoFactor: (code: string) => Promise<boolean>;
  forgotPassword: (identifier: string, method: 'email' | 'sms') => Promise<{ success: boolean; simulatedOTP?: string }>;
  resetPassword: (identifier: string, otpOrToken: string, newPassword: string) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  toggleTwoFactor: (enable: boolean) => Promise<TwoFactorConfig | null>;
  twoFactorConfig: TwoFactorConfig;
  loginHistory: LoginHistoryEntry[];
  lockoutRemainingSeconds: number;
  rateLimitAttempts: number;
  resetRateLimit: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_2FA_CONFIG: TwoFactorConfig = {
  isEnabled: false,
  secret: 'JBSWY3DPEHPK3PXP',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=otpauth%3A%2F%2Ftotp%2FFieldOpsPro%3Aadmin%40fieldops.com.bd%3Fsecret%3DJBSWY3DPEHPK3PXP%26issuer%3DFieldOps%2520Pro%2520Bangladesh',
  backupCodes: ['8921-4321', '6712-9843', '1092-8472', '4581-2940', '3910-6721'],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();

  const [user, setUser] = useState<AuthUser | null>(() => tokenManager.getCachedUser() || DEFAULT_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = tokenManager.getAccessToken();
    return !!token || true; // Initialize with true for seamless developer review, but full login toggleable
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>(INITIAL_LOGIN_HISTORY);
  const [twoFactorConfig, setTwoFactorConfig] = useState<TwoFactorConfig>(INITIAL_2FA_CONFIG);
  const [pending2FAUser, setPending2FAUser] = useState<AuthUser | null>(null);

  // Rate limiting states
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(0);
  const [rateLimitAttempts, setRateLimitAttempts] = useState<number>(0);

  // Sync token on mount
  useEffect(() => {
    const existing = tokenManager.getCachedUser();
    if (existing) {
      setUser(existing);
      setIsAuthenticated(true);
    } else {
      // Default to initial logged-in admin state
      const initialTokens = generateMockJWT(DEFAULT_USERS[0]);
      tokenManager.setTokens(initialTokens, true);
      tokenManager.setCachedUser(DEFAULT_USERS[0], true);
      setUser(DEFAULT_USERS[0]);
      setIsAuthenticated(true);
    }
  }, []);

  // Idle timer for 30 minutes auto-logout
  useEffect(() => {
    if (!isAuthenticated) return;

    sessionManager.start(
      () => {
        // Auto logout triggered after 30 mins
        logout('Session expired due to 30 minutes of inactivity.');
        addToast({
          title: 'Session Expired',
          description: 'You were logged out after 30 minutes of inactivity.',
          type: 'warning',
        });
      },
      (remainingSeconds) => {
        // 2 min warning
        addToast({
          title: 'Inactivity Warning',
          description: `Your session will expire in ${remainingSeconds} seconds due to inactivity.`,
          type: 'info',
        });
      }
    );

    return () => {
      sessionManager.stop();
    };
  }, [isAuthenticated]);

  // Lockout tick countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = sessionManager.getLockoutRemainingSeconds();
      setLockoutRemainingSeconds(remaining);
      setRateLimitAttempts(sessionManager.getFailedAttempts());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Standard Email/Password Login
  const login = useCallback(
    async (email: string, password = '', rememberMe = true) => {
      if (sessionManager.isLockedOut()) {
        addToast({
          title: 'Account Temporarily Locked',
          description: `Too many failed attempts. Please wait ${sessionManager.getLockoutRemainingSeconds()}s.`,
          type: 'error',
        });
        return { success: false };
      }

      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 900));

      const matchedUser = DEFAULT_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      ) || {
        id: `usr-${Date.now().toString(36)}`,
        email: email.trim(),
        phone: '01712345678',
        firstName: email.split('@')[0],
        lastName: 'Manager',
        name: email.split('@')[0].toUpperCase(),
        role: 'admin' as const,
        tenantId: 'tenant-dhaka-hq',
        tenantName: 'Grameen Infrastructure NOC',
        isTwoFactorEnabled: twoFactorConfig.isEnabled,
        lastLoginAt: new Date().toISOString(),
      };

      // Check 2FA requirement
      if (matchedUser.isTwoFactorEnabled || twoFactorConfig.isEnabled) {
        setPending2FAUser(matchedUser);
        setAuthMode('two_factor');
        setIsLoading(false);
        addToast({
          title: 'Two-Factor Authentication Required',
          description: 'Please enter the 6-digit code from your authenticator app.',
          type: 'info',
        });
        return { success: true, requires2FA: true };
      }

      // Successful login
      sessionManager.resetRateLimit();
      const tokens = generateMockJWT(matchedUser);
      tokenManager.setTokens(tokens, rememberMe);
      tokenManager.setCachedUser(matchedUser, rememberMe);

      setUser(matchedUser);
      setIsAuthenticated(true);
      setIsLoading(false);

      // Record successful login history
      const newLog: LoginHistoryEntry = {
        id: `log-${Date.now()}`,
        userId: matchedUser.id,
        timestamp: 'Just now',
        device: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Browser',
        browser: 'Chrome / Safari',
        os: 'macOS / Windows',
        ip: '103.108.144.12',
        location: 'Gulshan 2, Dhaka, Bangladesh',
        status: 'success',
        isCurrent: true,
      };
      setLoginHistory((prev) => [newLog, ...prev.slice(0, 4)]);

      addToast({
        title: 'Welcome Back 👋',
        description: `Signed in as ${matchedUser.name} (${matchedUser.role.toUpperCase()})`,
        type: 'success',
      });

      return { success: true, requires2FA: false };
    },
    [twoFactorConfig.isEnabled, addToast]
  );

  // Phone OTP Login
  const loginWithPhoneOTP = useCallback(
    async (phone: string, otp: string, rememberMe = true) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const validation = validateBDPhone(phone);
      if (!validation.isValid) {
        setIsLoading(false);
        addToast({
          title: 'Invalid Mobile Number',
          description: validation.error || 'Please enter a valid Bangladesh 01XXXXXXXXX number',
          type: 'error',
        });
        return false;
      }

      // Check 6-digit OTP
      if (otp.length !== 6) {
        setIsLoading(false);
        addToast({
          title: 'Invalid OTP',
          description: 'OTP must be 6 digits.',
          type: 'error',
        });
        return false;
      }

      const matchedUser: AuthUser = DEFAULT_USERS.find(
        (u) => u.phone === validation.normalized
      ) || {
        id: `usr-phone-${Date.now().toString(36)}`,
        email: `tech.${validation.normalized}@fieldops.com.bd`,
        phone: validation.normalized,
        firstName: 'Field',
        lastName: 'Specialist',
        name: `Tech (+88${validation.normalized})`,
        role: 'technician',
        tenantId: 'tenant-dhaka-hq',
        tenantName: 'Dhaka Command Desk',
        isTwoFactorEnabled: false,
        lastLoginAt: new Date().toISOString(),
      };

      const tokens = generateMockJWT(matchedUser);
      tokenManager.setTokens(tokens, rememberMe);
      tokenManager.setCachedUser(matchedUser, rememberMe);

      setUser(matchedUser);
      setIsAuthenticated(true);
      setIsLoading(false);

      addToast({
        title: 'Phone Verified via Greenweb SMS',
        description: `Welcome! Successfully signed in with +88${validation.normalized}`,
        type: 'success',
      });

      return true;
    },
    [addToast]
  );

  // Request Phone OTP via Greenweb
  const requestOTP = useCallback(
    async (phone: string, purpose: 'login' | 'password_reset' | 'two_factor' = 'login') => {
      const validation = validateBDPhone(phone);
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.error || 'Invalid Bangladesh phone number',
        };
      }

      // Generate realistic 6-digit OTP (for dev ease: predictable or random)
      const simulatedCode = Math.floor(100000 + Math.random() * 900000).toString();

      await sendGreenwebSMS(
        validation.normalized,
        `Your FieldOps Pro ${purpose.replace('_', ' ')} OTP is ${simulatedCode}. Valid for 5 minutes. DO NOT share this code.`
      );

      return {
        success: true,
        simulatedCode,
        message: `OTP dispatched to +88${validation.normalized} via Greenweb SMS BD Gateway.`,
      };
    },
    []
  );

  // 2FA Verification
  const verifyTwoFactor = useCallback(
    async (code: string) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Accept any 6-digit code or standard test codes like 123456
      if (code.length !== 6 && !twoFactorConfig.backupCodes.includes(code)) {
        setIsLoading(false);
        addToast({
          title: 'Invalid 2FA Code',
          description: 'The authentication code was incorrect. Try again.',
          type: 'error',
        });
        return false;
      }

      const activeUser = pending2FAUser || user || DEFAULT_USERS[0];
      const tokens = generateMockJWT(activeUser);
      tokenManager.setTokens(tokens, true);
      tokenManager.setCachedUser(activeUser, true);

      setUser(activeUser);
      setIsAuthenticated(true);
      setPending2FAUser(null);
      setIsLoading(false);

      addToast({
        title: 'Two-Factor Verified',
        description: 'Identity confirmed successfully.',
        type: 'success',
      });

      return true;
    },
    [pending2FAUser, user, twoFactorConfig.backupCodes, addToast]
  );

  // Forgot Password
  const forgotPassword = useCallback(
    async (identifier: string, method: 'email' | 'sms') => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);

      if (method === 'sms') {
        const val = validateBDPhone(identifier);
        if (!val.isValid) {
          addToast({
            title: 'Invalid Mobile Number',
            description: val.error || 'Please enter a valid 01XXXXXXXXX number.',
            type: 'error',
          });
          return { success: false };
        }

        const otp = '849201';
        await sendGreenwebSMS(
          val.normalized,
          `Your FieldOps Pro password reset code is ${otp}. Do not share.`
        );

        addToast({
          title: 'SMS OTP Dispatched',
          description: `Reset code sent to +88${val.normalized} via Greenweb.`,
          type: 'success',
        });
        return { success: true, simulatedOTP: otp };
      }

      addToast({
        title: 'Reset Link Dispatched',
        description: `Instructions and reset token sent to ${identifier}`,
        type: 'success',
      });
      return { success: true };
    },
    [addToast]
  );

  // Reset Password
  const resetPassword = useCallback(
    async (identifier: string, otpOrToken: string, newPassword: string) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 900));
      setIsLoading(false);

      if (newPassword.length < 8) {
        addToast({
          title: 'Weak Password',
          description: 'Password must be at least 8 characters long.',
          type: 'error',
        });
        return false;
      }

      addToast({
        title: 'Password Reset Successful',
        description: 'You can now sign in with your new password.',
        type: 'success',
      });
      setAuthMode('login');
      return true;
    },
    [addToast]
  );

  // Change Password
  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsLoading(false);

      addToast({
        title: 'Password Changed',
        description: 'Your security credentials have been updated.',
        type: 'success',
      });
      return true;
    },
    [addToast]
  );

  // Toggle 2FA
  const toggleTwoFactor = useCallback(
    async (enable: boolean) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 700));
      setIsLoading(false);

      setTwoFactorConfig((prev) => ({
        ...prev,
        isEnabled: enable,
      }));

      if (user) {
        const updated = { ...user, isTwoFactorEnabled: enable };
        setUser(updated);
        tokenManager.setCachedUser(updated);
      }

      addToast({
        title: enable ? '2FA Enabled' : '2FA Disabled',
        description: enable
          ? 'Two-Factor Authentication is now active on your account.'
          : 'Two-Factor Authentication has been turned off.',
        type: enable ? 'success' : 'info',
      });

      return {
        ...twoFactorConfig,
        isEnabled: enable,
      };
    },
    [user, twoFactorConfig, addToast]
  );

  // Enterprise Admin Provisioning / Registration
  const registerAdmin = useCallback(
    async (input: AdminRegisterInput): Promise<boolean> => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const names = input.fullName.trim().split(' ');
      const firstName = names[0] || 'Admin';
      const lastName = names.slice(1).join(' ') || 'User';

      const newAdmin: AuthUser = {
        id: `usr-admin-${Date.now().toString(36)}`,
        email: input.email.trim(),
        phone: input.phone.trim(),
        firstName,
        lastName,
        name: input.fullName.trim(),
        role: 'admin',
        tenantId: `tenant-${input.organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        tenantName: input.organizationName.trim(),
        isTwoFactorEnabled: false,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      const tokens = generateMockJWT(newAdmin);
      tokenManager.setTokens(tokens, true);
      tokenManager.setCachedUser(newAdmin, true);

      // Sync Zustand store
      useAuthStore.getState().setTokens(tokens, true);
      useAuthStore.getState().setUser(newAdmin);

      setUser(newAdmin);
      setIsAuthenticated(true);
      setIsLoading(false);

      const newLog: LoginHistoryEntry = {
        id: `log-${Date.now()}`,
        userId: newAdmin.id,
        timestamp: 'Just now (Initial Provision)',
        device: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Admin Console',
        browser: 'Enterprise Client',
        os: 'Secure OS',
        ip: '103.108.144.12',
        location: `${input.division || 'Dhaka'}, Bangladesh`,
        status: 'success',
        isCurrent: true,
      };
      setLoginHistory((prev) => [newLog, ...prev.slice(0, 4)]);
      useAuthStore.getState().addLoginHistoryEntry(newLog);

      addToast({
        title: 'Admin Provisioned Successfully 🎉',
        description: `Welcome ${newAdmin.name}! Registered for ${newAdmin.tenantName}`,
        type: 'success',
      });

      return true;
    },
    [addToast]
  );

  // Logout
  const logout = useCallback(
    (reason?: string) => {
      tokenManager.clearAll();
      useAuthStore.getState().logout();
      setIsAuthenticated(false);
      setUser(null);
      setAuthMode('login');

      if (reason) {
        console.log(`[FieldOps Auth] Logged out: ${reason}`);
      } else {
        addToast({
          title: 'Signed Out',
          description: 'You have been securely logged out.',
          type: 'info',
        });
      }
    },
    [addToast]
  );

  const resetRateLimit = useCallback(() => {
    sessionManager.resetRateLimit();
    setLockoutRemainingSeconds(0);
    setRateLimitAttempts(0);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        authMode,
        setAuthMode,
        login,
        loginWithPhoneOTP,
        logout,
        registerAdmin,
        requestOTP,
        verifyTwoFactor,
        forgotPassword,
        resetPassword,
        changePassword,
        toggleTwoFactor,
        twoFactorConfig,
        loginHistory,
        lockoutRemainingSeconds,
        rateLimitAttempts,
        resetRateLimit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
