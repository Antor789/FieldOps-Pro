import React from 'react';

interface SLAProgressRingProps {
  remainingMinutes: number;
  totalMinutes?: number;
  progressPercent: number;
  isBreached: boolean;
  size?: number;
}

export const SLAProgressRing: React.FC<SLAProgressRingProps> = ({
  remainingMinutes,
  progressPercent,
  isBreached,
  size = 38,
}) => {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(progressPercent, 0), 100) / 100) * circumference;

  let strokeColor = '#10B981'; // Emerald
  if (isBreached || remainingMinutes <= 15) {
    strokeColor = '#EF4444'; // Red
  } else if (remainingMinutes <= 45) {
    strokeColor = '#F59E0B'; // Amber
  }

  let displayText = `${Math.max(0, remainingMinutes)}m`;
  if (remainingMinutes > 60) {
    const hours = Math.floor(remainingMinutes / 60);
    displayText = `${hours}h`;
  }
  if (isBreached) displayText = '!SLA';

  return (
    <div className="relative inline-flex items-center justify-center font-mono select-none">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
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
      <span
        className={`absolute text-[9px] font-extrabold tracking-tighter ${
          isBreached ? 'text-red-600 dark:text-red-400 animate-pulse font-mono' : 'text-slate-700 dark:text-slate-300'
        }`}
      >
        {displayText}
      </span>
    </div>
  );
};
