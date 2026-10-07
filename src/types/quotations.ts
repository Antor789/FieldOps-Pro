/**
 * FieldOps Pro - Professional Quotation & Estimate System Types
 * Bangladesh context: BDT currency, 15% NBR VAT, formal quotation and estimation workflow.
 */

export type QuotationStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'converted';

export interface LineItem {
  id: string;
  description: string;
  descriptionBn?: string;
  quantity: number;
  unit: string; // e.g. 'Unit', 'Hour', 'Kg', 'Lumpsum', 'Meter', 'Set'
  unitPrice: number; // in BDT
  discount?: number; // line item discount in BDT or percent
  total: number; // calculated line total
  category?: string; // HVAC, Electrical, Labor, Materials, etc.
}

export interface QuotationSection {
  id: string;
  title: string;
  titleBn?: string;
  items: LineItem[];
}

export interface QuotationComment {
  id: string;
  author: string;
  role: string;
  avatar?: string;
  message: string;
  createdAt: Date | string;
  isInternal?: boolean;
}

export interface Quotation {
  id: string;
  quotationNumber: string; // e.g. "QT-2025-0001"
  status: QuotationStatus;

  customerId: string;
  customerName: string;
  customerNameBn?: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  customerBin?: string; // NBR VAT BIN

  date: Date | string;
  validUntil: Date | string;

  sections: QuotationSection[];

  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  includeVat: boolean; // toggle 15% NBR VAT
  vatRate: number; // 0.15 for 15% VAT
  vatAmount: number;
  total: number;

  notes?: string;
  terms?: string;

  sentAt?: Date | string;
  viewedAt?: Date | string;
  approvedAt?: Date | string;
  rejectedAt?: Date | string;
  rejectionReason?: string;

  convertedToWorkOrderId?: string;
  convertedAt?: Date | string;

  comments?: QuotationComment[];

  createdBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface QuotationStats {
  totalQuotations: number;
  draftCount: number;
  sentCount: number;
  viewedCount: number;
  approvedCount: number;
  rejectedCount: number;
  expiredCount: number;
  convertedCount: number;

  totalPipelineValueBDT: number;
  totalApprovedValueBDT: number;
  conversionRatePercent: number;
  avgQuoteValueBDT: number;
}

export interface CatalogItem {
  id: string;
  name: string;
  nameBn?: string;
  category: 'HVAC' | 'Electrical' | 'Generator' | 'Plumbing' | 'Network' | 'Labor' | 'Consumables';
  unit: string;
  defaultPriceBDT: number;
  description: string;
}
