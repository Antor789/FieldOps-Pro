import { easings } from '../../config/animations';

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.08,
    },
  },
};

export const listItemVariants = {
  hidden: { 
    opacity: 0, 
    y: 14,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    x: -16,
    transition: { duration: 0.15 },
  },
};

export const gridItemVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.03,
      duration: 0.25,
    },
  }),
};

export const reorderVariants = {
  initial: { scale: 1 },
  dragging: {
    scale: 1.02,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
    zIndex: 10,
  },
};
