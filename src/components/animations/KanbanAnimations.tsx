import { easings } from '../../config/animations';

export const columnVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.35,
      ease: easings.smooth,
    },
  }),
};

export const cardVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.96,
    y: 8,
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: easings.smooth,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.94,
    x: -16,
    transition: {
      duration: 0.18,
    },
  },
  hover: {
    y: -3,
    boxShadow: "0 10px 24px -4px rgba(15, 23, 42, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.05)",
    transition: {
      duration: 0.18,
    },
  },
  tap: {
    scale: 0.98,
  },
  drag: {
    scale: 1.025,
    rotate: 1.5,
    boxShadow: "0 20px 35px -5px rgba(15, 23, 42, 0.25), 0 10px 10px -5px rgba(15, 23, 42, 0.08)",
    zIndex: 100,
    cursor: "grabbing",
  },
};

export const dropZoneVariants = {
  inactive: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  active: {
    backgroundColor: "rgba(79, 70, 229, 0.04)",
    borderColor: "rgba(79, 70, 229, 0.35)",
    transition: {
      duration: 0.18,
    },
  },
  hover: {
    backgroundColor: "rgba(79, 70, 229, 0.08)",
    borderColor: "rgba(79, 70, 229, 0.6)",
    scale: 1.005,
  },
};

export const cardMoveVariants = {
  moving: {
    scale: 1.03,
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
    transition: { duration: 0.1 },
  },
  placed: {
    scale: 1,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    transition: { 
      type: "spring",
      stiffness: 320,
      damping: 22,
    },
  },
};
