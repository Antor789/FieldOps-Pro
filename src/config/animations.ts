/**
 * FieldOps Pro - Enterprise Motion Design & Animation Tokens
 * 60fps hardware-accelerated cubic-bezier curves, springs, and timing definitions.
 */

export const easings = {
  // Standard Web easings
  easeOut: [0.0, 0.0, 0.2, 1] as const,
  easeIn: [0.4, 0.0, 1, 1] as const,
  easeInOut: [0.4, 0.0, 0.2, 1] as const,

  // Custom branded SaaS easings
  smooth: [0.4, 0.0, 0.2, 1] as const,
  snappy: [0.2, 0.0, 0, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  elastic: [0.68, -0.6, 0.32, 1.6] as const,

  // Spring configurations for physics-based micro-interactions
  spring: {
    gentle: { type: "spring", stiffness: 120, damping: 14 },
    snappy: { type: "spring", stiffness: 300, damping: 20 },
    bouncy: { type: "spring", stiffness: 400, damping: 10 },
    stiff: { type: "spring", stiffness: 500, damping: 25 },
  }
};

export const durations = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  slower: 0.6,
};

export const staggers = {
  fast: 0.03,
  normal: 0.05,
  slow: 0.08,
};
