import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { easings } from '../../config/animations';
import { useRipple } from '../../hooks/useRipple';
import { Loader2, Check } from 'lucide-react';

export const buttonVariants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.15, ease: easings.smooth },
  },
  tap: { 
    scale: 0.97,
    transition: { duration: 0.08 },
  },
  disabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};

export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 0.9,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const checkmarkVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
};

export interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  isSuccess?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'emerald';
  children: React.ReactNode;
  className?: string;
}

export function AnimatedButton({
  children,
  isLoading = false,
  isSuccess = false,
  variant = 'primary',
  className = '',
  onClick,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const { ripples, createRipple } = useRipple();

  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      variants={buttonVariants}
      initial="idle"
      whileHover={disabled || isLoading ? "idle" : "hover"}
      whileTap={disabled || isLoading ? "idle" : "tap"}
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="inline-flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </motion.div>
        ) : isSuccess ? (
          <motion.div
            key="success"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="inline-flex items-center gap-1.5 text-emerald-300"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Done</span>
          </motion.div>
        ) : (
          <motion.span key="text" className="inline-flex items-center gap-2">
            {children}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Ripple Micro-interactions */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          initial={{ scale: 0, opacity: 0.45 }}
          animate={{ scale: 4.5, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 24,
            height: 24,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </motion.button>
  );
}
