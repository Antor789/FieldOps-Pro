import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatBDT, formatNumber } from '../../utils/formatters';

export interface MetricCardProps {
  title: string;
  titleBn?: string;
  value: number;
  format?: 'number' | 'currency' | 'percentage' | 'duration';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label: string;
    labelBn?: string;
  };
  sparkline?: number[];
  icon: React.ReactNode;
  color: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky';
  onClick?: () => void;
  isLoading?: boolean;
  locale?: 'en' | 'bn';
}

export function MetricCard({
  title,
  titleBn,
  value,
  format = 'number',
  trend,
  sparkline = [12, 16, 14, 22, 18, 26, 24],
  icon,
  color = 'indigo',
  onClick,
  isLoading = false,
  locale = 'en',
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 600;
    const increment = Math.ceil((end - start) / (duration / 25));
    
    if (end === 0) {
      setDisplayValue(0);
      return;
    }

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [value]);

  const colorStyles = {
    indigo: {
      bg: 'bg-indigo-50/70 dark:bg-indigo-950/30',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-100 dark:border-indigo-900/40',
      spark: '#6366F1',
    },
    emerald: {
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/40',
      spark: '#10B981',
    },
    amber: {
      bg: 'bg-amber-50/70 dark:bg-amber-950/30',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/40',
      spark: '#F59E0B',
    },
    rose: {
      bg: 'bg-rose-50/70 dark:bg-rose-950/30',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-900/40',
      spark: '#EF4444',
    },
    sky: {
      bg: 'bg-sky-50/70 dark:bg-sky-950/30',
      text: 'text-sky-600 dark:text-sky-400',
      border: 'border-sky-100 dark:border-sky-900/40',
      spark: '#0284C7',
    },
  };

  const currentTheme = colorStyles[color];

  const formatOutput = (val: number) => {
    switch (format) {
      case 'currency':
        return formatBDT(val, locale);
      case 'percentage':
        return locale === 'bn' ? `${formatNumber(val, 'bn')}%` : `${val.toFixed(1)}%`;
      case 'duration':
        return locale === 'bn' ? `${formatNumber(val, 'bn')} মি.` : `${val} min`;
      default:
        return formatNumber(val, locale);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs animate-pulse">
        <div className="flex justify-between items-center mb-3">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="h-7 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
        <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800/60 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)' }}
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border ${currentTheme.border} rounded-2xl p-5 shadow-xs transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
            {locale === 'bn' && titleBn ? titleBn : title}
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${currentTheme.bg} ${currentTheme.text}`}>
            {icon}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-slate-50 font-mono tracking-tight">
            {formatOutput(displayValue)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80">
        {trend && (
          <div className="flex items-center gap-1.5 text-xs font-medium">
            {trend.direction === 'up' && (
              <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                {trend.value > 0 ? `+${trend.value}%` : `${trend.value}%`}
              </span>
            )}
            {trend.direction === 'down' && (
              <span className="inline-flex items-center text-rose-600 dark:text-rose-400 font-semibold gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                {trend.value}%
              </span>
            )}
            {trend.direction === 'neutral' && (
              <span className="inline-flex items-center text-slate-500 gap-0.5">
                <Minus className="w-3.5 h-3.5" />
                {trend.value}%
              </span>
            )}
            <span className="text-slate-400 text-[11px] truncate">
              {locale === 'bn' && trend.labelBn ? trend.labelBn : trend.label}
            </span>
          </div>
        )}

        {/* Mini Sparkline SVG */}
        <div className="w-16 h-6">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 60 20">
            <polyline
              fill="none"
              stroke={currentTheme.spark}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparkline
                .map((val, i) => {
                  const x = (i / (sparkline.length - 1)) * 60;
                  const max = Math.max(...sparkline);
                  const min = Math.min(...sparkline);
                  const range = max - min || 1;
                  const y = 20 - ((val - min) / range) * 16 - 2;
                  return `${x},${y}`;
                })
                .join(' ')}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
