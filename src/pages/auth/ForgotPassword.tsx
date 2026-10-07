import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '../../utils/authValidation';
import { useToast } from '../../context/ToastContext';
import { Mail, Phone, ArrowLeft, ArrowRight, CheckCircle2, Loader2, KeyRound, AlertCircle } from 'lucide-react';

export interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
  onNavigateResetPassword?: (identifier: string) => void;
  locale?: 'en' | 'bn';
  onLocaleChange?: (lang: 'en' | 'bn') => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onBackToLogin,
  onNavigateResetPassword,
  locale = 'en',
  onLocaleChange,
}) => {
  const { forgotPassword, isLoading } = useAuth();
  const { addToast } = useToast();

  const [method, setMethod] = useState<'email' | 'sms'>('email');
  const [isSuccess, setIsSuccess] = useState(false);
  const [dispatchedTarget, setDispatchedTarget] = useState('');
  const [simulatedOTP, setSimulatedOTP] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { register, handleSubmit, setValue } = useForm<{ identifier: string }>({
    defaultValues: {
      identifier: method === 'email' ? 'admin@fieldops.com.bd' : '01712345678',
    },
  });

  const onSubmit = async (values: { identifier: string }) => {
    const dataToValidate: ForgotPasswordFormValues = {
      method,
      identifier: values.identifier,
    };

    const result = forgotPasswordSchema.safeParse(dataToValidate);
    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (key && !errMap[key]) errMap[key] = issue.message;
      });
      setFormErrors(errMap);
      addToast({
        title: 'Validation Failed',
        description: Object.values(errMap)[0] || 'Please provide valid credentials.',
        type: 'error',
      });
      return;
    }

    setFormErrors({});
    const res = await forgotPassword(values.identifier, method);
    if (res.success) {
      setDispatchedTarget(values.identifier);
      if (res.simulatedOTP) {
        setSimulatedOTP(res.simulatedOTP);
      }
      setIsSuccess(true);
    }
  };

  return (
    <AuthLayout
      title={locale === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Reset your password'}
      subtitle={
        locale === 'bn'
          ? 'আপনার নিবন্ধিত ইমেইল বা ফোন নম্বরে পাসওয়ার্ড রিসেট লিংক/কোড পাঠানো হবে।'
          : 'Enter your verified work email or mobile number to receive reset instructions.'
      }
      locale={locale}
      onLocaleChange={onLocaleChange}
    >
      <div className="space-y-6">
        {!isSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Method Toggle */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMethod('email');
                  setValue('identifier', 'admin@fieldops.com.bd');
                  setFormErrors({});
                }}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  method === 'email'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-emerald-500" />
                <span>{locale === 'bn' ? 'ইমেইল দিয়ে' : 'Via Work Email'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod('sms');
                  setValue('identifier', '01712345678');
                  setFormErrors({});
                }}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  method === 'sms'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <span>{locale === 'bn' ? 'মোবাইল এসএমএস (Greenweb)' : 'Via SMS OTP'}</span>
              </button>
            </div>

            {/* Input field */}
            {method === 'email' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {locale === 'bn' ? 'নিবন্ধিত কাজের ইমেইল *' : 'Registered Work Email *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    {...register('identifier')}
                    type="email"
                    placeholder="e.g. shafiqul@fieldops.com.bd"
                    className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                {formErrors.identifier && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.identifier}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {locale === 'bn' ? 'নিবন্ধিত মোবাইল নম্বর *' : 'Registered Mobile Number *'}
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono font-medium">
                    +88
                  </span>
                  <input
                    {...register('identifier')}
                    type="tel"
                    placeholder="01712345678"
                    className="w-full text-xs py-2.5 px-3 rounded-r-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                  />
                </div>
                {formErrors.identifier && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.identifier}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  {locale === 'bn'
                    ? 'গ্রিনওয়েব এসএমএস গেটওয়ের মাধ্যমে ওটিপি কোড পাঠানো হবে।'
                    : 'A 6-digit security token will be sent via Greenweb SMS Gateway BD.'}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {locale === 'bn' ? 'রিসেট নির্দেশিকা পাঠান' : 'Send Reset Instructions'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* SUCCESS STATE UI */
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {locale === 'bn' ? 'নির্দেশনা পাঠানো হয়েছে!' : 'Check your inbox / phone!'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {method === 'email'
                  ? `We have dispatched a secure password reset link to ${dispatchedTarget}. Follow the link to choose a new password.`
                  : `A 6-digit verification code has been dispatched via Greenweb SMS BD to +88${dispatchedTarget}.`}
              </p>
            </div>

            {simulatedOTP && (
              <div className="p-3 rounded-2xl bg-slate-900 text-white font-mono text-xs max-w-xs mx-auto">
                <span className="text-slate-400">Greenweb Dev OTP:</span>{' '}
                <strong className="text-emerald-400 text-sm tracking-widest">{simulatedOTP}</strong>
              </div>
            )}

            {/* Direct button to Reset Password page */}
            {onNavigateResetPassword && (
              <button
                type="button"
                onClick={() => onNavigateResetPassword(dispatchedTarget)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>{locale === 'bn' ? 'নতুন পাসওয়ার্ড সেট করুন' : 'Enter Code & Reset Password'}</span>
              </button>
            )}
          </div>
        )}

        {/* Back to Login */}
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
