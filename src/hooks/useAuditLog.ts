import { useState, useMemo, useCallback } from 'react';
import { AuditEntry, AuditFilterParams, AuditStatsSummary } from '../types/audit';
import { INITIAL_AUDIT_ENTRIES } from '../data/mockAuditData';
import { exportAuditLogsToCSV, exportAuditLogsToPDF } from '../utils/auditFormatter';
import { useToast } from '../context/ToastContext';

export function useAuditLog(initialPageSize = 50) {
  const { addToast } = useToast();

  const [logs] = useState<AuditEntry[]>(INITIAL_AUDIT_ENTRIES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const [filters, setFiltersState] = useState<AuditFilterParams>({
    searchQuery: '',
    dateRangePreset: 'all',
    userIds: [],
    categories: [],
    severities: [],
  });

  const setFilters = useCallback((newFilters: Partial<AuditFilterParams>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({
      searchQuery: '',
      dateRangePreset: 'all',
      userIds: [],
      categories: [],
      severities: [],
    });
    setCurrentPage(1);
  }, []);

  // Filtered entries
  const filteredLogs = useMemo(() => {
    return logs.filter((entry) => {
      // Search
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matches =
          entry.userName.toLowerCase().includes(query) ||
          entry.action.toLowerCase().includes(query) ||
          entry.description.toLowerCase().includes(query) ||
          entry.resourceId.toLowerCase().includes(query) ||
          entry.metadata.ip.includes(query) ||
          (entry.metadata.location && entry.metadata.location.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // User filter
      if (filters.userIds && filters.userIds.length > 0) {
        if (!filters.userIds.includes(entry.userId)) return false;
      }

      // Category filter
      if (filters.categories && filters.categories.length > 0) {
        if (!filters.categories.includes(entry.category)) return false;
      }

      // Severity filter
      if (filters.severities && filters.severities.length > 0) {
        if (!filters.severities.includes(entry.severity)) return false;
      }

      // Date Range filter
      if (filters.dateRangePreset && filters.dateRangePreset !== 'all') {
        const entryTime = new Date(entry.timestamp).getTime();
        const now = Date.now();
        if (filters.dateRangePreset === 'today') {
          const startOfToday = new Date().setHours(0, 0, 0, 0);
          if (entryTime < startOfToday) return false;
        } else if (filters.dateRangePreset === 'yesterday') {
          const startOfYesterday = new Date(now - 86400 * 1000).setHours(0, 0, 0, 0);
          const endOfYesterday = new Date(now - 86400 * 1000).setHours(23, 59, 59, 999);
          if (entryTime < startOfYesterday || entryTime > endOfYesterday) return false;
        } else if (filters.dateRangePreset === '7days') {
          if (entryTime < now - 7 * 86400 * 1000) return false;
        } else if (filters.dateRangePreset === '30days') {
          if (entryTime < now - 30 * 86400 * 1000) return false;
        }
      }

      return true;
    });
  }, [logs, filters]);

  // Paginated entries
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Export logs
  const exportLogs = useCallback(
    async (format: 'csv' | 'pdf') => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (format === 'csv') {
        exportAuditLogsToCSV(filteredLogs);
        addToast({
          title: 'CSV Export Generated',
          description: `Downloaded ${filteredLogs.length} audit entries.`,
          type: 'success',
        });
      } else {
        exportAuditLogsToPDF(filteredLogs);
        addToast({
          title: 'PDF Audit Trail Generated',
          description: `Downloaded ${filteredLogs.length} audit entries as printable PDF.`,
          type: 'success',
        });
      }

      setIsLoading(false);
    },
    [filteredLogs, addToast]
  );

  // Statistics Summary
  const statsSummary: AuditStatsSummary = useMemo(() => {
    const now = Date.now();
    const startOfToday = new Date().setHours(0, 0, 0, 0);

    let warningsCount = 0;
    let criticalCount = 0;
    let todayCount = 0;

    const actionCounts: Record<string, { count: number; category: any }> = {};
    const userCounts: Record<string, { name: string; role: string; count: number }> = {};
    const trendMap: Record<string, { info: number; warning: number; critical: number }> = {};

    logs.forEach((log) => {
      const time = new Date(log.timestamp).getTime();
      if (log.severity === 'warning') warningsCount++;
      if (log.severity === 'critical') criticalCount++;
      if (time >= startOfToday) todayCount++;

      // Action count
      if (!actionCounts[log.action]) {
        actionCounts[log.action] = { count: 0, category: log.category };
      }
      actionCounts[log.action].count++;

      // User count
      if (!userCounts[log.userId]) {
        userCounts[log.userId] = { name: log.userName, role: log.userRole, count: 0 };
      }
      userCounts[log.userId].count++;

      // 7-day trend
      const dateKey = new Date(log.timestamp).toISOString().split('T')[0];
      if (!trendMap[dateKey]) {
        trendMap[dateKey] = { info: 0, warning: 0, critical: 0 };
      }
      trendMap[dateKey][log.severity]++;
    });

    const topActions = Object.entries(actionCounts)
      .map(([action, val]) => ({ action, count: val.count, category: val.category }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const mostActiveUsers = Object.entries(userCounts)
      .map(([userId, val]) => ({ userId, userName: val.name, role: val.role, count: val.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const dailyActivityTrend = Object.entries(trendMap)
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);

    // Score calculation
    const securityScore = Math.max(70, Math.min(99, 100 - Math.floor(criticalCount * 1.5)));

    return {
      totalLogs: logs.length,
      warningsCount,
      criticalCount,
      todayCount,
      securityScore,
      topActions,
      mostActiveUsers,
      dailyActivityTrend,
    };
  }, [logs]);

  return {
    logs,
    filteredLogs,
    paginatedLogs,
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize,
    setPageSize,
    isLoading,
    filters,
    setFilters,
    clearFilters,
    exportLogs,
    statsSummary,
  };
}
