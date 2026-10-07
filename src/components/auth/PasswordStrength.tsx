import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';

export interface PasswordStrengthProps {
  password: string;
  locale?: 'en' | 'bn';
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, locale = 'en' }) => {
  const analysis = useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    const score = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;

    let label = 'Too Weak';
    let labelBn = 'খুব দুর্বল';
    let color = 'bg-rose-500';
    let textColor = 'text-rose-500';

    if (score === 2) {
      label = 'Fair';
      labelBn = 'মোটামুটি';
      color = 'bg-amber-500';
      textColor = 'text-amber-500';
    } else if (score === 3) {
      label = 'Good';
      labelBn = 'ভালো';
      color = 'bg-blue-500';
      textColor = 'text-blue-500';
    } else if (score === 4) {
      label = 'Strong';
      labelBn = 'নিরাপদ ও শক্তিশালী';
      color = 'bg-emerald-500';
      textColor = 'text-emerald-500';
    }

    return {
      score,
      label,
      labelBn,
      color,
      textColor,
      hasMinLength,
      hasUppercase,
      hasNumber,
      hasSpecial,
    };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-2 pt-1 text-xs">
      {/* 4-level Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500">
            {locale === 'bn' ? 'পাসওয়ার্ড নিরাপত্তা:' : 'Password Strength:'}
          </span>
          <span className={`font-bold ${analysis.textColor}`}>
            {locale === 'bn' ? analysis.labelBn : analysis.label}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-full rounded-full transition-all duration-200 ${
                analysis.score >= step
                  ? analysis.color
                  : 'bg-slate-200 dark:bg-slate-700/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
        <div className={`flex items-center gap-1.5 ${analysis.hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}`}>
          {analysis.hasMinLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-400" />}
          <span>{locale === 'bn' ? 'কমপক্ষে ৮টি অক্ষর' : 'At least 8 chars'}</span>
        </div>

        <div className={`flex items-center gap-1.5 ${analysis.hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}`}>
          {analysis.hasUppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-400" />}
          <span>{locale === 'bn' ? 'বড় হাতের অক্ষর (A-Z)' : 'Uppercase letter'}</span>
        </div>

        <div className={`flex items-center gap-1.5 ${analysis.hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}`}>
          {analysis.hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-400" />}
          <span>{locale === 'bn' ? 'একটি সংখ্যা (০-৯)' : 'One number (0-9)'}</span>
        </div>

        <div className={`flex items-center gap-1.5 ${analysis.hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}`}>
          {analysis.hasSpecial ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-400" />}
          <span>{locale === 'bn' ? 'বিশেষ চিহ্ন (!@#$)' : 'Special char (!@#$)'}</span>
        </div>
      </div>
    </div>
  );
};
