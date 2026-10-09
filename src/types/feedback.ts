/**
 * FieldOps Pro - Customer Feedback & Survey System Types
 * Bilingual (English + Bangla) context, post-job surveys, NPS tracking, and technician ratings
 */

export interface Feedback {
  id: string;
  workOrderId: string;
  customerId: string;
  customerName: string; // Masked for privacy option, e.g. "G*** Ltd."
  rawCustomerName?: string;
  technicianId: string;
  technicianName: string;
  technicianRole?: string;

  overallRating: number; // 1-5
  punctualityRating: number;
  professionalismRating: number;
  workQualityRating: number;
  communicationRating: number;

  comment?: string;
  commentBangla?: string;

  wouldRecommend: 'yes' | 'no' | 'maybe';
  npsScore?: number; // 0-10

  language: 'en' | 'bn';
  channel: 'sms_link' | 'email_link' | 'app' | 'manual';

  isFlagged: boolean;
  flagReason?: string;
  managerNotes?: string;

  submittedAt: string; // ISO String
  workOrderDate: string; // ISO String
}

export interface FeedbackStats {
  avgRating: number;
  totalResponses: number;
  responseRatePercent: number;
  npsScore: number;
  thisMonthCount: number;
  ratingDistribution: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
  ratingPercentages: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
}

export interface NPSTrend {
  month: string; // "Jan 2025"
  promoters: number;
  passives: number;
  detractors: number;
  npsScore: number;
  totalResponses: number;
}

export interface TechnicianFeedbackRating {
  technicianId: string;
  technicianName: string;
  technicianAvatar?: string;
  avgRating: number;
  totalFeedbackCount: number;
  punctualityAvg: number;
  workQualityAvg: number;
  npsScore: number;
  badges: string[]; // e.g. "Top Rated 5-Star", "Punctuality Champion"
  latestComment?: string;
}

export interface SurveyQuestion {
  id: string;
  type: 'rating' | 'nps' | 'text' | 'mcq';
  questionEn: string;
  questionBn: string;
  options?: { labelEn: string; labelBn: string; value: string }[];
  required: boolean;
}

export interface CustomSurvey {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  surveyType: 'post_job' | 'nps_monthly' | 'annual' | 'custom';
  questions: SurveyQuestion[];
  targetAudience: 'all' | 'enterprise_only' | 'retail_only';
  status: 'active' | 'draft' | 'archived';
  scheduledAt?: string;
  createdDate: string;
  responseCount: number;
}
