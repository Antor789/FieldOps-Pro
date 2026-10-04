import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocity: {
    x: number;
    y: number;
  };
}

export function Confetti({ 
  isActive, 
  duration = 2800,
  particleCount = 45 
}: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    if (isActive) {
      const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocity: {
          x: (Math.random() - 0.5) * 16,
          y: Math.random() * 8 + 5,
        },
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => setParticles([]), duration);
      return () => clearTimeout(timer);
    }
  }, [isActive, duration, particleCount]);
  
  if (!isActive && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-sm"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          initial={{
            y: -20,
            opacity: 1,
            rotate: particle.rotation,
          }}
          animate={{
            y: typeof window !== 'undefined' ? window.innerHeight + 80 : 800,
            x: particle.velocity.x * 40,
            opacity: [1, 1, 0],
            rotate: particle.rotation + 720,
          }}
          transition={{
            duration: 2.2 + Math.random() * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export const successCheckVariants = {
  hidden: {
    scale: 0.7,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 220,
      damping: 16,
    },
  },
};

export const circleDrawVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export const checkDrawVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      delay: 0.25,
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

export function SuccessCelebrationOverlay({ 
  isVisible,
  title = "Job Completed! 🎉",
  subtitle = "কাজ সম্পন্ন হয়েছে!",
  onClose,
}: { 
  isVisible: boolean;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col items-center max-w-sm w-full text-center"
            variants={successCheckVariants}
            initial="hidden"
            animate="visible"
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="72" height="72" viewBox="0 0 80 80">
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="#10B981"
                strokeWidth="4.5"
                variants={circleDrawVariants}
                initial="hidden"
                animate="visible"
              />
              <motion.path
                d="M24 42 L34 52 L56 30"
                fill="none"
                stroke="#10B981"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={checkDrawVariants}
                initial="hidden"
                animate="visible"
              />
            </svg>
            <motion.p
              className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              {title}
            </motion.p>
            <motion.p
              className="text-sm text-slate-500 dark:text-slate-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {subtitle}
            </motion.p>
          </motion.div>
          <Confetti isActive={isVisible} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
