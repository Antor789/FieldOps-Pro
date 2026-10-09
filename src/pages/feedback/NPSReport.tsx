import React from 'react';
import { useNPS } from '../../hooks/useNPS';
import { NPSGauge } from '../../components/feedback/NPSGauge';
import { Award, TrendingUp, ThumbsUp, ThumbsDown, MessageSquare, BarChart2, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const NPSReport: React.FC = () => {
  const { npsScore, promotersPercent, passivesPercent, detractorsPercent, totalResponses, trend } = useNPS();

  return (
    <div className="space-y-6 pb-12 animate-fadeIn font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-extrabold text-white">Net Promoter Score (NPS) Executive Report</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Customer loyalty index, 6-month historical trend & verbatim customer sentiment
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => window.print()}
          className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 font-bold"
        >
          Print Report
        </Button>
      </div>

      {/* NPS Gauge & Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NPSGauge
          score={npsScore}
          promotersPercent={promotersPercent}
          passivesPercent={passivesPercent}
          detractorsPercent={detractorsPercent}
          totalResponses={totalResponses}
        />

        {/* 6-Month Trend Bars (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                6-Month NPS Trend Progress
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              +28 Points Growth
            </span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {trend.map((item) => (
              <div key={item.month} className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{item.month}</span>
                  <span className="font-extrabold text-amber-600 dark:text-amber-400">
                    +{item.npsScore} NPS ({item.totalResponses} Responses)
                  </span>
                </div>

                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${item.promoters}%` }} className="bg-emerald-500 h-full" />
                  <div style={{ width: `${item.passives}%` }} className="bg-amber-400 h-full" />
                  <div style={{ width: `${item.detractors}%` }} className="bg-red-500 h-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
