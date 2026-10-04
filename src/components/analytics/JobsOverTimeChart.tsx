import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { JobsOverTimeData } from '../../data/sampleAnalyticsData';
import { useTheme } from '../../context/ThemeContext';
import { getChartTheme } from '../../utils/chartHelpers';

export interface JobsOverTimeChartProps {
  data: JobsOverTimeData[];
  period?: string;
  onPeriodChange?: (p: string) => void;
  locale?: 'en' | 'bn';
}

export function JobsOverTimeChart({
  data,
  period = 'daily',
  onPeriodChange,
  locale = 'en',
}: JobsOverTimeChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const chartTheme = getChartTheme(isDark);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>📈</span>
            <span>{locale === 'bn' ? 'কাজের গতিবিধি ও সমাপ্তি' : 'Jobs Over Time (Completed vs Created)'}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {locale === 'bn' ? 'গত ৭ দিনের তৈরি ও সম্পন্ন কাজের তুলনামূলক গ্রাফ' : 'Comparative trend for newly created vs resolved orders'}
          </p>
        </div>

        {onPeriodChange && (
          <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium self-start sm:self-auto">
            {['daily', 'weekly', 'monthly'].map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                  period === p
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {p === 'daily' ? (locale === 'bn' ? 'দৈনিক' : 'Daily') : p === 'weekly' ? (locale === 'bn' ? 'সাপ্তাহিক' : 'Weekly') : (locale === 'bn' ? 'মাসিক' : 'Monthly')}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} vertical={false} />
            <XAxis
              dataKey="displayDate"
              stroke={chartTheme.textColor}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={chartTheme.textColor}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltipBg,
                borderColor: chartTheme.tooltipBorder,
                borderRadius: '12px',
                color: chartTheme.tooltipText,
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
              }}
              formatter={(value: any, name: any) => [
                `${value} jobs`,
                name === 'completed' ? 'Completed' : 'Created',
              ]}
            />
            <Area
              type="monotone"
              dataKey="created"
              stroke="#4F46E5"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorCreated)"
              name="created"
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorCompleted)"
              name="completed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            {locale === 'bn' ? 'সম্পন্ন কাজ (Completed)' : 'Completed Jobs'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-600" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            {locale === 'bn' ? 'নতুন কাজ (Created)' : 'Created Orders'}
          </span>
        </div>
      </div>
    </div>
  );
}
