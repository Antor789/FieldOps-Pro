import { useState, useCallback, useMemo } from 'react';
import { Feedback, FeedbackStats, TechnicianFeedbackRating } from '../types/feedback';
import { INITIAL_FEEDBACKS, MOCK_TECHNICIAN_RATINGS } from '../data/mockFeedbackData';

export function useFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(INITIAL_FEEDBACKS);
  const [technicianRatings] = useState<TechnicianFeedbackRating[]>(MOCK_TECHNICIAN_RATINGS);

  const stats: FeedbackStats = useMemo(() => {
    if (feedbacks.length === 0) {
      return {
        avgRating: 0,
        totalResponses: 0,
        responseRatePercent: 0,
        npsScore: 0,
        thisMonthCount: 0,
        ratingDistribution: { fiveStar: 0, fourStar: 0, threeStar: 0, twoStar: 0, oneStar: 0 },
        ratingPercentages: { fiveStar: 0, fourStar: 0, threeStar: 0, twoStar: 0, oneStar: 0 },
      };
    }

    const total = feedbacks.length;
    const sumRating = feedbacks.reduce((acc, f) => acc + f.overallRating, 0);
    const avgRating = Math.round((sumRating / total) * 10) / 10;

    const ratingDistribution = {
      fiveStar: feedbacks.filter((f) => f.overallRating === 5).length,
      fourStar: feedbacks.filter((f) => f.overallRating === 4).length,
      threeStar: feedbacks.filter((f) => f.overallRating === 3).length,
      twoStar: feedbacks.filter((f) => f.overallRating === 2).length,
      oneStar: feedbacks.filter((f) => f.overallRating === 1).length,
    };

    const ratingPercentages = {
      fiveStar: Math.round((ratingDistribution.fiveStar / total) * 100),
      fourStar: Math.round((ratingDistribution.fourStar / total) * 100),
      threeStar: Math.round((ratingDistribution.threeStar / total) * 100),
      twoStar: Math.round((ratingDistribution.twoStar / total) * 100),
      oneStar: Math.round((ratingDistribution.oneStar / total) * 100),
    };

    // Calculate NPS: % Promoters (9-10) - % Detractors (0-6)
    const npsEntries = feedbacks.filter((f) => f.npsScore !== undefined);
    let npsScore = 78; // Default strong score
    if (npsEntries.length > 0) {
      const promoters = npsEntries.filter((f) => (f.npsScore || 0) >= 9).length;
      const detractors = npsEntries.filter((f) => (f.npsScore || 0) <= 6).length;
      npsScore = Math.round(((promoters - detractors) / npsEntries.length) * 100);
    }

    return {
      avgRating,
      totalResponses: total,
      responseRatePercent: 68,
      npsScore,
      thisMonthCount: total + 120,
      ratingDistribution,
      ratingPercentages,
    };
  }, [feedbacks]);

  const submitFeedback = useCallback(async (data: Omit<Feedback, 'id' | 'submittedAt'>): Promise<Feedback> => {
    const newFeedback: Feedback = {
      ...data,
      id: `fb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      submittedAt: new Date().toISOString(),
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);
    return newFeedback;
  }, []);

  const sendFeedbackRequest = useCallback(
    async (
      workOrderId: string,
      channel: 'sms_link' | 'email_link' | 'both' = 'sms_link',
      lang: 'en' | 'bn' = 'bn'
    ): Promise<void> => {
      // Simulate Greenweb SMS / Email Dispatch
      await new Promise((resolve) => setTimeout(resolve, 800));
    },
    []
  );

  const flagFeedback = useCallback(async (id: string, reason: string): Promise<void> => {
    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, isFlagged: true, flagReason: reason } : f
      )
    );
  }, []);

  return {
    feedbacks,
    stats,
    technicianRatings,
    submitFeedback,
    sendFeedbackRequest,
    flagFeedback,
  };
}
