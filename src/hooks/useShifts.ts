import { useState, useCallback, useMemo } from 'react';
import { Shift, ShiftType, TechnicianAvailability, AvailabilityStatus } from '../types/shifts';
import { INITIAL_SHIFTS, MOCK_SHIFT_TECHNICIANS, PREDEFINED_TEMPLATES } from '../data/mockShiftData';

export function useShifts() {
  const [shifts, setShifts] = useState<Shift[]>(INITIAL_SHIFTS);

  // Helper to get week dates from a start date
  const getWeekDates = useCallback((startDate: Date | string): string[] => {
    const d = new Date(startDate);
    // Align to Sunday
    const day = d.getDay();
    const diff = d.getDate() - day;
    const sunday = new Date(d.setDate(diff));

    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const cur = new Date(sunday);
      cur.setDate(sunday.getDate() + i);
      dates.push(cur.toISOString().split('T')[0]);
    }
    return dates;
  }, []);

  const createShift = useCallback(async (data: Omit<Shift, 'id'>): Promise<Shift> => {
    const newShift: Shift = {
      ...data,
      id: `s-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    setShifts((prev) => [...prev, newShift]);
    return newShift;
  }, []);

  const updateShift = useCallback(async (id: string, data: Partial<Shift>): Promise<Shift> => {
    let updated: Shift | null = null;
    setShifts((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          updated = { ...s, ...data };
          return updated;
        }
        return s;
      })
    );
    if (!updated) {
      throw new Error(`Shift ${id} not found`);
    }
    return updated;
  }, []);

  const deleteShift = useCallback(async (id: string): Promise<void> => {
    setShifts((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getShiftsForWeek = useCallback(
    (startDate: Date | string): Shift[] => {
      const weekDates = getWeekDates(startDate);
      const weekSet = new Set(weekDates);
      return shifts.filter((s) => weekSet.has(s.date));
    },
    [shifts, getWeekDates]
  );

  const copyPreviousWeek = useCallback(
    async (targetWeekStart: Date | string): Promise<void> => {
      const targetWeekDates = getWeekDates(targetWeekStart);
      const prevWeekStart = new Date(targetWeekStart);
      prevWeekStart.setDate(prevWeekStart.getDate() - 7);
      const prevWeekDates = getWeekDates(prevWeekStart);

      const prevShifts = shifts.filter((s) => prevWeekDates.includes(s.date));

      const newCopiedShifts: Shift[] = [];
      prevShifts.forEach((s) => {
        const dayIdx = prevWeekDates.indexOf(s.date);
        if (dayIdx >= 0 && dayIdx < targetWeekDates.length) {
          newCopiedShifts.push({
            ...s,
            id: `s-copy-${Date.now()}-${Math.random()}`,
            date: targetWeekDates[dayIdx],
          });
        }
      });

      // Remove existing shifts in target week & append copied
      const targetSet = new Set(targetWeekDates);
      setShifts((prev) => [...prev.filter((s) => !targetSet.has(s.date)), ...newCopiedShifts]);
    },
    [shifts, getWeekDates]
  );

  const applyTemplate = useCallback(
    async (templateId: string, weekStart: Date | string): Promise<void> => {
      const weekDates = getWeekDates(weekStart);
      const template = PREDEFINED_TEMPLATES.find((t) => t.id === templateId);
      if (!template) return;

      const newShifts: Shift[] = [];
      template.shifts.forEach((item) => {
        const tech = MOCK_SHIFT_TECHNICIANS.find((t) => t.id === item.technicianId);
        const targetDate = weekDates[item.dayOfWeek];
        if (tech && targetDate) {
          newShifts.push({
            id: `s-tpl-${Date.now()}-${Math.random()}`,
            technicianId: tech.id,
            technicianName: tech.name,
            technicianRole: tech.role,
            date: targetDate,
            shiftType: item.shiftType,
            startTime: item.startTime,
            endTime: item.endTime,
            zone: item.zone || 'Dhaka Metro',
            isOvertime: false,
            createdBy: 'Template Engine',
          });
        }
      });

      const weekSet = new Set(weekDates);
      setShifts((prev) => [...prev.filter((s) => !weekSet.has(s.date)), ...newShifts]);
    },
    [getWeekDates]
  );

  const getTechnicianAvailability = useCallback(
    (date: Date | string): TechnicianAvailability[] => {
      const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];

      return MOCK_SHIFT_TECHNICIANS.map((tech) => {
        const shift = shifts.find((s) => s.technicianId === tech.id && s.date === dateStr);

        let status: AvailabilityStatus = 'available';
        if (!shift || shift.shiftType === 'off') {
          status = 'off';
        } else if (shift.isOvertime) {
          status = 'overtime';
        } else if (shift.notes?.toLowerCase().includes('job') || shift.notes?.toLowerCase().includes('ac') || shift.notes?.toLowerCase().includes('fiber')) {
          status = 'on_job';
        }

        return {
          technicianId: tech.id,
          technicianName: tech.name,
          technicianAvatar: tech.avatar,
          date: dateStr,
          status,
          shift,
          zone: shift?.zone || 'Unassigned',
          phone: tech.phone,
          currentJobTitle: status === 'on_job' ? shift?.notes : undefined,
        };
      });
    },
    [shifts]
  );

  return {
    shifts,
    createShift,
    updateShift,
    deleteShift,
    getShiftsForWeek,
    copyPreviousWeek,
    applyTemplate,
    getTechnicianAvailability,
    getWeekDates,
  };
}
