/**
 * Framer Motion Animation Variants & Priority Color Standards
 * for FieldOps Pro Enhanced Work Order Cards
 */

export const cardVariants = {
  initial: { opacity: 0, y: 15, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
  hover: {
    y: -3,
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
    transition: { duration: 0.2 },
  },
  dragging: {
    scale: 1.02,
    rotate: 1.5,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    cursor: 'grabbing',
    zIndex: 50,
  },
};

export const priorityConfig = {
  EMERGENCY: {
    color: '#EF4444',
    border: 'border-l-red-500',
    bgLight: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-700 dark:text-red-400',
    badge: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800',
    label: 'EMERGENCY',
    labelBangla: 'জরুরী',
    pulse: true,
  },
  CRITICAL: {
    color: '#F97316',
    border: 'border-l-orange-500',
    bgLight: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-700 dark:text-orange-400',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    label: 'CRITICAL',
    labelBangla: 'গুরুত্বপূর্ণ',
    pulse: false,
  },
  HIGH: {
    color: '#F59E0B',
    border: 'border-l-amber-500',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-400',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    label: 'HIGH',
    labelBangla: 'উচ্চ',
    pulse: false,
  },
  MEDIUM: {
    color: '#6366F1',
    border: 'border-l-indigo-500',
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-400',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    label: 'MEDIUM',
    labelBangla: 'মাঝারি',
    pulse: false,
  },
  LOW: {
    color: '#94A3B8',
    border: 'border-l-slate-400',
    bgLight: 'bg-slate-50 dark:bg-slate-800/40',
    text: 'text-slate-700 dark:text-slate-400',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    label: 'LOW',
    labelBangla: 'সাধারণ',
    pulse: false,
  },
};
