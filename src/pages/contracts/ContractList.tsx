import React, { useState, useMemo } from 'react';
import { Contract, ContractStatus, ContractType } from '../../types/contracts';
import {
  FileText,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Download,
  Building2,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  LayoutGrid,
  List,
  CheckCircle2,
  ExternalLink,
  ArrowUpDown,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ContractCard } from '../../components/contracts/ContractCard';
import { ExpiryAlert } from '../../components/contracts/ExpiryAlert';
import { ContractPDFModal } from '../../components/contracts/ContractPDFModal';
import {
  calculateContractStats,
  formatBDT,
  formatBDTLakh,
} from '../../data/sampleContractsData';

interface ContractListProps {
  contracts: Contract[];
  onViewContract: (contract: Contract) => void;
  onNewContract: () => void;
  onRenewContract: (contract: Contract) => void;
  onNavigateToRenewals: () => void;
}

export const ContractList: React.FC<ContractListProps> = ({
  contracts,
  onViewContract,
  onNewContract,
  onRenewContract,
  onNavigateToRenewals,
}) => {
  const [activeTab, setActiveTab] = useState<ContractStatus | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ContractType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedPdfContract, setSelectedPdfContract] = useState<Contract | null>(null);

  // Compute live statistics
  const stats = useMemo(() => calculateContractStats(contracts), [contracts]);

  // Filtered contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      // Tab filter
      if (activeTab === 'all') {
        // all
      } else if (activeTab === 'expiring_soon') {
        const now = new Date();
        const end = new Date(c.endDate);
        const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (c.status !== 'expiring_soon' && (days <= 0 || days > 30)) {
          return false;
        }
      } else if (c.status !== activeTab) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && c.type !== selectedType) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNumber = c.contractNumber.toLowerCase().includes(q);
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchCustomer = c.customerName.toLowerCase().includes(q);
        const matchBengali = c.titleBangla?.toLowerCase().includes(q);
        return matchNumber || matchTitle || matchCustomer || matchBengali;
      }

      return true;
    });
  }, [contracts, activeTab, selectedType, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-400/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Service Agreements & Contracts
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Manage AMC, SLAs, On-demand & Retainer Agreements with NBR-compliant billing and SLA tracking
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateToRenewals}
            className="text-xs border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/40"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-amber-500" />
            Renewals Hub ({stats.expiringCount})
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onNewContract}
            className="text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Contract (নতুন চুক্তি)
          </Button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Contracts */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Active Contracts (সক্রিয়)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {stats.activeCount}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all enterprise clients</p>
        </div>

        {/* Expiring Soon */}
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs">
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 block mb-1">
            Expiring Soon (মেয়াদ শেষ)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              ⚠️ {stats.expiringCount}
            </span>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">
              &lt; 30 Days
            </span>
          </div>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-400/70 mt-1">Action required for renewal</p>
        </div>

        {/* Total Contract Portfolio Value */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Portfolio Value (মোট মূল্য)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {formatBDTLakh(stats.totalValueBDT)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">BDT</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active agreements combined</p>
        </div>

        {/* Monthly Recurring Value & SLA */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Monthly Run Rate (মাসিক আয়)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
              {formatBDTLakh(stats.monthlyRecurringRevenueBDT)}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
              {stats.avgSlaCompliancePercent}% SLA
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Avg SLA uptime compliance</p>
        </div>
      </div>

      {/* 3. High Priority Expiry Alert Banner Widget */}
      <ExpiryAlert
        contracts={contracts}
        onRenewContract={onRenewContract}
        onViewAllExpiring={onNavigateToRenewals}
      />

      {/* 4. Filter Toolbar & Search Bar */}
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
              All ({contracts.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'active'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Active ({stats.activeCount})
            </button>
            <button
              onClick={() => setActiveTab('expiring_soon')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'expiring_soon'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
            >
              ⚠️ Expiring Soon ({stats.expiringCount})
            </button>
            <button
              onClick={() => setActiveTab('expired')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'expired'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Expired ({stats.expiredCount})
            </button>
            <button
              onClick={() => setActiveTab('draft')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'draft'
                  ? 'bg-slate-700 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Drafts ({stats.draftCount})
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-400'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-400'}`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Type Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contract #, customer, title..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-slate-500 hidden sm:inline">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ContractType | 'all')}
              className="w-full sm:w-auto px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            >
              <option value="all">All Contract Types (সব ধরণ)</option>
              <option value="amc">AMC - Annual Maintenance</option>
              <option value="sla">SLA - Service Level Agreement</option>
              <option value="retainer">Retainer Agreement</option>
              <option value="on_demand">On-Demand Service</option>
              <option value="project">Project-Based</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Contracts List Presentation (Grid or Table) */}
      {filteredContracts.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Contracts Found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No agreements match your search or filter criteria. Try clearing filters or create a new contract agreement.
          </p>
          <Button variant="primary" size="sm" onClick={onNewContract}>
            <Plus className="w-4 h-4 mr-1" />
            Create First Contract
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredContracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onView={onViewContract}
              onRenew={onRenewContract}
              onDownloadPdf={(c) => setSelectedPdfContract(c)}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Contract #</th>
                  <th className="py-3 px-4">Customer & Project</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Value (BDT)</th>
                  <th className="py-3 px-4">Period / Expiry</th>
                  <th className="py-3 px-4 text-center">SLA Uptime</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredContracts.map((contract) => {
                  const now = new Date();
                  const end = new Date(contract.endDate);
                  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  const isExpiring = daysLeft > 0 && daysLeft <= 30;

                  return (
                    <tr
                      key={contract.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => onViewContract(contract)}
                    >
                      {/* Contract # */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {contract.contractNumber}
                        </span>
                      </td>

                      {/* Customer & Title */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {contract.customerName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {contract.title}
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {contract.type.toUpperCase()}
                        </span>
                      </td>

                      {/* Value BDT */}
                      <td className="py-3 px-4 text-right whitespace-nowrap font-bold text-slate-900 dark:text-white">
                        {formatBDT(contract.value)}
                        <span className="text-[10px] text-slate-400 block font-normal">
                          {contract.paymentTerms}
                        </span>
                      </td>

                      {/* Expiry */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {new Date(contract.endDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        {isExpiring && (
                          <span className="text-[10px] text-amber-600 font-bold block">
                            Expires in {daysLeft} days
                          </span>
                        )}
                      </td>

                      {/* SLA */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {contract.slaCompliancePercent !== undefined ? (
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {contract.slaCompliancePercent}%
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {contract.status === 'active' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Active
                          </span>
                        ) : contract.status === 'expiring_soon' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Expiring
                          </span>
                        ) : contract.status === 'expired' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                            Expired
                          </span>
                        ) : contract.status === 'draft' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                            Draft
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            Renewed
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPdfContract(contract)}
                            className="p-1 text-slate-500 hover:text-blue-600"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewContract(contract)}
                            className="h-7 text-xs px-2"
                          >
                            Details
                          </Button>
                          {(contract.status === 'expiring_soon' || contract.status === 'expired') && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => onRenewContract(contract)}
                              className="h-7 text-xs px-2 bg-amber-600 hover:bg-amber-700"
                            >
                              Renew
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
        </div>
      )}

      {/* Printable/Downloadable Official PDF Deed Modal */}
      <ContractPDFModal
        contract={selectedPdfContract}
        isOpen={Boolean(selectedPdfContract)}
        onClose={() => setSelectedPdfContract(null)}
      />
    </div>
  );
};
