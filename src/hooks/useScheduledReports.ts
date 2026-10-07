import { useState, useCallback } from 'react';
import { ScheduledReport, DeliveryLog } from '../types/reports';
import { INITIAL_SCHEDULED_REPORTS, INITIAL_DELIVERY_LOGS } from '../data/reportTemplates';
import { useToast } from '../context/ToastContext';

export function useScheduledReports() {
  const { addToast } = useToast();
  const [schedules, setSchedules] = useState<ScheduledReport[]>(INITIAL_SCHEDULED_REPORTS);
  const [deliveryLogs, setDeliveryLogs] = useState<DeliveryLog[]>(INITIAL_DELIVERY_LOGS);

  // Toggle pause / resume
  const togglePause = useCallback(
    (id: string) => {
      setSchedules((prev) =>
        prev.map((s) => {
          if (s.id === id) {
            const nextActive = !s.isActive;
            addToast({
              title: nextActive ? 'Schedule Resumed' : 'Schedule Paused',
              description: `Report "${s.templateName}" has been ${nextActive ? 'activated' : 'paused'}.`,
              type: 'info',
            });
            return {
              ...s,
              isActive: nextActive,
              nextRunAt: nextActive ? (s.frequency === 'daily' ? 'Tomorrow, 09:00 AM' : 'Next Cycle') : 'Paused',
            };
          }
          return s;
        })
      );
    },
    [addToast]
  );

  // Create new schedule
  const createSchedule = useCallback(
    (newSchedule: Omit<ScheduledReport, 'id' | 'createdAt' | 'lastStatus'>) => {
      const scheduleId = `sched-${Date.now().toString(36)}`;
      const created: ScheduledReport = {
        ...newSchedule,
        id: scheduleId,
        createdAt: new Date().toISOString(),
        lastStatus: 'success',
      };

      setSchedules((prev) => [created, ...prev]);

      // Add a simulated delivery log entry
      const logEntry: DeliveryLog = {
        id: `log-${Date.now().toString(36)}`,
        reportName: created.templateName,
        deliveredAt: 'Scheduled (Next Cycle)',
        recipientsCount: created.recipients.length,
        recipientsSummary: created.recipients[0]?.email + (created.recipients.length > 1 ? ` (+${created.recipients.length - 1})` : ''),
        format: created.format,
        status: 'Delivered',
      };
      setDeliveryLogs((prev) => [logEntry, ...prev]);

      addToast({
        title: 'Report Scheduled',
        description: `Automated ${created.frequency} dispatch configured for ${created.recipients.length} recipients.`,
        type: 'success',
      });
    },
    [addToast]
  );

  // Delete schedule
  const deleteSchedule = useCallback(
    (id: string) => {
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      addToast({
        title: 'Schedule Removed',
        description: 'The scheduled automated report job was canceled.',
        type: 'info',
      });
    },
    [addToast]
  );

  // Manually trigger immediate delivery test
  const triggerImmediateRun = useCallback(
    (schedule: ScheduledReport) => {
      const logEntry: DeliveryLog = {
        id: `log-now-${Date.now().toString(36)}`,
        reportName: schedule.templateName,
        deliveredAt: 'Just now (' + new Date().toLocaleTimeString() + ')',
        recipientsCount: schedule.recipients.length,
        recipientsSummary: schedule.recipients.map((r) => r.email).join(', '),
        format: schedule.format,
        status: 'Delivered',
      };

      setDeliveryLogs((prev) => [logEntry, ...prev]);
      addToast({
        title: 'Test Email Dispatched',
        description: `Dispatched ${schedule.format.toUpperCase()} report to ${schedule.recipients.length} recipient(s).`,
        type: 'success',
      });
    },
    [addToast]
  );

  return {
    schedules,
    deliveryLogs,
    createSchedule,
    deleteSchedule,
    togglePause,
    triggerImmediateRun,
  };
}
