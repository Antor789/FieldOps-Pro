import React, { useState } from 'react';
import { WorkOrder, Technician } from '../../types/fsm';
import { Language, translations, formatBDT, formatDhakaTime } from '../../lib/i18n';
import { PaymentReceiptModal } from './PaymentReceiptModal';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  ShieldCheck,
  Building,
  User,
  CreditCard,
  QrCode,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronRight,
  Send,
  Sparkles,
} from 'lucide-react';

interface CustomerTrackingModalProps {
  workOrder: WorkOrder;
  technician?: Technician | null;
  lang: Language;
  onClose: () => void;
}

export const CustomerTrackingModal: React.FC<CustomerTrackingModalProps> = ({
  workOrder,
  technician,
  lang,
  onClose,
}) => {
  const t = translations[lang];
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans text-slate-900 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-extrabold text-xs">
              FO
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight">{t.liveTrackerTitle}</h3>
              <p className="text-[10px] text-slate-400 font-mono">Token: {workOrder.trackingToken || 'trk-dhaka-9001'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Status Alert Banner */}
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">
                {lang === 'bn' ? 'লাইভ স্ট্যাটাস' : 'Live Job Status'}
              </span>
              <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                {workOrder.status}
              </span>
            </div>

            <div className="font-extrabold text-slate-900 text-sm leading-snug">{workOrder.title}</div>

            <div className="text-slate-600 text-[11px] flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{t.estimatedArrival}: <strong>15-20 mins (Dhaka Traffic)</strong></span>
            </div>
          </div>

          {/* Assigned Technician Card */}
          {technician ? (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-md">
                  {technician.firstName[0]}
                  {technician.lastName[0]}
                </div>

                <div className="flex-1">
                  <div className="font-extrabold text-slate-900 text-sm">
                    {technician.firstName} {technician.lastName}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">{technician.vehicleType}</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                    ✓ Verified Field Specialist (+880 BD)
                  </div>
                </div>
              </div>

              {/* Call & WhatsApp Quick Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${technician.phone}`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-center flex items-center justify-center space-x-1.5 shadow-xs transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.callTech}</span>
                </a>

                <a
                  href={`https://wa.me/${technician.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-center flex items-center justify-center space-x-1.5 shadow-xs transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp BD</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center text-slate-500">
              {lang === 'bn' ? 'টেকনিশিয়ান বরাদ্দ প্রক্রিয়াধীন...' : 'Technician dispatch in progress...'}
            </div>
          )}

          {/* Greenweb SMS Log */}
          {workOrder.lastSmsContent && (
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-emerald-800">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-emerald-600" />
                  <span>Greenweb SMS Gateway</span>
                </span>
                <span>{formatDhakaTime(workOrder.lastSmsSentAt || new Date(), lang)}</span>
              </div>
              <div className="text-[11px] text-slate-700 italic">"{workOrder.lastSmsContent}"</div>
            </div>
          )}

          {/* Pricing & bKash Instant Payment Trigger */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400">{lang === 'bn' ? 'অন আনুমানিক সেবা মূল্য' : 'Estimated BDT Fee'}</div>
                <div className="text-lg font-extrabold text-emerald-400 font-mono">
                  {formatBDT(workOrder.pricingEstimatedBDT, lang)}
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                workOrder.paymentStatus === 'PAID_BKASH'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {workOrder.paymentStatus === 'PAID_BKASH' ? '✓ Paid via bKash' : 'Payment Pending'}
              </span>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full bg-pink-600 hover:bg-pink-500 text-white font-extrabold py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition"
            >
              <QrCode className="w-4 h-4" />
              <span>{t.payBkashNow} / Nagad (৳)</span>
            </button>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentReceiptModal
          workOrder={workOrder}
          lang={lang}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={() => {
            setShowPaymentModal(false);
            alert(`✅ Payment confirmed for Work Order #${workOrder.id}! NBR invoice dispatched.`);
          }}
        />
      )}
    </div>
  );
};
