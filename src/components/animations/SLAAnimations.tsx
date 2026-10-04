import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { easings } from '../../config/animations';

export const progressRingVariants = {
  initial: { pathLength: 0 },
  animate: (progress: number) => ({
    pathLength: progress / 100,
    transition: {
      duration: 0.8,
      ease: easings.smooth,
    },
  }),
};

export const countdownVariants = {
  initial: { opacity: 0, y: -4 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.18 },
  },
  exit: { 
    opacity: 0, 
    y: 4,
    transition: { duration: 0.1 },
  },
};

export const slaPulseVariants = {
  normal: {
    scale: 1,
  },
  warning: {
    boxShadow: [
      "0 0 0 0 rgba(245, 158, 11, 0)",
      "0 0 0 6px rgba(245, 158, 11, 0.25)",
      "0 0 0 0 rgba(245, 158, 11, 0)",
    ],
    transition: {
      duration: 1.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  critical: {
    boxShadow: [
      "0 0 0 0 rgba(239, 68, 68, 0)",
      "0 0 0 8px rgba(239, 68, 68, 0.35)",
      "0 0 0 0 rgba(239, 68, 68, 0)",
    ],
    transition: {
      duration: 1.1,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  breached: {
    x: [-2, 2, -2, 2, 0],
    boxShadow: [
      "0 0 0 0 rgba(239, 68, 68, 0)",
      "0 0 0 10px rgba(239, 68, 68, 0.45)",
      "0 0 0 0 rgba(239, 68, 68, 0)",
    ],
    transition: {
      duration: 0.9,
      repeat: Infinity,
    },
  },
};

export interface SLAProps {
  remainingMinutes: number;
  totalMinutes?: number;
  isBreached?: boolean;
  size?: number;
  strokeWidth?: number;
}

export function AnimatedSLARing({ 
  remainingMinutes, 
  totalMinutes = 60,
  isBreached = false,
  size = 40,
  strokeWidth = 3.5,
}: SLAProps) {
  const progress = Math.min(100, Math.max(0, (remainingMinutes / totalMinutes) * 100));
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const status = isBreached
    ? 'breached'
    : progress < 25
    ? 'critical'
    : progress < 50
    ? 'warning'
    : 'normal';

  const strokeColor = isBreached
    ? '#EF4444'
    : progress < 25
    ? '#EF4444'
    : progress < 50
    ? '#F59E0B'
    : '#10B981';

  return (
    <motion.div
      variants={slaPulseVariants}
      animate={status}
      className="relative inline-flex items-center justify-center rounded-full"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-700"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (progress / 100) * circumference}
          transition={{ duration: 0.7, ease: easings.smooth }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold">
        <AnimatePresence mode="wait">
          <motion.span
            key={isBreached ? 'breached' : remainingMinutes}
            variants={countdownVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={
              isBreached
                ? 'text-rose-600 font-extrabold text-[9px]'
                : progress < 25
                ? 'text-rose-500'
                : progress < 50
                ? 'text-amber-500'
                : 'text-emerald-600 dark:text-emerald-400'
            }
          >
            {isBreached ? '!SLA' : `${Math.max(0, remainingMinutes)}m`}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
