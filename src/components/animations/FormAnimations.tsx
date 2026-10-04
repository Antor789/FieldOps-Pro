export const floatingLabelVariants = {
  default: {
    y: 0,
    scale: 1,
  },
  focused: {
    y: -22,
    scale: 0.82,
    transition: { duration: 0.16 },
  },
  filled: {
    y: -22,
    scale: 0.82,
  },
};

export const inputRingVariants = {
  idle: {
    boxShadow: "0 0 0 0 transparent",
  },
  focus: {
    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.18)",
    transition: { duration: 0.14 },
  },
  error: {
    boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.2)",
  },
};

export const errorMessageVariants = {
  hidden: {
    opacity: 0,
    y: -6,
    height: 0,
  },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: {
      duration: 0.18,
    },
  },
};

export const checkboxVariants = {
  unchecked: { scale: 0, opacity: 0 },
  checked: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 18,
    },
  },
};

export const toggleVariants = {
  off: { x: 2 },
  on: { 
    x: 20,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 28,
    },
  },
};
