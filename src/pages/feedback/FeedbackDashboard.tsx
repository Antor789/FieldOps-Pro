import React, { useState, useMemo } from 'react';
import { useFeedback } from '../../hooks/useFeedback';
import { NPSGauge } from '../../components/feedback/NPSGauge';
import { RatingBreakdown } from '../../components/feedback/RatingBreakdown';
import { FeedbackCard } from '../../components/feedback/FeedbackCard';
import { FeedbackFilters } from '../../components/feedback/FeedbackFilters';
import { TechnicianFeedbackSummary } from '../../components/feedback/TechnicianFeedbackSummary';
import { FeedbackRequestModal } from '../../components/feedback/FeedbackRequestModal';
import { Feedback } from '../../types/feedback';
import {
  Star,
  Award,
  MessageSquare,
  Send,
  Lock,
  Eye,
  CheckCircle2,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const FeedbackDashboard: React.FC = () => {
  const { feedbacks, stats, technicianRatings, sendFeedbackRequest } = useFeedback();

  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [selectedTechId, setSelectedTechId] = useState('all');
  const [onlyFlagged, setOnlyFlagged] = useState(false);
  const [maskPrivacy, setMaskPrivacy] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((f) => {
      const matchesSearch =
        f.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.technicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.workOrderId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRating = minRating === 0 || f.overallRating >= minRating;
      const matchesTech = selectedTechId === 'all' || f.technicianId === selectedTechId;
      const matchesFlagged = !onlyFlagged || f.isFlagged;

      return matchesSearch && matchesRating && matchesTech && matchesFlagged;
    });
  }, [feedbacks, searchQuery, minRating, selectedTechId, onlyFlagged]);

  const techniciansList = useMemo(() => {
    return Array.from(new Set(feedbacks.map((f) => f.technicianId))).map((id) => {
      const f = feedbacks.find((item) => item.technicianId === id);
      return { id, name: f?.technicianName || id };
    });
  }, [feedbacks]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⭐</span>
            <h1 className="text-xl font-extrabold text-white">Customer Feedback & CSAT Intelligence</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Bilingual post-job surveys, Net Promoter Score (NPS), and technician rating analytics
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setMaskPrivacy(!maskPrivacy)}
            className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 font-bold"
          >
            <Lock className="w-4 h-4 mr-1.5" />
            {maskPrivacy ? 'Show Names' : 'Mask Privacy'}
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsRequestModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
          >
            <Send className="w-4 h-4 mr-1.5" /> Dispatch Survey
          </Button>
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-500 font-extrabold flex items-center justify-center text-xl border border-amber-200 dark:border-amber-800">
            ⭐
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Rating</div>
            <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
              {stats.avgRating} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center text-xl border border-emerald-200 dark:border-emerald-800">
            📈
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Response Rate</div>
            <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {stats.responseRatePercent}%
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center justify-center text-xl border border-indigo-200 dark:border-indigo-800">
            🏆
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">NPS Index</div>
            <div className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
              +{stats.npsScore}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-extrabold flex items-center justify-center text-xl border border-blue-200 dark:border-blue-800">
            💬
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Surveys Submitted</div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
              {stats.thisMonthCount}
            </div>
          </div>
        </div>
      </div>

      {/* NPS Gauge & Rating Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NPSGauge
          score={stats.npsScore}
          promotersPercent={82}
          passivesPercent={14}
          detractorsPercent={4}
          totalResponses={stats.totalResponses}
        />

        <RatingBreakdown
          distribution={stats.ratingDistribution}
          percentages={stats.ratingPercentages}
          totalCount={stats.totalResponses}
          avgScore={stats.avgRating}
        />
      </div>

      {/* Technician CSAT Summary */}
      <TechnicianFeedbackSummary ratings={technicianRatings} />

      {/* Filterable Feedbacks List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Customer Submissions ({filteredFeedbacks.length})
          </h3>
        </div>

        <FeedbackFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          minRating={minRating}
          onMinRatingChange={setMinRating}
          selectedTechId={selectedTechId}
          onTechChange={setSelectedTechId}
          onlyFlagged={onlyFlagged}
          onFlaggedToggle={setOnlyFlagged}
          technicians={techniciansList}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFeedbacks.map((fb) => (
            <FeedbackCard
              key={fb.id}
              feedback={fb}
              maskCustomerName={maskPrivacy}
              onClick={() => setSelectedFeedback(fb)}
            />
          ))}
        </div>
      </div>

      {/* Manual Request Modal */}
      <FeedbackRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSend={(woId, ch, l) => {
          sendFeedbackRequest(woId, ch, l);
          alert(`Feedback survey dispatched to client for ${woId}!`);
        }}
      />
    </div>
  );
};
