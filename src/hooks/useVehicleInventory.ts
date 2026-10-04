import { useState, useCallback } from 'react';
import { Vehicle, VehicleStockItem } from '../types/inventory';
import { INITIAL_VEHICLES } from '../data/sampleInventoryData';

export function useVehicleInventory() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(INITIAL_VEHICLES[0].id);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const requestPartsForVehicle = useCallback(
    (vehicleId: string, item: Omit<VehicleStockItem, 'reservedQuantity' | 'availableQuantity'>) => {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id !== vehicleId) return v;
          const existingItemIndex = v.assignedParts.findIndex((p) => p.partId === item.partId);
          let updatedParts = [...v.assignedParts];

          if (existingItemIndex > -1) {
            const curr = updatedParts[existingItemIndex];
            const nextQty = curr.quantity + item.quantity;
            updatedParts[existingItemIndex] = {
              ...curr,
              quantity: nextQty,
              availableQuantity: nextQty - curr.reservedQuantity,
            };
          } else {
            updatedParts.push({
              ...item,
              reservedQuantity: 0,
              availableQuantity: item.quantity,
            });
          }

          return {
            ...v,
            assignedParts: updatedParts,
            currentLoadItems: updatedParts.reduce((acc, curr) => acc + curr.quantity, 0),
          };
        })
      );
    },
    []
  );

  const returnPartsFromVehicle = useCallback(
    (vehicleId: string, partId: string, quantityToReturn: number) => {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id !== vehicleId) return v;
          const updatedParts = v.assignedParts
            .map((p) => {
              if (p.partId === partId) {
                const nextQty = Math.max(0, p.quantity - quantityToReturn);
                return {
                  ...p,
                  quantity: nextQty,
                  availableQuantity: Math.max(0, nextQty - p.reservedQuantity),
                };
              }
              return p;
            })
            .filter((p) => p.quantity > 0);

          return {
            ...v,
            assignedParts: updatedParts,
            currentLoadItems: updatedParts.reduce((acc, curr) => acc + curr.quantity, 0),
          };
        })
      );
    },
    []
  );

  return {
    vehicles,
    selectedVehicle,
    selectedVehicleId,
    setSelectedVehicleId,
    requestPartsForVehicle,
    returnPartsFromVehicle,
  };
}
