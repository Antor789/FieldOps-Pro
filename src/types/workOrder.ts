/**
 * FieldOps Pro - Enhanced Work Order Types & Interfaces
 * Compatible with Bangladesh FSM localization (BDT, Dhaka GIS, SLA timers, Greenweb SMS, bKash)
 */

export type Priority = 'emergency' | 'critical' | 'high' | 'medium' | 'low';
export type WorkOrderPriority = 'EMERGENCY' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type WorkOrderStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'EN_ROUTE'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'unassigned'
  | 'assigned'
  | 'en_route'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus =
  | 'UNPAID'
  | 'PAID_BKASH'
  | 'PAID_NAGAD'
  | 'PAID_UPAY'
  | 'PAID_SSLCOMMERZ'
  | 'PAID_CASH'
  | 'paid'
  | 'unpaid'
  | 'partial';

export type TechnicianStatus = 'available' | 'busy' | 'offline' | 'on_break' | 'ONLINE' | 'BUSY' | 'ON_BREAK' | 'OFFLINE';

export interface Location {
  landmark: string;
  area: string;
  district?: string;
  division?: string;
  address?: string;
  nearbyReference?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Customer {
  id: string;
  companyName: string;
  companyNameBangla?: string;
  contactPerson: string;
  phone: string;
  email?: string;
  isVIP?: boolean;
  nbrBin?: string;
}

export interface Technician {
  id: string;
  name: string;
  nameBangla?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: string;
  rating?: number;
  totalJobs?: number;
  status?: TechnicianStatus;
  dutyStatus?: 'ONLINE' | 'BUSY' | 'ON_BREAK' | 'OFFLINE';
  currentLocation?: {
    lat: number;
    lng: number;
  };
  distance?: string;
  eta?: string;
  phone: string;
  skills: string[];
  vehicleId?: string;
  vehicleType?: string;
}

export interface SLAInfo {
  deadline: Date | string;
  remainingMinutes: number;
  totalMinutes: number;
  progress: number;
  isBreached: boolean;
  breachedAt?: Date;
}

export interface RequiredPart {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  available: boolean;
}

export interface HistoryEntry {
  id: string;
  action: string;
  description: string;
  performedBy: string;
  timestamp: Date | string;
}

export interface WorkOrderData {
  id: string;
  workOrderNumber?: string;
  tenantId?: string;
  siteId?: string;
  siteName?: string;
  title: string;
  titleBangla?: string;
  serviceType?: string;
  description?: string;
  priority: WorkOrderPriority | Priority;
  status: WorkOrderStatus;
  location?: Location;
  locationPoint?: {
    latitude: number;
    longitude: number;
    address?: string;
    division?: string;
    district?: string;
    landmark?: string;
  };
  customer?: Customer;
  customerName?: string;
  customerPhoneBd?: string;
  assignedTechnician?: Technician;
  assignedTechnicianId?: string | null;
  assignedTechnicianName?: string | null;
  sla?: SLAInfo;
  slaDeadline?: string;
  requiredSkills: string[];
  requiredParts?: RequiredPart[] | string[];
  paymentStatus: PaymentStatus;
  estimatedCost?: number;
  pricingEstimatedBDT?: number;
  smsStatus?: 'pending' | 'sent' | 'delivered' | 'failed';
  scheduledTime?: Date | string;
  startedAt?: Date | string;
  completedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  history?: HistoryEntry[];
  notes?: string;
}
