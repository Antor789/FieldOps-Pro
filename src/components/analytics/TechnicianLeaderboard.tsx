import React from 'react';
import { TechnicianLeaderboardItem } from '../../data/sampleAnalyticsData';
import { formatBDT } from '../../utils/formatters';
import { Star, TrendingUp, TrendingDown, Minus, Award } from 'lucide-react';
import { motion } from 'motion/react';

export interface TechnicianLeaderboardProps {
  technicians: TechnicianLeaderboardItem[];
  onViewAll?: () => void;
  locale?: 'en' | 'bn';
}

export function TechnicianLeaderboard({
  technicians,
  onViewAll,
  locale = 'en',
}: TechnicianLeaderboardProps) {
  const getMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `${rank}`;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🏆</span>
            <span>{locale === 'bn' ? 'শীর্ষ পারফর্মার টেকনিশিয়ান' : 'Technician Performance Leaderboard'}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {locale === 'bn' ? 'সম্পন্ন কাজ, গ্রাহক রেটিং ও রাজস্বের ভিত্তিতে র‍্যাঙ্কিং' : 'Ranked by jobs completed, SLA compliance and customer score'}
          </p>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {locale === 'bn' ? 'সকল দেখুন →' : 'View All →'}
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold tracking-wide uppercase text-[10px]">
              <th className="pb-2.5 pl-2">#</th>
              <th className="pb-2.5">{locale === 'bn' ? 'টেকনিশিয়ান' : 'Technician'}</th>
              <th className="pb-2.5 text-center">{locale === 'bn' ? 'কাজ' : 'Jobs'}</th>
              <th className="pb-2.5">{locale === 'bn' ? 'রাজস্ব' : 'Revenue'}</th>
              <th className="pb-2.5">{locale === 'bn' ? 'রেটিং' : 'Rating'}</th>
              <th className="pb-2.5">{locale === 'bn' ? 'এসএলএ' : 'SLA %'}</th>
              <th className="pb-2.5 text-right pr-2">{locale === 'bn' ? 'ট্রেন্ড' : 'Trend'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {technicians.map((tech, idx) => (
              <motion.tr
                key={tech.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-3 pl-2 font-mono font-bold text-sm">
                  {getMedal(tech.rank)}
                </td>
                <td className="py-3 pr-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {tech.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {locale === 'bn' && tech.nameBn ? tech.nameBn : tech.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {tech.role}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                  {tech.jobs}
                </td>
                <td className="py-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {formatBDT(tech.revenue, locale)}
                </td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-500">
                    <Star className="w-3 h-3 fill-current" />
                    {tech.rating}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {tech.sla}%
                    </span>
                  </div>
                </td>
                <td className="py-3 text-right pr-2">
                  {tech.trend === 'up' && (
                    <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +{tech.trendValue}
                    </span>
                  )}
                  {tech.trend === 'down' && (
                    <span className="inline-flex items-center text-rose-500 font-semibold gap-0.5">
                      <TrendingDown className="w-3.5 h-3.5" />
                      -{tech.trendValue}
                    </span>
                  )}
                  {tech.trend === 'stable' && (
                    <span className="inline-flex items-center text-slate-400 gap-0.5">
                      <Minus className="w-3.5 h-3.5" />
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
