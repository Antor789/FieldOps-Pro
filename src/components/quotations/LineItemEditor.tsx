import React, { useState } from 'react';
import { LineItem, QuotationSection, CatalogItem } from '../../types/quotations';
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  FolderPlus,
  BookOpen,
  DollarSign,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ServiceCatalog } from './ServiceCatalog';
import { formatBDT } from '../../data/mockQuotationData';

interface LineItemEditorProps {
  sections: QuotationSection[];
  onChange: (sections: QuotationSection[]) => void;
  className?: string;
}

const COMMON_UNITS = ['Unit', 'Hour', 'Kg', 'Lumpsum', 'Meter', 'Set', 'Piece', 'Point', 'Panel', 'Test', 'Kit'];

export const LineItemEditor: React.FC<LineItemEditorProps> = ({
  sections,
  onChange,
  className = '',
}) => {
  const [activeCatalogSectionId, setActiveCatalogSectionId] = useState<string | null>(null);

  // If no sections exist, initialize one
  const currentSections = sections.length > 0 ? sections : [{ id: 'sec-default', title: 'Scope of Services', items: [] }];

  const handleUpdateItem = (
    sectionId: string,
    itemId: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    const updated = currentSections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.map((item) => {
          if (item.id !== itemId) return item;
          const updatedItem = { ...item, [field]: value };
          // Auto-recalculate total
          if (field === 'quantity' || field === 'unitPrice') {
            const qty = field === 'quantity' ? Number(value) : item.quantity;
            const price = field === 'unitPrice' ? Number(value) : item.unitPrice;
            updatedItem.total = Math.round(qty * price);
          }
          return updatedItem;
        }),
      };
    });
    onChange(updated);
  };

  const handleAddItem = (sectionId: string) => {
    const updated = currentSections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      const newItem: LineItem = {
        id: `li-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        description: '',
        quantity: 1,
        unit: 'Unit',
        unitPrice: 1000,
        total: 1000,
      };
      return {
        ...sec,
        items: [...sec.items, newItem],
      };
    });
    onChange(updated);
  };

  const handleAddCatalogItem = (sectionId: string, catItem: CatalogItem) => {
    const updated = currentSections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      const newItem: LineItem = {
        id: `li-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        description: catItem.name,
        descriptionBn: catItem.nameBn,
        quantity: 1,
        unit: catItem.unit,
        unitPrice: catItem.defaultPriceBDT,
        total: catItem.defaultPriceBDT,
        category: catItem.category,
      };
      return {
        ...sec,
        items: [...sec.items, newItem],
      };
    });
    onChange(updated);
  };

  const handleRemoveItem = (sectionId: string, itemId: string) => {
    const updated = currentSections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.filter((item) => item.id !== itemId),
      };
    });
    onChange(updated);
  };

  const handleMoveItem = (sectionId: string, index: number, direction: 'up' | 'down') => {
    const updated = currentSections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      const items = [...sec.items];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return sec;
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      return { ...sec, items };
    });
    onChange(updated);
  };

  const handleAddSection = () => {
    const newSection: QuotationSection = {
      id: `sec-${Date.now()}`,
      title: `Service Section ${currentSections.length + 1}`,
      items: [],
    };
    onChange([...currentSections, newSection]);
  };

  const handleUpdateSectionTitle = (sectionId: string, title: string) => {
    const updated = currentSections.map((sec) => {
      if (sec.id === sectionId) return { ...sec, title };
      return sec;
    });
    onChange(updated);
  };

  const handleRemoveSection = (sectionId: string) => {
    if (currentSections.length <= 1) return; // Keep at least one section
    onChange(currentSections.filter((sec) => sec.id !== sectionId));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {currentSections.map((section, sIdx) => {
        const sectionTotal = section.items.reduce((sum, it) => sum + (it.total || 0), 0);
        const isCatalogOpen = activeCatalogSectionId === section.id;

        return (
          <div
            key={section.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden"
          >
            {/* Section Header */}
            <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <span className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center">
                  {sIdx + 1}
                </span>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                  placeholder="Section Title (e.g. HVAC Overhaul or Labor)"
                  className="font-bold text-sm bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-1 py-0.5 focus:border-blue-500 focus:outline-none max-w-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Section Subtotal: <strong className="text-slate-900 dark:text-white font-bold">{formatBDT(sectionTotal)}</strong>
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setActiveCatalogSectionId(isCatalogOpen ? null : section.id)
                  }
                  className="h-7 text-xs px-2.5 flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {isCatalogOpen ? 'Close Catalog' : 'Catalog Selector'}
                </Button>

                {currentSections.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSection(section.id)}
                    className="h-7 p-1 text-rose-500 hover:text-rose-700"
                    title="Remove Section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Embedded Service Catalog Drawer/Picker for this Section */}
            {isCatalogOpen && (
              <div className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-900 animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Select Predefined Bangladesh Field Services & Parts:
                  </h5>
                  <span className="text-[11px] text-blue-700 dark:text-blue-300">
                    Click &apos;Add Item&apos; to insert directly into this section
                  </span>
                </div>
                <ServiceCatalog
                  onSelectItem={(item) => handleAddCatalogItem(section.id, item)}
                />
              </div>
            )}

            {/* Section Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 dark:bg-slate-800/40 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3 w-8">#</th>
                    <th className="py-2.5 px-3 min-w-[240px]">Description (বিবরণ)</th>
                    <th className="py-2.5 px-3 w-24 text-center">Qty</th>
                    <th className="py-2.5 px-3 w-28">Unit</th>
                    <th className="py-2.5 px-3 w-32 text-right">Unit Price (৳)</th>
                    <th className="py-2.5 px-3 w-32 text-right">Total (৳)</th>
                    <th className="py-2.5 px-3 w-24 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {section.items.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400">
                        No line items in this section yet. Click &quot;Add Custom Item&quot; or choose from &quot;Catalog Selector&quot; above.
                      </td>
                    </tr>
                  ) : (
                    section.items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                        {/* Serial # */}
                        <td className="py-2 px-3 text-slate-400 font-mono">{index + 1}</td>

                        {/* Description */}
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              handleUpdateItem(section.id, item.id, 'description', e.target.value)
                            }
                            placeholder="e.g. AC Servicing (1.5T) or Labor Charges"
                            className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>

                        {/* Qty */}
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            step="any"
                            min="0.1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateItem(section.id, item.id, 'quantity', parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-2 py-1 text-xs text-center font-bold rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>

                        {/* Unit */}
                        <td className="py-2 px-3">
                          <select
                            value={item.unit}
                            onChange={(e) =>
                              handleUpdateItem(section.id, item.id, 'unit', e.target.value)
                            }
                            className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {COMMON_UNITS.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Unit Price */}
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1 justify-end">
                            <span className="text-slate-400 font-bold">৳</span>
                            <input
                              type="number"
                              step="50"
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) =>
                                handleUpdateItem(section.id, item.id, 'unitPrice', parseFloat(e.target.value) || 0)
                              }
                              className="w-24 px-2 py-1 text-xs text-right font-medium rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </td>

                        {/* Row Total */}
                        <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          {formatBDT(item.total)}
                        </td>

                        {/* Reorder and Delete Actions */}
                        <td className="py-2 px-3">
                          <div className="flex items-center justify-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleMoveItem(section.id, index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                              title="Move Up"
                            >
                              <MoveUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveItem(section.id, index, 'down')}
                              disabled={index === section.items.length - 1}
                              className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                              title="Move Down"
                            >
                              <MoveDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(section.id, item.id)}
                              className="p-1 text-rose-500 hover:text-rose-700"
                              title="Remove Item"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Section Bottom Add Buttons */}
            <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddItem(section.id)}
                className="text-xs h-7 px-3 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Custom Item
              </Button>

              <span className="text-[11px] text-slate-400">
                {section.items.length} item{section.items.length !== 1 ? 's' : ''} in section
              </span>
            </div>
          </div>
        );
      })}

      {/* Global Add Section Button */}
      <div className="flex justify-center pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddSection}
          className="text-xs flex items-center gap-1.5 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 py-2 px-4"
        >
          <FolderPlus className="w-4 h-4 text-blue-500" />
          Add Another Scope Section (আরেকটি সেকশন যোগ করুন)
        </Button>
      </div>
    </div>
  );
};
