import React from 'react';
import { Award, TrendingUp, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

interface NPSGaugeProps {
  score: number; // -100 to +100
  promotersPercent: number;
  passivesPercent: number;
  detractorsPercent: number;
  totalResponses?: number;
}

export const NPSGauge: React.FC<NPSGaugeProps> = ({
  score,
  promotersPercent,
  passivesPercent,
  detractorsPercent,
  totalResponses = 156,
}) => {
  // Score status color
  const getScoreColor = (val: number) => {
    if (val >= 50) return 'text-emerald-500 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/80';
    if (val >= 0) return 'text-amber-500 border-amber-500 bg-amber-50 dark:bg-amber-950/80';
    return 'text-red-500 border-red-500 bg-red-50 dark:bg-red-950/80';
  };

  const getScoreZone = (val: number) => {
    if (val >= 70) return 'World Class (+70 to +100)';
    if (val >= 50) return 'Excellent (+50 to +69)';
    if (val >= 0) return 'Good (0 to +49)';
    return 'Needs Attention (< 0)';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
            Net Promoter Score (NPS)
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full text-slate-600 dark:text-slate-400">
          {totalResponses} Responses
        </span>
      </div>

      {/* Main Circular Score Badge */}
      <div className="flex flex-col items-center justify-center py-2 space-y-2">
        <div
          className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center shadow-lg transition ${getScoreColor(
            score
          )}`}
        >
          <span className="text-3xl font-black font-mono tracking-tight">
            {score > 0 ? `+${score}` : score}
          </span>
          <span className="text-[10px] font-extrabold uppercase opacity-80 mt-0.5">NPS Index</span>
        </div>

        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
          {getScoreZone(score)}
        </span>
      </div>

      {/* Breakdown Bar */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${promotersPercent}%` }}
            className="bg-emerald-500 h-full transition-all duration-500"
            title={`Promoters: ${promotersPercent}%`}
          />
          <div
            style={{ width: `${passivesPercent}%` }}
            className="bg-amber-400 h-full transition-all duration-500"
            title={`Passives: ${passivesPercent}%`}
          />
          <div
            style={{ width: `${detractorsPercent}%` }}
            className="bg-red-500 h-full transition-all duration-500"
            title={`Detractors: ${detractorsPercent}%`}
          />
        </div>

        <div className="grid grid-cols-3 text-center text-[10px] font-mono font-bold pt-1">
          <div className="text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
            <ThumbsUp className="w-3 h-3" /> Promoters ({promotersPercent}%)
          </div>
          <div className="text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
            <Minus className="w-3 h-3" /> Passives ({passivesPercent}%)
          </div>
          <div className="text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
            <ThumbsDown className="w-3 h-3" /> Detractors ({detractorsPercent}%)
          </div>
        </div>
      </div>
    </div>
  );
};
