/**
 * FieldOps Pro - Chart Configuration & Color Palettes
 */

export const CHART_COLORS = {
  primary: '#4F46E5',
  secondary: '#6366F1',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#EF4444',
  sky: '#0284C7',
  purple: '#8B5CF6',
  slate: '#64748B',
  indigoLight: '#EEF2FF',
  emeraldLight: '#ECFDF5',
  amberLight: '#FFFBEB',
  roseLight: '#FEF2F2',
};

export const getChartTheme = (isDark: boolean) => ({
  textColor: isDark ? '#94A3B8' : '#64748B',
  gridColor: isDark ? '#1E293B' : '#E2E8F0',
  tooltipBg: isDark ? '#0F172A' : '#FFFFFF',
  tooltipBorder: isDark ? '#334155' : '#E2E8F0',
  tooltipText: isDark ? '#F8FAFC' : '#0F172A',
});
