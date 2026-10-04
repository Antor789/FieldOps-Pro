import React, { useState, useCallback } from 'react';

export interface RippleItem {
  x: number;
  y: number;
  id: number;
}

export function useRipple() {
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now() + Math.random();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, []);

  const clearRipples = useCallback(() => {
    setRipples([]);
  }, []);

  return { ripples, createRipple, clearRipples };
}
