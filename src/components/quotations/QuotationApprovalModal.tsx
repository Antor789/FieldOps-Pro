import React, { useState, useRef } from 'react';
import { Quotation } from '../../types/quotations';
import { X, CheckCircle2, ShieldCheck, FileText, Pen, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatBDT } from '../../data/mockQuotationData';

interface QuotationApprovalModalProps {
  quotation: Quotation;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (poNumber: string, signatureDataUrl: string, signerName: string) => void;
}

export const QuotationApprovalModal: React.FC<QuotationApprovalModalProps> = ({
  quotation,
  isOpen,
  onClose,
  onApprove,
}) => {
  const [signerName, setSignerName] = useState(quotation.customerName || '');
  const [poNumber, setPoNumber] = useState(`PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasSigned(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleConfirm = () => {
    if (!signerName.trim() || !agreedToTerms) return;
    const canvas = canvasRef.current;
    const sigData = canvas ? canvas.toDataURL('image/png') : '';
    onApprove(poNumber, sigData, signerName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Approve Quotation #{quotation.quotationNumber}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Formal approval and authorization for FieldOps Pro execution
            </p>
          </div>
        </div>

        {/* Quote Summary Banner */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100">{quotation.customerName}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Valid until: {new Date(quotation.validUntil).toLocaleDateString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Approved Total</div>
            <div className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {formatBDT(quotation.total)}
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Authorized Signatory Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="e.g. Tanvir Hossain, GM Maintenance"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Client Purchase Order (P.O.) Reference Number
            </label>
            <input
              type="text"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              placeholder="e.g. PO-GP-2025-88"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Signature Canvas */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Pen className="w-3.5 h-3.5 text-emerald-500" />
                Draw Digital Signature
              </label>
              {hasSigned && (
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-[10px] text-red-500 hover:underline font-bold"
                >
                  Clear Signature
                </button>
              )}
            </div>
            <div className="border border-slate-300 dark:border-slate-700 rounded-2xl bg-white overflow-hidden relative touch-none">
              <canvas
                ref={canvasRef}
                width={420}
                height={120}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-28 cursor-crosshair"
              />
              {!hasSigned && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-300 font-handwriting text-sm">
                  Sign with mouse or finger here
                </div>
              )}
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start space-x-2 pt-1">
            <input
              type="checkbox"
              id="approveTerms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <label htmlFor="approveTerms" className="text-[11px] text-slate-600 dark:text-slate-400">
              I confirm authority to approve this quotation on behalf of <strong>{quotation.customerName}</strong> and agree to FieldOps Pro standard terms & 15% NBR VAT terms.
            </label>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex items-center justify-end space-x-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!signerName.trim() || !agreedToTerms}
            onClick={handleConfirm}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            Confirm & Approve Quotation
          </Button>
        </div>
      </div>
    </div>
  );
};
