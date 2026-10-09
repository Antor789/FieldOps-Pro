import React from 'react';
import { Star, BarChart3 } from 'lucide-react';

interface RatingBreakdownProps {
  distribution: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
  percentages: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
  totalCount: number;
  avgScore: number;
}

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({
  distribution,
  percentages,
  totalCount,
  avgScore,
}) => {
  const rows = [
    { stars: 5, count: distribution.fiveStar, percent: percentages.fiveStar },
    { stars: 4, count: distribution.fourStar, percent: percentages.fourStar },
    { stars: 3, count: distribution.threeStar, percent: percentages.threeStar },
    { stars: 2, count: distribution.twoStar, percent: percentages.twoStar },
    { stars: 1, count: distribution.oneStar, percent: percentages.oneStar },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-amber-500" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
            Rating Distribution ({avgScore} Avg)
          </h3>
        </div>
        <span className="text-xs font-mono font-extrabold text-amber-600 dark:text-amber-400">
          ⭐ {avgScore} / 5.0
        </span>
      </div>

      <div className="space-y-2 text-xs">
        {rows.map((row) => (
          <div key={row.stars} className="flex items-center space-x-3">
            <span className="w-12 font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-1">
              {row.stars} <Star className="w-3 h-3 fill-amber-400 text-amber-500 inline" />
            </span>

            <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${row.percent}%` }}
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
              />
            </div>

            <span className="w-16 font-mono text-[11px] text-slate-500 dark:text-slate-400 text-right shrink-0">
              {row.percent}% ({row.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
