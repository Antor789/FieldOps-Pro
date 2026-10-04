import React, { useState } from 'react';
import { Part } from '../../types/inventory';
import { formatBDT } from '../../utils/formatters';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MoreVertical,
  QrCode,
  ArrowRightLeft,
  Trash2,
  Edit2,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'motion/react';

export interface PartsTableProps {
  parts: Part[];
  locale?: 'en' | 'bn';
  onSelectPart: (part: Part) => void;
  onEditPart?: (part: Part) => void;
  onTransferPart?: (part: Part) => void;
  onDeletePart?: (partId: string) => void;
}

export const PartsTable: React.FC<PartsTableProps> = ({
  parts,
  locale = 'en',
  onSelectPart,
  onEditPart,
  onTransferPart,
  onDeletePart,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === parts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(parts.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={parts.length > 0 && selectedIds.length === parts.length}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>
              <th className="p-3.5">{locale === 'bn' ? 'এসকেইউ (SKU)' : 'SKU'}</th>
              <th className="p-3.5">{locale === 'bn' ? 'যন্ত্রাংশের নাম (Part Name)' : 'Part Name'}</th>
              <th className="p-3.5">{locale === 'bn' ? 'ক্যাটাগরি' : 'Category'}</th>
              <th className="p-3.5 text-center">{locale === 'bn' ? 'স্টক লেভেল' : 'Stock'}</th>
              <th className="p-3.5 text-center">{locale === 'bn' ? 'নূন্যতম' : 'Min'}</th>
              <th className="p-3.5 text-right">{locale === 'bn' ? 'একক মূল্য (৳)' : 'Unit Price (৳)'}</th>
              <th className="p-3.5 text-center">{locale === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
              <th className="p-3.5 text-right">{locale === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-xs text-slate-800 dark:text-slate-200">
            {parts.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-400">
                  <Package className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="font-semibold text-sm">
                    {locale === 'bn' ? 'কোনো পার্টস পাওয়া যায়নি' : 'No inventory items match your search'}
                  </p>
                </td>
              </tr>
            ) : (
              parts.map((part) => {
                const isSelected = selectedIds.includes(part.id);
                const isLow = part.stockStatus === 'low_stock';
                const isOut = part.stockStatus === 'out_of_stock';

                return (
                  <tr
                    key={part.id}
                    onClick={() => onSelectPart(part)}
                    className={`transition-colors cursor-pointer group hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 ${
                      isSelected ? 'bg-indigo-50/60 dark:bg-indigo-950/30' : ''
                    }`}
                  >
                    <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => toggleSelectOne(part.id, e as any)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {part.sku}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="flex items-center gap-2.5">
                        {part.images && part.images[0] ? (
                          <img
                            src={part.images[0]}
                            alt={part.name}
                            className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {part.sku.slice(0, 2)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {locale === 'bn' && part.nameBangla ? part.nameBangla : part.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {part.manufacturer || 'Standard'} • {part.unit}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                        {part.categoryName}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-mono font-extrabold text-sm">
                      <span className={isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-emerald-600'}>
                        {part.totalStock}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-mono text-slate-400">
                      {part.minimumStock}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatBDT(part.unitPriceBDT, locale)}
                    </td>
                    <td className="p-3.5 text-center">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                          <XCircle className="w-3 h-3" />
                          {locale === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          {locale === 'bn' ? 'স্বল্প স্টক' : 'Low Stock'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                          <CheckCircle2 className="w-3 h-3" />
                          {locale === 'bn' ? 'পর্যাপ্ত' : 'In Stock'}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100">
                        {onTransferPart && (
                          <button
                            onClick={() => onTransferPart(part)}
                            title={locale === 'bn' ? 'স্টক ট্রান্সফার' : 'Transfer Stock'}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 transition-colors"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>
                        )}
                        {onEditPart && (
                          <button
                            onClick={() => onEditPart(part)}
                            title={locale === 'bn' ? 'এডিট করুন' : 'Edit Part'}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDeletePart && (
                          <button
                            onClick={() => onDeletePart(part.id)}
                            title={locale === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
