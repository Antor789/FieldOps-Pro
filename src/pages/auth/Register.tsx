import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordStrength } from '../../components/auth/PasswordStrength';
import { adminRegisterSchema, AdminRegisterFormValues } from '../../utils/authValidation';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export interface RegisterPageProps {
  onBackToLogin: () => void;
  onSuccess?: () => void;
  locale?: 'en' | 'bn';
  onLocaleChange?: (lang: 'en' | 'bn') => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onBackToLogin,
  onSuccess,
  locale = 'en',
  onLocaleChange,
}) => {
  const { registerAdmin, isLoading } = useAuth();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<AdminRegisterFormValues>({
    defaultValues: {
      organizationName: '',
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      division: 'Dhaka',
      acceptTerms: true,
    },
  });

  const passwordValue = watch('password') || '';

  const onSubmit = async (data: AdminRegisterFormValues) => {
    // Validate with Zod schema
    const result = adminRegisterSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setFormErrors(fieldErrors);
      addToast({
        title: 'Validation Error',
        description: Object.values(fieldErrors)[0] || 'Please fix form errors',
        type: 'error',
      });
      return;
    }

    setFormErrors({});

    if (registerAdmin) {
      const success = await registerAdmin({
        organizationName: data.organizationName,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        division: data.division,
      });

      if (success) {
        if (onSuccess) {
          onSuccess();
        }
      }
    }
  };

  return (
    <AuthLayout
      title={locale === 'bn' ? 'এডমিন নিবন্ধন' : 'Admin Registration'}
      subtitle={
        locale === 'bn'
          ? 'ফিল্ডঅপস প্রো এন্টারপ্রাইজ অ্যাকাউন্ট শুধুমাত্র কর্পোরেট এডমিনিস্ট্রেটরদের জন্য প্রযোজ্য।'
          : 'Provision a new enterprise NOC administrator account for your operations.'
      }
      locale={locale}
      onLocaleChange={onLocaleChange}
    >
      <div className="space-y-5">
        {/* Admin Registration Notice Card */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">
              {locale === 'bn' ? 'শুধুমাত্র এডমিন নিবন্ধন:' : 'Enterprise Admin Only:'}
            </span>{' '}
            {locale === 'bn'
              ? 'ফিল্ড টেকনিশিয়ানদের অ্যাকাউন্ট এডমিন প্যানেল থেকে তৈরি করতে হবে। সাধারণ টেকনিশিয়ানদের সেলফ-রেজিস্ট্রেশন প্রযোজ্য নয়।'
              : 'Public technician signup is disabled. Field crews and dispatchers are provisioned directly by corporate administrators.'}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          {/* Organization Name */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Organization / Company Name *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                {...register('organizationName')}
                type="text"
                placeholder="e.g. Grameen Infrastructure Ltd."
                className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            {formErrors.organizationName && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {formErrors.organizationName}
              </p>
            )}
          </div>

          {/* Full Name & Division */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Admin Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  {...register('fullName')}
                  type="text"
                  placeholder="e.g. Md. Shafiqul Islam"
                  className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              {formErrors.fullName && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                HQ Division (Bangladesh)
              </label>
              <select
                {...register('division')}
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Dhaka">Dhaka (ঢাকা)</option>
                <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                <option value="Khulna">Khulna (খুলনা)</option>
                <option value="Sylhet">Sylhet (সিলেট)</option>
                <option value="Barisal">Barisal (বরিশাল)</option>
                <option value="Rangpur">Rangpur (রংপুর)</option>
                <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
              </select>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Official Work Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="admin@company.com.bd"
                  className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              {formErrors.email && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Mobile Number (Greenweb SMS) *
              </label>
              <div className="relative flex">
                <span className="inline-flex items-center px-2.5 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-mono font-medium">
                  +88
                </span>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="01712345678"
                  className="w-full text-xs py-2.5 px-3 rounded-r-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>
              {formErrors.phone && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Admin Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                className="w-full text-xs py-2.5 pl-9 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formErrors.password && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {formErrors.password}
              </p>
            )}

            {/* Password strength indicator */}
            <PasswordStrength password={passwordValue} locale={locale} />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                className="w-full text-xs py-2.5 pl-9 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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

          {/* Terms Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                {...register('acceptTerms')}
                type="checkbox"
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                I agree to the{' '}
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold underline">
                  Enterprise Terms & Conditions
                </span>{' '}
                and statutory NBR VAT compliance agreement.
              </span>
            </label>
            {formErrors.acceptTerms && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {formErrors.acceptTerms}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Provisioning Enterprise Admin...</span>
              </>
            ) : (
              <>
                <span>Complete Admin Provisioning</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to Login link */}
        <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onBackToLogin}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Already have an account? Sign In</span>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};
