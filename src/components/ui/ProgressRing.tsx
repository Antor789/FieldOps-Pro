import React from 'react';

export interface ProgressRingProps {
  progressPercent: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  remainingText?: string;
  isBreached?: boolean;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progressPercent,
  size = 36,
  strokeWidth = 3,
  remainingText,
  isBreached = false,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Normalized offset (100% means 0 offset)
  const offset = circumference - (Math.min(Math.max(progressPercent, 0), 100) / 100) * circumference;

  // Dynamic SLA color shifting based on remaining percentage
  let strokeColor = '#10B981'; // Emerald
  if (isBreached || progressPercent <= 15) {
    strokeColor = '#EF4444'; // Crimson Red
  } else if (progressPercent <= 40) {
    strokeColor = '#F59E0B'; // Amber Orange
  }

  return (
    <div className={`relative inline-flex items-center justify-center font-mono ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {remainingText && (
        <span
          className={`absolute text-[9px] font-extrabold tracking-tighter ${
            isBreached ? 'text-red-600 animate-pulse' : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          {remainingText}
        </span>
      )}
    </div>
  );
};
