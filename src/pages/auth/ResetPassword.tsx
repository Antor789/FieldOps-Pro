import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { useOTP } from '../../hooks/useOTP';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { OTPInput } from '../../components/auth/OTPInput';
import { PasswordStrength } from '../../components/auth/PasswordStrength';
import { resetPasswordSchema, ResetPasswordFormValues } from '../../utils/authValidation';
import { useToast } from '../../context/ToastContext';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, Loader2, KeyRound, AlertCircle } from 'lucide-react';

export interface ResetPasswordPageProps {
  identifier?: string;
  onBackToLogin: () => void;
  locale?: 'en' | 'bn';
  onLocaleChange?: (lang: 'en' | 'bn') => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  identifier = '01712345678',
  onBackToLogin,
  locale = 'en',
  onLocaleChange,
}) => {
  const { resetPassword, isLoading } = useAuth();
  const { addToast } = useToast();

  const [otpCode, setOtpCode] = useState('849201');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { countdown, canResend, resendOTP } = useOTP(identifier);

  const { register, handleSubmit, watch } = useForm<{
    newPassword: string;
    confirmPassword: string;
  }>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('newPassword') || '';

  const onSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
    const dataToValidate: ResetPasswordFormValues = {
      otpCode,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };

    const result = resetPasswordSchema.safeParse(dataToValidate);
    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (key && !errMap[key]) errMap[key] = issue.message;
      });
      setFormErrors(errMap);
      addToast({
        title: 'Validation Failed',
        description: Object.values(errMap)[0] || 'Please correct the fields.',
        type: 'error',
      });
      return;
    }

    setFormErrors({});

    const ok = await resetPassword(identifier, otpCode, values.newPassword);
    if (ok) {
      setIsDone(true);
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
    }
  };

  return (
    <AuthLayout
      title={locale === 'bn' ? 'নতুন পাসওয়ার্ড নির্ধারণ' : 'Set new password'}
      subtitle={
        locale === 'bn'
          ? 'যাচাইকরণ কোড ও নতুন নিরাপদ পাসওয়ার্ড লিখুন।'
          : 'Enter the verification code sent to your phone/email and set your new credentials.'
      }
      locale={locale}
      onLocaleChange={onLocaleChange}
    >
      <div className="space-y-6">
        {!isDone ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Target identifier info */}
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span>
                Resetting for: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{identifier}</strong>
              </span>
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Change
              </button>
            </div>

            {/* Step 1: 6-digit OTP Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Verification Code (6 Digits) *
              </label>
              <OTPInput
                value={otpCode}
                onChange={setOtpCode}
                countdown={countdown}
                canResend={canResend}
                onResend={resendOTP}
                locale={locale}
                simulatedCode="849201"
              />
              {formErrors.otpCode && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.otpCode}
                </p>
              )}
            </div>

            {/* Step 2: New Password Input */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  {...register('newPassword')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  className="w-full text-xs py-2.5 pl-9 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formErrors.newPassword && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.newPassword}
                </p>
              )}

              {/* Password Strength Indicator */}
              <PasswordStrength password={passwordValue} locale={locale} />
            </div>

            {/* Step 3: Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  className="w-full text-xs py-2.5 pl-9 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Credentials...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>{locale === 'bn' ? 'পাসওয়ার্ড নিশ্চিত ও সংরক্ষণ করুন' : 'Confirm & Save Password'}</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {locale === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!' : 'Password Reset Complete!'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your account password has been updated. Redirecting to sign in...
              </p>
            </div>
          </div>
        )}

        <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onBackToLogin}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{locale === 'bn' ? 'লগইন পেজে ফিরে যান' : 'Return to sign in'}</span>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
