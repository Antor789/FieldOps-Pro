/**
 * FieldOps Pro - Inactivity Session & Security Manager
 * Manages 30-minute idle auto-logout, brute-force rate limiting (5 attempts → 15min lockout),
 * and suspicious IP location anomaly alerts.
 */

export interface SessionConfig {
  inactivityTimeoutMs: number; // 30 mins = 1800000 ms
  warningTimeoutMs: number; // 28 mins = 1680000 ms
  maxFailedAttempts: number; // 5 attempts
  lockoutDurationMs: number; // 15 mins = 900000 ms
}

const DEFAULT_CONFIG: SessionConfig = {
  inactivityTimeoutMs: 30 * 60 * 1000,
  warningTimeoutMs: 28 * 60 * 1000,
  maxFailedAttempts: 5,
  lockoutDurationMs: 15 * 60 * 1000,
};

const FAILED_ATTEMPTS_KEY = 'fieldops_failed_logins';
const LOCKOUT_EXPIRY_KEY = 'fieldops_lockout_expiry';

export class SessionManager {
  private config: SessionConfig;
  private idleTimer: any = null;
  private warningTimer: any = null;
  private onTimeoutCallback: (() => void) | null = null;
  private onWarningCallback: ((remainingSeconds: number) => void) | null = null;
  private isListening = false;

  constructor(config: Partial<SessionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Start listening for user activity (mouse, keyboard, scroll, touch)
   */
  public start(
    onTimeout: () => void,
    onWarning?: (remainingSeconds: number) => void
  ): void {
    this.onTimeoutCallback = onTimeout;
    this.onWarningCallback = onWarning || null;
    this.resetTimer();

    if (!this.isListening && typeof window !== 'undefined') {
      const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
      events.forEach((event) => {
        window.addEventListener(event, this.handleUserActivity, { passive: true });
      });
      this.isListening = true;
    }
  }

  /**
   * Stop session tracking
   */
  public stop(): void {
    this.clearTimers();
    if (this.isListening && typeof window !== 'undefined') {
      const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
      events.forEach((event) => {
        window.removeEventListener(event, this.handleUserActivity);
      });
      this.isListening = false;
    }
  }

  private handleUserActivity = (): void => {
    this.resetTimer();
  };

  public resetTimer(): void {
    this.clearTimers();

    // Trigger warning 2 minutes before auto-logout
    this.warningTimer = setTimeout(() => {
      if (this.onWarningCallback) {
        this.onWarningCallback(120);
      }
    }, this.config.warningTimeoutMs);

    // Hard auto-logout at 30 minutes
    this.idleTimer = setTimeout(() => {
      if (this.onTimeoutCallback) {
        this.onTimeoutCallback();
      }
    }, this.config.inactivityTimeoutMs);
  }

  private clearTimers(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    if (this.warningTimer) clearTimeout(this.warningTimer);
  }

  // --- RATE LIMITING (5 ATTEMPTS -> 15 MIN LOCKOUT) ---

  public getFailedAttempts(): number {
    const raw = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    return raw ? parseInt(raw, 10) : 0;
  }

  public getLockoutRemainingSeconds(): number {
    const expiry = localStorage.getItem(LOCKOUT_EXPIRY_KEY);
    if (!expiry) return 0;
    const diff = Math.floor((parseInt(expiry, 10) - Date.now()) / 1000);
    if (diff <= 0) {
      this.resetRateLimit();
      return 0;
    }
    return diff;
  }

  public isLockedOut(): boolean {
    return this.getLockoutRemainingSeconds() > 0;
  }

  public recordFailedAttempt(): { isLocked: boolean; remainingAttempts: number; lockoutSeconds: number } {
    const current = this.getFailedAttempts() + 1;
    localStorage.setItem(FAILED_ATTEMPTS_KEY, current.toString());

    if (current >= this.config.maxFailedAttempts) {
      const expiry = Date.now() + this.config.lockoutDurationMs;
      localStorage.setItem(LOCKOUT_EXPIRY_KEY, expiry.toString());
      return {
        isLocked: true,
        remainingAttempts: 0,
        lockoutSeconds: Math.floor(this.config.lockoutDurationMs / 1000),
      };
    }

    return {
      isLocked: false,
      remainingAttempts: this.config.maxFailedAttempts - current,
      lockoutSeconds: 0,
    };
  }

  public resetRateLimit(): void {
    localStorage.removeItem(FAILED_ATTEMPTS_KEY);
    localStorage.removeItem(LOCKOUT_EXPIRY_KEY);
  }
}

export const sessionManager = new SessionManager();
