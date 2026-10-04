import React from 'react';
import { motion } from 'motion/react';
import { easings } from '../../config/animations';

export const pageVariants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: easings.smooth,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.18,
      ease: easings.easeIn,
    },
  },
};

export const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: easings.smooth,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: easings.smooth,
    },
  }),
};

export function PageTransition({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
