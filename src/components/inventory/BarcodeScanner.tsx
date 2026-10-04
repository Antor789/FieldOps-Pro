import React, { useState } from 'react';
import { Part } from '../../types/inventory';
import { formatBDT } from '../../utils/formatters';
import { X, QrCode, Camera, Check, Search, Package, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export interface BarcodeScannerProps {
  isOpen: boolean;
  parts: Part[];
  locale?: 'en' | 'bn';
  onClose: () => void;
  onSelectPart: (part: Part) => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  isOpen,
  parts,
  locale = 'en',
  onClose,
  onSelectPart,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [isSimulatingCamera, setIsSimulatingCamera] = useState(true);
  const [matchedPart, setMatchedPart] = useState<Part | null>(null);

  if (!isOpen) return null;

  const handleManualSearch = (code: string) => {
    setManualCode(code);
    const found = parts.find(
      (p) =>
        p.barcode === code ||
        p.sku.toLowerCase() === code.toLowerCase() ||
        p.name.toLowerCase().includes(code.toLowerCase())
    );
    setMatchedPart(found || null);
  };

  const simulateQuickScan = (sampleCode: string) => {
    handleManualSearch(sampleCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {locale === 'bn' ? '📷 বারকোড ও কিউআর স্ক্যানার' : '📷 Optical Barcode & QR Scanner'}
              </h3>
              <p className="text-xs text-slate-500">
                {locale === 'bn' ? 'যন্ত্রাংশ স্ক্যান করে সরাসরি স্টক যাচাই' : 'Instant Field Van & Warehouse Lookup'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Viewfinder simulation */}
          <div className="relative aspect-video rounded-xl bg-slate-950 flex flex-col items-center justify-center overflow-hidden border border-slate-800">
            {/* Animated Laser Scanning Line */}
            <motion.div
              animate={{ y: [-80, 80, -80] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="absolute left-6 right-6 h-0.5 bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)] z-10 pointer-events-none"
            />

            {/* Target Reticle */}
            <div className="w-48 h-28 border-2 border-dashed border-indigo-400/80 rounded-lg flex items-center justify-center relative">
              <Camera className="w-8 h-8 text-indigo-400/40 animate-pulse" />
              <div className="absolute top-1 left-2 text-[9px] font-mono text-indigo-400 uppercase tracking-widest">
                AI Optical Reticle
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-mono mt-3 z-10">
              {locale === 'bn' ? 'ফ্রেমের মধ্যে বারকোড রাখুন' : 'Align barcode in frame viewfinder'}
            </p>
          </div>

          {/* Quick Mock Sample Barcodes */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500">
              {locale === 'bn' ? 'টেস্ট স্ক্যান নির্বাচন করুন:' : 'Simulate Quick Sample Scans:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {parts.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => simulateQuickScan(p.barcode || p.sku)}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 font-mono text-[10px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  ⚡ {p.sku}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Search */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {locale === 'bn' ? 'অথবা ম্যানুয়াল কোড লিখুন' : 'Or Manual SKU / Barcode Entry'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => handleManualSearch(e.target.value)}
                placeholder="e.g. TRF-001 or 880192837461"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => handleManualSearch(manualCode)}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Match Outcome Card */}
          {matchedPart && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-mono font-bold text-xs bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                    {matchedPart.sku}
                  </span>
                  <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200 truncate">
                    {matchedPart.name}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300">
                  Stock: <strong>{matchedPart.totalStock} {matchedPart.unit}</strong> • Price: <strong>{formatBDT(matchedPart.unitPriceBDT, locale)}</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectPart(matchedPart);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shrink-0 flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Select</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
