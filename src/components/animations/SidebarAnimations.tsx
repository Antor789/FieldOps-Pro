import { easings } from '../../config/animations';

export const sidebarVariants = {
  expanded: {
    width: 256,
    transition: {
      duration: 0.28,
      ease: easings.smooth,
      when: "beforeChildren",
    },
  },
  collapsed: {
    width: 72,
    transition: {
      duration: 0.28,
      ease: easings.smooth,
      when: "afterChildren",
    },
  },
};

export const navTextVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    display: "block",
    transition: {
      duration: 0.18,
      delay: 0.08,
    },
  },
  collapsed: {
    opacity: 0,
    x: -8,
    transitionEnd: {
      display: "none",
    },
    transition: {
      duration: 0.1,
    },
  },
};

export const navItemVariants = {
  idle: {
    backgroundColor: "transparent",
  },
  hover: {
    backgroundColor: "rgba(79, 70, 229, 0.08)",
    transition: { duration: 0.12 },
  },
  active: {
    backgroundColor: "rgba(79, 70, 229, 0.12)",
    borderLeftColor: "rgb(79, 70, 229)",
    borderLeftWidth: 3,
  },
};

export const tooltipVariants = {
  hidden: {
    opacity: 0,
    x: -8,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.15,
      ease: easings.snappy,
    },
  },
};

export const badgeVariants = {
  initial: { scale: 0 },
  animate: { 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 450,
      damping: 16,
    },
  },
  pulse: {
    scale: [1, 1.18, 1],
    transition: {
      duration: 0.25,
    },
  },
};
