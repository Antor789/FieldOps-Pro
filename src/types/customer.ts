/**
 * FieldOps Pro - Customer CRM & Service Sites Types
 * Enterprise customer relationship, multi-site infrastructure, NBR VAT billing, and equipment tracking for Bangladesh.
 */

export type CustomerType = 'enterprise' | 'sme' | 'residential' | 'government';
export type CustomerStatus = 'active' | 'inactive' | 'prospect' | 'churned';

export interface Address {
  street: string;
  area: string;
  district: string;
  division: string;
  postalCode?: string;
  landmark?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Contact {
  id: string;
  customerId: string;
  name: string;
  nameBangla?: string;
  designation: string;
  department?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  whatsapp?: string;
  role: 'primary' | 'billing' | 'technical' | 'escalation' | 'other';
  isPrimary: boolean;
  preferredContactMethod: 'phone' | 'email' | 'whatsapp' | 'sms';
  preferredLanguage: 'en' | 'bn';
  isActive: boolean;
  notes?: string;
}

export interface Equipment {
  id: string;
  siteId: string;
  name: string;
  type: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installationDate?: Date;
  warrantyExpiry?: Date;
  lastServiceDate?: Date;
  nextServiceDue?: Date;
  status: 'operational' | 'needs_service' | 'broken' | 'decommissioned';
  notes?: string;
}

export interface ServiceSite {
  id: string;
  customerId: string;
  siteName: string;
  siteNameBangla?: string;
  siteCode: string; // "SITE-001"
  siteType: 'office' | 'factory' | 'warehouse' | 'retail' | 'residential' | 'other';
  address: Address;
  siteContactId?: string;
  siteContactName?: string;
  siteContactPhone?: string;
  serviceTypes: string[]; // ["Electrical", "HVAC", "Telecom"]
  equipmentList?: Equipment[];
  accessInstructions?: string;
  securityRequirements?: string;
  operatingHours?: {
    open: string;
    close: string;
    days: number[]; // 0-6 (Sun-Sat)
  };
  totalJobs: number;
  lastServiceDate?: Date;
  isActive: boolean;
  notes?: string;
}

export interface ServiceAgreement {
  id: string;
  customerId: string;
  agreementNumber: string; // "SA-2025-0015"
  type: 'annual' | 'monthly' | 'per_call' | 'custom';
  startDate: Date;
  endDate: Date;
  coveredSites: string[]; // Site IDs
  coveredServices: string[];
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
  monthlyFeeBDT?: number;
  annualFeeBDT?: number;
  discountPercent?: number;
  termsAndConditions?: string;
  status: 'draft' | 'active' | 'expired' | 'cancelled';
  autoRenew: boolean;
  renewalReminderDays: number;
}

export interface CustomerInteraction {
  id: string;
  customerId: string;
  type: 'call' | 'email' | 'meeting' | 'site_visit' | 'complaint' | 'feedback' | 'note' | 'payment';
  subject: string;
  description: string;
  contactId?: string;
  contactName?: string;
  workOrderId?: string;
  outcome?: string;
  rating?: number; // 1-5
  amountBDT?: number;
  followUpRequired: boolean;
  followUpDate?: Date;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
}

export interface Customer {
  id: string;
  companyName: string;
  companyNameBangla?: string;
  customerType: CustomerType;
  status: CustomerStatus;
  customerCode: string; // "CUST-0001"
  nbrBin?: string; // NBR 15% VAT BIN number (002938102-0101)
  tradeLicense?: string;
  primaryEmail: string;
  primaryPhone: string;
  website?: string;
  headOffice: Address;
  contacts: Contact[];
  primaryContactId: string;
  sites: ServiceSite[];
  creditLimitBDT?: number;
  paymentTermsDays: number; // e.g. 30 days
  outstandingBalanceBDT: number;
  lifetimeValueBDT: number;
  hasServiceAgreement: boolean;
  serviceAgreement?: ServiceAgreement;
  totalJobs: number;
  completedJobs: number;
  averageRating: number;
  lastServiceDate?: Date;
  tags: string[];
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
