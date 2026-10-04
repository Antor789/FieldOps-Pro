/**
 * FieldOps Pro - Inventory & Van Stock Management Types
 * Comprehensive hardware catalog, multi-warehouse & mobile vehicle tracking for Bangladesh field operations.
 */

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type LocationType = 'warehouse' | 'vehicle' | 'technician';

export interface Category {
  id: string;
  name: string;
  nameBangla?: string;
  icon: string;
  parentId?: string;
  itemCount: number;
}

export interface StockLocation {
  id: string;
  locationType: LocationType;
  locationId: string; // warehouseId or vehicleId
  locationName: string;
  quantity: number;
  reservedQuantity: number; // Allocated to active work orders
  availableQuantity: number;
}

export interface Part {
  id: string;
  sku: string;
  name: string;
  nameBangla?: string;
  description?: string;
  descriptionBangla?: string;

  // Category
  categoryId: string;
  categoryName: string;

  // Pricing
  unitPriceBDT: number; // Selling price in BDT
  costPriceBDT: number; // Procurement cost
  currency: 'BDT';

  // Stock
  totalStock: number;
  minimumStock: number;
  maximumStock?: number;
  reorderPoint: number;
  stockStatus: StockStatus;

  // Stock by location
  stockLocations: StockLocation[];

  // Specifications
  unit: string; // "piece", "meter", "kg", "liter", "set"
  unitBangla?: string;
  weightKg?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'inch';
  };

  // Identifiers & Specs
  barcode?: string;
  qrCode?: string;
  manufacturer?: string;
  modelNumber?: string;

  // Media
  images: string[];
  thumbnail?: string;

  // Tracking
  serialTracked: boolean;
  batchTracked: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastStockUpdate: Date;
}

export interface Warehouse {
  id: string;
  name: string;
  nameBangla?: string;
  address: string;
  division: string;
  district: string;
  isMain: boolean;
  managerId?: string;
  managerName?: string;
  contactPhone?: string;
  totalItemsCount?: number;
  totalValuationBDT?: number;
}

export interface VehicleStockItem {
  partId: string;
  sku: string;
  name: string;
  nameBangla?: string;
  category: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  unitPriceBDT: number;
  reservedForWorkOrderId?: string;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string; // "DM-KA-12-3456"
  vehicleType: 'van' | 'motorcycle' | 'pickup' | 'truck';
  technicianId: string;
  technicianName: string;
  technicianPhone?: string;
  currentZone: string;
  capacityItems: number; // Max parts capacity
  currentLoadItems: number;
  assignedParts: VehicleStockItem[];
}

export interface StockMovement {
  id: string;
  partId: string;
  partSku: string;
  partName: string;
  partNameBangla?: string;

  type: 'purchase' | 'transfer' | 'usage' | 'adjustment' | 'return';

  quantity: number;
  previousStock: number;
  newStock: number;

  fromLocation?: {
    type: LocationType;
    id: string;
    name: string;
  };
  toLocation?: {
    type: LocationType;
    id: string;
    name: string;
  };

  // Reference
  referenceType?: 'work_order' | 'purchase_order' | 'transfer_request';
  referenceId?: string;

  // Meta
  performedBy: string;
  performedByName: string;
  notes?: string;
  timestamp: Date;
}

export interface PurchaseOrderItem {
  partId: string;
  partSku: string;
  partName: string;
  quantity: number;
  unitPriceBDT: number;
  totalPriceBDT: number;
  receivedQuantity: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // "PO-2025-0042"

  supplierId: string;
  supplierName: string;
  supplierPhone?: string;
  supplierBin?: string;

  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'partial' | 'received' | 'cancelled';

  items: PurchaseOrderItem[];

  subtotalBDT: number;
  vatRate: number; // 0.15 for NBR 15% VAT
  vatAmountBDT: number;
  totalAmountBDT: number;

  expectedDelivery?: Date;
  actualDelivery?: Date;

  notes?: string;

  createdBy: string;
  createdByName: string;
  approvedBy?: string;
  approvedByName?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  nameBangla?: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
  nbrBin?: string; // NBR 15% VAT BIN (e.g. 002938102-0101)
  categories: string[];
  rating: number;
  isActive: boolean;
}
