import { useState, useCallback, useMemo } from 'react';
import { Part, Category, StockMovement, StockStatus, Warehouse } from '../types/inventory';
import {
  INITIAL_PARTS,
  INITIAL_CATEGORIES,
  INITIAL_WAREHOUSES,
  INITIAL_STOCK_MOVEMENTS,
} from '../data/sampleInventoryData';
import { calculateStockStatus } from '../utils/inventoryHelpers';

export function useInventory() {
  const [parts, setParts] = useState<Part[]>(INITIAL_PARTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [movements, setMovements] = useState<StockMovement[]>(INITIAL_STOCK_MOVEMENTS);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState<StockStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  // Modals
  const [isAddPartModalOpen, setIsAddPartModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);

  // Add Part
  const addPart = useCallback((newPartData: Omit<Part, 'id' | 'createdAt' | 'updatedAt' | 'lastStockUpdate' | 'stockStatus'>) => {
    const id = `part-${Date.now()}`;
    const stockStatus = calculateStockStatus(newPartData.totalStock, newPartData.minimumStock);
    const part: Part = {
      ...newPartData,
      id,
      stockStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastStockUpdate: new Date(),
    };
    setParts((prev) => [part, ...prev]);

    // Record stock movement if initial stock > 0
    if (newPartData.totalStock > 0) {
      setMovements((prev) => [
        {
          id: `mov-${Date.now()}`,
          partId: id,
          partSku: part.sku,
          partName: part.name,
          type: 'adjustment',
          quantity: part.totalStock,
          previousStock: 0,
          newStock: part.totalStock,
          performedBy: 'user-admin',
          performedByName: 'Admin Dispatcher',
          notes: 'Initial inventory creation consignment.',
          timestamp: new Date(),
        },
        ...prev,
      ]);
    }
    return part;
  }, []);

  // Update Part
  const updatePart = useCallback((id: string, updates: Partial<Part>) => {
    setParts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updatedTotal = updates.totalStock !== undefined ? updates.totalStock : p.totalStock;
        const updatedMin = updates.minimumStock !== undefined ? updates.minimumStock : p.minimumStock;
        const stockStatus = calculateStockStatus(updatedTotal, updatedMin);
        return {
          ...p,
          ...updates,
          stockStatus,
          updatedAt: new Date(),
          lastStockUpdate: updates.totalStock !== undefined ? new Date() : p.lastStockUpdate,
        };
      })
    );
    setSelectedPart((prev) => (prev?.id === id ? { ...prev, ...updates } : prev));
  }, []);

  // Delete Part
  const deletePart = useCallback((id: string) => {
    setParts((prev) => prev.filter((p) => p.id !== id));
    if (selectedPart?.id === id) {
      setSelectedPart(null);
    }
  }, [selectedPart]);

  // Transfer stock between Warehouse and Vehicle
  const transferStock = useCallback((
    partId: string,
    fromLoc: { type: 'warehouse' | 'vehicle'; id: string; name: string },
    toLoc: { type: 'warehouse' | 'vehicle'; id: string; name: string },
    quantity: number,
    notes?: string
  ) => {
    setParts((prev) =>
      prev.map((p) => {
        if (p.id !== partId) return p;

        const updatedLocations = p.stockLocations.map((loc) => {
          if (loc.locationId === fromLoc.id) {
            const nextQty = Math.max(0, loc.quantity - quantity);
            return {
              ...loc,
              quantity: nextQty,
              availableQuantity: Math.max(0, nextQty - loc.reservedQuantity),
            };
          }
          if (loc.locationId === toLoc.id) {
            const nextQty = loc.quantity + quantity;
            return {
              ...loc,
              quantity: nextQty,
              availableQuantity: nextQty - loc.reservedQuantity,
            };
          }
          return loc;
        });

        // If toLoc didn't exist in stockLocations, add it
        const existsTo = updatedLocations.some((loc) => loc.locationId === toLoc.id);
        if (!existsTo) {
          updatedLocations.push({
            id: `loc-${Date.now()}`,
            locationType: toLoc.type,
            locationId: toLoc.id,
            locationName: toLoc.name,
            quantity: quantity,
            reservedQuantity: 0,
            availableQuantity: quantity,
          });
        }

        return {
          ...p,
          stockLocations: updatedLocations,
          updatedAt: new Date(),
          lastStockUpdate: new Date(),
        };
      })
    );

    // Add movement audit record
    const targetPart = parts.find((p) => p.id === partId);
    if (targetPart) {
      setMovements((prev) => [
        {
          id: `mov-${Date.now()}`,
          partId,
          partSku: targetPart.sku,
          partName: targetPart.name,
          partNameBangla: targetPart.nameBangla,
          type: 'transfer',
          quantity,
          previousStock: targetPart.totalStock,
          newStock: targetPart.totalStock,
          fromLocation: fromLoc,
          toLocation: toLoc,
          referenceType: 'transfer_request',
          performedBy: 'user-admin',
          performedByName: 'Admin Dispatcher',
          notes: notes || `Internal stock transfer between ${fromLoc.name} and ${toLoc.name}`,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    }
  }, [parts]);

  // Filtered Parts
  const filteredParts = useMemo(() => {
    return parts.filter((part) => {
      // Category filter
      if (selectedCategory !== 'all' && part.categoryId !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStockStatus !== 'all' && part.stockStatus !== selectedStockStatus) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = part.name.toLowerCase().includes(q) || (part.nameBangla && part.nameBangla.includes(q));
        const matchesSku = part.sku.toLowerCase().includes(q);
        const matchesBarcode = part.barcode && part.barcode.includes(q);
        const matchesCat = part.categoryName.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesBarcode && !matchesCat) {
          return false;
        }
      }
      return true;
    });
  }, [parts, selectedCategory, selectedStockStatus, searchQuery]);

  // Summary Metrics
  const metrics = useMemo(() => {
    let totalItems = parts.length;
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let totalValuation = 0;

    parts.forEach((p) => {
      totalValuation += p.totalStock * p.unitPriceBDT;
      if (p.stockStatus === 'in_stock') inStock++;
      else if (p.stockStatus === 'low_stock') lowStock++;
      else outOfStock++;
    });

    return {
      totalItems,
      inStock,
      lowStock,
      outOfStock,
      totalValuation,
    };
  }, [parts]);

  return {
    parts: filteredParts,
    allParts: parts,
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
  };
}
