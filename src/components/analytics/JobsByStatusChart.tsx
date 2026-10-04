import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { JobsByStatusData } from '../../data/sampleAnalyticsData';
import { useTheme } from '../../context/ThemeContext';
import { getChartTheme } from '../../utils/chartHelpers';
import { formatNumber } from '../../utils/formatters';

export interface JobsByStatusChartProps {
  data: JobsByStatusData[];
  total: number;
  locale?: 'en' | 'bn';
}

export function JobsByStatusChart({
  data,
  total,
  locale = 'en',
}: JobsByStatusChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const chartTheme = getChartTheme(isDark);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div className="mb-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>🍩</span>
          <span>{locale === 'bn' ? 'স্ট্যাটাস অনুযায়ী কাজের বিভাজন' : 'Jobs by Pipeline Status'}</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {locale === 'bn' ? 'মোট ওয়ার্ক অর্ডারের বর্তমান অবস্থা' : 'Active percentage distribution in Kanban'}
        </p>
      </div>

      <div className="h-56 w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={chartTheme.tooltipBg} strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: chartTheme.tooltipBg,
                borderColor: chartTheme.tooltipBorder,
                borderRadius: '12px',
                color: chartTheme.tooltipText,
                fontSize: '12px',
              }}
              formatter={(value: any, name: any, item: any) => [
                `${value} jobs (${item.payload.percentage}%)`,
                locale === 'bn' ? item.payload.labelBn : item.payload.label,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
            {formatNumber(total, locale)}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
            {locale === 'bn' ? 'মোট কাজ' : 'Total'}
          </span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        {data.map((item) => (
          <div key={item.status} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 dark:text-slate-300 truncate">
                {locale === 'bn' ? item.labelBn : item.label}
              </span>
            </div>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100 shrink-0">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
