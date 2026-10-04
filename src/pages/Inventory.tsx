import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { useVehicleInventory } from '../hooks/useVehicleInventory';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';
import {
  PartsTable,
  PartForm,
  StockTransferModal,
  PurchaseOrderForm,
  LowStockAlerts,
  BarcodeScanner,
  VehicleInventoryCard,
  MovementHistory,
} from '../components/inventory';
import { Part, StockStatus } from '../types/inventory';
import { formatBDT } from '../utils/formatters';
import { exportPartsToCSV } from '../utils/inventoryHelpers';
import {
  Package,
  Plus,
  QrCode,
  ArrowRightLeft,
  FileSpreadsheet,
  AlertTriangle,
  History,
  Truck,
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Building,
} from 'lucide-react';
import { motion } from 'motion/react';

export interface InventoryPageProps {
  locale?: 'en' | 'bn';
}

export type InventoryTab = 'catalog' | 'vehicles' | 'orders' | 'alerts' | 'history';

export const InventoryPage: React.FC<InventoryPageProps> = ({ locale = 'en' }) => {
  const [activeTab, setActiveTab] = useState<InventoryTab>('catalog');

  const {
    parts,
    allParts,
    categories,
    warehouses,
    movements,
    selectedCategory,
    setSelectedCategory,
    selectedStockStatus,
    setSelectedStockStatus,
    searchQuery,
    setSearchQuery,
    selectedPart,
    setSelectedPart,
    metrics,
    addPart,
    updatePart,
    deletePart,
    transferStock,
    isAddPartModalOpen,
    setIsAddPartModalOpen,
    isTransferModalOpen,
    setIsTransferModalOpen,
    isScannerOpen,
    setIsScannerOpen,
    isPOModalOpen,
    setIsPOModalOpen,
  } = useInventory();

  const {
    vehicles,
    selectedVehicleId,
    setSelectedVehicleId,
  } = useVehicleInventory();

  const {
    purchaseOrders,
    suppliers,
    createPurchaseOrder,
    updatePOStatus,
  } = usePurchaseOrders();

  const handleCreatePOForPart = (part: Part) => {
    setIsPOModalOpen(true);
  };

  const handleCreatePOForAll = () => {
    setIsPOModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span>FieldOps Pro</span>
            <span>/</span>
            <span>Central Warehouse</span>
            <span>/</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {locale === 'bn' ? 'ইনভেন্টরি ও পার্টস ম্যানেজমেন্ট' : 'Inventory & Van Stock'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>{locale === 'bn' ? 'যন্ত্রাংশ ও ভ্যান স্টক ব্যবস্থাপনা' : 'Spares Catalog & Vehicle Inventory'}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 transition-colors shadow-xs"
          >
            <QrCode className="w-4 h-4" />
            <span>{locale === 'bn' ? 'বারকোড স্ক্যান' : 'Optical Scanner'}</span>
          </button>

          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>{locale === 'bn' ? 'স্টক ট্রান্সফার' : 'Transfer Stock'}</span>
          </button>

          <button
            onClick={() => setIsAddPartModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'bn' ? '+ নতুন যন্ত্রাংশ' : '+ Add Hardware'}</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Top Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{locale === 'bn' ? 'মোট ইনভেন্টরি মূল্যায়ন' : 'Total Valuation'}</span>
            <Package className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-lg sm:text-2xl font-mono font-extrabold text-slate-900 dark:text-white">
            {formatBDT(metrics.totalValuation, locale)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {metrics.totalItems} {locale === 'bn' ? 'টি স্বতন্ত্র এসকেইউ' : 'unique SKUs registered'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{locale === 'bn' ? 'পর্যাপ্ত স্টক' : 'Healthy In-Stock'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg sm:text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
            {metrics.inStock}
          </div>
          <div className="text-[11px] text-emerald-600/80 font-mono">
            {Math.round((metrics.inStock / (metrics.totalItems || 1)) * 100)}% {locale === 'bn' ? 'স্টক সন্তোষজনক' : 'optimal availability'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{locale === 'bn' ? 'স্বল্প স্টক অ্যালার্ট' : 'Low Stock Warning'}</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg sm:text-2xl font-mono font-extrabold text-amber-600 dark:text-amber-400">
            {metrics.lowStock}
          </div>
          <div className="text-[11px] text-amber-600/80 font-mono">
            {locale === 'bn' ? 'রিঅর্ডার পয়েন্টের নিচে' : 'Approaching reorder point'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{locale === 'bn' ? 'স্টক শূন্য আইটেম' : 'Depleted Out-of-Stock'}</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-lg sm:text-2xl font-mono font-extrabold text-rose-600 dark:text-rose-400">
            {metrics.outOfStock}
          </div>
          <div className="text-[11px] text-rose-600/80 font-mono">
            {locale === 'bn' ? 'অবিলম্বে পার্চেজ প্রয়োজন' : 'Immediate replenishment needed'}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl max-w-fit overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>{locale === 'bn' ? 'পার্টস ক্যাটালগ' : 'Parts Catalog'}</span>
        </button>

        <button
          onClick={() => setActiveTab('vehicles')}
          className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'vehicles'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>{locale === 'bn' ? 'গাড়ির ভ্যান স্টক' : 'Vehicle Van Stock'}</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>{locale === 'bn' ? 'এনবিআর ভ্যাট PO' : 'Purchase Orders (PO)'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
            {purchaseOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'alerts'
              ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>{locale === 'bn' ? 'স্বল্প স্টক অ্যালার্ট' : 'Low Stock Alerts'}</span>
          {metrics.lowStock + metrics.outOfStock > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-mono font-bold animate-pulse">
              {metrics.lowStock + metrics.outOfStock}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>{locale === 'bn' ? 'মুভমেন্ট হিস্টোরি' : 'Movement Audit Log'}</span>
        </button>
      </div>

      {/* TAB 1: Parts Catalog Table with Filters */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === 'bn' ? 'যন্ত্রাংশের নাম, এসকেইউ বা বারকোড খুঁজুন...' : 'Search by name, SKU, or barcode...'}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Dropdowns & Export */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
              >
                <option value="all">{locale === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStockStatus}
                onChange={(e) => setSelectedStockStatus(e.target.value as StockStatus | 'all')}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
              >
                <option value="all">{locale === 'bn' ? 'সকল স্ট্যাটাস' : 'All Stock Status'}</option>
                <option value="in_stock">🟢 In Stock (পর্যাপ্ত)</option>
                <option value="low_stock">🟡 Low Stock (স্বল্প)</option>
                <option value="out_of_stock">🔴 Out of Stock (শূন্য)</option>
              </select>

              <button
                onClick={() => exportPartsToCSV(allParts)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{locale === 'bn' ? 'এক্সপোর্ট CSV' : 'Export CSV'}</span>
              </button>
            </div>
          </div>

          {/* Parts Table Component */}
          <PartsTable
            parts={parts}
            locale={locale}
            onSelectPart={(part) => setSelectedPart(part)}
            onEditPart={(part) => {
              setSelectedPart(part);
              setIsAddPartModalOpen(true);
            }}
            onTransferPart={(part) => {
              setSelectedPart(part);
              setIsTransferModalOpen(true);
            }}
            onDeletePart={(partId) => deletePart(partId)}
          />
        </div>
      )}

      {/* TAB 2: Vehicle & Van Stock */}
      {activeTab === 'vehicles' && (
        <VehicleInventoryCard
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          locale={locale}
          onSelectVehicle={setSelectedVehicleId}
          onRequestRestock={() => setIsTransferModalOpen(true)}
        />
      )}

      {/* TAB 3: Purchase Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {locale === 'bn' ? 'পার্চেজ অর্ডার ও সাপ্লায়ার রিকুইজিশন' : 'Official Vendor Purchase Orders'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Compliant with National Board of Revenue (NBR) 15% VAT Invoicing Standard.
              </p>
            </div>
            <button
              onClick={() => setIsPOModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{locale === 'bn' ? '+ নতুন PO তৈরি' : '+ Create Purchase Order'}</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800/70 text-xs">
              {purchaseOrders.map((po) => (
                <div
                  key={po.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                        {po.poNumber}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white">{po.supplierName}</h4>
                      <span
                        className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold uppercase ${
                          po.status === 'received'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : po.status === 'ordered'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {po.status}
                      </span>
                    </div>
                    <p className="text-slate-500 font-mono text-[11px]">
                      {po.items.length} line items • NBR VAT BIN: {po.supplierBin || '002938102-0101'} • Notes: {po.notes}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center font-mono">
                    <div className="text-right">
                      <span className="text-slate-400 text-[10px]">Total (incl. 15% VAT):</span>
                      <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        {formatBDT(po.totalAmountBDT, locale)}
                      </div>
                    </div>

                    {po.status === 'ordered' && (
                      <button
                        onClick={() => updatePOStatus(po.id, 'received')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 transition-colors shadow-xs"
                      >
                        Mark as Received
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Low Stock Alerts */}
      {activeTab === 'alerts' && (
        <LowStockAlerts
          parts={allParts}
          locale={locale}
          onSelectPart={(part) => setSelectedPart(part)}
          onCreatePOForPart={handleCreatePOForPart}
          onCreatePOForAll={handleCreatePOForAll}
        />
      )}

      {/* TAB 5: Movement History */}
      {activeTab === 'history' && <MovementHistory movements={movements} locale={locale} />}

      {/* Modals */}
      <PartForm
        isOpen={isAddPartModalOpen}
        categories={categories}
        initialPart={selectedPart}
        locale={locale}
        onClose={() => {
          setIsAddPartModalOpen(false);
          setSelectedPart(null);
        }}
        onSave={(data) => {
          if (selectedPart) {
            updatePart(selectedPart.id, data);
          } else {
            addPart(data);
          }
        }}
      />

      <StockTransferModal
        isOpen={isTransferModalOpen}
        parts={allParts}
        warehouses={warehouses}
        vehicles={vehicles}
        selectedPart={selectedPart}
        locale={locale}
        onClose={() => setIsTransferModalOpen(false)}
        onTransfer={transferStock}
      />

      <PurchaseOrderForm
        isOpen={isPOModalOpen}
        parts={allParts}
        suppliers={suppliers}
        locale={locale}
        onClose={() => setIsPOModalOpen(false)}
        onCreatePO={createPurchaseOrder}
      />

      <BarcodeScanner
        isOpen={isScannerOpen}
        parts={allParts}
        locale={locale}
        onClose={() => setIsScannerOpen(false)}
        onSelectPart={(part) => {
          setSelectedPart(part);
          setActiveTab('catalog');
        }}
      />
    </div>
  );
};
