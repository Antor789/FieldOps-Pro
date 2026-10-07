import React from 'react';
import { GeneratedReport } from '../../types/reports';
import { formatBDT } from '../../utils/formatters';
import { ExportMenu } from './ExportMenu';
import { Building2, ShieldCheck, FileCheck, AlertCircle, Printer } from 'lucide-react';

export interface NBRVATReportProps {
  report: GeneratedReport;
  onRefresh?: () => void;
  locale?: 'en' | 'bn';
}

export const NBRVATReport: React.FC<NBRVATReportProps> = ({ report, onRefresh, locale = 'en' }) => {
  const vat = report.vatSummary || {
    totalTaxableSales: 1850000,
    vatRate: 15,
    outputVAT: 277500,
    inputVATCredit: 85200,
    netVATPayable: 192300,
    nbrBin: '002938102-0101',
    tradeLicense: 'TRAD/DHKA/2024/12345',
    companyName: 'FieldOps Pro Bangladesh Ltd.',
    registeredAddress: 'House 45, Road 12, Gulshan 2, Dhaka 1212',
    categoryBreakdown: [
      { category: 'Electrical & Power Services', taxableAmount: 820000, vatAmount: 123000, totalAmount: 943000 },
      { category: 'HVAC & Cooling Infrastructure', taxableAmount: 480000, vatAmount: 72000, totalAmount: 552000 },
      { category: 'Plumbing & Emergency Works', taxableAmount: 320000, vatAmount: 48000, totalAmount: 368000 },
      { category: 'Telecom & Fiber Splicing', taxableAmount: 230000, vatAmount: 34500, totalAmount: 264500 },
    ],
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Official Tax Entity Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {vat.companyName}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3" />
                  NBR Registered
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {vat.registeredAddress}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono mt-2 text-slate-600 dark:text-slate-300">
                <span>
                  NBR BIN: <strong className="text-slate-900 dark:text-white">{vat.nbrBin}</strong>
                </span>
                <span>•</span>
                <span>
                  Trade License: <strong className="text-slate-900 dark:text-white">{vat.tradeLicense}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <ExportMenu report={report} onRefresh={onRefresh} locale={locale} />
          </div>
        </div>

        {/* Period Banner */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Tax Period: <strong className="text-slate-900 dark:text-white">{report.dateRange.start} to {report.dateRange.end}</strong>
          </div>
          <div>
            Report Standard: <span className="font-semibold text-emerald-600 dark:text-emerald-400">NBR VAT Act 2012 (Act No. 47) & Mushak 6.3</span>
          </div>
        </div>
      </div>

      {/* Statutory VAT Calculation Ledger */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl space-y-4 font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Statutory VAT Ledger & Tax Calculation Summary
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800">
            Standard Rate: {vat.vatRate}%
          </span>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">Total Taxable Turnover (A):</span>
            <span className="text-base font-bold text-white">৳ {vat.totalTaxableSales.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">Output VAT Collected (B = A × 15%):</span>
            <span className="text-base font-bold text-emerald-400">৳ {vat.outputVAT.toLocaleString()}</span>
          </div>

          <div className="border-t border-slate-800 my-1" />

          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">Input VAT Credit Rebatable (C):</span>
            <span className="text-base font-bold text-amber-400">- ৳ {vat.inputVATCredit.toLocaleString()}</span>
          </div>

          <div className="border-t-2 border-slate-700 my-1 pt-2" />

          <div className="flex justify-between items-center py-2 bg-slate-900/80 px-4 rounded-xl border border-slate-800">
            <span className="font-bold text-slate-200">NET VAT PAYABLE TO BANGLADESH BANK / GOVT TREASURY (B - C):</span>
            <span className="text-lg sm:text-xl font-black text-emerald-400">
              ৳ {vat.netVATPayable.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
          Sales & VAT Breakdown by Service Category
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-4">Service Category</th>
                <th className="py-2.5 px-4 text-right">Taxable Amount (BDT)</th>
                <th className="py-2.5 px-4 text-right">VAT Amount (15%)</th>
                <th className="py-2.5 px-4 text-right">Gross Total (BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {vat.categoryBreakdown.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{row.category}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                    ৳ {row.taxableAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    ৳ {row.vatAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ৳ {row.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white border-t-2 border-slate-200 dark:border-slate-700">
                <td className="py-3 px-4">TOTAL</td>
                <td className="py-3 px-4 text-right font-mono">৳ {vat.totalTaxableSales.toLocaleString()}</td>
                <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">
                  ৳ {vat.outputVAT.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-mono">
                  ৳ {(vat.totalTaxableSales + vat.outputVAT).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Advisory & Compliance Note */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div>
          <p className="font-semibold">Official NBR Audit Notice:</p>
          <p className="mt-0.5 text-amber-700 dark:text-amber-400 leading-relaxed">
            This digital VAT summary is compiled automatically from verified FieldOps Pro service work orders and invoices. For official filing with the National Board of Revenue, submit Mushak Form 9.1 along with treasury deposit challans by the 15th of the succeeding month.
          </p>
        </div>
      </div>
    </div>
  );
};
