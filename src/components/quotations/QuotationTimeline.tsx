import React from 'react';
import { Quotation, QuotationStatus } from '../../types/quotations';
import {
  FileEdit,
  Send,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Wrench,
  UserCheck,
  MessageSquare,
} from 'lucide-react';
import { formatBDT } from '../../data/mockQuotationData';

interface QuotationTimelineProps {
  quotation: Quotation;
}

export const QuotationTimeline: React.FC<QuotationTimelineProps> = ({ quotation }) => {
  const steps: {
    key: QuotationStatus | 'created';
    title: string;
    titleBn: string;
    date?: string | Date;
    description: string;
    icon: React.ReactNode;
    isPassed: boolean;
    isCurrent: boolean;
    isFailed?: boolean;
  }[] = [
    {
      key: 'created',
      title: 'Quotation Drafted',
      titleBn: 'কোটেশন খসড়া তৈরি',
      date: quotation.createdAt,
      description: `Created by ${quotation.createdBy || 'FieldOps Admin'}`,
      icon: <FileEdit className="w-4 h-4" />,
      isPassed: true,
      isCurrent: quotation.status === 'draft',
    },
    {
      key: 'sent',
      title: 'Sent to Customer',
      titleBn: 'গ্রাহককে পাঠানো হয়েছে',
      date: quotation.sentAt,
      description: quotation.sentAt
        ? `Delivered via Email & SMS to ${quotation.customerEmail}`
        : 'Awaiting dispatch',
      icon: <Send className="w-4 h-4" />,
      isPassed: !!quotation.sentAt || ['viewed', 'approved', 'rejected', 'converted'].includes(quotation.status),
      isCurrent: quotation.status === 'sent',
    },
    {
      key: 'viewed',
      title: 'Viewed by Customer',
      titleBn: 'গ্রাহক দ্বারা দেখা হয়েছে',
      date: quotation.viewedAt,
      description: quotation.viewedAt
        ? `Opened on Customer Portal`
        : 'Not viewed yet',
      icon: <Eye className="w-4 h-4" />,
      isPassed: !!quotation.viewedAt || ['approved', 'converted'].includes(quotation.status),
      isCurrent: quotation.status === 'viewed',
    },
    {
      key: 'approved',
      title: quotation.status === 'rejected' ? 'Customer Rejected' : 'Customer Approved',
      titleBn: quotation.status === 'rejected' ? 'গ্রাহক প্রত্যাখ্যান করেছেন' : 'গ্রাহক অনুমোদন করেছেন',
      date: quotation.status === 'rejected' ? quotation.rejectedAt : quotation.approvedAt,
      description: quotation.status === 'rejected'
        ? quotation.rejectionReason || 'Price revised request'
        : quotation.approvedAt
        ? 'Digital Signature & PO Accepted'
        : 'Pending customer decision',
      icon: quotation.status === 'rejected' ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4" />,
      isPassed: ['approved', 'converted'].includes(quotation.status) || quotation.status === 'rejected',
      isCurrent: quotation.status === 'approved' || quotation.status === 'rejected',
      isFailed: quotation.status === 'rejected',
    },
    {
      key: 'converted',
      title: 'Converted to Work Order',
      titleBn: 'ওয়ার্ক অর্ডারে রূপান্তরিত',
      date: quotation.convertedAt,
      description: quotation.convertedToWorkOrderId
        ? `Work Order #${quotation.convertedToWorkOrderId} spawned`
        : 'Ready for conversion',
      icon: <Wrench className="w-4 h-4" />,
      isPassed: quotation.status === 'converted' || !!quotation.convertedToWorkOrderId,
      isCurrent: quotation.status === 'converted',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            Quotation Lifecycle & Timeline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time delivery, viewing, and approval audit trail for #{quotation.quotationNumber}
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300">
          Valued at {formatBDT(quotation.total)}
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {steps.map((step, idx) => {
          let nodeBg = 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700';
          if (step.isFailed) {
            nodeBg = 'bg-red-500 text-white border-red-600 ring-4 ring-red-100 dark:ring-red-950/50';
          } else if (step.isCurrent) {
            nodeBg = 'bg-amber-500 text-white border-amber-600 ring-4 ring-amber-100 dark:ring-amber-950/50';
          } else if (step.isPassed) {
            nodeBg = 'bg-emerald-500 text-white border-emerald-600';
          }

          return (
            <div key={idx} className="relative flex items-start space-x-4">
              <div
                className={`absolute -left-6 top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${nodeBg}`}
              >
                {step.icon}
              </div>

              <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {step.title}
                    <span className="text-[10px] text-slate-400 font-normal">({step.titleBn})</span>
                  </h4>
                  {step.date && (
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {new Date(step.date).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Discussion / Comments Section */}
      {quotation.comments && quotation.comments.length > 0 && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
            Client Communication History
          </h4>
          <div className="space-y-2">
            {quotation.comments.map((comment) => (
              <div
                key={comment.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {comment.author} <span className="text-[10px] text-slate-400 font-normal">({comment.role})</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{comment.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
