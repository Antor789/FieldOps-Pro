import React from 'react';
import { motion } from 'motion/react';

export function ChartSkeleton({ height = 260, title = 'Loading Analytics...' }: { height?: number; title?: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between" style={{ minHeight: height }}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
        <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse" />
      </div>
      <div className="flex-1 flex items-end gap-3 pb-2 pt-4">
        {[40, 65, 30, 85, 95, 55, 70].map((h, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-t-lg"
              style={{ height: `${h}%` }}
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.1 }}
            />
            <div className="h-2 w-6 bg-slate-200 dark:bg-slate-800 rounded-xs" />
          </div>
        ))}
      </div>
      <div className="text-[11px] text-slate-400 text-center font-medium mt-2">
        {title}
      </div>
    </div>
  );
}
