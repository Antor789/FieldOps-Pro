import { useState, useCallback } from 'react';
import { Leave, LeaveBalance, LeaveType } from '../types/shifts';
import { INITIAL_LEAVES, MOCK_LEAVE_BALANCES } from '../data/mockShiftData';

export function useLeaves() {
  const [leaves, setLeaves] = useState<Leave[]>(INITIAL_LEAVES);
  const [leaveBalances, setLeaveBalances] = useState<Record<string, LeaveBalance>>(MOCK_LEAVE_BALANCES);

  const requestLeave = useCallback(async (data: Omit<Leave, 'id' | 'status' | 'requestedAt'>): Promise<Leave> => {
    const newLeave: Leave = {
      ...data,
      id: `lv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };
    setLeaves((prev) => [newLeave, ...prev]);
    return newLeave;
  }, []);

  const approveLeave = useCallback(async (id: string, approvedBy = 'Operations Lead'): Promise<Leave> => {
    let updated: Leave | null = null;
    setLeaves((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          updated = { ...l, status: 'approved', approvedBy };
          return updated;
        }
        return l;
      })
    );

    if (updated) {
      // Deduct from leave balance
      const leave = updated as Leave;
      setLeaveBalances((prev) => {
        const bal = prev[leave.technicianId];
        if (!bal) return prev;

        const updatedBal = { ...bal };
        if (leave.type === 'casual') {
          updatedBal.casualRemaining = Math.max(0, updatedBal.casualRemaining - 1);
        } else if (leave.type === 'sick') {
          updatedBal.sickRemaining = Math.max(0, updatedBal.sickRemaining - 1);
        } else if (leave.type === 'annual') {
          updatedBal.annualRemaining = Math.max(0, updatedBal.annualRemaining - 1);
        }

        return { ...prev, [leave.technicianId]: updatedBal };
      });
      return updated;
    }
    throw new Error(`Leave ${id} not found`);
  }, []);

  const rejectLeave = useCallback(async (id: string, reason?: string): Promise<Leave> => {
    let updated: Leave | null = null;
    setLeaves((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          updated = { ...l, status: 'rejected', rejectionReason: reason || 'Operation constraint' };
          return updated;
        }
        return l;
      })
    );
    if (updated) return updated;
    throw new Error(`Leave ${id} not found`);
  }, []);

  return {
    leaves,
    requestLeave,
    approveLeave,
    rejectLeave,
    leaveBalances,
  };
}
