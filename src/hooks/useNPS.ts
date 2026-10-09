import { useState, useMemo } from 'react';
import { NPSTrend } from '../types/feedback';
import { MOCK_NPS_TRENDS } from '../data/mockFeedbackData';

export function useNPS() {
  const [trend] = useState<NPSTrend[]>(MOCK_NPS_TRENDS);

  const currentTrend = useMemo(() => trend[trend.length - 1], [trend]);

  return {
    npsScore: currentTrend.npsScore,
    promotersPercent: currentTrend.promoters,
    passivesPercent: currentTrend.passives,
    detractorsPercent: currentTrend.detractors,
    totalResponses: currentTrend.totalResponses,
    trend,
  };
}
