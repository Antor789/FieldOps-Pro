import { useState, useEffect } from 'react';

export function useReducedMotion(): {
  shouldReduceMotion: boolean;
  getAnimation: <T>(normalVariant: T, reducedVariant?: T) => T;
} {
  const [shouldReduceMotion, setShouldReduceMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event: MediaQueryListEvent) => {
      setShouldReduceMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const getAnimation = <T>(normalVariant: T, reducedVariant?: T): T => {
    if (shouldReduceMotion) {
      return (
        reducedVariant ||
        (({
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        } as unknown) as T)
      );
    }
    return normalVariant;
  };

  return { shouldReduceMotion, getAnimation };
}
