import React, { useState } from 'react';
import { Feedback } from '../../types/feedback';
import { StarRating } from '../../components/feedback/StarRating';
import {
  ArrowLeft,
  Star,
  User,
  Clock,
  Flag,
  MessageSquare,
  Wrench,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface FeedbackDetailProps {
  feedback: Feedback;
  onBack: () => void;
  onFlag: (id: string, reason: string) => void;
}

export const FeedbackDetail: React.FC<FeedbackDetailProps> = ({
  feedback,
  onBack,
  onFlag,
}) => {
  const [flagReason, setFlagReason] = useState('');
  const [isFlagging, setIsFlagging] = useState(false);

  const handleConfirmFlag = () => {
    if (!flagReason.trim()) return;
    onFlag(feedback.id, flagReason);
    setIsFlagging(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-amber-500 font-extrabold text-xs uppercase tracking-wider font-mono">
                Feedback Record #{feedback.id}
              </span>
              <span className="text-xs font-mono text-slate-400">• WO: {feedback.workOrderId}</span>
            </div>
            <h1 className="text-xl font-extrabold text-white mt-1">
              Customer Survey Submission & CSAT Review
            </h1>
          </div>
        </div>

        <StarRating value={feedback.overallRating} readOnly size="md" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  {feedback.customerName}
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  Submitted via {feedback.channel.toUpperCase()} • {new Date(feedback.submittedAt).toLocaleString()}
                </p>
              </div>

              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 px-3 py-1 rounded-full">
                Recommend: {feedback.wouldRecommend.toUpperCase()}
              </span>
            </div>

            {/* Verbatim Comments */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
                Customer Verbatim Feedback
              </h3>
              {feedback.comment && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 italic font-sans leading-relaxed">
                  "{feedback.comment}"
                </div>
              )}
              {feedback.commentBangla && (
                <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 font-sans leading-relaxed">
                  <strong>বাংলা ভার্সন:</strong> "{feedback.commentBangla}"
                </div>
              )}
            </div>

            {/* Sub-Ratings Matrix */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
                Aspect Rating Breakdown
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
                  <span>Punctuality:</span>
                  <strong className="font-mono text-amber-600 dark:text-amber-400">{feedback.punctualityRating} / 5</strong>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
                  <span>Professionalism:</span>
                  <strong className="font-mono text-amber-600 dark:text-amber-400">{feedback.professionalismRating} / 5</strong>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
                  <span>Work Quality:</span>
                  <strong className="font-mono text-amber-600 dark:text-amber-400">{feedback.workQualityRating} / 5</strong>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
                  <span>Communication:</span>
                  <strong className="font-mono text-amber-600 dark:text-amber-400">{feedback.communicationRating} / 5</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info & Moderation */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-xs text-xs">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Assigned Field Lead
            </h3>

            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm">
                {feedback.technicianName[0]}
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">{feedback.technicianName}</div>
                <div className="text-[10px] text-slate-500 font-mono">{feedback.technicianRole || 'Field Lead'}</div>
              </div>
            </div>

            {!feedback.isFlagged ? (
              !isFlagging ? (
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setIsFlagging(true)}
                  className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <Flag className="w-4 h-4 mr-1.5" /> Flag for Manager Review
                </Button>
              ) : (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-300 rounded-2xl space-y-2">
                  <label className="font-bold text-red-900 dark:text-red-200">Flag Reason</label>
                  <textarea
                    rows={2}
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    placeholder="Enter reason for flagging..."
                    className="w-full bg-white dark:bg-slate-900 border border-red-300 rounded-xl p-2 text-slate-900 dark:text-slate-100"
                  />
                  <div className="flex gap-2">
                    <Button size="xs" variant="primary" onClick={handleConfirmFlag} className="bg-red-600 hover:bg-red-700 text-white">
                      Submit Flag
                    </Button>
                    <Button size="xs" variant="outline" onClick={() => setIsFlagging(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )
            ) : (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-300 rounded-2xl space-y-1">
                <span className="font-bold text-red-900 dark:text-red-200 block">Flagged Complaint</span>
                <p className="text-[11px] text-red-800 dark:text-red-300">{feedback.flagReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
