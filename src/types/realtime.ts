/**
 * FieldOps Pro - Real-time WebSocket & Socket.io Types
 * Live updates for dispatchers, technicians, payments, GPS tracking, and system alerts.
 */

export type RealtimeConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';

export type RealtimeEventType =
  | 'work_order:created'
  | 'work_order:assigned'
  | 'work_order:status_changed'
  | 'work_order:completed'
  | 'technician:location'
  | 'technician:online'
  | 'technician:offline'
  | 'payment:received'
  | 'notification:new'
  | 'chat:message'
  | 'system:alert';

export type EventCategory = 'work_order' | 'technician' | 'payment' | 'notification' | 'chat' | 'system';

export interface BaseRealtimePayload {
  id: string;
  timestamp: string;
  triggeredBy?: {
    id: string;
    name: string;
    role: string;
  };
}

export interface WorkOrderCreatedPayload extends BaseRealtimePayload {
  workOrderId: string;
  trackingNumber: string;
  title: string;
  customerName: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  location: string;
  division: string;
  estimatedCostBDT: number;
}

export interface WorkOrderAssignedPayload extends BaseRealtimePayload {
  workOrderId: string;
  trackingNumber: string;
  title: string;
  technicianId: string;
  technicianName: string;
  technicianPhone: string;
  customerName: string;
  scheduledTime: string;
}

export interface WorkOrderStatusChangedPayload extends BaseRealtimePayload {
  workOrderId: string;
  trackingNumber: string;
  title: string;
  oldStatus: string;
  newStatus: string;
  technicianName?: string;
  location: string;
  note?: string;
}

export interface WorkOrderCompletedPayload extends BaseRealtimePayload {
  workOrderId: string;
  trackingNumber: string;
  title: string;
  technicianName: string;
  customerName: string;
  durationMinutes: number;
  totalAmountBDT: number;
  paymentMethod: 'BKASH' | 'NAGAD' | 'CASH' | 'BANK_TRANSFER';
  satisfactionRating?: number;
}

export interface TechnicianLocationPayload extends BaseRealtimePayload {
  technicianId: string;
  technicianName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  landmark: string;
  speedKmH: number;
  batteryPercent: number;
  dutyStatus: 'ONLINE' | 'EN_ROUTE' | 'ON_JOB' | 'BREAK' | 'OFFLINE';
  destinationWorkOrderId?: string;
}

export interface TechnicianPresencePayload extends BaseRealtimePayload {
  technicianId: string;
  technicianName: string;
  status: 'ONLINE' | 'OFFLINE';
  deviceInfo?: string;
  currentZone?: string;
  lastActiveTime: string;
}

export interface PaymentReceivedPayload extends BaseRealtimePayload {
  paymentId: string;
  workOrderId: string;
  invoiceNumber: string;
  customerName: string;
  amountBDT: number;
  vatBDT: number;
  method: 'bKash' | 'Nagad' | 'Rocket' | 'Cash' | 'Bank';
  trxId: string;
  receivedByTechnician?: string;
}

export interface NotificationNewPayload extends BaseRealtimePayload {
  notificationId: string;
  recipientId: string;
  title: string;
  titleBn?: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  actionUrl?: string;
}

export interface ChatMessagePayload extends BaseRealtimePayload {
  messageId: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole: string;
  text: string;
  recipientId?: string;
  workOrderId?: string;
}

export interface SystemAlertPayload extends BaseRealtimePayload {
  alertId: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  sourceModule: string;
  requiresAck: boolean;
}

export interface LiveFeedItem {
  id: string;
  type: RealtimeEventType;
  category: EventCategory;
  title: string;
  subtitle?: string;
  timestamp: string;
  details?: Record<string, any>;
  iconType?: string;
  accentColor: string;
  badgeText?: string;
  badgeColor?: string;
  unread?: boolean;
}

export interface OnlineUserPresence {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  isTechnician: boolean;
  status: 'online' | 'busy' | 'away' | 'offline';
  location?: {
    lat: number;
    lng: number;
    landmark: string;
  };
  lastSeen: string;
  activeWorkOrderId?: string;
  batteryLevel?: number;
}
