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
import { formatBDT } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

export interface RevenueChartProps {
  locale?: 'en' | 'bn';
}

const SAMPLE_REVENUE_TREND = [
  { month: 'Feb', revenue: 110000 },
  { month: 'Mar', revenue: 145000 },
  { month: 'Apr', revenue: 180000 },
  { month: 'May', revenue: 220000 },
  { month: 'Jun', revenue: 260000 },
  { month: 'Jul', revenue: 310000 },
  { month: 'Aug', revenue: 290000 },
  { month: 'Sep', revenue: 350000 },
  { month: 'Oct', revenue: 390000 },
  { month: 'Nov', revenue: 340000 },
  { month: 'Dec', revenue: 420000 },
  { month: 'Jan', revenue: 450000 },
];

export const RevenueChart: React.FC<RevenueChartProps> = ({ locale = 'en' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={SAMPLE_REVENUE_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="custRevenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} vertical={false} />
          <XAxis dataKey="month" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
          <YAxis
            stroke={isDark ? '#64748b' : '#94a3b8'}
            fontSize={11}
            tickLine={false}
            tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              borderColor: isDark ? '#334155' : '#e2e8f0',
              borderRadius: '12px',
              fontSize: '12px',
            }}
            formatter={(value: any) => [formatBDT(Number(value), locale), 'Turnover']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#custRevenueGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
