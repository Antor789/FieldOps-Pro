import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  RealtimeConnectionStatus,
  RealtimeEventType,
  LiveFeedItem,
  OnlineUserPresence,
  WorkOrderCreatedPayload,
  WorkOrderStatusChangedPayload,
  WorkOrderCompletedPayload,
  TechnicianLocationPayload,
  PaymentReceivedPayload,
  SystemAlertPayload,
} from '../types/realtime';
import { socketService } from '../services/socketService';
import { soundService } from '../services/soundService';

export interface SocketContextValue {
  connectionStatus: RealtimeConnectionStatus;
  lastSyncedAt: Date | null;
  onlineUsers: OnlineUserPresence[];
  onlineTechCount: number;
  liveEvents: LiveFeedItem[];
  unreadEventCount: number;
  isFeedDrawerOpen: boolean;
  setIsFeedDrawerOpen: (open: boolean) => void;
  markEventAsRead: (id: string) => void;
  markAllEventsAsRead: () => void;
  clearLiveEvents: () => void;
  triggerEventSimulation: (type: RealtimeEventType, customData?: Record<string, any>) => void;
  reconnect: () => void;
  disconnect: () => void;
  emitEvent: (event: string, data: any) => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

const INITIAL_ONLINE_USERS: OnlineUserPresence[] = [
  {
    id: 'tech-1',
    name: 'Md. Rahim Uddin',
    role: 'Lead HVAC Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    isTechnician: true,
    status: 'online',
    location: {
      lat: 23.7465,
      lng: 90.3768,
      landmark: 'Dhanmondi 27, Dhaka',
    },
    lastSeen: 'Just now',
    activeWorkOrderId: 'WO-9045',
    batteryLevel: 88,
  },
  {
    id: 'tech-2',
    name: 'Tanvir Ahmed',
    role: 'Fiber Optic Network Tech',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
    isTechnician: true,
    status: 'online',
    location: {
      lat: 23.8068,
      lng: 90.3687,
      landmark: 'Mirpur 10 Circle, Dhaka',
    },
    lastSeen: '1 min ago',
    activeWorkOrderId: 'WO-9039',
    batteryLevel: 74,
  },
  {
    id: 'tech-3',
    name: 'Al-Amin Hossain',
    role: 'Substation & Solar Tech',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
    isTechnician: true,
    status: 'busy',
    location: {
      lat: 23.8759,
      lng: 90.3795,
      landmark: 'Uttara Sector 7, Dhaka',
    },
    lastSeen: '2 mins ago',
    activeWorkOrderId: 'WO-9022',
    batteryLevel: 92,
  },
  {
    id: 'tech-4',
    name: 'Shakil Mahmud',
    role: 'CCTV & IoT Systems',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face',
    isTechnician: true,
    status: 'online',
    location: {
      lat: 23.7925,
      lng: 90.4078,
      landmark: 'Gulshan 2 North Ave, Dhaka',
    },
    lastSeen: '3 mins ago',
    batteryLevel: 65,
  },
  {
    id: 'tech-5',
    name: 'Biplob Karmakar',
    role: 'High-Voltage Electrical Tech',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face',
    isTechnician: true,
    status: 'online',
    location: {
      lat: 23.733,
      lng: 90.4172,
      landmark: 'Motijheel C/A, Dhaka',
    },
    lastSeen: '5 mins ago',
    batteryLevel: 81,
  },
  {
    id: 'disp-1',
    name: 'Farhana Yasmin',
    role: 'Chief Dispatcher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face',
    isTechnician: false,
    status: 'online',
    lastSeen: 'Just now',
  },
  {
    id: 'admin-1',
    name: 'Md. Shafiqul Islam',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
    isTechnician: false,
    status: 'online',
    lastSeen: 'Just now',
  },
];

const INITIAL_LIVE_EVENTS: LiveFeedItem[] = [
  {
    id: 'evt-1',
    type: 'work_order:completed',
    category: 'work_order',
    title: 'WO-9045 Completed',
    subtitle: 'AC inverter board replaced by Rahim Uddin',
    timestamp: new Date(Date.now() - 4000).toISOString(),
    accentColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    badgeText: 'Completed',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
    unread: true,
    details: {
      workOrderId: 'WO-9045',
      technician: 'Md. Rahim Uddin',
      amountBDT: 8500,
      customer: 'Square Pharmaceuticals Ltd.',
    },
  },
  {
    id: 'evt-2',
    type: 'work_order:status_changed',
    category: 'work_order',
    title: 'Rahim: En Route',
    subtitle: 'En route to Jamuna Future Park site',
    timestamp: new Date(Date.now() - 15000).toISOString(),
    accentColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    badgeText: 'En Route',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
    unread: true,
    details: {
      workOrderId: 'WO-9048',
      technician: 'Md. Rahim Uddin',
      eta: '12 mins',
    },
  },
  {
    id: 'evt-3',
    type: 'payment:received',
    category: 'payment',
    title: 'Payment ৳8,500 Received',
    subtitle: 'bKash Merchant Pay Trx: BK9948X01',
    timestamp: new Date(Date.now() - 32000).toISOString(),
    accentColor: 'text-pink-500 bg-pink-50 dark:bg-pink-950/60 border-pink-200 dark:border-pink-800',
    badgeText: 'bKash Pay',
    badgeColor: 'bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300',
    unread: true,
    details: {
      amount: 8500,
      vatBDT: 1275,
      method: 'bKash',
      trxId: 'BK9948X01',
    },
  },
  {
    id: 'evt-4',
    type: 'technician:location',
    category: 'technician',
    title: 'Tanvir moved → Mirpur 10, Dhaka',
    subtitle: 'GPS update: speed 34 km/h, battery 74%',
    timestamp: new Date(Date.now() - 65000).toISOString(),
    accentColor: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
    badgeText: 'GPS Update',
    badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300',
    unread: false,
    details: {
      technician: 'Tanvir Ahmed',
      coords: '23.8068, 90.3687',
      speed: '34 km/h',
    },
  },
  {
    id: 'evt-5',
    type: 'work_order:created',
    category: 'work_order',
    title: 'New Emergency Order: WO-9051',
    subtitle: 'Substation power outage at Banani Block C',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    accentColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
    badgeText: 'Critical SLA',
    badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
    unread: false,
    details: {
      priority: 'CRITICAL',
      slaMinutes: 30,
      location: 'Banani Block C, Dhaka',
    },
  },
];

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState<RealtimeConnectionStatus>('connected');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(new Date());
  const [onlineUsers, setOnlineUsers] = useState<OnlineUserPresence[]>(INITIAL_ONLINE_USERS);
  const [liveEvents, setLiveEvents] = useState<LiveFeedItem[]>(INITIAL_LIVE_EVENTS);
  const [isFeedDrawerOpen, setIsFeedDrawerOpen] = useState<boolean>(false);

  // Initialize socket service
  useEffect(() => {
    socketService.connect();
    const unsubStatus = socketService.onStatusChange((status) => {
      setConnectionStatus(status);
      if (status === 'connected') {
        setLastSyncedAt(new Date());
      }
    });

    // Helper to append events
    const appendEvent = (item: LiveFeedItem) => {
      setLiveEvents((prev) => {
        // Keep last 30 events, newest first
        const next = [item, ...prev.slice(0, 29)];
        return next;
      });
      setLastSyncedAt(new Date());
    };

    // Subscriptions to socket events
    const unsubCreated = socketService.on<WorkOrderCreatedPayload>('work_order:created', (data) => {
      appendEvent({
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'work_order:created',
        category: 'work_order',
        title: `New Work Order: #${data.trackingNumber || data.workOrderId}`,
        subtitle: `${data.title} - ${data.location}`,
        timestamp: new Date().toISOString(),
        accentColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
        badgeText: data.priority,
        badgeColor: data.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60',
        unread: true,
        details: data,
      });
      soundService.play('default');
    });

    const unsubAssigned = socketService.on('work_order:assigned', (data: any) => {
      appendEvent({
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'work_order:assigned',
        category: 'work_order',
        title: `Order Assigned: ${data.technicianName}`,
        subtitle: `Assigned to #${data.trackingNumber || data.workOrderId}`,
        timestamp: new Date().toISOString(),
        accentColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
        badgeText: 'Assigned',
        badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60',
        unread: true,
        details: data,
      });
      soundService.play('success');
    });

    const unsubStatusChanged = socketService.on<WorkOrderStatusChangedPayload>('work_order:status_changed', (data) => {
      appendEvent({
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'work_order:status_changed',
        category: 'work_order',
        title: `Status: ${data.newStatus}`,
        subtitle: `${data.technicianName || 'Technician'} updated #${data.trackingNumber || data.workOrderId}`,
        timestamp: new Date().toISOString(),
        accentColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
        badgeText: data.newStatus,
        badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60',
        unread: true,
        details: data,
      });
    });

    const unsubCompleted = socketService.on<WorkOrderCompletedPayload>('work_order:completed', (data) => {
      appendEvent({
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'work_order:completed',
        category: 'work_order',
        title: `Job Completed: #${data.trackingNumber || data.workOrderId}`,
        subtitle: `${data.technicianName} completed job for ${data.customerName}`,
        timestamp: new Date().toISOString(),
        accentColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
        badgeText: 'Completed',
        badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60',
        unread: true,
        details: data,
      });
      soundService.play('success');
    });

    const unsubLocation = socketService.on<TechnicianLocationPayload>('technician:location', (data) => {
      appendEvent({
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'technician:location',
        category: 'technician',
        title: `${data.technicianName} moved → ${data.landmark}`,
        subtitle: `Speed ${data.speedKmH} km/h • Battery ${data.batteryPercent}%`,
        timestamp: new Date().toISOString(),
        accentColor: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
        badgeText: 'GPS',
        badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-900/60',
        unread: false,
        details: data,
      });

      // Update technician location in online users list
      setOnlineUsers((prev) =>
        prev.map((user) => {
          if (user.id === data.technicianId) {
            return {
              ...user,
              location: {
                lat: data.coordinates.lat,
                lng: data.coordinates.lng,
                landmark: data.landmark,
              },
              batteryLevel: data.batteryPercent,
              lastSeen: 'Just now',
            };
          }
          return user;
        })
      );
    });

    const unsubOnline = socketService.on('technician:online', (data: any) => {
      appendEvent({
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'technician:online',
        category: 'technician',
        title: `${data.technicianName} connected`,
        subtitle: 'Field mobile app opened • GPS active',
        timestamp: new Date().toISOString(),
        accentColor: 'text-teal-500 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800',
        badgeText: 'Online',
        badgeColor: 'bg-teal-100 text-teal-700 dark:bg-teal-900/60',
        unread: true,
        details: data,
      });

      setOnlineUsers((prev) =>
        prev.map((u) => (u.id === data.technicianId ? { ...u, status: 'online', lastSeen: 'Just now' } : u))
      );
    });

    const unsubOffline = socketService.on('technician:offline', (data: any) => {
      appendEvent({
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'technician:offline',
        category: 'technician',
        title: `${data.technicianName} signed off`,
        subtitle: 'Field app closed • Battery saved',
        timestamp: new Date().toISOString(),
        accentColor: 'text-slate-500 bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800',
        badgeText: 'Offline',
        badgeColor: 'bg-slate-200 text-slate-700 dark:bg-slate-800',
        unread: false,
        details: data,
      });

      setOnlineUsers((prev) =>
        prev.map((u) => (u.id === data.technicianId ? { ...u, status: 'offline', lastSeen: 'Just now' } : u))
      );
    });

    const unsubPayment = socketService.on<PaymentReceivedPayload>('payment:received', (data) => {
      appendEvent({
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'payment:received',
        category: 'payment',
        title: `Payment ৳${data.amountBDT.toLocaleString()} Received`,
        subtitle: `${data.method} Payment for #${data.invoiceNumber || data.workOrderId}`,
        timestamp: new Date().toISOString(),
        accentColor: 'text-pink-500 bg-pink-50 dark:bg-pink-950/60 border-pink-200 dark:border-pink-800',
        badgeText: data.method,
        badgeColor: 'bg-pink-100 text-pink-700 dark:bg-pink-900/60',
        unread: true,
        details: data,
      });
      soundService.play('success');
    });

    const unsubAlert = socketService.on<SystemAlertPayload>('system:alert', (data) => {
      appendEvent({
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'system:alert',
        category: 'system',
        title: `System Alert: ${data.title}`,
        subtitle: data.description,
        timestamp: new Date().toISOString(),
        accentColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
        badgeText: data.severity.toUpperCase(),
        badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60',
        unread: true,
        details: data,
      });
      soundService.play('urgent');
    });

    const unsubNotification = socketService.on('notification:new', (data: any) => {
      appendEvent({
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'notification:new',
        category: 'notification',
        title: data.title,
        subtitle: data.message,
        timestamp: new Date().toISOString(),
        accentColor: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800',
        badgeText: 'Alert',
        badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/60',
        unread: true,
        details: data,
      });
    });

    const unsubChat = socketService.on('chat:message', (data: any) => {
      appendEvent({
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'chat:message',
        category: 'chat',
        title: `${data.senderName}: "${data.text.slice(0, 32)}..."`,
        subtitle: `Chat in ${data.channelId || 'Work Order'}`,
        timestamp: new Date().toISOString(),
        accentColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
        badgeText: 'Chat',
        badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60',
        unread: true,
        details: data,
      });
    });

    return () => {
      unsubStatus();
      unsubCreated();
      unsubAssigned();
      unsubStatusChanged();
      unsubCompleted();
      unsubLocation();
      unsubOnline();
      unsubOffline();
      unsubPayment();
      unsubAlert();
      unsubNotification();
      unsubChat();
    };
  }, []);

  const onlineTechCount = useMemo(() => {
    return onlineUsers.filter((u) => u.isTechnician && u.status !== 'offline').length;
  }, [onlineUsers]);

  const unreadEventCount = useMemo(() => {
    return liveEvents.filter((e) => e.unread).length;
  }, [liveEvents]);

  const markEventAsRead = useCallback((id: string) => {
    setLiveEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, unread: false } : e))
    );
  }, []);

  const markAllEventsAsRead = useCallback(() => {
    setLiveEvents((prev) => prev.map((e) => ({ ...e, unread: false })));
  }, []);

  const clearLiveEvents = useCallback(() => {
    setLiveEvents([]);
  }, []);

  const triggerEventSimulation = useCallback((type: RealtimeEventType, customData?: Record<string, any>) => {
    const timestamp = new Date().toISOString();
    let payload: any = { id: `sim-${Date.now()}`, timestamp, ...customData };

    switch (type) {
      case 'work_order:created':
        payload = {
          ...payload,
          workOrderId: `WO-${Math.floor(9050 + Math.random() * 50)}`,
          trackingNumber: `WO-${Math.floor(9050 + Math.random() * 50)}`,
          title: customData?.title || 'Emergency High-Voltage Transformer Trip',
          customerName: customData?.customerName || 'Grameenphone NOC, Bashundhara',
          priority: customData?.priority || 'CRITICAL',
          location: customData?.location || 'Plot 3, Bashundhara R/A, Dhaka',
          division: 'Dhaka',
          estimatedCostBDT: 15400,
        };
        break;

      case 'work_order:assigned':
        payload = {
          ...payload,
          workOrderId: 'WO-9045',
          trackingNumber: 'WO-9045',
          title: 'AC Inverter Board Diagnostics',
          technicianId: 'tech-1',
          technicianName: 'Md. Rahim Uddin',
          technicianPhone: '01711-889922',
          customerName: 'Square Pharmaceuticals Ltd.',
          scheduledTime: '11:30 AM',
        };
        break;

      case 'work_order:status_changed':
        payload = {
          ...payload,
          workOrderId: 'WO-9045',
          trackingNumber: 'WO-9045',
          title: 'HVAC Servicing',
          oldStatus: 'DISPATCHED',
          newStatus: 'EN_ROUTE',
          technicianName: 'Md. Rahim Uddin',
          location: 'Dhanmondi Road 27, Dhaka',
          note: 'Technician departed with replacement compressor capacitor',
        };
        break;

      case 'work_order:completed':
        payload = {
          ...payload,
          workOrderId: 'WO-9045',
          trackingNumber: 'WO-9045',
          title: 'AC Inverter Board Diagnostics & Repair',
          technicianName: 'Md. Rahim Uddin',
          customerName: 'Square Pharmaceuticals Ltd.',
          durationMinutes: 48,
          totalAmountBDT: 8500,
          paymentMethod: 'BKASH',
          satisfactionRating: 5,
        };
        break;

      case 'technician:location':
        payload = {
          ...payload,
          technicianId: 'tech-2',
          technicianName: 'Tanvir Ahmed',
          coordinates: {
            lat: 23.8103 + (Math.random() - 0.5) * 0.01,
            lng: 90.4125 + (Math.random() - 0.5) * 0.01,
          },
          landmark: customData?.landmark || 'Mirpur 10 roundabout near Metrorail Pillar 214',
          speedKmH: Math.floor(25 + Math.random() * 25),
          batteryPercent: Math.max(20, Math.floor(65 + Math.random() * 30)),
          dutyStatus: 'EN_ROUTE',
        };
        break;

      case 'technician:online':
        payload = {
          ...payload,
          technicianId: 'tech-3',
          technicianName: 'Al-Amin Hossain',
          status: 'ONLINE',
          lastActiveTime: timestamp,
        };
        break;

      case 'technician:offline':
        payload = {
          ...payload,
          technicianId: 'tech-4',
          technicianName: 'Shakil Mahmud',
          status: 'OFFLINE',
          lastActiveTime: timestamp,
        };
        break;

      case 'payment:received':
        payload = {
          ...payload,
          paymentId: `PAY-${Date.now()}`,
          workOrderId: 'WO-9045',
          invoiceNumber: 'INV-2026-0891',
          customerName: 'Square Pharmaceuticals Ltd.',
          amountBDT: 8500,
          vatBDT: 1275,
          method: 'bKash',
          trxId: `BK${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        };
        break;

      case 'system:alert':
        payload = {
          ...payload,
          alertId: `ALT-${Date.now()}`,
          severity: customData?.severity || 'warning',
          title: customData?.title || 'SLA Threshold Warning - 3 Jobs Approaching 15m Breach',
          description: 'Mirpur DOHS and Gulshan 2 jobs have under 15 minutes before 2-hour SLA window expires.',
          sourceModule: 'Auto-Dispatch SLA Watchdog',
          requiresAck: true,
        };
        break;

      case 'notification:new':
        payload = {
          ...payload,
          notificationId: `NOTIF-${Date.now()}`,
          recipientId: 'all',
          title: 'NBR Mushak 6.3 Auto-Generated',
          message: 'Tax invoice generated with 15% VAT for WO-9045.',
          priority: 'high',
          category: 'tax',
        };
        break;

      case 'chat:message':
        payload = {
          ...payload,
          messageId: `MSG-${Date.now()}`,
          channelId: 'dispatch-channel',
          senderId: 'tech-1',
          senderName: 'Md. Rahim Uddin',
          senderRole: 'Lead Technician',
          text: customData?.text || 'Arrived at the substation. Parts unpacked, starting diagnostics now.',
        };
        break;
    }

    socketService.emit(type, payload);
  }, []);

  const reconnect = useCallback(() => {
    socketService.manualReconnect();
  }, []);

  const disconnect = useCallback(() => {
    socketService.disconnect();
  }, []);

  const emitEvent = useCallback((event: string, data: any) => {
    socketService.emit(event, data);
  }, []);

  const value = useMemo<SocketContextValue>(() => ({
    connectionStatus,
    lastSyncedAt,
    onlineUsers,
    onlineTechCount,
    liveEvents,
    unreadEventCount,
    isFeedDrawerOpen,
    setIsFeedDrawerOpen,
    markEventAsRead,
    markAllEventsAsRead,
    clearLiveEvents,
    triggerEventSimulation,
    reconnect,
    disconnect,
    emitEvent,
  }), [
    connectionStatus,
    lastSyncedAt,
    onlineUsers,
    onlineTechCount,
    liveEvents,
    unreadEventCount,
    isFeedDrawerOpen,
    markEventAsRead,
    markAllEventsAsRead,
    clearLiveEvents,
    triggerEventSimulation,
    reconnect,
    disconnect,
    emitEvent,
  ]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export function useSocketContext(): SocketContextValue {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
}
