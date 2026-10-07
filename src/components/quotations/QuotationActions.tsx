import React, { useState } from 'react';
import { Quotation } from '../../types/quotations';
import {
  Send,
  Mail,
  MessageSquare,
  Download,
  Copy,
  CheckCircle2,
  XCircle,
  ArrowRightCircle,
  MoreVertical,
  Printer,
  Share2,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface QuotationActionsProps {
  quotation: Quotation;
  onSendEmail: (quotation: Quotation) => void;
  onSendSms: (quotation: Quotation) => void;
  onDownloadPdf: (quotation: Quotation) => void;
  onDuplicate: (quotation: Quotation) => void;
  onMarkApproved: (quotation: Quotation) => void;
  onMarkRejected: (quotation: Quotation) => void;
  onConvertToWorkOrder?: (quotation: Quotation) => void;
  className?: string;
  variant?: 'toolbar' | 'dropdown' | 'buttons';
}

export const QuotationActions: React.FC<QuotationActionsProps> = ({
  quotation,
  onSendEmail,
  onSendSms,
  onDownloadPdf,
  onDuplicate,
  onMarkApproved,
  onMarkRejected,
  onConvertToWorkOrder,
  className = '',
  variant = 'buttons',
}) => {
  const isApproved = quotation.status === 'approved';
  const isConverted = quotation.status === 'converted';

  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
      {/* 1. PDF / Print */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onDownloadPdf(quotation)}
        className="h-8 text-xs px-2.5 flex items-center gap-1.5"
        title="View Official Quotation PDF"
      >
        <Printer className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden sm:inline">PDF</span>
      </Button>

      {/* 2. Send via Email */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onSendEmail(quotation)}
        className="h-8 text-xs px-2.5 flex items-center gap-1.5"
        title="Email to Customer"
      >
        <Mail className="w-3.5 h-3.5 text-indigo-600" />
        <span className="hidden md:inline">Email</span>
      </Button>

      {/* 3. Send SMS Link */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onSendSms(quotation)}
        className="h-8 text-xs px-2.5 flex items-center gap-1.5"
        title="Send SMS approval link via Greenweb SMS"
      >
        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden md:inline">SMS</span>
      </Button>

      {/* 4. Duplicate */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onDuplicate(quotation)}
        className="h-8 text-xs px-2 text-slate-500 hover:text-slate-700"
        title="Clone / Duplicate Quote"
      >
        <Copy className="w-3.5 h-3.5" />
      </Button>

      {/* 5. Approve / Reject (if pending) */}
      {!isApproved && !isConverted && (
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onMarkApproved(quotation)}
            className="h-8 text-xs px-2.5 text-emerald-700 hover:bg-emerald-50 border-emerald-300 dark:border-emerald-800 dark:text-emerald-300 flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approve
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onMarkRejected(quotation)}
            className="h-8 text-xs px-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            title="Mark Rejected"
          >
            <XCircle className="w-3.5 h-3.5" />
          </Button>
        </>
      )}

      {/* 6. Convert to Work Order (if approved) */}
      {isApproved && onConvertToWorkOrder && (
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => onConvertToWorkOrder(quotation)}
          className="h-8 text-xs px-3 bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 shadow-xs"
        >
          <ArrowRightCircle className="w-3.5 h-3.5" />
          Convert to WO
        </Button>
      )}
    </div>
  );
};
