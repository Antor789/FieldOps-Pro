import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Volume2, VolumeX, Moon, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export interface NotificationPreferencesProps {
  locale?: 'en' | 'bn';
}

export function NotificationPreferences({ locale = 'en' }: NotificationPreferencesProps) {
  const { preferences, updatePreferences, playSound, requestPermission, permission } = useNotifications();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 max-w-2xl mx-auto shadow-xs">
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <span>⚙️</span>
          <span>{locale === 'bn' ? 'নোটিফিকেশন ও অ্যালার্ট সেটিংস' : 'Notification Preferences'}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {locale === 'bn'
            ? 'ব্রাউজার পুশ, ইন-অ্যাপ অ্যালার্ট, অডিও সাউন্ড ও শান্ত সময়সূচি কাস্টমাইজ করুন।'
            : 'Configure push alerts, in-app notifications, synthesized audio chimes, and quiet hours.'}
        </p>
      </div>

      {/* 1. Channels */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          {locale === 'bn' ? 'ডেলিভারি চ্যানেল' : 'Delivery Channels'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                {locale === 'bn' ? 'ব্রাউজার পুশ অ্যালার্ট' : 'Browser Push Alerts'}
              </div>
              <div className="text-[11px] text-slate-500">
                {permission === 'granted' ? 'Active / Granted' : 'Requires OS Permission'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.channels.push}
              onChange={(e) => {
                const checked = e.target.checked;
                if (checked && permission !== 'granted') {
                  requestPermission();
                }
                updatePreferences((prev) => ({
                  ...prev,
                  channels: { ...prev.channels, push: checked },
                }));
              }}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                {locale === 'bn' ? 'ইন-অ্যাপ টোস্ট নোটিফিকেশন' : 'In-App Toast Alerts'}
              </div>
              <div className="text-[11px] text-slate-500">
                {locale === 'bn' ? 'স্ক্রিনের নিচে ভাসমান কার্ড' : 'Floating bottom banners'}
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.channels.inApp}
              onChange={(e) =>
                updatePreferences((prev) => ({
                  ...prev,
                  channels: { ...prev.channels, inApp: e.target.checked },
                }))
              }
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </div>
      </div>

      {/* 2. Notification Types */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          {locale === 'bn' ? 'ইভেন্ট ক্যাটাগরি' : 'Triggered Event Categories'}
        </h3>
        <div className="space-y-2">
          {[
            { key: 'slaAlerts', title: '🚨 SLA Breach Warnings', desc: 'Emergency and critical work orders nearing expiration' },
            { key: 'jobUpdates', title: '📋 Dispatch & Order Status', desc: 'Auto-assignments, status advancement and route tracking' },
            { key: 'paymentNotifications', title: '💰 bKash & Nagad Invoicing', desc: 'Successful MFS checkout and NBR tax receipt confirmations' },
            { key: 'technicianUpdates', title: '📍 Fleet Geofence Arrivals', desc: 'Technician check-in and GPS geofence radar notifications' },
          ].map((item) => (
            <label
              key={item.key}
              className="p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer"
            >
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{item.title}</div>
                <div className="text-[11px] text-slate-500">{item.desc}</div>
              </div>
              <input
                type="checkbox"
                checked={(preferences.types as any)[item.key]}
                onChange={(e) =>
                  updatePreferences((prev) => ({
                    ...prev,
                    types: { ...prev.types, [item.key]: e.target.checked },
                  }))
                }
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* 3. Audio & Sound Settings */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          {locale === 'bn' ? 'অডিও ও সাউন্ড এফেক্ট' : 'Synthesized Audio Chimes'}
        </h3>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                {locale === 'bn' ? 'শব্দ সক্রিয় রাখুন' : 'Enable Notification Audio'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={preferences.sound.enabled}
              onChange={(e) =>
                updatePreferences((prev) => ({
                  ...prev,
                  sound: { ...prev.sound, enabled: e.target.checked },
                }))
              }
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>Volume</span>
              <span>{preferences.sound.volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={preferences.sound.volume}
              onChange={(e) =>
                updatePreferences((prev) => ({
                  ...prev,
                  sound: { ...prev.sound, volume: Number(e.target.value) },
                }))
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">Audio Preview:</span>
            <button
              onClick={() => playSound('default')}
              className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-medium hover:bg-slate-100"
            >
              Glass Chime
            </button>
            <button
              onClick={() => playSound('urgent')}
              className="px-2.5 py-1 text-xs rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 font-medium"
            >
              Urgent SLA
            </button>
            <button
              onClick={() => playSound('success')}
              className="px-2.5 py-1 text-xs rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 font-medium"
            >
              Payment Chord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
