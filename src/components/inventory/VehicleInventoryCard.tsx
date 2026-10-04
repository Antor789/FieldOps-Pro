import React from 'react';
import { Vehicle } from '../../types/inventory';
import { formatBDT } from '../../utils/formatters';
import { Truck, User, MapPin, Package, ArrowRightLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export interface VehicleInventoryCardProps {
  vehicles: Vehicle[];
  selectedVehicleId: string;
  locale?: 'en' | 'bn';
  onSelectVehicle: (id: string) => void;
  onRequestRestock: (vehicle: Vehicle) => void;
}

export const VehicleInventoryCard: React.FC<VehicleInventoryCardProps> = ({
  vehicles,
  selectedVehicleId,
  locale = 'en',
  onSelectVehicle,
  onRequestRestock,
}) => {
  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const totalValueBDT = activeVehicle.assignedParts.reduce(
    (acc, curr) => acc + curr.quantity * curr.unitPriceBDT,
    0
  );
  const capacityPct = Math.round((activeVehicle.currentLoadItems / activeVehicle.capacityItems) * 100);

  return (
    <div className="space-y-4">
      {/* Vehicle Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {vehicles.map((v) => {
          const isSelected = v.id === selectedVehicleId;
          const loadPct = Math.round((v.currentLoadItems / v.capacityItems) * 100);

          return (
            <div
              key={v.id}
              onClick={() => onSelectVehicle(v.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {v.vehicleNumber}
                    </h4>
                    <p className="text-[10px] text-slate-500">{v.technicianName}</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                  {loadPct}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    loadPct > 80 ? 'bg-amber-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${loadPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Vehicle Inventory Detail Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-indigo-600 text-white px-2 py-0.5 rounded">
                {activeVehicle.vehicleNumber}
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {activeVehicle.technicianName} ({activeVehicle.currentZone})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Vehicle Capacity: {activeVehicle.currentLoadItems}/{activeVehicle.capacityItems} units ({capacityPct}% loaded) • Total Stock Valuation: {formatBDT(totalValueBDT, locale)}
            </p>
          </div>

          <button
            onClick={() => onRequestRestock(activeVehicle)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors self-start sm:self-auto"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>{locale === 'bn' ? 'স্টক ট্রান্সফার / রিস্টক' : 'Restock from Warehouse'}</span>
          </button>
        </div>

        {/* Parts Inside Van */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
          {activeVehicle.assignedParts.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-semibold">
                {locale === 'bn' ? 'গাড়িতে কোনো পার্টস বরাদ্দ নেই' : 'No parts currently loaded in this vehicle.'}
              </p>
            </div>
          ) : (
            activeVehicle.assignedParts.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.sku}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {locale === 'bn' && item.nameBangla ? item.nameBangla : item.name}
                    </h4>
                    {item.reservedForWorkOrderId && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold">
                        <AlertCircle className="w-3 h-3" />
                        Reserved for {item.reservedForWorkOrderId}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center font-mono">
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px]">Loaded:</span>
                    <strong className="ml-1 text-slate-800 dark:text-slate-200">{item.quantity} units</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px]">Available:</span>
                    <strong className="ml-1 text-emerald-600 dark:text-emerald-400">{item.availableQuantity}</strong>
                  </div>
                  <div className="text-right font-bold text-slate-900 dark:text-white">
                    {formatBDT(item.quantity * item.unitPriceBDT, locale)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
