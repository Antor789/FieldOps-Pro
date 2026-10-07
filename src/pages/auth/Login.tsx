import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { useOTP } from '../../hooks/useOTP';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { OTPInput } from '../../components/auth/OTPInput';
import {
  loginEmailPasswordSchema,
  loginPhoneOTPSchema,
  LoginEmailPasswordFormValues,
  LoginPhoneOTPFormValues,
} from '../../utils/authValidation';
import { validateBDPhone } from '../../utils/authGuard';
import { useToast } from '../../context/ToastContext';
import {
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  Smartphone,
  KeyRound,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';

export interface LoginPageProps {
  onSuccess?: () => void;
  onNavigateForgotPassword?: () => void;
  onNavigateRegister?: () => void;
  locale?: 'en' | 'bn';
  onLocaleChange?: (lang: 'en' | 'bn') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateForgotPassword,
  onNavigateRegister,
  locale = 'en',
  onLocaleChange,
}) => {
  const { login, isLoading, lockoutRemainingSeconds, rateLimitAttempts, setAuthMode } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'password' | 'otp'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFormErrors, setEmailFormErrors] = useState<Record<string, string>>({});
  const [otpPhoneErrors, setOtpPhoneErrors] = useState<Record<string, string>>({});

  // React Hook Form for Email / Password
  const {
    register: registerEmailForm,
    handleSubmit: handleEmailSubmit,
    setValue: setEmailValue,
    watch: watchEmailForm,
    formState: { isSubmitting: isEmailSubmitting },
  } = useForm<LoginEmailPasswordFormValues>({
    defaultValues: {
      email: 'admin@fieldops.com.bd',
      password: 'FieldOps@2025',
      rememberMe: true,
    },
  });

  // React Hook Form for Phone OTP
  const {
    register: registerPhoneForm,
    handleSubmit: handlePhoneSubmit,
    setValue: setPhoneValue,
    watch: watchPhoneForm,
  } = useForm<LoginPhoneOTPFormValues>({
    defaultValues: {
      phone: '01712345678',
      rememberMe: true,
    },
  });

  const phoneValue = watchPhoneForm('phone') || '';
  const rememberMePhone = watchPhoneForm('rememberMe');

  // Phone OTP state
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const {
    countdown,
    canResend,
    isSending,
    isVerifying,
    lastDispatchedCode,
    sendOTP,
    resendOTP,
    verifyOTP,
    banglaCountdownText,
    englishCountdownText,
  } = useOTP(phoneValue);

  // Email form submit
  const onEmailPasswordSubmit = async (data: LoginEmailPasswordFormValues) => {
    // Validate with Zod
    const validation = loginEmailPasswordSchema.safeParse(data);
    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        const key = err.path[0] as string;
        if (key && !errMap[key]) errMap[key] = err.message;
      });
      setEmailFormErrors(errMap);
      addToast({
        title: 'Validation Error',
        description: Object.values(errMap)[0] || 'Please fix input errors',
        type: 'error',
      });
      return;
    }

    setEmailFormErrors({});
    const res = await login(data.email, data.password, data.rememberMe);
    if (res.success && !res.requires2FA && onSuccess) {
      onSuccess();
    }
  };

  // Request Greenweb SMS OTP
  const onSendPhoneOTP = async (data: LoginPhoneOTPFormValues) => {
    const validation = loginPhoneOTPSchema.safeParse(data);
    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        const key = err.path[0] as string;
        if (key && !errMap[key]) errMap[key] = err.message;
      });
      setOtpPhoneErrors(errMap);
      addToast({
        title: 'Invalid Mobile Number',
        description: Object.values(errMap)[0] || 'Enter valid BD phone number',
        type: 'error',
      });
      return;
    }

    setOtpPhoneErrors({});
    const normalized = data.phone.replace(/\D/g, '').replace(/^88/, '');
    const result = await sendOTP(normalized, 'login');
    if (result.success) {
      setOtpSent(true);
    }
  };

  // Submit 6-digit OTP
  const handleVerifyPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      addToast({
        title: '6-digit OTP Required',
        description: 'Please type the 6 digits sent to your phone.',
        type: 'error',
      });
      return;
    }

    const success = await verifyOTP(phoneValue, otpCode, rememberMePhone);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  // Quick Demo account switcher
  const handleFillDemo = (type: 'admin' | 'dispatcher' | 'tech') => {
    if (type === 'admin') {
      setEmailValue('email', 'admin@fieldops.com.bd');
      setEmailValue('password', 'FieldOps@2025');
      setPhoneValue('phone', '01712345678');
    } else if (type === 'dispatcher') {
      setEmailValue('email', 'dispatcher@fieldops.com.bd');
      setEmailValue('password', 'Dispatcher#2025');
      setPhoneValue('phone', '01812345678');
    } else {
      setEmailValue('email', 'tech.rahim@fieldops.com.bd');
      setEmailValue('password', 'TechPass!2025');
      setPhoneValue('phone', '01912345678');
    }
    addToast({
      title: 'Demo Credentials Loaded',
      description: `Filled ${type.toUpperCase()} profile for fast testing.`,
      type: 'info',
    });
  };

  const isLocked = lockoutRemainingSeconds > 0;

  return (
    <AuthLayout
      title={locale === 'bn' ? 'স্বাগতম 👋' : 'Welcome back 👋'}
      subtitle={
        locale === 'bn'
          ? 'ফিল্ডঅপস প্রো এন্টারপ্রাইজ সিস্টেমে সাইন ইন করুন।'
          : 'Sign in to access your national field operations, live fleet telemetry, and jobs.'
      }
      locale={locale}
      onLocaleChange={onLocaleChange}
    >
      <div className="space-y-6">
        {/* Brute Force Lockout Banner */}
        {isLocked && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">
                {locale === 'bn' ? 'লগইন সাময়িকভাবে স্থগিত' : 'Account Temporarily Locked'}
              </div>
              <p className="mt-0.5">
                {locale === 'bn'
                  ? `একটানা ৫ বার ভুল চেষ্টার পর নিরাপত্তা বিধিনিষেধ জারি হয়েছে। পুনরায় চেষ্টা করতে পারবেন ${lockoutRemainingSeconds} সেকেন্ড পর।`
                  : `5 consecutive failed attempts detected. Security cooldown active for ${lockoutRemainingSeconds}s.`}
              </p>
            </div>
          </div>
        )}

        {/* Failed Attempt Warning Banner */}
        {!isLocked && rateLimitAttempts > 2 && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              {locale === 'bn'
                ? `সতর্কতা: ${rateLimitAttempts}/৫ বার ব্যর্থ চেষ্টা হয়েছে। ৫ বারে অ্যাকাউন্ট ১৫ মিনিট লক হবে।`
                : `Warning: ${rateLimitAttempts}/5 failed attempts. Account will lock for 15 mins on 5 failures.`}
            </span>
          </div>
        )}

        {/* Login Method Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('password')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'password'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-emerald-500" />
            <span>{locale === 'bn' ? 'ইমেইল ও পাসওয়ার্ড' : 'Email & Password'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('otp')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'otp'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-500" />
            <span>{locale === 'bn' ? 'মোবাইল ওটিপি (Greenweb)' : 'Login with OTP'}</span>
          </button>
        </div>

        {/* TAB 1: EMAIL & PASSWORD */}
        {activeTab === 'password' && (
          <form onSubmit={handleEmailSubmit(onEmailPasswordSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {locale === 'bn' ? 'অফিসিয়াল ইমেইল *' : 'Work Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  {...registerEmailForm('email')}
                  type="email"
                  disabled={isLocked}
                  placeholder="admin@fieldops.com.bd"
                  className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-50"
                />
              </div>
              {emailFormErrors.email && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {emailFormErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {locale === 'bn' ? 'পাসওয়ার্ড *' : 'Password *'}
                </label>
                {onNavigateForgotPassword && (
                  <button
                    type="button"
                    onClick={onNavigateForgotPassword}
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    {locale === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?'}
                  </button>
                )}
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  {...registerEmailForm('password')}
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLocked}
                  placeholder="••••••••••••"
                  className="w-full text-xs py-2.5 pl-9 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {emailFormErrors.password && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {emailFormErrors.password}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...registerEmailForm('rememberMe')}
                  type="checkbox"
                  disabled={isLocked}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {locale === 'bn' ? 'লগইন তথ্য সংরক্ষণ করুন (Remember me)' : 'Remember me (30-day session)'}
                </span>
              </label>

              <span className="text-[11px] text-slate-400 font-mono">JWT Bearer</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isEmailSubmitting || isLoading || isLocked}
              className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isEmailSubmitting || isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{locale === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <span>{locale === 'bn' ? 'সাইন ইন করুন' : 'Sign in to Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: PHONE OTP (BANGLADESH GREENWEB GATEWAY) */}
        {activeTab === 'otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handlePhoneSubmit(onSendPhoneOTP)} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {locale === 'bn' ? 'বাংলাদেশ মোবাইল নম্বর *' : 'Bangladesh Mobile Number *'}
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono font-medium">
                      +88
                    </span>
                    <input
                      {...registerPhoneForm('phone')}
                      type="tel"
                      disabled={isLocked}
                      placeholder="01712345678"
                      className="w-full text-xs py-2.5 px-3 rounded-r-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono disabled:opacity-50"
                    />
                  </div>
                  {otpPhoneErrors.phone && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {otpPhoneErrors.phone}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1">
                    {locale === 'bn'
                      ? '১১ সংখ্যার গ্রামীণফোন, রবি, এয়ারটেল, বাংলালিংক বা টেলিটক নম্বর (01XXXXXXXXX)'
                      : 'Accepts all BD operators: GP, Robi, BL, Banglalink, Teletalk (11 digits)'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      {...registerPhoneForm('rememberMe')}
                      type="checkbox"
                      disabled={isLocked}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {locale === 'bn' ? 'লগইন তথ্য সংরক্ষণ করুন' : 'Remember me on this device'}
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSending || isLocked}
                  className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{locale === 'bn' ? 'এসএমএস পাঠানো হচ্ছে...' : 'Sending Greenweb SMS...'}</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>{locale === 'bn' ? 'ওটিপি পাঠান (Greenweb BD)' : 'Send 6-Digit OTP'}</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOTP} className="space-y-4">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <span>
                        {locale === 'bn' ? 'ওটিপি পাঠানো হয়েছে: ' : 'OTP sent to: '}
                        <strong>+88{phoneValue}</strong>
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode('');
                    }}
                    className="text-[11px] underline text-emerald-700 dark:text-emerald-300 font-semibold"
                  >
                    {locale === 'bn' ? 'নম্বর পরিবর্তন' : 'Change'}
                  </button>
                </div>

                {/* 6-box bKash-style OTP input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    {locale === 'bn' ? '৬ সংখ্যার ওটিপি কোড লিখুন' : 'Enter 6-Digit Security Code'}
                  </label>
                  <OTPInput
                    value={otpCode}
                    onChange={setOtpCode}
                    countdown={countdown}
                    canResend={canResend}
                    onResend={resendOTP}
                    locale={locale}
                    simulatedCode={lastDispatchedCode}
                  />
                </div>

                <button
                  type="submit"
                  disabled={otpCode.length !== 6 || isVerifying || isLocked}
                  className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{locale === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying Code...'}</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>{locale === 'bn' ? 'যাচাই ও প্রবেশ করুন' : 'Verify & Sign In'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Quick Demo Credentials Autofill Helper */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Demo Accounts
            </span>
            <span className="text-[10px] text-slate-400">Click to autofill</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-left transition-colors cursor-pointer border border-transparent hover:border-emerald-500/30"
            >
              <div className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Admin
              </div>
              <div className="text-[10px] text-slate-400 truncate">Shafiqul (Dhaka)</div>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('dispatcher')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-left transition-colors cursor-pointer border border-transparent hover:border-blue-500/30"
            >
              <div className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Dispatcher
              </div>
              <div className="text-[10px] text-slate-400 truncate">Tanvir (NOC)</div>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('tech')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-left transition-colors cursor-pointer border border-transparent hover:border-amber-500/30"
            >
              <div className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Technician
              </div>
              <div className="text-[10px] text-slate-400 truncate">Rahim (Lead)</div>
            </button>
          </div>
        </div>

        {/* Enterprise Notice & Register Link */}
        <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 space-y-1.5">
          <p>
            {locale === 'bn' ? 'অ্যাকাউন্ট নেই? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                if (onNavigateRegister) {
                  onNavigateRegister();
                } else {
                  setAuthMode('register');
                }
              }}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              {locale === 'bn' ? 'এডমিন নিবন্ধন / যোগাযোগ' : 'Contact Admin / Register Admin'}
            </button>
          </p>
          <p className="text-[11px] text-slate-400">
            {locale === 'bn'
              ? 'ফিল্ড টেকনিশিয়ানদের অ্যাকাউন্ট স্ব-নিবন্ধন বন্ধ রাখা হয়েছে।'
              : 'Technician accounts are provisioned exclusively by certified NOC admins.'}
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
