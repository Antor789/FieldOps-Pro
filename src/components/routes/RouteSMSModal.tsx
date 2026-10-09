import React, { useState } from 'react';
import { Route } from '../../types/routes';
import { X, Send, Share2, Copy, CheckCircle2, MessageSquare, Phone, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';

interface RouteSMSModalProps {
  route: Route;
  isOpen: boolean;
  onClose: () => void;
  onSendSms: (phone: string, text: string) => void;
  onSendWhatsapp: (text: string) => void;
}

export const RouteSMSModal: React.FC<RouteSMSModalProps> = ({
  route,
  isOpen,
  onClose,
  onSendSms,
  onSendWhatsapp,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(route.technicianPhone || '+880 1711-204912');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `https://fieldopspro.bd/route/${route.id.slice(-6)}`;
  const defaultSmsText = `[FieldOps Pro] Hi ${route.technicianName}, your optimized Dhaka route for today (${route.stops.length} jobs, ${route.totalDistanceKm}km) is ready. View map & turn-by-turn sequence: ${shareUrl}`;

  const [messageText, setMessageText] = useState(defaultSmsText);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSmsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendSms(phoneNumber, messageText);
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
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Share Optimized Route with {route.technicianName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dispatch turn-by-turn sequence via Greenweb SMS or WhatsApp
            </p>
          </div>
        </div>

        {/* Shareable Link Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-mono">
          <span className="truncate text-slate-700 dark:text-slate-300 font-bold mr-2">
            {shareUrl}
          </span>
          <Button
            size="xs"
            variant="outline"
            onClick={handleCopyLink}
            className="shrink-0 font-bold"
          >
            {copied ? (
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Copied!
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Copy className="w-3.5 h-3.5" /> Copy Link
              </span>
            )}
          </Button>
        </div>

        <form onSubmit={handleSmsSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Technician Phone Number (Greenweb SMS Gateway)
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              SMS Message Text
            </label>
            <textarea
              rows={3}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 font-mono text-slate-900 dark:text-slate-100 text-xs"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSendWhatsapp(messageText)}
              className="w-full sm:w-auto bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 font-bold"
            >
              <MessageSquare className="w-4 h-4 mr-1.5" /> Send via WhatsApp
            </Button>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
              >
                <Send className="w-4 h-4 mr-1.5" /> Dispatch Greenweb SMS
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
