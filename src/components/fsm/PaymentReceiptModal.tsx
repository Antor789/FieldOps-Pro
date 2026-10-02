import React, { useState } from 'react';
import { WorkOrder, PaymentMethod, PaymentReceipt } from '../../types/fsm';
import { Language, formatBDT, formatDhakaTime } from '../../lib/i18n';
import {
  CreditCard,
  QrCode,
  CheckCircle2,
  Printer,
  Smartphone,
  ShieldCheck,
  Building,
  Phone,
  X,
  Sparkles,
  Download,
  Send,
  Banknote,
  Receipt,
  FileCheck,
} from 'lucide-react';

interface PaymentReceiptModalProps {
  workOrder: WorkOrder;
  lang: Language;
  onClose: () => void;
  onPaymentSuccess: (receipt: PaymentReceipt) => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  workOrder,
  lang,
  onClose,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('BKASH');
  const [payerPhone, setPayerPhone] = useState<string>(workOrder.customerPhoneBd || '01711001122');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedReceipt, setCompletedReceipt] = useState<PaymentReceipt | null>(workOrder.paymentReceipt || null);
  const [smsNotificationSent, setSmsNotificationSent] = useState<boolean>(false);

  // Financial Calculations (NBR Standard 15% VAT)
  const totalBDT = workOrder.pricingEstimatedBDT || 5000;
  const subtotalBDT = Math.round((totalBDT / 1.15) * 100) / 100;
  const vatBDT = Math.round((totalBDT - subtotalBDT) * 100) / 100;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const randomTrx = Math.floor(1000000 + Math.random() * 9000000);
      const trxId = `TRX-${selectedMethod}-${randomTrx}`;

      const receipt: PaymentReceipt = {
        transactionId: trxId,
        method: selectedMethod,
        subtotalBDT,
        vatBDT,
        totalBDT,
        paidAt: new Date().toISOString(),
        payerPhone,
        nbrBin: '002938102-0101',
        isConfirmed: true,
      };

      setCompletedReceipt(receipt);
      setIsProcessing(false);
      onPaymentSuccess(receipt);
    }, 1200);
  };

  const handleSendSmsReceipt = () => {
    setSmsNotificationSent(true);
    setTimeout(() => {
      alert(`✅ Greenweb SMS & WhatsApp Receipt dispatched to ${payerPhone}!\n\n"আপনার ওয়ার্ক অর্ডার #${workOrder.id}-এর পেমেন্ট ${formatBDT(totalBDT, lang)} (TRX: ${completedReceipt?.transactionId}) সফল হয়েছে।"`);
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans text-slate-900 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
              ৳
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-2">
                {lang === 'bn' ? 'বাংলাদেশ ডিজিটাল পেমেন্ট ও এনবিআর চালান' : 'Bangladesh Local Payment & NBR Invoice'}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                {lang === 'bn' ? 'এনবিআর নিবন্ধন বিআইএন: ০০২৯৩৮১০২-০১০১' : 'NBR BIN Registration: 002938102-0101'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Work Order Info Card */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>WO ID: <strong className="text-slate-800">{workOrder.id}</strong></span>
              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-indigo-100">
                {workOrder.siteName}
              </span>
            </div>
            <div className="font-bold text-slate-900 text-sm">{workOrder.title}</div>
            <div className="text-slate-600 flex items-center space-x-1">
              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{workOrder.customerName}</span>
            </div>
          </div>

          {!completedReceipt ? (
            /* PAYMENT FORM MODE */
            <form onSubmit={handleProcessPayment} className="space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="text-slate-700 font-bold block mb-2 uppercase tracking-wider text-[10px]">
                  {lang === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন:' : 'Select Payment Gateway / Method:'}
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {/* bKash */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('BKASH')}
                    className={`p-3 rounded-2xl border transition text-left flex flex-col justify-between h-20 ${
                      selectedMethod === 'BKASH'
                        ? 'bg-pink-50 border-pink-500 ring-2 ring-pink-500/30'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-pink-600 text-xs">bKash</span>
                      <Smartphone className="w-4 h-4 text-pink-500" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">Mobile Financial</span>
                  </button>

                  {/* Nagad */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('NAGAD')}
                    className={`p-3 rounded-2xl border transition text-left flex flex-col justify-between h-20 ${
                      selectedMethod === 'NAGAD'
                        ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/30'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-orange-600 text-xs">Nagad</span>
                      <QrCode className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">Post Office MFS</span>
                  </button>

                  {/* Upay */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('UPAY')}
                    className={`p-3 rounded-2xl border transition text-left flex flex-col justify-between h-20 ${
                      selectedMethod === 'UPAY'
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/30'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-blue-600 text-xs">Upay</span>
                      <Smartphone className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">UCB MFS</span>
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('CASH_ON_DELIVERY')}
                    className={`p-3 rounded-2xl border transition text-left flex flex-col justify-between h-20 ${
                      selectedMethod === 'CASH_ON_DELIVERY'
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-700 text-xs">Cash (COD)</span>
                      <Banknote className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">On-Site Collection</span>
                  </button>

                  {/* SSLCommerz */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('SSLCOMMERZ')}
                    className={`p-3 rounded-2xl border transition text-left flex flex-col justify-between h-20 col-span-2 sm:col-span-2 ${
                      selectedMethod === 'SSLCOMMERZ'
                        ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/30'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-purple-700 text-xs">SSLCommerz Gateway</span>
                      <CreditCard className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">Visa / Mastercard / Internet Banking</span>
                  </button>
                </div>
              </div>

              {/* Payer Mobile Field */}
              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  {lang === 'bn' ? 'গ্রাহকের বিডি মোবাইল নম্বর:' : 'Customer BD Mobile Number:'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    placeholder="+880 1711-001122"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Breakdown Invoice Card */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 font-mono text-xs shadow-inner">
                <div className="flex justify-between text-slate-400">
                  <span>{lang === 'bn' ? 'মূল সেবা মূল্য (Subtotal):' : 'Service Subtotal:'}</span>
                  <span>{formatBDT(subtotalBDT, lang)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{lang === 'bn' ? 'এনবিআর ১৫% মূসক (VAT 15%):' : 'NBR VAT (15% Standard):'}</span>
                  <span className="text-emerald-400">+{formatBDT(vatBDT, lang)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                  <span>{lang === 'bn' ? 'সর্বমোট প্রদেয় টাকা:' : 'Total Payable (BDT):'}</span>
                  <span className="text-emerald-400 text-base">{formatBDT(totalBDT, lang)}</span>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg transition transform active:scale-98"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>{lang === 'bn' ? 'পেমেন্ট প্রসেস হচ্ছে...' : 'Processing Payment Gateway...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {lang === 'bn'
                        ? `${formatBDT(totalBDT, lang)} পেমেন্ট সম্পন্ন করুন`
                        : `Confirm & Pay ${formatBDT(totalBDT, lang)}`}
                    </span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* COMPLETED RECEIPT VIEW */
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-800 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                <div className="font-extrabold text-sm">
                  {lang === 'bn' ? 'পেমেন্ট সফল ও এনবিআর চালান তৈরী হয়েছে!' : 'Payment Completed & NBR Receipt Issued!'}
                </div>
                <div className="text-[11px] font-mono text-emerald-700">
                  Trx ID: <strong>{completedReceipt.transactionId}</strong>
                </div>
              </div>

              {/* Printable Official NBR Receipt */}
              <div className="bg-white border border-slate-300 p-4 rounded-2xl space-y-3 font-mono text-xs shadow-xs text-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">OFFICIAL NBR TAX INVOICE</h4>
                    <p className="text-[10px] text-slate-500">Government of the People's Republic of Bangladesh</p>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">
                    <div className="font-bold text-slate-800">{completedReceipt.nbrBin}</div>
                    <div>{formatDhakaTime(completedReceipt.paidAt, lang)}</div>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] py-1 border-b border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Work Order ID:</span>
                    <span className="font-bold">{workOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer Name:</span>
                    <span className="font-bold">{workOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Gateway:</span>
                    <span className="font-bold text-indigo-600 uppercase">{completedReceipt.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payer Mobile:</span>
                    <span className="font-bold">{completedReceipt.payerPhone}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs pt-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Service Charge:</span>
                    <span>{formatBDT(completedReceipt.subtotalBDT, lang)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>NBR VAT (15%):</span>
                    <span className="text-emerald-700">+{formatBDT(completedReceipt.vatBDT, lang)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                    <span>Total Paid:</span>
                    <span className="text-indigo-600">{formatBDT(completedReceipt.totalBDT, lang)}</span>
                  </div>
                </div>
              </div>

              {/* Receipt Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSendSmsReceipt}
                  className={`flex-1 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition ${
                    smsNotificationSent
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {smsNotificationSent
                      ? lang === 'bn' ? 'এসএমএস পাঠানো হয়েছে ✓' : 'SMS Sent via Greenweb ✓'
                      : lang === 'bn' ? 'গ্রাহককে এসএমএস ও হোয়াটসঅ্যাপ রসিদ পাঠান' : 'Send Greenweb SMS & WhatsApp Receipt'}
                  </span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2.5 rounded-xl text-xs flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
