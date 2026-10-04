export interface JobsOverTimeData {
  date: string;
  displayDate: string;
  completed: number;
  created: number;
  cancelled?: number;
}

export interface JobsByStatusData {
  status: string;
  label: string;
  labelBn: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RevenueByServiceData {
  service: string;
  serviceBn: string;
  revenue: number;
  jobs: number;
  color: string;
}

export interface SLAPriorityBreakdown {
  priority: string;
  priorityBn: string;
  rate: number;
  target: number;
}

export interface SLAPerformanceData {
  currentRate: number;
  targetRate: number;
  breachedCount: number;
  totalJobs: number;
  trend: 'improving' | 'declining' | 'stable';
  byPriority: SLAPriorityBreakdown[];
}

export interface TechnicianLeaderboardItem {
  id: string;
  rank: number;
  name: string;
  nameBn?: string;
  role: string;
  avatar?: string;
  jobs: number;
  revenue: number;
  rating: number;
  sla: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

export interface ActivityItem {
  id: string;
  type: 'job_completed' | 'payment_received' | 'sla_warning' | 'job_created' | 'tech_assigned';
  title: string;
  titleBn?: string;
  description: string;
  descriptionBn?: string;
  timestamp: string;
  metadata?: {
    workOrderId?: string;
    amount?: number;
    technicianName?: string;
  };
}

export interface DivisionData {
  division: string;
  divisionBn: string;
  jobs: number;
  percentage: number;
  revenue: number;
  activeTechs: number;
}

export interface AnalyticsData {
  totalJobs: number;
  completedJobs: number;
  completionRate: number;
  averageResponseTime: number; // minutes
  totalRevenue: number;
  jobsTrend: number;
  revenueTrend: number;
  jobsOverTime: JobsOverTimeData[];
  jobsByStatus: JobsByStatusData[];
  revenueByService: RevenueByServiceData[];
  slaPerformance: SLAPerformanceData;
  technicianLeaderboard: TechnicianLeaderboardItem[];
  recentActivity: ActivityItem[];
  divisionDistribution: DivisionData[];
}

export const sampleAnalyticsData: AnalyticsData = {
  totalJobs: 156,
  completedJobs: 142,
  completionRate: 91.0,
  averageResponseTime: 47,
  totalRevenue: 452000,
  jobsTrend: 12.4,
  revenueTrend: 18.2,

  jobsOverTime: [
    { date: '2026-09-27', displayDate: 'Sat', completed: 18, created: 22 },
    { date: '2026-09-28', displayDate: 'Sun', completed: 22, created: 20 },
    { date: '2026-09-29', displayDate: 'Mon', completed: 15, created: 18 },
    { date: '2026-09-30', displayDate: 'Tue', completed: 20, created: 24 },
    { date: '2026-10-01', displayDate: 'Wed', completed: 25, created: 22 },
    { date: '2026-10-02', displayDate: 'Thu', completed: 28, created: 26 },
    { date: '2026-10-03', displayDate: 'Fri (Today)', completed: 14, created: 16 },
  ],

  jobsByStatus: [
    { status: 'completed', label: 'Completed', labelBn: 'সম্পন্ন', count: 142, percentage: 65, color: '#10B981' },
    { status: 'in_progress', label: 'In Progress', labelBn: 'কাজ চলছে', count: 44, percentage: 20, color: '#F59E0B' },
    { status: 'scheduled', label: 'Scheduled', labelBn: 'নির্ধারিত', count: 22, percentage: 10, color: '#6366F1' },
    { status: 'unassigned', label: 'Unassigned', labelBn: 'অপেক্ষমান', count: 11, percentage: 5, color: '#EF4444' },
  ],

  revenueByService: [
    { service: 'Electrical Maintenance', serviceBn: 'ইলেকট্রিক্যাল মেইনটেন্যান্স', revenue: 180000, jobs: 45, color: '#F59E0B' },
    { service: 'HVAC & Cooling Systems', serviceBn: 'এইচভিএসি ও কুলিং সিস্টেম', revenue: 145000, jobs: 38, color: '#6366F1' },
    { service: 'Plumbing & Hydraulic', serviceBn: 'প্লাম্বিং ও হাইড্রোলিক', revenue: 98000, jobs: 28, color: '#10B981' },
    { service: 'Telecom Tower & Fiber', serviceBn: 'টেলিকম টাওয়ার ও ফাইবার', revenue: 72000, jobs: 22, color: '#0284C7' },
    { service: 'Industrial Generator', serviceBn: 'ইন্ডাস্ট্রিয়াল জেনারেটর', revenue: 45000, jobs: 15, color: '#8B5CF6' },
  ],

  slaPerformance: {
    currentRate: 94.2,
    targetRate: 95.0,
    breachedCount: 8,
    totalJobs: 156,
    trend: 'improving',
    byPriority: [
      { priority: 'Emergency', priorityBn: 'জরুরী (৩০ মি.)', rate: 100, target: 98 },
      { priority: 'Critical', priorityBn: 'জটিল (১ ঘণ্টা)', rate: 96, target: 95 },
      { priority: 'High', priorityBn: 'উচ্চ (৪ ঘণ্টা)', rate: 94, target: 95 },
      { priority: 'Medium', priorityBn: 'মাঝারি (৮ ঘণ্টা)', rate: 92, target: 90 },
      { priority: 'Low', priorityBn: 'নিম্ন (২৪ ঘণ্টা)', rate: 88, target: 85 },
    ],
  },

  technicianLeaderboard: [
    { id: 'tech-1', rank: 1, name: 'Rahim Ahmed', nameBn: 'রহিম আহমেদ', role: 'Senior Specialist', jobs: 45, revenue: 135000, rating: 4.9, sla: 98, trend: 'up', trendValue: 3 },
    { id: 'tech-2', rank: 2, name: 'Tanvir Hossain', nameBn: 'তানভীর হোসেন', role: 'Field Tech Level 2', jobs: 42, revenue: 114000, rating: 4.8, sla: 96, trend: 'up', trendValue: 1 },
    { id: 'tech-3', rank: 3, name: 'Kamal Uddin', nameBn: 'কামাল উদ্দিন', role: 'Fiber & RF Specialist', jobs: 38, revenue: 96000, rating: 4.7, sla: 94, trend: 'down', trendValue: 2 },
    { id: 'tech-4', rank: 4, name: 'Jamal Mia', nameBn: 'জামাল মিয়া', role: 'HVAC Specialist', jobs: 35, revenue: 89000, rating: 4.6, sla: 93, trend: 'stable', trendValue: 0 },
    { id: 'tech-5', rank: 5, name: 'Rafiq Islam', nameBn: 'রফিক ইসলাম', role: 'Substation Technician', jobs: 33, revenue: 82000, rating: 4.5, sla: 91, trend: 'up', trendValue: 2 },
  ],

  recentActivity: [
    { id: 'act-1', type: 'job_completed', title: 'WO-9003 Completed', titleBn: 'WO-9003 কাজ সম্পন্ন', description: 'Transformer Overheating at Gulshan 2 signed by Fahim Rahman', descriptionBn: 'গুলশান ২ সাবস্টেশন কাজ রহিম আহমেদ সম্পন্ন করেছেন', timestamp: '10:45 AM', metadata: { workOrderId: 'WO-9003', technicianName: 'Rahim Ahmed' } },
    { id: 'act-2', type: 'payment_received', title: 'bKash Payment Received', titleBn: 'বিকাশ পেমেন্ট প্রাপ্তি', description: '৳14,500 received for WO-9003 (TRX: 8NX891298)', descriptionBn: 'WO-9003 এর জন্য ৳১৪,৫০০ বিকাশ পেমেন্ট সম্পন্ন হয়েছে', timestamp: '10:30 AM', metadata: { amount: 14500, workOrderId: 'WO-9003' } },
    { id: 'act-3', type: 'sla_warning', title: 'SLA Warning: WO-9007', titleBn: 'এসএলএ সতর্কতা: WO-9007', description: 'Banani Fiber Issue has 15 mins remaining before SLA breach', descriptionBn: 'বনানী ফাইবার কাজের এসএলএ আর ১৫ মিনিট বাকি', timestamp: '10:15 AM', metadata: { workOrderId: 'WO-9007' } },
    { id: 'act-4', type: 'tech_assigned', title: 'AI Auto-Dispatched', titleBn: 'AI স্বয়ংক্রিয় বরাদ্দ', description: 'Tanvir Hossain assigned to WO-9008 via proximity solver', descriptionBn: 'তানভীর হোসেনকে নিকটবর্তী কাজে AI দ্বারা বরাদ্দ করা হয়েছে', timestamp: '10:00 AM', metadata: { workOrderId: 'WO-9008', technicianName: 'Tanvir Hossain' } },
    { id: 'act-5', type: 'job_created', title: 'New Critical Order', titleBn: 'নতুন জরুরী ওয়ার্ক অর্ডার', description: 'Dhanmondi 27 Power Outage registered for DESCO', descriptionBn: 'ধানমন্ডি ২৭ এ বিদ্যুৎ বিভ্রাটের নতুন কাজ রেজিস্টার হয়েছে', timestamp: '09:45 AM', metadata: { workOrderId: 'WO-9009' } },
  ],

  divisionDistribution: [
    { division: 'Dhaka Division', divisionBn: 'ঢাকা বিভাগ', jobs: 106, percentage: 68, revenue: 320000, activeTechs: 14 },
    { division: 'Chittagong Division', divisionBn: 'চট্টগ্রাম বিভাগ', jobs: 34, percentage: 22, revenue: 98000, activeTechs: 6 },
    { division: 'Sylhet Division', divisionBn: 'সিলেট বিভাগ', jobs: 12, percentage: 8, revenue: 28000, activeTechs: 3 },
    { division: 'Rajshahi Division', divisionBn: 'রাজশাহী বিভাগ', jobs: 4, percentage: 2, revenue: 12000, activeTechs: 2 },
  ],
};
