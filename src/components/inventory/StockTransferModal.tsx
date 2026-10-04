import React, { useState } from 'react';
import { Part, Warehouse, Vehicle } from '../../types/inventory';
import { X, ArrowRightLeft, Check, Truck, Building2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface StockTransferModalProps {
  isOpen: boolean;
  parts: Part[];
  warehouses: Warehouse[];
  vehicles: Vehicle[];
  selectedPart?: Part | null;
  locale?: 'en' | 'bn';
  onClose: () => void;
  onTransfer: (
    partId: string,
    fromLoc: { type: 'warehouse' | 'vehicle'; id: string; name: string },
    toLoc: { type: 'warehouse' | 'vehicle'; id: string; name: string },
    quantity: number,
    notes?: string
  ) => void;
}

export const StockTransferModal: React.FC<StockTransferModalProps> = ({
  isOpen,
  parts,
  warehouses,
  vehicles,
  selectedPart,
  locale = 'en',
  onClose,
  onTransfer,
}) => {
  const { addToast } = useToast();

  const [partId, setPartId] = useState(selectedPart?.id || parts[0]?.id || '');
  const [fromLocId, setFromLocId] = useState(warehouses[0]?.id || 'wh-tejgaon');
  const [toLocId, setToLocId] = useState(vehicles[0]?.id || 'veh-104');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('Van restock for upcoming Gulshan & Banani jobs');

  if (!isOpen) return null;

  const activePart = parts.find((p) => p.id === partId) || parts[0];

  // Locations options
  const locationOptions = [
    ...warehouses.map((w) => ({
      id: w.id,
      type: 'warehouse' as const,
      name: `🏭 ${w.name}`,
    })),
    ...vehicles.map((v) => ({
      id: v.id,
      type: 'vehicle' as const,
      name: `🚐 ${v.vehicleNumber} (${v.technicianName})`,
    })),
  ];

  const fromLocation = locationOptions.find((l) => l.id === fromLocId) || locationOptions[0];
  const toLocation = locationOptions.find((l) => l.id === toLocId) || locationOptions[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (fromLocId === toLocId) {
      addToast({
        title: 'Invalid Transfer',
        message: 'Origin and destination locations must be different.',
        type: 'warning',
      });
      return;
    }

    onTransfer(
      activePart.id,
      { type: fromLocation.type, id: fromLocation.id, name: fromLocation.name },
      { type: toLocation.type, id: toLocation.id, name: toLocation.name },
      quantity,
      notes
    );

    addToast({
      title: 'Stock Transfer Recorded',
      message: `Transferred ${quantity}x ${activePart.name} to ${toLocation.name}.`,
      type: 'success',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {locale === 'bn' ? 'স্টক ট্রান্সফার রিকোয়েস্ট' : 'Stock Transfer Request'}
              </h3>
              <p className="text-xs text-slate-500">
                {locale === 'bn' ? 'ডিপো এবং টেকনিশিয়ান গাড়ির মধ্যে স্টক স্থানান্তর' : 'Depot & Field Vehicle Replenishment'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Select Part */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Hardware Part *
            </label>
            <select
              value={partId}
              onChange={(e) => setPartId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {parts.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.sku}] {p.name} (Total Stock: {p.totalStock} {p.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Transfer Grid (From -> To) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                From Location (উৎস)
              </label>
              <select
                value={fromLocId}
                onChange={(e) => setFromLocId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {locationOptions.map((l) => (
                  <option key={`from-${l.id}`} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                To Location (গন্তব্য)
              </label>
              <select
                value={toLocId}
                onChange={(e) => setToLocId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {locationOptions.map((l) => (
                  <option key={`to-${l.id}`} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity Stepper */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Transfer Quantity *
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold flex items-center justify-center hover:bg-slate-200"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-24 px-3 py-1.5 text-center font-mono font-extrabold text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold flex items-center justify-center hover:bg-slate-200"
              >
                +
              </button>
              <span className="text-slate-400 font-mono">units ({activePart.unit})</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Transfer Notes & Waybill Reference
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Action Footer */}
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
              className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{locale === 'bn' ? 'ট্রান্সফার নিশ্চিত করুন' : 'Confirm Transfer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
