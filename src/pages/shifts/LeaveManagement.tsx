import React, { useState } from 'react';
import { useLeaves } from '../../hooks/useLeaves';
import { Leave, LeaveType } from '../../types/shifts';
import { MOCK_SHIFT_TECHNICIANS } from '../../data/mockShiftData';
import { BangladeshHolidays } from '../../components/shifts/BangladeshHolidays';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  UserCheck,
  ShieldAlert,
  Sparkles,
  FileText,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const LeaveManagement: React.FC = () => {
  const { leaves, requestLeave, approveLeave, rejectLeave, leaveBalances } = useLeaves();

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [rejectingLeaveId, setRejectingLeaveId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Form State
  const [techId, setTechId] = useState(MOCK_SHIFT_TECHNICIANS[0].id);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveType, setLeaveType] = useState<LeaveType>('casual');
  const [reason, setReason] = useState('');

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const tech = MOCK_SHIFT_TECHNICIANS.find((t) => t.id === techId);
    if (!tech) return;

    await requestLeave({
      technicianId: tech.id,
      technicianName: tech.name,
      technicianAvatar: tech.avatar,
      startDate,
      endDate,
      type: leaveType,
      reason,
    });

    setIsRequestModalOpen(false);
    setReason('');
  };

  const handleConfirmReject = async () => {
    if (!rejectingLeaveId) return;
    await rejectLeave(rejectingLeaveId, rejectionReason);
    setRejectingLeaveId(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-base">
            🌴
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Technician Leave Management & BD Holidays</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Leave authorization, casual/sick quota balances & public holiday calendars
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsRequestModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
        >
          <Plus className="w-4 h-4 mr-1" /> Request Technician Leave
        </Button>
      </div>

      {/* Leave Balances Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-amber-500" />
          Technician Annual Leave Balances (2025 Quota)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {MOCK_SHIFT_TECHNICIANS.map((tech) => {
            const bal = leaveBalances[tech.id];
            if (!bal) return null;

            return (
              <div
                key={tech.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs"
              >
                <div className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  <span>{tech.name}</span>
                  <span className="font-mono text-[10px] text-slate-400">{tech.avatar}</span>
                </div>

                <div className="space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Casual Leave:</span>
                    <strong className="text-slate-900 dark:text-slate-100">
                      {bal.casualRemaining} / {bal.casualTotal}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Sick Leave:</span>
                    <strong className="text-slate-900 dark:text-slate-100">
                      {bal.sickRemaining} / {bal.sickTotal}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Earned Annual:</span>
                    <strong className="text-amber-600 dark:text-amber-400">
                      {bal.annualRemaining} / {bal.annualTotal}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Clock className="w-4 h-4 text-amber-500" />
          Pending & Approved Leave Requests
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Technician</th>
                <th className="py-2.5 px-3">Leave Type</th>
                <th className="py-2.5 px-3">Dates</th>
                <th className="py-2.5 px-3">Reason</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaves.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">
                    {l.technicianName}
                  </td>
                  <td className="py-3 px-3">
                    <span className="uppercase text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-700 dark:text-slate-300 font-mono">
                      {l.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {l.startDate} to {l.endDate}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {l.reason}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                        l.status === 'approved'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200'
                          : l.status === 'rejected'
                          ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200'
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {l.status === 'pending' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="xs"
                          variant="primary"
                          onClick={() => approveLeave(l.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => setRejectingLeaveId(l.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono italic">
                        {l.approvedBy ? `Approved by ${l.approvedBy}` : 'Processed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bangladesh Public Holidays Widget */}
      <BangladeshHolidays />

      {/* Request Leave Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Submit Leave Request
            </h3>

            <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Technician
                </label>
                <select
                  value={techId}
                  onChange={(e) => setTechId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100"
                >
                  {MOCK_SHIFT_TECHNICIANS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Leave Type
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100"
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="annual">Earned Annual Leave</option>
                  <option value="emergency">Emergency Family Leave</option>
                  <option value="ramadan_special">Ramadan / Umrah Leave</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reason / Description
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for absence..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <Button size="xs" variant="outline" onClick={() => setIsRequestModalOpen(false)}>
                  Cancel
                </Button>
                <Button size="xs" variant="primary" type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingLeaveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              Reject Leave Request
            </h3>
            <textarea
              rows={2}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="State reason for operational rejection..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100"
            />
            <div className="flex justify-end space-x-2 text-xs">
              <Button size="xs" variant="outline" onClick={() => setRejectingLeaveId(null)}>
                Cancel
              </Button>
              <Button size="xs" variant="primary" onClick={handleConfirmReject} className="bg-red-600 hover:bg-red-700 text-white font-bold">
                Confirm Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
