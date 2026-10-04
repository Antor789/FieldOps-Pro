import { Part, StockStatus } from '../types/inventory';
import { formatBDT } from './formatters';

/**
 * Determine stock health status based on quantities and thresholds
 */
export function calculateStockStatus(currentStock: number, minStock: number): StockStatus {
  if (currentStock <= 0) return 'out_of_stock';
  if (currentStock <= minStock) return 'low_stock';
  return 'in_stock';
}

/**
 * Total inventory valuation in BDT
 */
export function calculateTotalInventoryValue(parts: Part[]): number {
  return parts.reduce((total, part) => total + part.totalStock * part.unitPriceBDT, 0);
}

/**
 * Generate a randomized mock barcode / QR string
 */
export function generateMockBarcode(prefix = '880'): string {
  const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `${prefix}${randomDigits}`;
}

/**
 * Export inventory list to CSV
 */
export function exportPartsToCSV(parts: Part[], filename = 'fieldops-inventory.csv') {
  const headers = ['SKU', 'Part Name', 'Category', 'Unit Price (BDT)', 'Total Stock', 'Min Stock', 'Status', 'Barcode'];
  const rows = parts.map((p) => [
    `"${p.sku}"`,
    `"${p.name}"`,
    `"${p.categoryName}"`,
    p.unitPriceBDT,
    p.totalStock,
    p.minimumStock,
    p.stockStatus,
    `"${p.barcode || ''}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
