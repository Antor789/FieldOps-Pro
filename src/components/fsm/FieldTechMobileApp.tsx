import React, { useState, useRef, useEffect } from 'react';
import { WorkOrder, Technician, NetworkStatus, PaymentMethod, PaymentReceipt } from '../../types/fsm';
import { Language, translations, formatBDT } from '../../lib/i18n';
import {
  Smartphone,
  Wifi,
  WifiOff,
  Signal,
  MapPin,
  Navigation,
  CheckCircle2,
  Camera,
  ShieldAlert,
  Save,
  Trash2,
  Send,
  Building,
  QrCode,
  Banknote,
  DollarSign,
  Clock,
  Sparkles,
  RefreshCw,
  PhoneCall,
  Lock,
} from 'lucide-react';

interface FieldTechMobileAppProps {
  technician: Technician;
  assignedWorkOrders: WorkOrder[];
  lang: Language;
  onUpdateWorkOrderStatus: (woId: string, status: any) => void;
  onSaveProofOfWork: (woId: string, signatureUrl: string, photos: string[]) => void;
  onPaymentSuccess?: (woId: string, receipt: PaymentReceipt) => void;
}

export const FieldTechMobileApp: React.FC<FieldTechMobileAppProps> = ({
  technician,
  assignedWorkOrders,
  lang,
  onUpdateWorkOrderStatus,
  onSaveProofOfWork,
  onPaymentSuccess,
}) => {
  const t = translations[lang];

  const activeJob = assignedWorkOrders.find((w) => w.status !== 'COMPLETED') || assignedWorkOrders[0];

  const [activeTab, setActiveTab] = useState<'JOB' | 'SAFETY' | 'PROOF' | 'PAYMENT'>('JOB');
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('ONLINE_4G');
  const [offlineBuffer, setOfflineBuffer] = useState<number>(technician.unSyncedBufferCount || 0);
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);

  // Digital Signature Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  // Payment Collection State in Tech App
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('BKASH');
  const [payerPhone, setPayerPhone] = useState<string>(activeJob?.customerPhoneBd || '01711001122');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paidReceipt, setPaidReceipt] = useState<PaymentReceipt | null>(activeJob?.paymentReceipt || null);

  // Handle Canvas Digital Signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsSigning(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isSigning) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsSigning(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSimulatePhotoUpload = () => {
    if (networkStatus === 'OFFLINE_SYNC') {
      setOfflineBuffer((prev) => prev + 1);
      setSyncToastMessage('📸 Photo buffered locally in IndexedDB (Offline)');
      setTimeout(() => setSyncToastMessage(null), 2500);
    } else {
      setPhotos([...photos, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80']);
    }
  };

  const handleNetworkToggle = (newStatus: NetworkStatus) => {
    setNetworkStatus(newStatus);
    if (newStatus === 'ONLINE_4G' && offlineBuffer > 0) {
      setSyncToastMessage(`🔄 Network restored! Syncing ${offlineBuffer} buffered offline items to server...`);
      setTimeout(() => {
        setOfflineBuffer(0);
        setSyncToastMessage('✅ All local offline data synchronized with cloud DB!');
        setTimeout(() => setSyncToastMessage(null), 3000);
      }, 1500);
    }
  };

  const handleCollectPaymentInApp = () => {
    if (!activeJob) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      const totalBDT = activeJob.pricingEstimatedBDT || 5000;
      const subtotalBDT = Math.round((totalBDT / 1.15) * 100) / 100;
      const vatBDT = Math.round((totalBDT - subtotalBDT) * 100) / 100;

      const receipt: PaymentReceipt = {
        transactionId: `TRX-${selectedPaymentMethod}-${Math.floor(1000000 + Math.random() * 9000000)}`,
        method: selectedPaymentMethod,
        subtotalBDT,
        vatBDT,
        totalBDT,
        paidAt: new Date().toISOString(),
        payerPhone,
        nbrBin: '002938102-0101',
        isConfirmed: true,
      };

      setPaidReceipt(receipt);
      setIsProcessingPayment(false);

      if (onPaymentSuccess) {
        onPaymentSuccess(activeJob.id, receipt);
      }
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 text-slate-100 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl font-sans flex flex-col min-h-[780px]">
      {/* PWA Mobile Status Bar */}
      <div className="bg-slate-950 px-5 py-3 flex items-center justify-between text-xs border-b border-slate-800">
        <div className="flex items-center space-x-2 font-mono">
          <Smartphone className="w-4 h-4 text-indigo-400" />
          <span className="font-extrabold text-white">{technician.firstName} {technician.lastName}</span>
        </div>

        {/* Network Resilience Selector Bar */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px]">
          <button
            onClick={() => handleNetworkToggle('ONLINE_4G')}
            className={`px-2 py-0.5 rounded-lg font-bold transition ${
              networkStatus === 'ONLINE_4G' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            4G
          </button>
          <button
            onClick={() => handleNetworkToggle('POOR_SIGNAL')}
            className={`px-2 py-0.5 rounded-lg font-bold transition ${
              networkStatus === 'POOR_SIGNAL' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Poor
          </button>
          <button
            onClick={() => handleNetworkToggle('OFFLINE_SYNC')}
            className={`px-2 py-0.5 rounded-lg font-bold transition ${
              networkStatus === 'OFFLINE_SYNC' ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Offline
          </button>
        </div>
      </div>

      {/* Sync Toast Notification */}
      {syncToastMessage && (
        <div className="bg-indigo-600 text-white px-4 py-2 text-xs font-bold text-center animate-fadeIn flex items-center justify-center space-x-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>{syncToastMessage}</span>
        </div>
      )}

      {/* Offline Unsynced Buffer Warning Badge */}
      {offlineBuffer > 0 && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 text-amber-300 px-4 py-1.5 text-[11px] font-mono flex items-center justify-between">
          <span>⚠️ Offline Mode Active</span>
          <span className="bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-full text-[10px]">
            {offlineBuffer} Queued in IndexedDB
          </span>
        </div>
      )}

      {/* Active Work Order Header */}
      {activeJob ? (
        <div className="bg-slate-800/80 p-4 border-b border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-indigo-400 font-bold">{activeJob.id}</span>
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-extrabold text-[10px]">
              {activeJob.status}
            </span>
          </div>

          <h2 className="font-extrabold text-sm text-white leading-snug">{activeJob.title}</h2>

          <div className="text-xs text-slate-300 space-y-1">
            <div className="flex items-center space-x-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{activeJob.customerName}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{activeJob.locationPoint.landmark || activeJob.locationPoint.address}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 text-xs">No active work order assigned</div>
      )}

      {/* App Step Navigation Tabs */}
      <div className="grid grid-cols-4 bg-slate-950 border-b border-slate-800 text-[11px] font-bold">
        <button
          onClick={() => setActiveTab('JOB')}
          className={`py-3 text-center border-b-2 transition ${
            activeTab === 'JOB'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.tabJob}
        </button>
        <button
          onClick={() => setActiveTab('SAFETY')}
          className={`py-3 text-center border-b-2 transition ${
            activeTab === 'SAFETY'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.tabSafety}
        </button>
        <button
          onClick={() => setActiveTab('PROOF')}
          className={`py-3 text-center border-b-2 transition ${
            activeTab === 'PROOF'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.tabProof}
        </button>
        <button
          onClick={() => setActiveTab('PAYMENT')}
          className={`py-3 text-center border-b-2 transition ${
            activeTab === 'PAYMENT'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.tabPayment}
        </button>
      </div>

      {/* Tab Body Contents */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
        {activeJob && activeTab === 'JOB' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700 space-y-3">
              <div className="font-bold text-white text-xs flex items-center justify-between">
                <span>GPS Route & Geofence Status</span>
                <span className="text-emerald-400 font-mono">Dhaka Metro-Ga 45-8910</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Target Location</div>
                  <div className="font-bold text-white mt-0.5">{activeJob.locationPoint.thanaUpazila || 'Dhaka'}</div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Estimated Service BDT</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{formatBDT(activeJob.pricingEstimatedBDT, lang)}</div>
                </div>
              </div>

              {/* Status Action Workflow Buttons */}
              <div className="space-y-2 pt-2">
                {activeJob.status === 'ASSIGNED' && (
                  <button
                    onClick={() => onUpdateWorkOrderStatus(activeJob.id, 'EN_ROUTE')}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl flex items-center justify-center space-x-2 shadow-lg transition"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>{t.startGps}</span>
                  </button>
                )}

                {activeJob.status === 'EN_ROUTE' && (
                  <button
                    onClick={() => onUpdateWorkOrderStatus(activeJob.id, 'IN_PROGRESS')}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-2xl flex items-center justify-center space-x-2 shadow-lg transition"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{t.arrivedGeofence}</span>
                  </button>
                )}

                {activeJob.status === 'IN_PROGRESS' && (
                  <div className="bg-emerald-500/20 border border-emerald-500/30 p-3 rounded-2xl text-emerald-300 font-bold text-center">
                    ✓ Service Active — Proceed to Payment & Signature
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Safety Check */}
        {activeTab === 'SAFETY' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="font-bold text-white mb-2">{lang === 'bn' ? 'বাংলা সেফটি ও সিকিউরিটি প্রোটোকল' : 'On-Site Safety Protocols'}</div>

            <label className="flex items-start space-x-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-1 rounded text-indigo-600 focus:ring-0" />
              <span className="text-slate-200">
                {lang === 'bn' ? '১. হাই ভোল্টেজ বা যন্ত্রাংশের পাওয়ার স্যুইচ বন্ধ করা হয়েছে (Lockout Tagout)' : '1. High voltage power lock-out confirmed.'}
              </span>
            </label>

            <label className="flex items-start space-x-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-1 rounded text-indigo-600 focus:ring-0" />
              <span className="text-slate-200">
                {lang === 'bn' ? '২. ইনসুলেটেড গ্লাভস ও হেলমেট পরিধান করা হয়েছে' : '2. Insulated gloves and helmet equipped.'}
              </span>
            </label>

            <label className="flex items-start space-x-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-1 rounded text-indigo-600 focus:ring-0" />
              <span className="text-slate-200">
                {lang === 'bn' ? '৩. গ্রাহকের সাইট কর্তৃপক্ষের সাথে পারমিট নিশ্চিত করা হয়েছে' : '3. Customer site entrance token validated.'}
              </span>
            </label>
          </div>
        )}

        {/* Tab 3: Signature Pad & Proof */}
        {activeTab === 'PROOF' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <div className="font-bold text-white mb-1.5">{t.customerSignature}</div>
              <div className="bg-white rounded-2xl overflow-hidden p-1 shadow-inner relative">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-36 bg-slate-50 rounded-xl cursor-crosshair touch-none"
                />
                {!hasSignature && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 font-mono text-xs">
                    Sign Here With Finger / Pen
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-2">
                <button
                  onClick={clearCanvas}
                  className="text-slate-400 hover:text-red-400 text-xs font-bold flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.clearSignature}</span>
                </button>
              </div>
            </div>

            {/* Photo Proof Upload */}
            <div className="space-y-2">
              <div className="font-bold text-white">{t.attachPhoto}</div>
              <button
                onClick={handleSimulatePhotoUpload}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold py-2.5 rounded-2xl flex items-center justify-center space-x-2 transition"
              >
                <Camera className="w-4 h-4 text-indigo-400" />
                <span>Capture / Attach Work Photo</span>
              </button>

              {photos.length > 0 && (
                <div className="flex gap-2 pt-2">
                  {photos.map((url, idx) => (
                    <img key={idx} src={url} alt="Proof" className="w-16 h-16 object-cover rounded-xl border border-slate-700" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Local Payment & Collection (৳) */}
        {activeTab === 'PAYMENT' && activeJob && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-3">
              <div className="font-bold text-white text-xs flex items-center justify-between">
                <span>{t.collectPayment}</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  {formatBDT(activeJob.pricingEstimatedBDT || 5000, lang)}
                </span>
              </div>

              {!paidReceipt ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setSelectedPaymentMethod('BKASH')}
                      className={`p-2.5 rounded-xl border font-bold text-left transition ${
                        selectedPaymentMethod === 'BKASH'
                          ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      bKash QR
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod('NAGAD')}
                      className={`p-2.5 rounded-xl border font-bold text-left transition ${
                        selectedPaymentMethod === 'NAGAD'
                          ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      Nagad MFS
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod('CASH_ON_DELIVERY')}
                      className={`p-2.5 rounded-xl border font-bold text-left transition ${
                        selectedPaymentMethod === 'CASH_ON_DELIVERY'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      Cash (COD)
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod('SSLCOMMERZ')}
                      className={`p-2.5 rounded-xl border font-bold text-left transition ${
                        selectedPaymentMethod === 'SSLCOMMERZ'
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      SSLCommerz
                    </button>
                  </div>

                  <button
                    onClick={handleCollectPaymentInApp}
                    disabled={isProcessingPayment}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold py-3 rounded-2xl flex items-center justify-center space-x-2 shadow-lg transition"
                  >
                    {isProcessingPayment ? (
                      <Sparkles className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Banknote className="w-4 h-4" />
                        <span>Confirm Payment & Issue NBR Invoice</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-500/20 border border-emerald-500/30 p-3 rounded-2xl text-emerald-300 space-y-1 font-mono text-xs">
                  <div className="font-bold text-sm text-emerald-400">✓ Payment Received!</div>
                  <div>Trx ID: {paidReceipt.transactionId}</div>
                  <div>Total: {formatBDT(paidReceipt.totalBDT, lang)}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Complete CTA */}
      {activeJob && (
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={() => {
              onUpdateWorkOrderStatus(activeJob.id, 'COMPLETED');
              alert(`🎉 Work Order #${activeJob.id} completed & signed! NBR invoice dispatched.`);
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3.5 rounded-2xl flex items-center justify-center space-x-2 shadow-xl transition"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{t.finalizeJob}</span>
          </button>
        </div>
      )}
    </div>
  );
};
