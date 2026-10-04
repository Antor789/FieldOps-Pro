import { useState, useEffect, useCallback } from 'react';
import { AnalyticsData, sampleAnalyticsData } from '../data/sampleAnalyticsData';

export interface AnalyticsFilters {
  period: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'custom';
  division?: string;
  serviceType?: string;
  technician?: string;
}

export function useAnalytics(initialFilters?: Partial<AnalyticsFilters>) {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    period: 'last7days',
    division: 'ALL',
    serviceType: 'ALL',
    technician: 'ALL',
    ...initialFilters,
  });

  const [data, setData] = useState<AnalyticsData>(sampleAnalyticsData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  const refresh = useCallback(() => {
    setIsLoading(true);
    // Simulate API fetch
    setTimeout(() => {
      setData({
        ...sampleAnalyticsData,
        totalJobs: sampleAnalyticsData.totalJobs + Math.floor(Math.random() * 3) - 1,
      });
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 400);
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      refresh();
    }, 45000);
    return () => clearInterval(interval);
  }, [autoRefresh, refresh]);

  return {
    data,
    filters,
    setFilters,
    isLoading,
    lastUpdated,
    autoRefresh,
    setAutoRefresh,
    refresh,
  };
}
