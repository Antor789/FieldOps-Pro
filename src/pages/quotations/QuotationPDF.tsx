import React from 'react';
import { Quotation } from '../../types/quotations';
import { formatBDT, numberToWordsBDT } from '../../data/mockQuotationData';
import {
  Printer,
  Download,
  X,
  FileText,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface QuotationPDFProps {
  quotation: Quotation | null;
  isOpen?: boolean;
  onClose?: () => void;
  onAccept?: () => void;
  isPublicView?: boolean;
}

export const QuotationPDF: React.FC<QuotationPDFProps> = ({
  quotation,
  isOpen = true,
  onClose,
  onAccept,
  isPublicView = false,
}) => {
  if (!quotation || !isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] overflow-hidden">
        {/* Top Control Bar (Hidden when printed) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Official Quotation Document: {quotation.quotationNumber}
              </h3>
              <p className="text-[11px] text-slate-500">
                Print-ready format with NBR 15% VAT & statutory terms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPublicView && onAccept && quotation.status !== 'approved' && quotation.status !== 'converted' && (
              <Button
                variant="primary"
                size="sm"
                onClick={onAccept}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Accept & Sign Quotation
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </Button>

            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Printable Quotation Page Body */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-6 text-slate-900 font-sans leading-relaxed text-xs bg-white print:p-0">
          {/* 1. Company Letterhead Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-xl">
                  FP
                </div>
                <div>
                  <h1 className="text-xl font-black text-blue-950 tracking-tight">
                    FieldOps Pro Engineering Ltd.
                  </h1>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Enterprise Field Service & Industrial Maintenance Engine
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 mt-2 space-y-0.5">
                <p>Level 8, Concord Tower, 113 Gulshan Avenue, Dhaka-1212, Bangladesh</p>
                <p>Phone: +880 2 988-1234 | 24/7 Hotline: +880 1700-112233</p>
                <p>Email: quotes@fieldops.bd | Web: https://fieldops.bd</p>
                <p className="font-semibold text-slate-800">NBR VAT BIN: 001998822-0101 • Trade License: TRAD/DNCC/019283/2024</p>
              </div>
            </div>

            {/* Quotation Ref Box */}
            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-900 font-black text-sm rounded">
                COMMERCIAL ESTIMATE
              </span>
              <div className="text-xs space-y-1 pt-1">
                <div>
                  <span className="text-slate-500">Quote Reference: </span>
                  <strong className="font-mono font-bold text-blue-900">{quotation.quotationNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Date Issued: </span>
                  <strong>{new Date(quotation.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Validity: </span>
                  <strong className="text-amber-800">
                    Through {new Date(quotation.validUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Prepared By: </span>
                  <span>{quotation.createdBy}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Client Particulars */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Quotation Addressed To:
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                {quotation.customerName}
              </h3>
              {quotation.customerNameBn && (
                <p className="text-xs text-slate-600">{quotation.customerNameBn}</p>
              )}
              <p className="text-slate-600 mt-1">{quotation.customerAddress || 'Dhaka, Bangladesh'}</p>
              {quotation.customerBin && (
                <p className="text-slate-700 font-medium mt-1">Client NBR BIN: {quotation.customerBin}</p>
              )}
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Contact & Logistics:
              </span>
              <p className="font-medium text-slate-800">{quotation.customerPhone}</p>
              <p className="text-slate-600">{quotation.customerEmail}</p>
              <p className="text-slate-500 mt-1">Payment Mode: BEFTN / RTGS / Corporate Cheque</p>
            </div>
          </div>

          {/* 3. Line Items Table */}
          <div className="space-y-4">
            {quotation.sections.map((section, sIdx) => (
              <div key={section.id} className="space-y-2">
                <div className="bg-slate-100 px-3 py-1.5 rounded font-bold text-slate-800 flex items-center justify-between text-xs">
                  <span>
                    SECTION {sIdx + 1}: {section.title.toUpperCase()}
                  </span>
                  <span className="text-slate-500 font-normal">
                    {section.items.length} item{section.items.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-300 text-slate-600 font-bold text-[11px] text-left">
                      <th className="py-2 px-2 w-8">#</th>
                      <th className="py-2 px-2">Scope & Service Description</th>
                      <th className="py-2 px-2 text-center w-20">Qty</th>
                      <th className="py-2 px-2 w-20">Unit</th>
                      <th className="py-2 px-2 text-right w-28">Rate (BDT)</th>
                      <th className="py-2 px-2 text-right w-28">Amount (BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {section.items.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-2 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-2">
                          <strong className="text-slate-900 block">{item.description}</strong>
                          {item.descriptionBn && (
                            <span className="text-[10px] text-slate-500">{item.descriptionBn}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold">{item.quantity}</td>
                        <td className="py-2.5 px-2 text-slate-600">{item.unit}</td>
                        <td className="py-2.5 px-2 text-right font-medium">{formatBDT(item.unitPrice)}</td>
                        <td className="py-2.5 px-2 text-right font-bold text-slate-900">{formatBDT(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* 4. Calculation Breakdown & Grand Total */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t-2 border-slate-200">
            {/* Bank details & In words */}
            <div className="flex-1 space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                <span className="font-bold text-slate-800 block">Bank Account for Settlement:</span>
                <p>Account Name: <strong>FieldOps Pro Engineering Ltd.</strong></p>
                <p>Bank: <strong>The City Bank PLC</strong> • Branch: <strong>Gulshan 2, Dhaka</strong></p>
                <p>A/C No: <strong>1102938475001</strong> • Routing: <strong>225271822</strong></p>
                <p className="text-[10px] text-slate-500 pt-1">bKash Merchant Pay: 01700-112233 (Counter 1)</p>
              </div>

              <div className="text-[11px] text-slate-700 italic">
                <strong>Amount in Words: </strong>
                {numberToWordsBDT(quotation.total)}
              </div>
            </div>

            {/* Calculations Box */}
            <div className="w-full sm:w-72 space-y-1.5 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <strong className="text-slate-900">{formatBDT(quotation.subtotal)}</strong>
              </div>

              {quotation.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount ({quotation.discountType === 'percentage' ? `${quotation.discountValue}%` : 'Fixed'}):</span>
                  <strong>-{formatBDT(quotation.discountAmount)}</strong>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>NBR VAT (15% Mushak-6.3):</span>
                <strong className="text-slate-900">
                  {quotation.includeVat ? `+${formatBDT(quotation.vatAmount)}` : 'Exempt'}
                </strong>
              </div>

              <div className="pt-2 border-t-2 border-slate-400 flex justify-between text-sm">
                <strong className="text-slate-950 uppercase">Grand Total:</strong>
                <strong className="text-blue-900 text-base">{formatBDT(quotation.total)}</strong>
              </div>
            </div>
          </div>

          {/* 5. Terms & Conditions */}
          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-600 space-y-1 leading-normal">
            <span className="font-bold text-slate-800 uppercase tracking-wider block">
              Commercial Terms & Conditions:
            </span>
            <p>1. <strong>Validity:</strong> This quotation remains valid for 15 calendar days from the issue date.</p>
            <p>2. <strong>NBR VAT:</strong> Standard 15% VAT will be invoiced with official Mushak-6.3 challan upon job completion.</p>
            <p>3. <strong>Payment Terms:</strong> 50% advance against work order confirmation, balance 50% upon client signoff.</p>
            <p>4. <strong>Warranty:</strong> 60 days workmanship warranty on installed parts and precision services.</p>
            {quotation.terms && <p>5. <strong>Specific Note:</strong> {quotation.terms}</p>}
          </div>

          {/* 6. Signature Block */}
          <div className="pt-10 grid grid-cols-2 gap-12 text-center text-xs">
            <div className="space-y-1">
              <div className="h-12 border-b border-slate-400 flex items-end justify-center pb-1">
                <span className="font-serif italic font-bold text-blue-950 text-sm">
                  {quotation.createdBy || 'Engr. Rashidul Islam'}
                </span>
              </div>
              <strong className="block text-slate-900">Authorized Signature & Seal</strong>
              <span className="text-slate-500 text-[10px]">FieldOps Pro Engineering Ltd.</span>
            </div>

            <div className="space-y-1">
              <div className="h-12 border-b border-slate-400 flex items-end justify-center pb-1">
                {quotation.status === 'approved' || quotation.status === 'converted' ? (
                  <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ACCEPTED & APPROVED
                  </span>
                ) : (
                  <span className="text-slate-400 text-[10px] italic">Signature upon acceptance</span>
                )}
              </div>
              <strong className="block text-slate-900">Customer Authorization</strong>
              <span className="text-slate-500 text-[10px]">{quotation.customerName}</span>
            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-2.5 bg-slate-100 border-t border-slate-200 text-center text-[11px] text-slate-500 print:hidden">
          FieldOps Pro • NBR Compliant Automated Quotation Engine • Verified Hash SHA-256
        </div>
      </div>
    </div>
  );
};
