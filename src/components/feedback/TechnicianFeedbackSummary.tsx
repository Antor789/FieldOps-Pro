import React from 'react';
import { TechnicianFeedbackRating } from '../../types/feedback';
import { Award, Star, Clock, Wrench, ThumbsUp, MessageSquare } from 'lucide-react';

interface TechnicianFeedbackSummaryProps {
  ratings: TechnicianFeedbackRating[];
}

export const TechnicianFeedbackSummary: React.FC<TechnicianFeedbackSummaryProps> = ({
  ratings,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
            Technician Performance & CSAT Ratings
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 rounded-full">
          Leaderboard
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ratings.map((rate) => (
          <div
            key={rate.technicianId}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3 text-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                    {rate.technicianAvatar || rate.technicianName[0]}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-slate-100">
                      {rate.technicianName}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {rate.totalFeedbackCount} Surveys
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-black text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    ⭐ {rate.avgRating}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono block">NPS: +{rate.npsScore}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 mt-2.5">
                {rate.badges.map((b, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800"
                  >
                    {b}
                  </span>
                ))}
              </div>

              {rate.latestComment && (
                <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 italic mt-2.5">
                  "{rate.latestComment}"
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2">
              <div>Punctuality: <strong className="text-slate-800 dark:text-slate-200">{rate.punctualityAvg}</strong></div>
              <div>Quality: <strong className="text-slate-800 dark:text-slate-200">{rate.workQualityAvg}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
