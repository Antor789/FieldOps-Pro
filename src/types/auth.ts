/**
 * FieldOps Pro - Authentication & Authorization Types
 * Comprehensive enterprise security, Bangladesh phone OTP, JWT sessions, 2FA, and audit logging.
 */

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'dispatcher'
  | 'technician'
  | 'accountant'
  | 'customer';

export interface AuthUser {
  id: string;
  email: string;
  phone: string; // Bangladesh format 01XXXXXXXXX
  firstName: string;
  lastName: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  tenantId: string;
  tenantName: string;
  isTwoFactorEnabled: boolean;
  twoFactorMethod?: 'authenticator' | 'sms';
  customPermissions?: string[];
  division?: string;
  status?: 'active' | 'inactive' | 'pending';
  lastLoginAt?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface PhoneLoginCredentials {
  phone: string;
  otp: string;
  rememberMe?: boolean;
}

export interface OTPRequest {
  phone: string;
  purpose: 'login' | 'password_reset' | 'two_factor';
}

export interface OTPResponse {
  success: boolean;
  message: string;
  messageBn?: string;
  expiresInSeconds: number;
  simulatedCode?: string; // For testing/demonstration in dev
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // in seconds
  tokenType: 'Bearer';
  issuedAt: number;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
  requires2FA?: boolean;
  tempSessionId?: string;
}

export interface LoginHistoryEntry {
  id: string;
  userId: string;
  timestamp: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string; // e.g. "Gulshan, Dhaka, Bangladesh"
  status: 'success' | 'failed' | 'suspicious';
  isCurrent: boolean;
  suspiciousReason?: string;
}

export interface TwoFactorConfig {
  isEnabled: boolean;
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface PasswordResetRequest {
  identifier: string; // email or phone
  method: 'email' | 'sms';
}

export interface PasswordResetConfirm {
  identifier: string;
  otpOrToken: string;
  newPassword: string;
}

export interface AdminRegisterInput {
  organizationName: string;
  fullName: string;
  email: string;
  phone: string; // Bangladesh format 01XXXXXXXXX
  password: string;
  division?: string;
}

export type AuthMode =
  | 'login'
  | 'otp_login'
  | 'forgot_password'
  | 'reset_password'
  | 'two_factor'
  | 'register'
  | 'register_admin_notice';
