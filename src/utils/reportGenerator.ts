import { ReportTemplate, GeneratedReport, DateRangePreset, ReportBuilderConfig } from '../types/reports';

/**
 * Computes date ranges based on standard business presets
 */
export function calculateDateRange(preset: DateRangePreset | string): { start: string; end: string; label: string } {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  switch (preset) {
    case 'today':
      return { start: todayStr, end: todayStr, label: 'Today (আজ)' };
    case 'yesterday': {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const str = yesterday.toISOString().split('T')[0];
      return { start: str, end: str, label: 'Yesterday (গতকাল)' };
    }
    case 'last_7_days': {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return { start: d.toISOString().split('T')[0], end: todayStr, label: 'Last 7 Days (গত ৭ দিন)' };
    }
    case 'last_30_days': {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      return { start: d.toISOString().split('T')[0], end: todayStr, label: 'Last 30 Days (গত ৩০ দিন)' };
    }
    case 'this_month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      return { start, end: todayStr, label: 'This Month (চলতি মাস)' };
    }
    case 'last_month': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
      const end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
      return { start, end, label: 'Last Month (পূর্ববর্তী মাস)' };
    }
    case 'this_quarter': {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const start = new Date(now.getFullYear(), currentQuarter * 3, 1).toISOString().split('T')[0];
      return { start, end: todayStr, label: 'This Quarter (চলতি ত্রৈমাসিক)' };
    }
    case 'this_year': {
      const start = `${now.getFullYear()}-01-01`;
      return { start, end: todayStr, label: 'This Year (চলতি বছর)' };
    }
    default: {
      const d = new Date(now);
      d.setDate(d.getDate() - 14);
      return { start: d.toISOString().split('T')[0], end: todayStr, label: 'Selected Period' };
    }
  }
}

/**
 * Mock data pool for Bangladesh enterprise operations
 */
const BANGLADESH_CLIENTS = [
  { name: 'Grameenphone Telecom Ltd', bin: '002938102-0101', tier: 'Enterprise' },
  { name: 'DESCO Distribution Substation', bin: '001928374-0102', tier: 'Enterprise' },
  { name: 'Walton Hi-Tech Industries', bin: '003847291-0201', tier: 'Enterprise' },
  { name: 'Square Pharmaceuticals Ltd', bin: '004738291-0301', tier: 'Enterprise' },
  { name: 'Beximco Industrial Park', bin: '005829104-0101', tier: 'Enterprise' },
  { name: 'Robi Axiata Telecom', bin: '002349182-0103', tier: 'Enterprise' },
  { name: 'BRAC Bank Branch NOC', bin: '001293847-0101', tier: 'SME' },
  { name: 'Apex Footwear Gazipur Plant', bin: '004829102-0202', tier: 'SME' },
  { name: 'Pran-RFL Industrial Hub', bin: '003928172-0101', tier: 'Enterprise' },
  { name: 'Summit Power Generation', bin: '001827364-0101', tier: 'Enterprise' },
];

const TECHNICIANS = [
  { name: 'Rahim Ahmed', division: 'Dhaka', rating: 4.9, sla: 98 },
  { name: 'Tanvir Hossain', division: 'Dhaka', rating: 4.8, sla: 96 },
  { name: 'Kamal Uddin', division: 'Chittagong', rating: 4.7, sla: 94 },
  { name: 'Jamal Mia', division: 'Dhaka', rating: 4.6, sla: 92 },
  { name: 'Shahidul Alam', division: 'Sylhet', rating: 4.8, sla: 95 },
  { name: 'Mehedi Hasan', division: 'Rajshahi', rating: 4.7, sla: 93 },
];

const SERVICES = ['Electrical', 'HVAC', 'Plumbing', 'Telecom'];

const DHAKA_LOCATIONS = [
  { area: 'Gulshan 2, Dhaka', district: 'Dhaka', division: 'DHAKA' },
  { area: 'Motijheel C/A, Dhaka', district: 'Dhaka', division: 'DHAKA' },
  { area: 'Uttara Sector 7, Dhaka', district: 'Dhaka', division: 'DHAKA' },
  { area: 'Tejgaon Industrial Area', district: 'Dhaka', division: 'DHAKA' },
  { area: 'Agrabad C/A, Chittagong', district: 'Chittagong', division: 'CHITTAGONG' },
  { area: 'Zindabazar, Sylhet', district: 'Sylhet', division: 'SYLHET' },
  { area: 'Mirpur DOHS, Dhaka', district: 'Dhaka', division: 'DHAKA' },
  { area: 'Savar EPZ, Dhaka', district: 'Dhaka', division: 'DHAKA' },
];

/**
 * Generates an end-to-end report payload based on a template and user filters
 */
export function generateReportFromTemplate(
  template: ReportTemplate,
  overrideFilters?: Record<string, any>
): GeneratedReport {
  const mergedFilters = {
    ...(template.defaultFilters || []).reduce((acc, f) => {
      acc[f.field] = f.defaultValue;
      return acc;
    }, {} as Record<string, any>),
    ...(overrideFilters || {}),
  };

  const datePreset = mergedFilters.dateRange || 'this_month';
  const range = calculateDateRange(datePreset);

  const reportId = `rep-run-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date();
  const generatedAt = now.toISOString();

  // Generate specialized dataset based on template category / ID
  let tableData: any[] = [];
  let summaryMetrics: any[] = [];
  let chartData: any[] = template.charts;

  if (template.id === 'rep-nbr-vat' || template.category === 'compliance') {
    // Official NBR VAT 15% Report
    tableData = BANGLADESH_CLIENTS.map((client, idx) => {
      const taxable = Math.round(18000 + (idx * 16500) + (idx % 2 === 0 ? 12000 : 4500));
      const vat = Math.round(taxable * 0.15);
      const total = taxable + vat;
      const day = (idx * 2 + 1).toString().padStart(2, '0');
      return {
        invoiceNumber: `INV-2025-${(1001 + idx).toString()}`,
        date: `2025-01-${day}`,
        customerName: client.name,
        customerBin: client.bin,
        taxableAmount: taxable,
        vatAmount: vat,
        totalAmount: total,
        paymentStatus: idx > 7 ? 'PARTIAL' : 'PAID',
      };
    });

    const totalTaxable = tableData.reduce((sum, r) => sum + r.taxableAmount, 0);
    const totalVAT = tableData.reduce((sum, r) => sum + r.vatAmount, 0);
    const totalGross = totalTaxable + totalVAT;
    const inputCredit = Math.round(totalVAT * 0.307); // ~30.7% input VAT credit
    const netPayable = totalVAT - inputCredit;

    summaryMetrics = [
      { label: 'Total Taxable Sales (A)', labelBangla: 'মোট করযোগ্য সেবা মূল্য', value: totalTaxable, format: 'currency', trend: { value: 14.2, direction: 'up' } },
      { label: 'Standard VAT Rate', labelBangla: 'এনবিআর ১৫% মূসক হার', value: '15.0%', format: 'string' },
      { label: 'Output VAT (B = A × 15%)', labelBangla: 'আউটপুট ভ্যাট (প্রদেয়)', value: totalVAT, format: 'currency', trend: { value: 14.2, direction: 'up' } },
      { label: 'Input VAT Credit (C)', labelBangla: 'উপকরণ কর রেয়াত (গৃহীত)', value: inputCredit, format: 'currency', trend: { value: 5.8, direction: 'neutral' } },
      { label: 'Net VAT Payable (B - C)', labelBangla: 'সরকারি ট্রেজারিতে নিট প্রদেয় ভ্যাট', value: netPayable, format: 'currency' },
    ];

    return {
      id: reportId,
      templateId: template.id,
      templateName: template.name,
      templateNameBangla: template.nameBangla,
      description: template.description,
      category: template.category,
      filters: mergedFilters,
      dateRange: { start: range.start, end: range.end },
      data: tableData,
      columns: template.columns,
      charts: template.charts,
      summary: {
        totalRecords: tableData.length,
        metrics: summaryMetrics,
      },
      vatSummary: {
        totalTaxableSales: totalTaxable,
        vatRate: 15,
        outputVAT: totalVAT,
        inputVATCredit: inputCredit,
        netVATPayable: netPayable,
        nbrBin: '002938102-0101',
        tradeLicense: 'TRAD/DHKA/2024/12345',
        companyName: 'FieldOps Pro Bangladesh Ltd.',
        registeredAddress: 'House 45, Road 12, Gulshan 2, Dhaka 1212',
        categoryBreakdown: [
          { category: 'Electrical & Power Infrastructure', taxableAmount: Math.round(totalTaxable * 0.44), vatAmount: Math.round(totalVAT * 0.44), totalAmount: Math.round(totalGross * 0.44) },
          { category: 'HVAC & Cooling Systems', taxableAmount: Math.round(totalTaxable * 0.26), vatAmount: Math.round(totalVAT * 0.26), totalAmount: Math.round(totalGross * 0.26) },
          { category: 'Plumbing & Emergency Works', taxableAmount: Math.round(totalTaxable * 0.17), vatAmount: Math.round(totalVAT * 0.17), totalAmount: Math.round(totalGross * 0.17) },
          { category: 'Telecom & Fiber Splicing', taxableAmount: Math.round(totalTaxable * 0.13), vatAmount: Math.round(totalVAT * 0.13), totalAmount: Math.round(totalGross * 0.13) },
        ],
      },
      generatedAt,
      generatedBy: 'system',
      generatedByName: 'Operations Lead (Shafiqul Islam)',
      exportFormats: ['pdf', 'excel', 'csv', 'html'],
    };
  }

  // STANDARD WORK ORDERS / OPERATIONS / FINANCIAL DATA
  const isFinancial = template.category === 'financial';
  const isTechnician = template.category === 'technician';
  const isInventory = template.category === 'inventory';

  if (isTechnician) {
    tableData = TECHNICIANS.map((tech, idx) => ({
      technicianName: tech.name,
      division: tech.division,
      assignedJobs: 16 - idx,
      completedJobs: 15 - idx,
      completionRate: 94 - idx,
      revenueBDT: (65000 - idx * 7500),
      rating: tech.rating,
      slaRate: tech.sla,
      totalHours: 160 + idx * 4,
      onSiteHours: 118 - idx * 5,
      travelHours: 42 + idx * 5,
      utilizationRate: 74 - idx * 2,
    }));

    const totalCompleted = tableData.reduce((s, t) => s + t.completedJobs, 0);
    const totalRev = tableData.reduce((s, t) => s + t.revenueBDT, 0);

    summaryMetrics = [
      { label: 'Active Fleet Size', labelBangla: 'সক্রিয় টেকনিশিয়ান সংখ্যা', value: TECHNICIANS.length, format: 'number' },
      { label: 'Completed Jobs', labelBangla: 'সমাপ্ত জব', value: totalCompleted, format: 'number', trend: { value: 9.4, direction: 'up' } },
      { label: 'Total Revenue Generated', labelBangla: 'মোট অর্জিত রাজস্ব', value: totalRev, format: 'currency', trend: { value: 15.3, direction: 'up' } },
      { label: 'Average CSAT Rating', labelBangla: 'গড় সন্তুষ্টি রেটিং', value: '4.78 / 5.0', format: 'string' },
    ];
  } else if (isInventory) {
    const PARTS = [
      { sku: 'EP-TR-100KVA', name: 'Energypac Distribution Transformer 100kVA', cat: 'Electrical', qty: 4, cost: 245000, stock: 6 },
      { sku: 'FBR-SPL-48F', name: 'Optical Fiber Splice Closure 48-Core', cat: 'Telecom', qty: 28, cost: 3200, stock: 45 },
      { sku: 'ABB-MCB-63A', name: 'ABB Miniature Circuit Breaker 63A 3-Pole', cat: 'Electrical', qty: 65, cost: 2850, stock: 120 },
      { sku: 'PMP-SUB-2HP', name: 'Pedrollo Submersible Water Pump 2HP', cat: 'Plumbing', qty: 9, cost: 38500, stock: 14 },
      { sku: 'OIL-DIE-15W40', name: 'Mobil Delvac Super Diesel Engine Oil 20L', cat: 'Generators', qty: 34, cost: 8900, stock: 82 },
      { sku: 'AC-CMP-2TON', name: 'Daikin Rotary Compressor 2-Ton R410A', cat: 'HVAC', qty: 12, cost: 26500, stock: 18 },
    ];

    tableData = PARTS.map((p) => ({
      partNumber: p.sku,
      partName: p.name,
      category: p.cat,
      consumedQty: p.qty,
      unitCostBDT: p.cost,
      totalCostBDT: p.qty * p.cost,
      currentStock: p.stock,
    }));

    const totalVal = tableData.reduce((s, p) => s + p.totalCostBDT, 0);
    const totalUnits = tableData.reduce((s, p) => s + p.consumedQty, 0);

    summaryMetrics = [
      { label: 'Hardware Parts Tracked', labelBangla: 'ট্র্যাককৃত পার্টস SKU', value: PARTS.length, format: 'number' },
      { label: 'Consumed Units', labelBangla: 'ব্যবহৃত যন্ত্রাংশ ইউনিট', value: totalUnits, format: 'number' },
      { label: 'Total Consumed Valuation', labelBangla: 'ব্যবহৃত যন্ত্রাংশের মোট মূল্য', value: totalVal, format: 'currency', trend: { value: 7.1, direction: 'up' } },
      { label: 'Warehouse Reorder Items', labelBangla: 'পুনরায় ক্রয়ের তালিকায় আইটেম', value: 2, format: 'number' },
    ];
  } else {
    // WORK ORDERS / REVENUE DEFAULT DATASET (45 Real Jobs)
    const count = 45;
    const generatedRows = [];
    for (let i = 1; i <= count; i++) {
      const client = BANGLADESH_CLIENTS[i % BANGLADESH_CLIENTS.length];
      const tech = TECHNICIANS[i % TECHNICIANS.length];
      const service = SERVICES[i % SERVICES.length];
      const loc = DHAKA_LOCATIONS[i % DHAKA_LOCATIONS.length];
      const status = i <= 41 ? 'COMPLETED' : i <= 43 ? 'IN_PROGRESS' : 'SCHEDULED';
      const isCompleted = status === 'COMPLETED';
      const amount = (i * 2400) % 28000 + 4500;
      const targetMin = 60;
      const actualMin = 42 + (i % 20);
      const isSlaMet = actualMin <= targetMin;

      generatedRows.push({
        id: `WO-90${i.toString().padStart(2, '0')}`,
        title: `${service} Maintenance - ${client.name}`,
        customerName: client.name,
        serviceType: service,
        technicianName: tech.name,
        location: loc.area,
        division: loc.division,
        district: loc.district,
        area: loc.area.split(',')[0],
        status,
        amount,
        targetMinutes: targetMin,
        actualMinutes: actualMin,
        durationMins: actualMin,
        priority: i % 5 === 0 ? 'CRITICAL' : i % 3 === 0 ? 'HIGH' : 'NORMAL',
        slaCompliance: isSlaMet ? 'MET' : 'BREACHED',
        paymentStatus: isCompleted ? (i % 7 === 0 ? 'PARTIAL' : 'PAID') : 'UNPAID',
        createdAt: `2025-01-${((i % 28) + 1).toString().padStart(2, '0')}`,
      });
    }

    // Apply division / service filter if specified
    tableData = generatedRows.filter((r) => {
      if (mergedFilters.division && mergedFilters.division !== 'ALL' && r.division !== mergedFilters.division) {
        return false;
      }
      if (mergedFilters.serviceType && mergedFilters.serviceType !== 'ALL' && r.serviceType !== mergedFilters.serviceType) {
        return false;
      }
      return true;
    });

    const totalJobs = tableData.length;
    const completedJobs = tableData.filter((r) => r.status === 'COMPLETED').length;
    const totalRev = tableData.reduce((s, r) => s + (r.amount || 0), 0);
    const avgDuration = Math.round(tableData.reduce((s, r) => s + (r.durationMins || 50), 0) / (totalJobs || 1));
    const completionRate = totalJobs > 0 ? ((completedJobs / totalJobs) * 100).toFixed(1) : '0';

    summaryMetrics = [
      { label: 'Total Jobs', labelBangla: 'মোট জব সংখ্যা', value: totalJobs, format: 'number', trend: { value: 12, direction: 'up' } },
      { label: 'Completed', labelBangla: 'সমাপ্ত কাজ', value: `${completedJobs} (${completionRate}%)`, format: 'string' },
      { label: 'Revenue Collected', labelBangla: 'সংগৃহীত রাজস্ব', value: totalRev, format: 'currency', trend: { value: 18, direction: 'up' } },
      { label: 'Avg SLA Resolution', labelBangla: 'গড় সমাধান সময়', value: `${avgDuration} min`, format: 'string', trend: { value: 8, direction: 'down' } },
    ];
  }

  // Compute technician breakdown for ops reports
  const technicianBreakdown = TECHNICIANS.map((t) => {
    const techJobs = tableData.filter((r) => r.technicianName === t.name);
    const jobs = techJobs.length || Math.floor(Math.random() * 6 + 8);
    const completed = techJobs.filter((r) => r.status === 'COMPLETED').length || Math.max(1, jobs - 1);
    const revenue = techJobs.reduce((s, r) => s + (r.amount || 0), 0) || (jobs * 4200);

    return {
      name: t.name,
      jobs,
      completed,
      revenue,
      rating: t.rating,
      slaPercent: t.sla,
    };
  });

  return {
    id: reportId,
    templateId: template.id,
    templateName: template.name,
    templateNameBangla: template.nameBangla,
    description: template.description,
    category: template.category,
    filters: mergedFilters,
    dateRange: { start: range.start, end: range.end },
    data: tableData,
    columns: template.columns,
    charts: chartData,
    summary: {
      totalRecords: tableData.length,
      metrics: summaryMetrics,
    },
    technicianBreakdown,
    generatedAt,
    generatedBy: 'system',
    generatedByName: 'Shafiqul Islam (NOC Operations Lead)',
    exportFormats: ['pdf', 'excel', 'csv', 'html'],
  };
}

/**
 * Generates custom ad-hoc report from Custom Builder configuration
 */
export function generateFromCustomConfig(config: ReportBuilderConfig): GeneratedReport {
  // Map data source to a template base
  const virtualTemplate: ReportTemplate = {
    id: `custom-${Date.now().toString(36)}`,
    name: config.name || 'Custom Report',
    description: config.description || 'Custom generated ad-hoc business intelligence report.',
    category: config.category || 'operations',
    icon: 'SlidersHorizontal',
    dataSource: config.dataSource,
    columns: config.columns,
    charts: config.charts,
    isSystem: false,
    isPublic: false,
    canSchedule: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultFilters: [],
  };

  return generateReportFromTemplate(virtualTemplate, config.filters);
}
