import React, { useState } from 'react';
import { X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      className = '',
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-1 font-sans">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            value={value}
            onChange={onChange}
            className={`w-full bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs rounded-xl transition-all duration-150 focus:outline-none focus:bg-white dark:focus:bg-slate-950 ${
              leftIcon ? 'pl-9' : 'pl-3'
            } ${clearable || rightIcon ? 'pr-9' : 'pr-3'} py-2 ${
              error
                ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
                : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
            } ${className}`}
            {...props}
          />

          {clearable && value && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {!clearable && rightIcon && (
            <div className="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={`text-[11px] ${
              error ? 'text-red-500 font-medium' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  error,
  leftIcon,
  className = '',
  value,
  id,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `floating-input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const hasValue = value !== undefined && value !== null && value !== '';

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`peer w-full bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-slate-100 text-xs rounded-xl pt-5 pb-2 transition-all duration-150 focus:outline-none focus:bg-white dark:focus:bg-slate-950 ${
            leftIcon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 ${
            error
              ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500'
              : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
          } ${className}`}
          placeholder=" "
          {...props}
        />

        <label
          htmlFor={inputId}
          className={`absolute transition-all duration-150 pointer-events-none text-slate-500 dark:text-slate-400 ${
            leftIcon ? 'left-10' : 'left-3.5'
          } ${
            isFocused || hasValue
              ? 'top-1.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400'
              : 'top-3.5 text-xs'
          }`}
        >
          {label}
        </label>
      </div>

      {error && <p className="text-[11px] text-red-500 font-medium mt-1">{error}</p>}
    </div>
  );
};
