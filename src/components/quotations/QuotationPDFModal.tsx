import React from 'react';
import { Quotation } from '../../types/quotations';
import { X, Printer, Download, Building2, ShieldCheck, CheckCircle2, FileText, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatBDT } from '../../data/mockQuotationData';

interface QuotationPDFModalProps {
  quotation: Quotation;
  isOpen: boolean;
  onClose: () => void;
}

export const QuotationPDFModal: React.FC<QuotationPDFModalProps> = ({
  quotation,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert(`Downloading PDF for Quotation ${quotation.quotationNumber}...`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-3xl max-w-4xl w-full my-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-900 font-extrabold flex items-center justify-center text-sm">
              PDF
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                Formal Commercial Quotation Document (#{quotation.quotationNumber})
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                NBR VAT Standard • FieldOps Pro Enterprise Format
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button size="xs" variant="outline" onClick={handlePrint} className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700">
              <Printer className="w-3.5 h-3.5 mr-1" /> Print
            </Button>
            <Button size="xs" variant="primary" onClick={handleDownload} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
              <Download className="w-3.5 h-3.5 mr-1" /> Download PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Paper Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-white text-slate-900 font-sans print:p-0">
          <div className="max-w-3xl mx-auto space-y-8 bg-white border border-slate-200 p-8 shadow-sm rounded-xl">
            {/* Document Header */}
            <div className="flex justify-between items-start border-b border-slate-300 pb-6">
              <div>
                <div className="flex items-center space-x-2 text-slate-900 font-black text-2xl tracking-wider">
                  <span className="text-amber-500">FieldOps</span> PRO
                </div>
                <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                  <p className="font-semibold">FieldOps Bangladesh Services Ltd.</p>
                  <p className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> Plot 14, Bir Uttam AK Khandakar Road, Gulshan-1, Dhaka 1212</p>
                  <p className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> +880 (2) 988-5522 • Support: support@fieldopspro.bd</p>
                  <p className="font-mono text-[11px] text-amber-700 font-bold">NBR VAT BIN: 004829104-0101 (15% VAT Registered)</p>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded text-xs uppercase tracking-widest mb-2 border border-amber-300">
                  OFFICIAL QUOTATION
                </div>
                <div className="font-mono font-bold text-lg text-slate-900">{quotation.quotationNumber}</div>
                <div className="text-xs text-slate-500 mt-1 font-mono">
                  Date: {new Date(quotation.date).toLocaleDateString()}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Valid Until: {new Date(quotation.validUntil).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
              <div>
                <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                  PREPARED FOR CLIENT
                </h4>
                <div className="font-extrabold text-sm text-slate-900">{quotation.customerName}</div>
                {quotation.customerNameBn && (
                  <div className="text-xs text-slate-600">{quotation.customerNameBn}</div>
                )}
                <p className="text-slate-600 mt-1">{quotation.customerAddress || 'Gulshan Corporate Tower, Dhaka'}</p>
                <p className="text-slate-600 font-mono mt-0.5">Phone: {quotation.customerPhone}</p>
                <p className="text-slate-600 font-mono">Email: {quotation.customerEmail}</p>
                {quotation.customerBin && (
                  <p className="font-mono text-emerald-700 font-bold mt-1">Client BIN: {quotation.customerBin}</p>
                )}
              </div>

              <div>
                <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                  QUOTATION METRICS
                </h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <strong className="uppercase font-mono text-slate-900">{quotation.status}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Payment Terms:</span>
                    <strong className="text-slate-900">50% Advance / 50% Completion</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax Type:</span>
                    <strong className="text-slate-900">15% NBR Service VAT Included</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Currency:</span>
                    <strong className="font-mono text-slate-900">BDT (Bangladeshi Taka ৳)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 border-b pb-1">
                SCOPE OF WORK & ITEM COST BREAKDOWN
              </h4>

              {quotation.sections.map((section, sIdx) => (
                <div key={section.id || sIdx} className="space-y-2">
                  <div className="bg-slate-100 px-3 py-1 font-bold text-xs text-slate-800 rounded border-l-4 border-amber-500 flex justify-between">
                    <span>{section.title}</span>
                    {section.titleBn && <span className="font-normal text-slate-500">{section.titleBn}</span>}
                  </div>

                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-300 text-slate-600 uppercase text-[10px]">
                        <th className="py-2 px-2 w-8">#</th>
                        <th className="py-2 px-2">Description</th>
                        <th className="py-2 px-2 text-center w-16">Qty</th>
                        <th className="py-2 px-2 text-center w-20">Unit</th>
                        <th className="py-2 px-2 text-right w-24">Rate (৳)</th>
                        <th className="py-2 px-2 text-right w-28">Amount (৳)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {section.items.map((item, itemIdx) => (
                        <tr key={item.id || itemIdx}>
                          <td className="py-2 px-2 text-slate-400 font-mono">{itemIdx + 1}</td>
                          <td className="py-2 px-2 font-medium text-slate-900">
                            {item.description}
                            {item.descriptionBn && (
                              <span className="block text-[10px] text-slate-500 font-normal">{item.descriptionBn}</span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-center font-mono">{item.quantity}</td>
                          <td className="py-2 px-2 text-center text-slate-600">{item.unit}</td>
                          <td className="py-2 px-2 text-right font-mono">{formatBDT(item.unitPrice)}</td>
                          <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">
                            {formatBDT(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* Calculations Total Section */}
            <div className="flex justify-end pt-4 border-t border-slate-300">
              <div className="w-72 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-slate-900">{formatBDT(quotation.subtotal)}</span>
                </div>
                {quotation.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({quotation.discountType === 'percentage' ? `${quotation.discountValue}%` : 'Fixed'}):</span>
                    <span className="font-mono font-bold">-{formatBDT(quotation.discountAmount)}</span>
                  </div>
                )}
                {quotation.includeVat && (
                  <div className="flex justify-between text-slate-600">
                    <span>NBR 15% VAT:</span>
                    <span className="font-mono font-bold text-slate-900">+{formatBDT(quotation.vatAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t-2 border-slate-900">
                  <span>GRAND TOTAL (BDT):</span>
                  <span className="font-mono text-amber-700">{formatBDT(quotation.total)}</span>
                </div>
              </div>
            </div>

            {/* Terms & Notes */}
            <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-600 space-y-2">
              <h5 className="font-bold text-slate-900 uppercase">Terms & Conditions</h5>
              <p className="bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed font-sans">
                {quotation.terms || '1. Validity: This quotation is valid for 15 days from issue date. 2. Payment: 50% advance upon WO issuance, 50% upon successful testing & signoff. 3. Warranty: 90 days service warranty on labor and parts.'}
              </p>
            </div>

            {/* Dual Signatures */}
            <div className="pt-12 grid grid-cols-2 gap-12 text-center text-xs">
              <div className="border-t border-slate-400 pt-2 space-y-1">
                <p className="font-extrabold text-slate-900">FieldOps Bangladesh Services Ltd.</p>
                <p className="text-slate-500 text-[10px]">Authorized Commercial Officer</p>
              </div>

              <div className="border-t border-slate-400 pt-2 space-y-1">
                <p className="font-extrabold text-slate-900">{quotation.customerName}</p>
                <p className="text-slate-500 text-[10px]">Client Acceptance & Stamp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
