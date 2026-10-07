import React, { useState, useMemo } from 'react';
import { Quotation, QuotationStatus } from '../../types/quotations';
import { QuotationStatusBadge } from '../../components/quotations/QuotationStatusBadge';
import { QuotationPDF } from './QuotationPDF';
import { ConvertToJobModal } from '../../components/quotations/ConvertToJobModal';
import { formatBDT, formatBDTLakh } from '../../data/mockQuotationData';
import {
  FileText,
  Plus,
  Search,
  Filter,
  ArrowRightCircle,
  Eye,
  Send,
  Printer,
  Copy,
  TrendingUp,
  CheckCircle2,
  Clock,
  Building2,
  DollarSign,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface QuotationListProps {
  quotations: Quotation[];
  onViewQuote: (quote: Quotation) => void;
  onNewQuote: () => void;
  onEditQuote: (quote: Quotation) => void;
  onSendEmail: (quote: Quotation) => void;
  onSendSms: (quote: Quotation) => void;
  onDuplicateQuote: (quote: Quotation) => void;
  onConvertToWorkOrder: (
    quote: Quotation,
    options: {
      scheduledDate: string;
      technicianId: string;
      priority: 'EMERGENCY' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
      notes?: string;
    }
  ) => void;
}

export const QuotationList: React.FC<QuotationListProps> = ({
  quotations,
  onViewQuote,
  onNewQuote,
  onEditQuote,
  onSendEmail,
  onSendSms,
  onDuplicateQuote,
  onConvertToWorkOrder,
}) => {
  const [activeTab, setActiveTab] = useState<QuotationStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPdfQuote, setSelectedPdfQuote] = useState<Quotation | null>(null);
  const [convertingQuote, setConvertingQuote] = useState<Quotation | null>(null);

  // Compute live statistics
  const stats = useMemo(() => {
    const total = quotations.length;
    const approved = quotations.filter((q) => q.status === 'approved').length;
    const sent = quotations.filter((q) => q.status === 'sent').length;
    const draft = quotations.filter((q) => q.status === 'draft').length;
    const rejected = quotations.filter((q) => q.status === 'rejected').length;
    const expired = quotations.filter((q) => q.status === 'expired').length;
    const converted = quotations.filter((q) => q.status === 'converted').length;

    const totalPipelineValue = quotations
      .filter((q) => q.status === 'sent' || q.status === 'viewed' || q.status === 'approved')
      .reduce((sum, q) => sum + (q.total || 0), 0);

    const avgValue = total > 0 ? Math.round(quotations.reduce((s, q) => s + (q.total || 0), 0) / total) : 95200;
    const decided = approved + converted + rejected;
    const conversionRate = decided > 0 ? Math.round(((approved + converted) / decided) * 100) : 68;

    return {
      total,
      approved,
      sent,
      draft,
      rejected,
      expired,
      converted,
      totalPipelineValue,
      avgValue,
      conversionRate,
    };
  }, [quotations]);

  // Filtered list
  const filteredQuotations = useMemo(() => {
    return quotations.filter((q) => {
      // Tab filter
      if (activeTab !== 'all' && q.status !== activeTab) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchNum = q.quotationNumber.toLowerCase().includes(query);
        const matchCustomer = q.customerName.toLowerCase().includes(query);
        const matchBengali = q.customerNameBn?.toLowerCase().includes(query);
        return matchNum || matchCustomer || matchBengali;
      }
      return true;
    });
  }, [quotations, activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-400/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Quotations & Estimates (কোটেশন ও প্রাক্কলন)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Generate BDT commercial quotes, track customer approvals & convert to Work Orders
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onNewQuote}
          className="text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Quotation (+ নতুন কোটেশন)
        </Button>
      </div>

      {/* 2. KPI Summary Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Conversion Rate */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Conversion Rate (রূপান্তর হার)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {stats.conversionRate}% ↑
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              Industry Top
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">From quote to confirmed work order</p>
        </div>

        {/* Avg Quotation Value */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Avg Value (গড় মূল্য)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
              {formatBDT(stats.avgValue)}
            </span>
            <span className="text-[10px] text-slate-400">BDT</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Per commercial estimate</p>
        </div>

        {/* Active Pipeline */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Active Pipeline (পাইপলাইন)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {formatBDTLakh(stats.totalPipelineValue)}
            </span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full">
              {stats.sent + stats.approved} Quotes
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Sent & awaiting final execution</p>
        </div>

        {/* Converted Work Orders */}
        <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 shadow-xs">
          <span className="text-xs font-semibold text-purple-900 dark:text-purple-300 block mb-1">
            Converted Jobs (সম্পন্ন কাজ)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-purple-700 dark:text-purple-300">
              {stats.converted} WOs
            </span>
            <span className="text-xs font-bold text-purple-700 bg-purple-100 dark:bg-purple-900 px-2 py-0.5 rounded-full">
              Active Jobs
            </span>
          </div>
          <p className="text-[11px] text-purple-700/80 dark:text-purple-400/80 mt-1">Dispatched to field engineers</p>
        </div>
      </div>

      {/* 3. Search and Status Tabs Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All ({quotations.length})
            </button>
            <button
              onClick={() => setActiveTab('draft')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'draft'
                  ? 'bg-slate-700 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Drafts ({stats.draft})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'sent'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40'
              }`}
            >
              Sent ({stats.sent})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'approved'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setActiveTab('converted')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'converted'
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
              }`}
            >
              Converted ({stats.converted})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'rejected'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
            <button
              onClick={() => setActiveTab('expired')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'expired'
                  ? 'bg-orange-600 text-white font-bold shadow-xs'
                  : 'text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40'
              }`}
            >
              Expired ({stats.expired})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-96 text-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quotation #, customer name (e.g. Grameenphone, DESCO)..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 4. Quotations Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {filteredQuotations.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Quotations Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No commercial quotations match your search query or filter. Create a new estimate to get started.
            </p>
            <Button variant="primary" size="sm" onClick={onNewQuote}>
              <Plus className="w-4 h-4 mr-1" />
              Create First Quotation
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Quote #</th>
                  <th className="py-3 px-4">Customer & Project</th>
                  <th className="py-3 px-4 text-right">Amount (BDT)</th>
                  <th className="py-3 px-4">Validity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredQuotations.map((quote) => {
                  const now = new Date();
                  const validUntilDate = new Date(quote.validUntil);
                  const daysLeft = Math.ceil(
                    (validUntilDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <tr
                      key={quote.id}
                      onClick={() => onViewQuote(quote)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      {/* Quote # */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {quote.quotationNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-normal">
                          {new Date(quote.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>

                      {/* Customer Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {quote.customerName}
                        </div>
                        {quote.customerNameBn && (
                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            {quote.customerNameBn}
                          </div>
                        )}
                        <span className="text-[10px] text-slate-500">
                          {quote.sections.reduce((sum, s) => sum + s.items.length, 0)} line items
                        </span>
                      </td>

                      {/* Amount BDT */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {formatBDT(quote.total)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Incl. 15% VAT
                        </span>
                      </td>

                      {/* Valid Until / Days left */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Till {new Date(quote.validUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <QuotationStatusBadge status={quote.status} size="sm" />
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPdfQuote(quote)}
                            className="p-1 text-slate-500 hover:text-blue-600"
                            title="Print / View PDF"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewQuote(quote)}
                            className="h-7 text-xs px-2.5"
                          >
                            View
                          </Button>

                          {quote.status === 'approved' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setConvertingQuote(quote)}
                              className="h-7 text-xs px-2.5 bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                            >
                              <ArrowRightCircle className="w-3 h-3 mr-1" />
                              Convert
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Printable PDF Modal */}
      <QuotationPDF
        quotation={selectedPdfQuote}
        isOpen={Boolean(selectedPdfQuote)}
        onClose={() => setSelectedPdfQuote(null)}
      />

      {/* Convert to Job Modal */}
      {convertingQuote && (
        <ConvertToJobModal
          quotation={convertingQuote}
          isOpen={Boolean(convertingQuote)}
          onClose={() => setConvertingQuote(null)}
          onConfirmConvert={(opts) => {
            onConvertToWorkOrder(convertingQuote, opts);
            setConvertingQuote(null);
          }}
        />
      )}
    </div>
  );
};
