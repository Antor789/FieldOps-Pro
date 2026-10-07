import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthTokens, AuthUser } from '../types/auth';

/**
 * FieldOps Pro - Enterprise Token & Session Security Manager
 * Handles JWT access tokens, refresh token rotation, httpOnly cookie simulation,
 * CSRF token protection, and Axios interceptors for automatic token refresh.
 */

const ACCESS_TOKEN_KEY = 'fieldops_access_token';
const REFRESH_TOKEN_KEY = 'fieldops_refresh_token';
const USER_CACHE_KEY = 'fieldops_cached_user';
const REMEMBER_ME_KEY = 'fieldops_remember_me';
const CSRF_TOKEN_KEY = 'fieldops_csrf_token';

/**
 * Generates realistic base64-encoded mock JWT tokens
 */
export function generateMockJWT(user: AuthUser, expiresInSeconds = 3600): AuthTokens {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + expiresInSeconds;

  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      tenantId: user.tenantId,
      iat: issuedAt,
      exp: expiresAt,
      iss: 'fieldops-pro-auth-service',
      aud: 'fieldops-clients-bd',
    })
  );

  const signature = btoa(`sig_${user.id}_${issuedAt}_fieldops_secret_key`);
  const accessToken = `${header}.${payload}.${signature}`;

  // Refresh token valid for 7 days
  const refreshSignature = btoa(`refresh_${user.id}_${issuedAt + 7 * 86400}`);
  const refreshToken = `rft_${btoa(user.id)}.${refreshSignature}`;

  return {
    accessToken,
    refreshToken,
    expiresIn: expiresInSeconds,
    tokenType: 'Bearer',
    issuedAt: issuedAt * 1000,
  };
}

/**
 * CSRF Token Generator & Validator
 */
export function getOrCreateCSRFToken(): string {
  if (typeof window === 'undefined') return 'csrf-token-default';
  let token = sessionStorage.getItem(CSRF_TOKEN_KEY);
  if (!token) {
    token = 'csrf-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  }
  return token;
}

export const tokenManager = {
  /**
   * Save tokens based on Remember Me preference.
   * Simulates secure cookie storage for enterprise security compliance.
   */
  setTokens(tokens: AuthTokens, rememberMe = true): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false');

    // Simulate secure cookie headers
    if (typeof document !== 'undefined') {
      const maxAge = rememberMe ? 7 * 86400 : 3600;
      document.cookie = `__Host-FieldOpsToken=${tokens.accessToken}; SameSite=Strict; Path=/; max-age=${maxAge}; ${
        location.protocol === 'https:' ? 'Secure;' : ''
      }`;
    }
  },

  /**
   * Retrieve current access token
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return (
      localStorage.getItem(ACCESS_TOKEN_KEY) ||
      sessionStorage.getItem(ACCESS_TOKEN_KEY)
    );
  },

  /**
   * Retrieve current refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return (
      localStorage.getItem(REFRESH_TOKEN_KEY) ||
      sessionStorage.getItem(REFRESH_TOKEN_KEY)
    );
  },

  /**
   * Store user profile cache
   */
  setCachedUser(user: AuthUser, rememberMe = true): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(USER_CACHE_KEY, JSON.stringify(user));
  },

  /**
   * Retrieve cached user
   */
  getCachedUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const raw =
      localStorage.getItem(USER_CACHE_KEY) ||
      sessionStorage.getItem(USER_CACHE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  },

  /**
   * Clear all auth credentials
   */
  clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_CACHE_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_CACHE_KEY);
    if (typeof document !== 'undefined') {
      document.cookie = '__Host-FieldOpsToken=; Path=/; max-age=0; SameSite=Strict;';
    }
  },

  /**
   * Get Authorization Header for API calls
   */
  getAuthHeader(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

/**
 * Enterprise Axios Instance with Request/Response Interceptors
 * - Injects JWT Access Token and CSRF Token on all requests
 * - Intercepts 401 Unauthorized responses to perform automatic Refresh Token Rotation
 */
export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach Bearer JWT and CSRF Header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const csrfToken = getOrCreateCSRFToken();
    if (csrfToken && config.headers) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 handling with Refresh Token Rotation
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();
      const currentUser = tokenManager.getCachedUser();

      if (!refreshToken || !currentUser) {
        isRefreshing = false;
        tokenManager.clearAll();
        return Promise.reject(error);
      }

      try {
        // Rotate tokens
        const newTokens = generateMockJWT(currentUser);
        tokenManager.setTokens(newTokens, true);
        processQueue(null, newTokens.accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr as AxiosError, null);
        tokenManager.clearAll();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
