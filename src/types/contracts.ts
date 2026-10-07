/**
 * FieldOps Pro - Service Agreement & Contract Management System Types
 * AMC (Annual Maintenance Contracts), SLAs, On-demand, and Retainer contracts for Bangladesh enterprise operations.
 */

export type ContractType = 'amc' | 'sla' | 'on_demand' | 'project' | 'retainer';

export type ContractStatus = 'draft' | 'active' | 'expiring_soon' | 'expired' | 'terminated' | 'renewed';

export type ContractPaymentTerms = 'monthly' | 'quarterly' | 'annual' | 'upfront';

export type PriorityLevel = 'emergency' | 'critical' | 'high' | 'medium' | 'low';

export interface SLATerm {
  priority: PriorityLevel;
  responseTimeHours: number;
  resolutionTimeHours: number;
  penalty?: number; // BDT penalty for breach (টাকা)
  uptimeGuaranteePercent?: number; // e.g. 99.5%
}

export interface ContractEquipmentItem {
  id: string;
  name: string;
  serialNumber?: string;
  category: string;
  location: string;
  warrantyStatus: string;
}

export interface ContractServiceRecord {
  id: string;
  workOrderId: string;
  serviceDate: Date | string;
  serviceTitle: string;
  technicianName: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  slaMet: boolean;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
  costBDT: number;
}

export interface ContractPaymentMilestone {
  id: string;
  invoiceNumber: string;
  dueDate: Date | string;
  amountBDT: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paidDate?: Date | string;
  paymentMethod?: string;
  trxId?: string;
}

export interface ContractRenewalAdjustment {
  newValueBDT: number;
  newStartDate: Date | string;
  newEndDate: Date | string;
  rateAdjustmentPercent: number; // e.g. +5% inflation adjustment
  notes?: string;
  autoRenew: boolean;
}

export interface Contract {
  id: string;
  contractNumber: string; // e.g. "AMC-2026-0001", "SLA-2026-0012"
  title: string;
  titleBangla?: string;
  type: ContractType;
  status: ContractStatus;
  customerId: string;
  customerName: string;
  customerContactPerson?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  customerBin?: string; // NBR VAT BIN

  startDate: Date | string;
  endDate: Date | string;
  value: number; // Total Contract Value in BDT (৳)
  monthlyValue?: number; // Calculated or fixed monthly run rate
  paymentTerms: ContractPaymentTerms;

  slaTerms: SLATerm[];
  scopeOfWork: string[];
  coveredLocations: string[];
  coveredEquipment: ContractEquipmentItem[];
  assignedTechnicians: string[];

  autoRenew: boolean;
  signedAt?: Date | string;
  signedBy?: string;
  signature?: string; // base64 PNG data URL

  notes?: string;
  attachments?: string[];

  // Linked History
  serviceHistory?: ContractServiceRecord[];
  paymentMilestones?: ContractPaymentMilestone[];
  slaCompliancePercent?: number; // e.g. 97.8%
  renewedFromContractId?: string;
  renewalCount?: number;

  createdBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ContractStats {
  totalContracts: number;
  activeCount: number;
  expiringCount: number;
  expiredCount: number;
  draftCount: number;
  totalValueBDT: number;
  monthlyRecurringRevenueBDT: number;
  avgSlaCompliancePercent: number;
}
