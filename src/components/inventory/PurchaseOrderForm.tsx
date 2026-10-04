import React, { useState } from 'react';
import { Part, Supplier, PurchaseOrderItem } from '../../types/inventory';
import { formatBDT } from '../../utils/formatters';
import { X, FileSpreadsheet, Plus, Trash2, Check, DollarSign, Building } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface PurchaseOrderFormProps {
  isOpen: boolean;
  parts: Part[];
  suppliers: Supplier[];
  locale?: 'en' | 'bn';
  onClose: () => void;
  onCreatePO: (poData: any) => void;
}

export const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  isOpen,
  parts,
  suppliers,
  locale = 'en',
  onClose,
  onCreatePO,
}) => {
  const { addToast } = useToast();

  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || 'sup-energypac');
  const [expectedDate, setExpectedDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('Urgent field stock replenishment under NBR tax invoice regulations.');
  const [items, setItems] = useState<PurchaseOrderItem[]>([
    {
      partId: parts[0]?.id || 'part-trf-001',
      partSku: parts[0]?.sku || 'TRF-001',
      partName: parts[0]?.name || 'Transformer 11KV',
      quantity: 5,
      unitPriceBDT: parts[0]?.costPriceBDT || 38000,
      totalPriceBDT: (parts[0]?.costPriceBDT || 38000) * 5,
      receivedQuantity: 0,
    },
  ]);

  if (!isOpen) return null;

  const selectedSupplier = suppliers.find((s) => s.id === supplierId) || suppliers[0];

  const addItemRow = () => {
    const defaultPart = parts[items.length % parts.length] || parts[0];
    setItems([
      ...items,
      {
        partId: defaultPart.id,
        partSku: defaultPart.sku,
        partName: defaultPart.name,
        quantity: 10,
        unitPriceBDT: defaultPart.costPriceBDT || 1000,
        totalPriceBDT: (defaultPart.costPriceBDT || 1000) * 10,
        receivedQuantity: 0,
      },
    ]);
  };

  const removeItemRow = (idx: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== idx));
    }
  };

  const updateItemPart = (idx: number, partId: string) => {
    const matched = parts.find((p) => p.id === partId);
    if (!matched) return;
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const unitCost = matched.costPriceBDT || matched.unitPriceBDT;
        return {
          ...item,
          partId: matched.id,
          partSku: matched.sku,
          partName: matched.name,
          unitPriceBDT: unitCost,
          totalPriceBDT: unitCost * item.quantity,
        };
      })
    );
  };

  const updateItemQty = (idx: number, qty: number) => {
    const safeQty = Math.max(1, qty);
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        return {
          ...item,
          quantity: safeQty,
          totalPriceBDT: item.unitPriceBDT * safeQty,
        };
      })
    );
  };

  // Financial calculations
  const subtotal = items.reduce((acc, curr) => acc + curr.totalPriceBDT, 0);
  const vatRate = 0.15; // NBR 15%
  const vatAmount = Math.round(subtotal * vatRate);
  const grandTotal = subtotal + vatAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onCreatePO({
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      supplierPhone: selectedSupplier.phone,
      supplierBin: selectedSupplier.nbrBin,
      status: 'ordered',
      items,
      subtotalBDT: subtotal,
      vatRate: 0.15,
      vatAmountBDT: vatAmount,
      totalAmountBDT: grandTotal,
      expectedDelivery: new Date(expectedDate),
      notes,
      createdBy: 'user-admin',
      createdByName: 'Admin Procurement Desk',
    });

    addToast({
      title: 'Purchase Order Created',
      message: `PO sent to ${selectedSupplier.name} (Total: ${formatBDT(grandTotal, locale)} incl. 15% NBR VAT).`,
      type: 'success',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {locale === 'bn' ? 'নতুন পার্চেজ অর্ডার (PO) তৈরি করুন' : 'Create Purchase Order (PO)'}
              </h3>
              <p className="text-xs text-slate-500">
                {locale === 'bn' ? '১৫% এনবিআর ভ্যাট চালান ও সাপ্লায়ার রিকুইজিশন' : 'NBR 15% VAT Compliant Vendor Procurement'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Supplier & Delivery date */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Vendor / Supplier (Bangladesh) *
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (BIN: {s.nbrBin})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                Contact: {selectedSupplier.phone} • BIN: {selectedSupplier.nbrBin}
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Expected Delivery Date
              </label>
              <input
                type="date"
                required
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {locale === 'bn' ? 'অর্ডার আইটেম তালিকা' : 'Order Line Items'}
              </label>
              <button
                type="button"
                onClick={addItemRow}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{locale === 'bn' ? '+ আইটেম যোগ করুন' : '+ Add Line Item'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700"
                >
                  <div className="col-span-5">
                    <select
                      value={item.partId}
                      onChange={(e) => updateItemPart(idx, e.target.value)}
                      className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs truncate"
                    >
                      {parts.map((p) => (
                        <option key={p.id} value={p.id}>
                          [{p.sku}] {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItemQty(idx, Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-center font-mono rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  <div className="col-span-2 text-right font-mono text-xs text-slate-500">
                    ৳{(item.unitPriceBDT || 0).toLocaleString()}
                  </div>

                  <div className="col-span-2 text-right font-mono font-bold text-xs text-slate-900 dark:text-white">
                    ৳{(item.totalPriceBDT || 0).toLocaleString()}
                  </div>

                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeItemRow(idx)}
                      disabled={items.length <= 1}
                      className="text-rose-500 hover:text-rose-700 disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary (Subtotal + 15% NBR VAT) */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white font-mono space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Subtotal:</span>
              <span>{formatBDT(subtotal, locale)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">NBR VAT (15% Standard):</span>
              <span className="text-amber-400">+{formatBDT(vatAmount, locale)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800 text-sm font-bold">
              <span>Total Procurement Amount:</span>
              <span className="text-emerald-400">{formatBDT(grandTotal, locale)}</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Procurement Notes & NBR VAT Challan Reference
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {locale === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{locale === 'bn' ? 'অর্ডার ইস্যু করুন' : 'Issue Purchase Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
