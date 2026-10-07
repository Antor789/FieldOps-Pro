import { useState, useCallback } from 'react';
import { ReportBuilderConfig, ReportColumn, ReportChart, ReportTemplate, GeneratedReport } from '../types/reports';
import { AVAILABLE_FIELDS_BY_SOURCE } from '../data/reportTemplates';
import { generateFromCustomConfig } from '../utils/reportGenerator';
import { useToast } from '../context/ToastContext';

const DEFAULT_CONFIG: ReportBuilderConfig = {
  name: 'Custom Revenue Analysis',
  description: 'Enterprise monthly revenue analysis grouped by customer organization.',
  category: 'financial',
  dataSource: 'invoices',
  filters: {
    dateRange: 'this_month',
    customer: 'ALL',
    serviceType: 'ALL',
    paymentStatus: 'ALL',
    division: 'ALL',
  },
  columns: [
    { field: 'invoiceNumber', header: 'Invoice Date', type: 'string', width: 120, sortable: true },
    { field: 'customerName', header: 'Customer Name', type: 'string', width: 170, sortable: true },
    { field: 'serviceType', header: 'Service Type', type: 'string', width: 130, sortable: true },
    { field: 'subtotal', header: 'Subtotal (BDT)', type: 'currency', width: 130, align: 'right', aggregation: 'sum' },
    { field: 'vatAmount', header: 'VAT Amount (15%)', type: 'currency', width: 120, align: 'right', aggregation: 'sum' },
    { field: 'totalAmount', header: 'Total Amount (BDT)', type: 'currency', width: 130, align: 'right', aggregation: 'sum' },
    { field: 'paymentStatus', header: 'Payment Status', type: 'status', width: 110, sortable: true },
  ],
  groupBy: 'customerName',
  sortBy: 'date',
  sortOrder: 'desc',
  showSubtotals: true,
  charts: [
    {
      id: 'custom-bar-1',
      type: 'bar',
      title: 'Total Amount by Customer (BDT)',
      dataKey: 'amount',
      labelKey: 'customer',
      showValues: true,
    },
    {
      id: 'custom-pie-1',
      type: 'pie',
      title: 'Revenue Share by Service Type',
      dataKey: 'amount',
      labelKey: 'service',
      showLegend: true,
    },
  ],
};

export function useReportBuilder() {
  const { addToast } = useToast();
  const [step, setStep] = useState<number>(1);
  const [config, setConfig] = useState<ReportBuilderConfig>(DEFAULT_CONFIG);
  const [previewReport, setPreviewReport] = useState<GeneratedReport | null>(null);

  // Set Data Source and reset columns to the source defaults
  const setDataSource = useCallback((source: ReportBuilderConfig['dataSource']) => {
    const available = AVAILABLE_FIELDS_BY_SOURCE[source] || [];
    const defaultCols = available.slice(0, 6);

    setConfig((prev) => ({
      ...prev,
      dataSource: source,
      columns: defaultCols,
      groupBy: defaultCols[1]?.field,
      sortBy: defaultCols[0]?.field,
    }));
  }, []);

  // Update builder fields
  const setName = useCallback((name: string) => {
    setConfig((prev) => ({ ...prev, name }));
  }, []);

  const setDescription = useCallback((description: string) => {
    setConfig((prev) => ({ ...prev, description }));
  }, []);

  const setCategory = useCallback((category: ReportBuilderConfig['category']) => {
    setConfig((prev) => ({ ...prev, category }));
  }, []);

  const setFilter = useCallback((field: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      filters: { ...prev.filters, [field]: value },
    }));
  }, []);

  // Columns manipulation
  const addColumn = useCallback((column: ReportColumn) => {
    setConfig((prev) => {
      if (prev.columns.some((c) => c.field === column.field)) return prev;
      return { ...prev, columns: [...prev.columns, column] };
    });
  }, []);

  const removeColumn = useCallback((field: string) => {
    setConfig((prev) => ({
      ...prev,
      columns: prev.columns.filter((c) => c.field !== field),
    }));
  }, []);

  const reorderColumns = useCallback((fromIndex: number, toIndex: number) => {
    setConfig((prev) => {
      const nextCols = [...prev.columns];
      const [moved] = nextCols.splice(fromIndex, 1);
      nextCols.splice(toIndex, 0, moved);
      return { ...prev, columns: nextCols };
    });
  }, []);

  // Grouping & Sorting
  const setGroupBy = useCallback((field: string) => {
    setConfig((prev) => ({ ...prev, groupBy: field }));
  }, []);

  const setSortBy = useCallback((field: string, order: 'asc' | 'desc') => {
    setConfig((prev) => ({ ...prev, sortBy: field, sortOrder: order }));
  }, []);

  const setShowSubtotals = useCallback((show: boolean) => {
    setConfig((prev) => ({ ...prev, showSubtotals: show }));
  }, []);

  // Charts
  const addChart = useCallback((chart: ReportChart) => {
    setConfig((prev) => ({
      ...prev,
      charts: [...prev.charts, chart],
    }));
  }, []);

  const removeChart = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      charts: prev.charts.filter((c) => c.id !== id),
    }));
  }, []);

  // Preview report
  const generatePreview = useCallback(() => {
    try {
      const generated = generateFromCustomConfig(config);
      setPreviewReport(generated);
      return generated;
    } catch (err) {
      console.error('Failed to preview custom report', err);
      addToast({
        title: 'Preview Failed',
        description: 'Please check your selected columns and filters.',
        type: 'error',
      });
      return null;
    }
  }, [config, addToast]);

  // Save as Template
  const saveAsTemplate = useCallback((): ReportTemplate => {
    const newTpl: ReportTemplate = {
      id: `custom-tpl-${Date.now().toString(36)}`,
      name: config.name,
      description: config.description,
      category: config.category,
      icon: 'SlidersHorizontal',
      dataSource: config.dataSource,
      defaultFilters: [
        { field: 'dateRange', label: 'Date Range', type: 'date_range', defaultValue: config.filters.dateRange || 'this_month' },
      ],
      columns: config.columns,
      defaultGroupBy: config.groupBy,
      defaultSortBy: config.sortBy,
      defaultSortOrder: config.sortOrder,
      charts: config.charts,
      isSystem: false,
      isPublic: true,
      canSchedule: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newTpl;
  }, [config]);

  return {
    step,
    setStep,
    config,
    setName,
    setDescription,
    setCategory,
    setDataSource,
    setFilter,
    addColumn,
    removeColumn,
    reorderColumns,
    setGroupBy,
    setSortBy,
    setShowSubtotals,
    addChart,
    removeChart,
    generatePreview,
    previewReport,
    saveAsTemplate,
  };
}
