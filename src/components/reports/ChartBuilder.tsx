import React, { useState } from 'react';
import { ReportChart, ChartType, ReportColumn } from '../../types/reports';
import { BarChart, LineChart, PieChart, AreaChart, Plus, Trash2, LayoutDashboard } from 'lucide-react';

export interface ChartBuilderProps {
  charts: ReportChart[];
  columns: ReportColumn[];
  onAddChart: (chart: ReportChart) => void;
  onRemoveChart: (id: string) => void;
  locale?: 'en' | 'bn';
}

const CHART_TYPES: { type: ChartType; label: string; icon: any }[] = [
  { type: 'bar', label: 'Bar Chart', icon: BarChart },
  { type: 'line', label: 'Line Chart', icon: LineChart },
  { type: 'pie', label: 'Pie Chart', icon: PieChart },
  { type: 'donut', label: 'Donut Chart', icon: PieChart },
  { type: 'area', label: 'Area Chart', icon: AreaChart },
];

export const ChartBuilder: React.FC<ChartBuilderProps> = ({
  charts,
  columns,
  onAddChart,
  onRemoveChart,
  locale = 'en',
}) => {
  const [selectedType, setSelectedType] = useState<ChartType>('bar');
  const [chartTitle, setChartTitle] = useState('New Metric Visualization');
  const [dataKey, setDataKey] = useState(columns.find((c) => c.type === 'currency' || c.type === 'number')?.field || 'amount');
  const [labelKey, setLabelKey] = useState(columns.find((c) => c.type === 'string')?.field || 'name');

  const handleAdd = () => {
    if (!chartTitle) return;
    const newChart: ReportChart = {
      id: `chart-${Date.now().toString(36)}`,
      type: selectedType,
      title: chartTitle,
      dataKey: dataKey || 'amount',
      labelKey: labelKey || 'name',
      showLegend: true,
      showValues: true,
    };
    onAddChart(newChart);
    setChartTitle('Metric Visualization');
  };

  return (
    <div className="space-y-4">
      {/* Current Visualizations List */}
      {charts.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            {locale === 'bn' ? 'সংযুক্ত চার্টসমূহ' : 'Configured Report Visualizations'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {charts.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {c.title}
                    </h6>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Type: <span className="font-semibold uppercase">{c.type}</span> | Grouped by: {c.labelKey}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveChart(c.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Chart Form */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4">
        <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-emerald-500" />
          {locale === 'bn' ? 'নতুন চার্ট যোগ করুন' : 'Add Visualization to Report'}
        </h5>

        {/* Chart Type Selector */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {CHART_TYPES.map((t) => {
            const Icon = t.icon;
            const active = selectedType === t.type;
            return (
              <button
                key={t.type}
                type="button"
                onClick={() => setSelectedType(t.type)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  active
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px]">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Chart Configuration Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Chart Title
            </label>
            <input
              type="text"
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Data Field (Y-Axis / Metric)
            </label>
            <select
              value={dataKey}
              onChange={(e) => setDataKey(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              {columns.map((c) => (
                <option key={c.field} value={c.field}>
                  {c.header} ({c.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Category / Label Field (X-Axis)
            </label>
            <select
              value={labelKey}
              onChange={(e) => setLabelKey(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              {columns.map((c) => (
                <option key={c.field} value={c.field}>
                  {c.header} ({c.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="py-2 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{locale === 'bn' ? 'চার্ট নিশ্চিত করুন' : 'Attach Chart'}</span>
        </button>
      </div>
    </div>
  );
};
