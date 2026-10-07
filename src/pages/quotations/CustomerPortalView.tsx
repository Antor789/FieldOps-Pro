import React, { useState } from 'react';
import { Quotation } from '../../types/quotations';
import {
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Download,
  MessageSquare,
  Send,
  ShieldCheck,
  ArrowLeft,
  Clock,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { formatBDT } from '../../data/mockQuotationData';
import { QuotationApprovalModal } from '../../components/quotations/QuotationApprovalModal';
import { QuotationPDFModal } from '../../components/quotations/QuotationPDFModal';

interface CustomerPortalViewProps {
  quotation: Quotation;
  onApprove: (poNumber: string, signature: string, signerName: string) => void;
  onReject: (reason: string) => void;
  onSendComment: (commentText: string) => void;
  onBack?: () => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  quotation,
  onApprove,
  onReject,
  onSendComment,
  onBack,
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onSendComment(commentInput);
    setCommentInput('');
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) return;
    onReject(rejectReason);
    setIsRejecting(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                FieldOps Pro Portal
              </span>
              <span className="text-xs font-mono text-slate-400">#{quotation.quotationNumber}</span>
            </div>
            <h1 className="text-xl font-extrabold text-white mt-1">
              Commercial Quotation Review & Authorization
            </h1>
            <p className="text-xs text-slate-400">
              Client Portal view for <strong>{quotation.customerName}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPdfModalOpen(true)}
            className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
          >
            <Printer className="w-4 h-4 mr-1.5" /> PDF View
          </Button>

          {quotation.status !== 'approved' && quotation.status !== 'converted' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsApprovalModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve & Sign Quote
            </Button>
          )}
        </div>
      </div>

      {/* Main Quotation Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  {quotation.customerName}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {quotation.customerEmail} • {quotation.customerPhone}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-mono block">Grand Total</span>
                <span className="text-xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                  {formatBDT(quotation.total)}
                </span>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Itemized Estimate Breakdown
              </h3>

              {quotation.sections.map((sec, sIdx) => (
                <div key={sec.id || sIdx} className="space-y-2">
                  <div className="font-bold text-xs bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl text-slate-800 dark:text-slate-200 border-l-4 border-amber-500">
                    {sec.title}
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sec.items.map((item, iIdx) => (
                      <div key={item.id || iIdx} className="py-2.5 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{item.description}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {item.quantity} {item.unit} × {formatBDT(item.unitPrice)}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                          {formatBDT(item.total)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Terms */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">Terms & Conditions</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                {quotation.terms || 'Standard FieldOps Pro service terms apply. 15% NBR VAT included.'}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Summary & Chat */}
        <div className="space-y-6">
          {/* Action Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Quotation Actions
            </h3>

            {quotation.status === 'approved' || quotation.status === 'converted' ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  Quotation Approved
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  This quotation was accepted on {new Date(quotation.approvedAt || Date.now()).toLocaleDateString()}. Work order processing underway.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setIsApprovalModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5"
                >
                  <ShieldCheck className="w-4 h-4 mr-1.5" /> Approve & Sign Quotation
                </Button>

                {!isRejecting ? (
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setIsRejecting(true)}
                    className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <XCircle className="w-4 h-4 mr-1.5" /> Reject / Request Revision
                  </Button>
                ) : (
                  <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl space-y-2 text-xs">
                    <label className="font-bold text-red-800 dark:text-red-300">
                      Reason for Revision Request
                    </label>
                    <textarea
                      rows={2}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Specify price adjustment or missing items..."
                      className="w-full bg-white dark:bg-slate-900 border border-red-300 dark:border-red-700 rounded-xl p-2 text-slate-900 dark:text-slate-100"
                    />
                    <div className="flex gap-2">
                      <Button size="xs" variant="primary" onClick={handleRejectConfirm} className="bg-red-600 hover:bg-red-700 text-white">
                        Submit
                      </Button>
                      <Button size="xs" variant="outline" onClick={() => setIsRejecting(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Discussion Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              Portal Communications
            </h3>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {quotation.comments && quotation.comments.length > 0 ? (
                quotation.comments.map((c) => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{c.author}</div>
                    <div className="text-slate-600 dark:text-slate-300 mt-0.5">{c.message}</div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No comments yet.</p>
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex gap-1.5">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Ask a question or request revision..."
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Button type="submit" size="xs" variant="primary" className="bg-amber-500 hover:bg-amber-600 text-slate-950">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuotationApprovalModal
        quotation={quotation}
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onApprove={onApprove}
      />

      <QuotationPDFModal
        quotation={quotation}
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />
    </div>
  );
};
