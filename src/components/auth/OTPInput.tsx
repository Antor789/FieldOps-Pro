import React, { useRef, useEffect } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

export interface OTPInputProps {
  value: string;
  onChange: (otp: string) => void;
  length?: number;
  countdown: number;
  canResend: boolean;
  onResend: () => void;
  locale?: 'en' | 'bn';
  simulatedCode?: string | null;
  disabled?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
  countdown,
  canResend,
  onResend,
  locale = 'en',
  simulatedCode,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into array
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  // Auto-focus first empty input on mount
  useEffect(() => {
    const firstEmptyIndex = digits.findIndex((d) => !d);
    const focusIndex = firstEmptyIndex === -1 ? length - 1 : firstEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  }, []);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.slice(-1); // Take latest typed char
    if (char && !/^\d$/.test(char)) return; // Only allow digits

    const nextDigits = [...digits];
    nextDigits[index] = char;
    const combined = nextDigits.join('');
    onChange(combined);

    // If character entered, auto-focus next input
    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // If current is already empty, move to previous and delete
        const nextDigits = [...digits];
        nextDigits[index - 1] = '';
        onChange(nextDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      } else {
        const nextDigits = [...digits];
        nextDigits[index] = '';
        onChange(nextDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  // Convert number to Bangla digits
  const toBn = (n: number) => {
    const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return n.toString().split('').map((d) => bn[parseInt(d, 10)] || d).join('');
  };

  return (
    <div className="space-y-4">
      {/* 6 bKash-style individual digit boxes */}
      <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
        {Array.from({ length }).map((_, index) => {
          const isFilled = !!digits[index];
          return (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digits[index]}
              disabled={disabled}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-11 sm:w-12 h-13 sm:h-14 text-center text-xl sm:text-2xl font-mono font-black rounded-2xl border transition-all duration-150 focus:outline-hidden ${
                isFilled
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-900 dark:text-white ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:border-slate-300'
              } focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20`}
            />
          );
        })}
      </div>

      {/* Countdown Timer & Resend Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="text-slate-500 dark:text-slate-400">
          {countdown > 0 ? (
            <span className="font-medium">
              {locale === 'bn' ? (
                <>পুনরায় কোড পাঠান: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{toBn(countdown)} সে.</strong></>
              ) : (
                <>Resend code in <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{countdown}s</strong></>
              )}
            </span>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {locale === 'bn' ? 'কোড পাননি? পুনরায় চেষ্টা করুন' : 'Did not receive code?'}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={!canResend || disabled}
          onClick={onResend}
          className={`flex items-center gap-1 font-semibold transition-colors ${
            canResend && !disabled
              ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 underline cursor-pointer'
              : 'text-slate-400 cursor-not-allowed opacity-50'
          }`}
        >
          <RotateCcw className="w-3 h-3" />
          <span>{locale === 'bn' ? 'পুনরায় কোড পাঠান' : 'Resend OTP'}</span>
        </button>
      </div>

      {/* Simulated Developer Code helper badge */}
      {simulatedCode && (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Greenweb SMS Dev Code: <strong className="font-mono font-bold tracking-widest">{simulatedCode}</strong></span>
          </div>
          <button
            type="button"
            onClick={() => onChange(simulatedCode)}
            className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Auto Fill
          </button>
        </div>
      )}
    </div>
  );
};
