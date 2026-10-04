import { motion } from 'motion/react';
import { easings } from '../../config/animations';

export const skeletonVariants = {
  shimmer: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 1.6,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 bg-[length:200%_100%] rounded-xl ${className}`}
      variants={skeletonVariants}
      animate="shimmer"
    />
  );
}

export const pulseDotsVariants = {
  animate: (i: number) => ({
    y: [0, -8, 0],
    transition: {
      duration: 0.55,
      repeat: Infinity,
      delay: i * 0.1,
      ease: "easeInOut",
    },
  }),
};

export function LoadingDots({ color = 'bg-indigo-600' }: { color?: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-full ${color}`}
          variants={pulseDotsVariants}
          animate="animate"
          custom={i}
        />
      ))}
    </div>
  );
}

export const progressBarVariants = {
  initial: { scaleX: 0, originX: 0 },
  animate: (progress: number) => ({
    scaleX: Math.min(1, Math.max(0, progress / 100)),
    transition: {
      duration: 0.35,
      ease: easings.smooth,
    },
  }),
};
