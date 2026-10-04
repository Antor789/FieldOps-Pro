import React from 'react';

export const Skeleton: React.FC<{
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}> = ({ className = '', variant = 'rectangular' }) => {
  const variantClasses = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-3.5',
  }[variant];

  return (
    <div
      className={`animate-pulse bg-slate-200/80 dark:bg-slate-800/80 ${variantClasses} ${className}`}
    />
  );
};

export const KanbanSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {[1, 2, 3, 4, 5].map((col) => (
        <div
          key={col}
          className="bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 space-y-3"
        >
          {/* Column Header Skeleton */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-6 h-4 rounded-full" />
          </div>

          {/* Card Skeletons */}
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2.5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="w-14 h-3.5" />
                <Skeleton className="w-16 h-4" />
              </div>
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-3" />
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Skeleton className="w-20 h-4 rounded-lg" />
                <Skeleton className="w-12 h-4 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
