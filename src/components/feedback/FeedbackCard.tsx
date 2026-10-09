import React, { useState } from 'react';
import { Feedback } from '../../types/feedback';
import { StarRating } from './StarRating';
import { User, Clock, Flag, ThumbsUp, Wrench, Globe, Lock, ShieldAlert } from 'lucide-react';

interface FeedbackCardProps {
  feedback: Feedback;
  onClick?: () => void;
  maskCustomerName?: boolean;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  onClick,
  maskCustomerName = false,
}) => {
  const displayName = maskCustomerName
    ? feedback.customerName
    : feedback.rawCustomerName || feedback.customerName;

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-3xl border transition cursor-pointer space-y-3.5 shadow-xs hover:shadow-md ${
        feedback.isFlagged
          ? 'bg-red-50/40 dark:bg-red-950/20 border-red-300 dark:border-red-800'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">
            {displayName[0]}
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              {displayName}
              {maskCustomerName && <Lock className="w-3 h-3 text-slate-400" title="Privacy Masked" />}
            </h4>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2">
              <span>WO: {feedback.workOrderId}</span>
              <span>•</span>
              <span>Tech: {feedback.technicianName}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <StarRating value={feedback.overallRating} readOnly size="sm" />
          <span className="text-[10px] text-slate-400 font-mono block mt-1">
            {new Date(feedback.submittedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Customer Comments */}
      {feedback.comment && (
        <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 italic">
          "{feedback.comment}"
        </p>
      )}

      {feedback.commentBangla && feedback.commentBangla !== feedback.comment && (
        <p className="text-xs text-amber-900 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/30 p-2.5 rounded-2xl border border-amber-200/60 dark:border-amber-800/60 font-sans">
          বাংলা: "{feedback.commentBangla}"
        </p>
      )}

      {/* Sub-ratings breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2.5">
        <div>Punctuality: <strong className="text-slate-800 dark:text-slate-200">{feedback.punctualityRating}/5</strong></div>
        <div>Work Quality: <strong className="text-slate-800 dark:text-slate-200">{feedback.workQualityRating}/5</strong></div>
        <div>Pro: <strong className="text-slate-800 dark:text-slate-200">{feedback.professionalismRating}/5</strong></div>
        <div>NPS: <strong className="text-amber-600 dark:text-amber-400">{feedback.npsScore || 10}/10</strong></div>
      </div>

      {feedback.isFlagged && (
        <div className="text-[10px] text-red-700 dark:text-red-300 font-bold bg-red-100 dark:bg-red-950/60 p-2 rounded-xl border border-red-300 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span>Flagged: {feedback.flagReason}</span>
        </div>
      )}
    </div>
  );
};
