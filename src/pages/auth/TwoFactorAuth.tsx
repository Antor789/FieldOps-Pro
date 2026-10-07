import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { OTPInput } from '../../components/auth/OTPInput';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  QrCode,
  Key,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Lock,
  ArrowRight,
} from 'lucide-react';

export interface TwoFactorAuthProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  locale?: 'en' | 'bn';
}

export const TwoFactorAuthPage: React.FC<TwoFactorAuthProps> = ({
  onSuccess,
  onCancel,
  locale = 'en',
}) => {
  const { user, twoFactorConfig, toggleTwoFactor, verifyTwoFactor, isLoading } = useAuth();
  const { addToast } = useToast();

  const [verifyCode, setVerifyCode] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(twoFactorConfig.secret);
    setCopiedKey(true);
    addToast({
      title: 'Secret Copied',
      description: 'TOTP Secret Key copied to clipboard.',
      type: 'info',
    });
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(twoFactorConfig.backupCodes.join('\n'));
    setCopiedCodes(true);
    addToast({
      title: 'Backup Codes Copied',
      description: 'Emergency backup codes copied to clipboard.',
      type: 'info',
    });
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyCode.length !== 6) return;

    const ok = await verifyTwoFactor(verifyCode);
    if (ok && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {locale === 'bn' ? 'দ্বি-স্তরীয় নিরাপত্তা (2FA)' : 'Two-Factor Authentication (2FA)'}
              </h2>
              <p className="text-xs text-slate-500">
                {locale === 'bn'
                  ? 'গুগল বা মাইক্রোসফ্ট অথেনটিকেটর অ্যাপ দিয়ে আপনার অ্যাকাউন্ট সুরক্ষিত রাখুন।'
                  : 'Add an extra layer of defense with TOTP authentication apps.'}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => toggleTwoFactor(!twoFactorConfig.isEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              twoFactorConfig.isEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                twoFactorConfig.isEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Step-by-Step Configuration if Enabled */}
        <div className="space-y-6 pt-5">
          {/* Step 1: Scan QR Code */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="bg-white p-2 rounded-xl shadow-xs shrink-0">
              <img
                src={twoFactorConfig.qrCodeUrl}
                alt="2FA QR Code"
                className="w-32 h-32"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Step 1: Scan with Authenticator App
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Open <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong>, or <strong>Authy</strong> on your phone and scan this QR code.
              </p>

              {/* Secret Key with Copy Button */}
              <div className="pt-1">
                <span className="text-[11px] text-slate-400 block mb-0.5">Or enter manual key:</span>
                <div className="inline-flex items-center gap-2 py-1 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>{twoFactorConfig.secret}</span>
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className="text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Test & Verify 6-digit Code */}
          <form onSubmit={handleVerify} className="space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Step 2: Enter 6-Digit Code from App
            </label>
            <OTPInput
              value={verifyCode}
              onChange={setVerifyCode}
              countdown={0}
              canResend={false}
              onResend={() => {}}
              locale={locale}
              simulatedCode="123456"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || verifyCode.length !== 6}
                className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Verify & Save</span>
              </button>
            </div>
          </form>

          {/* Step 3: Emergency Backup Codes */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  Emergency Backup Codes
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyBackupCodes}
                className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-400 hover:underline"
              >
                {copiedCodes ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCodes ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>

            <p className="text-[11px] text-amber-800 dark:text-amber-400 leading-relaxed">
              If you lose access to your phone or authenticator app, each of these backup codes can be used once to access your account:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs text-slate-900 dark:text-white font-semibold">
              {twoFactorConfig.backupCodes.map((code, idx) => (
                <div
                  key={idx}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-center"
                >
                  {code}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
