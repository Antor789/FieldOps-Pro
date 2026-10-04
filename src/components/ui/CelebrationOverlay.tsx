import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, Award } from 'lucide-react';

interface CelebrationOverlayProps {
  show: boolean;
  onComplete?: () => void;
  title?: string;
  subtitle?: string;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  show,
  onComplete,
  title = 'Job Completed & Verified!',
  subtitle = 'NBR VAT invoice generated & SMS alert sent to customer',
}) => {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; color: string; delay: number }[]
  >([]);

  useEffect(() => {
    if (show) {
      const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#8B5CF6'];
      const newParticles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.4,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        onComplete?.();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      {/* Floating Confetti Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full animate-confetti"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Center Celebration Card */}
      <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-300 dark:border-emerald-700/80 rounded-3xl p-6 text-center shadow-2xl shadow-emerald-500/20 max-w-sm w-full animate-scale-in">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Award className="w-8 h-8 animate-bounce" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
