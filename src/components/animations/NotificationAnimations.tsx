import { easings } from '../../config/animations';

export const toastVariants = {
  initial: {
    opacity: 0,
    y: -16,
    scale: 0.95,
    x: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.28,
      ease: easings.bounce,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    x: 80,
    transition: {
      duration: 0.18,
      ease: easings.easeIn,
    },
  },
};

export const toastProgressVariants = {
  initial: { scaleX: 1 },
  animate: (duration: number) => ({
    scaleX: 0,
    transition: {
      duration: duration / 1000,
      ease: "linear",
    },
  }),
};

export const bellShakeVariants = {
  idle: { rotate: 0 },
  ring: {
    rotate: [0, 14, -14, 10, -10, 4, -4, 0],
    transition: {
      duration: 0.55,
      ease: "easeInOut",
    },
  },
};

export const notificationDropdownVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.18,
      ease: easings.snappy,
      staggerChildren: 0.04,
    },
  },
};

export const notificationItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.18 },
  },
  hover: {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    x: 3,
  },
};
