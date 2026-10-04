import { easings } from '../../config/animations';

export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.18 },
  },
};

export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 16,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.14, ease: easings.easeIn },
  },
};

export const drawerVariants = {
  left: {
    hidden: { x: "-100%" },
    visible: { 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 320,
        damping: 30,
      },
    },
    exit: { x: "-100%", transition: { duration: 0.2 } },
  },
  right: {
    hidden: { x: "100%" },
    visible: { 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 320,
        damping: 30,
      },
    },
    exit: { x: "100%", transition: { duration: 0.2 } },
  },
  bottom: {
    hidden: { y: "100%" },
    visible: { 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 320,
        damping: 30,
      },
    },
    exit: { y: "100%", transition: { duration: 0.2 } },
  },
};

export const bottomSheetVariants = {
  hidden: { y: "100%" },
  partial: { 
    y: "50%",
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
  full: { 
    y: "0%",
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
  closed: { 
    y: "100%",
    transition: { duration: 0.2, ease: easings.easeIn },
  },
};
