import { useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { tokenManager, generateMockJWT } from '../utils/tokenManager';

export function useAuth() {
  const context = useAuthContext();

  const refreshToken = useCallback(async () => {
    const rft = tokenManager.getRefreshToken();
    if (!rft || !context.user) return false;

    // Simulate server refresh token rotation
    const newTokens = generateMockJWT(context.user);
    tokenManager.setTokens(newTokens, true);
    return true;
  }, [context.user]);

  return {
    user: context.user,
    currentUser: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    authMode: context.authMode,
    setAuthMode: context.setAuthMode,
    login: context.login,
    loginWithOTP: context.loginWithPhoneOTP,
    logout: context.logout,
    registerAdmin: context.registerAdmin,
    forgotPassword: context.forgotPassword,
    resetPassword: context.resetPassword,
    changePassword: context.changePassword,
    verifyTwoFactor: context.verifyTwoFactor,
    toggleTwoFactor: context.toggleTwoFactor,
    twoFactorConfig: context.twoFactorConfig,
    loginHistory: context.loginHistory,
    lockoutRemainingSeconds: context.lockoutRemainingSeconds,
    rateLimitAttempts: context.rateLimitAttempts,
    resetRateLimit: context.resetRateLimit,
    refreshToken,
  };
}
