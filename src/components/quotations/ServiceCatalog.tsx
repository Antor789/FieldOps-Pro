import React, { useState, useMemo } from 'react';
import { CatalogItem } from '../../types/quotations';
import { SERVICE_CATALOG, formatBDT } from '../../data/mockQuotationData';
import {
  Search,
  Plus,
  Wrench,
  Zap,
  Activity,
  Network,
  Cpu,
  Truck,
  Check,
  Tag,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface ServiceCatalogProps {
  onSelectItem: (item: CatalogItem) => void;
  className?: string;
}

const CATEGORIES = [
  'All',
  'HVAC',
  'Electrical',
  'Generator',
  'Network',
  'Labor',
  'Consumables',
] as const;

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  onSelectItem,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return SERVICE_CATALOG.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchBn = item.nameBn?.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        return matchName || matchBn || matchDesc;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleAdd = (item: CatalogItem) => {
    onSelectItem(item);
    setRecentlyAddedId(item.id);
    setTimeout(() => setRecentlyAddedId(null), 1200);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Bar & Category Pills */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service catalog (e.g. AC Servicing, Transformer, R410A, Fiber)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Items Grid */}
      <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
        {filteredItems.length === 0 ? (
          <p className="text-center py-6 text-xs text-slate-400">
            No items found matching your catalog query.
          </p>
        ) : (
          filteredItems.map((item) => {
            const isAdded = recentlyAddedId === item.id;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
              >
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  {item.nameBn && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      {item.nameBn}
                    </span>
                  )}
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {formatBDT(item.defaultPriceBDT)}
                    </span>
                    <span className="text-[10px] text-slate-400">per {item.unit}</span>
                  </div>

                  <Button
                    type="button"
                    variant={isAdded ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleAdd(item)}
                    className={`h-7 px-2.5 text-[11px] transition-all ${
                      isAdded ? 'bg-emerald-600 border-emerald-600 text-white' : ''
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 mr-1" />
                        Add Item
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
