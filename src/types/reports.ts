/**
 * FieldOps Pro - Advanced Reports System Types
 * Comprehensive reporting, NBR VAT compliance, custom builder, and automated scheduling.
 */

export type ReportCategory =
  | 'operations'
  | 'financial'
  | 'technician'
  | 'customer'
  | 'inventory'
  | 'compliance';

export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'html';

export type ChartType = 'bar' | 'line' | 'pie' | 'donut' | 'area' | 'table';

export type AggregationType = 'sum' | 'count' | 'average' | 'min' | 'max';

export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'last_quarter'
  | 'this_year'
  | 'last_year'
  | 'custom';

export interface ReportFilter {
  field: string;
  label: string;
  labelBangla?: string;
  type: 'date_range' | 'select' | 'multi_select' | 'text' | 'number_range';
  options?: { value: string; label: string; labelBangla?: string }[];
  defaultValue?: any;
  required?: boolean;
}

export interface ReportColumn {
  field: string;
  header: string;
  headerBangla?: string;
  type: 'string' | 'number' | 'currency' | 'date' | 'status' | 'rating';
  width?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  aggregation?: AggregationType;
  format?: string; // Date format, number format
  visible?: boolean;
}

export interface ReportChart {
  id: string;
  type: ChartType;
  title: string;
  titleBangla?: string;
  dataKey: string;
  labelKey: string;
  colorScheme?: string[];
  showLegend?: boolean;
  showValues?: boolean;
}

export interface ReportTemplate {
  id: string;
  name: string;
  nameBangla?: string;
  description: string;
  descriptionBangla?: string;
  category: ReportCategory;
  icon: string;

  // Configuration
  dataSource: 'work_orders' | 'invoices' | 'customers' | 'technicians' | 'inventory' | 'payments';
  defaultFilters?: ReportFilter[];
  columns: ReportColumn[];
  defaultGroupBy?: string;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';

  // Visualization
  charts: ReportChart[];

  // Access
  isSystem: boolean; // Built-in template
  createdBy?: string;
  isPublic: boolean;

  // Schedule
  canSchedule: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface ReportSummaryMetric {
  label: string;
  labelBangla?: string;
  value: number | string;
  format?: 'number' | 'currency' | 'percentage';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

export interface ReportSummary {
  totalRecords: number;
  metrics: ReportSummaryMetric[];
}

export interface GeneratedReport {
  id: string;
  templateId: string;
  templateName: string;
  templateNameBangla?: string;
  description?: string;
  category: ReportCategory;

  // Filters applied
  filters: Record<string, any>;
  dateRange: {
    start: string;
    end: string;
  };

  // Data
  data: any[];
  summary: ReportSummary;
  columns: ReportColumn[];
  charts: ReportChart[];

  // Technician / Subgroup data if applicable
  technicianBreakdown?: {
    name: string;
    jobs: number;
    completed: number;
    revenue: number;
    rating: number;
    slaPercent: number;
  }[];

  // NBR VAT Specific Ledger if compliance
  vatSummary?: {
    totalTaxableSales: number;
    vatRate: number;
    outputVAT: number;
    inputVATCredit: number;
    netVATPayable: number;
    nbrBin: string;
    tradeLicense: string;
    companyName: string;
    registeredAddress: string;
    categoryBreakdown: {
      category: string;
      taxableAmount: number;
      vatAmount: number;
      totalAmount: number;
    }[];
  };

  // Meta
  generatedAt: string;
  generatedBy: string;
  generatedByName: string;

  // Export
  exportFormats: ReportFormat[];
  exportUrls?: Record<ReportFormat, string>;
}

export interface ScheduledReport {
  id: string;
  templateId: string;
  templateName: string;

  // Schedule
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number; // 0-6 for weekly (0=Sun, 1=Mon, etc.)
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // "09:00"
  timezone: string; // "Asia/Dhaka"

  // Filters
  filters: Record<string, any>;

  // Delivery
  format: ReportFormat;
  recipients: {
    email: string;
    name?: string;
  }[];

  // Status
  isActive: boolean;
  lastRunAt?: string;
  nextRunAt: string;
  lastStatus?: 'success' | 'failed';

  createdBy: string;
  createdAt: string;
}

export interface DeliveryLog {
  id: string;
  reportName: string;
  deliveredAt: string;
  recipientsCount: number;
  recipientsSummary: string;
  format: ReportFormat;
  status: 'Delivered' | 'Failed';
}

export interface ReportBuilderConfig {
  name: string;
  description: string;
  category: ReportCategory;
  dataSource: 'work_orders' | 'invoices' | 'customers' | 'technicians' | 'inventory' | 'payments';
  filters: Record<string, any>;
  columns: ReportColumn[];
  groupBy?: string;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
  showSubtotals: boolean;
  charts: ReportChart[];
}
