import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthUser, AuthTokens, LoginHistoryEntry, TwoFactorConfig } from '../types/auth';

interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  loginHistory: LoginHistoryEntry[];
  twoFactorConfig: TwoFactorConfig;
  failedAttempts: number;
  lockoutExpiry: number | null;
  
  // Actions
  setUser: (user: AuthUser | null) => void;
  setTokens: (tokens: AuthTokens | null, rememberMe?: boolean) => void;
  setAuthenticated: (status: boolean) => void;
  setRememberMe: (status: boolean) => void;
  addLoginHistoryEntry: (entry: LoginHistoryEntry) => void;
  setTwoFactorConfig: (config: Partial<TwoFactorConfig>) => void;
  recordFailedAttempt: () => { attempts: number; lockoutUntil: number | null };
  resetFailedAttempts: () => void;
  logout: () => void;
}

const INITIAL_2FA: TwoFactorConfig = {
  isEnabled: false,
  secret: 'JBSWY3DPEHPK3PXP',
  qrCodeUrl:
    'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=otpauth%3A%2F%2Ftotp%2FFieldOpsPro%3Aadmin%40fieldops.com.bd%3Fsecret%3DJBSWY3DPEHPK3PXP%26issuer%3DFieldOps%2520Pro%2520Bangladesh',
  backupCodes: ['8921-4321', '6712-9843', '1092-8472', '4581-2940', '3910-6721'],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      rememberMe: true,
      loginHistory: [],
      twoFactorConfig: INITIAL_2FA,
      failedAttempts: 0,
      lockoutExpiry: null,

      setUser: (user) => set({ user }),
      
      setTokens: (tokens, rememberMe = true) =>
        set({
          tokens,
          isAuthenticated: !!tokens,
          rememberMe,
        }),

      setAuthenticated: (status) => set({ isAuthenticated: status }),
      setRememberMe: (rememberMe) => set({ rememberMe }),

      addLoginHistoryEntry: (entry) =>
        set((state) => ({
          loginHistory: [entry, ...state.loginHistory.filter((h) => h.id !== entry.id)].slice(0, 5),
        })),

      setTwoFactorConfig: (config) =>
        set((state) => ({
          twoFactorConfig: { ...state.twoFactorConfig, ...config },
        })),

      recordFailedAttempt: () => {
        const nextAttempts = get().failedAttempts + 1;
        let lockoutUntil: number | null = null;
        if (nextAttempts >= 5) {
          // 15 min lockout
          lockoutUntil = Date.now() + 15 * 60 * 1000;
        }
        set({ failedAttempts: nextAttempts, lockoutExpiry: lockoutUntil });
        return { attempts: nextAttempts, lockoutUntil };
      },

      resetFailedAttempts: () => set({ failedAttempts: 0, lockoutExpiry: null }),

      logout: () =>
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'fieldops_auth_store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe,
        twoFactorConfig: state.twoFactorConfig,
        loginHistory: state.loginHistory,
      }),
    }
  )
);
