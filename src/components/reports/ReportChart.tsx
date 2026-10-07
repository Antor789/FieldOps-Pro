import React from 'react';
import { ReportChart as ReportChartType } from '../../types/reports';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export interface ReportChartProps {
  chart: ReportChartType;
  data: any[];
  locale?: 'en' | 'bn';
}

const PALETTE = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

export const ReportChart: React.FC<ReportChartProps> = ({ chart, data, locale = 'en' }) => {
  // Synthesize chart points from data if needed
  let chartData: any[] = [];

  if (chart.type === 'donut' || chart.type === 'pie') {
    // Aggregate by status or category
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const key = item[chart.labelKey] || item.status || item.serviceType || 'Other';
      counts[key] = (counts[key] || 0) + 1;
    });
    chartData = Object.keys(counts).map((name) => ({
      name,
      value: counts[name],
    }));
  } else if (chart.type === 'line' || chart.type === 'area') {
    // 7-day or monthly trends
    chartData = [
      { day: 'Mon', completed: 8, revenue: 38000, month: 'Week 1' },
      { day: 'Tue', completed: 11, revenue: 52000, month: 'Week 2' },
      { day: 'Wed', completed: 14, revenue: 64500, month: 'Week 3' },
      { day: 'Thu', completed: 9, revenue: 41000, month: 'Week 4' },
      { day: 'Fri', completed: 12, revenue: 58000, month: 'Week 5' },
      { day: 'Sat', completed: 7, revenue: 32000, month: 'Week 6' },
      { day: 'Sun', completed: 4, revenue: 18000, month: 'Week 7' },
    ];
  } else {
    // Bar chart: aggregate revenue by service or technician
    const agg: Record<string, number> = {};
    data.forEach((item) => {
      const key = item[chart.labelKey] || item.serviceType || item.technicianName || item.customerName || 'Standard';
      const val = typeof item[chart.dataKey] === 'number' ? item[chart.dataKey] : (item.amount || item.revenueBDT || 1);
      agg[key] = (agg[key] || 0) + val;
    });

    chartData = Object.keys(agg)
      .slice(0, 6)
      .map((k) => ({
        [chart.labelKey || 'name']: k,
        [chart.dataKey || 'amount']: agg[k],
      }));
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-4">
        {locale === 'bn' && chart.titleBangla ? chart.titleBangla : chart.title}
      </h4>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chart.type === 'donut' || chart.type === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={chart.type === 'donut' ? 55 : 0}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              {chart.showLegend !== false && <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />}
            </PieChart>
          ) : chart.type === 'line' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Line
                type="monotone"
                dataKey={chart.dataKey || 'completed'}
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10b981' }}
              />
            </LineChart>
          ) : chart.type === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Area
                type="monotone"
                dataKey={chart.dataKey || 'revenue'}
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorRev)"
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis
                dataKey={chart.labelKey || 'name'}
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
              />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey={chart.dataKey || 'amount'} fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
