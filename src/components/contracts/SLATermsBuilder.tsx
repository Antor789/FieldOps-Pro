import React from 'react';
import { PriorityLevel, SLATerm } from '../../types/contracts';
import { Shield, Clock, AlertTriangle, Zap, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface SLATermsBuilderProps {
  terms: SLATerm[];
  onChange: (terms: SLATerm[]) => void;
  className?: string;
  readOnly?: boolean;
}

const PRIORITY_METADATA: Record<
  PriorityLevel,
  { labelEn: string; labelBn: string; color: string; bg: string; badge: string }
> = {
  emergency: {
    labelEn: 'EMERGENCY',
    labelBn: 'জরুরি (P1)',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
    badge: 'bg-rose-600 text-white',
  },
  critical: {
    labelEn: 'CRITICAL',
    labelBn: 'মারাত্মক (P2)',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
    badge: 'bg-amber-600 text-white',
  },
  high: {
    labelEn: 'HIGH',
    labelBn: 'উচ্চ অগ্রাধিকার (P3)',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900',
    badge: 'bg-indigo-600 text-white',
  },
  medium: {
    labelEn: 'MEDIUM',
    labelBn: 'সাধারণ (P4)',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
    badge: 'bg-blue-600 text-white',
  },
  low: {
    labelEn: 'LOW',
    labelBn: 'কম অগ্রাধিকার (P5)',
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800',
    badge: 'bg-slate-500 text-white',
  },
};

export const SLATermsBuilder: React.FC<SLATermsBuilderProps> = ({
  terms,
  onChange,
  className = '',
  readOnly = false,
}) => {
  const handleFieldChange = (
    priority: PriorityLevel,
    field: keyof SLATerm,
    value: number
  ) => {
    const updated = terms.map((item) => {
      if (item.priority === priority) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  const applyPreset = (presetType: 'mission_critical' | 'standard' | 'relaxed') => {
    let newTerms: SLATerm[] = [];
    if (presetType === 'mission_critical') {
      newTerms = [
        { priority: 'emergency', responseTimeHours: 0.5, resolutionTimeHours: 2, penalty: 20000, uptimeGuaranteePercent: 99.99 },
        { priority: 'critical', responseTimeHours: 1, resolutionTimeHours: 4, penalty: 10000, uptimeGuaranteePercent: 99.9 },
        { priority: 'high', responseTimeHours: 2, resolutionTimeHours: 8, penalty: 5000, uptimeGuaranteePercent: 99.0 },
        { priority: 'medium', responseTimeHours: 4, resolutionTimeHours: 16, penalty: 2000, uptimeGuaranteePercent: 98.0 },
        { priority: 'low', responseTimeHours: 12, resolutionTimeHours: 36, penalty: 0, uptimeGuaranteePercent: 95.0 },
      ];
    } else if (presetType === 'standard') {
      newTerms = [
        { priority: 'emergency', responseTimeHours: 1, resolutionTimeHours: 4, penalty: 10000, uptimeGuaranteePercent: 99.9 },
        { priority: 'critical', responseTimeHours: 2, resolutionTimeHours: 8, penalty: 5000, uptimeGuaranteePercent: 99.5 },
        { priority: 'high', responseTimeHours: 4, resolutionTimeHours: 24, penalty: 2000, uptimeGuaranteePercent: 99.0 },
        { priority: 'medium', responseTimeHours: 8, resolutionTimeHours: 48, penalty: 1000, uptimeGuaranteePercent: 98.0 },
        { priority: 'low', responseTimeHours: 24, resolutionTimeHours: 72, penalty: 0, uptimeGuaranteePercent: 95.0 },
      ];
    } else {
      newTerms = [
        { priority: 'emergency', responseTimeHours: 2, resolutionTimeHours: 8, penalty: 3000, uptimeGuaranteePercent: 99.0 },
        { priority: 'critical', responseTimeHours: 4, resolutionTimeHours: 16, penalty: 1500, uptimeGuaranteePercent: 98.0 },
        { priority: 'high', responseTimeHours: 8, resolutionTimeHours: 36, penalty: 500, uptimeGuaranteePercent: 97.0 },
        { priority: 'medium', responseTimeHours: 24, resolutionTimeHours: 72, penalty: 0, uptimeGuaranteePercent: 95.0 },
        { priority: 'low', responseTimeHours: 48, resolutionTimeHours: 120, penalty: 0, uptimeGuaranteePercent: 90.0 },
      ];
    }
    onChange(newTerms);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header and Quick Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              SLA Commitment Matrix (সেবা অঙ্গীকার ম্যাট্রিক্স)
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Define guaranteed technician arrival, turnaround resolution, and breach penalties in BDT.
          </p>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mr-1">Presets:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyPreset('mission_critical')}
              className="text-[11px] h-7 px-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900"
            >
              <Zap className="w-3 h-3 mr-1" />
              24/7 Datacenter
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyPreset('standard')}
              className="text-[11px] h-7 px-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900"
            >
              Standard AMC
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyPreset('relaxed')}
              className="text-[11px] h-7 px-2.5 text-slate-700 dark:text-slate-300"
            >
              Basic
            </Button>
          </div>
        )}
      </div>

      {/* SLA Matrix Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-3">Priority Level</th>
              <th className="py-3 px-3">Max Response Time</th>
              <th className="py-3 px-3">Max Resolution Time</th>
              <th className="py-3 px-3">Penalty per Breach</th>
              <th className="py-3 px-3">Target Uptime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {terms.map((term) => {
              const meta = PRIORITY_METADATA[term.priority];
              return (
                <tr key={term.priority} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  {/* Priority Label */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${meta.badge}`}>
                        {meta.labelEn}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] hidden sm:inline">
                        {meta.labelBn}
                      </span>
                    </div>
                  </td>

                  {/* Response Time */}
                  <td className="py-2.5 px-3">
                    {readOnly ? (
                      <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {term.responseTimeHours} hr{term.responseTimeHours !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          min="0.1"
                          max="72"
                          value={term.responseTimeHours}
                          onChange={(e) =>
                            handleFieldChange(term.priority, 'responseTimeHours', parseFloat(e.target.value) || 0)
                          }
                          className="w-16 px-2 py-1 text-xs text-center font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                        <span className="text-slate-500 text-[11px]">hrs</span>
                      </div>
                    )}
                  </td>

                  {/* Resolution Time */}
                  <td className="py-2.5 px-3">
                    {readOnly ? (
                      <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        {term.resolutionTimeHours} hr{term.resolutionTimeHours !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="1"
                          min="0.5"
                          max="168"
                          value={term.resolutionTimeHours}
                          onChange={(e) =>
                            handleFieldChange(term.priority, 'resolutionTimeHours', parseFloat(e.target.value) || 0)
                          }
                          className="w-16 px-2 py-1 text-xs text-center font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                        <span className="text-slate-500 text-[11px]">hrs</span>
                      </div>
                    )}
                  </td>

                  {/* Breach Penalty in BDT */}
                  <td className="py-2.5 px-3">
                    {readOnly ? (
                      <span className="font-medium text-rose-600 dark:text-rose-400">
                        {term.penalty ? `৳${term.penalty.toLocaleString('en-IN')}` : 'None'}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 font-bold">৳</span>
                        <input
                          type="number"
                          step="500"
                          min="0"
                          value={term.penalty ?? 0}
                          onChange={(e) =>
                            handleFieldChange(term.priority, 'penalty', parseInt(e.target.value, 10) || 0)
                          }
                          className="w-20 px-2 py-1 text-xs text-right font-medium rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </td>

                  {/* Uptime Guarantee */}
                  <td className="py-2.5 px-3">
                    {readOnly ? (
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {term.uptimeGuaranteePercent ?? 99.0}%
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.1"
                          min="80"
                          max="99.99"
                          value={term.uptimeGuaranteePercent ?? 99.0}
                          onChange={(e) =>
                            handleFieldChange(term.priority, 'uptimeGuaranteePercent', parseFloat(e.target.value) || 0)
                          }
                          className="w-16 px-2 py-1 text-xs text-center font-medium rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                        <span className="text-slate-500 text-[11px]">%</span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
