import React, { useState } from 'react';
import { WorkOrder, PaymentMethod, PaymentReceipt } from '../../types/fsm';
import { Language, formatBDT, formatDhakaTime } from '../../lib/i18n';
import { Button } from '../ui/Button';
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
    }, 1000);
  };

  const handleSendSmsReceipt = () => {
    setSmsNotificationSent(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans text-slate-900 dark:text-slate-100 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Top Header Bar */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
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
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Work Order Info Card */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span>WO ID: <strong className="text-slate-800 dark:text-slate-200">{workOrder.id}</strong></span>
              <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold border border-indigo-200 dark:border-indigo-800">
                {workOrder.siteName}
              </span>
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{workOrder.title}</div>
            <div className="text-slate-600 dark:text-slate-400 flex items-center space-x-1">
              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{workOrder.customerName}</span>
            </div>
          </div>

          {!completedReceipt ? (
            /* PAYMENT FORM MODE */
            <form onSubmit={handleProcessPayment} className="space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-2 uppercase tracking-wider text-[10px]">
                  {lang === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন:' : 'Select Payment Gateway / Method:'}
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {/* bKash */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('BKASH')}
                    className={`p-3 rounded-2xl border transition text-left flex flex-col justify-between h-20 cursor-pointer ${
                      selectedMethod === 'BKASH'
                        ? 'bg-pink-50 dark:bg-pink-950/50 border-[#E2136E] ring-2 ring-[#E2136E]/30'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#E2136E] text-xs">bKash</span>
                      <Smartphone className="w-4 h-4 text-[#E2136E]" />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Mobile Financial</span>
                  </button>

                  {/* Nagad */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('NAGAD')}
                    className={`p-3 rounded-2xl border transition text-left flex flex-col justify-between h-20 cursor-pointer ${
                      selectedMethod === 'NAGAD'
                        ? 'bg-orange-50 dark:bg-orange-950/50 border-[#F7941D] ring-2 ring-[#F7941D]/30'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#F7941D] text-xs">Nagad</span>
                      <QrCode className="w-4 h-4 text-[#F7941D]" />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Post Office MFS</span>
                  </button>

                  {/* Upay */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('UPAY')}
                    className={`p-3 rounded-2xl border transition text-left flex flex-col justify-between h-20 cursor-pointer ${
                      selectedMethod === 'UPAY'
                        ? 'bg-blue-50 dark:bg-blue-950/50 border-[#005CA9] ring-2 ring-[#005CA9]/30'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400 text-xs">Upay</span>
                      <Smartphone className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">UCB MFS</span>
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('CASH_ON_DELIVERY')}
                    className={`p-3 rounded-2xl border transition text-left flex flex-col justify-between h-20 cursor-pointer ${
                      selectedMethod === 'CASH_ON_DELIVERY'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-xs">Cash (COD)</span>
                      <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">On-Site Collection</span>
                  </button>

                  {/* SSLCommerz */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('SSLCOMMERZ')}
                    className={`p-3 rounded-2xl border transition text-left flex flex-col justify-between h-20 col-span-2 sm:col-span-2 cursor-pointer ${
                      selectedMethod === 'SSLCOMMERZ'
                        ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-500 ring-2 ring-purple-500/30'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-purple-700 dark:text-purple-300 text-xs">SSLCommerz Gateway</span>
                      <CreditCard className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Visa / Mastercard / Internet Banking</span>
                  </button>
                </div>
              </div>

              {/* Payer Mobile Field */}
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">
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
                    className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Breakdown Invoice Card */}
              <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 rounded-2xl space-y-2 font-mono text-xs shadow-inner">
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
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isProcessing}
                className="w-full"
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              >
                {lang === 'bn'
                  ? `${formatBDT(totalBDT, lang)} পেমেন্ট সম্পন্ন করুন`
                  : `Confirm & Pay ${formatBDT(totalBDT, lang)}`}
              </Button>
            </form>
          ) : (
            /* COMPLETED RECEIPT VIEW */
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl text-emerald-800 dark:text-emerald-200 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400" />
                <div className="font-extrabold text-sm">
                  {lang === 'bn' ? 'পেমেন্ট সফল ও এনবিআর চালান তৈরী হয়েছে!' : 'Payment Completed & NBR Receipt Issued!'}
                </div>
                <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300">
                  Trx ID: <strong>{completedReceipt.transactionId}</strong>
                </div>
              </div>

              {/* Printable Official NBR Receipt */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-3 font-mono text-xs shadow-xs text-slate-800 dark:text-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">OFFICIAL NBR TAX INVOICE</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Government of the People's Republic of Bangladesh</p>
                  </div>
                  <div className="text-right text-[10px] text-slate-500 dark:text-slate-400">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{completedReceipt.nbrBin}</div>
                    <div>{formatDhakaTime(completedReceipt.paidAt, lang)}</div>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] py-1 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Work Order ID:</span>
                    <span className="font-bold">{workOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Customer Name:</span>
                    <span className="font-bold">{workOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Payment Gateway:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">{completedReceipt.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Payer Mobile:</span>
                    <span className="font-bold">{completedReceipt.payerPhone}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs pt-1">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Base Service Charge:</span>
                    <span>{formatBDT(completedReceipt.subtotalBDT, lang)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>NBR VAT (15%):</span>
                    <span className="text-emerald-700 dark:text-emerald-400">+{formatBDT(completedReceipt.vatBDT, lang)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    <span>Total Paid:</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{formatBDT(completedReceipt.totalBDT, lang)}</span>
                  </div>
                </div>
              </div>

              {/* Receipt Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleSendSmsReceipt}
                  variant={smsNotificationSent ? 'success' : 'primary'}
                  size="md"
                  className="flex-1"
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  {smsNotificationSent
                    ? lang === 'bn' ? 'এসএমএস পাঠানো হয়েছে ✓' : 'SMS Sent via Greenweb ✓'
                    : lang === 'bn' ? 'গ্রাহককে এসএমএস ও হোয়াটসঅ্যাপ রসিদ পাঠান' : 'Send Greenweb SMS Receipt'}
                </Button>

                <Button
                  onClick={() => window.print()}
                  variant="secondary"
                  size="md"
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                >
                  Print
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
