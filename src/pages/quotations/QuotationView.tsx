import React, { useState } from 'react';
import { Quotation, QuotationComment } from '../../types/quotations';
import { QuotationStatusBadge } from '../../components/quotations/QuotationStatusBadge';
import { QuotationPDF } from './QuotationPDF';
import { ConvertToJobModal } from '../../components/quotations/ConvertToJobModal';
import { formatBDT } from '../../data/mockQuotationData';
import {
  ArrowLeft,
  Printer,
  Mail,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ArrowRightCircle,
  Building2,
  Calendar,
  Clock,
  Send,
  User,
  ShieldCheck,
  Edit,
  Copy,
  Receipt,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

interface QuotationViewProps {
  quotation: Quotation;
  onBack: () => void;
  onEdit: (quotation: Quotation) => void;
  onDuplicate: (quotation: Quotation) => void;
  onSendEmail: (quotation: Quotation) => void;
  onSendSms: (quotation: Quotation) => void;
  onMarkApproved: (quotation: Quotation) => void;
  onMarkRejected: (quotation: Quotation, reason: string) => void;
  onConvertToWorkOrder: (
    quotation: Quotation,
    options: {
      scheduledDate: string;
      technicianId: string;
      priority: 'EMERGENCY' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
      notes?: string;
    }
  ) => void;
  onAddComment?: (quotationId: string, comment: QuotationComment) => void;
}

export const QuotationView: React.FC<QuotationViewProps> = ({
  quotation,
  onBack,
  onEdit,
  onDuplicate,
  onSendEmail,
  onSendSms,
  onMarkApproved,
  onMarkRejected,
  onConvertToWorkOrder,
  onAddComment,
}) => {
  const { addToast } = useToast();
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('Pricing exceeds annual maintenance budget.');

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<QuotationComment[]>(quotation.comments || []);

  const isApproved = quotation.status === 'approved';
  const isConverted = quotation.status === 'converted';

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: QuotationComment = {
      id: `comm-${Date.now()}`,
      author: 'Operations Manager',
      role: 'Staff',
      message: commentText.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...comments, newComment];
    setComments(updated);
    setCommentText('');
    onAddComment?.(quotation.id, newComment);

    addToast({
      title: 'Comment Added',
      description: 'Your note has been posted to the quotation discussion history.',
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                {quotation.quotationNumber}
              </span>
              <QuotationStatusBadge status={quotation.status} />
              {quotation.convertedToWorkOrderId && (
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                  Linked WO: {quotation.convertedToWorkOrderId}
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
              {quotation.customerName}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPdfOpen(true)}
            className="text-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-blue-500" />
            Official PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSendEmail(quotation)}
            className="text-xs flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
            Send Email
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSendSms(quotation)}
            className="text-xs flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
            Send SMS
          </Button>

          {quotation.status !== 'converted' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(quotation)}
              className="text-xs flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </Button>
          )}

          {!isApproved && !isConverted && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onMarkApproved(quotation)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve Quote
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRejectModal(true)}
                className="text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <XCircle className="w-3.5 h-3.5 mr-1" />
                Reject
              </Button>
            </>
          )}

          {isApproved && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsConvertModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs flex items-center gap-1.5 shadow-sm"
            >
              <ArrowRightCircle className="w-3.5 h-3.5" />
              Convert to Work Order
            </Button>
          )}
        </div>
      </div>

      {/* 2. Quotation Lifecycle Timeline Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Lifecycle & Customer Engagement Timeline
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block font-semibold">1. Created</span>
            <strong className="text-slate-900 dark:text-white block">
              {new Date(quotation.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </strong>
            <span className="text-[10px] text-slate-500">{quotation.createdBy}</span>
          </div>

          <div
            className={`p-2.5 rounded-lg border ${
              quotation.sentAt
                ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200'
                : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            <span className="text-[10px] block font-semibold">2. Dispatched</span>
            <strong>
              {quotation.sentAt
                ? new Date(quotation.sentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                : 'Not sent yet'}
            </strong>
            <span className="text-[10px] block">Via Email/SMS</span>
          </div>

          <div
            className={`p-2.5 rounded-lg border ${
              quotation.viewedAt
                ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            <span className="text-[10px] block font-semibold">3. Viewed by Client</span>
            <strong>
              {quotation.viewedAt
                ? new Date(quotation.viewedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                : 'Pending view'}
            </strong>
            <span className="text-[10px] block">Portal link clicked</span>
          </div>

          <div
            className={`p-2.5 rounded-lg border ${
              isApproved || isConverted
                ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
                : quotation.status === 'rejected'
                ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            <span className="text-[10px] block font-semibold">4. Customer Decision</span>
            <strong>
              {quotation.approvedAt
                ? 'Approved'
                : quotation.rejectedAt
                ? 'Rejected'
                : 'Awaiting Decision'}
            </strong>
            <span className="text-[10px] block">
              {quotation.approvedAt
                ? new Date(quotation.approvedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                : quotation.validUntil
                ? `Valid to ${new Date(quotation.validUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                : '—'}
            </span>
          </div>

          <div
            className={`p-2.5 rounded-lg border ${
              isConverted
                ? 'bg-purple-50/50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900 text-purple-900 dark:text-purple-200'
                : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            <span className="text-[10px] block font-semibold">5. Work Order Executed</span>
            <strong>{quotation.convertedToWorkOrderId || 'Pending conversion'}</strong>
            <span className="text-[10px] block">Field Dispatch Ready</span>
          </div>
        </div>
      </div>

      {/* 3. Main Quotation Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scope & Line Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Quote Particulars Box */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] block">Client / Enterprise</span>
              <strong className="text-sm text-slate-900 dark:text-white block mt-0.5">
                {quotation.customerName}
              </strong>
              {quotation.customerNameBn && (
                <span className="text-slate-500 block">{quotation.customerNameBn}</span>
              )}
              <span className="text-slate-600 dark:text-slate-400 mt-1 block">
                {quotation.customerAddress || 'Dhaka, Bangladesh'}
              </span>
              {quotation.customerBin && (
                <span className="font-mono text-slate-500 text-[11px] block mt-0.5">
                  NBR BIN: {quotation.customerBin}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Contact Details</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{quotation.customerPhone}</span>
                <span className="text-slate-500 block">{quotation.customerEmail}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Validity Date</span>
                <span className="text-amber-600 font-bold">
                  Valid until {new Date(quotation.validUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Section Items */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Bill of Quantities & Scope Breakdown</span>
              <span className="text-xs text-slate-500">
                {quotation.sections.reduce((sum, s) => sum + s.items.length, 0)} Items
              </span>
            </h3>

            {quotation.sections.map((section, idx) => (
              <div key={section.id} className="space-y-2">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 flex justify-between">
                  <span>Section {idx + 1}: {section.title}</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {formatBDT(section.items.reduce((s, i) => s + (i.total || 0), 0))}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="py-2 px-2 w-8">#</th>
                        <th className="py-2 px-2">Description</th>
                        <th className="py-2 px-2 text-center">Qty</th>
                        <th className="py-2 px-2">Unit</th>
                        <th className="py-2 px-2 text-right">Unit Price</th>
                        <th className="py-2 px-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {section.items.map((item, i) => (
                        <tr key={item.id}>
                          <td className="py-2.5 px-2 text-slate-400 font-mono">{i + 1}</td>
                          <td className="py-2.5 px-2">
                            <strong className="text-slate-900 dark:text-white block">{item.description}</strong>
                            {item.descriptionBn && (
                              <span className="text-[11px] text-slate-400">{item.descriptionBn}</span>
                            )}
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold text-slate-800 dark:text-slate-200">
                            {item.quantity}
                          </td>
                          <td className="py-2.5 px-2 text-slate-500">{item.unit}</td>
                          <td className="py-2.5 px-2 text-right font-medium text-slate-700 dark:text-slate-300">
                            {formatBDT(item.unitPrice)}
                          </td>
                          <td className="py-2.5 px-2 text-right font-bold text-slate-900 dark:text-white">
                            {formatBDT(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Notes & Terms Box */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Terms & Conditions
            </h4>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed font-mono text-[11px]">
              {quotation.terms || 'Standard 15% NBR VAT Mushak-6.3 applicable. 60-day workmanship warranty.'}
            </div>
            {quotation.rejectionReason && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-900 dark:text-rose-200">
                <strong>Rejection Reason: </strong>
                {quotation.rejectionReason}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Financial Breakdown & Discussion */}
        <div className="space-y-6">
          {/* Financial Breakdown Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm pb-2 border-b border-slate-100 dark:border-slate-800">
              Quotation Consideration
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal (আইটেম মূল্য):</span>
                <strong className="text-slate-900 dark:text-white">{formatBDT(quotation.subtotal)}</strong>
              </div>

              {quotation.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount ({quotation.discountType === 'percentage' ? `${quotation.discountValue}%` : 'Fixed'}):</span>
                  <strong>-{formatBDT(quotation.discountAmount)}</strong>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>NBR VAT (15% Mushak-6.3):</span>
                <strong className="text-slate-900 dark:text-white">
                  {quotation.includeVat ? `+${formatBDT(quotation.vatAmount)}` : 'Exempt'}
                </strong>
              </div>

              <div className="pt-3 border-t-2 border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                <div>
                  <span className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider block">
                    Total (সর্বমোট)
                  </span>
                  <span className="text-[10px] text-slate-400">BDT</span>
                </div>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                  {formatBDT(quotation.total)}
                </span>
              </div>
            </div>

            {/* Quick conversion CTA if approved */}
            {isApproved && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setIsConvertModalOpen(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ArrowRightCircle className="w-4 h-4" />
                  Convert to Work Order Now
                </Button>
              </div>
            )}
          </div>

          {/* Discussion & Comments Thread */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              Quotation Discussion ({comments.length})
            </h4>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No comments posted yet.</p>
              ) : (
                comments.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {comm.author}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-xs">
                      {comm.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handlePostComment} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a message or internal note..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Button type="submit" variant="primary" size="sm" className="h-8 px-3">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* PDF Modal Preview */}
      <QuotationPDF
        quotation={quotation}
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        onAccept={() => onMarkApproved(quotation)}
        isPublicView={false}
      />

      {/* Convert to Job Modal */}
      <ConvertToJobModal
        quotation={quotation}
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        onConfirmConvert={(opts) => {
          onConvertToWorkOrder(quotation, opts);
          setIsConvertModalOpen(false);
        }}
      />

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Mark Quotation as Rejected?
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Please enter the customer&apos;s feedback or reason for rejecting this quotation:
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onMarkRejected(quotation, rejectReason);
                  setShowRejectModal(false);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
