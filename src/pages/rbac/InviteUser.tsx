import React, { useState } from 'react';
import { UserRole, InviteUserData, StandardPermissionKey } from '../../types/rbac';
import { RoleSelector } from '../../components/rbac/RoleSelector';
import { PERMISSIONS, ROLE_PERMISSIONS } from '../../utils/permissions';
import { useToast } from '../../context/ToastContext';
import {
  UserPlus,
  Mail,
  Phone,
  User,
  MapPin,
  ShieldCheck,
  Send,
  X,
  Loader2,
  Check,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

export interface InviteUserProps {
  isOpen?: boolean;
  onClose?: () => void;
  onInvite?: (data: InviteUserData) => Promise<boolean>;
  locale?: 'en' | 'bn';
}

export const InviteUserModal: React.FC<InviteUserProps> = ({
  isOpen = true,
  onClose,
  onInvite,
  locale = 'en',
}) => {
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('technician');
  const [division, setDivision] = useState('Dhaka');
  const [sendSMS, setSendSMS] = useState(true);
  const [showAdvancedPerms, setShowAdvancedPerms] = useState(false);
  const [customPerms, setCustomPerms] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleTogglePerm = (permKey: string) => {
    if (customPerms.includes(permKey)) {
      setCustomPerms(customPerms.filter((p) => p !== permKey));
    } else {
      setCustomPerms([...customPerms, permKey]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim()) {
      addToast({
        title: 'Missing Required Fields',
        description: 'Please provide employee name, corporate email, and phone number.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    const payload: InviteUserData = {
      name,
      email,
      phone,
      role,
      division,
      customPermissions: customPerms,
      sendSMS,
    };

    if (onInvite) {
      const ok = await onInvite(payload);
      setIsSubmitting(false);
      if (ok && onClose) {
        onClose();
      }
    } else {
      setIsSubmitting(false);
      addToast({
        title: 'User Invitation Dispatched',
        description: `Credentials invitation sent to ${email}`,
        type: 'success',
      });
      if (onClose) onClose();
    }
  };

  const allPermKeys = Object.keys(PERMISSIONS) as StandardPermissionKey[];
  const baseRolePerms = ROLE_PERMISSIONS[role] || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-xl shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {locale === 'bn' ? 'নতুন ব্যবহারকারী আমন্ত্রণ জানান' : 'Invite Team Member'}
              </h3>
              <p className="text-xs text-slate-500">
                Send onboarding credentials and assign operational role permissions.
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tanvir Hossain"
                className="w-full py-2.5 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Official Work Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@fieldops.com.bd"
                  className="w-full py-2.5 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Mobile Number (SMS Gateway) *
              </label>
              <div className="relative flex">
                <span className="inline-flex items-center px-2.5 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono font-medium">
                  +88
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01712345678"
                  className="w-full py-2.5 px-3 rounded-r-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Role & Division */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Enterprise Role *
              </label>
              <RoleSelector
                value={role}
                onChange={setRole}
                locale={locale}
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Regional Division (Bangladesh)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full py-2.5 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="Dhaka">Dhaka (ঢাকা)</option>
                  <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                  <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                  <option value="Khulna">Khulna (খুলনা)</option>
                  <option value="Sylhet">Sylhet (সিলেট)</option>
                  <option value="Barisal">Barisal (বরিশাল)</option>
                  <option value="Rangpur">Rangpur (রংপুর)</option>
                  <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SMS Notification Checkbox */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  Send SMS Notification via Greenweb BD
                </span>
                <p className="text-[11px] text-slate-500">
                  Sends instant OTP activation link directly to the technician's mobile phone.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={sendSMS}
              onChange={(e) => setSendSMS(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          {/* Custom Permission Overrides Accordion */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-3 space-y-2">
            <button
              type="button"
              onClick={() => setShowAdvancedPerms(!showAdvancedPerms)}
              className="w-full flex items-center justify-between text-left font-semibold text-slate-800 dark:text-slate-200"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Custom Permission Overrides ({customPerms.length} selected)</span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                {showAdvancedPerms ? 'Hide' : 'Configure'}
              </span>
            </button>

            {showAdvancedPerms && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 max-h-48 overflow-y-auto space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800">
                {allPermKeys.map((permKey) => {
                  const meta = PERMISSIONS[permKey];
                  const isInherited = baseRolePerms.includes(permKey);
                  const isChecked = isInherited || customPerms.includes(permKey);

                  return (
                    <label
                      key={permKey}
                      className={`flex items-start gap-2.5 py-1.5 px-2 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                        isInherited ? 'opacity-80' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isInherited}
                        onChange={() => handleTogglePerm(permKey)}
                        className="mt-0.5 w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {meta.label}
                          </span>
                          {isInherited && (
                            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                              Role Default
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">{permKey}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Dispatch Invitation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
