export type Language = 'en' | 'bn';

export const translations = {
  en: {
    // Header & General
    appName: 'FieldOps Pro',
    appTagline: 'Bangladesh Enterprise FSM Engine',
    version: 'v3.4 SaaS BD',
    selectTenant: 'Select Enterprise Tenant',
    searchPlaceholder: 'Search work order, tech name, landmark (e.g. Gulshan 2), or asset...',
    pingsPerSec: '1,482 pings/s',
    onlineTechs: 'Online Techs',
    connected: 'CONNECTED',
    viewLiveMap: 'View Live Map',
    closeMap: 'Close Map',
    language: 'Language',
    currencySymbol: '৳',
    smsGateway: 'Greenweb SMS Gateway',
    
    // Role Views
    kanbanBoard: 'Kanban Board',
    techApp: 'Tech App (PWA)',
    livePortal: 'Live Customer Portal',
    
    // Kanban Columns
    colPending: 'Unassigned Queue',
    colPendingBn: 'অপেক্ষমান',
    colAssigned: 'Assigned / Scheduled',
    colAssignedBn: 'বরাদ্দকৃত',
    colEnRoute: 'En Route (GPS)',
    colEnRouteBn: 'চলমান (GPS)',
    colInProgress: 'In Progress (On-Site)',
    colInProgressBn: 'কাজ চলছে',
    colCompleted: 'Completed & Signed',
    colCompletedBn: 'সম্পন্ন ও স্বাক্ষরিত',

    // Priorities
    emergency: 'EMERGENCY',
    critical: 'CRITICAL',
    high: 'HIGH',
    medium: 'MEDIUM',
    low: 'LOW',

    // Field Tech Mobile
    dutyStatus: 'Duty Status',
    statusOnline: 'ONLINE',
    statusBusy: 'BUSY',
    statusBreak: 'ON BREAK',
    statusOffline: 'OFFLINE',
    sosButton: 'SOS PANIC',
    tabJob: '1. Job & Nav',
    tabSafety: '2. Safety Check',
    tabProof: '3. Sign & Proof',
    tabPayment: '4. Collection (৳)',
    networkStatus: 'Network Status',
    online4g: 'ONLINE 4G',
    poorSignal: 'POOR SIGNAL',
    offlineSync: 'OFFLINE - LOCAL SYNC ACTIVE',
    unSyncedItems: 'Items queued for local sync',
    startGps: 'Start GPS Navigation (En Route)',
    arrivedGeofence: 'Verify Geofence Arrival (Arrived)',
    startService: 'Begin Service Work (In Progress)',
    activeService: 'Service Active — Proceed to Payment & Proof',
    jobCompleted: 'Job Completed & NBR Receipt Issued',
    clearSignature: 'Clear Signature',
    saveSignature: 'Save Signature',
    customerSignature: 'Customer Digital Signature',
    attachPhoto: 'Attach Photo Proof of Work',
    collectPayment: 'Collect On-Site Payment',
    cashOnDelivery: 'Cash on Delivery (COD)',
    bkashMfs: 'bKash MFS',
    nagadMfs: 'Nagad MFS',
    upayMfs: 'Upay MFS',
    sslCommerz: 'SSLCommerz Card/NetBanking',
    finalizeJob: 'Finalize & Issue NBR BDT Receipt',

    // Customer Portal
    liveTrackerTitle: 'Live Technician Tracker',
    trackingCode: 'Tracking Code',
    estimatedArrival: 'Estimated Arrival Time',
    callTech: 'Call Technician',
    sendSmsAlert: 'SMS/WhatsApp Alert Sent',
    payBkashNow: 'Pay via bKash Now',
    downloadReceipt: 'Download NBR Receipt (PDF)',

    // Invoicing & Receipt
    nbrBin: 'NBR BIN: 002938102-0101',
    vatRate: 'NBR Standard VAT (15%)',
    subtotal: 'Subtotal',
    totalAmount: 'Total Amount Payable',
    receiptTitle: 'Official NBR Tax Invoice',
  },
  bn: {
    // Header & General
    appName: 'ফিল্ডঅপ্স প্রো',
    appTagline: 'বাংলাদেশ এন্টারপ্রাইজ ফিল্ড সার্ভিস সিস্টেম',
    version: 'ভার্সন ৩.৪ সাশ বিডি',
    selectTenant: 'এন্টারপ্রাইজ টেন্যান্ট নির্বাচন করুন',
    searchPlaceholder: 'ওয়ার্ক অর্ডার, টেকনিশিয়ান, ল্যান্ডমার্ক (যেমন: গুলশান ২) খুঁজুন...',
    pingsPerSec: '১,৪৮২ পিং/সেকেন্ড',
    onlineTechs: 'অনলাইন টেকনিশিয়ান',
    connected: 'সংযুক্ত',
    viewLiveMap: 'লাইভ ম্যাপ দেখুন',
    closeMap: 'ম্যাপ বন্ধ করুন',
    language: 'ভাষা',
    currencySymbol: '৳',
    smsGateway: 'গ্রিনওয়েব এসএমএস গেটওয়ে',

    // Role Views
    kanbanBoard: 'কানবান বোর্ড',
    techApp: 'টেক অ্যাপ (PWA)',
    livePortal: 'লাইভ কাস্টমার পোর্টাল',

    // Kanban Columns
    colPending: 'অপেক্ষমান',
    colPendingBn: 'অপেক্ষমান',
    colAssigned: 'বরাদ্দকৃত',
    colAssignedBn: 'বরাদ্দকৃত',
    colEnRoute: 'চলমান (GPS)',
    colEnRouteBn: 'চলমান (GPS)',
    colInProgress: 'কাজ চলছে',
    colInProgressBn: 'কাজ চলছে',
    colCompleted: 'সম্পন্ন ও স্বাক্ষরিত',
    colCompletedBn: 'সম্পন্ন ও স্বাক্ষরিত',

    // Priorities
    emergency: 'জরুরী (৩০ মি:)',
    critical: 'গুরুত্বপূর্ণ (১ ঘণ্টা)',
    high: 'উচ্চ অগ্রাধিকার',
    medium: 'মাঝারি অগ্রাধিকার',
    low: 'সাধারণ',

    // Field Tech Mobile
    dutyStatus: 'ডিউটি স্ট্যাটাস',
    statusOnline: 'অনলাইন',
    statusBusy: 'ব্যস্ত',
    statusBreak: 'বিরতি',
    statusOffline: 'অফলাইন',
    sosButton: 'জরুরী এসওএস',
    tabJob: '১. কাজ ও ম্যাপ',
    tabSafety: '২. সেফটি চেক',
    tabProof: '৩. স্বাক্ষর ও প্রমাণ',
    tabPayment: '৪. কালেকশন (৳)',
    networkStatus: 'নেটওয়ার্ক অবস্থা',
    online4g: 'অনলাইন ৪জি (সচল)',
    poorSignal: 'দুর্বল সিগন্যাল',
    offlineSync: 'অফলাইন - লোকাল সিঙ্ক সক্রিয়',
    unSyncedItems: 'লোকাল বাফারে পেন্ডিং তথ্য',
    startGps: 'জিপিএস নেভিগেশন শুরু করুন (চলমান)',
    arrivedGeofence: 'জিউফেন্স এরাইভাল যাচাই (পৌঁছেছেন)',
    startService: 'সার্ভিস কাজ শুরু করুন (চলমান)',
    activeService: 'কাজ চলছে — পেমেন্ট ও প্রুফ গ্রহণ করুন',
    jobCompleted: 'কাজ সম্পন্ন ও এনবিআর রসিদ ইস্যু করা হয়েছে',
    clearSignature: 'স্বাক্ষর মুছুন',
    saveSignature: 'স্বাক্ষর সংরক্ষণ করুন',
    customerSignature: 'গ্রাহকের ডিজিটাল স্বাক্ষর',
    attachPhoto: 'কাজের ফটো যুক্ত করুন',
    collectPayment: 'অন-সাইট পেমেন্ট সংগ্রহ',
    cashOnDelivery: 'ক্যাশ অন ডেলিভারি (নগদ)',
    bkashMfs: 'বিকাশ (bKash MFS)',
    nagadMfs: 'নগদ (Nagad MFS)',
    upayMfs: 'উপায় (Upay MFS)',
    sslCommerz: 'এসএসএলকমার্জ کارڈ/নেটব্যাংকিং',
    finalizeJob: 'কাজ সম্পন্ন ও এনবিআর রসিদ প্রদান করুন',

    // Customer Portal
    liveTrackerTitle: 'টেকনিশিয়ান ট্র্যাকিং ট্র্যাকার',
    trackingCode: 'ট্র্যাকিং কোড',
    estimatedArrival: 'আনুমানিক পৌঁছানোর সময়',
    callTech: 'টেকনিশিয়ানকে কল দিন',
    sendSmsAlert: 'এসএমএস/হোয়াটসঅ্যাপ বার্তা পাঠানো হয়েছে',
    payBkashNow: 'বিকাশে পেমেন্ট করুন',
    downloadReceipt: 'এনবিআর রসিদ ডাউনলোড (পিডিএফ)',

    // Invoicing & Receipt
    nbrBin: 'এনবিআর বিআইএন: ০০২৯৩৮১০২-০১০১',
    vatRate: 'এনবিআর ১৫% মূসক (ভ্যাট)',
    subtotal: 'মূল সেবা মূল্য',
    totalAmount: 'সর্বমোট প্রদেয় টাকা',
    receiptTitle: 'অফিশিয়াল এনবিআর ট্যাক্স চালান',
  }
};

/**
 * Utility to format numbers into BDT currency format.
 * Example: formatBDT(1500, 'en') => '৳ 1,500'
 * Example: formatBDT(1500, 'bn') => '৳ ১,৫০০'
 */
export function formatBDT(amount: number, lang: Language = 'en'): string {
  const formatted = amount.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `৳ ${formatted}`;
}

/**
 * Format timestamp in Dhaka Standard Time (BST / UTC+6)
 */
export function formatDhakaTime(dateInput: Date | string, lang: Language = 'en'): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Dhaka',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  const timeStr = date.toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', options);
  return `${timeStr} BST`;
}
