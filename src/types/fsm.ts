/**
 * FieldOps Pro - Bangladesh Enterprise Field Service Management (FSM) Data Models
 * Adapted for Bangladesh Market Localization (PostGIS, BDT Currency, bKash/Nagad/COD Payments, Greenweb SMS, BST Timezone).
 */

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'COMPANY_ADMIN' 
  | 'DISPATCHER' 
  | 'WORKER' 
  | 'CUSTOMER' 
  | 'MANAGER' 
  | 'INVENTORY_MANAGER' 
  | 'FINANCE_MANAGER';

export type DutyStatus = 'ONLINE' | 'BUSY' | 'ON_BREAK' | 'OFFLINE';

export type NetworkStatus = 'ONLINE_4G' | 'POOR_SIGNAL' | 'OFFLINE_SYNC';

export type WorkOrderPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY' | 'CRITICAL';

export type WorkOrderStatus = 'PENDING' | 'ASSIGNED' | 'EN_ROUTE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type PaymentMethod = 'BKASH' | 'NAGAD' | 'UPAY' | 'SSLCOMMERZ' | 'CASH_ON_DELIVERY';

export type PaymentStatus = 'UNPAID' | 'PAID_BKASH' | 'PAID_NAGAD' | 'PAID_UPAY' | 'PAID_SSLCOMMERZ' | 'PAID_CASH';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  address?: string;
  division?: string;       // e.g. "Dhaka", "Chittagong"
  district?: string;       // e.g. "Dhaka", "Chattogram"
  thanaUpazila?: string;   // e.g. "Gulshan", "Banani", "Dhanmondi"
  area?: string;           // e.g. "Gulshan 2", "Road 11", "Sector 4"
  landmark?: string;       // e.g. "Near Gulshan 2 DCC Market", "Opposite City Bank"
  roadHouse?: string;      // e.g. "House 42, Road 11"
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  tier: 'ENTERPRISE' | 'PRO' | 'STANDARD';
  whitelabelConfig: {
    theme: 'dark' | 'light';
    logoUrl?: string;
    primaryColor: string;
  };
  slaDefaultTier: string;
  maxTechnicians: number;
  nbrBinNumber?: string;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  mfaEnabled: boolean;
  isActive: boolean;
  avatarUrl?: string;
  phoneBd?: string;
}

export interface Technician {
  id: string;
  tenantId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;            // e.g. "+880 1712-345678"
  skills: string[];
  vehicleType: string;      // e.g. "Response Van #104", "Motorbike Unit #02", "CNG Auto Service"
  workingHours: {
    start: string;
    end: string;
  };
  dutyStatus: DutyStatus;
  batteryLevel: number;     // 0..100
  locationPoint: LocationPoint;
  lastPingAt: string;
  vehicleParts: string[];
  activeWorkOrderCount: number;
  maxCapacity: number;
  networkStatus?: NetworkStatus;
  unSyncedBufferCount?: number;
}

export interface Site {
  id: string;
  tenantId: string;
  customerId: string;
  siteName: string;
  addressLine: string;
  locationPoint: LocationPoint;
  geofenceRadiusMeters: number;
  accessNotes?: string;
}

export interface PaymentReceipt {
  transactionId: string;
  method: PaymentMethod;
  subtotalBDT: number;
  vatBDT: number;           // 15% NBR Standard VAT
  totalBDT: number;
  paidAt: string;
  payerPhone?: string;
  nbrBin: string;
  isConfirmed: boolean;
}

export interface WorkOrder {
  id: string;
  tenantId: string;
  siteId: string;
  siteName: string;
  customerName: string;
  customerPhoneBd: string;   // e.g. "+880 1819-123456"
  assignedTechnicianId?: string | null;
  assignedTechnicianName?: string | null;
  title: string;
  description: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  locationPoint: LocationPoint;
  requiredSkills: string[];
  requiredParts?: string[];
  estimatedDurationMins: number;
  slaDeadline: string;        // ISO String
  pricingEstimatedBDT: number; // Amount in BDT ৳
  createdAt: string;
  updatedAt: string;
  trackingToken?: string;
  paymentStatus: PaymentStatus;
  paymentReceipt?: PaymentReceipt;
  lastSmsSentAt?: string;
  lastSmsContent?: string;
}

export interface ProofOfWork {
  id: string;
  tenantId: string;
  workOrderId: string;
  signatureUrl?: string;
  attachmentUrls: string[];
  checklistResponses: Record<string, boolean | string>;
  checkinTimestamp: string;
  checkoutTimestamp?: string;
  checkinLocation: LocationPoint;
  paymentReceipt?: PaymentReceipt;
}

export interface TelemetryPayload {
  technicianId: string;
  tenantId: string;
  latitude: number;
  longitude: number;
  speedKmh: number;
  headingDegrees: number;
  batteryLevel: number;
  dutyStatus: DutyStatus;
  recordedAt: string;
}

export interface CustomerTrackingData {
  trackingToken: string;
  workOrderId: string;
  jobTitle: string;
  status: WorkOrderStatus;
  customerName: string;
  customerPhoneBd: string;
  siteAddress: string;
  technician: {
    name: string;
    vehicleType: string;
    phone: string;
    currentLocation: LocationPoint;
    batteryPct: number;
  } | null;
  siteLocation: LocationPoint;
  etaMinutes: number;
  routePolyline?: [number, number][];
  pricingEstimatedBDT: number;
  paymentStatus: PaymentStatus;
}

export interface SmsNotification {
  id: string;
  workOrderId: string;
  recipientPhone: string;
  channel: 'SMS_GREENWEB' | 'WHATSAPP_BD' | 'BULKSMS_TELETAK';
  messageBn: string;
  messageEn: string;
  sentAt: string;
  status: 'DELIVERED' | 'SENT' | 'FAILED';
}

export interface OfflineSyncItem {
  id: string;
  type: 'SIGNATURE' | 'PHOTO' | 'CHECKLIST' | 'STATUS_CHANGE' | 'PAYMENT';
  payload: any;
  timestamp: string;
  synced: boolean;
}
