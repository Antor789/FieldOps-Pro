import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'ai';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ripple?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      ripple = true,
      className = '',
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
    const [isRippling, setIsRippling] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !disabled && !isLoading) {
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setIsRippling(true);
        setTimeout(() => setIsRippling(false), 500);
      }
      onClick?.(e);
    };

    // Size mappings
    const sizeClasses = {
      xs: 'px-2 py-1 text-[11px] gap-1 rounded-lg',
      sm: 'px-2.5 py-1.5 text-xs gap-1.5 rounded-xl',
      md: 'px-3.5 py-2 text-xs font-semibold gap-2 rounded-xl',
      lg: 'px-5 py-2.5 text-sm font-bold gap-2.5 rounded-2xl',
    }[size];

    // Variant mappings
    const variantClasses = {
      primary:
        'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-indigo-500/25 active:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500',
      secondary:
        'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 active:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 dark:border-slate-700',
      outline:
        'bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-300 active:bg-slate-200 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 active:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
      danger:
        'bg-red-600 hover:bg-red-700 text-white shadow-xs hover:shadow-red-500/25 active:bg-red-800 dark:bg-red-600 dark:hover:bg-red-500',
      success:
        'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-emerald-500/25 active:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500',
      ai:
        'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md hover:shadow-indigo-500/30 active:scale-[0.98]',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        onClick={handleClick}
        className={`relative overflow-hidden inline-flex items-center justify-center font-sans select-none transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {/* Click Ripple Effect */}
        {isRippling && coords && (
          <span
            className="absolute bg-white/30 rounded-full pointer-events-none animate-ripple"
            style={{
              left: coords.x,
              top: coords.y,
              width: 120,
              height: 120,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}

        {/* Loading Spinner */}
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}

        <span className="truncate">{children}</span>

        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
