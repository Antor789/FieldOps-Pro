import React, { useState } from 'react';
import { Part, Category } from '../../types/inventory';
import { generateMockBarcode } from '../../utils/inventoryHelpers';
import { X, Package, Sparkles, Check, DollarSign, QrCode } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface PartFormProps {
  isOpen: boolean;
  categories: Category[];
  initialPart?: Part | null;
  locale?: 'en' | 'bn';
  onClose: () => void;
  onSave: (partData: any) => void;
}

export const PartForm: React.FC<PartFormProps> = ({
  isOpen,
  categories,
  initialPart,
  locale = 'en',
  onClose,
  onSave,
}) => {
  const { addToast } = useToast();

  const [sku, setSku] = useState(initialPart?.sku || 'TRF-003');
  const [name, setName] = useState(initialPart?.name || 'Transformer Step-Up 33KV');
  const [nameBangla, setNameBangla] = useState(initialPart?.nameBangla || 'স্টেপ-আপ ট্রান্সফরমার ৩৩কেভি');
  const [description, setDescription] = useState(initialPart?.description || 'Substation high capacity industrial transformer unit.');
  const [categoryId, setCategoryId] = useState(initialPart?.categoryId || categories[0]?.id || 'cat-elec');
  const [unitPriceBDT, setUnitPriceBDT] = useState(initialPart?.unitPriceBDT || 65000);
  const [costPriceBDT, setCostPriceBDT] = useState(initialPart?.costPriceBDT || 52000);
  const [totalStock, setTotalStock] = useState(initialPart?.totalStock || 6);
  const [minimumStock, setMinimumStock] = useState(initialPart?.minimumStock || 3);
  const [reorderPoint, setReorderPoint] = useState(initialPart?.reorderPoint || 4);
  const [unit, setUnit] = useState(initialPart?.unit || 'piece');
  const [manufacturer, setManufacturer] = useState(initialPart?.manufacturer || 'Energypac Engineering BD');
  const [barcode, setBarcode] = useState(initialPart?.barcode || generateMockBarcode());

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const matchedCat = categories.find((c) => c.id === categoryId) || categories[0];

    onSave({
      sku,
      name,
      nameBangla,
      description,
      categoryId,
      categoryName: matchedCat.name,
      unitPriceBDT: Number(unitPriceBDT),
      costPriceBDT: Number(costPriceBDT),
      currency: 'BDT',
      totalStock: Number(totalStock),
      minimumStock: Number(minimumStock),
      reorderPoint: Number(reorderPoint),
      unit,
      manufacturer,
      barcode,
      serialTracked: true,
      batchTracked: false,
      images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&fit=crop&q=80'],
      stockLocations: [
        {
          id: `loc-${Date.now()}`,
          locationType: 'warehouse',
          locationId: 'wh-tejgaon',
          locationName: 'Tejgaon Central Depot',
          quantity: Number(totalStock),
          reservedQuantity: 0,
          availableQuantity: Number(totalStock),
        },
      ],
    });

    addToast({
      title: initialPart ? 'Part Updated' : 'New Part Created',
      message: `${name} (${sku}) saved to catalog.`,
      type: 'success',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {initialPart
                  ? locale === 'bn' ? 'যন্ত্রাংশের বিবরণ সম্পাদনা' : 'Edit Inventory Item'
                  : locale === 'bn' ? 'নতুন যন্ত্রাংশ যোগ করুন' : 'Add New Hardware Part'}
              </h3>
              <p className="text-xs text-slate-500">
                {locale === 'bn' ? 'বাংলাদেশ ফিল্ড সার্ভিস ক্যাটালগ' : 'Field Service Spares Catalog (Bangladesh)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* SKU & Barcode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                SKU (Part Number) *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Barcode / EAN-13
                </label>
                <button
                  type="button"
                  onClick={() => setBarcode(generateMockBarcode())}
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Generate
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                />
                <QrCode className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Part Name (English & Bangla) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Part Name (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                যন্ত্রাংশের নাম (বাংলা)
              </label>
              <input
                type="text"
                value={nameBangla}
                onChange={(e) => setNameBangla(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Unit */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Unit of Measure
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="piece">Piece (টি)</option>
                <option value="drum">Drum (ড্রাম)</option>
                <option value="set">Set (সেট)</option>
                <option value="meter">Meter (মিটার)</option>
                <option value="kg">Kilogram (কেজি)</option>
              </select>
            </div>
          </div>

          {/* Pricing in BDT */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Unit Price / Selling Price (৳ BDT) *
              </label>
              <input
                type="number"
                required
                value={unitPriceBDT}
                onChange={(e) => setUnitPriceBDT(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cost / Procurement Price (৳ BDT)
              </label>
              <input
                type="number"
                value={costPriceBDT}
                onChange={(e) => setCostPriceBDT(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Stock Levels */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Stock *
              </label>
              <input
                type="number"
                required
                value={totalStock}
                onChange={(e) => setTotalStock(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Minimum Stock
              </label>
              <input
                type="number"
                value={minimumStock}
                onChange={(e) => setMinimumStock(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reorder Point
              </label>
              <input
                type="number"
                value={reorderPoint}
                onChange={(e) => setReorderPoint(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Manufacturer */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Manufacturer / Vendor (Bangladesh)
            </label>
            <input
              type="text"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
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
              className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{locale === 'bn' ? 'সংরক্ষণ করুন' : 'Save Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
